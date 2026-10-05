import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProgressService } from './progress.service';
import { Progress } from './entities/schema';

describe('ProgressService', () => {
  let service: ProgressService;
  let progressModel: any;

  beforeEach(async () => {
    progressModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getModelToken(Progress.name),
          useValue: progressModel,
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
  });

  it('should persist an activity completion for a user', async () => {
    const savedRecord = {
      _id: 'abc',
      user_id: 7,
      user_email: 'ana@test.com',
      activity_id: 'activity-1',
      module_id: 1,
      percentage: 100,
      status: 'completed',
      completed_at: new Date(),
    };

    progressModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    progressModel.create.mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(savedRecord),
    }));

    const result = await service.markActivityCompleted({
      user_id: 7,
      user_email: 'ana@test.com',
      activity_id: 'activity-1',
      module_id: 1,
      percentage: 100,
      status: 'completed',
    });

    expect(result).toMatchObject({
      user_id: 7,
      activity_id: 'activity-1',
      percentage: 100,
      status: 'completed',
    });
    expect(progressModel.create).toHaveBeenCalled();
  });

  it('should return the completed activity ids for a user', async () => {
    progressModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        { activity_id: 'activity-1' },
        { activity_id: 'activity-2' },
      ]),
    });

    const result = await service.findByUser(7);

    expect(result.map((entry) => entry.activity_id)).toEqual(['activity-1', 'activity-2']);
  });
});
