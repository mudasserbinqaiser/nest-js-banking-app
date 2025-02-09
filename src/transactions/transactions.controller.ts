import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transferFunds(@Body() transferDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    return this.transactionsService.transferFunds(transferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTransactionById(@Param('id') id: number): Promise<TransactionResponseDto> {
    return this.transactionsService.getTransactionById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('account/:accountId')
  async getTransactionsByAccountId(@Param('accountId') accountId: number): Promise<TransactionResponseDto[]> {
    return this.transactionsService.getTransactionsByAccountId(+accountId);
  }
}
