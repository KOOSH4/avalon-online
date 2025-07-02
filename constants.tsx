import React from 'react';
import { Role, Team, RoleInfo, Player } from './types';

const EvilTeammates: React.FC<{players: Player[], self: Player}> = ({ players, self }) => {
  const isOberonInGame = players.some(p => p.role === Role.Oberon);
  const evilPlayers = players.filter(p => p.team === Team.Evil && p.id !== self.id && p.role !== Role.Oberon);
  const oberonText = isOberonInGame ? ' (به جز اوبرون 😶)' : '';

  if (evilPlayers.length === 0) {
    if (self.role === Role.Oberon) return <>شما هیچ‌کس را نمی‌شناسید.</>;
    return <>شما تنها شرور هستید{oberonText}.</>;
  }

  return (
    <>
      هم‌تیمی‌های شرور شما{oberonText} عبارتند از:{' '}
      {evilPlayers.map((p, i) => (
        <React.Fragment key={p.id}>
          <span className="font-bold text-red-400">{p.name}</span>
          {i < evilPlayers.length - 1 ? '، ' : ''}
        </React.Fragment>
      ))}
      {' '}😈.
    </>
  );
}

export const ROLE_DATA: { [key in Role]: RoleInfo } = {
  [Role.Merlin]: {
    name: Role.Merlin,
    team: Team.Good,
    description: 'شما مرلین 🧙‍♂️ هستید. شما نام افراد شرور را می‌دانید، اما آنها شما را نمی‌شناسند. اگر هویت شما فاش شود، نیکان شکست می‌خورند.',
    knowledge: (players) => {
      const isMordredInGame = players.some(p => p.role === Role.Mordred);
      const evilPlayers = players.filter(p => p.team === Team.Evil && p.role !== Role.Mordred);
      if (evilPlayers.length === 0) {
        return `هیچ فرد شروری (که شما بشناسید) در بازی نیست.${isMordredInGame ? " مراقب موردرد 🎭 باشید!" : ""}`;
      }
      const mordredText = isMordredInGame ? ' (به جز موردرد 🎭)' : '';
      return (
        <>
          <span className="font-bold">افراد شرور</span>{mordredText} عبارتند از:{' '}
          {evilPlayers.map((p, i) => (
            <React.Fragment key={p.id}>
              <span className="font-bold text-red-400">{p.name}</span>
              {i < evilPlayers.length - 1 ? '، ' : ''}
            </React.Fragment>
          ))}
          {' '}😈.
        </>
      );
    },
    image: '/avalon-online/images/Merlin.png',
  },
  [Role.Percival]: {
    name: Role.Percival,
    team: Team.Good,
    description: 'شما پرسیوال 🛡️ هستید. شما مرلین و مورگانا را می‌بینید، اما نمی‌دانید کدام یک کیست. وظیفه شما محافظت از مرلین واقعی است.',
    knowledge: (players) => {
      const targets = players
        .filter(p => p.role === Role.Merlin || p.role === Role.Morgana)
        .map(p => p.name)
        .sort(() => Math.random() - 0.5);
       if (targets.length < 2) {
        return 'مرلین یا مورگانا در بازی نیستند، شما کسی را نمی‌بینید.';
       }
      return (
        <>
          شما <span className="font-bold text-yellow-300">{targets[0]}</span> و <span className="font-bold text-yellow-300">{targets[1]}</span> را می‌بینید.
          <br/>
          یکی از آنها مرلین 🧙‍♂️ و دیگری مورگانا 🔮 است.
        </>
      );
    },
    image: '/avalon-online/images/Percival.png',
  },
  [Role.LoyalServant]: {
    name: Role.LoyalServant,
    team: Team.Good,
    description: 'شما یک خدمتگزار وفادار آرتور 😇 هستید. شما هیچ اطلاعات خاصی ندارید، اما برای پیروزی نیکی تلاش می‌کنید.',
    knowledge: () => 'شما هیچ اطلاعاتی ندارید. به حس خود و دیگران اعتماد کنید. 🤞',
    image: '/avalon-online/images/Loyal_Servant_of_Arthur.png',
  },
    [Role.Tristan]: {
    name: Role.Tristan,
    team: Team.Good,
    description: 'شما تریستان 💑 هستید. شما و ایزولت یکدیگر را می‌شناسید. هر دوی شما در تیم نیکان هستید.',
    knowledge: (players) => {
        const isolde = players.find(p => p.role === Role.Isolde);
        return isolde ? <>شما <span className="font-bold text-blue-300">{isolde.name}</span> (ایزولت) را می‌شناسید. با هم برای پیروزی نیکان تلاش کنید.</> : 'شما کسی را نمی‌شناسید.';
    },
    image: '/avalon-online/images/Tristan.png',
  },
  [Role.Isolde]: {
    name: Role.Isolde,
    team: Team.Good,
    description: 'شما ایزولت 💑 هستید. شما و تریستان یکدیگر را می‌شناسید. هر دوی شما در تیم نیکان هستید.',
    knowledge: (players) => {
        const tristan = players.find(p => p.role === Role.Tristan);
        return tristan ? <>شما <span className="font-bold text-blue-300">{tristan.name}</span> (تریستان) را می‌شناسید. با هم برای پیروزی نیکان تلاش کنید.</> : 'شما کسی را نمی‌شناسید.';
    },
    image: '/avalon-online/images/Isolde.png',
  },
  [Role.Morgana]: {
    name: Role.Morgana,
    team: Team.Evil,
    description: 'شما مورگانا 🔮 هستید. شما به عنوان مرلین به پرسیوال ظاهر می‌شوید تا او را فریب دهید. دیگر افراد شرور شما را می‌شناسند.',
    knowledge: (players, self) => <EvilTeammates players={players} self={self} />,
    image: '/avalon-online/images/Morgana.png',
  },
  [Role.Assassin]: {
    name: Role.Assassin,
    team: Team.Evil,
    description: 'شما آدمکش 🗡️ هستید. اگر نیکان سه ماموریت را با موفقیت انجام دهند، شما فرصت دارید با حدس زدن هویت مرلین، بازی را به نفع شروران تمام کنید.',
    knowledge: (players, self) => <EvilTeammates players={players} self={self} />,
    image: '/avalon-online/images/Assassin.png',
  },
  [Role.Mordred]: {
    name: Role.Mordred,
    team: Team.Evil,
    description: 'شما موردرد 🎭 هستید. مرلین هویت شما را نمی‌داند. این به شما اجازه می‌دهد تا آزادانه در میان نیکان عمل کنید.',
    knowledge: (players, self) => <EvilTeammates players={players} self={self} />,
    image: '/avalon-online/images/Mordred.png',
  },
  [Role.Oberon]: {
    name: Role.Oberon,
    team: Team.Evil,
    description: 'شما اوبرون 😶 هستید. شما در تیم شروران هستید، اما هویت شما برای سایر شروران (و بالعکس) فاش نمی‌شود. مرلین شما را می‌شناسد.',
    knowledge: () => 'شما هیچ‌کس را نمی‌شناسید و هیچ‌کس شما را نمی‌شناسد. در تاریکی عمل کنید.',
    image: '/avalon-online/images/Oberon.png',
  },
};

