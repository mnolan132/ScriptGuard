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

declare let chrome: any;
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

  const scan = async () => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs: { url: string }[]) {
        const url = tabs[0].url;
        const data = { url }; // Create an object with a property named 'url'
        // Now you can use the 'data' object here or call a function passing 'data'
        console.log(data);

        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // Stringify the object containing the URL
        };

        try {
          const response = await fetch(
            "http://127.0.0.1:5000/basic_scan",
            options
          );
          if (response.status !== 200) {
            const responseData = await response.json();
            alert(responseData.message);
          } else {
            console.log(response.formData);
            const responseData = await response.json();
            setHasScanned(true);
            if (
              (responseData.xss &&
                responseData.xss === "XSS threats detected") ||
              (responseData.sql &&
                responseData.sql === "SQL Injection vulnerability detected")
            ) {
              setThreatDetected(true);
            } else if (
              (responseData.xss && responseData.xss !== null) ||
              (responseData.sql && responseData.sql !== null)
            ) {
              setThreatDetected(false);
            } else {
              setThreatDetected(null);
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    );
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
        ) : (
          <Scan hasScanned={hasScanned} scan={scan} darkMode={darkMode} />
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
