export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export interface ReviewContextType {
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
