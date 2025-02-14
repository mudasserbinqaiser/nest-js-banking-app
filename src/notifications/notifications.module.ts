import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [
    LoggingModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
