// src/App.js
import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const jsonData = [
  { column: "Name" },
  { column: "Skills", data: ["Node", "React", "Python", "Perl"] },
  { column: "Department", data: ["Engineering", "HR", "Finance"] }
];

function App() {
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add headers
    const headers = jsonData.map(col => col.column);
    worksheet.addRow(headers);

    // Add empty rows for data entry
    for (let i = 0; i < 100; i++) {
      worksheet.addRow([]);
    }

    // Add dropdowns
    jsonData.forEach((col, index) => {
      if (col.data) {
        for (let row = 2; row <= 101; row++) {
          worksheet.getCell(row, index + 1).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`"${col.data.join(",")}"`],
            showDropDown: true
          };
        }
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "dropdown_excel.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Excel Generator with Dropdowns</h2>
      <button onClick={generateExcel}>Generate Excel</button>
    </div>
  );
}

export default App;
