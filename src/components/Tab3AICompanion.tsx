import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Code, 
  Heart, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ShieldCheck, 
  Copy, 
  Check, 
  HelpCircle, 
  Key, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  Square
} from "lucide-react";
import { ChatMessage, FamilyProfile } from "../types";
import { preprogrammedFallbackAnswers } from "../data/mockData";

interface Tab3Props {
  userProfile: FamilyProfile;
  sensoryMode: boolean;
}

export const Tab3AICompanion: React.FC<Tab3Props> = ({ userProfile, sensoryMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      sender: "assistant",
      text: `Assalamu Alaikum ${userProfile.parentName}! I am your Sukoon AI Islamic Guidance Companion.

I am programmed with a scholar persona to answer your questions regarding Fiqh accommodations, sensory overload during prayer, caregiver burnout, and mosque accessibility with extreme compassion and focus on **Yusr (Ease)**.

How can I comfort or guide your family today?`,
      timestamp: "Just now"
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [showApiSnippet, setShowApiSnippet] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  const isAdmin = Boolean(
    userProfile?.role === "admin" ||
    userProfile?.email?.toLowerCase().includes("adam") ||
    userProfile?.parentName?.toLowerCase().includes("adam")
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    {
      label: "Child vocalizes loudly during Salah",
      query: "My child vocalizes loudly and moves constantly during congregational Salah. What are the Islamic accommodations for praying while holding or calming them?"
    },
    {
      label: "Fasting exemptions for caregivers",
      query: "What are the Islamic exemptions for Ramadan fasting if full-time caregiving causes severe physical and mental exhaustion?"
    },
    {
      label: "Sensory overload at the mosque",
      query: "Is it permissible to wear noise-canceling headphones or compression vests inside the prayer hall during Jumu'ah or Eid?"
    },
    {
      label: "Dealing with community stares & guilt",
      query: "How can I deal with feelings of parental guilt and community stares when my child has a meltdown at the masjid?"
    }
  ];

  const getFallbackAnswer = (promptText: string): string => {
    const lower = promptText.toLowerCase();
    if (lower.includes("salah") || lower.includes("vocalize") || lower.includes("pray") || lower.includes("holding")) {
      return preprogrammedFallbackAnswers.salah;
    }
    if (lower.includes("fast") || lower.includes("ramadan") || lower.includes("exhaustion")) {
      return preprogrammedFallbackAnswers.fasting;
    }
    if (lower.includes("headphone") || lower.includes("masjid") || lower.includes("sensory") || lower.includes("crowd")) {
      return preprogrammedFallbackAnswers.masjid;
    }
    if (lower.includes("stigma") || lower.includes("guilt") || lower.includes("stare") || lower.includes("curse")) {
      return preprogrammedFallbackAnswers.stigma;
    }
    return preprogrammedFallbackAnswers.general;
  };

  // Helper to phonetically clean and prepare text for SpeechSynthesis so transliterated words sound natural
  const prepareTextForSpeech = (text: string): string => {
    if (!text) return "";

    // 1. Remove Markdown formatting symbols (*, #, _, `, ~, >, etc.)
    let clean = text
      .replace(/[*#_`~>]/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // replace markdown links with link text
      .replace(/[:]/g, ". ");

    // 2. Phonetically adjust transliterated Arabic phrases for Speech Synthesis
    const transliterations: [RegExp, string][] = [
      [/\bWa\s+Alaikum\s+Assalam\b/gi, "Wa Alaykum As-Salam"],
      [/\bAssalamu\s+Alaikum\b/gi, "Assalamu Alaykum"],
      [/\bAlhamdulillah\b/gi, "Alhamdulillah"],
      [/\bSubhanAllah\b/gi, "Subhan Allah"],
      [/\bInsha['’]?Allah\b/gi, "Inshallah"],
      [/\bJumu['’]?ah\b/gi, "Jummah"],
      [/\bSalah\b/gi, "Salah"],
      [/\bFiqh\b/gi, "Fik-h"],
      [/\bRukhsah\b/gi, "Rookh-sah"],
      [/\bYusr\b/gi, "Yosr"],
      [/\bAameen\b/gi, "Amen"],
      [/\bBarakah\b/gi, "Barakah"],
      [/\bMasjid\b/gi, "Masjid"]
    ];

    for (const [pattern, replacement] of transliterations) {
      clean = clean.replace(pattern, replacement);
    }

    // 3. Normalize spaces and eliminate stray apostrophes inside words that trigger letter spellouts
    clean = clean
      .replace(/['’]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return clean;
  };

  const speakText = (msgId: string, textToSpeak: string) => {
    if (!("speechSynthesis" in window)) return;

    if (activeSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setActiveSpeakingId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleaned = prepareTextForSpeech(textToSpeak);
      const utterance = new SpeechSynthesisUtterance(cleaned.slice(0, 450));
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find((v) => 
        v.lang.startsWith("en") && 
        (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))
      );
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => setActiveSpeakingId(msgId);
      utterance.onend = () => setActiveSpeakingId(null);
      utterance.onerror = () => setActiveSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
      setActiveSpeakingId(null);
    }
  };

  const speakIfEnabled = (msgId: string, text: string) => {
    if (isMuted) return;
    speakText(msgId, text);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setLoading(true);

    // Check if custom key is provided for direct client-side fetch call
    if (customApiKey.trim()) {
      try {
        const directRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${customApiKey.trim()}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `System Prompt: You are a compassionate Islamic scholar and special-needs family advocate. Provide empathetic, practical, and scholar-supported answers that relieve parental guilt and emphasize ease (Yusr).\n\nUser Question: ${query}`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (directRes.ok) {
          const data = await directRes.json();
          const responseText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            getFallbackAnswer(query);

          const aiMsgId = `msg_ai_${Date.now()}`;
          const aiMsg: ChatMessage = {
            id: aiMsgId,
            sender: "assistant",
            text: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setMessages((prev) => [...prev, aiMsg]);
          speakIfEnabled(aiMsgId, responseText);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Direct REST Gemini call failed, trying server API endpoint...", e);
      }
    }

    // Attempt Server-side Express API Route (/api/chat)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.sender, content: m.text }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const aiMsgId = `msg_ai_${Date.now()}`;
          const aiMsg: ChatMessage = {
            id: aiMsgId,
            sender: "assistant",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, aiMsg]);
          speakIfEnabled(aiMsgId, data.reply);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Server API error, activating scholar fallback knowledge base", err);
    }

    // Seamless Fallback Response if API Key isn't provided or offline
    setTimeout(() => {
      const fallbackText = getFallbackAnswer(query);
      const aiMsgId = `msg_ai_${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: "assistant",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true
      };
      setMessages((prev) => [...prev, aiMsg]);
      speakIfEnabled(aiMsgId, fallbackText);
      setLoading(false);
    }, 600);
  };

  const exactFetchSnippet = `// Client-side JavaScript snippet to connect directly to the Gemini API
async function askGeminiScholar(apiKey, userQuestion) {
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`;
  
  const systemPrompt = "You are a compassionate Islamic scholar and special-needs family advocate. " +
    "Provide empathetic, practical, and scholar-supported answers that relieve parental guilt and emphasize ease (Yusr).";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: \`\${systemPrompt}\\n\\nUser Question: \${userQuestion}\` }]
      }]
    })
  });

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return reply;
}`;

  const copySnippet = () => {
    navigator.clipboard.writeText(exactFetchSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel rounded-[32px] p-6 shadow-xl shadow-stone-200/40 border border-white/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-[#E9C46A]/20 text-[#937217] text-xs font-semibold px-3 py-1 rounded-full border border-[#E9C46A]/30">
            <Bot className="w-3.5 h-3.5 text-[#937217]" />
            <span>AI Islamic Guidance Companion</span>
          </div>
          <h2 className="text-2xl font-bold text-[#3A5D54] tracking-tight">
            Ask Questions About Fiqh, Accommodations & Guilt
          </h2>
          <p className="text-xs text-stone-600 max-w-2xl">
            Grounded in principles of mercy, scholar consensus on caregiving, and Yusr (ease). Relieving parental anxiety with authentic Islamic knowledge.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white/70 hover:bg-white text-stone-700 p-2.5 rounded-2xl border border-white/80 text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            title="Toggle voice narration for responses"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-[#5A8B7D]" />}
            <span className="hidden sm:inline">{isMuted ? "Voice Off" : "Voice On"}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowApiSnippet(!showApiSnippet)}
              className="bg-[#E9C46A]/20 hover:bg-[#E9C46A]/30 text-[#937217] border border-[#E9C46A]/40 p-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Code className="w-4 h-4 text-[#937217]" />
              <span>Developer API Key Code</span>
              {showApiSnippet ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Developer API Snippet Panel */}
      {isAdmin && showApiSnippet && (
        <div className="glass-panel rounded-[32px] p-6 border border-[#E9C46A]/40 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
            <div>
              <h4 className="text-sm font-bold text-[#937217] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#937217]" />
                Direct Gemini API Integration Code & Custom Key Injection
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Insert your client API key below to override server routes with direct Gemini REST API calls.
              </p>
            </div>

            <button
              onClick={copySnippet}
              className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white text-xs font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all self-start"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? "Copied Snippet!" : "Copy JavaScript Snippet"}</span>
            </button>
          </div>

          {/* Optional Key Input */}
          <div className="bg-stone-100/60 p-3.5 rounded-2xl border border-stone-200/60 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-semibold text-stone-600 whitespace-nowrap">
              Optional Client Key:
            </span>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Paste custom Gemini API key (AI Studio automatically uses server GEMINI_API_KEY)"
              className="flex-1 w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:ring-1 focus:ring-[#5A8B7D] focus:outline-none"
            />
            {customApiKey && (
              <span className="text-[10px] text-[#5A8B7D] font-bold bg-[#5A8B7D]/10 px-2.5 py-1 rounded-lg border border-[#5A8B7D]/30">
                Key Active
              </span>
            )}
          </div>

          {/* Exact Code Snippet Display */}
          <pre className="bg-stone-900 text-emerald-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto border border-stone-800 leading-relaxed">
            {exactFetchSnippet}
          </pre>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="glass-panel rounded-[32px] shadow-xl shadow-stone-200/50 flex flex-col h-[580px] overflow-hidden border border-white/80">
        {/* Chat Messages Log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#E9C46A] text-[#3A5D54]"
                    : "bg-[#5A8B7D] text-white"
                }`}
              >
                {msg.sender === "user" ? userProfile.parentName.charAt(0) : "AI"}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm space-y-2 shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#5A8B7D] text-white rounded-tr-none"
                    : "bg-white/80 border border-white/90 text-stone-800 rounded-tl-none"
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-stone-200/40 pb-1.5 mb-1">
                  <span className={`font-bold text-[11px] ${msg.sender === "user" ? "text-amber-100" : "text-[#3A5D54]"}`}>
                    {msg.sender === "user" ? userProfile.parentName : "Sukoon Islamic Scholar AI"}
                  </span>
                  <div className="flex items-center gap-2">
                    {msg.sender === "assistant" && (
                      <button
                        onClick={() => speakText(msg.id, msg.text)}
                        className="text-stone-500 hover:text-[#5A8B7D] transition-colors p-1 rounded-md hover:bg-stone-100/60"
                        title={activeSpeakingId === msg.id ? "Stop voice narration" : "Listen to response"}
                      >
                        {activeSpeakingId === msg.id ? (
                          <Square className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-[#5A8B7D]" />
                        )}
                      </button>
                    )}
                    <span className={`text-[10px] ${msg.sender === "user" ? "text-emerald-100" : "text-stone-400"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                <div className={`prose prose-stone prose-xs max-w-none text-stone-800 leading-relaxed font-normal ${
                  sensoryMode ? "text-base leading-loose" : ""
                } [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-4 [&>strong]:font-bold [&>strong]:text-[#3A5D54]`}>
                  <Markdown>{msg.text}</Markdown>
                </div>

                {msg.isFallback && (
                  <div className="mt-2 pt-2 border-t border-stone-200/50 text-[10px] text-stone-500 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5A8B7D] shrink-0" />
                    <span>Scholar Knowledge Base Fallback Active</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#5A8B7D] text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                AI
              </div>
              <div className="bg-white/80 border border-white/90 p-4 rounded-3xl rounded-tl-none text-xs text-stone-600 flex items-center gap-2 shadow-sm">
                <RefreshCw className="w-4 h-4 text-[#5A8B7D] animate-spin" />
                <span>Consulting scholar references & Fiqh principles of Yusr...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-stone-100/50 border-t border-stone-200/60 px-5 space-y-1.5 shrink-0">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            Suggested Scholar Prompts:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={loading}
                className="bg-white/80 hover:bg-white text-stone-700 hover:text-[#5A8B7D] border border-white/80 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shadow-2xs"
              >
                💬 {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3.5 bg-white/60 border-t border-stone-200/60 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type your question about Fiqh exemptions, sensory needs during prayer, or caregiver guilt..."
            className="flex-1 p-3 rounded-2xl border-none bg-stone-100/70 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-[#5A8B7D]"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="bg-[#5A8B7D] hover:bg-[#4a7569] disabled:opacity-50 text-white font-semibold p-3 px-5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Scholar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
