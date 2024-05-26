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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ScanBtn from "./ScanBtn";
import SettingsBtn from "./SettingsBtn";

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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  checkSession: () => boolean;
}

const Scan: React.FC<ScanProps> = ({
  scan,
  hasScanned,
  user,
  setUser,
  checkSession,
}) => {
  const [formData, setFormData] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData || !user) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/update_user/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast({
          title: "Update successful!",
          status: "success",
          position: "top",
          duration: 5000,
          isClosable: true,
        });

        // Fetch updated user data
        const updatedUserData = await fetchUser(user.id);

        // Update the 'user' state with the updated user data
        setUser(updatedUserData);
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Function to fetch user data
  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        console.error("Failed to fetch user data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(
      (prevData: User | null) =>
        ({
          ...(prevData || {}), // Ensure prevData is not null
          [name]: value || "", // Ensure value is always a string
        } as User | null)
    ); // Explicitly specify the return type
  };

  const deleteUser = async (userId: string | undefined) => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        `http://127.0.0.1:5000/delete_user/${userId}`,
        options
      );
      if (response.status === 200) {
        document.cookie =
          "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        checkSession();
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleDeleteClick = (userId: string | undefined) => {
    deleteUser(userId);
  };

  return (
    <Box>
      <Box display={hasScanned ? "none" : "block"}>
        <Flex
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          m="5px"
        >
          <ScanBtn
            backgroundColor="#6AE71E"
            buttonLabelText="SCAN"
            clickFunction={scan}
          />
          <Text fontSize={"xl"}>Scan the page for vulnerabilities</Text>
        </Flex>
        <Flex
          display={user?.is_developer === "false" ? "none" : "flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          m="5px"
        >
          <ScanBtn
            backgroundColor="#924dbf"
            buttonLabelText="Deep Scan"
            clickFunction={scan}
          />

          <Text fontSize={"xl"}>Scan the whole site for vulnerabilities</Text>
        </Flex>
      </Box>
      <Accordion allowToggle display={hasScanned ? "none" : "block"}>
        <AccordionItem>
          <h2>
            <AccordionButton _expanded={{ bg: "#56F3FD" }}>
              <Box as="span" flex="1" textAlign="left">
                User Settings
              </Box>
              <SettingsIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            display={"flex"}
            flexDirection={"column"}
            textAlign={"left"}
            h={"290px"}
          >
            <Text>Edit user settings</Text>
            <form onSubmit={handleSubmit}>
              <Input
                name="first_name"
                my={"5px"}
                defaultValue={user?.first_name}
                onChange={handleChange}
              />
              <Input
                name="last_name"
                my={"5px"}
                defaultValue={user?.last_name}
                onChange={handleChange}
              />
              <Input
                name="email"
                my={"5px"}
                defaultValue={user?.email}
                onChange={handleChange}
              />
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <SettingsBtn
                  type="submit"
                  buttonTheme="green"
                  buttonLabelText="Save Changes"
                />

                <SettingsBtn
                  buttonTheme="orange"
                  buttonLabelText="Log Out"
                  buttonClickFunction={() => {
                    console.log("Clicked");
                    document.cookie =
                      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                    checkSession();
                    toast({
                      title: "You have logged out, goodbye!",
                      status: "success",
                      position: "top",
                      duration: 5000,
                      isClosable: true,
                    });
                  }}
                />
              </Flex>

              <SettingsBtn
                buttonTheme="red"
                buttonLabelText="Delete Account"
                buttonClickFunction={onOpen}
              />
            </form>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>DELETING ACCOUNT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you wish to permanantlty delete this account?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleDeleteClick(user ? user.id : undefined)}
            >
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Scan;
