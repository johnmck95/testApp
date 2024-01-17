export type UserType = {
  displayName: string;
  email: string;
  uid: string;
};

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export type WorkoutType = {
  comment: string;
  date: FirebaseTimestamp;
  uid: string;
  userUid: string;
};

export type ExerciseType = {
  comment: string;
  isEmom: boolean;
  isLadder: boolean;
  reps: number;
  sets: number;
  title: string;
  uid: string;
  workoutUid: string;
};

export type WorkoutWithExercisesType = WorkoutType & {
  exercises: ExerciseType[];
  docUid?: string;
};
