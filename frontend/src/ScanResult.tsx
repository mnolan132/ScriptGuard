import { Box, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface ScanResultProps {
  threatDetected: null | boolean;
  darkMode: boolean;
  hasScanned: boolean;
}

const ScanResult: React.FC<ScanResultProps> = ({
  threatDetected,
  darkMode,
  hasScanned,
}) => {
  const safeMessage: string = "Safe from Injection Attacks!";
  const threatMessage: string = "Threats detected on this site!";

  return (
    <Box display={hasScanned ? "flex" : "none"} alignItems={"center"}>
      <Box
        h={"80px"}
        w={"80px"}
        mx={5}
        bg={threatDetected ? "#FC4D42" : "#6AE71E"}
        borderRadius={10}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <FontAwesomeIcon
          icon={threatDetected ? faTriangleExclamation : faSquareCheck}
          fontSize={"40px"}
          color={darkMode ? "#404258" : "#FBFAF5"}
        />
      </Box>
      <Text fontSize={"xl"}>
        {threatDetected ? threatMessage : safeMessage}
      </Text>
    </Box>
  );
};

export default ScanResult;
