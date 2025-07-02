import React from 'react';
import { ROLE_DATA } from '../constants';
import { GameState, Role, Team } from '../types';

type GameOverviewProps = {
  gameState: GameState;
  startGameAfterOverview: () => void;
};

const GameOverview: React.FC<GameOverviewProps> = ({ gameState, startGameAfterOverview }) => {
  const rolesInGame = [...new Set(gameState.players.map(p => p.role))];
  const goodRoles = rolesInGame.filter(r => ROLE_DATA[r].team === Team.Good);
  const evilRoles = rolesInGame.filter(r => ROLE_DATA[r].team === Team.Evil);

  return (
    <div className="w-full h-full flex flex-col items-center p-2 animate-fade-in">
      <h2 className="text-3xl font-bold text-yellow-400 mb-2">مرور نقش‌های بازی</h2>
      <p className="text-gray-300 mb-4 text-center text-sm">این نقش‌ها در این دور از بازی حضور دارند. به قابلیت‌های آنها دقت کنید.</p>
      
      <div className="w-full flex-grow overflow-y-auto space-y-4 pr-2">
        <div>
          <h3 className="text-xl font-bold text-blue-400 mb-2 pb-1 border-b-2 border-blue-500/30">تیم نیکان 😇</h3>
          <div className="space-y-2">
            {goodRoles.map(role => <RoleInfoCard key={role} role={role} />)}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-red-400 mb-2 pb-1 border-b-2 border-red-500/30">تیم شروران 😈</h3>
           <div className="space-y-2">
            {evilRoles.map(role => <RoleInfoCard key={role} role={role} />)}
          </div>
        </div>
      </div>

      <button
        onClick={startGameAfterOverview}
        className="mt-4 w-full max-w-sm bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
      >
        شروع راند اول
      </button>
    </div>
  );
};

const RoleInfoCard: React.FC<{ role: Role }> = ({ role }) => {
  const roleInfo = ROLE_DATA[role];
  const teamColor = roleInfo.team === Team.Good ? 'text-blue-300' : 'text-red-300';
  const teamBg = roleInfo.team === Team.Good ? 'bg-blue-900/40' : 'bg-red-900/40';

  // Rephrase description from 1st person to 3rd person for overview
  const overviewDescription = roleInfo.description
    .replace(/^شما /, '')
    .replace(' هستید', '')
    .replace(/شما /g, 'او ')
    .replace(/می‌دانید/g, 'می‌داند')
    .replace(/شما را/g, 'او را');


  return (
    <div className={`p-3 rounded-lg border border-gray-700 ${teamBg}`}>
      <h4 className={`text-lg font-bold ${teamColor}`}>{roleInfo.name}</h4>
      <p className="text-gray-200 text-sm">{overviewDescription}</p>
    </div>
  );
};

export default GameOverview;