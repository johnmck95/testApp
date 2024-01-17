import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { WorkoutType } from "../Types/types";

const useWorkouts = (userUid: string) => {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [workoutsIsLoading, setWorkoutsIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const db = getFirestore();
        const workoutsCollection = collection(db, "workouts");
        const workoutsQuery = query(
          workoutsCollection,
          where("userUid", "==", userUid)
        );
        const querySnapshot = await getDocs(workoutsQuery);

        const fetchedWorkouts: WorkoutType[] = [];
        querySnapshot.forEach((doc) => {
          fetchedWorkouts.push({ ...(doc.data() as WorkoutType) });
        });

        setWorkouts(fetchedWorkouts);
        setWorkoutsIsLoading(false);
      } catch (error) {
        console.error("Error fetching workout data:", error);
        setWorkoutsIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [userUid]);

  return { workouts, workoutsIsLoading };
};

export default useWorkouts;
