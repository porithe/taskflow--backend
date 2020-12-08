import { IsNumber, IsOptional, IsUUID, Length } from 'class-validator';

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

export class EditTaskDto {
  @IsUUID('4')
  taskUuid: string;
  @IsUUID('4')
  boardUuid: string;
  @IsOptional()
  @Length(4, 40)
  title: string;
  @IsOptional()
  @Length(5, 200)
  description: string;
}

export class DeleteTaskDto {
  @IsUUID('4')
  taskUuid: string;
  @IsUUID('4')
  boardUuid: string;
}

export class TaskToMove {
  @IsUUID('4')
  taskUuid: string;
  @IsNumber()
  position: number;
}

export class MoveTaskDto {
  @IsUUID('4')
  boardUuid: string;
  tasks: TaskToMove[];
}

export interface MovedTasks {
  positive: string[];
  negative: string[];
}
