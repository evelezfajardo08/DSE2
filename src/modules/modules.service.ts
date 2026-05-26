import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module, ModuleDocument } from './entities/schema';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name)
    private readonly moduleModel: Model<ModuleDocument>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    const createdModule = new this.moduleModel(createModuleDto);
    return createdModule.save();
  }

  async findAll() {
    return this.moduleModel.find().exec();
  }

  async findOne(id: number) {
    const module = await this.moduleModel.findOne({ id }).exec();
    if (!module) {
      throw new NotFoundException(`Module with id ${id} not found`);
    }
    return module;
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    const module = await this.moduleModel
      .findOneAndUpdate({ id }, updateModuleDto, { new: true })
      .exec();
    if (!module) {
      throw new NotFoundException(`Module with id ${id} not found`);
    }
    return module;
  }

  async remove(id: number) {
    const module = await this.moduleModel.findOneAndDelete({ id }).exec();
    if (!module) {
      throw new NotFoundException(`Module with id ${id} not found`);
    }
    return module;
  }
}
