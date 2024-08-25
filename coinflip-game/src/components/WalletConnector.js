import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #0056b3;
  }
`;

const WalletConnector = ({ setAccount, blockchain }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    if (blockchain === 'ethereum' || blockchain === 'polygon') {
      const provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setAddress(accounts[0]);
        setConnected(true);
      } else {
        alert('Please install MetaMask!');
      }
    }
    // Add logic for other blockchains here
  };

  const disconnectWallet = () => {
    setAccount(null);
    setAddress('');
    setConnected(false);
  };

  useEffect(() => {
    if (connected) {
      connectWallet();
    }
  }, [blockchain, connected]);

  return (
    <div>
      {connected ? (
        <div>
          <p>Wallet Connected: {address}</p>
          <Button onClick={disconnectWallet}>Disconnect Wallet</Button>
        </div>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </div>
  );
};

export default WalletConnector;
