import { Card, ListGroup, Badge } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { appContext } from "../App";
import { useContext } from "react";

const Competitions = () => {

  const { matchesByCompetition } = useContext(appContext)

  //get winner function for add a start for the winner team
  const getWinner = (match, teamType) => {
    return match.status === "FINISHED" && match.score.winner === teamType;
  };

  //get status of the matches (FINISHED OR TIMED) for set match result or match time 
  const getMatchStatus = (match) => {
    if (match.status === "FINISHED") {
      const { home, away } = match.score.fullTime;
      return <div className="fw-bold">{home} - {away}</div>;
    }
    return (
      <div className="text-muted small">
        {new Date(match.utcDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    );
  };

  return (
    <>
      {Object.entries(matchesByCompetition).map(([competition, matches]) => (
        <Card key={competition} className="shadow mt-4 border-0">
          <Card.Header className="d-flex align-items-center bg-success-subtle">
            {matches[0]?.competition?.emblem && (
              <img src={matches[0].competition.emblem} alt={competition} style={{ height: 30, width: 30, marginRight: 10 }} />
            )}
            <Card.Title className="mt-auto mb-auto">{competition}</Card.Title>
            <Badge className="bg-success ms-auto">
              {matches[0].stage === "REGULAR_SEASON" ? `Matchday ${matches[0].matchday}` : matches[0].stage}
            </Badge>
          </Card.Header>

          <Card.Body className="p-0">
            {matches.map((match, index) => (
              <ListGroup.Item key={index} className="d-flex m-2 p-3 bg-light">
                {/* Home Team */}
                <div className="d-flex align-items-center gap-2" style={{ width: "40%" }}>
                  <div className="fw-bold text-end flex-grow-1">{match.homeTeam?.shortName}</div>
                  {match.homeTeam?.crest && (
                    <div className="position-relative">
                      {getWinner(match, "HOME_TEAM") && (<FaStar id="HOME_TEAM_STAR" className="text-warning position-absolute"/>)}
                      <img src={match.homeTeam.crest} alt={match.homeTeam.shortName} style={{ height: 24, width: 24 }}/>
                    </div>
                  )}
                </div>

                {/* Score or Time */}
                <div className="d-flex flex-column align-items-center" style={{ width: "20%" }}>
                  {getMatchStatus(match)}
                </div>

                {/* Away Team */}
                <div className="d-flex align-items-center gap-2" style={{ width: "40%" }}>
                  {match.awayTeam?.crest && (
                    <div className="position-relative">
                      {getWinner(match, "AWAY_TEAM") && (<FaStar id="AWAY_TEAM_STAR" className="text-warning position-absolute" />)}
                      <img src={match.awayTeam.crest} alt={match.awayTeam.shortName} style={{ height: 24, width: 24 }} />
                    </div>
                  )}
                  <div className="fw-bold flex-grow-1">{match.awayTeam?.shortName}</div>
                </div>

              </ListGroup.Item>
            ))}
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default Competitions;
