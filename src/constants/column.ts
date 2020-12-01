import { IsEnum, IsUUID, Length } from 'class-validator';
import { Status } from './status';

export interface ColumnData {
  name: string;
  boardUuid: string;
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

export class DeleteColumn {
  @IsUUID('4')
  columnUuid: string;
}
