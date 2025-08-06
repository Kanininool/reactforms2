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

    // Add dropdowns with strict validation
    jsonData.forEach((col, index) => {
      if (col.data) {
        for (let row = 2; row <= 101; row++) {
          worksheet.getCell(row, index + 1).dataValidation = {
            type: "list",
            allowBlank: false,
            formulae: [`"${col.data.join(",")}"`],
            showDropDown: true,
            errorStyle: "stop",
            showErrorMessage: true,
            errorTitle: "Invalid Input",
            error: `Please select a value from the dropdown list for "${col.column}".`
          };
        }
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "strict_dropdown_excel.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Strict Dropdown Excel Generator</h2>
      <button onClick={generateExcel}>Generate Excel</button>
    </div>
  );
}

export default App;
