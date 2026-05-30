import React, { useState } from 'react';
import { FileText, Send, Check, X, ShieldAlert, Edit2, CornerDownRight } from 'lucide-react';
import { User, Report } from '../types';
import { ROLE_CFG, can } from '../data';
import { Card, Kicker, FilterBar, TH, Pill, Badge, Btn, Modal, FInput, FSelect, FArea, OR } from './SubComponents';

// REPORT ROUTING WORKFLOW WORKER
export const REPORT_WORKFLOW = {
  tot: { sendTo: "district_coordinator", label: "District Coordinator" },
  viewer: { sendTo: "district_coordinator", label: "District Coordinator" },
  data_entry: { sendTo: "district_coordinator", label: "District Coordinator" },
  district_coordinator: { sendTo: "admin", label: "National Admin" },
  admin: { sendTo: null as any, label: "Final Recipient" },
};

export const getReportRecipient = (role: string) => {
  return (REPORT_WORKFLOW as any)[role] || { sendTo: "admin", label: "National Admin" };
};

interface ReportsPageProps {
  user: User;
  reports: Report[];
  onUpdateStatus: (id: number, status: 'approved' | 'rejected' | 'forwarded') => void;
  showToast: (msg: string) => void;
  onEditReport: (report: Report) => void;
  onForwardReport: (report: Report) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  user,
  reports,
  onUpdateStatus,
  showToast,
  onEditReport,
  onForwardReport
}) => {
  const [filt, setFilt] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [sel, setSel] = useState<Report | null>(null);

  const workflow = getReportRecipient(user.role);

  const visible = reports.filter(r => {
    if (user.role === "district_coordinator" && r.district !== user.district) return false;
    if ((user.role === "data_entry" || user.role === "tot") && r.submitted_by !== user.name) return false;
    if (filt !== "all" && r.status !== filt) return false;
    const q = search.toLowerCase();
    if (q && !r.school.toLowerCase().includes(q) && !r.district.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div>
        <Kicker text="Reporting Log" />
        <h1 className="text-2xl font-black text-[#460C04] dark:text-[#FEFEFE]">
          {user.role === "data_entry" ? "My Reports Dashboard" : "All Session Reports"}
        </h1>
        <p className="text-xs text-[#A4A4A9]">
          Monitor primary cluster attendances, SGBV compliance files, and school records.
        </p>
      </div>

      {/* Workflow banner */}
      <div className="bg-[#FF5206]/5 dark:bg-[#821F0C]/10 border border-[#FF5206]/20 dark:border-[#821F0C]/30 rounded-2xl p-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#FF5206] dark:text-[#FEFEFE]">
        <span>📋 Routing Channel:</span>
        {["tot", "viewer", "data_entry"].includes(user.role) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-[#FF5206] text-[#FEFEFE] px-2 py-0.5 rounded-full scale-95 font-bold">You</span>
            <CornerDownRight size={14} className="opacity-60" />
            <span className="bg-[#821F0C]/20 text-[#821F0C] dark:text-[#FEFEFE] px-2.5 py-0.5 rounded-full scale-95 font-bold">District Coordinator</span>
            <CornerDownRight size={14} className="opacity-60" />
            <span className="bg-[#A1220B]/20 text-[#A1220B] dark:text-[#FEFEFE] px-2.5 py-0.5 rounded-full scale-95 font-bold">Admin</span>
          </div>
        )}
        {user.role === "district_coordinator" && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-[#821F0C]/20 text-[#821F0C] dark:text-[#FEFEFE] px-2.5 py-0.5 rounded-full scale-95 font-bold">District Coordinator</span>
            <CornerDownRight size={14} className="opacity-60" />
            <span className="bg-[#A1220B]/20 text-[#A1220B] dark:text-[#FEFEFE] px-2.5 py-0.5 rounded-full scale-95 font-bold">National Admin</span>
          </div>
        )}
        {user.role === "admin" && (
          <span className="bg-[#A1220B]/20 text-[#A1220B] dark:text-[#FEFEFE] px-2.5 py-0.5 rounded-full scale-95 font-bold animate-pulse">
            National Admin — Full Overseer Recipient
          </span>
        )}
        {user.role === "data_entry" && (
          <span className="ml-auto text-[#A4A4A9] font-medium text-[11px] bg-[#F6F6F6] dark:bg-[#1a0a05] px-2 py-0.5 rounded">
            ✏️ Data Officer: Permissions enabled to modify files
          </span>
        )}
      </div>

      <Card className="bg-[#FEFEFE] border border-[#A4A4A9]/25">
        <FilterBar
          options={["all", "pending", "approved", "rejected", "forwarded"].map(x => ({
            v: x,
            l: `${x.charAt(0).toUpperCase() + x.slice(1)} (${reports.filter(r => x === "all" ? true : r.status === x).length})`
          }))}
          active={filt}
          onChange={setFilt}
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search school or district..."
        />

        <div className="overflow-x-auto rounded-xl border border-[#A4A4A9]/25 dark:border-[#821F0C]/60">
          <table className="w-full border-collapse text-left text-xs text-[#821F0C] dark:text-[#A4A4A9]">
            <TH cols={["School", "District", "Curriculum", "Session Conducted", "Students", "Status", "Sent To Alignment", "Actions"]} />
            <tbody>
              {visible.map(r => (
                <tr
                  key={r.id}
                  className="border-b border-[#A4A4A9]/20 dark:border-[#821F0C]/40 hover:bg-[#FF5206]/5 dark:hover:bg-[#FF5206]/10 transition-colors"
                >
                  <td className="p-3 font-bold text-[#460C04] dark:text-[#FEFEFE] whitespace-nowrap">{r.school}</td>
                  <td className="p-3 text-[#A4A4A9] font-medium">{r.district}</td>
                  <td className="p-3">
                    <Badge text={r.curriculum} bg="rgba(255, 82, 6, 0.12)" color="#FF5206" />
                  </td>
                  <td className="p-3 text-[#821F0C] dark:text-[#A4A4A9] max-w-[200px] truncate" title={r.session}>
                    {r.session}
                  </td>
                  <td className="p-3 font-semibold text-[#821F0C] dark:text-[#FEFEFE]">
                    {r.boys + r.girls} <span className="text-[10px] text-[#A4A4A9] font-normal">({r.boys}B / {r.girls}G)</span>
                  </td>
                  <td className="p-3">
                    <Pill s={r.status} />
                  </td>
                  <td className="p-3 text-[10.5px] text-[#A4A4A9] font-semibold italic">
                    {r.sentToLabel || "In Progress"}
                  </td>
                  <td className="p-3 text-xs">
                    <div className="flex flex-wrap gap-1">
                      <Btn size="sm" variant="ghost" onClick={() => setSel(r)}>
                        View
                      </Btn>
                      
                      {user.role === "data_entry" && (
                        <Btn
                          size="sm"
                          variant="ghost"
                          className="border-[#FF5206]/20 text-[#FF5206] bg-[#FF5206]/5 hover:bg-[#FF5206]/15 font-bold"
                          onClick={() => onEditReport(r)}
                        >
                          ✏️ Edit
                        </Btn>
                      )}

                      {can(user.role, "approveReport") && r.status === "pending" && (
                        <>
                          <button
                            onClick={() => { onUpdateStatus(r.id, "approved"); showToast("✅ Report approved"); }}
                            className="bg-[#FF5206] text-white rounded-lg p-1.5 hover:bg-[#A1220B] cursor-pointer w-7 h-7 flex items-center justify-center transition border-none"
                            title="Approve Report"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => { onUpdateStatus(r.id, "rejected"); showToast("Report rejected"); }}
                            className="bg-[#A1220B] text-white rounded-lg p-1.5 hover:bg-[#821F0C] cursor-pointer w-7 h-7 flex items-center justify-center transition border-none"
                            title="Reject Report"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}

                      {user.role === "district_coordinator" && r.status === "approved" && r.sentTo !== "admin" && (
                        <Btn
                          size="sm"
                          variant="ghost"
                          className="border-[#FF5206]/25 text-[#FF5206] bg-[#FF5206]/10 hover:bg-[#FF5206]/20 font-bold"
                          onClick={() => onForwardReport(r)}
                        >
                          Send Admin
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#A4A4A9] font-semibold selection:none">
                    <FileText className="mx-auto mb-2 opacity-30 text-[#A4A4A9]" size={32} />
                    No reports match the active state filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {sel && (
        <Modal title={`Session Submission Log: ${sel.school}`} onClose={() => setSel(null)}>
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs sm:text-sm bg-[#F6F6F6] dark:bg-[#1a0a05] p-4 rounded-2xl border border-[#A4A4A9]/20 dark:border-[#821F0C]">
            {[
              ["School", sel.school],
              ["District Domain", sel.district],
              ["Current Zone", sel.zone],
              ["Curriculum Alignment", sel.curriculum],
              ["Boys Attendance", sel.boys],
              ["Girls Attendance", sel.girls],
              ["Collective Attendance", sel.boys + sel.girls],
              ["Submitted By", sel.submitted_by],
              ["Submission Date", sel.submitted_at],
              ["Recipient Target", sel.sentToLabel || "Final Station"]
            ].map(([l, v]) => (
              <div key={l} className="space-y-0.5">
                <div className="text-[10px] font-extrabold text-[#A4A4A9] uppercase tracking-widest">{l}</div>
                <div className="font-bold text-[#821F0C] dark:text-[#FEFEFE]">{v}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-extrabold text-[#A4A4A9] uppercase tracking-widest mb-1.5">Executed Work details</div>
              <div className="text-xs text-[#821F0C] dark:text-[#A4A4A9] bg-[#F6F6F6] dark:bg-[#1a0a05] p-3 rounded-xl border border-[#A4A4A9]/25 dark:border-[#821F0C]">{sel.session}</div>
            </div>

            {sel.challenges && (
              <div>
                <div className="text-[10px] font-extrabold text-[#A4A4A9] uppercase tracking-widest mb-1.5">Challenges Identified</div>
                <div className="text-xs text-[#FF5206] bg-[#FF5206]/5 border border-[#FF5206]/15 dark:border-[#FF5206]/40 p-3 rounded-xl">
                  {sel.challenges}
                </div>
              </div>
            )}

            {sel.success && (
              <div>
                <div className="text-[10px] font-extrabold text-[#A4A4A9] uppercase tracking-widest mb-1.5">Field Success Records</div>
                <div className="text-xs text-[#A1220B] bg-[#A1220B]/5 border border-[#A1220B]/15 dark:border-[#821F0C]/40 p-3 rounded-xl">
                  {sel.success}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#A4A4A9]/25 dark:border-[#821F0C]">
            <Pill s={sel.status} />
            <div className="flex gap-2">
              {can(user.role, "approveReport") && sel.status === "pending" && (
                <>
                  <Btn
                    variant="success"
                    size="sm"
                    onClick={() => { onUpdateStatus(sel.id, "approved"); setSel(null); showToast("✅ Approved"); }}
                  >
                    Approve
                  </Btn>
                  <Btn
                    variant="danger"
                    size="sm"
                    onClick={() => { onUpdateStatus(sel.id, "rejected"); setSel(null); showToast("Report rejected"); }}
                  >
                    Reject
                  </Btn>
                </>
              )}
              {user.role === "district_coordinator" && sel.status === "approved" && sel.sentTo !== "admin" && (
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => { onForwardReport(sel); setSel(null); }}
                >
                  📨 Forward to Admin
                </Btn>
              )}
              {user.role === "data_entry" && (
                <Btn
                  variant="secondary"
                  size="sm"
                  onClick={() => { onEditReport(sel); setSel(null); }}
                >
                  ✏️ Edit Data
                </Btn>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
