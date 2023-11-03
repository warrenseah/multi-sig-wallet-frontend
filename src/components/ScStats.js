import { useContractReads, useContractEvent, useBalance } from "wagmi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import contractABI from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import { useEffect, useMemo, useState } from "react";

const smartContract = {
  address: process.env.REACT_APP_SC_ADDRESS,
  abi: contractABI.abi,
};

function ScStats() {
  const [quorem, setQuorem] = useState();
  const [owners, setOwners] = useState([]);
  // const [balanceOf, setBalanceOf] = useState(0);

  const { data: balanceData, refetch: balanceRefetch } = useBalance({
    address: process.env.REACT_APP_SC_ADDRESS,
    watch: true,
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

  const obj = useMemo(() => {
    if (data) return data;
  }, [data]);

  useEffect(() => {
    if (obj) {
      setOwners(obj[0].result);
      setQuorem(obj[1].result);

      console.log("Use effect renders ...");
    }
  }, [obj]);

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
          <p>Quorem: {quorem && quorem.toString()}</p>
          <div>Owners</div>
          <ul>
            {owners && owners.map((owner) => <li key={owner}>{owner}</li>)}
          </ul>
        </Col>
      </Row>
    </>
  );
}

export default ScStats;
