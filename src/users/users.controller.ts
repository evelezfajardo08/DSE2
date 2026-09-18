import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('students')
  findStudents() {
    return this.usersService.findStudents();
  }

  @Get('teacher-requests')
  @UseGuards(JwtAuthGuard)
  async findTeacherApprovalRequests(@Req() request: any) {
    const approver = await this.usersService.findByEmail(String(request.user?.email || '').toLowerCase());
    if (!approver || approver.role !== 'teacher' || approver.status !== 'active' || !approver.emailVerified) {
      throw new ForbiddenException('Solo los docentes pueden consultar solicitudes.');
    }
    return this.usersService.findTeacherApprovalRequests();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
