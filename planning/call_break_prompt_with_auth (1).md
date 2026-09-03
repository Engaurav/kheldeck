
# 📄 Call Break Points Calculator – Prompt Specification  

## **Overview**
Build an application that calculates and tracks scores for the **Call Break card game**.  
The app should allow:
- Managing players.  
- Starting new games with 4 selected players.  
- Inputting calls and actual results for each of 13 rounds.  
- Calculating scores using predefined rules.  
- Storing history with filtering options.  
- User authentication (Sign up, Login, Logout) to store personal game history.  

---

## **Requirements**

### 1. Authentication
- Support **Sign up** with email and password.  
- Support **Login** and **Logout**.  
- Each user has a **separate profile** where their games and history are stored.  
- Passwords must be securely hashed before storage.  
- Session management for keeping users logged in until they log out.  

### 2. Player Management
- Maintain a list of players (persistent storage per user).  
- Ability to add, edit, and delete players.  
- On starting a new game, select 4 players from the list.  

### 3. Game Structure
- Each game has **13 rounds**.  
- UI should display a **table/grid**:  
  - **Columns** = Players.  
  - **Rows** = Rounds (1–13).  
- Each round has two steps for every player:  
  1. Input **Call** (integer 1–13).  
  2. Input **Actual Result** (integer 0–13).  

### 4. Scoring Rules
For each player per round:
1. **If result < call**  
   → Score = `-(call × 10)`  
   Example: Call = 5, Result = 4 → -50  

2. **If call ≤ result ≤ call + 2**  
   → Score = `call × 10 + (result - call)`  
   Examples:  
   - Call = 4, Result = 4 → 40  
   - Call = 4, Result = 5 → 41  
   - Call = 4, Result = 6 → 42  

3. **If result > call + 2**  
   → Score = `-(call × 10 + (result - call))`  
   Examples:  
   - Call = 4, Result = 7 → -43  
   - Call = 4, Result = 8 → -44  
   - Call = 2, Result = 3 → -23  

### 5. History & Tracking
- After each game (13 rounds completed), store:
  - Game ID  
  - Date & Time  
  - Players  
  - Round-by-round calls & results  
  - Final scores  
- Provide a **filter option by player** to see their performance across games.  
- History must be stored **per authenticated user**.  

---

## **Data Structures (Suggested)**

### User
```json
{
  "id": "user1",
  "email": "user@example.com",
  "passwordHash": "hashedPassword",
  "players": ["player1", "player2"],
  "games": ["game1", "game2"]
}
```

### Player
```json
{
  "id": "player1",
  "name": "Alice"
}
```

### Game
```json
{
  "gameId": "uuid",
  "date": "2025-09-20T10:30:00Z",
  "players": ["player1", "player2", "player3", "player4"],
  "rounds": [
    {
      "round": 1,
      "calls": {"player1": 5, "player2": 3, "player3": 7, "player4": 2},
      "results": {"player1": 6, "player2": 2, "player3": 7, "player4": 4},
      "scores": {"player1": 41, "player2": -30, "player3": 70, "player4": 42}
    }
  ],
  "finalScores": {"player1": 250, "player2": -120, "player3": 300, "player4": 190}
}
```

---

## **Technical Notes**
- This can be implemented in **any language/framework** (React, Angular, Flutter, Python, Java, etc.).  
- Ensure that score calculation logic is reusable and separated from UI code.  
- Use persistent storage (SQLite, JSON file, local DB, or cloud DB).  
- Support filtering history by player.  
- Add secure authentication (JWT, Firebase Auth, or any standard method).  
