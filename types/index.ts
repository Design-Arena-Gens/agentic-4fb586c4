export type Quadrant =
  | 'urgent-important'
  | 'not-urgent-important'
  | 'urgent-not-important'
  | 'not-urgent-not-important';

export interface Task {
  id: string;
  title: string;
  quadrant: Quadrant;
  completed: boolean;
  createdAt: Date;
}
