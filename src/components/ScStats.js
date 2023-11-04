import { useContractReads, useContractEvent, useBalance } from "wagmi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import contractABI from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

const smartContract = {
  address: process.env.REACT_APP_SC_ADDRESS,
  abi: contractABI.abi,
};

  const { data: balanceData, refetch: balanceRefetch } = useBalance({
    address: process.env.REACT_APP_SC_ADDRESS,
  });

  const { data } = useContractReads({
    contracts: [
      {
        ...smartContract,
        functionName: "getOwners",
      },
      {
        ...smartContract,
        functionName: "quoremRequired",
      },
    ],
  });

  useContractEvent({
    address: process.env.REACT_APP_SC_ADDRESS,
    abi: smartContract.abi,
    eventName: "Deposit",
    listener(log) {
      console.log("Deposit: ", log[0].args);
      // balanceRefetch();
    },
  });

  return (
    <>
      <Row>
        <Col>
          <h1>Smart Contract Stats</h1>
          <p>Contract Address: {process.env.REACT_APP_SC_ADDRESS}</p>
          <p>
            Balance: {balanceData?.formatted} {balanceData?.symbol}
          </p>
          <p>Quorem: {data[1]?.result && data[1].result.toString()}</p>
          <div>Owners</div>
          <ul>
            {data[0].result?.length > 0 &&
              data[0].result.map((owner) => <li key={owner}>{owner}</li>)}
          </ul>
        </Col>
      </Row>
    </>
  );
}

export default ScStats;
