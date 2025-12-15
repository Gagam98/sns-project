import { Controller, Get, Param, NotFoundException, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':username')
    async findOne(@Param('username') username: string) {
        const user = await this.usersService.findOne(username);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get('id/:id')
    async findById(@Param('id') id: string) {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Patch(':username')
    async update(@Param('username') username: string, @Body() updateUserDto: any) {
        return this.usersService.update(username, updateUserDto);
    }
}
