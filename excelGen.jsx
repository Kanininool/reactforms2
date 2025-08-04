import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelGenerator = ({ config }) => {
  const [loading, setLoading] = useState(false);

  const fetchDropdownData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data; // assuming array of strings
    } catch (error) {
      console.error(`Error fetching from ${url}`, error);
      return [];
    }
  };

  const generateExcel = async () => {
    setLoading(true);
    const workbook = XLSX.utils.book_new();

    for (const section in config) {
      const fields = config[section];
      const headers = [];
      const dropdowns = {};

      for (const field in fields) {
        headers.push(field);
        if (fields[field].Url) {
          const options = await fetchDropdownData(fields[field].Url);
          dropdowns[field] = options;
        }
      }

      // Create a sheet with headers and dropdowns as comments
      const sheetData = [headers];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Add dropdowns as comments (Excel doesn't support native dropdowns via SheetJS)
      for (const field in dropdowns) {
        const colIndex = headers.indexOf(field);
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
        worksheet[cellRef].c = [{
          t: 'dropdown',
          a: 'Options',
          r: dropdowns[field].join(', ')
        }];
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, section);
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'DynamicExcel.xlsx');
    setLoading(false);
  };

  return (
    <div>
      <button onClick={generateExcel} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Excel'}
      </button>
    </div>
  );
};

export default ExcelGenerator;
