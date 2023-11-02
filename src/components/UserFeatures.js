import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import MultiSigWallet from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import { parseEther } from "viem";

const multiSigWalletContract = {
  address: process.env.REACT_APP_SC_ADDRESS,
  abi: MultiSigWallet.abi,
};

function UserFeatures({ address }) {
  const [depositAmt, setDepositAmt] = useState(0);

  const {
    config: depositConfig,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    ...multiSigWalletContract,
    functionName: "deposit",
    value: depositAmt,
  });
  const {
    data,
    write: depositWrite,
    error,
    isError,
  } = useContractWrite(depositConfig);

  const { isLoading: depositIsLoading, isSuccess: depositIsSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const onChangeDeposit = (event) => {
    const amt = event.target.value;
    const depositEther = parseEther(amt);
    // console.log("Deposit amount: ", depositEther);
    setDepositAmt(depositEther);
  };

  return (
    <>
      <h1>User</h1>

      <Form>
        <Form.Group className="mb-3" controlId="formUserAddress">
          <Form.Label>User address</Form.Label>
          <Form.Control type="text" placeholder={address} plaintext readOnly />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDepositEther">
          <Form.Label>Deposit Ether</Form.Label>
          <Form.Control
            type="number"
            step="0.000001"
            placeholder="Enter amount in ether"
            onChange={onChangeDeposit}
          />
        </Form.Group>
        <Button
          disabled={!depositWrite || depositIsLoading}
          variant="primary"
          onClick={() => depositWrite?.()}
        >
          {depositIsLoading ? "Depositing..." : "Deposit"}
        </Button>
        {depositIsSuccess && (
          <div>
            Successfully deposited {depositAmt} ETH!
            <div>
              <a
                href={`https://etherscan.io/tx/${data?.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                Etherscan
              </a>
            </div>
          </div>
        )}
        {(isPrepareError || isError) && (
          <div>Error: {(prepareError || error)?.message}</div>
        )}
      </Form>
    </>
  );
}

export default UserFeatures;
