import { useReducer, useCallback } from 'react';
import { GameState, GamePhase, Player, Role, Team, Quest, QuestResult } from '../types';
import { ROLE_CONFIGURATIONS, QUEST_RULES, ROLE_DATA } from '../constants';

type Action =
  | { type: 'SETUP_GAME'; playerCount: number; playerNames: string[] }
  | { type: 'ADVANCE_ROLE_REVEAL' }
  | { type: 'START_NIGHT_PHASE' }
  | { type: 'ADVANCE_NIGHT_PHASE' }
  | { type: 'START_GAME_AFTER_OVERVIEW' }
  | { type: 'START_TEAM_PROPOSAL' }
  | { type: 'SELECT_TEAM_MEMBER'; player: Player }
  | { type: 'PROPOSE_TEAM' }
  | { type: 'HANDLE_TEAM_VOTE'; approved: boolean }
  | { type: 'SUBMIT_QUEST_OUTCOME'; outcome: 'Success' | 'Fail' }
  | { type: 'PROCESS_QUEST_RESULT' }
  | { type: 'START_ASSASSINATION' }
  | { type: 'ASSASSINATE'; target: Player }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  players: [],
  phase: GamePhase.SETUP,
  currentRound: 0,
  currentLeaderIndex: 0,
  voteTrack: 0,
  quests: [],
  currentQuestTeam: [],
  gameMessage: null,
  winner: null,
  activePlayerIndex: 0,
  privateActionStep: 0,
  temporaryQuestOutcomes: [],
  assassin: null,
};

