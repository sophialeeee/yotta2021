import React, {useState,useEffect} from 'react';
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

    useEffect(() => {
        async function fetchGephi() {
            const gephi = await YottaAPI.getSubjectGraph('计算机科学');
            console.log('gephi',gephi);
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
            </div>
            <div className={classes.chart}>
                {gephi ? <Gephi subjectName={currentSubjectDomain.subject} gephi={gephi}/> : <div>该学科没有图谱</div>}
            </div>

        </div>
    );
}

export default Charts;
