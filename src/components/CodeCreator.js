import React, { useState } from 'react';
import './CodeCreator.css';

function CodeCreator() {
  const [description, setDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('codellama:latest');
  const [language, setLanguage] = useState('Python');

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('Please describe what code you need!');
      return;
    }

    setLoading(true);
    setGeneratedCode('');

    try {
      const prompt = `Generate ${language} code for the following task:

${description}

Provide clean, well-commented, production-ready code. Include error handling where appropriate.`;

      console.log('Sending request to Ollama with model:', selectedModel);

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: prompt,
          stream: false
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data || !data.response) {
        throw new Error('Invalid response from Ollama. Make sure the model is downloaded and Ollama is running.');
      }
      
      let code = data.response.trim();
      code = code.replace(/```[\w]*\n?/g, '').replace(/```\n?/g, '').trim();
      
      setGeneratedCode(code);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedCode(`Error: ${error.message}\n\nMake sure Ollama is running on http://localhost:11434\n\nCheck the browser console (F12) for more details.`);
    }
    
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Code copied to clipboard!');
  };

  const loadExample = () => {
    setDescription('Create a Python function that reads a CSV file and calculates the average of a specified column');
    setLanguage('Python');
  };

  return (
    <div className="code-creator">
      <div className="card">
        <h2>Code Creator</h2>
        <p className="description">Describe what you need and AI will generate the code for you!</p>

        <div className="form-row">
          <div className="form-group half-width">
            <label>Programming Language:</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select-input"
            >
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Java">Java</option>
              <option value="C#">C#</option>
              <option value="C++">C++</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Ruby">Ruby</option>
              <option value="PHP">PHP</option>
            </select>
          </div>

          <div className="form-group half-width">
            <label>AI Model:</label>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="select-input"
            >
              <option value="codellama:latest">CodeLlama (Best for code generation)</option>
              <option value="deepseek-coder:6.7b-instruct">Deepseek Coder 6.7B</option>
              <option value="llama3.2:latest">Llama 3.2 (Fastest)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label>Describe what you need:</label>
            <button onClick={loadExample} className="example-btn">
              Load Example
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Create a function that connects to a PostgreSQL database and retrieves all users..."
            rows={6}
            className="textarea-input"
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !description.trim()}
          className="generate-btn"
        >
          {loading ? 'Generating...' : 'Generate Code'}
        </button>

        {generatedCode && (
          <div className="result-section">
            <div className="result-header">
              <h3>Generated Code:</h3>
              <button onClick={copyCode} className="copy-btn">
                Copy
              </button>
            </div>
            <pre className="code-output">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeCreator;
