import { useContractEvent, useBalance } from "wagmi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import contractABI from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import { toast } from "react-toastify";
import { formatEther } from "viem";
import { MdAccountCircle } from "react-icons/md";

function ScStats({ scAddress, userAddress, quorem, owners }) {
  const smartContract = {
    address: scAddress,
    abi: contractABI.abi,
  };

  const { data: balanceData } = useBalance({
    address: scAddress,
    watch: true,
  });

  useContractEvent({
    address: scAddress,
    abi: smartContract.abi,
    eventName: "Deposit",
    listener(logs) {
      // console.log("DepositEvents: ", logs);

      // Filter event by user address
      if (logs[0]?.args && logs[0].args?.sender === userAddress) {
        const userEvent = logs[0].args;
        // console.log("user depositEvent: ", userEvent);
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
          <div className="statics-section mt-4">
          <h1>Smart Contract Stats</h1>
          <div className="d-flex gap-5 mt-3">
          <p className = "statics-data">Contract Address: {scAddress}</p>
          <p className="statics-data"
           >
            Balance: {balanceData?.formatted} {balanceData?.symbol}
          </p>
          <p className="statics-data">Quorem: {quorem || ""}</p>
          </div>
          <div>
            <h3 style={{fontSize:"25px",fontFamily:'Saira Semi Condensed'}}>Owner</h3>
          <ul className="owner-list">
            {owners?.map((owner) => (
               <li className="list-data" style={{fontSize:"17px",fontFamily:'Saira Semi Condensed',width:"500px"}} key={owner}><MdAccountCircle size={35}
               /><span style={{marginLeft:"12px"}}>{ owner}</span></li>
            ))}
          </ul>
          </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default ScStats;
