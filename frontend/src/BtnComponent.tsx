import React from "react";
import { Button } from "@chakra-ui/react";

interface BtnComponentProps {
  type?: "button" | "submit" | "reset";
  buttonTheme: string;
  buttonLabelText: string;
  buttonClickFunction?: () => any;
}

const BtnComponent: React.FC<BtnComponentProps> = ({
  type,
  buttonTheme,
  buttonLabelText,
  buttonClickFunction,
}) => {
  return (
    <Button
      display={"flex"}
      minW={"140px"}
      my={"5px"}
      colorScheme={buttonTheme}
      type={type}
      onClick={buttonClickFunction}
    >
      {buttonLabelText}
    </Button>
  );
};

export default BtnComponent;
