
import React from 'react';
import PrivacyScreen from './PrivacyScreen';
import { useGameLogic } from '../hooks/useGameLogic';
import { ROLE_DATA, STRINGS_FA } from '../constants';
import { Team } from '../types';

type RoleRevealProps = ReturnType<typeof useGameLogic>;

const RoleCard: React.FC<{ player: RoleRevealProps['gameState']['players'][0] }> = ({ player }) => {
  const roleInfo = ROLE_DATA[player.role];
  const teamColor = player.team === Team.Good ? 'text-blue-400' : 'text-red-400';
  const teamBorderColor = player.team === Team.Good ? 'border-blue-500/50' : 'border-red-500/50';

  return (
    <div className={`w-full max-w-sm p-4 bg-gray-900/70 backdrop-blur-lg border-2 ${teamBorderColor} rounded-3xl shadow-2xl flex flex-col items-center text-center animate-fade-in`}>
      
      {roleInfo.image ? (
        <div className="w-48 h-48 mb-4 rounded-full overflow-hidden border-4 border-yellow-400/50 shadow-lg">
            <img src={roleInfo.image} alt={roleInfo.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-48 h-48 mb-4 rounded-full bg-gray-800 border-4 border-yellow-400/50 flex items-center justify-center">
          <span className="text-5xl">{player.team === Team.Good ? '😇' : '😈'}</span>
        </div>
      )}

      <p className="text-2xl font-bold text-yellow-300">{player.name}</p>
      <h2 className={`text-4xl font-extrabold my-2 ${teamColor}`} style={{textShadow: '1px 1px 10px'}}>{roleInfo.name}</h2>
      <p className={`mb-4 font-semibold ${teamColor}`}>تیم: {roleInfo.team}</p>
      
      <div className="w-24 h-px my-3 bg-yellow-500/50 rounded-full"></div>
      
      <p className="text-gray-200 text-lg px-4">{roleInfo.description}</p>
      
      <p className="text-yellow-400/80 mt-6 text-sm animate-pulse">پس از خواندن، برای مخفی کردن ضربه بزنید.</p>
    </div>
  );
};


const RoleReveal: React.FC<RoleRevealProps> = ({ gameState, advanceRoleReveal }) => {
  const { players, activePlayerIndex } = gameState;
  const currentPlayer = players[activePlayerIndex];
  const isLastPlayer = activePlayerIndex === players.length - 1;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <PrivacyScreen
        message={STRINGS_FA.passTo.replace('{player}', currentPlayer.name)}
        buttonText={STRINGS_FA.tapToReveal}
        onContinue={advanceRoleReveal}
      >
        <RoleCard player={currentPlayer} />
        {isLastPlayer && <p className="mt-4 text-yellow-400 animate-pulse">شما آخرین نفر هستید. پس از شما، فاز شب آغاز می‌شود.</p>}
      </PrivacyScreen>
    </div>
  );
};

export default RoleReveal;