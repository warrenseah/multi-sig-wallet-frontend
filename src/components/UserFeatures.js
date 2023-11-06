import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
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

const multiSigWalletContract = {
  address: process.env.REACT_APP_SC_ADDRESS,
  abi: MultiSigWallet.abi,
};

function UserFeatures({ address, quorem, isOwner }) {
  const [depositAmt, setDepositAmt] = useState(0);
  const [toAddress, setToAddress] = useState();
  const [withdrawEthAmt, setWithdrawEthAmt] = useState();

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
  const txnsWithId = readData[0]?.result?.map((txn, index) => ({
    ...txn,
    id: index,
  }));

  // Filter for unapprove transactions only
  const unapprovedTxns = txnsWithId?.filter(
    (txn) => parseInt(txn?.approvals?.toString()) < quorem
  );
  // console.log("originalList: ", txnsWithId);
  // console.log("FilteredList: ", unapprovedTxns);

  // Contract Write Functions
  const {
    config: createTxnConfig,
    error: prepareCreateError,
    isError: prepareCreateIsError,
  } = usePrepareContractWrite({
    ...multiSigWalletContract,
    functionName: "createWithdrawTx",
    args: [toAddress, withdrawEthAmt],
  });

  const {
    data: createData,
    write: createWrite,
    isError: createIsError,
    error: createError,
  } = useContractWrite(createTxnConfig);
  // console.log("createData: ", createData);

  const { isLoading: createIsLoading, isSuccess: createIsSuccess } =
    useWaitForTransaction({ hash: createData?.hash });

  const onChangeAddrCreateTxn = (event) => {
    setToAddress(event.target.value);
    // console.log("inputAddress: ", event.target.value);
  };

  const onChangeEthCreateTxn = (event) => {
    setWithdrawEthAmt(parseEther(event.target.value));
    // console.log("inputWithdrawEth: ", event.target.value);
  };

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

  const onlyOwnerActions = isOwner ? (
    <>
      <h2>Only Owner Actions</h2>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>#1 Create Withdrawal</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formCreateTxn">
                <Form.Label>To Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  onChange={onChangeAddrCreateTxn}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEthAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.000001"
                  placeholder="Enter Eth Amount"
                  onChange={onChangeEthCreateTxn}
                />
              </Form.Group>
              <Button
                disabled={!createWrite || createIsLoading}
                variant="primary"
                onClick={() => {
                  // console.log("toAddress: ", toAddress);
                  // console.log("withdrawEther: ", withdrawEthAmt);
                  createWrite?.();
                }}
              >
                {createIsLoading ? "Creating..." : "Create"}
              </Button>
              {createIsSuccess && (
                <div>
                  Successfully created a withdrawal transaction!
                  <div>
                    <a
                      href={`https://etherscan.io/tx/${createData?.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Etherscan
                    </a>
                  </div>
                </div>
              )}
              {(prepareCreateIsError || createIsError) && (
                <div>Error: {(prepareCreateError || createError)?.message}</div>
              )}
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>#2 Approve Withdrawal</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  ) : (
    <h2>Not Owner</h2>
  );

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
      {onlyOwnerActions}
    </>
  );
}

export default UserFeatures;
