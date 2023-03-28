import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import Ship from './Ship'
import Enemy from './Enemy'

export default function GameGrid({ animationFrame, frames, shipInitPositions, shipSelected }) {
  const ROW_CONST = 225;
  const [boxes, setBoxes] = useState(Array(ROW_CONST).fill("🌠"));

  const isEnemyAdjacent = (index, frames, animationFrame) => {
    if (!frames || !frames[animationFrame]) {
      return false;
    }

    const x = index % 15;
    const y = Math.floor(index / 15);

    const adjacentSquares = [
      { x: x - 1, y: y - 1 },
      { x: x, y: y},
      { x: x, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x - 1, y: y + 1 },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];

    return adjacentSquares.some((square) =>
      frames[animationFrame].atoms.find(
        (atom) =>
          atom.raw_index.x === square.x &&
          atom.raw_index.y === square.y &&
          atom.typ === "ENEMY"
      )
    );
  };

  const checkAdjacent = (index) => {
    if (!frames || !animationFrame) {
      return "";
    }

    if (isEnemyAdjacent(index, frames, animationFrame)) {
      return "1px solid #FC72FF";// rgba(255, 0, 0, 0.9)";
    } else {
      return '1px solid #FEB239';
    }
  };

  useEffect(() => {
    if (frames && animationFrame) {
      const setBoard = () => {
        setBoxes(boxes.map((box, i) => {
          const x = i % 15;
          const y = Math.floor(i / 15);
          if (frames[animationFrame].ships.find(ship => ship.index.x === x && ship.index.y === y && ship.status === "ACTIVE")) {
            return "";
          } else if (frames[animationFrame].atoms.find(atom => atom.index.x === x && atom.index.y === y && atom.typ === "ENEMY")) {
            return "";
          } else if (frames[animationFrame].atoms.find(atom => atom.index.x === x && atom.index.y === y && atom.typ === "STAR" && atom.status === "ACTIVE")) {
            return "🌠";
          } else if (frames[animationFrame].atoms.find(atom => atom.index.x === x && atom.index.y === y && atom.typ === "PLANET" && atom.status === "ACTIVE")) {
            return "🪐";
          } else if (frames[animationFrame].atoms.find(atom => atom.index.x === x && atom.index.y === y && atom.status === "INACTIVE")) {
            return "-";
          } else {
            return "";
          }
        }));
      };
      setBoard();
    }
  }, [animationFrame, shipInitPositions]);

return (
  <Box sx={{ width: '100%', height: '100%', transform: "translateX(-10%)"}} >
    <Grid container rowSpacing={2} gap={0.5} columnSpacing={{ xs: 1, sm: 2, md: 6 }} sx={{border: '1px'}}>
      {frames && animationFrame && frames[animationFrame].ships.some(ship => ship.status === "ACTIVE") ? (
        frames[animationFrame].ships
          .filter(ship => ship.status === "ACTIVE")
          .map(ship => <Ship key={ship.id} shipState={ship} animationFrame={animationFrame} frames={frames} shipSelected={shipSelected[ship.description]} shipInitPositions={shipInitPositions}/>)
      ) : null}
      {frames && animationFrame && frames[animationFrame].atoms.some(atom => atom.typ === "ENEMY") ? (
        frames[animationFrame].atoms
          .filter(atom => atom.typ === "ENEMY")
          .map(atom => <Enemy key={atom.id} enemyState={atom} animationFrame={animationFrame} frames={frames}/>)
      ) : null}

      {boxes.map((value, index) => (
        <Square key={index} value={value} color={checkAdjacent(index)} />
      ))}
    </Grid>
  </Box>
);
}

function Square({value, color}) {
    return(
      <Box sx={{height: 31, width: 31, border: color ? color : "1px solid #FEB239", bgcolor: "", ":hover": {
                    bgcolor: '#FC72FF',
                    color: '#C72FF',
                    border: "1px solid #ffffff"},
                    fontSize: '26px',
                    textAlign: "center",
                    lineHeight: "28px",
        }}>{value}</Box>
    );
  }

function convertIndexToXY(index) {
  // Calculate the x and y coordinates based on the index
  const x = (index - 1) % 15;
  const y = Math.floor((index - 1) / 15);

  // Return the (x, y) coordinate as an object
  return { x: x, y: y };
}
