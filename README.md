# NyayaBot ⚖️ | Legal Help Assistant

**NyayaBot** is a supportive, AI-powered chatbot designed to help victims of crimes in India understand their legal rights and take immediate action.

![NyayaBot UI](https://raw.githubusercontent.com/Adiwebtya/Nyayabot/main/public/screenshot.png) *(Note: Add your own screenshot here)*

## 🚀 Features

### 1. **Crime Classification**
Analyzes user descriptions (Theft, Cybercrime, Harassment, etc.) and maps them to the **Bharatiya Nyaya Sanhita (BNS)** and the **IT Act**.

### 2. **Formal FIR Draft Generator**
Automatically generates a copyable, formal FIR draft based on the incident details provided, suitable for submission at an Indian police station.

### 3. **Multilingual & Hinglish Support**
Understands and responds in **English, Hindi, and Hinglish** (e.g., "Mera phone kisi ne chura liya").

### 4. **Nearby Help Finder**
Suggests local police stations, cyber portals, and helpline numbers based on the user's city/location.

### 5. **Crime Awareness Mode**
Allows users to ask educational questions about laws and punishments (e.g., "What is the punishment for stalking?").

### 6. **Dark WhatsApp-Style UI**
A familiar, dark-themed interface designed to be non-intimidating and easy to navigate for users in distress.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite
- **Styling**: Vanilla CSS (Custom Hooks & Variables)
- **Logic Engine**: Custom JavaScript NLP Engine (Heuristic Pattern Matching)
- **Deployment**: GitHub Pages / Vercel

---

## 📂 Project Structure

- `src/components/Chatbot.jsx`: The main UI component handling character interactions and rendering.
- `src/lib/legalEngine.js`: The core logic engine for crime detection, language processing, and FIR generation.
- `src/components/Chatbot.css`: Premium dark mode styling and animations.

---

## 📖 How to Run Locally

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Adiwebtya/Nyayabot.git
   cd Nyayabot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

## 🛡️ Disclaimer
NyayaBot provides legal information and guidance based on available law sets. It is **not** a substitute for professional legal advice or a lawyer.

## 👤 Author
**Aditya Bagherwal**
[GitHub](https://github.com/Adiwebtya) | [LinkedIn](https://linkedin.com/in/adityabagherwal)
