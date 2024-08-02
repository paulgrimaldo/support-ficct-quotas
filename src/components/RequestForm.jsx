import React, { useState, useEffect } from 'react';
import { normalizeInput } from '../shared/commonFunctions';
import { saveRequest } from '../database/firebaseDb';

const RequestForm = ({ onSubmit }) => {
    const [uClass, setClass] = useState('');
    const [group, setGroup] = useState('');
    const [showRelaxMessage, setShowRelaxMessage] = useState(false);
    const [lastClickTimes, setLastClickTimes] = useState([]);


    const handleClickAllowed = () => {
        const currentTime = new Date().getTime();
        // Remove click times older than 5 minutes
        const validClickTimes = lastClickTimes.filter(time => currentTime - time < 300000);
        return validClickTimes.length < 4;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!handleClickAllowed()) {
            setShowRelaxMessage(true);
            return;
        }

        try {
            const normalizedClass = normalizeInput(uClass);
            const normalizedGroup = normalizeInput(group).toUpperCase();
            const time = new Date().getTime();
            await saveRequest({
                time,
                normalizedClass,
                normalizedGroup
            }, () => {
                setClass('');
                setGroup('');
                onSubmit();
                setLastClickTimes([...lastClickTimes, new Date().getTime()]);
            });

        } catch (e) {
            console.error("Error adding data: ", e);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRelaxMessage(false);
        }, 300000); // 5 minutes in milliseconds
        return () => clearTimeout(timer);
    }, [lastClickTimes]);

    return (
        <div className='container mt-3 col-sm-12 col-md-6 col-lg-6 col-xl-6 shadow-lg p-3 m-3 bg-white rounded'>
            {showRelaxMessage && <div className="alert alert-warning">La herramienta no esta para juegos 😳</div>}
            {
                !showRelaxMessage &&
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="class">Materia</label>
                        <input
                            type="text"
                            className="form-control"
                            id="class"
                            value={uClass}
                            maxLength={20}
                            onChange={(e) => setClass(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="group">Grupo</label>
                        <input
                            type="text"
                            className="form-control"
                            id="group"
                            value={group}
                            maxLength={3}
                            onChange={(e) => setGroup(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Solicitar cupo🙏🏼</button>
                </form>
            }
        </div>
    );
};

export default RequestForm;
