// Variabel global
let selectedWord = null;
let lines = [];
let currentLevel = 1; // Level default adalah 1

// Dapatkan elemen canvas dan konteksnya
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Data kata dan sinonim untuk setiap level
const levels = {
    1: {
        words: ["Happy", "Fast", "Smart"],
        synonyms: ["Joyful", "Quick", "Clever"],
        correctPairs: [
            { word: 0, synonym: 0 },
            { word: 1, synonym: 1 },
            { word: 2, synonym: 2 }
        ]
    },
    2: {
        words: ["Big", "Small", "Angry", "Cold"],
        synonyms: ["Enormous", "Tiny", "Furious", "Chilly"],
        correctPairs: [
            { word: 0, synonym: 0 },
            { word: 1, synonym: 1 },
            { word: 2, synonym: 2 },
            { word: 3, synonym: 3 }
        ]
    },
    3: {
        words: ["Bright", "Dark", "Tough", "Soft", "Hard"],
        synonyms: ["Radiant", "Dim", "Strong", "Gentle", "Rigid"],
        correctPairs: [
            { word: 0, synonym: 0 },
            { word: 1, synonym: 1 },
            { word: 2, synonym: 2 },
            { word: 3, synonym: 3 },
            { word: 4, synonym: 4 }
        ]
    },
    4: {
        words: ["Complex", "Quick", "Happy", "Vivid", "Silent", "Strong"],
        synonyms: ["Intricate", "Swift", "Joyous", "Bright", "Quiet", "Mighty"],
        correctPairs: [
            { word: 0, synonym: 0 },
            { word: 1, synonym: 1 },
            { word: 2, synonym: 2 },
            { word: 3, synonym: 3 },
            { word: 4, synonym: 4 },
            { word: 5, synonym: 5 }
        ]
    }
};

// Fungsi untuk mengubah level
function changeLevel() {
    currentLevel = document.getElementById('level-select').value;
    restartGame(); // Reset semua data
    loadLevel(currentLevel);
}

// Fungsi untuk memuat data dari level yang dipilih
function loadLevel(level) {
    const wordsList = document.getElementById('words-list');
    const synonymsList = document.getElementById('synonyms-list');

    // Hapus konten sebelumnya
    wordsList.innerHTML = '';
    synonymsList.innerHTML = '';

    // Muat kata-kata dan sinonim berdasarkan level
    levels[level].words.forEach((word, index) => {
        const li = document.createElement('li');
        li.innerText = word;
        li.setAttribute('data-index', index);
        li.addEventListener('click', function() {
            selectWord(li);  // Pilih kata saat di-klik
        });
        wordsList.appendChild(li);
    });

    levels[level].synonyms.forEach((synonym, index) => {
        const li = document.createElement('li');
        li.innerText = synonym;
        li.setAttribute('data-index', index);
        li.addEventListener('click', function() {
            selectSynonym(li);  // Pilih sinonim saat di-klik
        });
        synonymsList.appendChild(li);
    });

    // Reset koordinat
    selectedWord = null;
}

// Fungsi untuk memilih kata
function selectWord(item) {
    const rect = item.getBoundingClientRect();
    selectedWord = {
        index: item.getAttribute('data-index'),
        x: rect.right - canvas.getBoundingClientRect().left,
        y: rect.top + rect.height / 2 - canvas.getBoundingClientRect().top
    };
    highlightSelection(item);
}

// Fungsi untuk memilih sinonim
function selectSynonym(item) {
    if (selectedWord) {
        const rect = item.getBoundingClientRect();
        const synonymIndex = item.getAttribute('data-index');
        
        // Simpan garis yang telah digambar
        lines.push({
            word: selectedWord.index,
            synonym: synonymIndex,
            wordX: selectedWord.x,
            wordY: selectedWord.y,
            synonymX: rect.left - canvas.getBoundingClientRect().left,
            synonymY: rect.top + rect.height / 2 - canvas.getBoundingClientRect().top
        });

        // Gambar garis
        drawLines();
        
        // Reset pilihan kata
        selectedWord = null;
        clearHighlighting();
    }
}

// Fungsi untuk menggambar garis di canvas
function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.wordX, line.wordY);
        ctx.lineTo(line.synonymX, line.synonymY);
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Fungsi untuk menyorot kata yang dipilih
function highlightSelection(item) {
    const wordItems = document.querySelectorAll('#words-list li');
    wordItems.forEach(li => li.style.backgroundColor = '#e3e3e3');
    item.style.backgroundColor = '#cce5ff';
}

// Fungsi untuk menghapus sorotan
function clearHighlighting() {
    const wordItems = document.querySelectorAll('#words-list li');
    wordItems.forEach(li => li.style.backgroundColor = '#e3e3e3');
}

// Fungsi untuk mengecek jawaban
function checkAnswers() {
    const correctPairs = levels[currentLevel].correctPairs;
    
    let correctCount = 0;

    lines.forEach(line => {
        correctPairs.forEach(pair => {
            if (line.word == pair.word && line.synonym == pair.synonym) {
                correctCount++;
            }
        });
    });

    const result = document.getElementById('result');
    
    if (correctCount === correctPairs.length) {
        result.innerHTML = "Semua jawaban benar!";
        result.style.color = "green";
    } else {
        result.innerHTML = "Beberapa jawaban salah, coba lagi.";
        result.style.color = "red";
    }
}

// Fungsi untuk mengatur ulang game ke keadaan awal
function restartGame() {
    // Hapus semua garis di canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Kosongkan array yang menyimpan garis yang telah dibuat
    lines = [];

    // Hapus sorotan pada semua kata
    clearHighlighting();

    // Kosongkan hasil
    const result = document.getElementById('result');
    result.innerHTML = '';

    // Atur selectedWord kembali ke null
    selectedWord = null;
}

// Muat level pertama saat halaman dibuka
window.onload = function() {
    loadLevel(currentLevel);
};
