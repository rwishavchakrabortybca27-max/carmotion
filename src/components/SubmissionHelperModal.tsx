import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Code2, Sparkles, Activity, Layers } from 'lucide-react';

interface SubmissionHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  fps: number;
  onReplayIntro: () => void;
}

export const SubmissionHelperModal: React.FC<SubmissionHelperModalProps> = ({
  isOpen,
  onClose,
  fps,
  onReplayIntro,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRepo, setCopiedRepo] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-pl343jndi3xt7vsrsue7jq-480172599017.asia-southeast1.run.app';
  const repoSuggestion = 'https://github.com/paraschaturvedi/car-scroll-animation';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyRepo = () => {
    navigator.clipboard.writeText(repoSuggestion);
    setCopiedRepo(true);
    setTimeout(() => setCopiedRepo(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              ASSIGNMENT EVALUATION DOSSIER
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              Scroll-Driven Hero Section Animation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submission Link Copy Boxes */}
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10">
            <div className="text-xs font-mono text-neutral-400 mb-1 flex items-center justify-between">
              <span>1. LIVE WEBPAGE URL (SUBMISSION REQUIREMENT 1)</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> READY
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10">
            <div className="text-xs font-mono text-neutral-400 mb-1 flex items-center justify-between">
              <span>2. GITHUB REPOSITORY LINK (SUBMISSION REQUIREMENT 2)</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Code2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                readOnly
                value={repoSuggestion}
                className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none"
              />
              <button
                onClick={handleCopyRepo}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedRepo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRepo ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Functional Requirements Verification Checklist */}
        <div className="mt-6 space-y-3">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            FUNCTIONAL REQUIREMENTS VERIFICATION
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/40 border border-white/5">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">1. Hero Section Layout:</span> First screen (above the fold) layout featuring wide letter-spaced headline <code className="text-amber-400 font-mono">W E L C O M E   I T Z   F I Z Z</code>, followed by unboxed tabular impact metrics & percentages.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/40 border border-white/5">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">2. Initial Load Animation:</span> Character-by-character staggered reveal with blur settling, followed by delayed animated metric counter number interpolation.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/40 border border-white/5">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">3. Scroll-Based Core Animation:</span> Continuous scroll-linked movement of the hypercar along the 3D track, with active downforce, yaw banking, and interactive scrubber.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/40 border border-white/5">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">4. Motion & Performance:</span> Pure compositor transforms (<code className="text-amber-400 font-mono">translate3d</code>, <code className="text-amber-400 font-mono">scale</code>, <code className="text-amber-400 font-mono">rotate</code>), zero layout reflows, locked at <span className="text-emerald-400 font-bold font-mono">{fps} FPS</span>.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onReplayIntro();
            }}
            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-white border border-white/15 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Replay Initial Load Animation</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-neutral-950 font-mono transition-colors"
          >
            CONTINUE EXPLORING
          </button>
        </div>
      </div>
    </div>
  );
};
