import React from "react";
import { WorkoutWithExercisesType } from "../Types/types";
import {
  Box,
  Flex,
  Heading,
  List,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import Exercise from "./Exercise";
import { MdCreate, MdDelete } from "react-icons/md";
import useDeleteWorkoutWithExercises from "../Hooks/useDeleteWorkoutWithExercises";
import LoadingSpinner from "./LoadingSpinner";
import NewWorkout from "./NewWorkout";

export default function Workout({
  workoutWithExercises,
}: {
  workoutWithExercises: WorkoutWithExercisesType;
}) {
  const [showNewWorkout, setShowNewWorkout] = React.useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteWorkoutWithExercises, isDeleting } =
    useDeleteWorkoutWithExercises();
  function formatDate(date: Date) {
    return date.toLocaleDateString("en-CA", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function editWorkout() {
    setShowNewWorkout((prevShowNewWorkout) => !prevShowNewWorkout);
  }

  async function handleDelete(workoutWithExercises: WorkoutWithExercisesType) {
    onClose();
    await deleteWorkoutWithExercises(workoutWithExercises);
  }

  return (
    <Box
      borderRadius="10px"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      my="0.75rem"
      maxW="700px"
      padding={["0.25rem", "0.5rem"]}
      w={["100%", "100%", "90%", "80%"]}
    >
      {showNewWorkout ? (
        <NewWorkout
          setShowNewWorkout={setShowNewWorkout}
          workoutWithExercises={workoutWithExercises}
          openExerciseUnEditable={true}
        />
      ) : (
        <>
          <HStack mx={["0.5rem", "1rem"]}>
            <Flex w="100%" py="0.5rem">
              <Heading fontSize={["sm", "md"]} mr={["0.25rem", "1rem"]}>
                {formatDate(workoutWithExercises.date.toDate())}
              </Heading>
              <Heading as="h4" fontSize="xs" color="gray.600">
                {workoutWithExercises.comment}
              </Heading>
            </Flex>
            <HStack pb="10px">
              <IconButton
                aria-label="Edit Workout"
                size={["xs", "sm"]}
                icon={<MdCreate />}
                mt="0.25rem"
                onClick={editWorkout}
              ></IconButton>
              <IconButton
                size={["xs", "sm"]}
                aria-label="Delete Workout"
                icon={<MdDelete />}
                mt="0.25rem"
                onClick={onOpen}
              ></IconButton>
            </HStack>
          </HStack>

          {isDeleting ? (
            <LoadingSpinner />
          ) : (
            <List w="100%">
              {workoutWithExercises.exercises
                .sort((a, b) => a.index - b.index)
                .map((exercise) => (
                  <Exercise key={exercise.uid} exercise={exercise} />
                ))}
            </List>
          )}
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this workout and all of the
            exercises?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => handleDelete(workoutWithExercises)}
            >
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
