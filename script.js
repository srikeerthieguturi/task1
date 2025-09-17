// Playlist data
const songs = [
  { title: "Song One", artist: "Artist A", file: "songs/song1.mp3", duration: "3:15" },
  { title: "Song Two", artist: "Artist B", file: "songs/song2.mp3", duration: "4:05" },
  { title: "Song Three", artist: "Artist C", file: "songs/song3.mp3", duration: "2:45" }
];

const audio = new Audio();
let currentSong = 0;
let isPlaying = false;

// Elements
const playlistEl = document.getElementById("playlist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeEl = document.getElementById("volume");

// Build playlist UI
songs.forEach((song, index) => {
  const li = document.createElement("li");
  li.textContent = `${song.title} - ${song.artist} (${song.duration})`;
  li.addEventListener("click", () => loadSong(index, true));
  playlistEl.appendChild(li);
});

function loadSong(index, play = false) {
  currentSong = index;
  audio.src = songs[index].file;

  // highlight active song
  [...playlistEl.children].forEach(li => li.classList.remove("active"));
  playlistEl.children[index].classList.add("active");

  if (play) playSong();
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶️";
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong, true);
});

nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong, true);
});

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

volumeEl.addEventListener("input", () => {
  audio.volume = volumeEl.value;
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Load first song initially
loadSong(0);