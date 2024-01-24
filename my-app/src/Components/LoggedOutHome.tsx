import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { Button, Center } from "@chakra-ui/react";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

async function checkIfUserExists(user: any) {
  const db = getFirestore();
  const usersCollection = collection(db, "users");
  const userExistsQuery = query(usersCollection, where("uid", "==", user.uid));
  const userSnapshot = await getDocs(userExistsQuery);

  if (userSnapshot.size > 1) {
    throw new Error(
      `Google user.uid returned ${userSnapshot.size} users from the firebase DB. 0 or 1 was expected.`
    );
  }

  return userSnapshot.size === 1;
}

async function addUserToDB(user: any) {
  const db = getFirestore();
  const usersRef = collection(db, "users");
  const newUser = {
    displayName: user.displayName,
    email: user.email,
    uid: user.uid,
  };
  await addDoc(usersRef, newUser);
}

async function signInWithGoogle() {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userExists = await checkIfUserExists(result.user);

    if (!userExists) {
      await addUserToDB(result.user);
    }
  } catch (e) {
    console.log("Error signing in with Google: ", e);
  }
}

const LoggedOutHome = () => {
  return (
    <>
      <Center h="100vh">
        <Button margin="5px" onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
      </Center>
    </>
  );
};

export default LoggedOutHome;
