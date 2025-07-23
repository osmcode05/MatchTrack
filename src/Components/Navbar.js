import { Form } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaFutbol } from "react-icons/fa";
import { appContext } from "../App";
import { useContext } from "react";

const Navbar = () => {

  const { updateDate, formatDate, date, setDate } = useContext(appContext)

  return (
    <nav className="navbar bg-white py-3 shadow-sm sticky-top z-3">
      <div className="container gap-3">
        <div className="d-flex align-items-center">
          <FaFutbol className="me-3 text-success" size={35} />
          <span className="fs-4 fw-bold fst-italic">OSM MatchTrack</span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <FaChevronLeft
            className="text-success p-1"
            size={35}
            onClick={() => updateDate(-1)}
            role="button"
            aria-label="Previous day"
          />

          <Form.Control
            className="text-secondary shadow-none border-success"
            type="date"
            value={formatDate(date)}
            onChange={(e) => setDate(new Date(e.target.value))}
          />

          <FaChevronRight
            className="text-success p-1"
            size={35}
            onClick={() => updateDate(1)}
            style={{ cursor: "pointer" }}
            aria-label="Next day"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
