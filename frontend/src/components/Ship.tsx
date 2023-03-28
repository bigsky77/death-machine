import React, { useState, useRef, useEffect, useMemo } from "react";
import { Box } from '@mui/material';
import ShipState, { ShipStatus, ShipType } from "../types/ShipState";
import Grid from "../types/Grid";
import { useSpring, animated } from "react-spring";

export default function Ship ({ shipState, frames, animationFrame, shipInitPositions, shipSelected}) {

    if (!shipState) return <></>

    const lastShipGridRef = useRef<Grid>({x:0,y:0});

    const gap_offset = 2.0;
    const left_offset = -50;
    const top_offset = -2;

    const { left } = useSpring({
        from: {left: left_offset + gap_offset + lastShipGridRef.current.x * (31+gap_offset*2)},
        left: left_offset + gap_offset + shipState.index.x * (31+gap_offset*2)
    })
    const { top } = useSpring({
        from: {top: top_offset + gap_offset + lastShipGridRef.current.y * (31+gap_offset*2)},
        top: top_offset + gap_offset + shipState.index.y * (31+gap_offset*2)
    })

    // remember ship index in useRef
    lastShipGridRef.current = shipState

    const shipClassName = shipState.status == ShipStatus.OPEN ? 'grabberOpen' : 'grabberClose'

    const ship_id = "🚀"

    return (
        <animated.div
            className={`${shipClassName}`}
            style={{
            position: 'absolute',
            border: '1px white',
            left: left,
            top: top,
            width: 31,
            height: 31,
            fontSize: '26px',
            textAlign: "center",
            alignItems: 'center',
            lineHeight: '2rem',
            zIndex: '30',
            transformStyle:'preserve-3d',
        }}>
             <Box sx={{ bgcolor: shipSelected ? '#FC72FF' : '' }}>{ship_id}</Box>
        </animated.div>
    );
}
