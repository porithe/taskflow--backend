import { IsUUID, Length } from 'class-validator';

export interface BoardData {
  name: string;
}

export class AddBoardDto {
  @Length(4)
  name: string;
}

export class GetAllBoardsDto {
  @IsUUID('4')
  userUuid: string;
}
