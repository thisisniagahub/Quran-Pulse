
import React, { useState, useEffect, useCallback } from 'react';
import { CompassIcon, CameraIcon } from './icons/Icons';

export const QiblaCompass: React.FC = () => {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [compassHeading, setCompassHeading] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [needsPermission, setNeedsPermission] = useState(false);

    const calculateQiblaDirection = (latitude: number, longitude: number) => {
        const kaabaLat = 21.4225;
        const kaabaLon = 39.8262;
        
        const latRad = latitude * Math.PI / 180;
        const lonRad = longitude * Math.PI / 180;
        const kaabaLatRad = kaabaLat * Math.PI / 180;
        const kaabaLonRad = kaabaLon * Math.PI / 180;

        const lonDiff = kaabaLonRad - lonRad;

        const y = Math.sin(lonDiff) * Math.cos(kaabaLatRad);
        const x = Math.cos(latRad) * Math.sin(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(lonDiff);
        
        let direction = Math.atan2(y, x) * 180 / Math.PI;
        direction = (direction + 360) % 360;

        setQiblaDirection(direction);
    };

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        let heading = event.alpha;
        // For iOS Safari
        if (typeof (event as any).webkitCompassHeading !== 'undefined') {
            heading = (event as any).webkitCompassHeading;
        }
        
        if (heading !== null) {
            setCompassHeading(heading);
        }
    }, []);

    const requestPermissions = async () => {
        // iOS 13+ device orientation permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    setNeedsPermission(false);
                } else {
                    setError("Kebenaran untuk mengakses orientasi peranti diperlukan.");
                }
            } catch (err) {
                 setError("Gagal meminta kebenaran orientasi peranti.");
            }
        }
    }
    
    useEffect(() => {
        // Geolocation
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    calculateQiblaDirection(position.coords.latitude, position.coords.longitude);
                    
                    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                        setNeedsPermission(true);
                    } else {
                        window.addEventListener('deviceorientation', handleOrientation, true);
                    }
                },
                (err) => {
                    setError(`Tidak dapat mengakses lokasi anda: ${err.message}. Sila pastikan GPS diaktifkan.`);
                }
            );
        } else {
            setError("Geolokasi tidak disokong oleh pelayar ini.");
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation, true);
        };
    }, [handleOrientation]);

    if (error) {
        return (
            <div className="max-w-sm mx-auto text-center p-4 bg-primary/20 text-primary rounded-lg">
                <p className="font-semibold">Ralat</p>
                <p>{error}</p>
            </div>
        );
    }
    
    if (needsPermission) {
         return (
             <div className="max-w-sm mx-auto text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">Kebenaran Diperlukan</h2>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80 mb-8">Aplikasi ini memerlukan akses kepada sensor pergerakan peranti anda untuk memaparkan kompas.</p>
                <button
                    onClick={requestPermissions}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                    Benarkan Akses
                </button>
            </div>
         )
    }

    if (qiblaDirection === null) {
        return (
            <div className="flex flex-col justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                <p className="mt-4">Mendapatkan lokasi anda...</p>
            </div>
        );
    }

    const compassRotation = 360 - compassHeading;
    const pointerRotation = compassRotation + qiblaDirection;

    return (
        <div className="max-w-sm mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">Arah Qiblat</h2>
            <p className="text-foreground-light/80 dark:text-foreground-dark/80 mb-8">Sila pastikan telefon anda berada di permukaan rata.</p>

            <div className="relative w-64 h-64 mx-auto mb-8">
                <div 
                    className="w-full h-full bg-background-light dark:bg-background-dark rounded-full transition-transform duration-200 ease-linear border-2 border-border-light dark:border-border-dark"
                    style={{ transform: `rotate(${compassRotation}deg)` }}
                >
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 text-sm font-bold">U</div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-3 text-sm font-bold">S</div>
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 text-sm font-bold">B</div>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 text-sm font-bold">T</div>
                </div>

                <div 
                    className="absolute top-0 left-0 w-full h-full transition-transform duration-200 ease-linear"
                    style={{ transform: `rotate(${pointerRotation}deg)` }}
                >
                    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <CompassIcon className="w-10 h-10 text-primary" />
                    </div>
                </div>
                
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-lg font-semibold">{qiblaDirection.toFixed(2)}° dari Utara</p>
                <p className="text-foreground-light/80 dark:text-foreground-dark/80">Arah Kiblat</p>
            </div>
            
            <div className="mt-12">
                <button className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold hover:bg-primary/20 transition-colors">
                    <CameraIcon />
                    <span>Paparan AR (Akan Datang)</span>
                </button>
            </div>
        </div>
    );
};