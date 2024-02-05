import { useState, useEffect } from "react";
import { safeToSendWorkoutAndExercisesToDB } from "../Functions/FormValidation";
import {
  getCollectionSnapshotByName,
  mutateExistingWorkoutWithExercisesToDB,
  sendNewWorkoutWithExercisesToDB,
} from "../Functions/Helpers";
import { ExerciseType, WorkoutType } from "../Types/types";
import { DocumentData, QuerySnapshot } from "firebase/firestore";

const useValidateAndSaveWorkout = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [workoutsSnapshot, setWorkoutsSnapshot] = useState<QuerySnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [exercisesSnapshot, setExercisesSnapshot] = useState<QuerySnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [usersSnapshot, setUsersSnapshot] = useState<QuerySnapshot<
    DocumentData,
    DocumentData
  > | null>(null);

  // Fetch all collections a single time
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutsSnapshotPromise = getCollectionSnapshotByName("workouts");
        const exercisesSnapshotPromise =
          getCollectionSnapshotByName("exercises");
        const usersSnapshotPromise = getCollectionSnapshotByName("users");

        const [
          fetchedWorkoutsSnapshot,
          fetchedExercisesSnapshot,
          fetchedUsersSnapshot,
        ] = await Promise.all([
          workoutsSnapshotPromise,
          exercisesSnapshotPromise,
          usersSnapshotPromise,
        ]);

        setWorkoutsSnapshot(fetchedWorkoutsSnapshot);
        setExercisesSnapshot(fetchedExercisesSnapshot);
        setUsersSnapshot(fetchedUsersSnapshot);
      } catch (error) {
        console.error("Error fetching data on mount:", error);
      }
    };

    fetchData();
  }, []);

  const validateAndSaveWorkout = async (
    workoutState: WorkoutType,
    savedExercises: ExerciseType[],
    setShowNewWorkout: (val: boolean) => void,
    loggedInUser: any,
    editingAnExistingWorkout: boolean
  ): Promise<{ dataIsSafe: boolean; reason: string }> => {
    setIsSaving(true);

    let passOrFail = { dataIsSafe: false, reason: "uninitialized" };

    try {
      passOrFail = await safeToSendWorkoutAndExercisesToDB(
        workoutState,
        savedExercises,
        loggedInUser,
        editingAnExistingWorkout,
        workoutsSnapshot!,
        exercisesSnapshot!,
        usersSnapshot!
      );

      if (passOrFail.dataIsSafe) {
        if (editingAnExistingWorkout) {
          await mutateExistingWorkoutWithExercisesToDB(
            workoutState,
            savedExercises,
            exercisesSnapshot!
          );
        } else {
          await sendNewWorkoutWithExercisesToDB(workoutState, savedExercises);
        }
        setShowNewWorkout(false);
      } else {
        console.log(`DB Write failed: ${passOrFail.reason}`);
      }
    } catch (error) {
      passOrFail = {
        dataIsSafe: false,
        reason: `DB Write failed: ${error}`,
      };
    } finally {
      setIsSaving(false);
      return passOrFail;
    }
  };

  return { validateAndSaveWorkout, isSaving };
};

export default useValidateAndSaveWorkout;
