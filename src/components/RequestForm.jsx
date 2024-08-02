import React, { useState } from 'react';
import { normalizeInput } from '../shared/commonFunctions'
import { saveRequest } from '../database/firebaseDb';
const RequestForm = ({ onSubmit }) => {
    const [uClass, setClass] = useState('');
    const [group, setGroup] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            })

        } catch (e) {
            console.error("Error adding data: ", e);
        }
    };

    return (
        <div className='container mt-3 col-sm-12 col-md-6 col-lg-6 col-xl-6 shadow-lg p-3 m-3 bg-white rounded'>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="class">Materia</label>
                    <input
                        type="text"
                        className="form-control"
                        id="class"
                        value={uClass}
                        maxLength={100}
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
        </div>
    );
};

export default RequestForm;
