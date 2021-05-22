import React, {useEffect, useState} from 'react';
import {notification, Steps, Row, Col, Modal,Switch,message} from 'antd';
import {useHistory} from 'react-router-dom';

import classes from './index.module.css';

import FacetTree from './facet-tree';
import Assemble from './assemble';
import AssembleFromZero from './assembleFromZero';
import Relation from './relation';
import KnowledgeForest from './knowledge-forest';
import cookie from 'react-cookies';
import useConstructTypeModel from '../../models/construct-type';
import useCurrentSubjectDomainModel from '../../models/current-subject-domain';
import useStepModel from '../../models/construct-step';
import {useLocation} from 'react-router-dom';
const {Step} = Steps;

function ConstructPage() {
    const location = useLocation();
    console.log('loca',location.state);
    // consts
    const infoFinish = () => {
        message.success('开始自动构建')
        };
    const infoStop = () => {
        message.warn('当前步骤构建完毕后自动停止')
        };    
    console.log(cookie.loadAll())
    const stepList = [
        {
            title: '主题分面树构建',
            description: '抽取主题与分面，并组合成树状结构。',
            component: <FacetTree/>
        },  {
            title: '碎片化知识装配',
            description: '将文本及图像等碎片化知识装配到主题分面树上。',
            component: <AssembleFromZero/>
        }, {
            title: '认知关系挖掘',
            description: '挖掘知识主题之间的因果、参考、对比等认知关系。',
            component: <Relation/>
        },{
            title: '知识森林概览',
            description: '实例化的主题分面树与认知关系共同构成知识森林。',
            component: <KnowledgeForest/>
        },
    ];
    const stepList2 = [
        {
        title: '知识森林概览',
        description: '实例化的主题分面树与认知关系共同构成知识森林。',
        component: <KnowledgeForest/>
    },
    {
        title: '主题分面树构建',
        description: '抽取主题与分面，并组合成树状结构。',
        component: <FacetTree/>
    },  {
        title: '认知关系挖掘',
        description: '挖掘知识主题之间的因果、参考、对比等认知关系。',
        component: <Relation/>
    }, {
        title: '碎片化知识装配',
        description: '将文本及图像等碎片化知识装配到主题分面树上。',
        component: <Assemble/>
    },
    ];
    let constructStep = 0; // 当前自动构建到了第几步

    // hooks
    // 当前步骤
    //const [step, setStep] = useState(0);
    // 所有步骤的状态
    const [stepStatus, setStepStatus] = useState(stepList.map(s => 'wait'));
    const history = useHistory();
    const {constructType,setCoolConstructType,setAutoConstructType} = useConstructTypeModel();
    const {currentSubjectDomain} = useCurrentSubjectDomainModel();
    const {step,setStep} = useStepModel();
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
        setStep(0)
    }, []);
    function onChange(checked) {
        
        if(checked){
            setCoolConstructType()
        }else{
            setAutoConstructType();
            infoStop()
        };
    }
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
    useEffect(() => {
        if(constructType==='cool'){
            infoFinish();
            if (localStorage.getItem("visitedTopic")){
               if (localStorage.getItem("visitedRelation")){
                   if(localStorage.getItem('visitedAssemble')){
                        if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                            setStep(0)
                        }else{
                            setStep(3)
                        }
                     }else{
                        if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                            setStep(3)
                        }else{
                            setStep(2)
                        }
                    }
                }else{
                    if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                        setStep(2)
                    }else{
                        setStep(1)
                    }
                }
            }else{
                if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                    if(step!==1)
                    {
                        console.log("在这呢！！！")
                        setStep(1)
                    }
                }else{
                    if(step!==0)
                    {console.log("在这呢！！！")
                        setStep(0)}
                }
            }            
            
        }else{
            ;
        }
    }, [constructType]);
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
        
        localStorage.removeItem('state');//刷新清空状态量
        setStep(current);
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
                        {/* <p>
                            构建模式: {constructType === 'auto' ? '自动构建' : '已有课程'}
                        </p> */}
                        <p>
                            自动构建：
                            <Switch defaultChecked={false} checkedChildren="启用" unCheckedChildren="禁用" onChange={onChange} />
                        </p>
                        
                    </div>
                    <Steps current={step} onChange={onStepChange} direction="vertical" className={classes.steps}>
                        {
                            (cookie.load('c-type')&&cookie.load('c-type')==='1')?
                            (
                                stepList2.map((s, i) => (
                                <Step key={`step_${s.title}`} title={s.title} description={s.description} status={stepStatus[i]}>
                                </Step>))
                            ):(
                                stepList.map((s, i) => (
                                    <Step key={`step_${s.title}`} title={s.title} description={s.description} status={stepStatus[i]}>
                                    </Step>
                            )))
                        }
                    </Steps>
                </Col>
                <Col span={1} className={classes.divider}>
                </Col>
                <Col span={18}>
                    {
                        (cookie.load('c-type')&&cookie.load('c-type')==='1')?
                        (
                            stepList2[step].component
                        ):(
                            stepList[step].component
                        )
                    }
                </Col>
            </Row>
        </>
    );
}

export default ConstructPage;