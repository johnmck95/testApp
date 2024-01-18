import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import useWorkoutsWithExercises from "../Hooks/useWorkoutsWithExercises";
import FirebaseContext from "../App";
import Workout from "./Workout";

export default function ViewWorkouts() {
  const { loggedInUser } = React.useContext(FirebaseContext);
  const { workoutsWithExercises, isLoading } = useWorkoutsWithExercises(
    loggedInUser.uid
  );

  return (
    <Box display="flex" flexDirection="column" padding="1rem">
      <Heading fontSize="lg" alignSelf="center">
        Recorded Workouts
      </Heading>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        workoutsWithExercises.map((workout) => (
          <Workout workoutWithExercises={workout} />
          // <p key={entry.uid}>{JSON.stringify(entry)}</p>
        ))
      )}
    </Box>
  );
}
