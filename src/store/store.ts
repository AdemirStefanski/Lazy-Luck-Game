import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./gameSlice"; // Certifique-se de que esse caminho está correto

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export default store;
