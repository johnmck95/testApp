import React from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import useWorkoutsWithExercises from "../Hooks/useWorkoutsWithExercises";
import FirebaseContext from "../App";
import Workout from "./Workout";
import LoadingSpinner from "./LoadingSpinner";

export default function ViewWorkouts() {
  const { loggedInUser } = React.useContext(FirebaseContext);
  const { workoutsWithExercises, isLoading } = useWorkoutsWithExercises(
    loggedInUser.uid
  );

  return (
    <Box display="flex" flexDirection="column" padding={["0.25rem", "1rem"]}>
      <Heading fontSize="lg" alignSelf="center">
        Recorded Workouts
      </Heading>
      {isLoading ? (
        <Flex
          w="100%"
          justifyContent={"center"}
          alignItems={"center"}
          my="5rem"
        >
          <LoadingSpinner />
        </Flex>
      ) : (
        workoutsWithExercises.map((workout) => (
          <Workout key={workout.uid} workoutWithExercises={workout} />
        ))
      )}{" "}
    </Box>
  );
}
