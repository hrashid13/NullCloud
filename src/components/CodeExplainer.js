import React, { useState } from 'react';
import './CodeExplainer.css';

function CodeExplainer() {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('codellama:latest');

  const handleExplain = async () => {
    if (!code.trim()) {
      alert('Please paste some code to explain!');
      return;
    }

    setLoading(true);
    setExplanation('');

    try {
      const prompt = `Explain this code in simple terms. Break down what it does step by step:

\`\`\`
${code}
\`\`\`

Provide a clear, beginner-friendly explanation.`;

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
      
      // Check if we got a valid response
      if (!data || !data.response) {
        throw new Error('Invalid response from Ollama. Make sure the model is downloaded and Ollama is running.');
      }
      
      setExplanation(data.response.trim());
    } catch (error) {
      console.error('Error:', error);
      setExplanation(`Error: ${error.message}\n\nMake sure Ollama is running on http://localhost:11434\n\nCheck the browser console (F12) for more details.`);
    }
    
    setLoading(false);
  };

  const copyExplanation = () => {
    navigator.clipboard.writeText(explanation);
    alert('Explanation copied to clipboard!');
  };

  const exampleCode = `SELECT c.name, SUM(o.total) as revenue
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2024-10-01'
GROUP BY c.customer_id, c.name
HAVING SUM(o.total) > 500
ORDER BY revenue DESC;`;

  const loadExample = () => {
    setCode(exampleCode);
  };

  return (
    <div className="code-explainer">
      <div className="card">
        <h2>Code Explainer</h2>
        <p className="description">Paste any code (SQL, Python, JavaScript, etc.) and get a clear explanation!</p>

        <div className="form-group">
          <label>AI Model:</label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="select-input"
          >
            <option value="codellama:latest">CodeLlama (Best for explanations)</option>
            <option value="llama3.2:latest">Llama 3.2 (Fastest)</option>
            <option value="deepseek-coder:6.7b-instruct">Deepseek Coder 6.7B</option>
          </select>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label>Paste your code here:</label>
            <button onClick={loadExample} className="example-btn">
              Load Example
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste any code here (SQL, Python, JavaScript, etc.)..."
            rows={12}
            className="code-input"
          />
        </div>

        <button 
          onClick={handleExplain}
          disabled={loading || !code.trim()}
          className="explain-btn"
        >
          {loading ? 'Explaining...' : 'Explain Code'}
        </button>

        {explanation && (
          <div className="result-section">
            <div className="result-header">
              <h3>Explanation:</h3>
              <button onClick={copyExplanation} className="copy-btn">
                Copy
              </button>
            </div>
            <div className="explanation-output">
              {explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeExplainer;