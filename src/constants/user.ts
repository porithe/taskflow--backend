import { IsEmail, Length } from 'class-validator';

export class RegisterUserDto {
  @Length(8, 30)
  username: string;

  @Length(3)
  firstName: string;

  @Length(3)
  lastName: string;

  @IsEmail()
  email: string;

  @Length(8, 40)
  password: string;
}

export interface RegisterUserData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserData {
  uuid: string;
  username: string;
  password: string;
}

export interface CreatedUser {
  uuid: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface UserLoggedIn {
  uuid: string;
  username: string;
  accessToken: string;
}
