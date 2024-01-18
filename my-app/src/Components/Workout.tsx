import React from "react";
import { ExerciseType, WorkoutWithExercisesType } from "../Types/types";
import { Flex, Heading, List } from "@chakra-ui/react";
import Exercise from "./Exercise";

const groupExercisesByTitle = (exercises: ExerciseType[]) => {
  const groupedExercises: { [title: string]: ExerciseType[] } = {};

  exercises.forEach((exercise) => {
    const title = exercise.title.toLowerCase();

    if (!groupedExercises[title]) {
      groupedExercises[title] = [];
    }

    groupedExercises[title].push(exercise);
  });

  return groupedExercises;
};

export default function Workout({
  workoutWithExercises,
}: {
  workoutWithExercises: WorkoutWithExercisesType;
}) {
  const ladderExercises = workoutWithExercises.exercises.filter(
    (exercise) => exercise.isLadder
  );
  // Group ladder exercises by title
  const groupedLadderExercises = groupExercisesByTitle(ladderExercises);

  // For other exercises, create an array with a single element
  const nonLadderExercises = workoutWithExercises.exercises.filter(
    (exercise) => !exercise.isLadder
  );

  return (
    <Flex
      m={["0rem", "1rem"]}
      bg="green.50"
      borderRadius="10px"
      padding={["0rem", "0.5rem"]}
    >
      <Heading fontSize="md" w="100%">
        {workoutWithExercises.date.toDate().toLocaleDateString("en-CA", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        <List margin="1rem" w="100%">
          {/* Combine Ladder Exercises that have the same Title into 1 row */}
          {Object.keys(groupedLadderExercises).map((title) => (
            <Exercise key={title} exercises={groupedLadderExercises[title]} />
          ))}

          {nonLadderExercises.map((exercise) => (
            <Exercise key={exercise.uid} exercises={[exercise]} />
          ))}
        </List>
      </Heading>
    </Flex>
  );
}
