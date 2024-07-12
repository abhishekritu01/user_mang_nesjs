import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../schemas/user.schema';
import { ApiQuery } from '@nestjs/swagger';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  @Get('all')
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    try {
      const deletedUser = await this.userService.deleteUser(id);
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  @Get('')
  async searchUsers(@Query('query') query: string): Promise<User[]> {
    try {
      return await this.userService.searchUsers(query);
    } catch (error) {
      console.error('Error searching users:', error);
      throw new InternalServerErrorException('Error searching users');
    }
  }

  @Post('block/:userId/:blockId')
  async block(
    @Param('userId') userId: string,
    @Param('blockId') blockId: string,
  ) {
    if (
      !userId.match(/^[0-9a-fA-F]{24}$/) ||
      !blockId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      throw new BadRequestException('Invalid ObjectId');
    }
    try {
      return await this.userService.blockUser(userId, blockId);
    } catch (error) {
      console.error('Error blocking user:', error);
      throw new InternalServerErrorException('Error blocking user');
    }
  }

  @Post('unblock/:userId/:blockId')
  async unblock(
    @Param('userId') userId: string,
    @Param('blockId') blockId: string,
  ) {
    if (
      !userId.match(/^[0-9a-fA-F]{24}$/) ||
      !blockId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      throw new BadRequestException('Invalid ObjectId');
    }
    try {
      return await this.userService.unblockUser(userId, blockId);
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw new InternalServerErrorException('Error unblocking user');
    }
  }
}
