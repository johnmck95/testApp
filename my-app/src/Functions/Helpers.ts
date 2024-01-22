import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import FirebaseContext from "../App";
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

export async function sendNewWorkoutWithExercisesToDB(
  workout: WorkoutType,
  exercises: ExerciseType[]
) {
  const workoutBackend = {
    ...workout,
    date: convertFrontendDateToTimestamp(workout.date),
  };

  const db = getFirestore();

  const workoutsCollection = collection(db, "workouts");
  await addDoc(workoutsCollection, workoutBackend);

  const exercisesCollection = collection(db, "exercises");
  await Promise.all(
    exercises.map((exercise) => addDoc(exercisesCollection, exercise))
  );
}
