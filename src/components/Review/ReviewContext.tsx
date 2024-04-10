import { Preferences } from '@capacitor/preferences';
import React, { useCallback, createContext, useContext, useState, useEffect } from 'react';
import { ReviewContextType } from '../../interfaces';

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReview must be used within a ReviewProvider');
    }
    return context;
};

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInput, setUserInput] = useState<Record<string, string>>({});
    const [images, setImages] = useState<Record<string, string>>({});
    const [driveThruSelection, setDriveThruSelection] = useState('');
    const [storeNumber, setStoreNumber] = useState('');

    const saveImages = async (newImages: Record<string, string>) => {
        await Preferences.set({
            key: 'capturedImage',
            value: JSON.stringify(newImages),
        });
    };

    const addUserInput = (questionId: string, answer: string) => {
        setUserInput((prevInput) => ({
            ...prevInput,
            [questionId]: answer,
        }));
    };

    const addImage = useCallback((questionId: string, image: string) => {
        setImages((prevImages) => {
            const updatedImages = {
                ...prevImages,
                [questionId]: image,
            };
            saveImages(updatedImages);
            return updatedImages;
        });
    }, []);

    useEffect(() => {
        const loadImageReferences = async () => {
            // await saveImages
            const { value } = await Preferences.get({ key: 'capturedImage' });
            const imageReferences = value ? JSON.parse(value) : {};
            setImages(imageReferences);
        };
        loadImageReferences();
    }, []);

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