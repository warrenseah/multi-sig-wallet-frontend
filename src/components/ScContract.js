import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { isAddress } from "viem";

import ScStats from "./ScStats";
import UserFeatures from "./UserFeatures";

import contractABI from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import factoryABI from "../artifacts/contracts/Factory.sol/Factory.json";

const factoryContract = {
  address: process.env.REACT_APP_FACTORY_ADDRESS,
  abi: factoryABI.abi,
};

function ScContract({ userAddress }) {
  const [addressIsReady, setAddressIsReady] = useState(false);
  const [scAddress, setScAddress] = useState();

  const {
    data: factoryReadData,
    isLoading: factoryIsLoading,
    isSuccess: factoryReadIsSuccess,
    refetch: walletRefetch,
  } = useContractRead({
    ...factoryContract,
    functionName: "getWalletList",
  });

  // console.log("factoryReadData: ", factoryReadData);

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
      <Row>
        <Col>Factory Address: {process.env.REACT_APP_FACTORY_ADDRESS}</Col>
      </Row>
      {factoryReadIsSuccess && (
        <>
          <Form.Select
            disabled={factoryIsLoading}
            aria-label="Select smart contract address"
            onChange={(e) => {
              console.log(e.target.value);
              if (isAddress(e.target.value)) {
                setScAddress(e.target.value);
              }
            }}
          >
            <option>Select Contract Address</option>
            {factoryReadData?.map((address) => (
              <option key={address} value={address}>
                {address}
              </option>
            ))}
          </Form.Select>
          <Button
            disabled={!isAddress(scAddress) || factoryIsLoading}
            variant="primary"
            onClick={() => {
              // console.log(addressIsReady);
              setAddressIsReady(true);
            }}
          >
            Display
          </Button>{" "}
          <Button
            disabled={!addressIsReady || factoryIsLoading}
            variant="danger"
            onClick={() => {
              // console.log(addressIsReady);
              setAddressIsReady(false);
            }}
          >
            Close Contract
          </Button>
        </>
      )}

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
