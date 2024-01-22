import React, { ChangeEvent } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Container,
  Button,
  Box,
} from "@chakra-ui/react";
import { ExerciseType, WorkoutType } from "../Types/types";
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
import { safeToSendWorkoutAndExercisesToDB } from "../Functions/FormValidation";
import { sendNewWorkoutWithExercisesToDB } from "../Functions/Helpers";

const MotionBox = motion(Box);

//   /** WRITES apple to the 'things' collection DB **/
//   React.useEffect(() => {
//     async function writeData() {
//       const thingsRef = collection(db, "things");
//       await setDoc(doc(thingsRef, "apple"), {
//         name: "Apple",
//         food: true,
//       });
//     }
//     writeData();
//   });
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

export default function NewWorkout() {
  const { loggedInUser } = React.useContext(FirebaseContext);
  const [workoutState, setWorkoutState] = React.useState<WorkoutType>({
    comment: "",
    date: getCurrentDate(),
    uid: "",
    userUid: loggedInUser.uid,
  });
  const [savedExercises, setSavedExercises] = React.useState<ExerciseType[]>(
    []
  );

  React.useEffect(() => {
    const initializeState = async () => {
      const workoutUid = await generateUid();
      const exerciseUid = await generateUid();
      setWorkoutState((prev) => ({ ...prev, uid: workoutUid }));
      setSavedExercises([
        {
          comment: "",
          isEmom: false,
          isLadder: false,
          reps: "",
          sets: 0,
          title: "",
          uid: exerciseUid,
          workoutUid,
          weight: 0,
          weightUnit: "kg",
        },
      ]);
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

  async function validateAndSaveWorkout() {
    const passOrFail = await safeToSendWorkoutAndExercisesToDB(
      workoutState,
      savedExercises,
      loggedInUser
    );

    if (passOrFail.dataIsSafe) {
      await sendNewWorkoutWithExercisesToDB(workoutState, savedExercises);
    } else {
      console.log(`DB Write failed: ${passOrFail.reason}`);
    }
  }

  const addNewExercise = async () => {
    const newExerciseUid = await generateUid();
    const newExercise: ExerciseType = {
      comment: "",
      isEmom: false,
      isLadder: false,
      reps: "",
      sets: 0,
      title: "",
      uid: newExerciseUid,
      workoutUid: workoutState.uid,
      weight: 0,
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
    >
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
      </HStack>
      <br />

      <HStack w="100%" mt="1rem" mb="2rem" justifyContent={"space-between"}>
        <Button onClick={addNewExercise}>Add Exercise</Button>
        <Button onClick={validateAndSaveWorkout}> Save Workout </Button>
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
    </Container>
  );
}
