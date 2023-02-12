import { NotFoundException } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Event } from '../events/entities/event.entity';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;
const createMockModel = <T = any>(): MockModel<T> => ({
  findOne: jest.fn(),
});

describe('ItemsService', () => {
  let service: ItemsService;
  let itemModel: MockModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getModelToken(Item.name),
          useValue: createMockModel(),
        },
        {
          provide: getModelToken(Event.name),
          useValue: createMockModel(),
        },
        {
          provide: getConnectionToken(),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    service.changeCount = jest.fn();
    itemModel = module.get<MockModel>(getModelToken(Item.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when item with ID exists', () => {
      it('should return the item object', async () => {
        const itemId = '1';
        const expectedItem = {};

        itemModel.findOne.mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(expectedItem),
        });
        const item = await service.findOne(itemId);
        expect(item).toEqual(expectedItem);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const itemId = '1';
        itemModel.findOne.mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(undefined),
        });

        try {
          await service.findOne(itemId);
          expect(false).toBeTruthy();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Item #${itemId} not found`);
        }
      });
    });
  });
});
