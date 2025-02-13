import { Controller, Get, Put, Param, UseGuards, ParseIntPipe, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/security/gaurds/roles.guard';
import { Roles } from 'src/security/decorators/roles.decorators';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('ban-user/:userId')
  async banUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.banUser(userId);
  }

  @Put('suspend-account/:accountId')
  async suspendAccount(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.adminService.suspendAccount(accountId);
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('transactions')
  async getAllTransactions() {
    return this.adminService.getAllTransactions();
  }
}
