import React, {useEffect, useState} from 'react';
import {notification, Steps, Row, Col, Modal} from 'antd';
import {useHistory} from 'react-router-dom';
import {Cascader, Input,Button,Tooltip} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons'

import classes from './index.module.css';

import FacetTree from './facet-tree';
import Assemble from './assemble';
import Relation from './relation';
import KnowledgeForest from './knowledge-forest';
import useConstructModel from '../../models/construct-type';
import useConstructTypeModel from '../../models/construct-type';
import useCurrentSubjectDomainModel from '../../models/current-subject-domain';
import cookie from 'react-cookies';
import {useLocation} from 'react-router-dom';
import { color } from 'echarts/lib/theme/light';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    "//at.alicdn.com/t/font_2482370_44lwu6rmrqx.js",//tree
  ],
});
const {Step} = Steps;

function DisplayPage() {
    const {setCurrentSubjectDomain} = useCurrentSubjectDomainModel();
    const location = useLocation();
    const {confirm} = Modal;
    const {setAutoConstructType} = useConstructModel();
    console.log('loca',location.state);
    // consts
    const stepList = [
        // {
        //     title: '主题分面树构建',
        //     description: '抽取主题与分面，并组合成树状结构。',
        //     component: <FacetTree/>
        // }, {
        //     title: '碎片化知识装配',
        //     description: '将文本及图像等碎片化知识装配到主题分面树上。',
        //     component: <Assemble/>
        // }, {
        //     title: '认知关系挖掘',
        //     description: '挖掘知识主题之间的因果、参考、对比等认知关系。',
        //     component: <Relation/>
        // }, 
        {
            title: '知识森林概览',
            description: '实例化的主题分面树与认知关系共同构成知识森林。',
            component: <KnowledgeForest/>
        },
    ];

    let constructStep = 0; // 当前自动构建到了第几步

    // hooks
    // 当前步骤
    const [step, setStep] = useState(0);
    // 所有步骤的状态
    const [stepStatus, setStepStatus] = useState(stepList.map(s => 'wait'));
    const history = useHistory();
    const {constructType} = useConstructTypeModel();
    const {currentSubjectDomain} = useCurrentSubjectDomainModel();

    useEffect(() => {
        // 如果学科和课程没有选全
        if (!(currentSubjectDomain.subject && currentSubjectDomain.domain)) {
            console.log('history----------------------',history.location)
            Modal.error({
                title: '学科和课程选择有误',
                content: '请重新选择学科和课程！',
                onOk() {
                    history.push({pathname:'/nav',state:{login:true}});
                },
            })
        }

    }, []);

    useEffect(() => {
        let cpyStepStatus = [];
        if (constructType === 'display') {
            cpyStepStatus = stepStatus.map(s => 'finish');
        } else {
            cpyStepStatus = stepStatus.map((s, i) => i < constructStep ? 'finish' : 'wait');
        }
        cpyStepStatus[step] = 'process';
        setStepStatus(cpyStepStatus);
    }, [step]);

    // functions
    const onStepChange = (current) => {
        // if (constructType === 'auto' && current > constructStep) {
        //     notification.warning({
        //         message: '提示',
        //         description: '请等待当前步骤构建完成',
        //         placement: "bottomLeft"
        //     });
        //     return;
        // }
        setStep(current);
    };
    function onAutoConstructClick(){
        let subject = currentSubjectDomain.subject;
        let domain = currentSubjectDomain.domain;
        


        localStorage.removeItem('state');//刷新清空状态量
        
        if(subject&&domain)
            {
                console.log("con",constructType)
                console.log("S&D",subject,domain)
                setAutoConstructType();
                setCurrentSubjectDomain(subject, domain);
                cookie.remove("c-type")
                cookie.save('c-type','1')
                console.log(cookie.loadAll(),'======================================')

            // ({pathname:'/construct-page',state:{login:true}});
                setTimeout(()=>{history.push('/construct-page');},50)
                

        }
           
    };

    return (
        <>
            <Row className={classes.row}>
                <Col span={3} offset={1}>
                    <div className={classes.status}>
                        <p>
                            当前学科: {currentSubjectDomain.subject || '未指定'}
                        </p>
                        <p>
                            当前课程: {currentSubjectDomain.domain || '未指定'}
                        </p>
                        <p>
                            构建模式: {constructType === 'auto' ? '自动构建' : '已有课程'}
                        </p>

                    </div>
                    <Steps current={step} onChange={onStepChange} direction="vertical" className={classes.steps}>
                        {
                            stepList.map((s, i) => (
                                <Step key={`step_${s.title}`} title={s.title} description={s.description} status={stepStatus[i]} icon={<IconFont type="icon-tree" />}>
                                </Step>
                            ))
                        }
                    </Steps>
                    <Button type="link" style={{float:'left',color:'black', padding:'0'}}>对现有构建不满意？</Button>
                    <Button type="default" onClick={onAutoConstructClick} style={{}}>更新知识森林</Button>
                    
                </Col>
                <Col span={1} className={classes.divider}>
                </Col>
                <Col span={18}>
                    {
                        stepList[step].component
                    }
                </Col>
            </Row>
        </>
    );
}

export default DisplayPage;
