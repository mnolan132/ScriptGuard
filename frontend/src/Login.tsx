import React, { useState } from "react";
import {
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Flex,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

interface LoginProps {
  darkMode: boolean;
  checkSession: () => void;
  fetchUser: () => void;
}

const Login: React.FC<LoginProps> = ({ darkMode, checkSession, fetchUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toast = useToast();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      });
      document.cookie = "session=" + JSON.stringify(response.data.id);
      checkSession();
      fetchUser();
      toast({
        title: "Login successful",
        description: "Welcome back!",
        status: "success",
        isClosable: true,
      });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        toast({
          title: "Warning",
          description: err.response.data.error,
          status: "error",
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
        <FormControl isRequired w="300px" m={"10px"}>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </FormControl>
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
