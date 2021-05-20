import React from 'react';
// import { drawTree,drawTreeNumber } from '../../../../modules/facetTree';
import { drawTree,drawTreeNumber,drawTreeDel } from '../../../../modules/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../../models/current-subject-domain';
import { useState } from 'react';
import YottaAPI from '../../../../apis/yotta-api';
import {ExclamationCircleOutlined,PlusOutlined,DeleteOutlined, CompassOutlined} from '@ant-design/icons';
import { Card,Descriptions,Input,message,Modal, Select } from 'antd';
import {Menu,Dropdown,Button,notification,Alert} from 'antd';
import ReactDOM from 'react-dom'
import cookie from 'react-cookies';
import useConstructTypeModel from '../../../../models/construct-type';
import useStepModel from '../../../../models/construct-step';

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
    message.config({
        duration: 2,
    });
    console.log('程序处于批量更新页面')
    const { currentSubjectDomain } = useCurrentSubjectDomainModel();
    const [topics, settopics] = useState([]);
    const [topicss, settopicss] = useState([]);
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
    const {step,setStep} = useStepModel();
    const {constructType} = useConstructTypeModel();
    const [done,setdone]=useState(0)

    const [finishedData,setfinishedData] = useState([]);
    const [data1,setdata1] = useState();
    var [notInsert, setnotInsert] = useState();
    var [continueIndex, setcontinueIndex] = useState();
    var [dataTemp,setdataTemp] = useState();
    var [onstop,setonstop] = useState();
    var [finishedTopic, setfinishedTopic] = useState();

    var [finishedNum,setfinishedNum] = useState();
    var [finishedPrepare,setfinishedPrepare] = useState();

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
    const [data0,setdata0]=useState(0);
    const infoFinish = () => {
    message.success('主题已全部获取，开始自动构建主题分面树！')
    };
    const infoDelete = () => {
    message.success('主题删除成功！')
    };
    const infoInsert = () => {
    message.success('主题插入成功！')
    };

    const infoPrepare=()=>{
        message.info('请耐心等待获取当前课程的主题，获取完成后将进行主题分面树的自动构建！',5)
    }

    // useEffect(() => { // 就这样改得了
    //     console.log(document.querySelector(`#topicitem-${topics[0]}`));
    // }, [topics])

    function emptyChildren(dom) {
        if(dom)
        {const children = dom.childNodes;
        while (children.length > 0) {
            dom.removeChild(children[0]);
        }}
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
                setfinishedData(finishedData);
                console.log('已构建主题',finishedData);
                var stopCommand1 = false;
                setstopCommand(stopCommand1);
                setTimeout(() => {
                    window.flag = false;
                }, 6000);
                console.log(stopCommand);
                message.info("待当前主题分面树构建完成后将暂停批量构建,暂停后可对当前分面树进行操作。",3)
                var onstop = true;
                setonstop(onstop);
            }
        })
    }

    // 暂停批量构建
    // useEffect(()=>{
    //     setcurrentTopic();
    // },[stop])

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
                message.info("继续批量构建！")
            }
        })
    }

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
                confirm({
                    title:"确认添加该主题？",
                    okText:'确定',
                    cancelText:'取消',
                    onOk(){
                        setinsertTopic1(Topic1);
                        console.log('Topic1',Topic1);
                        message.info('新添加主题时，暂无分面信息,可在单个构建页面人工添加主题分面。')
                    },
                    onCancel(){}
                })

            },
            onCancel() {

            }
        })
    };

    // 插入主题
    useEffect(()=>{
        async function insert(){
            await YottaAPI.insertTopic(currentSubjectDomain.domain,insertTopic1);
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            const topicsData = res.data.data;
            settopicData(topicsData);
            console.log('更新主题列表',topicData);
            var notInsert = false;
            setnotInsert(notInsert)
        }
        if(insertTopic1){
            insert(insertTopic1);
        }
    },[insertTopic1])
    const treeRef = useRef();

    //插入置顶
    useEffect(()=>{
        if(topicData){
            console.log("我要插入主题")
            console.log('topicData', topicData);
            console.log('batchData', batchData);
            const index = topics.indexOf(currentTopic);
            console.log('index',index)
            settopicData(topicData);
            if(topicData){
                dataTemp = (topicData.map((topic) =>topic.topicName
               ));
            }
            dataTemp = dataTemp.slice(-topicData.length)
            if(dataTemp[index] == insertTopic1){
                console.log("Nothing");
            }else{
                console.log("重新排序")
                for (var i=1; i < topicData.length; i++){
                    if (dataTemp[i]=== insertTopic1 ){
                        var dataChange = dataTemp[index];
                        dataTemp[index] = dataTemp[i];
                        dataTemp[i] = dataChange;
                    }
                };
            }
            // setdata1(dataTemp);
            console.log('主题列表',dataTemp);
            settopics(dataTemp);
        }
    },[topicData])

    const onDeleteTopic = (deleteTopic1) => {
        confirm({
            title:"确认删除该主题吗？",
            okText:'确定',
            cancelText:'取消',
            onOk(){
                console.log("待删除的主题是",deleteTopic1);
                setdeleteTopic1(deleteTopic1);
                // console.log('batchData',batchData);
            },
            onCancel(){

            }
        })
    }

    // 删除主题
    useEffect(()=>{
        async function deleteTopic(){
            await YottaAPI.deleteTopic(currentSubjectDomain.domain,deleteTopic1);
            setdeleteTopic2(deleteTopic1);
            console.log('batchData',batchData);
            setcurrentTopic(batchData[0]);
            console.log('当前主题题',currentTopic);
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            const topicsData = res.data.data;
            settopicsData(topicsData);
            if(topicsData){
                dataTemp = (topicsData.map((topic) =>topic.topicName
               ));
               dataTemp = dataTemp.filter((topic)=>topic!='B+树')
            }
            settopics(dataTemp);
        }
        if(deleteTopic1){
            deleteTopic();
        }
    },[deleteTopic1])

    useEffect(()=>{
        console.log('insertTopic', insertTopic1);
        console.log('notInsert',notInsert);
        if(notInsert){
            // setcurrentTopic(topics[0]);
            console.log('currentTopic',currentTopic);
        }else{
            console.log('insertTopic', insertTopic1);
            setcurrentTopic(insertTopic1);
        }
        console.log('currentTopic',currentTopic);
        var stopCommand3 = true;
        setstopCommand(stopCommand3);
        console.log('stopCommand',stopCommand);
    },[topics,notInsert])

    // 获取一个课程下所有的主题数据
    useEffect(() => {
        async function fetchTopicsData() {
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            const topicsData = res.data.data;
            settopicsData(topicsData);
            if(topicsData){
                let topics = topicsData.map((topic) => topic.topicName);
                topics = topics.filter((topic)=>topic!='B+树')
                console.log('主题列表',topics)
                settopicss(topics)
                settopics(topics)
                // setcurrentTopic(topics[0])
                setbatchData(topics)
            }
            setdata1(topics.slice(-topics.length));
            console.log('data1',data1)
            if(deleteTopic1){
                setcurrentTopic(batchData[0]);
            }
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
        }
    }, [])

    useEffect(() => {
        const topicNode = document.getElementById(`topicitem-${currentTopic}`);
        console.log('topicNode',topicNode);
        if(stopCommand){
            window.flag = true;
            if(topicNode){
                setdone(1);
                let my = setInterval(() => {
                let opacity = topicNode.style.opacity;
                topicNode.style.opacity = 1-(+opacity||0)
                topicNode.style.color = 'red';
                }, 500);
                setTimeout(()=>{
                    clearInterval(my);
                    topicNode.style.color = 'green';
                    topicNode.style.opacity = 1;
                },6000)
                async function fetchTreeData(){
                    const result = await YottaAPI.getCompleteTopicByNameAndDomainName(currentSubjectDomain.domain,currentTopic);
                    if(result){
                        setTimeout(()=>{
                            // if(treeRef.current)
                            // {
                            // drawTree(treeRef.current,result,d =>{},onClickBranch,clickBranchAdd.bind(null, currentTopic),'facet-tree',200,false);
                            // }
                            // emptyChildren(treeRef.current);
                            settreeData(result)
                            setTimeout(()=>{

                                const index = topics.indexOf(currentTopic);
                                setfinishedNum(index+1);
                                console.log('index',index,topics.length)
                                setbatchData(topics.slice(index+1));
                                (index < topics.length) && (setcurrentTopic(topics[index+1]));
                                console.log('未构建主题',batchData);
                                finishedData.push(topics[index]);
                                setfinishedData(finishedData);
                                console.log('已构建主题',finishedData);
                                localStorage.setItem("finishedData", JSON.stringify(finishedData));
                                localStorage.setItem("batchData", JSON.stringify(batchData));
                                // (index < topics.length) && (setcurrentTopic(topics[index+1]));
                            },3000)

                        },3000)
                    }
                    console.log('result',result)
                }
                fetchTreeData();
                console.log('currentTopic',currentTopic);
            }else{
                if(done===1){
                    infoFinish();
                    localStorage.setItem("visitedTopic", "yes");
                    setdata0(1);
                }
            }
        }
    }, [currentTopic,stopCommand]);

    //画分面树
    useEffect(()=>{
        // window.onresize = () => {
        if (treeRef && treeData) {
            if(treeData.childrenNumber === 0){
                emptyChildren(treeRef.current);
            }else{
                if(treeRef.current&&window.flag === true){
                    drawTree(treeRef.current,treeData,d =>{},onClickBranch,clickBranchAdd.bind(null, currentTopic),'facet-tree',200,false);
                }
                if (treeRef.current&&window.flag===false )
                {
                    drawTree(treeRef.current,treeData,d=>{},onClickBranch,clickBranchAdd.bind(null, currentTopic),'facet-tree',0,false);
                }
                emptyChildren(treeRef.current);
            }
        }
        // }
        // return () => {
        //     window.onresize = null;
        //     console.log('resize.clear');
        // }

    },[treeData])

    useEffect(()=>{
        if(data1) {
            if (localStorage.getItem("visitedBatch")) {
                console.log("This is not the first time!")
                var finishedPrepare = true
                setfinishedPrepare(finishedPrepare)
                var getbatchData = JSON.parse(localStorage.getItem('batchData'))
                var getfinishedData = JSON.parse(localStorage.getItem('finishedData'))
                console.log('getfinishedData',getfinishedData)
                console.log('getbatchData',getbatchData)
                if(getfinishedData){
                    setfinishedNum(getfinishedData.length);
                }
                if(getbatchData){
                    setcurrentTopic(getbatchData[1]);
                    console.log('currentTopic',currentTopic)
                    const index = topics.indexOf(getbatchData[1]);
                    console.log('indexxx', index);
                    var finishhhh = topics.slice(0,index);
                    for(var i=0; i<finishhhh.length;i++){
                        console.log(finishhhh[i]);
                        var finishedTopic = finishhhh[i];
                        setfinishedTopic(finishedTopic);
                        console.log('finishedTopic',finishedTopic)
                        const topicNode = document.getElementById(`topicitem-${finishedTopic}`);
                        console.log('topicNode',topicNode);
                        topicNode.style.color = 'green';
                    }
                console.log('getbatchData',getbatchData)
                }else{
                    setcurrentTopic(topics[0])
                    var num = 0;
                    setfinishedNum(num);
                }
            }else{
                localStorage.setItem("visitedBatch", "yes")
                console.log("This is the first time!")
                // setcurrentTopic(topics[0])
                infoPrepare();
                var notInsert1 = true;
                setnotInsert(notInsert1);
            }
        }
    },[data1])

    useEffect(()=>{
        if(constructType==='cool'&&data0===1)
            {if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                setStep(2)
                }else{
                    setStep(1)
                }}
    },[data0])

    useEffect(() => {
        console.log('data1',data1)
        console.log('topics',topics)
        console.log('topicss',topicss)
        if (data1) {
          // console.log("firstTime", firstTime);
          if (localStorage.getItem("visitedTopic")) {
            // setdata(data1);
            console.log("This is not the first time!")
          } else {
            localStorage.setItem("visitedTopic", "yes")
            var num = 1;
            var maxlength = topicss.length;
            const timer = setInterval(() => {
              settopics(topicss.slice(0, num));
              num = num + 1;
              var finishedPrepare1 = false
              setfinishedPrepare(finishedPrepare1)
              var topicdone = 0;
              setfinishedNum(topicdone);
              if (num === maxlength + 1) {
                setcurrentTopic(topics[0]);
                console.log('开始主题',currentTopic)
                infoFinish();
                clearInterval(timer);
                setfirstTime(data1);
                localStorage.setItem("visitedTopic", "yes")
                console.log("This is the first time!");
                var finishedPrepare = true
                setfinishedPrepare(finishedPrepare)
              }
            }, 100);
          }
        }
      }, [data1])

    //删除分面调用接口
    let clickflag = true;
    const onClickBranch = (facetId) => {
        if(!clickflag){
            clickflag=true;
            console.log("return flag");
            return
        }
        if(facetId){
        confirm({
        title: "确认删除该分面吗？",
        okText: '确定',
        cancelText: '取消',
        async onOk() {
            ClickBranch(facetId)

            // if (res.code == 200) {
            //     message.info(res.msg)
            //     fetchMap();

            // } else {
            //     message.warn(res.msg)
            // }
            clickflag = false;
        },
        onCancel() {
            //clickflag = false;
            console.log('cancel')
        }
    })
}
};


    async function ClickBranch(facetId){

        if (facetId > 0){
        const res = await YottaAPI.deleteAssembleByFacetId(facetId);
        console.log("传入删除id", facetId);
        //setassembles(res);
        }

        console.log("currentTopic clickbranch",currentTopic);
         var topiccc = finishedData.slice(-1)

        const treeData = await YottaAPI.getCompleteTopicByNameAndDomainName(currentSubjectDomain.domain,topiccc);
    window.flag = false;
    console.log("shanchuhou",window.flag);
        if(treeData){
            console.log("新的画树数据",treeData);
            emptyChildren(treeRef.current);
            settreeData(treeData);
        }

        // setcurrentTopic(topic => {
        //     (async () => {
        //         const treeData = await YottaAPI.getCompleteTopicByTopicName(topic);
        //         console.log('t-tt', topic);
        //         window.flag = false;
        //         console.log("shanchuhou", window.flag);
        //         if (treeData) {
        //             console.log("新的画树数据", treeData);
        //             emptyChildren(treeRef.current);
        //             settreeData(treeData);s
        //         }
        //     })();
        //     // return topic
        // })
    }

      // 插入分面

      const clickBranchAdd = (topicName2) => {
        confirm({
            title: '请输入分面名称',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <TextArea showCount maxLength={100} onChange={handleTextareaChange}/>
            </>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                settopicName2(topicName2);
                const insertFacet1 = textareaValueRef.current;
                textareaValueRef.current = '';
                setinsertFacet1(insertFacet1);
            },
            onCancel() {

            }
        })
    };

    useEffect(()=>{
        async function insertFacet(){
            await YottaAPI.insertFirstLayerFacet(currentSubjectDomain.domain, topiccc, insertFacet1);
      const treeData2 = await YottaAPI.getCompleteTopicByNameAndDomainName(currentSubjectDomain.domain,topiccc);
    //   window.flag = false;
    //   console.log("shanchuhou", window.flag);
      if (treeData) {
        console.log("新的画树数据", treeData2);
        emptyChildren(treeRef.current);
        settreeData(treeData2);
      }
        }
        var topiccc = finishedData.slice(-1)

        if(topiccc && insertFacet1){
            insertFacet(topiccc, insertFacet1);
        }
  },[topicName2])

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
          已构建主题个数： <span style={{color:'red', fontWeight:'bolder'}}>{finishedNum}{'/'}{topics.length}</span>
        </Card.Grid>
      </Card>
            <Card  extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertTopic}/>} title="主题列表" style={topicsStyle}>
                {
                    topics.map(
                        (topicName, index) =>
                            (
                                <Card.Grid style={{ width: '100%', height: '80%',opacity:1}} id={`topicitem-${topicName}`} key={index}>{topicName}
                                    <button class="ant-btn ant-btn-ghost ant-btn-circle-outline ant-btn-sm" onClick={onDeleteTopic.bind(null,topicName)} style={{ position:"absolute", right:'5%'}}>
                                        <DeleteOutlined />
                                    </button>
                                </Card.Grid>
                            )
                    )

                }
            </Card>
            <Card  extra={<PlusOutlined style={{ top: '50px' }} onClick={clickBranchAdd.bind(null, currentTopic)}/>}title="主题分面树" style={treeStyle}>
        {
                finishedPrepare?(
                    <Card.Grid style={{ width: '100%', height: '850px' }} hoverable={false}>
                        <svg ref={ref => treeRef.current = ref} id='tree' style={{ width: '100%', height: '700px' }}>
                        </svg>
                    </Card.Grid>
                ):
                (
                    <Card.Grid style={{ width: '100%', height: '850px' }} hoverable={false}>
                        <Alert style={{fontSize:'20px'}}message="请等待主题列表构建完成, 待主题列表获取成功后将自动进行主题分面树的构建！" type="info" />
                    </Card.Grid>
                )
            }
        {/* <Card.Grid style={{ width: '100%', height: '850px' }} hoverable={false}>
                    <svg ref={ref => treeRef.current = ref} id='tree' style={{ width: '100%', height: '700px' }}>
                    </svg>
                </Card.Grid> */}
            </Card>


        </>
    );
}

export default BatchConstruct;
