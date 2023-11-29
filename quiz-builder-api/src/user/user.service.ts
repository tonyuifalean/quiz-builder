import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = [];
  }

  async create(createUserData: User): Promise<User> {
    const newUser = {
      ...createUserData,
      userId: this.users.length,
    };
    this.users.push(newUser);
    return this.findOne(createUserData.username);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
