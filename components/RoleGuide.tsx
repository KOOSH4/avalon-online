import React, { useState } from 'react';
import { ROLE_CONFIGURATIONS } from '../constants';
import { Role } from '../types';

interface RoleGuideProps {
  onClose: () => void;
}

const ROLE_GUIDE_CONTENT = {
    [Role.Merlin]: {
        name: "مرلین 🧙‍♂️",
        ability: "تمام افراد تیم شر را می‌شناسد (به جز موردرد).",
        strategy: "وظیفه شما هدایت تیم نیک به سمت پیروزی است، اما بدون اینکه هویت‌تان فاش شود. با رأی‌های خود به تیم‌های خوب و بد، به یاران‌تان سرنخ بدهید. از حرف زدن مستقیم خودداری کنید. به یاد داشته باشید، اگر آدمکش شما را پیدا کند، بازنده می‌شوید.",
        question: "چگونه بدون حرف زدن به یارانم کمک کنم؟ با رأی دادن به تیم‌هایی که فقط افراد خوب در آن هستند و رأی مخالف دادن به تیم‌هایی که شرور دارند، می‌توانید پیام خود را برسانید."
    },
    [Role.Percival]: {
        name: "پرسیوال 🛡️",
        ability: "مرلین و مورگانا را می‌بیند ولی نمی‌داند کدام یک کیست.",
        strategy: "شما محافظ مرلین هستید. در ابتدای بازی دو نفر به شما نشان داده می‌شوند. یکی مرلین و دیگری مورگانا است. به رفتار این دو نفر در طول بازی دقت کنید. مرلین سعی می‌کند محتاطانه تیم را راهنمایی کند، در حالی که مورگانا تلاش می‌کند پرسیوال را گمراه کند.",
        question: "اگر هر دو نفری که می‌بینم ادعای مرلین بودن کردند چه کنم؟ به رأی‌ها و صحبت‌هایشان دقت کنید. معمولاً مرلین واقعی منطقی‌تر عمل می‌کند."
    },
    [Role.Tristan]: {
        name: "تریستان 💑",
        ability: "ایزولت را در ابتدای بازی می‌شناسد.",
        strategy: "شما بازی را با یک یار کاملاً قابل اعتماد شروع می‌کنید. این یک مزیت بزرگ است. با هماهنگی کامل با ایزولت، می‌توانید به شناسایی افراد شرور و حمایت از مرلین کمک کنید. می‌توانید تصمیم بگیرید که رابطه‌تان را فاش کنید یا مخفی نگه دارید تا در لحظه مناسب از آن استفاده کنید.",
        question: "آیا باید به همه بگویم که تریستان هستم؟ این یک تصمیم استراتژیک است. فاش کردن هویت‌تان می‌تواند به تیم نیک کمک کند اما شما را به هدف‌های احتمالی برای تیم شر تبدیل می‌کند."
    },
    [Role.Isolde]: {
        name: "ایزولت 💑",
        ability: "تریستان را در ابتدای بازی می‌شناسد.",
        strategy: "شما بازی را با یک یار کاملاً قابل اعتماد شروع می‌کنید. این یک مزیت بزرگ است. با هماهنگی کامل با تریستان، می‌توانید به شناسایی افراد شرور و حمایت از مرلین کمک کنید. می‌توانید تصمیم بگیرید که رابطه‌تان را فاش کنید یا مخفی نگه دارید تا در لحظه مناسب از آن استفاده کنید.",
        question: "آیا باید به همه بگویم که ایزولت هستم؟ این یک تصمیم استراتژیک است. فاش کردن هویت‌تان می‌تواند به تیم نیک کمک کند اما شما را به هدف‌های احتمالی برای تیم شر تبدیل می‌کند."
    },
    [Role.LoyalServant]: {
        name: "خدمتگزار وفادار آرتور 😇",
        ability: "هیچ قابلیت ویژه‌ای ندارد.",
        strategy: "شما چشم و گوش تیم نیک هستید. چون اطلاعاتی ندارید، باید با دقت به رأی‌گیری‌ها، ترکیب تیم‌ها و نتایج ماموریت‌ها نگاه کنید. قدرت شما در رأی‌تان و تشخیص تناقض در رفتار دیگران است. به حس خود اعتماد کنید.",
        question: "من که اطلاعاتی ندارم، چگونه مفید باشم؟ تحلیل رفتار بازیکنان کلید موفقیت شماست. ببینید چه کسی به تیم‌های مشکوک رأی مثبت می‌دهد یا چه کسی در ماموریت‌های شکست‌خورده حضور داشته."
    },
    [Role.Morgana]: {
        name: "مورگانا 🔮",
        ability: "برای پرسیوال به شکل مرلین ظاهر می‌شود و دیگر شروران را می‌شناسد.",
        strategy: "وظیفه اصلی شما فریب دادن پرسیوال است. سعی کنید مثل مرلین رفتار کنید: با اعتماد به نفس، آرام و راهنما. اگر بتوانید اعتماد پرسیوال را جلب کنید، او از یک مهره قدرتمند برای تیم نیک، به یک مشکل برای آنها تبدیل می‌شود.",
        question: "چگونه پرسیوال را بهتر فریب دهم؟ سعی کنید در پیشنهاد تیم‌ها منطقی عمل کنید و گاهی حتی به تیم‌های خوب رأی مثبت دهید تا اعتماد جلب کنید."
    },
    [Role.Assassin]: {
        name: "آدمکش 🗡️",
        ability: "اگر تیم نیک ۳ ماموریت را ببرد، او با حدس زدن مرلین می‌تواند تیم شر را برنده کند.",
        strategy: "تمام تمرکز شما باید روی پیدا کردن مرلین باشد. به دنبال بازیکنی بگردید که به نظر می‌رسد اطلاعات زیادی دارد و تیم را هدایت می‌کند. گاهی لازم است برای جلب اعتماد، به یک ماموریت رأی موفقیت بدهید.",
        question: "آیا همیشه باید ماموریت‌ها را خراب کنم؟ خیر. گاهی بهتر است یک ماموریت موفق شود تا شما به عنوان یک نیروی خوب شناخته شوید و در تیم‌های بعدی قرار بگیرید و در لحظه حساس ضربه بزنید."
    },
    [Role.Mordred]: {
        name: "موردرد 🎭",
        ability: "مرلین او را نمی‌شناسد. دیگر شروران را می‌شناسد.",
        strategy: "شما برگ برنده تیم شر هستید. چون مرلین شما را نمی‌شناسد، می‌توانید به راحتی اعتماد تیم نیک را جلب کنید. خود را یک خدمتگزار وفادار جا بزنید، در تیم‌ها نفوذ کنید و در مهم‌ترین ماموریت‌ها، کارت شکست بازی کنید.",
        question: "آیا باید خیلی فعال باشم یا ساکت؟ بهتر است تعادل را حفظ کنید. یک بازیکن خوب و فعال به نظر برسید تا کسی به شما شک نکند."
    },
    [Role.Oberon]: {
        name: "اوبرون 😶",
        ability: "تیم شر را نمی‌شناسد و آنها هم او را نمی‌شناسند.",
        strategy: "شما یک گرگ تنها هستید. باید خودتان هم‌تیمی‌های شرورتان را پیدا کنید. به رأی‌ها دقت کنید تا بفهمید چه کسانی مثل شما فکر می‌کنند. کار شما سخت است، چون یاران‌تان هم شما را نمی‌شناسند و ممکن است به شما شک کنند.",
        question: "چگونه بدون اینکه شناسایی شوم، به تیم شر کمک کنم؟ بهترین راه این است که وقتی در یک ماموریت قرار گرفتید، آن را خراب کنید. این واضح‌ترین پیام برای هم‌تیمی‌های شماست."
    }
};

