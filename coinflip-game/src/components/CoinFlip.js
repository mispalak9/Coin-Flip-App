import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const CoinFlipContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  background-color: #9400D3; /* background */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  width: 200px; /* Increased width */
  padding: 10px; /* Increased padding */
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px; /* Increased font size */
`;

const Select = styled.select`
  width: 200px; /* Increased width */
  padding: 10px; /* Increased padding */
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px; /* Increased font size */
`;

const Result = styled.p`
  margin-top: 20px;
  font-size: 1.2em;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
`;

const Stat = styled.div`
  text-align: center;
`;

const flipAnimation = keyframes`
  0% { transform: rotateY(0); }
  100% { transform: rotateY(360deg); }
`;

const Coin = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: gold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  margin-top: 20px;
  ${props => props.flipping && css`
    animation: ${flipAnimation} 1s;
  `}
`;

const CoinFlip = ({ account, web3, blockchain }) => {
  const [result, setResult] = useState(null);
  const [coins, setCoins] = useState(0);
  const [flips, setFlips] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [betAmount, setBetAmount] = useState('');
  const [side, setSide] = useState('heads');
  const [flipping, setFlipping] = useState(false);
  const [coinFace, setCoinFace] = useState('H');

  const handleTransaction = async (amount, isWin) => {
    try {
      const transactionParameters = {
        to: account, // Required except during contract publications.
        from: account, // must match user's active address.
        value: web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether')), // Only required to send ether to the recipient from the initiating external account.
      };

      if (!isWin) {
        transactionParameters.value = web3.utils.toHex(web3.utils.toWei((-amount).toString(), 'ether'));
      }

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      setResult('Transaction failed. Please try again.');
    }
  };

  const flipCoin = async () => {
    try {
      setFlipping(true);
      const betInWei = web3.utils.toWei(betAmount, 'ether');
      const choice = side;
      const flip = Math.random() > 0.5 ? 'heads' : 'tails';

      setTimeout(() => {
        setFlipping(false);
        setCoinFace(flip === 'heads' ? 'H' : 'T');
        setFlips(flips + 1);

        const betAmountNum = parseFloat(betAmount);

        if (isNaN(betAmountNum)) {
          setResult('Invalid bet amount. Please enter a valid number.');
          return;
        }

        if (flip === choice) {
          setCoins(coins + betAmountNum * 2);
          setWins(wins + 1);
          setStreak(streak + 1);
          setResult(`You won! You get ${betAmountNum * 2} coins.`);
          handleTransaction(betAmountNum * 2, true);
        } else {
          setCoins(coins - betAmountNum);
          setLosses(losses + 1);
          setStreak(0);
          setResult('You lost! Better luck next time.');
          handleTransaction(betAmountNum, false);
        }
      }, 1000);
    } catch (error) {
      console.error('Coin flip failed:', error);
      setResult('An error occurred. Please try again.');
    }
  };

  const getFreeCoins = () => {
    setCoins(coins + 10);
  };

  const resetGame = () => {
    setCoins(0);
    setFlips(0);
    setWins(0);
    setLosses(0);
    setStreak(0);
    setResult(null);
  };

  return (
    <CoinFlipContainer>
      <h2>Coinflip</h2>
      <p>Bet tokens per flip. Win double or lose them!</p>
      <div>
        <Input
          type="number"
          placeholder="Bet amount in ETH"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
        <div>
          <label>
            <input
              type="radio"
              checked={side === 'heads'}
              onChange={() => setSide('heads')}
            />
            Heads
          </label>
          <label>
            <input
              type="radio"
              checked={side === 'tails'}
              onChange={() => setSide('tails')}
            />
            Tails
          </label>
        </div>
      </div>
      <Stats>
        <Stat>
          <h3>Coins</h3>
          <p>{coins}</p>
        </Stat>
        <Stat>
          <h3>Flips</h3>
          <p>{flips}</p>
        </Stat>
        <Stat>
          <h3>Wins</h3>
          <p>{wins}</p>
        </Stat>
        <Stat>
          <h3>Losses</h3>
          <p>{losses}</p>
        </Stat>
        <Stat>
          <h3>Streak</h3>
          <p>{streak}</p>
        </Stat>
      </Stats>
      <div>
        <Button onClick={flipCoin}>Flip Coin</Button>
        <Button onClick={getFreeCoins}>Get Free Coins</Button>
        <Button onClick={resetGame}>Reset</Button>
      </div>
      <Coin flipping={flipping}>{coinFace}</Coin>
      {result && <Result>{result}</Result>}
    </CoinFlipContainer>
  );
};

export default CoinFlip;
