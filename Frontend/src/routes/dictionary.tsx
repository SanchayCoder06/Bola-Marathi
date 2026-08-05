import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  Volume2,
  Bookmark,
  Clock,
  X,
  BookOpen,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Copy,
  Check,
  Calendar,
  TrendingUp,
  Heart,
  ArrowRight
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import {
  DictionaryService,
  DEVANAGARI_LETTERS,
  type MultilingualDictionaryEntry,
  type QueryResult
} from "@/lib/services/dictionaryService";
import { AudioEngine } from "@/lib/services/audioEngine";
import { cn } from "@/lib/utils";

type TabType = "all" | "recent" | "favorites" | "most_viewed";

export function DictionaryPage() {
  if (typeof window === "undefined") {
    console.log("[Route Load]: Loading Dictionary (SSR)");
  } else {
    console.log("[Route Load]: Loading Dictionary (Client)");
  }
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return 1;
    try {
      const saved = localStorage.getItem("bola_dictionary_page");
      return saved ? parseInt(saved, 10) || 1 : 1;
    } catch {
      return 1;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [pageJumpInput, setPageJumpInput] = useState("");

  const [queryData, setQueryData] = useState<QueryResult>({
    items: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1
  });
  const [wordOfTheDay, setWordOfTheDay] = useState<MultilingualDictionaryEntry | null>(null);
  const [selectedWordDetail, setSelectedWordDetail] = useState<MultilingualDictionaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAudioWord, setPlayingAudioWord] = useState<string | null>(null);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([]);

  // Local storage persisted states (SSR-safe)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return ["नमस्कार", "पाणी", "मित्र", "अंक"];
    try {
      const saved = localStorage.getItem("bola_recent_searches");
      return saved ? JSON.parse(saved) : ["नमस्कार", "पाणी", "मित्र", "अंक"];
    } catch {
      return ["नमस्कार", "पाणी", "मित्र", "अंक"];
    }
  });

  const [bookmarkedWords, setBookmarkedWords] = useState<Set<string>>(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return new Set(["नमस्कार", "पाणी", "मित्र"]);
    try {
      const saved = localStorage.getItem("bola_bookmarked_words");
      return saved ? new Set(JSON.parse(saved)) : new Set(["नमस्कार", "पाणी", "मित्र"]);
    } catch {
      return new Set(["नमस्कार", "पाणी", "मित्र"]);
    }
  });

  const [mostViewedWords, setMostViewedWords] = useState<string[]>(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return ["नमस्कार", "पाणी", "मित्र", "अंक", "धन्यवाद"];
    try {
      const saved = localStorage.getItem("bola_most_viewed_words");
      return saved ? JSON.parse(saved) : ["नमस्कार", "पाणी", "मित्र", "अंक", "धन्यवाद"];
    } catch {
      return ["नमस्कार", "पाणी", "मित्र", "अंक", "धन्यवाद"];
    }
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Persist current page number
  useEffect(() => {
    try {
      localStorage.setItem("bola_dictionary_page", page.toString());
    } catch {}
  }, [page]);

  // Load JSON dictionary file ONLY ONCE on component mount
  useEffect(() => {
    AudioEngine.init();
    const initData = async () => {
      setLoading(true);
      const entries = await DictionaryService.loadDictionary();

      // Deterministically pick Word of the Day based on today's date string
      if (entries.length > 0) {
        const todayStr = new Date().toISOString().slice(0, 10);
        let hash = 0;
        for (let i = 0; i < todayStr.length; i++) hash = todayStr.charCodeAt(i) + ((hash << 5) - hash);
        const dayIdx = Math.abs(hash) % entries.length;
        setWordOfTheDay(entries[dayIdx]);
      }

      // Fetch authentic categories and difficulties
      const cats = DictionaryService.getAvailableCategories();
      const diffs = DictionaryService.getAvailableDifficulties();
      setAvailableCategories(cats);
      setAvailableDifficulties(diffs);

      const res = DictionaryService.searchWord({
        query,
        page,
        pageSize: 10, // 10 words per page
        sortOrder,
        difficultyFilter: activeDifficulty,
        categoryFilter: activeCategory,
        letterFilter: selectedLetter
      });
      setQueryData(res);
      setLoading(false);
    };
    initData();
  }, []);

  // Update query results whenever query, page, tab, sorting, or filters change
  useEffect(() => {
    if (!DictionaryService.isLoaded()) return;

    if (activeTab === "favorites") {
      const allEntries = DictionaryService.searchWord({ query: "", pageSize: 100000 }).items;
      const favs = allEntries.filter((e) => bookmarkedWords.has(e.marathi));
      setQueryData({
        items: favs,
        totalCount: favs.length,
        totalPages: 1,
        currentPage: 1
      });
    } else if (activeTab === "recent") {
      const allEntries = DictionaryService.searchWord({ query: "", pageSize: 100000 }).items;
      const recentsSet = new Set(recentSearches);
      const recents = allEntries.filter((e) => recentsSet.has(e.marathi));
      setQueryData({
        items: recents,
        totalCount: recents.length,
        totalPages: 1,
        currentPage: 1
      });
    } else if (activeTab === "most_viewed") {
      const allEntries = DictionaryService.searchWord({ query: "", pageSize: 100000 }).items;
      const mvSet = new Set(mostViewedWords);
      const mvs = allEntries.filter((e) => mvSet.has(e.marathi));
      setQueryData({
        items: mvs,
        totalCount: mvs.length,
        totalPages: 1,
        currentPage: 1
      });
    } else {
      const res = DictionaryService.searchWord({
        query,
        page: query ? 1 : page,
        pageSize: 10,
        sortOrder,
        difficultyFilter: activeDifficulty,
        categoryFilter: activeCategory,
        letterFilter: selectedLetter
      });

      if (res.items.length === 0 && query.trim().length > 0) {
        DictionaryService.lookupWithAiFallback(query.trim()).then((generated) => {
          setQueryData({
            items: [generated],
            totalCount: 1,
            totalPages: 1,
            currentPage: 1
          });
        });
      } else {
        setQueryData(res);
      }
    }
  }, [query, page, activeTab, sortOrder, activeDifficulty, activeCategory, selectedLetter, bookmarkedWords, recentSearches, mostViewedWords]);

  // Word-only autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!query.trim() || !DictionaryService.isLoaded()) return [];
    return DictionaryService.getSuggestions(query, 5);
  }, [query]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    setShowSuggestions(Boolean(val.trim()));
  };

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter("All");
    } else {
      setSelectedLetter(letter);
      const targetPage = DictionaryService.findPageForLetter(letter, 10);
      setPage(targetPage);
    }
  };

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(pageJumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= queryData.totalPages) {
      setPage(num);
      setPageJumpInput("");
    }
  };

  const addRecentSearch = (term: string) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const next = [clean, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("bola_recent_searches", JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to save recent searches:", e);
      }
      return next;
    });
  };

  const trackMostViewed = (word: string) => {
    setMostViewedWords((prev) => {
      const filtered = prev.filter((item) => item !== word);
      const next = [word, ...filtered].slice(0, 15);
      try {
        localStorage.setItem("bola_most_viewed_words", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("bola_recent_searches");
    } catch {}
  };

  const toggleBookmark = (word: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }
      try {
        localStorage.setItem("bola_bookmarked_words", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const handlePlayAudio = async (wordText: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingAudioWord(wordText);
    trackMostViewed(wordText);
    try {
      await AudioEngine.speak(wordText);
    } catch (err) {
      console.warn("Audio playback error:", err);
    } finally {
      setPlayingAudioWord(null);
    }
  };

  const handleCopyWord = (item: MultilingualDictionaryEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const copyText = `${item.marathi}${item.english ? ` (${item.english})` : ''}\n${item.hindi ? `${item.hindi}\n` : ''}${item.meaning}`;
    navigator.clipboard.writeText(copyText);
    setCopiedWord(item.marathi);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const highlightMatch = (text: string) => {
    if (!text || !query || !query.trim()) return text;
    const q = query.trim();
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 text-primary font-extrabold rounded px-1">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Related words for bottom sheet modal
  const relatedWords = useMemo(() => {
    if (!selectedWordDetail) return [];
    const prefix = selectedWordDetail.marathi.charAt(0);
    return DictionaryService.searchWord({ letterFilter: prefix, pageSize: 6 }).items.filter(e => e.marathi !== selectedWordDetail.marathi);
  }, [selectedWordDetail]);

  return (
    <AppShell title="Marathi Dictionary" subtitle="Instant Search Over 38,000+ Words">
      <div className="flex flex-col gap-5 pb-24 max-w-3xl mx-auto">

        {/* ================= 1. WORD OF THE DAY (COMPACT SLEEK BANNER) ================= */}
        {wordOfTheDay && !query && activeTab === "all" && (
          <div className="relative overflow-hidden rounded-3xl gradient-saffron p-4 md:p-5 text-white shadow-glow animate-fade-in">
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <Sparkles size={12} /> Word of the Day
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium opacity-90">
                  <Calendar size={11} /> {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h2 className="font-mr text-2xl md:text-3xl font-bold tracking-tight">{wordOfTheDay.marathi}</h2>
                  {wordOfTheDay.english && (
                    <span className="text-base font-medium text-white/90">({wordOfTheDay.english})</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => handlePlayAudio(wordOfTheDay.marathi, e)}
                    className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-md"
                    title="Listen Pronunciation"
                  >
                    <Volume2 size={15} className={playingAudioWord === wordOfTheDay.marathi ? "animate-bounce" : ""} />
                  </button>
                  <button
                    onClick={(e) => handleCopyWord(wordOfTheDay, e)}
                    className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-md"
                    title="Copy Word"
                  >
                    {copiedWord === wordOfTheDay.marathi ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                  <button
                    onClick={(e) => toggleBookmark(wordOfTheDay.marathi, e)}
                    className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-md"
                    title="Bookmark"
                  >
                    <Bookmark size={15} className={bookmarkedWords.has(wordOfTheDay.marathi) ? "fill-white" : ""} />
                  </button>
                </div>
              </div>

              {wordOfTheDay.hindi && (
                <p className="font-mr text-base text-white/90 font-medium">{wordOfTheDay.hindi}</p>
              )}

              <p className="font-mr text-sm leading-snug text-white/95 line-clamp-2">{wordOfTheDay.meaning}</p>
            </div>
          </div>
        )}

        {/* ================= 2. STICKY SEARCH BAR & WORD-ONLY SUGGESTIONS ================= */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pb-2 pt-1 border-b border-border/40">
          <div className="relative">
            <div className="group flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-e2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Search size={22} className="text-muted-foreground transition-colors group-focus-within:text-primary shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => query.trim() && setShowSuggestions(true)}
                placeholder="Search Marathi word or meaning..."
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground placeholder:text-sm font-medium font-mr"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setShowSuggestions(false);
                  }}
                  className="grid h-8 w-8 place-items-center rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Clear Search"
                >
                  <X size={16} />
                </button>
              )}
              <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20 shrink-0">
                📚 {queryData.totalCount.toLocaleString()} Words
              </span>
            </div>

            {/* Word-Only Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl border border-border bg-card p-2 shadow-e3 animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Word Suggestions
                </div>
                {suggestions.map((sug: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(sug);
                      setShowSuggestions(false);
                      addRecentSearch(sug);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-base font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <span className="font-mr font-bold">{sug}</span>
                    <ArrowRight size={16} className="opacity-40" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= 3. QUICK TAB NAVIGATION ================= */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar bg-card/60 p-2 rounded-2xl border border-border">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0",
              activeTab === "all"
                ? "gradient-saffron text-white shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen size={14} /> All Words
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0",
              activeTab === "favorites"
                ? "gradient-saffron text-white shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart size={14} /> Favorites ({bookmarkedWords.size})
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0",
              activeTab === "recent"
                ? "gradient-saffron text-white shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock size={14} /> Recent
          </button>
          <button
            onClick={() => setActiveTab("most_viewed")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0",
              activeTab === "most_viewed"
                ? "gradient-saffron text-white shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp size={14} /> Most Viewed
          </button>
        </div>

        {/* ================= 4. HORIZONTAL DEVANAGARI ALPHABET BAR ================= */}
        {activeTab === "all" && (
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar bg-card/60 p-3 rounded-2xl border border-border">
            <span className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground shrink-0 pr-1">Jump:</span>
            {DEVANAGARI_LETTERS.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={cn(
                    "grid h-9 min-w-[36px] place-items-center rounded-xl px-2 font-mr text-base font-bold border transition-all shrink-0 shadow-e1",
                    isSelected
                      ? "gradient-saffron text-white border-transparent shadow-glow scale-105"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary-soft hover:text-primary"
                  )}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}

        {/* ================= 5. CONTROLS: SORTING & DYNAMIC FILTERS ================= */}
        {activeTab === "all" && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-2xl border border-border text-xs">
            {availableDifficulties.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                <span className="font-bold text-muted-foreground uppercase text-[10px] flex items-center gap-1 shrink-0">
                  <Filter size={12} /> Difficulty:
                </span>
                {["All", ...availableDifficulties].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setActiveDifficulty(diff);
                      setPage(1);
                    }}
                    className={cn(
                      "rounded-full px-3.5 py-1 text-xs font-semibold transition-all shrink-0",
                      activeDifficulty === diff
                        ? "bg-primary-soft text-primary font-bold border border-primary/20"
                        : "text-muted-foreground hover:text-foreground border border-transparent"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs font-bold text-foreground hover:bg-muted transition-colors shrink-0 ml-auto"
            >
              <ArrowUpDown size={13} className="text-primary" />
              <span>Sort: {sortOrder === "asc" ? "A → Z" : "Z → A"}</span>
            </button>
          </div>
        )}

        {/* Dynamic Category Filter Pills */}
        {activeTab === "all" && availableCategories.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            {["All", ...availableCategories].map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold shrink-0 border transition-all shadow-e1",
                    isActive
                      ? "gradient-saffron text-white border-transparent shadow-glow"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* ================= 6. PAGINATION CONTROLS (10 WORDS PER PAGE) ================= */}
        {!query && activeTab === "all" && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3.5 rounded-2xl border border-border text-xs">
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 rounded-xl border border-border bg-card px-3.5 py-2 font-bold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors shadow-e1"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <span className="font-bold text-foreground text-sm">
                Page <strong className="text-primary">{queryData.currentPage}</strong> of <strong className="text-foreground">{queryData.totalPages}</strong>
              </span>

              <button
                disabled={page >= queryData.totalPages}
                onClick={() => setPage((prev) => Math.min(queryData.totalPages, prev + 1))}
                className="flex items-center gap-1 rounded-xl border border-border bg-card px-3.5 py-2 font-bold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors shadow-e1"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            <form onSubmit={handlePageJump} className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium text-xs">Jump to page:</span>
              <input
                type="number"
                min={1}
                max={queryData.totalPages}
                value={pageJumpInput}
                onChange={(e) => setPageJumpInput(e.target.value)}
                placeholder={page.toString()}
                className="w-16 rounded-xl border border-border bg-card px-2.5 py-1.5 text-center font-bold text-foreground text-xs outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-xl gradient-saffron px-3.5 py-1.5 font-bold text-white text-xs shadow-glow hover:scale-105 transition-transform"
              >
                Go
              </button>
            </form>
          </div>
        )}

        {/* Results Banner */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {query ? (
              <>Showing <strong className="text-foreground">{queryData.totalCount}</strong> search matches</>
            ) : activeTab !== "all" ? (
              <>Showing <strong className="text-foreground">{queryData.items.length}</strong> {activeTab} words</>
            ) : (
              <>Showing <strong className="text-foreground">{queryData.items.length}</strong> words on Page {queryData.currentPage} of {queryData.totalPages}</>
            )}
          </span>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="flex items-center gap-1 text-primary hover:underline font-semibold text-[11px]"
            >
              <RotateCcw size={12} /> Clear search
            </button>
          )}
        </div>

        {/* ================= 7. READABLE SPACIOUS DICTIONARY CARDS ================= */}
        <div className="flex flex-col gap-5">
          {loading && (
            /* Skeleton Loaders */
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 animate-pulse shadow-e1">
                  <div className="h-8 w-44 rounded-lg bg-muted" />
                  <div className="h-20 w-full rounded-2xl bg-muted/60" />
                </div>
              ))}
            </div>
          )}

          {!loading && queryData.items.length === 0 && (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-e2 animate-fade-in">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary-soft text-primary mb-3">
                <BookOpen size={32} />
              </div>
              <h3 className="text-lg font-bold text-foreground">No matching word found</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                We couldn't find any dictionary entry matching "<strong className="text-foreground">{query}</strong>".
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveTab("all");
                  setSelectedLetter("All");
                }}
                className="mt-5 rounded-full gradient-saffron px-6 py-2.5 text-xs font-bold text-white shadow-glow hover:scale-105 transition-transform"
              >
                Clear Search
              </button>
            </div>
          )}

          {queryData.items.map((item, idx) => {
            const isBookmarked = bookmarkedWords.has(item.marathi);
            const isPlaying = playingAudioWord === item.marathi;
            const isCopied = copiedWord === item.marathi;
            const hasEnglish = Boolean(item.english && item.english.trim());
            const hasHindi = Boolean(item.hindi && item.hindi.trim());

            return (
              <div
                key={`${item.marathi}_${idx}`}
                onClick={() => setSelectedWordDetail(item)}
                className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-6 transition-all shadow-e2 hover:shadow-e3 hover:border-primary/40 cursor-pointer animate-fade-in group"
              >
                {/* Header Row: Marathi Word + (English Translation inline) & Action Buttons */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <h2 className="font-mr text-2xl md:text-3xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {highlightMatch(item.marathi)}
                      </h2>

                      {/* English translation displayed directly beside Marathi word */}
                      {hasEnglish && (
                        <span className="text-base md:text-lg font-medium text-muted-foreground">
                          ({highlightMatch(item.english!.trim())})
                        </span>
                      )}

                      {/* Difficulty Badge (if authentic data exists) */}
                      {item.difficulty && (
                        <span
                          className={cn(
                            "rounded-lg px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
                            item.difficulty === "Easy"
                              ? "bg-success/15 text-success"
                              : item.difficulty === "Medium"
                              ? "bg-secondary/15 text-secondary"
                              : "bg-purple-500/15 text-purple-600"
                          )}
                        >
                          {item.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top-Right Aligned Action Buttons: Audio, Copy, Favorite */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handlePlayAudio(item.marathi, e)}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-2xl transition-all shadow-e1",
                        isPlaying
                          ? "gradient-saffron text-white animate-pulse scale-110 shadow-glow"
                          : "bg-primary-soft text-primary hover:scale-105"
                      )}
                      title="Listen to Marathi Pronunciation"
                    >
                      <Volume2 size={18} className={isPlaying ? "animate-bounce" : ""} />
                    </button>

                    <button
                      onClick={(e) => handleCopyWord(item, e)}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-2xl transition-all shadow-e1",
                        isCopied
                          ? "bg-success/20 text-success border border-success/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                      title="Copy Word"
                    >
                      {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    </button>

                    <button
                      onClick={(e) => toggleBookmark(item.marathi, e)}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-2xl transition-all shadow-e1",
                        isBookmarked
                          ? "bg-secondary/15 text-secondary border border-secondary/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                      title="Favorite Word"
                    >
                      <Bookmark size={18} className={isBookmarked ? "fill-secondary text-secondary" : ""} />
                    </button>
                  </div>
                </div>

                {/* Hindi Translation (rendered directly below if available) */}
                {hasHindi && (
                  <div className="font-mr text-base font-medium text-muted-foreground/90 pl-0.5">
                    {highlightMatch(item.hindi!.trim())}
                  </div>
                )}

                {/* Marathi Word Meaning Box */}
                {item.meaning && (
                  <div className="rounded-2xl bg-muted/25 p-4 text-base font-mr text-foreground leading-relaxed border border-border/40">
                    <p>{highlightMatch(item.meaning)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= 8. SLIDE-UP BOTTOM SHEET MODAL FOR COMPLETE MULTILINGUAL DETAILS ================= */}
        {selectedWordDetail && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-fade-in"
            onClick={() => setSelectedWordDetail(null)}
          >
            <div
              className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-5 rounded-t-3xl md:rounded-3xl border border-border bg-card p-6 md:p-8 shadow-e4 animate-slide-up overflow-y-auto hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Block: 1. Marathi Word (28px Bold), 2. English (18px), 3. Hindi (18px) */}
              <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-4">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  {/* Marathi Word (28px Bold) */}
                  <h2 className="font-mr text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    {selectedWordDetail.marathi}
                  </h2>

                  {/* English Translation (18px) */}
                  {selectedWordDetail.english && selectedWordDetail.english.trim() && (
                    <p className="text-lg md:text-xl font-semibold text-muted-foreground">
                      {selectedWordDetail.english.trim()}
                    </p>
                  )}

                  {/* Hindi Translation (18px) */}
                  {selectedWordDetail.hindi && selectedWordDetail.hindi.trim() && (
                    <p className="font-mr text-lg md:text-xl font-medium text-muted-foreground/90">
                      {selectedWordDetail.hindi.trim()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedWordDetail(null)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  title="Close Modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Pronunciation & Part of Speech Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  Part of Speech: Noun / Word
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                  Category: {selectedWordDetail.category || "Vocabulary"}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                  Difficulty: {selectedWordDetail.difficulty || "Easy"}
                </span>
              </div>

              {/* Complete Multilingual Meanings Box */}
              {selectedWordDetail.meaning && (
                <div className="flex flex-col gap-2.5 rounded-2xl bg-muted/30 p-5 border border-border/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <BookOpen size={15} /> Multilingual Meanings
                  </span>
                  <div className="flex flex-col gap-2 text-xs md:text-sm">
                    <div>
                      <span className="font-bold text-foreground block">Marathi Meaning:</span>
                      <span className="font-mr font-medium text-foreground/90 leading-relaxed block">{selectedWordDetail.meaning}</span>
                    </div>
                    {selectedWordDetail.english && (
                      <div>
                        <span className="font-bold text-foreground block">English Meaning:</span>
                        <span className="text-muted-foreground block">{selectedWordDetail.english}</span>
                      </div>
                    )}
                    {selectedWordDetail.hindi && (
                      <div>
                        <span className="font-bold text-foreground block">Hindi Meaning:</span>
                        <span className="font-mr text-muted-foreground block">{selectedWordDetail.hindi}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons (Moved Below Meaning: Listen, Copy, Favorite) */}
              <div className="flex items-center gap-3 pt-1 border-t border-border/40">
                <button
                  onClick={(e) => handlePlayAudio(selectedWordDetail.marathi, e)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-saffron px-4 py-3 text-xs font-bold text-white shadow-glow hover:scale-105 transition-transform"
                >
                  <Volume2 size={16} className={playingAudioWord === selectedWordDetail.marathi ? "animate-bounce" : ""} />
                  <span>Listen</span>
                </button>

                <button
                  onClick={(e) => handleCopyWord(selectedWordDetail, e)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  {copiedWord === selectedWordDetail.marathi ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                  <span>{copiedWord === selectedWordDetail.marathi ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  onClick={(e) => toggleBookmark(selectedWordDetail.marathi, e)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  <Bookmark size={16} className={bookmarkedWords.has(selectedWordDetail.marathi) ? "fill-secondary text-secondary" : ""} />
                  <span>Favorite</span>
                </button>
              </div>

              {/* Related Words Section at the bottom */}
              {relatedWords.length > 0 && (
                <div className="flex flex-col gap-2.5 pt-3 border-t border-border/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary" /> Related Words:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {relatedWords.map((rw, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedWordDetail(rw);
                          addRecentSearch(rw.marathi);
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-all"
                      >
                        <span className="font-mr font-bold">{rw.marathi}</span>
                        {rw.english && <span className="text-muted-foreground">({rw.english})</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 9. FOOTER PAGINATION ================= */}
        {!query && activeTab === "all" && queryData.totalPages > 1 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border text-xs shadow-e1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 px-4 py-2 font-bold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors shadow-e1"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <span className="font-bold text-foreground text-sm">
              Page <strong className="text-primary">{queryData.currentPage}</strong> of <strong className="text-foreground">{queryData.totalPages}</strong>
            </span>

            <button
              disabled={page >= queryData.totalPages}
              onClick={() => setPage((prev) => Math.min(queryData.totalPages, prev + 1))}
              className="flex items-center gap-1 rounded-xl border border-border bg-card px-4 py-2 font-bold text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors shadow-e1"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/dictionary")({
  head: () => ({
    meta: [
      { title: "Marathi Dictionary — BOLA Marathi" },
      { name: "description", content: "Instant 38,000+ pure Marathi word dictionary with audio pronunciation, multilingual details, and meanings." },
      { property: "og:title", content: "BOLA Multilingual Dictionary" },
      { property: "og:description", content: "Instant search for Marathi words and meanings." },
    ],
  }),
  component: DictionaryPage,
});
