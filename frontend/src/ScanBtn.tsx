import React from "react";
import { Button } from "@chakra-ui/react";

interface ScanBtnProps {
  backgroundColor: string;
  buttonLabelText: string;
  clickFunction: () => any;
}

const ScanBtn: React.FC<ScanBtnProps> = ({
  backgroundColor,
  buttonLabelText,
  clickFunction,
}) => {
  return (
    <Button
      minW={"110px"}
      h={"40px"}
      borderRadius={10}
      mx={5}
      color={"#FFFFFF"}
      bgColor={backgroundColor}
      onClick={clickFunction}
      _hover={{ color: "#404258" }}
    >
      {buttonLabelText}
    </Button>
  );
};

export default ScanBtn;
