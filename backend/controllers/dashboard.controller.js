// backend/controllers/dashboard.controller.js

const { db } = require("../config/db.config");

// Utility function to safely parse integers
const parseInteger = (value) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};

// Fetch dashboard data
exports.fetchDashboardData = (req, res) => {
  const { clientId, city, companyName } = req.query;

  // Initialize filter conditions and parameters
  const conditions = [];
  const params = [];

  if (clientId) {
    conditions.push("clients.id = ?");
    params.push(clientId);
  }

  if (city) {
    conditions.push("clients.city LIKE ?");
    params.push(`%${city}%`);
  }

  if (companyName) {
    conditions.push("clients.name LIKE ?");
    params.push(`%${companyName}%`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Query to get summary statistics
  const summaryQuery = `
    SELECT 
      COUNT(users.id) AS totalUsers,
      SUM(users.reports_taken) AS samplesCollected,
      COUNT(users.id) - SUM(users.reports_taken) AS samplesPending
    FROM users
    JOIN clients ON users.client_id = clients.id
    ${whereClause}
  `;

  // Query to get samples overview by client for Bar Chart
  const barChartQuery = `
    SELECT 
      clients.id AS clientId,
      clients.name AS clientName,
      COUNT(users.id) AS totalUsers,
      SUM(users.reports_taken) AS samplesCollected,
      COUNT(users.id) - SUM(users.reports_taken) AS samplesPending
    FROM users
    JOIN clients ON users.client_id = clients.id
    ${whereClause}
    GROUP BY clients.id, clients.name
  `;

  // Query to get samples distribution for Pie Chart
  const pieChartQuery = `
    SELECT 
      clients.name AS clientName,
      SUM(users.reports_taken) AS samplesCollected
    FROM users
    JOIN clients ON users.client_id = clients.id
    ${whereClause}
    GROUP BY clients.name
  `;

  // Execute summary query
  db.query(summaryQuery, params, (summaryErr, summaryResults) => {
    if (summaryErr) {
      console.error("Error fetching dashboard summary:", summaryErr);
      return res
        .status(500)
        .json({ message: "Server Error", error: summaryErr.message });
    }

    const summary = summaryResults[0] || {
      totalUsers: 0,
      samplesCollected: 0,
      samplesPending: 0,
    };

    // Execute bar chart query
    db.query(barChartQuery, params, (barErr, barResults) => {
      if (barErr) {
        console.error("Error fetching bar chart data:", barErr);
        return res
          .status(500)
          .json({ message: "Server Error", error: barErr.message });
      }

      // Execute pie chart query
      db.query(pieChartQuery, params, (pieErr, pieResults) => {
        if (pieErr) {
          console.error("Error fetching pie chart data:", pieErr);
          return res
            .status(500)
            .json({ message: "Server Error", error: pieErr.message });
        }

        res.json({
          summary: {
            totalUsers: parseInteger(summary.totalUsers),
            samplesCollected: parseInteger(summary.samplesCollected),
            samplesPending: parseInteger(summary.samplesPending),
          },
          barChartData: barResults.map((row) => ({
            clientId: row.clientId,
            clientName: row.clientName,
            collected: parseInteger(row.samplesCollected),
            pending: parseInteger(row.samplesPending),
          })),
          pieChartData: pieResults.map((row) => ({
            name: row.clientName,
            value: parseInteger(row.samplesCollected),
          })),
        });
      });
    });
  });
};
