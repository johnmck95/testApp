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
  // validateStringField,
  validateEmomAndLadder,
  validateExerciseFormFields,
} from "../Functions/FormValidation";
import { deleteExerciseFromDB } from "../Functions/Helpers";

export default function NewExercise({
  openExerciseUnEditable,
  exercise,
  setSavedExercises,
  setExercisesBeingEdited,
}: {
  openExerciseUnEditable?: boolean;
  exercise: ExerciseType;
  setSavedExercises: (updatedExercise: ExerciseType, action?: string) => void;
  setExercisesBeingEdited: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [exerciseState, setExerciseState] =
    React.useState<ExerciseType>(exercise);
  const [submittedForm, setSubmittedForm] = React.useState(false);
  const [formIsEditable, setFormIsEditable] = React.useState(
    openExerciseUnEditable ? false : true
  );
  const [overallErrorMessage, setOverallErrorMessage] = React.useState(
    validateExerciseFormFields(exerciseState)
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    setOverallErrorMessage(validateExerciseFormFields(exerciseState));
  }, [exerciseState]);
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
    setExercisesBeingEdited(
      (prevExercisesBeingEdited: number) => prevExercisesBeingEdited + 1
    );
  }

  function validateThenSaveExercise() {
    setSubmittedForm(true);

    if (!overallErrorMessage.validExercise) {
      return;
    } else {
      setExercisesBeingEdited(
        (prevExercisesBeingEdited: number) => prevExercisesBeingEdited - 1
      );
      setFormIsEditable(false);
      setSavedExercises(exerciseState);
    }
  }

  const confirmDelete = () => {
    setSavedExercises(exercise, "delete");
    deleteExerciseFromDB(exercise);
    setExercisesBeingEdited(
      (prevExercisesBeingEdited: number) => prevExercisesBeingEdited - 1
    );
    onClose();
  };

  const { title, sets, reps, weight, weightUnit } = exerciseState;

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
        isInvalid={submittedForm && !overallErrorMessage.validExercise}
      >
        <FormControl isRequired isInvalid={submittedForm && title.length <= 0}>
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
              isInvalid={
                submittedForm &&
                sets <= 0 &&
                (overallErrorMessage.reason ===
                  "Reps are included. Sets, Weight and Weight Unit must be as well." ||
                  overallErrorMessage.reason ===
                    "Weight Unit selected. Sets, Reps and Weight must be as well." ||
                  overallErrorMessage.reason ===
                    "Weight included. Sets, reps and Weight Unit must be as well.")
              }
            >
              <FormLabel mb="0px" fontSize={["sm", "lg"]}>
                Sets
              </FormLabel>
              <Input
                size={["sm", "lg"]}
                name="sets"
                type="number"
                value={exerciseState.sets}
                onChange={handleExerciseInputChange}
                isDisabled={!formIsEditable}
              />
            </FormControl>

            <FormControl
              isInvalid={
                submittedForm &&
                reps.length <= 0 &&
                (overallErrorMessage.reason ===
                  "Sets are included. Reps, Weight and Weight Unit must be as well." ||
                  overallErrorMessage.reason ===
                    "Weight Unit selected. Sets, Reps and Weight must be as well." ||
                  overallErrorMessage.reason ===
                    "Weight included. Sets, reps and Weight Unit must be as well.")
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
              isInvalid={
                submittedForm &&
                weight <= 0 &&
                (overallErrorMessage.reason ===
                  "Sets are included. Reps, Weight and Weight Unit must be as well." ||
                  overallErrorMessage.reason ===
                    "Weight Unit selected. Sets, Reps and Weight must be as well." ||
                  overallErrorMessage.reason ===
                    "Reps are included. Sets, Weight and Weight Unit must be as well.")
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
                value={exerciseState.weight}
                onChange={handleExerciseInputChange}
                isDisabled={!formIsEditable}
              />
            </FormControl>
            <FormControl
              as="span"
              isInvalid={
                submittedForm &&
                weightUnit === "" &&
                (overallErrorMessage.reason ===
                  "Sets are included. Reps, Weight and Weight Unit must be as well." ||
                  overallErrorMessage.reason ===
                    "Reps are included. Sets, Weight and Weight Unit must be as well." ||
                  overallErrorMessage.reason ===
                    "Weight included. Sets, reps and Weight Unit must be as well.")
              }
            >
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
                <option value=""></option>
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
            <ModalBody>
              Are you sure you want to delete this exercise?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={confirmDelete}>
                Delete
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <FormErrorMessage>{overallErrorMessage.reason}</FormErrorMessage>
      </FormControl>
    </VStack>
  );
}
