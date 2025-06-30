
import React, { useState, useCallback } from 'react';

interface PlayerSetupProps {
  onSetupComplete: (playerCount: number, playerNames: string[]) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onSetupComplete }) => {
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(5).fill(''));
  const [error, setError] = useState<string>('');

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(''));
    setError('');
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = useCallback(() => {
    const trimmedNames = playerNames.map(name => name.trim());
    if (trimmedNames.some(name => name === '')) {
      setError('لطفاً نام تمام بازیکنان را وارد کنید.');
      return;
    }
    const uniqueNames = new Set(trimmedNames);
    if (uniqueNames.size !== trimmedNames.length) {
      setError('نام بازیکنان باید منحصر به فرد باشد.');
      return;
    }
    setError('');
    onSetupComplete(playerCount, trimmedNames);
  }, [playerCount, playerNames, onSetupComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">تنظیمات بازی</h2>
      <div className="w-full max-w-sm">
        <label htmlFor="player-count" className="block mb-2 text-lg">تعداد بازیکنان:</label>
        <select
          id="player-count"
          value={playerCount}
          onChange={handlePlayerCountChange}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {[...Array(6)].map((_, i) => (
            <option key={i + 5} value={i + 5}>{i + 5}</option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-sm mt-6">
        <h3 className="text-lg mb-2">نام بازیکنان:</h3>
        <div className="space-y-3">
          {playerNames.map((name, index) => (
            <input
              key={index}
              type="text"
              placeholder={`بازیکن ${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      <button
        onClick={handleSubmit}
        className="mt-8 w-full max-w-sm bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
      >
        شروع بازی
      </button>
    </div>
  );
};

export default PlayerSetup;