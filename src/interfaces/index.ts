export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export interface ReviewContextType {
  userInput: Record<string, string>;
  images: Record<string, string>;
  driveThruSelection: string;
  storeNumber: string;
  setStoreNumber: (value: string) => void;
  setDriveThruSelection: (selection: string) => void;
  addUserInput: (questionId: string, answer: string) => void;
  setImages: (images: Record<string, string>) => void
  addImage: (questionId: string, image: string) => void;
  reset: () => void;
}
