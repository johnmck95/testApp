import React from "react";
import {
  Button,
  Heading,
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import ViewWorkouts from "./ViewWorkouts";
import NewWorkout from "./NewWorkout";
const LoggedInHome = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showNewWorkout, setShowNewWorkout] = React.useState(false);
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
      <Box
        width="100%"
        position="sticky"
        top="0px"
        height={["85px", "50px"]}
        boxShadow={"0 0 15px rgba(0, 0, 0, 0.1)"}
        flexDirection={["column", "row"]}
      >
        <HStack justifyContent={"center"} w="100%">
          <Flex
            flexDirection={["column", "row"]}
            justifyContent={"space-around"}
            alignItems={"center"}
            mx={"1.5rem"}
            w="100%"
            maxW="720px"
            my="0px"
            py="0px"
          >
            <Heading fontSize={["xl", "2xl"]} my="0px">
              KB Tracker
            </Heading>
            <Flex my="0px" py="0px">
              <Button margin="5px" onClick={toggleViewWorkoutNewWorkout}>
                {showNewWorkout ? "View Workouts" : "Record New Workout"}
              </Button>
              <Button margin="5px" onClick={() => auth.signOut()}>
                Sign Out
              </Button>
            </Flex>
          </Flex>
        </HStack>
      </Box>
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
