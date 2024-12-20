// 1. HTML 파일 리스트
console.log("로드됨");
const foodFiles = [
    './todayfood/1ganghwang.html',
    './todayfood/2sallber.html',
    './todayfood/3kail.html',
   './todayfood/4sikemchi.html',
    './todayfood/5hobak.html',
    './todayfood/6eunhand.html',
    './todayfood/7snagsun.html',
    './todayfood/8banana.html',
    './todayfood/9gapi.html',
    './todayfood/10amond.html'
];

// 2. 날짜 기반 랜덤 인덱스 생성 (매일 고정된 랜덤 값)
function getDailyRandomIndex(arr) {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate(); // YYYYMMDD
    const random = Math.sin(seed) * 10000; // 의사 난수 생성
    return Math.abs(Math.floor(random) % arr.length); // 0 ~ arr.length-1
}

// 3. 랜덤 파일을 iframe에 적용
const randomIndex = getDailyRandomIndex(foodFiles);
document.getElementById('foodFrame').src = foodFiles[randomIndex];

console.log(randomIndex);