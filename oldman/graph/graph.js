function getLoggedInStatus() {
  return localStorage.getItem("loggedIn") === "true";
}
function isloggedIn() {
  if (!getLoggedInStatus()) {
    alert("로그인이 필요합니다.");
    window.close();
  }
}
isloggedIn();

// Chart.js 그래프를 그릴 함수
function window_close() {
  window.close();
}
function drawChart(chartId, gameName, scoreKey) {
    // 로컬스토리지에서 점수 불러오기
    const scores = JSON.parse(localStorage.getItem(scoreKey)) || [];
    const labels = []; // x축에 사용할 게임 회차 (1, 2, 3, ...)
    const data = []; // y축에 사용할 점수
  
    // 점수 배열이 있다면 그래프 데이터를 설정
    scores.forEach((score, index) => {
      labels.push(`게임 ${index + 1}`); // 게임 1, 2, 3, ...
      data.push(score); // 해당 게임의 점수
    });
  
    // Chart.js로 그래프 그리기
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
      type: 'line', // 꺾은선 그래프
      data: {
        labels: labels,
        datasets: [{
          label: `${gameName} 점수`,
          data: data,
          fill: false,
          borderColor: '#03cf5d',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `점수 변화`
          }
        }
      }
    });
  }
  
  // 게임 1 (카드 짝 맞추기 게임) 점수 그래프
  drawChart('matchingGameChart', '카드 짝 맞추기', 'matchingGameScores');
  
  // 게임 2 (숫자 기억 게임) 점수 그래프
  drawChart('memoryGameChart', '숫자 기억하기', 'memoryGameScores');
  