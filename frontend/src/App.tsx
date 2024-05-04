import { useState } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import Scan from "./Scan";
import "./App.css";
import ToggleDarkMode from "./ToggleDarkMode";
import ScanResult from "./ScanResult";
import SignUp from "./SignUp";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [threatDetected, setThreatDetected] = useState<null | boolean>(null);
  const [hasScanned, setHasScanned] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
    console.log(url);
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
      >
        {document.cookie == "" ? (
          <SignUp darkMode={darkMode} />
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