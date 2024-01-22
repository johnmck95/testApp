import React from "react";
import { WorkoutWithExercisesType } from "../Types/types";
import { Box, Flex, Heading, List } from "@chakra-ui/react";
import Exercise from "./Exercise";

export default function Workout({
  workoutWithExercises,
}: {
  workoutWithExercises: WorkoutWithExercisesType;
}) {
  return (
    <Box
      borderRadius="10px"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      w="100%"
      my="1rem"
      padding={["0.25rem", "0.5rem"]}
    >
      <Flex w="100%" alignItems="flex-end" mx={["0.5rem", "1rem"]} py="0.5rem">
        <Heading fontSize={["sm", "md"]} mr="1rem">
          {workoutWithExercises.date.toDate().toLocaleDateString("en-CA", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Heading>
        <Heading as="h4" fontSize="xs" color="gray.600">
          {workoutWithExercises.comment}
        </Heading>
      </Flex>
      <List w="100%">
        {workoutWithExercises.exercises.map((exercise) => (
          <Exercise key={exercise.uid} exercise={exercise} />
        ))}
      </List>
    </Box>
  );
}
