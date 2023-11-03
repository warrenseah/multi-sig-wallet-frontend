import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScStats from "./components/ScStats";
import { useAccount } from "wagmi";
import UserFeatures from "./components/UserFeatures";

function App() {
  const { address, isConnected } = useAccount();

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
