document.addEventListener('DOMContentLoaded', function () {
  const board = document.getElementById('game-container');
  const scoreElement = document.getElementById('score');
  const currentScoreElement = document.getElementById('current-score');
  const highScoreElement = document.getElementById('high-score-value');
  const restartButton = document.getElementById('restart-button');
  let tiles = [];
  let score = 0;
  let highScore = 0;
  let bombTurns = 0; // 폭탄 턴 초기화
  let bombPosition = -1; // 폭탄 위치 초기화

  // 게임 보드 초기화
  function initBoard() {
      tiles.forEach(tile => tile.remove()); // 기존 타일 제거
      tiles = [];

      for (let i = 0; i < 16; i++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          board.appendChild(cell);
          tiles.push(cell);
      }

      generateTile();
      generateTile();
      updateBoard();
  }

 // 새로운 타일 생성 (2, 4, 또는 폭탄)
 function generateTile() {
  const emptyTiles = tiles.filter(tile => !tile.innerHTML);

  // 확인: 폭탄이 이미 존재하는지 여부
  const bombExists = tiles.some(tile => tile.innerHTML === 'bomb');

  if (emptyTiles.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const newValue = bombExists && bombTurns >= 5 ? 'bomb' : (Math.random() < 0.9 ? 2 : 4);

    // 확인: 생성된 타일이 폭탄인 경우 위치 저장
    if (newValue === 'bomb') {
      bombPosition = tiles.indexOf(emptyTiles[randomIndex]);
    }

    emptyTiles[randomIndex].innerHTML = newValue;
  }
}

// 새로운 폭탄 생성
function generateBomb() {
  const emptyTiles = tiles.filter(tile => !tile.innerHTML);

  // 확인: 폭탄이 이미 존재하는지 여부
  const bombExists = tiles.some(tile => tile.innerHTML === 'bomb');

  // 이미 폭탄이 존재하면 폭탄 제거
  if (bombExists) {
    const bombIndex = tiles.findIndex(tile => tile.innerHTML === 'bomb');
    tiles[bombIndex].innerHTML = '';
  }

  if (emptyTiles.length > 0 && !bombExists) {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    bombPosition = tiles.indexOf(emptyTiles[randomIndex]);
    tiles[bombPosition].innerHTML = 'bomb';
  }
}

  // 보드 상태를 반영하여 UI 업데이트
  function updateBoard() {
      for (let i = 0; i < tiles.length; i++) {
          const value = tiles[i].innerHTML;
          tiles[i].style.backgroundColor = getTileColor(value);
          tiles[i].style.color = value > 4 ? '#f9f6f2' : '#776e65';
          tiles[i].innerHTML = value !== '0' ? value : '';
          currentScoreElement.textContent = score;
          highScoreElement.textContent = highScore;
      }
  }

  // 타일 색상 가져오기
  function getTileColor(value) {
      const colors = {
          '2': '#eee4da',
          '4': '#ede0c8',
          '8': '#f2b179',
          '16': '#f59563',
          '32': '#f67c5f',
          '64': '#f65e3b',
          '128': '#edcf72',
          '256': '#edcc61',
          '512': '#edc850',
          '1024': '#edc53f',
          '2048': '#edc22e',
          'bomb': '#000000', // 폭탄 색상
      };
      return colors[value] || '#cdc1b4';
  }

  // 키보드 입력 처리
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    moveTiles(event.key);

    // 폭탄 턴 증가
    if (bombPosition !== -1) {
      bombTurns++;
    }

    // 폭탄 생성 여부 확인
    if (Math.random() < 0.1) {
      generateBomb();
    }

    generateTile();
    updateBoard();
    checkGameOver();

    // 폭탄 터질 턴인지 확인 후 터지도록 수정
    if (bombTurns >= 5) {
      detonateBomb();
      bombTurns = 0; // 5턴이 지나면 다시 초기화
    }
  }
});




  // 타일 이동 로직
