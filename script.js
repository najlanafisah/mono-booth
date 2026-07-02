const actionBtn = document.getElementById('action-btn');
const btnText = document.getElementById('btn-text');
const video = document.getElementById('video-stream');
const canvas = document.getElementById('photo-canvas'); // Ambil canvas
const ringLight = document.getElementById('flash-effect');
const shutter = document.getElementById('shutter-flash');
const countOverlay = document.getElementById('countdown-overlay');
const countText = document.getElementById('countdown-number');
const flashToggle = document.getElementById('flash-toggle');

let photoCount = 0;
let isBusy = false;
let savedPhotos = []; // Array untuk simpan hasil foto Base64

// 1. Fungsi Kamera
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 } 
        });
        video.srcObject = stream;
    } catch (err) {
        alert("Kamera tidak ditemukan atau izin ditolak!");
    }
}

initCamera();

// 2. Logika Tombol
actionBtn.addEventListener('click', () => {
    if (isBusy) return;
    
    if (photoCount < 2) {
        startCapture();
    } else {
        // PROSES PINDAH KE STUDIO
        // Simpan array foto ke LocalStorage
        localStorage.setItem('capturedPhotos', JSON.stringify(savedPhotos));
        // Arahkan ke halaman studio
        window.location.href = 'studio.html';
    }
});

function startCapture() {
    isBusy = true;
    runCountdown();
}

function runCountdown() {
    let timer = 3;
    countText.innerText = timer;
    countOverlay.classList.remove('countdown-hidden');

    const interval = setInterval(() => {
        timer--;
        if (timer > 0) {
            countText.innerText = timer;
        } else {
            clearInterval(interval);
            countOverlay.classList.add('countdown-hidden');
            cekrek();
        }
    }, 1000);
}

function cekrek() {
    // Jalankan Flash jika toggle ON
    if (flashToggle.checked) {
        ringLight.classList.add('ring-light-active');
    }
    
    // Shutter Putih
    shutter.classList.add('flash-active');

    // --- PROSES AMBIL GAMBAR DARI VIDEO ---
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Gambar ke canvas (Mirroring balik supaya hasilnya natural)
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    // Simpan ke array savedPhotos
    const imageData = canvas.toDataURL('image/jpeg', 0.85);
    savedPhotos.push(imageData);
    // --------------------------------------

    setTimeout(() => {
        ringLight.classList.remove('ring-light-active');
        shutter.classList.remove('flash-active');
        photoCount++;

        updateUI();

        if (photoCount === 1) {
            setTimeout(runCountdown, 1000);
        } else {
            isBusy = false;
        }
    }, 500);
}

function updateUI() {
    if (photoCount >= 2) {
        actionBtn.classList.add('btn-next');
        btnText.innerText = 'NEXT';
    } else {
        actionBtn.classList.remove('btn-next');
        btnText.innerText = '';
    }
}

updateUI();