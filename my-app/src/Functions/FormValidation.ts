import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { ExerciseType, WorkoutType } from "../Types/types";
import { uidInSnapshot } from "./Helpers";

export function validateEmomAndLadder(emom: boolean, ladder: boolean): boolean {
  const bothSelected = emom && ladder;
  return bothSelected;
}

export function validateExerciseFormFields(exercise: ExerciseType): {
  validExercise: boolean;
  reason: string;
} {
  const { title, sets, reps, weight, weightUnit, isEmom, isLadder } = exercise;
  let result = {
    validExercise: false,
    reason: "initialized",
  };
  if (validateEmomAndLadder(isEmom, isLadder)) {
    result = {
      validExercise: false,
      reason: "Cannot select EMOM and Ladder",
    };
    return result;
  } else if (isEmom && (!reps || !sets || !weight || !weightUnit)) {
    result = {
      validExercise: false,
      reason:
        "EMOM selected. Reps, sets, weight and weightUnit must also be included.",
    };
    return result;
  } else if (isLadder && (!reps || !sets || !weight || !weightUnit)) {
    result = {
      validExercise: false,
      reason:
        "Ladder selected. Reps, sets, weight and weightUnit must also be included.",
    };
    return result;
  } else if (sets > 0 && (reps.length <= 0 || weightUnit.length <= 0)) {
    result = {
      validExercise: false,
      reason:
        "Sets are included. Reps, Weight and Weight Unit must be as well.",
    };
    return result;
  } else if (reps.length > 0 && (sets <= 0 || weightUnit.length <= 0)) {
    result = {
      validExercise: false,
      reason:
        "Reps are included. Sets, Weight and Weight Unit must be as well.",
    };
    return result;
  } else if (weightUnit.length > 0 && (reps.length <= 0 || sets <= 0)) {
    result = {
      validExercise: false,
      reason: "Weight Unit selected. Sets, Reps and Weight must be as well.",
    };
    return result;
  } else if (
    weight > 0 &&
    (reps.length <= 0 || sets <= 0 || weightUnit.length <= 0)
  ) {
    result = {
      validExercise: false,
      reason: "Weight included. Sets, reps and Weight Unit must be as well.",
    };
    return result;
  } else if (title.length <= 0) {
    result = {
      validExercise: false,
      reason: "Exercise title must be defined.",
    };
    return result;
  } else {
    result = {
      validExercise: true,
      reason: "",
    };
    return result;
  }
}

export function validateWorkoutDate(workout: WorkoutType): boolean {
  const YYYYMMDDRegex = /^\d{4}-\d{2}-\d{2}$/;
  return YYYYMMDDRegex.test(workout.date);
}

export function safeToSendWorkoutAndExercisesToDB(
  workout: WorkoutType,
  exercises: ExerciseType[],
  loggedInUser: any,
  editingAnExistingWorkout: boolean,
  workoutsSnapshot: QuerySnapshot<DocumentData, DocumentData>,
  exercisesSnapshot: QuerySnapshot<DocumentData, DocumentData>,
  usersSnapshot: QuerySnapshot<DocumentData, DocumentData>
): { dataIsSafe: boolean; reason: string } {
  let result;
  let uids = [];

  for (const exercise of exercises) {
    const exerciseValidity = validateExerciseFormFields(exercise);
    if (!exerciseValidity.validExercise) {
      result = {
        dataIsSafe: false,
        reason: `${exercise} is invalid: ${exerciseValidity.reason}`,
      };
      return result;
    }

    if (
      exercise.weightUnit !== "lb" &&
      exercise.weightUnit !== "kg" &&
      exercise.weightUnit !== ""
    ) {
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

  if (!editingAnExistingWorkout) {
    for (const uid of uids) {
      if (
        uidInSnapshot(uid, workoutsSnapshot) ||
        uidInSnapshot(uid, exercisesSnapshot) ||
        uidInSnapshot(uid, usersSnapshot)
      ) {
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
