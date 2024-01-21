import React, { ChangeEvent } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  HStack,
  Container,
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

  //   React.useEffect(() => {
  //     console.log("===================");
  //     console.log(savedExercises);
  //     console.log("===================");
  //   }, [savedExercises]);

  return (
    <Container
      w="100%"
      display="flex"
      flexDirection={"column"}
      p="1rem 3rem 3rem 2rem"
    >
      <HStack mb="1rem" w="100%">
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
      {/* {savedExercises.map((savedExercise) => (
        <NewExercise
          exercise={savedExercise}
          setSavedExercises={() => setSavedExercises}
        />
      ))} */}
      {savedExercises.map((savedExercise) => (
        <NewExercise
          key={savedExercise.uid}
          exercise={savedExercise}
          setSavedExercises={(updatedExercise) => {
            const updatedExercises = savedExercises.map((exercise) =>
              exercise.uid === updatedExercise.uid ? updatedExercise : exercise
            );
            setSavedExercises(updatedExercises);
          }}
        />
      ))}
    </Container>
  );
}
