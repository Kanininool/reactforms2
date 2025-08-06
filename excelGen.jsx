import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const jsonData = [
  { column: "Name" },
  { column: "Skills", data: ["Node", "React", "Python", "Perl"] },
  { column: "Department", data: ["Engineering", "HR", "Finance"] }
];

function App() {
  const generateExcel = () => {
    const headers = jsonData.map(col => col.column);
    const ws = XLSX.utils.aoa_to_sheet([headers]);

    // Add empty rows for data entry
    for (let i = 0; i < 100; i++) {
      const row = [];
      for (let j = 0; j < headers.length; j++) {
        row.push("");
      }
      XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
    }

    // Add dropdowns using data validation
    ws["!dataValidation"] = jsonData
      .map((col, index) => {
        if (col.data) {
          const colLetter = XLSX.utils.encode_col(index);
          return {
            sqref: `${colLetter}2:${colLetter}101`, // rows 2 to 101
            type: "list",
            formula1: `"${col.data.join(",")}"`,
            showDropDown: true
          };
        }
        return null;
      })
      .filter(Boolean);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "dropdown_excel.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Excel Generator with Dropdowns</h2>
      <button onClick={generateExcel}>Generate Excel</button>
    </div>
  );
}

export default App;
