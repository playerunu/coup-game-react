import React from "react";
import { Box } from "@mui/material";
//import useScreenOrientation from "hooks/useScreenOrientation";
import useWindowSize from "hooks/useWindowSize";
import { useWebpImage } from "utils/image";

export const GameTable: React.FC = () => {
  //const screenOrientation = useScreenOrientation();
  const [, windowHeight] = useWindowSize();

  // const isLandscape =
  //   screenOrientation === "landscape-primary" ||
  //   screenOrientation === "landscape-secondary";
  const [captain, back, duke, assassin, contessa, ambassador] = useWebpImage(
    "captain.png",
    "back.png",
    "duke.png",
    "assassin.png",
    "contessa.png",
    "ambassador.png"
  );

  return (
    <>
      <Box
        display="flex"
        height={windowHeight}
        width="100vw"
        flexDirection="column"
      >
        <Box
          display="flex"
          flex={0.2}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <img src={duke} />
          <img src={back} />
        </Box>
        <Box
          display="flex"
          flex={0.6}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
          >
            {/* <Box>
              <img src={assassin} />
              <img src={contessa} />
            </Box> */}
            <Box>
              <img src={back} />
              <img src={back} />
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
          >
            <Box>
              <img src={back} />
              <img src={back} />
            </Box>
            <Box>
              <img src={captain} />
              <img src={ambassador} />
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flex={0.2}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <img src={captain} />
          <img src={back} />
        </Box>
      </Box>
    </>
  );
};
