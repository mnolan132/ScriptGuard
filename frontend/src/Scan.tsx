import {
  Text,
  Button,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  Input,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

interface User {
  email: string;
  first_name: string;
  id: string;
  is_developer: string;
  last_name: string;
}

interface ScanProps {
  scan: () => void;
  hasScanned: boolean;
  darkMode: boolean;
  user: User | null;
}

const Scan: React.FC<ScanProps> = ({ scan, hasScanned, darkMode, user }) => {
  return (
    <Box>
      <Flex
        display={hasScanned ? "none" : "flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        m="5px"
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
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton _expanded={{ bg: "#56F3FD" }}>
              {/* <Box as="span" flex="1" textAlign="left">
                Settings
              </Box> */}
              <SettingsIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            display={"flex"}
            flexDirection={"column"}
            textAlign={"left"}
            h={"250px"}
          >
            <Text>Edit user settings</Text>
            <form>
              <Input
                my={"5px"}
                placeholder={user && user.first_name ? user.first_name : ""}
              />
              <Input
                my={"5px"}
                placeholder={user && user.last_name ? user.last_name : ""}
              />
              <Input
                my={"5px"}
                placeholder={user && user.email ? user.email : ""}
              />
              <Button
                display={"flex"}
                w={"160px"}
                my={"5px"}
                border={"3px solid #56F3FD"}
                variant={"outline"}
                color={darkMode ? "whitesmoke" : "#404258"}
                _hover={{
                  background: darkMode ? "#09b5b5" : "#defcfc",
                }}
                type="submit"
              >
                Save Changes
              </Button>
            </form>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default Scan;
