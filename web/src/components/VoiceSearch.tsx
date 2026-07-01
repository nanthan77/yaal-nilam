"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * VoiceSearch — AI Voice Agent for Yaal Nilam
 *
 * Three variants:
 *   "floating" — Fixed bottom-right expandable chat panel
 *   "hero"     — Centered button for the homepage hero
 *   "inline"   — Compact button for filter bars / property pages
 *
 * Flow: idle → listening (mic recording) → processing (STT + AI) → speaking (TTS) → idle
 *
 * Backend endpoints (ai-service):
 *   POST /api/process-voice  — Upload audio, get AI text response
 *   POST /api/tts/speak      — Text → ElevenLabs audio (Tamil/English)
 *   POST /api/tts/stream     — Streaming TTS for low-latency playback
 *
 * The component is rendered ONLY when NEXT_PUBLIC_AI_SERVICE_URL is configured.
 * If the configured service is unreachable, a brief bilingual
 * "service unavailable" message is shown/spoken — never fabricated results.
 */

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "error";
type Variant = "floating" | "hero" | "inline";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "";

interface VoiceSearchProps {
  variant?: Variant;
}

// Component is hidden when the AI service URL is not configured.
export default function VoiceSearch({ variant = "floating" }: VoiceSearchProps) {
  const { locale } = useStore();
  const l = locale;

  const [state, setState] = useState<VoiceState>("idle");
  const [isOpen, setIsOpen] = useState(variant !== "floating");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ── Start recording ────────────────────────────────
  const startListening = useCallback(async () => {
    try {
      setErrorMsg("");
      setTranscript("");
      setResponse("");
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setState("listening");
    } catch {
      setErrorMsg(l === "ta" ? "மைக்ரோஃபோன் அணுகல் அனுமதி இல்லை" : "Microphone access denied");
      setState("error");
    }
  }, [l]);

  // ── Stop recording ─────────────────────────────────
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setState("processing");
    }
  }, []);

  // Hidden when the AI service URL is not configured (after all hooks to keep hook order stable).
  if (!AI_SERVICE_URL) return null;

  // ── Process recorded audio ─────────────────────────
  const processAudio = async (audioBlob: Blob) => {
    setState("processing");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", l);

      const res = await fetch(`${AI_SERVICE_URL}/api/process-voice`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setTranscript(data.transcript || "");
        setResponse(data.response || "");
        await speakResponse(data.response || "", l);
        return;
      }
    } catch {
      // Service unreachable — show bilingual unavailable message
    }

    // Service unavailable — bilingual message, no fake results
    const unavailableMsg =
      l === "ta"
        ? "மன்னிக்கவும், குரல் தேடல் சேவை தற்போது கிடைக்கவில்லை. (Voice search service is currently unavailable.)"
        : "Voice search service is currently unavailable. Sorry for the inconvenience. (குரல் தேடல் சேவை தற்போது கிடைக்கவில்லை.)";
    setTranscript("");
    setResponse(unavailableMsg);
    setState("error");
    setErrorMsg(unavailableMsg);
  };

  // ── Text-to-Speech ─────────────────────────────────
  const speakResponse = async (text: string, lang: string) => {
    setState("speaking");

    try {
      // Try ElevenLabs TTS backend
      const res = await fetch(`${AI_SERVICE_URL}/api/tts/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: lang }),
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setState("idle");
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          fallbackSpeech(text, lang);
        };

        await audio.play();
        return;
      }
    } catch {
      // ElevenLabs not available
    }

    // Fallback: browser SpeechSynthesis
    fallbackSpeech(text, lang);
  };

  // ── Browser SpeechSynthesis fallback ───────────────
  const fallbackSpeech = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ta" ? "ta-IN" : "en-US";
      utterance.rate = 0.9;
      utterance.onend = () => setState("idle");
      utterance.onerror = () => setState("idle");
      window.speechSynthesis.speak(utterance);
    } else {
      setState("idle");
    }
  };

  // ── Stop speaking ──────────────────────────────────
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setState("idle");
  };

  // ── State-based label ──────────────────────────────
  const stateLabel = {
    idle: l === "ta" ? "குரலில் தேடுங்கள்" : "Search by voice",
    listening: l === "ta" ? "கேட்டுக் கொண்டிருக்கிறேன்..." : "Listening...",
    processing: l === "ta" ? "செயலாக்கப்படுகிறது..." : "Processing...",
    speaking: l === "ta" ? "பதிலளிக்கிறது..." : "Speaking...",
    error: errorMsg || (l === "ta" ? "பிழை" : "Error"),
  };

  // ── Mic button click handler ───────────────────────
  const handleMicClick = () => {
    if (state === "listening") stopListening();
    else if (state === "speaking") stopSpeaking();
    else if (state === "idle" || state === "error") startListening();
  };

  // ═══════════════════════════════════════════════════
  // VARIANT: FLOATING (bottom-right expandable panel)
  // ═══════════════════════════════════════════════════
  if (variant === "floating") {
    return (
      <>
        {/* Collapsed button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-50 bg-teal-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-float hover:bg-teal-700 hover:scale-110 transition-all duration-300"
            aria-label="Voice Search"
          >
            <MicIcon className="w-6 h-6" />
          </button>
        )}

        {/* Expanded panel */}
        {isOpen && (
          <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-float border border-sand-200 overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-teal-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <MicIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{l === "ta" ? "AI குரல் தேடல்" : "AI Voice Search"}</p>
                  <p className="text-xs text-teal-300">{l === "ta" ? "தமிழ் மற்றும் English" : "Tamil & English"}</p>
                </div>
              </div>
              <button onClick={() => { setIsOpen(false); stopSpeaking(); }} className="text-teal-300 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              {/* Response area */}
              {(transcript || response) && (
                <div className="mb-4 max-h-40 overflow-y-auto">
                  {transcript && (
                    <p className="text-xs text-charcoal-400 mb-1">
                      <span className="font-medium">{l === "ta" ? "நீங்கள்:" : "You:"}</span> {transcript}
                    </p>
                  )}
                  {response && (
                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mt-2">
                      <p className="text-sm text-teal-800 leading-relaxed">{response}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Mic button */}
              <div className="text-center">
                <button
                  onClick={handleMicClick}
                  disabled={state === "processing"}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300
                    ${state === "listening"
                      ? "bg-red-500 text-white animate-pulse scale-110 shadow-lg"
                      : state === "processing"
                      ? "bg-charcoal-200 text-charcoal-500 cursor-wait"
                      : state === "speaking"
                      ? "bg-teal-500 text-white animate-pulse"
                      : state === "error"
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-teal-800 text-white hover:bg-teal-700 hover:scale-105 shadow-card-lg"
                    }
                  `}
                >
                  {state === "processing" ? (
                    <LoadingSpinner />
                  ) : state === "speaking" ? (
                    <SpeakerIcon className="w-7 h-7" />
                  ) : (
                    <MicIcon className="w-7 h-7" />
                  )}
                </button>
                <p className="text-xs text-charcoal-500">{stateLabel[state]}</p>
              </div>

              {/* Hint */}
              {state === "idle" && !response && (
                <p className="text-xs text-charcoal-400 text-center mt-3 leading-relaxed">
                  {l === "ta"
                    ? "\"நல்லூரில் 3 படுக்கையறை வீடு வேண்டும்\" என்று சொல்லிப் பாருங்கள்"
                    : "Try saying: \"I need a 3-bedroom house in Nallur\""}
                </p>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // ═══════════════════════════════════════════════════
  // VARIANT: HERO (large centered button)
  // ═══════════════════════════════════════════════════
  if (variant === "hero") {
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={handleMicClick}
          disabled={state === "processing"}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300
            ${state === "listening"
              ? "bg-red-500 text-white animate-pulse scale-110 ring-4 ring-red-300/50"
              : state === "processing"
              ? "bg-white/20 text-white/50 cursor-wait"
              : state === "speaking"
              ? "bg-teal-400 text-white animate-pulse ring-4 ring-teal-300/50"
              : "bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:scale-105"
            }
          `}
        >
          {state === "processing" ? (
            <LoadingSpinner />
          ) : state === "speaking" ? (
            <SpeakerIcon className="w-7 h-7" />
          ) : (
            <MicIcon className="w-7 h-7" />
          )}
        </button>
        <p className="text-sm text-teal-200">{stateLabel[state]}</p>

        {/* Response inline */}
        {response && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-lg text-left border border-white/20">
            <p className="text-sm text-white leading-relaxed">{response}</p>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // VARIANT: INLINE (compact button)
  // ═══════════════════════════════════════════════════
  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleMicClick}
        disabled={state === "processing"}
        className={`
          flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200
          ${state === "listening"
            ? "bg-red-500 text-white animate-pulse"
            : state === "processing"
            ? "bg-charcoal-100 text-charcoal-400 cursor-wait"
            : state === "speaking"
            ? "bg-teal-500 text-white"
            : "bg-teal-50 text-teal-700 hover:bg-teal-100"
          }
        `}
      >
        {state === "processing" ? (
          <LoadingSpinner small />
        ) : state === "speaking" ? (
          <SpeakerIcon className="w-4 h-4" />
        ) : (
          <MicIcon className="w-4 h-4" />
        )}
        {stateLabel[state]}
      </button>

      {response && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 max-w-sm">
          <p className="text-xs text-teal-800 leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
}

// ── Icon components ──────────────────────────────────

function MicIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function SpeakerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );
}

function LoadingSpinner({ small = false }: { small?: boolean }) {
  const size = small ? "w-4 h-4" : "w-6 h-6";
  return (
    <svg className={`${size} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
