import React, { useState } from 'react';
import { RepeatIcon, RefreshIcon } from './icons/Icons';
import { Card, CardContent } from './ui/Card';

const presets = [
    { label: "Subhanallah", target: 33 },
    { label: "Alhamdulillah", target: 33 },
    { label: "Allahu Akbar", target: 33 },
    { label: "La ilaha illallah", target: 100 },
];

export const TasbihDigital: React.FC = () => {
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    const [activePreset, setActivePreset] = useState("Subhanallah");
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    const handleIncrement = (event: React.MouseEvent<HTMLDivElement>) => {
        setCount(prev => prev + 1);
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        const rect = event.currentTarget.getBoundingClientRect();
        const newRipple = {
            id: Date.now(),
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        setRipples(prevRipples => [...prevRipples, newRipple]);
    };

    const handleReset = () => {
        setCount(0);
    };

    const handlePresetChange = (label: string, newTarget: number) => {
        setActivePreset(label);
        setTarget(newTarget);
        setCount(0);
    };
    
    const progressPercentage = Math.min((count / target) * 100, 100);

    return (
        <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
                    <RepeatIcon className="w-8 h-8" />
                    Tasbih Digital
                </h2>
                <p className="text-foreground/80">Mulakan zikir anda di mana sahaja.</p>
            </div>

            <Card className="mb-6 overflow-hidden">
                <CardContent className="p-6">
                    <div 
                        className="relative w-64 h-64 mx-auto rounded-full flex items-center justify-center cursor-pointer select-none bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden"
                        onClick={handleIncrement}
                    >
                        {ripples.map(ripple => (
                            <span
                                key={ripple.id}
                                className="absolute bg-primary/30 rounded-full animate-ripple"
                                style={{ left: ripple.x, top: ripple.y, width: 0, height: 0 }}
                                onAnimationEnd={() => setRipples(r => r.filter(item => item.id !== ripple.id))}
                            />
                        ))}
                         <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-white/10" strokeWidth="5" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle
                                className="text-primary"
                                strokeWidth="5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="45"
                                cx="50"
                                cy="50"
                                style={{
                                    strokeDasharray: 2 * Math.PI * 45,
                                    strokeDashoffset: (2 * Math.PI * 45) * (1 - progressPercentage / 100),
                                    transition: 'stroke-dashoffset 0.3s ease',
                                    transform: 'rotate(-90deg)',
                                    transformOrigin: '50% 50%',
                                    filter: 'drop-shadow(0 0 5px hsl(var(--primary)))'
                                }}
                            />
                        </svg>
                        <div className="text-center z-10">
                            <p className="text-6xl font-bold">{count}</p>
                            <p className="text-foreground/70">/ {target}</p>
                        </div>
                    </div>
                     <button onClick={handleReset} className="mt-6 flex items-center gap-2 mx-auto text-sm font-semibold text-foreground/80 hover:text-primary">
                        <RefreshIcon className="w-4 h-4" /> Set Semula
                    </button>
                </CardContent>
            </Card>

            <div>
                <h3 className="font-semibold mb-3">Pilih Zikir:</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {presets.map(p => (
                        <button 
                            key={p.label}
                            onClick={() => handlePresetChange(p.label, p.target)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-colors backdrop-blur-sm border border-white/20 ${activePreset === p.label ? 'bg-primary text-primary-foreground' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TasbihDigital;
