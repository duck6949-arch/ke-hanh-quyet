/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Info, ChevronRight, X, AlertCircle } from 'lucide-react';
import { DIALOGUE_TREE, ALL_EVIDENCE } from './constants';
import { DialogueNode, Evidence, GameState, Emotion } from './types';

// --- Components ---

const Typewriter = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onComplete();
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

const CourtroomEffect = ({ type, onComplete }: { type: 'OBJECTION' | 'HOLD_IT' | 'TAKE_THAT'; onComplete: () => void }) => {
  const texts = {
    'OBJECTION': 'OBJECTION!',
    'HOLD_IT': 'HOLD IT!',
    'TAKE_THAT': 'TAKE THAT!',
  };

  return (
    <motion.div
      initial={{ scale: 0.1, opacity: 0 }}
      animate={{ 
          scale: [0.1, 1.2, 1], 
          opacity: 1,
      }}
      exit={{ opacity: 0, scale: 2, filter: 'blur(30px)' }}
      onAnimationComplete={() => setTimeout(onComplete, 1500)}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
    >
        <div className="relative w-full max-w-5xl flex items-center justify-center translate-y-[-20px]">
            {/* Extremely Large & Aggressive Jagged Bubble */}
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: [0, 1.3, 1], rotate: [-20, 10, 0] }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center translate-y-10"
            >
                <svg viewBox="0 0 400 300" className="w-[180%] h-[180%] filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-visible">
                    <path 
                        d="M200 10 L230 80 L320 40 L280 120 L380 100 L330 180 L395 240 L280 230 L250 290 L180 220 L80 280 L110 180 L10 210 L60 120 L20 60 L120 90 L140 20 Z" 
                        fill="white" 
                        stroke="black" 
                        strokeWidth="5" 
                        strokeLinejoin="round" 
                    />
                    {/* Visual energy lines */}
                    <path d="M70 110 L40 90 M320 150 L350 160 M200 40 L190 60" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </motion.div>
            
            {/* The Stylized, Arched, and Slanted Text */}
            <motion.div 
                key={type}
                initial={{ scale: 0, scaleY: 0.5, rotate: 15 }}
                animate={{ scale: [0, 1.4, 1], scaleY: [0.5, 1.2, 1], rotate: [15, -8, -12] }}
                transition={{ duration: 0.3, delay: 0.1, ease: "backOut" }}
                className="relative z-10"
                style={{ 
                    // Simulating the arched/skewed look with 3D and 2D transforms
                    transform: 'perspective(1000px) rotateX(10deg) skewX(-20deg) skewY(-5deg)',
                }}
            >
                <h2 className={`
                    text-[90px] md:text-[140px] font-[1000] text-[#e74c3c] italic tracking-tighter uppercase leading-none
                    [text-shadow:4px_4px_0_#fff,6px_6px_0_#fff,10px_10px_0_#000,12px_12px_0_#000]
                    drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]
                    whitespace-nowrap select-none
                `}>
                    {texts[type]}
                </h2>
            </motion.div>
            
            {/* Secondary Impact Spark Background */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0], scale: [1, 3] }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white/50 rounded-full blur-[120px] z-0"
            />
        </div>
    </motion.div>
  );
};

