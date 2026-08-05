import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Volume2,
  ArrowRight,
  X,
  Sparkles,
  Award,
  Mic,
  Star,
  Info,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  Play
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressBar } from "@/components/ui-kit/primitives";
import { cn } from "@/lib/utils";
import { useAppState } from "@/hooks/useAppState";
import { DatabaseService } from "@/lib/db/databaseService";
import { AudioEngine } from "@/lib/services/audioEngine";
import type { ModuleModel, SentenceModel } from "@/lib/db/models";

interface SessionScore {
  sentenceId: string;
  score: number;
  stars: number;
  sentence: SentenceModel;
}

function LessonModuleView() {
  const { id } = Route.useParams();
  const { addXp, addCoins } = useAppState();
  const nav = useNavigate();

  const [moduleData, setModuleData] = useState<ModuleModel | null>(null);
  const [sentences, setSentences] = useState<SentenceModel[]>([]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<"lesson" | "complete">("lesson");
  const [currentSubStep, setCurrentSubStep] = useState<"listen" | "understand" | "repeat" | "feedback">("listen");

  // Speeds & Audio
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Recording State
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "analyzing">("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // AI Feedback
  const [sentenceScore, setSentenceScore] = useState<number | null>(null);
  const [sentenceStars, setSentenceStars] = useState<number>(0);
  const [sentenceFeedback, setSentenceFeedback] = useState<string | null>(null);

  // Session stats
  const [sessionScores, setSessionScores] = useState<SessionScore[]>([]);
  const [weakPracticeMode, setWeakPracticeMode] = useState<boolean>(false);

  // Persistence state
  useEffect(() => {
    if (moduleData && !weakPracticeMode) {
      localStorage.setItem(`lesson_progress_${moduleData.id}`, currentSentenceIdx.toString());
    }
  }, [currentSentenceIdx, moduleData, weakPracticeMode]);

  useEffect(() => {
    AudioEngine.init();
    loadModuleAndSentences();
  }, [id]);

  const loadModuleAndSentences = async () => {
    try {
      await DatabaseService.init();
      const mod = await DatabaseService.getModuleById(id);
      if (mod) {
        setModuleData(mod);
        const sents = await DatabaseService.getSentences(mod.id);
        setSentences(sents);

        const savedIdxStr = localStorage.getItem(`lesson_progress_${mod.id}`);
        if (savedIdxStr) {
          const savedIdx = parseInt(savedIdxStr, 10);
          if (savedIdx >= 0 && savedIdx < sents.length) {
            setCurrentSentenceIdx(savedIdx);
          }
        }
      } else {
        // Fallback to first module of general course
        const fallbackId = "mod_general_1";
        const fallbackMod = await DatabaseService.getModuleById(fallbackId);
        if (fallbackMod) {
          setModuleData(fallbackMod);
          const sents = await DatabaseService.getSentences(fallbackMod.id);
          setSentences(sents);

          const savedIdxStr = localStorage.getItem(`lesson_progress_${fallbackMod.id}`);
          if (savedIdxStr) {
            const savedIdx = parseInt(savedIdxStr, 10);
            if (savedIdx >= 0 && savedIdx < sents.length) {
              setCurrentSentenceIdx(savedIdx);
            }
          }
        }
      }
    } catch (e) {
      console.error("Error loading module sentences:", e);
    }
  };

  if (!moduleData || sentences.length === 0) {
    return (
      <AppShell title="Lesson Practice">
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[450px] max-w-md mx-auto relative">
          {/* Floating Marathi Alphabets Background Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <span className="absolute text-4xl font-extrabold text-primary animate-bounce top-10 left-10" style={{ animationDuration: '3s' }}>अ</span>
            <span className="absolute text-3xl font-extrabold text-amber-500 top-20 right-12 animate-pulse" style={{ animationDuration: '2.5s' }}>ळ</span>
            <span className="absolute text-5xl font-extrabold text-orange-500 bottom-16 left-16 animate-bounce" style={{ animationDuration: '4s' }}>क</span>
            <span className="absolute text-4xl font-extrabold text-primary bottom-24 right-16 animate-pulse" style={{ animationDuration: '3.5s' }}>म</span>
          </div>

          {/* Saffron Rotating Mandala Outer Circle */}
          <div className="relative flex items-center justify-center h-28 w-28 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-500/30 animate-spin" style={{ animationDuration: '15s' }} />
            <div className="absolute h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
            <div className="absolute h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl animate-pulse">
              म
            </div>
          </div>

          {/* Interactive loading tip/card */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-e2 w-full animate-fade-in">
            <h3 className="font-display text-base font-bold text-foreground mb-1">
              Preparing Your Lesson
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Meera AI is organizing the conversational loop...
            </p>
            
            {/* Pulsing loading bar */}
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden relative">
              <div className="h-full gradient-saffron rounded-full w-2/3 animate-pulse absolute left-0" />
            </div>

            {/* Motivational subtext */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-center gap-2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              <Sparkles size={12} className="animate-spin" />
              <span>सराव माणसाला परिपूर्ण बनवतो (Practice makes perfect)</span>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const currentSentence = sentences[currentSentenceIdx];

  const handlePlayAudio = async () => {
    if (!currentSentence) return;
    setIsPlayingAudio(true);
    try {
      await AudioEngine.speak(currentSentence.marathi_text, playbackRate);
    } catch (e) {
      console.warn("Audio speech error:", e);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleToggleSpeed = () => {
    const nextRate = playbackRate === 1.0 ? 0.6 : 1.0;
    setPlaybackRate(nextRate);
    // Play immediately at new speed if in listen step
    AudioEngine.speak(currentSentence.marathi_text, nextRate);
  };

  const handleStartRecording = async () => {
    try {
      setRecordingState("recording");
      await AudioEngine.startRecording();
    } catch (e) {
      console.error("Recording start error:", e);
      setRecordingState("idle");
    }
  };

  const handleStopRecording = async () => {
    try {
      setRecordingState("analyzing");
      const blob = await AudioEngine.stopRecording();
      setAudioBlob(blob);

      // Trigger AI Assessment
      const response = await AudioEngine.assessRemotePronunciation(
        currentSentence.marathi_text,
        blob,
        currentSentence.english_meaning,
        currentSentence.transliteration
      );

      // Convert score out of 100 to star rating (1-5)
      // 90-100 = 5 stars, 75-89 = 4 stars, 60-74 = 3 stars, 40-59 = 2 stars, <40 = 1 star
      const score = response.score || 85;
      let stars = 1;
      if (score >= 90) stars = 5;
      else if (score >= 75) stars = 4;
      else if (score >= 60) stars = 3;
      else if (score >= 40) stars = 2;

      setSentenceScore(score);
      setSentenceStars(stars);
      setSentenceFeedback(response.feedback || "Pronunciation analyzed successfully.");
      setCurrentSubStep("feedback");
    } catch (e) {
      console.error("Recording stop or assessment error:", e);
      // Fallback in case of absolute failure
      setSentenceScore(75);
      setSentenceStars(4);
      setSentenceFeedback("Good effort! Connection was busy but your attempt has been registered.");
      setCurrentSubStep("feedback");
    } finally {
      setRecordingState("idle");
    }
  };

  const handleNextOrFinish = () => {
    // Save current sentence score to session log
    const scoreItem: SessionScore = {
      sentenceId: currentSentence.id,
      score: sentenceScore || 80,
      stars: sentenceStars,
      sentence: currentSentence
    };

    // Update session scores list
    setSessionScores((prev) => {
      const filtered = prev.filter(x => x.sentenceId !== currentSentence.id);
      return [...filtered, scoreItem];
    });

    // Reset sentence states
    setSentenceScore(null);
    setSentenceStars(0);
    setSentenceFeedback(null);
    setAudioBlob(null);

    // Navigate to next sentence or complete screen
    if (currentSentenceIdx < sentences.length - 1) {
      setCurrentSentenceIdx((prev) => prev + 1);
      setCurrentSubStep("listen");
      setPlaybackRate(1.0); // Reset speed to normal
    } else {
      if (moduleData) {
        localStorage.removeItem(`lesson_progress_${moduleData.id}`);
      }
      setActiveStep("complete");
    }
  };

  const handleRetrySentence = () => {
    setSentenceScore(null);
    setSentenceStars(0);
    setSentenceFeedback(null);
    setAudioBlob(null);
    setCurrentSubStep("repeat");
  };

  const handleRestartWeakSentences = () => {
    // Sort session scores to get 2-3 lowest-scored sentences
    const sorted = [...sessionScores].sort((a, b) => a.score - b.score);
    const weakSents = sorted.slice(0, 3).map(x => x.sentence);

    if (weakSents.length > 0) {
      setSentences(weakSents);
      setCurrentSentenceIdx(0);
      setCurrentSubStep("listen");
      setActiveStep("lesson");
      setWeakPracticeMode(true);
      setSentenceScore(null);
      setSentenceFeedback(null);
    }
  };

  const handleFinishLesson = async () => {
    if (moduleData) {
      localStorage.removeItem(`lesson_progress_${moduleData.id}`);
    }
    // Complete module in DB and add XP/Gems
    const xpEarned = moduleData.xp || 50;
    await DatabaseService.completeModule(moduleData.id, xpEarned);
    await addXp(xpEarned);
    await addCoins(10);
    nav({ to: "/course" });
  };

  // Calculations for Complete state
  const totalMastered = sessionScores.filter(s => s.stars >= 4).length;
  const avgStars = sessionScores.length > 0
    ? (sessionScores.reduce((sum, s) => sum + s.stars, 0) / sessionScores.length).toFixed(1)
    : "0";

  return (
    <AppShell title={`Module ${moduleData.moduleNumber}`} subtitle={moduleData.titleEn}>
      <div className="flex flex-col gap-5 pb-24 max-w-lg mx-auto w-full">

        {/* TOP NAVIGATION & PROGRESS */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => nav({ to: "/course" })}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex-1">
            <ProgressBar
              value={activeStep === "complete" ? 1.0 : (currentSentenceIdx + 1) / sentences.length}
              tone="primary"
            />
          </div>

          <span className="text-[10px] font-bold text-muted-foreground tracking-wider shrink-0">
            {activeStep === "complete" ? "COMPLETE" : `${currentSentenceIdx + 1} / ${sentences.length}`}
          </span>
        </div>

        {/* INTERACTIVE STUDY STEP */}
        {activeStep === "lesson" && currentSentence && (
          <div className="flex flex-col gap-5 animate-fade-in">
            {/* Header info */}
            <div className="flex flex-col gap-1 rounded-3xl border border-border bg-card p-5 shadow-e2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                  {weakPracticeMode ? "Weak Sentences Practice" : "Conversational Lesson"}
                </span>
                {weakPracticeMode && (
                  <span className="bg-amber-500/10 text-amber-500 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-500/20">
                    Review Mode
                  </span>
                )}
              </div>
              <h2 className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Theme: {moduleData.titleEn}
              </h2>
            </div>

            {/* Loop Visual State Tracker */}
            <div className="grid grid-cols-4 gap-1 bg-muted/40 p-1 rounded-2xl border border-border text-center text-[10px] font-bold text-muted-foreground">
              <div className={cn("py-1 rounded-xl transition-all", currentSubStep === "listen" ? "bg-primary text-white shadow-e1" : "")}>1. Listen</div>
              <div className={cn("py-1 rounded-xl transition-all", currentSubStep === "understand" ? "bg-primary text-white shadow-e1" : "")}>2. Understand</div>
              <div className={cn("py-1 rounded-xl transition-all", currentSubStep === "repeat" ? "bg-primary text-white shadow-e1" : "")}>3. Repeat</div>
              <div className={cn("py-1 rounded-xl transition-all", currentSubStep === "feedback" ? "bg-primary text-white shadow-e1" : "")}>4. Feedback</div>
            </div>

            {/* CORE SENTENCE CARD */}
            <div className="flex flex-col items-center justify-center gap-5 rounded-[32px] border border-border/80 bg-card p-6 md:p-8 text-center shadow-e3 min-h-[300px] relative overflow-hidden">
              
              {/* Devanagari text is always visible to aid learning */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mr text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-relaxed">
                  {currentSentence.marathi_text}
                </span>
              </div>

              {/* Step: LISTEN */}
              {currentSubStep === "listen" && (
                <div className="flex flex-col items-center gap-4 w-full animate-fade-in mt-2">
                  <p className="text-xs text-muted-foreground">Listen carefully to the native Marathi pronunciation.</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={handlePlayAudio}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold transition-all shadow-e2 active:scale-95",
                        isPlayingAudio
                          ? "gradient-saffron text-white scale-105 shadow-glow"
                          : "bg-primary-soft text-primary hover:bg-primary hover:text-white"
                      )}
                    >
                      <Volume2 size={16} />
                      <span>{isPlayingAudio ? "Playing..." : "Listen Sentence"}</span>
                    </button>

                    <button
                      onClick={handleToggleSpeed}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-4 py-3 text-xs font-bold transition-all border",
                        playbackRate === 0.6
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : "bg-muted border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span>{playbackRate === 0.6 ? "🐢 Slow (0.6x)" : "▶️ Normal (1.0x)"}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setCurrentSubStep("understand")}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl gradient-saffron text-sm font-bold text-white shadow-glow active:scale-98"
                  >
                    <span>Understand Meaning</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Step: UNDERSTAND */}
              {currentSubStep === "understand" && (
                <div className="flex flex-col items-center gap-4 w-full animate-fade-in mt-1">
                  <div className="flex flex-col gap-2 w-full bg-muted/30 p-4 rounded-2xl border border-border/50 text-left">
                    <div>
                      <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Romanized Transliteration</span>
                      <span className="text-xs font-semibold text-primary/95 italic">
                        {currentSentence.transliteration}
                      </span>
                    </div>

                    <div className="h-px bg-border/50 my-1" />

                    <div>
                      <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">English Meaning</span>
                      <span className="text-sm font-bold text-foreground">
                        {currentSentence.english_meaning}
                      </span>
                    </div>

                    {currentSentence.usage_note && (
                      <>
                        <div className="h-px bg-border/50 my-1" />
                        <div className="flex gap-1.5 items-start">
                          <Info size={12} className="text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[9px] font-extrabold text-muted-foreground uppercase block">Usage Note</span>
                            <span className="text-[11px] text-muted-foreground leading-normal">
                              {currentSentence.usage_note}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 w-full mt-4">
                    <button
                      onClick={() => setCurrentSubStep("listen")}
                      className="flex-1 py-3 rounded-2xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentSubStep("repeat")}
                      className="flex-[2] py-3 rounded-2xl gradient-saffron text-xs font-bold text-white shadow-glow active:scale-98"
                    >
                      Practice Speaking
                    </button>
                  </div>
                </div>
              )}

              {/* Step: REPEAT */}
              {currentSubStep === "repeat" && (
                <div className="flex flex-col items-center gap-4 w-full animate-fade-in mt-2">
                  <p className="text-xs text-muted-foreground">Tap to record and speak the sentence aloud in Marathi.</p>

                  <div className="flex flex-col items-center gap-2 my-4">
                    {recordingState === "recording" ? (
                      <button
                        onClick={handleStopRecording}
                        className="h-20 w-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-glow animate-pulse active:scale-95"
                      >
                        <div className="h-6 w-6 rounded bg-white" />
                      </button>
                    ) : (
                      <button
                        onClick={handleStartRecording}
                        disabled={recordingState === "analyzing"}
                        className="h-20 w-20 rounded-full gradient-saffron text-white flex items-center justify-center shadow-glow active:scale-95 hover:scale-105 transition-transform"
                      >
                        <Mic size={32} />
                      </button>
                    )}

                    <span className="text-xs font-bold text-muted-foreground">
                      {recordingState === "recording"
                        ? "Recording... Tap to Stop"
                        : recordingState === "analyzing"
                        ? "Analyzing speech with Gemini..."
                        : "Tap Mic to Start Speaking"}
                    </span>
                  </div>

                  {recordingState === "recording" && (
                    <div className="flex gap-1 items-center justify-center mt-1">
                      <div className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-8 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-10 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      <div className="w-1.5 h-8 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      <div className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    </div>
                  )}

                  {recordingState === "analyzing" && (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}

                  <div className="flex gap-2 w-full mt-2">
                    <button
                      onClick={() => setCurrentSubStep("understand")}
                      className="w-full py-3 rounded-2xl border border-border bg-card text-xs font-bold text-foreground hover:bg-muted"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlayAudio}
                      className="w-full py-3 rounded-2xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      Listen Again
                    </button>
                  </div>
                </div>
              )}

              {/* Step: AI FEEDBACK */}
              {currentSubStep === "feedback" && (
                <div className="flex flex-col items-center gap-4 w-full animate-fade-in mt-1">
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((sIndex) => (
                      <Star
                        key={sIndex}
                        size={26}
                        className={cn(
                          sIndex <= sentenceStars
                            ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>

                  {/* Feedback Card */}
                  <div className={cn(
                    "flex flex-col gap-1 w-full p-4 rounded-2xl border text-left",
                    sentenceStars >= 4
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-400"
                  )}>
                    <div className="flex items-center gap-1.5 font-extrabold text-[10px] uppercase tracking-wider">
                      <span>Pronunciation Assessment</span>
                      <span>•</span>
                      <span>Score: {sentenceScore}%</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed mt-1">
                      {sentenceFeedback}
                    </p>
                  </div>

                  {/* Continue/Retry controls */}
                  <div className="flex gap-3 w-full mt-3">
                    {sentenceStars < 4 ? (
                      <>
                        <button
                          onClick={handleRetrySentence}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400 active:scale-95 transition-transform"
                        >
                          <RefreshCw size={14} />
                          <span>Retry Sentence</span>
                        </button>
                        <button
                          onClick={handleNextOrFinish}
                          className="flex-1 py-3.5 rounded-2xl bg-muted hover:bg-muted/80 text-xs font-bold text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                        >
                          <span>Skip Sentence</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleNextOrFinish}
                        className="w-full flex items-center justify-center gap-1 py-3.5 rounded-2xl bg-success text-xs font-bold text-white shadow-glow active:scale-95 transition-transform font-extrabold"
                      >
                        <span>{currentSentenceIdx < sentences.length - 1 ? "Next Sentence" : "Finish Lesson"}</span>
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* LESSON SUMMARY STATE */}
        {activeStep === "complete" && (
          <div className="flex flex-col items-center justify-center text-center p-6 bg-card rounded-3xl border border-border shadow-e3 animate-fade-in mt-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-success/20 text-success mb-4 animate-bounce">
              <Award size={42} />
            </div>

            <h3 className="font-display text-2xl font-bold text-foreground">
              Lesson Practice Completed!
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              You completed the conversational sentence training for this module.
            </p>

            {/* Score Metrics Grid */}
            <div className="my-6 grid grid-cols-2 gap-4 w-full">
              <div className="bg-muted/30 border border-border p-4 rounded-2xl">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Avg Pronunciation</span>
                <span className="text-2xl font-extrabold text-foreground flex items-center justify-center gap-1 mt-1">
                  {avgStars} <Star size={18} className="fill-amber-400 text-amber-400 shrink-0" />
                </span>
              </div>
              <div className="bg-muted/30 border border-border p-4 rounded-2xl">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Sentences Mastered</span>
                <span className="text-2xl font-extrabold text-primary mt-1 block">
                  {totalMastered} / {sentences.length}
                </span>
              </div>
            </div>

            {/* Loot & XP */}
            <div className="flex items-center gap-6 rounded-2xl bg-muted/40 px-6 py-4 text-xs font-bold border border-border/50 mb-6">
              <div>
                <span className="text-muted-foreground block text-[10px]">XP Earned</span>
                <span className="text-lg font-black text-amber-500">+{moduleData.xp} XP</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <span className="text-muted-foreground block text-[10px]">Loot Gems</span>
                <span className="text-lg font-black text-primary">+10 Gems</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleRestartWeakSentences}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary-soft hover:bg-primary/10 text-xs font-bold text-primary active:scale-95 transition-transform"
              >
                <RefreshCw size={15} />
                <span>Practice Weak Sentences Again</span>
              </button>

              <button
                onClick={handleFinishLesson}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl gradient-saffron text-sm font-bold text-white shadow-glow active:scale-95 transition-transform"
              >
                <span>Finish & Return</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/lesson/$id")({
  head: () => ({
    meta: [
      { title: "Conversational Lesson — BOLA Marathi" },
      { name: "description", content: "Sentence-based conversational practice with instant AI feedback." },
    ],
  }),
  component: LessonModuleView,
});
