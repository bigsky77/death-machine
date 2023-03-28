import React, { useState, useRef, useEffect, useMemo } from "react";
import { Box } from '@mui/material';
import Grid from "../types/Grid";
import { useSpring, animated } from "react-spring";

export default function Enemy ({ enemyState, frames, animationFrame}) {

    if (!enemyState) return <></>

    const lastEnemyGridRef = useRef<Grid>({x:7,y:7});

    const gap_offset = 2.0;
    const left_offset = -50;
    const top_offset = -2;

    const { left } = useSpring({
        from: {left: left_offset + gap_offset + lastEnemyGridRef.current.x * (31+gap_offset*2)},
        left: left_offset + gap_offset + enemyState.index.x * (31+gap_offset*2)
    })
    const { top } = useSpring({
        from: {top: top_offset + gap_offset + lastEnemyGridRef.current.y * (31+gap_offset*2)},
        top: top_offset + gap_offset + enemyState.index.y * (31+gap_offset*2)
    })

    // remember enemy index in useRef
    lastEnemyGridRef.current = enemyState

    const enemyClassName = enemyState.status

    const enemy_id = "💀"

    return (
        <animated.div
            className={`${enemyClassName}`}
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
            lineHeight: '30px',
            zIndex: '30',
            transformStyle:'preserve-3d',
        }}>
            <div>{enemy_id}</div>
        </animated.div>
    );
}
