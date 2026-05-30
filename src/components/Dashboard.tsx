import React, { useEffect, useRef } from 'react';
import { HelpCircle, Star, Shield, LayoutDashboard, FilePlus, ChevronRight, Mail, Phone, MapPin, GraduationCap, School, BookOpen, TrendingUp, FileText, Clock, CheckSquare, Users, Heart, Map } from 'lucide-react';
import { User, Report } from '../types';
import { ROLE_CFG, can, DISTRICTS, DISTRICT_INFO, MAP_CLUSTERS } from '../data';
import { Card, Kicker, Btn, StatCard, Badge, Pill, TH, ProgBar } from './SubComponents';

interface DashboardProps {
  user: User | null;
  reports: Report[];
  setPage: (p: string) => void;
  darkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  reports,
  setPage,
  darkMode
}) => {
  const currentUser = user || { role: "viewer" as const, name: "Public Viewer", district: null };
  const isPublic = !user;
  const isStaff = user && ["admin", "district_coordinator", "data_entry"].includes(user.role);
  
  // Custom scope filtering
  const my = (currentUser.role === "data_entry" || currentUser.role === "tot")
    ? reports.filter(r => r.submitted_by === currentUser.name)
    : currentUser.role === "district_coordinator"
      ? reports.filter(r => r.district === currentUser.district)
      : reports;

  const pending = my.filter(r => r.status === "pending").length;
  const approved = my.filter(r => r.status === "approved").length;
  const students = my.reduce((acc, r) => acc + r.boys + r.girls, 0);

  const YEARLY_DATA = [
    { year: "2023", schools: 116, teachers: 228, learners: 45600, targetSchools: 225, targetLearners: 45000 },
    { year: "2024", schools: 357, teachers: 727, learners: 145400, targetSchools: 950, targetLearners: 190005 },
    { year: "2025", schools: 975, teachers: 1973, learners: 395000, targetSchools: 3000, targetLearners: 600000 },
    { year: "2026", schools: 1482, teachers: 2964, learners: 592200, targetSchools: 6000, targetLearners: 1200000, current: true },
    { year: "2027", schools: 0, teachers: 0, learners: 0, targetSchools: 10000, targetLearners: 2000000, planned: true },
  ];

  const SUMMARY_BADGES = [
    { label: "Total Clusters", value: "396", color: "#FF5206", pale: "bg-[#F6F6F6] text-[#FF5206] border border-[#FF5206]/20" },
    { label: "TOTs Trained", value: "665", color: "#A1220B", pale: "bg-[#F6F6F6] text-[#A1220B] border border-[#A1220B]/20" },
    { label: "Teachbacks", value: "288", color: "#821F0C", pale: "bg-[#F6F6F6] text-[#821F0C] border border-[#821F0C]/20" },
    { label: "Meetings Held", value: "371", color: "#460C04", pale: "bg-[#F6F6F6] text-[#460C04] border border-[#460C04]/20" },
  ];

  const chartRefs = useRef<Record<string, any>>({});
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const Chart = (window as any).Chart;
    if (!Chart) return;

    const kill = (id: string) => {
      if (chartRefs.current[id]) {
        chartRefs.current[id].destroy();
        delete chartRefs.current[id];
      }
    };

    const C_ORANGE = "#FF5206";
    const C_RED1 = "#A1220B";
    const C_RED2 = "#821F0C";
    const C_GRID = darkMode ? "rgba(130, 31, 12, 0.3)" : "rgba(164, 164, 169, 0.15)";
    const C_TICK = darkMode ? "#F6F6F6" : "#A4A4A9";

    const buildCharts = () => {
      const lineCtx = document.getElementById("up-line-learners") as HTMLCanvasElement;
      if (lineCtx) {
        kill("line-learners");
        chartRefs.current["line-learners"] = new Chart(lineCtx, {
          type: "line",
          data: {
            labels: YEARLY_DATA.map(d => d.year),
            datasets: [
              {
                label: "Actual learners",
                data: YEARLY_DATA.map(d => d.learners),
                borderColor: C_ORANGE,
                backgroundColor: "rgba(255, 82, 6, 0.06)",
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: C_ORANGE
              },
              {
                label: "Target learners",
                data: YEARLY_DATA.map(d => d.targetLearners),
                borderColor: C_RED1,
                backgroundColor: "rgba(161, 34, 11, 0.03)",
                fill: true,
                borderDash: [5, 4],
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: C_RED1
              },
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: { font: { size: 10, family: 'Plus Jakarta Sans' }, color: C_TICK }
              }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: C_TICK, font: { size: 10 } } },
              y: { grid: { color: C_GRID }, ticks: { color: C_TICK, font: { size: 10 } } },
            },
          },
        });
      }

      const barYearCtx = document.getElementById("up-bar-year") as HTMLCanvasElement;
      if (barYearCtx) {
        kill("bar-year");
        chartRefs.current["bar-year"] = new Chart(barYearCtx, {
          type: "bar",
          data: {
            labels: YEARLY_DATA.map(d => d.year),
            datasets: [
              { label: "Schools reached", data: YEARLY_DATA.map(d => d.schools), backgroundColor: C_ORANGE, borderRadius: 5 },
              { label: "Teachers trained", data: YEARLY_DATA.map(d => d.teachers), backgroundColor: C_RED2, borderRadius: 5 },
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: { font: { size: 10, family: 'Plus Jakarta Sans' }, color: C_TICK }
              }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: C_TICK, font: { size: 10 } } },
              y: { grid: { color: C_GRID }, ticks: { color: C_TICK, font: { size: 10 } } },
            },
          },
        });
      }
    };

    const raf = requestAnimationFrame(buildCharts);
    return () => {
      cancelAnimationFrame(raf);
      Object.keys(chartRefs.current).forEach(kill);
    };
  }, [darkMode]);

  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;

    // Check if the element exists
    const mapEl = document.getElementById("dashboard-ett-map");
    if (!mapEl) return;

    const map = L.map("dashboard-ett-map", { zoomControl: true }).setView([-13.2, 34.0], 6.5);
    mapRef.current = map;

    const tileUrl = darkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18
    }).addTo(map);

    L.control.scale({ imperial: false }).addTo(map);

    const ACTIVE_DISTRICTS = new Set([
      "Mzimba", "Mzunzu", "Lilongwe", "Dowa", "Kasungu", "Dedza", "Ntcheu", "Ntchisi", "Nkhotakota", "Salima",
      "Blantyre", "Zomba", "Mangochi", "Machinga", "Balaka"
    ]);

    DISTRICTS.forEach(district => {
      const coords = DISTRICT_INFO[district.name];
      if (!coords) return;
      const isActive = ACTIVE_DISTRICTS.has(district.name);
      
      const fillColor = isActive ? "#FF5206" : (darkMode ? "#821F0C" : "#A4A4A9");
      const radius = isActive ? 6 : 4;

      L.circleMarker([coords.lat, coords.lng], {
        radius,
        fillColor,
        color: darkMode ? "#460C04" : "#FEFEFE",
        weight: 1.5,
        fillOpacity: isActive ? 0.8 : 0.4
      }).addTo(map).bindTooltip(district.name, {
        permanent: false,
        direction: "top",
        offset: [0, -4]
      });
    });

    MAP_CLUSTERS.forEach(cluster => {
      cluster.schools.forEach(school => {
        L.polyline([[cluster.lat, cluster.lng], [school.lat, school.lng]], {
          color: "#FF5206",
          weight: 1.5,
          opacity: 0.5,
          dashArray: "4 4"
        }).addTo(map);
      });

      cluster.schools.forEach(school => {
        const schoolIcon = L.divIcon({
          className: "custom-leaflet-school-marker",
          html: `<div style="display:flex;align-items:center;justify-content:center">
            <div style="width:8px;height:8px;border-radius:50%;background:#FF5206;border:1.5px solid ${darkMode ? '#460C04' : '#FEFEFE'};box-shadow:0 1px 3px rgba(0,0,0,.3);flex-shrink:0"></div>
          </div>`,
          iconAnchor: [4, 4]
        });

        L.marker([school.lat, school.lng], { icon: schoolIcon, zIndexOffset: 100 })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:160px;padding:2px 0;color:${darkMode ? '#FEFEFE' : '#460C04'}">
              <div style="font-weight:800;font-size:12px;margin-bottom:2px;color:${darkMode ? '#FEFEFE' : '#460C04'}">${school.name}</div>
              <div style="font-size:10.5px;color:${darkMode ? '#A4A4A9' : '#821F0C'}">📍 ${cluster.district} · Lead: <b>${cluster.lead}</b></div>
            </div>`
          );
      });

      const centerIcon = L.divIcon({
        className: "custom-leaflet-center-marker",
        html: `<div style="display:flex;align-items:center;justify-content:center">
          <div style="width:12px;height:12px;border-radius:50%;background:${darkMode ? '#1a0a05' : '#460C04'};border:2.5px solid #FF5206;box-shadow:0 2px 5px rgba(0,0,0,.35);flex-shrink:0"></div>
        </div>`,
        iconAnchor: [6, 6]
      });

      const centerMarker = L.marker([cluster.lat, cluster.lng], { icon: centerIcon, zIndexOffset: 300 }).addTo(map);
      
      centerMarker.bindPopup(
        `<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:200px;padding:2px 0;color:${darkMode ? '#FEFEFE' : '#460C04'}">
          <div style="font-weight:850;font-size:13px;margin-bottom:3px;color:${darkMode ? '#FEFEFE' : '#460C04'}">${cluster.name}</div>
          <div style="font-size:11px;color:${darkMode ? '#A4A4A9' : '#821F0C'};margin-bottom:3px">📍 District: <b>${cluster.district}</b> · Lead: <b>${cluster.lead}</b></div>
          <div style="font-size:11px;color:${darkMode ? '#A4A4A9' : '#821F0C'}">👥 Learners: <b>${cluster.students}</b> · Trained: <b>${cluster.trained}/${cluster.schools.length}</b></div>
        </div>`
      );
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [darkMode]);

  return (
    <div className="space-y-6">
      {/* Immersive Welcome Hero Banner */}
      <div className="bg-[#460C04] rounded-3xl p-6 sm:p-10 text-[#FEFEFE] relative overflow-hidden shadow-xl border border-[#821F0C]">
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-[#FF5206]/10 blur-xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full bg-[#FF5206]/5 blur-lg pointer-events-none" />
        
        <div className="relative flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest bg-[#FF5206]/12 border border-[#FF5206]/20 text-[#FF5206] rounded-full px-3.5 py-1">
            {isStaff ? "System Dashboard Access" : "Malawi National ScaleUp Dashboard"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-[#FEFEFE] max-w-4xl">
            {user ? currentUser.name : "ETT Country Wide ScaleUp Program"}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#A4A4A9]">
            <span className="bg-[#FEFEFE]/10 text-[#FF5206] px-3 py-1 rounded-full border border-[#FEFEFE]/5 flex items-center gap-1">
              {user ? ROLE_CFG[user.role]?.label : "Public Guest"}
            </span>
            {currentUser.district && <span className="opacity-80">aligned: {currentUser.district} region</span>}
          </div>
          <div className="flex flex-wrap gap-2 pt-4">
            {isPublic ? (
              <>
                <Btn onClick={() => setPage("submit")} size="lg">Report SGBV Incident</Btn>
                <Btn onClick={() => setPage("login")} size="lg" className="bg-[#FEFEFE]/10 text-[#FEFEFE] hover:bg-[#FEFEFE]/15 border border-[#FEFEFE]/20">Sign In</Btn>
              </>
            ) : (
              <>
                <Btn onClick={() => setPage("submit")} size="lg">Submit Report</Btn>
                {isStaff && can(user.role, "approveReport") && pending > 0 && (
                  <Btn onClick={() => setPage("reports")} size="lg" variant="secondary" className="border-[#FEFEFE]/15 bg-[#FEFEFE]/5 text-[#FEFEFE] hover:bg-[#FEFEFE]/10">
                    Review Pending ({pending})
                  </Btn>
                )}
                {isStaff && can(user.role, "manageUsers") && (
                  <Btn onClick={() => setPage("users")} size="lg" variant="secondary" className="border-[#FEFEFE]/15 bg-[#FEFEFE]/5 text-[#FEFEFE] hover:bg-[#FEFEFE]/10">
                    Manage Users
                  </Btn>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {!isStaff ? (
          <>
            <StatCard icon={<GraduationCap size={18} />} label="Students Reached" value="592,200+" />
            <StatCard icon={<School size={18} />} label="Schools Covered" value="2,964" />
            <StatCard icon={<MapPin size={18} />} label="Implementing Districts" value="15" />
            <StatCard icon={<Shield size={18} />} label="TOTs Certified" value="665" />
            <StatCard icon={<BookOpen size={18} />} label="Lessons Conducted" value="17,784+" />
            <StatCard icon={<TrendingUp size={18} />} label="Target coverage" value="54%" />
          </>
        ) : (
          <>
            <StatCard icon={<FileText size={18} />} label="Total Files" value={my.length} />
            <StatCard icon={<Clock size={18} />} label="Awaiting DC Review" value={pending} color="#FF5206" />
            <StatCard icon={<CheckSquare size={18} />} label="Approved" value={approved} color="#A1220B" />
            <StatCard icon={<Users size={18} />} label="Learners Registered" value={students} />
          </>
        )}
      </div>

      {!isStaff && (
        <Card className="p-6 bg-[#FEFEFE] border border-[#A4A4A9]/25">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#460C04] dark:text-[#FEFEFE] m-0">Program Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#A1220B]">
                    <circle cx="12" cy="9" r="4" />
                    <path d="M8.5 7C7 6.5 6.5 7 6 8.5s.5 2.5 1.5 1" />
                    <path d="M15.5 7c1.5-.5 2-.0 2.5 1.5s-.5 2.5-1.5 1" />
                    <path d="M6 20c0-3.5 3-5 6-5s6 1.5 6 5" />
                  </svg>
                ),
                title: "Girls Empowerment (GESD)",
                text: "Age-appropriate boundary assertiveness training. Equips girls to detect danger early, voice boundaries, and implement physical protection maneuvers.",
                color: "bg-[#A1220B]/10 text-[#A1220B]"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#FF5206]">
                    <circle cx="12" cy="9" r="4.5" />
                    <path d="M8.5 7.5c.5-1.5 2-2.5 3.5-2.5s3 1 3.5 2.5" />
                    <path d="M6 20c0-3.5 3-5 6-5s6 1.5 6 5" />
                  </svg>
                ),
                title: "Boys Transformation (HIM)",
                text: "Empowers boys to challenge harmful gender norms, embrace positive masculinity, respect women, and step up as allies to defend school security.",
                color: "bg-[#FF5206]/10 text-[#FF5206]"
              },
              {
                icon: <Heart size={22} className="text-[#821F0C]" />,
                title: "Survivors Support (SASA)",
                text: "Provides trauma-informed safe paths, psychological linkage channels, and responsive SGBV reporting pathways to support student recovery.",
                color: "bg-[#821F0C]/10 text-[#821F0C]"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#F6F6F6] dark:bg-[#1a0a05] border border-[#A4A4A9]/30 dark:border-[#821F0C] p-5 rounded-2xl flex flex-col items-center text-center space-y-3 hover:shadow hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#460C04] dark:text-[#FEFEFE] mb-1">{item.title}</h4>
                  <p className="text-xs text-[#821F0C] dark:text-[#A4A4A9] leading-relaxed m-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main bottom block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table of recent files — only for authenticated personnel */}
        {isStaff && (
          <div className="lg:col-span-3">
            <Card className="p-0 overflow-hidden bg-[#FEFEFE] border border-[#A4A4A9]/25">
              <div className="p-5 border-b border-[#A4A4A9]/35 dark:border-[#821F0C] flex items-center justify-between">
                <h3 className="text-base font-bold text-[#460C04] dark:text-[#FEFEFE] m-0">Recent File Submissions</h3>
                <Btn size="sm" variant="ghost" onClick={() => setPage(user && user.role === "data_entry" ? "my_reports" : "reports")}>
                  See All →
                </Btn>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <TH cols={["School", "Region", "Curriculum", "Collective", "Review State", "Submitted On"]} />
                  <tbody>
                    {my.slice(0, 5).map(r => (
                      <tr key={r.id} className="border-b border-[#A4A4A9]/20 dark:border-[#821F0C]/40 hover:bg-[#FF5206]/5 dark:hover:bg-[#FF5206]/10">
                        <td className="p-3 font-bold text-[#460C04] dark:text-[#FEFEFE] whitespace-nowrap">{r.school}</td>
                        <td className="p-3 text-[#821F0C] dark:text-[#A4A4A9]">{r.district}</td>
                        <td className="p-3">
                          <Badge text={r.curriculum} bg="rgba(255, 82, 6, 0.1)" color="#FF5206" />
                        </td>
                        <td className="p-3 font-bold text-[#821F0C] dark:text-[#FEFEFE]">{r.boys + r.girls}</td>
                        <td className="p-3">
                          <Pill s={r.status} />
                        </td>
                        <td className="p-3 text-[10.5px] text-[#A4A4A9] whitespace-nowrap">{r.submitted_at}</td>
                      </tr>
                    ))}
                    {my.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-[#A4A4A9] dark:text-slate-500 font-semibold selection:none">
                          No school school files verified yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        <div className="lg:col-span-3 space-y-6">
          {/* Transition to ScaleUp grid tracker */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF5206]">
                  Program Transitions
                </span>
                <h3 className="text-base font-bold text-[#460C04] dark:text-[#FEFEFE] m-0">
                  Annual Expansion Milestones
                </h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {SUMMARY_BADGES.map(b => (
                  <span key={b.label} className={`px-2 py-0.5 rounded text-[10px] sm:text-[10.5px] font-bold ${b.pale}`}>
                    {b.value} {b.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {YEARLY_DATA.map(d => (
                <div
                   key={d.year}
                   className={`p-4 rounded-xl border flex flex-col justify-between ${
                     d.current
                       ? "border-[#FF5206] bg-[#FF5206]/5"
                       : d.planned
                         ? "border-[#A4A4A9]/30 dark:border-[#821F0C] bg-[#F6F6F6] dark:bg-[#460C04]/10"
                         : "border-[#A4A4A9]/35 dark:border-[#821F0C] bg-[#FEFEFE]"
                   }`}
                >
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className={d.planned ? 'text-[#A4A4A9]' : 'text-[#FF5206]'}>{d.year}</span>
                    {d.current && <span className="bg-[#FF5206] text-[#FEFEFE] text-[8px] font-bold px-1 rounded">Live</span>}
                    {d.planned && <span className="bg-[#F6F6F6] dark:bg-[#821F0C] text-[#A4A4A9] text-[8px] font-bold px-1 rounded">Plan</span>}
                  </div>
                  <div className="my-2.5">
                    <div className="text-[10px] text-[#A4A4A9] dark:text-slate-300 font-semibold mb-0.5">Learners Trained</div>
                    <div className="text-base font-extrabold text-[#460C04] dark:text-[#FEFEFE]">
                      {d.learners > 0 ? d.learners.toLocaleString() : "—"}
                    </div>
                  </div>
                  <div className="text-[9.5px] text-[#A4A4A9] dark:text-slate-350 mt-1 line-clamp-2">
                    tgt: {d.targetSchools} schools · {d.targetLearners >= 1000000 ? `${(d.targetLearners/1000000).toFixed(1)}M` : `${d.targetLearners/1000}k`} pupils
                  </div>
                </div>
              ))}
            </div>

            {/* Malawi Live Coverage Map Preview Card */}
            <Card className="p-5 bg-[#FEFEFE] border border-[#A4A4A9]/25">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF5206]">
                    Geographical Reach
                  </span>
                  <h3 className="text-base font-bold text-[#460C04] dark:text-[#FEFEFE] m-0">
                    Malawi National ScaleUp Interactive Map Preview
                  </h3>
                </div>
                <Btn size="sm" variant="ghost" onClick={() => setPage("maps")}>
                  Full Screen Map & Detailed Clusters →
                </Btn>
              </div>
              <div className="h-72 w-full relative border border-[#A4A4A9]/35 dark:border-[#821F0C] rounded-xl overflow-hidden shadow-inner bg-[#F6F6F6] dark:bg-[#460C04]">
                <div id="dashboard-ett-map" className="h-full w-full z-0 font-sans" />
              </div>
            </Card>

            {/* Expansion analytics plots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5 bg-[#FEFEFE] border border-[#A4A4A9]/25">
                <h4 className="text-xs font-bold text-[#821F0C] dark:text-[#FEFEFE] m-0 mb-1">Impact Scaling Trends</h4>
                <p className="text-[10px] text-[#A4A4A9] m-0 mb-4">Learner populations reached against target trajectories</p>
                <div className="h-44 w-full relative">
                  <canvas id="up-line-learners" />
                </div>
              </Card>

              <Card className="p-5 bg-[#FEFEFE] border border-[#A4A4A9]/25">
                <h4 className="text-xs font-bold text-[#821F0C] dark:text-[#FEFEFE] m-0 mb-1">Operational Metrics</h4>
                <p className="text-[10px] text-[#A4A4A9] m-0 mb-4">Schools certified and teacher certifications by calendar year</p>
                <div className="h-44 w-full relative">
                  <canvas id="up-bar-year" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Auxiliary and Emergency Contact Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="p-5 bg-[#FEFEFE] border border-[#A4A4A9]/25">
          <Kicker text="Quick Access Panel" />
          <h3 className="text-sm font-bold text-[#460C04] dark:text-[#FEFEFE] mb-3 block">Navigation Actions</h3>
          <div className="space-y-2">
            <Btn onClick={() => setPage("submit")} full className="py-2.5">
              <FilePlus size={14} className="inline mr-1" /> {user ? "Submit session data" : "Report a Case"}
            </Btn>
            <Btn onClick={() => setPage("curriculum")} variant="secondary" full className="py-2.5">
              <BookOpen size={14} className="inline mr-1" /> View Curriculum
            </Btn>
            <Btn onClick={() => setPage("maps")} variant="ghost" full className="py-2.5">
              <Map size={14} className="inline mr-1" /> Explore maps
            </Btn>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-[#FF5206]/5 to-[#A1220B]/5 border border-[#FF5206]/15 hover:border-[#FF5206]/30 text-xs text-left relative overflow-hidden">
          <div className="absolute top-2 right-2 text-7xl opacity-5 select-none text-[#FF5206]"><Shield size={72} /></div>
          <h3 className="text-sm font-extrabold text-[#FF5206] uppercase mb-3 block animate-pulse">
            Support Hotline & Helpline
          </h3>
          <div className="space-y-2.5 text-[#821F0C] dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[#A1220B] shrink-0" />
              <span>
                <b>Child Helpline Malawi:</b> 116 <span className="text-[10px] text-[#A4A4A9] font-medium">(toll-free)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#FF5206] shrink-0" />
              <span><b>VSU Police Emergency:</b> 997 / 991</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[#A1220B] shrink-0" />
              <span><b>Ujamaa Pamodzi Helpline:</b> 0984 110 288</span>
            </div>
          </div>
        </Card>

        {/* Regions breakdown card */}
        <Card className="p-5 bg-[#FEFEFE] border border-[#A4A4A9]/25">
          <Kicker text="Territorial scope" />
          <h3 className="text-sm font-bold text-[#460C04] dark:text-[#FEFEFE] mb-3 block">Districts by Region</h3>
          <div className="space-y-3">
            {[
              { r: "Northern", active: "2/6", ds: ["Mzimba", "Karonga"] },
              { r: "Central", active: "8/9", ds: ["Lilongwe", "Dowa", "Kasungu", "Dedza"] },
              { r: "Southern", active: "5/13", ds: ["Blantyre", "Zomba", "Mangochi", "Machinga"] },
            ].map(g => (
              <div key={g.r} className="text-xs">
                <div className="flex justify-between items-center font-bold text-[#821F0C] dark:text-[#FEFEFE] mb-1.5 font-sans">
                  <span>{g.r} region</span>
                  <span className="text-[#FF5206] font-extrabold">{g.active} active</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {g.ds.map(d => (
                    <span
                      key={d}
                      onClick={() => setPage("districts")}
                      className="px-2 py-0.5 rounded bg-[#F6F6F6] hover:bg-[#FF5206]/15 text-[#FF5206] dark:bg-[#821F0C]/20 dark:text-[#FF5206] font-semibold cursor-pointer text-[10.5px] border border-[#FF5206]/20 transition"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
