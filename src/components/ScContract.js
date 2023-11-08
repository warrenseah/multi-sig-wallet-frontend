import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useContractReads } from "wagmi";
import { isAddress } from "viem";

import ScStats from "./ScStats";
import UserFeatures from "./UserFeatures";

import contractABI from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

function ScContract({ userAddress }) {
  const [addressIsReady, setAddressIsReady] = useState(false);
  const [scAddress, setScAddress] = useState("");

  const smartContract = {
    address: scAddress,
    abi: contractABI.abi,
  };

  const { data: readData, isSuccess } = useContractReads({
    contracts: [
      {
        ...smartContract,
        functionName: "quoremRequired",
      },
      {
        ...smartContract,
        functionName: "getOwners",
      },
    ],
  });

  // console.log("appReadData: ", readData);
  const quorem = isSuccess ? parseInt(readData[0]?.result) : null;
  const owners = isSuccess ? readData[1]?.result : [];
  // console.log("Owners: ", owners);
  const isOwner = owners?.includes(userAddress);

  // console.log("isOwner: ", isOwner);

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formSCAddress">
          <Form.Label>Smart Contract Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            onChange={(e) => {
              if (isAddress(e.target.value)) {
                setScAddress(e.target.value);
              }
            }}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={() => {
            // console.log(addressIsReady);
            if (isAddress(scAddress)) {
              setAddressIsReady(true);
            } else {
              setAddressIsReady(false);
            }
          }}
        >
          Submit
        </Button>
      </Form>

      {addressIsReady && (
        <>
          <ScStats
            scAddress={scAddress}
            address={userAddress}
            quorem={quorem}
            owners={owners}
          />

          <UserFeatures
            scAddress={scAddress}
            address={userAddress}
            quorem={quorem}
            isOwner={isOwner}
          />
        </>
      )}
    </>
  );
}

export default ScContract;
