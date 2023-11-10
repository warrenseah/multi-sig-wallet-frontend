import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import {
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { isAddress } from "viem";
import { toast } from "react-toastify";
import factoryABI from "../artifacts/contracts/Factory.sol/Factory.json";
import useDebounce from "../hooks/useDebounce";

const factoryContract = {
  address: process.env.REACT_APP_FACTORY_ADDRESS,
  abi: factoryABI.abi,
};

function FactoryActions({ userAddress, walletRefetch }) {
  useContractEvent({
    ...factoryContract,
    eventName: "WalletCreated",
    listener(logs) {
      // console.log("WalletCreated event: ", logs);
      // Fetch and display a new list
      walletRefetch();
      // console.log("A new wallet is fetched");
      if (logs[0].args.sender === userAddress) {
        const userEvent = logs[0].args;
        // console.log("user createWithdrawTxnEvent: ", userEvent);
        // Display pop up notification
        toast.success(`Wallet Id #${parseInt(userEvent?.index)} created!`);
      }
    },
  });

  const [formRows, setFormRows] = useState([{ id: 1 }]);
  const [quoremRequired, setQuoremRequired] = useState("");

  const debouncedQuorem = useDebounce(quoremRequired, 1500);

  const addAddressHandler = (index, address) => {
    const temp = [...formRows];
    temp[index]["address"] = address;
    setFormRows(temp);
  };

  const handleRmRow = () => {
    const temp = [...formRows];
    temp.pop();
    setFormRows(temp);
  };

  // useEffect(() => {
  //   console.log("formRows: ", formRows);
  //   console.log("debounceValue: ", debouncedQuorem);
  // }, [formRows, debouncedQuorem]);

  const prepareAddresses = () => {
    return formRows.map((row) => {
      if (isAddress(row.address)) {
        return row.address;
      }
    });
  };

  // Factory contract write functions
  const { config: createConfig } = usePrepareContractWrite({
    ...factoryContract,
    functionName: "createNewWallet",
    args: [prepareAddresses(), debouncedQuorem],
    enabled: Boolean(debouncedQuorem),
  });

  const { data: createData, write: createWrite } =
    useContractWrite(createConfig);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: createData?.hash,
  });

  return (
    <>
      <h2>Create New Wallet</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formOwnerAddress">
          <Form.Label>Owner Address</Form.Label>
          {formRows.map((row, index) => (
            <Form.Control
              key={row.id}
              type="text"
              placeholder={`Enter address ${row.id}`}
              onChange={(e) => addAddressHandler(index, e.target.value)}
            />
          ))}
        </Form.Group>
        <Button
          variant="secondary"
          onClick={() => {
            setFormRows([...formRows, { id: formRows.length + 1 }]);
          }}
        >
          +
        </Button>{" "}
        <Button
          variant="secondary"
          onClick={() => {
            if (formRows.length > 1) {
              handleRmRow();
            }
          }}
        >
          -
        </Button>
        <Form.Group className="mb-3" controlId="formQuorem">
          <Form.Label>Quorem</Form.Label>
          <Form.Control
            type="number"
            step="1"
            placeholder="Enter a number"
            onChange={(e) => setQuoremRequired(e.target.value)}
            value={quoremRequired}
          />
        </Form.Group>
        <Button
          disabled={!createWrite || isLoading}
          variant="primary"
          onClick={() => {
            // console.log("formRows: ", formRows);
            // console.log("debouncedQuorem: ", debouncedQuorem);
            createWrite?.();
          }}
        >
          {isLoading ? "Creating..." : "Create"}
        </Button>
        {isSuccess && (
          <div>
            Created a new wallet successfully!
            <div>
              <a href={`https://etherscan.io/tx/${createData?.hash}`}>
                Etherscan
              </a>
            </div>
          </div>
        )}
      </Form>
    </>
  );
}

export default FactoryActions;
