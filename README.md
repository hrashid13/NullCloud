# NullCloud - Your Local AI Coding Assistant

> Powered by Ollama — 100% Private & Local. No API keys. No cloud. No data ever leaves your machine.


---

## Download

**[Download NullCloud Setup 0.1.0 for Windows](https://github.com/hrashid13/NullCloud/releases/latest)**

- **macOS**: Coming soon
- **Linux**: Coming soon

---

## What is NullCloud?

NullCloud is a desktop application that puts the power of local AI models directly in your development workflow. It runs on top of [Ollama](https://ollama.com/) and gives you three specialized tools:

- **SQL Builder** — Describe what you need in plain English, pick your database schema and type, and get a SQL query generated for you
- **Code Creator** — Choose a programming language, describe what you need, and generate working code
- **Code Explainer** — Paste any code (SQL, Python, JavaScript, etc.) and get a plain-English explanation

Everything runs locally on your machine. No subscriptions, no usage limits, no data sent anywhere.

---

## Prerequisites

Before running NullCloud, you need:

1. **Ollama** — [Download here](https://ollama.com/download)
2. At least one Ollama model pulled. CodeLlama is recommended:

```bash
ollama pull codellama
```

Other good options:
```bash
ollama pull llama3.2        # General purpose, fastest
ollama pull deepseek-coder  # Alternative coding model
```

Make sure Ollama is running before launching NullCloud:
```bash
ollama serve
```

---

## Installation

### Option 1: Download the Installer (Recommended)

1. Go to the [Releases](https://github.com/hrashid13/NullCloud/releases) page
2. Download `NullCloud Setup 0.1.0.exe`
3. Run the installer
4. Launch NullCloud from the desktop shortcut

> Make sure Ollama is running before opening the app.

### Option 2: Run from Source

```bash
# 1. Clone the repository
git clone https://github.com/hrashid13/NullCloud.git
cd NullCloud

# 2. Install dependencies
npm install

# 3. Make sure Ollama is running
ollama serve

# 4. Start in development mode
npm run electron-dev
```

> Node.js v18 or later is required to run from source. [Download here](https://nodejs.org/)

---

## Running in Development Mode

```bash
# Install dependencies (first time only)
npm install

# Start the React dev server and Electron together
npm run electron-dev
```

The app will open as a desktop window. Any changes you make to files in `src/` will hot-reload automatically.

---

## Building a Distributable

To build your own installer:

```bash
# Run as Administrator on Windows
npm run dist
```

The output installer will appear in the `dist/` folder.

---

## Project Structure

```
NullCloud/
├── public/           # Static assets, icon, and Electron entry HTML
├── src/              # React source code
│   ├── App.js        # Main app and tab routing
│   ├── App.css
│   ├── SQLBuilder.js       # SQL Builder tool
│   ├── CodeCreator.js      # Code Creator tool
│   └── CodeExplainer.js    # Code Explainer tool
├── electron.js       # Electron main process
├── package.json
└── README.md
```

---

## Supported Models

NullCloud works with any model you have pulled in Ollama. The following are recommended:

| Model | Best For |
|---|---|
| `codellama` | SQL generation, code creation, code explanation |
| `llama3.2` | General purpose, explanations |
| `deepseek-coder` | Code generation |
| `mistral` | General purpose |

Any model available via `ollama list` will work in the model selector inside the app.

---

## Contributing

Contributions are welcome! If you want to fix a bug, add a feature, or improve the UI, here's how:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature-name`
6. Open a Pull Request

Please keep pull requests focused — one feature or fix per PR makes review much easier.

### Ideas for contributions
- Additional tools (e.g. Regex Builder, API request generator)
- Support for custom schema imports
- Theme/appearance settings
- Conversation history
- Keyboard shortcuts

---

## Troubleshooting

**App opens but requests fail**
Make sure Ollama is running: `ollama serve`

**Model not appearing in the dropdown**
Pull the model first: `ollama pull codellama`

**Slow responses**
Response speed depends on your hardware. Smaller models (3B–7B parameters) will be faster.

**npm run dist fails on Windows**
Run the terminal as Administrator — electron-builder requires elevated permissions to build on Windows.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with [React](https://react.dev/), [Electron](https://www.electronjs.org/), and [Ollama](https://ollama.com/).

## Author

**Built by Hesham Rashid**
- Portfolio: https://www.heshamrashid.org/
- LinkedIn: https://www.linkedin.com/in/hesham-rashid/
- Email: h.f.rashid@gmail.com

Master's in AI and Business Analytics - University of South Florida