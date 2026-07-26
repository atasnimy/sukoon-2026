import React, { useState } from "react";
import { X, Send, Heart, CheckCircle2, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { MatchedFamily, FamilyProfile } from "../types";

interface ConnectModalProps {
  family: MatchedFamily | null;
  userProfile: FamilyProfile;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  family,
  userProfile,
  onClose
}) => {
  if (!family) return null;

  const [messageText, setMessageText] = useState(
    `Assalamu Alaikum ${family.parentNames}! We noticed our children share similar ages (${family.childAge}) and needs. We'd love to connect for quiet playdates or support!`
  );
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSent(true);
  };

  const quickTemplates = [
    `Assalamu Alaikum! Saw that you also attend ${family.nearbyMosque}. Would love to coordinate quiet Jumuah seating sometime!`,
    `Salaam! Our family is also navigating ${family.supportNeeds[0] || "special needs"}. It would be wonderful to share tips and connect.`,
    `Assalamu Alaikum! Seeking friendly playgroup connections in our area. Let us know if you'd like to chat!`
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel border border-white/80 rounded-[32px] max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className={`p-5 bg-gradient-to-r ${family.bgGradient} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg border border-white/30">
              {family.avatarInitials}
            </div>
            <div>
              <span className="bg-[#E9C46A] text-[#3A5D54] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                {family.matchScore}% Compatibility Match
              </span>
              <h3 className="text-xl font-bold mt-0.5">{family.familyTitle}</h3>
              <p className="text-xs text-white/90">Parents: {family.parentNames} • {family.distance}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#5A8B7D]/20 text-[#5A8B7D] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-stone-800">Connection Request Sent!</h4>
                <p className="text-sm text-stone-600 mt-1 max-w-sm mx-auto">
                  Assalamu Alaikum! Your warm introduction has been delivered privately to {family.parentNames}. You will receive a notification when they reply.
                </p>
              </div>

              <div className="bg-[#5A8B7D]/10 border border-[#5A8B7D]/30 rounded-2xl p-4 text-left text-xs text-[#3A5D54] space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-[#3A5D54]">
                  <ShieldCheck className="w-4 h-4 text-[#5A8B7D]" />
                  <span>Privacy Protection Active</span>
                </div>
                <p>
                  Your exact location is kept private. All initial conversations occur securely through Sukoon Community's encrypted chat engine.
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-2 bg-[#5A8B7D] hover:bg-[#4a7569] text-white font-medium px-6 py-2.5 rounded-2xl text-sm transition-all shadow-md"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div className="bg-[#E9C46A]/20 border border-[#E9C46A]/40 rounded-2xl p-3.5 text-xs text-[#937217] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#937217] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Matched Shared Criteria:</span>{" "}
                  {family.matchingCriteria.slice(0, 2).join(" • ")}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#5A8B7D]" />
                  <span>Your Introductory Message</span>
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-2xl border-none bg-stone-100/70 focus:ring-2 focus:ring-[#5A8B7D] text-xs sm:text-sm text-stone-800"
                  placeholder="Write a warm, respectful message..."
                />
              </div>

              {/* Quick Template Chips */}
              <div>
                <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                  Quick Message Templates:
                </span>
                <div className="space-y-1.5">
                  {quickTemplates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessageText(tmpl)}
                      className="w-full text-left p-2.5 rounded-xl bg-white/70 hover:bg-white text-[11px] text-stone-700 hover:text-[#5A8B7D] border border-white/80 transition-all text-ellipsis overflow-hidden whitespace-nowrap shadow-2xs"
                    >
                      "{tmpl}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white font-medium px-5 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Private Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
