import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ExerciseType } from "../Types/types";

const useExercises = (workoutUid: string) => {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [exercisesIsLoading, setExercisesIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const db = getFirestore();
        const exercisesCollection = collection(db, "exercises");
        const exercisesQuery = query(
          exercisesCollection,
          where("workoutUid", "==", workoutUid)
        );
        const querySnapshot = await getDocs(exercisesQuery);

        const fetchedExercises: ExerciseType[] = [];
        querySnapshot.forEach((doc) => {
          fetchedExercises.push({ ...(doc.data() as ExerciseType) });
        });

        setExercises(fetchedExercises);
        setExercisesIsLoading(false);
      } catch (error) {
        console.log("Error fetching exercise data:", error);
        setExercisesIsLoading(false);
      }
    };

    fetchExercises();
  }, [workoutUid]);

  return { exercises, exercisesIsLoading };
};

export default useExercises;
