import {useState} from 'react';
import {createModel} from 'hox';

function useCurrentSubjectDomain() {
    const [currentSubjectDomain, _setCurrentSubjectDomain] = useState({});

    const setCurrentSubjectDomain = (subject, domain) => {
        _setCurrentSubjectDomain({
            subject,
            domain
        })
    };

    return {
        currentSubjectDomain,
        setCurrentSubjectDomain
    };
}

export default createModel(useCurrentSubjectDomain);



