import { IsEnum, IsUUID, Length } from 'class-validator';
import { Status } from './status';

export interface ColumnData {
  name: string;
  boardUuid: string;
}

export interface DeleteColumnData {
  boardUuid: string;
  columnUuid: string;
}

export class AddColumnDto {
  @IsUUID('4')
  boardUuid: string;

  @Length(4)
  name: string;
}

export class GetAllColumnsDto {
  @IsUUID('4')
  boardUuid: string;

  @IsEnum(Status)
  status: Status;
}

export class DeleteColumnDto {
  @IsUUID('4')
  columnUuid: string;

  @IsUUID('4')
  boardUuid: string;
}

export class UpdateColumnDto {
  @IsUUID('4')
  columnUuid: string;
  @IsUUID('4')
  boardUuid: string;
  @Length(4)
  name: string;
}
