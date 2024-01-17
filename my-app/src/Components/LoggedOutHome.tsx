import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { Button, Flex } from "@chakra-ui/react";
// import FirebaseContext from "../App";

const LoggedOutHome = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  return (
    <>
      <Flex width="100vw" justifyContent={"space-between"}>
        <Button margin="5px" onClick={() => signInWithPopup(auth, provider)}>
          Sign In with Google
        </Button>
      </Flex>
    </>
  );
};

export default LoggedOutHome;
