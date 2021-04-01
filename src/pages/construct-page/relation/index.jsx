import React from 'react';
import {Card, Input, Modal, message} from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawMap} from '../../../modules/topicDependenceVisualization';
import { useRef } from 'react';
import {ConsoleSqlOutlined, DeleteOutlined, ExclamationCircleOutlined,PlusOutlined} from '@ant-design/icons';
import Gephi from '../../../components/Gephi';
import classes from './index.module.css';

function Relation() {

    const {currentSubjectDomain} = useCurrentSubjectDomainModel();
    var [data,setdata] =  useState([]);
    var [dataTemp,setdataTemp] =  useState([]);
    // var [dataTemp,setdataTemp] =  useState([]);
    const [data1,setdata1] = useState();
    const [firstTime,setfirstTime] = useState();
    // setfirstTime(1);
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
    const infoFinish = () => {
        message.success('关系构建成功，已全部展示！')
    };
    const infoDelete = () => {
        message.success('关系删除成功！')
    };
    const infoInsert = () => {
        message.success('关系插入成功！')
    };
    const infoAlert = () => {
        message.error('该主题关系已存在！')
    };
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
    const countStyle1 = {
        width:'35%',
        position:'absolute',
        // left:'20%',
        textAlign:'center',
        top:'5px',
        lineHeight:'10px',
    }
    const countStyle2 = {
        width:'16%',
        position:'absolute',
        left:'10px',
        textAlign:'center',
        top:'5px',
        lineHeight:'10px',
    }
    const relationStyle = {
        width: '35%',
        top: '120px',
        height: '680px',
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
    const [gephi, setGephi] = useState(undefined);
    // var firstTime = 1;
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
                dataTemp.push({'key':String(index+1),'主题一':relation.startTopicName,'主题二':relation.endTopicName})

            })
            dataTemp = dataTemp.slice(-relationData.length)
            // console.log('dataTemp', dataTemp)
            // for (var maxShow = 0; maxShow <= relationData.length; 1){
            // setdata(data.slice(-relationData.length));
            if (dataTemp[0]['主题一'] === insertTopic1 && dataTemp[0]['主题二'] === insertTopic2){
                console.log("Nothing");
            }else{
                for (var i=1; i < relationData.length; i++){
                    if (dataTemp[i]['主题一'] === insertTopic1 && dataTemp[i]['主题二'] === insertTopic2){
                        var dataChange = dataTemp[0];
                        dataTemp[0] = dataTemp[i];
                        dataTemp[i] = dataChange;
                    }
                };
            };
            // console.log("SubjectName:", currentSubjectDomain.subject);
            setdata1(dataTemp);
            // console.log('data', data);
            // }
        }
    },[relationData])

    useEffect(()=>{
        if(data1) {
            // console.log("firstTime", firstTime);
            if (firstTime){
                setdata(data1);
                console.log("This is not the first time!")
            }else{
                var num = 1;
                var maxlength = data1.length;
                // setdata(data1.slice(-relationData.length));
                const timer = setInterval(() => {
                    setdata(data1.slice(0, num));
                    num = num + 1;
                    if (num === maxlength + 1) {
                        infoFinish();
                        clearInterval(timer);
                        setfirstTime(data);
                        console.log("This is the first time!");
                    }
                }, 200);
            }
        }
    },[data1])

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
                if (insertTopic1 === Topic1 && insertTopic2 === Topic2){
                    setinsertTopic1("###"); 
                }else{
                    setinsertTopic1(Topic1); 
                    console.log('Topic1',Topic1);
                    setinsertTopic2(Topic2); 
                    console.log('Topic2',Topic2);
                }
            },
            onCancel() {
                
            }
        })
    }; 

    function emptyChildren(dom) {
        const children = dom.childNodes;
        console.log('children',children);
        while (children.length > 0) {
            dom.removeChild(children[0]);
        }
    };
    // const onCascaderSADChange = async (e) => {
    //     setCurrentSubjectDomain(...e);
    //     const result = await YottaAPI.getSubjectGraph(currentSubjectDomain);
    //     setGephi(result);
    // };

    useEffect(()=>{
        async function insertRelation(){
            const response = await YottaAPI.insertRelation(currentSubjectDomain.domain, insertTopic1, insertTopic2);
            // console.log("Responsedata", response)
            if (response){
                infoInsert();
            }else{
                if (insertTopic1 === "***"){
                }else{
                    infoAlert();
                };
            };
            const res = await YottaAPI.getDependences(currentSubjectDomain.domain);
            setrelationData(res);
            emptyChildren(mapRef.current);
            emptyChildren(treeRef.current);
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if(res.data&&mapRef){
                    // console.log('res.data',res.data);
                    drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,() => {}, () => {});}
                }
            )
            // const result = await YottaAPI.getDomainGraph(currentSubjectDomain.domain);
            // setGephi(result);
        }
        if(insertTopic1){
            insertRelation(insertTopic1, insertTopic2);
        }
    },[insertTopic1, insertTopic2]) 

    useEffect(()=>{
        async function deleteRelation(){
            const response = await YottaAPI.deleteRelation(currentSubjectDomain.domain, deleteTopicStart, deleteTopicEnd);
            if (response){
                infoDelete();
            };
            const res = await YottaAPI.getDependences(currentSubjectDomain.domain);
            setrelationData(res);
            emptyChildren(mapRef.current);
            emptyChildren(treeRef.current);
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if(res.data&&mapRef){
                    // console.log('res.data',res.data);
                    drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,() => {}, () => {});}
                }
            ) 
            // const result = await YottaAPI.getDomainGraph(currentSubjectDomain.domain);
            // setGephi(result);
        }
        if(deleteTopicStart){
            console.log('useEffect:', deleteTopicStart, deleteTopicEnd)
            deleteRelation(deleteTopicStart, deleteTopicEnd);
            if (insertTopic1 === deleteTopicStart && insertTopic2 === deleteTopicEnd){
                setinsertTopic1("***"); 
            };
            setDeleteTopic1();
        }
    },[deleteTopicStart, deleteTopicEnd]) 

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
            // const result = await YottaAPI.getDomainGraph(currentSubjectDomain.domain);
            // setGephi(result);
        }
        fetchDependencesMap();
        
    },[currentSubjectDomain.domain])
    
    return (
        <>
        <Card title="主题关系数量统计" style={countStyle1}>
            <Card.Grid style={{ width: '100%', height: '50px' }} >
                关系个数：   <span style={{ color: 'red', fontWeight: 'bolder' }}>{data.length}</span>
            </Card.Grid>
        </Card>
        {/* <Card title="新增主题关系数量统计" style={countStyle1}>
            <Card.Grid style={{ width: '100%', height: '50px' }} >
                关系个数：   <span style={{ color: 'red', fontWeight: 'bolder' }}>{data.length}</span>
            </Card.Grid>
        </Card> */}
        <Card extra={<PlusOutlined style={{top: '50px'}} onClick={onInsertRelation} />} title="认知关系挖掘" style={relationStyle}>
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
                <svg ref={ref => treeRef.current = ref} id='tree' style={{position:'absolute',left:'-0',marginLeft: 0,marginTop: 56}}></svg>
                {/* <div className={classes.chart}>
                    {gephi ? <Gephi subjectName={currentSubjectDomain.domain} gephi={gephi}/> : <div>该学科没有图谱</div>}
                </div> */}
            </div>
        </Card>
        </>
    );
}

export default Relation;
