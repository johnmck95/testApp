import React from "react";
import FirebaseContext from "../App";
import {
  Button,
  Heading,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import ViewWorkouts from "./ViewWorkouts";
import NewWorkout from "./NewWorkout";
const LoggedInHome = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showNewWorkout, setShowNewWorkout] = React.useState(false);
  const { loggedInUser } = React.useContext(FirebaseContext);
  const auth = getAuth();

  function toggleViewWorkoutNewWorkout() {
    if (!showNewWorkout) {
      setShowNewWorkout((prevShowNewWorkout) => !prevShowNewWorkout);
    } else {
      onOpen();
    }
  }

  const confirmGoToViewWorkout = () => {
    setShowNewWorkout((prevShowNewWorkout) => !prevShowNewWorkout);
    onClose();
  };

  return (
    <>
      <Flex
        width="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
        boxShadow={"0 0 15px rgba(0, 0, 0, 0.1)"}
        flexDirection={["column", "row"]}
      >
        <Heading fontSize={["xl", "2xl"]} margin="5px">
          Welcome, {loggedInUser.displayName}
        </Heading>
        <Flex>
          <Button margin="5px" onClick={toggleViewWorkoutNewWorkout}>
            {showNewWorkout ? "View Workouts" : "Record New Workout"}
          </Button>
          <Button margin="5px" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
        </Flex>
      </Flex>
      {showNewWorkout ? (
        <NewWorkout setShowNewWorkout={setShowNewWorkout} />
      ) : (
        <ViewWorkouts />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Workout Data Unsaved</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to leave this page and lose all workout data?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmGoToViewWorkout}>
              Leave
            </Button>
            <Button onClick={onClose}>Stay</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoggedInHome;
