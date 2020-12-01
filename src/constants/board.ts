import { IsUUID, Length } from 'class-validator';

export interface BoardData {
  userUuid: string;
  name: string;
}

export class AddBoardDto {
  @IsUUID('4')
  userUuid: string;

  @Length(4)
  name: string;
}

export class GetAllBoardsDto {
  @IsUUID('4')
  userUuid: string;
}
