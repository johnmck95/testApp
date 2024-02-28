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
  QuerySnapshot,
} from "firebase/firestore";
import { ExerciseType, WorkoutType } from "../Types/types";

// Convert "yyyy-mm-dd" to Firebase Timestamp
export const convertFrontendDateToTimestamp = (frontendDate: string) => {
  const [year, month, day] = frontendDate.split("-").map(Number);
  const timestamp = Timestamp.fromDate(new Date(year, month - 1, day));
  return timestamp;
};

export async function getCollectionSnapshotByName(
  collectionName: string
): Promise<QuerySnapshot<DocumentData, DocumentData>> {
  const db = getFirestore();
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef);
  const snapshot = await getDocs(q);
  return snapshot;
}

export function uidInSnapshot(
  uid: string,
  snapshot: QuerySnapshot<DocumentData, DocumentData>
): boolean {
  const snapshotUids = snapshot.docs.map((doc) => doc.data().uid);
  return snapshotUids.includes(uid);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  exercisesSnapshot: QuerySnapshot<DocumentData, DocumentData>,
  exercise: ExerciseType
) {
  try {
    const docs = exercisesSnapshot.docs;
    for (const doc of docs) {
      const data = doc.data();
      if (data && data.uid === exercise.uid) {
        await setDoc(doc.ref, exercise);
      }
    }
  } catch (e) {
    console.log(
      `Failed to mutate ${exercise} in DB collection with error: ${e}`
    );
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
  exercises: ExerciseType[],
  exercisesSnapshot: QuerySnapshot<DocumentData, DocumentData>
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

    // const snapshotUids = exercisesSnapshot.docs.map((doc) => doc.data().uid);

    const exerciseCollection = collection(db, "exercises");
    for (const exercise of exercises) {
      uidInSnapshot(exercise.uid, exercisesSnapshot)
        ? await mutateExerciseInDB(exercisesSnapshot, exercise)
        : await addExerciseToDB(exerciseCollection, exercise);
    }
  } catch (e) {
    console.error("Error editing workoutWithExercises:", e);
  }
}

export function objectsEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !objectsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function parseRepsPerSet(exercise: ExerciseType): number {
  const { reps, isLadder } = exercise;

  const parsedReps: string[] = reps
    .replace(/[^0-9]/g, ",")
    .split(",")
    .filter((num) => num.length > 0);

  let totalRepsPerSet = parsedReps.reduce((accumulated, number) => {
    return accumulated + parseInt(number, 10);
  }, 0);

  totalRepsPerSet = isLadder ? totalRepsPerSet * 2 : totalRepsPerSet;
  return totalRepsPerSet;
}

export function totalReps(exercise: ExerciseType): number {
  const { sets } = exercise;

  const totalRepsPerSet = parseRepsPerSet(exercise);

  return sets * totalRepsPerSet;
}

export function workCapacity(exercise: ExerciseType): number {
  return totalReps(exercise) * exercise.weight;
}

// EX: 4x(1,2,3,4) = 16 total sets.
export function totalLadderSets(exercise: ExerciseType): number {
  const { reps, sets } = exercise;
  const parsedReps: string[] = reps
    .replace(/[^0-9]/g, ",")
    .split(",")
    .filter((num) => num.length > 0);

  return parsedReps.length * sets;
}
