export interface RegisterUserData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserData {
  id: string;
  username: string;
  password: string;
}

export interface CreatedUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface UserLoggedIn {
  id: string;
  username: string;
  accessToken: string;
}
