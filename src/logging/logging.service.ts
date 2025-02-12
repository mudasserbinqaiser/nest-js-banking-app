import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(), // ✅ Log in JSON format
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(), // ✅ Pretty print logs
        ),
      }),
      new winston.transports.File({ filename: 'logs/app.log', level: 'info' }), // ✅ Log to a file
    ],
  });

  log(message: string, context?: string) {
    this.logger.info({ message, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn({ message, context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ message, trace, context });
  }
}
