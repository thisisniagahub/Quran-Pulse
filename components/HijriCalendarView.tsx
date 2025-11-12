import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';

// Correct types for the Aladhan API response
interface ApiHijriDate {
  date: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
}

interface ApiGregorianDate {
  date: string;
  day: string;
  weekday: { en: string };
  month: { number: number; en: string };
  year: string;
}

interface ApiDateInfo {
    gregorian: ApiGregorianDate;
    hijri: ApiHijriDate;
}

interface ApiCalendarDay {
  date: ApiDateInfo;
  // timings and meta properties are ignored as they are not used.
}

export const HijriCalendarView: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [monthData, setMonthData] = useState<ApiCalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthData = async () => {
      setLoading(true);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      try {
        const response = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=3.1390&longitude=101.6869`);
        if (!response.ok) throw new Error('Failed to fetch calendar data');
        const data = await response.json();
        setMonthData(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthData();
  }, [date]);

  const changeMonth = (offset: number) => {
    setDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const firstDayOfMonth = monthData.length > 0 ? new Date(`${monthData[0].date.gregorian.date.split('-').reverse().join('-')}T00:00:00`).getDay() : 0;
  
  const getHijriMonthName = () => {
      if (monthData.length === 0) return '';
      const hijriMonth = monthData[Math.floor(monthData.length / 2)].date.hijri.month.en;
      const hijriYear = monthData[Math.floor(monthData.length / 2)].date.hijri.year;
      return `${hijriMonth} ${hijriYear}`;
  }

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
            <CalendarDaysIcon className="w-8 h-8" />
            Kalendar Hijriyah
            </h2>
            <p className="text-foreground-light/80 dark:text-foreground-dark/80">Rujuk tarikh penting dalam kalendar Islam.</p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-primary/10"><ChevronLeftIcon /></button>
            <div className="text-center">
                <h3 className="text-xl font-bold">{date.toLocaleString('ms-MY', { month: 'long', year: 'numeric' })}</h3>
                <p className="text-sm text-foreground-light/80">{getHijriMonthName()}</p>
            </div>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-primary/10"><ChevronRightIcon /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm mb-2">
            {['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'].map(day => <div key={day}>{day}</div>)}
          </div>

          {loading ? (
            <div className="text-center p-8">Memuatkan kalendar...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border border-transparent"></div>)}
              {monthData.map(day => {
                const isToday = new Date().toDateString() === new Date(`${day.date.gregorian.date.split('-').reverse().join('-')}T00:00:00`).toDateString();
                return (
                  <div key={day.date.gregorian.date} className={`aspect-square border border-border-light dark:border-border-dark rounded-md p-2 flex flex-col justify-between ${isToday ? 'bg-primary text-white' : ''}`}>
                    <span className={`font-bold ${isToday ? 'text-white' : 'text-primary'}`}>{day.date.hijri.day}</span>
                    <span className={`text-sm self-end ${isToday ? 'text-white/80' : 'text-foreground-light/70'}`}>{day.date.gregorian.day}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HijriCalendarView;