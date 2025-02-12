import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SecurityModule } from './security/security.module';
import { ValidationModule } from './validation/validation.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config accessible globally
  }),
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    SecurityModule,
    ValidationModule,
    LoggingModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
