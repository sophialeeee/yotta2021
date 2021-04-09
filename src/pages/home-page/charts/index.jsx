import React, {useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Cascader, Modal, Input,Button,Tooltip} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons'

import Gephi from '../../../components/Gephi';

import useConstructModel from '../../../models/construct-type';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import cookie from 'react-cookies';
import YottaAPI from '../../../apis/yotta-api';

import classes from './index.module.css';
import constructType from '../../../models/construct-type';

const {confirm} = Modal;

function Charts(props) {
    const {options} = props;

    // hooks
    const {setAutoConstructType} = useConstructModel();
    const {currentSubjectDomain, setCurrentSubjectDomain} = useCurrentSubjectDomainModel();
    const [gephi, setGephi] = useState(undefined);
    const history = useHistory();

    useEffect(() => {
        async function fetchGephi() {
            const gephi = await YottaAPI.getSubjectGraph('计算机科学');
            console.log('gephi',gephi);
            setCurrentSubjectDomain('计算机科学')
            setGephi(gephi.data.data);
        }
        fetchGephi();
    }, []);

  

    const subjectOptions = options.map(op => {
        return {
            value: op.value,
            label: op.label
        }
    });

   

    const onCascaderSADChange = async (e) => {
        setCurrentSubjectDomain(...e);
        const result = await YottaAPI.getSubjectGraph(e[0]);
        setGephi(result.data.data);
    };

    if(currentSubjectDomain.subject && currentSubjectDomain.domain){
        history.push('./display-page');
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
                cookie.save('c-type','0')
                // ({pathname:'/construct-page',state:{login:true}});
                history.push('/construct-page');
            },
            onCancel() {
                console.log('不构建了');
            }
        })
    };

    return (
        <div className={classes.wrapper}>
            <div>
                <Cascader
                    options={options}
                    expandTrigger={'hover'}
                    changeOnSelect
                    placeholder={'请选择学科和课程'}
                    className={classes.cascader}
                    onChange={onCascaderSADChange}
                    defaultValue={["计算机科学"]}
                    style={{float:'left'}}
                />
               {/* <Button type="text" style={{float:'left'}}></Button> */}
                <Tooltip title="未找到想要课程？">
                <Button type="link" onClick={onAutoConstructClick} style={{float:'left'}}>自动构建</Button>
                </Tooltip>
            </div>
            <div className={classes.chart}>
                {gephi ? <Gephi subjectName={currentSubjectDomain.subject} gephi={gephi}/> : <div>该学科没有图谱</div>}
            </div>

        </div>
    );
}

export default Charts;
