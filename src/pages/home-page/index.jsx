import React, {useState, useEffect, useRef} from 'react';
import {Col, Row} from "antd";


import Statistic from "./statistic";
import Charts from "./charts";
import cookie from 'react-cookies';
import useConstructTypeModel from '../../models/construct-type';
import useCurrentSubjectDomainModel from "../../models/current-subject-domain";
import useUserNameModel from '../../models/user-name';
import YottaAPI from '../../apis/yotta-api';

import {useLocation} from 'react-router-dom';
import Login from '../Login';
import {useHistory} from 'react-router-dom';
import currentSubjectDomain from '../../models/current-subject-domain';

function HomePage() {
    // hooks
    const [statistics, setStatistics] = useState({
        subject: '-',
        domain: '-',
        topic: '-',
        assemble: '-'
    });

    const [options, setOptions] = useState([]);
    const {setDisplayConstructType} = useConstructTypeModel();
    const {setCurrentSubjectDomain} = useCurrentSubjectDomainModel();
    const {UserName} = useUserNameModel();
    const location = useLocation();
    const history = useHistory();
    useEffect(()=>{
        if(!location.state){
            history.push('/');
        }
    })

    useEffect(() => {
        // 获取数据
        async function fetchData() {
            console.log('userName',UserName)
            var domainsAndSubjects = await YottaAPI.getDomainsBySubject(cookie.load('userInfo'));
            domainsAndSubjects = domainsAndSubjects.data.data;
            // 统计数据
            const subject = domainsAndSubjects.length;
            const domain = domainsAndSubjects.reduce((count, curr) => {
                return count + curr.domains.length
            }, 0);
            const topic = await YottaAPI.getCountTopic();
            const assemble = await YottaAPI.getCountAssemble();
            // 修改状态
            setStatistics({
                subject,
                domain,
                topic,
                assemble
            });
            // 复选框
            setOptions(handleSubjectAndDomainToOptions(domainsAndSubjects));
        }
        fetchData();
        // 这句挪到外边会警告
        setDisplayConstructType();
      
        // 重置学科和课程
        setCurrentSubjectDomain();

    }, []);
    
    

    // function
    /**
     *
     * @param sad api请求的学科和课程
     * @return {*}
     */
    function handleSubjectAndDomainToOptions(sad) {
        return sad.map(subject => {
            return {
                value: subject.subjectName,
                label: subject.subjectName,
                children: subject.domains.map(domain => {
                    if(domain.domainName === '数据结构'){
                        domain.domainName = '数据结构(人工)'
                    }
                    return {
                        value: domain.domainName,
                        label: domain.domainName
                    }
                })
            }
        })
    }




    return (
        <>
        {
            
                <Row>
                <Col span={4} offset={1}>
                    <Statistic statistics={statistics}/>
                </Col>
                <Col span={17} offset={1}>
                    <Charts options={options}/>
                </Col>
            </Row>
                
            
        }
           
        </>

    );
}

export default HomePage;
