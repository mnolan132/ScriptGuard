import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import User from "./User";

interface SignUpProps {
  darkMode: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ darkMode }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const isDeveloper: boolean = false;

  const createNewUser = () => {
    let user = new User(firstName, lastName, email, isDeveloper, darkMode);
    document.cookie = "user=" + JSON.stringify(user);
  };

  return (
    <div>
      <form onSubmit={createNewUser}>
        <Flex
          m={"10px"}
          h={"280px"}
          flexDirection={"column"}
          justifyContent={"space-between"}
        >
          <FormControl isRequired w="300px">
            <Input
              placeholder="First name"
              onChange={(event) => setFirstName(event.currentTarget.value)}
            />
          </FormControl>
          <FormControl isRequired w="300px">
            <Input
              placeholder="Last name"
              onChange={(event) => setLastName(event.currentTarget.value)}
            />
          </FormControl>
          <FormControl isRequired w="300px">
            <Input
              type="email"
              placeholder="Email"
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </FormControl>
          <Checkbox
            id="isDeveloper"
            // ref="isDeveloper"
            // defaultChecked={isDeveloper}
            // onChange={() => setIsDeveloper(!isDeveloper)}
          >
            <Text fontSize={"small"}>I am a developer</Text>
          </Checkbox>
          <Button
            w={"160px"}
            border={"3px solid #56F3FD"}
            variant={"outline"}
            color={darkMode ? "whitesmoke" : "#404258"}
            _hover={{
              background: darkMode ? "#09b5b5" : "#defcfc",
            }}
            type="submit"
          >
            Submit
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default SignUp;
