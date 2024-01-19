export type UserType = {
  displayName: string;
  email: string;
  uid: string;
};

export type WorkoutType = {
  comment: string;
  date: any;
  uid: string;
  userUid: string;
};

export type ExerciseType = {
  comment: string;
  isEmom: boolean;
  isLadder: boolean;
  reps: string;
  sets: number;
  title: string;
  uid: string;
  workoutUid: string;
  weight: number;
  weightUnit: string;
};

export type WorkoutWithExercisesType = WorkoutType & {
  exercises: ExerciseType[];
  docUid?: string;
};
