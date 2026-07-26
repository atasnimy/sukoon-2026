import React, { useState, useEffect } from "react";
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
  GraduationCap,
  Plus,
  X,
  Send,
  PlusCircle
} from "lucide-react";
import { FAQItem, HopeReminder, FamilyProfile } from "../types";
import { sampleFAQItems, sampleHopeReminders } from "../data/mockData";
import { 
  subscribeToFiqhRecordsFromFirestore, 
  createFiqhRecordInFirestore, 
  subscribeToHopeRemindersFromFirestore, 
  createHopeReminderInFirestore,
  CustomAuthUser
} from "../lib/firebase";

interface Tab2Props {
  sensoryMode: boolean;
  currentUser?: CustomAuthUser | null;
  userProfile?: FamilyProfile;
}

export const Tab2IslamicGuidance: React.FC<Tab2Props> = ({ sensoryMode, currentUser, userProfile }) => {
  const [firestoreFaqs, setFirestoreFaqs] = useState<FAQItem[]>([]);
  const [firestoreReminders, setFirestoreReminders] = useState<HopeReminder[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq_1");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Admin / Creator Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showAdminRequiredModal, setShowAdminRequiredModal] = useState<boolean>(false);
  const [recordKind, setRecordKind] = useState<"fiqh" | "reminder">("fiqh");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isAdmin = Boolean(
    userProfile?.role === "admin" ||
    userProfile?.email?.toLowerCase().includes("adam") ||
    userProfile?.parentName?.toLowerCase().includes("adam")
  );

  const handleCreateRecordClick = () => {
    if (isAdmin) {
      setShowCreateModal(true);
    } else {
      setShowAdminRequiredModal(true);
    }
  };

  // Fiqh Form State
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("Salah Accommodations");
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [newKeyTakeaway, setNewKeyTakeaway] = useState<string>("");
  const [newScholarlyBasis, setNewScholarlyBasis] = useState<string>("");
  const [newTagsStr, setNewTagsStr] = useState<string>("fiqh, accommodations, salah");

  // Reminder Form State
  const [newReminderType, setNewReminderType] = useState<"Quran" | "Hadith" | "Scholar Reflection">("Quran");
  const [newSource, setNewSource] = useState<string>("");
  const [newArabicText, setNewArabicText] = useState<string>("");
  const [newTranslation, setNewTranslation] = useState<string>("");
  const [newContext, setNewContext] = useState<string>("");

  // Subscribe to Firestore Fiqh Records and Hope Reminders
  useEffect(() => {
    const unsubFaqs = subscribeToFiqhRecordsFromFirestore((recs) => setFirestoreFaqs(recs));
    const unsubRems = subscribeToHopeRemindersFromFirestore((rems) => setFirestoreReminders(rems));
    return () => {
      unsubFaqs();
      unsubRems();
    };
  }, []);

  // Merge sample + firestore
  const faqs = React.useMemo(() => {
    const all = [...firestoreFaqs];
    sampleFAQItems.forEach((s) => {
      if (!all.some((f) => f.id === s.id)) {
        all.push(s);
      }
    });
    return all;
  }, [firestoreFaqs]);

  const reminders = React.useMemo(() => {
    const all = [...firestoreReminders];
    sampleHopeReminders.forEach((r) => {
      if (!all.some((item) => item.id === r.id)) {
        all.push(r);
      }
    });
    return all.map((r) => ({
      ...r,
      isBookmarked: bookmarkedIds.has(r.id) || r.isBookmarked
    }));
  }, [firestoreReminders, bookmarkedIds]);

  const categories = [
    "All",
    "Salah Accommodations",
    "Sensory Overload in Crowds",
    "Religious Exemptions (Fasting/Congregation)",
    "Caregiving in Islam"
  ];

  const handleHelpfulClick = (faqId: string) => {
    setFirestoreFaqs((prev) =>
      prev.map((f) => (f.id === faqId ? { ...f, helpfulCount: (f.helpfulCount || 0) + 1 } : f))
    );
  };

  const handleToggleBookmark = (reminderId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(reminderId)) next.delete(reminderId);
      else next.add(reminderId);
      return next;
    });
  };

  const handleCreateRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (recordKind === "fiqh") {
        if (!newQuestion.trim() || !newAnswer.trim()) return;
        const tagsArr = newTagsStr
          .split(",")
          .map((t) => t.trim().replace(/^#/, ""))
          .filter((t) => t.length > 0);

        await createFiqhRecordInFirestore({
          category: newCategory,
          question: newQuestion.trim(),
          answer: newAnswer.trim(),
          keyTakeaway: newKeyTakeaway.trim() || "Consult local scholars for specific family context.",
          scholarlyBasis: newScholarlyBasis.trim() || "Authentic Fiqh councils & scholar consensus.",
          tags: tagsArr.length > 0 ? tagsArr : ["guidance", "fiqh"]
        });

        setNewQuestion("");
        setNewAnswer("");
        setNewKeyTakeaway("");
        setNewScholarlyBasis("");
      } else {
        if (!newSource.trim() || !newTranslation.trim()) return;

        await createHopeReminderInFirestore({
          type: newReminderType,
          source: newSource.trim(),
          arabicText: newArabicText.trim() || undefined,
          translation: newTranslation.trim(),
          context: newContext.trim() || "Spiritual reflection for special needs families."
        });

        setNewSource("");
        setNewArabicText("");
        setNewTranslation("");
        setNewContext("");
      }

      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating record:", err);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="glass-panel rounded-[32px] p-6 sm:p-8 shadow-xl shadow-stone-200/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3">
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

        {/* Create Community Record Action */}
        <button
          onClick={handleCreateRecordClick}
          className="bg-[#3A5D54] hover:bg-[#2e4a43] text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#E9C46A]" />
          <span>+ Create Guidance Record</span>
        </button>
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

      {/* CREATE GUIDANCE RECORD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-[32px] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-[#3A5D54] text-white relative shrink-0">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#E9C46A]" />
                <h3 className="text-xl font-bold text-white">Publish Guidance Record</h3>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Add scholar-backed Fiqh rulings, Mosque accommodations, or Reminders of Hope directly to the community.
              </p>
            </div>

            {/* Record Type Selector */}
            <div className="px-6 pt-4 flex gap-2 bg-stone-100/60 border-b border-stone-200">
              <button
                type="button"
                onClick={() => setRecordKind("fiqh")}
                className={`py-2 px-4 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
                  recordKind === "fiqh"
                    ? "bg-white text-[#3A5D54] border-t border-x border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Fiqh Q&A Ruling
              </button>
              <button
                type="button"
                onClick={() => setRecordKind("reminder")}
                className={`py-2 px-4 rounded-t-xl text-xs font-bold transition-all cursor-pointer ${
                  recordKind === "reminder"
                    ? "bg-white text-[#3A5D54] border-t border-x border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Reminder of Hope (Quran/Hadith)
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateRecordSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 bg-white text-xs">
              {recordKind === "fiqh" ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Question / Issue *
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="e.g., Can noise-canceling headphones be worn during Jumu'ah khutbah?"
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    >
                      <option value="Salah Accommodations">Salah Accommodations</option>
                      <option value="Sensory Overload in Crowds">Sensory Overload in Crowds</option>
                      <option value="Religious Exemptions (Fasting/Congregation)">Religious Exemptions (Fasting/Congregation)</option>
                      <option value="Caregiving in Islam">Caregiving in Islam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Detailed Answer / Ruling *
                    </label>
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      rows={3}
                      placeholder="Provide the comprehensive answer, context, and accommodation guidance..."
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Key Fiqh Takeaway
                    </label>
                    <input
                      type="text"
                      value={newKeyTakeaway}
                      onChange={(e) => setNewKeyTakeaway(e.target.value)}
                      placeholder="e.g., Permissible due to necessity (Dharurah) and avoiding medical distress."
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Scholarly Basis / References
                    </label>
                    <input
                      type="text"
                      value={newScholarlyBasis}
                      onChange={(e) => setNewScholarlyBasis(e.target.value)}
                      placeholder="e.g., Fiqh Council of North America & Assembly of Muslim Jurists (AMJA)"
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
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
                      placeholder="headphones, sensory, khutbah"
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Type
                    </label>
                    <select
                      value={newReminderType}
                      onChange={(e) => setNewReminderType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    >
                      <option value="Quran">Quran Verse</option>
                      <option value="Hadith">Prophetic Hadith</option>
                      <option value="Scholar Reflection">Scholar Reflection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Source Reference *
                    </label>
                    <input
                      type="text"
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      placeholder="e.g., Surah Ash-Sharh 94:5-6 or Sahih Muslim"
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Arabic Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={newArabicText}
                      onChange={(e) => setNewArabicText(e.target.value)}
                      placeholder="فَإِنَّ مَعَ الْعُسْرِ يُسْرًا"
                      dir="rtl"
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold text-right focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Translation / Message *
                    </label>
                    <textarea
                      value={newTranslation}
                      onChange={(e) => setNewTranslation(e.target.value)}
                      rows={3}
                      placeholder="Enter the translated verse, Hadith text, or spiritual reflection..."
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Spiritual Context
                    </label>
                    <input
                      type="text"
                      value={newContext}
                      onChange={(e) => setNewContext(e.target.value)}
                      placeholder="e.g., Comfort for parents enduring long trial with patient perseverance (Sabr)."
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium focus:ring-2 focus:ring-[#5A8B7D]"
                    />
                  </div>
                </>
              )}

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
                  disabled={isSubmitting}
                  className="bg-[#5A8B7D] hover:bg-[#4a7569] text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Publishing..." : "Publish Record"}</span>
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
                Publishing Fiqh rulings and Reminders of Hope is restricted to <strong>Sukoon Administrators & Islamic Scholars</strong> to ensure authentic guidance.
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

