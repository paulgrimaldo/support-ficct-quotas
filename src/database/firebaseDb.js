import { database } from './dbConfig';
import { ref, query, orderByChild, limitToLast, endAt, onValue, set } from "firebase/database";

export const readRequests = (limit, endBefore, callback) => {
    const requestsRef = ref(database, 'requests');
    let requestsQuery = query(requestsRef, orderByChild('timestamp'), limitToLast(limit));
    if (endBefore) {
        requestsQuery = query(requestsRef, orderByChild('timestamp'), endAt(endBefore), limitToLast(limit));
    }
    onValue(requestsQuery, (snapshot) => {
        const data = snapshot.val();
        const requestsList = data ? Object.values(data) : [];
        callback(requestsList);
    });
};

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