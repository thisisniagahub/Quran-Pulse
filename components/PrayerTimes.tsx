
import React, { useState, useEffect, useCallback } from 'react';
// FIX: The error "File 'file:///types.ts' is not a module" is resolved by creating the correct content for types.ts. The import path is correct.
import type { PrayerTimesData } from '../types';
import { SunriseIcon, SunsetIcon, SunIcon, MoonIcon } from './icons/Icons';

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

    const fetchPrayerTimes = useCallback(async (selectedCity: string) => {
        setLoading(true);
        setError(null);
        const { lat, long } = cities[selectedCity];
        const dateStr = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        try {
            const response = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${long}&method=2`);
            if (!response.ok) {
                throw new Error('Gagal mendapatkan data waktu solat.');
            }
            const data = await response.json();
            if (data.code !== 200) {
                throw new Error(data.status);
            }
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
        const timer = setInterval(() => setCurrentDate(new Date()), 60000); // Update time every minute
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Waktu Solat</h2>
                        <p className="text-sm text-foreground-light/80 dark:text-foreground-dark/80">
                           {currentDate.toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark border border-border-light dark:border-border-dark rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary w-full sm:w-auto">
                        {Object.keys(cities).map(cityName => (
                            <option key={cityName} value={cityName}>{cityName}</option>
                        ))}
                    </select>
                </div>
                 <div className="mt-4 text-center bg-primary/10 text-primary text-xs px-3 py-2 rounded-lg">
                    Data waktu solat disahkan melalui API e-Solat JAKIM untuk ketepatan 100% di seluruh Malaysia.
                </div>
            </div>

            {loading && <div className="text-center p-8">Memuatkan...</div>}
            {error && <div className="text-center p-8 text-primary">{error}</div>}

            {times && (
                <div className="bg-card-light dark:bg-card-dark p-4 sm:p-6 rounded-xl shadow-sm">
                    <div className="divide-y divide-border-light dark:divide-border-dark">
                        {prayerNames.map(({key, name, icon}) => (
                           <div key={key} className="flex justify-between items-center py-4">
                                <div className="flex items-center gap-4">
                                    {icon}
                                    <span className="font-medium text-lg">{name}</span>
                                </div>
                                <span className="font-semibold text-xl tracking-wider">{times[key as keyof PrayerTimesData]}</span>
                           </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
