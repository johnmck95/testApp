import React from "react";
import { ExerciseType } from "../Types/types";
import { ListIcon, ListItem, Grid, GridItem } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

function totalReps(exercise: ExerciseType): number {
  const { sets, reps } = exercise;
  const parsedReps: string[] = reps
    .replace(/[^0-9]/g, ",")
    .split(",")
    .filter((num) => num.length > 0);

  const totalRepsPerSet: number = parsedReps.reduce((accumulated, number) => {
    return accumulated + parseInt(number, 10);
  }, 0);
  return sets! * totalRepsPerSet;
}

function workCapacity(exercise: ExerciseType): number {
  return totalReps(exercise) * exercise.weight!;
}

export default function Workout({ exercise }: { exercise: ExerciseType }) {
  const { title, sets, reps, weight, weightUnit, isEmom, isLadder, comment } =
    exercise;

  let formattedComment = isEmom ? "Emom" : "";
  formattedComment += isLadder ? "Ladder" : "";
  formattedComment +=
    formattedComment.length > 0 && comment ? `. ${comment}` : `${comment}`;

  return (
    <ListItem fontSize={"xs"} w="100%" padding="0.25rem">
      <Grid
        templateColumns="min-content 0.7fr 0.7fr 0.5fr 0.7fr 0.5fr"
        gap={2}
        w="100%"
      >
        <GridItem minHeight="2rem">
          <ListIcon as={MdCheckCircle} color="green.500" />
        </GridItem>

        <GridItem minHeight="2rem">{`${title} (${
          weight + weightUnit
        })`}</GridItem>

        <GridItem minHeight="2rem">{`${sets}x${reps}`}</GridItem>

        <GridItem minHeight="2rem">{`${totalReps(exercise)} reps`}</GridItem>

        <GridItem minHeight="2rem">{`${workCapacity(
          exercise
        )} ${weightUnit} WC`}</GridItem>

        <GridItem minHeight="2rem">{formattedComment}</GridItem>
      </Grid>
    </ListItem>
  );
}
