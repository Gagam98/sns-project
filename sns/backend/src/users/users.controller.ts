import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('search')
    async searchUsers(@Query('q') query: string) {
        return this.usersService.searchByUsername(query);
    }

    @Get('id/:id')
    async findById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Get(':username')
    async findByUsername(@Param('username') username: string) {
        return this.usersService.findByUsername(username);
    }
}
