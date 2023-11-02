import { useBalance } from "wagmi";

function ScStats() {
  const { data, isError, isLoading } = useBalance({
    address: process.env.REACT_APP_SC_ADDRESS,
    watch: true,
  });

  const balanceFetching = () => {
    if (isError) {
      return <span>Error fetching balance</span>;
    }
    if (isLoading) {
      return <span>Fetching balance ...</span>;
    }
    if (data) {
      return <span>{`${data.formatted} ${data.symbol}`}</span>;
    }
  };

  return (
    <>
      <h1>Smart Contract Stats</h1>
      <p>Contract Address: {process.env.REACT_APP_SC_ADDRESS}</p>
      <p>Balance: {balanceFetching()}</p>
    </>
  );
}

export default ScStats;
