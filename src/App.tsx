import React from "react";
import GlobalStyle from "./styles/GlobalStyles";
import SlotMachine from "./components/SlotMachine";

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <SlotMachine />
    </>
  );
};

export default App;