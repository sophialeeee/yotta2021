import React from 'react';
import classes from './index.module.css';
import { Modal, Select, Drawer, Switch} from "antd";
import {ExclamationCircleOutlined,PlusOutlined, CaretRightOutlined,PauseOutlined,MinusOutlined, EditOutlined, CloseOutlined,DeleteOutlined, StopOutlined} from '@ant-design/icons'
import YottaAPI from '../../../apis/yotta-api';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawTree,drawTreeNumber} from '../../../modules/facetTree1';
import {drawMap} from '../../../modules/topicDependenceVisualization';
import {Card, Alert, Input, message} from 'antd';
import Leaf from '../../../components/Leaf'
import cookie from 'react-cookies';
import useConstructTypeModel from '../../../models/construct-type';
import useStepModel from '../../../models/construct-step';
const {confirm} = Modal;

let pause = 0;
let quit = 0;


function Assemble() {
    const [learningPath,setlearningPath] = useState([]);  //学习路径
    const {currentSubjectDomain} = useCurrentSubjectDomainModel();
    const [currentTopic,setcurrentTopic] = useState();
    const [topics,settopics] = useState([]);
    const [assembles,setassembles] = useState();
    const [treeData,settreeData] = useState();
    const [assnum,setassnum] = useState(0);
    const [renderFinish,setrenderFinish] = useState(0);
    const [topicConfirm,settopicConfirm] = useState();   //临时加的 存增量爬虫结果
    const [autoCons, setautoCons] = useState();
    const [autocurrentTopic, setautocurrentTopic] = useState();
    const [autotreeData, setautotreeData] = useState();
    const [dynamicSpider, setdynamicSpider] = useState(0);  //动态爬虫标志位
    const [newassnum, setnewassnum] = useState(0);
    const [facet, setfacet] = useState();
    const [currentFacetId, setcurrentFacetId] = useState();
    const textareaValueRef = useRef('');
    const [appendAssembleContent,setappendAssembleContent] = useState();
    const [deleteAssemble,setdeleteAssemble] = useState();
    const [updateAssembleId,setupdateAssembleId] = useState();
    const [updateAssembleContent,setupdateAssembleContent] = useState();
    const [appendAssembleContentFlagToFetch,setappendAssembleContentFlagToFetch] = useState();  //新增碎片后前往获取碎片列表
    const [appendAssembleContentFlagToSort,setappendAssembleContentFlagToSort] = useState();   //新增碎片获取列表后，前往置顶步骤
    const [deleteAssembleToFetch,setdeleteAssembleToFetch] = useState();
    const [deleteAssembleToSort,setdeleteAssembleToSort] = useState();
    const {step,setStep} = useStepModel();
    const [firstTime,setfirstTime]=useState(0);
    const {constructType} = useConstructTypeModel();
    const [data0,setdata0]=useState(0);
    const [staticRenderAss, setstaticRenderAss] = useState();
    const [dynamicRenderAss, setdynamicRenderAss] = useState();
    const [spiderAss,setspiderAss] = useState();
    const [spiderText,setspiderText] = useState("");
    const [updateTree, setupdateTree] = useState(0);     //动态爬虫过程中更新树
    const [quitSpider, setquitSpider] = useState(0);
    const [pauseSpider, setpauseSpider] = useState(0);
    const [spidernum, setspidernum] = useState(0);
    const [visibleDrawer, setvisibleDrawer] = useState(true);
    const [showSpiderState, setshowSpiderState] = useState(0);
    const [spiderFinish, setspiderFinish] = useState(1);
    const [topicConfirmFlag, settopicConfirmFlag] = useState(0);   //0表示取消，1表示点击主题，2表示确定爬取该主题

    const {TextArea} = Input;


    const mapRef = useRef();
    const treeRef = useRef();
    const treeRef1 = useRef();

    const handleTextareaChange= (e)=>{
        textareaValueRef.current = e.target.value;
    }


    const onCloseDrawer = () => {
        setvisibleDrawer(!visibleDrawer);
    };

    const spiderState = {
        borderColor:'grey',
        borderWidth: '1.5px',
        borderRadius: '12px',
        borderStyle:"solid",
        // backgroundColor:'white',
        color: 'black',
        height: '120px',
        width: '124px',
        textAlign: 'left',
        // display: 'inline-block',
        right: "3%",
        // outline:"none",
        position:'absolute',
        zIndex:"999"
    };

    const treeStyle = {
        width:'50%',
        height:'350px',
        position: 'absolute',
        left: '0%',
        textAlign: 'center',
        top:'0px',

      };

    const chartStyle = {
        width:'50%',
        height:'445px',
        position: 'absolute',
        left: '0%',
        textAlign: 'center',
        top:'360px',
        overflow:"hidden"
    };
    const countStyle = {
        width:'25%',
        position:'absolute',
        left:'52%',
        textAlign:'center',
        top:'10px',
        lineHeight:'10px',
    }
    const increaseStyle = {
        width:'22%',
        position:'absolute',
        left:'79%',
        textAlign:'center',
        top:'10px',
        lineHeight:'10px',
    }
    const assembleStyle = {
        width:'49%',
        position:'absolute',
        left:'52%',
        textAlign:'center',
        top:'190px',
        height:'618px',
        overflow: 'auto',
    }
    // 自动构建，临时
    useEffect(() => {
        async function ontopicConfirm(){
            confirm({
                title: '是否要装配该主题？',
                icon: <ExclamationCircleOutlined/>,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    setdynamicSpider(topicConfirm);    //动态爬虫
                    setcurrentTopic(topicConfirm);
                    settopicConfirmFlag(2);
                },
                onCancel() {
                    settopicConfirmFlag(0);
                }
            })
        }
        if(topicConfirm&&topicConfirmFlag===1)
            ontopicConfirm();

    },[topicConfirmFlag])

    // const onAutoConstructClick = () => {
    //     let currentTopic1 = '';
    //     const onSelectChange = (e) => {
    //         currentTopic1 = e;
    //     }
    //     confirm({
    //         title: '请选择要装配的主题',
    //         icon: <ExclamationCircleOutlined/>,
    //         content: <>
    //             <div style={{display: 'flex', flexDirection: 'column'}}>
    //             <span>
    //                 主题：
    //             </span>
    //                 <Select onSelect={onSelectChange}>
    //                     {
    //                         topics.map((topicName)=>(
    //                         <option value={topicName} >{topicName}</option>
    //                         ))
    //                     }
    //                 </Select>
    //             </div>

    //         </>,
    //         okText: '开始装配',
    //         cancelText: '取消',
    //         onOk() {
    //             setcurrentTopic(currentTopic1);
    //         },
    //         onCancel() {

    //         }
    //     })
    // };

    const onPlaySpider = () => {
        confirm({
            title: '是否想要继续碎片爬取？',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                setpauseSpider(0);
                pause = 0;
                if (spiderText != "")
                    setspiderText(" （正在爬取碎片...）");
                YottaAPI.continueSpider(currentSubjectDomain.domain,currentTopic);
            },
            onCancel() {

            }
        })
    };

    const onPauseSpider = () => {
        confirm({
            title: '是否想要停止碎片爬取？',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                setpauseSpider(1);
                pause = 1;
                if (spiderText != "")
                    setspiderText(" （爬取碎片暂停中...）");
                YottaAPI.pauseSpider(currentSubjectDomain.domain,currentTopic);
            },
            onCancel() {

            }
        })
    };



    const onQuitSpider = () => {
        confirm({
            title: '是否想要停止碎片爬取？',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                setquitSpider(1);
                quit = 1;
                setspiderText("");
                setshowSpiderState(0);
            },
            onCancel() {
            }
        })
    };

    const onAppendAssemble = () => {
        let facetId = '';
        const onSelectChange = (id) => {
            facetId =  id;
        }
        confirm({
            title: '请输入要添加的碎片内容',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <span>
                    分面名：
                </span>
                    <Select onSelect={onSelectChange}>
                        {
                            facet.map((facet1)=>(
                            <option value={facet1.facetId} >{facet1.facetName}</option>
                            ))
                        }
                    </Select>
                </div>
                <div>
                    <span>
                        碎片内容：
                    </span>
                    <TextArea showCount maxLength={150} onChange={handleTextareaChange}/>
                </div>
            </>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const newAssemble = textareaValueRef.current;     // 新增碎片的内容
                textareaValueRef.current = '';
                setappendAssembleContent(newAssemble);
                setcurrentFacetId(facetId);
                console.log(currentFacetId);
                console.log('newAssemble',newAssemble);

            },
            onCancel() {

            }
        })
    };

    const onDeleteAssemble = (assembleId1, e) => {
        confirm({
            title: '是否想要删除此碎片？',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                setdeleteAssemble(assembleId1);
            },
            onCancel() {

            }
        })
    };

    const onUpdateAssemble = (assembleId1, assembleContent1,e) => {
        console.log("碎片内容",assembleContent1);
        confirm({
            title: '请编辑碎片内容',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <TextArea showCount maxLength={120} onChange={handleTextareaChange} defaultValue={assembleContent1}/>
            </>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const assembleContent = textareaValueRef.current;     // 新增碎片的内容
                textareaValueRef.current = '';
                setupdateAssembleId(assembleId1);
                setupdateAssembleContent(assembleContent);
                console.log(assembleContent1);
                console.log('updateAssemble',assembleId1);

            },
            onCancel() {

            }
        })
    };


    //根据domainName,topicName获取分面信息
    useEffect(()=>{
        async function fetchFacetData(){
            await YottaAPI.getFacetsInTopic(currentSubjectDomain.domain,currentTopic).then(res=>{
                setfacet(res)
            })
        }
        fetchFacetData();
    },[appendAssembleContent, deleteAssemble, currentTopic])

    //新增碎片
    useEffect(() => {
        async function append(){
            console.log("新增碎片",appendAssembleContent);
            await YottaAPI.appendAssemble("人工",currentSubjectDomain.domain,currentFacetId,appendAssembleContent,"null");
            infoInsert();
            setappendAssembleContentFlagToFetch(appendAssembleContent);
        }
        if(appendAssembleContent){
            append();
        }
    }, [appendAssembleContent])

    //删除碎片
    useEffect(() => {
        async function deleteAss(){
            console.log(deleteAssemble);
            await YottaAPI.deleteAssemble(deleteAssemble);
            infoDelete();
        }
        if(deleteAssemble){
            deleteAss();
            setdeleteAssembleToFetch(deleteAssemble);
        }
    }, [deleteAssemble])

    //编辑碎片
    useEffect(() => {
        async function updateAss(){
            console.log(updateAssembleId);
            console.log(updateAssembleContent);
            await YottaAPI.updateAssemble(updateAssembleId,updateAssembleContent,"人工",null);
        }
        if(updateAssembleId){
            updateAss();
        }
    }, [updateAssembleId])

    //统计近一个月的新增碎片数
    useEffect(() => {
        async function countUpdateAss(){
            const res = await YottaAPI.countUpdateAssemble(currentSubjectDomain.domain);
            console.log("res:",res)
            if(res){
                const newassnum = res;
                console.log("近一个月新增：",newassnum);
                setnewassnum(newassnum);
                console.log(currentTopic);
            }
        }
        countUpdateAss();
    }, [assembles, currentTopic, appendAssembleContentFlagToSort])


    useEffect(() => {
        console.log(currentTopic);
        async function fetchTreeData() {
            const treeData = await YottaAPI.getCompleteTopicByNameAndDomainName(currentSubjectDomain.domain,currentTopic);
            settreeData(treeData);
            console.log(treeData);
        }
        fetchTreeData();
    }, [currentTopic,appendAssembleContent, deleteAssemble, updateAssembleContent, spiderAss]);


    useEffect(() => {
        if (treeRef && treeData) {
            drawTreeNumber(treeRef.current, treeData, clickFacet1);
            console.log("树",treeRef.current)
        }
    }, [treeData])

    async function clickFacet1(facetId){
        const res = await YottaAPI.getASsembleByFacetId(facetId);
        setassembles(res);
    }




    useEffect(() => {
        async function fetchTopicsData() {
            const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            if(topicsData){
                settopics(topicsData.map((topic) => topic.topicName));
                if (topicsData[0].topicName)
                    setcurrentTopic(topicsData[0].topicName);    //默认碎片
                else
                    setcurrentTopic('树状数组');
            }
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
            // setcurrentTopic('树状数组');
        }
    }, [currentSubjectDomain.domain])

    //画圆形图
    useEffect(()=>{
        async function fetchDependencesMap(){
            const result = await YottaAPI.generateMap(currentSubjectDomain.domain);
            console.log("结果是：",result);
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    // setmapdata(res.data);
                    if(res.data&&mapRef.current&&treeRef1.current){
                        drawMap(res.data, mapRef.current, treeRef1.current, currentSubjectDomain.domain, learningPath, clickTopic, clickFacet, deleteTopic, assembleTopic,()=>{}, ()=>{}, ()=>{}, 'assemble',()=>{},()=>{});
                        //drawMap(res.data,mapRef.current,treeRef1.current,currentSubjectDomain.domain,learningPath,clickTopic, clickFacet, insertTopic, deleteTopic, assembleTopic);}
                }
            }
        )
    }
    console.log("当前主题为",currentSubjectDomain.domain);
    if (currentSubjectDomain)
        fetchDependencesMap();

    },[currentSubjectDomain.domain]);



    async function clickFacet(facetId){
        const res = await YottaAPI.getASsembleByFacetId(facetId);
        setassembles(res);
        //const res1 = await YottaAPI.getFacetName1(facetId);
        //setfacet(res1.facetName);
    }

    async function clickTopic(topicId,topicName){
        setcurrentTopic(topicName);
        setstaticRenderAss(topicName);
        console.log("点击主题");
    }

    async function deleteTopic(topicId){
    }

    async function assembleTopic(topicId,topicName){
        console.log("成功啦成功啦");
        console.log("此时的主题名为",topicName);
        settopicConfirm(topicName);
        settopicConfirmFlag(1);
    }

    //新增和渲染完成后获取碎片列表
    useEffect(()=>{
        async function fetchAssembleData(){
            const res = await YottaAPI.getAssembleByName(currentSubjectDomain.domain,currentTopic);
            if(res){
                setassembles(res);
                console.log("获取碎片");
                if (spiderFinish){
                    infoFinish();
                }

                setappendAssembleContentFlagToSort(appendAssembleContentFlagToFetch);
            }
        }
        fetchAssembleData();
    },[appendAssembleContentFlagToFetch,renderFinish])

    //删除碎片后，获取碎片列表
    useEffect(()=>{
        async function fetchAssembleData(){
            const res = await YottaAPI.getAssembleByName(currentSubjectDomain.domain,currentTopic);
            if(res){
                setassembles(res);
                console.log("获取碎片");
                infoFinish();
                setdeleteAssembleToSort(res);
            }
        }
        fetchAssembleData();
    },[deleteAssembleToFetch])


    // 点击主题后调用后台数据渲染
    var arr=new Array();
    useEffect(() => {
        async function fetchAssembleData2() {
            console.log("开始动态渲染");
            setrenderFinish(0);
            const res = await YottaAPI.getAssembleByName(currentSubjectDomain.domain,currentTopic);

            if(res){
                //infoConstructing();
                var i=0;
                var myvar = setInterval(()=>{
                if(i==res.length){
                    setassembles(res);
                    setrenderFinish(1);
                    clearInterval(myvar);

                }else
                {
                    arr.push(res[i]);
                    setassembles(arr);
                    setassnum(arr.length);
                    i++;
                }

            },100);

            }
        }
        if (currentTopic) {
            fetchAssembleData2();
        }
    }, [staticRenderAss, currentTopic]);


    // 右键点击装配，调用动态爬虫
    useEffect(() => {
        async function fetchAssembleData2() {
            console.log("开始动态渲染");
            setrenderFinish(0);
            const r = await YottaAPI.startSpider(currentSubjectDomain.domain,currentTopic);
            console.log("状态值:",r.status);
            setspiderText(" （准备爬取碎片...）");
            setquitSpider(1);
            pause = 0;
            quit = 0;
            setshowSpiderState(1);
            setpauseSpider(0);
            setspiderText(" （正在爬取碎片...）");
            setspidernum(0);
            setspiderFinish(0);
            var myvar1 = setInterval(
                async function GDM() {
                    if(currentSubjectDomain.domain && currentTopic) {
                        console.log("pause2",pause);
                        if (pause==1){
                            if(quit===1){
                                setshowSpiderState(0);
                                YottaAPI.stopSpider(currentSubjectDomain.domain,currentTopic);
                                setrenderFinish(1);
                                clearInterval(myvar1);
                            }
                        }
                        else{
                            const result = await YottaAPI.getDynamicSingle(currentSubjectDomain.domain,currentTopic);
                            console.log('result.code',result.code);
                            if(result.code == 200 || quit===1){
                                console.log("========================");
                                setspiderAss(result);
                                setdynamicRenderAss(result);
                                setrenderFinish(1);
                                setspiderText("");
                                setshowSpiderState(0);
                                setspiderFinish(1);
                                infoSpiderFinish();
                                YottaAPI.stopSpider(currentSubjectDomain.domain,currentTopic);
                                clearInterval(myvar1);

                            }
                            else {
                                setspiderAss(result);
                                setdynamicRenderAss(result);
                                setspiderFinish(0);
                                console.log("+++++++++++++++++++");
                                //setassembles(result);
                            }
                        }
                    }
                    else{
                        clearInterval(myvar1);
                    }
                },5000);
        }
        if (currentTopic&&topicConfirmFlag===2) {
            fetchAssembleData2();
        }
    }, [topicConfirmFlag]);


    // 动态爬虫结果碎片 渲染
    useEffect(() => {
        async function fetchAssembleData3() {
            console.log("开始动态渲染");
            setrenderFinish(0);
            if(spiderAss&&!renderFinish){
                //infoConstructing();
                var i=0;
                console.log("----------------");
                for (var facet_index=0; facet_index < spiderAss.data.children.length; facet_index++){
                    for (var ass_index=0; ass_index < spiderAss.data.children[facet_index].children.length; ass_index++){
                        asslist.push(spiderAss.data.children[facet_index].children[ass_index]);
                    }
                }

                 //console.log(asslist);
                setassembles(asslist);
                setrenderFinish(1);

            }
        }
        if (currentTopic) {
            var asslist=new Array();
            var arr1=new Array();
            fetchAssembleData3();
        }
    }, [dynamicRenderAss]);


    useEffect(() => {
        if (assembles) {
            console.log("重新计算碎片个数");
            setassnum(assembles.length);
            if (appendAssembleContentFlagToSort) {
                for(var ass_index=0; ass_index<assembles.length; ass_index++){
                    if(assembles[ass_index].assembleContent==appendAssembleContent){
                        const assemble_temp = assembles[ass_index];
                        assembles.splice(ass_index,1);
                        assembles.unshift(assemble_temp);
                        break;
                    }
                }
            }
        }
    }, [appendAssembleContentFlagToSort, deleteAssembleToSort, assembles, currentTopic])


    // 自动构建时的fetch tree data
    useEffect(() => {
        console.log(autocurrentTopic);
        async function autofetchTreeData() {
            const autotreeData = await YottaAPI.getCompleteTopicByNameAndDomainName(currentSubjectDomain.domain,autocurrentTopic);
            console.log("fetch tree data:",autotreeData);
            if (autotreeData)
                setautotreeData(autotreeData);
        }
        autofetchTreeData();
    }, [autocurrentTopic]);

    // 自动构建时的draw tree data
    useEffect(() => {
        if (treeRef && autotreeData) {
            if (treeData.childrenNumber === 0) {
                alert("当前页面无分面树");
            }
            else{
                console.log("autotreeData.children.length",autotreeData.children.length);
                if (treeRef.current && autotreeData && autotreeData.children.length !==0) {
                    drawTreeNumber(treeRef.current, autotreeData, d => { });
                    console.log("树",treeRef.current);
                }
            }
        }
    }, [autotreeData])


    // 自动构建时计算碎片个数
    useEffect(() => {
        async function autofetchAssembleData(){
            const res = await YottaAPI.getAssembleByName(currentSubjectDomain.domain,autocurrentTopic);
            if(res){
                setassnum(res.length);
                setassembles(res);
                console.log("res.length",res.length);
            }
        }
        autofetchAssembleData();
    },[autocurrentTopic])


    useEffect(() => {
        async function fetchAutoConstruct() {
            const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            if(topicsData){
                    var i=0;
                    var autoInterval = setInterval(()=>{
                    if(i==topicsData.length){
                        console.log("默认主题为",topicsData[0].topicName);
                        setcurrentTopic(topicsData[0].topicName);
                        clearInterval(autoInterval);
                        localStorage.setItem("visitedAssemble", "yes")
                        // if(constructType=='cool')
                        // {if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
                        //     setStep(0)
                        // }else{
                        //     setStep(3)
                        // }}
                        infoFinish();
                        setfirstTime(1);
                        setdata0(1);
                    }else
                    {
                        setautocurrentTopic(topicsData[i].topicName);
                        i++;
                    }
                },500);
            }
        }
        if (currentSubjectDomain.domain&&autoCons===0){
            console.log("现在的autoCons为",autoCons);
            fetchAutoConstruct();
        }
    }, [autoCons])


    useEffect(()=>{
      if (localStorage.getItem("visitedAssemble")) {
                setautoCons(0);
            }else{
                setautoCons(1);
        }
    },[])

    useEffect(()=>{
        if(constructType=='cool'&&firstTime===1)
        {if(cookie.load('c-type')&&cookie.load('c-type')==='1'){
            setStep(0)
        }else{
            setStep(3)
        }}
    },[data0])

    const infoFinish = () => {
        //message.config({duration: 1,  maxCount: 3})
        message.success('碎片构建成功，已全部展示！')
    };
    const infoSpiderFinish = () => {
        //message.config({duration: 1,  maxCount: 3})
        message.success('已展示当前爬取的全部碎片！')
    };
    const infoDelete = () => {
        message.config({duration: 1,  maxCount: 3})
        message.info('碎片删除成功，正在重新构建，请稍后！')
    };
    const infoInsert = () => {
        message.config({duration: 1,  maxCount: 3})
        message.info('碎片插入成功，正在重新构建，请稍后！')
    };
    const infoConstructing = () => {
        message.config({duration: 1,  maxCount: 3})
        message.info('正在构建碎片，请稍后！')
    };


    const showDrawer = () => {
        setvisibleDrawer(!visibleDrawer);
      };


    return (
        <>
             <Card title="主题分面树" style={treeStyle}>
                 <svg ref={ref => treeRef.current = ref} style={{width:'100%',height:'250px'}}></svg>
            </Card>
            <Card title="圆形布局图" style={chartStyle}>
                {
                    showSpiderState ? (
                        !pauseSpider ? (
                            <>
                            <button class="ant-btn ant-btn-ghost ant-btn-sm" onClick={showDrawer} style={{ position:"absolute",right:'5%', top:"15%", width:"120px",height:"28px",}}>
                            展开爬虫小组件
                            </button>
                            <Drawer
                            title={"爬虫控制小组件"}
                            placement="right"
                            closable={false}
                            onClose={showDrawer}
                            visible={visibleDrawer}
                            getContainer={false}
                            style={{ position: 'absolute'}}
                          >
                            <div style={{fontSize:"18px", fontWeight:"bold", marginTop:"5%", textAlign: 'left'}}>当前主题 &nbsp;&nbsp;<span style={{color:"black"}}>{currentTopic}</span></div>
                            <div style={{fontSize:"18px", fontWeight:"bold", marginTop:"5%", textAlign: 'left'}}>爬虫状态 &nbsp;&nbsp;<span style={{color:"black"}}>进行中</span></div>
                            <div style={{fontSize:"18px", fontWeight:"bold", marginTop:"8%", textAlign:"left"}}><span style={{color:"#979693",}}>暂停爬取按钮</span></div>
                            <button class="ant-btn ant-btn-ghost ant-btn-sm" onClick={onPauseSpider} style={{ position:"absolute",right:'25%', top:"35.5%", width:"30px",height:"22px",}}>
                            <PauseOutlined />
                            </button>
                            <div style={{fontSize:"18px", fontWeight:"bold", marginTop:"6%", textAlign: 'left'}}><span style={{color:"#979693",}}>停止爬取按钮</span></div>
                            <button class="ant-btn ant-btn-ghost ant-btn-sm" onClick={onQuitSpider} style={{ position:"absolute",right:'25%', top:"44%", width:"30px",height:"22px",}}>
                            <StopOutlined />
                            </button>
                            </Drawer>
                            </>
                        ):
                        (
                            <>
                            <button class="ant-btn ant-btn-ghost ant-btn-sm" onClick={showDrawer} style={{ position:"absolute",right:'5%', top:"15%", width:"120px",height:"28px",}}>
                            展开爬虫小组件
                            </button>
                            <Drawer
                            title={"爬虫控制小组件"}
                            placement="right"
                            closable={false}
                            onClose={showDrawer}
                            visible={visibleDrawer}
                            getContainer={false}
                            style={{ position: 'absolute' }}
                          >
                            <div style={{fontSize:"18px", fontWeight:"bold", marginTop:"5%", textAlign: 'left'}}>当前主题 &nbsp;&nbsp;<span style={{color:"black"}}>{currentTopic}</span></div>
                            <div style={{fontSize:"18px", fontWeight:"bold", marginTop:"5%", textAlign: 'left'}}>爬虫状态 &nbsp;&nbsp;<span style={{color:"black"}}>暂停中</span></div>
                            <div style={{fontSize:"18px", fontWeight:"bold", marginTop:"8%", textAlign:"left"}}><span style={{color:"#979693",}}>继续爬取按钮</span></div>
                            <button class="ant-btn ant-btn-ghost ant-btn-sm" onClick={onPlaySpider} style={{ position:"absolute",right:'25%', top:"35.5%", width:"30px",height:"22px",}}>
                            <CaretRightOutlined />
                            </button>
                            <div style={{fontSize:"18px", fontWeight:"bold", marginTop:"6%", textAlign: 'left'}}><span style={{color:"#979693",}}>停止爬取按钮</span></div>
                            <button class="ant-btn ant-btn-ghost ant-btn-sm" onClick={onQuitSpider} style={{ position:"absolute",right:'25%', top:"44%", width:"30px",height:"22px",}}>
                            <StopOutlined />
                            </button>
                            </Drawer>
                            </>
                        )

                    ):
                    (
                        <></>
                    )

                }
                 <div style={{ width: '100%', height: '670px' }} >
                    <svg ref={ref => mapRef.current = ref} id='map' style={{ width: '65%',height:'60%' }}></svg>
                    <svg ref={ref => treeRef1.current = ref} style={{position:'absolute',left:'0',marginLeft:"125px",visibility: 'hidden',top:"20px", marginTop:"80px"}}></svg>
                </div>
            </Card>
             <Card title="主题碎片数量统计" style={countStyle}>
                <Card.Grid style={{width:'100%',height:'50px'}} >
                     类型：   碎片
                </Card.Grid>
                <Card.Grid style={{width:'100%',height:'50px'}} >
                     碎片个数：   <span style={{color:'red',fontWeight:'bolder'}}>{assnum}</span>
                </Card.Grid>

             </Card>
             <Card title="增量统计" style={increaseStyle}>
                <Card.Grid style={{width:'100%',height:'100px'}} >
                    近一个月新增碎片数量：<span style={{color:'red',fontWeight:'bolder'}}>{newassnum}</span>
                </Card.Grid>
             </Card>


             <Card  extra={<PlusOutlined style={{top:'50px'}} onClick={onAppendAssemble}/>} title={"碎片"+spiderText} style={assembleStyle}>
                {
                    assembles && currentTopic? (
                         assembles.map(
                                (assemble,index)=>
                                   (
                                        <Card.Grid style={{width:"100%",height:"80%"}} key={index}>
                                            <button class="ant-btn ant-btn-ghost ant-btn-circle-outline ant-btn-sm" onClick={onDeleteAssemble.bind(null,assemble.assembleId)} style={{ position:"absolute",right:'3%'}}>
                                                <DeleteOutlined />
                                            </button>
                                            {
                                                !renderFinish ?
                                                (
                                                    <>
                                                    <div style={{textAlign:"left"}} dangerouslySetInnerHTML={{__html: assemble.assembleContent}}></div>
                                                    </>
                                                ) :
                                                (
                                                    <Leaf assemble={assemble} key={index}>
                                                    </Leaf>
                                                )
                                            }
                                        </Card.Grid>
                                   )
                            )

                    ) :
                    (
                        <Alert style={{fontSize:'20px'}}message="请先选择需要装配的主题" type="info" />
                    )
                }
             </Card>
        </>
    );
}


export default Assemble;
