import React, { useState } from 'react';
import './App.css';
import SQLBuilder from './components/SQLBuilder';
import CodeExplainer from './components/CodeExplainer';
import CodeCreator from './components/CodeCreator';

function App() {
  const [activeTab, setActiveTab] = useState('sql');

  return (
    <div className="App">
      <header className="App-header">
        <h1>NullCloud - Your Local AI Coding Assistant</h1>
        <p className="subtitle">Powered by Ollama - 100% Private & Local</p>
      </header>

      <nav className="tab-nav">
        <button 
          className={activeTab === 'sql' ? 'active' : ''}
          onClick={() => setActiveTab('sql')}
        >
          SQL Builder
        </button>
        <button 
          className={activeTab === 'creator' ? 'active' : ''}
          onClick={() => setActiveTab('creator')}
        >
          Code Creator
        </button>
        <button 
          className={activeTab === 'explainer' ? 'active' : ''}
          onClick={() => setActiveTab('explainer')}
        >
          Code Explainer
        </button>
      </nav>

      <main className="content">
        {activeTab === 'sql' && <SQLBuilder />}
        {activeTab === 'creator' && <CodeCreator />}
        {activeTab === 'explainer' && <CodeExplainer />}
      </main>

      <footer className="App-footer">
        <p>Running locally on your machine • No data sent to cloud</p>
      </footer>
    </div>
  );
}

export default App;