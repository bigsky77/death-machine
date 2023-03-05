import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

export default function GameGrid({animationFrame, frames, spaceships, stars, enemies, updateSpaceships}) {
  const ROW_CONST = 225; 
  const [boxes, setBoxes] = useState(Array(225).fill(""));
  //const stars = ["🌠", "🌠", "🪐"]
  const escape =[]

  useEffect(() => {
    // ensure frames is defined
    if (frames && animationFrame) {
    const setBoard = () => {
      setBoxes(boxes.map((box, i) => {
        const x = i % 15;
        const y = Math.floor(i / 15);
        if(frames[animationFrame].ships.find(ship => ship.index.x === x && ship.index.y === y)){
          return "🚀"
        } else if(frames[animationFrame].atoms.find(atom => atom.index.x === x && atom.index.y === y)){
          return  "🌠"
        }
      }
      ))
    }
    setBoard();
    }
    console.log("Board", boxes)
    console.log("Frame", frames[animationFrame]);
  },[animationFrame]);
  
  function checkAdjacent(a) {
    for(let i = 0; i < spaceships.length; i++){
        const b = spaceships[i].location;
          if (a === b) continue;

          const rowA = Math.floor(a / 15);
          const colA = a % 15;

          const rowB = Math.floor(b / 15);
          const colB = b % 15;

          const rowDiff = Math.abs(rowA - rowB);
          const colDiff = Math.abs(colA - colB);

          if (rowDiff <= 1 && colDiff <= 1 && spaceships[i].selected) {
              return '#FC72FF';
          } else if(rowDiff <= 1 && colDiff <= 1 ) {
                return 'black'
            }
      }
      return '';
    };

return (
    <Box sx={{width: '100%'}}>
     <Grid container rowSpacing={1} gap={0.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {boxes.map((value, index) => (
          <Square key={index} value={value} color={checkAdjacent(index)} />
        ))}
      </Grid> 
    </Box>
  );
}

function Square({value, color}) {

    return(
      <Box sx={{height: 31, width: 31, border: '1px solid #FEB239', bgcolor: color, ":hover": {
                    bgcolor: '#FC72FF',
                    color: '#C72FF',
                    border: "1px solid #ffffff00"},
                    fontSize: '26px',
                    textAlign: "center",
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
