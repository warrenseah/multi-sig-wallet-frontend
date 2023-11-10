import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useContractEvent } from "wagmi";
import { toast } from "react-toastify";
import factoryABI from "../artifacts/contracts/Factory.sol/Factory.json";

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
  const [quoremRequired, setQuoremRequired] = useState();

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

  useEffect(() => {
    console.log("formRows: ", formRows);
  }, [formRows]);
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
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => {
            console.log("formRows: ", formRows);
            console.log("quoremRequired: ", quoremRequired);
          }}
        >
          Create
        </Button>
      </Form>
    </>
  );
}

export default FactoryActions;
