import React from "react";
import { ExerciseType } from "../Types/types";
import { ListIcon, ListItem, Grid, GridItem } from "@chakra-ui/react";
import { MdCheckCircle, MdAccessTime } from "react-icons/md";

function totalReps(exercise: ExerciseType): number {
  const { sets, reps, isLadder } = exercise;
  const parsedReps: string[] = reps
    .replace(/[^0-9]/g, ",")
    .split(",")
    .filter((num) => num.length > 0);

  let totalRepsPerSet = parsedReps.reduce((accumulated, number) => {
    return accumulated + parseInt(number, 10);
  }, 0);

  totalRepsPerSet = isLadder ? totalRepsPerSet * 2 : totalRepsPerSet;

  return sets * totalRepsPerSet;
}

function workCapacity(exercise: ExerciseType): number {
  return totalReps(exercise) * exercise.weight;
}

export default function Workout({ exercise }: { exercise: ExerciseType }) {
  const [isCompleted, setIsCompleted] = React.useState(true);
  const { title, sets, reps, weight, weightUnit, isEmom, isLadder, comment } =
    exercise;

  let formattedComment = isEmom ? "Emom" : "";
  formattedComment += isLadder ? "Ladder" : "";
  formattedComment +=
    formattedComment.length > 0 && comment ? `. ${comment}` : `${comment}`;

  function formatTitle() {
    if (weight && weightUnit) {
      return `${title} (${weight + weightUnit})`;
    } else {
      return title;
    }
  }

  return (
    <ListItem fontSize={"xs"} w="100%" padding="0.25rem">
      <Grid
        templateColumns={
          sets && reps
            ? "min-content 0.7fr 0.7fr 0.5fr 0.7fr 0.5fr"
            : "min-content 1fr 1fr"
        }
        gap={2}
        w="100%"
      >
        <GridItem minHeight="2rem">
          {isCompleted ? (
            <ListIcon
              as={MdCheckCircle}
              color="green.500"
              onClick={() =>
                setIsCompleted((prevIsComplete) => !prevIsComplete)
              }
            />
          ) : (
            <ListIcon
              as={MdAccessTime}
              color="yellow.400"
              onClick={() =>
                setIsCompleted((prevIsComplete) => !prevIsComplete)
              }
            />
          )}
        </GridItem>

        <GridItem minHeight="2rem">{formatTitle()}</GridItem>

        {sets && reps && (
          <GridItem minHeight="2rem">{`${sets}x${reps}`}</GridItem>
        )}

        {sets && reps && (
          <GridItem minHeight="2rem">{`${totalReps(exercise)} reps`}</GridItem>
        )}

        {sets && reps && (
          <GridItem minHeight="2rem">{`${workCapacity(
            exercise
          )} ${weightUnit} WC`}</GridItem>
        )}

        <GridItem minHeight="2rem">{formattedComment}</GridItem>
      </Grid>
    </ListItem>
  );
}
