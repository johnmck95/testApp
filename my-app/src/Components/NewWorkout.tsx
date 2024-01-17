import React from "react";
import { Box } from "@chakra-ui/react";

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

export default function NewWorkout() {
  //   const { loggedInUser } = React.useContext(FirebaseContext);

  return (
    <Box>
      <h1>TODO: Record New Workout</h1>
      <br />
      <div>
        You need to create UI to record a new workout, then write to the DB
      </div>
    </Box>
  );
}
