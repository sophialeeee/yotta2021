import {useState} from 'react';
import {createModel} from 'hox';

function useStep() {
    const [step, _setStep] = useState(0);

    const setStep = (step) => {
        _setStep(step)
    };

    return {
        step,
        setStep
    };
}

export default createModel(useStep);