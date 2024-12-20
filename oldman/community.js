let mediaRecorder;
let audioChunks = [];
let recordedBlob;
let selectedPosition;
let isRecording = false; // 녹음 상태 확인

function getLoggedInStatus() {
  return localStorage.getItem("loggedIn") === "true";
}

function window_close() {
  window.close();
}
// 지도 초기화 (현재 위치 기반)
function initMap() {
  navigator.geolocation.getCurrentPosition(
    position => {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const map = new google.maps.Map(document.getElementById("map"), {
        center: currentLocation,
        zoom: 12,
      });

      const marker = new google.maps.Marker({
        position: currentLocation,
        map: map,
        draggable: true,
      });

      google.maps.event.addListener(marker, "dragend", () => {
        selectedPosition = marker.getPosition();
      });

      selectedPosition = currentLocation; // 초기 위치 저장
    },
    error => {
      console.error("위치 정보를 가져올 수 없습니다.", error);
    }
  );
}
// 글 목록 렌더링
function renderPostList() {
  const postList = JSON.parse(localStorage.getItem("postList")) || [];
  const postContainer = document.getElementById("post-list");
  postContainer.innerHTML = ""; // 기존 목록 초기화

  postList.forEach(post => {
    const postItem = document.createElement("div");
    postItem.className = "post-item";
    postItem.innerHTML = `
      <h3>[${post.category}]</h3>
      <p>${post.timestamp}</p> <!-- 작성 시간 표시 -->
      <button onclick="viewPost(${post.id})">보기</button>
    `;
    postContainer.appendChild(postItem);
  });
}



// 페이지 로드 시 글 목록 렌더링
document.addEventListener("DOMContentLoaded", () => {
  renderPostList();
});

// 글쓰기 모달 열기
function openWriteModal() {
  if (!getLoggedInStatus()) {
    alert("로그인이 필요합니다.");
    return;
  }

  const modal = document.getElementById("write-modal");
  modal.style.display = "flex";
  initMap();
}

// 녹음 시작/중지 버튼 통합
function toggleRecording() {
  if (!isRecording) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        isRecording = true;

        audioChunks = [];
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          recordedBlob = new Blob(audioChunks, { type: "audio/webm" });
          document.getElementById("add-post-btn").disabled = false;
        };

        document.getElementById("record-btn").textContent = "녹음 중지";
      })
      .catch(error => {
        console.error("녹음 실패:", error);
      });
  } else {
    mediaRecorder.stop();
    isRecording = false;
    document.getElementById("record-btn").textContent = "녹음 시작";
  }
}

// Base64 변환 유틸리티 함수
function blobToBase64(blob, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(blob);
}

// 글 추가 시 Base64로 저장
function addPost() {
  const category = document.getElementById("category-select").value;

  if (!selectedPosition) {
    alert("위치를 선택해주세요.");
    return;
  }

  const postList = JSON.parse(localStorage.getItem("postList")) || [];
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now
    .getDate()
    .toString()
    .padStart(2, "0")} ${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  if (recordedBlob) {
    blobToBase64(recordedBlob, base64Audio => {
      const newPost = {
        id: Date.now(),
        category: category,
        lat: selectedPosition.lat(),
        lng: selectedPosition.lng(),
        audio: base64Audio, // 녹음 데이터 저장
        timestamp: timestamp, // 작성 시간 저장
      };

      postList.unshift(newPost); // 최신 글이 맨 앞에 추가
      localStorage.setItem("postList", JSON.stringify(postList));
      renderPostList();
      closeWriteModal();
    });
  } else {
    alert("녹음 파일이 없습니다.");
  }
}


// 글 보기 페이지에서 Base64 오디오 로드
document.addEventListener("DOMContentLoaded", () => {
  const currentPost = JSON.parse(localStorage.getItem("currentPost"));

  if (currentPost) {
    document.getElementById("post-category").textContent = `[${currentPost.category}] 글 내용`;
    document.getElementById("post-audio").src = currentPost.audio; // Base64 URL
  }
});

// 글 보기 페이지 이동
function viewPost(postId) {
  const postList = JSON.parse(localStorage.getItem("postList")) || [];
  const post = postList.find(item => item.id === postId);

  if (post) {
    localStorage.setItem("currentPost", JSON.stringify(post)); // 글 데이터 저장
    window.location.href = "post.html";
  } else {
    alert("해당 글을 찾을 수 없습니다.");
  }
}

// 글쓰기 모달 닫기
function closeWriteModal() {
  const modal = document.getElementById("write-modal");
  modal.style.display = "none";
}
