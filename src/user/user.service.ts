// import {
//   Injectable,
//   Inject,
//   InternalServerErrorException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from '../schemas/user.schema';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';

// @Injectable()
// export class UserService {
//   // constructor(@InjectModel(User.name) private userModel: Model<User>) {}
//   constructor(
//     @InjectModel(User.name) private userModel: Model<User>,
//     @Inject(CACHE_MANAGER) private cacheManager,
//   ) {}

//   async getAllCachedUsers(): Promise<User[]> {
//     try {
//       const cachedUsers = await this.cacheManager.get('users');
//       if (cachedUsers) {
//         return cachedUsers;
//       }
//       const users = await this.userModel.find().exec();
//       await this.cacheManager.set('users', users, { ttl: 60 });
//       return users;
//     } catch (error) {
//       console.error('Error fetching all users:', error);
//       throw new InternalServerErrorException('Error fetching all users');
//     }
//   }

//   async createUser(createUserDto: any): Promise<User> {
//     try {
//       const createdUser = new this.userModel(createUserDto);
//       return createdUser.save();
//     } catch (error) {
//       console.error('Error creating user:', error);
//       throw new InternalServerErrorException('Error creating user');
//     }
//   }

//   async getAllUsers(): Promise<User[]> {
//     try {
//       return this.userModel.find().exec();
//     } catch (error) {
//       console.error('Error fetching all users:', error);
//       throw new InternalServerErrorException('Error fetching all users');
//     }
//   }

//   async getUserById(id: string): Promise<User> {
//     try {
//       const user = await this.userModel.findById(id).exec();
//       if (!user) {
//         throw new NotFoundException('User not found');
//       }
//       return user;
//     } catch (error) {
//       console.error('Error fetching user by id:', error);
//       throw new InternalServerErrorException('Error fetching user by id');
//     }
//   }

//   async updateUser(id: string, updateUserDto: any): Promise<User> {
//     try {
//       const updatedUser = await this.userModel
//         .findByIdAndUpdate(id, updateUserDto, { new: true })
//         .exec();
//       if (!updatedUser) {
//         throw new NotFoundException('User not found');
//       }
//       return updatedUser;
//     } catch (error) {
//       console.error('Error updating user:', error);
//       throw new InternalServerErrorException('Error updating user');
//     }
//   }

//   async deleteUser(id: string): Promise<User> {
//     try {
//       const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
//       if (!deletedUser) {
//         throw new NotFoundException('User not found');
//       }
//       return deletedUser;
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       throw new InternalServerErrorException('Error deleting user');
//     }
//   }

//   async searchUsers(query: string): Promise<User[]> {
//     try {
//       const regex = new RegExp(query, 'i'); // Case-insensitive search
//       return this.userModel
//         .find({
//           $or: [
//             { name: regex },
//             { surname: regex },
//             { username: regex },
//             { birthdate: { $regex: query } }, // You may need to adjust the date search based on how your dates are stored
//           ],
//         })
//         .exec();
//     } catch (error) {
//       console.error('Error searching users:', error);
//       throw new InternalServerErrorException('Error searching users');
//     }
//   }

//   async blockUser(userId: string, blockId: string): Promise<User> {
//     try {
//       return this.userModel
//         .findByIdAndUpdate(
//           userId,
//           { $addToSet: { blockedUsers: blockId } },
//           { new: true },
//         )
//         .exec();
//     } catch (error) {
//       console.error('Error blocking user:', error);
//       throw new InternalServerErrorException('Error blocking user');
//     }
//   }

//   async unblockUser(userId: string, blockId: string): Promise<User> {
//     try {
//       return this.userModel
//         .findByIdAndUpdate(
//           userId,
//           { $pull: { blockedUsers: blockId } },
//           { new: true },
//         )
//         .exec();
//     } catch (error) {
//       console.error('Error unblocking user:', error);
//       throw new InternalServerErrorException('Error unblocking user');
//     }
//   }
// }

import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager,
  ) {}

  async getAllCachedUsers(): Promise<User[]> {
    try {
      const cachedUsers = await this.cacheManager.get('users');
      if (cachedUsers) {
        return cachedUsers;
      }
      const users = await this.userModel.find().exec();
      await this.cacheManager.set('users', users, { ttl: 60 });
      return users;
    } catch (error) {
      console.error('Error fetching all cached users:', error);
      throw new InternalServerErrorException('Error fetching all cached users');
    }
  }

  async createUser(createUserDto: any): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new InternalServerErrorException('Error fetching all users');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching user by id');
    }
  }

  async updateUser(id: string, updateUserDto: any): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const regex = new RegExp(query, 'i'); // Case-insensitive search
      return await this.userModel
        .find({
          $or: [
            { name: regex },
            { surname: regex },
            { username: regex },
            { birthdate: { $regex: query } }, // You may need to adjust the date search based on how your dates are stored
          ],
        })
        .exec();
    } catch (error) {
      console.error('Error searching users:', error);
      throw new InternalServerErrorException('Error searching users');
    }
  }

  async blockUser(userId: string, blockId: string): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $addToSet: { blockedUsers: blockId } },
          { new: true },
        )
        .exec();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      console.error('Error blocking user:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error blocking user');
    }
  }

  async unblockUser(userId: string, blockId: string): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          userId,
          { $pull: { blockedUsers: blockId } },
          { new: true },
        )
        .exec();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      console.error('Error unblocking user:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error unblocking user');
    }
  }
}
