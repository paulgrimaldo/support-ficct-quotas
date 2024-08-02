import React, { useState, useEffect } from 'react';
import { normalizeInput } from '../shared/commonFunctions';
import { saveRequest } from '../database/firebaseDb';

const RequestForm = ({ onSubmit }) => {
    const [uClass, setClass] = useState('');
    const [group, setGroup] = useState('');
    const [showRelaxMessage, setShowRelaxMessage] = useState(false);
    const [lastClickTime, setLastClickTime] = useState(null);
    const [counter, setCounter] = useState(0);

    const TIME_LIMIT = process.env.REACT_APP_TIME_LIMIT || 10; // Time limit in minutes

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedClass = uClass.trim();
        const trimmedGroup = group.trim();

        if (trimmedClass === '' || trimmedGroup === '') {
            alert("Por favor, completa los campos correctamente.");
            return;
        }

        const currentTime = new Date().getTime();
        if (lastClickTime && currentTime - lastClickTime < TIME_LIMIT * 60000) {
            setShowRelaxMessage(true);
            setCounter(TIME_LIMIT * 60 - Math.floor((currentTime - lastClickTime) / 1000));
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
                setLastClickTime(new Date().getTime());
                setShowRelaxMessage(true);
                setCounter(TIME_LIMIT * 60);
            });

        } catch (e) {
            console.error("Error adding data: ", e);
        }
    };

    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => {
                setCounter(counter - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (counter === 0) {
            setShowRelaxMessage(false);
        }
    }, [counter]);

    return (
        <div className='container mt-3 col-sm-12 col-md-6 col-lg-6 col-xl-6 shadow-lg p-3 m-3 bg-white rounded'>
            {showRelaxMessage ? (
                <div>
                    <div className="alert alert-success">Gracias por enviar tu solicitud, será tomada en cuenta para comunicarnos con las autoridades.</div>
                    {counter > 0 && (
                        <div className="alert alert-info">Puedes enviar una nueva solicitud en {Math.floor(counter / 60)}:{String(counter % 60).padStart(2, '0')}</div>
                    )}
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default RequestForm;
