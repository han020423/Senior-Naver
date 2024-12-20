let score = 0; // 현재 점수
let totalScore = 0; // 누적 점수
let numberCount = 5; // 기본 값: 어려움 (5개)
let randomNumbers = [];
let userNumbers = [];
let scoreMultiplier = 1; // 점수 배율 (난이도 별로 다르게 설정)
const gameStorageKey = "memoryGameScores"; // 로컬스토리지 키

const scoreElement = document.getElementById("score");
const submitButton = document.getElementById("submit-button");
const restartButton = document.getElementById("restart-button");
const numberDisplay = document.getElementById("number-display");
const keyboardContainer = document.getElementById("keyboard-container");
const result = document.getElementById("result");

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
// 점수 저장 함수
function saveScoreToLocalStorage(finalScore) {
  const scores = JSON.parse(localStorage.getItem(gameStorageKey)) || [];
  scores.push(finalScore);
  localStorage.setItem(gameStorageKey, JSON.stringify(scores));
}

// 점수 업데이트 함수
function updateScore() {
  scoreElement.textContent = totalScore; // 화면에 누적 점수 표시
}

// 게임 시작 함수
function startGame() {
  userNumbers = []; // 사용자 선택 초기화
  score = 0; // 현재 점수 초기화
  randomNumbers = generateRandomNumbers(numberCount); // 난이도에 맞는 숫자 생성
  numberDisplay.textContent = randomNumbers.join(", ");
  numberDisplay.classList.remove("hidden");

  // 숫자를 5초 동안 표시 후 숨기기
  setTimeout(() => {
    numberDisplay.textContent = "숫자를 기억하세요!";
    keyboardContainer.classList.remove("hidden");
  }, 5000);

  renderKeyboard(); // 가상 키보드 렌더링
}

// 난이도에 맞는 랜덤 숫자 생성 함수
function generateRandomNumbers(count) {
  const numbers = [];
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * 100) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}

// 가상 키보드 렌더링 함수
function renderKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = ""; // 키보드 초기화
  for (let i = 1; i <= 100; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.onclick = () => selectNumber(button, i); // 버튼과 숫자를 전달
    keyboard.appendChild(button);
  }
}

// 숫자 선택 함수
function selectNumber(button, num) {
  if (userNumbers.includes(num)) {
    userNumbers = userNumbers.filter((n) => n !== num);
    button.style.backgroundColor = ""; // 버튼 색상 초기화
  } else if (userNumbers.length < numberCount) {
    userNumbers.push(num);
    button.style.backgroundColor = "#ffc107"; // 버튼 색상 변경
  }
}

// 제출 버튼 클릭 시
submitButton.onclick = () => {
  if (userNumbers.length < numberCount) {
    alert(`숫자 ${numberCount}개를 입력하세요!`);
    return;
  }

  const correctCount = userNumbers.filter((num) => randomNumbers.includes(num)).length;

  if (correctCount === numberCount) {
    score += scoreMultiplier * correctCount; // 난이도 배율을 적용하여 점수 계산
    totalScore += score;
    updateScore(); // 점수 업데이트
    numberDisplay.textContent = `정답! +${score}점`;
  } else {
    saveScoreToLocalStorage(totalScore); // 누적 점수 저장
    numberDisplay.textContent = `틀렸습니다.`; // 틀렸을 때 점수 표시
    restartButton.classList.remove("hidden");
    keyboardContainer.classList.add("hidden"); // 키보드 숨기기
    return;
  }

  result.classList.remove("hidden");
  keyboardContainer.classList.add("hidden");

  // 다음 라운드로 자동 진행
  setTimeout(() => {
    result.classList.add("hidden");
    startGame();
  }, 2000);
};

// 다시 시작 버튼 클릭 시
restartButton.onclick = () => {
  result.classList.add("hidden");
  restartButton.classList.add("hidden");
  keyboardContainer.classList.add("hidden"); // 키보드 숨기기
  numberDisplay.textContent = "숫자를 기억하세요!";
  
  // 점수 초기화
  score = 0;
  totalScore = 0;

  updateScore(); // 화면에 점수 업데이트

  setupDifficulty(); // 난이도 선택 화면으로 돌아가기
};


// 난이도 설정 후 게임 시작
function setupDifficulty() {
  const difficultyContainer = document.createElement("div");
  difficultyContainer.id = "difficulty-container";
  document.getElementById("game-container").prepend(difficultyContainer);

  difficultyContainer.innerHTML = `
    <h2>난이도를 선택하세요:</h2>
    <button onclick="setDifficulty(3, 1)">쉬움 (3개, 1배율)</button>
    <button onclick="setDifficulty(4, 1.5)">보통 (4개, 1.5배율)</button>
    <button onclick="setDifficulty(5, 2)">어려움 (5개, 2배율)</button>
  `;
}

// 난이도 설정 함수
function setDifficulty(count, multiplier) {
  numberCount = count;
  scoreMultiplier = multiplier;

  const difficultyContainer = document.getElementById("difficulty-container");
  difficultyContainer.remove(); // 난이도 선택 화면 제거
  keyboardContainer.classList.remove("hidden"); // 키보드 다시 표시
  startGame(); // 게임 시작
}

// 초기화
setupDifficulty();
