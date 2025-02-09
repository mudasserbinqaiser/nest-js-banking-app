import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config accessible globally
  }),
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
