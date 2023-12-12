import "../assets/style/FactoryActions.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
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
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoRemoveCircleOutline } from "react-icons/io5";
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
    const validAddresses = formRows.filter((row) => isAddress(row.address));
    const result = validAddresses?.map((row) => {
      return row.address;
    });
    return result;
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
      <div className="create-wallet-section">
        <h2 className="fs-2">Create New Wallet</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formOwnerAddress">
            <Form.Label>Owner Address</Form.Label>
            <div className="">
              <div>
                {formRows.map((row, index) => (
                  <Form.Control
                    className="address-input"
                    key={row.id}
                    type="text"
                    placeholder={`Enter address ${row.id}`}
                    onChange={(e) => addAddressHandler(index, e.target.value)}
                  />
                ))}
              </div>
              <div>
                <Button
                  className="add-remove-btn rounded-4"
                  variant="danger"
                  onClick={() => {
                    setFormRows([...formRows, { id: formRows.length + 1 }]);
                  }}
                >
                  <IoIosAddCircleOutline size={25} />
                </Button>{" "}
                <Button
                  className="add-remove-btn rounded-4"
                  variant="danger"
                  onClick={() => {
                    if (formRows.length > 1) {
                      handleRmRow();
                    }
                  }}
                >
                  <IoRemoveCircleOutline size={25} />
                </Button>
              </div>
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formQuorem">
            <Form.Label>Quorem</Form.Label>
            <Form.Control
              className="address-input"
              type="number"
              step="1"
              placeholder="Enter a number"
              onChange={(e) => setQuoremRequired(e.target.value)}
              value={quoremRequired}
            />
          </Form.Group>
          <Button
            className="create-button rounded-4"
            disabled={!createWrite || isLoading}
            variant="danger"
            onClick={() => {
              // console.log("formRows: ", formRows);
              // console.log("debouncedQuorem: ", debouncedQuorem);
              // console.log("preparing: ", prepareAddresses());
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
      </div>
    </>
  );
}

export default FactoryActions;
