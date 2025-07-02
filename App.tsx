import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GamePhase } from './types';
import PlayerSetup from './components/PlayerSetup';
import RoleReveal from './components/RoleReveal';
import NightPhase from './components/NightPhase';
import GameBoard from './components/GameBoard';
import RulesAndFaq from './components/RulesAndFaq';
import RoleGuide from './components/RoleGuide';
import GameOverview from './components/GameOverview';

export default function App(): React.ReactNode {
  const gameLogic = useGameLogic();
  const { gameState } = gameLogic;
  const [showRules, setShowRules] = React.useState(false);
  const [showRoleGuide, setShowRoleGuide] = React.useState(false);
  const [showQRCode, setShowQRCode] = React.useState(false);

  const renderPhase = () => {
    switch (gameState.phase) {
      case GamePhase.SETUP:
        return <PlayerSetup onSetupComplete={gameLogic.setupGame} />;
      case GamePhase.ROLE_REVEAL:
        return <RoleReveal {...gameLogic} />;
      case GamePhase.NIGHT_PHASE:
        return <NightPhase {...gameLogic} />;
      case GamePhase.GAME_OVERVIEW:
        return <GameOverview gameState={gameState} startGameAfterOverview={gameLogic.startGameAfterOverview} />;
      default:
        return <GameBoard {...gameLogic} />;
    }
  };

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col items-center justify-center p-4 relative font-sans">
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button
                onClick={() => setShowQRCode(true)}
                className="bg-gray-600/50 hover:bg-gray-500/70 text-white font-bold p-2 w-10 h-10 flex items-center justify-center text-2xl rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
                aria-label="اشتراک‌گذاری بازی"
            >
                🔗
            </button>
            <button
                onClick={() => setShowRoleGuide(true)}
                className="bg-purple-600/50 hover:bg-purple-500/70 text-white font-bold p-2 w-10 h-10 flex items-center justify-center text-2xl rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
                aria-label="راهنمای نقش‌ها"
            >
                📖
            </button>
            <button
                onClick={() => setShowRules(true)}
                className="bg-yellow-600/50 hover:bg-yellow-500/70 text-white font-bold p-2 w-10 h-10 flex items-center justify-center text-2xl rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
                aria-label="قوانین و سوالات"
            >
                ❓
            </button>
            <button
                onClick={gameLogic.resetGame}
                className="bg-red-600/50 hover:bg-red-500/70 text-white font-bold p-2 w-10 h-10 flex items-center justify-center text-2xl rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
                aria-label="شروع مجدد بازی"
            >
                🔄
            </button>
        </div>

      <div className="flex items-center mb-6 text-yellow-400">
        <h1 className="text-5xl font-bold tracking-widest" style={{textShadow: '0 0 10px rgba(250, 204, 21, 0.7)'}}>AVALON</h1>
      </div>

      <div className="w-full h-[calc(100%-96px)] bg-slate-900/70 rounded-2xl shadow-2xl backdrop-blur-md border-2 border-yellow-400/30 p-4 overflow-y-auto">
        {showRules ? (
            <RulesAndFaq onClose={() => setShowRules(false)} />
        ) : showRoleGuide ? (
            <RoleGuide onClose={() => setShowRoleGuide(false)} />
        ) : (
            renderPhase()
        )}
      </div>

      {showQRCode && (
        <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in"
            onClick={() => setShowQRCode(false)}
        >
            <div 
                className="bg-slate-900 p-6 rounded-2xl border-2 border-yellow-500/50 flex flex-col items-center text-center w-full max-w-xs"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-yellow-300 mb-2">اشتراک‌گذاری بازی</h3>
                <p className="text-gray-300 mb-4 text-sm">این کد QR را اسکن کنید تا دیگران به بازی ملحق شوند.</p>
                <div className="p-2 bg-white rounded-lg">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}&qzone=1`} 
                        alt="QR Code for game link" 
                        className="w-full h-full"
                    />
                </div>
                 <p className="text-xs text-gray-500 mt-4 break-all">{window.location.href}</p>
                <button
                    onClick={() => setShowQRCode(false)}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-lg"
                >
                    بستن
                </button>
            </div>
        </div>
      )}
    </div>
  );
}