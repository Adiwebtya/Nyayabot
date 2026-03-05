# Interviewer Guide: NyayaBot ⚖️

If an interviewer asks you about **NyayaBot**, here is how you should explain it to demonstrate your technical depth and problem-solving skills.

---

## 1. The Elevator Pitch
"NyayaBot is an AI-powered legal assistance tool designed to bridge the gap between victims and legal help in India. It simplifies complex legal jargon, identifies crimes from natural language (including Hinglish), and generates formal FIR drafts to empower users during the reporting process."

## 2. The Core Problem
Most people in India are unaware of their specific rights or the exact legal sections (BNS/IT Act) that apply to them. Reporting a crime is often intimidating. NyayaBot solves this by providing:
- **Instant Clarity**: Translating an incident into legal sections.
- **Supportive UX**: A WhatsApp-style interface that feels familiar and safe.
- **Actionable Output**: A ready-to-use FIR draft and local help resources.

## 3. Technical Architecture & Challenges

### **The Legal Engine (Heuristic NLP)**
- **How it works**: I built a custom rule-based engine in JavaScript (`legalEngine.js`) that uses keyword mapping and pattern matching to classify incidents.
- **Multilingual Support**: It handles **English, Hindi, and Hinglish**. 
    - *Challenge*: Detecting Hinglish ("Mera phone chori ho gaya") required a robust keyword map that accounts for common phonetic spellings.
- **Safety First**: Implemented an "Urgent Detection" layer that triggers immediate emergency prompts if keywords like "threat", "kill", or "khatra" are detected.

### **UI/UX Design**
- **Framework**: Built with **React + Vite** for a fast, responsive experience.
- **Design Language**: Followed a **Dark WhatsApp Theme** using CSS variables for a premium, familiar feel. I used a deep teal and dark grey palette to maintain a serious yet supportive tone.

## 4. Key Features to Highlight

- **FIR Draft Generator**: "I implemented a logic that extracts victim/offender details and generates a formal complaint. This saves the user from the 'blank page' problem when they go to a police station."
- **Nearby Help Finder**: "By providing a city, the bot points users to specific local police stations and portals (like cybercrime.gov.in), making the advice localized and practical."
- **Crime Awareness Mode**: "It’s not just for victims; it's an educational tool. Users can ask 'What is the punishment for theft?' and get a simplified breakdown of the law."

## 5. Potential Follow-up Questions & Answers

**Q: Why did you use a rule-based engine instead of a Large Language Model (LLM)?**
*Answer*: "For legal advice, accuracy and control are paramount. A rule-based engine ensures that the bot doesn't 'hallucinate' or give incorrect legal sections. However, in a production version, I would use a RAG (Retrieval-Augmented Generation) setup with an LLM to handle more complex nuances while keeping the legal data grounded in verified sources."

**Q: How did you handle data privacy?**
*Answer*: "The front-end ensures that data remains in the session. I added privacy alerts to remind users that while the tool provides guidance, it is not a substitute for a lawyer."

---

## 6. Closing Statement
"I built NyayaBot from scratch—from the UI design to the logic engine. It taught me how to handle complex data mapping, manage state in React, and most importantly, how to build technology with empathy for the end-user."
