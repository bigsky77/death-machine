import React, { useState, useRef, useEffect, useMemo } from "react";
import { Box } from '@mui/material';
import Grid from "../types/Grid";
import { useSpring, animated } from "react-spring";

export default function Atom ({ atomState, frames, animationFrame}) {

    if (!atomState) return <></>

    const lastAtomGridRef = useRef<Grid>({x:7,y:7});
    const typ = atomState.typ;

    const gap_offset = 2.0;
    const left_offset = -50;
    const top_offset = -2;

    const { left } = useSpring({
        from: {left: left_offset + gap_offset + lastAtomGridRef.current.x * (31+gap_offset*2)},
        left: left_offset + gap_offset + atomState.index.x * (31+gap_offset*2)
    })
    const { top } = useSpring({
        from: {top: top_offset + gap_offset + lastAtomGridRef.current.y * (31+gap_offset*2)},
        top: top_offset + gap_offset + atomState.index.y * (31+gap_offset*2)
    })

    // remember atom index in useRef
    lastAtomGridRef.current = atomState

    const atomClassName = atomState.status

    const skull_id = "💀"
    // shooting star emoji
    const star_id = "🌠"

    return (
        <animated.div
    className={atomClassName}
    style={{
        position: 'absolute',
        border: '1px  white',
        left: left,
        top: top,
        width: 31,
        height: 31,
        fontSize: '26px',
        textAlign: "center",
        alignItems: 'center',
        lineHeight: '30px',
        zIndex: typ === "ENEMY" ? '30' : '20',
        transformStyle: 'preserve-3d',
    }}>
            <div>{typ === "ENEMY" ? skull_id : typ === "STAR" ? star_id : ""}</div>
        </animated.div>
    );
}
