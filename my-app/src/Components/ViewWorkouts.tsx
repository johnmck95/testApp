import React from "react";
import { Box, Flex } from "@chakra-ui/react";
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
    <Box
      position="fixed"
      top={["85", "50"]}
      w="100%"
      h={["calc(100% - 85px)", "calc(100% - 50px)"]}
      overflow="auto"
      bg="rgba(255, 255, 255, 0.4)"
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        padding={["0.25rem", "1rem"]}
      >
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
        )}
      </Flex>
    </Box>
  );
}
