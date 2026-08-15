import React, { useState } from 'react';
import { Page, EditorMode } from '../types/editor';
import {
  Sparkles,
  Check,
  Wand2,
  BookOpen,
  FileText,
  Languages,
  ArrowRight,
  Copy,
  RotateCcw,
  X,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface GeminiEnchantmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: Page | null;
  activePageHtml: string;
  mode: EditorMode;
  onApplyTextReplacement: (newContent: string) => void;
  onInsertBelow: (newContent: string) => void;
  showToast: (title: string, desc: string, icon?: string) => void;
}

interface SpellcheckIssue {
  original: string;
  replacement: string;
  reason: string;
}

export const GeminiEnchantmentModal: React.FC<GeminiEnchantmentModalProps> = ({
  isOpen,
  onClose,
  activePage,
  activePageHtml,
  mode,
  onApplyTextReplacement,
  onInsertBelow,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'spellcheck' | 'assistant' | 'translate'>('spellcheck');
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [spellcheckIssues, setSpellcheckIssues] = useState<SpellcheckIssue[]>([]);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activePage) return null;

  const rawDocumentText = activePage.blocks.map((b) => b.content).join('\n\n') || activePage.title;

  const callGeminiApi = async (action: string, promptText?: string) => {
    setLoading(true);
    setAiOutput('');
    setSpellcheckIssues([]);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: rawDocumentText,
          prompt: promptText || customPrompt,
          context: `Document title: ${activePage.title}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (action === 'spellcheck') {
          try {
            // Attempt to parse JSON response
            const cleaned = data.result.replace(/```json\n?|\n?```/gi, '').trim();
            const parsed = JSON.parse(cleaned);
            setAiOutput(parsed.correctedText || rawDocumentText);
            setSpellcheckIssues(parsed.issues || []);
          } catch {
            setAiOutput(data.result);
            // Heuristic simple issues if not json
            setSpellcheckIssues([
              {
                original: 'Full Document',
                replacement: 'Enchanted and proofread version ready',
                reason: 'Spellcheck & grammatical structure polished',
              },
            ]);
          }
        } else {
          setAiOutput(data.result);
        }

        showToast(
          'Enchantment Table Active',
          action === 'spellcheck' ? 'Spellcheck analysis complete' : 'Gemini AI generated content',
          '✨'
        );
      } else {
        setAiOutput('Could not process request with Enchantment Table AI.');
      }
    } catch (err) {
      console.error('Gemini call failed', err);
      setAiOutput('Enchantment Table is recharging. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySpellcheckFix = (issue: SpellcheckIssue) => {
    if (!activePage) return;
    const newContent = rawDocumentText.replace(issue.original, issue.replacement);
    onApplyTextReplacement(newContent);
    setSpellcheckIssues((prev) => prev.filter((i) => i !== issue));
    showToast('Spellcheck Fixed', `Replaced "${issue.original}" with "${issue.replacement}"`, '✔️');
  };

  const handleApplyAllFixes = () => {
    if (aiOutput) {
      onApplyTextReplacement(aiOutput);
      setSpellcheckIssues([]);
      showToast('All Enchantments Applied', 'Document successfully updated with proofread text', '✨');
      onClose();
    }
  };

  const handleCopyOutput = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#1b1229] border-4 border-[#c042da] rounded-none shadow-[0_0_30px_rgba(192,66,218,0.3)] overflow-hidden font-sans text-gray-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#2a1340] px-5 py-3.5 border-b-4 border-[#3f1661] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#8f2d99] border-2 border-[#e082ff] flex items-center justify-center text-white shadow-md animate-pulse">
              <Sparkles className="w-5 h-5 text-[#ffffa0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-pixel text-xs text-[#ffff80] tracking-wider">
                  ENCHANTMENT TABLE AI
                </h2>
                <span className="bg-[#8f2d99] text-[10px] text-white px-1.5 py-0.5 font-pixel border border-[#e082ff]">
                  GEMINI 3.7 FLASH
                </span>
              </div>
              <p className="text-xs text-purple-200 truncate max-w-sm">
                Magical spellchecking, proofreading & scribe assistance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1 hover:bg-[#3f1661] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#241038] px-4 pt-2 border-b-2 border-[#3f1661] flex gap-2">
          <button
            onClick={() => {
              setActiveTab('spellcheck');
              if (!aiOutput && spellcheckIssues.length === 0) callGeminiApi('spellcheck');
            }}
            className={`px-4 py-2 text-xs font-pixel flex items-center gap-2 border-t-2 border-x-2 transition-all ${
              activeTab === 'spellcheck'
                ? 'bg-[#1b1229] border-[#c042da] text-[#FFD700] -mb-[2px]'
                : 'bg-[#2e1548] border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            SPELLCHECK & GRAMMAR
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2 text-xs font-pixel flex items-center gap-2 border-t-2 border-x-2 transition-all ${
              activeTab === 'assistant'
                ? 'bg-[#1b1229] border-[#c042da] text-[#FFD700] -mb-[2px]'
                : 'bg-[#2e1548] border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            AI SCRIBE WIZARD
          </button>
          <button
            onClick={() => setActiveTab('translate')}
            className={`px-4 py-2 text-xs font-pixel flex items-center gap-2 border-t-2 border-x-2 transition-all ${
              activeTab === 'translate'
                ? 'bg-[#1b1229] border-[#c042da] text-[#FFD700] -mb-[2px]'
                : 'bg-[#2e1548] border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            TRANSLATE
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'spellcheck' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-purple-200">
                  Scanning <b className="text-white">"{activePage.title}"</b> for spelling & grammar flaws.
                </div>
                <button
                  onClick={() => callGeminiApi('spellcheck')}
                  disabled={loading}
                  className="mc-enchanted-btn px-3 py-1 text-xs font-pixel flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'ANALYZING...' : 'RE-SCAN'}
                </button>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-4 border-[#c042da] border-t-transparent animate-spin" />
                  <div className="font-pixel text-xs text-[#e082ff] animate-pulse">
                    ENCHANTING WORDS WITH GEMINI...
                  </div>
                  <div className="text-xs text-purple-300">
                    Checking grammar, syntax, and phrasing runes...
                  </div>
                </div>
              ) : spellcheckIssues.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    Found {spellcheckIssues.length} Improvement Rune(s):
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {spellcheckIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="bg-[#28133d] border-2 border-[#541e80] p-3 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="line-through text-red-400 bg-red-950/60 px-1.5 py-0.5 border border-red-800">
                              {issue.original}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                            <span className="font-semibold text-green-300 bg-green-950/60 px-1.5 py-0.5 border border-green-800">
                              {issue.replacement}
                            </span>
                          </div>
                          <div className="text-[11px] text-purple-300">{issue.reason}</div>
                        </div>
                        <button
                          onClick={() => handleApplySpellcheckFix(issue)}
                          className="bg-[#4c7c3c] hover:bg-[#578c45] border border-[#7eb063] px-2.5 py-1 text-[10px] font-pixel text-white"
                        >
                          APPLY
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Complete Fixed Text Preview */}
                  <div className="bg-[#130d1e] border-2 border-[#3f1661] p-3 rounded-none">
                    <div className="text-xs font-bold text-[#FFD700] mb-1 font-pixel">
                      ENCHANTED PROOFREAD PREVIEW:
                    </div>
                    <p className="text-xs text-gray-200 font-doc max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {aiOutput}
                    </p>
                  </div>
                </div>
              ) : aiOutput ? (
                <div className="bg-[#1f2b18] border-2 border-[#4c7c3c] p-4 text-center space-y-2">
                  <div className="w-8 h-8 mx-auto bg-[#4c7c3c] text-white flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="font-pixel text-xs text-green-300">
                    NO SPELLING OR GRAMMAR FLAWS DETECTED!
                  </div>
                  <p className="text-xs text-green-100 font-sans">
                    Your document is written with pristine parchment craftsmanship.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={() => callGeminiApi('spellcheck')}
                    className="mc-enchanted-btn px-6 py-3 font-pixel text-xs tracking-wider"
                  >
                    ✨ RUN GEMINI SPELLCHECK
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="space-y-4">
              <div className="text-xs text-purple-200">
                Choose an enchantment or enter a custom prompt for Gemini AI:
              </div>

              {/* Quick AI Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => callGeminiApi('polish')}
                  disabled={loading}
                  className="bg-[#2e1548] hover:bg-[#3f1d63] border-2 border-[#602796] hover:border-[#FFD700] p-2.5 text-left text-xs transition-all flex flex-col gap-1"
                >
                  <div className="font-pixel text-[10px] text-[#e082ff] flex items-center gap-1">
                    <Wand2 className="w-3 h-3 text-yellow-400" />
                    POLISH & REFINE
                  </div>
                  <div className="text-[11px] text-gray-300">Professional tone & clear flow</div>
                </button>

                <button
                  onClick={() => callGeminiApi('minecraft_lore')}
                  disabled={loading}
                  className="bg-[#2e1548] hover:bg-[#3f1d63] border-2 border-[#602796] hover:border-[#FFD700] p-2.5 text-left text-xs transition-all flex flex-col gap-1"
                >
                  <div className="font-pixel text-[10px] text-[#e082ff] flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-green-400" />
                    MINECRAFT LORE
                  </div>
                  <div className="text-[11px] text-gray-300">Ancient scribe & epic mythos</div>
                </button>

                <button
                  onClick={() => callGeminiApi('summarize')}
                  disabled={loading}
                  className="bg-[#2e1548] hover:bg-[#3f1d63] border-2 border-[#602796] hover:border-[#FFD700] p-2.5 text-left text-xs transition-all flex flex-col gap-1"
                >
                  <div className="font-pixel text-[10px] text-[#e082ff] flex items-center gap-1">
                    <FileText className="w-3 h-3 text-cyan-400" />
                    SUMMARIZE
                  </div>
                  <div className="text-[11px] text-gray-300">Key bullet points & actions</div>
                </button>

                <button
                  onClick={() => callGeminiApi('expand')}
                  disabled={loading}
                  className="bg-[#2e1548] hover:bg-[#3f1d63] border-2 border-[#602796] hover:border-[#FFD700] p-2.5 text-left text-xs transition-all flex flex-col gap-1"
                >
                  <div className="font-pixel text-[10px] text-[#e082ff] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    EXPAND & ELABORATE
                  </div>
                  <div className="text-[11px] text-gray-300">Add rich descriptive detail</div>
                </button>

                <button
                  onClick={() => callGeminiApi('continue')}
                  disabled={loading}
                  className="bg-[#2e1548] hover:bg-[#3f1d63] border-2 border-[#602796] hover:border-[#FFD700] p-2.5 text-left text-xs transition-all flex flex-col gap-1 col-span-2 sm:col-span-2"
                >
                  <div className="font-pixel text-[10px] text-[#e082ff] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    SMART CONTINUE WRITING
                  </div>
                  <div className="text-[11px] text-gray-300">
                    Write next paragraph based on context
                  </div>
                </button>
              </div>

              {/* Custom Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                  Custom AI Instruction:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Turn this into a quest dialogue, or create an outline..."
                    className="flex-1 bg-[#130d1e] border-2 border-[#602796] px-3 py-2 text-xs text-white placeholder-purple-400 focus:outline-hidden focus:border-[#FFD700]"
                  />
                  <button
                    onClick={() => callGeminiApi('custom', customPrompt)}
                    disabled={loading || !customPrompt.trim()}
                    className="mc-enchanted-btn px-4 py-2 text-xs font-pixel disabled:opacity-50"
                  >
                    CAST
                  </button>
                </div>
              </div>

              {/* AI Output preview */}
              {aiOutput && (
                <div className="bg-[#130d1e] border-2 border-[#c042da] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#FFD700] font-pixel">
                    <span>ENCHANTED AI RESPONSE:</span>
                    <button
                      onClick={handleCopyOutput}
                      className="text-purple-300 hover:text-white flex items-center gap-1 font-sans text-xs"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="max-h-44 overflow-y-auto text-xs text-gray-200 whitespace-pre-wrap font-doc leading-relaxed">
                    {aiOutput}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'translate' && (
            <div className="space-y-4">
              <div className="text-xs text-purple-200">
                Translate document content into various languages or ancient scripts:
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="bg-[#130d1e] border-2 border-[#602796] px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#FFD700]"
                >
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                  <option value="Standard Galactic Alphabet">
                    Standard Galactic Alphabet (Enchanting Runes)
                  </option>
                  <option value="Italian">Italian (Italiano)</option>
                  <option value="Portuguese">Portuguese (Português)</option>
                </select>

                <button
                  onClick={() => callGeminiApi('translate', targetLanguage)}
                  disabled={loading}
                  className="mc-enchanted-btn px-4 py-2 text-xs font-pixel"
                >
                  {loading ? 'TRANSLATING...' : 'TRANSLATE'}
                </button>
              </div>

              {aiOutput && (
                <div className="bg-[#130d1e] border-2 border-[#c042da] p-3 space-y-2">
                  <div className="text-xs text-[#FFD700] font-pixel">TRANSLATION RESULT:</div>
                  <div className="max-h-48 overflow-y-auto text-xs text-gray-200 whitespace-pre-wrap font-doc leading-relaxed">
                    {aiOutput}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#241038] px-5 py-3 border-t-2 border-[#3f1661] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Powered by Gemini AI Full-Stack Server</span>
          </div>

          <div className="flex items-center gap-2">
            {aiOutput && (
              <>
                <button
                  onClick={() => onInsertBelow(aiOutput)}
                  className="mc-button px-3 py-1.5 text-xs font-pixel text-white"
                >
                  INSERT BELOW
                </button>
                <button
                  onClick={() => {
                    onApplyTextReplacement(aiOutput);
                    onClose();
                  }}
                  className="mc-button-green px-4 py-1.5 text-xs font-pixel text-white"
                >
                  REPLACE DOC
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#555] px-4 py-1.5 text-xs font-pixel text-gray-300"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
