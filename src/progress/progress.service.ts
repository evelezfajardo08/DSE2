import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Progress, ProgressDocument } from './entities/schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name)
    private readonly progressModel: Model<ProgressDocument>,
  ) {}

  async create(createProgressDto: CreateProgressDto) {
    const createdProgress = new this.progressModel(createProgressDto);
    return createdProgress.save();
  }

  async markActivityCompleted(data: CreateProgressDto) {
    const activityData = {
      user_id: Number(data.user_id),
      user_email: data.user_email || '',
      activity_id: String(data.activity_id || ''),
      module_id: Number(data.module_id ?? 1),
      percentage: Number(data.percentage ?? 100),
      status: data.status ?? 'completed',
      completed_at: data.completed_at ?? new Date(),
    };

    if (!activityData.user_id || !activityData.activity_id) {
      throw new NotFoundException('Faltan datos para registrar la actividad completada.');
    }

    const existingProgress = await this.progressModel
      .findOne({ user_id: activityData.user_id, activity_id: activityData.activity_id })
      .exec();

    if (existingProgress) {
      return this.progressModel
        .findOneAndUpdate(
          { _id: existingProgress._id },
          {
            ...activityData,
            percentage: Math.max(existingProgress.percentage ?? 0, activityData.percentage),
          },
          { new: true },
        )
        .exec();
    }

    const createdProgress = await this.progressModel.create(activityData);
    if (typeof (createdProgress as any).save === 'function') {
      return (createdProgress as any).save();
    }

    return createdProgress;
  }

  async findByUser(userId: number) {
    return this.progressModel.find({ user_id: Number(userId) }).exec();
  }

  async findAll() {
    return this.progressModel.find().exec();
  }

  async findOne(id: number) {
    const progress = await this.progressModel.findOne({ id }).exec();
    if (!progress) {
      throw new NotFoundException(`Progress with id ${id} not found`);
    }
    return progress;
  }

  async update(id: number, updateProgressDto: UpdateProgressDto) {
    const progress = await this.progressModel
      .findOneAndUpdate({ id }, updateProgressDto, { new: true })
      .exec();
    if (!progress) {
      throw new NotFoundException(`Progress with id ${id} not found`);
    }
    return progress;
  }

  async remove(id: number) {
    const progress = await this.progressModel.findOneAndDelete({ id }).exec();
    if (!progress) {
      throw new NotFoundException(`Progress with id ${id} not found`);
    }
    return progress;
  }
}
