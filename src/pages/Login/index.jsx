import React, {useState, useEffect} from 'react';
import {UserOutlined,LockOutlined} from '@ant-design/icons';
import {Input,Button} from "antd";
import YottaAPI from '../../apis/yotta-api';
import {useHistory} from 'react-router-dom';
import useUserNameModel from '../../models/user-name';
import cookie from 'react-cookies';
function Login(){
    const [userName,setuserName] = useState();
    const [password,setpassword] = useState();
    const [login, setlogin] = useState(false);
    const [errText, seterrText] = useState(false);
    const img = require('./bgNow.jpg');
    const history = useHistory();
    const {setUserName} = useUserNameModel();
    const handleUsernameChange = (e)=>{
        setuserName(e.target.value);
        seterrText(0);
    };
    const handlePasswdChange = (e)=>{
        setpassword(e.target.value);
        seterrText(0);
    };
    const handleLogin = ()=>{
      setlogin(true);
    };
  
    useEffect(()=>{
        async function Login(userName,password){
          try
            {
              const res = await YottaAPI.Login(userName,password); 
              setUserName(userName);
              //let intenMinutes = new Date(new Date().getTime() +  600 * 1000);
              cookie.save('userInfo',userName);

              cookie.save('userType',res.data);//safe?

              cookie.remove("c-type")
              history.push({pathname:'/nav',state:{login:true,userName:userName}});
              console.log("cookie",cookie.loadAll())
              
            }
          catch(err)
            {
              console.log("error",err);
              setlogin(false);
              seterrText(1);
            }
          // finally
          //   {console.log('res.code',res.status);
          //   setUserName(userName);
          //   if(res.status === 200){
          //     let intenMinutes = new Date(new Date().getTime() +  600* 1000);
          //     cookie.save('userInfo',userName,{expires: intenMinutes})
          //     history.push({pathname:'/nav',state:{login:true,userName:userName}});
            
          //     console.log("cookie",cookie.loadAll())
          //   }}
        }
        if(login&&userName&&password){
          Login(userName,password);
          localStorage.removeItem('state');//刷新清空状态量
        }
    },[login])
    
    return(
        <div>
        <img src={img} style={{zIndex:-1, width:'100%'}}/>
        <div>
          <h1 style={{ position: 'absolute', textAlign:'center',width:'12%',left:'44%', top: '25%'/*top:'200px',left:'880px'*/, fontSize: '30px' }}>统一用户认证</h1>
          <Input style={{width:'22%',height:'7%',position:'absolute',left:'39%',top:'35%'/*top:'280px',left:'800px'*/}}
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)'}} />}
            placeholder="用户名"
            value={userName}
            onChange={handleUsernameChange}
          />
          <Input style={{width:'22%',height:'7%',position:'absolute',left:'39%',top:'45%'/*top:'350px',left:'800px'*/}}
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="密码"
            value={password}
            onChange={handlePasswdChange}
          />
          <h4 id="errText" style={{ position: 'absolute', left:'39%',top:'52%'/*top: '400px', left: '800px'*/, fontSize: '13px', color: '#FF0000', display: errText ? 'block' : 'none'}}>用户名或密码错误，请重试</h4>      
          <Button type="primary" onClick={handleLogin} style={{position:'absolute',width:'4%',left:'48%', top:'56%'/*top:'430px',left:'930px'*/}}>
            登录
          </Button>
        </div>
        </div>
    )
}

export default Login;