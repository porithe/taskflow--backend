import { IsUUID, Length } from 'class-validator';

export class AddTaskDto {
  @IsUUID('4')
  columnUuid: string;
  @IsUUID('4')
  boardUuid: string;
  @Length(4, 40)
  title: string;
  @Length(5, 200)
  description: string;
}
