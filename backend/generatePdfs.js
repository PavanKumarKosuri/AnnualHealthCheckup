const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, 'backend', 'reports');

// Create reports directory if it doesn't exist
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Create a sample PDF document
const doc = new PDFDocument();
const filePath = path.join(reportsDir, 'pavan.pdf');

doc.pipe(fs.createWriteStream(filePath));
doc.text('This is a sample PDF file for testing purposes.');
doc.end();
