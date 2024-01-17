import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  ExerciseType,
  WorkoutType,
  WorkoutWithExercisesType,
} from "../Types/types";

const useWorkoutsWithExercises = (userUid: string) => {
  const [workoutsWithExercises, setWorkoutsWithExercises] = useState<
    WorkoutWithExercisesType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkoutsAndExercises = async () => {
      try {
        const db = getFirestore();
        const workoutsCollection = collection(db, "workouts");
        const workoutsQuery = query(
          workoutsCollection,
          where("userUid", "==", userUid)
        );
        const workoutsSnapshot = await getDocs(workoutsQuery);

        const fetchedWorkoutsWithExercises: WorkoutWithExercisesType[] = [];

        // Loop through each workout
        for (const workoutDoc of workoutsSnapshot.docs) {
          const workoutData: WorkoutType = {
            ...(workoutDoc.data() as WorkoutType),
          };

          // Fetch exercises for the current workout
          const exercisesCollection = collection(db, "exercises");
          const exercisesQuery = query(
            exercisesCollection,
            where("workoutUid", "==", workoutData.uid)
          );
          const exercisesSnapshot = await getDocs(exercisesQuery);

          const fetchedExercises: ExerciseType[] = [];
          exercisesSnapshot.forEach((exerciseDoc) => {
            fetchedExercises.push({
              ...(exerciseDoc.data() as ExerciseType),
            });
          });

          // Combine workout data with exercises
          const workoutWithExercises = {
            ...workoutData,
            exercises: fetchedExercises,
          };
          fetchedWorkoutsWithExercises.push(workoutWithExercises);
        }

        setWorkoutsWithExercises(fetchedWorkoutsWithExercises);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching workout and exercise data:", error);
        setIsLoading(false);
      }
    };

    fetchWorkoutsAndExercises();
  }, [userUid]);

  return { workoutsWithExercises, isLoading };
};

export default useWorkoutsWithExercises;
