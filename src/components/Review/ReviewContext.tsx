import { add } from 'ionicons/icons';
import React, { useCallback, createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { set } from 'react-hook-form';

interface ReviewContextType {
    userInput: Record<string, string>;
    images: Record<string, string>;
    driveThruSelection: string;
    storeNumber: string;
    setDriveThruSelection: (selection: string) => void;
    addUserInput: (questionId: string, answer: string) => void;
    addImage: (questionId: string, image: string) => void;
    setStoreNumber: (storeNumber: string) => void;
    reset: () => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

interface ReviewProviderProps {
    children: ReactNode;
}

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReview must be used within a ReviewProvider');
    }
    return context;
};

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
    const [userInput, setUserInput] = useState<Record<string, string>>({});
    const [images, setImages] = useState<Record<string, string>>({});
    const [driveThruSelection, setDriveThruSelection] = useState('');
    const [storeNumber, setStoreNumber] = useState('');

    const addUserInput = (questionId: string, answer: string) => {
        setUserInput((prevInput) => ({
            ...prevInput,
            [questionId]: answer,
        }));
    };

    const addImage = useCallback((questionId: string, image: string) => {
        setImages((prevImages) => ({
            ...prevImages,
            [questionId]: image,
        }));
    }, [setImages]);

    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem('capturedImage') || '{}');
        const storedStoreNumber = sessionStorage.getItem('storeNumber') || '';

        Object.entries(storedImages).forEach(([questionId, image]) => {
            addImage(questionId, image as string);
        });

        setStoreNumber(storedStoreNumber);
    }, [addImage]);

    const reset = useCallback(() => {
        setUserInput({});
        setImages({});
        setStoreNumber('');
    }, []);

    return (
        <ReviewContext.Provider value={{ userInput, images, driveThruSelection, setDriveThruSelection, addUserInput, addImage, storeNumber, setStoreNumber, reset }}>
            {children}
        </ReviewContext.Provider>
    );
};