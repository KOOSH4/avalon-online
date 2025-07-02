
import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GamePhase } from './types';
import PlayerSetup from './components/PlayerSetup';
import RoleReveal from './components/RoleReveal';
import NightPhase from './components/NightPhase';
import GameBoard from './components/GameBoard';
import RulesAndFaq from './components/RulesAndFaq';
import { GameIcon } from './constants';
import RoleGuide from './components/RoleGuide';

export default function App(): React.ReactNode {
  const gameLogic = useGameLogic();
  const { gameState } = gameLogic;
  const [showRules, setShowRules] = React.useState(false);
  const [showRoleGuide, setShowRoleGuide] = React.useState(false);

  const renderPhase = () => {
    switch (gameState.phase) {
      case GamePhase.SETUP:
        return <PlayerSetup onSetupComplete={gameLogic.setupGame} />;
      case GamePhase.ROLE_REVEAL:
        return <RoleReveal {...gameLogic} />;
      case GamePhase.NIGHT_PHASE:
        return <NightPhase {...gameLogic} />;
      default:
        return <GameBoard {...gameLogic} />;
    }
  };

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col items-center justify-center p-4 relative font-sans">
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button
                onClick={() => setShowRoleGuide(true)}
                className="bg-purple-600/50 hover:bg-purple-500/70 text-white font-bold p-2 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
                aria-label="راهنمای نقش‌ها"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.28-1.255-.758-1.685M12 12A4 4 0 1012 4a4 4 0 000 8zm0 0v6m0-6H9m3 0h3" /></svg>
            </button>
            <button
                onClick={() => setShowRules(true)}
                className="bg-yellow-600/50 hover:bg-yellow-500/70 text-white font-bold p-2 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
                aria-label="قوانین و سوالات"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.043L6.92 9.93a2.5 2.5 0 00-1.128 2.134v4.23a2.5 2.5 0 001.25 2.134l4.603 2.557a2.5 2.5 0 002.5 0l4.603-2.557a2.5 2.5 0 001.25-2.134v-4.23a2.5 2.5 0 00-1.128-2.134l-1.308-.887M12 15.428V2.5" /></svg>
            </button>
            <button
                onClick={gameLogic.resetGame}
                className="bg-red-600/50 hover:bg-red-500/70 text-white font-bold p-2 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
                aria-label="شروع مجدد بازی"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path d="M4 9a9 9 0 0 1 14.65-4.65l-1.33 1.33A7 7 0 0 0 8.5 16.5" /><path d="M20 15a9 9 0 0 1-14.65 4.65l1.33-1.33A7 7 0 0 0 15.5 7.5" /></svg>
            </button>
        </div>

      <div className="flex items-center mb-4 text-yellow-400">
        <div className="w-12 h-12 mr-4">{GameIcon}</div>
        <h1 className="text-4xl font-bold tracking-wider" style={{textShadow: '0 0 8px rgba(250, 204, 21, 0.5)'}}>آوالون</h1>
      </div>

      <div className="w-full h-[calc(100%-80px)] bg-slate-900/70 rounded-2xl shadow-2xl backdrop-blur-md border-2 border-yellow-400/30 p-4 overflow-y-auto">
        {showRules ? (
            <RulesAndFaq onClose={() => setShowRules(false)} />
        ) : showRoleGuide ? (
            <RoleGuide onClose={() => setShowRoleGuide(false)} />
        ) : (
            renderPhase()
        )}
      </div>
    </div>
  );
}