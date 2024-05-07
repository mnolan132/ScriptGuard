import { Text, Button, Flex, Box } from "@chakra-ui/react";

interface ScanProps {
  scan: () => void;
  hasScanned: boolean;
}

const Scan: React.FC<ScanProps> = ({ scan, hasScanned }) => {
  return (
    <Flex
      display={hasScanned ? "none" : "flex"}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Button
        w={"80px"}
        h={"80px"}
        borderRadius={80}
        mx={5}
        color={"#FFFFFF"}
        bgColor="#6AE71E"
        onClick={scan}
      >
        SCAN
      </Button>
      <Text fontSize={"xl"}>Scan the site for vulnerabilities</Text>
    </Flex>
  );
};

export default Scan;
