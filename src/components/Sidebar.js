import { useState } from "react";
import { Fragment } from "react";
import "../assets/style/sidebar.css";
import Ether_value_graph from "../utils/Charts";
import BuyCard from "../utils/BuyCard";
import SendCard from "../utils/SendCard";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";

const SideBar = ({ userAddress }) => {
  const [selectedValue, setSelectedValue] = useState(0);
  const options = ["Dashboard", "Buy", "Send", "Swap", "Networks", "Address"];
  const copyToClipboard = () => {
    navigator.clipboard.writeText(userAddress)
    toast.success("Address Copied");
  }
  return (
    <Fragment>
      <div className="Main sidebar-container">
        <div className="sidebar-box d-flex flex-column flex-shrink-0 p-3 bg-light">
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
          >
            <svg className="bi me-2" width="40" height="32">
              <use xlinkHref="#home"></use>
            </svg>
            <span className="fs-4">Home</span>
          </a>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            {options.map((item, index) => (
              <>
                <li
                  className="nav-item"
                  onClick={() => setSelectedValue(index)}
                >
                  <p
                    className={`nav-link ${
                      selectedValue === index ? "active" : "link-dark"
                    }`}
                    aria-current="page"
                  >
                    <svg className="bi me-2" width="16" height="16">
                      <use xlinkHref="#home"></use>
                    </svg>
                    {item}
                  </p>
                </li>
              </>
            ))}
          </ul>
        </div>
        <div className="chart-area">
          {selectedValue === 0 && <Ether_value_graph />}
          {selectedValue === 1 && <BuyCard />}
          {selectedValue === 2 && <SendCard />}
          {selectedValue === 5 && (
            <>
              <Container className="address">
                <h3>Connected Address:</h3>
                <span>
                  <b>{userAddress}</b>
                  <span onClick={copyToClipboard}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 448 512"
                    >
                      <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" />
                    </svg>
                  </span>
                </span>
              </Container>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};
export default SideBar;
