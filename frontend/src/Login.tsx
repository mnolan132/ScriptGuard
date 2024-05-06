import React, { useState } from "react";
import { FormControl, Input, Button, FormErrorMessage } from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      console.log(response.data);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occured");
      }
    }
  };

  return (
    <form onSubmit={login}>
      <FormControl isRequired>
        <Input
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
      </FormControl>
      <FormControl>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
      </FormControl>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      <Button>Login</Button>
    </form>
  );
};

export default Login;
