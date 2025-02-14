import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';

export class PdfGenerator {
  static async generate(transactions: any[]): Promise<string> {
    const reportsDir = path.join(__dirname, '..', '..', 'reports');

    try {
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filePath = path.join(reportsDir, `report_${Date.now()}.pdf`);
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc.fontSize(16).text('Transaction Report', { align: 'center' });
      doc.moveDown();

      transactions.forEach((tx) => {
        doc.fontSize(12).text(
          `Transaction ID: ${tx.id}, From: ${tx.fromAccountId}, To: ${tx.toAccountId}, Amount: $${tx.amount}`
        );
        doc.moveDown();
      });

      doc.end();

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          resolve(filePath);
        });
        writeStream.on('error', (err) => {
          reject(new Error('Error generating PDF report'));
        });
      });
    } catch (error) {
      throw new Error('Error generating PDF report');
    }
  }
}
