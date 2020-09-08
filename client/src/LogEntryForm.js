import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

import {createLogEntries} from './API';

const LogEntryForm = ({location, onClose}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { handleSubmit} = useForm();
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            data.latitude = location.latitude;         
            data.longitude = location.longitude;         
            await createLogEntries(data);
            onClose();
        }
        catch (error) {
            console.error(error);
            setError(error.message);
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="entryForm">
            { error ? <h3 className="error">{error}</h3> : null}
            <button disabled={loading}>{loading ? 'Loading...' : 'Create Entry'}</button>
        </form>
    )
};

export default LogEntryForm;