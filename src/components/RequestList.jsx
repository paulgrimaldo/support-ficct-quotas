import React, { useState, useEffect } from 'react';
import { formatDateTime, groupRequestsByDate } from '../shared/commonFunctions';
import { readRequests } from '../database/firebaseDb';
const RequestsList = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        readRequests((requestsList) => {
            requestsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const groupedRequests = groupRequestsByDate(requestsList);
            setRequests(groupedRequests);
        });
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center">Últimas solicitudes</h2>
            <div className="scrollable-section mt-3">
                {Object.keys(requests).map((date, index) => (
                    <div key={index} className="date-section mt-3">
                        <h3>{date}</h3>
                        {requests[date].map((request, idx) => (
                            <div key={idx} className="request-item mt-3 div-centered">
                                <strong>{request.class}</strong> - <strong>{request.group}</strong> - {request.count > 1 ? <strong>({request.count})</strong> : ''} {request.count > 1 ? `veces reportado, último en: ${formatDateTime(request.timestamp)}` : `Solicitado en: ${formatDateTime(request.timestamp)}`}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequestsList;
