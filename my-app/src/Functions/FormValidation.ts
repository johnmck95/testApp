import { ExerciseType, WorkoutType } from "../Types/types";
import { checkUidExists } from "./Helpers";

export function validateStringField(value: string): boolean {
  return value.length > 0 ? true : false;
}

export function validateNumericalField(value: number): boolean {
  return value > 0 ? true : false;
}

export function validateEmomAndLadder(emom: boolean, ladder: boolean): boolean {
  const bothSelected = emom && ladder;
  return bothSelected;
}

// Returns true if title, reps, sets or weight missing, or is isEmom and isLadder both selected
export function validateExerciseFormFields(exercise: ExerciseType): boolean {
  const { title, sets, reps, weight, isEmom, isLadder } = exercise;
  if (
    !sets ||
    !weight ||
    !validateStringField(title) ||
    !validateStringField(reps) ||
    !validateNumericalField(sets!) ||
    !validateNumericalField(weight!) ||
    validateEmomAndLadder(isEmom, isLadder)
  ) {
    return true;
  } else {
    return false;
  }
}

export function validateWorkoutDate(workout: WorkoutType): boolean {
  const YYYYMMDDRegex = /^\d{4}-\d{2}-\d{2}$/;
  return YYYYMMDDRegex.test(workout.date);
}

export async function safeToSendWorkoutAndExercisesToDB(
  workout: WorkoutType,
  exercises: ExerciseType[],
  loggedInUser: any,
  editingAnExistingWorkout: boolean
): Promise<{ dataIsSafe: boolean; reason: string }> {
  let result;
  let uids = [];

  for (const exercise of exercises) {
    if (validateExerciseFormFields(exercise)) {
      result = {
        dataIsSafe: false,
        reason: `${exercise} failed validateExerciseFormFields()`,
      };
      return result;
    }

    if (exercise.weightUnit !== "lb" && exercise.weightUnit !== "kg") {
      result = {
        dataIsSafe: false,
        reason: `${exercise} has invalid weightUnit`,
      };
      return result;
    }

    if (exercise.uid.length < 0) {
      result = {
        dataIsSafe: false,
        reason: `${exercise} exercise is missing a uid`,
      };
      return result;
    }

    if (exercise.workoutUid !== workout.uid) {
      result = {
        dataIsSafe: false,
        reason: `${exercise} exercise.workoutUid !== workout.uid`,
      };
      return result;
    }

    uids.push(exercise.uid);
  }

  if (!validateWorkoutDate(workout)) {
    result = {
      dataIsSafe: false,
      reason: `${workout} date is not of valid frontend YYYY-MM-DD form`,
    };
    return result;
  }

  if (workout.uid.length < 0) {
    result = {
      dataIsSafe: false,
      reason: `${workout} is missing a uid`,
    };
    return result;
  }

  if (workout.userUid !== loggedInUser.uid) {
    result = {
      dataIsSafe: false,
      reason: `${workout} userUid should be the same as the loggedInUser.uid}`,
    };
    return result;
  }

  uids.push(workout.uid);
  uids.push(workout.userUid);

  if (new Set(uids).size !== uids.length) {
    result = {
      dataIsSafe: false,
      reason: `non-unique uids detected`,
    };
    return result;
  }

  uids = uids.filter((uid) => uid !== workout.userUid);

  // Only check for unique UIDs if it is a new workout
  if (!editingAnExistingWorkout) {
    for (const uid of uids) {
      if (await checkUidExists(uid)) {
        result = {
          dataIsSafe: false,
          reason: `${uid} already exists somewhere in the database`,
        };
        return result;
      }
    }
  }

  return { dataIsSafe: true, reason: "no issues detected" };
}
