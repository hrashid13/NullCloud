import React, { useState } from 'react';
import './SQLBuilder.css';

const schemas = {
  RecipeVault: `-- Recipe Vault Database Schema (PostgreSQL)
CREATE TABLE categories (
    categoryid SERIAL PRIMARY KEY,
    categoryname VARCHAR(50) NOT NULL
);

CREATE TABLE cuisine (
    cuisineid SERIAL PRIMARY KEY,
    cuisinetype VARCHAR(50) NOT NULL
);

CREATE TABLE ingredients (
    ingredientid SERIAL PRIMARY KEY,
    ingredientname VARCHAR(50) NOT NULL,
    categoryid INTEGER NOT NULL,
    FOREIGN KEY (categoryid) REFERENCES categories(categoryid)
);

CREATE TABLE units (
    unitid SERIAL PRIMARY KEY,
    unitname VARCHAR(20) NOT NULL,
    unitabbreviation VARCHAR(10)
);

CREATE TABLE recipes (
    recipeid SERIAL PRIMARY KEY,
    recipename VARCHAR(100) NOT NULL,
    description TEXT,
    preptime INTEGER,
    cooktime INTEGER,
    servings INTEGER,
    cuisineid INTEGER NOT NULL,
    imageurl VARCHAR(500),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdefault BOOLEAN DEFAULT false,
    FOREIGN KEY (cuisineid) REFERENCES cuisine(cuisineid)
);

CREATE TABLE instructions (
    instructionsid SERIAL PRIMARY KEY,
    stepnumber INTEGER NOT NULL,
    instructiontext TEXT NOT NULL,
    recipeid INTEGER NOT NULL,
    FOREIGN KEY (recipeid) REFERENCES recipes(recipeid)
);

CREATE TABLE recipeingredients (
    recipeingredientid SERIAL PRIMARY KEY,
    quantity NUMERIC(8,2) NOT NULL,
    notes TEXT,
    unitid INTEGER NOT NULL,
    recipeid INTEGER NOT NULL,
    ingredientid INTEGER NOT NULL,
    FOREIGN KEY (unitid) REFERENCES units(unitid),
    FOREIGN KEY (recipeid) REFERENCES recipes(recipeid),
    FOREIGN KEY (ingredientid) REFERENCES ingredients(ingredientid)
);

CREATE TABLE tags (
    tagid SERIAL PRIMARY KEY,
    tagname VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE recipetags (
    recipetagid SERIAL PRIMARY KEY,
    recipeid INTEGER NOT NULL,
    tagid INTEGER NOT NULL,
    FOREIGN KEY (recipeid) REFERENCES recipes(recipeid),
    FOREIGN KEY (tagid) REFERENCES tags(tagid)
);

CREATE TABLE users (
    userid VARCHAR(450) PRIMARY KEY,
    email VARCHAR(256) NOT NULL,
    googleid VARCHAR(255),
    displayname VARCHAR(256),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastloginat TIMESTAMP
);

CREATE TABLE userrecipes (
    userrecipeid SERIAL PRIMARY KEY,
    userid VARCHAR(450) NOT NULL,
    recipeid INTEGER NOT NULL,
    isfavorite BOOLEAN DEFAULT false,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (recipeid) REFERENCES recipes(recipeid) ON DELETE CASCADE
);

CREATE TABLE usermealplans (
    mealplanid SERIAL PRIMARY KEY,
    userid VARCHAR(450) NOT NULL,
    recipeid INTEGER NOT NULL,
    planneddate DATE NOT NULL,
    mealtype VARCHAR(20),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (recipeid) REFERENCES recipes(recipeid) ON DELETE CASCADE
);

CREATE TABLE shoppinglists (
    shoppinglistid SERIAL PRIMARY KEY,
    userid VARCHAR(450) NOT NULL,
    listname VARCHAR(100),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);

CREATE TABLE shoppinglistitems (
    itemid SERIAL PRIMARY KEY,
    shoppinglistid INTEGER NOT NULL,
    ingredientid INTEGER,
    itemname VARCHAR(100),
    quantity NUMERIC(8,2),
    unitid INTEGER,
    categoryid INTEGER,
    ispurchased BOOLEAN DEFAULT false,
    FOREIGN KEY (shoppinglistid) REFERENCES shoppinglists(shoppinglistid) ON DELETE CASCADE,
    FOREIGN KEY (ingredientid) REFERENCES ingredients(ingredientid),
    FOREIGN KEY (unitid) REFERENCES units(unitid),
    FOREIGN KEY (categoryid) REFERENCES categories(categoryid)
);`,

  Zoo: `-- Zoo Simulation Database Schema (SQL Server)
CREATE TABLE Habitats (
    HabitatID INT IDENTITY(1,1) PRIMARY KEY,
    HabitatName VARCHAR(100) NOT NULL,
    ClimateType VARCHAR(50) NOT NULL,
    Capacity INT NOT NULL,
    CurrentOccupancy INT DEFAULT 0,
    MaintenanceStatus VARCHAR(20) DEFAULT 'Good'
);

CREATE TABLE Animals (
    AnimalID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Species VARCHAR(100) NOT NULL,
    DateOfBirth DATE NULL,
    Gender VARCHAR(10) NOT NULL,
    HabitatID INT NOT NULL,
    DateArrived DATE NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Active',
    FOREIGN KEY (HabitatID) REFERENCES Habitats(HabitatID)
);

CREATE TABLE SimulationSessions (
    SessionID INT IDENTITY(1,1) PRIMARY KEY,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NULL,
    TotalDays INT DEFAULT 0,
    TotalVisitors INT DEFAULT 0,
    TotalRevenue DECIMAL(10,2) DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE AnimalHealth (
    HealthRecordID INT IDENTITY(1,1) PRIMARY KEY,
    AnimalID INT NOT NULL,
    Timestamp DATETIME NOT NULL,
    HealthScore INT NOT NULL CHECK (HealthScore >= 0 AND HealthScore <= 100),
    Weight DECIMAL(10,2) NULL,
    HungerLevel INT NOT NULL CHECK (HungerLevel >= 0 AND HungerLevel <= 100),
    HappinessLevel INT NOT NULL CHECK (HappinessLevel >= 0 AND HappinessLevel <= 100),
    ActivityLevel INT NOT NULL CHECK (ActivityLevel >= 0 AND ActivityLevel <= 100),
    Temperature DECIMAL(5,2) NULL,
    Notes TEXT NULL,
    SessionID INT NULL,
    FOREIGN KEY (AnimalID) REFERENCES Animals(AnimalID),
    FOREIGN KEY (SessionID) REFERENCES SimulationSessions(SessionID)
);

CREATE TABLE Staff (
    StaffID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    HireDate DATE NOT NULL,
    Salary DECIMAL(10,2) NOT NULL,
    HabitatAssignment INT NULL,
    FOREIGN KEY (HabitatAssignment) REFERENCES Habitats(HabitatID)
);

CREATE TABLE Feedings (
    FeedingID INT IDENTITY(1,1) PRIMARY KEY,
    AnimalID INT NOT NULL,
    Timestamp DATETIME NOT NULL,
    FoodType VARCHAR(100) NOT NULL,
    Quantity DECIMAL(10,2) NOT NULL,
    SessionID INT NULL,
    FOREIGN KEY (AnimalID) REFERENCES Animals(AnimalID),
    FOREIGN KEY (SessionID) REFERENCES SimulationSessions(SessionID)
);

CREATE TABLE VeterinaryVisits (
    VisitID INT IDENTITY(1,1) PRIMARY KEY,
    AnimalID INT NOT NULL,
    VetStaffID INT NOT NULL,
    Timestamp DATETIME NOT NULL,
    Reason TEXT NOT NULL,
    Treatment TEXT NULL,
    Cost DECIMAL(10,2) NULL,
    SessionID INT NULL,
    FOREIGN KEY (AnimalID) REFERENCES Animals(AnimalID),
    FOREIGN KEY (VetStaffID) REFERENCES Staff(StaffID),
    FOREIGN KEY (SessionID) REFERENCES SimulationSessions(SessionID)
);

CREATE TABLE VisitorGroups (
    GroupID INT IDENTITY(1,1) PRIMARY KEY,
    GroupSize INT NOT NULL,
    TicketType VARCHAR(50) NOT NULL,
    ArrivalTime DATETIME NOT NULL
);

CREATE TABLE Visitors (
    VisitorID INT IDENTITY(1,1) PRIMARY KEY,
    GroupID INT NULL,
    AgeCategory VARCHAR(20) NOT NULL,
    TicketPrice DECIMAL(10,2) NOT NULL,
    EntryTime DATETIME NOT NULL,
    ExitTime DATETIME NULL,
    SessionID INT NULL,
    FOREIGN KEY (GroupID) REFERENCES VisitorGroups(GroupID),
    FOREIGN KEY (SessionID) REFERENCES SimulationSessions(SessionID)
);

CREATE TABLE Locations (
    LocationID INT IDENTITY(1,1) PRIMARY KEY,
    LocationName VARCHAR(100) NOT NULL,
    LocationType VARCHAR(50) NOT NULL,
    HabitatID INT NULL,
    StaffRequired INT DEFAULT 1,
    Status VARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY (HabitatID) REFERENCES Habitats(HabitatID)
);

CREATE TABLE Sales (
    SaleID INT IDENTITY(1,1) PRIMARY KEY,
    LocationID INT NOT NULL,
    VisitorID INT NOT NULL,
    Timestamp DATETIME NOT NULL,
    ItemType VARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    SessionID INT NULL,
    FOREIGN KEY (LocationID) REFERENCES Locations(LocationID),
    FOREIGN KEY (VisitorID) REFERENCES Visitors(VisitorID),
    FOREIGN KEY (SessionID) REFERENCES SimulationSessions(SessionID)
);

CREATE TABLE ExhibitVisits (
    VisitID INT IDENTITY(1,1) PRIMARY KEY,
    HabitatID INT NOT NULL,
    Timestamp DATETIME NOT NULL,
    VisitorCount INT NOT NULL,
    AverageDwellTime INT NULL,
    SessionID INT NULL,
    FOREIGN KEY (HabitatID) REFERENCES Habitats(HabitatID),
    FOREIGN KEY (SessionID) REFERENCES SimulationSessions(SessionID)
);

CREATE TABLE DailyVisitorSummary (
    SummaryID INT IDENTITY(1,1) PRIMARY KEY,
    Date DATE NOT NULL,
    TotalVisitors INT NOT NULL,
    AdultCount INT NOT NULL,
    ChildCount INT NOT NULL,
    SeniorCount INT NOT NULL,
    MemberCount INT NOT NULL,
    TotalRevenue DECIMAL(10,2) NOT NULL,
    AverageStayDuration INT NULL,
    WeatherCondition VARCHAR(50) NULL,
    Temperature DECIMAL(5,2) NULL,
    SpecialEvent VARCHAR(200) NULL,
    SessionID INT NULL,
    FOREIGN KEY (SessionID) REFERENCES SimulationSessions(SessionID)
);

CREATE TABLE Events (
    EventID INT IDENTITY(1,1) PRIMARY KEY,
    Timestamp DATETIME NOT NULL,
    EventType VARCHAR(50) NOT NULL,
    Description TEXT NOT NULL,
    RelatedAnimalID INT NULL,
    RelatedHabitatID INT NULL,
    FOREIGN KEY (RelatedAnimalID) REFERENCES Animals(AnimalID),
    FOREIGN KEY (RelatedHabitatID) REFERENCES Habitats(HabitatID)
);`
};

