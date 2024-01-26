import React, { ChangeEvent } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  HStack,
  Container,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import {
  ExerciseType,
  WorkoutType,
  WorkoutWithExercisesType,
} from "../Types/types";
import FirebaseContext from "../App";
import NewExercise from "./NewExercise";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { validateExerciseFormFields } from "../Functions/FormValidation";
import useValidateAndSaveWorkout from "../Hooks/useValidateAndSaveWorkout";
import LoadingSpinner from "./LoadingSpinner";

const MotionBox = motion(Box);

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

async function generateUid(): Promise<string> {
  const db = getFirestore();
  const uid = (await addDoc(collection(db, "uidGenerator"), {})).id;
  await deleteDoc(doc(db, "uidGenerator", uid));
  return uid;
}

export default function NewWorkout({
  setShowNewWorkout,
  workoutWithExercises,
}: {
  setShowNewWorkout: (val: boolean) => void;
  workoutWithExercises?: WorkoutWithExercisesType;
}) {
  const { validateAndSaveWorkout, isSaving } = useValidateAndSaveWorkout();
  const { loggedInUser } = React.useContext(FirebaseContext);
  const [workoutState, setWorkoutState] = React.useState<WorkoutType>({
    comment: workoutWithExercises?.comment ?? "",
    date:
      workoutWithExercises?.date.toDate().toISOString().substring(0, 10) ??
      getCurrentDate(),
    uid: workoutWithExercises?.uid ?? "",
    userUid: workoutWithExercises?.userUid ?? loggedInUser.uid,
  });
  const [savedExercises, setSavedExercises] = React.useState<ExerciseType[]>(
    workoutWithExercises?.exercises ?? []
  );

  React.useEffect(() => {
    const initializeState = async () => {
      if (workoutWithExercises) {
        return;
      }
      const workoutUid = await generateUid();
      setWorkoutState((prev) => ({ ...prev, uid: workoutUid }));
      setSavedExercises([]);
    };
    initializeState();
  }, []);

  function handleWorkoutChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setWorkoutState((prevWorkoutState) => ({
      ...prevWorkoutState,
      [name]: value,
    }));
  }

  const handleValidateAndSaveWorkout = () => {
    const editingAnExistingWorkout = workoutWithExercises ? true : false;

    validateAndSaveWorkout(
      workoutState,
      savedExercises,
      setShowNewWorkout,
      loggedInUser,
      editingAnExistingWorkout
    );
  };

  const addNewExercise = async () => {
    const newExerciseUid = await generateUid();
    const newExercise: ExerciseType = {
      comment: "",
      isEmom: false,
      isLadder: false,
      reps: "",
      sets: undefined,
      title: "",
      uid: newExerciseUid,
      workoutUid: workoutState.uid,
      weight: undefined,
      weightUnit: "kg",
    };
    setSavedExercises((prevExercises) => [newExercise, ...prevExercises]);
  };

  return (
    <Container
      w="100%"
      display="flex"
      flexDirection={"column"}
      p="1rem 3rem 3rem 2rem"
      borderRadius="10px"
      padding="15px"
      my="2rem"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
    >
      {isSaving ? (
        <Flex
          w="100%"
          justifyContent={"center"}
          alignItems={"center"}
          my="5rem"
        >
          <LoadingSpinner />
        </Flex>
      ) : (
        <>
          <HStack w="100%" alignItems={"flex-end"}>
            <FormControl>
              <FormLabel>Workout Date</FormLabel>
              <Input
                name="date"
                type="date"
                maxW="180px"
                value={workoutState.date}
                onChange={handleWorkoutChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Comment</FormLabel>
              <Input
                name="comment"
                type="text"
                value={workoutState.comment}
                onChange={handleWorkoutChange}
              />
            </FormControl>
          </HStack>
          <br />

          <HStack w="100%" mt="1rem" mb="2rem" justifyContent={"space-between"}>
            <Button
              isDisabled={
                savedExercises.length < 1 ||
                !savedExercises.every(
                  (exercise) => !validateExerciseFormFields(exercise)
                )
              }
              onClick={handleValidateAndSaveWorkout}
            >
              Save Workout
            </Button>
            <Button onClick={addNewExercise}>Add Exercise</Button>
          </HStack>

          <AnimatePresence>
            {savedExercises.map((savedExercise) => (
              <MotionBox
                key={savedExercise.uid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <NewExercise
                  key={savedExercise.uid}
                  exercise={savedExercise}
                  setSavedExercises={(updatedExercise, action) => {
                    if (action === "delete") {
                      const updatedExercises = savedExercises.filter(
                        (exercise) => exercise.uid !== updatedExercise.uid
                      );
                      setSavedExercises(updatedExercises);
                    } else {
                      const updatedExercises = savedExercises.map((exercise) =>
                        exercise.uid === updatedExercise.uid
                          ? updatedExercise
                          : exercise
                      );
                      setSavedExercises(updatedExercises);
                    }
                  }}
                />
              </MotionBox>
            ))}
          </AnimatePresence>
        </>
      )}
    </Container>
  );
}
