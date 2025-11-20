
import React, { useState } from 'react';
import { ShoppingCartIcon, GemIcon, ShieldIcon, ZapIcon, ClockIcon, HeartIcon, SparklesIcon, CrownIcon, PaletteIcon, StarIcon } from './icons/Icons';
import { PurchaseGemsModal } from './PurchaseGemsModal';
import { useToast } from '../context/ToastContext';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'powerup' | 'cosmetic' | 'utility';
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned?: boolean;
}

const GemShop: React.FC = () => {
  const [gems, setGems] = useState(450);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleAddGems = (amount: number) => {
    setGems(prevGems => prevGems + amount);
  };

  const shopItems: ShopItem[] = [
    // Power-ups
    {
      id: 'streak-freeze',
      name: 'Streak Freeze',
      description: 'Lindungi streak anda untuk 1 hari',
      price: 100,
      category: 'powerup',
      icon: <ShieldIcon className="w-6 h-6" />,
      rarity: 'common'
    },
    {
      id: 'xp-boost',
      name: 'XP Boost 2x',
      description: 'Double XP untuk 1 jam',
      price: 50,
      category: 'powerup',
      icon: <ZapIcon className="w-6 h-6" />,
      rarity: 'common'
    },
    {
      id: 'heart-refill',
      name: 'Heart Refill',
      description: 'Isi semula semua nyawa',
      price: 30,
      category: 'powerup',
      icon: <HeartIcon className="w-6 h-6" />,
      rarity: 'common'
    },
    {
      id: 'timer-freeze',
      name: 'Timer Freeze',
      description: 'Tiada had masa untuk ujian',
      price: 40,
      category: 'powerup',
      icon: <ClockIcon className="w-6 h-6" />,
      rarity: 'rare'
    },
    
    // Cosmetics
    {
      id: 'golden-mushaf',
      name: 'Golden Mushaf Theme',
      description: 'Tema eksklusif warna emas',
      price: 200,
      category: 'cosmetic',
      icon: <PaletteIcon className="w-6 h-6" />,
      rarity: 'epic'
    },
    {
      id: 'ramadan-badge',
      name: 'Ramadan Champion Badge',
      description: 'Badge istimewa Ramadan',
      price: 300,
      category: 'cosmetic',
      icon: <StarIcon className="w-6 h-6" />,
      rarity: 'legendary'
    },
    {
      id: 'sparkle-effect',
      name: 'Sparkle Animation',
      description: 'Animasi kilauan pada progres',
      price: 100,
      category: 'cosmetic',
      icon: <SparklesIcon className="w-6 h-6" />,
      rarity: 'rare'
    },
    
    // Utilities
    {
      id: 'pro-monthly',
      name: 'QuranPulse PRO (30 hari)',
      description: 'Akses penuh semua ciri premium',
      price: 500,
      category: 'utility',
      icon: <CrownIcon className="w-6 h-6" />,
      rarity: 'legendary'
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua', icon: '🛍️' },
    { id: 'powerup', name: 'Power-ups', icon: '⚡' },
    { id: 'cosmetic', name: 'Kosmetik', icon: '🎨' },
    { id: 'utility', name: 'Utiliti', icon: '🔧' }
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  const rarityBorders = {
    common: 'border-gray-300 dark:border-gray-600',
    rare: 'border-blue-300 dark:border-blue-600',
    epic: 'border-purple-300 dark:border-purple-600',
    legendary: 'border-yellow-300 dark:border-yellow-600'
  };

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: ShopItem) => {
    if (gems >= item.price) {
      setGems(gems - item.price);
      addToast({
        type: 'success',
        title: 'Pembelian Berjaya!',
        description: `Anda telah membeli ${item.name}.`,
      });
    } else {
      addToast({
        type: 'error',
        title: 'Permata Tidak Cukup',
        description: 'Sila tambah baki permata anda untuk membuat pembelian ini.',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCartIcon className="w-8 h-8 text-primary" />
                Kedai Permata
              </h1>
              <p className="text-foreground/80 mt-1">Belanja permata anda untuk power-ups dan kosmetik!</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <GemIcon className="w-6 h-6 text-white" />
                <span className="text-2xl font-bold text-white">{gems}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-card hover:bg-accent/10'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`bg-card rounded-2xl shadow-sm border-2 ${rarityBorders[item.rarity]} overflow-hidden hover:shadow-lg transition-all hover:scale-105`}
            >
              {/* Rarity Banner */}
              <div className={`bg-gradient-to-r ${rarityColors[item.rarity]} py-1 text-center`}>
                <span className="text-white text-xs font-bold uppercase tracking-wider">
                  {item.rarity}
                </span>
              </div>

              <div className="p-6">
                {/* Icon */}
                <div className={`bg-gradient-to-br ${rarityColors[item.rarity]} p-4 rounded-xl inline-block mb-4`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>

                {/* Details */}
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-sm mb-4 h-10">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <GemIcon className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold">{item.price}</span>
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={gems < item.price}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${
                      gems >= item.price
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {gems >= item.price ? 'Beli' : 'Tidak Cukup'}
                  </button>
                </div>
                {item.owned && (
                  <div className="mt-3 px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-lg text-center text-sm font-semibold">
                    ✓ Dimiliki
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Get More Gems */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-center">
          <GemIcon className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Perlukan Lebih Permata?</h2>
          <p className="text-white/90 mb-6">
            Dapatkan permata dengan menyiapkan cabaran, capai pencapaian, atau beli terus!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Tonton Iklan (+10 Permata)
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3 bg-yellow-400 text-gray-800 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
            >
              Beli Pek Permata
            </button>
          </div>
        </div>

        {/* Daily Chest */}
        <div className="mt-8 bg-card rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🎁 Peti Harian
          </h2>
          <div className="grid grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <div
                key={day}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center ${
                  day <= 5 
                    ? 'bg-green-100 dark:bg-green-500/20 border-2 border-green-300 dark:border-green-500/50' 
                    : 'bg-background border-2 border-border'
                }`}
              >
                <div className="text-2xl mb-1">
                  {day <= 5 ? '✓' : day === 7 ? '👑' : '🎁'}
                </div>
                <div className="text-xs font-bold">Hari {day}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-4">
            Log masuk setiap hari untuk dapat hadiah! Hari ke-7: <span className="font-bold text-yellow-500">50 Permata + Lencana Lagenda</span>
          </p>
        </div>
        
        <PurchaseGemsModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onPurchaseSuccess={handleAddGems}
        />
    </div>
  );
};

export default GemShop;
