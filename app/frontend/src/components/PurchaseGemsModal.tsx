
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { XIcon, GemIcon, CreditCardIcon } from './icons/Icons';
import { Badge } from './ui/Badge';
import { cn } from '../lib/utils';
import { useToast } from '../context/ToastContext';

interface GemPack {
  id: string;
  gems: number;
  price: string;
  bonus?: string;
  isBestValue?: boolean;
}

const gemPacks: GemPack[] = [
  { id: 'pack_1', gems: 100, price: 'RM 4.99' },
  { id: 'pack_2', gems: 550, price: 'RM 24.99', bonus: '+10% Bonus', isBestValue: true },
  { id: 'pack_3', gems: 1200, price: 'RM 49.99', bonus: '+20% Bonus' },
  { id: 'pack_4', gems: 2500, price: 'RM 99.99', bonus: '+25% Bonus' },
];

interface PurchaseGemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (gemAmount: number) => void;
}

export const PurchaseGemsModal: React.FC<PurchaseGemsModalProps> = ({ isOpen, onClose, onPurchaseSuccess }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null); // Store ID of loading pack
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handlePurchase = async (pack: GemPack) => {
    setIsLoading(pack.id);
    setError(null);
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: pack.id, priceString: pack.price }),
      });

      if (!response.ok) {
        throw new Error('Gagal mencipta sesi pembayaran.');
      }

      const data = await response.json();
      console.log('Redirecting to payment gateway:', data.paymentUrl);
      
      // Simulate redirection and successful payment
      setTimeout(() => {
        onPurchaseSuccess(pack.gems);
        setIsLoading(null);
        onClose();
        addToast({
          type: 'success',
          title: 'Pembelian Berjaya!',
          description: `${pack.gems} permata telah ditambah ke akaun anda.`
        });
      }, 2000);

    } catch (err) {
      console.error(err);
      const errorMessage = 'Gagal memulakan pembayaran. Sila cuba lagi.';
      setError(errorMessage);
      addToast({ type: 'error', title: 'Ralat Pembayaran', description: errorMessage });
      setIsLoading(null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <Card
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CreditCardIcon className="w-6 h-6 text-primary" />
            Beli Pek Permata
          </CardTitle>
          <Button onClick={onClose} variant="ghost" size="icon">
            <XIcon />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-light/80 mb-6">
            Pilih pek untuk menambah baki permata anda. Pembayaran dikendalikan dengan selamat oleh Chip-In.
          </p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="space-y-4">
            {gemPacks.map((pack) => (
              <div
                key={pack.id}
                className={cn(
                  'border-2 rounded-xl p-4 flex items-center gap-4 transition-all',
                  pack.isBestValue ? 'border-accent bg-accent/10' : 'border-border-light dark:border-border-dark'
                )}
              >
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GemIcon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">{pack.gems.toLocaleString()} Permata</h3>
                    {pack.bonus && <Badge variant="secondary">{pack.bonus}</Badge>}
                  </div>
                  <p className="text-sm">{pack.price}</p>
                </div>
                {pack.isBestValue && <Badge variant="pro" className="hidden sm:inline-flex">Nilai Terbaik</Badge>}
                <Button
                  onClick={() => handlePurchase(pack)}
                  disabled={!!isLoading}
                >
                  {isLoading === pack.id ? (
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Memproses...
                    </div>
                  ) : 'Beli'}
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 text-xs text-foreground-light/60">
            <p>Dengan meneruskan, anda bersetuju dengan Terma & Syarat kami.</p>
          </div>
        </CardContent>
      </Card>
      <style>{`
        @keyframes animate-fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: animate-fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
