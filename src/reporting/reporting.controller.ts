import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/security/gaurds/roles.guard';
import { Roles } from 'src/security/decorators/roles.decorators';
import { GenerateReportDto } from './dto/generate-report.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Post('generate')
  @Roles('admin', 'customer')
  async generateReport(@Body() generateReportDto: GenerateReportDto) {
    return this.reportingService.generateReport(generateReportDto);
  }
}
