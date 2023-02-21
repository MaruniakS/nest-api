import { Test, TestingModule } from '@nestjs/testing';
import { UserItemsController } from './user-items.controller';

describe('UserItemsController', () => {
  let controller: UserItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserItemsController],
    }).compile();

    controller = module.get<UserItemsController>(UserItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
