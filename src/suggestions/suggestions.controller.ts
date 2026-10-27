import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SuggestionsService, CreateSuggestionDto } from './suggestions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    private readonly suggestionsService: SuggestionsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() body: CreateSuggestionDto) {
    if (!body.message || body.message.trim().length < 5) {
      throw new BadRequestException('El mensaje debe contener al menos 5 caracteres.');
    }
    if (!body.user_email || !body.user_name) {
      throw new BadRequestException('El nombre y correo del remitente son obligatorios.');
    }
    return this.suggestionsService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() request: any) {
    const actorEmail = String(request.user?.email || '').toLowerCase();
    const actor = await this.usersService.findByEmail(actorEmail);
    if (!actor || actor.role !== 'teacher' || actor.status !== 'active') {
      throw new ForbiddenException('Solo los docentes pueden consultar los mensajes y sugerencias.');
    }
    return this.suggestionsService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.suggestionsService.findByUser(+userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Req() request: any,
  ) {
    const actorEmail = String(request.user?.email || '').toLowerCase();
    const actor = await this.usersService.findByEmail(actorEmail);
    if (!actor || actor.role !== 'teacher' || actor.status !== 'active') {
      throw new ForbiddenException('Solo los docentes pueden cambiar el estado de los mensajes.');
    }
    return this.suggestionsService.updateStatus(id, body.status || 'reviewed');
  }
}
