import {useState} from 'react';
import {createModel} from 'hox';



function useUserName() {
    const [UserName, _setUserName] = useState();
    const setUserName = (UserName) => {
        _setUserName(UserName)        
    };
   

    return {
        UserName,
        setUserName,  
    };
}

export default createModel(useUserName);

