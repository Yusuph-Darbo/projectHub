import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../../utils/api.js";
import { logOut } from "../../utils/auth.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";

import "./Header.css";

export default function Header({ title }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Used to run logic after header is rendered
  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        console.error("Not authenticated");
      }
    }

    loadUser();
  }, []);

  async function handleLogOut() {
    try {
      await logOut();
      navigate("/register");
    } catch (err) {
      console.error("Failed to logout user:", err);
    }
  }

  const isDashboard = pathname.startsWith("/dashboard/");
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
        {home && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="profile-icon">
                {user ? user.name[0].toUpperCase() : "?"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleLogOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
