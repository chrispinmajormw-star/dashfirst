import React from 'react';
import { Moon, Sun, Monitor, Shield, Sparkles, User as UserIcon, HelpCircle, Bell, Calendar, ListTodo, Clock } from 'lucide-react';
import { User } from '../types';
import { Card, Kicker, Btn } from './SubComponents';
import { ROLE_CFG } from '../data';
import { safeStorage } from '../utils/storage';

interface SettingsPageProps {
  user: User | null;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  showToast: (msg: string) => void;
  reportsCount: number;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  darkMode,
  setDarkMode,
  showToast,
  reportsCount
}) => {
  const rc = user ? ROLE_CFG[user.role] : null;

  const [notifyTraining, setNotifyTraining] = React.useState(() => {
    const saved = safeStorage.getItem('scaleup_notif_training');
    return saved !== null ? saved === 'true' : true;
  });

  const [notifyMeetings, setNotifyMeetings] = React.useState(() => {
    const saved = safeStorage.getItem('scaleup_notif_meetings');
    return saved !== null ? saved === 'true' : true;
  });

  const [weekStartMonday, setWeekStartMonday] = React.useState(() => {
    const saved = safeStorage.getItem('scaleup_week_monday');
    return saved !== null ? saved === 'true' : false;
  });

  const [taskReminders, setTaskReminders] = React.useState(() => {
    const saved = safeStorage.getItem('scaleup_task_reminders');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    showToast(`🌙 Dark mode turned ${nextVal ? 'ON' : 'OFF'}`);
  };

  const handleToggleTraining = () => {
    const next = !notifyTraining;
    setNotifyTraining(next);
    safeStorage.setItem('scaleup_notif_training', String(next));
    showToast(`🔔 Training event alerts turned ${next ? 'ON' : 'OFF'}`);
  };

  const handleToggleMeetings = () => {
    const next = !notifyMeetings;
    setNotifyMeetings(next);
    safeStorage.setItem('scaleup_notif_meetings', String(next));
    showToast(`🔔 Meeting alerts turned ${next ? 'ON' : 'OFF'}`);
  };

  const handleToggleWeekStart = () => {
    const next = !weekStartMonday;
    setWeekStartMonday(next);
    safeStorage.setItem('scaleup_week_monday', String(next));
    showToast(`📅 Calendar week start preference set to ${next ? 'Monday' : 'Sunday'}`);
  };

  const handleToggleReminders = () => {
    const next = !taskReminders;
    setTaskReminders(next);
    safeStorage.setItem('scaleup_task_reminders', String(next));
    showToast(`⏰ Task reminders turned ${next ? 'ON' : 'OFF'}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <Kicker text="Application Preferences" />
        <h1 className="text-2xl sm:text-3xl font-black text-[#460C04] dark:text-[#FEFEFE] leading-tight font-sans">
          System Settings
        </h1>
        <p className="text-sm text-[#A4A4A9] mt-1">
          Customize display parameters, interface layout options, and review account capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main preferences column */}
        <div className="md:col-span-2 space-y-5">
          {/* Theme card */}
          <Card className="p-6 bg-[#FEFEFE] border border-[#A4A4A9]/25">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 rounded-xl bg-[#FF5206]/10 text-[#FF5206]">
                <Sparkles size={20} />
              </span>
              <div>
                <h3 className="text-base font-bold text-[#460C04] dark:text-[#FEFEFE] m-0">
                  Appearance Theme
                </h3>
                <p className="text-xs text-[#A4A4A9] m-0">
                  Set the background contrast mode of the ScaleUp Dashboard.
                </p>
              </div>
            </div>

            <hr className="border-[#A4A4A9]/20 dark:border-[#821F0C] my-4" />

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F6F6F6] dark:bg-[#1a0a05] border border-[#A4A4A9]/25">
              <div className="flex items-center gap-3.5">
                {darkMode ? (
                  <Moon className="text-[#FF5206]" size={18} />
                ) : (
                  <Sun className="text-[#FF5206]" size={18} />
                )}
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#460C04] dark:text-[#FEFEFE]">
                    Dark Slate Environment
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#A4A4A9]">
                    Saves energy, reduces eye fatigue in dimly lit classrooms.
                  </div>
                </div>
              </div>

              {/* Beautiful custom Toggle Switch Component */}
              <button
                onClick={toggleDarkMode}
                id="theme-toggler-btn"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#FF5206]/30 ${
                  darkMode ? 'bg-[#FF5206]' : 'bg-[#A4A4A9]/40'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div
                onClick={() => { if (darkMode) setDarkMode(false); }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  !darkMode
                    ? 'border-[#FF5206] bg-[#FF5206]/5'
                    : 'border-[#A4A4A9]/25 dark:border-[#821F0C] bg-[#F6F6F6]/50 dark:bg-[#1a0a05]/30'
                }`}
              >
                <Sun size={24} className={!darkMode ? 'text-[#FF5206]' : 'text-[#A4A4A9]'} />
                <span className="text-xs font-bold mt-2 text-[#821F0C] dark:text-[#FEFEFE]">Light Slate</span>
              </div>
              <div
                onClick={() => { if (!darkMode) setDarkMode(true); }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  darkMode
                    ? 'border-[#FF5206] bg-[#FF5206]/5'
                    : 'border-[#A4A4A9]/25 dark:border-[#821F0C] bg-[#F6F6F6]/50 dark:bg-[#1a0a05]/30'
                }`}
              >
                <Moon size={24} className={darkMode ? 'text-[#FF5206]' : 'text-[#A4A4A9]'} />
                <span className="text-xs font-bold mt-2 text-[#821F0C] dark:text-[#FEFEFE]">Midnight Dark</span>
              </div>
            </div>
          </Card>

          {/* Operations & Alerts Card */}
          <Card className="p-6 bg-[#FEFEFE] border border-[#A4A4A9]/25">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-2 rounded-xl bg-[#FF5206]/10 text-[#FF5206]">
                <Bell size={20} />
              </span>
              <div>
                <h3 className="text-base font-bold text-[#460C04] dark:text-[#FEFEFE] m-0">
                  Operations & Calendar Alerts
                </h3>
                <p className="text-xs text-[#A4A4A9] m-0">
                  Set triggers for your scheduled school visits, events, and agenda layouts.
                </p>
              </div>
            </div>

            <hr className="border-[#A4A4A9]/20 dark:border-[#821F0C] my-4" />

            <div className="space-y-4">
              {/* Training Events Alert Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-[#A4A4A9]/20 dark:border-[#821F0C]/40">
                <div className="flex items-start gap-3">
                  <span className="p-1.5 rounded-lg bg-[#FF5206]/10 text-[#FF5206] mt-0.5">
                    <Calendar size={15} />
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#460C04] dark:text-[#FEFEFE]">
                      Training Events Alerts
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#A4A4A9]">
                      Get alert notifications for scheduled Trainer TOT and curriculum sessions.
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleTraining}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#FF5206]/30 ${
                    notifyTraining ? 'bg-[#FF5206]' : 'bg-[#A4A4A9]/40'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      notifyTraining ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Weekly Meetings Alert Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-[#A4A4A9]/20 dark:border-[#821F0C]/40">
                <div className="flex items-start gap-3">
                  <span className="p-1.5 rounded-lg bg-[#FF5206]/10 text-[#FF5206] mt-0.5">
                    <Clock size={15} />
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#460C04] dark:text-[#FEFEFE]">
                      Meeting Alerts
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#A4A4A9]">
                      Receive early reminders for regional officer coordinate syncs.
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleMeetings}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#FF5206]/30 ${
                    notifyMeetings ? 'bg-[#FF5206]' : 'bg-[#A4A4A9]/40'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      notifyMeetings ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Week Starts on Monday Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-[#A4A4A9]/20 dark:border-[#821F0C]/40">
                <div className="flex items-start gap-3">
                  <span className="p-1.5 rounded-lg bg-[#FF5206]/10 text-[#FF5206] mt-0.5">
                    <Calendar size={15} />
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#460C04] dark:text-[#FEFEFE]">
                      Week starts on Monday
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#A4A4A9]">
                      Arrange the Operation Calendar layout with Monday as the first day.
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleWeekStart}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#FF5206]/30 ${
                    weekStartMonday ? 'bg-[#FF5206]' : 'bg-[#A4A4A9]/40'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      weekStartMonday ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Task Reminders Toggle */}
              <div className="flex items-center justify-between py-2 font-sans">
                <div className="flex items-start gap-3">
                  <span className="p-1.5 rounded-lg bg-[#FF5206]/10 text-[#FF5206] mt-0.5">
                    <ListTodo size={15} />
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#460C04] dark:text-[#FEFEFE]">
                      Task Reminders
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#A4A4A9]">
                      Sync push or dashboard badges for pending operations list actions.
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleReminders}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#FF5206]/30 ${
                    taskReminders ? 'bg-[#FF5206]' : 'bg-[#A4A4A9]/40'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      taskReminders ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Diagnostics Card */}
          <Card className="p-6 bg-[#FEFEFE] border border-[#A4A4A9]/25 font-sans">
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 rounded-xl bg-[#FF5206]/10 text-[#FF5206]">
                <Monitor size={20} />
              </span>
              <div>
                <h3 className="text-base font-bold text-[#460C04] dark:text-[#FEFEFE] m-0">
                  Platform Diagnostics
                </h3>
                <p className="text-xs text-[#A4A4A9] m-0">
                  Synchronous system settings and workspace local stats.
                </p>
              </div>
            </div>

            <hr className="border-[#A4A4A9]/20 dark:border-[#821F0C] my-4" />

            <div className="space-y-3 text-xs text-[#821F0C] dark:text-[#A4A4A9]">
              <div className="flex justify-between py-1 border-b border-[#A4A4A9]/20 dark:border-[#821F0C]/40">
                <span className="text-[#A4A4A9] font-medium">Application Frame Type</span>
                <span className="font-bold text-[#821F0C] dark:text-[#FEFEFE]">React 19 + Vite Container</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#A4A4A9]/20 dark:border-[#821F0C]/40">
                <span className="text-[#A4A4A9] font-medium">Local Stored Cache</span>
                <span className="font-bold text-[#821F0C] dark:text-[#FEFEFE]">Active ({reportsCount} reports)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#A4A4A9]/20 dark:border-[#821F0C]/40">
                <span className="text-[#A4A4A9] font-medium">Service Environment</span>
                <span className="font-bold text-[#FF5206] dark:text-[#FF5206]">● LIVE RUNNING</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#A4A4A9] font-medium">Persistent Storage Engine</span>
                <span className="font-bold text-[#821F0C] dark:text-[#FEFEFE]">Local Storage Hook API</span>
              </div>
            </div>

            <Btn
              variant="secondary"
              size="sm"
              className="mt-5 w-full font-bold"
              onClick={() => {
                safeStorage.clear();
                showToast("♻️ Cached fields restored to factory defaults. Please refresh page.");
              }}
            >
              Clear Local Application Cache
            </Btn>
          </Card>
        </div>

        {/* Profile / Permission details block */}
        <div className="space-y-5">
          {/* User profile details */}
          <Card className="p-6 text-center bg-[#FEFEFE] border border-[#A4A4A9]/25 font-sans">
            <h3 className="text-sm font-extrabold text-[#A4A4A9] uppercase tracking-wider mb-4">
              Session Profile
            </h3>
            {user ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FF5206] text-[#FEFEFE] font-black text-2xl flex items-center justify-center shadow-lg mb-3">
                  {user.avatar}
                </div>
                <div className="font-extrabold text-[#460C04] dark:text-[#FEFEFE] text-base">
                  {user.name}
                </div>
                <div className="text-xs text-[#A4A4A9] mb-3">{user.email}</div>
                {rc && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ color: rc.color, backgroundColor: rc.bg }}
                  >
                    {rc.label}
                  </span>
                )}
                {user.district && (
                  <div className="text-xs text-[#A4A4A9] mt-2 font-semibold">
                    📍 Align: {user.district} Region
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#F6F6F6] dark:bg-[#1a0a05]/20 text-[#A4A4A9] flex items-center justify-center mb-3">
                  <UserIcon size={24} />
                </div>
                <div className="font-extrabold text-[#460C04] dark:text-[#FEFEFE] text-sm">
                  Public Guest Access
                </div>
                <p className="text-xs text-[#A4A4A9] mt-2 leading-relaxed">
                  Log in with credentials provided by your district lead as a Trainer or Officer.
                </p>
              </div>
            )}
          </Card>

          {/* Quick instructions card */}
          <Card className="p-5 bg-gradient-to-br bg-[#FF5206]/5 border-[#FF5206]/15 dark:border-[#821F0C]/10 relative overflow-hidden font-sans">
            <div className="flex items-center gap-2 text-[#FF5206] mb-2 font-bold">
              <HelpCircle size={16} />
              <span className="text-xs font-extrabold uppercase tracking-wide">Safeguarding Contact</span>
            </div>
            <p className="text-xs text-[#821F0C] dark:text-[#A4A4A9] leading-relaxed m-0">
              Need assistance using the Digital ScaleUp program? Contact the system admin or report issues via email:
            </p>
            <div className="text-xs font-bold text-[#FF5206] mt-2 hover:underline">
              support.pamodzi@ujamaa-africa.org
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
