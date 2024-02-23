import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CameraContextType {
    isCameraOpen: boolean;
    cameraKey: number;
    openCamera: () => void;
    closeCamera: () => void;
}

const CameraContext = createContext<CameraContextType | null>(null);

interface CameraProviderProps {
    children: ReactNode;
}

export const useCamera = () => {
    const context = useContext(CameraContext);
    if (context === null) {
        throw new Error('useCamera must be used within a CameraProvider');
    }
    return context;
};

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraKey, setCameraKey] = useState(0);

    const openCamera = () => {
        setIsCameraOpen(true);
        setCameraKey(cameraKey + 1);
    };

    const closeCamera = () => setIsCameraOpen(false);

    return (
        <CameraContext.Provider value={{ isCameraOpen, cameraKey, openCamera, closeCamera }}>
            {children}
        </CameraContext.Provider>
    );
};