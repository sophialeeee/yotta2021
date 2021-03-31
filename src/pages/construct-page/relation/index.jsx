import React from 'react';
import {Card, Input, Modal} from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawMap} from '../../../modules/topicDependenceVisualization';
import { useRef } from 'react';
import {DeleteOutlined, ExclamationCircleOutlined,PlusOutlined} from '@ant-design/icons';

function Relation() {

    const {currentSubjectDomain} = useCurrentSubjectDomainModel();
    var [data,setdata] =  useState([]);
    // var [dataTemp,setdataTemp] =  useState([]);
    const [data1,setdata1] = useState();
    var [deleteTopicStart,setDeleteTopic1] = useState();
    var [deleteTopicEnd,setDeleteTopic2] = useState();
    const [mapdata,setmapdata] = useState();
    const {confirm} = Modal;
    var [learningPath,setlearningPath] = useState([]);
    var topicInsertRef1 = useRef('');
    var topicInsertRef2 = useRef('');
    var [insertTopic1,setinsertTopic1] = useState();
    var [insertTopic2,setinsertTopic2] = useState();
    // const {TextArea} = Input;
    const columns = [
        {
            title:'主题一',
            dataIndex:'主题一',
            key:'主题一',
            align:'center',
           
        },
        {
            title:'主题二',
            dataIndex:'主题二',
            key:'主题二',
            align:'center',
            // render:text => <a>{text}</ a>,
        }
    ]
    // const relationStyle = {
    //     width: '40%',
    //     position: 'absolute',
    //     left: '0%',
    //     textAlign: 'center',
    //     top: '5px',
    //     height: '800px'
    // };
    const relationStyle = {
        width: '35%',
        height: '800px',
        overflow: 'auto',
        textAlign: 'center',
    }
    const listStyle = {
        width: '100%', 
        height: '80%',
        opacity:1
    }
    const mapStyle = {
        width:'55%',
        position:'absolute',
        right:'0%',
        textAlign:'center',
        top:'5px'
    }
    var [relationData,setrelationData] = useState();
    // var [relationPart,setrelationPart] = useState();
    // var [maxShow,setmaxShow] = useState();
    // 设置依赖列表的格式
    const tableStyle = { 
        width:'100%',
        // height:'700px',
    }

    const mapRef = useRef();
    const treeRef = useRef();

    const handleTextareaChange1= (e)=>{
        topicInsertRef1.current = e.target.value;
    }
    const handleTextareaChange2= (e)=>{
        topicInsertRef2.current = e.target.value;
    }

    useEffect(()=>{
        async function fetchrelationData(){
            await YottaAPI.getDependences(currentSubjectDomain.domain).then(
                res=>setrelationData(res)
            )
        }
        fetchrelationData();
    },[currentSubjectDomain.domain])
    
    useEffect(()=>{
        if(relationData){
            // setmaxShow(1);
            console.log('relationData', relationData);
            // setrelationPart(relationData.slice(0, maxShow));
            setrelationData(relationData);
            relationData.map((relation,index)=>{
                data.push({'key':String(index+1),'主题一':relation.startTopicName,'主题二':relation.endTopicName})

            })
            // console.log('dataTemp', dataTemp)
            // for (var maxShow = 0; maxShow <= relationData.length; 1){
                setdata(data.slice(-relationData.length));
                setdata1(data[0]);
                console.log('data', data);
            // }
        }
    },[relationData])


    const onDeleteRelation = (relationOne, relationTwo, e) => {
        confirm({
            title: '确定删除关系吗？',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                setDeleteTopic1(relationOne); 
                console.log('relationOne',deleteTopicStart);
                setDeleteTopic2(relationTwo); 
                console.log('relationTwo',deleteTopicEnd);
            },
            onCancel() {
            }
        })
    }; 
    const onInsertRelation = (relationOne, relationTwo, e) => {
        confirm({
            title: '请输入两个主题的名称',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <Input placeholder="主题一" onChange={handleTextareaChange1 } style={{marginBottom: 5}}/>
                <Input placeholder="主题二" onChange={handleTextareaChange2} />
                {/* <TextArea showCount maxLength={20} onChange={handleTextareaChange1}/>
                <TextArea showCount maxLength={20} onChange={handleTextareaChange2}/> */}
            </>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const Topic1 = topicInsertRef1.current;
                handleTextareaChange1.current = '';
                const Topic2 = topicInsertRef2.current;
                handleTextareaChange2.current = '';
                setinsertTopic1(Topic1); 
                console.log('Topic1',Topic1);
                setinsertTopic2(Topic2); 
                console.log('Topic2',Topic2);
                
            },
            onCancel() {
                
            }
        })
    }; 

    useEffect(()=>{
        async function insertRelation(){
            await YottaAPI.insertRelation(currentSubjectDomain.domain, insertTopic1, insertTopic2);
            const res = await YottaAPI.getDependences(currentSubjectDomain.domain);
            setrelationData(res);
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if(res.data&&mapRef){
                    // console.log('res.data',res.data);
                    drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,() => {}, () => {});}
                }
            ) 
        }
        if(insertTopic1){
            insertRelation(insertTopic1, insertTopic2);
        }
    },[insertTopic1]) 

    useEffect(()=>{
        async function deleteRelation(){
            await YottaAPI.deleteRelation(currentSubjectDomain.domain,deleteTopicStart, deleteTopicEnd);
            const res = await YottaAPI.getDependences(currentSubjectDomain.domain);
            setrelationData(res);
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if(res.data&&mapRef){
                    // console.log('res.data',res.data);
                    drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,() => {}, () => {});}
                }
            ) 
        }
        if(deleteTopicStart){
            console.log('useEffect:', deleteTopicStart, deleteTopicEnd)
            deleteRelation(deleteTopicStart, deleteTopicEnd);
            // console.log('deleteTopicEnd',deleteTopicEnd);
            setDeleteTopic1(); 
            setDeleteTopic2(); 
            // console.log('deleteTopicEnd',deleteTopicEnd);
        }
    },[deleteTopicStart]) 

    // 画认知关系图
    useEffect(()=>{
        async function fetchDependencesMap(){
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if(JSON.stringify(res.data.topics)=='{}'){
                        alert("该课程下无依赖关系！");
                    }
                    else if(res.data&&mapRef){
                    console.log('res.data',res.data);
                    drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,() => {}, () => {});}
                }
            )
        }
        fetchDependencesMap();
        
    },[currentSubjectDomain.domain])
    
    return (
        <>
        <Card extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertRelation}/>} title="认知关系挖掘" style={relationStyle}>
                {
                    data.map(
                        (relation, index) =>
                            (
                                <Card.Grid  style={listStyle} key={index}>
                                    {/* <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={onDeleteRelation(relation)}> */}
                                        {relation['主题一']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;---------&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{relation['主题二']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <button class="ant-btn ant-btn-ghost ant-btn-circle-outline ant-btn-sm" onClick={onDeleteRelation.bind(null, relation['主题一'], relation['主题二'])} style={{position: 'absolute', right:'5%'}}>
                                            <DeleteOutlined />
                                        </button>
                                        {/* </Popconfirm> */}
                                </Card.Grid>
                            )
                    )
                }
        </Card>
        {/* <Card  extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertTopic}/>} title="主题列表" style={topicsStyle}>
                {
                    topics.map(
                        (topicName, index) =>
                            (
                                <Card.Grid style={{ width: '100%', height: '80%',opacity:1}} onClick={onClickTopic.bind(null, topicName)} key={index}>{topicName}</Card.Grid>
                            )
                    )
                }
            </Card> */}
        <Card title="知识森林概览" style={mapStyle}>
                <div style={{ width: '100%', height: '680px' }} >
                    <svg ref={ref => mapRef.current = ref} id='map' style={{ width: '100%',height:'100%' }}></svg>
                         <svg ref={ref=>treeRef.current = ref} id='tree' style={{position:'absolute',left:'-0',marginLeft: 0,marginTop: 56}}></svg>
                    
                </div>
            </Card>
        </>
    );
}

export default Relation;
