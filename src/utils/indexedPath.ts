let openDBRequest: IDBOpenDBRequest = indexedDB.open("ImageDB", 1);

openDBRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    let db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
    }
};

const setImageToIndexedDB = async (imgKey: string, imgSrc: string) => {
    openDBRequest.onsuccess = (event: Event) => {
        let db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        let transaction: IDBTransaction = db.transaction(["images"], "readwrite");
        let imagesStore: IDBObjectStore = transaction.objectStore("images");
        imagesStore.put(imgSrc, imgKey);
    };
};

const getImageFromIndexedDB = (imgKey: string, callback: (result: any) => void) => {
    openDBRequest.onsuccess = (event: Event) => {
        let db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        let transaction: IDBTransaction = db.transaction(["images"]);
        let imagesStore: IDBObjectStore = transaction.objectStore("images");
        let request: IDBRequest = imagesStore.get(imgKey);
        request.onsuccess = (event: Event) => {
            callback((event.target as IDBRequest).result);
        };
    };
};

export { setImageToIndexedDB, getImageFromIndexedDB };