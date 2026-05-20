document.addEventListener('DOMContentLoaded', () => {
    // ---- Main Page Logic (Index and Archive combined) ----
    const sendBtn = document.getElementById('sendBtn');
    const dreamInput = document.getElementById('dreamInput');
    const dreamUsername = document.getElementById('dreamUsername');
    const archiveContainer = document.getElementById('dreamsArchiveContainer');
    const inputWindow = document.getElementById('inputWindow');

    // Load and display all dreams from localStorage
    function loadAndDisplayDreams() {
        const dreams = JSON.parse(localStorage.getItem('laizerDreams') || '[]');
        archiveContainer.innerHTML = '';
        
        dreams.forEach((dream, index) => {
            createDreamWindow(dream, index);
        });
    }

    // Create a dream window element
    function createDreamWindow(dream, index) {
        const dreamEl = document.createElement('div');
        dreamEl.className = 'window dream-window';
        
        // Random positioning
        const padding = 20;
        const maxLeft = window.innerWidth - 320; 
        const maxTop = window.innerHeight - 200; 
        
        let randomLeft = padding + Math.random() * (maxLeft > 0 ? maxLeft : 10);
        let randomTop = padding + Math.random() * (maxTop > 0 ? maxTop : 10);

        dreamEl.style.left = `${randomLeft}px`;
        dreamEl.style.top = `${randomTop}px`;
        dreamEl.style.zIndex = index + 10;

        const randomHue = Math.floor(Math.random() * 360);
        const randomColor = `hsl(${randomHue}, 70%, 40%)`;
        
        const dreamDate = new Date(dream.date);
        const formattedDate = dreamDate.toLocaleString();

        dreamEl.innerHTML = `
            <div class="title-bar" style="background: ${randomColor};">
                <div class="title-bar-text">${escapeHTML(dream.username || 'Anonymous')}</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" class="close-btn"></button>
                </div>
            </div>
            <div class="window-body">
                <p class="dream-text-content">${escapeHTML(dream.text)}</p>
                <div class="timestamp">${formattedDate}</div>
            </div>
        `;
        
        // Close button functionality
        const closeBtn = dreamEl.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            dreamEl.style.display = 'none';
        });

        // Make window draggable
        const titleBar = dreamEl.querySelector('.title-bar');
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - dreamEl.offsetLeft;
            offsetY = e.clientY - dreamEl.offsetTop;
            // Bring to front
            const allWindows = document.querySelectorAll('.dream-window');
            let maxZ = 0;
            allWindows.forEach(w => {
                if (parseInt(w.style.zIndex || 0) > maxZ) {
                    maxZ = parseInt(w.style.zIndex);
                }
            });
            dreamEl.style.zIndex = maxZ + 1;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                dreamEl.style.left = `${e.clientX - offsetX}px`;
                dreamEl.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        archiveContainer.appendChild(dreamEl);
    }

    // Send button functionality
    if (sendBtn && dreamInput && dreamUsername) {
        dreamInput.focus();

        sendBtn.addEventListener('click', () => {
            const username = dreamUsername.value.trim();
            const text = dreamInput.value.trim();
            
            if (!username || !text) {
                alert("Please enter your name and your dream.");
                return;
            }

            // Show loading simulation
            const loadingContainer = document.getElementById('loadingContainer');
            const loadingBar = document.getElementById('loadingBar');
            const sendBtnContainer = document.getElementById('sendBtnContainer');
            
            sendBtnContainer.style.display = 'none';
            loadingContainer.style.display = 'block';
            
            // Simulate loading progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Save to localStorage
                    const dreams = JSON.parse(localStorage.getItem('laizerDreams') || '[]');
                    const newDream = {
                        username: username,
                        text: text,
                        date: new Date().toISOString()
                    };
                    dreams.push(newDream);
                    localStorage.setItem('laizerDreams', JSON.stringify(dreams));
                    
                    // Reload dreams display
                    loadAndDisplayDreams();
                    
                    // Reset form
                    dreamUsername.value = '';
                    dreamInput.value = '';
                    dreamInput.focus();
                    
                    // Reset button
                    setTimeout(() => {
                        loadingContainer.style.display = 'none';
                        sendBtnContainer.style.display = 'flex';
                    }, 500);
                }
                loadingBar.style.width = `${progress}%`;
            }, 100);
        });
    }

    // Load initial dreams
    loadAndDisplayDreams();

    // Make Input Window Draggable
    if (inputWindow) {
        const inputTitleBar = inputWindow.querySelector('.title-bar');
        let isDraggingInput = false;
        let inputOffsetX = 0;
        let inputOffsetY = 0;

        inputTitleBar.addEventListener('mousedown', (e) => {
            isDraggingInput = true;
            const rect = inputWindow.getBoundingClientRect();
            inputWindow.style.transform = 'none';
            inputWindow.style.left = `${rect.left}px`;
            inputWindow.style.top = `${rect.top}px`;
            
            inputOffsetX = e.clientX - rect.left;
            inputOffsetY = e.clientY - rect.top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDraggingInput) {
                inputWindow.style.left = `${e.clientX - inputOffsetX}px`;
                inputWindow.style.top = `${e.clientY - inputOffsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDraggingInput = false;
        });
    }

    // Make Audio Player Draggable
    const audioPlayerContainer = document.getElementById('audioPlayerContainer');
    if (audioPlayerContainer) {
        const audioTitleBar = audioPlayerContainer.querySelector('.title-bar');
        let isDraggingAudio = false;
        let audioOffsetX = 0;
        let audioOffsetY = 0;

        audioTitleBar.addEventListener('mousedown', (e) => {
            isDraggingAudio = true;
            const rect = audioPlayerContainer.getBoundingClientRect();
            audioPlayerContainer.style.transform = 'none';
            audioPlayerContainer.style.left = `${rect.left}px`;
            audioPlayerContainer.style.top = `${rect.top}px`;
            
            audioOffsetX = e.clientX - rect.left;
            audioOffsetY = e.clientY - rect.top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDraggingAudio) {
                audioPlayerContainer.style.left = `${e.clientX - audioOffsetX}px`;
                audioPlayerContainer.style.top = `${e.clientY - audioOffsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDraggingAudio = false;
        });
    }

    // Audio Player Logic
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const btnPlay = document.getElementById('btnPlay');
    const btnPause = document.getElementById('btnPause');
    const btnStop = document.getElementById('btnStop');
    const progressBar = document.getElementById('range2');

    if (audioPlayer && btnPlay) {
        btnPlay.addEventListener('click', () => {
            audioPlayer.play();
        });

        btnPause.addEventListener('click', () => {
            audioPlayer.pause();
        });

        btnStop.addEventListener('click', () => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        });

        // Update progress bar
        audioPlayer.addEventListener('timeupdate', () => {
            if (audioPlayer.duration) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressBar.value = progress;
            }
        });

        // Seek functionality
        progressBar.addEventListener('input', () => {
            if (audioPlayer.duration) {
                const seekTime = (progressBar.value / 100) * audioPlayer.duration;
                audioPlayer.currentTime = seekTime;
            }
        });
    }

    // Utility function to prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }
});
