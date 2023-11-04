import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScStats from "./components/ScStats";
import { useAccount } from "wagmi";
import UserFeatures from "./components/UserFeatures";

import { toast } from "react-toastify";

function App() {
  const { address, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      toast(`Connected to ${address}`);
      console.log("Connected", { address, connector, isReconnected });
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
        <ScStats address={address} />
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
