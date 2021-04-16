import React from 'react';
import { drawTree,drawTreeNumber } from '../../../../modules/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../../models/current-subject-domain';
import { useState } from 'react';
import YottaAPI from '../../../../apis/yotta-api';
import {ExclamationCircleOutlined,PlusOutlined,DeleteOutlined, CompassOutlined} from '@ant-design/icons';
import { Card,Descriptions,Input,message,Modal, Select } from 'antd';
import {Menu,Dropdown,Button,notification,Alert} from 'antd';
import ReactDOM from 'react-dom'


const topicsStyle = {
    width: '35%',
    height: '800px',
    top:'120px',
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
const countStyle1 = {
  width:'25%',
  position:'absolute',
  // left:'20%',
  textAlign:'center',
  top:'5px',
  lineHeight:'10px',
}
const stopStyle={
    width:'9%',
    position:'absolute',
    left:'26%',
    textAlign:'center',
    top:'53px',
    lineHeight:'9px'
}

const {TextArea} = Input;
const {confirm} = Modal;

function BatchConstruct() {
    console.log('程序处于批量更新页面')
    const { currentSubjectDomain } = useCurrentSubjectDomainModel();
    const [topics, settopics] = useState([]);
    const [topicsData,settopicsData] = useState();
    const [currentTopic, setcurrentTopic] = useState();
    const [treeData, settreeData] = useState();
    const textareaValueRef = useRef('');
    const [insertTopic1,setinsertTopic1] = useState();
    const {confirm} = Modal;
    const {TextArea} = Input;
    const resultTree = useRef();
    const [assembles,setassembles] = useState();
    const [topiclength, settopiclength] = useState();  //判断topic列表长度
    const [deleteTopic1,setdeleteTopic1] = useState();
    const [deleteTopic2,setdeleteTopic2] = useState();

    const [insertFacet1,setinsertFacet1] = useState();
    const [topicName2,settopicName2] = useState();
    const [firstTime,setfirstTime] = useState();
    const [batchData,setbatchData] = useState([]);

    var [topicData, settopicData] = useState();
    var [batchConstruct, setbatchConstruct] = useState();
    var [stop,setstop] = useState();
    var [stopCommand,setstopCommand] = useState();

    var [data, setdata] = useState([]);
    // var [dataTemp,setdataTemp] = useState();
    var flag;
    // window.lock = false;
    const handleTextareaChange= (e)=>{
        textareaValueRef.current = e.target.value;
    }
    // 将请求的状态码设置为全局状态
    const statusCode = useRef();
   
    const infoFinish = () => {
    message.success('主题构建成功，已全部展示！')
    };
    const infoDelete = () => {
    message.success('主题删除成功！')
    };
    const infoInsert = () => {
    message.success('主题插入成功！')
    };

    useEffect(() => { // 就这样改得了
        console.log(document.querySelector(`#topicitem-${topics[0]}`));
    }, [topics])
    
    function emptyChildren(dom) {
        const children = dom.childNodes;
        while (children.length > 0) {
            dom.removeChild(children[0]);
        }
    };

    const onBatchStop = () =>{
        confirm({
            title:'是否确定暂停批量构建？',
            okText:'确定',
            cancelText:'取消',
            onOk(){
                setbatchData(batchData);
                console.log('未构建主题',batchData);
                setstop(batchData[0]);
                console.log('停止主题',stop);
                var stopCommand1 = false;
                setstopCommand(stopCommand1);
                console.log(stopCommand);
            }
        })
    }

    // 暂停批量构建
    useEffect(()=>{
        setcurrentTopic();
    },[stop])

    const onBatchContinue = () =>{
        confirm({
            title:'是否确定继续批量构建？',
            okText:'确定',
            cancelText:'取消',
            onOk(){
                setbatchData(batchData);
                console.log('未构建主题',batchData);
                var stopCommand2 = true;
                setstopCommand(stopCommand2);
                console.log(stopCommand);
                setcurrentTopic(batchData[0]);
            }
        })
    }

    //继续批量构建
    useEffect(()=>{
        // setcurrentTopic(batchData[0]);
    })

    const onInsertTopic = () => {
        confirm({
            title: '请输入主题名称',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <TextArea showCount maxLength={100} onChange={handleTextareaChange}/>
            </>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const Topic1 = textareaValueRef.current;
                textareaValueRef.current = '';
                setinsertTopic1(Topic1); 
                console.log('Topic1',Topic1);
                
            },
            onCancel() {
        
            }
        })
    };

    // 插入主题
    useEffect(()=>{
        async function insert(){
            await YottaAPI.insertTopic(currentSubjectDomain.domain,insertTopic1);
        }
        if(insertTopic1){
            insert(insertTopic1);
        }
    },[insertTopic1]) 
    const treeRef = useRef();
    
    useEffect(()=>{
        setcurrentTopic(topics[0]);
        console.log('currentTopic',currentTopic);
    },[topics])

    // useEffect(()=>{
    //     var stopCommand = 'True'
    //     setstopCommand(stopCommand);
    //     console.log(stopCommand);
    // },[topics])

    // useEffect(()=>{
    //     emptyChildren(treeRef.current) 
    //     setcurrentTopic(topics[i])
    // },[i])

    useEffect(() => {  
        const topicNode = document.getElementById(`topicitem-${currentTopic}`);
        console.log('topicNode',topicNode)
        if(topicNode){
            console.log("style",topicNode.style)
            let my = setInterval(() => {
               let opacity = topicNode.style.opacity;
               topicNode.style.opacity = 1-(+opacity||0)
               topicNode.style.color = 'red';     
            }, 500);
            var myvar1 = setInterval(
            async function fetchTreeData() {
             if(currentSubjectDomain.domain && currentTopic) {
                //  const result = await YottaAPI.getDynamicTreeData(currentSubjectDomain.domain,currentTopic,true);
                const result = await YottaAPI.getDynamicMulti(currentSubjectDomain.domain,currentTopic);
                resultTree.current = result;
                //  const result = resultTree.current;
                //  console.log('resulttttttt',result);
                 if(result){
                    console.log('result.code',result.code);
                    if(result.code == 200 ){
                       emptyChildren(treeRef.current)
                       topicNode.style.opacity = 1
                       topicNode.style.color = 'green'
                         clearInterval(myvar1);
                         clearInterval(my)
                    }  
                 }
             }
             else{
                 clearInterval(myvar1);
             }
           },10000)
        }
        
       
        var myvar = setInterval(
                    async function fetchTreeData() {
                     if(currentSubjectDomain.domain && currentTopic && stopCommand){
                        //  const result = await YottaAPI.getDynamicTreeData(currentSubjectDomain.domain,currentTopic,true);
                        //  const result = await YottaAPI.getDynamicMulti(currentSubjectDomain.domain,currentTopic); 
                        // resultTree.current = result;
                        // console.log(resultTree.current)
                        // console.log('stopCommand');
                         const result = resultTree.current;
                         if(result){
                            const treeData = result.data;
                            console.log('result.code',result.code);
                            statusCode.current = result.code
                            console.log('statusCode',statusCode.current);
                            const topicNode = document.getElementById(`topicitem-${currentTopic}`);
                            if(result.code === 200 && topicNode.style.color== 'green'){
                               clearInterval(myvar);
                               //   let j = i+1; 
                               //   seti(j);
                               emptyChildren(treeRef.current);
                               const index = topics.indexOf(currentTopic);
                               setbatchData(topics.slice(index+1));
                               console.log('restTopics', batchData);
                               (index < topics.length) && (setcurrentTopic(topics[index+1])); 
                               
                            }
                            settreeData(treeData);
                         }
                         
                     }
                     else{
                         clearInterval(myvar);  
                     }  
        },1000)
    }, [currentTopic]);

    // 画分面树
    useEffect(() => {
        if (treeRef && treeData) {
            if(treeData.childrenNumber == 0){
                emptyChildren(treeRef.current); 
                console.log('该主题下暂无数据');    
            }
            else{
                if(treeRef.current.childNodes.length === 0 && statusCode.current !== 200){
                    console.log('调用drawTree函数')
                    drawTree(treeRef.current,treeData,d => { });
                 }
                 else if(treeRef.current.childNodes.length !== 0){
                    console.log('调用drawTreeNumber函数')
                    drawTreeNumber(treeRef.current, treeData, d => { });
                    if(statusCode.current === 200){
                        console.log('laaaaaaaaaaaaaaaaaa')
                       // emptyChildren(treeRef.current)
                    }
                 }
                 else{

                 }
            }
        }
    }, [treeData])
 
    // 获取一个课程下所有的主题数据
    // useEffect(() => {
    //     async function fetchTopicsData() {
    //         const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
    //         const topicsData = res.data.data;
    //         //const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
    //         settopicsData(topicsData);
    //         if(topicsData){
    //             dataTemp = (topicsData.map((topic) =>topic.topicName
    //             ));
    //             let topics = topicsData.map((topic) => topic.topicName);
    //             console.log('qianqianqian',topics)
    //             topics = topics.filter((topic)=>topic!='B+树')
    //             console.log('houhouhou',topics)
    //             settopics(topics)
    //         }
    //         console.log('dataTemp',dataTemp);
    //         setdata1(dataTemp.slice(-topics.length));
    //     }
    //     if (currentSubjectDomain.domain) {
    //         fetchTopicsData();
    //     }
    // }, [insertTopic1, deleteTopic2])

    useEffect(() => {
        async function fetchTopicsData() {
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            const topicsData = res.data.data;
            settopicsData(topicsData);
            if(topicsData){
                let topics = topicsData.map((topic) => topic.topicName);
                console.log('qianqianqian',topics)
                topics = topics.filter((topic)=>topic!='B+树')
                console.log('houhouhou',topics)
                settopics(topics)
                setbatchData(topics)
               // settopics(topicsData.map((topic) => topic.topicName));
            }
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
        }
    }, [insertTopic1])

    // useEffect(()=>{
    //     if(data1) {
    //         // console.log("firstTime", firstTime);
    //    if (localStorage.getItem("visitedTopic")) {
    //             setdata(data1);
    //             console.log("This is not the first time!")
    //         }else{
    //     localStorage.setItem("visitedTopic", "yes")
    //             var num = 1;
    //             var maxlength = data1.length;
    //             // setdata(data1.slice(-relationData.length));
    //             const timer = setInterval(() => {
    //                 setdata(data1.slice(0, num));
    //                 num = num + 1;
    //                 if (num === maxlength + 1) {
    //                     infoFinish();
    //                     clearInterval(timer);
    //         setfirstTime(data1);
    //                     console.log("This is the first time!");
    //         // console.log("firstTime", firstTime);
    //                 }
    //             }, 100);
    //         }
    //     }
    // },[data1])



    useEffect(() => {
        if (statusCode.code == 200) {
            Modal.info({
                title: '提示',
                content: '该课程主题分面树构建完毕',
            })
        }

    }, []);
    
   
    return (
        <>
        <Card style={stopStyle}>
                <Button shape='circle' style={{ position:"absolute", left:'5%',top:'20%' }}>
                    <a onClick={onBatchStop}>暂停</a>
                </Button>
                <Button shape='circle' style={{ position:"absolute", right:'5%',top:'20%' }}>
                    <a onClick={onBatchContinue}>继续</a>
                </Button>
        </Card>
      <Card title='已构建主题数量统计' style={countStyle1}>
        <Card.Grid style={{ width: '100%', height: '50px' }}>
          已经主题个数： <span style={{color:'red', fontWeight:'bolder'}}>{topics.length-batchData.length}</span>
        </Card.Grid>
      </Card>
            <Card  extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertTopic}/>} title="主题列表" style={topicsStyle}>
                {
                    topics.map(
                        (topicName, index) =>
                            (
                                <Card.Grid style={{ width: '100%', height: '80%',opacity:1}} id={`topicitem-${topicName}`} key={index}>{topicName}</Card.Grid>
                            )
                    )

                }
            </Card>
        <Card extra={<PlusOutlined style={{ top: '50px' }} />} title="主题分面树" style={treeStyle}>
        <Card.Grid style={{ width: '100%', height: '850px' }} >
                    <svg ref={ref => treeRef.current = ref} id='tree' style={{ width: '100%', height: '700px' }}>
                    </svg>
                </Card.Grid>
            </Card>


        </>
    );
}

export default BatchConstruct;
