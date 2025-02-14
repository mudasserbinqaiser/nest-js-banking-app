import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/security/gaurds/roles.guard';
import { Roles } from 'src/security/decorators/roles.decorators';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('history')
  getNotificationHistory() {
    return this.notificationsService.getNotificationHistory();
  }
}