const RoleGuide: React.FC<RoleGuideProps> = ({ onClose }) => {
  const [playerCount, setPlayerCount] = useState<number>(5);

  const rolesConfig = ROLE_CONFIGURATIONS[playerCount];
  const uniqueGoodRoles = [...new Set(rolesConfig.good)];
  const uniqueEvilRoles = [...new Set(rolesConfig.evil)];

  return (
    <div className="w-full h-full flex flex-col text-right">
      <div className="flex-shrink-0 flex items-center border-b border-gray-600 mb-4 pb-2">
        <h2 className="text-xl font-bold text-yellow-400">راهنمای نقش‌ها</h2>
        <button onClick={onClose} className="mr-auto text-gray-400 hover:text-white pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-shrink-0 w-full max-w-sm mx-auto mb-4">
        <label htmlFor="player-count-guide" className="block mb-2 text-base text-center text-yellow-300">نمایش راهنما برای بازی:</label>
        <select
          id="player-count-guide"
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {[...Array(6)].map((_, i) => (
            <option key={i + 5} value={i + 5}>{i + 5} نفره</option>
          ))}
        </select>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        <RoleSection title="تیم نیکان 😇" color="text-blue-400">
            {uniqueGoodRoles.map(role => {
                const content = ROLE_GUIDE_CONTENT[role];
                return content ? <RoleCard key={role} {...content} /> : null;
            })}
        </RoleSection>
        
        <RoleSection title="تیم شروران 😈" color="text-red-400">
            {uniqueEvilRoles.map(role => {
                const content = ROLE_GUIDE_CONTENT[role];
                return content ? <RoleCard key={role} {...content} /> : null;
            })}
        </RoleSection>
      </div>
    </div>
  );
};

const RoleSection: React.FC<{ title: string, color: string, children: React.ReactNode }> = ({ title, color, children }) => (
    <div>
        <h3 className={`text-xl font-bold ${color} mb-3 pb-1 border-b-2 border-yellow-500/30`}>{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const RoleCard: React.FC<{name: string, ability: string, strategy: string, question: string}> = ({name, ability, strategy, question}) => (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
        <h4 className="text-lg font-bold text-yellow-300 mb-2">{name}</h4>
        <p className="text-gray-300"><span className="font-semibold text-gray-200">قابلیت: </span>{ability}</p>
        <p className="text-gray-300 mt-2"><span className="font-semibold text-gray-200">استراتژی: </span>{strategy}</p>
        <p className="text-gray-300 mt-2 italic bg-black/20 p-2 rounded"><span className="font-semibold text-gray-200">سوال کلیدی: </span>{question}</p>
    </div>
)


export default RoleGuide;