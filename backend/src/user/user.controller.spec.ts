import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should return an array of user', async () => {
    const result = [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];
    jest.spyOn(service, 'getAllUsers').mockImplementation(() => result);

    expect(await controller.getAllUsers()).toBe(result);
  });
});
