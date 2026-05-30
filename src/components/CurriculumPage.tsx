import React, { useState } from 'react';
import { BookOpen, Award, Layers, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { Card, Kicker, Btn, Modal } from './SubComponents';
import { Session } from '../types';
import { HIM_SESSIONS, GESD_SESSIONS } from '../data';

export const CurriculumPage: React.FC = () => {
  const [tab, setTab] = useState<"him" | "gesd">("him");
  const [sel, setSel] = useState<Session | null>(null);

  const sessions = tab === "him" ? HIM_SESSIONS : GESD_SESSIONS;
  const ac = tab === "him" ? "text-[#FF5206]" : "text-[#A1220B]";
  const borderCol = tab === "him" ? "border-[#FF5206] bg-[#FF5206]" : "border-[#A1220B] bg-[#A1220B]";
  const abg = tab === "him" ? "bg-[#FF5206]/5 dark:bg-[#821F0C]/10" : "bg-[#A1220B]/5 dark:bg-[#821F0C]/10";
  const badgeCol = tab === "him" ? "bg-[#FF5206]/10 text-[#FF5206]" : "bg-[#A1220B]/10 text-[#A1220B]";
  const cardGradient = "from-[#460C04] to-[#821F0C] text-[#FEFEFE]";

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
      <div>
        <Kicker text="Digital Educational Panel" />
        <h1 className="text-2xl sm:text-3xl font-black text-[#460C04] dark:text-[#FEFEFE] leading-tight">
          Student Curriculums
        </h1>
        <p className="text-sm text-[#A4A4A9] mt-1">
          Explore structured lessons designed to empower girls and build constructive peer leadership among boys.
        </p>
      </div>

      <div className="flex border-b border-[#A4A4A9]/25 dark:border-[#821F0C]">
        {[
          ["him", "Hero in Me (HIM) — Boys"],
          ["gesd", "GESD — Girls"]
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k as any)}
            className={`px-5 py-3 text-xs sm:text-sm font-bold cursor-pointer transition-all border-b-[3px] -mb-[2px] ${
              tab === k
                ? `${ac} border-[#FF5206]`
                : "text-[#A4A4A9] border-transparent hover:text-[#FF5206]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Curriculum Banner */}
      <div className={`bg-gradient-to-br ${cardGradient} rounded-2xl p-6 text-white shadow-md relative overflow-hidden`}>
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5" />
        <div className="relative space-y-3">
          <h2 className="text-lg sm:text-xl font-black m-0 leading-tight">
            {tab === "him" ? "Hero in Me (HIM) Framework" : "Girls Empowerment & Safety Design (GESD)"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl m-0">
            {tab === "him"
              ? "Empowers boys to challenge traditional, harmful gender paradigms, cultivate healthy emotional awareness, practice non-violent communication, and safely Step Up as leaders in their surrounding schools."
              : "An SGBV prevention curriculum blending boundary assertiveness, psychological threat awareness, voice defense, and strategic self-defense maneuvers to build girls' confidence and security across Malawi."}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {(tab === "him" ? ["Boys Action", "6 Core Topics", "Bystander Steps", "Confidence & Care"] : ["Girls Action", "6 Core Sessions", "SMEVB Assertiveness", "Emergency Tools"]).map(t => (
              <span key={t} className="bg-white/10 dark:bg-black/25 text-white/90 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((s, i) => (
          <div
            key={i}
            onClick={() => setSel(s)}
            className="bg-[#FEFEFE] dark:bg-[#460C04] border border-[#A4A4A9]/25 dark:border-[#821F0C] rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1"
          >
            <div className="h-1 bg-slate-900 dark:bg-slate-950" style={{ backgroundColor: tab === 'him' ? '#FF5206' : '#A1220B' }} />
            
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${ac}`}>
                  {s.num}
                </div>
                <h3 className="text-sm font-bold text-[#460C04] dark:text-[#FEFEFE] line-clamp-1 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#821F0C] dark:text-[#A4A4A9] leading-relaxed line-clamp-3">
                  {s.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#A4A4A9]/20 dark:border-[#821F0C]/40 text-[10.5px]">
                <span className="text-[#A4A4A9] font-medium font-sans">Duration: {s.dur}</span>
                <span className={`px-2.5 py-0.5 rounded font-bold hover:opacity-90 ${badgeCol}`}>
                  Details →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <Modal title={`${sel.num}: ${sel.title}`} onClose={() => setSel(null)}>
          <div className="space-y-4 text-xs sm:text-sm text-[#821F0C] dark:text-[#A4A4A9]">
            <div className={`${abg} p-4 rounded-xl border border-[#A4A4A9]/20 dark:border-[#821F0C]`}>
              <div className="text-[10px] font-extrabold text-[#A4A4A9] dark:text-slate-400 uppercase tracking-widest mb-1">
                Lesson Concept Summary
              </div>
              <p className="text-[#821F0C] dark:text-[#FEFEFE] m-0 leading-relaxed italic">
                "{sel.desc}"
              </p>
            </div>

            <div className="flex gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeCol}`}>
                Duration: {sel.dur}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F6F6F6] dark:bg-[#1a0a05] text-[#821F0C] dark:text-[#A4A4A9]">
                Type: Age-Appropriate GBV Prevention
              </span>
            </div>

            {sel.pledge !== null && (
              <div>
                <div className="text-[10px] font-extrabold text-[#A4A4A9] uppercase tracking-widest mb-1.5">
                  Classroom Pledge / Chant
                </div>
                <div className="bg-[#F6F6F6] dark:bg-[#1a0a05] p-4 rounded-xl border-l-[3px] border-[#FF5206] font-medium italic text-[#821F0C] dark:text-[#FEFEFE] space-y-1">
                  {sel.pledge.split("/").map((line, idx) => (
                    <div key={idx} className="leading-snug">{line.trim()}</div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] font-extrabold text-[#A4A4A9] uppercase tracking-widest mb-2">
                Learning Objectives / Targets
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#821F0C] dark:text-[#A4A4A9] m-0">
                {sel.objectives.map((obj, i) => (
                  <li key={i} className="leading-relaxed">
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-[10px] text-[#A4A4A9] mt-4 leading-relaxed flex items-start gap-1">
              <HelpCircle size={14} className="shrink-0 text-[#A4A4A9] mt-0.5" />
              <span>
                All lessons comply with Malawi's National Primary School Curriculum safe space protocols.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
