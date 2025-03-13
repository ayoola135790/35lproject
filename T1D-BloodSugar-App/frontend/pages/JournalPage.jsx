import React, { useState } from "react";
import "../styles/JournalPage.css";

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState("");

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      setEntries([...entries, newEntry]);
      setNewEntry("");
    }
  };

  return (
    <div className="journal-page">
      <div className="journal-container">
        <h1>Journal</h1>
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Add your notes here..."
        />
        <button onClick={handleAddEntry}>Add Entry</button>
        <div className="entries">
          {entries.map((entry, index) => (
            <div key={index} className="entry">
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
