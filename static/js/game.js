// Game-specific JavaScript functionality

// Game state
let hasWon = false;
let currentTutorialStep = 1;
let lastCalledNumber = null;
let gameActive = false;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    // Show tutorial for first-time users
    if (!localStorage.getItem('bingo_tutorial_seen')) {
        showTutorial();
    }
    
    // Update UI based on game state
    updateGameButtons();
    updateGameStatus();
    updateHints();
    
    // Start periodic game status updates
    if (gameActive) {
        startGameStatusUpdates();
    }
}

function setupEventListeners() {
    // Start game button
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', startNewGame);
    }
    
    // Call number button
    const callNumberBtn = document.getElementById('callNumberBtn');
    if (callNumberBtn) {
        callNumberBtn.addEventListener('click', callNextNumber);
    }
    
    // New card button
    const newCardBtn = document.getElementById('newCardBtn');
    if (newCardBtn) {
        newCardBtn.addEventListener('click', generateNewCard);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(event) {
    if (event.code === 'Space' && gameActive) {
        event.preventDefault();
        callNextNumber();
    } else if (event.code === 'KeyN') {
        event.preventDefault();
        generateNewCard();
    } else if (event.code === 'KeyS') {
        event.preventDefault();
        startNewGame();
    }
}

async function startNewGame() {
    const button = document.getElementById('startGameBtn');
    setButtonLoading(button, true);
    
    try {
        const response = await apiCall('/api/start_game', {
            method: 'POST'
        });
        
        if (response.success) {
            showMessage('New game started! Good luck!', 'success');
            gameActive = true;
            hasWon = false;
            lastCalledNumber = null;
            
            // Reset UI
            document.getElementById('currentLetter').textContent = '-';
            document.getElementById('currentNumber').textContent = '-';
            document.getElementById('totalCalled').textContent = '0';
            
            // Clear called numbers display
            clearCalledNumbersDisplay();
            
            // Update button states and status
            updateGameButtons();
            updateGameStatus();
            updateHints();
            
            // Start status updates
            startGameStatusUpdates();
        }
    } catch (error) {
        console.error('Failed to start new game:', error);
        showMessage('Failed to start new game', 'error');
    } finally {
        setButtonLoading(button, false);
    }
}

async function callNextNumber() {
    if (!gameActive || hasWon) return;
    
    const button = document.getElementById('callNumberBtn');
    setButtonLoading(button, true);
    
    try {
        const response = await apiCall('/api/call_number', {
            method: 'POST'
        });
        
        if (response.success) {
            lastCalledNumber = response.number;
            
            // Update current call display
            document.getElementById('currentLetter').textContent = response.letter;
            document.getElementById('currentNumber').textContent = response.number;
            
            // Update called numbers display
            updateCalledNumbersDisplay(response.called_numbers);
            
            // Update total count
            document.getElementById('totalCalled').textContent = response.called_numbers.length;
            
            // Highlight the called number on the card
            highlightCalledNumber(response.number);
            
            // Suggest auto-mark (visual hint)
            suggestAutoMark(response.number);
            
            // Animate the new number
            animateNewNumber(response.letter, response.number);
            
            // Update status and hints
            updateGameStatus();
            updateHints();
            
            showMessage(`${response.letter}-${response.number} called!`, 'success');
        } else {
            showMessage(response.message || 'No more numbers to call', 'error');
            gameActive = false;
            updateGameButtons();
        }
    } catch (error) {
        console.error('Failed to call number:', error);
        showMessage('Failed to call number', 'error');
    } finally {
        setButtonLoading(button, false);
    }
}

async function markSquare(row, col) {
    if (hasWon) return;
    
    try {
        const response = await apiCall('/api/mark_square', {
            method: 'POST',
            body: JSON.stringify({ row: row, col: col })
        });
        
        if (response.success) {
            // Update the visual state of the square
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                if (response.marked[row][col]) {
                    cell.classList.add('marked');
                    // Add a little animation
                    cell.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        cell.style.transform = '';
                    }, 200);
                } else {
                    cell.classList.remove('marked');
                }
            }
            
            // Check for bingo
            if (response.has_bingo) {
                hasWon = true;
                showWinModal(response.winning_pattern);
                showMessage('BINGO! Congratulations!', 'success');
                updateGameStatus();
                updateHints();
            }
        }
    } catch (error) {
        console.error('Failed to mark square:', error);
        showMessage('Failed to mark square', 'error');
    }
}

