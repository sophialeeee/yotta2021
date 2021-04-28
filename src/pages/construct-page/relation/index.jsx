import React from 'react';
import {Card, Input, Modal, message, Select} from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawMap} from '../../../modules/topicDependenceVisualization';
import { useRef } from 'react';
import {ConsoleSqlOutlined, DeleteOutlined, ExclamationCircleOutlined,PlusOutlined} from '@ant-design/icons';
import Gephi from '../../../components/Gephi';
import classes from './index.module.css';
import cookie from 'react-cookies';
import useStepModel from '../../../models/construct-step';
import useConstructTypeModel from '../../../models/construct-type';
function Relation() {
    const {step,setStep} = useStepModel();
    const {currentSubjectDomain} = useCurrentSubjectDomainModel();
    const [topicsData, settopicsData] = useState();
    var [data,setdata] =  useState([]);
    var [dataTemp,setdataTemp] =  useState([]);
    const [data0,setdata0]=useState(0);
    const {constructType} = useConstructTypeModel();
    // var [dataTemp,setdataTemp] =  useState([]);
    const [data1,setdata1] = useState();
    const [firstTime,setfirstTime] = useState(0);
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
    const TopicEdit = 'yes';
    const RelationEdit = 'yes';
    const FacetEdit = 'yes';

    // var isEnglish = new Boolean(false);
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
        message.error('主题不存在或该主题关系已存在！')
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
        width:'42%',
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
        width: '42%',
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
        width:'56%',
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
    // localStorage.removeItem('state');//刷新清空状态量
    // 获得该课程下的所有主题
    useEffect(() => {
        async function fetchTopicsData() {
            var res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            // var topicsData = res.data.data;
            //const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            settopicsData(res.data.data);
            // if(topicsData){
            //     settopics(topicsData.map((topic) =>topic.topicName));
            // }
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
        }
    },[currentSubjectDomain.domain])

    useEffect(()=>{
        async function fetchrelationData(){
            await YottaAPI.generateDependences(currentSubjectDomain.domain, nameCheck(currentSubjectDomain.domain).isEnglish).then(
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
            if (localStorage.getItem("visitedRelation")){
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
                        localStorage.setItem("visitedRelation", "yes")
                        infoFinish();
                        clearInterval(timer);
                        setfirstTime(1);
                        setdata0(1)
                        // if(constructType=='cool')
                        // {if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                        //     setStep(3)
                        // }else{
                        //     setStep(2)
                        // }}
                        console.log("This is the first time!");
                    }
                }, 150);
            }
        }
    },[data1])
    useEffect(()=>{
        if(constructType=='cool'&&firstTime===1)
        {if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
            setStep(3)
        }else{
            setStep(2)
        }}
    },[data0])
    function nameCheck(originName) {
        var tempName = originName;
        if (originName.search('\\+') != -1){
            console.log("tempName", tempName);
            tempName = originName.replace("+", "jiahao");
            console.log("tempName", tempName);
        };
        var english_name = /^[a-zA-Z]+$/.test(originName);
        // if (topicName.search('\\(') != -1){
        //     tempName = topicName.replace("(", " (");
        // };
        return {
            checkedName: tempName,
            isEnglish: english_name
        }
    }
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

    // console.log("currentSubjectDomainTopics", topicsData);
    const onInsertRelation = (relationOne, relationTwo, e) => {
        confirm({
            title: '请选择认知关系的头主题和尾主题',
            icon: <ExclamationCircleOutlined/>,
            content: <>
            {(topicsData)?(
                    <Select 
                        showSearch 
                        placeholder="请选择头主题(可搜索)" 
                        optionFilterProp="children"   
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        } 
                        onSelect={onSelectTopic1} 
                        style={{width: 280, marginBottom: 10}}
                    >
                        {
                            topicsData.map((topic)=>(
                            <option value={topic.topicName} >{topic.topicName}</option> 
                            ))
                        }
                    </Select>):
                <Input placeholder="头主题 若有括号请使用英文括号并在括号前加上空格" onChange={handleTextareaChange1} style={{marginBottom: 10}}/>}
            {(topicsData)?(
                    <Select 
                        showSearch 
                        placeholder="请选择尾主题(可搜索)" 
                        optionFilterProp="children"   
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        } 
                        onSelect={onSelectTopic2} 
                        style={{width: 280}}
                    >
                    {
                        topicsData.map((topic)=>(
                        <option value={topic.topicName} >{topic.topicName}</option> 
                        ))
                    }
                </Select>):
                <Input placeholder="尾主题 若有括号请使用英文括号并在括号前加上空格" onChange={handleTextareaChange2}/>}
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
    const onSelectTopic1 = (e) => { 
        topicInsertRef1.current = e
    }
    const onSelectTopic2 = (e) => { 
        topicInsertRef1.current = e
    }
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

            const response = await YottaAPI.insertRelation(currentSubjectDomain.domain, nameCheck(insertTopic1).checkedName, nameCheck(insertTopic2).checkedName);
            // console.log("Responsedata", response)
            if (response){
                infoInsert();
            }else{
                if (insertTopic1 === "***"){
                }else{
                    infoAlert();
                };
            };
            const res = await YottaAPI.generateDependences(currentSubjectDomain.domain, nameCheck(currentSubjectDomain.domain).isEnglish);
            setrelationData(res);
            emptyChildren(mapRef.current);
            emptyChildren(treeRef.current);
            await YottaAPI.generateMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if(res.data&&mapRef&&mapRef.current){
                    // console.log('res.data',res.data);
                    drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,() => {}, () => {},() => {},() => {},() => {},() => {},(a,b) => {
                        onDeleteRelation( a, b);
                        console.log("deleting");
                    },'no','yes','no',()=>{},()=>{});}
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

            const response = await YottaAPI.deleteRelation(currentSubjectDomain.domain, nameCheck(deleteTopicStart).checkedName, nameCheck(deleteTopicEnd).checkedName);
            if (response){
                infoDelete();
            };
            const res = await YottaAPI.generateDependences(currentSubjectDomain.domain, nameCheck(currentSubjectDomain.domain).isEnglish);
            setrelationData(res);
            emptyChildren(mapRef.current);
            emptyChildren(treeRef.current);
            await YottaAPI.generateMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if(res.data && mapRef){
                    // console.log('res.data',res.data);
                    drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,() => {}, () => {},() => {},() => {},() => {},() => {},(a,b) => {
                        onDeleteRelation( a, b);
                        console.log("deleting2");
                    },'no','yes','no',()=>{},()=>{});}
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
            await YottaAPI.generateMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if(JSON.stringify(res.data.topics)=='{}'){
                        alert("该课程下无依赖关系！");
                    }
                    else if(res.data&&mapRef){
                    console.log('res.data',res.data);
                    drawMap(res.data, mapRef.current, treeRef.current,currentSubjectDomain.domain,learningPath,
                        () => {}, () => {},() => {},() => {},() => {},() => {},(a,b) => {
                        onDeleteRelation(a, b);
                        console.log("deleting3")
                    },'no','yes','no',()=>{},()=>{});}
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
                <svg ref={ref => treeRef.current = ref} id='tree' style={{position:'absolute',left:'-0',marginLeft: 22,marginTop: 65}}></svg>
                {/* <div className={classes.chart}>
                    {gephi ? <Gephi subjectName={currentSubjectDomain.domain} gephi={gephi}/> : <div>该学科没有图谱</div>}
                </div> */}
            </div>
        </Card>
        </>
    );
}

export default Relation;
