import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  UserCircle,
} from "lucide-react";

import { getCurrentUserRole } from "../../app/config/getCurrentUserRole";
import { useState } from "react";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

   const role = getCurrentUserRole();

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="mobile-menu">
          <Menu size={22} />
        </button>

        <div className="search-box">
          <Search size={18} />
          <input placeholder="Search anything..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <button className="icon-button">
          <Settings size={20} />
        </button>

        <div
          className="profile"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <UserCircle size={38} />

         <div className="profile-info">
              {role === "SUPER_ADMIN" && (
                <>
                  <strong>Super Admin</strong>
                  <span>Administrator</span>
                </>
              )}

              {role === "TENANT_ADMIN" && (
                <strong>Tenant Admin</strong>
              )}

              {role === "VENDOR" && (
                <strong>Vendor</strong>
              )}
          </div>

          <ChevronDown size={17} />

          {profileOpen && (
            <div className="profile-menu">
              <button>
                <UserCircle size={16} />
                My Profile
              </button>

              <button>
                <Settings size={16} />
                Settings
              </button>

              <button onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;