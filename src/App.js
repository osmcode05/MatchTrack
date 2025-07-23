import { useState, useEffect, createContext } from "react";
import Competitions from "./Components/Competitions";
import Navbar from "./Components/Navbar";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { FaCalendarTimes, FaExclamationTriangle } from "react-icons/fa";

export const appContext = createContext(null);

const App = () => {
  const [date, setDate] = useState(new Date());
  const [matchesByCompetition, setMatchesByCompetition] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state

  // update date function
  const updateDate = (days) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + days);
      return newDate;
    });
  };

  // format date function to this form "YYY-MM-DD"
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Filter matches by Competition (League)
  const groupMatchesByCompetition = (matches) => {
    return matches.reduce((acc, match) => {
      const competitionName = match.competition?.name || "Other Competitions";
      if (!acc[competitionName]) {
        acc[competitionName] = [];
      }
      acc[competitionName].push(match);
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null); // Reset error before new request
      try {
        const response = await axios.get(`/.netlify/functions/footballProxy`, {
          params: {
            date: formatDate(date),
          },
        });
        const groupedMatches = groupMatchesByCompetition(response.data.matches);
        setMatchesByCompetition(groupedMatches);
      } catch (error) {
        setMatchesByCompetition({});
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch matches"
        ); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [date]);

  const contextValue = {
    updateDate,
    formatDate,
    date,
    setDate,
    matchesByCompetition,
  };

  return (
    <appContext.Provider value={contextValue}>
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Navbar />
        <div className="container">
          {loading ? (
            <div id="Loading" className="d-flex gap-3 text-success fs-5">
              <Spinner animation="border" />
              <p>Loading matches...</p>
            </div>
          ) : error ? ( // Show error message if there's an error
            <div id="Error" className="text-center fs-5 fw-bold">
              <p className="text-danger">{error}</p>
              <FaExclamationTriangle size={80} className="text-warning" />
            </div>
          ) : Object.keys(matchesByCompetition).length > 0 ? (
            <Competitions />
          ) : (
            <div id="No_matches" className="text-center fs-5 fw-bold">
              <p className="text-secondary">No matches for this Date.</p>
              <FaCalendarTimes size={80} className="text-danger" />
            </div>
          )}
        </div>
        <footer className="text-center fst-italic text-black-50 pb-3 pt-3 mt-auto font-monospace small">
          Created By OSM
        </footer>
      </div>
    </appContext.Provider>
  );
};

export default App;
