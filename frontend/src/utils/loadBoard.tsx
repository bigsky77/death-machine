import { useAllEvents } from "../../lib/api";
import React, { useState, useEffect } from "react";

export default function LoadBoard(updateAtoms, updateAtomType) {
  const [initialArray, updateArray] = useState(Array(225).fill(" "));
  const { data } = useAllEvents();
  const atomType = ["BLANK", "STAR", "ENEMY", "PLANET"];

  useEffect(() => {
    if (data) {
      const board = data.DeathMachine[0].board_array;
      const newInitialArray = Array(225).fill("").map((item, index) => ({
        id: `star${index + 1}`,
        typ: atomType[board[index].type],
        status: "ACTIVE",
        index: { x: Math.floor(index / 15), y: index % 15 },
      }));
      updateArray(newInitialArray);
    }
  }, [data]);
  
  return initialArray;
}
