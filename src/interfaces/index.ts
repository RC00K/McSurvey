export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export interface SurveyContextType {
  userInput: Record<string, string>;
  images: Record<string, string[]>;
  surveyName: string;
  setSurveyName: (value: string) => void;
  storeNumber: string;
  setStoreNumber: (value: string) => void;
  installerName: string;
  accountManager: string | null;
  setInstallerName: (value: string) => void;
  setAccountManager: (value: string | null) => void;
  addUserInput: (questionId: string, answer: string) => void;
  setImages: (images: Record<string, string[]>) => void
  addImage: (questionId: string, image: string[]) => void;
  deleteImage: (questionId: string, image: string) => void;
  replaceImage: (questionId: string, image: string) => void;
  reset: () => void;
}
