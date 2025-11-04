import { Worksheet } from 'exceljs';

export const fillSheet = <T extends object>(
  sheet: Worksheet,
  rows: T[],
): void => {
  rows.forEach((row) => sheet.addRow(row));
};
