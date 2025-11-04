import { Injectable } from "@nestjs/common";
import { SETTINGS_TYPES } from "src/constants";
import { PrismaService } from "src/prisma/prisma.service";
import { Settings } from "src/types";

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getUserSettings(userId: number) {
    return this.prisma.settings.upsert({
      where: { userId },
      create: {
        userId,
        sendDailyReports: false,
      },
      update: {},
      omit: {
        userId: true,
        id: true
      }
    });
  }

  async getAllEnabledSettings (settingsType: SETTINGS_TYPES) {
    return this.prisma.settings.findMany({
      where: {
        [settingsType]: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
      }
    })
  }

  async updateUserSettings(userId: number, settings: Settings) {
    return this.prisma.settings.update({
      where: { userId },
      data: {...settings}
    });
  }
}
