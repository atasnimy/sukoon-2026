import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  UserCheck 
} from "lucide-react";
import { MatchedFamily, FamilyProfile } from "../types";
import { 
  subscribeToDirectMessages, 
  sendDirectMessageToFirestore, 
  DirectMessage 
} from "../lib/firebase";

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

  const [messageText, setMessageText] = useState("");
  const [chatHistory, setChatHistory] = useState<DirectMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default introductory message if history is empty
  const defaultIntro = `Assalamu Alaikum ${family.parentNames}! We noticed our children share similar ages (${family.childAge}) and needs. We'd love to connect for quiet playdates or support!`;

  // Subscribe to real-time direct messages in Firestore
  useEffect(() => {
    if (!family || !userProfile.id) return;

    const unsubscribe = subscribeToDirectMessages(userProfile.id, family.id, (msgs) => {
      setChatHistory(msgs);
    });

    return () => unsubscribe();
  }, [family, userProfile.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = messageText.trim() || (chatHistory.length === 0 ? defaultIntro : "");
    if (!textToSend) return;

    setIsSending(true);
    try {
      await sendDirectMessageToFirestore(
        userProfile.id,
        family.id,
        userProfile.parentName || "Family Caregiver",
        textToSend
      );
      setMessageText("");
    } catch (err) {
      console.error("Error sending direct message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const quickTemplates = [
    `Assalamu Alaikum! Saw that you also attend ${family.nearbyMosque}. Would love to coordinate quiet Jumuah seating!`,
    `Salaam! Our family is also navigating ${family.supportNeeds[0] || "special needs"}. It would be wonderful to share tips and connect.`,
    `Assalamu Alaikum! Seeking friendly playgroup connections in our area. Let us know if you'd like to chat!`
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-[32px] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className={`p-5 bg-gradient-to-r ${family.bgGradient} text-white relative shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg border border-white/30">
              {family.avatarInitials}
            </div>
            <div>
              <span className="bg-[#E9C46A] text-[#3A5D54] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                {family.matchScore}% Match
              </span>
              <h3 className="text-xl font-bold mt-0.5">{family.familyTitle}</h3>
              <p className="text-xs text-white/90">Parents: {family.parentNames} • {family.distance}</p>
            </div>
          </div>
        </div>

        {/* Live Conversation Stream */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-stone-50/60 min-h-[220px]">
          <div className="bg-[#E9C46A]/20 border border-[#E9C46A]/40 rounded-2xl p-3 text-xs text-[#937217] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#937217] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Shared Criteria:</span>{" "}
              {family.matchingCriteria.slice(0, 2).join(" • ")}
            </div>
          </div>

          {chatHistory.length === 0 ? (
            <div className="text-center py-6 px-4 space-y-2">
              <MessageSquare className="w-8 h-8 text-[#5A8B7D] mx-auto opacity-60" />
              <p className="text-xs text-stone-500 font-medium">
                No previous messages yet. Send a warm intro message to start a real-time conversation!
              </p>
            </div>
          ) : (
            chatHistory.map((msg, idx) => {
              const isMe = msg.senderId === userProfile.id;
              return (
                <div
                  key={msg.id || idx}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-stone-400 font-medium">
                    <span>{msg.senderName || (isMe ? "You" : family.familyTitle)}</span>
                    <span>•</span>
                    <span>{msg.timestampStr || "Just now"}</span>
                  </div>

                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? "bg-[#5A8B7D] text-white rounded-br-xs"
                        : "bg-white text-stone-800 border border-stone-200 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Templates Selector */}
        <div className="p-3 bg-white border-t border-stone-100 shrink-0">
          <span className="text-[10px] font-semibold text-stone-500 block mb-1">
            Quick Introductions:
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {quickTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessageText(tmpl)}
                className="text-left px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-[#5A8B7D]/10 text-[11px] text-stone-700 hover:text-[#5A8B7D] border border-stone-200 shrink-0 whitespace-nowrap transition-colors cursor-pointer"
              >
                "{tmpl.slice(0, 35)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200 shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={
              chatHistory.length === 0
                ? "Type a message or use default intro..."
                : "Type message to send in real-time..."
            }
            className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A8B7D] text-stone-800 bg-stone-50"
          />

          <button
            type="submit"
            disabled={isSending}
            className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white font-medium px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>

        {/* Privacy Footer */}
        <div className="px-4 py-2 bg-stone-100 border-t border-stone-200 text-[10px] text-stone-500 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A8B7D]" />
            Firestore Database Real-Time Encryption Active
          </span>
          <span className="font-semibold text-[#5A8B7D]">Sukoon Privacy</span>
        </div>

      </div>
    </div>
  );
};
