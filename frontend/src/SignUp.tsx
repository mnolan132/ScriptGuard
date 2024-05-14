import {
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

interface SignUpProps {
  darkMode: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ darkMode }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDeveloper, setIsDeveloper] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [show, setShow] = useState(false);
  // Hook to handle checkbox funcitonality

  const showPassword = () => setShow(!show);

  const toast = useToast();

  const createNewUser = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (tempPassword !== password) {
      toast({
        title: "Confirmation password error",
        description:
          "Your password is invalid, please make sure you have entered a valid password and then try again",
        status: "warning",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (isChecked) {
      setIsDeveloper("true");
    } else {
      setIsDeveloper("false");
    }
    let data = { firstName, lastName, email, password, isDeveloper };
    document.cookie = "session=" + JSON.stringify(data);
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
      toast({
        title: "Account Created",
        description: "Your account has been created, please log in",
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <form onSubmit={createNewUser}>
        <Flex
          m={"10px"}
          h={"300px"}
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
          <Stack spacing={4}>
            <InputGroup>
              <FormControl>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  onChange={(event) =>
                    setTempPassword(event.currentTarget.value)
                  }
                />
              </FormControl>
              <InputRightElement pointerEvents="visible">
                <Button
                  size="sm"
                  onClick={showPassword}
                  m="3px"
                  backgroundColor={!darkMode ? "whitesmoke" : "#404258"}
                  _hover={{ bg: "none" }}
                >
                  {show ? (
                    <ViewOffIcon color={darkMode ? "whitesmoke" : "#404258"} />
                  ) : (
                    <ViewIcon color={darkMode ? "whitesmoke" : "#404258"} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Stack>
          <Stack spacing={4}>
            <InputGroup>
              <FormControl>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </FormControl>
              <InputRightElement pointerEvents="visible">
                <Button
                  size="sm"
                  onClick={showPassword}
                  m="3px"
                  backgroundColor={!darkMode ? "whitesmoke" : "#404258"}
                  _hover={{ bg: "none" }}
                >
                  {show ? (
                    <ViewOffIcon color={darkMode ? "whitesmoke" : "#404258"} />
                  ) : (
                    <ViewIcon color={darkMode ? "whitesmoke" : "#404258"} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
          </Stack>
          <FormControl textAlign={"left"}>
            <Flex>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {
                  setIsChecked(!isChecked);
                }}
              ></input>
              <Text mx={"5px"}>I am a developer</Text>
            </Flex>
          </FormControl>

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
