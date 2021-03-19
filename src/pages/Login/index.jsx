import React, {useState, useEffect} from 'react';
import {UserOutlined,LockOutlined} from '@ant-design/icons';
import {Input,Button} from "antd";
import YottaAPI from '../../apis/yotta-api';
import {useHistory} from 'react-router-dom';
function Login(){
    const [userName,setuserName] = useState();
    const [password,setpassword] = useState();
    const [login,setlogin] = useState(false);
    const img = require('./bgNow.jpg');
    const history = useHistory();
    const handleUsernameChange = (e)=>{
        setuserName(e.target.value);
    
    };
    const handlePasswdChange = (e)=>{
        setpassword(e.target.value);
    
    };
    const handleLogin = ()=>{
      setlogin(true);
    };
  
    useEffect(()=>{
        async function Login(userName,password){
          const res = await YottaAPI.Login(userName,password); 
          console.log('res.code',res.status);
          if(res.status === 200){
            history.push({pathname:'/nav',state:{login:true}});
          }
        }
        if(login&&userName&&password){
          Login(userName,password);
        }
    },[login])
    
    return(
        <div>
        <img src={img} style={{zIndex:-1}}/>
        <div>
          <h1 style={{position:'absolute',top:'300px',left:'980px',fontSize:'30px'}}>统一用户认证</h1>
          <Input style={{width:350,height:50,position:'absolute',top:'380px',left:'900px'}}
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)'}} />}
            placeholder="用户名"
            value={userName}
            onChange={handleUsernameChange}
          />
          <Input style={{width:350,height:50,position:'absolute',top:'450px',left:'900px'}}
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="密码"
            value={password}
            onChange={handlePasswdChange}
          
          />  
          <Button type="primary" onClick={handleLogin} style={{position:'absolute',top:'530px',left:'1030px'}}>
            登录
         </Button>
        </div>
        </div>
    )
}

export default Login;