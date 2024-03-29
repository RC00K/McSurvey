import { useState, useEffect } from 'react';
import { Storage } from '@ionic/storage';

interface ImageReference {
    imageTitle: string;
    imageAlt: string;
    image: string;
}

interface QuestionData {
    questionTitle: string;
    questionDesc?: string;
    questionType: 'drive-thru-entry' | 'speaker-post' | 'network-switch' | 'modem-connection' | 'bos-pos-server' | 'w-network';
    question: string;
    questionImages?: ImageReference[];
    questionHints?: { hint: string }[];
    imageData?: string;
    imageId?: string;
}

interface StoredData {
    [storeNumber: string]: QuestionData[];
}

const STORAGE_KEY = 'aots-survey-data';

function generateImageId(prefix: string) {
    const randomNum = Math.floor(Math.random() * 100000000);
    return `${prefix}-${randomNum}`;
}

export const useStorage = () => {
    const [storedData, setStoredData] = useState<StoredData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const rawData = localStorage.getItem(STORAGE_KEY);
            if (rawData) {
                setStoredData(JSON.parse(rawData));
            } else {
                setStoredData({});
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (storedData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
        }
    }, [storedData]);

    const storeQuestionData = (storeNumber: string, questionIndex: number, data: QuestionData) => {
        setStoredData(prevData => {
            return {
                ...prevData,
                [storeNumber]: {
                    ...(prevData?.[storeNumber] || []),
                    [questionIndex]: {
                        ...((prevData?.[storeNumber] || [])[questionIndex]),
                        ...data
                    }
                }
            };
        });
    };

    const storeImage = (storeNumber: string, questionIndex: number, imageData: string) => {
        const imageIdPrefix = determineImageIdPrefix(questionIndex, storedData);
        const imageId = generateImageId(imageIdPrefix);

        storeQuestionData(storeNumber, questionIndex, {
            questionType: 'image',
            imageData,
            imageId
        });

        return imageId;
    };

    const determineImageIdPrefix = (questionIndex: number, data: StoredData | null) => {
        const question = (data?.[storeNumber] || [])[questionIndex];
        switch (question?.questionType) {
            case 'drive-thru-entry': return 'DTEP';
            case 'speaker-post': return 'SP';
            case 'network-switch': return 'NS';
            case 'modem-connection': return 'MC';
            case 'bos-pos-server': return 'BPS';
            case 'w-network': return 'WA';
            default: return 'IMG';
        }
    };
    return { storeQuestionData, storeImage, storedData };
}