import React from "react";
import { ExerciseType } from "../Types/types";
import { ListIcon, ListItem, Grid, GridItem } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

function compareReps(a: string, b: string) {
  const getTotalReps = (reps: string) => {
    // If the reps string contains '/', split and sum the numbers
    const parts = reps.split("/");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) + parseInt(parts[1], 10);
    }
    // If there is only one number, parse and return it
    return parseInt(reps, 10);
  };

  const totalRepsA = getTotalReps(a);
  const totalRepsB = getTotalReps(b);

  // Compare total reps and return the result
  return totalRepsA - totalRepsB;
}

function formatLadderSetsAndReps(exercises: ExerciseType[]): string {
  const { title, sets, isLadder } = exercises[0];
  exercises.forEach((exercise) => {
    if (exercise.title.toLowerCase() !== title.toLowerCase()) {
      throw new Error(
        "Combining ladder exercises from same workout but different title."
      );
    }
    if (!isLadder) {
      throw new Error("Treating normal exercise as a ladder erroneously.");
    }
  });

  const ladderReps: string[] = [];
  exercises.forEach((exercise) => {
    ladderReps.push(exercise.reps);
  });
  ladderReps.sort(compareReps);

  let formattedReps = "(" + ladderReps.join(", ") + ")";
  return sets + "x" + formattedReps + " reps";
}

function formatSetsAndReps(exercise: ExerciseType): string {
  const { sets, reps, isEmom } = exercise;
  let formatted = sets + "x" + reps + " reps";
  formatted += isEmom ? " EMOM" : "";
  return formatted;
}

export default function Workout({ exercises }: { exercises: ExerciseType[] }) {
  let exercise: ExerciseType = exercises[0];
  const formattedSetsAndReps: string =
    exercises.length > 1 || exercises[0].isLadder
      ? formatLadderSetsAndReps(exercises)
      : formatSetsAndReps(exercise);

  const formattedComment =
    exercises.length > 1
      ? { __html: exercises.map((exercise) => exercise.comment).join("<br/>") }
      : exercises.length === 1
      ? { __html: exercises[0].comment }
      : { __html: "" };

  return (
    <ListItem fontSize={"sm"} w="100%" padding="0.5rem">
      <Grid templateColumns="min-content 0.70fr 1.25fr 1.05fr" gap={6} w="100%">
        <GridItem minHeight="2rem">
          <ListIcon as={MdCheckCircle} color="green.500" />
        </GridItem>

        <GridItem minHeight="2rem">{exercise.title}</GridItem>

        <GridItem minHeight="2rem">{formattedSetsAndReps}</GridItem>

        <GridItem
          minHeight="2rem"
          dangerouslySetInnerHTML={formattedComment}
        ></GridItem>
      </Grid>
    </ListItem>
  );
}
