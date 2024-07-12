import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/database/models/security';

export class UserLoginResponseDto  {
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

    @ApiProperty()
    token: string;
    
    @ApiProperty()
    refresh_token: string;

    constructor(user: User, token?: string, refresh_token?: string) {
        this.asign(user);
        this.token = token;
        this.refresh_token = refresh_token;
    }

    private asign(user: User) {
        this.id = user.id;
        this.username =  user.username;
        this.email = user.email;
        this.firstName = user.firstname;
        this.lastName = user.lastname;
        
    }
}