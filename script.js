const videoPlayer = document.getElementById("tv-player");
const programTitle = document.getElementById("current-program");
const channelSelect = document.getElementById("channel-select");

const videoTitles = {
  Βουλή: [
    "Βουλευτική Συνεδρίαση για το νομοσχέδιο ν.5/Parliament Session for Bill n.5", 
    "Πολιτική Ανάλυση", 
    "Πολιτιστικές Εκδηλώσεις"
  ],
  ΕΡΤ: [
    "Πληροφοριακό Βίντεο/Informative Video", 
    "Νομοθετικές Εξελίξεις"
  ],
  ΕΣΤ: [
    "Ντοκιμαντέρ πρώτου Ελληνο-τουρκικου πολέμου/1st Greek-turkish war documentary", "Βίντεο για την 25Μ/Video for 25M"
  ]
};

let videos = [];
let durations = [];
let currentChannel = "Βουλή";
let currentIndex = 0;

async function getDuration(file) {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.src = file;
    v.addEventListener("loadedmetadata", () => {
      resolve(v.duration);
    });
    v.addEventListener("error", () => resolve(0));
  });
}

async function initializeVideos(channel) {
  videos = [];
  durations = [];
  currentIndex = 0;

  const maxVideos = 10;
  const titles = videoTitles[channel] || [];

  for (let i = 1; i <= maxVideos; i++) {
    const path = `videos/${channel}/video${i}.mp4`;
    try {
      const duration = await getDuration(path);
      if (duration > 0) {
        videos.push({ file: path, title: titles[i - 1] || `Πρόγραμμα ${i}` });
        durations.push(duration);
      }
    } catch (e) {
      continue;
    }
  }

  playVideo(currentIndex);
}

function playVideo(index) {
  const video = videos[index];
  if (!video) return;

  videoPlayer.src = video.file;
  videoPlayer.currentTime = 0;
  programTitle.textContent = video.title;
  videoPlayer.load();
  videoPlayer.play().catch(err => console.error("Play failed:", err));
}

videoPlayer.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % videos.length;
  playVideo(currentIndex);
});

channelSelect.addEventListener("change", (e) => {
  currentChannel = e.target.value;
  initializeVideos(currentChannel);
});

initializeVideos(currentChannel);
