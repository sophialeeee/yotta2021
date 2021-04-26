import React from 'react';
import { drawTree,drawTreeNumber,drawTreeDel } from '../../../../modules/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../../models/current-subject-domain';
import useStepModel from '../../../../models/construct-step';
import { useState } from 'react';
import YottaAPI from '../../../../apis/yotta-api';
import {DeleteOutlined, ExclamationCircleOutlined,PlusOutlined, EditOutlined} from '@ant-design/icons';
import { Card,Input,Modal,message,Button,Select } from 'antd';
import cookie from 'react-cookies';
import useConstructTypeModel from '../../../../models/construct-type';
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

const {Option} = Select;

function SingleConstruct() {
    const {step,setStep} = useStepModel(); 
    const [data0,setdata0]=useState(0);
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
    const {constructType} = useConstructTypeModel();
    const [insertFacet1,setinsertFacet1] = useState();
    const [topicName2,settopicName2] = useState();
    const [firstTime,setfirstTime] = useState(0);
    const [data1,setdata1] = useState();
    
    var [topicData, settopicData] = useState();
    var [batchConstruct, setbatchConstruct] = useState();

    var [data, setdata] = useState([]);
    var [dataTemp,setdataTemp] = useState();
    var flag;
    window.lock = false;
    const handleTextareaChange= (e)=>{
        textareaValueRef.current = e.target.value;
    }
   
    const infoFinish = () => {
    message.success('主题构建成功，已全部展示！')
    };
    const infoDelete = () => {
    message.success('主题删除成功！')
    };
    const infoInsert = () => {
    message.success('主题插入成功！')
    };

    const onBatchInfo=()=>{
        message.info('此为批量构建控制按钮！')
    }


    const onClickTopic = (topicName,e) => {
        if(window.lock===false)
        {
            window.flag = true;
            emptyChildren(treeRef.current);
            console.log('topicName',topicName);
            setcurrentTopic(topicName);
        }
        else {
            alert("请等待当前主题树构建完成！");
        }
        
        
        
        // 闪烁效果 
        // e.persist();
        // let my = setInterval(() => {
        //     let opacity = e.target.style.opacity;
        //     e.target.style.opacity = 1-(+opacity||0)
        //     e.target.style.color = 'red';     
        // }, 500);
    };

    useEffect(() => {  
        if (window.lock === false){
            window.lock = true;
            console.log("lock",window.lock);
            async function fetchTreeData() {
                const result = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
                console.log("画树用",result);
                settreeData(result);          
      console.log(currentTopic);
            }
            if(currentTopic){
                fetchTreeData();
            }
        }
        else {
            alert("请等待当前主题树构建完成！");
        }
    }, [currentTopic]);

   
    // 画分面树
    //window.flag = true;
    useEffect(() => {
        console.log("lockintree",window.lock);
        if (window.lock === false){
            if (treeRef && treeData) {
                if(treeData.childrenNumber === 0){
                    window.lock = false;
                    alert("当前页面无分面树！");
                    emptyChildren(treeRef.current); 
                }
                else{
                
                    if(treeRef.current.childNodes.length === 0&&window.flag===true ){
                        window.lock = true;
                        console.log("lockindrawtree",window.lock);
                        console.log('动态树treeRef',treeRef.current.childNodes);
                        drawTree(treeRef.current,treeData,clickFacet,ClickBranch,clickBranchAdd.bind(null, currentTopic),2000);
                    
                    
                        }
                    if(treeRef.current.childNodes.length === 0&&window.flag===false ){
                        console.log('静态树treeRef',treeRef.current.childNodes);
                        drawTreeNumber(treeRef.current,treeData,clickFacet,ClickBranch,clickBranchAdd.bind(null, currentTopic));
                    
                        }
                    }
                }
            }
        //else {
            //alert("请等待当前页面构建完成！");}
    }, [treeData])


    function emptyChildren(dom) {
        if (dom){
            const children = dom.childNodes;
            while (children.length > 0) {
                dom.removeChild(children[0]);
            }
        }

    };

    useEffect(()=>{
        if(topicData){
            console.log('topicData', topicData);
            settopicData(topicData);
            if(topicData){
                dataTemp = (topicData.map((topic) =>topic.topicName
               ));
            }
            dataTemp = dataTemp.slice(-topicData.length)
            if(dataTemp[0] == insertTopic1){
                console.log("Nothing");
            }else{
                for (var i=1; i < topicData.length; i++){
                    if (dataTemp[i]=== insertTopic1 ){
                        var dataChange = dataTemp[0];
                        dataTemp[0] = dataTemp[i];
                        dataTemp[i] = dataChange;
                    }
                };
            }
            setdata1(dataTemp);
        }
    },[topicData])

    const [type,settype] = useState();
   
    const handleType = (value)=>{
       console.log('value',value);
       settype(value);
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
                setinsertTopic1(Topic1); 
                console.log('Topic1',Topic1);
                
            },
            onCancel() {
                
            }
        })
    };

    const onDeleteTopic = (deleteTopic1) => {
        confirm({
            title:"确认删除该主题吗？",
            okText:'确定',
            cancelText:'取消',
            onOk(){
                console.log("待删除的主题是",deleteTopic1);
                setdeleteTopic1(deleteTopic1);
            },
            onCancel(){

            }
        })
        // e.stopPropagation();
    }

  //插入分面
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

    // 删除主题
    useEffect(()=>{
        async function deleteTopic(){
            await YottaAPI.deleteTopic(currentSubjectDomain.domain,deleteTopic1);
            setdeleteTopic2(deleteTopic1);
        }
        if(deleteTopic1){
            deleteTopic();
        }
    },[deleteTopic1])

    // 插入分面
    useEffect(()=>{
        async function insertFacet(){
            await YottaAPI.insertFirstLayerFacet(currentSubjectDomain.domain, topicName2, insertFacet1);
      const treeData2 = await YottaAPI.getCompleteTopicByTopicName(topicName2);
    //   window.flag = false;
    //   console.log("shanchuhou", window.flag);
      if (treeData) {
        console.log("新的画树数据", treeData2);
        emptyChildren(treeRef.current);
        settreeData(treeData2);
      }
        }
        if(topicName2 && insertFacet1){
            insertFacet(topicName2, insertFacet1);
        }
  },[topicName2])

    // 插入主题
    useEffect(()=>{
        async function insert(){
            await YottaAPI.insertTopic(currentSubjectDomain.domain,insertTopic1);
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.domain);
            const topicsData = res.data.data;
            settopicData(topicsData);
        }
        if(insertTopic1){
            insert(insertTopic1);
        }
    },[insertTopic1]) 

    const treeRef = useRef();

    
    
    //删除分面调用接口
    const onClickBranch = (facetId) => {
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
        },
        onCancel() {
            console.log('cancel')
        }
    })
}
};
    

    async function ClickBranch(facetId){
        
        if (facetId > 0){
        const res = await YottaAPI.deleteAssembleByFacetId(facetId);
        console.log("传入删除id", facetId);
        setassembles(res);
        }
    
        console.log("currentTopic clickbranch",currentTopic);
    // const treeData = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
    // window.flag = false;
    // console.log("shanchuhou",window.flag);
    //     if(treeData){
    //         console.log("新的画树数据",treeData);
    //         emptyChildren(treeRef.current);
    //         settreeData(treeData);
    //     }
        setcurrentTopic(topic => {
            (async () => {
                const treeData = await YottaAPI.getCompleteTopicByTopicName(topic);
                console.log('t-tt', topic);
                window.flag = false;
                console.log("shanchuhou", window.flag);
                if (treeData) {
                    console.log("新的画树数据", treeData);
                    emptyChildren(treeRef.current);
                    settreeData(treeData);
                }
            })();
            return topic
        })
           
        
        
    }

    //返回碎片调用接口
    async function clickFacet(facetId){
        const res = await YottaAPI.getASsembleByFacetId(facetId);
        setassembles(res);
        console.log("Facet函数有调用");
    }
    // 获取一个课程下所有的主题数据
    useEffect(() => {
        async function fetchTopicsData() {
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            const topicsData = res.data.data;
            //const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            settopicsData(topicsData);
            if(topicsData){
                dataTemp = (topicsData.map((topic) =>topic.topicName
               ));
        // setcurrentTopic(topicsData[0].topicName);  // 默认topic
        // window.flag = false;
            }
            console.log('dataTemp',dataTemp);
            setdata1(dataTemp.slice(-topics.length));
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
        }
  }, [insertTopic1, deleteTopic2])
  
    useEffect(()=>{
        if(data1) {
            // console.log("firstTime", firstTime);
      if (localStorage.getItem("visitedTopic")) {
                setdata(data1);
                console.log("This is not the first time!")
            }else{
                var num = 1;
                var maxlength = data1.length;
                // setdata(data1.slice(-relationData.length));
                const timer = setInterval(() => {
                    setdata(data1.slice(0, num));
                    
                    // async function fetchTreeData() {
                    //     const result = await YottaAPI.getCompleteTopicByTopicName(data[num]);
                    //     console.log("画树用",result);
                    //     settreeData(result);          
                    //     console.log(data[num]);
                    // }
                    // if(data[num]){
                    //     fetchTreeData();
                    // }
                    window.lock = false
                    window.flag = false;
                    if(treeRef)
                    {emptyChildren(treeRef.current);}
                    setcurrentTopic(data1[num]);
                    num = num + 1;
                    if (num === maxlength + 1) {
                        infoFinish();
                        localStorage.setItem("visitedTopic", "yes")
                        clearInterval(timer);
                        setfirstTime(1);     
                        num=num-1                     
                        window.lock = false
                        window.flag = false;                      
                        if(treeRef)
                        {emptyChildren(treeRef.current);}
                        console.log('[[[[[[[',data1[num-1])
                        setcurrentTopic(data1[num-1]);
                        console.log("This is the first time!");
                        setdata0(1)


                        // if(constructType==='cool')
                        // {if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                        //     setStep(2)
                        //     }else{
                        //         setStep(1)
                        //     }}
                       
            // console.log("firstTime", firstTime);
                    }
                }, 200);
            }
        }
    },[data1])
    useEffect(()=>{
        if(constructType==='cool'&&firstTime===1)
            {if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                setStep(2)
                }else{
                    setStep(1)
                }}
    },[data0])
    return (
        <>
        <Card style={stopStyle}>
                <Button shape='circle' style={{ position:"absolute", left:'5%',top:'20%' }}>
                    <a onClick={onBatchInfo}>暂停</a>
                </Button>
                <Button shape='circle' style={{ position:"absolute", right:'5%',top:'20%' }}>
                    <a onClick={onBatchInfo}>继续</a>
                </Button>
        </Card>
      <Card title='主题数量统计' style={countStyle1}>
        <Card.Grid style={{ width: '100%', height: '50px' }}>
          主题个数： <span style={{color:'red', fontWeight:'bolder'}}>{data.length}</span>
        </Card.Grid>
      </Card>
            <Card  extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertTopic}/>} title="主题列表" style={topicsStyle}>
                {
                    data?(
                        data.map(
                            (topicName, index) =>
                                (


                                    <Card.Grid style={{width: '100%', height: '80%',opacity:1}}  key={index}>
                                        {topicName}

                                        <button class="ant-btn ant-btn-ghost ant-btn-circle-outline ant-btn-sm" style={{ position:"absolute", right:'11%'}}>
                                            <a  onClick={onClickTopic.bind(null, topicName)}>构建</a>
                                        </button>
                                        <button class="ant-btn ant-btn-ghost ant-btn-circle-outline ant-btn-sm" onClick={onDeleteTopic.bind(null,topicName)} style={{ position:"absolute", right:'5%'}}>
                                            <DeleteOutlined />
                                        </button>

                                    </Card.Grid>

                                )
                        )
                    ):(
                        null
                    )

                }
            </Card>
      {/* <Card title="主题分面树" style={treeStyle}> */}
      {/* <Card title="批量构建" style={batchStyle}>
          <Button shape='round' style={{ position:"absolute", left:'8%',top:'55%' }}>
                <a onClick={onBatchStart}>开始</a>
          </Button>
          <Button shape='round' style={{ position:"absolute", right:'8%',top:'55%' }}>
                <a onClick={onBatchStop}>暂停</a>
          </Button>
      </Card> */}
      <Card extra={<PlusOutlined style={{ top: '50px' }} onClick={clickBranchAdd.bind(null, currentTopic)}/>} title="主题分面树" hoverable={false} style={treeStyle}>
        <Card.Grid style={{ width: '100%', height: '850px' }}  hoverable={false}>
                    <svg ref={ref => treeRef.current = ref} id='tree' style={{ width: '100%', height: '700px' }}>
                    </svg>
                </Card.Grid>
            </Card>


        </>
    );
}

export default SingleConstruct;
