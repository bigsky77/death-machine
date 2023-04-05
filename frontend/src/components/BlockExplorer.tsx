import React, { useRef, useCallback, useEffect, useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { BLANK_COLOR } from "../constants/constants";
import { useBlockEvents } from "../../lib/api";
import BigNumber from 'bignumber.js';

interface BlockExplorerProps {
  blocks: number[];
}

export default function BlockExplorer() {

  const [visibleIndex, setVisibleIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState([...Array(30)].map((_, i) => i + 1));

  const blockSize = 50;
  const visibleBlockCount = 20;

  const { data } = useBlockEvents();
  if(data){
    console.log("block events", data.Blocks)
    const bigNumber = new BigNumber(data.Blocks[0].prover);
    const hexAddress = "0x" + bigNumber.toString(16);
    console.log("prover hex", hexAddress);
  }

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

  function hex_convert(number){
  const bigNumber = new BigNumber(number);
  const hexAddress = "0x" + bigNumber.toString(16);
  return hexAddress;
  }

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
                   {data && data.Blocks[i] && (
                    <>
                      <div style={{color: '#FEB239'}}>Block: {data.Blocks[i].number}</div>
                      <div>Prover: {hex_convert(data.Blocks[i].prover)}</div>
                      <div>Score: {data.Blocks[i].score}</div>
                      <div>Time: {data.Blocks[i].time}</div>
                    </>
                  )}
                {!data || !data.Blocks[i] && (
                  <>
                    <div>Prover: {'0x..'}</div>
                    <div>Score: {}</div>
                    <div>Time: {}</div>
                  </>
                )}
              </>
            }>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 40,
                  height: 30,
                  backgroundColor: data && data.Blocks[i] ? "#7B1FA2" : BLANK_COLOR,
                  borderRadius: 0,
                  border: "1.5px solid #FC72FF",
                  color: data && data.Blocks[i] ? "white" : "black",
                  fontWeight: "bold",
                  mr: 0.5,
                  ml: 0.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#FEB239",
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
