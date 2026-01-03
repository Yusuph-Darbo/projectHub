import { useLocation, useNavigate } from "react-router-dom";

import "../../styles/global.css";
import "./Header.css";

export default function Header({ title }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isDashboard = pathname === "/dashboard";
  const home = pathname === "/";

  return (
    <header>
      <div className="left">
        {isDashboard && <button onClick={() => navigate(-1)}>←</button>}
        <div>
          <h1>{title}</h1>
          <p>Track and manage your project tasks</p>
        </div>
      </div>

      <div className="right">
        {/* // Mock profile */}
        {home || (isDashboard && <button className="profile-icon">YD</button>)}
      </div>
    </header>
  );
}
