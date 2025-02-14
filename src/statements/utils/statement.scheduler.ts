import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportingService } from 'src/reporting/reporting.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { LoggingService } from 'src/logging/logging.service';
import { NotificationMessages } from 'src/notifications/notification_messages/notification-messages';
import { SendEmailDto } from 'src/notifications/dto/send-email.dto';

@Injectable()
export class StatementScheduler {
  constructor(
    private readonly reportingService: ReportingService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    private readonly loggingService: LoggingService
  ) {}

  // ⏰ Runs on the 1st of every month at 02:00 AM
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON)
  async generateMonthlyStatements() {
    this.loggingService.log(`Starting monthly statements generation`, 'StatementScheduler');

    try {
      const users = await this.usersService.getAllUsers();
      for (const user of users) {
        try {
          if (user.isBanned) {
            this.loggingService.warn(`Skipping banned user ${user.email}`, 'StatementScheduler');
            continue;
          }

          // Generate the monthly report
          const reportPath = await this.reportingService.generateReport({
            format: 'pdf',
            accountId: user.id,
            email: user.email,
          });

          // Send email with the statement
          const emailContent = NotificationMessages.monthlyStatement(user.name);
          const monthlyStatementEmail = new SendEmailDto();
          monthlyStatementEmail.to = user.email;
          monthlyStatementEmail.subject = emailContent.subject;
          monthlyStatementEmail.body = emailContent.body;
          monthlyStatementEmail.attachment = reportPath;

          await this.notificationsService.sendEmail(monthlyStatementEmail);
          this.loggingService.log(`Statement sent to ${user.email}`, 'StatementScheduler');
        } catch (error) {
          this.loggingService.error(`Failed to send statement to ${user.email}: ${error.message}`, error.stack, 'StatementScheduler');
        }
      }
      this.loggingService.log(`Monthly statements process completed`, 'StatementScheduler');
    } catch (error) {
      this.loggingService.error(`Error during statement generation: ${error.message}`, error.stack, 'StatementScheduler');
      throw new Error('Error in generating monthly statements');
    }
  }
}
