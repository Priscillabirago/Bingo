# 🎯 Bingo Master

A modern, interactive web-based Bingo game built with Python Flask and vanilla JavaScript. Experience the classic game of Bingo with a beautiful, responsive interface!

![Bingo Master](https://img.shields.io/badge/Game-Bingo%20Master-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![Flask](https://img.shields.io/badge/Flask-2.3.3-red)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## ✨ Features

- 🎲 **Random Bingo Card Generation** - Each card follows traditional BINGO column rules (B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75)
- 🔊 **Automatic Number Calling** - Numbers are called randomly from 1-75
- 🎯 **Win Detection** - Automatically detects wins for rows, columns, and diagonals
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** - Beautiful gradients, animations, and interactive elements
- ⌨️ **Keyboard Shortcuts** - Space to call numbers, 'N' for new card, 'S' for new game
- 🎉 **Win Celebrations** - Animated win notifications and modals

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Bingo.git
   cd Bingo
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to start playing!

## 🎮 How to Play

1. **Start a New Game** - Click "Start New Game" to begin
2. **Call Numbers** - Click "Call Number" or press Space to call the next random number
3. **Mark Your Card** - Click on called numbers on your bingo card to mark them
4. **Win!** - Get 5 in a row (horizontal, vertical, or diagonal) to win
5. **New Card** - Generate a new random card anytime with "New Card"

## 🛠️ Technology Stack

- **Backend**: Python 3.8+, Flask 2.3.3
- **Frontend**: HTML5, CSS3 (with CSS Grid & Flexbox), Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with gradients, animations, and responsive design
- **Fonts**: Google Fonts (Poppins)
- **Icons**: Font Awesome 6.4.0

## 📁 Project Structure

```
Bingo/
├── app.py                 # Flask application and game logic
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── PS-BINGO.py          # Original simple bingo validator (legacy)
├── templates/           # HTML templates
│   ├── base.html        # Base template with navigation
│   ├── index.html       # Landing page
│   └── play.html        # Game interface
└── static/             # Static assets
    ├── css/
    │   └── style.css    # Main stylesheet
    └── js/
        ├── main.js      # Common JavaScript functions
        └── game.js      # Game-specific JavaScript
```

## 🎯 Game Rules

- **Traditional Bingo**: Get 5 numbers in a row, column, or diagonal
- **Free Space**: The center square is automatically marked
- **Number Ranges**: 
  - B: 1-15
  - I: 16-30  
  - N: 31-45
  - G: 46-60
  - O: 61-75

## 🔧 API Endpoints

- `GET /` - Landing page
- `GET /play` - Game interface
- `POST /api/start_game` - Start a new game
- `POST /api/call_number` - Call the next number
- `POST /api/mark_square` - Mark/unmark a square
- `POST /api/new_card` - Generate a new bingo card
- `GET /api/game_status` - Get current game status

## 🎨 Customization

The game features a modern design with:
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Responsive grid layouts
- Interactive hover effects
- Custom color schemes

You can easily customize colors, fonts, and animations by modifying the CSS variables in `static/css/style.css`.

## 🚧 Development

This project evolved from a simple Python function to validate bingo wins into a full-featured web application. The original logic has been completely rewritten and enhanced with:

- Proper game state management
- Session handling for multiple players
- Real-time UI updates
- Error handling and user feedback
- Modern web development practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Original concept from a beginner Python exercise
- Inspired by traditional Bingo hall games
- Built with modern web technologies for an enhanced user experience

---

**Enjoy playing Bingo Master! 🎉**
