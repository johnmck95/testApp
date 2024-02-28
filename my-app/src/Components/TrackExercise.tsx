import React, { useEffect } from "react";
import { ExerciseType } from "../Types/types";
import { HStack, Heading, Icon, IconButton, Text } from "@chakra-ui/react";
import { MdAccessTime, MdAdd, MdCheckCircle, MdRemove } from "react-icons/md";
import { totalLadderSets } from "../Functions/Helpers";

export default function TrackExercise({
  exercise,
}: {
  exercise: ExerciseType;
}) {
  const dataAvailable = exercise.sets && exercise.reps;
  const [setsCompleted, setSetsCompleted] = React.useState<number>(() => {
    const storedSetsCompleted = localStorage.getItem(exercise.uid);
    return storedSetsCompleted ? parseInt(storedSetsCompleted, 10) : 0;
  });
  const setsInExercise: number = exercise.isLadder
    ? totalLadderSets(exercise)
    : exercise.sets;

  useEffect(() => {
    localStorage.setItem(exercise.uid, setsCompleted.toString());
  }, [exercise.uid, setsCompleted]);

  function completedSet() {
    setSetsCompleted((prevRepsCompleted) => prevRepsCompleted + 1);
  }
  function removeSet() {
    if (setsCompleted <= 0) return;
    setSetsCompleted((prevRepsCompleted) => prevRepsCompleted - 1);
  }

  return (
    <HStack>
      {/* eslint-disable-next-line eqeqeq */}
      {!dataAvailable || setsCompleted == setsInExercise ? (
        <Icon as={MdCheckCircle} color="green.500" />
      ) : (
        <Icon as={MdAccessTime} color="yellow.500" />
      )}
      <Heading fontSize={["sm", "md"]} mr={["0.25rem", "1rem"]}>
        {exercise.title}
        {dataAvailable
          ? ` (${exercise.weight}${exercise.weightUnit}): ${exercise.sets}x${exercise.reps}`
          : ""}
      </Heading>
      <HStack>
        {dataAvailable && (
          <>
            <IconButton
              aria-label="Mark one fewer set as completed"
              size={["sm"]}
              as={MdRemove}
              color="red.500"
              onClick={removeSet}
            />
            <IconButton
              aria-label="Mark one additional set as completed"
              size={["sm"]}
              as={MdAdd}
              color="green.500"
              onClick={completedSet}
            />
            {exercise.isLadder ? (
              <Text>{`${setsCompleted} / ${setsInExercise} Ladder Sets`}</Text>
            ) : (
              <Text>{`${setsCompleted} / ${setsInExercise} Sets`}</Text>
            )}
          </>
        )}
      </HStack>
    </HStack>
  );
}
