import type { PlayerId, RuneClient } from "rune-sdk"
import Snake from "./Snake"
export interface Coordinate {
  row: number;
  col: number;
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => ({
    cells: new Array(36).fill(null),
    winCombo: null,
    lastMovePlayerId: null,
    playerIds: allPlayerIds,
  }),
  actions: {
    claimCell: (cellIndex, { game, playerId, allPlayerIds }) => {
      if (
        game.cells[cellIndex] !== null ||
        playerId === game.lastMovePlayerId
      ) {
        throw Rune.invalidAction()
      }

      game.cells[cellIndex] = playerId
      game.lastMovePlayerId = playerId
      game.winCombo = findWinningCombo(game.cells)

      if (game.winCombo) {
        const [player1, player2] = allPlayerIds

        Rune.gameOver({
          players: {
            [player1]: game.lastMovePlayerId === player1 ? "WON" : "LOST",
            [player2]: game.lastMovePlayerId === player2 ? "WON" : "LOST",
          },
        })
      }

      game.freeCells = game.cells.findIndex((cell) => cell === null) !== -1

      if (!game.freeCells) {
        Rune.gameOver({
          players: {
            [game.playerIds[0]]: "LOST",
            [game.playerIds[1]]: "LOST",
          },
        })
      }
    },
  },
})

export type Cells = (PlayerId | null)[]

type Interlinked = "snake" | null;
export interface GameState {
  cells: Cells
  winCombo: number[] | null
  lastMovePlayerId: PlayerId | null
  playerIds: PlayerId[]
  freeCells?: boolean
}

type GameActions = {
  claimCell: (cellIndex: number) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

function findWinningCombo(cells: Cells) {
  return (
    [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ].find((combo) =>
      combo.every((i) => cells[i] && cells[i] === cells[combo[0]])
    ) || null
  )
}

export class GameEngine {
  private context: CanvasRenderingContext2D;
  private boardSidesLength: number;
  private numOfRowsAndCols: number;
  private _gameBoard: Interlinked[][];
  private readonly staggerFrame: number;
  private currentFrameCount: number;
  private internalPlayState: boolean;
  
  snake: Snake;

  constructor(
    context: CanvasRenderingContext2D,
    boardSidesLength: number,
    isPlaying: boolean
  ) {
    this.context = context;    

    this.snake = new Snake();
    this.internalPlayState = isPlaying;
    this.boardSidesLength = boardSidesLength;
    this.numOfRowsAndCols = 26;
    this._gameBoard = [];

    this.currentFrameCount = 0;
    this.staggerFrame = 8;
  }
  private get gameBoard(): Interlinked[][] {
    if (this._gameBoard.length === 0) {
      const nRows = this.numOfRowsAndCols;
      const nCols = this.numOfRowsAndCols;

      for (let i = 0; i < nRows; i++) {
        this._gameBoard.push(Array.from(Array(nCols)).fill(null));
      }
    }

    return this._gameBoard;
  }

  private set gameBoard(newGameBoard: Interlinked[][]) {
    this._gameBoard = newGameBoard;
  }

    private generateGrid() {
    const cellWidth = this.boardSidesLength / this.numOfRowsAndCols;
    const cellHeight = this.boardSidesLength / this.numOfRowsAndCols;

    this.gameBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        switch (cell) {
          case "snake":
            this.context.fillStyle = "#A2C579";
            break;
          // case "food":
          //   this.context.fillStyle = "salmon";
          //   break;
          case null:
            this.context.fillStyle = "white";
            break;
        }
        this.context.fillRect(
          colIndex * cellWidth,
          rowIndex * cellHeight,
          cellWidth,
          cellHeight
        );
      });
    });
  }
    private setSnakeOnBoard() {
    const newBoard = this.gameBoard.map((row) => row.fill(null));
    this.snake.bodyCoordinates.forEach((snakeCoord) => {
      newBoard[snakeCoord.row][snakeCoord.col] = "snake";
    });
    this.gameBoard = newBoard;
  } 
  
  private renderBoard() {
    this.setSnakeOnBoard();
    // this.setFoodOnBoard();
    this.generateGrid();
  }
    animate(isPlaying: boolean) {
    this.internalPlayState = isPlaying;

    if (this.currentFrameCount < this.staggerFrame) {
      this.currentFrameCount++;
    } else {
      this.currentFrameCount = 0;

      // if (this.externalScore !== this.score) {
      //   this.setScore(this.score);
      // }

      // if (this.isGameOver()) {
      //   this.setIsGameOver(true);
      //   return;
      // }

      this.context.clearRect(
        0,
        0,
        this.boardSidesLength,
        this.boardSidesLength
      );
      this.renderBoard();
      // this.snake.move(this.foodCoordinate);
    }

    this.internalPlayState &&
      requestAnimationFrame(() => this.animate(this.internalPlayState));
  }
}

