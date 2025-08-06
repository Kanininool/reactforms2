import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Dynamic JSON input
const jsonData = [
  { column: "Name" },
  { column: "Skills", data: ["Node", "React", "Python", "Perl"] },
  { column: "Department", data: ["Engineering", "HR", "Finance"] }
];

function App() {
  const generateExcel = () => {
    const headers = jsonData.map(col => col.column);
    const ws = XLSX.utils.aoa_to_sheet([headers, Array(headers.length).fill("")]);

    // Add dropdowns dynamically
    ws["!dataValidation"] = jsonData
      .map((col, index) => {
        if (col.data) {
          return {
            sqref: `${String.fromCharCode(65 + index)}2:${String.fromCharCode(65 + index)}100`,
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
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "dynamic_output.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dynamic Excel Generator</h2>
      <button onClick={generateExcel}>Generate Excel</button>
    </div>
  );
}

export default App;
