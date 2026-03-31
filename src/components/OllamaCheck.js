import React, { useState, useEffect } from 'react';
import './OllamaCheck.css';

function OllamaCheck({ onReady }) {
  const [status, setStatus] = useState('checking'); // checking | missing | noModels | ready
  const [models, setModels] = useState([]);

  const checkOllama = async () => {
    setStatus('checking');
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response.ok) throw new Error('not running');
      const data = await response.json();
      const availableModels = data.models || [];
      setModels(availableModels);
      if (availableModels.length === 0) {
        setStatus('noModels');
      } else {
        setStatus('ready');
        onReady();
      }
    } catch {
      setStatus('missing');
    }
  };

  useEffect(() => {
    checkOllama();
  }, []);

  const openOllamaDownload = () => {
    window.open('https://ollama.com/download', '_blank');
  };

  if (status === 'checking') {
    return (
      <div className="ollama-check">
        <div className="check-card">
          <div className="spinner"></div>
          <h2>Connecting to Ollama...</h2>
          <p>Checking if Ollama is running on your machine.</p>
        </div>
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="ollama-check">
        <div className="check-card">
          <div className="status-icon error">✕</div>
          <h2>Ollama Not Detected</h2>
          <p>NullCloud requires Ollama to be installed and running on your machine.</p>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div>
                <strong>Download and install Ollama</strong>
                <p>Free and open source — runs locally on your machine.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div>
                <strong>Open a terminal and pull a model</strong>
                <code>ollama pull codellama</code>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div>
                <strong>Make sure Ollama is running</strong>
                <code>ollama serve</code>
              </div>
            </div>
          </div>
          <div className="check-actions">
            <button className="primary-btn" onClick={openOllamaDownload}>
              Download Ollama
            </button>
            <button className="secondary-btn" onClick={checkOllama}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'noModels') {
    return (
      <div className="ollama-check">
        <div className="check-card">
          <div className="status-icon warning">!</div>
          <h2>No Models Found</h2>
          <p>Ollama is running but you don't have any models installed yet.</p>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div>
                <strong>Open a terminal and run:</strong>
                <code>ollama pull codellama</code>
                <p>CodeLlama is recommended for SQL and code generation.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div>
                <strong>Wait for the download to complete, then click Try Again.</strong>
                <p>CodeLlama is around 4GB so it may take a few minutes.</p>
              </div>
            </div>
          </div>
          <div className="check-actions">
            <button className="primary-btn" onClick={checkOllama}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default OllamaCheck;
