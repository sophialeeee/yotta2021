import React from 'react';
import classes from './index.module.css';
import { drawTree } from '../../../modules/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import { useState } from 'react';
import YottaAPI from '../../../apis/yotta-api';
import { Card } from 'antd';
const topicsStyle = {
    width: '35%',
    height: '800px',
    overflow: 'auto',
    textAlign: 'center',
};
const treeStyle = {
    width: '50%',
    position: 'absolute',
    left: '40%',
    textAlign: 'center',
    top: '5px'
};

function FacetTree() {

    const { currentSubjectDomain } = useCurrentSubjectDomainModel();

    const [topics, settopics] = useState([]);

    const [treeData, settreeData] = useState();

    const [currentTopic, setcurrentTopic] = useState();

    const onClickTopic = (topicName) => {
        setcurrentTopic(topicName);
    };

    const treeRef = useRef();

    useEffect(() => {
        console.log(currentTopic);
        async function fetchTreeData() {
            const treeData = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
            settreeData(treeData);
        }
        fetchTreeData();
    }, [currentTopic]);


    useEffect(() => {
        if (treeRef && treeData) {
            drawTree(treeRef.current, treeData, d => { });
        }
    }, [treeData])

    useEffect(() => {
        async function fetchTopicsData() {
            const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            settopics(topicsData.map((topic) => topic.topicName));
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
            setcurrentTopic('树状数组');
        }
    }, [])


    return (
        <>
            <Card className={classes.topicsStyle} title="主题列表" style={topicsStyle}>
                {
                    topics.map(
                        (topicName, index) =>
                            (
                                <Card.Grid style={{ width: '100%', height: '80%' }} onClick={onClickTopic.bind(null, topicName)} key={index}>{topicName}</Card.Grid>
                            )
                    )
                }
            </Card>
            <Card title="主题分面树" style={treeStyle}>
                <Card.Grid style={{ width: '100%', height: '730px' }} >
                    <svg ref={ref => treeRef.current = ref} id='tree' style={{ width: '100%', height: '700px' }}>

                    </svg>
                </Card.Grid>
            </Card>


        </>
    );
}

export default FacetTree;
