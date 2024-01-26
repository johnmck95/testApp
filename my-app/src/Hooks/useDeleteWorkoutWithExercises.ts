import { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { WorkoutWithExercisesType } from "../Types/types";
import { deleteExerciseFromDB } from "../Functions/Helpers";

function useDeleteWorkoutWithExercises() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteWorkoutWithExercises = async (
    workoutWithExercises: WorkoutWithExercisesType
  ) => {
    setIsDeleting(true);

    try {
      const db = getFirestore();
      const workoutsCollection = collection(db, "workouts");

      for (const exercise of workoutWithExercises.exercises) {
        await deleteExerciseFromDB(exercise);
      }

      const workoutQuery = query(
        workoutsCollection,
        where("uid", "==", workoutWithExercises.uid)
      );
      const workoutQuerySnapshot = await getDocs(workoutQuery);

      workoutQuerySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error deleting workoutWithExercises:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteWorkoutWithExercises, isDeleting };
}

export default useDeleteWorkoutWithExercises;
