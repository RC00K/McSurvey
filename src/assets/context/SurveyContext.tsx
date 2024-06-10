import { Preferences } from "@capacitor/preferences";
import React, {
  useCallback,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { SurveyContextType } from "../../interfaces";

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
};

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInput, setUserInput] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string[]>>({});
  const [surveyName, setSurveyName] = useState("");
  const [storeNumber, setStoreNumber] = useState("");
  const [accountManager, setAccountManager] = useState<string | null>(null);

  const saveImages = async (newImages: Record<string, string[]>) => {
    try {
      await Preferences.set({
        key: "capturedImage",
        value: JSON.stringify(newImages),
      });
    } catch (error) {
      console.error("Failed to save images: ", error);
    }
  };

  const addUserInput = (questionId: string, answer: string) => {
    setUserInput((prevInput) => ({
      ...prevInput,
      [questionId]: answer,
    }));
  };

  const addImage = useCallback((questionId: string, imageSrc: string[]) => {
    setImages((prevImages) => {
      const updatedImages = { ...prevImages };
      if (!updatedImages[questionId]) {
        updatedImages[questionId] = [];
      }

      // Avoid duplicate images
      if (!updatedImages[questionId].includes(imageSrc[0])) {
        updatedImages[questionId].push(imageSrc[0]);
      }
      saveImages(updatedImages);
      return updatedImages;
    });
  }, []);

  const deleteImage = useCallback((questionId: string, imageSrc: string) => {
    setImages((prevImages) => {
      const updatedImages = { ...prevImages };
      if (updatedImages[questionId]) {
        updatedImages[questionId] = updatedImages[questionId].filter(
          (src) => src !== imageSrc
        );
      }
      saveImages(updatedImages);
      return updatedImages;
    });
  }, []);

  const replaceImage = useCallback((questionId: string, imageSrc: string) => {
    setImages((prevImages) => {
      const updatedImages = { ...prevImages };
      if (updatedImages[questionId]) {
        updatedImages[questionId] = updatedImages[questionId].map((src) =>
          src === imageSrc ? imageSrc : src
        );
      }
      saveImages(updatedImages);
      return updatedImages;
    });
  }, []);

  useEffect(() => {
    const loadImageReferences = async () => {
      // await saveImages
      const { value } = await Preferences.get({ key: "capturedImage" });
      const imageReferences = value ? JSON.parse(value) : {};
      setImages(imageReferences);
    };
    loadImageReferences();
  }, []);

  useEffect(() => {
    const loadStoreNumber = async () => {
      const { value } = await Preferences.get({ key: "storeNumber" });
      setStoreNumber(value || "");
    };
    loadStoreNumber();
  }, []);

  const reset = useCallback(async () => {
    console.log("Resetting survey data");
    setUserInput({});
    setImages({});
    setStoreNumber("");
    localStorage.removeItem("lastQuestionIndex");
    localStorage.removeItem("surveyData");
    localStorage.removeItem("accountManager");
    localStorage.removeItem("capturedImage");
    // Clear all stored preferences
    await Preferences.clear();
  }, []);

  return (
    <SurveyContext.Provider
      value={{
        userInput,
        images,
        surveyName,
        storeNumber,
        accountManager,
        setSurveyName,
        setStoreNumber,
        setAccountManager,
        addUserInput,
        setImages,
        addImage,
        deleteImage,
        replaceImage,
        reset,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};
