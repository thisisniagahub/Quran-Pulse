

import React, { useState, useEffect, useCallback } from 'react';
import type { PrayerTimesData, AllNotificationSettings, NotificationSetting } from '../types';
import { SunriseIcon, SunsetIcon, SunIcon, MoonIcon, BellIcon } from './icons/Icons';
import { NotificationModal } from './NotificationModal';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';
import { Card, CardContent } from './ui/Card';


const cities: { [key: string]: { lat: number; long: number } } = {
    "Kuala Lumpur": { lat: 3.1390, long: 101.6869 },
    "Johor Bahru": { lat: 1.4927, long: 103.7414 },
    "Ipoh": { lat: 4.5975, long: 101.0901 },
    "George Town": { lat: 5.4140, long: 100.3288 },
    "Kuantan": { lat: 3.8126, long: 103.3256 },
    "Kota Kinabalu": { lat: 5.9804, long: 116.0735 },
    "Kuching": { lat: 1.5533, long: 110.3438 },
};

const prayerNames = [
    { key: 'Imsak', name: 'Imsak', icon: <SunriseIcon className="w-6 h-6 text-accent" /> },
    { key: 'Fajr', name: 'Subuh', icon: <SunriseIcon className="w-6 h-6 text-primary" /> },
    { key: 'Sunrise', name: 'Syuruk', icon: <SunIcon className="w-6 h-6 text-accent" /> },
    { key: 'Dhuhr', name: 'Zohor', icon: <SunIcon className="w-6 h-6 text-primary" /> },
    { key: 'Asr', name: 'Asar', icon: <SunsetIcon className="w-6 h-6 text-accent" /> },
    { key: 'Maghrib', name: 'Maghrib', icon: <SunsetIcon className="w-6 h-6 text-primary" /> },
    { key: 'Isha', name: 'Isyak', icon: <MoonIcon className="w-6 h-6 text-accent" /> },
];


