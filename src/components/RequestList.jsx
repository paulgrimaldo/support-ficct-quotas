import React, { useState, useEffect } from 'react';
import { formatDateTime, groupRequestsByDate } from '../shared/commonFunctions';
import { readRequests } from '../database/firebaseDb';
const RequestsList = () => {
    const [requests, setRequests] = useState({});
    const [lastTimestamp, setLastTimestamp] = useState(null);
    const [limit, setLimit] = useState(5);
    const [newItems, setNewItems] = useState([]);

    const fetchRequests = (limit, lastTimestamp) => {
        readRequests(limit, lastTimestamp, (requestsList) => {
            requestsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const groupedRequests = groupRequestsByDate(requestsList);

            setRequests(prevRequests => {
                const newRequests = { ...prevRequests };
                Object.keys(groupedRequests).forEach(date => {
                    if (newRequests[date]) {
                        newRequests[date] = [...newRequests[date], ...groupedRequests[date]];
                    } else {
                        newRequests[date] = groupedRequests[date];
                    }
                });
                return newRequests;
            });

            if (requestsList.length > 0) {
                setLastTimestamp(requestsList[requestsList.length - 1].timestamp);
            }

            setNewItems(requestsList.map(item => item.timestamp));
        });
    };

    useEffect(() => {
        fetchRequests(limit, null);
    }, [limit]);

    const handleLoadMore = () => {
        setLimit(limit + 5);
        fetchRequests(limit, lastTimestamp);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Últimas solicitudes</h2>
            <div className="scrollable-section mt-3">
                {Object.keys(requests).map((date, index) => (
                    <div key={index} className="date-section mt-3">
                        <h3>{date}</h3>
                        {requests[date].map((request, idx) => (
                            <div
                                key={idx}
                                className={`request-item mt-3 div-centered ${newItems.includes(request.timestamp) ? 'fade-in' : ''}`}
                            >
                                <strong>{request.class}</strong> - <strong>{request.group}</strong> - {request.count > 1 ? <strong>({request.count})</strong> : ''} {request.count > 1 ? `veces reportado, último en: ${formatDateTime(request.timestamp)}` : `Solicitado en: ${formatDateTime(request.timestamp)}`}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-secondary" onClick={handleLoadMore}>Mostrar más</button>
            </div>
        </div>
    );
};

export default RequestsList;
