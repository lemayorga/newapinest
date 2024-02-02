import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/database/models/security';

export class UserLoginResponseDto  {
    @ApiProperty()
    token: string;

    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    constructor(user: User, token?: string) {
        this.asign(user);
        this.token = token;
    }

    private asign(user: User) {
        this.id = user.id;
        this.username =  user.username;
        this.email = user.email;
        this.firstName = user.firstname;
        this.lastName = user.lastname;
        
    }
}