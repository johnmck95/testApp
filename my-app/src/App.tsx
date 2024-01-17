import * as React from "react";
import { ChakraProvider, theme, Button, Heading, Flex } from "@chakra-ui/react";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import LoggedInHome from "./Components/LoggedInHome";
import LoggedOutHome from "./Components/LoggedOutHome";

const firebaseConfig = {
  apiKey: "AIzaSyBFodk2ZLvyWvqzQV_XVmAcgZ9x28Epv74",
  authDomain: "testapp-b71f2.firebaseapp.com",
  projectId: "testapp-b71f2",
  storageBucket: "testapp-b71f2.appspot.com",
  messagingSenderId: "567767921171",
  appId: "1:567767921171:web:418621c8f228a8d93945e6",
  measurementId: "G-T7J4RQYX5Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const FirebaseContext = React.createContext<null | any>(null);

export const App = () => {
  const [loggedInUser, setLoggedInUser] = React.useState<null | any>(null);
  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }
    });
    console.log("Auth useEffect Ran");
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Flex flex-direction="column"></Flex>
      <FirebaseContext.Provider
        value={{ app, db, loggedInUser, setLoggedInUser }}
      >
        {loggedInUser ? <LoggedInHome /> : <LoggedOutHome />}
      </FirebaseContext.Provider>
    </ChakraProvider>
  );
};

export default FirebaseContext;
