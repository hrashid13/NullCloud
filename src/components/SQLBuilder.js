import React, { useState, useEffect, useRef } from 'react';
import './SQLBuilder.css';

const STORAGE_KEY = 'nullcloud_schemas';

function SQLBuilder() {
  const [schemas, setSchemas] = useState({});
  const [selectedSchema, setSelectedSchema] = useState('');
  const [description, setDescription] = useState('');
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('codellama:latest');
  const [dbType, setDbType] = useState('PostgreSQL');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  // Load schemas from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSchemas(parsed);
        const keys = Object.keys(parsed);
        if (keys.length > 0) setSelectedSchema(keys[0]);
      }
    } catch (e) {
      console.error('Failed to load schemas:', e);
    }
  }, []);

  // Save schemas to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(schemas).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schemas));
    }
  }, [schemas]);

  const handleAddSchema = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const name = file.name.replace(/\.(sql|txt)$/i, '');
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      const updatedSchemas = { ...schemas, [name]: content };
      setSchemas(updatedSchemas);
      setSelectedSchema(name);
    };

    reader.readAsText(file);
    // Reset input so same file can be re-added if needed
    e.target.value = '';
  };

  const handleDeleteSchema = (name) => {
    if (deleteConfirm === name) {
      const updated = { ...schemas };
      delete updated[name];
      setSchemas(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const remaining = Object.keys(updated);
      setSelectedSchema(remaining.length > 0 ? remaining[0] : '');
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(name);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('Please describe what SQL query you need!');
      return;
    }
    if (!selectedSchema || !schemas[selectedSchema]) {
      alert('Please add a schema first using the Add Schema button.');
      return;
    }

    setLoading(true);
    setGeneratedSQL('');

    try {
      const prompt = `You are generating SQL for ${dbType}. Use ${dbType}-specific syntax.

Given this database schema:

${schemas[selectedSchema]}

Task: ${description}

Generate ONLY the SQL query optimized for ${dbType}, nothing else. Make it well-formatted and use ${dbType}-specific features where appropriate.`;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (!data || !data.response) {
        throw new Error('Invalid response from Ollama. Make sure the model is downloaded and Ollama is running.');
      }

      let sql = data.response.trim();
      sql = sql.replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
      setGeneratedSQL(sql);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedSQL(`Error: ${error.message}\n\nMake sure Ollama is running on http://localhost:11434`);
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSQL);
    alert('Copied to clipboard!');
  };

  const schemaKeys = Object.keys(schemas);
  const hasSchemas = schemaKeys.length > 0;

  return (
    <div className="sql-builder">
      <div className="card">
        <div className="card-title-row">
          <div>
            <h2>SQL Query Builder</h2>
            <p className="description">Describe what you need in plain English, and AI will write the SQL for you!</p>
          </div>
          <button className="add-schema-btn" onClick={() => fileInputRef.current.click()}>
            + Add Schema
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".sql,.txt"
            onChange={handleAddSchema}
            style={{ display: 'none' }}
          />
        </div>

        {!hasSchemas ? (
          <div className="no-schema-placeholder">
            <div className="placeholder-icon"></div>
            <h3>No schemas added yet</h3>
            <p>Click <strong>+ Add Schema</strong> to upload a <code>.sql</code> file and get started.</p>
            <button className="add-schema-btn-large" onClick={() => fileInputRef.current.click()}>
              + Add Your First Schema
            </button>
          </div>
        ) : (
          <>
            <div className="form-group">
              <div className="schema-select-row">
                <label>Database Schema:</label>
                <div className="schema-controls">
                  <select
                    value={selectedSchema}
                    onChange={(e) => setSelectedSchema(e.target.value)}
                    className="select-input"
                  >
                    {schemaKeys.map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <button
                    className={`delete-schema-btn ${deleteConfirm === selectedSchema ? 'confirm' : ''}`}
                    onClick={() => handleDeleteSchema(selectedSchema)}
                    title={deleteConfirm === selectedSchema ? 'Click again to confirm delete' : 'Delete this schema'}
                  >
                    {deleteConfirm === selectedSchema ? 'Confirm?' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Database Type:</label>
              <select
                value={dbType}
                onChange={(e) => setDbType(e.target.value)}
                className="select-input"
              >
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="SQL Server">SQL Server (SSMS)</option>
                <option value="MySQL">MySQL</option>
                <option value="Oracle">Oracle</option>
                <option value="SQLite">SQLite</option>
              </select>
            </div>

            <div className="form-group">
              <label>AI Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="select-input"
              >
                <option value="codellama:latest">CodeLlama (Best for SQL)</option>
                <option value="deepseek-coder:6.7b-instruct">Deepseek Coder 6.7B</option>
                <option value="llama3.2:latest">Llama 3.2 (Fastest)</option>
              </select>
            </div>

            <div className="form-group">
              <label>What do you need? (Describe in plain English)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Find all customers who spent more than $500 in Q4 2024..."
                rows={4}
                className="textarea-input"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !description.trim()}
              className="generate-btn"
            >
              {loading ? 'Generating...' : 'Generate SQL'}
            </button>

            {generatedSQL && (
              <div className="result-section">
                <div className="result-header">
                  <h3>Generated Query:</h3>
                  <button onClick={copyToClipboard} className="copy-btn">Copy</button>
                </div>
                <pre className="sql-output">
                  <code>{generatedSQL}</code>
                </pre>
              </div>
            )}

            <div className="schema-preview">
              <details>
                <summary>View Current Schema</summary>
                <pre className="schema-code">{schemas[selectedSchema]}</pre>
              </details>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SQLBuilder;
