import React from "react";
import { Button } from "@chakra-ui/react";

interface BtnComponentProps {
  type?: "button" | "submit" | "reset";
  buttonTheme: string;
  buttonLabelText: string;
  buttonClickFunction?: () => any;
  scanFunction?: () => Promise<void>;
}

const BtnComponent: React.FC<BtnComponentProps> = ({
  type,
  buttonTheme,
  buttonLabelText,
  buttonClickFunction,
  scanFunction,
}) => {
  const handleClick = async () => {
    if (buttonClickFunction) {
      buttonClickFunction();
    } else if (scanFunction) {
      await scanFunction();
    }
  };
  return (
    <Button
      display={"flex"}
      minW={"140px"}
      my={"5px"}
      colorScheme={buttonTheme}
      type={type}
      onClick={handleClick}
    >
      {buttonLabelText}
    </Button>
  );
};

export default BtnComponent;
