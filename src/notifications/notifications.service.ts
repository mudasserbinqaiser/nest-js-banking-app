import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggingService } from 'src/logging/logging.service';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly loggingService: LoggingService,
  ) {}

  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const {to, subject, body} = sendEmailDto
    try {
        await this.mailerService.sendMail({
            to,
            subject,
            text: body,
        });

        // ✅ Log notification history
        this.loggingService.log(
            `Email sent to ${to} | Subject: ${subject} | Message: ${body}`,
            'NotificationsService'
        );

    } catch (error) {
        this.loggingService.error(
            `Failed to send email to ${to} | Error: ${error.message}`,
            error.stack,
            'NotificationsService'
        );
        throw new Error('Failed to send email');
    }
  }

  async getNotificationHistory(): Promise<string[]> {
    try {
        const fs = require('fs');
        const logFile = 'logs/app.log';
        if (fs.existsSync(logFile)) {
            const logs = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean);
            return logs.filter((log) => log.includes('"context":"NotificationsService"'));
        }
        return [];
    } catch (error) {
        this.loggingService.error(
            `Failed to retrieve notification logs | Error: ${error.message}`,
            error.stack,
            'NotificationsService'
        );
        return [];
    }
  }
}
