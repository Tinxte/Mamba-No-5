import React from "react";
import { useState, useRef } from "react";

const canvasX = 224
const canvasY = 224
const initialSnake = [ [ 4, 10 ], [ 4, 10 ] ]
const scale = 50
const timeDelay = 100

export default function BoardCanvas( { }) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const context = canvasRef.getContext('2d');

    const [snake, setSnake] = useState(initialSnake)
    const [direction, setDirection] = useState([ 0, -1])
    const [ delay, setDelay ] = useState<number | null>(null)

    // put tile image into HTML canvas
    const tileImage = new Image();
    tileImage.src = "src/assets/dance-floor-tile-PwBB-Desaturated-32px.png";
    context.drawImage(tileImage, 0, 0);
    
    return (
        // HTML canvas object
        <canvas
        ref={canvasRef}
        width={canvasX}
        height={canvasY}>
        </canvas>
    )
}