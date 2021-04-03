import React, {useEffect, useState} from 'react';
import {Layout, Menu} from 'antd';
import {useHistory, Switch, Route, useLocation} from 'react-router-dom';
import cookie from 'react-cookies';
import {Cascader, Modal, Input} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons'

import classes from './index.module.css'

import HomePage from './home-page';
import ConstructPage from './construct-page';
import CONSTS from "../constants";
import Login from './Login';
import DisplayPage from './display-page';
import useConstructModel from '../models/construct-type';
import useCurrentSubjectDomainModel from '../models/current-subject-domain';

const {Header, Content, Footer} = Layout;

function App() {

   
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
    if (localStorage.getItem("visitedRelation")){
        localStorage.removeItem("visitedRelation");
    }
    function onAutoConstructClick(){
        let subject = '';
        let domain = '';
        const onTextSubjectChange = (e) => {
            subject = e.target.value;
        };
        const onTextDomainChange = (e) => {
            domain = e.target.value;
        };
        

        confirm({
            title: '请选择构建学科，并输入要构建的课程',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <span>
                    学科：   
                </span>
                    <Input placeholder={'请输入学科'} onChange={onTextSubjectChange}/>
                </div>
                <div>
                <span>
                    课程：
                </span>
                    <Input placeholder={'请输入课程'} onChange={onTextDomainChange}/>
                </div>
            </>,
            okText: '开始构建',
            cancelText: '取消',
            onOk() {
                setAutoConstructType();
                setCurrentSubjectDomain(subject, domain);
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
        if(e.key!='/construct-page'){
            if(e.key=='./display-page'){
                history.push({pathname:e.key,state:{login:true}});
            }
            else{
                history.push({pathname:e.key,state:{login:true}});
            }
        }
        else{
            onAutoConstructClick();
        }
    };

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
