import React, { useState } from 'react';
import axios from 'axios';
import './Excel.css';

function App() {
  const [file, setFile] = useState(null);

  // ✅ All categories from backend (same as name.txt but lowercase in state keys)
  const [data, setData] = useState({
    all: 0,
    rto_complete: 0,
    door_step_exchanged: 0,
    delivered: 0,
    cancelled: 0,
    rto_locked: 0,
    ready_to_ship: 0,
    shipped: 0,
    rto_initiated: 0,
    other: 0
  });

  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile &&
      (selectedFile.name.endsWith('.csv') ||
        selectedFile.name.endsWith('.xlsx') ||
        selectedFile.name.endsWith('.xls'))
    ) {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid CSV or Excel file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.name.endsWith('.csv') ||
        droppedFile.name.endsWith('.xlsx') ||
        droppedFile.name.endsWith('.xls'))
    ) {
      setFile(droppedFile);
    } else {
      alert('Only .csv or .xlsx files are supported');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please upload a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const result = res.data;

      // ✅ Map backend result counts to state
      setData({
        all: result.all?.length || 0,
        rto_complete: result.rto_complete?.length || 0,
        door_step_exchanged: result.door_step_exchanged?.length || 0,
        delivered: result.delivered?.length || 0,
        cancelled: result.cancelled?.length || 0,
        rto_locked: result.rto_locked?.length || 0,
        ready_to_ship: result.ready_to_ship?.length || 0,
        shipped: result.shipped?.length || 0,
        rto_initiated: result.rto_initiated?.length || 0,
        other: result.other?.length || 0
      });
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-logo">Meesho</div>
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/">Upload</a>
          <a href="/">Dashboard</a>
        </div>
      </nav>

      <h1 className="heading">Product Status Dashboard</h1>

      <div className="status-boxes">
        <div className="box all">
          All<br />
          <span>{data.all}</span>
        </div>
        <div className="box rto_complete">
          RTO Complete<br />
          <span>{data.rto_complete}</span>
        </div>
        <div className="box door_step_exchanged">
          Door Step Exchanged<br />
          <span>{data.door_step_exchanged}</span>
        </div>
        <div className="box delivered">
          Delivered<br />
          <span>{data.delivered}</span>
        </div>
        <div className="box cancelled">
          Cancelled<br />
          <span>{data.cancelled}</span>
        </div>
        <div className="box rto_locked">
          RTO Locked<br />
          <span>{data.rto_locked}</span>
        </div>
        <div className="box ready_to_ship">
          Ready to Ship<br />
          <span>{data.ready_to_ship}</span>
        </div>
        <div className="box shipped">
          Shipped<br />
          <span>{data.shipped}</span>
        </div>
        <div className="box rto_initiated">
          RTO Initiated<br />
          <span>{data.rto_initiated}</span>
        </div>
        <div className="box other">
          Other<br />
          <span>{data.other}</span>
        </div>
      </div>

      <div
        className={`upload-section ${dragActive ? 'drag-active' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p>Drag and drop your CSV or Excel file here or</p>
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileChange}
        />
        {file && <p className="filename">Selected File: {file.name}</p>}
        <button onClick={handleUpload}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
