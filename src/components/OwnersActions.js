import "../assets/style/OwnersActions.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import { useState } from "react";
import { parseEther } from "viem";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import useDebounce from "../hooks/useDebounce";

import MultiSigWallet from "../artifacts/contracts/MultiSigWallet.sol/MultiSigWallet.json";

function OwnersActions({ scAddress, isOwner }) {
  const multiSigWalletContract = {
    address: scAddress,
    abi: MultiSigWallet.abi,
  };

  const [toAddress, setToAddress] = useState("");
  const [withdrawEthAmt, setWithdrawEthAmt] = useState();
  const [approveId, setApproveId] = useState("");
  const debouncedApproveId = useDebounce(approveId, 1500);
  const debouncedWithdrawEth = useDebounce(withdrawEthAmt, 1500);

  // Contract Write Functions
  const {
    config: approveTxnConfig,
    error: prepareApproveError,
    isError: prepareApproveIsError,
  } = usePrepareContractWrite({
    ...multiSigWalletContract,
    functionName: "approveWithdrawTx",
    args: [debouncedApproveId],
    enabled: typeof debouncedApproveId === "number",
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
    args: [toAddress, debouncedWithdrawEth],
    enabled: Boolean(debouncedWithdrawEth),
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

  // useEffect(() => {
  //   console.log("debouncedWithdrawEth: ", typeof debouncedWithdrawEth);
  // }, [debouncedWithdrawEth]);

  if (!isOwner) {
    return <h2>Not Owner</h2>;
  }

  return (
    <>
      <div className="only-owner-action">
        <h2> Only Owner Actions</h2>
        <Accordion alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <p className="head-1">Create Withdrawal</p>
            </Accordion.Header>
            <Accordion.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formCreateTxn">
                  <Form.Label className="inside-text">To Address</Form.Label>
                  <Form.Control
                    className="inside-form-control"
                    type="text"
                    placeholder="Enter address"
                    onChange={onChangeAddrCreateTxn}
                    value={toAddress}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEthAmount">
                  <Form.Label className="inside-text">Amount</Form.Label>
                  <Form.Control
                    className="inside-form-control"
                    type="number"
                    step="0.000001"
                    placeholder="Enter Eth Amount"
                    onChange={onChangeEthCreateTxn}
                  />
                </Form.Group>
                <div className="drop-down-button">
                  <Button
                    className="inside-button"
                    disabled={!createWrite || createIsLoading}
                    variant="danger"
                    onClick={() => {
                      // console.log("toAddress: ", toAddress);
                      // console.log("withdrawEther: ", withdrawEthAmt);
                      createWrite?.();
                    }}
                  >
                    {createIsLoading ? "Creating..." : "Create"}
                  </Button>
                </div>
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
                  <div className="custom-word-wrap">
                    Error: {(prepareCreateError || createError)?.message}
                  </div>
                )}
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              {" "}
              <p className="head-1">Approve Withdrawal</p>
            </Accordion.Header>
            <Accordion.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formApproveId">
                  <Form.Label className="inside-text">Txn Id</Form.Label>
                  <Form.Control
                    className="inside-form-control"
                    type="number"
                    step="1"
                    placeholder="Enter Id"
                    onChange={(e) => setApproveId(parseInt(e.target.value))}
                    value={approveId}
                  />
                </Form.Group>
                <div className="drop-down-button">
                  <Button
                    className="inside-button"
                    disabled={!approveWrite || approveIsLoading}
                    variant="danger"
                    onClick={() => {
                      // console.log("approveId: ", approveId);
                      approveWrite?.();
                    }}
                  >
                    {approveIsLoading ? "Approving..." : "Approve"}
                  </Button>
                </div>
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
                  <div className="custom-word-wrap">
                    Error: {(prepareApproveError || approveError)?.message}
                  </div>
                )}
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}

export default OwnersActions;
