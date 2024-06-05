export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export interface SurveyContextType {
  userInput: Record<string, string>;
  images: Record<string, string[]>;
  storeNumber: string;
  setStoreNumber: (value: string) => void;
  accountManager: string | null;
  setAccountManager: (value: string | null) => void;
  addUserInput: (questionId: string, answer: string) => void;
  setImages: (images: Record<string, string[]>) => void
  addImage: (questionId: string, image: string[]) => void;
  reset: () => void;
}
