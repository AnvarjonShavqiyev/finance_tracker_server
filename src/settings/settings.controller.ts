import { Controller, Get, Body, UseGuards, Req, Put } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { AuthRequest, Settings } from "src/types";
import { JwtAuthGuard } from "src/auth/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getUserSettings(@Req() req: AuthRequest) {
    return this.settingsService.getUserSettings(req.user.userId);
  }

  @Put()
  async updateUserSettings(@Req() req: AuthRequest, @Body() settings: Settings) {
    return this.settingsService.updateUserSettings(req.user.userId, settings);
  }
}
