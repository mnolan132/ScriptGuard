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
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useState } from "react";

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
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Define setUser prop
  checkSession: () => boolean;
}

const Scan: React.FC<ScanProps> = ({
  scan,
  hasScanned,
  darkMode,
  user,
  setUser,
  checkSession,
}) => {
  const [formData, setFormData] = useState<User | null>(null);

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
      <Accordion allowToggle display={hasScanned ? "none" : "block"}>
        <AccordionItem>
          <h2>
            <AccordionButton _expanded={{ bg: "#56F3FD" }}>
              <SettingsIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            display={"flex"}
            flexDirection={"column"}
            textAlign={"left"}
            h={"270px"}
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
                <Button
                  display={"flex"}
                  w={"160px"}
                  my={"5px"}
                  border={"3px solid #56F3FD"}
                  variant={"outline"}
                  color={darkMode ? "whitesmoke" : "#404258"}
                  _hover={{
                    background: darkMode ? "#ff0000" : "#ffbaba",
                  }}
                  onClick={() => {
                    console.log("Clicked");
                    document.cookie =
                      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    checkSession();
                    toast({
                      title: "You have logged out, goodbye!",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                  }}
                >
                  Log out
                </Button>
              </Flex>
            </form>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default Scan;
