import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CreditCard,
  FileText,
  Plane,
  UserRound,
  Users,
} from "lucide-react";
import { getCurrentUserRole } from "../../app/config/getCurrentUserRole";

import { fetchDashboardData } from "./dashboardApi";
import type { DashboardApiResponse } from "./dashboard";


const Dashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardApiResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const role = getCurrentUserRole();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const response = await fetchDashboardData();

        setDashboardData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = [
   ...(role === "SUPER_ADMIN"
? [
{
title: "Total Tenants",
value: loading
? "..."
: dashboardData?.data?.totalTenants?.toLocaleString() ?? "0",
icon: Users,
},
{
title: "Total Companies",
value: loading
? "..."
: dashboardData?.data?.totalCompanies?.toLocaleString() ?? "0",
icon: BriefcaseBusiness,
},
{
title: "Total Candidates",
value: loading
? "..."
: dashboardData?.data?.totalCandidates?.toLocaleString() ?? "0",
icon: UserRound,
},
]
: role === "ADMIN"
? [
{
title: "Total Companies",
value: loading
? "..."
: dashboardData?.data?.totalCompanies?.toLocaleString() ?? "0",
icon: BriefcaseBusiness,
},
{
title: "Total Candidates",
value: loading
? "..."
: dashboardData?.data?.totalCandidates?.toLocaleString() ?? "0",
icon: UserRound,
},
]
: role === "VENDOR_USER"
? [
  {
title: "Total Companies",
value: loading
? "..."
: dashboardData?.data?.totalCompanies?.toLocaleString() ?? "0",
icon: BriefcaseBusiness,
},
{
title: "Total Candidates",
value: loading
? "..."
: dashboardData?.data?.totalCandidates?.toLocaleString() ?? "0",
icon: UserRound,
},
]
: []),
    {
      title: "Pending Documents",
      value: "328",
      icon: FileText,
    },
    {
      title: "Visa Processing",
      value: "1,245",
      icon: Plane,
    },
    {
      title: "Total Payments",
      value: "₹84.5M",
      icon: CreditCard,
    },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Super Admin</p>
        </div>

        <button className="primary-button">
          Generate Report
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-icon">
                <Icon size={24} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Candidate Processing Overview</h3>
          </div>

          <div className="process-list">
            <div>
              <span>Documents</span>
              <strong>2,450</strong>
            </div>

            <div>
              <span>Visa Processing</span>
              <strong>1,245</strong>
            </div>

            <div>
              <span>Medical</span>
              <strong>856</strong>
            </div>

            <div>
              <span>Contracts</span>
              <strong>645</strong>
            </div>

            <div>
              <span>Ready for Departure</span>
              <strong>420</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
          </div>

          <div className="activity-list">
            <p>
              <span className="activity-dot"></span>
              New candidate registered
            </p>

            <p>
              <span className="activity-dot"></span>
              Visa approved for candidate
            </p>

            <p>
              <span className="activity-dot"></span>
              Payment successfully received
            </p>

            <p>
              <span className="activity-dot"></span>
              New company onboarded
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;