import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
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
    const db = getFirestore();
    const workoutsCollection = collection(db, "workouts");
    const workoutsQuery = query(
      workoutsCollection,
      where("userUid", "==", userUid),
      orderBy("date", "desc")
    );

    const fetchWorkoutsAndExercises = async () => {
      try {
        const workoutsSnapshot = await getDocs(workoutsQuery);
        const fetchedWorkoutsWithExercises: WorkoutWithExercisesType[] = [];

        for (const workoutDoc of workoutsSnapshot.docs) {
          const workoutData: WorkoutType = {
            ...(workoutDoc.data() as WorkoutType),
          };

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

    const unsubscribe = onSnapshot(workoutsQuery, () => {
      fetchWorkoutsAndExercises();
    });

    return () => {
      unsubscribe();
    };
    // TODO: Need to fix this hook to make it refetch every time an exercise is updated
    // currently only refetches when a workout updates
  }, [userUid]);

  return { workoutsWithExercises, setWorkoutsWithExercises, isLoading };
};

export default useWorkoutsWithExercises;
