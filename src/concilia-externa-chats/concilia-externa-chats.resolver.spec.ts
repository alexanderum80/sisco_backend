import { Test, TestingModule } from '@nestjs/testing';
import { ConciliaExternaChatsResolver } from './concilia-externa-chats.resolver';
import { ConciliaExternaChatsService } from './concilia-externa-chats.service';

describe('ConciliaExternaChatsResolver', () => {
  let resolver: ConciliaExternaChatsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConciliaExternaChatsResolver, ConciliaExternaChatsService],
    }).compile();

    resolver = module.get<ConciliaExternaChatsResolver>(ConciliaExternaChatsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
