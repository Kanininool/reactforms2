import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const generateExcelFile = async (columns, rows) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = columns.map(col => ({
    header: col.header,
    key: col.key,
    width: 20,
  }));

  let hasMissingMandatory = false;

  rows.forEach((row, rowIndex) => {
    const addedRow = worksheet.addRow(row);

    columns.forEach((col, colIndex) => {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`);
      const value = row[col.key]?.trim();

      if (col.mandatory) {
        if (!value) {
          hasMissingMandatory = true;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFCCCC' }, // light red
          };
        }

        cell.dataValidation = {
          type: 'textLength',
          operator: 'greaterThan',
          formula1: '0',
          showErrorMessage: true,
          allowBlank: false,
          errorStyle: 'stop',
          errorTitle: 'Required Field',
          error: `${col.header} is mandatory.`,
        };
      }
    });
  });

  if (hasMissingMandatory) {
    throw new Error('Mandatory fields are missing.');
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, 'validated_data.xlsx');
};
