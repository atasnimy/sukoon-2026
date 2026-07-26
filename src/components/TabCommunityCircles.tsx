import React, { useState } from "react";
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Compass, 
  Moon, 
  HeartHandshake, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  BookOpen, 
  Sparkles,
  MessageSquare
} from "lucide-react";
import { CommunityCircle } from "../types";
import { sampleCommunityCircles } from "../data/mockData";

interface TabCommunityCirclesProps {
  onOpenCircleModal: (circle: CommunityCircle) => void;
  sensoryMode: boolean;
}

export const TabCommunityCircles: React.FC<TabCommunityCirclesProps> = ({
  onOpenCircleModal,
  sensoryMode
}) => {
  const [circles, setCircles] = useState<CommunityCircle[]>(sampleCommunityCircles);
  const [circleFilter, setCircleFilter] = useState<string>("All");
  const [circleSearch, setCircleSearch] = useState<string>("");

  const toggleJoinCircle = (circleId: string) => {
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id === circleId) {
          const nextState = !c.isJoined;
          return {
            ...c,
            isJoined: nextState,
            memberCount: nextState ? c.memberCount + 1 : c.memberCount - 1
          };
        }
        return c;
      })
    );
  };

  const getCircleIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass": return <Compass className="w-5 h-5 text-[#5A8B7D]" />;
      case "Moon": return <Moon className="w-5 h-5 text-[#937217]" />;
      case "HeartHandshake": return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case "ShieldCheck": return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case "UserCheck": return <UserCheck className="w-5 h-5 text-teal-600" />;
      case "Building2": return <Building2 className="w-5 h-5 text-indigo-600" />;
      case "BookOpen": return <BookOpen className="w-5 h-5 text-[#5A8B7D]" />;
      default: return <Users className="w-5 h-5 text-[#5A8B7D]" />;
    }
  };

  const categories = [
    "All", 
    "Worship & Accommodations", 
    "Seasonal Support", 
    "Parent Care", 
    "Advocacy & Community", 
    "Education"
  ];

  const filteredCircles = circles.filter((c) => {
    const matchesCat = circleFilter === "All" || c.category === circleFilter;
    const matchesSearch = 
      c.title.toLowerCase().includes(circleSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(circleSearch.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(circleSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Intro Hero Banner */}
      <div className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-xl shadow-stone-200/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#E9C46A]/20 text-[#937217] text-xs font-semibold px-3 py-1 rounded-full border border-[#E9C46A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#937217]" />
            <span>Community Circles & Peer Support Groups</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3A5D54] tracking-tight">
            Peer Support & Special Interest Groups
          </h2>
          <p className={`text-xs sm:text-sm text-stone-600 leading-relaxed ${sensoryMode ? "leading-loose" : ""}`}>
            Join topic-focused peer circles to exchange practical advice, sensory prayer strategies, Ramadan coping guides, and warm caregiver solidarity.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <section className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-xl shadow-stone-200/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-stone-800">
                Explore Support Circles
              </h3>
              <span className="bg-[#E9C46A]/20 text-[#937217] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#E9C46A]/40">
                {filteredCircles.length} Active Circles
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Filter by topic or search for specific concerns and schedules.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={circleSearch}
              onChange={(e) => setCircleSearch(e.target.value)}
              placeholder="Search circles or tags..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl border-none bg-stone-100/60 text-xs focus:ring-2 focus:ring-[#5A8B7D]"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCircleFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                circleFilter === cat
                  ? "bg-[#5A8B7D] text-white font-semibold shadow-sm"
                  : "bg-stone-200/50 hover:bg-stone-300/50 text-stone-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Circles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCircles.map((circle) => (
            <div
              key={circle.id}
              className={`border rounded-[28px] p-5 space-y-4 flex flex-col justify-between transition-all duration-200 ${
                circle.isJoined
                  ? "bg-[#5A8B7D]/10 border-[#5A8B7D]/40 shadow-sm"
                  : "bg-white/80 border-stone-200/80 hover:border-[#5A8B7D]"
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#5A8B7D]/10 flex items-center justify-center shrink-0">
                    {getCircleIcon(circle.iconName)}
                  </div>
                  <span className="bg-stone-100/80 text-stone-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-stone-200">
                    {circle.memberCount} Members
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#5A8B7D] uppercase tracking-wider block">
                    {circle.category}
                  </span>
                  <h4 className="text-base font-bold text-stone-800 mt-0.5">
                    {circle.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-3">
                    {circle.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {circle.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-100/80 text-stone-500 text-[10px] px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-stone-200/50 space-y-2">
                <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                  <span>📅</span>
                  <span>{circle.meetingSchedule}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleJoinCircle(circle.id)}
                    className={`flex-1 py-2 px-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      circle.isJoined
                        ? "bg-[#E9C46A] text-[#3A5D54] font-bold shadow-sm"
                        : "bg-[#5A8B7D] hover:bg-[#4a7569] text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{circle.isJoined ? "Joined Circle" : "Join Circle"}</span>
                  </button>

                  <button
                    onClick={() => onOpenCircleModal(circle)}
                    className="py-2 px-3 bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 rounded-2xl text-xs font-medium transition-all flex items-center gap-1"
                    title="View discussion board"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#5A8B7D]" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
