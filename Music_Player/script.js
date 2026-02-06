const musicContainer = document.querySelector('.music-player');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const disk = document.getElementById('disk');
const currTime = document.getElementById('curr-time');
const durTime = document.getElementById('dur-time');
const volumeSlider = document.getElementById('volume-slider');
const playlistItems = document.getElementById('playlist-items');

const songs = [
    {
        title: "Neon Dreams",
        artist: "Synthwave Boy",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300&auto=format&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Night Drive",
        artist: "Cyber Funk",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
    },
    {
        title: "Retro Soul",
        artist: "The Classics",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" 
    }
];

let songIndex = 0;
let isDragging = false;

loadSong(songs[songIndex]);
renderPlaylist();

function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    disk.style.backgroundImage = `url(${song.cover})`;
    
    updatePlaylistActive();
}

function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i').classList.remove('fa-play');
    playBtn.querySelector('i').classList.add('fa-pause');
    disk.classList.add('play');

    var playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Playback prevented or interrupted.");
        });
    }
}

function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i').classList.add('fa-play');
    playBtn.querySelector('i').classList.remove('fa-pause');
    disk.classList.remove('play');
    audio.pause();
}

playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

function updateProgress(e) {
    if(isDragging) return;

    const { duration, currentTime } = e.srcElement;
    
    if (isNaN(duration)) return; 

    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    let min = Math.floor(currentTime / 60);
    let sec = Math.floor(currentTime % 60);
    if (sec < 10) sec = `0${sec}`;
    currTime.innerText = `${min}:${sec}`;

    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) totalSec = `0${totalSec}`;
    durTime.innerText = `${totalMin}:${totalSec}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (isNaN(duration) || duration === 0) return;

    audio.currentTime = (clickX / width) * duration;
}

progressContainer.addEventListener('mousedown', () => isDragging = true);
progressContainer.addEventListener('mouseup', (e) => {
    isDragging = false;
    setProgress.call(progressContainer, e);
});

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

audio.addEventListener('ended', nextSong);

function renderPlaylist() {
    playlistItems.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `${song.title} - ${song.artist}`;
        
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });

        playlistItems.appendChild(li);
    });
    updatePlaylistActive();
}

function updatePlaylistActive() {
    const items = playlistItems.querySelectorAll('li');
    items.forEach((item, index) => {
        if(index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}