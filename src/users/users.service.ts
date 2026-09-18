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
