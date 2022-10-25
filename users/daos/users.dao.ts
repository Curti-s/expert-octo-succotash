/*
  DAO - data access object
  DTO - data transfer object

  DAO is responsible for connecting to a defined database and performing CRUD operations
  DTO is an object that holds the raw data the DAO will send to and receive from the database.
  DTOs conform to the data model types and DAOs are the services that use them.
  */

/*
 * Using a singleton pattern, this class will always provide the same
 * instance, as well as the same users array, which imported to other
 * files. That's because Nodejs caches this file wherever it's
 * imported and all imports happen on startup.
 * Any file referring to users.dao.ts will be handed a reference to
 * the same new UsersDao() that gets exported the first time Nodejs
 * processes this file.
 */
import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';

import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

class UsersDao {
  users: Array<CreateUserDto> = [];

  constructor() {
    log('Created new instanceof UsersDao');
  }

  async addUser(user: CreateUserDto) {
    user.id = shortid.generate();
    this.users.push(user);
    return user.id;
  }

  async getUsers() {
    return this.users;
  }

  async getUserById(userId: string) {
    return this.users.find((user: { id: string }) => user.id === userId);
  }

  async putUserById(userId: string, user: PutUserDto) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    this.users.splice(objIndex, 1, user);
    return `${user.id} updated via put`;
  }

  async patchUserById(userId: string, user: PatchUserDto) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    const currentUser = this.users[objIndex];
    const allowedPatchFields = [
      'password',
      'firstName',
      'lastName',
      'permissionLevel',
    ];

    for (const field of allowedPatchFields) {
      if (field in user) {
        // @ts-ignore
        currentUser[field] = user[field];
      }
    }

    this.users.splice(objIndex, 1, currentUser);
    return `${currentUser.id} patched`;
  }

  async removeUserById(userId: string) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    );
    this.users.splice(objIndex, 1);
    return `${userId} removed`;
  }
  
  async getUserByEmail(email: string) {
    const objIndex = this.users.findIndex(
      (obj: { email: string }) => obj.email === email
    );
    const currentUser = this.users[objIndex];
    if(currentUser) return currentUser;

    return null;
  }
}

export default new UsersDao();
