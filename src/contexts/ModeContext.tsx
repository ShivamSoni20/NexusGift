"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppMode = 'DEMO' | 'PRODUCTION';

interface ModeContextType {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    canUseProduction: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<AppMode>('DEMO');
    const [canUseProduction, setCanUseProduction] = useState(false);

    useEffect(() => {
        // Check if production mode is available
        const hasStarpayKey = !!process.env.NEXT_PUBLIC_STARPAY_API_KEY;
        const hasShadowWireConfig = !!process.env.NEXT_PUBLIC_SHADOWWIRE_ENABLED;

        setCanUseProduction(hasStarpayKey || hasShadowWireConfig);

        // Load saved mode preference
        const savedMode = localStorage.getItem('nexusgift_mode') as AppMode;
        if (savedMode && (savedMode === 'DEMO' || (savedMode === 'PRODUCTION' && canUseProduction))) {
            setModeState(savedMode);
        }
    }, [canUseProduction]);

    const setMode = (newMode: AppMode) => {
        if (newMode === 'PRODUCTION' && !canUseProduction) {
            console.warn('Production mode not available. Missing API keys or configuration.');
            return;
        }
        setModeState(newMode);
        localStorage.setItem('nexusgift_mode', newMode);
    };

    return (
        <ModeContext.Provider value={{ mode, setMode, canUseProduction }}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMode() {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error('useMode must be used within ModeProvider');
    }
    return context;
}
