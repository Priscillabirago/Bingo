from flask import Flask, render_template, request, jsonify, session
import random
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

class BingoGame:
    def __init__(self):
        self.called_numbers = []
        self.current_number = None
        self.game_active = False
        self.players = {}
    
    def generate_bingo_card(self):
        """Generate a random bingo card with proper column ranges"""
        card = []
        
        # B column: 1-15, I column: 16-30, N column: 31-45, G column: 46-60, O column: 61-75
        ranges = [(1, 15), (16, 30), (31, 45), (46, 60), (61, 75)]
        
        for row in range(5):
            card_row = []
            for col in range(5):
                # Free space in the middle
                if row == 2 and col == 2:
                    card_row.append('FREE')
                else:
                    start, end = ranges[col]
                    # Ensure no duplicates in the same column
                    available_numbers = [n for n in range(start, end + 1)]
                    # Remove numbers already used in this column
                    for r in range(row):
                        if len(card) > r and card[r][col] != 'FREE':
                            if card[r][col] in available_numbers:
                                available_numbers.remove(card[r][col])
                    
                    number = random.choice(available_numbers)
                    card_row.append(number)
            card.append(card_row)
        
        return card
    
    def call_next_number(self):
        """Call the next random number that hasn't been called yet"""
        if not self.game_active:
            return None
            
        available_numbers = [i for i in range(1, 76) if i not in self.called_numbers]
        
        if not available_numbers:
            return None  # All numbers have been called
            
        number = random.choice(available_numbers)
        self.called_numbers.append(number)
        self.current_number = number
        return number
    
    def get_letter_for_number(self, number):
        """Get the BINGO letter for a given number"""
        if 1 <= number <= 15:
            return 'B'
        elif 16 <= number <= 30:
            return 'I'
        elif 31 <= number <= 45:
            return 'N'
        elif 46 <= number <= 60:
            return 'G'
        elif 61 <= number <= 75:
            return 'O'
        return ''
    
    def check_bingo(self, card, marked):
        """Check if a bingo card has a winning pattern"""
        # Check rows
        for row in range(5):
            if all(marked[row][col] for col in range(5)):
                return True, f"Row {row + 1}"
        
        # Check columns
        for col in range(5):
            if all(marked[row][col] for row in range(5)):
                column_letters = ['B', 'I', 'N', 'G', 'O']
                return True, f"Column {column_letters[col]}"
        
        # Check diagonal (top-left to bottom-right)
        if all(marked[i][i] for i in range(5)):
            return True, "Diagonal (top-left to bottom-right)"
        
        # Check diagonal (top-right to bottom-left)
        if all(marked[i][4-i] for i in range(5)):
            return True, "Diagonal (top-right to bottom-left)"
        
        return False, ""
    
    def start_game(self):
        """Start a new game"""
        self.called_numbers = []
        self.current_number = None
        self.game_active = True
        self.players = {}
    
    def end_game(self):
        """End the current game"""
        self.game_active = False

# Global game instance
game = BingoGame()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play')
def play():
    # Generate a new bingo card for this session
    if 'player_id' not in session:
        session['player_id'] = str(uuid.uuid4())
    
    if 'bingo_card' not in session:
        session['bingo_card'] = game.generate_bingo_card()
        # Initialize marked squares (FREE space is automatically marked)
        marked = [[False for _ in range(5)] for _ in range(5)]
        marked[2][2] = True  # FREE space
        session['marked'] = marked
    
    return render_template('play.html', 
                         bingo_card=session['bingo_card'],
                         marked=session['marked'],
                         called_numbers=game.called_numbers,
                         current_number=game.current_number,
                         game_active=game.game_active)

@app.route('/api/start_game', methods=['POST'])
def start_game():
    game.start_game()
    return jsonify({'success': True, 'message': 'New game started!'})

@app.route('/api/call_number', methods=['POST'])
def call_number():
    number = game.call_next_number()
    if number:
        letter = game.get_letter_for_number(number)
        return jsonify({
            'success': True, 
            'number': number,
            'letter': letter,
            'called_numbers': game.called_numbers
        })
    else:
        return jsonify({'success': False, 'message': 'No more numbers to call'})

@app.route('/api/mark_square', methods=['POST'])
def mark_square():
    data = request.get_json()
    row = data.get('row')
    col = data.get('col')
    
    if 'marked' not in session:
        return jsonify({'success': False, 'message': 'No game session found'})
    
    # Toggle the marked state
    session['marked'][row][col] = not session['marked'][row][col]
    session.modified = True
    
    # Check for bingo
    has_bingo, pattern = game.check_bingo(session['bingo_card'], session['marked'])
    
    return jsonify({
        'success': True,
        'marked': session['marked'],
        'has_bingo': has_bingo,
        'winning_pattern': pattern
    })

@app.route('/api/new_card', methods=['POST'])
def new_card():
    session['bingo_card'] = game.generate_bingo_card()
    marked = [[False for _ in range(5)] for _ in range(5)]
    marked[2][2] = True  # FREE space
    session['marked'] = marked
    session.modified = True
    
    return jsonify({
        'success': True,
        'bingo_card': session['bingo_card'],
        'marked': session['marked']
    })

@app.route('/api/game_status')
def game_status():
    return jsonify({
        'game_active': game.game_active,
        'called_numbers': game.called_numbers,
        'current_number': game.current_number,
        'total_called': len(game.called_numbers)
    })

if __name__ == '__main__':
    app.run(debug=True)
