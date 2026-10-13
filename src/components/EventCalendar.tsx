import React, { useState, useEffect } from 'react';
import { GAME_EVENTS, type GameEvent } from '../data/events';
import { Clock, Calendar, Shield, Swords, Gift, Sparkles, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EventTimingState {
  status: 'active' | 'upcoming';
  timeRemainingStr: string;
  nextStartTimeLocal: string;
  nextEndTimeLocal: string;
}

function calculateEventTiming(event: GameEvent, now: Date): EventTimingState {
  const currentUtcDay = now.getUTCDay();
  const currentUtcHours = now.getUTCHours();
  const currentUtcMinutes = now.getUTCMinutes();
  const currentUtcSeconds = now.getUTCSeconds();
  const currentUtcTotalSec = currentUtcHours * 3600 + currentUtcMinutes * 60 + currentUtcSeconds;

  const startSec = event.scheduleUtc.hourUtc * 3600 + event.scheduleUtc.minuteUtc * 60;
  const durationSec = event.scheduleUtc.durationHours * 3600;
  const endSec = startSec + durationSec;

  const isDayMatch = !event.scheduleUtc.daysOfWeek || event.scheduleUtc.daysOfWeek.includes(currentUtcDay);

  let isActive = false;
  let diffSec = 0;
  let targetDate = new Date(now);

  if (isDayMatch && currentUtcTotalSec >= startSec && currentUtcTotalSec < endSec) {
    isActive = true;
    diffSec = endSec - currentUtcTotalSec;
  } else {
    // Find next upcoming occurrence
    let daysAhead = 0;
    while (daysAhead < 14) {
      const checkDay = (currentUtcDay + daysAhead) % 7;
      const validDay = !event.scheduleUtc.daysOfWeek || event.scheduleUtc.daysOfWeek.includes(checkDay);

      if (validDay) {
        if (daysAhead === 0 && currentUtcTotalSec < startSec) {
          diffSec = startSec - currentUtcTotalSec;
          break;
        } else if (daysAhead > 0) {
          const secUntilMidnight = 86400 - currentUtcTotalSec;
          const fullDaysSec = (daysAhead - 1) * 86400;
          diffSec = secUntilMidnight + fullDaysSec + startSec;
          break;
        }
      }
      daysAhead++;
    }
  }

  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = Math.floor(diffSec % 60);

  const timeRemainingStr = `${h}h ${m}m ${s < 10 ? '0' : ''}${s}s`;

  // Local start/end formatted
  const startDate = new Date(now.getTime() + (isActive ? -(currentUtcTotalSec - startSec) * 1000 : diffSec * 1000));
  const endDate = new Date(startDate.getTime() + durationSec * 1000);

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

  return {
    status: isActive ? 'active' : 'upcoming',
    timeRemainingStr,
    nextStartTimeLocal: timeFormatter.format(startDate),
    nextEndTimeLocal: timeFormatter.format(endDate),
  };
}

export default function EventCalendar() {
  const [filter, setFilter] = useState<'all' | 'daily' | 'guild' | 'pvp' | 'boss'>('all');
  const [now, setNow] = useState(new Date());
  const [timeZoneName, setTimeZoneName] = useState<string>('UTC');

  useEffect(() => {
    try {
      setTimeZoneName(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setTimeZoneName('Local');
    }

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = GAME_EVENTS.filter((e) => {
    if (filter === 'all') return true;
    return e.category === filter;
  });

  const getCategoryBadge = (cat: GameEvent['category']) => {
    switch (cat) {
      case 'daily':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'guild':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'pvp':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'boss':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                Live Sync Engine
              </span>
              <span className="text-xs text-slate-400">
                Your Timezone: <strong className="text-white">{timeZoneName}</strong>
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Event Timers & Weekly Reset Calendar
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Never miss daily tavern resets, Castle Ruins rallies, or high-stakes weekend Guild War sieges. All countdowns and start windows automatically convert to your local clock.
            </p>
          </div>

          {/* Current Local & UTC Clocks */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
            <div className="text-center px-4 border-r border-slate-800">
              <div className="text-xl font-black text-white font-mono">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                Local Time
              </div>
            </div>
            <div className="text-center px-4">
              <div className="text-xl font-black text-amber-400 font-mono">
                {now.toUTCString().slice(17, 25)} <span className="text-xs text-amber-400/80">UTC</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                Game Server Time
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'daily'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Daily Resets
          </button>
          <button
            onClick={() => setFilter('guild')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'guild'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Guild & Rallies
          </button>
          <button
            onClick={() => setFilter('boss')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'boss'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            World Bosses
          </button>
          <button
            onClick={() => setFilter('pvp')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'pvp'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            PvP & KvK
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const timing = calculateEventTiming(event, now);
          const isActive = timing.status === 'active';

          return (
            <div
              key={event.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all backdrop-blur-md ${
                isActive
                  ? 'bg-slate-900/90 border-emerald-500/60 shadow-xl shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Event Status & Category Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getCategoryBadge(event.category)}`}>
                    {event.category}
                  </span>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Live Now!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Upcoming
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-white mb-1.5">{event.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {event.description}
                </p>

                {/* Live Countdown Clock Card */}
                <div className={`p-4 rounded-2xl border mb-5 ${
                  isActive
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                    {isActive ? 'Ends In:' : 'Starts In:'}
                  </div>
                  <div className={`text-2xl font-black font-mono tracking-tight ${isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {timing.timeRemainingStr}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 flex justify-between">
                    <span>Local Start:</span>
                    <strong className="text-slate-200">{timing.nextStartTimeLocal}</strong>
                  </div>
                </div>

                {/* Key Rewards */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-2">
                    <Gift className="w-3 h-3 text-amber-400" />
                    Key Rewards:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {event.rewards.map((rew, i) => (
                      <span key={i} className="text-[11px] bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-slate-300 font-medium">
                        {rew}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strategy Tip Accordion / Box */}
              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Pro Tip:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{event.tips[0]}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

