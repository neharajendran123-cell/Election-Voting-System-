import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SelfNomination from "./pages/SelfNomination";
import ElectionVoting from "./pages/ElectionVoting";
import Results from "./pages/Results";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/self-nomination" element={<SelfNomination />} />
          <Route path="election-voting" element={<ElectionVoting />} />
          <Route path="results" element={<Results />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
