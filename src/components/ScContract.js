
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { isAddress } from "viem";
import '../App.css';
import ScStats from "./ScStats";
import UserFeatures from "./UserFeatures";

import contractABI from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import factoryABI from "../artifacts/contracts/Factory.sol/Factory.json";
import FactoryActions from "./FactoryActions";
import Tabs from "../utils/Tabs";
import '../App.css'

const factoryContract = {
  address: process.env.REACT_APP_FACTORY_ADDRESS,
  // address:"0x5FbDB2315678afecb367f032d93F642f64180aa3",
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

  console.log("factoryReadData: ", userAddress);

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
      <div style={{ margin: "5px" }}>
        <div>
          {factoryReadIsSuccess && (
            <> <div className="factory-section">
              <div className="factory-address">
                <span>Factory Address:</span>
                <span className="factory-address-value">{process.env.REACT_APP_FACTORY_ADDRESS}</span>
              </div>
              <div className="input-field">
                <Form.Select
                  disabled={factoryIsLoading}
                  aria-label="Default select example"
                  className="mt-3 mb-2 factory-address-form "
                  onChange={(e) => {
                    // console.log(e.target.value);
                    if (isAddress(e.target.value)) {
                      setScAddress(e.target.value);
                    }
                  }}
                >

                  <option>Select Contract Address</option>{
                  }
                  {factoryReadData?.map((address, index) => (
                    <option style={{ fontSize: "20px" }} key={address} value={address}>
                      {`walletID #${index + 1} ${address}`}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="factory-button">
                <Button
                  className="displayButton"
                  disabled={!isAddress(scAddress) || factoryIsLoading}
                  variant="danger"
                  onClick={() => {
                    // console.log(addressIsReady);
                    setAddressIsReady(true);
                  }}
                >
                  Display
                </Button>{" "}
                <Button
                  className="close-btn"
                  disabled={!addressIsReady || factoryIsLoading}
                  variant="danger"
                  onClick={() => {
                    // console.log(addressIsReady);
                    setAddressIsReady(false);
                  }}
                >
                  Close Contract
                </Button>
              </div>
            </div>
              {/* <div>
              <FactoryActions
                userAddress={userAddress}
                walletRefetch={walletRefetch}
              />
            </div> */}
            </>
          )}
        </div>

        {addressIsReady && (
          <div >
            <ScStats
              scAddress={scAddress}
              userAddress={userAddress}
              quorem={quorem}
              owners={owners}
            />
            <UserFeatures
              scAddress={scAddress}
              userAddress={userAddress}
              quorem={quorem}
              isOwner={isOwner}
            />
          </div>
        )}
      </div>

    </>
  );
}

export default ScContract;
