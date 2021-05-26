import React, {useEffect, useState} from 'react';
import {Layout, Menu} from 'antd';
import {useHistory, Switch, Route, useLocation} from 'react-router-dom';
import cookie from 'react-cookies';
import {Cascader, Modal, Input,Select} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons'

import classes from './index.module.css'
import YottaAPI from '../apis/yotta-api';
import HomePage from './home-page';
import ConstructPage from './construct-page';
import CONSTS from "../constants";
import Login from './Login';
import DisplayPage from './display-page';
import useConstructModel from '../models/construct-type';
import useCurrentSubjectDomainModel from '../models/current-subject-domain';

const {Header, Content, Footer} = Layout;

function App() {
    const [subjects,setSubjects]=useState()
    const {setAutoConstructType} = useConstructModel();
    const {confirm} = Modal;

    // data
   
    const userT = cookie.load('userType')
    if(userT){
        var type = userT.data;
    }
    if(type === "admin user")
        { 
            var menuList = [
                {
                key: '/nav',
                title: '导航',
                component: HomePage
                },
                {
                key: '/display-page',
                title: '浏览',
                component: DisplayPage
            },
            {
                key: '/construct-page',
                title: '构建',
                component: ConstructPage
            }
            ];
        }else{
            var menuList = [
                {
                key: '/nav',
                title: '导航',
                component: HomePage
                },
                {
                key: '/display-page',
                title: '浏览',
                component: DisplayPage
            },
            ];
        }
        

    // hooks
    const history = useHistory();
    const {currentSubjectDomain, setCurrentSubjectDomain} = useCurrentSubjectDomainModel();
    
    const location = useLocation();
    const [menuKey, setMenuKey] = useState('/nav');
    
    useEffect(()=>{
        async function fetch() {
            if (localStorage.getItem("visitedRelation")){
                    localStorage.removeItem("visitedRelation");
                }
            if (localStorage.getItem("visitedTopic")){
                    localStorage.removeItem("visitedTopic");
                }
            if (localStorage.getItem("finishedData")){
                    localStorage.removeItem("finishedData");
                }
            if (localStorage.getItem("batchData")){
                    localStorage.removeItem("batchData");
                }
            if (localStorage.getItem("visitedBatch")){
                    localStorage.removeItem("visitedBatch");
                }
            if (localStorage.getItem("visitedStep1")){
                    localStorage.removeItem("visitedStep1");
                }
            if (localStorage.getItem("visitedAssemble")){
                    localStorage.removeItem("visitedAssemble");
                }
            if (localStorage.getItem("visitedClick")){
                    localStorage.removeItem("visitedClick");
                }    
        }
        fetch();
    },[currentSubjectDomain])
    function onAutoConstructClick(){
        
        let subject = '计算机科学';
        let domain = '数据结构';
        const onTextSubjectChange = (e) => {
            subject = e.target.value;
        };
        const onTextDomainChange = (e) => {
            domain = e.target.value;
        };

        const onSelectChange = (e) => { 
            subject = e;  
        }
        confirm({
            
            title: '请选择构建学科，并输入要构建的课程',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                
                <span>
                    学科：
                </span>
                {(subjects)?(
                    <Select defaultValue='计算机科学' onSelect={onSelectChange}>
                        {
                            subjects.map((SubjectsName)=>(
                            <option value={SubjectsName.subjectName} >{SubjectsName.subjectName}</option> 
                            ))
                        }
                    </Select>):                 
                (
                    <Input placeholder={'请输入学科'} onChange={onTextSubjectChange} value={subject} />)}


                </div>
                {/* <div>
                    <span>
                        碎片内容：
                    </span>
                    <TextArea showCount maxLength={150} onChange={handleTextareaChange}/>
                </div> */}

                <div>
                <span>
                    课程：
                </span>
                    <Input defaultValue={'数据结构'} placeholder={'请输入课程'} onChange={onTextDomainChange}/>
                </div>
                <span style={{ fontSize: '8px', height: '5px', display: 'block' }}>
                    你可以尝试构建数据结构、C语言课程
                </span>
            </>,
            okText: '开始构建',
            cancelText: '取消',
            onOk() {
                setAutoConstructType();
                setCurrentSubjectDomain(subject, domain);
                cookie.save('c-type','0');
                // ({pathname:'/construct-page',state:{login:true}});
                history.push('/construct-page');
            },
            onCancel() {
                console.log('不构建了');
            }
        })
    };

    //functions
    const onMenuItemClick = (e) => {
        console.log('e.key',e.key);
        localStorage.removeItem('state');//刷新清空状态量
        if(e.key!='/construct-page'){
            if(e.key=='/display-page'){
                history.push({pathname:e.key,state:{login:true}});
            }
            else{
                history.push({pathname:'/nav',state:{login:true}});
            }
        }
        else{
            onAutoConstructClick();
        }
    };
    useEffect(()=>{
        async function fetch() {
            
            var domainsAndSubjects = await YottaAPI.getDomainsBySubject("zscl");
            domainsAndSubjects = domainsAndSubjects.data.data;
            if(domainsAndSubjects)
                {setSubjects(domainsAndSubjects)}
        }
        fetch();
    },[])
    useEffect(() => {
        
        console.log('location.pathname',location.pathname);
        setMenuKey(location.pathname);
    }, [location]);

    return (
        <Layout className={classes.layout}>
            {
                location.pathname!='/'?(
                    <Header className={classes.header}>
                    <div className={classes.title}>
                        {CONSTS.APP_NAME}
                    </div>
                    <Menu theme={"dark"} mode={"horizontal"} selectedKeys={[menuKey]}
                          onClick={onMenuItemClick}>
                        {
                            menuList.map(menuItem => (
                                <Menu.Item key={menuItem.key}>
                                    <span>{menuItem.title}</span>
                                </Menu.Item>
                            ))
                        }
                    </Menu>
                </Header>):(
                    null
                )
            }
            <Content>

                <Switch>
                    <Route exact path ={'/'} component={Login}></Route>
                    <Route exact path ={'/nav'} component={HomePage}></Route>
                    <Route exact path ={'/display-page'} component={DisplayPage}></Route>
                    <Route exact path ={'/construct-page'} component={ConstructPage}></Route>
                    {/* {
                        (userT&&userT === "admin user")&&(<Route exact path ={'/construct-page'} component={ConstructPage}></Route>)
                        
                    } */}
                </Switch>
            </Content>
            <Footer className={classes.footer}>
                <span>Copyright © 2020 智能网络与网络安全教育部重点实验室. All rights reserved.</span>
                <span>Version: 2.0.0</span>
            </Footer>
        </Layout>
    );
}

export default App;
