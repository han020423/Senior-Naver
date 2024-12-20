const matchingScoreList = document.getElementById("matching-score-list");
const memoryScoreList = document.getElementById("memory-score-list");
const clearMatchingScoresButton = document.getElementById("clear-matching-scores");
const clearMemoryScoresButton = document.getElementById("clear-memory-scores");

// 점수 불러오기
function loadScores(scoreKey, scoreListElement, gameName) {
  const scores = JSON.parse(localStorage.getItem(scoreKey)) || [];
  scoreListElement.innerHTML = ""; // 기존 기록 초기화

  if (scores.length === 0) {
    scoreListElement.innerHTML = `<li>${gameName}에 저장된 점수가 없습니다.</li>`;
    return;
  }

  scores.forEach((score, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${gameName} ${index + 1}: ${score}점`;
    scoreListElement.appendChild(listItem);
  });
}

// 점수 초기화
function clearScores(scoreKey, gameName, loadFunction) {
  if (confirm(`${gameName}의 모든 점수를 초기화하시겠습니까?`)) {
    localStorage.removeItem(scoreKey);
    loadFunction(); // 초기화 후 다시 로드
  }
}

// 카드 짝 맞추기 게임 점수 초기화
clearMatchingScoresButton.addEventListener("click", () => {
  clearScores("matchingGameScores", "카드 짝 맞추기 게임", loadMatchingScores);
});

// 숫자 기억 게임 점수 초기화
clearMemoryScoresButton.addEventListener("click", () => {
  clearScores("memoryGameScores", "숫자 기억 게임", loadMemoryScores);
});

// 카드 짝 맞추기 게임 점수 로드
function loadMatchingScores() {
  loadScores("matchingGameScores", matchingScoreList, "카드 짝 맞추기 게임");
}

// 숫자 기억 게임 점수 로드
function loadMemoryScores() {
  loadScores("memoryGameScores", memoryScoreList, "숫자 기억 게임");
}

// 초기 로드
loadMatchingScores();
loadMemoryScores();