function shuffleArray<T,>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'RESET_GAME':
      return initialState;

    case 'SETUP_GAME': {
      const { playerCount, playerNames } = action;
      const rolesConfig = ROLE_CONFIGURATIONS[playerCount];
      const roles: Role[] = shuffleArray([...rolesConfig.good, ...rolesConfig.evil]);
      const shuffledNames = shuffleArray(playerNames);

      const players: Player[] = shuffledNames.map((name, i) => {
        const role = roles[i];
        const team = ROLE_DATA[role].team;
        return { id: i, name, role, team };
      });

      const quests: Quest[] = QUEST_RULES[playerCount].teamSizes.map((size, i) => ({
        id: i,
        teamSize: size,
        failsRequired: QUEST_RULES[playerCount].failsRequired[i],
        result: QuestResult.PENDING,
        team: [],
        outcomes: [],
      }));

      return {
        ...initialState,
        players,
        quests,
        phase: GamePhase.ROLE_REVEAL,
        currentLeaderIndex: Math.floor(Math.random() * playerCount),
      };
    }
    
    case 'ADVANCE_ROLE_REVEAL': {
        const nextIndex = state.activePlayerIndex + 1;
        if (nextIndex >= state.players.length) {
            return { ...state, phase: GamePhase.NIGHT_PHASE, activePlayerIndex: 0, privateActionStep: 0 };
        }
        return { ...state, activePlayerIndex: nextIndex };
    }

    case 'START_NIGHT_PHASE':
      return { ...state, phase: GamePhase.NIGHT_PHASE, activePlayerIndex: 0, privateActionStep: 0 };

    case 'ADVANCE_NIGHT_PHASE': {
        const nextStep = state.privateActionStep + 1;
        if(nextStep >= state.players.length) {
            return { ...state, phase: GamePhase.GAME_OVERVIEW };
        }
        return { ...state, privateActionStep: nextStep };
    }

    case 'START_GAME_AFTER_OVERVIEW': {
      return {
          ...state,
          phase: GamePhase.TEAM_PROPOSAL,
          gameMessage: `دور ${state.currentRound + 1}: نوبت ${state.players[state.currentLeaderIndex].name} است تا تیم را انتخاب کند.`
      };
    }

    case 'START_TEAM_PROPOSAL': {
      const leader = state.players[state.currentLeaderIndex];
      return {
          ...state,
          phase: GamePhase.TEAM_PROPOSAL,
          currentQuestTeam: [],
          gameMessage: `دور ${state.currentRound + 1} - رأی ${state.voteTrack + 1}: ${leader.name}، لطفاً ${state.quests[state.currentRound].teamSize} نفر را برای مأموریت انتخاب کن.`
      };
    }

    case 'SELECT_TEAM_MEMBER': {
      const { player } = action;
      const team = state.currentQuestTeam;
      const isSelected = team.some(p => p.id === player.id);
      const newTeam = isSelected ? team.filter(p => p.id !== player.id) : [...team, player];
      return { ...state, currentQuestTeam: newTeam };
    }

    case 'PROPOSE_TEAM': {
      if(state.currentQuestTeam.length !== state.quests[state.currentRound].teamSize) return state;
      return { ...state, phase: GamePhase.TEAM_VOTE };
    }
    
    case 'HANDLE_TEAM_VOTE': {
      const { approved } = action;

      if (approved) { // Vote passes
        return {
          ...state,
          phase: GamePhase.QUEST_EXECUTION,
          voteTrack: 0,
          quests: state.quests.map((q, i) => i === state.currentRound ? { ...q, team: state.currentQuestTeam } : q),
          activePlayerIndex: state.players.findIndex(p => p.id === state.currentQuestTeam[0].id),
          temporaryQuestOutcomes: [],
          gameMessage: `تیم تأیید شد! اعضای تیم مأموریت لطفاً رأی خود را ثبت کنند.`
        };
      } else { // Vote fails
        const newVoteTrack = state.voteTrack + 1;
        if (newVoteTrack >= 5) {
          return { ...state, phase: GamePhase.GAME_OVER, winner: Team.Evil, gameMessage: '۵ رأی ناموفق متوالی! نیروهای شر پیروز شدند. 👎' };
        }
        const newLeaderIndex = (state.currentLeaderIndex + 1) % state.players.length;
        const leader = state.players[newLeaderIndex];
        return {
          ...state,
          phase: GamePhase.TEAM_PROPOSAL,
          voteTrack: newVoteTrack,
          currentLeaderIndex: newLeaderIndex,
          currentQuestTeam: [],
          gameMessage: `رأی‌گیری ناموفق بود. رهبر جدید: ${leader.name}.`
        };
      }
    }

    case 'SUBMIT_QUEST_OUTCOME': {
        const newOutcomes = [...state.temporaryQuestOutcomes, action.outcome];
        
        // Find current player's index *on the quest team*
        const currentPlayerOnTeamIndex = state.currentQuestTeam.findIndex(p => p.id === state.players[state.activePlayerIndex].id);

        // If there are more players on the quest team to vote
        if (currentPlayerOnTeamIndex < state.currentQuestTeam.length - 1) {
            const nextPlayerOnTeam = state.currentQuestTeam[currentPlayerOnTeamIndex + 1];
            const nextGlobalPlayerIndex = state.players.findIndex(p => p.id === nextPlayerOnTeam.id);
            return { 
                ...state, 
                temporaryQuestOutcomes: newOutcomes, 
                activePlayerIndex: nextGlobalPlayerIndex 
            };
        }
        
        // Last player on team has voted, move to result phase
        return { ...state, phase: GamePhase.QUEST_RESULT, temporaryQuestOutcomes: newOutcomes };
    }

    case 'PROCESS_QUEST_RESULT': {
      const outcomes = shuffleArray(state.temporaryQuestOutcomes);
      const failCount = outcomes.filter(o => o === 'Fail').length;
      const { failsRequired } = state.quests[state.currentRound];
      const didFail = failCount >= failsRequired;
      const result = didFail ? QuestResult.FAIL : QuestResult.SUCCESS;

      const updatedQuests = state.quests.map((q, i) =>
        i === state.currentRound ? { ...q, result, outcomes } : q
      );

      const goodWins = updatedQuests.filter(q => q.result === QuestResult.SUCCESS).length;
      const evilWins = updatedQuests.filter(q => q.result === QuestResult.FAIL).length;

      if (goodWins >= 3) {
        const assassin = state.players.find(p => p.role === Role.Assassin);
        return { ...state, phase: GamePhase.ASSASSINATION, assassin, quests: updatedQuests, gameMessage: "نیکان در ۳ مأموریت پیروز شدند! 🏆 آدمکش باید مرلین را پیدا کند." };
      }
      if (evilWins >= 3) {
        return { ...state, phase: GamePhase.GAME_OVER, winner: Team.Evil, quests: updatedQuests, gameMessage: "شروران در ۳ مأموریت پیروز شدند! 💀" };
      }

      // Continue to next round
      const newLeaderIndex = (state.currentLeaderIndex + 1) % state.players.length;
      const leader = state.players[newLeaderIndex];
      return {
        ...state,
        phase: GamePhase.TEAM_PROPOSAL,
        currentRound: state.currentRound + 1,
        currentLeaderIndex: newLeaderIndex,
        voteTrack: 0,
        quests: updatedQuests,
        currentQuestTeam: [],
        gameMessage: `مأموریت ${didFail ? 'ناموفق بود ❌' : 'موفق بود ✅'}. رهبر جدید: ${leader.name}.`,
      };
    }
    
    case 'START_ASSASSINATION': {
        const assassin = state.players.find(p => p.role === Role.Assassin);
        return { ...state, phase: GamePhase.ASSASSINATION, assassin, gameMessage: `${assassin?.name}، شما باید مرلین را شناسایی کنید.` };
    }

    case 'ASSASSINATE': {
      const { target } = action;
      if (target.role === Role.Merlin) {
        return { ...state, phase: GamePhase.GAME_OVER, winner: Team.Evil, gameMessage: `آدمکش مرلین را پیدا کرد! 🎯 شروران پیروز شدند.` };
      } else {
        return { ...state, phase: GamePhase.GAME_OVER, winner: Team.Good, gameMessage: `حدس آدمکش اشتباه بود! نیکان پیروز شدند. 🎉` };
      }
    }

    default:
      return state;
  }
}


