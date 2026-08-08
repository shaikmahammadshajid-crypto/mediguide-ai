import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  User, 
  ShieldAlert, 
  RefreshCw,
  HelpCircle,
  PhoneCall,
  Mic,
  MicOff,
  Languages
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { sendChatMessage } from '../services/api';

interface AiAssistantProps {
  userProfile: UserProfile;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ userProfile }) => {
  const languageOptions = [
    { code: 'en-IN', label: 'English' },
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'te-IN', label: 'Telugu' },
    { code: 'ta-IN', label: 'Tamil' },
    { code: 'kn-IN', label: 'Kannada' },
    { code: 'ml-IN', label: 'Malayalam' },
    { code: 'mr-IN', label: 'Marathi' },
    { code: 'bn-IN', label: 'Bengali' },
    { code: 'gu-IN', label: 'Gujarati' },
    { code: 'pa-IN', label: 'Punjabi' },
    { code: 'ur-IN', label: 'Urdu' }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      content: `Hello ${userProfile.fullName}! I am **MediGuide AI**, your intelligent healthcare assistant.\n\nHow can I help you today? You can ask me about:\n- **Disease details & symptoms**\n- **Medical reports & blood test terms**\n- **Medicine usage & side effects**\n- **First-aid & preventive wellness**\n\n*Note: In case of severe chest pain, breathing distress, or acute trauma, please seek emergency services in India (112 / 102 / 108) immediately.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const listenTimeoutRef = useRef<number | null>(null);

  const presetPrompts = [
    "I have a sudden headache & mild nausea. What should I do?",
    "Explain my blood report: High WBC and Hemoglobin 14.5",
    "What are common side effects of Amlodipine 5mg?",
    "First aid guidance for minor skin burns",
    "What are emergency warning signs of a stroke?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort?.();
      if (listenTimeoutRef.current) window.clearTimeout(listenTimeoutRef.current);
    };
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage(text, messages, userProfile, selectedLanguage);

      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emergencyWarning: response.emergencyWarning
      };

      setMessages(prev => [...prev, botMsg]);

      if (response.emergencyWarning) {
        setEmergencyAlert(true);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          content: "I encountered a transient network issue while consulting the medical model. Please try asking again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = selectedLanguage;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Voice input needs Chrome or Edge with microphone permission enabled.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      transcriptRef.current = '';
      setVoiceError('');
      setIsListening(true);
      if (listenTimeoutRef.current) window.clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = window.setTimeout(() => {
        recognition.stop();
      }, 15000);
    };

    recognition.onresult = (event: any) => {
      let transcript = transcriptRef.current;
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const phrase = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          transcript = `${transcript} ${phrase}`.trim();
          transcriptRef.current = transcript;
        } else {
          setInputMessage(`${transcript} ${phrase}`.trim());
        }
      }
      if (transcript) setInputMessage(transcript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceError('Microphone permission is blocked. Allow microphone access in the browser address bar and try again.');
      } else if (event.error === 'network') {
        setVoiceError('Speech recognition service is unavailable. Type your question or try again on Chrome.');
      } else if (event.error !== 'no-speech') {
        setVoiceError('Voice input paused. Tap the mic and speak close to the device.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (listenTimeoutRef.current) {
        window.clearTimeout(listenTimeoutRef.current);
        listenTimeoutRef.current = null;
      }
      setIsListening(false);
      if (!transcriptRef.current.trim()) {
        setVoiceError('No speech was detected. Tap the mic, allow access, and speak clearly.');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                MediGuide AI Assistant
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-500" /> Powered by Gemini
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multilingual voice healthcare education, symptom analysis & report explainer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Languages className="w-4 h-4 text-teal-500" />
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                window.speechSynthesis?.cancel();
              }}
              className="bg-transparent outline-none text-xs font-bold"
            >
              {languageOptions.map((language) => (
                <option key={language.code} value={language.code}>{language.label}</option>
              ))}
            </select>
          </label>

          <button
            onClick={handleToggleListening}
            className={`p-2 rounded-lg transition text-xs font-semibold flex items-center gap-1 ${
              isListening
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'text-slate-500 hover:text-teal-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="hidden sm:inline">{isListening ? 'Listening' : 'Voice'}</span>
          </button>

          <button 
            onClick={() => {
              setMessages([{
                id: 'reset_' + Date.now(),
                role: 'assistant',
                content: `Chat history cleared. How can I assist you with your health today, ${userProfile.fullName}?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }]);
              setEmergencyAlert(false);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-xs font-semibold flex items-center gap-1"
            title="Clear Conversation"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="sm:hidden bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
          <Languages className="w-4 h-4 text-teal-500" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none"
          >
            {languageOptions.map((language) => (
              <option key={language.code} value={language.code}>{language.label}</option>
            ))}
          </select>
        </label>
        <span className="text-[10px] text-slate-400">Voice input and read-aloud use this language.</span>
      </div>

      {voiceError && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-200">
          {voiceError}
        </div>
      )}

      {/* Emergency Alert Banner if triggered */}
      {emergencyAlert && (
        <div className="bg-rose-600 text-white p-4 rounded-xl shadow-lg border border-rose-500 flex items-start space-x-3 animate-pulse">
          <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-extrabold text-base">CRITICAL EMERGENCY DETECTED</h4>
            <p className="mt-1">
              Your symptoms may require immediate emergency medical attention. Please do not delay. Call 112 / 102 / 108 or visit the nearest Emergency Casualty Ward immediately.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <a href="tel:112" className="px-4 py-1.5 rounded-lg bg-white text-rose-700 font-extrabold text-xs shadow-sm flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> Call Emergency 112
              </a>
              <button 
                onClick={() => setEmergencyAlert(false)}
                className="text-xs underline text-rose-100 hover:text-white"
              >
                Dismiss Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Conversation Box */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                    : msg.emergencyWarning
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 border border-rose-300 dark:border-rose-800 rounded-bl-none'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none'
                }`}>
                  <div className="whitespace-pre-wrap space-y-1">
                    {msg.content}
                  </div>

                  <div className={`mt-2 flex items-center justify-between text-[10px] pt-1 border-t ${
                    isUser ? 'border-teal-500/40 text-teal-100' : 'border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSpeak(msg.content)}
                          className="hover:text-teal-600 dark:hover:text-teal-400"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-teal-600 dark:hover:text-teal-400"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-500 animate-pulse" />
                <span>MediGuide AI is analyzing medical literature...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-teal-500" /> Suggested:
          </span>
          {presetPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:text-teal-600 shrink-0 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleToggleListening}
            className={`p-2.5 rounded-xl border font-semibold text-xs transition ${
              isListening
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-400 hover:text-teal-600'
            }`}
            title={isListening ? 'Stop listening' : `Speak in ${languageOptions.find((language) => language.code === selectedLanguage)?.label || 'selected language'}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isListening ? 'Listening... speak your health question' : 'Ask about symptoms, diseases, report terms, or medicines...'}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center gap-1 shadow-md shadow-teal-600/20"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* Disclaimer Notice */}
      <p className="text-[11px] text-slate-400 text-center italic">
        🛡️ MediGuide AI is an educational tool. Information provided is evidence-based but does not replace professional medical diagnosis or doctor consultations.
      </p>

    </div>
  );
};
