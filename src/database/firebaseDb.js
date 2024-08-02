import { database } from './dbConfig';
import { ref, query, orderByChild, limitToLast, onValue, set } from "firebase/database";

export const readRequests = (limit, callback) => {
    const requestsRef = ref(database, 'requests');
    let requestsQuery = query(requestsRef, orderByChild('timestamp'), limitToLast(limit));
    onValue(requestsQuery, (snapshot) => {
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