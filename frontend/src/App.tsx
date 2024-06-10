import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Scan from "./Scan";
import "./App.css";
import ToggleDarkMode from "./ToggleDarkMode";
import ScanResult from "./ScanResult";
import SignUp from "./SignUp";
import Login from "./Login";
import { User } from "./User.ts";

interface VulnerabilityReport {
  [key: string]: string;
}

declare let chrome: any;
const App = () => {
  //State variables, these are the global state variables (as this is the parent component for the rest of the app)
  const [darkMode, setDarkMode] = useState(false);
  const [threatDetected, setThreatDetected] = useState<null | boolean>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [sessionCookie, setSessionCookie] = useState<string | undefined>(
    document.cookie.substring(8)
  );
  const [user, setUser] = useState<User | null>(null);
  const [vulnerabilityReport, setVulnerabilityReport] =
    useState<VulnerabilityReport>({});

  //This method will run whenever sessionCookie is updated
  useEffect(() => {
    if (sessionCookie) {
      fetchUser();
    }
    checkDarkMode();
  }, [sessionCookie]);

  // This method will run whenever user is updated
  useEffect(() => {
    console.log("User state updated:", user); // Log user state changes
  }, [user]);

  // This function sets the dark mode of the app to match the users system preferences
  const checkDarkMode = () => {
    if (
      window &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }
  };

  // This function toggles darkmode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // This function will check the users cookies for a valid session
  const checkSession = () => {
    const cookie = document.cookie.substring(8);
    setSessionCookie(cookie);

    return cookie !== undefined; // Return true if cookie is defined
  };

  // This function is responsible for fetching user information from the backend if there is a session, and handling that data by updating the user state variable
  const fetchUser = async () => {
    if (!sessionCookie) {
      console.info("Session cookie is undefined");
      return;
    }
    const cleanSessionCookie = sessionCookie.replace(/^"|"$/g, ""); // Remove surrounding double quotes
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/user/${cleanSessionCookie}`
      );
      if (!response.ok) {
        console.error("Failed to fetch user data");
        return;
      }
      const data = await response.json();
      console.log("Fetched user data:", data); // Log the fetched data
      const userInstance = new User(
        data.email,
        data.first_name,
        data.id,
        data.is_developer,
        data.last_name
      );
      setUser(userInstance);
      console.log("User instance created:", userInstance); // Log the user instance
      console.log("Log state user variable: " + user);
    } catch (error) {
      console.error("An error occurred while fetching user data", error);
    }
  };

  // Global styles
  const bgColor = darkMode ? "#404258" : "#FBFAF5";
  const textColor = darkMode ? "whitesmoke" : "#404258";

  return (
    <ChakraProvider>
      <Box
        backgroundColor={bgColor}
        textColor={textColor}
        padding={"5px"}
        display={"flex"}
        minH={"100px"}
      >
        {!sessionCookie ? (
          <Tabs variant="soft-rounded" colorScheme="green" h={"400px"}>
            <TabList m={"10px"}>
              <Tab mx={"5px"}>Log in</Tab>
              <Tab mx={"5px"}>Sign up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login
                  checkSession={checkSession}
                  darkMode={darkMode}
                  fetchUser={fetchUser}
                />
              </TabPanel>
              <TabPanel>
                <SignUp darkMode={darkMode} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <Scan
            hasScanned={hasScanned}
            darkMode={darkMode}
            user={user}
            setUser={setUser}
            checkSession={checkSession}
            setVulnerabilityReport={setVulnerabilityReport}
            setHasScanned={setHasScanned}
            setThreatDetected={setThreatDetected}
          />
        )}

        <ScanResult
          hasScanned={hasScanned}
          darkMode={darkMode}
          threatDetected={threatDetected}
          vulnerabilityReport={vulnerabilityReport}
          user={user}
        />

        <ToggleDarkMode toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </Box>
    </ChakraProvider>
  );
};

export default App;
