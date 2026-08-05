import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  User,
  Palette,
  Globe,
  Bell,
  Volume2,
  Download,
  ShieldCheck,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  Trash2,
  Check,
  Sparkles,
  Lock,
  AlertTriangle,
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { ModelManager } from "../lib/services/modelManager";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui-kit/primitives";
import { AuthService } from "@/lib/services/authService";
import { DatabaseService } from "@/lib/db/databaseService";
import { AudioEngine } from "@/lib/services/audioEngine";
import { ApiKeyManager } from "@/lib/services/apiKeyManager";
import { useAppState } from "@/hooks/useAppState";
import { user as defaultUser } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  if (typeof window === "undefined") {
    console.log("[Route Load]: Loading Settings (SSR)");
  } else {
    console.log("[Route Load]: Loading Settings (Client)");
  }
  const { authUser, theme, toggleTheme } = useAppState();
  const nav = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: authUser?.name || defaultUser.name,
    email: authUser?.email || "aarav.sharma@gmail.com",
    avatar: authUser?.avatar || defaultUser.avatar,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return true;
    try {
      const saved = localStorage.getItem("bola_notif_pref");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [speechSpeed, setSpeechSpeed] = useState<"0.8x" | "1.0x" | "1.2x">("1.0x");
  const [offlinePackDownloaded, setOfflinePackDownloaded] = useState(true);
  const [isDownloadingPack, setIsDownloadingPack] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [cacheCleared, setCacheCleared] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // Gemini API Key Manager states
  const [hasApiKey, setHasApiKey] = useState(() => {
    if (typeof window === "undefined") return false;
    return ApiKeyManager.hasApiKey();
  });
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isEditingKey, setIsEditingKey] = useState(() => {
    if (typeof window === "undefined") return false;
    return !ApiKeyManager.hasApiKey();
  });
  const [keyValidationStatus, setKeyValidationStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [showDeleteKeyConfirm, setShowDeleteKeyConfirm] = useState(false);

  const [backendUrlInput, setBackendUrlInput] = useState(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return "";
    return localStorage.getItem("bola_backend_url") || "";
  });
  const [isSavedUrl, setIsSavedUrl] = useState(false);

  const handleSaveBackendUrl = () => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const cleanUrl = backendUrlInput.trim().replace(/\/$/, '');
        if (cleanUrl) {
          localStorage.setItem("bola_backend_url", cleanUrl);
        } else {
          localStorage.removeItem("bola_backend_url");
        }
        setIsSavedUrl(true);
        setTimeout(() => setIsSavedUrl(false), 2000);
      } catch (err) {
        console.warn("Failed to save backend URL", err);
      }
    }
  };

  useEffect(() => {
    DatabaseService.getUser().then((u) => {
      setUserInfo({
        name: authUser?.name || u.name || defaultUser.name,
        email: authUser?.email || u.email || "aarav.sharma@gmail.com",
        avatar: authUser?.avatar || u.avatar || defaultUser.avatar,
      });
    });
  }, [authUser]);

  const handleToggleNotifications = () => {
    setNotificationsEnabled((prev: boolean) => {
      const next = !prev;
      try {
        localStorage.setItem("bola_notif_pref", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSpeedChange = (speedStr: "0.8x" | "1.0x" | "1.2x") => {
    setSpeechSpeed(speedStr);
    const numRate = parseFloat(speedStr.replace("x", ""));
    AudioEngine.setPlaybackRate(numRate);
  };

  const handleOfflinePackToggle = () => {
    if (offlinePackDownloaded) {
      setOfflinePackDownloaded(false);
    } else {
      setIsDownloadingPack(true);
      setDownloadProgress(10);
      const timer = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsDownloadingPack(false);
            setOfflinePackDownloaded(true);
            return 100;
          }
          return prev + 30;
        });
      }, 300);
    }
  };

  const handleClearAudioMemory = () => {
    AudioEngine.clearCache();
    try {
      localStorage.removeItem("bola_audio_cache");
    } catch {}
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  // API Key Actions
  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    setKeyValidationStatus({ type: "loading", message: "Validating API Key & discovering available Gemini models..." });

    const result = await ApiKeyManager.saveApiKey(apiKeyInput.trim());

    if (result.isValid) {
      const candidatesCount = result.availableModels ? result.availableModels.length : 0;
      setKeyValidationStatus({
        type: "success",
        message: `✓ Connected | Model: ${result.selectedModel} | API Version: ${result.apiVersion || "v1beta"}${candidatesCount > 0 ? ` (${candidatesCount} models available)` : ""}`
      });
      setHasApiKey(true);
      setIsEditingKey(false);
      setApiKeyInput("");
    } else {
      setKeyValidationStatus({ type: "error", message: result.message });
    }
  };

  const handleTestApiKeyConnection = async () => {
    const keyToTest = apiKeyInput.trim() || ApiKeyManager.getApiKey() || "";
    if (!keyToTest) {
      setKeyValidationStatus({ type: "error", message: "✗ Invalid API Key: Please enter an API key to test." });
      return;
    }

    setKeyValidationStatus({ type: "loading", message: "Testing connection & discovering Gemini models..." });
    const result = await ApiKeyManager.validateApiKey(keyToTest);

    if (result.isValid) {
      const candidatesCount = result.availableModels ? result.availableModels.length : 0;
      setKeyValidationStatus({
        type: "success",
        message: `✓ Connected | Model: ${result.selectedModel} | API Version: ${result.apiVersion || "v1beta"}${candidatesCount > 0 ? ` (${candidatesCount} models available)` : ""}`
      });
    } else {
      setKeyValidationStatus({ type: "error", message: result.message });
    }
  };

  const handleDeleteApiKeyConfirm = () => {
    ApiKeyManager.deleteApiKey();
    setHasApiKey(false);
    setIsEditingKey(true);
    setApiKeyInput("");
    setKeyValidationStatus({ type: "idle", message: "" });
    setShowDeleteKeyConfirm(false);
  };

  const handleLogoutConfirm = async () => {
    await AuthService.logout();
    nav({ to: "/onboarding" });
  };

  return (
    <AppShell title="Settings" subtitle="Preferences & Account Management" back={true}>
      <div className="flex flex-col gap-6">
        {/* 1. Account Section */}
        <div>
          <SectionHeader title="Account" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden">
            <Link to="/account" className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={userInfo.avatar}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-11 w-11 rounded-full border-2 border-primary/30 bg-card object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{userInfo.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{userInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary font-semibold shrink-0">
                <span>View Account</span>
                <ChevronRight size={16} />
              </div>
            </Link>
          </div>
        </div>

        {/* ================= 2. AI CONFIGURATION SECTION ================= */}
        <div>
          <SectionHeader title="AI Configuration" />
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card shadow-e1 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-saffron text-white shadow-glow shrink-0">
                <Sparkles size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">Gemini API Key</p>
                  {hasApiKey && !isEditingKey && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-bold text-success border border-success/30">
                      <CheckCircle2 size={12} /> Connected
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add your Gemini API key to enable Meera AI features.
                </p>
              </div>
            </div>

            {/* API Key Input Container */}
            <div className="mt-1 flex flex-col gap-2">
              <div className="relative flex items-center rounded-xl border border-border bg-muted/30 px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                <Key size={16} className="text-muted-foreground shrink-0 mr-2" />
                {hasApiKey && !isEditingKey ? (
                  <input
                    type="text"
                    value={ApiKeyManager.getMaskedKey()}
                    readOnly
                    tabIndex={-1}
                    className="w-full bg-transparent font-mono text-sm tracking-widest text-foreground outline-none cursor-default select-none"
                  />
                ) : (
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Paste your Gemini API key (AIzaSy...)"
                    className="w-full bg-transparent text-sm font-mono text-foreground outline-none placeholder:text-muted-foreground"
                  />
                )}
              </div>

              {/* Validation Status Feedback Banner */}
              {keyValidationStatus.type !== "idle" && (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold border animate-fade-in",
                    keyValidationStatus.type === "loading" && "bg-primary-soft text-primary border-primary/20",
                    keyValidationStatus.type === "success" && "bg-success/15 text-success border-success/30",
                    keyValidationStatus.type === "error" && "bg-destructive/15 text-destructive border-destructive/30"
                  )}
                >
                  {keyValidationStatus.type === "loading" && <Loader2 size={14} className="animate-spin" />}
                  {keyValidationStatus.type === "success" && <CheckCircle2 size={14} />}
                  {keyValidationStatus.type === "error" && <XCircle size={14} />}
                  <span>{keyValidationStatus.message}</span>
                </div>
              )}

              {/* Supported Capabilities Info Card */}
              {hasApiKey && (
                <div className="mt-1 rounded-xl border border-border bg-card p-3 text-xs flex flex-col gap-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground">Selected Model:</span>
                    <span className="font-mono text-primary font-bold">{ModelManager.getStoredModelConfig().model || "Discovering..."}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/50 pt-2">
                    <span className="font-semibold text-muted-foreground">Supported Capabilities:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 font-medium text-success text-[11px]">
                        Chat ✓
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 font-medium text-success text-[11px]">
                        Generate Content ✓
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 font-medium text-success text-[11px]">
                        Streaming ✓
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {hasApiKey && !isEditingKey ? (
                    <button
                      onClick={() => setIsEditingKey(true)}
                      className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors"
                    >
                      Update Key
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveApiKey}
                      disabled={!apiKeyInput.trim() || keyValidationStatus.type === "loading"}
                      className="inline-flex items-center gap-1.5 rounded-xl gradient-saffron px-4 py-1.5 text-xs font-bold text-white shadow-glow disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                    >
                      {keyValidationStatus.type === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      <span>Save Key</span>
                    </button>
                  )}

                  <button
                    onClick={handleTestApiKeyConnection}
                    disabled={keyValidationStatus.type === "loading" || (!hasApiKey && !apiKeyInput.trim())}
                    className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/40 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw size={12} className={keyValidationStatus.type === "loading" ? "animate-spin" : ""} />
                    <span>Test Connection</span>
                  </button>
                </div>

                {hasApiKey && (
                  <button
                    onClick={() => setShowDeleteKeyConfirm(true)}
                    className="inline-flex items-center gap-1 rounded-xl bg-destructive/15 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/25 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
              {/* Custom Backend URL Configuration */}
              <div className="border-t border-border/50 pt-3 mt-2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground">API Backend Server URL</p>
                  {isSavedUrl && (
                    <span className="text-[10px] font-bold text-success animate-fade-in">Saved!</span>
                  )}
                </div>
                <div className="relative flex items-center rounded-xl border border-border bg-muted/30 px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                  <Globe size={14} className="text-muted-foreground shrink-0 mr-2" />
                  <input
                    type="text"
                    value={backendUrlInput}
                    onChange={(e) => setBackendUrlInput(e.target.value)}
                    placeholder="http://localhost:5000 (Optional)"
                    className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={handleSaveBackendUrl}
                    className="ml-2 rounded-lg bg-primary-soft text-primary px-2.5 py-1 text-[10px] font-bold hover:bg-primary hover:text-white transition-colors"
                  >
                    Save URL
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Specify a custom Flask backend URL to test locally on mobile (e.g. your laptop's IP: `http://192.168.1.15:5000`) or cloud server.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Appearance Section */}
        <div>
          <SectionHeader title="Appearance" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Palette size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Dark Theme</p>
                  <p className="text-[11px] text-muted-foreground">Toggle theme contrast for day or night</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                aria-label="Toggle Dark Theme"
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  theme === "dark" ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Language Section */}
        <div>
          <SectionHeader title="Language" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden">
            <Link to="/language" className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Target Language</p>
                  <p className="text-[11px] text-muted-foreground">English ↔ Marathi (Standard Marathi)</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* 5. Notifications Section */}
        <div>
          <SectionHeader title="Notifications" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Daily Practice Alerts</p>
                  <p className="text-[11px] text-muted-foreground">Streak protection reminders & rewards</p>
                </div>
              </div>
              <button
                onClick={handleToggleNotifications}
                aria-label="Toggle Daily Notifications"
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  notificationsEnabled ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    notificationsEnabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 6. Voice Settings Section */}
        <div>
          <SectionHeader title="Voice Settings" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Volume2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Audio Playback Speed</p>
                  <p className="text-[11px] text-muted-foreground">Adjust audio speech pronunciation pace</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {(["0.8x", "1.0x", "1.2x"] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={cn(
                    "flex-1 rounded-xl border py-2 text-xs font-bold transition-all active:scale-[0.97]",
                    speechSpeed === speed
                      ? "border-primary bg-primary-soft text-primary shadow-glow"
                      : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {speed} {speed === "1.0x" && "(Normal)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Offline Lessons Section */}
        <div>
          <SectionHeader title="Offline Lessons" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary shrink-0">
                  <Download size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground">Maharashtra Offline Pack</p>
                  <p className="text-[11px] text-muted-foreground truncate">4 Cities, 20 Locations & Audio (24.8 MB)</p>
                </div>
              </div>
              <button
                onClick={handleOfflinePackToggle}
                disabled={isDownloadingPack}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-all active:scale-[0.97]",
                  offlinePackDownloaded ? "bg-success/15 text-success border border-success/30" : "bg-primary text-white shadow-e1"
                )}
              >
                {offlinePackDownloaded ? <Check size={14} /> : <Download size={14} />}
                <span>{isDownloadingPack ? `${downloadProgress}%` : offlinePackDownloaded ? "Downloaded" : "Download"}</span>
              </button>
            </div>
            {isDownloadingPack && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
              </div>
            )}
          </div>
        </div>

        {/* 8. Privacy Section */}
        <div>
          <SectionHeader title="Privacy" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Data Encryption & Privacy</p>
                  <p className="text-[11px] text-muted-foreground">All progress is stored & encrypted locally</p>
                </div>
              </div>
              <Lock size={16} className="text-muted-foreground" />
            </div>
            <button
              onClick={handleClearAudioMemory}
              className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/15 text-destructive">
                  <Trash2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Clear Audio Memory</p>
                  <p className="text-[11px] text-muted-foreground">Frees temporary voice speech cache</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-primary">{cacheCleared ? "Cleared!" : "Clear"}</span>
            </button>
          </div>
        </div>

        {/* 9. Help & Support Section */}
        <div>
          <SectionHeader title="Help & Support" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden">
            <Link to="/help" className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">FAQs & Contact Support</p>
                  <p className="text-[11px] text-muted-foreground">Ask questions or report bugs to our team</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* 10. About BOLA Marathi Section */}
        <div>
          <SectionHeader title="About BOLA Marathi" />
          <div className="flex flex-col rounded-2xl border border-border bg-card shadow-e1 overflow-hidden">
            <Link to="/about" className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl gradient-saffron text-white shadow-e1">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">BOLA Marathi (Build 1.4.0)</p>
                  <p className="text-[11px] text-muted-foreground">Licenses, credits & application details</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* 11. Sign Out Button */}
        <div className="mt-4 pb-8">
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 text-base font-semibold text-destructive shadow-e1 hover:bg-destructive/10 active:scale-[0.98] transition-transform"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Delete API Key Confirmation Modal */}
      {showDeleteKeyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-5 shadow-e3 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-destructive/15 text-destructive">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Delete Gemini API Key?</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Are you sure you want to remove your stored API key? Meera AI chat features will be disabled until a new key is added.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDeleteKeyConfirm(false)}
                className="flex-1 rounded-2xl border border-border bg-card py-3 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteApiKeyConfirm}
                className="flex-1 rounded-2xl bg-destructive py-3 text-xs font-semibold text-white shadow-e2 hover:opacity-90 active:scale-[0.98] transition-transform"
              >
                Delete Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal Dialog */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-5 shadow-e3 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-destructive/15 text-destructive">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Sign Out of BOLA Marathi?</h3>
            <p className="mt-1 text-xs text-muted-foreground">Your learning progress and streak will remain safely saved on your device.</p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 rounded-2xl border border-border bg-card py-3 text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 rounded-2xl bg-destructive py-3 text-xs font-semibold text-white shadow-e2 hover:opacity-90 active:scale-[0.98] transition-transform"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — BOLA Marathi" },
      { name: "description", content: "Account preferences, AI configuration, appearance, notifications, voice settings, and offline storage." },
      { property: "og:title", content: "Settings — BOLA Marathi" },
      { property: "og:description", content: "Account preferences, AI configuration, appearance, notifications, and offline options." },
    ],
  }),
  component: SettingsPage,
});
