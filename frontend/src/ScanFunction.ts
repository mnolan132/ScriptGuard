declare let chrome: any;

const scan = async (
  setVulnerabilityReport: (arg0: any) => void,
  setHasScanned: (arg0: boolean) => void,
  setThreatDetected: (arg0: boolean | null) => void,
  fetchUrl: string,
  setIsLoaded: (arg0: boolean) => void
) => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs: { url: string }[]) {
      const url = tabs[0].url;
      const data = { url };

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Stringify the object containing the URL
      };

      try {
        setIsLoaded(false);
        const response = await fetch(fetchUrl, options);
        if (response.status !== 200) {
          const responseData = await response.json();
          alert(responseData.message);
        } else {
          console.log(response.formData);
          const responseData = await response.json();
          setVulnerabilityReport(responseData);
          console.log(responseData.message);
          setHasScanned(true);
          if (
            (responseData.xss && responseData.xss === "XSS threats detected") ||
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

export default scan;
