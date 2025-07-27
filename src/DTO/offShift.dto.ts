import { IsDateString, IsNumber, IsOptional, Matches } from 'class-validator';
import { WorkerInfo } from '../entities/worker.entity';

export class OffShiftDto {
@IsOptional()

  @IsNumber()
  worker:WorkerInfo

  @IsDateString({},{ message: 'day must be a valid ISO date string (YYYY-MM-DD)' })
  day: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm 24-hour format',
  })
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm 24-hour format',
  })
  endTime: string;
}
