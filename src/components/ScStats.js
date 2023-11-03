import { useContractReads } from "wagmi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import contractABI from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import { useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";

const smartContract = {
  address: process.env.REACT_APP_SC_ADDRESS,
  abi: contractABI.abi,
};

function ScStats() {
  const [quorem, setQuorem] = useState();
  const [owners, setOwners] = useState([]);
  const [balanceOf, setBalanceOf] = useState(0);

  const { data } = useContractReads({
    contracts: [
      {
        ...smartContract,
        functionName: "balanceOf",
        watch: true,
      },
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
      setBalanceOf(obj[0].result);
      setOwners(obj[1].result);
      setQuorem(obj[2].result);

      console.log("Use effect renders ...");
    }
  }, [obj]);

  return (
    <>
      <Row>
        <Col>
          <h1>Smart Contract Stats</h1>
          <p>Contract Address: {process.env.REACT_APP_SC_ADDRESS}</p>
          <p>Balance: {balanceOf && `${formatEther(balanceOf)} Eth`}</p>
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
