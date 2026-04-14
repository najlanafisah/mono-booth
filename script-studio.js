// 1. Ambil Foto
const rawData = localStorage.getItem('capturedPhotos');
const photos = JSON.parse(rawData) || [];

if (photos.length >= 2) {
    const slot1 = document.getElementById('result-1');
    const slot2 = document.getElementById('result-2');
    if(slot1) slot1.src = photos[0];
    if(slot2) slot2.src = photos[1];
}

// 2. Generate Stiker
const stickerShelf = document.getElementById('sticker-shelf');
function generateStickers() {
    stickerShelf.innerHTML = ''; // Bersihkan rak dulu
    for (let i = 1; i <= 24; i++) {
        const fileName = i < 10 ? `stiker-0${i}.svg` : `stiker-${i}.svg`;
        const img = document.createElement('img');
        img.src = `assets/${fileName}`; 
        img.classList.add('draggable-sticker');
        stickerShelf.appendChild(img);
    }
}
generateStickers();

// 3. Interact.js Logic (UPDATE BAGIAN START)
interact('.draggable-sticker').draggable({
    inertia: true,
    listeners: {
        start(event) {
            event.target.style.zIndex = 1000;
        },
        move(event) {
            const target = event.target;
            const photoPaper = document.getElementById('photo-paper');
            
            // Jika belum masuk ke photo-paper, pindahkan parent-nya
            if (target.parentNode !== photoPaper) {
                const rect = target.getBoundingClientRect();
                const paperRect = photoPaper.getBoundingClientRect();
                
                photoPaper.appendChild(target);
                
                // Set posisi awal pas pindah ke kertas
                const initialX = rect.left - paperRect.left;
                const initialY = rect.top - paperRect.top;
                target.setAttribute('data-x', initialX);
                target.setAttribute('data-y', initialY);
            }

            // Hitung pergerakan
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            target.style.position = 'absolute';
        }
    }
});

// Tombol Next (Pindah ke Download + Save Gambar)
document.getElementById('next-studio').addEventListener('click', async () => {
    const btn = document.getElementById('next-studio');
    const element = document.getElementById('photo-paper');

    btn.innerText = "Processing..."; // Kasih feedback ke user
    btn.style.pointerEvents = "none"; // Biar gak diklik dua kali

    try {
        const canvas = await html2canvas(element, {
            useCORS: true,
            scale: 2, // Biar hasil fotonya tajam
            logging: false,
            backgroundColor: null // Biar background transparan kalau perlu
        });

        const finalImage = canvas.toDataURL("image/png");
        localStorage.setItem('finalResult', finalImage);
        
        // Pindah ke halaman download
        window.location.href = 'download.html';
    } catch (err) {
        console.error("Gagal potret:", err);
        btn.innerText = "Next →";
        btn.style.pointerEvents = "all";
    }
});

// Update juga bagian Reset karena parent-nya berubah
document.getElementById('reset-studio').addEventListener('click', () => {
    // Cari stiker yang ada DI DALAM photo-paper (kecuali logo mono-mark)
    const stickersInPaper = document.querySelectorAll('#photo-paper > .draggable-sticker');
    
    stickersInPaper.forEach(sticker => {
        sticker.remove();
    });

    generateStickers();
});

// Z-index Fix on Click
document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('draggable-sticker')) {
        e.stopPropagation();
        document.querySelectorAll('.draggable-sticker').forEach(s => s.style.zIndex = "100");
        e.target.style.zIndex = "1000";
    }
}, true);

document.getElementById('next-studio').addEventListener('click', () => {
    const element = document.getElementById('photo-paper');
    
    // Mengambil gambar dari elemen photo-paper (foto + stiker)
    html2canvas(element, {
        useCORS: true, // Supaya gambar dari luar bisa kebaca
        scale: 2       // Biar hasilnya HD (bening)
    }).then(canvas => {
        const finalImage = canvas.toDataURL("image/png");
        // Simpan hasil gabungan ke localStorage
        localStorage.setItem('finalResult', finalImage);
        // Pindah ke halaman download
        window.location.href = 'download.html'; 
    });
});