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
  FormErrorMessage,
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
import useWorkoutsWithExercises from "../Hooks/useWorkoutsWithExercises";
import {
  convertFrontendDateToTimestamp,
  objectsEqual,
} from "../Functions/Helpers";

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
  openExerciseUnEditable,
}: {
  setShowNewWorkout: (val: boolean) => void;
  workoutWithExercises?: WorkoutWithExercisesType;
  openExerciseUnEditable?: boolean;
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
  const { setWorkoutsWithExercises } = useWorkoutsWithExercises(
    loggedInUser.uid
  );
  const [exercisesBeingEdited, setExercisesBeingEdited] = React.useState(
    openExerciseUnEditable ? 0 : savedExercises.length
  );
  const [saveWorkoutResponse, setSaveWorkoutResponse] = React.useState({
    dataIsSafe: false,
    reason: "uninitialized",
  });

  const onMountWorkoutWithExercises = React.useRef(workoutWithExercises);
  function handleCancel() {
    if (onMountWorkoutWithExercises.current !== undefined) {
      setWorkoutsWithExercises([onMountWorkoutWithExercises.current]);
    }
    setShowNewWorkout(false);
  }

  function workoutWithExercisesChanged() {
    const cur = {
      comment: workoutState.comment,
      date: convertFrontendDateToTimestamp(workoutState.date),
      uid: workoutState.uid,
      userUid: workoutState.userUid,
      exercises: savedExercises,
    };

    return !objectsEqual(onMountWorkoutWithExercises.current, cur);
  }

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
  }, [workoutWithExercises]);

  function handleWorkoutChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setWorkoutState((prevWorkoutState) => ({
      ...prevWorkoutState,
      [name]: value,
    }));
  }

  const handleValidateAndSaveWorkout = async () => {
    const editingAnExistingWorkout = workoutWithExercises ? true : false;

    const passOrFail = await validateAndSaveWorkout(
      workoutState,
      savedExercises,
      setShowNewWorkout,
      loggedInUser,
      editingAnExistingWorkout
    );
    setSaveWorkoutResponse(passOrFail);
  };

  const addNewExercise = async () => {
    if (!openExerciseUnEditable) {
      setExercisesBeingEdited(
        (prevExercisesBeingEdited) => prevExercisesBeingEdited + 1
      );
    }
    const newExerciseUid = await generateUid();
    const newExercise: ExerciseType = {
      comment: "",
      isEmom: false,
      isLadder: false,
      reps: "0",
      sets: 0,
      title: "",
      uid: newExerciseUid,
      workoutUid: workoutState.uid,
      weight: 0,
      weightUnit: "kg",
      index: savedExercises.length,
    };
    setSavedExercises((prevExercises) => [newExercise, ...prevExercises]);
  };

  function bumpExerciseIndex(upOrDown: "up" | "down", index: number) {
    if (index >= savedExercises.length) {
      console.log("You passed an index to bumpExerciseIndex that is too high.");
      return;
    }

    if (savedExercises.length <= 1) {
      console.log("Cannot bump exercise up or down when the length is <= 1.");
      return;
    }

    const bumpedExercises = [...savedExercises];

    if (upOrDown === "down" && index < savedExercises.length - 1) {
      [bumpedExercises[index], bumpedExercises[index + 1]] = [
        bumpedExercises[index + 1],
        bumpedExercises[index],
      ];
      bumpedExercises[index].index = index;
      bumpedExercises[index + 1].index = index + 1;
    } else if (upOrDown === "up" && index > 0) {
      [bumpedExercises[index - 1], bumpedExercises[index]] = [
        bumpedExercises[index],
        bumpedExercises[index - 1],
      ];
      bumpedExercises[index].index = index;
      bumpedExercises[index - 1].index = index - 1;
    }

    setSavedExercises(bumpedExercises);
  }

  return (
    <Box
      position={workoutWithExercises ? "relative" : "fixed"}
      top={workoutWithExercises ? "" : ["85", "50"]}
      w="100%"
      h={["calc(100% - 85px)", "calc(100% - 50px)"]}
      overflow="auto"
      bg="rgba(255, 255, 255, 0.4)"
    >
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
                <FormLabel fontSize={["sm", "lg"]}>Workout Date</FormLabel>
                <Input
                  size={["sm", "lg"]}
                  name="date"
                  type="date"
                  maxW="180px"
                  value={workoutState.date}
                  onChange={handleWorkoutChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize={["sm", "lg"]}>Comment</FormLabel>
                <Input
                  size={["sm", "lg"]}
                  name="comment"
                  type="text"
                  value={workoutState.comment}
                  onChange={handleWorkoutChange}
                />
              </FormControl>
            </HStack>
            <br />

            <FormControl
              isInvalid={
                saveWorkoutResponse.dataIsSafe === false &&
                saveWorkoutResponse.reason !== "uninitialized"
              }
            >
              <HStack w="100%" mb="0.5rem" justifyContent={"space-around"}>
                <Button
                  size={["sm", "lg"]}
                  isDisabled={
                    savedExercises.length < 1 ||
                    !workoutWithExercisesChanged() ||
                    exercisesBeingEdited !== 0 ||
                    savedExercises.some(
                      (exercise) =>
                        !validateExerciseFormFields(exercise).validExercise
                    )
                  }
                  onClick={handleValidateAndSaveWorkout}
                >
                  Save Workout
                </Button>
                {workoutWithExercises && (
                  <Button size={["sm", "lg"]} onClick={handleCancel}>
                    Cancel
                  </Button>
                )}

                <Button size={["sm", "lg"]} onClick={addNewExercise}>
                  Add Exercise
                </Button>
              </HStack>
              <FormErrorMessage mx="0.5rem">
                {saveWorkoutResponse.reason}
              </FormErrorMessage>
            </FormControl>

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
                    openExerciseUnEditable={openExerciseUnEditable}
                    exercise={savedExercise}
                    savedExercisesLength={savedExercises.length ?? 0}
                    setExercisesBeingEdited={setExercisesBeingEdited}
                    setSavedExercises={(updatedExercise, action) => {
                      if (action === "delete") {
                        const updatedExercises = savedExercises.filter(
                          (exercise) => exercise.uid !== updatedExercise.uid
                        );
                        setSavedExercises(updatedExercises);
                      } else {
                        const updatedExercises = savedExercises.map(
                          (exercise) =>
                            exercise.uid === updatedExercise.uid
                              ? updatedExercise
                              : exercise
                        );
                        setSavedExercises(updatedExercises);
                      }
                    }}
                    bumpExerciseIndex={bumpExerciseIndex}
                  />
                </MotionBox>
              ))}
            </AnimatePresence>
          </>
        )}
      </Container>
    </Box>
  );
}
