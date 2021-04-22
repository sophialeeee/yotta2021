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
    const setCoolConstructType = () => {
        setConstructType('cool');
    };

    return {
        constructType,
        setAutoConstructType,
        setDisplayConstructType,
        setCoolConstructType
    };
}

export default createModel(useConstructType);



