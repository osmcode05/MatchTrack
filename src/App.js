import { useState, useEffect } from "react";
import Competitions from "./Components/Competitions";
import Navbar from "./Components/Navbar";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { FaCalendarTimes } from "react-icons/fa";

const App = () => {
  const [date, setDate] = useState(new Date());
  const [matchesByCompetition, setMatchesByCompetition] = useState({});
  const [loading, setLoading] = useState(false);
  const MyToken = process.env.REACT_APP_API_KEY;

  const formatDate = (date) => date.toISOString().split("T")[0];

  const updateDate = (days) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + days);
      return newDate;
    });
  };

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
      try {
        const response = await axios.get(
          `https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/matches`,
          {
            headers: { "X-Auth-Token": MyToken },
            params: {
              competitions: "PL,SA,EC,PPL,ELC,FL1,PD,BSA,DED,BL1,CL,WC",
              date: formatDate(date),
            },
          }
        );
        const groupedMatches = groupMatchesByCompetition(response.data.matches);
        setMatchesByCompetition(groupedMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatchesByCompetition({});
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [date, MyToken]);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar
        updateDate={updateDate}
        formatDate={formatDate}
        date={date}
        setDate={setDate}
      />

      <div className="container">
        {loading ? (
          <div id="Loading" className="d-flex gap-3 text-success fs-5">
            <Spinner animation="border" />
            <p>Loading matches...</p>
          </div>
        ) : Object.keys(matchesByCompetition).length > 0 ? (
          <Competitions matchesByCompetition={matchesByCompetition} />
        ) : (
          <div id="No_matches" className="text-center fs-5 fw-bold">
            <p className="text-secondary">No matches for this Date.</p>
            <FaCalendarTimes size={80} className="text-danger" />
          </div>
        )}
      </div>
      <footer className="text-center fst-italic text-black-50 pb-3 pt-5 mt-auto font-monospace small">
        Created By OSM
      </footer>
    </div>
  );
};

export default App;
