import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, ContentDocument } from './entities/schema';

@Injectable()
export class ContentsService {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
  ) {}

  async create(createContentDto: CreateContentDto) {
    const createdContent = new this.contentModel(createContentDto);
    return createdContent.save();
  }

  async findAll() {
    return this.contentModel.find().exec();
  }

  async findOne(id: number) {
    const content = await this.contentModel.findOne({ id }).exec();
    if (!content) {
      throw new NotFoundException(`Content with id ${id} not found`);
    }
    return content;
  }

  async update(id: number, updateContentDto: UpdateContentDto) {
    const content = await this.contentModel
      .findOneAndUpdate({ id }, updateContentDto, { new: true })
      .exec();
    if (!content) {
      throw new NotFoundException(`Content with id ${id} not found`);
    }
    return content;
  }

  async remove(id: number) {
    const content = await this.contentModel.findOneAndDelete({ id }).exec();
    if (!content) {
      throw new NotFoundException(`Content with id ${id} not found`);
    }
    return content;
  }
}
