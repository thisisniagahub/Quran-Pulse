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
    common: 'bg-gray-300',
    rare: 'bg-blue-400',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-400'
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
        <div className="bg-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCartIcon className="w-8 h-8 text-primary" />
                Kedai Permata
              </h1>
              <p className="text-foreground/80 mt-1">Belanja permata anda untuk power-ups dan kosmetik!</p>
            </div>
            <div className="bg-primary px-6 py-3 rounded-2xl border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))]">
              <div className="flex items-center gap-2">
                <GemIcon className="w-6 h-6 text-primary-foreground" />
                <span className="text-2xl font-bold text-primary-foreground">{gems}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all border-2 border-border shadow-[2px_2px_0px_hsl(var(--border))] active:shadow-none active:translate-y-px ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-foreground/10'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`bg-card rounded-2xl border-2 border-border overflow-hidden`}
            >
              <div className={`${rarityColors[item.rarity]} py-1 text-center border-b-2 border-border`}>
                <span className="text-black text-xs font-bold uppercase tracking-wider">
                  {item.rarity}
                </span>
              </div>

              <div className="p-6">
                <div className={`${rarityColors[item.rarity]} p-4 rounded-xl inline-block mb-4 border-2 border-border`}>
                  <div className="text-black">
                    {item.icon}
                  </div>
                </div>

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
                    className={`px-6 py-2 rounded-xl font-bold transition-all border-2 border-border shadow-[2px_2px_0px_hsl(var(--border))] active:shadow-none active:translate-y-px ${
                      gems >= item.price
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {gems >= item.price ? 'Beli' : 'Tidak Cukup'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-primary rounded-2xl p-8 text-center border-2 border-border shadow-[4px_4px_0px_hsl(var(--border))]">
          <GemIcon className="w-16 h-16 text-primary-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">Perlukan Lebih Permata?</h2>
          <p className="text-primary-foreground/90 mb-6">
            Dapatkan permata dengan menyiapkan cabaran, capai pencapaian, atau beli terus!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3 bg-accent text-black rounded-xl font-bold hover:bg-yellow-300 transition-colors border-2 border-border shadow-[2px_2px_0px_hsl(var(--border))] active:shadow-none active:translate-y-px"
            >
              Beli Pek Permata
            </button>
          </div>
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
