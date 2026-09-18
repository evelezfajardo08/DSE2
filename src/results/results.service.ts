import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Result, ResultDocument } from './entities/schema';

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(Result.name)
    private readonly resultModel: Model<ResultDocument>,
  ) {}

  async create(createResultDto: CreateResultDto) {
    const createdResult = new this.resultModel(createResultDto);
    return createdResult.save();
  }

  async findAll() {
    return this.resultModel.find().exec();
  }

  async findOne(id: number) {
    const result = await this.resultModel.findOne({ id }).exec();
    if (!result) {
      throw new NotFoundException(`Result with id ${id} not found`);
    }
    return result;
  }

  async update(id: number, updateResultDto: UpdateResultDto) {
    const result = await this.resultModel
      .findOneAndUpdate({ id }, updateResultDto, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Result with id ${id} not found`);
    }
    return result;
  }

  async remove(id: number) {
    const result = await this.resultModel.findOneAndDelete({ id }).exec();
    if (!result) {
      throw new NotFoundException(`Result with id ${id} not found`);
    }
    return result;
  }
}