export const useGameLogic = () => {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);

    const setupGame = useCallback((playerCount: number, playerNames: string[]) => {
        dispatch({ type: 'SETUP_GAME', playerCount, playerNames });
    }, []);
    const advanceRoleReveal = useCallback(() => dispatch({ type: 'ADVANCE_ROLE_REVEAL' }), []);
    const advanceNightPhase = useCallback(() => dispatch({ type: 'ADVANCE_NIGHT_PHASE' }), []);
    const startGameAfterOverview = useCallback(() => dispatch({ type: 'START_GAME_AFTER_OVERVIEW' }), []);
    const selectTeamMember = useCallback((player: Player) => dispatch({ type: 'SELECT_TEAM_MEMBER', player }), []);
    const proposeTeam = useCallback(() => dispatch({ type: 'PROPOSE_TEAM' }), []);
    const handleTeamVote = useCallback((approved: boolean) => dispatch({ type: 'HANDLE_TEAM_VOTE', approved }), []);
    const submitQuestOutcome = useCallback((outcome: 'Success' | 'Fail') => dispatch({ type: 'SUBMIT_QUEST_OUTCOME', outcome }), []);
    const processQuestResult = useCallback(() => dispatch({ type: 'PROCESS_QUEST_RESULT'}), []);
    
    const assassinate = useCallback((target: Player) => {
        dispatch({ type: 'ASSASSINATE', target });
    }, []);
    
    const resetGame = useCallback(() => {
        if (window.confirm('آیا مطمئن هستید که می‌خواهید بازی را از نو شروع کنید؟')) {
            dispatch({ type: 'RESET_GAME' });
        }
    }, []);

    return {
        gameState,
        setupGame,
        advanceRoleReveal,
        advanceNightPhase,
        startGameAfterOverview,
        selectTeamMember,
        proposeTeam,
        handleTeamVote,
        submitQuestOutcome,
        processQuestResult,
        assassinate,
        resetGame,
    };
};