async function generateNewCard() {
    const button = document.getElementById('newCardBtn');
    setButtonLoading(button, true);
    
    try {
        const response = await apiCall('/api/new_card', {
            method: 'POST'
        });
        
        if (response.success) {
            // Reload the page to show the new card
            location.reload();
        }
    } catch (error) {
        console.error('Failed to generate new card:', error);
        showMessage('Failed to generate new card', 'error');
    } finally {
        setButtonLoading(button, false);
    }
}

function updateCalledNumbersDisplay(calledNumbers) {
    // Clear all columns
    ['b', 'i', 'n', 'g', 'o'].forEach(letter => {
        const column = document.getElementById(`${letter}-numbers`);
        if (column) {
            column.innerHTML = '';
        }
    });
    
    // Add numbers to appropriate columns
    calledNumbers.forEach(number => {
        let columnId;
        if (number <= 15) columnId = 'b-numbers';
        else if (number <= 30) columnId = 'i-numbers';
        else if (number <= 45) columnId = 'n-numbers';
        else if (number <= 60) columnId = 'g-numbers';
        else columnId = 'o-numbers';
        
        const column = document.getElementById(columnId);
        if (column) {
            const numberEl = document.createElement('div');
            numberEl.className = 'called-number';
            numberEl.textContent = number;
            column.appendChild(numberEl);
        }
    });
}

function clearCalledNumbersDisplay() {
    ['b', 'i', 'n', 'g', 'o'].forEach(letter => {
        const column = document.getElementById(`${letter}-numbers`);
        if (column) {
            column.innerHTML = '';
        }
    });
}

function animateNewNumber(letter, number) {
    // Create a temporary animated element
    const animEl = document.createElement('div');
    animEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        font-weight: bold;
        color: #667eea;
        z-index: 1000;
        pointer-events: none;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    `;
    animEl.textContent = `${letter}-${number}`;
    
    document.body.appendChild(animEl);
    
    // Animate and remove
    setTimeout(() => {
        animEl.style.transition = 'all 1s ease-out';
        animEl.style.opacity = '0';
        animEl.style.transform = 'translate(-50%, -50%) scale(1.5)';
        
        setTimeout(() => {
            if (animEl.parentNode) {
                animEl.parentNode.removeChild(animEl);
            }
        }, 1000);
    }, 500);
}

function updateGameButtons() {
    const callNumberBtn = document.getElementById('callNumberBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    
    if (callNumberBtn) {
        callNumberBtn.disabled = !gameActive || hasWon;
    }
    
    if (startGameBtn) {
        startGameBtn.textContent = gameActive ? 'Restart Game' : 'Start New Game';
    }
}

function showWinModal(winningPattern) {
    const modal = document.getElementById('winModal');
    const patternEl = document.getElementById('winningPattern');
    
    if (modal && patternEl) {
        patternEl.textContent = winningPattern;
        modal.style.display = 'block';
        
        // Add celebration animation
        document.body.style.animation = 'celebration 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
}

function closeWinModal() {
    const modal = document.getElementById('winModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Click outside modal to close
window.addEventListener('click', function(event) {
    const modal = document.getElementById('winModal');
    if (event.target === modal) {
        closeWinModal();
    }
});

// Periodic game status updates
let statusInterval;

function startGameStatusUpdates() {
    if (statusInterval) {
        clearInterval(statusInterval);
    }
    
    statusInterval = setInterval(async () => {
        try {
            const response = await fetch('/api/game_status');
            const status = await response.json();
            
            // Update UI if needed
            if (status.game_active !== gameActive) {
                gameActive = status.game_active;
                updateGameButtons();
            }
            
            // Stop updates if game is not active
            if (!status.game_active) {
                clearInterval(statusInterval);
                statusInterval = null;
            }
        } catch (error) {
            console.error('Failed to get game status:', error);
        }
    }, 5000); // Update every 5 seconds
}

// Add celebration CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes celebration {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.02); }
        50% { transform: scale(1.01); }
        75% { transform: scale(1.02); }
    }
`;
document.head.appendChild(style);

// Tutorial Functions
function showTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        currentTutorialStep = 1;
        updateTutorialStep();
    }
}

function closeTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    const dontShowAgain = document.getElementById('dontShowAgain');
    
    if (overlay) {
        overlay.classList.add('hidden');
    }
    
    if (dontShowAgain?.checked) {
        localStorage.setItem('bingo_tutorial_seen', 'true');
    }
}

function nextTutorialStep() {
    if (currentTutorialStep < 4) {
        currentTutorialStep++;
        updateTutorialStep();
    } else {
        closeTutorial();
    }
}

function previousTutorialStep() {
    if (currentTutorialStep > 1) {
        currentTutorialStep--;
        updateTutorialStep();
    }
}

function goToTutorialStep(step) {
    currentTutorialStep = step;
    updateTutorialStep();
}

function updateTutorialStep() {
    // Update step content
    document.querySelectorAll('.tutorial-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const currentStep = document.querySelector(`[data-step="${currentTutorialStep}"]`);
    if (currentStep) {
        currentStep.classList.add('active');
    }
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentTutorialStep);
    });
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentTutorialStep === 1;
    }
    
    if (nextBtn) {
        nextBtn.innerHTML = currentTutorialStep === 4 ? 
            'Start Playing <i class="fas fa-play"></i>' : 
            'Next <i class="fas fa-arrow-right"></i>';
    }
}

// Enhanced Game Status Updates
function updateGameStatus() {
    const statusText = document.getElementById('statusText');
    const numbersCalledCount = document.getElementById('numbersCalledCount');
    
    if (statusText) {
        if (hasWon) {
            statusText.textContent = 'BINGO! You Won!';
            statusText.style.color = '#4ecdc4';
        } else if (gameActive) {
            statusText.textContent = 'Game Active';
            statusText.style.color = '#667eea';
        } else {
            statusText.textContent = 'Ready to Start';
            statusText.style.color = '#666';
        }
    }
    
    if (numbersCalledCount) {
        const calledCount = document.querySelectorAll('.called-number').length;
        numbersCalledCount.textContent = `${calledCount}/75`;
    }
}

// Smart Hints System
function updateHints() {
    const hintElement = document.getElementById('currentHint');
    if (!hintElement) return;
    
    const hintIcon = hintElement.querySelector('i');
    const hintText = hintElement.querySelector('span');
    
    if (hasWon) {
        hintIcon.className = 'fas fa-trophy';
        hintText.textContent = 'Congratulations! You won! Start a new game to play again.';
    } else if (!gameActive) {
        hintIcon.className = 'fas fa-play';
        hintText.textContent = 'Click "Start New Game" to begin playing!';
    } else if (lastCalledNumber) {
        hintIcon.className = 'fas fa-hand-pointer';
        hintText.textContent = `Look for ${lastCalledNumber} on your card and click it if you have it!`;
    } else {
        hintIcon.className = 'fas fa-bullhorn';
        hintText.textContent = 'Click "Call Number" to draw the next number!';
    }
}

// Enhanced Number Highlighting
function highlightCalledNumber(number) {
    // Remove previous highlights
    document.querySelectorAll('.bingo-cell').forEach(cell => {
        cell.classList.remove('highlighted', 'just-called');
    });
    
    // Find and highlight the called number
    const cells = document.querySelectorAll('.bingo-cell');
    cells.forEach(cell => {
        const cellNumber = parseInt(cell.textContent);
        if (cellNumber === number) {
            cell.classList.add('highlighted', 'just-called');
            
            // Scroll the number into view if needed
            cell.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        }
    });
    
    // Remove highlight after animation
    setTimeout(() => {
        document.querySelectorAll('.just-called').forEach(cell => {
            cell.classList.remove('just-called');
        });
    }, 2000);
}

// Auto-mark functionality (optional helper)
function suggestAutoMark(number) {
    const cells = document.querySelectorAll('.bingo-cell');
    cells.forEach(cell => {
        const cellNumber = parseInt(cell.textContent);
        if (cellNumber === number && !cell.classList.contains('marked')) {
            // Add a subtle suggestion animation
            cell.style.boxShadow = '0 0 15px rgba(254, 202, 87, 0.8)';
            setTimeout(() => {
                cell.style.boxShadow = '';
            }, 3000);
        }
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (statusInterval) {
        clearInterval(statusInterval);
    }
});
