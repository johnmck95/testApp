import React from "react";
import { Flex } from "@chakra-ui/react";
import useWorkouts from "../Hooks/useWorkouts";
import useExercises from "../Hooks/useExercises";

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

export default function ViewWorkouts() {
  //   const { loggedInUser } = React.useContext(FirebaseContext);
  const { workouts, workoutsIsLoading } = useWorkouts("abc");

  const { exercises, exercisesIsLoading } = useExercises("def");

  return (
    <Flex>
      <h1>View Workouts</h1>
      {workoutsIsLoading ? (
        <p>Loading...</p>
      ) : (
        workouts.map((workout) => (
          <p key={workout.id}>{JSON.stringify(workout)}</p>
        ))
      )}

      {exercisesIsLoading ? (
        <p>Loading...</p>
      ) : (
        exercises.map((exercise) => (
          <p key={exercise.id}>{JSON.stringify(exercise)}</p>
        ))
      )}
    </Flex>
  );
}
