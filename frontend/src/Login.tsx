import React, { useState } from "react";
import {
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Flex,
  useToast,
  InputRightElement,
  InputGroup,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface LoginProps {
  darkMode: boolean;
  fetchUser: () => void;
}

const Login: React.FC<LoginProps> = ({ darkMode, fetchUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const showPassword = () => setShow(!show);

  const toast = useToast();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      });
      document.cookie = "session=" + JSON.stringify(response.data.id);
      fetchUser();
      window.location.href = "http://localhost:5173/";
      toast({
        title: "Login successful",
        description: "Welcome back!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        toast({
          title: "Warning",
          description: err.response.data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <form onSubmit={login}>
      <Flex
        display={"flex"}
        h={"280px"}
        flexDirection={"column"}
        justifyContent={"start"}
      >
        <FormControl isRequired w="300px" m={"10px"}>
          <Input
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </FormControl>
        <Stack spacing={4} w="300px" m="10px">
          <InputGroup>
            <FormControl isRequired>
              <Input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
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

        {error && <FormErrorMessage>{error}</FormErrorMessage>}
        <Button
          m={"10px"}
          w={"160px"}
          border={"3px solid #56F3FD"}
          variant={"outline"}
          color={darkMode ? "whitesmoke" : "#404258"}
          _hover={{
            background: darkMode ? "#09b5b5" : "#defcfc",
          }}
          type="submit"
        >
          Login
        </Button>
      </Flex>
    </form>
  );
};

export default Login;
