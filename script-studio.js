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

// LOGO MONO
// Sebelumnya logo ini <svg> inline yang warnanya diubah live lewat JS
// (path.style.fill). html2canvas kurang reliable nge-capture svg yang
// dimanipulasi kayak gitu. Solusinya: logo dibuat sebagai <img> biasa
// (persis pola lama yang sudah terbukti jalan), tapi src-nya berupa
// SVG data URI yang di-generate di JS sesuai warna kertas yang dipilih.
function buildLogoSvg(fillColor) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100">
        <path d="M12.1159 47.1537H2.35769C1.52813 47.1537 0.916878 46.9791 0.523931 46.6298C0.174644 46.2369 0 45.6256 0 44.7961V2.35769C0 1.52813 0.174644 0.93871 0.523931 0.589422C0.916878 0.196474 1.52813 0 2.35769 0H12.9018C13.6004 0 14.168 0.152812 14.6046 0.458437C15.0848 0.764064 15.5214 1.26616 15.9144 1.96474L21.8086 12.6398C22.0269 13.0328 22.2016 13.3166 22.3325 13.4912C22.5072 13.6659 22.7255 13.7532 22.9874 13.7532H23.5769C23.8388 13.7532 24.0353 13.6659 24.1663 13.4912C24.3409 13.3166 24.5374 13.0328 24.7557 12.6398L30.5844 1.96474C30.9774 1.26616 31.3922 0.764064 31.8288 0.458437C32.309 0.152812 32.8985 0 33.597 0H44.2066C45.0362 0 45.6256 0.196474 45.9749 0.589422C46.3678 0.93871 46.5643 1.52813 46.5643 2.35769V44.7961C46.5643 45.6256 46.3678 46.2369 45.9749 46.6298C45.6256 46.9791 45.0362 47.1537 44.2066 47.1537H34.121C33.2914 47.1537 32.6802 46.9791 32.2872 46.6298C31.9379 46.2369 31.7633 45.6256 31.7633 44.7961V25.7336C31.7633 24.6848 30.363 24.3301 29.8637 25.2525L27.8993 28.8817C27.5063 29.6239 27.0261 30.1697 26.4585 30.5189C25.9346 30.8246 25.2578 30.9774 24.4283 30.9774H21.8086C20.979 30.9774 20.2805 30.8246 19.7129 30.5189C19.189 30.1697 18.7305 29.6239 18.3376 28.8817L16.3732 25.2525C15.8739 24.3301 14.4736 24.6848 14.4736 25.7336V44.7961C14.4736 45.6256 14.2771 46.2369 13.8842 46.6298C13.5349 46.9791 12.9454 47.1537 12.1159 47.1537Z" fill="${fillColor}" />
        <path d="M12.1814 100H2.35769C1.52813 100 0.916878 99.8254 0.523931 99.4761C0.174644 99.0831 0 98.4719 0 97.6423V55.2039C0 54.3744 0.174644 53.785 0.523931 53.4357C0.916878 53.0427 1.52813 52.8463 2.35769 52.8463H9.16878C9.99834 52.8463 10.6969 52.9772 11.2645 53.2392C11.8758 53.5012 12.4652 53.9596 13.0328 54.6145L23.207 66.2571C24.0846 67.2614 25.7381 66.6407 25.7381 65.307V55.2039C25.7381 54.3744 25.9127 53.785 26.262 53.4357C26.655 53.0427 27.2662 52.8463 28.0958 52.8463H37.9195C38.749 52.8463 39.3384 53.0427 39.6877 53.4357C40.0807 53.785 40.2772 54.3744 40.2772 55.2039V97.6423C40.2772 98.4719 40.0807 99.0831 39.6877 99.4761C39.3384 99.8254 38.749 100 37.9195 100H28.0958C27.2662 100 26.655 99.8254 26.262 99.4761C25.9127 99.0831 25.7381 98.4719 25.7381 97.6423V89.5869L17.0961 79.1256C16.2341 78.082 14.5391 78.6916 14.5391 80.0452V97.6423C14.5391 98.4719 14.3426 99.0831 13.9496 99.4761C13.6004 99.8254 13.0109 100 12.1814 100Z" fill="${fillColor}" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M56.9305 0.22742H85.6398C89.514 0.22742 92.6547 3.71825 92.6547 8.02441V39.3567C92.6547 43.6629 89.514 47.1537 85.6398 47.1537H56.9305C53.0563 47.1537 49.9156 43.6629 49.9156 39.3567V8.02441C49.9156 3.71825 53.0563 0.22742 56.9305 0.22742ZM76.7719 10.6234H65.4074C63.4702 10.6234 61.8999 12.3688 61.8999 14.5219V33.0036C61.8999 35.1567 63.4702 36.9021 65.4074 36.9021H76.7719C78.709 36.9021 80.2794 35.1567 80.2794 33.0036V14.5219C80.2794 12.3688 78.709 10.6234 76.7719 10.6234Z" fill="${fillColor}" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M52.9478 53.0737H84.8577C89.1639 53.0737 92.6547 56.5645 92.6547 60.8707V92.203C92.6547 96.5092 89.1639 100 84.8577 100H52.9478C48.6416 100 45.1508 96.5092 45.1508 92.203V60.8707C45.1508 56.5645 48.6416 53.0737 52.9478 53.0737ZM77.7826 63.4697H60.0228C57.8698 63.4697 56.1243 65.2151 56.1243 67.3682V85.8499C56.1243 88.003 57.8698 89.7484 60.0228 89.7484H77.7826C79.9357 89.7484 81.6811 88.003 81.6811 85.8499V67.3682C81.6811 65.2151 79.9357 63.4697 77.7826 63.4697Z" fill="${fillColor}" />
        <circle cx="76" cy="69" r="2" fill="${fillColor}" />
    </svg>`;
}

function setLogoColor(fillColor) {
    const logoImg = document.getElementById('mono-logo');
    if (!logoImg) return;
    const svgString = buildLogoSvg(fillColor);
    logoImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
}

// Warna default sesuai desain awal
setLogoColor('#D82E1D');

// FIX LOGO HILANG: html2canvas kurang reliable nge-render elemen <svg>
// inline langsung. Solusinya, sebelum capture, kita ubah dulu SVG logo
// jadi <img> (pakai data URI) yang mempertahankan warna fill saat itu.
// html2canvas jauh lebih konsisten nge-render <img> dibanding <svg> DOM.
function convertLogoToImage() {
    return document.getElementById('mono-logo');
}

function waitForImageLoad(img) {
    return new Promise((resolve) => {
        if (!img || img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
    });
}

// Tombol Next (Pindah ke Download + Save Gambar)
// CATATAN: Sebelumnya ada 2 event listener terpisah yang sama-sama
// memanggil html2canvas() pada klik #next-studio. Ini digabung jadi
// satu listener saja supaya capture cuma jalan sekali per klik,
// dan tidak ada race condition yang bisa bikin elemen (mis. logo)
// gagal ke-render di hasil akhir.
document.getElementById('next-studio').addEventListener('click', async () => {
    const btn = document.getElementById('next-studio');
    const element = document.getElementById('photo-paper');

    btn.innerText = "Processing..."; // Kasih feedback ke user
    btn.style.pointerEvents = "none"; // Biar gak diklik dua kali

    try {
        const logoImg = convertLogoToImage();
        await waitForImageLoad(logoImg);

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

document.querySelectorAll('.color-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        const selectedColor = pill.getAttribute('data-color');
        
        const paper = document.getElementById('photo-paper');
        paper.style.backgroundColor = selectedColor;
        
        const newLogoColor = (selectedColor === '#EBEBEB' || selectedColor === '#ffbb1c')
            ? '#191717'
            : '#EBEBEB';
        setLogoColor(newLogoColor);
        
        paper.classList.add('paper-bounce');
        setTimeout(() => paper.classList.remove('paper-bounce'), 300);
    });
});