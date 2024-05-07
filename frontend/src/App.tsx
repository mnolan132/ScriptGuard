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

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [threatDetected, setThreatDetected] = useState<null | boolean>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [sessionCookie, setSessionCookie] = useState<string | undefined>();

  useEffect(() => {
    checkSession();
    checkDarkMode();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const checkDarkMode = () => {
    if (
      window &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }
  };

  const checkSession = () => {
    const cookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("session="));
    setSessionCookie(cookie);
  };

  const scan = () => {
    setHasScanned(true);
    let num = Math.floor(Math.random() * 10);
    if (num % 2 === 0) {
      setThreatDetected(false);
    } else {
      setThreatDetected(true);
    }
    let url: string = window.location.href;
  };

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
          <>
            <Tabs variant="soft-rounded" colorScheme="green" h={"400px"}>
              <TabList m={"10px"}>
                <Tab mx={"5px"}>Log in</Tab>
                <Tab mx={"5px"}>Sign up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login checkSession={checkSession} darkMode={darkMode} />
                </TabPanel>
                <TabPanel>
                  <SignUp darkMode={darkMode} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        ) : (
          <Scan hasScanned={hasScanned} scan={scan} />
        )}
        <ScanResult
          hasScanned={hasScanned}
          darkMode={darkMode}
          threatDetected={threatDetected}
        />
        <ToggleDarkMode toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </Box>
    </ChakraProvider>
  );
};

export default App;
