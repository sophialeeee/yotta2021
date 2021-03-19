import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Cascader, Modal, Input} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons'

import Gephi from '../../../components/Gephi';

import useConstructModel from '../../../models/construct-type';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';

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


    const subjectOptions = options.map(op => {
        return {
            value: op.value,
            label: op.label
        }
    });

    const onAutoConstructClick = () => {
        let subject = '';
        let domain = '';
        const onTextInputChange = (e) => {
            domain = e.target.value;
        };
        const onCascaderChange = (e) => {
            subject = e[0];
        };

        confirm({
            title: '请选择构建学科，并输入要构建的课程',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <span>
                    学科：
                </span>
                    <Cascader
                        options={subjectOptions}
                        placeholder={'请选择学科'}
                        onChange={onCascaderChange}>
                    </Cascader>
                </div>
                <div>
                <span>
                    课程：
                </span>
                    <Input placeholder={'请输入课程'} onChange={onTextInputChange}/>
                </div>
            </>,
            okText: '开始构建',
            cancelText: '取消',
            onOk() {
                setAutoConstructType();
                setCurrentSubjectDomain(subject, domain);
                history.push('/construct-page');
            },
            onCancel() {
                console.log('不构建了');
            }
        })
    };

    const onCascaderSADChange = async (e) => {
        setCurrentSubjectDomain(...e);
        const result = await YottaAPI.getSubjectGraph(e[0]);
        setGephi(result);
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
                />
                <a className={classes.hint} onClick={onAutoConstructClick}>
                   试试自动构建
                </a>
            </div>
            <div className={classes.chart}>
                {gephi ? <Gephi subjectName={currentSubjectDomain.subject} gephi={gephi}/> : <div>该学科没有图谱</div>}
            </div>

        </div>
    );
}

export default Charts;
