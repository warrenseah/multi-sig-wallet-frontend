import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useAccount } from "wagmi";
import { toast } from "react-toastify";

import ScContract from "./components/ScContract";
function App() {
  const { address, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      toast(`Connected to ${address}`);
      // console.log("Connected", { address, connector, isReconnected });
    },
  });
  // console.log("userAddress: ", address);

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between flex-wrap align-items-baseline top-container">
            <h1 className="logo">Multi Sig Wallet</h1>
            <div className="connection-button">
              <ConnectButton />
            </div>
          </div>
        </Col>
      </Row>
      {isConnected && <ScContract userAddress={address} />}
    </Container>
  );
}

export default App;
