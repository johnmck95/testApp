import React from "react";
import { Flex } from "@chakra-ui/react";
import useWorkoutsWithExercises from "../Hooks/useWorkoutsWithExercises";
import FirebaseContext from "../App";

export default function ViewWorkouts() {
  const { loggedInUser } = React.useContext(FirebaseContext);
  const { workoutsWithExercises, isLoading } = useWorkoutsWithExercises(
    loggedInUser.uid
  );

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
