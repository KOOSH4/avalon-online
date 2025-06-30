
import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GamePhase, Player, QuestResult, Team } from '../types';
import { CrownIcon } from '../constants';
import PrivacyScreen from './PrivacyScreen';
import Modal from './Modal';

type GameBoardProps = ReturnType<typeof useGameLogic>;

function shuffleArray<T,>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const GameBoard: React.FC<GameBoardProps> = (props) => {
  const { gameState } = props;

  const renderContent = () => {
    switch (gameState.phase) {
      case GamePhase.TEAM_PROPOSAL:
        return <TeamProposal {...props} />;
      case GamePhase.TEAM_VOTE:
        return <TeamVote {...props} />;
      case GamePhase.QUEST_EXECUTION:
          return <QuestExecution {...props} />;
      case GamePhase.QUEST_RESULT:
          return <QuestResultDisplay {...props} />;
      case GamePhase.ASSASSINATION:
        return <Assassination {...props} />;
      case GamePhase.GAME_OVER:
        return <GameOver {...props} />;
      default:
        return <div className="text-center text-xl">در حال بارگذاری فاز بعدی...</div>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Scoreboard {...props} />
      <div className="flex-grow w-full relative">
        {renderContent()}
      </div>
    </div>
  );
};

const Scoreboard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { players, quests, currentLeaderIndex, voteTrack } = gameState;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg mb-2">
        <h3 className="text-lg font-bold text-yellow-400">ماموریت‌ها</h3>
        <div className="flex gap-2">
          {quests.map(q => (
            <div key={q.id} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-white font-bold ${
                q.result === QuestResult.PENDING ? 'border-gray-500 bg-gray-700' :
                q.result === QuestResult.SUCCESS ? 'border-blue-400 bg-blue-600' : 'border-red-400 bg-red-600'
            }`}>
              {q.result === QuestResult.SUCCESS ? '✔️' : q.result === QuestResult.FAIL ? '❌' : q.teamSize}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg">
        <h3 className="text-lg font-bold text-yellow-400">رهبر فعلی</h3>
        <div className="flex items-center gap-2 text-xl">
          <span className="text-white">{players[currentLeaderIndex].name}</span>
          {CrownIcon}
        </div>
        <div className="flex items-center gap-1" title="تعداد رأی‌گیری‌های ناموفق متوالی">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < voteTrack ? 'bg-red-500' : 'bg-gray-600'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TeamProposal: React.FC<GameBoardProps> = ({ gameState, selectTeamMember, proposeTeam }) => {
    const { players, currentQuestTeam, gameMessage, quests, currentRound } = gameState;
    const requiredSize = quests[currentRound].teamSize;
    const canPropose = currentQuestTeam.length === requiredSize;

    return (
        <div className="text-center flex flex-col h-full">
            <p className="text-yellow-200 text-lg mb-4">{gameMessage}</p>
            <div className="grid grid-cols-2 gap-3 flex-grow overflow-y-auto pr-2">
                {players.map(p => {
                    const isSelected = currentQuestTeam.some(sp => sp.id === p.id);
                    return (
                        <button key={p.id} onClick={() => selectTeamMember(p)}
                            className={`p-3 rounded-lg text-lg font-semibold transition-all duration-200
                            ${isSelected ? 'bg-green-600 text-white ring-2 ring-yellow-400 scale-105' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {p.name}
                        </button>
                    )
                })}
            </div>
            <button onClick={proposeTeam} disabled={!canPropose}
                className={`mt-4 w-full p-3 rounded-lg text-xl font-bold transition-all
                ${!canPropose ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 text-white animate-pulse'}`}>
                پیشنهاد تیم
            </button>
        </div>
    );
};

const TeamVote: React.FC<GameBoardProps> = ({ gameState, handleTeamVote }) => {
    const { currentQuestTeam, players, currentLeaderIndex } = gameState;
    const leader = players[currentLeaderIndex];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">رأی‌گیری برای تیم</h2>
            <p className="text-lg mb-2">{leader.name} این تیم را پیشنهاد داده است:</p>
            <div className="bg-black/20 p-3 rounded-lg mb-6 w-full max-w-xs">
                <p className="text-xl font-bold text-yellow-200">{currentQuestTeam.map(p => p.name).join('، ')}</p>
            </div>
            <p className="text-xl mb-4">آیا گروه با این تیم موافق است؟</p>
            <div className="flex w-full max-w-sm gap-4">
                <button onClick={() => handleTeamVote(true)} className="w-1/2 p-4 text-2xl font-bold bg-blue-600 hover:bg-blue-700 rounded-lg transition-transform hover:scale-105">
                    موافق 👍
                </button>
                <button onClick={() => handleTeamVote(false)} className="w-1/2 p-4 text-2xl font-bold bg-red-600 hover:bg-red-700 rounded-lg transition-transform hover:scale-105">
                    مخالف 👎
                </button>
            </div>
            <p className="text-gray-400 mt-6 text-sm">این نتیجه رأی‌گیری حضوری (با شست بالا/پایین) است.</p>
        </div>
    );
};

