const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-button");
const difficultyContainer = document.createElement("div");

function getLoggedInStatus() {
  return localStorage.getItem("loggedIn") === "true";
}
function isloggedIn() {
  if (!getLoggedInStatus()) {
    alert("로그인이 필요합니다.");
    window.close();
  }
}
function window_close() {
  window.close();
}
isloggedIn();
difficultyContainer.id = "difficulty-container";
document.body.prepend(difficultyContainer);

let cards = [];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let timer = 60; // 제한 시간 60초
let timerInterval;
let gridSize = 4; // 기본 4x4
let baseScore = 0; // 난이도에 따른 기본 점수
let startTime;

// 타이머 표시
const timerElement = document.createElement("h3");
timerElement.id = "timer";
timerElement.textContent = `남은 시간: ${timer}초`;
document.getElementById("game-info").prepend(timerElement);

// 난이도 선택 UI 생성
function setupDifficultySelection() {
  difficultyContainer.innerHTML = `
    <h2>난이도를 선택하세요:</h2>
    <button onclick="startGame(4, 0)">쉬움 (4x4)</button>
    <button onclick="startGame(6, 10)">보통 (6x6)</button>
    <button onclick="startGame(8, 20)">어려움 (8x8)</button>
  `;
}

// 카드 데이터 생성
function generateCards(gridSize) {
  const totalCards = gridSize * gridSize;
  const totalPairs = totalCards / 2;
  const values = Array.from({ length: totalPairs }, (_, i) => i + 1);
  const pairs = [...values, ...values];
  return pairs.sort(() => Math.random() - 0.5); // 무작위 섞기
}

// 게임 초기화
function initializeGame(gridSize, base) {
  clearInterval(timerInterval);
  timer = 60; // 60초 제한 시간
  timerElement.textContent = `남은 시간: ${timer}초`;

  cards = generateCards(gridSize);
  flippedCards = [];
  matchedCards = [];
  score = base; // 난이도 기본 점수 설정
  baseScore = base;
  updateScore();
  renderBoard(gridSize);
  restartButton.classList.add("hidden");

  startTimer();
}

// 점수 업데이트
function updateScore() {
  scoreElement.textContent = score;
}

// 게임 보드 렌더링
function renderBoard(gridSize) {
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  cards.forEach((value, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.dataset.value = value;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

// 카드 뒤집기
function flipCard(card) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  card.textContent = card.dataset.value;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// 짝 확인
function checkMatch() {
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.dataset.value === secondCard.dataset.value) {
    matchedCards.push(firstCard, secondCard);
    flippedCards = [];
    score += 1; // 짝 맞출 때마다 1점 추가
    updateScore();

    // 게임 종료 확인
    if (matchedCards.length === cards.length) {
      endGame("축하합니다! 게임을 완료했습니다!");
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.textContent = "";
      secondCard.textContent = "";
      flippedCards = [];
    }, 1000);
  }
}

// 타이머 시작
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timer = 60 - elapsed;
    timerElement.textContent = `남은 시간: ${timer}초`;

    if (timer <= 0) {
      clearInterval(timerInterval);
      endGame("시간이 초과되었습니다! 게임 종료!");
    }
  }, 1000);
}

// 게임 종료
function endGame(message) {
  clearInterval(timerInterval);

  const remainingTime = timer > 0 ? timer : 0;
  score += remainingTime; // 남은 시간을 점수에 추가
  alert(`${message} 최종 점수: ${score}`);

  saveScoreToLocalStorage(score); // 점수 저장
  restartButton.classList.remove("hidden");
  gameBoard.innerHTML = "";
}

// 점수 저장 (로컬스토리지)
function saveScoreToLocalStorage(finalScore) {
  const previousScores = JSON.parse(localStorage.getItem("matchingGameScores")) || [];
  previousScores.push(finalScore);
  localStorage.setItem("matchingGameScores", JSON.stringify(previousScores));
}

// 게임 시작
function startGame(size, base) {
  gridSize = size;
  initializeGame(gridSize, base);
  difficultyContainer.style.display = "none"; // 난이도 선택 숨김
}

// 다시 시작 버튼 클릭 시
restartButton.addEventListener("click", () => {
  difficultyContainer.style.display = "block"; // 난이도 선택 표시
  gameBoard.innerHTML = ""; // 보드 초기화
});

// 숫자 기억 게임 점수 저장 함수
function saveMemoryGameScore(score) {
  const memoryGameKey = "memoryGameScores";
  const scores = JSON.parse(localStorage.getItem(memoryGameKey)) || [];
  scores.push(score); // 점수 추가
  localStorage.setItem(memoryGameKey, JSON.stringify(scores));
}

// 점수 기록 저장 호출 예시 (게임 종료 시)
saveMemoryGameScore(score); // 로컬스토리지에 저장

// 초기화
setupDifficultySelection();
