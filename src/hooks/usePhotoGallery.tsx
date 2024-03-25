import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

import { useReview } from '../components/Review/ReviewContext';
import { add } from 'ionicons/icons';

// Interface
export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

export function usePhotoGallery() {
    const { images, addImage } = useReview();

    const saveImageReference = async (questionIndex: number, imagePath: string) => {
        const imageReferences = await Preferences.get({ key: 'imageReferences' });
        const references = imageReferences.value ? JSON.parse(imageReferences.value) : {};
        references[`question_${questionIndex}`] = imagePath;

        await Preferences.set({
            key: 'imageReferences',
            value: JSON.stringify(references),
        });
    };

    const takePhoto = async (questionIndex: number) => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });
        const fileName = `photo_${new Date().getTime()}.jpeg`;
        const savedFileImage = await savePicture(photo, fileName);
        if (savedFileImage.webviewPath) {
            addImage(`question_${questionIndex}`, savedFileImage.webviewPath);
            saveImageReference(questionIndex, savedFileImage.webviewPath);
        }
    };

    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
        const base64Data = await base64FromPath(photo.webPath!);
        await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
    };

    return {
        takePhoto,
    };
}

export async function base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}