import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { AddFundsDto } from './dto/add-funds.dto';
import { RolesGuard } from 'src/security/gaurds/roles.guard';
import { Roles } from 'src/security/decorators/roles.decorators';

@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Roles('admin', 'banker')
  @Post('create')
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.createAccount(createAccountDto);
  }

  @Roles('admin', 'banker')
  @Post('add-funds')
  async addFunds(
    @Body() addFundsDto: AddFundsDto,
  ) {
    return this.accountsService.addFunds(addFundsDto);
  }

  @Roles('admin', 'banker')
  @Get(':id')
  async getAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.getAccountById(id);
  }

  @Roles('admin', 'banker')
  @Get('user/:userId')
  async getAccountsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.accountsService.getAccountsByUserId(userId);
  }
}
