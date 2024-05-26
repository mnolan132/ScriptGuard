import React from "react";
import { Button } from "@chakra-ui/react";

interface SettingsBtnProps {
  type?: "button" | "submit" | "reset";
  buttonTheme: string;
  buttonLabelText: string;
  buttonClickFunction?: () => any;
}

const SettingsBtn: React.FC<SettingsBtnProps> = ({
  type,
  buttonTheme,
  buttonLabelText,
  buttonClickFunction,
}) => {
  return (
    <Button
      display={"flex"}
      w={"160px"}
      my={"5px"}
      colorScheme={buttonTheme}
      type={type}
      onClick={buttonClickFunction}
    >
      {buttonLabelText}
    </Button>
  );
};

export default SettingsBtn;
