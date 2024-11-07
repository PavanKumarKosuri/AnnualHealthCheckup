// backend\controllers\report.controller.js
const path = require("path");
const fs = require("fs");

const getReports = (req, res) => {
  const reports = [
    { id: 1, title: "Pavan", date: "2024-08-01", url: "/reports/Pavan.pdf" },
    { id: 2, title: "Kumar", date: "2024-07-15", url: "/reports/Kumar.pdf" },
    { id: 3, title: "Kosuri", date: "2024-06-30", url: "/reports/Kosuri.pdf" },
  ];
  res.json(reports);
};

const downloadReport = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../reports", filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("File not found");
  }
};

module.exports = {
  getReports,
  downloadReport,
};
