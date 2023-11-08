import { useContractEvent, useBalance } from "wagmi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import contractABI from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import { toast } from "react-toastify";
import { formatEther } from "viem";

function ScStats({ scAddress, address, quorem, owners }) {
  const smartContract = {
    address: scAddress,
    abi: contractABI.abi,
  };

  const { data: balanceData } = useBalance({
    address: process.env.REACT_APP_SC_ADDRESS,
    watch: true,
  });

  useContractEvent({
    address: scAddress,
    abi: smartContract.abi,
    eventName: "Deposit",
    listener(logs) {
      // console.log("DepositEvents: ", logs);

      // Filter event by user address
      if (logs[0]?.args && logs[0].args?.sender === address) {
        const userEvent = logs[0].args;
        console.log("user depositEvent: ", userEvent);
        const depositedAmt = formatEther(userEvent?.amount?.toString());
        // Display pop up notification
        toast.success(`Deposited ${depositedAmt} Eth!`);
      }
    },
  });

  return (
    <>
      <Row>
        <Col>
          <h1>Smart Contract Stats</h1>
          <p>Contract Address: {scAddress}</p>
          <p>
            Balance: {balanceData?.formatted} {balanceData?.symbol}
          </p>
          <p>Quorem: {quorem || ""}</p>
          <div>Owners</div>
          <ul>
            {owners?.map((owner) => (
              <li key={owner}>{owner}</li>
            ))}
          </ul>
        </Col>
      </Row>
    </>
  );
}

export default ScStats;
