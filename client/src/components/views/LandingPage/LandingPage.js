import React, { useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
    useEffect(() => {
        axios.get('/api/hello').then(res => console.log(res));
    }, []);
    console.log('landingpage');

    return (
        <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}
        >
            LandingPage
        </div>
    );
};

export default LandingPage;
