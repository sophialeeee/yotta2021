import { useRef, useState, useEffect } from 'react';

function useComponentMounted(){
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        }
    });
    return isMounted;
}

function useMountedState(initValue) {
    const [state, _setState] = useState(initValue);
    const isMounted = useComponentMounted();
    
    function _setMountedState(value){
        if(isMounted.current){
            _setState(value);
        }
    }
    return [state, _setMountedState];
}

export {useMountedState};