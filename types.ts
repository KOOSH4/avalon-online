
import React from 'react';

export enum Team {
  Good = 'نیک',
  Evil = 'شر',
}

export enum Role {
  // Good Roles
  Merlin = 'مرلین',
  Percival = 'پرسیوال',
  LoyalServant = 'خدمتگزار وفادار آرتور',
  Tristan = 'تریستان',
  Isolde = 'ایزولت',
  // Evil Roles
  Morgana = 'مورگانا',
  Assassin = 'آدمکش',
  Mordred = 'موردرد',
  Oberon = 'اوبرون',
}

export interface RoleInfo {
  name: Role;
  team: Team;
  description: string;
  knowledge: (players: Player[], self: Player) => React.ReactNode;
  image: string;
}

export interface Player {
  id: number;
  name:string;
  role: Role;
  team: Team;
}

export enum GamePhase {
  SETUP = 'SETUP',
  ROLE_REVEAL = 'ROLE_REVEAL',
  NIGHT_PHASE = 'NIGHT_PHASE',
  TEAM_PROPOSAL = 'TEAM_PROPOSAL',
  TEAM_VOTE = 'TEAM_VOTE',
  QUEST_EXECUTION = 'QUEST_EXECUTION',
  QUEST_RESULT = 'QUEST_RESULT',
  ASSASSINATION = 'ASSASSINATION',
  GAME_OVER = 'GAME_OVER',
}

export enum QuestResult {
  SUCCESS = 'موفق',
  FAIL = 'ناموفق',
  PENDING = 'در انتظار',
}

export interface Quest {
  id: number;
  teamSize: number;
  failsRequired: number;
  result: QuestResult;
  team: Player[];
  outcomes: ('Success' | 'Fail')[];
}

export interface GameState {
  players: Player[];
  phase: GamePhase;
  currentRound: number;
  currentLeaderIndex: number;
  voteTrack: number;
  quests: Quest[];
  currentQuestTeam: Player[];
  gameMessage: string | null;
  winner: Team | null;
  // For interactive phases
  activePlayerIndex: number;
  privateActionStep: number; // For multi-step private actions like night phase
  temporaryQuestOutcomes: ('Success' | 'Fail')[];
  assassin: Player | null;
}
