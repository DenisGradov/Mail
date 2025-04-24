import { checkValid } from "../../Api/Main.js";
import { useState, useEffect } from "react";

function Domains() {
  const VITE_DEFAULT_DOMAIN = import.meta.env.VITE_DEFAULT_DOMAIN;
  const [status, setStatus] = useState("checking");
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const checkDomain = async () => {
      try {
        // Add protocol if not present
        const domain = VITE_DEFAULT_DOMAIN.startsWith('http')
          ? VITE_DEFAULT_DOMAIN
          : `https://${VITE_DEFAULT_DOMAIN}`;

        const response = await checkValid(domain);

        // Check if response indicates successful backend operation
        if (response.status === 200 && response.data?.success) {
          setStatus("online");
        } else {
          setStatus("problems");
          setErrorDetails(`Backend responded with issues: ${JSON.stringify(response.data)}`);
        }
      } catch (error) {
        if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
          setStatus("offline");
        } else {
          setStatus("problems");
          setErrorDetails(`Error checking domain: ${error.message} ${error.response ? JSON.stringify(error.response.data) : ''}`);
        }
      }
    };

    checkDomain();
  }, [VITE_DEFAULT_DOMAIN]);

  useEffect(() => {
    if (errorDetails) {
      console.error(errorDetails);
    }
  }, [errorDetails]);

  return (
    <div className="w-full h-full p-[15px] m-auto">
      <h2>Domains</h2>
      <div>
        {`https://${VITE_DEFAULT_DOMAIN}`} - {status}
      </div>
    </div>
  );
}

export default Domains;