export default function App() {
  const [gamePhase, setGamePhase] = useState<'MENU' | 'PLAYING'>('MENU');
  const [gameState, setGameState] = useState<GameState>({
    currentDialogueId: 'intro_1',
    inventory: ['water_report', 'dolphin_report', 'petition', 'payroll_ledger', 'chemical_receipt', 'fish_license'], 
    isExamining: false,
    isCourtroom: true,
    penalties: 0,
  });

  const [isTyping, setIsTyping] = useState(true);
  const [showEvidence, setShowEvidence] = useState(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [effect, setEffect] = useState<'OBJECTION' | 'HOLD_IT' | 'TAKE_THAT' | null>(null);
  const [shake, setShake] = useState(false);

  const currentDialogue = DIALOGUE_TREE[gameState.currentDialogueId];

  const handleNext = useCallback(() => {
    if (isTyping) {
      // Fast forward
      setIsTyping(false);
      return;
    }

    if (currentDialogue.choices) return; // Wait for selection

    if (currentDialogue.nextId) {
      setGameState(prev => ({ ...prev, currentDialogueId: currentDialogue.nextId! }));
      setIsTyping(true);
    }
  }, [isTyping, currentDialogue, gameState.currentDialogueId]);

  const restartGame = () => {
    setGameState({
      currentDialogueId: 'intro_1',
      inventory: ['water_report', 'dolphin_report', 'petition', 'payroll_ledger', 'chemical_receipt', 'fish_license'],
      isExamining: false,
      isCourtroom: true,
      penalties: 0,
    });
    setGamePhase('PLAYING');
    setIsTyping(true);
    setEffect(null);
  };

  const presentEvidence = (evidenceId: string) => {
    if (effect) return; // Prevent multiple submissions during effect
    setShowEvidence(false);
    
    if (currentDialogue.isStatement && currentDialogue.correctEvidence === evidenceId) {
      setEffect('OBJECTION');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => {
        setGameState(prev => ({ ...prev, currentDialogueId: currentDialogue.onCorrectionId! }));
        setIsTyping(true);
      }, 1500);
    } else {
      setEffect('TAKE_THAT');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      
      const newPenalties = gameState.penalties + 1;
      
      setTimeout(() => {
        if (newPenalties >= 5) {
          setGameState(prev => ({ ...prev, currentDialogueId: 'game_over', penalties: newPenalties }));
        } else {
          setGameState(prev => ({ 
            ...prev, 
            currentDialogueId: currentDialogue.onWrongId || gameState.currentDialogueId,
            penalties: newPenalties
          }));
        }
        setIsTyping(true);
      }, 1500);
    }
  };

  if (gamePhase === 'MENU') {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-[#050505] flex items-end justify-center font-sans pb-20">
        {/* Background Visual for Menu */}
        <div className="absolute inset-0 opacity-40 grayscale">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url(https://i.postimg.cc/nV5M3n82/Chat-GPT-Image-00-47-19-4-thg-5-2026.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center flex flex-col items-center max-w-4xl px-4"
        >
          {/* Subtitle / Label */}
          <motion.p 
            initial={{ letterSpacing: '0.2em', opacity: 0 }}
            animate={{ letterSpacing: '0.6em', opacity: 0.7 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-amber-500 font-black text-sm md:text-base uppercase mb-6"
          >
            ACE ATTORNEY STYLE GAME
          </motion.p>

          {/* Main Title */}
          <h1 className="flex items-center justify-center gap-x-3 md:gap-x-5 font-[1000] italic uppercase mb-16 select-none">
            {/* "TÒA" on the left */}
            <span className="text-white text-[100px] md:text-[180px] lg:text-[240px] leading-[0.8] [text-shadow:12px_12px_0_#e74c3c]">
              TÒA
            </span>
            
            {/* "XÉT XỬ" on the right */}
            <div className="flex flex-col items-start leading-[0.85]">
              <span className="text-amber-500 text-[50px] md:text-[90px] lg:text-[120px] [text-shadow:8px_8px_0_#000] tracking-tighter">
                XÉT
              </span>
              <span className="text-amber-500 text-[50px] md:text-[90px] lg:text-[120px] [text-shadow:8px_8px_0_#000] tracking-tighter">
                XỬ
              </span>
            </div>
          </h1>

          <div className="w-24 h-1.5 bg-white/20 mb-16 rounded-full" />

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#000' }}
            whileTap={{ scale: 0.95 }}
            onClick={restartGame}
            className="group relative flex items-center gap-6 px-12 py-6 border-2 border-white text-white font-[900] text-xl md:text-2xl uppercase tracking-[0.2em] transition-all duration-300"
          >
            Bắt đầu trò chơi
            <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-white/20" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-white/20" />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black font-sans text-white select-none`}>
      {/* Background Layer: FULL BLEED and changes per dialogue */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDialogue.background || 'bg-static'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-black"
          style={{ 
            backgroundImage: `url(${currentDialogue.background || 'https://picsum.photos/seed/court/1200/800'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Subtle vignette/overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Case Info: Top Left */}
      <div className="absolute top-8 left-8 z-30 pointer-events-none">
          <div className="text-2xl font-black tracking-tighter uppercase text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.9)] opacity-60">
              Hồ Sơ Vụ Án #01
          </div>
      </div>

      {/* Dialogue Window: Scaled down and centered at the bottom of the screen */}
      <div 
        onClick={handleNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] max-w-4xl h-[160px] bg-black/90 border-4 border-[#d4af37] p-8 z-40 rounded-xl cursor-pointer group shadow-[0_0_50px_rgba(0,0,0,1)] transition-all hover:bg-black"
      >
        <div className="absolute -top-8 left-8 px-8 py-1.5 bg-[#d4af37] text-black font-[900] text-xl uppercase tracking-[0.15em] shadow-xl transform -skew-x-6">
          {currentDialogue.speaker}
        </div>
        
        <div className="mt-1 text-[24px] leading-tight font-bold text-white tracking-tight">
          {isTyping ? (
            <Typewriter text={currentDialogue.text} onComplete={() => setIsTyping(false)} />
          ) : (
            <span>{currentDialogue.text}</span>
          )}
        </div>

        {!isTyping && !currentDialogue.choices && (
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute bottom-4 right-8 text-[#d4af37]"
          >
            <ChevronRight size={28} />
          </motion.div>
        )}
      </div>

      {/* HUD: Avatar and Penalties at Top Right */}
      <div className="absolute top-8 right-8 z-30 pointer-events-none">
        {/* Character Avatar Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 md:w-44 md:h-44 bg-black/80 border-4 border-[#d4af37] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-md pointer-events-auto relative"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentDialogue.characterImage}
              initial={{ opacity: 0, scale: 1.1, filter: 'brightness(0.5)' }}
              animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'brightness(0.5)' }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              src={currentDialogue.characterImage}
              alt="Character Avatar"
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          
          {/* Subtle Scanline Overlay for a technical/court look */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
          <div className="absolute inset-0 border border-white/5 pointer-events-none" />
        </motion.div>
      </div>

      {/* Dossier Button: Bottom Right */}
      <div className="absolute bottom-8 right-8 z-[50]">
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: 'rgba(212, 175, 55, 1)', 
            color: '#000',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { 
            e.stopPropagation(); 
            setShowEvidence(true); 
          }}
          className="group flex flex-col items-center justify-center p-4 bg-black/90 border-2 border-[#d4af37] text-white rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 min-w-[110px] h-[110px] hover:border-white"
        >
          <div className="relative mb-1 group-hover:scale-110 transition-transform duration-300">
            <Briefcase size={40} className="text-amber-500 group-hover:text-black transition-colors" />
          </div>
          <span className="text-[14px] font-[1000] italic uppercase tracking-[0.2em] group-hover:text-black transition-colors">
            HỒ SƠ
          </span>
          <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-amber-500/50 group-hover:border-black/50 transition-colors" />
        </motion.button>
      </div>

      {/* Choices Layer: Vertical bars in the center, doesn't cover dialogue box */}
      {!isTyping && currentDialogue.choices && (
        <div className="absolute top-[10%] bottom-[240px] left-0 right-0 flex flex-col items-center justify-center z-[60] px-4 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-500 text-xs font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4 drop-shadow-lg"
          >
            <div className="h-px w-8 bg-amber-500/50" />
            Lựa chọn hành động
            <div className="h-px w-8 bg-amber-500/50" />
          </motion.div>

          <div className="flex flex-col gap-4 w-full max-w-2xl pointer-events-auto">
            {currentDialogue.choices.map((choice, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ 
                    scale: 1.03, 
                    backgroundColor: 'rgba(212, 175, 55, 1)', 
                    color: '#000',
                    boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (choice.action === 'OPEN_DOSSIER') {
                    setShowEvidence(true);
                  }

                  if (choice.nextId === 'intro_1') {
                    restartGame();
                  } else if (choice.nextId === 'MENU') {
                    setGamePhase('MENU');
                  } else {
                    setGameState(prev => ({ ...prev, currentDialogueId: choice.nextId }));
                    setIsTyping(true);
                  }
                }}
                className="group relative flex items-center justify-between px-10 py-5 bg-black/80 border-2 border-[#d4af37] text-white font-[900] text-lg uppercase tracking-[0.2em] transition-all duration-200 overflow-hidden shadow-xl"
              >
                <span className="relative z-10">{choice.text}</span>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-white/30 group-hover:bg-black/30 transition-colors" />
                    <ChevronRight className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
                {/* Visual accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-[#d4af37]" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Overlay */}
      <AnimatePresence>
        {showEvidence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header / Top Bar */}
            <div className="flex justify-between items-center py-8 px-12 border-b border-amber-500/10">
              <div className="flex flex-col">
                <motion.h2 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-5xl font-black italic tracking-tighter flex items-center gap-4 text-amber-500"
                >
                  <Briefcase size={40} className="text-amber-500" />
                  HỒ SƠ VỤ ÁN
                </motion.h2>
              </div>

              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowEvidence(false);
                  setSelectedEvidenceId(null);
                }}
                className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-300 border border-red-500/20"
              >
                <X size={28} />
              </motion.button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Evidence List */}
              <div className="w-full md:w-[60%] lg:w-[65%] p-10 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gameState.inventory.map((eid, idx) => {
                    const item = ALL_EVIDENCE[eid];
                    if (!item) return null;
                    const isSelected = selectedEvidenceId === eid;

                    return (
                      <motion.div
                        key={eid}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedEvidenceId(eid)}
                        className={`relative cursor-pointer group flex flex-col items-center bg-zinc-900/40 border-2 transition-all duration-300 p-2 rounded-xl group overflow-hidden ${
                          isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 hover:border-amber-500/30'
                        }`}
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          <div className={`absolute inset-0 bg-amber-500/10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <h3 className={`font-black uppercase text-[10px] tracking-widest text-center px-1 ${
                          isSelected ? 'text-amber-500' : 'text-zinc-500'
                        }`}>
                          {item.name}
                        </h3>
                        {isSelected && (
                          <motion.div 
                            layoutId="selection-glow"
                            className="absolute -inset-2 border border-amber-500/50 rounded-2xl blur-sm z-[-1]" 
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Detail */}
              <div className="hidden md:flex flex-col w-[40%] lg:w-[35%] bg-zinc-900/50 border-l border-amber-500/10 p-12 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {selectedEvidenceId ? (
                    <motion.div
                      key={selectedEvidenceId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col h-full"
                    >
                      <div className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-black mb-8 shadow-2xl relative">
                        <img 
                          src={ALL_EVIDENCE[selectedEvidenceId]?.image} 
                          alt={ALL_EVIDENCE[selectedEvidenceId]?.name} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 font-black rounded uppercase tracking-tighter">PHÂN TÍCH BẰNG CHỨNG</span>
                        </div>
                      </div>

                      <h3 className="text-3xl font-[1000] text-white italic uppercase leading-none mb-6 [text-shadow:4px_4px_0_#e74c3c]">
                        {ALL_EVIDENCE[selectedEvidenceId]?.name}
                      </h3>

                      <div className="flex gap-4 mb-8">
                        <div className="w-1 bg-amber-500 h-full rounded-full" />
                        <p className="text-zinc-400 text-sm italic font-medium leading-relaxed">
                          {ALL_EVIDENCE[selectedEvidenceId]?.description}
                        </p>
                      </div>

                      {currentDialogue.isStatement && (
                        <div className="mt-auto">
                          <motion.button
                            whileHover={{ 
                                scale: 1.05, 
                                backgroundColor: '#d4af37', 
                                color: '#000',
                                boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => presentEvidence(selectedEvidenceId)}
                            className="w-full py-5 bg-black border-2 border-amber-500 text-amber-500 font-black text-xl italic uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group"
                          >
                            <span className="relative z-10">ĐƯA RA (PRESENT)</span>
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 bg-amber-500 transition-transform duration-300" />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                      <Briefcase size={80} className="mb-6" />
                      <p className="font-bold uppercase tracking-widest text-sm">CHƯA CHỌN BẰNG CHỨNG</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Present Button (If needed) */}
            <div className="md:hidden p-6 border-t border-amber-500/10">
              {currentDialogue.isStatement && selectedEvidenceId && (
                <button
                  onClick={() => presentEvidence(selectedEvidenceId)}
                  className="w-full py-4 bg-amber-500 text-black font-black text-lg uppercase tracking-widest rounded-lg"
                >
                  ĐƯA RA BẰNG CHỨNG
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Effects */}
      <AnimatePresence>
        {effect && (
          <CourtroomEffect type={effect} onComplete={() => setEffect(null)} />
        )}
      </AnimatePresence>

      {/* Screen Flash for damage or emphasis */}
      {shake && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-50 bg-white pointer-events-none"
        />
      )}
    </div>
  );
}
