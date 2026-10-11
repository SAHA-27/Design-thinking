import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Wrench, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  data?: any;
}

export const AIAssistantPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "👋 Hello! I am ServEase AI, your intelligent diagnostic assistant.\n\nDescribe any issue with your home appliances (AC, RO purifier, washing machine, refrigerator) or vehicle (bike, car), and I'll analyze possible causes, ask diagnostic questions, and estimate service costs."
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Suggested prompt pills
  const samplePrompts = [
    'My AC is running but not cooling the room properly.',
    'RO purifier is making a loud buzzing vibration and water flow is very slow.',
    'Honda Activa scooter is having morning starting trouble and rear brake feels loose.',
    'Washing machine drum vibrates violently and makes a thumping sound during spin cycle.',
    'Main MCB switchboard keeps tripping every time the water geyser is switched on.'
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/diagnose', { message: textToSend });
      if (res.data.success) {
        const aiMessage: Message = {
          sender: 'ai',
          text: res.data.message,
          data: res.data.data
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Apologies, our diagnostic system is momentarily recalibrating. Please choose a service from the catalog or try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookFromDiagnosis = (diagnosisData: any, userPrompt: string) => {
    navigate(
      `/booking/new?serviceId=${diagnosisData.recommendedServiceId}&problem=${encodeURIComponent(userPrompt)}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-bold text-teal-800 shadow-2xs mb-2">
            <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
            <span>Feature A: AI Conversational Troubleshooter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Smart Service Problem Diagnostic
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            State your symptom in plain words. Get instant probable root causes, follow-ups, and price estimates.
          </p>
        </div>

        {/* Sample Prompt Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Try Asking:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="shrink-0 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:shadow-2xs transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Conversation Card */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[650px]">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-teal-600 text-white shadow-xs">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-br-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed font-sans">{m.text}</div>

                  {/* Diagnostic Structured Card & Book Action */}
                  {m.data && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div className="rounded-xl bg-white p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Service</span>
                          <span className="text-xs sm:text-sm font-extrabold text-navy-900">{m.data.serviceTitle}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Est. Range</span>
                          <span className="text-xs sm:text-sm font-bold text-teal-700">
                            ₹{m.data.priceRange?.estimatedTotalMin} - ₹{m.data.priceRange?.estimatedTotalMax}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookFromDiagnosis(m.data, messages[idx - 1]?.text || 'Diagnosed issue')}
                        className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 py-3 text-xs sm:text-sm font-bold text-white transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <span>Book This Recommended Service</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white animate-spin">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 text-xs font-semibold text-slate-500">
                  Analyzing symptom patterns & diagnostic knowledge base...
                </div>
              </div>
            )}
          </div>

          {/* Chat input bar */}
          <div className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-white rounded-2xl border border-slate-300 p-2 shadow-inner"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your appliance or vehicle symptom (e.g. AC hot air, RO slow, bike brake)..."
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 p-2.5 text-white transition shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
