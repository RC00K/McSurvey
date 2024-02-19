import React, { useCallback, createContext, useContext, useState, ReactNode } from 'react';
import { set } from 'react-hook-form';

interface ReviewContextType {
    userInput: Record<string, string>;
    images: Record<string, string>;
    driveThruSelection: string;
    setDriveThruSelection: (selection: string) => void;
    addUserInput: (questionId: string, answer: string) => void;
    addImage: (questionId: string, image: string) => void;
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

    return (
        <ReviewContext.Provider value={{ userInput, images, driveThruSelection, setDriveThruSelection, addUserInput, addImage }}>
            {children}
        </ReviewContext.Provider>
    );
};