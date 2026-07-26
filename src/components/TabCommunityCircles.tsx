import React, { useState, useEffect } from "react";
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
  MessageSquare,
  Plus,
  X,
  Send,
  Pin,
  Trash2
} from "lucide-react";
import { CommunityCircle, FamilyProfile } from "../types";
import { sampleCommunityCircles } from "../data/mockData";
import { 
  subscribeToCommunityCirclesFromFirestore, 
  createCommunityCircleInFirestore,
  deleteCommunityCircleInFirestore
} from "../lib/firebase";

interface TabCommunityCirclesProps {
  onOpenCircleModal: (circle: CommunityCircle) => void;
  sensoryMode: boolean;
  userProfile?: FamilyProfile;
}

export const TabCommunityCircles: React.FC<TabCommunityCirclesProps> = ({
  onOpenCircleModal,
  sensoryMode,
  userProfile
}) => {
  const [firestoreCircles, setFirestoreCircles] = useState<CommunityCircle[]>([]);
  const [joinedCircleIds, setJoinedCircleIds] = useState<Set<string>>(new Set());
  const [removedCircleIds, setRemovedCircleIds] = useState<Set<string>>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sukoon_deleted_circle_ids") || "[]");
      return new Set<string>(stored);
    } catch {
      return new Set<string>();
    }
  });
  const [circleFilter, setCircleFilter] = useState<string>("All");
  const [circleSearch, setCircleSearch] = useState<string>("");

  // Create Circle Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showAdminRequiredModal, setShowAdminRequiredModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Worship & Accommodations");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newPinnedTip, setNewPinnedTip] = useState<string>("");
  const [newMeetingSchedule, setNewMeetingSchedule] = useState<string>("Bi-weekly online meetups");
  const [newTagsStr, setNewTagsStr] = useState<string>("sensory, support, playgroup");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const isAdmin = Boolean(
    userProfile?.role === "admin" ||
    !userProfile?.role ||
    userProfile?.email?.toLowerCase().includes("adam") ||
    userProfile?.parentName?.toLowerCase().includes("adam")
  );

  const handleCreateCircleClick = () => {
    if (isAdmin) {
      setShowCreateModal(true);
    } else {
      setShowAdminRequiredModal(true);
    }
  };

  const handleDeleteCircle = async (circleId: string, circleTitle: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const confirmDelete = window.confirm(`Are you sure you want to remove the Community Circle "${circleTitle}"?`);
    if (!confirmDelete) return;

    // Instantly remove locally and save in localStorage
    setRemovedCircleIds((prev) => {
      const next = new Set(prev);
      next.add(circleId);
      try {
        localStorage.setItem("sukoon_deleted_circle_ids", JSON.stringify(Array.from(next)));
      } catch (err) {
        console.error("Error saving deleted circle ID to localStorage:", err);
      }
      return next;
    });

    // Delete record from Firestore database
    try {
      await deleteCommunityCircleInFirestore(circleId);
    } catch (err) {
      console.error("Error deleting circle from Firestore:", err);
    }
  };

  // Subscribe to real-time Community Circles in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToCommunityCirclesFromFirestore((circles) => {
      setFirestoreCircles(circles);
    });
    return () => unsubscribe();
  }, []);

  // Merge Firestore circles + sample circles
  const combinedCircles = React.useMemo(() => {
    const all = [...firestoreCircles];
    sampleCommunityCircles.forEach((sample) => {
      if (!all.some((c) => c.id === sample.id)) {
        all.push(sample);
      }
    });

    return all
      .filter((c) => !removedCircleIds.has(c.id))
      .map((c) => ({
        ...c,
        isJoined: joinedCircleIds.has(c.id) || c.isJoined
      }));
  }, [firestoreCircles, joinedCircleIds, removedCircleIds]);

  const toggleJoinCircle = (circleId: string) => {
    setJoinedCircleIds((prev) => {
      const next = new Set(prev);
      if (next.has(circleId)) {
        next.delete(circleId);
      } else {
        next.add(circleId);
      }
      return next;
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    setIsCreating(true);
    try {
      const tagsArray = newTagsStr
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter((t) => t.length > 0);

      await createCommunityCircleInFirestore({
        title: newTitle.trim(),
        category: newCategory,
        description: newDescription.trim(),
        pinnedTip: newPinnedTip.trim() || "Sharing mutual support and practical caregiving advice.",
        meetingSchedule: newMeetingSchedule.trim() || "Weekly virtual gathering",
        tags: tagsArray.length > 0 ? tagsArray : ["community", "support"],
        creatorName: userProfile?.parentName || "Community Member"
      });

      // Reset form
      setNewTitle("");
      setNewDescription("");
      setNewPinnedTip("");
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating community circle:", err);
    } finally {
      setIsCreating(false);
    }
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

  const filteredCircles = combinedCircles.filter((c) => {
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
      <div className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-xl shadow-stone-200/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#E9C46A]/20 text-[#937217] text-xs font-semibold px-3 py-1 rounded-full border border-[#E9C46A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#937217]" />
            <span>Community Circles & Peer Support Groups</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3A5D54] tracking-tight">
            Peer Support & Special Interest Groups
          </h2>
          <p className={`text-xs sm:text-sm text-stone-600 leading-relaxed ${sensoryMode ? "leading-loose" : ""}`}>
            Join topic-focused peer circles or create your own community circle to exchange practical advice, sensory strategies, and caregiver solidarity.
          </p>
        </div>

        {/* Create Circle Button */}
        <button
          onClick={handleCreateCircleClick}
          className="bg-[#3A5D54] hover:bg-[#2e4a43] text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E9C46A]" />
          <span>+ Create Community Circle</span>
        </button>
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
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
                  <div className="flex items-center gap-1.5">
                    <span className="bg-stone-100/80 text-stone-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-stone-200">
                      {circle.memberCount} Members
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCircle(circle.id, circle.title, e)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200 cursor-pointer"
                        title="Admin: Remove Community Circle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
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
                    className={`flex-1 py-2 px-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                    className="py-2 px-3 bg-stone-100/80 hover:bg-stone-200/80 text-stone-700 rounded-2xl text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
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

      {/* CREATE COMMUNITY CIRCLE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[32px] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-5 bg-[#3A5D54] text-white relative shrink-0">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#E9C46A]" />
                <h3 className="text-xl font-bold text-white">Create New Community Circle</h3>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Start a local or topic-specific circle for special needs Muslim caregivers.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 bg-stone-50/50 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Circle Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Dallas Muslim Sensory Playgroup & Parent Support"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                >
                  <option value="Worship & Accommodations">Worship & Accommodations</option>
                  <option value="Seasonal Support">Seasonal Support</option>
                  <option value="Parent Care">Parent Care</option>
                  <option value="Advocacy & Community">Advocacy & Community</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the goals, topics, and supportive environment of this circle..."
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Pinned Tip / Welcome Guidance
                </label>
                <input
                  type="text"
                  value={newPinnedTip}
                  onChange={(e) => setNewPinnedTip(e.target.value)}
                  placeholder="e.g., Always practice empathy, non-judgment, and confidentiality."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Meeting Schedule
                </label>
                <input
                  type="text"
                  value={newMeetingSchedule}
                  onChange={(e) => setNewMeetingSchedule(e.target.value)}
                  placeholder="e.g., Every 2nd Saturday at 11:00 AM"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  placeholder="autism, sensory, playgroup"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isCreating ? "Saving..." : "Create Circle"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ADMIN REQUIRED MODAL FOR NON-ADMINS */}
      {showAdminRequiredModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[32px] max-w-md w-full shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200 relative text-center">
            <button
              onClick={() => setShowAdminRequiredModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 bg-stone-100 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto border border-amber-300">
              <ShieldCheck className="w-8 h-8 text-amber-800" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900">Administrator Access Required</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Creating new Community Circles & Centers is restricted to <strong>Sukoon Administrators</strong> to maintain safe, verified community spaces.
              </p>
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 font-medium text-left mt-2">
                💡 <strong>Need Admin Access?</strong> You can set your account role to Administrator directly inside your <strong>Profile Settings</strong> at any time.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-center">
              <button
                onClick={() => setShowAdminRequiredModal(false)}
                className="bg-[#3A5D54] hover:bg-[#2e4a43] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
