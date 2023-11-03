import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScStats from "./components/ScStats";
import { useAccount, useContractEvent } from "wagmi";
import UserFeatures from "./components/UserFeatures";
import smartContract from "./artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

function App() {
  const { address, isConnected } = useAccount();

  useContractEvent({
    address: process.env.REACT_APP_SC_ADDRESS,
    abi: smartContract.abi,
    eventName: "Deposit",
    listener(log) {
      console.log("Deposit: ", log[0].args);
    },
  });

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1>Multi Sig Wallet</h1>
            <ConnectButton />
          </Col>
        </Row>
        <ScStats />
        {isConnected && (
          <>
            <UserFeatures address={address} />
          </>
        )}
      </Container>
    </div>
  );
}

export default App;
