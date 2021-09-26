// display/UI
import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./winesweeper.js";
const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 5;
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
// console.log( createBoard(2, 2);)
// console.log(board);
const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector("[data-mine-count]");
const massageText = document.querySelector(".subtext");

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    // left click
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });
    // right click
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
  });
});
boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    );
  }, 0);
  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);
  if (win || lose) {
    boardElement.addEventListener("click", stopProb, { capture: true });
    boardElement.addEventListener("menucontext", stopProb, { capture: true });

    if (win) {
      massageText.textContent = "You Win";
    }
    if (lose) {
      massageText.textContent = "You Lose";
      board.forEach((row) => {
        row.forEach((tile) => {
          if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
          if (tile.mine) revealTile(board, tile);
        });
      });
    }
  }
}
function stopProb(e) {
  e.stopImmediatePropagation();
}
// 1.Pupuale a board with tiles/mines
// 2.Left click on tiles
//   a.Reveal tiles
// 3.Right click on tiles
//   a.Mark tiles
// 4.check for win/lose
