import React, { useState } from "react";
import Web3 from "web3"; // Corrected import statement
import abi from "./StakingContractABI.json";
import "./App.css";

const provider = new Web3(window.ethereum);
let accounts;
let contractAddress;
let contract;

const App = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [contracts, setContracts] = useState("");
  const [formData, setFormData] = useState({
    account: "",
    amount: "",
    id: "",
  });
  // const [tfrData, setTfrData] = useState({
  //   from: "",
  //   to:"",
  //   id: "",
  //   amount: ""
  // });
  const [txHash, setTxhash] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  // const handleTfr = (e) => {
  //   setTfrData({
  //     ...tfrData,
  //     [e.target.id]: e.target.value,
  //   });
  // };

  const mintingToken = async (e) => {
    e.preventDefault();

    if (!formData.account || !formData.amount || !formData.id) {
      console.error(
        "Invalid input: Account, Amount, and Token ID are required."
      );
      return;
    }

    const amount = parseInt(formData.amount);
    const tokenId = parseInt(formData.id);

    try {
      const gasPrice = await provider.eth.getGasPrice();
      let dataa = await contract.methods
        .transferMint(formData.from, tokenId, amount)
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

  // const transferToken = async (e) => {
  //   e.preventDefault();

  //   if (!formData.from || !formData.too || !formData.id || !formData.amount) {
  //     console.error(
  //       "Invalid input: From, To,Token ID and Amount are required."
  //     );
  //     return;
  //   }

  //   const amount = parseInt(formData.amount);
  //   const tokenId = parseInt(formData.id);

  //   try {
  //     const gasPrice = await provider.eth.getGasPrice();
  //     let dataa = await contract.methods
  //       .transferToken(formData.from,too,tokenId, amount)
  //       .encodeABI();

  //     const rawTransaction = {
  //       from: accounts[0],
  //       gasPrice: gasPrice,
  //       gas: 650000,
  //       to: contractAddress,
  //       data: dataa,
  //       chainId: 11155111,
  //     };
  //     const signedTx = await provider.eth.sendTransaction(rawTransaction);

  //     setTxhash(
  //       `Token transfer successfully with txn hash(${signedTx.transactionHash})`
  //     );
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const connectMetamask = async (e) => {
    try {
      e.preventDefault();
      if (window.ethereum) {
        accounts = await provider.eth.requestAccounts();

        if (accounts.length > 0) {
          setAccount(`Connected Account: ${accounts[0]}`);
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
      contractAddress = "0xA779Ca5BF5ee5ef26635d593260c9684dE1cc0f4";
      contract = new provider.eth.Contract(abi, contractAddress);
      setContracts(`Connected with(${contractAddress}) contract Address`);
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
      setBalance(`Wallet Balance: ${parseFloat(etherBalance)} ETH`);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Erc 1155</h1>
        <div>
          <button onClick={connectMetamask}>Connect MetaMask</button>
          <p>The metamask wallet: {account}</p>
          <button onClick={getWalletBalance} className="btn">
            Get Balance
          </button>
          <p>The balance in wallet is: {balance}</p>
          <button onClick={connectContract}>Connect contract</button>
          <p>The contract is: {contracts}</p>
          <form onSubmit={mintingToken}>
            <div>
              <label>Address:</label>
              <input type="text" id="account" onChange={handleChange} />
            </div>
            <div>
              <label>Amount:</label>
              <input type="number" id="amount" onChange={handleChange} />
            </div>
            <div>
              <label>TokenId:</label>
              <input type="number" id="id" onChange={handleChange} />
            </div>
            <button type="submit">Mint</button>
            <div>
              <p>{txHash}</p>
            </div>
          </form>
          {/* <form onSubmit={transferToken}> 
        <div>
            <label>From Address:</label>
            <input type="text" id="from" onChange={tfrData} />
          </div>
          <div>
            <label>To Address:</label>
            <input type="text" id="to" onChange={tfrData} />
          </div>
          <div>
            <label>SetId:</label>
            <input type="text" id="id" onChange={tfrData} />
          </div>
          <div>
            <label>Amount:</label>
            <input type="text" amt="from" onChange={tfrData} />
          </div>
          <div>
          <button type="submit">Transfer</button>
          </div>
         
        </form> */}
        </div>
      </div>
    </div>
  );
};

export default App;
