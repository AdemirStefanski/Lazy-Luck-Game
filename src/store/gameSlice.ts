import { createSlice } from "@reduxjs/toolkit";
import { symbols } from "../gameLogic";

interface GameState {
  reels: string[][];
  balance: number;
  bet: number;
  winnings: number;
}

const getRandomSymbol = () => {
  const keys = Object.keys(symbols);
  return keys[Math.floor(Math.random() * keys.length)];
};

const getRandomSymbols = (): string[][] => {
  return Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomSymbol));
};

const calculateWinnings = (reels: string[][], bet: number): number => {
  if (reels[0][1] === reels[1][1] && reels[1][1] === reels[2][1]) {
    return bet * 10;
  }
  return 0;
};

const initialState: GameState = {
  reels: getRandomSymbols(),
  balance: 1000,
  bet: 50,
  winnings: 0,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    spinReels: (state) => {
      const newReels = getRandomSymbols();
      const winnings = calculateWinnings(newReels, state.bet);

      state.reels = newReels;
      state.winnings = winnings;
      state.balance += winnings - state.bet;
    },
  },
});

export const { spinReels } = gameSlice.actions;
export default gameSlice.reducer;
