import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

interface SignUpProps {
  darkMode: boolean;
  updateCallback: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ darkMode, updateCallback }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isDeveloper: string = "false";

  const createNewUser = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    let data = { firstName, lastName, email, password, isDeveloper };
    document.cookie = "user=" + JSON.stringify(data);
    const url = "http://127.0.0.1:5000/create_user";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (response.status !== 201 && response.status !== 200) {
      const data = await response.json();
      alert(data.message);
    } else {
      updateCallback();
    }
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
          <FormControl>
            <Input
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.currentTarget.value)}
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
