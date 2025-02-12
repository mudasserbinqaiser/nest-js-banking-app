import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { RolesGuard } from 'src/security/gaurds/roles.guard';
import { Roles } from 'src/security/decorators/roles.decorators';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('customer', 'admin', 'banker')
  @Post('transfer')
  async transferFunds(@Body() transferDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.transactionsService.transferFunds(transferDto);
  }

  @Roles('customer', 'admin', 'banker')
  @Get(':id')
  async getTransactionById(@Param('id', ParseIntPipe) id: number): Promise<TransactionResponseDto> {
    return this.transactionsService.getTransactionById(id);
  }

  @Roles('admin', 'banker')
  @Get('account/:accountId')
  async getTransactionsByAccountId(@Param('accountId', ParseIntPipe) accountId: number): Promise<TransactionResponseDto[]> {
    return this.transactionsService.getTransactionsByAccountId(accountId);
  }
}
