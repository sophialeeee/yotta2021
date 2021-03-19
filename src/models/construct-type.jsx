import {useState} from 'react';
import {createModel} from 'hox';

function useConstructType() {
    const [constructType, setConstructType] = useState('auto');
    const setAutoConstructType = () => {
        setConstructType('auto');
    };
    const setDisplayConstructType = () => {
        setConstructType('display');
    };

    return {
        constructType,
        setAutoConstructType,
        setDisplayConstructType
    };
}

export default createModel(useConstructType);



