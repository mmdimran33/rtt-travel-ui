import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PlaneLanding,
  PlaneTakeoff,
  Stethoscope,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import type { UserType } from "../../features/user/user";
import type { LucideIcon } from "lucide-react";


  //const menuItems = [
  interface MenuItem {
  title: string;
  path: string;
  icon:LucideIcon
  roles: UserType[];
}

 const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["SUPER_ADMIN", "TENANT_ADMIN", "VENDOR"],
    },
    // {
    //   title: "Tenant Management",
    //   path: "/tenants",
    //   icon: Building2,
    //   roles: ["SUPER_ADMIN"]
    // },
    {
      title: "User Management",
      path: "/users",
      icon: Users,
      roles: ["SUPER_ADMIN", "TENANT_ADMIN"]
    },
    {
      title: "Company Management",
      path: "/companies",
      icon: BriefcaseBusiness,
      roles: ["SUPER_ADMIN", "TENANT_ADMIN"]
    },
    {
      title: "Candidate Management",
      path: "/candidates",
      icon: UserRound,
      roles: ["VENDOR", "TENANT_ADMIN", "SUPER_ADMIN"]
    },
   /* {
      title: "Document Management",
      path: "/documents",
      icon: FileText,
      roles: ["SUPER_ADMIN", "TENANT_ADMIN", "VENDOR"]
    },
    {
      title: "Visa Management",
      path: "/visas",
      icon: ClipboardCheck,
       roles: ["SUPER_ADMIN", "TENANT_ADMIN", "VENDOR"]
    },
    {
      title: "Medical Management",
      path: "/medical",
      icon: Stethoscope,
      roles: ["SUPER_ADMIN", "TENANT_ADMIN", "VENDOR"]
    },
    {
      title: "Contract Management",
      path: "/contracts",
      icon: WalletCards,
       roles: ["SUPER_ADMIN", "TENANT_ADMIN", "VENDOR"]
    },
    {
      title: "Departure Management",
      path: "/departures",
      icon: PlaneTakeoff,
       roles: ["SUPER_ADMIN", "TENANT_ADMIN", "VENDOR"]
    },
    {
      title: "Arrival Management",
      path: "/arrivals",
      icon: PlaneLanding,
       roles: ["SUPER_ADMIN", "TENANT_ADMIN", "VENDOR"]
    },
  {
      title: "Payment Management",
      path: "/payments",
      icon: CreditCard,
       roles: ["SUPER_ADMIN", "TENANT_ADMIN", "VENDOR"]
    },
    */
  ];
const Sidebar = () => {

  const userType = localStorage.getItem("userType") as UserType | null; 
  const visibleMenuItems = menuItems.filter((item) => { if (!userType) { return false; } return item.roles.includes(userType); }); 
  const handleLogout = () => { 
    localStorage.removeItem("token"); localStorage.removeItem("refreshToken"); 
    localStorage.removeItem("userType"); window.location.href = "/login"; 
  };
  
  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">
          <Activity size={24} />
        </div>

        <div>
          <h2>Global Admin</h2>
          <span>Management Portal</span>
        </div>
      </div>

      <div className="menu-title">MAIN MENU</div>

      <nav className="sidebar-menu">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              <Icon size={19} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>
          <span>System Online</span>
        </div>

        <button className="logout-button">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;