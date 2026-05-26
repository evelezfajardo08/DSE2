import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { Assessment, AssessmentDocument } from './entities/schema';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectModel(Assessment.name)
    private readonly assessmentModel: Model<AssessmentDocument>,
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto) {
    const createdAssessment = new this.assessmentModel(createAssessmentDto);
    return createdAssessment.save();
  }

  async findAll() {
    return this.assessmentModel.find().exec();
  }

  async findOne(id: number) {
    const assessment = await this.assessmentModel.findOne({ id }).exec();
    if (!assessment) {
      throw new NotFoundException(`Assessment with id ${id} not found`);
    }
    return assessment;
  }

  async update(id: number, updateAssessmentDto: UpdateAssessmentDto) {
    const assessment = await this.assessmentModel.findOneAndUpdate(
      { id },
      updateAssessmentDto,
      { new: true },
    );
    if (!assessment) {
      throw new NotFoundException(`Assessment with id ${id} not found`);
    }
    return assessment;
  }

  async remove(id: number) {
    const assessment = await this.assessmentModel.findOneAndDelete({ id });
    if (!assessment) {
      throw new NotFoundException(`Assessment with id ${id} not found`);
    }
    return assessment;
  }
}
