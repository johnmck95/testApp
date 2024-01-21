import React from "react";
import FirebaseContext from "../App";
import { Button, Heading, Flex } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import ViewWorkouts from "./ViewWorkouts";
import NewWorkout from "./NewWorkout";
const LoggedInHome = () => {
  const [showNewWorkout, setShowNewWorkout] = React.useState(false);
  const { loggedInUser } = React.useContext(FirebaseContext);
  const auth = getAuth();

  return (
    <>
      <Flex
        width="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
        boxShadow={"0 0 15px rgba(0, 0, 0, 0.1)"}
        flexDirection={["column", "row"]}
      >
        <Heading fontSize={["medium", "2xl"]} margin="5px">
          Welcome, {loggedInUser.displayName}
        </Heading>
        <Flex>
          <Button
            size={["xs", "xs", "md", "lg"]}
            margin="5px"
            onClick={() =>
              setShowNewWorkout((prevShowNewWorkout) => !prevShowNewWorkout)
            }
          >
            {showNewWorkout ? "Return" : "Record New Workout"}
          </Button>
          <Button
            size={["xs", "xs", "md", "lg"]}
            margin="5px"
            onClick={() => auth.signOut()}
          >
            Sign Out
          </Button>
        </Flex>
      </Flex>
      {showNewWorkout ? <NewWorkout /> : <ViewWorkouts />}
    </>
  );
};

export default LoggedInHome;