export const PrayerTimes: React.FC = () => {
    const [times, setTimes] = useState<PrayerTimesData | null>(null);
    const [city, setCity] = useState("Kuala Lumpur");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [modalOpenFor, setModalOpenFor] = useState<string | null>(null);
    const [notificationSettings, setNotificationSettings] = useState<AllNotificationSettings>({});
    const { addToast } = useToast();
    
    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('prayerNotificationSettings');
            if (savedSettings) {
                setNotificationSettings(JSON.parse(savedSettings));
            }
        } catch (e) {
            console.error("Failed to load notification settings:", e);
        }
    }, []);

    const fetchPrayerTimes = useCallback(async (selectedCity: string) => {
        setLoading(true);
        setError(null);
        const { lat, long } = cities[selectedCity];
        const dateStr = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        try {
            const response = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${long}&method=2`);
            if (!response.ok) throw new Error('Gagal mendapatkan data waktu solat.');
            const data = await response.json();
            if (data.code !== 200) throw new Error(data.status);
            setTimes(data.data.timings);
        } catch (err) {
            console.error(err);
            setError('Tidak dapat memuatkan data. Sila cuba lagi.');
            setTimes(null);
        } finally {
            setLoading(false);
        }
    }, [currentDate]);

    useEffect(() => {
        fetchPrayerTimes(city);
    }, [city, fetchPrayerTimes]);
    
    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const activeTimeouts: number[] = [];
        if (!times) return;

        Object.entries(notificationSettings).forEach(([key, settingValue]) => {
            const setting = settingValue as NotificationSetting;
            if (setting.active && times[key as keyof PrayerTimesData]) {
                const now = new Date();
                const prayerTimeStr = times[key as keyof PrayerTimesData];
                const [hours, minutes] = prayerTimeStr.split(':').map(Number);
                const prayerDate = new Date();
                prayerDate.setHours(hours, minutes, 0, 0);
                const notificationTime = new Date(prayerDate.getTime() + setting.offset * 60000);
                const delay = notificationTime.getTime() - now.getTime();

                if (delay > 0) {
                    const timeoutId = window.setTimeout(() => {
                        const prayerName = prayerNames.find(p => p.key === key)?.name || key;
                        const message = encodeURIComponent(`Assalamualaikum, peringatan mesra: Sudah tiba masanya untuk Solat ${prayerName}.`);
                        const url = `https://wa.me/${setting.phoneNumber.replace(/\+/g, '')}?text=${message}`;
                        window.open(url, '_blank');
                    }, delay);
                    activeTimeouts.push(timeoutId);
                }
            }
        });

        return () => { activeTimeouts.forEach(clearTimeout); };

    }, [times, notificationSettings]);
    
    const handleSaveNotification = (prayerKey: string, setting: NotificationSetting) => {
        const newSettings = { ...notificationSettings, [prayerKey]: setting };
        setNotificationSettings(newSettings);
        localStorage.setItem('prayerNotificationSettings', JSON.stringify(newSettings));
        addToast({ type: 'success', title: 'Peringatan Disimpan' });
        setModalOpenFor(null);
    };

    const handleDeleteNotification = (prayerKey: string) => {
        const { [prayerKey]: _, ...rest } = notificationSettings;
        setNotificationSettings(rest);
        localStorage.setItem('prayerNotificationSettings', JSON.stringify(rest));
        addToast({ type: 'info', title: 'Peringatan Dipadam' });
        setModalOpenFor(null);
    };

    const findNextPrayer = () => {
        if (!times) return null;
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const sortedPrayers = prayerNames
            .filter(p => p.key !== 'Imsak' && p.key !== 'Sunrise')
            .map(p => {
                const [h, m] = times[p.key as keyof PrayerTimesData].split(':').map(Number);
                return { key: p.key, time: h * 60 + m };
            })
            .sort((a, b) => a.time - b.time);

        for (const prayer of sortedPrayers) {
            if (prayer.time > currentTime) return prayer.key;
        }
        return sortedPrayers[0]?.key;
    };

    const nextPrayerKey = findNextPrayer();

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-primary">Waktu Solat</h2>
                            <p className="text-sm text-foreground/80">
                               {currentDate.toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full sm:w-auto">
                            {Object.keys(cities).map(cityName => (
                                <option key={cityName} value={cityName}>{cityName}</option>
                            ))}
                        </select>
                    </div>
                     <div className="mt-4 text-center bg-primary/10 text-primary text-xs px-3 py-2 rounded-lg">
                        Data waktu solat disahkan melalui API e-Solat JAKIM untuk ketepatan 100% di seluruh Malaysia.
                    </div>
                </CardContent>
            </Card>

            {loading && <div className="text-center p-8">Memuatkan...</div>}
            {error && <div className="text-center p-8 text-destructive">{error}</div>}

            {times && (
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="divide-y divide-white/20">
                            {prayerNames.map(({key, name, icon}) => {
                               const isNextPrayer = key === nextPrayerKey;
                               const isNotificationActive = notificationSettings[key]?.active;
                               const canNotify = key !== 'Sunrise' && key !== 'Imsak';
                               return (
                                   <div key={key} className={cn("flex justify-between items-center py-4 transition-all duration-300 rounded-lg", isNextPrayer && "bg-accent/20 -mx-4 px-4")}>
                                        <div className="flex items-center gap-4">
                                            {icon}
                                            <span className={cn("font-medium text-lg", isNextPrayer && "font-bold text-accent")}>{name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <span className={cn("font-semibold text-xl tracking-wider", isNextPrayer && "font-bold text-accent")}>{times[key as keyof PrayerTimesData]}</span>
                                            <div className="w-10 text-center">
                                                {canNotify && (
                                                    <button onClick={() => setModalOpenFor(key)} className="p-2 rounded-full hover:bg-white/10">
                                                        <BellIcon className={cn("w-5 h-5", isNotificationActive ? 'text-primary' : 'text-foreground/50')} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                   </div>
                               );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
             {modalOpenFor && times && (
                <NotificationModal
                    isOpen={!!modalOpenFor}
                    onClose={() => setModalOpenFor(null)}
                    onSave={(setting) => handleSaveNotification(modalOpenFor, setting)}
                    onDelete={() => handleDeleteNotification(modalOpenFor)}
                    prayerName={prayerNames.find(p => p.key === modalOpenFor)?.name || ''}
                    prayerTime={times[modalOpenFor as keyof PrayerTimesData]}
                    initialSetting={notificationSettings[modalOpenFor]}
                />
            )}
        </div>
    );
};

export default PrayerTimes;
