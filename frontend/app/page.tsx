import { Car, MapPin, AlertTriangle, Bell, Activity } from "lucide-react";
import React from "react";

async function getDashboardData() {
  const query = `
    query GetDashboardData {
      vehicles {
        id
        licensePlate
        type
        status
      }
      zones {
        id
        name
        densityLevel
      }
      incidents {
        id
        type
        status
        description
      }
    }
  `;

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return null;
  }
}

export default async function Dashboard() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-rose-500 font-semibold">
        Error loading dashboard data. Ensure the Gateway is running on port 4000.
      </div>
    );
  }

  const vehicles = data.vehicles || [];
  const zones = data.zones || [];
  const incidents = data.incidents || [];

  const activeVehicles = vehicles.filter((v: any) => v.status === "Active").length;
  const criticalIncidents = incidents.filter((i: any) => i.status === "SIGNALE").length;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Urban Traffic Dashboard</h1>
          <p className="text-slate-500 mt-2">Real-time city overview and monitoring</p>
        </div>
        <div className="flex gap-4">
          <button className="relative p-2 rounded-full bg-white shadow-sm hover:bg-slate-50 transition">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full shadow-md"></div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KpiCard title="Total Vehicles" value={vehicles.length} icon={<Car />} color="bg-blue-500" />
        <KpiCard title="Active Fleet" value={activeVehicles} icon={<Activity />} color="bg-emerald-500" />
        <KpiCard title="Traffic Zones" value={zones.length} icon={<MapPin />} color="bg-indigo-500" />
        <KpiCard title="Open Incidents" value={criticalIncidents} icon={<AlertTriangle />} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vehicles List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-500" /> Fleet Overview
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="p-4 rounded-tl-lg">Plate</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-lg">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-medium text-slate-900">{v.licensePlate}</td>
                    <td className="p-4 text-slate-600">{v.type}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${v.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-xs">{v.id.split('-')[0]}...</td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">No vehicles registered.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Incidents */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> Recent Incidents
            </h2>
            <div className="space-y-4">
              {incidents.map((i: any) => (
                <div key={i.id} className="p-4 rounded-xl border border-rose-100 bg-rose-50/30">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-rose-900">{i.type}</span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">{i.status}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{i.description}</p>
                </div>
              ))}
              {incidents.length === 0 && (
                <div className="text-slate-500 text-sm text-center py-4">No active incidents.</div>
              )}
            </div>
          </div>

          {/* Zones */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" /> Traffic Zones
            </h2>
            <div className="space-y-3">
              {zones.map((z: any) => (
                <div key={z.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition">
                  <span className="font-medium text-slate-700">{z.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    z.densityLevel === 'ELEVE' ? 'bg-rose-100 text-rose-700' :
                    z.densityLevel === 'MOYEN' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {z.densityLevel}
                  </span>
                </div>
              ))}
              {zones.length === 0 && (
                <div className="text-slate-500 text-sm text-center py-4">No monitored zones.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
      <div className={`p-4 rounded-xl text-white ${color} shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
