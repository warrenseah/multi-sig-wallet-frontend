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
      console.log("Connected", { address, connector, isReconnected });
    },
  });
  // console.log("userAddress: ", address);

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1>Multi Sig Wallet</h1>
            <ConnectButton />
          </Col>
        </Row>
        <ScContract userAddress={address} />
      </Container>
    </div>
  );
}

export default App;
