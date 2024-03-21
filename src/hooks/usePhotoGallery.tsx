import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

import { useReview } from '../components/Review/ReviewContext';

// Interface
export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

export interface SelectedImages {
    [questionId: string]: string;
}

const PHOTO_STORAGE = 'capturedImage';

export function usePhotoGallery() {
    const [photos, setPhotos] = useState<UserPhoto[]>([]);
    const [selectedImages, setSelectedImages] = useState<SelectedImages>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const { images, addImage } = useReview();
    
    useEffect(() => {
        // Check local storage for the image
        const storedImage = localStorage.getItem('capturedImage');
        if (storedImage && currentQuestionIndex !== null) {
            setSelectedImages(prevImages => ({
                ...prevImages, 
                [currentQuestionIndex]: storedImage,
            }));
            localStorage.removeItem('capturedImage');
        }

        const loadSaved = async () => {
            const { value } = await Preferences.get({ key: PHOTO_STORAGE });
            const photosInPreferences = (value ? JSON.parse(value) : []) as UserPhoto[];

            for (let photo of photosInPreferences) {
                const file = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });
                // Web platform returns base64 encoded data
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
            }
            setPhotos(photosInPreferences);
        };
        loadSaved();
    }, [currentQuestionIndex]);

    const takePhoto = async (questionIndex: number) => {
        setCurrentQuestionIndex(questionIndex);
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(photo, fileName);
        setSelectedImages(prevImages => ({
            ...prevImages,
            [questionIndex]: savedFileImage.webviewPath,
        }));
        const newPhotos = [...photos, savedFileImage];
        setPhotos(newPhotos);
        Preferences.set({ key: 'capturedImage', value: JSON.stringify(newPhotos) });
    };

    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
        const base64Data = await base64FromPath(photo.webPath!);
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        if (currentQuestionIndex !== null) {
            const questionId = `question_${currentQuestionIndex}`;
            addImage(questionId, fileName);
            const updateImages = { ...images, [questionId]: fileName };
            localStorage.setItem('reviewImages', JSON.stringify(updateImages));
            setSelectedImages(updateImages);
        }

        return {
            filepath: fileName,
            webviewPath: savedFile.uri,
        };
    };

    return {
        photos,
        selectedImages,
        takePhoto,
    };
}

export async function base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('method did not return a string');
            }
        };
        reader.readAsDataURL(blob);
    });
}