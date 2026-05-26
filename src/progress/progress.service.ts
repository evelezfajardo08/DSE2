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
