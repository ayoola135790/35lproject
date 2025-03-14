// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/JournalPage.css";

// const JournalPage = () => {
//   const [entries, setEntries] = useState([]);
//   const [newEntry, setNewEntry] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   const fetchEntries = async () => {
//     try {
//       const userId = JSON.parse(localStorage.getItem('user')).id;
//       const port = localStorage.getItem('backendPort') || 5000;
//       const response = await fetch(`http://localhost:${port}/api/journal/entries/${userId}`);
//       const data = await response.json();
//       setEntries(data);
//     } catch (error) {
//       console.error('Error fetching journal entries:', error);
//     }
//   };

//   const handleAddEntry = async () => {
//     if (!newEntry.trim()) return;

//     try {
//       const userId = JSON.parse(localStorage.getItem('user')).id;
//       const port = localStorage.getItem('backendPort') || 5000;
      
//       const response = await fetch(`http://localhost:${port}/api/journal/entries`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId,
//           content: newEntry
//         }),
//       });

//       if (response.ok) {
//         setNewEntry("");
//         fetchEntries(); // Refresh entries after adding new one
//       }
//     } catch (error) {
//       console.error('Error adding journal entry:', error);
//     }
//   };

//   const handleNavigateToGraphPage = () => {
//     navigate("/graphpage");
//   };

//   return (
//     <div className="journal-page">
//       <div className="journal-container">
//         <div className="branding" onClick={handleNavigateToGraphPage} style={{ cursor: 'pointer' }}>
//           <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
//             <path d="M50 10c-10 0-20 10-20 20 0 20 20 40 20 40s20-20 20-40c0-10-10-20-20-20z" fill="#4CAF50"/>
//             <circle cx="50" cy="30" r="3" fill="#ffffff"/>
//             <circle cx="45" cy="35" r="3" fill="#ffffff"/>
//             <circle cx="55" cy="35" r="3" fill="#ffffff"/>
//             <circle cx="50" cy="40" r="3" fill="#ffffff"/>
//             <line x1="50" y1="30" x2="45" y2="35" stroke="#ffffff" strokeWidth="2"/>
//             <line x1="50" y1="30" x2="55" y2="35" stroke="#ffffff" strokeWidth="2"/>
//             <line x1="45" y1="35" x2="50" y2="40" stroke="#ffffff" strokeWidth="2"/>
//             <line x1="55" y1="35" x2="50" y2="40" stroke="#ffffff" strokeWidth="2"/>
//           </svg>
//           <h1>GlucoLog</h1>
//         </div>
//         <h1>Journal</h1>
//         <textarea
//           value={newEntry}
//           onChange={(e) => setNewEntry(e.target.value)}
//           placeholder="Add your notes here..."
//         />
//         <button onClick={handleAddEntry}>Add Entry</button>
//         <div className="entries">
//           {entries.map((entry) => (
//             <div key={entry.id} className="entry">
//               <p>{entry.content}</p>
//               <small>{new Date(entry.created_at).toLocaleString()}</small>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JournalPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/JournalPage.css";

const JournalPage = () => {
const [entries, setEntries] = useState([]);
const [newEntry, setNewEntry] = useState("");
const navigate = useNavigate();

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      setEntries([...entries, newEntry]);
      setNewEntry("");
    }
  };

  const handleNavigateToGraphPage = () => {
    navigate("/graphpage");
  };

  return (
    <div className="journal-page">
      <div className="journal-container">
        <div className="branding" onClick={handleNavigateToGraphPage} style={{ cursor: 'pointer' }}>
          <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M50 10c-10 0-20 10-20 20 0 20 20 40 20 40s20-20 20-40c0-10-10-20-20-20z" fill="#4CAF50"/>
            <circle cx="50" cy="30" r="3" fill="#ffffff"/>
            <circle cx="45" cy="35" r="3" fill="#ffffff"/>
            <circle cx="55" cy="35" r="3" fill="#ffffff"/>
            <circle cx="50" cy="40" r="3" fill="#ffffff"/>
            <line x1="50" y1="30" x2="45" y2="35" stroke="#ffffff" strokeWidth="2"/>
            <line x1="50" y1="30" x2="55" y2="35" stroke="#ffffff" strokeWidth="2"/>
            <line x1="45" y1="35" x2="50" y2="40" stroke="#ffffff" strokeWidth="2"/>
            <line x1="55" y1="35" x2="50" y2="40" stroke="#ffffff" strokeWidth="2"/>
          </svg>
          <h1>GlucoLog</h1>
        </div>
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