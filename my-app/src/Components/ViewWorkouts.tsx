import React from "react";
import { Flex } from "@chakra-ui/react";
import useWorkoutsWithExercises from "../Hooks/useWorkoutsWithExercises";

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
  const { workoutsWithExercises, isLoading } = useWorkoutsWithExercises("abc");

  console.log(workoutsWithExercises);
  return (
    <Flex>
      <h1>View Workouts</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        workoutsWithExercises.map((entry) => (
          <p key={entry.uid}>{JSON.stringify(entry)}</p>
        ))
      )}
    </Flex>
  );
}
