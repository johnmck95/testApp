import React, { ChangeEvent } from "react";
import { ExerciseType } from "../Types/types";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Switch,
  HStack,
  Select,
  Button,
  FormErrorMessage,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { BsXSquareFill } from "react-icons/bs";
import {
  validateStringField,
  validateNumericalField,
  validateEmomAndLadder,
  validateExerciseFormFields,
} from "../Functions/FormValidation";
import { deleteExerciseFromDB } from "../Functions/Helpers";

export default function NewExercise({
  exercise,
  setSavedExercises,
}: {
  exercise: ExerciseType;
  setSavedExercises: (updatedExercise: ExerciseType, action?: string) => void;
}) {
  const [exerciseState, setExerciseState] =
    React.useState<ExerciseType>(exercise);
  const [submittedForm, setSubmittedForm] = React.useState(false);
  const [formIsEditable, setFormIsEditable] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleExerciseInputChange(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ): void {
    const { name, value } = event.target;
    setExerciseState((prevExerciseState) => ({
      ...prevExerciseState,
      [name]: value,
    }));
  }

  function handleExerciseSwitchChange(switchType: string) {
    switch (switchType) {
      case "isEmom":
        setExerciseState((prevExerciseState) => ({
          ...prevExerciseState,
          isEmom: !prevExerciseState.isEmom,
        }));
        break;
      case "isLadder":
        setExerciseState((prevExerciseState) => ({
          ...prevExerciseState,
          isLadder: !prevExerciseState.isLadder,
        }));
        break;
      default:
        break;
    }
  }

  function makeFormEditable() {
    setSubmittedForm(false);
    setFormIsEditable(true);
  }

  function validateThenSaveExercise() {
    setSubmittedForm(true);
    if (validateExerciseFormFields(exerciseState)) {
      return;
    } else {
      setFormIsEditable(false);
      setSavedExercises(exerciseState);
    }
  }

  const confirmDelete = () => {
    setSavedExercises(exercise, "delete");
    deleteExerciseFromDB(exercise);
    onClose();
  };

  return (
    <VStack
      w="100%"
      alignItems={"flex-start"}
      borderRadius="10px"
      padding="15px"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      my="0.75rem"
    >
      <FormControl
        isRequired
        isInvalid={submittedForm && !validateStringField(exerciseState.title)}
      >
        <HStack justifyContent={"space-between"} w="100%">
          <FormLabel mb="0px" fontSize={["sm", "lg"]}>
            Exercise
          </FormLabel>
          <IconButton
            aria-label="Close"
            icon={<BsXSquareFill />}
            size={["sm", "lg"]}
            variant="ghost"
            onClick={onOpen}
          />
        </HStack>
        <Input
          size={["sm", "lg"]}
          isRequired
          name="title"
          type="text"
          value={exerciseState.title}
          onChange={handleExerciseInputChange}
          isDisabled={!formIsEditable}
        />
      </FormControl>

      <HStack>
        <HStack>
          <FormControl
            isRequired
            isInvalid={
              submittedForm && !validateNumericalField(exerciseState.sets!)
            }
          >
            <FormLabel mb="0px" fontSize={["sm", "lg"]}>
              Sets
            </FormLabel>
            <Input
              size={["sm", "lg"]}
              name="sets"
              type="number"
              value={exerciseState.sets!}
              onChange={handleExerciseInputChange}
              isDisabled={!formIsEditable}
            />
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              submittedForm && !validateStringField(exerciseState.reps)
            }
          >
            <FormLabel mb="0px" fontSize={["sm", "lg"]}>
              Reps
            </FormLabel>
            <Input
              size={["sm", "lg"]}
              name="reps"
              type="text"
              value={exerciseState.reps}
              onChange={handleExerciseInputChange}
              isDisabled={!formIsEditable}
            />
          </FormControl>
        </HStack>
      </HStack>

      <HStack>
        <HStack alignItems={"flex-end"}>
          <FormControl
            isRequired
            isInvalid={
              submittedForm && !validateNumericalField(exerciseState.weight!)
            }
          >
            <FormLabel mb="0px" fontSize={["sm", "lg"]}>
              Weight
            </FormLabel>
            <Input
              size={["sm", "lg"]}
              name="weight"
              id="weight"
              type="number"
              value={exerciseState.weight!}
              onChange={handleExerciseInputChange}
              isDisabled={!formIsEditable}
            />
          </FormControl>
          <FormControl as="span">
            <Select
              size={["sm", "lg"]}
              name="weightUnit"
              maxW="100px"
              value={exerciseState.weightUnit}
              onChange={handleExerciseInputChange}
              isDisabled={!formIsEditable}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </Select>
          </FormControl>
        </HStack>
      </HStack>

      <FormControl
        isInvalid={
          submittedForm &&
          validateEmomAndLadder(exerciseState.isEmom, exerciseState.isLadder)
        }
      >
        <HStack my="0.5rem">
          <FormControl mr="2.5rem">
            <FormLabel mb="0px" fontSize={["sm", "lg"]}>
              EMOM
            </FormLabel>
            <span>False </span>
            <Switch
              size={["sm", "lg"]}
              name="isEmom"
              id="isEmom"
              onChange={() => handleExerciseSwitchChange("isEmom")}
              isChecked={exerciseState.isEmom}
              isDisabled={!formIsEditable}
            />
            <span> True</span>
          </FormControl>

          <FormControl>
            <FormLabel mb="0px" fontSize={["sm", "lg"]}>
              Ladder
            </FormLabel>
            <span>False </span>
            <Switch
              size={["sm", "lg"]}
              name="isLadder"
              id="isLadder"
              onChange={() => handleExerciseSwitchChange("isLadder")}
              isChecked={exerciseState.isLadder}
              isDisabled={!formIsEditable}
            />
            <span> True</span>
          </FormControl>
        </HStack>
        <FormErrorMessage>You cannot select EMOM and Ladder</FormErrorMessage>
      </FormControl>

      <HStack w="100%">
        <FormControl>
          <FormLabel mb="0px" fontSize={["sm", "lg"]}>
            Comment
          </FormLabel>
          <Input
            size={["sm", "lg"]}
            name="comment"
            type="text"
            value={exerciseState.comment}
            onChange={handleExerciseInputChange}
            isDisabled={!formIsEditable}
          ></Input>
        </FormControl>
      </HStack>

      <Button
        w="200px"
        my="1rem"
        onClick={
          formIsEditable
            ? () => validateThenSaveExercise()
            : () => makeFormEditable()
        }
      >
        {formIsEditable ? "Save Exercise" : "Edit Exercise"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this exercise?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
