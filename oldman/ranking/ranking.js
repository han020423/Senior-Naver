// 로컬스토리지 키
const GAME1_RANKING_STORAGE_KEY = "game1Rankings"; // 게임 1 (카드 게임)
const GAME2_RANKING_STORAGE_KEY = "game2Rankings"; // 게임 2 (메모리 게임)
function window_close() {
  window.close();
}
// 사용자 점수 로드 (게임 1: 카드 게임 중 가장 높은 점수)
function loadUserScoreForGame1() {
  const matchingScores = JSON.parse(localStorage.getItem("matchingGameScores")) || [];
  const highestScore = Math.max(0, ...matchingScores); // 최고 점수를 찾기
  return { name: "내 점수", score: highestScore };
}

// 사용자 점수 로드 (게임 2: 메모리 게임 중 가장 높은 점수)
function loadUserScoreForGame2() {
  const memoryScores = JSON.parse(localStorage.getItem("memoryGameScores")) || [];
  const highestScore = Math.max(0, ...memoryScores); // 최고 점수를 찾기
  return { name: "내 점수", score: highestScore };
}

// 더미 데이터
const dummyDataForGame1 = [
  { name: "배성동", score: 66 },
  { name: "이형준", score: 70 },
  { name: "박호세", score: 73 },
  { name: "오민형", score: 41 },
  { name: "김판근", score: 39 },
];

const dummyDataForGame2 = [
  { name: "박병철", score: 42 },
  { name: "문민수", score: 36 },
  { name: "황만복", score: 25 },
  { name: "오철민", score: 18 },
  { name: "강덕배", score: 7 },
];

// 랭킹 데이터 불러오기
function loadRankingsForGame1() {
  return JSON.parse(localStorage.getItem(GAME1_RANKING_STORAGE_KEY)) || [];
}

function loadRankingsForGame2() {
  return JSON.parse(localStorage.getItem(GAME2_RANKING_STORAGE_KEY)) || [];
}

// 랭킹 데이터 저장
function saveRankingsForGame1(rankings) {
  localStorage.setItem(GAME1_RANKING_STORAGE_KEY, JSON.stringify(rankings));
}

function saveRankingsForGame2(rankings) {
  localStorage.setItem(GAME2_RANKING_STORAGE_KEY, JSON.stringify(rankings));
}

// 더미 데이터 추가
function ensureDummyDataForGame1() {
  let rankings = loadRankingsForGame1();
  if (rankings.length === 0) {
    rankings = [...dummyDataForGame1];
    saveRankingsForGame1(rankings);
  }
}

function ensureDummyDataForGame2() {
  let rankings = loadRankingsForGame2();
  if (rankings.length === 0) {
    rankings = [...dummyDataForGame2];
    saveRankingsForGame2(rankings);
  }
}

// 랭킹 표시
function renderGame1Rankings() {
  const rankingList = document.getElementById("game1-ranking-list");
  rankingList.innerHTML = ""; // 기존 내용 초기화
  const userScore = loadUserScoreForGame1();

  // 모든 사용자 데이터 불러오기
  const rankings = loadRankingsForGame1();
  rankings.push(userScore); // 내 점수 추가

  // 점수를 기준으로 내림차순 정렬
  rankings.sort((a, b) => b.score - a.score);

  // 테이블에 데이터 추가
  rankings.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
    `;
    rankingList.appendChild(row);
  });
}

function renderGame2Rankings() {
  const rankingList = document.getElementById("game2-ranking-list");
  rankingList.innerHTML = ""; // 기존 내용 초기화
  const userScore = loadUserScoreForGame2();

  // 모든 사용자 데이터 불러오기
  const rankings = loadRankingsForGame2();
  rankings.push(userScore); // 내 점수 추가

  // 점수를 기준으로 내림차순 정렬
  rankings.sort((a, b) => b.score - a.score);

  // 테이블에 데이터 추가
  rankings.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
    `;
    rankingList.appendChild(row);
  });
}

// 랭킹 초기화
function clearRankingsForGame1() {
  if (confirm("게임 1 랭킹을 초기화하시겠습니까?")) {
    localStorage.removeItem(GAME1_RANKING_STORAGE_KEY);
    renderGame1Rankings();
  }
}

function clearRankingsForGame2() {
  if (confirm("게임 2 랭킹을 초기화하시겠습니까?")) {
    localStorage.removeItem(GAME2_RANKING_STORAGE_KEY);
    renderGame2Rankings();
  }
}

// 초기 데이터 준비 및 렌더링
function initializeRankings() {
  ensureDummyDataForGame1(); // 더미 데이터 자동 추가 (게임 1)
  ensureDummyDataForGame2(); // 더미 데이터 자동 추가 (게임 2)
  renderGame1Rankings(); // 게임 1 랭킹 렌더링
  renderGame2Rankings(); // 게임 2 랭킹 렌더링
}

// 초기화
initializeRankings();
