// Blob 객체를 Base64 문자열로 변환하는 함수
function blobToBase64(blob, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    callback(reader.result.split(',')[1]); // Base64 데이터만 반환
  };
  reader.readAsDataURL(blob);
}

// 댓글 녹음 시작/중지
let commentMediaRecorder;
let commentAudioChunks = [];
let isCommentRecording = false;

function getLoggedInStatus() {
  return localStorage.getItem("loggedIn") === "true";
}

function startRecordingComment() {
  if (!getLoggedInStatus()) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (!isCommentRecording) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        commentMediaRecorder = new MediaRecorder(stream);
        commentAudioChunks = [];
        commentMediaRecorder.start();
        isCommentRecording = true;

        commentMediaRecorder.ondataavailable = event => {
          commentAudioChunks.push(event.data);
        };

        commentMediaRecorder.onstop = () => {
          const commentBlob = new Blob(commentAudioChunks, { type: "audio/webm" });
          blobToBase64(commentBlob, base64Audio => {
            saveComment(base64Audio);
          });
          isCommentRecording = false;
        };

        alert("댓글 녹음을 시작합니다. 종료하려면 버트을 다시 누르세요.");
      })
      .catch(error => {
        console.error("댓글 녹음 실패:", error);
      });
  } else {
    commentMediaRecorder.stop();
    alert("댓글 등록이 완료되었습니다.");
  }
}

// 댓글 저장
function saveComment(base64Audio) {
  const currentPost = JSON.parse(localStorage.getItem("currentPost"));
  const commentList = JSON.parse(localStorage.getItem("commentList")) || {};

  if (!commentList[currentPost.id]) {
    commentList[currentPost.id] = [];
  }

  commentList[currentPost.id].push({ audio: base64Audio });
  localStorage.setItem("commentList", JSON.stringify(commentList));
  renderComments();
}

// 댓글 렌더링
function renderComments() {
  const currentPost = JSON.parse(localStorage.getItem("currentPost"));
  const commentList = JSON.parse(localStorage.getItem("commentList")) || {};
  const comments = commentList[currentPost.id] || [];
  const commentContainer = document.getElementById("comment-list");

  commentContainer.innerHTML = ""; // 기존 댓글 초기화
  comments.forEach(comment => {
    const commentAudio = document.createElement("audio");
    commentAudio.controls = true;
    commentAudio.src = `data:audio/webm;base64,${comment.audio}`;
    commentContainer.appendChild(commentAudio);
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  const currentPost = JSON.parse(localStorage.getItem("currentPost"));

  if (currentPost) {
    // 제목, 시간, 오디오 데이터 설정
    document.getElementById("post-category").textContent = `[${currentPost.category}] 글 내용`;
    document.getElementById("post-timestamp").textContent = `작성 시간: ${currentPost.timestamp}`;
    document.getElementById("post-audio").src = currentPost.audio; // Base64 오디오 데이터 불러오기

    // 지도 초기화
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: currentPost.lat, lng: currentPost.lng },
      zoom: 15,
    });

    new google.maps.Marker({
      position: { lat: currentPost.lat, lng: currentPost.lng },
      map: map,
    });

    renderComments(); // 댓글 렌더링
  } else {
    alert("글 데이터가 없습니다.");
    window.location.href = "index.html";
  }
});

// 뒤로가기 함수
function goBack() {
    // 이전 페이지가 있는 경우 뒤로가기
    window.location.href = "community.html";

}
let isPlayingPostAudio = false;
let postAudioElement = document.getElementById("post-audio");

// 글 내용 듣기 버튼 제어
document.getElementById("play-post-audio").addEventListener("click", function () {
  if (!isPlayingPostAudio) {
    postAudioElement.play();
    isPlayingPostAudio = true;
    this.textContent = "내용 멈추기";
  } else {
    postAudioElement.pause();
    isPlayingPostAudio = false;
    this.textContent = "내용 듣기";
  }
});

// 댓글 렌더링 함수 업데이트
function renderComments() {
  const currentPost = JSON.parse(localStorage.getItem("currentPost"));
  const commentList = JSON.parse(localStorage.getItem("commentList")) || {};
  const comments = commentList[currentPost.id] || [];
  const commentContainer = document.getElementById("comment-list");

  commentContainer.innerHTML = ""; // 기존 댓글 초기화

  comments.forEach((comment, index) => {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";

    const commentButton = document.createElement("button");
    commentButton.className = "audio-button";
    commentButton.textContent = `댓글 ${index + 1} 듣기`;
    let isPlayingCommentAudio = false;

    const commentAudio = new Audio(`data:audio/webm;base64,${comment.audio}`);
    commentButton.addEventListener("click", function () {
      if (!isPlayingCommentAudio) {
        commentAudio.play();
        isPlayingCommentAudio = true;
        this.textContent = `댓글 ${index + 1} 멈추기`;
      } else {
        commentAudio.pause();
        isPlayingCommentAudio = false;
        this.textContent = `댓글 ${index + 1} 듣기`;
      }
    });

    commentItem.appendChild(commentButton);
    commentContainer.appendChild(commentItem);
  });
}
