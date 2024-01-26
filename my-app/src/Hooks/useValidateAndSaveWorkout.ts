import { useState } from "react";
import { safeToSendWorkoutAndExercisesToDB } from "../Functions/FormValidation";
import {
  mutateExistingWorkoutWithExercisesToDB,
  sendNewWorkoutWithExercisesToDB,
} from "../Functions/Helpers";
import { ExerciseType, WorkoutType } from "../Types/types";

const useValidateAndSaveWorkout = () => {
  const [isSaving, setIsSaving] = useState(false);

  const validateAndSaveWorkout = async (
    workoutState: WorkoutType,
    savedExercises: ExerciseType[],
    setShowNewWorkout: (val: boolean) => void,
    loggedInUser: any,
    editingAnExistingWorkout: boolean
  ) => {
    setIsSaving(true);

    try {
      const passOrFail = await safeToSendWorkoutAndExercisesToDB(
        workoutState,
        savedExercises,
        loggedInUser,
        editingAnExistingWorkout
      );

      if (passOrFail.dataIsSafe) {
        if (editingAnExistingWorkout) {
          await mutateExistingWorkoutWithExercisesToDB(
            workoutState,
            savedExercises
          );
        } else {
          await sendNewWorkoutWithExercisesToDB(workoutState, savedExercises);
        }
        setShowNewWorkout(false);
      } else {
        console.log(`DB Write failed: ${passOrFail.reason}`);
      }
    } catch (error) {
      console.error("Error saving workout:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return { validateAndSaveWorkout, isSaving };
};

export default useValidateAndSaveWorkout;
