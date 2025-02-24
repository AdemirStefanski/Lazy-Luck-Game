import styled from "styled-components";
import { Sprite } from "@pixi/react";
import { TextStyle } from "@pixi/text";




export const ContainerMain = styled.div`
  width: 100vw;  /* 🔹 Ocupa 100% da largura da tela */
  height: 98vh; /* 🔹 Ocupa 100% da altura da tela */
  display: flex;
  align-items: center; /* 🔹 Centraliza verticalmente */
  justify-content: center; /* 🔹 Centraliza horizontalmente */
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent; /* 🔹 Sem cor de fundo */
  overflow: hidden; /* 🔹 Garante que nada vaze da tela */
`;


// Container principal do jogo
export const SlotContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 478;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: black;
`;

// Imagem de fundo
export const Background = styled(Sprite)`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Top Banner
export const TopBanner = styled(Sprite)`
  position: absolute;
  top: 0;
  width: 100%;
  height: auto;
  z-index: 1;
`;

// Estrutura onde os símbolos giram
export const ReelFrame = styled(Sprite)`
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

// Mascote sobre o Reel Frame
export const Mascot = styled(Sprite)`
  position: absolute;
  top: 120px; /* Invade 30px do reel frame */
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
`;

// Painel de informações e botão de girar
export const InfoPanel = styled.div`
  position: absolute;
  bottom: 20px;
  width: 90%;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 10px;
`;

export const SpinButton = styled.button`
  background-color: #ffcc00;
  color: #333;
  font-size: 18px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;

  &:hover {
    background-color: #ffaa00;
  }
`;

export const multiplierTextStyle = new TextStyle({
  fontFamily: "Keep On Truckin",
  fontSize: 34,
  fill: "#ffffff",
  stroke: "#000000",         // Cor da borda
  strokeThickness: 1,        // Largura da borda
  dropShadow: true,          // Ativa a sombra
  dropShadowColor: "#000000",// Cor da sombra
  dropShadowBlur: 4,         // Desfoque da sombra
  dropShadowAngle: Math.PI / 6, // Ângulo da sombra (30°)
  dropShadowDistance: 2,     // Distância da sombra
});

export const currencyTextStyle = new TextStyle({
  fontFamily: "Roboto",
  fontSize: 16,
  fill: "#08472d",
});