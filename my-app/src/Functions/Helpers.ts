import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  Timestamp,
  addDoc,
  setDoc,
  CollectionReference,
  DocumentData,
  deleteDoc,
} from "firebase/firestore";
import { ExerciseType, WorkoutType } from "../Types/types";

// Convert "yyyy-mm-dd" to Firebase Timestamp
export const convertFrontendDateToTimestamp = (frontendDate: string) => {
  const [year, month, day] = frontendDate.split("-").map(Number);
  const timestamp = Timestamp.fromDate(new Date(year, month - 1, day));
  return timestamp;
};

export async function checkUidExists(uid: string): Promise<boolean> {
  const db = getFirestore();

  // Check 'workouts' collection
  const workoutsCollection = collection(db, "workouts");
  const workoutsQuery = query(workoutsCollection, where("uid", "==", uid));
  const workoutsSnapshot = await getDocs(workoutsQuery);
  if (!workoutsSnapshot.empty) {
    return true;
  }

  // Check 'users' collection
  const usersCollection = collection(db, "users");
  const usersQuery = query(usersCollection, where("uid", "==", uid));
  const usersSnapshot = await getDocs(usersQuery);
  if (!usersSnapshot.empty) {
    return true;
  }

  // Check 'exercises' collection
  const exercisesCollection = collection(db, "exercises");
  const exercisesQuery = query(exercisesCollection, where("uid", "==", uid));
  const exercisesSnapshot = await getDocs(exercisesQuery);
  if (!exercisesSnapshot.empty) {
    return true;
  }

  // UID not found in any collection
  return false;
}

async function addExerciseToDB(
  exercisesCollection: CollectionReference<DocumentData, DocumentData>,
  exercise: ExerciseType
) {
  try {
    return await addDoc(exercisesCollection, exercise);
  } catch (e) {
    console.log(`Failed to write ${exercise} to DB with error: ${e}`);
  }
}

async function mutateExerciseInDB(
  exercisesCollection: CollectionReference<DocumentData, DocumentData>,
  exercise: ExerciseType
) {
  try {
    const exerciseQuery = query(
      exercisesCollection,
      where("uid", "==", exercise.uid)
    );
    const exerciseQuerySnapshot = await getDocs(exerciseQuery);

    return exerciseQuerySnapshot.forEach(async (doc) => {
      await setDoc(doc.ref, exercise);
    });
  } catch (e) {
    console.log(`Failed to write ${exercise} to DB with error: ${e}`);
  }
}

export async function deleteExerciseFromDB(exercise: ExerciseType) {
  const db = getFirestore();
  const exercisesCollection = collection(db, "exercises");

  const exercisesQuery = query(
    exercisesCollection,
    where("uid", "==", exercise.uid)
  );

  try {
    const exerciseQuerySnapshot = await getDocs(exercisesQuery);

    exerciseQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (e) {
    console.log(`An error occurred while deleting ${exercise}. Error: ${e}`);
  }
}

export async function sendNewWorkoutWithExercisesToDB(
  workout: WorkoutType,
  exercises: ExerciseType[]
) {
  const db = getFirestore();
  const workoutBackend = {
    ...workout,
    date: convertFrontendDateToTimestamp(workout.date),
  };

  const workoutsCollection = collection(db, "workouts");
  await addDoc(workoutsCollection, workoutBackend);

  const exercisesCollection = collection(db, "exercises");
  await Promise.all(
    exercises.map((exercise) => addExerciseToDB(exercisesCollection, exercise))
  );
}

export async function mutateExistingWorkoutWithExercisesToDB(
  workout: WorkoutType,
  exercises: ExerciseType[]
) {
  try {
    const db = getFirestore();
    const workoutBackend = {
      ...workout,
      date: convertFrontendDateToTimestamp(workout.date),
    };
    const workoutsCollection = collection(db, "workouts");
    const workoutQuery = query(
      workoutsCollection,
      where("uid", "==", workout.uid)
    );
    const workoutQuerySnapshot = await getDocs(workoutQuery);
    workoutQuerySnapshot.forEach(async (doc) => {
      await setDoc(doc.ref, workoutBackend);
    });

    const exerciseCollection = collection(db, "exercises");
    for (const exercise of exercises) {
      const exerciseExists = await checkUidExists(exercise.uid);
      exerciseExists
        ? mutateExerciseInDB(exerciseCollection, exercise)
        : addExerciseToDB(exerciseCollection, exercise);
    }
  } catch (e) {
    console.error("Error editing workoutWithExercises:", e);
  }
}
