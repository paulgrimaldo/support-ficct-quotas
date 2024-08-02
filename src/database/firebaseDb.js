import { ref, onValue, set } from "firebase/database";
import { database } from "./dbConfig";

export const readRequests = (callback) => {
    const requestsRef = ref(database, 'requests');
    onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        const requestsList = data ? Object.values(data) : [];
        callback(requestsList)
    });
}

export const saveRequest = async (request, callback) => {
    const { time, normalizedClass, normalizedGroup } = request
    const newRequestRef = ref(database, 'requests/' + time);
    await set(newRequestRef, {
        timestamp: new Date().toISOString(),
        'class': normalizedClass,
        'group': normalizedGroup
    });
    callback();
}