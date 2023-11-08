import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { useState } from "react";
import { parseEther, isAddress } from "viem";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import MultiSigWallet from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

function OwnersAction({ isOwner }) {
  const multiSigWalletContract = {
    address: process.env.REACT_APP_SC_ADDRESS,
    abi: MultiSigWallet.abi,
  };

  const [toAddress, setToAddress] = useState();
  const [withdrawEthAmt, setWithdrawEthAmt] = useState();
  const [approveId, setApproveId] = useState();

  // Contract Write Functions
  const {
    config: approveTxnConfig,
    error: prepareApproveError,
    isError: prepareApproveIsError,
  } = usePrepareContractWrite({
    ...multiSigWalletContract,
    functionName: "approveWithdrawTx",
    args: [approveId],
    enabled: typeof approveId === "number",
  });

  const {
    data: approveData,
    write: approveWrite,
    isError: approveIsError,
    error: approveError,
  } = useContractWrite(approveTxnConfig);
  // console.log("approveData: ", approveData);

  const { isLoading: approveIsLoading, isSuccess: approveIsSuccess } =
    useWaitForTransaction({ hash: approveData?.hash });

  const {
    config: createTxnConfig,
    error: prepareCreateError,
    isError: prepareCreateIsError,
  } = usePrepareContractWrite({
    ...multiSigWalletContract,
    functionName: "createWithdrawTx",
    args: [toAddress, withdrawEthAmt],
    enabled: isAddress(toAddress) && typeof withdrawEthAmt === "bigint",
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

  if (!isOwner) {
    return <h2>Not Owner</h2>;
  }

  return (
    <>
      <h2>Only Owner Actions</h2>
      <Accordion alwaysOpen>
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
            <Form>
              <Form.Group className="mb-3" controlId="formApproveId">
                <Form.Label>Txn Id</Form.Label>
                <Form.Control
                  type="number"
                  step="1"
                  placeholder="Enter Id"
                  onChange={(e) => setApproveId(parseInt(e.target.value))}
                />
              </Form.Group>
              <Button
                disabled={!approveWrite || approveIsLoading}
                variant="primary"
                onClick={() => {
                  // console.log("approveId: ", approveId);
                  approveWrite?.();
                }}
              >
                {approveIsLoading ? "Approving..." : "Approve"}
              </Button>
              {approveIsSuccess && (
                <div>
                  Successfully approve transactionId #{approveId}!
                  <div>
                    <a
                      href={`https://etherscan.io/tx/${approveData?.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Etherscan
                    </a>
                  </div>
                </div>
              )}
              {(prepareApproveIsError || approveIsError) && (
                <div>
                  Error: {(prepareApproveError || approveError)?.message}
                </div>
              )}
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export default OwnersAction;
