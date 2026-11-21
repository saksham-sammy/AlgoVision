# AlgoVision — Interactive Data Structures & Algorithms Visualizer

**AlgoVision** is a full-stack **Data Structures & Algorithms (DSA) Visualization Engine** and **C++ Reference Library**. It pairs a **Python Flask API** (`api/index.py`) serving C++ implementations (`api/cpp_source/`) with an animated step-by-step execution canvas (`index.html`, `js/main.js`) and a standalone client-side engine (`standalone_engine/`).

---

## Key Features

- **Real-Time Animated Visualizations**:
  - **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort with live color-coded comparisons, swaps, and adjustable animation speed.
  - **Searching Algorithms**: Linear Search, Iterative Binary Search, and Recursive Binary Search with interval/midpoint highlighting.
  - **Linear Data Structures**: Interactive Stack (`Push` / `Pop` LIFO animations) and Queue (`Enqueue` / `Dequeue` FIFO animations).
  - **Singly Linked Lists**: Visual node creation, pointer traversal, `Insert at Beginning`, `Insert at End`, and `Delete at Beginning`.
  - **Expression Parsing**: Step-by-step **Infix to Postfix** conversion with live operator stack state inspection.
- **Authentic C++ Source Code & Complexity Telemetry**:
  - Displays time complexity $\mathcal{O}(\cdot)$ and space complexity $\mathcal{O}(\cdot)$, structured pseudocode, algorithm theory, and syntax-highlighted C++ implementations from `api/cpp_source/`.
- **Standalone Client-Side Engine (`standalone_engine/`)**:
  - Includes a self-contained static HTML/JS DSA visualizer (`standalone_engine/index.html` & `standalone_engine/app.js`) that runs 100% in the browser without requiring a backend server.

---

## Project Structure

```text
AlgoVision/
├── api/
│   ├── index.py                # Flask serverless API serving algorithm metadata & C++ code
│   └── cpp_source/             # Complete C++ implementations (Assignments 1–8)
│       ├── ASS1/               # Linear Search, Binary Search (Iterative & Recursive)
│       ├── ASS2...ASS6.cpp     # Bubble/Selection/Insertion/Merge/Quick Sort, Stack, Queue
│       ├── ASS7/               # InfixToPostfix.cpp & InfixToPrefix.cpp
│       └── ASS8/               # Singly Linked List operations (insert, delete, traversal)
├── css/
│   └── style.css               # Glassmorphism UI & keyframe animations
├── js/
│   └── main.js                 # Visualization engine, playback controller & API client
├── standalone_engine/          # Pure client-side DSA Web Engine (index.html + app.js)
├── index.html                  # Main AlgoVision interface
├── requirements.txt            # Python dependencies (Flask, Werkzeug)
├── vercel.json                 # Vercel serverless deployment configuration
└── README.md                   # Project documentation
```

---

## Getting Started

### Running the Full-Stack Platform Locally
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the Flask server:
   ```bash
   python api/index.py
   ```
3. Visit `http://localhost:5000` in your browser.

### Running the Standalone Engine
Open `standalone_engine/index.html` directly in any browser for instant client-side visualization.