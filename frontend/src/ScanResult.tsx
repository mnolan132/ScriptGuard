import { useEffect } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface VulnerabilityReport {
  [key: string]: string;
}

interface User {
  email: string;
  first_name: string;
  id: string;
  is_developer: string;
  last_name: string;
}

interface ScanResultProps {
  threatDetected: null | boolean;
  darkMode: boolean;
  hasScanned: boolean;
  vulnerabilityReport: VulnerabilityReport;
  user: User | null;
}

const ScanResult: React.FC<ScanResultProps> = ({
  threatDetected,
  darkMode,
  hasScanned,
  vulnerabilityReport,
  user,
}) => {
  const safeMessage: string = "Safe from Injection Attacks!";
  const threatMessage: string = "Threats detected on this site!";

  return (
    <Box display={threatDetected ? "block" : "flex"}>
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
      <Accordion
        allowToggle
        display={threatDetected ? "block" : "none"}
        mt={"5px"}
      >
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Vulnerability Report
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Box textAlign={"left"}>
              {Object.keys(vulnerabilityReport).map((key, i) => (
                <>
                  <Text as="b" fontSize="large" key={i}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <Text fontSize={"medium"}>
                    {vulnerabilityReport[key].charAt(0).toUpperCase() +
                      vulnerabilityReport[key].slice(1) +
                      "."}
                  </Text>
                </>
              ))}
            </Box>

            <Text mt="10px" textAlign={"left"} fontSize={"medium"}>
              {user?.is_developer === "false"
                ? `    Based on the results of our scan, we cannot recommend sharing any
              personal information with this site. The scan revealed
              vulnerabilities that could be exploited, putting any information
              you provide at risk of being leaked to malicious actors. Please
              exercise caution when sharing information with this platform.`
                : `To protect against XSS (Cross-Site Scripting) and SQL injection attacks, developers should adopt key security practices. For XSS prevention, always escape user inputs and use frameworks that handle this automatically. Implement Content Security Policy (CSP) headers to restrict script sources. For SQL injection protection, use parameterized queries or prepared statements instead of directly concatenating user inputs into SQL queries. Utilize ORM (Object-Relational Mapping) libraries that inherently use secure methods for database interactions. Regularly update software dependencies, conduct security audits, and perform code reviews to identify vulnerabilities. Additionally, use security-focused tools to detect and mitigate threats, and educate your team about secure coding practices. By following these strategies, developers can significantly reduce the risk of XSS and SQL injection attacks.`}
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default ScanResult;
