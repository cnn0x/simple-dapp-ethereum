import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";

function App() {
  const inputWave = useRef();
  //Just a state variable we use to store our user's public wallet.
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xb851E78D848c1F875ee57E805230e9a0c91F5C4A";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfWalletIsConnected = async () => {
    try {
      //First make sure we have access to window.ethereum
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      //Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        getAllWaves();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(
          `${inputWave.current.value}`
        );
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWaves();
  }, [currentAccount]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Hey there!</div>
        <div className="bio">
          I am Fatih, I am really into blockchain development and this is the
          one of the my blockchain projects, pretty cool right? Connect your
          Ethereum wallet and wave at me!
        </div>
        <div className="buttons">
          {!currentAccount ? (
            <button className="connectButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <>
              <input
                type="text"
                ref={inputWave}
                id="wave-message"
                placeholder="Your message here."
              />{" "}
              <button className="waveButton" onClick={wave}>
                Wave at Me
              </button>
              <span className="connectButtonDeactive">
                Connnected Wallet:{" "}
                {currentAccount.substring(0, 5) +
                  "..." +
                  currentAccount.substring(
                    currentAccount.length - 5,
                    currentAccount.length
                  )}
              </span>
            </>
          )}
        </div>
        <div className="all-waves">
          {allWaves.map((wave, index) => {
            return (
              <div key={index} className="wave-container">
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div className="actual-message">Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
