import React from "react";
import FirebaseContext from "../App";
import { Button, Heading, Flex } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import ViewWorkouts from "./ViewWorkouts";
const LoggedInHome = () => {
  const { loggedInUser, db } = React.useContext(FirebaseContext);
  const auth = getAuth();

  //   /** WRITES apple to the 'things' collection DB **/
  //   React.useEffect(() => {
  //     async function writeData() {
  //       const thingsRef = collection(db, "things");
  //       await setDoc(doc(thingsRef, "apple"), {
  //         name: "Apple",
  //         food: true,
  //       });
  //     }
  //     writeData();
  //   });

  //   /** FETCHES 'apple' from the 'things' collection in DB */
  //   React.useEffect(() => {
  //     async function readData() {
  //       const thingRef = doc(db, "things", "apple");
  //       const docSnap = await getDoc(thingRef);

  //       if (docSnap.exists()) {
  //         console.log("Document data:", docSnap.data());
  //       } else {
  //         // docSnap.data() will be undefined in this case
  //         console.log("No such document!");
  //       }
  //     }
  //     readData();
  //   });

  return (
    <>
      <Flex
        width="100vw"
        justifyContent={"space-between"}
        alignItems={"center"}
        boxShadow={"0 0 15px rgba(0, 0, 0, 0.1)"}
        flexDirection={["column", "row"]}
      >
        <Heading fontSize={["medium", "2xl"]} margin="5px">
          Welcome, {loggedInUser.displayName}
        </Heading>
        <Flex>
          <Button size={["xs", "xs", "md", "lg"]} margin="5px">
            Record New Workout
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
      <ViewWorkouts />
    </>
  );
};

export default LoggedInHome;
