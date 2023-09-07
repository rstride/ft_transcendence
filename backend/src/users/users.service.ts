import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getAllUsers() {
    // Your logic to fetch all users goes here.
    // For now, let's return a sample array.
    return [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];
  }
}
