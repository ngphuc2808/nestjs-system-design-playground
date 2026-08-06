import { TopicStatus } from '../interfaces/learning-progress.interface';

export class UpdateProgressDto {
  status?: TopicStatus;
  keyTakeaways?: string[];
  naiveLatencyMs?: number;
  optimizedLatencyMs?: number;
  naiveRps?: number;
  optimizedRps?: number;
}
