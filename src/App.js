import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScStats from "./components/ScStats";
import { useAccount, useContractReads } from "wagmi";
import UserFeatures from "./components/UserFeatures";

import { toast } from "react-toastify";

import contractABI from "./artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

const smartContract = {
  address: process.env.REACT_APP_SC_ADDRESS,
  abi: contractABI.abi,
};

function App() {
  const { address, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      toast(`Connected to ${address}`);
      console.log("Connected", { address, connector, isReconnected });
    },
  });
  console.log("userAddress: ", address);

  const { data: readData } = useContractReads({
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
  const quorem = parseInt(readData[0]?.result);
  const owners = readData[1]?.result;
  // console.log("Owners: ", owners);
  const isOwner = owners?.includes(address);

  console.log("isOwner: ", isOwner);
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1>Multi Sig Wallet</h1>
            <ConnectButton />
          </Col>
        </Row>
        <ScStats address={address} quorem={quorem} owners={owners} />
        {isConnected && (
          <>
            <UserFeatures address={address} quorem={quorem} isOwner={isOwner} />
          </>
        )}
      </Container>
    </div>
  );
}

export default App;
