import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findStudents() {
    return this.userModel
      .find({ role: 'student' })
      .select('-_id id name email status registered_at')
      .sort({ name: 1 })
      .lean()
      .exec();
  }

  async findRegisteredUsers() {
    return this.userModel
      .find({ emailVerified: true, status: 'active' })
      .select('-_id id name email role status registered_at')
      .sort({ role: 1, name: 1 })
      .lean()
      .exec();
  }

  async findTeacherApprovalRequests() {
    return this.userModel
      .find({ role: 'teacher', status: 'pending_approval', emailVerified: true })
      .select('id name email registered_at')
      .sort({ registered_at: 1 })
      .lean()
      .exec();
  }

  async findOne(id: number) {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async recordLogin(id: number) {
    const user = await this.findOne(id);
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = today.slice(0, 7);

    if (user.lastLoginDate === today) {
      return user;
    }

    const lastLogin = user.lastLoginDate ? new Date(`${user.lastLoginDate}T00:00:00Z`) : null;
    const todayDate = new Date(`${today}T00:00:00Z`);
    const elapsedDays = lastLogin
      ? Math.round((todayDate.getTime() - lastLogin.getTime()) / (24 * 60 * 60 * 1000))
      : null;
    const previousStreak = user.loginStreak || 0;
    const canRecoverStreak = elapsedDays === 2 && user.streakRecoveryMonth !== currentMonth;
    const loginStreak = elapsedDays === 1
      ? previousStreak + 1
      : canRecoverStreak
        ? previousStreak
        : 1;

    return this.userModel
      .findOneAndUpdate(
        { id },
        {
          loginStreak,
          lastLoginDate: today,
          ...(canRecoverStreak ? { streakRecoveryMonth: currentMonth } : {}),
        },
        { new: true },
      )
      .exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findOneAndUpdate({ id }, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async approveTeacher(id: number) {
    const user = await this.userModel
      .findOneAndUpdate(
        { id, role: 'teacher', status: 'pending_approval', emailVerified: true },
        { status: 'active' },
        { new: true },
      )
      .exec();
    if (!user) {
      throw new NotFoundException('No se encontró una solicitud docente pendiente.');
    }
    return user;
  }

  async remove(id: number) {
    const user = await this.userModel.findOneAndDelete({ id }).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
