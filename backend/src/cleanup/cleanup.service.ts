import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async removeStaleRefreshTokens() {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [{ revoked: true }, { expiresAt: { lt: new Date() } }],
      },
    });

    this.logger.log(`Refresh tokens removidos: ${result.count}`);
  }
}
