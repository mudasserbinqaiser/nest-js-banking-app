import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionsService } from 'src/transactions/transactions.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { LoggingService } from 'src/logging/logging.service';
import { PdfGenerator } from './utils/pdf-generator';
import { CsvGenerator } from './utils/csv-generator';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationMessages } from 'src/notifications/notification_messages/notification-messages';
import { SendEmailDto } from 'src/notifications/dto/send-email.dto';

@Injectable()
export class ReportingService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly loggingService: LoggingService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async generateReport(generateReportDto: GenerateReportDto): Promise<string> {
    const { format, accountId, email } = generateReportDto;

    try {
        if (!accountId) {
            this.loggingService.warn('Attempt to generate report without account ID', 'ReportingService');
            throw new BadRequestException('Account ID is required to generate a report');
        }

        this.loggingService.log(`Generating ${format.toUpperCase()} report for account ${accountId}`, 'ReportingService');

        const transactions = await this.transactionsService.getTransactionsByAccountId(accountId);
        if (!transactions.length) {
            this.loggingService.warn(`No transactions found for account ${accountId}`, 'ReportingService');
            throw new NotFoundException('No transactions found for this account');
        }

        let filePath: string;
        if (format === 'pdf') {
            filePath = await PdfGenerator.generate(transactions);
        } else if (format === 'csv') {
            filePath = await CsvGenerator.generate(transactions);
        } else {
            this.loggingService.warn(`Invalid report format requested: ${format}`, 'ReportingService');
            throw new BadRequestException('Invalid report format. Only "pdf" and "csv" are supported.');
        }

        this.loggingService.log(`Report generated successfully: ${filePath}`, 'ReportingService');

        if (email) {
            try {
                const emailContent = NotificationMessages.reportGenerated(format.toUpperCase(), filePath);
                const reportGeneratedEmail = new SendEmailDto();
                reportGeneratedEmail.to = email;
                reportGeneratedEmail.subject = emailContent.subject;
                reportGeneratedEmail.body = emailContent.body;
                reportGeneratedEmail.attachment = filePath;

                await this.notificationsService.sendEmail(reportGeneratedEmail);
                this.loggingService.log(`Report sent via email to ${email}`, 'ReportingService');
            } catch (emailError) {
                this.loggingService.error(
                    `Failed to send report email to ${email} | Error: ${emailError.message}`,
                    emailError.stack,
                    'ReportingService'
                );
            }
        }

        return filePath;
    } catch (error) {
        this.loggingService.error(
            `Error generating report: ${error.message}`,
            error.stack,
            'ReportingService'
        );
        throw error;
    }
}

}