function SQLBuilder() {
  const [selectedSchema, setSelectedSchema] = useState('RecipeVault');
  const [description, setDescription] = useState('');
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('codellama:latest');
  const [dbType, setDbType] = useState('PostgreSQL');

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert('Please describe what SQL query you need!');
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
      
      // Clean up the response - remove markdown code blocks if present
      let sql = data.response.trim();
      sql = sql.replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
      
      setGeneratedSQL(sql);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedSQL(`Error: ${error.message}\n\nMake sure Ollama is running on http://localhost:11434\n\nCheck the browser console (F12) for more details.`);
    }
    
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSQL);
    alert('Copied to clipboard!');
  };

  return (
    <div className="sql-builder">
      <div className="card">
        <h2>SQL Query Builder</h2>
        <p className="description">Describe what you need in plain English, and AI will write the SQL for you!</p>

        <div className="form-group">
          <label>Database Schema:</label>
          <select 
            value={selectedSchema}
            onChange={(e) => setSelectedSchema(e.target.value)}
            className="select-input"
          >
            <option value="RecipeVault">Recipe Vault (PostgreSQL)</option>
            <option value="Zoo">Zoo Simulation (SQL Server)</option>
          </select>
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
              <button onClick={copyToClipboard} className="copy-btn">
                Copy
              </button>
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
      </div>
    </div>
  );
}

export default SQLBuilder;