// src/utils/Utils.js

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const stringifyCommunicationChannels = (channels) => {
  if (!channels || !Array.isArray(channels)) return "";
  return channels.join(", ");
};

/**
 * Downloads data as an Excel file (single sheet).
 * @param {Array} data - An array of objects representing rows in the sheet.
 * @param {string} filename - The desired filename for the downloaded Excel file.
 * @param {string} sheetName - The desired sheet name for the Excel file.
 */
export const downloadExcel = (data, fileName, sheetName = "Sheet1") => {
  const worksheet = XLSX.utils.json_to_sheet(data); // Create worksheet from the data
  const workbook = XLSX.utils.book_new(); // Create a new workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // Add the worksheet to the workbook

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(dataBlob, fileName); // Save the file
};
