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
      submodule_name: data.submodule_name || '',
      exercise_response: data.exercise_response ?? '',
      overall_progress: Number(data.overall_progress ?? 0),
      percentage: Number(data.percentage ?? 0),
      status: data.status ?? 'not_started',
      completed_at: data.completed_at ?? new Date(),
    };

    if (!activityData.user_id || !activityData.activity_id) {
      throw new NotFoundException('Faltan datos para registrar la actividad completada.');
    }

    // Limpiar registros antiguos que no correspondan al esquema de 5 submódulos (submodulo-1..5)
    if (/^submodulo-[1-5]$/.test(activityData.activity_id)) {
      await this.progressModel
        .deleteMany({
          user_id: activityData.user_id,
          activity_id: { $nin: ['submodulo-1', 'submodulo-2', 'submodulo-3', 'submodulo-4', 'submodulo-5'] },
        })
        .exec();
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
            exercise_response:
              activityData.exercise_response !== undefined && activityData.exercise_response !== ''
                ? activityData.exercise_response
                : existingProgress.exercise_response || '',
            percentage: activityData.percentage,
          },
          { new: true },
        )
        .exec();
    }

    const createdProgress = await this.progressModel.create({
      ...activityData,
      id: Date.now() + Math.floor(Math.random() * 100000),
    });
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
