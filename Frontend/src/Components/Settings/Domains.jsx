import { useState, useEffect } from "react";
import { checkDomains, addDomain, deleteDomain, getDomains } from "../../Api/Main.js";
import Line from "../Ui/Line.jsx";
import Button from "../Ui/Button.jsx";
import Clarification from "../Ui/Clarification.jsx";
import Input from "../Ui/Input.jsx";
import InputLabel from "../Ui/InputLabel.jsx";
import { FaTimesCircle, FaCheckCircle, FaHourglassHalf, FaSyncAlt, FaTrashAlt } from "react-icons/fa";

function Domains() {
  const [domains, setDomains] = useState([]);
  const [domainStatuses, setDomainStatuses] = useState({});
  const [errorDetails, setErrorDetails] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [addError, setAddError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const data = await getDomains();
        setDomains(data.domains);
        const initialStatuses = data.domains.reduce((acc, domain) => {
          acc[domain] = "checking";
          return acc;
        }, {});
        setDomainStatuses(initialStatuses);

        const checkData = await checkDomains(data.domains);
        const results = checkData.results;
        const newStatuses = data.domains.reduce((acc, domain) => {
          const result = results[domain];
          acc[domain] = result.status;
          if (result.error) {
            console.error(`Error for ${domain}: ${result.error}`);
          }
          return acc;
        }, {});
        setDomainStatuses(newStatuses);
      } catch (error) {
        if (error.message === 'No token provided' || error.message === 'Invalid token') {
          setErrorDetails('Please log in to view domains');
        } else if (error.message === 'Admin access required') {
          setErrorDetails('Only administrators can manage domains');
        } else {
          setErrorDetails(`Error checking domains: ${error.message}`);
        }
        setDomainStatuses(
          domains.reduce((acc, domain) => {
            acc[domain] = "problems";
            return acc;
          }, {})
        );
      }
    };
    fetchDomains();
  }, []);

  useEffect(() => {
    if (errorDetails) {
      console.error(errorDetails);
    }

  }, [errorDetails]);

  const handleRefresh = async (domain) => {
    setDomainStatuses((prev) => ({ ...prev, [domain]: "checking" }));
    try {
      const data = await checkDomains([domain]);
      const result = data.results[domain];
      setDomainStatuses((prev) => ({ ...prev, [domain]: result.status }));
      if (result.error) {
        console.error(`Error for ${domain}: ${result.error}`);
      }
    } catch (error) {
      setDomainStatuses((prev) => ({ ...prev, [domain]: "problems" }));
      if (error.message === 'Admin access required') {
        setErrorDetails('Only administrators can manage domains');
      } else {
        setErrorDetails(`Error refreshing ${domain}: ${error.message}`);
      }
    }
  };

  const handleDelete = async (domain) => {
    try {
      await deleteDomain(domain);
      setDomains((prev) => prev.filter((d) => d !== domain));
      setDomainStatuses((prev) => {
        const newStatuses = { ...prev };
        delete newStatuses[domain];
        return newStatuses;
      });
      setDeleteConfirm(null);
    } catch (error) {
      if (error.message === 'Admin access required') {
        setErrorDetails('Only administrators can manage domains');
      } else {
        setErrorDetails(`Error deleting ${domain}: ${error.message}`);
      }
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setAddError("Invalid domain format");
      return;
    }
    try {
      const data = await addDomain(newDomain);
      setDomains((prev) => [...prev, data.domain]);
      setDomainStatuses((prev) => ({ ...prev, [data.domain]: "checking" }));
      setShowAddModal(false);
      setNewDomain("");
      setAddError("");
      const checkData = await checkDomains([data.domain]);
      const result = checkData.results[data.domain];
      setDomainStatuses((prev) => ({ ...prev, [data.domain]: result.status }));
    } catch (error) {
      if (error.message === 'Admin access required') {
        setAddError('Only administrators can manage domains');
      } else {
        setAddError(error.message);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return <FaCheckCircle className="text-green-500" />;
      case "offline":
        return <FaTimesCircle className="text-red-500" />;
      case "checking":
        return <FaHourglassHalf className="text-yellow-500" />;
      default:
        return <FaTimesCircle className="text-red-500" />;
    }
  };

  return (
    <div className="w-full h-full p-[15px] m-auto mt-[32px]">
      {errorDetails && (
        <div className="text-red-500 text-center mb-[20px]">{errorDetails}</div>
      )}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-text-primary text-[20px] font-medium">Привязанные домены</span>
          <span className="mt-[12px] text-text-secondary-60 text-[18px]">Добавленные домены будут обрабатываться почтовым сервером</span>
        </div>
        <Button className="h-[45px]" onClick={() => setShowAddModal(true)}>
          Добавить
        </Button>
      </div>
      <Line className="mb-[22px] mt-[32px]" />
      {domains.map((domain, index) => (
        <div className="mt-[10px]" key={domain}>
          <span className="text-text-secondary text-[16px]">Domain #{index + 1}</span>
          <div className="select-none flex justify-between mt-[10px] text-text-primary text-[16px] bg-input border border-stroke h-full p-[12px] rounded-[10px]">
            <div className="flex items-center">
              {getStatusIcon(domainStatuses[domain])}
              <span className="ml-[8px]">{domain}</span>
            </div>
            <div className="flex items-center">
              <FaSyncAlt
                className="text-icons hover-anim mr-[10px] cursor-pointer"
                onClick={() => handleRefresh(domain)}
              />
              <FaTrashAlt
                className="text-icons hover-anim cursor-pointer"
                onClick={() => setDeleteConfirm(domain)}
              />
            </div>
          </div>
        </div>
      ))}
      {showAddModal && (
        <div className="absolute inset-0 bg-bg-main/60 z-40 flex justify-center items-center">
          <div className="bg-container max-w-[382px] w-full pt-[20px] rounded-[24px]">
            <div className="flex justify-between items-center px-[24px]">
              <div className="text-text-primary text-[24px] font-bold">Add Domain</div>
              <button
                className="w-[24px] h-[24px] bg-input rounded-full flex items-center justify-center text-text-primary"
                onClick={() => {
                  setShowAddModal(false);
                  setNewDomain("");
                  setAddError("");
                }}
              >
                ✕
              </button>
            </div>
            <Line className="mt-[20px]" />
            <div className="my-[20px] mx-[24px] py-[14px] px-[20px]">
              <InputLabel text="Domain" />
              <Input
                className="w-full"
                type="text"
                placeholder="example.com"
                value={newDomain}
                setValue={(e) => {
                  setNewDomain(e.target.value);
                  setAddError("");
                }}
              />
              {addError && <p className="text-red-500 mt-[10px]">{addError}</p>}
            </div>
            <div className="flex justify-center items-center my-[20px] mx-[24px]">
              <button
                className="p-[12px] bg-bg-active text-text-secondary rounded-[10px] w-[176px] text-center mr-[10px] hover-anim"
                onClick={() => {
                  setShowAddModal(false);
                  setNewDomain("");
                  setAddError("");
                }}
              >
                Cancel
              </button>
              <button
                className="p-[12px] bg-primary text-[#fff] rounded-[10px] w-[176px] text-center hover-anim"
                onClick={handleAddDomain}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirm && (
        <div className="absolute left-0 top-0 inset-0 bg-bg-main/60 z-40">
          <Clarification
            title="Delete Domain"
            text={`Are you sure you want to delete ${deleteConfirm}?`}
            buttonText="Delete"
            onClick={() => handleDelete(deleteConfirm)}
            backButtonClick={() => setDeleteConfirm(null)}
          />
        </div>
      )}
    </div>
  );
}

export default Domains;