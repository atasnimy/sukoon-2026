import React, { useState, useEffect } from "react";
import { 
  X, 
  Users, 
  Send, 
  Pin, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  Trash2
} from "lucide-react";
import { CommunityCircle, FamilyProfile } from "../types";
import { 
  subscribeToCircleMessages, 
  sendCircleMessageToFirestore, 
  CircleMessageDoc 
} from "../lib/firebase";

interface CircleModalProps {
  circle: CommunityCircle | null;
  userProfile: FamilyProfile;
  onClose: () => void;
  onToggleJoin: (circleId: string) => void;
  onDeleteCircle?: (circleId: string, circleTitle: string) => void;
}

export const CircleModal: React.FC<CircleModalProps> = ({
  circle,
  userProfile,
  onClose,
  onToggleJoin,
  onDeleteCircle
}) => {
  if (!circle) return null;

  const [realtimeMessages, setRealtimeMessages] = useState<CircleMessageDoc[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const isAdmin = userProfile?.role === "admin";

  const handleDelete = () => {
    if (!onDeleteCircle) return;
    if (window.confirm(`Are you sure you want to delete the support circle "${circle.title}"?`)) {
      onDeleteCircle(circle.id, circle.title);
      onClose();
    }
  };

  // Subscribe to circle messages in Firestore
  useEffect(() => {
    if (!circle.id) return;

    const unsubscribe = subscribeToCircleMessages(circle.id, (msgs) => {
      setRealtimeMessages(msgs);
    });

    return () => unsubscribe();
  }, [circle.id]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setIsPosting(true);
    try {
      await sendCircleMessageToFirestore(
        circle.id,
        userProfile.parentName || "Community Member",
        userProfile.parentName.charAt(0) || "U",
        newPostText.trim()
      );
      setNewPostText("");
    } catch (err) {
      console.error("Error posting to circle:", err);
    } finally {
      setIsPosting(false);
    }
  };

  // Combine initial sample messages with real-time firestore messages
  const displayMessages = [
    ...realtimeMessages.map(m => ({
      sender: m.sender,
      time: m.timeStr || "Just now",
      text: m.text,
      avatar: m.avatar || m.sender.charAt(0)
    })),
    ...circle.recentMessages
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-[32px] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 bg-[#3A5D54] text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/30">
                  {circle.category}
                </span>
                <span className="text-xs text-white/90 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {circle.memberCount} Families
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {circle.title}
              </h3>
              <p className="text-xs text-white/80 mt-0.5 max-w-lg">
                {circle.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              {isAdmin && onDeleteCircle && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-2 rounded-2xl text-xs font-semibold bg-rose-600/30 hover:bg-rose-600/50 text-rose-100 border border-rose-400/40 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Admin: Delete this Community Circle"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-200" />
                  <span>Delete Circle</span>
                </button>
              )}

              <button
                onClick={() => onToggleJoin(circle.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                  circle.isJoined
                    ? "bg-[#E9C46A] text-[#3A5D54] border-[#E9C46A] shadow-sm font-bold"
                    : "bg-white/20 hover:bg-white/30 text-white border-white/40 shadow-md"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{circle.isJoined ? "Member (Joined)" : "Join Circle"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pinned Tip Banner */}
        <div className="bg-[#E9C46A]/20 border-b border-[#E9C46A]/30 p-3.5 px-5 text-xs text-[#937217] flex items-start gap-2.5 shrink-0">
          <Pin className="w-4 h-4 text-[#937217] shrink-0 mt-0.5" />
          <div className="font-medium">{circle.pinnedTip}</div>
        </div>

        {/* Body / Feed */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-stone-50/50">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 border-b border-stone-200/80 pb-2">
            <span className="flex items-center gap-1.5 text-[#3A5D54]">
              <MessageSquare className="w-3.5 h-3.5 text-[#5A8B7D]" />
              Real-time Community Discussion (Database Synced)
            </span>
            <span>Schedule: {circle.meetingSchedule}</span>
          </div>

          {/* New Post Input */}
          <form onSubmit={handlePost} className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#5A8B7D]"
              placeholder={`Share a reflection or question with the ${circle.title} circle...`}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newPostText.trim() || isPosting}
                className="bg-[#5A8B7D] hover:bg-[#4a7569] disabled:opacity-50 text-white font-semibold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPosting ? "Posting..." : "Post Reflection"}</span>
              </button>
            </div>
          </form>

          {/* Message List */}
          <div className="space-y-3">
            {displayMessages.map((msg, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#5A8B7D]/15 text-[#5A8B7D] font-bold flex items-center justify-center text-sm shrink-0">
                  {msg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-stone-800">{msg.sender}</h5>
                    <span className="text-[10px] text-stone-400">{msg.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 bg-stone-100 border-t border-stone-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl transition-all cursor-pointer"
          >
            Close Discussion
          </button>
        </div>
      </div>
    </div>
  );
};
