import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../../utils/api.js";
import { logOut } from "../../utils/auth.js";
import { isAuthenticated } from "../../utils/auth.js";
import type { AuthenticatedUser } from "../../types/user.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.js";

import "./Header.css";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthenticatedUser | null>(null);

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
  const isRegister = pathname.startsWith("/register");
  const userInitial = user?.name?.[0]?.toUpperCase() ?? "?";

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
        {!isRegister && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="profile-icon">{userInitial}</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              {isAuthenticated() && (
                <DropdownMenuItem onClick={handleLogOut}>
                  Log out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
