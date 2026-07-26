import React, { useState } from "react";
import { 
  BookOpenCheck, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Bookmark, 
  BookmarkCheck, 
  ThumbsUp, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Quote, 
  BookOpen, 
  ShieldAlert, 
  GraduationCap 
} from "lucide-react";
import { FAQItem, HopeReminder } from "../types";
import { sampleFAQItems, sampleHopeReminders } from "../data/mockData";

interface Tab2Props {
  sensoryMode: boolean;
}

export const Tab2IslamicGuidance: React.FC<Tab2Props> = ({ sensoryMode }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>(sampleFAQItems);
  const [reminders, setReminders] = useState<HopeReminder[]>(sampleHopeReminders);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq_1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    "All",
    "Salah Accommodations",
    "Sensory Overload in Crowds",
    "Religious Exemptions (Fasting/Congregation)",
    "Caregiving in Islam"
  ];

  const handleHelpfulClick = (faqId: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === faqId ? { ...f, helpfulCount: f.helpfulCount + 1 } : f))
    );
  };

  const handleToggleBookmark = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  const handleCopyAnswer = (faq: FAQItem) => {
    const textToCopy = `Q: ${faq.question}\n\nA: ${faq.answer}\n\nScholarly Basis: ${faq.scholarlyBasis}\n(Shared from Sukoon Community)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(faq.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scholarlyBasis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-xl shadow-stone-200/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#E9C46A]/20 text-[#937217] text-xs font-semibold px-3 py-1 rounded-full border border-[#E9C46A]/30">
            <BookOpenCheck className="w-3.5 h-3.5 text-[#937217]" />
            <span>Scholar-Backed Jurisprudential FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3A5D54] tracking-tight">
            Compassionate Fiqh & Religious Exemptions
          </h2>
          <p className={`text-xs sm:text-sm text-stone-600 leading-relaxed ${sensoryMode ? "leading-loose" : ""}`}>
            Discover clear rulings from authentic Islamic scholarship regarding Salah accommodations, sensory devices in the masjid, fasting exemptions, and the elevated spiritual station of special needs caregivers.
          </p>
        </div>
      </div>

      {/* SECTION 1: REMINDERS OF HOPE BANNER / CAROUSEL */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#937217]" />
            <h3 className="text-xl sm:text-2xl font-bold text-stone-800">
              Reminders of Hope (Quran & Hadith)
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            Curated verses of solace & ease (Yusr)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className="glass-card rounded-[28px] p-6 shadow-md space-y-4 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Type badge & Bookmark button */}
                <div className="flex items-center justify-between">
                  <span className="bg-[#E9C46A]/25 text-[#937217] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#E9C46A]/40">
                    {rem.type} • {rem.source}
                  </span>

                  <button
                    onClick={() => handleToggleBookmark(rem.id)}
                    className="p-1.5 rounded-full text-stone-600 hover:bg-stone-200/50 transition-colors"
                    title={rem.isBookmarked ? "Remove Bookmark" : "Save Reminder"}
                  >
                    {rem.isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-[#5A8B7D]" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-stone-400" />
                    )}
                  </button>
                </div>

                {/* Arabic Text if present */}
                {rem.arabicText && (
                  <p className="text-right text-lg sm:text-xl font-bold text-[#3A5D54] leading-loose tracking-wide pt-1">
                    {rem.arabicText}
                  </p>
                )}

                {/* Translation */}
                <div className="flex items-start gap-2.5">
                  <Quote className="w-4 h-4 text-[#937217] shrink-0 mt-1" />
                  <p className="text-xs sm:text-sm font-medium text-stone-800 italic leading-relaxed">
                    "{rem.translation}"
                  </p>
                </div>

                {/* Context */}
                <p className="text-xs text-stone-600 bg-white/60 p-3 rounded-2xl border border-white/80">
                  <strong className="text-[#3A5D54]">Spiritual Context:</strong> {rem.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: CATEGORIZED ACCORDION FAQ */}
      <section className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-xl shadow-stone-200/50 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/60 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-800">
              Categorized Fiqh Guidance
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click any question to view scholar citations, Hadith references, and key takeaways.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Q&As (e.g., Headphones, Jumuah)..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl border-none bg-stone-100/60 text-xs focus:ring-2 focus:ring-[#5A8B7D]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#5A8B7D] text-white shadow-sm"
                  : "bg-stone-200/50 hover:bg-stone-300/50 text-stone-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs sm:text-sm">
              No matching Q&A entries found. Try adjusting your search or category filter.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`glass-card rounded-[24px] transition-all duration-200 overflow-hidden border ${
                    isOpen
                      ? "border-[#5A8B7D]/40 shadow-md bg-white/90"
                      : "border-stone-200/80 bg-white/60 hover:border-[#5A8B7D]/30"
                  }`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <span className="bg-[#5A8B7D]/10 text-[#3A5D54] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#5A8B7D]/20">
                        {faq.category}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-stone-800 leading-snug">
                        {faq.question}
                      </h4>
                    </div>

                    <div className="p-1.5 rounded-full bg-stone-100/80 text-stone-600 shrink-0 mt-1">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#5A8B7D]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-stone-200/50 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {/* Detailed Answer */}
                      <p className={`pt-4 ${sensoryMode ? "leading-loose text-base" : ""}`}>
                        {faq.answer}
                      </p>

                      {/* Key Takeaway Callout */}
                      <div className="bg-[#E9C46A]/15 border border-[#E9C46A]/40 rounded-2xl p-3.5 text-stone-800 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#937217] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-xs font-bold uppercase tracking-wider text-[#937217] mb-0.5">
                            Key Fiqh Takeaway:
                          </strong>
                          <span>{faq.keyTakeaway}</span>
                        </div>
                      </div>

                      {/* Scholarly Basis */}
                      <div className="bg-stone-100/70 p-3.5 rounded-2xl border border-stone-200/60 text-xs text-stone-600 flex items-start gap-2.5">
                        <GraduationCap className="w-4 h-4 text-[#5A8B7D] shrink-0 mt-0.5" />
                        <div>
                          <strong>Authentic References:</strong> {faq.scholarlyBasis}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/50">
                        <div className="flex flex-wrap gap-1">
                          {faq.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="bg-stone-200/60 text-stone-600 text-[10px] px-2 py-0.5 rounded-md"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleHelpfulClick(faq.id)}
                            className="bg-white/80 hover:bg-white text-[#3A5D54] border border-stone-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-[#5A8B7D]" />
                            <span>Helpful ({faq.helpfulCount})</span>
                          </button>

                          <button
                            onClick={() => handleCopyAnswer(faq)}
                            className="bg-white/80 hover:bg-white text-stone-700 border border-stone-200/80 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            {copiedId === faq.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#5A8B7D]" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-stone-500" />
                                <span>Share Answer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
