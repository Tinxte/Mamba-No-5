import { useEffect, useState } from "react"
import { PlayerId } from "rune-sdk"

import { GameState } from "./logic/logic.ts"
import { PlayerOne } from "./components/PlayerOne.tsx"

function App() {
  const [game, setGame] = useState<GameState>()
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>()

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId }) => {
        setGame(game)
        setYourPlayerId(yourPlayerId)

        // upon an action, play sound
        // if (action && action.name === "claimCell") selectSound.play()
      },
    })
  }, [])

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return
  }

  const { winCombo, cells, lastMovePlayerId, playerIds, freeCells } = game

  const playerPositionIndex = 1; 

  
  return (
    <>
      {/* Game Board / Dancefloor */}
      <div id="board" className={!lastMovePlayerId ? "initial" : ""}>
        {cells.map((cell, cellIndex) => {
          const cellValue = cells[cellIndex]

          return (
            <div
            id="tile"
              key={cellIndex}
              onClick={() => Rune.actions.claimCell(cellIndex)}
              data-player={(cellValue !== null
                ? playerIds.indexOf(cellValue)
                : -1
              ).toString()}
              data-dim={String(
                (winCombo && !winCombo.includes(cellIndex)) ||
                  (!freeCells && !winCombo)
              )}
              {...(cells[cellIndex] ||
              lastMovePlayerId === yourPlayerId ||
              winCombo
                ? { "data-disabled": "" }
                : {})}
            />

            // return player component if on index
            // { (cellIndex===playerPositionIndex) ? <PlayerOne/> : <div/> }
          )
        })}

            {/* <PlayerOne/> */}

        {/* Player Sprites */}
        
        {/* <div> {cells.map((cell, cellIndex) => {
          const cellValue = cells[cellIndex]
          return (
            <PlayerOne/>
          )
          })}
        </div> */}

      </div>


      


        {/* Users */}
      <ul id="playersSection">
        {playerIds.map((playerId, index) => {
          const player = Rune.getPlayerInfo(playerId)

          return (
            <li
              key={playerId}
              data-player={index.toString()}
              data-your-turn={String(
                playerIds[index] !== lastMovePlayerId && !winCombo && freeCells
              )}
            >
              <img src={player.avatarUrl} />
              <span>
                {player.displayName}
                {player.playerId === yourPlayerId && (
                  <span>
                    <br />
                    (You)
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default App
