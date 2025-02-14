import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';

export class CsvGenerator {
  static async generate(transactions): Promise<string> {
    const reportsDir = path.join(__dirname, '..', '..', 'reports');

    try {
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filePath = path.join(reportsDir, `report_${Date.now()}.csv`);
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'id', title: 'Transaction ID' },
          { id: 'amount', title: 'Amount' },
          { id: 'status', title: 'Status' },
          { id: 'timestamp', title: 'Date' },
        ],
      });

      await csvWriter.writeRecords(transactions);

      return filePath;
    } catch (error) {
      throw new Error('Error generating CSV report');
    }
  }
}
