import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Zap,
  BookOpen,
  Atom,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    query: string;
  };
}

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ isOpen, onClose }) => {
  const { currentClass, user, addXP } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: Message[] = [
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user.name}! 🤖 I'm RoboBuddy, your Quantum STEM AI Tutor. I'm tuned to your Class ${currentClass} NCERT curriculum. Ask me any science or math question, lab doubt, or formula explanation!`,
      timestamp: 'Just now',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { title: 'Total Internal Reflection', query: 'Explain Total Internal Reflection (TIR) and the critical angle formula.' },
    { title: 'Ohm’s Law V = IR', query: 'How does Ohm’s Law work, and what happens to current if resistance doubles?' },
    { title: 'pH Scale & Turmeric', query: 'Why does turmeric paper turn reddish-brown when exposed to soap solution?' },
    { title: 'Wave Equation', query: 'How are frequency, wavelength, and wave velocity mathematically connected?' },
    { title: 'Cell Organelles', query: 'What is the key difference between plant cell walls and animal cell membranes?' },
  ];

  const generateAIResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    if (q.includes('reflection') || q.includes('tir') || q.includes('critical angle') || q.includes('optics') || q.includes('snell')) {
      return `### 🌈 Total Internal Reflection (TIR) & Snell's Law
When light travels from an **optically denser medium** (like glass $n_1 = 1.5$) into an **optically rarer medium** (like air $n_2 = 1.0$), it bends away from the normal.

1. **Snell's Law:** 
   $$n_1 \\sin(\\theta_i) = n_2 \\sin(\\theta_r)$$
2. **Critical Angle ($\\theta_c$):**
   The angle of incidence for which the angle of refraction is exactly $90^\\circ$:
   $$\\sin(\\theta_c) = \\frac{n_2}{n_1} = \\frac{1}{1.5} \\approx 0.667 \\implies \\theta_c \\approx 41.8^\\circ$$
3. **Condition for TIR:**
   - Light must travel from denser $\\to$ rarer medium.
   - Angle of incidence $\\theta_i > \\theta_c$.

*Real-world Application:* Optical fiber communication and the brilliant sparkle of diamonds! 💎`;
    }

    if (q.includes('ohm') || q.includes('circuit') || q.includes('resistance') || q.includes('voltage') || q.includes('current')) {
      return `### ⚡ Ohm's Law & Circuit Dynamics
At constant temperature, electric current ($I$) flowing through a metallic conductor is directly proportional to the potential difference ($V$) across its ends:

$$V = I \\cdot R \\quad \\Longleftrightarrow \\quad I = \\frac{V}{R}$$

- **Voltage ($V$ in Volts):** Electrical push / pressure from battery.
- **Current ($I$ in Amperes):** Rate of electron flow ($1\\text{ A} = 1\\text{ Coulomb/sec}$).
- **Resistance ($R$ in Ohms $\\Omega$):** Obstruction to electron drift.

**Key Insight:** If you double the resistance ($R \\to 2R$) while holding voltage constant at 12V, current drops by half ($I \\to I/2$). Power dissipated as heat/light is $P = V \\cdot I = I^2 R$! 💡`;
    }

    if (q.includes('ph') || q.includes('turmeric') || q.includes('acid') || q.includes('base') || q.includes('indicator') || q.includes('color')) {
      return `### 🧪 Turmeric as a Natural Acid-Base Indicator
Turmeric contains the active yellow pigment **Curcumin**:

- **In Neutral or Acidic Solutions ($pH \\le 7$):** Curcumin maintains its conjugated keto-enol structure, remaining **bright yellow** (e.g. in lemon juice, vinegar, or pure water).
- **In Alkaline / Basic Solutions ($pH > 8$):** The hydroxide ions ($OH^-$) from soap, lime water ($Ca(OH)_2$), or baking soda deprotonate curcumin, causing a molecular rearrangement into a deep **reddish-brown chromophore**.

*Did you know?* If curry stains a white cloth and you rub soap on it, it immediately turns red because soap is basic! Rinsing with vinegar or lemon juice restores the yellow color! 🍋`;
    }

    if (q.includes('wave') || q.includes('frequency') || q.includes('pitch') || q.includes('sound') || q.includes('wavelength')) {
      return `### 🎵 Harmonic Wave Physics
A mechanical wave transfers energy through oscillating particles without permanently displacing matter:

$$v = f \\cdot \\lambda$$

- **$v$ (Wave Speed):** Speed of propagation in the medium (approx. $343\\text{ m/s}$ in air at $20^\\circ\\text{C}$).
- **$f$ (Frequency in Hz):** Cycles per second. Dictates our perception of **pitch**. Higher frequency = higher pitch tone!
- **$\\lambda$ (Wavelength in meters):** Distance between consecutive crests.
- **Amplitude ($A$):** Maximum displacement from equilibrium. Dictates sound **volume (loudness)** and wave energy ($E \\propto A^2$).

Striking a tuning fork harder increases *amplitude* (loudness), NOT frequency (pitch)!`;
    }

    if (q.includes('cell') || q.includes('plant') || q.includes('animal') || q.includes('organelle') || q.includes('mitochondria')) {
      return `### 🔬 Plant vs Animal Cell Architecture
Both are eukaryotic cells with membrane-bound nuclei, but plant cells possess three unique structural adaptations:

1. **Cell Wall:** Rigid outer layer composed of cellulose providing hydrostatic turgor pressure support. (Animal cells only have a flexible plasma membrane).
2. **Chloroplasts:** Green plastids containing chlorophyll where solar light is converted into glucose via photosynthesis.
3. **Large Central Vacuole:** Occupies up to 90% of plant cell volume, storing water, enzymes, and regulating turgidity. Animal cells only have small transient vacuoles.
4. **Mitochondria:** The "powerhouses" of both cell types, generating ATP through aerobic cellular respiration! 🧬`;
    }

    if (q.includes('fraction') || q.includes('math') || q.includes('calculus') || q.includes('derivative') || q.includes('integral')) {
      return `### 📐 Mathematical Thinking & Intuition
In Class ${currentClass} Mathematics, conceptual visualization is key:

- **Fractions as Parts of a Whole:** $\\frac{a}{b}$ signifies taking $a$ equal pieces out of a unit divided into $b$ partitions. Two fractions $\\frac{a}{b}$ and $\\frac{c}{d}$ are equivalent if $a \\cdot d = b \\cdot c$ (e.g. $\\frac{2}{4} = \\frac{1}{2} = 50\\%$).
- **The Derivative ($f'(x)$):** The instantaneous rate of change or tangent slope:
  $$f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}$$

Would you like to step through an interactive calculation or test your knowledge in the Inquiry Lab?`;
    }

    return `### 💡 Scientific Breakdown for Class ${currentClass}
Great inquiry! Let's examine the scientific principle:

1. **Fundamental Principle:** In nature, observable physical phenomena follow conservation laws (conservation of energy, mass, and charge).
2. **Pedagogical Step:** Analyze the independent variables (what we control in the lab) versus dependent variables (what responds or changes).
3. **Actionable Recommendation:** Open the **Inquiry Lab** from the Subjects timeline to simulate this system with interactive sliders, or test your diagnostic understanding in the **Mock Exams** section!

Would you like me to generate a quick practice quiz question on this topic? 🎯`;
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateAIResponse(text);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      addXP(15, 'AI Study Session');
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl h-[85vh] flex flex-col rounded-3xl bg-slate-900/90 backdrop-blur-3xl border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.85),inset_0_1.5px_1px_rgba(255,255,255,0.2)] text-white overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30">
                <Bot className="w-5 h-5 font-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">RoboBuddy AI STEM Tutor</h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Class {currentClass}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  NCERT aligned conceptual mentor & problem solver
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-white/10 hover:border-white/20 bg-slate-800/60 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Quick Concept Prompts Carousel */}
          <div className="px-4 py-2.5 border-b border-white/10 bg-slate-950/20 overflow-x-auto flex items-center gap-2 scrollbar-none">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Inquiries:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="px-3 py-1 rounded-xl text-xs font-bold border border-white/15 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 shrink-0 transition-all cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/25 border border-white/20'
                      : 'bg-slate-800/85 backdrop-blur-xl border border-white/15 text-slate-200 shadow-md whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] font-bold mt-1.5 opacity-60 text-right ${
                      msg.sender === 'user' ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-white/15 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>RoboBuddy is formulating pedagogical step...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-950/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask any STEM question for Class ${currentClass}...`}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-800/90 border border-white/20 text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
