const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");
const { SendMailClient } = require("zeptomail");
const db = require("../config/db.config"); // Assuming you're using Sequelize or similar ORM

// ZeptoMail setup
const mailClient = new SendMailClient({
  url: "api.zeptomail.in/",
  token: process.env.ZEPTO_MAIL_TOKEN, // Ensure you have this in your .env file
});

exports.uploadZipFile = async (req, res) => {
  try {
    if (!req.files || !req.files.zipFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const zipFile = req.files.zipFile;
    const zip = new JSZip();
    const content = await zip.loadAsync(zipFile.data);
    const reportDir = path.join(__dirname, "../reports");

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }

    content.forEach(async (relativePath, file) => {
      if (file.name.endsWith(".pdf")) {
        const employeeId = file.name.replace(".pdf", "");
        const pdfData = await file.async("nodebuffer");
        const filePath = path.join(reportDir, file.name);

        fs.writeFileSync(filePath, pdfData);

        // Save to database or update employee record (Assuming you have a model `Employee`)
        const employee = await db.Employee.findOne({
          where: { id: employeeId },
        });
        if (employee) {
          employee.reportPath = filePath;
          await employee.save();
        }
      }
    });

    res
      .status(200)
      .json({ message: "ZIP file uploaded and processed successfully" });
  } catch (error) {
    console.error("Error uploading zip file:", error);
    res.status(500).json({ error: "Failed to upload and process zip file" });
  }
};

exports.processReports = async (req, res) => {
  try {
    const employees = await db.Employee.findAll({
      where: { reportPath: { [db.Sequelize.Op.ne]: null } },
    });

    for (const employee of employees) {
      const mailOptions = {
        from: {
          address: "noreply@yourdomain.com",
          name: "Your Company",
        },
        to: [
          {
            email_address: {
              address: employee.email,
              name: employee.name,
            },
          },
        ],
        subject: "Your Medical Report",
        htmlbody: `<div><b>Dear ${employee.name},</b><br><br>Please find your medical report attached.</div>`,
        attachments: [
          {
            content: fs.readFileSync(employee.reportPath).toString("base64"),
            filename: path.basename(employee.reportPath),
            disposition: "attachment",
          },
        ],
      };

      try {
        await mailClient.sendMail(mailOptions);
        employee.reportSent = true;
        await employee.save();
      } catch (mailError) {
        console.error(`Failed to send report to ${employee.email}:`, mailError);
      }
    }

    res.status(200).json({ message: "Reports processed and emails sent" });
  } catch (error) {
    console.error("Error processing reports:", error);
    res.status(500).json({ error: "Failed to process reports" });
  }
};
