import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Car,
  Wrench,
  CheckCircle2,
  Check,
  Sparkles,
  Phone,
  MessageSquare,
  ChevronRight,
  Info,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export interface ServiceStage {
  id: string;
  stepNumber: number;
  label: string;
  shortDesc: string;
  detailedDesc: string;
  icon: React.ElementType;
  estimatedWindow?: string;
  technicianChecklist: string[];
}

interface ServiceProgressStepperProps {
  currentStepIndex: number; // 0 to 4
  status: string;
  statusLabel?: string;
  trackingId?: string;
  customerName?: string;
  technicianName?: string;
  technicianPhone?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  area?: string;
  onWhatsAppClick?: () => void;
}

export const ServiceProgressStepper: React.FC<ServiceProgressStepperProps> = ({
  currentStepIndex,
  status,
  statusLabel,
  trackingId = '',
  customerName = '',
  technicianName = 'Safiullah',
  technicianPhone = '+92 327 5226107',
  scheduledDate,
  scheduledTime,
  area,
  onWhatsAppClick,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(currentStepIndex);

  const stages: ServiceStage[] = [
    {
      id: 'request_logged',
      stepNumber: 1,
      label: 'Request Received',
      shortDesc: 'Logged in system & initial review',
      detailedDesc:
        'Your computer repair request has been logged in our dispatch database. Our lead technician reviews your issue description, hardware brand, and prepares specialized diagnostic tools and replacement parts.',
      icon: Clock,
      estimatedWindow: 'Within 15–30 mins',
      technicianChecklist: [
        'Hardware specs & symptoms reviewed',
        'Necessary tools, thermal paste & USB drives staged',
        'Queued for direct contact verification',
      ],
    },
    {
      id: 'scheduled_confirmed',
      stepNumber: 2,
      label: 'Schedule Confirmed',
      shortDesc: 'Arrival time slot & address locked',
      detailedDesc:
        'Technician has verified your request details and scheduled your arrival slot. You will receive a direct call or WhatsApp message to confirm the exact street/house address before travel.',
      icon: Calendar,
      estimatedWindow: scheduledDate && scheduledTime ? `${scheduledDate} • ${scheduledTime}` : 'Date & Time Confirmed',
      technicianChecklist: [
        'Customer phone & WhatsApp verified',
        'Exact locality in Peshawar mapped',
        'Time slot locked in technician calendar',
      ],
    },
    {
      id: 'en_route',
      stepNumber: 3,
      label: 'Technician En Route',
      shortDesc: 'Travelling to your home or office',
      detailedDesc:
        `Technician ${technicianName} is on the way to your specified location in ${area || 'Peshawar'}. Travel time is typically 20–45 minutes depending on traffic.`,
      icon: Car,
      estimatedWindow: 'Active Dispatch',
      technicianChecklist: [
        'Toolkits & portable testing monitors packed',
        'Transit to customer locality initiated',
        'Pre-arrival SMS / call upon arrival nearby',
      ],
    },
    {
      id: 'on_site_repair',
      stepNumber: 4,
      label: 'On-Site Repair',
      shortDesc: 'Diagnosis, fixes & hardware testing',
      detailedDesc:
        'Technician is actively working on your system at your desk or home. Testing thermal parameters, cleaning dust, replacing SSD/RAM, or reinstalling clean licensed Windows OS.',
      icon: Wrench,
      estimatedWindow: '45–90 mins depending on service',
      technicianChecklist: [
        'Physical diagnosis & component inspection',
        'OS setup, drivers & software optimization',
        'Data safety & stability stress-test',
      ],
    },
    {
      id: 'completed_tested',
      stepNumber: 5,
      label: 'Tested & Verified',
      shortDesc: 'Verified by customer & payment',
      detailedDesc:
        'The repair is complete! You test the computer on your home or office Wi-Fi, verify full speed and sound, and only pay on-site when 100% satisfied. No advance fees required.',
      icon: CheckCircle2,
      estimatedWindow: 'Job Finalized',
      technicianChecklist: [
        'Customer hands-on testing on local network',
        'Technician warranty & receipt issued',
        'On-site payment finalized (Cash or EasyPaisa/JazzCash)',
      ],
    },
  ];

  // Clamp current step between 0 and 4
  const activeStep = Math.max(0, Math.min(stages.length - 1, currentStepIndex));
  const activeStage = stages[activeStep];
  const viewedStage = stages[selectedStageIndex] || activeStage;

  // Percentage calculation for progress bar
  // 0 -> 10%, 1 -> 35%, 2 -> 60%, 3 -> 85%, 4 -> 100%
  const progressPercentages = [15, 38, 62, 85, 100];
  const currentProgressPercent = progressPercentages[activeStep];

  return (
    <div className="space-y-6">
      {/* Main Progress Stepper Container */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Stepper Header Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Live Service Progress</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Stage {activeStep + 1} of 5:</span>
              <span className="text-blue-400">{activeStage.label}</span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700/80 px-3.5 py-2 rounded-2xl flex items-center gap-3 shadow-inner">
              <div className="text-right">
                <div className="text-[11px] text-slate-400 uppercase font-mono">Completion</div>
                <div className="text-sm font-bold text-white font-mono">{currentProgressPercent}%</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Visual Progress Bar */}
        <div className="mt-8 mb-6 relative z-10">
          <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-blue-500/50"
              style={{ width: `${currentProgressPercent}%` }}
            />
          </div>
        </div>

        {/* 5-Stage Step Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
          {stages.map((st, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isUpcoming = idx > activeStep;
            const isSelected = idx === selectedStageIndex;
            const Icon = st.icon;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStageIndex(idx)}
                className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative group ${
                  isSelected
                    ? 'ring-2 ring-blue-400/80 shadow-lg shadow-blue-500/20'
                    : ''
                } ${
                  isCurrent
                    ? 'bg-blue-950/60 border-blue-500/80 shadow-md shadow-blue-900/30'
                    : isDone
                    ? 'bg-emerald-950/30 border-emerald-800/60 hover:border-emerald-700/80'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-90'
                }`}
              >
                {/* Current Stage Pulse Indicator */}
                {isCurrent && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                  </span>
                )}

                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-extrabold transition-transform group-hover:scale-105 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>

                  <Icon
                    className={`w-4 h-4 ${
                      isDone
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-blue-400'
                        : 'text-slate-600'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <div
                    className={`text-xs sm:text-sm font-bold tracking-tight line-clamp-1 ${
                      isDone
                        ? 'text-emerald-300'
                        : isCurrent
                        ? 'text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {st.shortDesc}
                  </div>
                </div>

                {/* Stage Tag */}
                <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={`${
                      isDone
                        ? 'text-emerald-400 font-semibold'
                        : isCurrent
                        ? 'text-blue-400 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {isDone ? 'Completed' : isCurrent ? 'Active Now' : 'Upcoming'}
                  </span>
                  <span className="text-slate-400">Step {idx + 1}/5</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Deep-Dive Card */}
        <div className="mt-6 pt-6 border-t border-slate-800 relative z-10">
          <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-slate-800/90 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedStageIndex < activeStep
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : selectedStageIndex === activeStep
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <viewedStage.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-slate-400">
                      Stage {viewedStage.stepNumber} Details
                    </span>
                    {selectedStageIndex === activeStep && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Current Status
                      </span>
                    )}
                    {selectedStageIndex < activeStep && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Done
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white">{viewedStage.label}</h4>
                </div>
              </div>

              {viewedStage.estimatedWindow && (
                <div className="text-xs text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 self-start sm:self-auto font-mono">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{viewedStage.estimatedWindow}</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {viewedStage.detailedDesc}
            </p>

            {/* Checklist items for this stage */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Technician Standard Checklist For This Stage:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {viewedStage.technicianChecklist.map((item, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        selectedStageIndex <= activeStep ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Technician Contact Strip inside Stepper */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Technician Assigned: <strong className="text-white">{technicianName}</strong> ({technicianPhone})
                </span>
              </div>

              {onWhatsAppClick && (
                <button
                  type="button"
                  onClick={onWhatsAppClick}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ask Technician For Live Update</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