function moveTiles(direction) {
  let moved = false;

  if (direction === 'ArrowUp') {
    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        let current = tiles[row * 4 + col];
        let value = current.innerHTML;

        if (value !== '') {
          let rowAbove = row - 1;
          let destination = tiles[rowAbove * 4 + col];

          // 비어있는 경우 또는 값이 같은 경우 합쳐짐
          while (rowAbove >= 0 && destination.innerHTML === '') {
            destination.innerHTML = value;
            current.innerHTML = '';
            current = destination;
            row--;
            rowAbove--;
            destination = tiles[rowAbove * 4 + col];
            moved = true;
          }

          // 값이 같은 경우 합침
          if (rowAbove >= 0 && destination.innerHTML === value) {
            destination.innerHTML = (parseInt(value) * 2).toString();
            score += parseInt(value) * 2;
            current.innerHTML = '';
            moved = true;
          }
        }
      }
    }
  } else if (direction === 'ArrowDown') {
    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        let current = tiles[row * 4 + col];
        let value = current.innerHTML;

        if (value !== '') {
          let rowBelow = row + 1;
          let destination = tiles[rowBelow * 4 + col];

          // 비어있는 경우 또는 값이 같은 경우 합쳐짐
          while (rowBelow < 4 && destination.innerHTML === '') {
            destination.innerHTML = value;
            current.innerHTML = '';
            current = destination;
            row++;
            rowBelow++;
            destination = tiles[rowBelow * 4 + col];
            moved = true;
          }

          // 값이 같은 경우 합침
          if (rowBelow < 4 && destination.innerHTML === value) {
            destination.innerHTML = (parseInt(value) * 2).toString();
            score += parseInt(value) * 2;
            current.innerHTML = '';
            moved = true;
          }
        }
      }
    }
  } else if (direction === 'ArrowLeft') {
    for (let row = 0; row < 4; row++) {
      for (let col = 1; col < 4; col++) {
        let current = tiles[row * 4 + col];
        let value = current.innerHTML;

        if (value !== '') {
          let colLeft = col - 1;
          let destination = tiles[row * 4 + colLeft];

          // 비어있는 경우 또는 값이 같은 경우 합쳐짐
          while (colLeft >= 0 && destination.innerHTML === '') {
            destination.innerHTML = value;
            current.innerHTML = '';
            current = destination;
            col--;
            colLeft--;
            destination = tiles[row * 4 + colLeft];
            moved = true;
          }

          // 값이 같은 경우 합침
          if (colLeft >= 0 && destination.innerHTML === value) {
            destination.innerHTML = (parseInt(value) * 2).toString();
            score += parseInt(value) * 2;
            current.innerHTML = '';
            moved = true;
          }
        }
      }
    }
  } else if (direction === 'ArrowRight') {
    for (let row = 0; row < 4; row++) {
      for (let col = 2; col >= 0; col--) {
        let current = tiles[row * 4 + col];
        let value = current.innerHTML;

        if (value !== '') {
          let colRight = col + 1;
          let destination = tiles[row * 4 + colRight];

          // 비어있는 경우 또는 값이 같은 경우 합쳐짐
          while (colRight < 4 && destination.innerHTML === '') {
            destination.innerHTML = value;
            current.innerHTML = '';
            current = destination;
            col++;
            colRight++;
            destination = tiles[row * 4 + colRight];
            moved = true;
          }

          // 값이 같은 경우 합침
          if (colRight < 4 && destination.innerHTML === value) {
            destination.innerHTML = (parseInt(value) * 2).toString();
            score += parseInt(value) * 2;
            current.innerHTML = '';
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    updateBoard();
    checkGameOver();
  }
}

  // 게임 종료 확인
  function checkGameOver() {
    let gameOver = true;

    for (let i = 0; i < tiles.length; i++) {
      const value = tiles[i].innerHTML;
      if (value === '') {
        gameOver = false;
        break;
      }

      const row = Math.floor(i / 4);
      const col = i % 4;

      if (row > 0 && tiles[(row - 1) * 4 + col].innerHTML === value) {
        gameOver = false;
        break;
      }
      if (row < 3 && tiles[(row + 1) * 4 + col].innerHTML === value) {
        gameOver = false;
        break;
      }
      if (col > 0 && tiles[row * 4 + (col - 1)].innerHTML === value) {
        gameOver = false;
        break;
      }
      if (col < 3 && tiles[row * 4 + (col + 1)].innerHTML === value) {
        gameOver = false;
        break;
      }
    }

    if (gameOver) {
      // 여기에 게임 재시작이나 다른 동작을 추가할 수 있습니다.
      alert('게임 오버! 더 이상 움직일 수 없습니다.');
    }
  }

  // 최고점수 업데이트
  function updateHighScore() {
      if (score > highScore) {
        highScore = score;
      }
    }

    // 게임 재시작
    function restartGame() {
      score = 0;
      tiles.forEach(tile => (tile.innerHTML = ''));
      tiles = []; // 타일 배열 초기화
      bombTurns = 0;
      bombPosition = -1;
      initBoard();
      updateBoard();
  }
    // "다시 시작" 버튼 클릭 시 게임 다시 시작
    restartButton.addEventListener('click', function () {
      updateHighScore(); // 게임 종료시 최고점수 업데이트
      score = 0;
      bombTurns = 0;
      bombPosition = -1;
      initBoard();
      updateBoard();
      hideRestartButton();
  });

// 폭탄 폭발
function detonateBomb() {
  if (bombPosition !== -1) {
    // 주변의 타일 중에서 랜덤으로 하나 선택하여 제거
    const positionsToClear = getAdjacentPositions(bombPosition);
    const randomIndex = Math.floor(Math.random() * positionsToClear.length);
    const positionToClear = positionsToClear[randomIndex];

    tiles[positionToClear].innerHTML = '';

    // 새로운 폭탄의 위치 설정
    generateBomb();

    bombTurns = 0; // 턴 초기화
    updateBoard();
  }
}

// 폭탄 주변의 타일 위치 가져오기
function getAdjacentPositions(position) {
  const row = Math.floor(position / 4);
  const col = position % 4;
  const positions = [];

  // 위
  if (row > 0) positions.push((row - 1) * 4 + col);

  // 아래
  if (row < 3) positions.push((row + 1) * 4 + col);

  // 왼쪽
  if (col > 0) positions.push(row * 4 + (col - 1));

  // 오른쪽
  if (col < 3) positions.push(row * 4 + (col + 1));

  return positions;
}

  // 게임 보드 초기화
  initBoard();
});