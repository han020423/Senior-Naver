// 로그인 상태 확인 (로컬스토리지 사용)
function getLoggedInStatus() {
  return localStorage.getItem("loggedIn") === "true";
}

// 로그인 모달 열기
function openLoginModal() {
  if (!getLoggedInStatus()) {
    document.getElementById("login-modal").style.display = "block";
  }
}

// 로그인 모달 닫기
function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
}

// 로그인 처리
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "020423" && password === "1234") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);

    updateHeader(username);
    closeLoginModal();
    alert("로그인 성공!");
  } else {
    alert("아이디 또는 비밀번호가 잘못되었습니다.");
  }
}

// 로그아웃 처리
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");

  updateHeader(); // 헤더 초기화
  alert("로그아웃되었습니다.");
  location.reload();
}

// 헤더 업데이트 (로그인 상태에 따라)
function updateHeader(username) {
  const userInfo = document.getElementById("user-info");
  const logoutButton = document.getElementById("logout-button");

  if (username) {
    userInfo.innerText = "한재혁님";
    logoutButton.style.display = "inline-block";
    userInfo.onclick = null; // 클릭 이벤트 제거
  } else {
    userInfo.innerText = "로그인하세요";
    logoutButton.style.display = "none";
    userInfo.onclick = openLoginModal; // 클릭 이벤트 추가
  }
}

let currentInput = "username"; // 현재 활성화된 입력 필드

// 키패드에서 입력 추가
function addKey(value) {
  const inputField = document.getElementById(currentInput);
  inputField.value += value;
}

// 키패드에서 입력 삭제
function deleteKey() {
  const inputField = document.getElementById(currentInput);
  inputField.value = inputField.value.slice(0, -1);
}

// 입력 필드 전환 (아이디 <-> 비밀번호)
function switchInput() {
  if (currentInput === "username") {
    currentInput = "password";
    alert("비밀번호 입력으로 전환되었습니다.");
  } else {
    currentInput = "username";
    alert("아이디 입력으로 전환되었습니다.");
  }
}


const API_KEY = "AIzaSyBTY-fhD1epLQYsLZ9ueF5qV8vhLV75fRc"; // YouTube API 키
const CHANNEL_ID = "UCdFpxeVuZuS7TfGDT9U19fg"; // lktrot2 채널 ID

async function loadLatestVideo() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&type=video&maxResults=5&eventType=none`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      // 예정된 방송을 제외한 동영상만 필터링
      const validVideos = data.items.filter(item => item.snippet.liveBroadcastContent !== 'upcoming' || item.snippet.liveBroadcastContent === 'none' || item.snippet.liveBroadcastContent === 'live');

      if (validVideos.length > 0) {
        const videoId = validVideos[0].id.videoId; // 유효한 최신 동영상
        const iframe = document.querySelector(".lmusic");
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
      } else {
        console.error("No valid videos found for this channel.");
      }
    } else {
      console.error("No videos found for this channel.");
    }
  } catch (error) {
    console.error("Error fetching latest video:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadLatestVideo);



// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = getLoggedInStatus();
  const username = localStorage.getItem("username");

  if (loggedIn && username) {
    updateHeader(username); // 로그인된 상태로 헤더 초기화
  } else {
    updateHeader(); // 비로그인 상태로 헤더 초기화
  }
});
