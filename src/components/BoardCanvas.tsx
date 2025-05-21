import { useState, useRef, useEffect } from "react";
import { GameEngine } from "../logic/logic";


const initialSnake = [ [ 4, 10 ], [ 4, 10 ] ]
const scale = 50
const timeDelay = 100

export default function BoardCanvas( { }) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const engine = useRef<GameEngine | null>(null);
    const canvasSidesLength = 224;

    useEffect(() => {
        // if (canvasRef.current === null) {
        //     throw new Error("canvasRef is not used");
        // }
        if(canvasRef.current){
            canvasRef.current.width = canvasSidesLength;
            canvasRef.current.height = canvasSidesLength;
            context.current = canvasRef.current.getContext("2d");

            if (context.current) {
                const ctx = context.current;
                engine.current = new GameEngine(
                    ctx,
                    canvasSidesLength,
                    true
            );
            }
        }
        
        // const [snake, setSnake] = useState(initialSnake)
        // const [direction, setDirection] = useState([ 0, -1])
        // const [ delay, setDelay ] = useState<number | null>(null)

        // // put tile image into HTML canvas
        // const tileImage = new Image();
        // tileImage.src = "src/assets/dance-floor-tile-PwBB-Desaturated-32px.png";
        
        // tileImage.addEventListener("load", () => {
        //     ctx.drawImage(tileImage, 0, 0);
        // })
    }, []);    
    return (
        // HTML canvas object
        <div>
            <canvas
            id="game-canvas"
            ref={canvasRef}>
            </canvas>
        </div>
    );
};