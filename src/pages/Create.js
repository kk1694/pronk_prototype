import React from 'react'
import { useLocation } from 'react-router-dom';

import TappyWindow from '../components/TappyWindow';


function Create() {

    const location = useLocation();

    return (
        <div>
            <TappyWindow project_id={location.state.project_id} />
        </div>
    )
}

export default Create
