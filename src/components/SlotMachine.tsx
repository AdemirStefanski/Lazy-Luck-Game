import React, { useEffect, useState } from "react";
import { Stage, Container, Sprite, Text, Graphics } from "@pixi/react";
import { Graphics as PixiGraphics } from "pixi.js";
import { useDispatch, useSelector } from "react-redux";
import { spinReels } from "../store/gameSlice";
import { symbols } from "../gameLogic";
import { ContainerMain, InfoPanel, SpinButton, currencyTextStyle } from "../styles/SlotStyles";
import { Texture } from "@pixi/core";
import { Assets } from "@pixi/assets";
import { TextStyle } from "@pixi/text";

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

const SYMBOL_AREA_WIDTH =
  SYMBOL_SIZE * REEL_COLUMNS + HORIZONTAL_SPACING * (REEL_COLUMNS - 1);
const SYMBOL_AREA_HEIGHT =
  SYMBOL_SIZE * REEL_ROWS + VERTICAL_SPACING * (REEL_ROWS - 1);

const MASCOT_WIDTH = 120;
const MASCOT_HEIGHT = 120;
const MASCOT_OVERLAP = 30;

const MULTIPLIER_HEIGHT = 80;

const PANEL_HEIGHT = 80;
const PANEL_Y_POSITION = REEL_Y_POSITION + REEL_HEIGHT + MULTIPLIER_HEIGHT;

const RECTANGLE_MARGIN = 9;
const RECTANGLE_SPACING = 4;
const rectangleWidth =
  (REEL_WIDTH - 2 * RECTANGLE_MARGIN - 2 * RECTANGLE_SPACING) / 3;
const rectangleHeight = PANEL_HEIGHT / 2;
const ICON_SIZE = 24;

const multiplierTextStyle = new TextStyle({
  fontFamily: "Keep On Truckin",
  fontSize: 35,
  fill: "#ffffff",
  stroke: "#000000",
  strokeThickness: 1,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 2,
});

// Função para desenhar um retângulo arredondado
// Removemos a tipagem estrita para evitar conflitos
const drawRoundedRect = (g: any) => {
  g.clear();
  g.beginFill(0xc8cbd3);
  g.drawRoundedRect(0, 0, rectangleWidth, rectangleHeight, 8);
  g.endFill();
};

const SlotMachine: React.FC = () => {
  const dispatch = useDispatch();
  const { reels, balance, bet, winnings } = useSelector((state: any) => state.game);
  const [loadedTextures, setLoadedTextures] = useState<Record<string, Texture>>({});
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const loadTextures = async () => {
      const textureCache: Record<string, Texture> = {};
      // Carrega os símbolos do reel
      for (const [key, path] of Object.entries(symbols)) {
        textureCache[key] = await Assets.load(path);
      }
      textureCache["background"] = await Assets.load("/assets/decoratives/jungle_background.png");
      textureCache["topBanner"] = await Assets.load("/assets/decoratives/top_banner.png");
      textureCache["reelFrame"] = await Assets.load("/assets/reel/reel_frame.png");
      textureCache["mascot"] = await Assets.load("/assets/mascot/mascot.png");
      textureCache["multiplierBar"] = await Assets.load("/assets/bottom_panel/multiplier_bar.png");
      textureCache["panel"] = await Assets.load("/assets/bottom_panel/panel.png");
      textureCache["walletIcon"] = await Assets.load("/assets/bottom_panel/wallet_icon.png");
      textureCache["coinIcon"] = await Assets.load("/assets/bottom_panel/coin_icon.png");
      textureCache["winIcon"] = await Assets.load("/assets/bottom_panel/win_icon.png");

      setLoadedTextures(textureCache);
    };

    loadTextures();
  }, []);

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
      <Stage
        width={BASE_WIDTH}
        height={BASE_HEIGHT}
        options={{ backgroundColor: "transparent", resolution: window.devicePixelRatio, antialias: true }}
      >
        {/* Fundo */}
        {loadedTextures["background"] && (
          <Sprite
            texture={loadedTextures["background"]}
            position={[0, 0]}
            width={BASE_WIDTH}
            height={BASE_HEIGHT}
          />
        )}

        {/* Top Banner */}
        {loadedTextures["topBanner"] && (
          <Sprite
            texture={loadedTextures["topBanner"]}
            position={[0, 0]}
            width={BASE_WIDTH}
          />
        )}

        {/* Reel Frame e símbolos */}
        <Container position={[0, REEL_Y_POSITION]}>
          {loadedTextures["reelFrame"] && (
            <Sprite
              texture={loadedTextures["reelFrame"]}
              position={[0, 0]}
              width={REEL_WIDTH}
              height={REEL_HEIGHT}
            />
          )}
          <Container
            position={[
              (REEL_WIDTH - SYMBOL_AREA_WIDTH) / 2,
              (REEL_HEIGHT - SYMBOL_AREA_HEIGHT) / 2,
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

        {/* Barra do multiplicador com texto */}
        <Container position={[0, REEL_Y_POSITION + REEL_HEIGHT]}>
          {loadedTextures["multiplierBar"] && (
            <Sprite
              texture={loadedTextures["multiplierBar"]}
              position={[0, 0]}
              width={REEL_WIDTH}
              height={MULTIPLIER_HEIGHT}
            />
          )}
          <Text
            text="Multiplicador 10x"
            anchor={0.5}
            x={REEL_WIDTH / 2}
            y={MULTIPLIER_HEIGHT / 2}
            style={multiplierTextStyle}
          />
        </Container>

        {/* Painel inferior com retângulos, ícones e textos */}
        <Container position={[0, PANEL_Y_POSITION]}>
          {loadedTextures["panel"] && (
            <Sprite
              texture={loadedTextures["panel"]}
              position={[0, 0]}
              width={REEL_WIDTH}
              height={PANEL_HEIGHT}
            />
          )}
          {/* Container para os retângulos; centraliza verticalmente os retângulos no painel */}
          <Container position={[0, (PANEL_HEIGHT - rectangleHeight) / 2]}>
            {["wallet", "coin", "win"].map((type, index) => {
              const xRect = RECTANGLE_MARGIN + index * (rectangleWidth + RECTANGLE_SPACING);
              let iconTexture;
              if (type === "wallet") iconTexture = loadedTextures["walletIcon"];
              else if (type === "coin") iconTexture = loadedTextures["coinIcon"];
              else if (type === "win") iconTexture = loadedTextures["winIcon"];
              return (
                <Container key={`rect-${type}`} position={[xRect, 0]}>
                  <Graphics draw={drawRoundedRect} />
                  {iconTexture && (
                    <Sprite
                      texture={iconTexture}
                      position={[12, (rectangleHeight - ICON_SIZE) / 2]}
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                    />
                  )}
                  <Text
                    text="R$ 0,00"
                    anchor={[0, 0.5]}
                    x={12 + ICON_SIZE + 8}
                    y={rectangleHeight / 2}
                    style={currencyTextStyle}
                  />
                </Container>
              );
            })}
          </Container>
        </Container>

        {/* Mascote */}
        {loadedTextures["mascot"] && (
          <Sprite
            texture={loadedTextures["mascot"]}
            position={[
              (BASE_WIDTH - MASCOT_WIDTH) / 2,
              REEL_Y_POSITION - MASCOT_HEIGHT + MASCOT_OVERLAP,
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
