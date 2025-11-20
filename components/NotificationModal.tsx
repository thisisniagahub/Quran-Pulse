import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { XIcon } from './icons/Icons';
import type { NotificationSetting } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (setting: NotificationSetting) => void;
  onDelete: () => void;
  prayerName: string;
  prayerTime: string;
  initialSetting?: NotificationSetting;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  prayerName,
  prayerTime,
  initialSetting,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialSetting?.phoneNumber || '');
  const [offset, setOffset] = useState(initialSetting?.offset || 0);

  useEffect(() => {
    setPhoneNumber(initialSetting?.phoneNumber || '');
    setOffset(initialSetting?.offset || 0);
  }, [initialSetting]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!phoneNumber.startsWith('+') || phoneNumber.length < 10) {
      alert('Sila masukkan nombor telefon yang sah, bermula dengan kod negara (cth: +60123456789).');
      return;
    }
    onSave({ phoneNumber, offset, active: true });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Peringatan untuk {prayerName} ({prayerTime})
            <Button variant="ghost" size="icon" onClick={onClose}><XIcon /></Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Nombor WhatsApp</label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+60123456789"
              className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="offset" className="block text-sm font-medium mb-1">Masa Peringatan</label>
            <select
              id="offset"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-border bg-background"
            >
              <option value="0">Pada Waktu Solat</option>
              <option value="-5">5 Minit Sebelum</option>
              <option value="-10">10 Minit Sebelum</option>
              <option value="-15">15 Minit Sebelum</option>
            </select>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs p-3 rounded-lg">
            <strong>Penting:</strong> Tab pelayar ini mesti sentiasa dibuka untuk pemberitahuan berfungsi. Ciri ini adalah eksperimental.
          </div>
          <div className="flex justify-between gap-2 pt-4">
            {initialSetting?.active && (
              <Button variant="destructive" onClick={onDelete}>Padam</Button>
            )}
            <Button onClick={handleSave} className="flex-1">Simpan Peringatan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};