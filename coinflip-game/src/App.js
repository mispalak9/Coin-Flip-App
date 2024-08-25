import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import WalletConnector from './components/WalletConnector';
import CoinFlip from './components/CoinFlip';
import './App.css';
import coinIcon from './image/coin-icon.png'; // Corrected path
import styled from 'styled-components';

const Select = styled.select`
  width: 200px; /* Increased width */
  padding: 10px; /* Increased padding */
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px; /* Increased font size */
`;

const Footer = styled.footer`
  background-color: #202040; /* Dark purple background */
  color: white;
  text-align: center;
  padding: 20px 0; /* Increased padding */
  font-size: 20px; /* Increased font size */
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(0); /* Show footer initially */
  transition: transform 0.3s ease-in-out;
`;

const AppContainer = styled.div`
  padding-bottom: 60px; /* Space for the footer */
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  img {
    width: 150px; /* Adjust width as needed */
    height: auto; /* Maintain aspect ratio */
  }
`;

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [blockchain, setBlockchain] = useState('ethereum');

  useEffect(() => {
    if (account) {
      if (blockchain === 'ethereum') {
        setWeb3(new Web3(window.ethereum));
      }
      // Add logic for other blockchains here
    }
  }, [account, blockchain]);

  useEffect(() => {
    let lastScrollTop = 0;
    const footer = document.querySelector('footer');

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        footer.style.transform = 'translateY(0)';
      } else {
        // Scrolling up
        footer.style.transform = 'translateY(100%)';
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppContainer className="App">
      <div className="header">
        <img src={coinIcon} alt="Coin Icon" />
        <h1>CoinFlip</h1>
      </div>
      <h1>Welcome to the Coin Flipper Game</h1>
      <p>Please connect your wallet:</p>
      <Select onChange={(e) => setBlockchain(e.target.value)} value={blockchain}>
        <option value="ethereum">Ethereum</option>
        <option value="polygon">Polygon</option>
        <option value="solana">Solana</option>
        <option value="bitcoin">Bitcoin</option>
      </Select>
      <WalletConnector setAccount={setAccount} blockchain={blockchain} />
      {account && web3 && (
        <div className="connected-section">
          <CoinFlip account={account} web3={web3} blockchain={blockchain} />
        </div>
      )}
      <ImageContainer>
        <img src="https://www.pngmart.com/files/15/Vector-Bitcoin-Transparent-PNG.png" alt="Coin Flip" />
      </ImageContainer>
      <Footer>
        © {new Date().getFullYear()} Palak Mishra
      </Footer>
    </AppContainer>
  );
}

export default App;
