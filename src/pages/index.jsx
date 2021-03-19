import React, {useEffect, useState} from 'react';
import {Layout, Menu} from 'antd';
import {useHistory, Switch, Route, useLocation} from 'react-router-dom';


import classes from './index.module.css'

import HomePage from './home-page';
import ConstructPage from './construct-page';
import CONSTS from "../constants";
import Login from './Login';
import DisplayPage from './display-page';

const {Header, Content, Footer} = Layout;

function App() {

   
    
    // data
    const menuList = [
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

    // hooks
    const history = useHistory();
    const location = useLocation();
    const [menuKey, setMenuKey] = useState('/nav');
    
    //functions
    const onMenuItemClick = (e) => {
        history.push(e.key);
    };

    useEffect(() => {
        setMenuKey(location.pathname);
    }, [location]);

    return (
        <Layout className={classes.layout}>
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
            </Header>
            <Content>

                <Switch>
                    <Route exact path ={'/'} component={Login}></Route>
                {
                        menuList.map(ml => (
                            <Route key={ml.key} exact path={ml.key} component={ml.component}/>
                        ))
                    }  
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