const QuestExecution: React.FC<GameBoardProps> = ({ gameState, submitQuestOutcome }) => {
    const activePlayerOnTeam = gameState.currentQuestTeam.find(p => p.id === gameState.players[gameState.activePlayerIndex]?.id);
   
    if (!activePlayerOnTeam) {
        return <div className="text-center p-4">در انتظار بازیکن بعدی در تیم...</div>;
    }

    const currentPlayer = activePlayerOnTeam;
    const canFail = currentPlayer.team === Team.Evil;

    const QuestScreen: React.FC = () => (
         <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <p className="text-2xl mb-8">کارت خود را برای ماموریت بازی کنید:</p>
            <div className="flex w-full gap-4">
                <button onClick={() => submitQuestOutcome('Success')} className="w-1/2 p-4 text-2xl font-bold bg-blue-600 hover:bg-blue-700 rounded-lg transition-transform hover:scale-105">
                    موفقیت ✅
                </button>
                <button onClick={() => submitQuestOutcome('Fail')} disabled={!canFail} className={`w-1/2 p-4 text-2xl font-bold rounded-lg transition-transform hover:scale-105
                    ${!canFail ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}>
                    شکست ❌
                </button>
            </div>
        </div>
    )

    return (
         <PrivacyScreen 
            key={currentPlayer.id} 
            message={`گوشی را به ${currentPlayer.name} بدهید`} 
            buttonText="برای انجام ماموریت ضربه بزنید" 
            onContinue={() => {}}
        >
            <QuestScreen />
        </PrivacyScreen>
    )
}

const QuestResultDisplay: React.FC<GameBoardProps> = ({ gameState, processQuestResult }) => {
    const { quests, currentRound, temporaryQuestOutcomes } = gameState;
    const currentQuest = quests[currentRound];
    const outcomes = React.useMemo(() => shuffleArray(temporaryQuestOutcomes), [temporaryQuestOutcomes]);

    const failCount = outcomes.filter(o => o === 'Fail').length;
    const didFail = failCount >= currentQuest.failsRequired;
    const resultForDisplay = didFail ? QuestResult.FAIL : QuestResult.SUCCESS;

    return (
        <Modal title={`نتیجه ماموریت ${currentRound + 1}`} onClose={processQuestResult}>
             <div className="text-center">
                <p className="text-3xl mb-4 font-bold">
                    {resultForDisplay === QuestResult.SUCCESS 
                        ? <span className="text-blue-400">مأموریت موفقیت‌آمیز بود! 😇</span> 
                        : <span className="text-red-400">مأموریت شکست خورد! 😈</span>
                    }
                </p>

                <div className="flex justify-center items-center gap-2 my-6 bg-black/30 p-3 rounded-lg">
                    <p className="text-lg font-bold">کارت‌های بازی شده:</p>
                    {outcomes.map((o, i) => (
                        <span key={i} className="text-3xl animate-fade-in" style={{animationDelay: `${i * 100}ms`}}>{o === 'Success' ? '✅' : '❌'}</span>
                    ))}
                </div>

                 <p className="mt-4 text-base text-gray-300">
                    برای شکست این ماموریت به 
                    <span className="font-bold text-yellow-300 mx-1">{currentQuest.failsRequired}</span>
                     کارت شکست نیاز بود.
                 </p>
                 <p className="mt-6 text-lg text-yellow-300">برای ادامه و شروع دور بعد، دکمه زیر را فشار دهید.</p>
            </div>
        </Modal>
    );
}

const Assassination: React.FC<GameBoardProps> = ({ gameState, assassinate }) => {
    const { players, assassin } = gameState;
    const [targetToConfirm, setTargetToConfirm] = React.useState<Player | null>(null);
    const potentialTargets = players.filter(p => p.team === Team.Good);

    if (targetToConfirm) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-black/50 rounded-lg animate-fade-in">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">تایید نهایی</h3>
                <p className="text-lg mb-6">
                    آیا از ترور <span className="font-bold text-red-400">{targetToConfirm.name}</span> مطمئن هستید؟
                </p>
                <div className="flex w-full max-w-sm gap-4">
                    <button 
                        onClick={() => assassinate(targetToConfirm)} 
                        className="w-1/2 p-4 text-xl font-bold bg-red-600 hover:bg-red-700 rounded-lg transition-transform hover:scale-105">
                        بله، ترور کن
                    </button>
                    <button 
                        onClick={() => setTargetToConfirm(null)} 
                        className="w-1/2 p-4 text-xl font-bold bg-gray-600 hover:bg-gray-700 rounded-lg transition-transform hover:scale-105">
                        نه، برگرد
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="text-center flex flex-col h-full">
            <h2 className="text-2xl font-bold text-red-500 mb-2">فاز ترور 🗡️</h2>
            <p className="text-yellow-200 text-lg mb-4">{assassin?.name}، باید مرلین را پیدا کنی!</p>
            <div className="grid grid-cols-2 gap-3 flex-grow overflow-y-auto pr-2">
                {potentialTargets.map(p => (
                    <button key={p.id} onClick={() => setTargetToConfirm(p)}
                        className="p-3 rounded-lg text-lg font-semibold bg-gray-700 hover:bg-red-700 transition-all duration-200">
                        ترور {p.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

const GameOver: React.FC<GameBoardProps> = ({ gameState, resetGame }) => {
    const { winner, gameMessage, players } = gameState;
    return (
        <Modal title="پایان بازی" onClose={resetGame} buttonText="بازی جدید">
            <div className="text-center">
                <p className={`text-3xl font-bold mb-4 ${winner === Team.Good ? 'text-blue-400' : 'text-red-400'}`}>
                    {winner === Team.Good ? 'نیکان پیروز شدند! 😇🏆' : 'شروران پیروز شدند! 😈🏆'}
                </p>
                <p className="text-lg text-yellow-300 mb-6">{gameMessage}</p>
                <div className="space-y-2 text-left">
                    <h4 className="text-xl font-bold text-center mb-2">نقش‌ها:</h4>
                     {players.map(p => (
                        <div key={p.id} className={`flex justify-between p-2 rounded ${p.team === Team.Good ? 'bg-blue-900/50' : 'bg-red-900/50'}`}>
                            <span className={`font-bold ${p.team === Team.Good ? 'text-blue-300' : 'text-red-300'}`}>{p.name}</span>
                            <span className="font-semibold">{p.role}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default GameBoard;
