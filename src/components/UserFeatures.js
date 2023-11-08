import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { toast } from "react-toastify";

import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractReads,
  useContractEvent,
} from "wagmi";

import MultiSigWallet from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";
import OwnersAction from "./OwnersAction";

function UserFeatures({ address, quorem, isOwner }) {
  const multiSigWalletContract = {
    address: process.env.REACT_APP_SC_ADDRESS,
    abi: MultiSigWallet.abi,
  };

  const [depositAmt, setDepositAmt] = useState(0);

  useContractEvent({
    address: process.env.REACT_APP_SC_ADDRESS,
    abi: MultiSigWallet.abi,
    eventName: "CreateWithdrawTx",
    listener(logs) {
      console.log("createWithdrawTxn event: ", logs);

      const userEvent = logs[0].args;
      console.log("user createWithdrawTxnEvent: ", userEvent);
      const depositedAmt = formatEther(userEvent?.amount?.toString());
      // Display pop up notification
      toast.success(
        `Withdrawal txnId: ${parseInt(
          userEvent?.transactionindex
        )} with withdrawal amount: ${depositedAmt} Eth created!`
      );
    },
  });

  useContractEvent({
    address: process.env.REACT_APP_SC_ADDRESS,
    abi: MultiSigWallet.abi,
    eventName: "ApproveWithdrawTx",
    listener(logs) {
      // console.log("approveWithdrawTxn event: ", logs);
      const userEvent = logs[0].args;
      console.log("user approveWithdrawTxnEvent: ", userEvent);
      // Display pop up notification
      toast.success(
        `txnId: ${parseInt(
          userEvent?.transactionIndex
        )} is approved and sent to recipent!`
      );
    },
  });

  // Contract Read Functions
  const { data: readData, isLoading: readIsLoading } = useContractReads({
    contracts: [{ ...multiSigWalletContract, functionName: "getWithdrawTxes" }],
    watch: true,
  });

  // console.log("readData: ", readData);

  // Add id to return readData transaction List
  const txnsWithId = !readIsLoading
    ? readData[0]?.result?.map((txn, index) => ({
        ...txn,
        id: index,
      }))
    : [];

  // Filter for unapprove transactions only
  const unapprovedTxns = txnsWithId?.filter(
    (txn) => parseInt(txn?.approvals?.toString()) < quorem
  );
  // console.log("originalList: ", txnsWithId);
  // console.log("FilteredList: ", unapprovedTxns);

  const {
    config: depositConfig,
    error: prepareDepositError,
    isError: prepareDepositIsError,
  } = usePrepareContractWrite({
    ...multiSigWalletContract,
    functionName: "deposit",
    value: depositAmt,
  });
  const {
    data: writeData,
    write: depositWrite,
    error: depositError,
    isError: depositIsError,
  } = useContractWrite(depositConfig);
  // console.log("WriteData: ", writeData);

  const { isLoading: depositIsLoading, isSuccess: depositIsSuccess } =
    useWaitForTransaction({
      hash: writeData?.hash,
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
                href={`https://etherscan.io/tx/${writeData?.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                Etherscan
              </a>
            </div>
          </div>
        )}
        {(prepareDepositIsError || depositIsError) && (
          <div>Error: {(prepareDepositError || depositError)?.message}</div>
        )}
      </Form>
      <h2>Transaction Approval List</h2>
      {readIsLoading ? (
        <p>Loading transaction list...</p>
      ) : (
        <ul>
          {unapprovedTxns.map((txn) => (
            <li key={txn.id}>{`id ${txn.id} || To=${
              txn?.to
            } || Amount: ${formatEther(txn?.amount)} Eth || Approval: ${
              txn?.approvals
            } || Sent: ${txn?.sent}`}</li>
          ))}
        </ul>
      )}
      <OwnersAction isOwner={isOwner} />
    </>
  );
}

export default UserFeatures;
