import React from "react";
import { ExerciseType } from "../Types/types";
import { ListIcon, ListItem, Text, Box, Flex } from "@chakra-ui/react";
import { MdDone } from "react-icons/md";
import { totalReps, workCapacity } from "../Functions/Helpers";

export default function Workout({ exercise }: { exercise: ExerciseType }) {
  const { title, sets, reps, weight, weightUnit, isEmom, isLadder, comment } =
    exercise;

  let formattedComment = isEmom ? "Emom" : "";
  formattedComment += isLadder ? "Ladder" : "";
  formattedComment +=
    formattedComment.length > 0 && comment ? `. ${comment}` : `${comment}`;

  function formatTitle() {
    if (weight && weightUnit) {
      return `${title} ${weight > 0 ? `(${weight + weightUnit})` : ""}:`;
    } else {
      return title;
    }
  }

  return (
    <ListItem fontSize={"xs"} my="0px" py="0px">
      <Flex minH="1.5rem" alignItems={"center"}>
        <ListIcon as={MdDone} color="green.500" />
        <Box
          display="flex"
          overflowX="scroll"
          whiteSpace="nowrap"
          css={{
            "::-webkit-scrollbar": {
              width: "0",
              height: "0",
              background: "transparent",
            },
          }}
        >
          <Text fontSize="sm" fontWeight={"600"} mr="0.25rem">
            {formatTitle()}
          </Text>

          {sets && reps && (
            <Text
              fontSize="sm"
              fontWeight={"500"}
              mr="1rem"
            >{`${sets}x${reps}`}</Text>
          )}

          {sets && reps && (
            <Text fontSize="sm" mr="0.75rem">{`${totalReps(
              exercise
            ).toLocaleString()} total reps,`}</Text>
          )}

          {sets && reps && workCapacity(exercise) > 0 && (
            <Text fontSize="sm" mr="0.75rem">{`${workCapacity(
              exercise
            ).toLocaleString()} ${weightUnit} WC${
              isEmom || isLadder || comment ? "," : ""
            }`}</Text>
          )}

          <Text fontSize="sm">{formattedComment}</Text>
        </Box>
      </Flex>
    </ListItem>
  );
}
