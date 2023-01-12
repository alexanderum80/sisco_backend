import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaChatsService } from './concilia-externa-chats.service';

describe('ConciliaExternaChatsService', () => {
  let service: ConciliaExternaChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaChatsService],
    }).compile();

    service = module.get<ConciliaExternaChatsService>(ConciliaExternaChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