export const ROLE_CONFIGURATIONS: { [key: number]: { good: Role[], evil: Role[] } } = {
  5: { good: [Role.Merlin, Role.Percival, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin] },
  6: { good: [Role.Merlin, Role.Percival, Role.LoyalServant, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin] },
  7: { good: [Role.Merlin, Role.Percival, Role.LoyalServant, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin, Role.Mordred] },
  8: { good: [Role.Merlin, Role.Percival, Role.Tristan, Role.Isolde, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin, Role.Oberon] },
  9: { good: [Role.Merlin, Role.Percival, Role.Tristan, Role.Isolde, Role.LoyalServant, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin, Role.Mordred] },
  10: { good: [Role.Merlin, Role.Percival, Role.Tristan, Role.Isolde, Role.LoyalServant, Role.LoyalServant], evil: [Role.Morgana, Role.Assassin, Role.Mordred, Role.Oberon] },
};

export const QUEST_RULES: { [key: number]: { teamSizes: number[], failsRequired: number[] } } = {
  5: { teamSizes: [2, 3, 2, 3, 3], failsRequired: [1, 1, 1, 1, 1] },
  6: { teamSizes: [2, 3, 4, 3, 4], failsRequired: [1, 1, 1, 1, 1] },
  7: { teamSizes: [2, 3, 3, 4, 4], failsRequired: [1, 1, 1, 2, 1] },
  8: { teamSizes: [3, 4, 4, 5, 5], failsRequired: [1, 1, 1, 2, 1] },
  9: { teamSizes: [3, 4, 4, 5, 5], failsRequired: [1, 1, 1, 2, 1] },
  10: { teamSizes: [3, 4, 4, 5, 5], failsRequired: [1, 1, 1, 2, 1] },
};

export const STRINGS_FA = {
  passTo: "گوشی را به {player} بدهید",
  tapToReveal: "برای دیدن نقش خود ضربه بزنید",
  passToNext: "گوشی را به نفر بعدی بدهید",
  cooldown: "آماده سازی برای بازیکن بعدی...",
  approve: "قبول",
  reject: "رد",
  success: "موفقیت",
  fail: "شکست",
};

export const CrownIcon = (
    <span role="img" aria-label="Leader" className="text-2xl">👑</span>
);