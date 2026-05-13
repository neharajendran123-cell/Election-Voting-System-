// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SelfNomination from "./pages/SelfNomination";
import AdminDashboard from "./pages/AdminDashboard";
import ElectionVoting from "./pages/ElectionVoting";
import VoteResults from "./pages/VoteResults";
import Results from "./pages/Results";
import ViewCandidates from "./pages/ViewCandidates";
import VotersList from "./pages/VotersList";
import FileComplaint from "./pages/FileComplaint";
import ViewComplaints from "./pages/ViewComplaints";
import AddStudentManually from "./pages/AddStudentManually";
import ElectionDetails from "./pages/ElectionDetails"; // adjust path
import ViewAllVotes from "./pages/ViewAllVotes"; // adjust path
ViewAllVotes
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/dashboard/self-nomination" element={<SelfNomination />} />
         <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/dashboard/election-voting" element={<ElectionVoting />} />
         <Route path="/admin/vote-results" element={<VoteResults />} />
         <Route path="/dashboard/results" element={<Results />} />
         <Route path="/dashboard/view-candidates" element={<ViewCandidates />} />
         <Route path="/dashboard/voters-list" element={<VotersList />} />
         <Route path="/dashboard/file-complaint" element={<FileComplaint />} />
         <Route path="/admin/view-complaints" element={<ViewComplaints />} />
         <Route path="/admin/add-student" element={<AddStudentManually />} />
         <Route path="/dashboard/election-details" element={<ElectionDetails />} />
         <Route path="/dashboard/view-all-votes" element={<ViewAllVotes />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
