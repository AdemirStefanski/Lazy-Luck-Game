import React, { useEffect, useState } from "react";
import { Stage, Container, Sprite } from "@pixi/react";
import { useDispatch, useSelector } from "react-redux";
import { spinReels } from "../store/gameSlice";
import { symbols } from "../gameLogic";
import {
  ContainerMain,
  InfoPanel,
  SpinButton
} from "../styles/SlotStyles";
import { Texture } from "@pixi/core";
import { Assets } from "@pixi/assets";

const BASE_WIDTH = 478;
const BASE_HEIGHT = 840;
const REEL_WIDTH = 478;
const REEL_HEIGHT = 416;
const REEL_Y_POSITION = 200;
const REEL_COLUMNS = 3;
const REEL_ROWS = 3;
const SYMBOL_SIZE = 115;
const HORIZONTAL_SPACING = 35;
const VERTICAL_SPACING = 5;

// Ajusta a área total levando em conta os espaçamentos
const SYMBOL_AREA_WIDTH = SYMBOL_SIZE * REEL_COLUMNS + HORIZONTAL_SPACING * (REEL_COLUMNS - 1);
const SYMBOL_AREA_HEIGHT = SYMBOL_SIZE * REEL_ROWS + VERTICAL_SPACING * (REEL_ROWS - 1);

// 🔹 Configuração do mascote
const MASCOT_WIDTH = 120;
const MASCOT_HEIGHT = 120;
const MASCOT_OVERLAP = 30;

const SlotMachine: React.FC = () => {
  const dispatch = useDispatch();
  const { reels, balance, bet, winnings } = useSelector((state: any) => state.game);
  const [loadedTextures, setLoadedTextures] = useState<Record<string, Texture>>({});
  const [scale, setScale] = useState(1);

  // Carrega texturas corretamente
  useEffect(() => {
    const loadTextures = async () => {
      const textureCache: Record<string, Texture> = {};
      for (const [key, path] of Object.entries(symbols)) {
        textureCache[key] = await Assets.load(path);
      }
      textureCache["background"] = await Assets.load("/assets/decoratives/jungle_background.png");
      textureCache["topBanner"] = await Assets.load("/assets/decoratives/top_banner.png");
      textureCache["reelFrame"] = await Assets.load("/assets/reel/reel_frame.png");
      textureCache["mascot"] = await Assets.load("/assets/mascot/mascot.png");

      setLoadedTextures(textureCache);
    };

    loadTextures();
  }, []);

  // Atualiza a escala ao redimensionar a tela
  useEffect(() => {
    const updateScale = () => {
      const newScale = window.innerHeight / BASE_HEIGHT;
      setScale(newScale);
    };

    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleSpin = () => {
    dispatch(spinReels());
  };

  return (
    <ContainerMain style={{ transform: `scale(${scale})` }}>
      <Stage width={BASE_WIDTH} height={BASE_HEIGHT} options={{ backgroundColor: "transparent" }}>
        {/* 🔹 FUNDO ATRÁS DE TUDO */}
        {loadedTextures["background"] && (
          <Sprite
            texture={loadedTextures["background"]}
            position={[0, 0]}
            width={BASE_WIDTH}
            height={BASE_HEIGHT}
          />
        )}

        {/* 🔹 TOP BANNER */}
        {loadedTextures["topBanner"] && (
          <Sprite
            texture={loadedTextures["topBanner"]}
            position={[0, 0]}
            width={BASE_WIDTH}
          />
        )}

        {/* 🔹 REEL FRAME */}
        <Container position={[0, REEL_Y_POSITION]}>
          {loadedTextures["reelFrame"] && (
            <Sprite
              texture={loadedTextures["reelFrame"]}
              position={[0, 0]}
              width={REEL_WIDTH}
              height={REEL_HEIGHT}
            />
          )}

          {/* 🔹 CENTRALIZANDO OS SÍMBOLOS DENTRO DO REEL_FRAME */}
          <Container
            position={[
              (REEL_WIDTH - SYMBOL_AREA_WIDTH) / 2,
              (REEL_HEIGHT - SYMBOL_AREA_HEIGHT) / 2
            ]}
          >
            {reels.map((reel: string[], reelIndex: number) => (
              <Container
                key={`reel-${reel.join("-")}`}
                position={[reelIndex * (SYMBOL_SIZE + HORIZONTAL_SPACING), 0]} 
              >
                {reel.map((symbol, symbolIndex) => (
                  <Sprite
                    key={`symbol-${symbol}-${symbolIndex}`}
                    texture={loadedTextures[symbol]}
                    position={[0, symbolIndex * (SYMBOL_SIZE + VERTICAL_SPACING)]} 
                    width={SYMBOL_SIZE}
                    height={SYMBOL_SIZE}
                  />
                ))}
              </Container>
            ))}
          </Container>
        </Container>

        {/* 🔹 MASCOTE (AGORA NA FRENTE DO REEL_FRAME) */}
        {loadedTextures["mascot"] && (
          <Sprite
            texture={loadedTextures["mascot"]}
            position={[
              (BASE_WIDTH - MASCOT_WIDTH) / 2, // 🔹 Centraliza horizontalmente
              REEL_Y_POSITION - MASCOT_HEIGHT + MASCOT_OVERLAP // 🔹 Alinha acima do ReelFrame, sobrepondo um pouco
            ]}
            width={MASCOT_WIDTH}
            height={MASCOT_HEIGHT}
          />
        )}
      </Stage>

      <InfoPanel>
        <p>Saldo: ${balance}</p>
        <p>Aposta: ${bet}</p>
        <p>Ganhos: ${winnings}</p>
        <SpinButton onClick={handleSpin}>Girar</SpinButton>
      </InfoPanel>
    </ContainerMain>
  );
};

export default SlotMachine;
