import React, { useRef, useCallback, useEffect, useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { BLANK_COLOR } from "../constants/constants";

interface BlockExplorerProps {
  blocks: number[];
}

export default function BlockExplorer() {

  const [visibleIndex, setVisibleIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState([...Array(30)].map((_, i) => i + 1));

  const blockSize = 50;
  const visibleBlockCount = 25;

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateVisibleBlocks = () => {
        const scrollLeft = container.scrollLeft;
        const newVisibleIndex = Math.floor(scrollLeft / blockSize);
        setVisibleIndex(newVisibleIndex);
      };
      container.addEventListener("scroll", updateVisibleBlocks);
      updateVisibleBlocks();
      return () => container.removeEventListener("scroll", updateVisibleBlocks);
    }
    if(block_events){
        console.log("block events", block_events.Block[0].data)
      }
  }, []);

  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      const newVisibleIndex = Math.max(visibleIndex - 1, 0);
      setVisibleIndex(newVisibleIndex);
      container.scrollLeft = newVisibleIndex * blockSize;
    }
  };

  const handleScrollRight = () => {
    const container = containerRef.current;
    if (container) {
      const newVisibleIndex = Math.min(
        visibleIndex + 1,
        blocks.length - visibleBlockCount
      );
      setVisibleIndex(newVisibleIndex);
      container.scrollLeft = newVisibleIndex * blockSize;
    }
  };

  const visibleBlocks = blocks.slice(
    visibleIndex,
    visibleIndex + visibleBlockCount
  );

return (
    <>
      <Box
        gap={0.01}
        sx={{
          width: 1035,
          height: 40,
          justifyContent: "center",
          mb: 0,
          //top: "10px",
          //left: "50.1%",
          transform: "translateX(12%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: BLANK_COLOR,
          //p: "0.1rem",
          //mt: "1rem",
          border: "2px solid #303030",
          borderRadius: 0,
          boxShadow: '4px 4px 0px #000000',
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: 980,
            overflowX: "auto",
            ml: 3.5,
            mr: 3.5,
            scrollbarWidth: "none", // hide scrollbar on Firefox
            msOverflowStyle: "none", // hide scrollbar on IE, Edge
            "&::-webkit-scrollbar": {
              display: "none", // hide scrollbar on Chrome, Safari
            },
          }}
        >
          {visibleBlocks.map((i) => (
            <Tooltip key={i} title={
                <>
                <div>Block {i}</div>
                <div>Prover: {'0x123'}</div>
                <div>BlockTimeStamp: {456}</div>
                <div>BlockHash: {'0x128'}</div>
                <div>Reward: {0.5}</div>
                </>
            }>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 40,
                  height: 30,
                  backgroundColor: BLANK_COLOR,
                  borderRadius: 0,
                  border: "1.5px solid #FC72FF",
                  color: "black",
                  fontWeight: "bold",
                  mr: 0.5,
                  ml: 0.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#7B1FA2",
                  },
                }}
              >
                {i}
              </Box>
            </Tooltip>
          ))}
        </Box>
        {blocks.length > 20 && (
          <>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                width: 20,
                height: 40,
                backgroundColor: BLANK_COLOR,
                color: "black",
                border: "2px solid #303030",
                borderRadius: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#EEEEEE",
                }
              }}
              onClick={handleScrollLeft}
            >
              {"<"}
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                width: 20,
                height: 40,
                backgroundColor: BLANK_COLOR,
                color: "black",
                border: "2px solid #303030",
                borderRadius: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#EEEEEE",
                },
              }}
              onClick={handleScrollRight}
            >
              {">"}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
