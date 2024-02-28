import React from "react";
import { WorkoutWithExercisesType } from "../Types/types";
import {
  Box,
  HStack,
  Heading,
  Text,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import TrackExercise from "./TrackExercise";

export default function TrackWorkout({
  workoutWithExercises,
  toggleTrackWorkout,
}: {
  workoutWithExercises: WorkoutWithExercisesType;
  toggleTrackWorkout: () => void;
}) {
  return (
    <Box
      borderRadius="10px"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      maxW="700px"
      padding={["0.25rem", "0.5rem"]}
      w={["100%", "100%", "90%", "80%"]}
      justifyContent={"flex-start"}
      m="1rem"
      p="0.75rem"
    >
      <HStack justifyContent={"space-between"} py="1rem" pl="1rem">
        <VStack justifyContent={"flex-end"} alignItems={"flex-start"}>
          <Heading fontSize={["xl"]} mr={["0.25rem", "1rem"]} mb="-10px">
            Keep Track of Your Workout
          </Heading>
          <Text fontSize={"2xs"}> This will not modify the data recorded.</Text>
        </VStack>

        <IconButton
          aria-label="Minimize Track Workout"
          size={["md", "lg"]}
          icon={<MdArrowBack />}
          mt="0.25rem"
          onClick={toggleTrackWorkout}
        />
      </HStack>
      <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
        {workoutWithExercises.exercises.map((exercise) => (
          <TrackExercise key={exercise.uid} exercise={exercise} />
        ))}
      </VStack>
    </Box>
  );
}
