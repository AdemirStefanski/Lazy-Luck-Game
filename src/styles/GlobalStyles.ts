import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  body {
    background-color: #282c34;
    color: white;
  }

  @font-face {
  font-family: "Keep On Truckin";
  src: url("/assets/fonts/keep-on-truckin.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

`;

export default GlobalStyle;
