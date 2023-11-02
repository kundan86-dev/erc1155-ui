import React, { useState } from "react";
import Web3 from "web3"; // Corrected import statement
import abi from "./ContractABI.json";
import "./App.css";

const provider = new Web3(window.ethereum);
let accounts;
let contractAddress;
let contract;

const App = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [contracts, setContracts] = useState("");

  const [formData, setFormData] = useState({ account: "", amount: "" });

  const [tfrData, setTfrData] = useState({
    from: "",
    to: "",
    newId: "",
    amount: "",
  });

  const [txHash, setTxhash] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleTfr = (e) => {
    setTfrData({
      ...tfrData,
      [e.target.id]: e.target.value,
    });
  };

  const mintingToken = async (e) => {
    e.preventDefault();

    if (!formData.account || !formData.amount) {
      console.error("Invalid input: Account and Amount are required.");
      return;
    }
    const amount = parseInt(formData.amount);

    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid input: Amount must be a positive integer.");
      return;
    }
    console.log("Minting Token Input:", { account: formData.account, amount });

    try {
      const gasPrice = await provider.eth.getGasPrice();
      let dataa = await contract.methods
        .mintt(formData.account, formData.amount)
        .encodeABI();

      const rawTransaction = {
        from: accounts[0],
        gasPrice: gasPrice,
        gas: 650000,
        to: contractAddress,
        data: dataa,
        chainId: 11155111,
      };
      const signedTx = await provider.eth.sendTransaction(rawTransaction);

      setTxhash(
        `Token minted successfully with txn hash(${signedTx.transactionHash})`
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const transferToken = async (e) => {
    e.preventDefault();

    if (!tfrData.from || !tfrData.to || !tfrData.newId || !tfrData.amount) {
      console.error(
        "Invalid input: From, To,Token ID and Amount are required."
      );
      return;
    }

    const newId = parseInt(tfrData.newId);
    const amount = parseInt(tfrData.amount);
    if (isNaN(newId) || isNaN(amount) || newId <= 0 || amount <= 0) {
      console.error(
        "Invalid input: Token ID and Amount must be positive integers."
      );
      return;
    }

    try {
      const gasPrice = await provider.eth.getGasPrice();
      let dataa = await contract.methods
        .safeTransferFromm(
          tfrData.from,
          tfrData.to,
          tfrData.newId,
          tfrData.amount
        )
        .encodeABI();

      const rawTransaction = {
        from: accounts[0],
        gasPrice: gasPrice,
        gas: 650000,
        to: contractAddress,
        data: dataa,
        chainId: 11155111,
      };
      const signedTx = await provider.eth.sendTransaction(rawTransaction);

      setTxhash(
        `Token transfer successfully with txn hash(${signedTx.transactionHash})`
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const connectMetamask = async (e) => {
    try {
      e.preventDefault();
      if (window.ethereum) {
        accounts = await provider.eth.requestAccounts();

        if (accounts.length > 0) {
          setAccount(
            `The metamask wallet : Connected Account: ${accounts[0].substring(
              0,
              6
            )}....${accounts[0].substring(36)}`
          );
          alert("Connected ", accounts[0]);
        } else {
          console.error("No Ethereum accounts available.");
        }
      } else {
        console.error("MetaMask is not installed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectContract = async (e) => {
    e.preventDefault();
    try {
      contractAddress = "0x27Cd1390CB65A42AB8a2d13fAEA4b23A96B80315";
      contract = new provider.eth.Contract(abi, contractAddress);
      setContracts(`The contract is : Connected with(${contractAddress}) contract Address`);
      alert("Contract connected");
      console.log("Contract is connected");
    } catch (error) {
      console.error(error);
    }
  };

  const getWalletBalance = async () => {
    try {
      const weiBalance = await provider.eth.getBalance(accounts[0]);
      const etherBalance = provider.utils.fromWei(weiBalance, "ether");
      setBalance(`The balance in wallet is: ${(etherBalance)} ETH`);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  return (
    <div className="App">
      <h1>ERC-1155 Dapp</h1>
      <div className="main">
        <div className="connection">
          <div>
            <button onClick={connectMetamask}>Connect MetaMask</button>
            <p>{account}</p>
          </div>
          <div>
            <button onClick={getWalletBalance}>Get Balance</button>
            <p>{balance}</p>
          </div>
          <div>
            <button onClick={connectContract}>Connect contract</button>
            <p>{contracts}</p>
          </div>
        </div>

        <div className="mint">
          <div>
            <label>Address:</label>
            <input type="text" id="account" onChange={handleChange} />
          </div>
          <div>
            <label>Amount:</label>
            <input type="number" id="amount" onChange={handleChange} />
          </div>
          <button onClick={mintingToken}>Mint</button>
          <div>
            <p>{txHash}</p>
          </div>
        </div>
        <div className="transfer">
          <div>
            <label>Address:</label>
            <input type="text" id="from" onChange={handleTfr} />
          </div>
          <div>
            <label>To Address:</label>
            <input type="text" id="to" onChange={handleTfr} />
          </div>
          <div>
            <label>SetId:</label>
            <input type="text" id="newId" onChange={handleTfr} />
          </div>
          <div>
            <label>Amount:</label>
            <input type="text" id="amount" onChange={handleTfr} />
          </div>
          <div>
            <h3>
              <button onClick={transferToken}>Transfer</button>
            </h3>
            <p>{txHash}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
