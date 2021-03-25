import React from 'react';
import { drawTree,drawTreeNumber,drawTreeDel } from '../../../module/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import { useState } from 'react';
import YottaAPI from '../../../apis/yotta-api';
import {ExclamationCircleOutlined,PlusOutlined} from '@ant-design/icons';
import { Card,Input,Modal } from 'antd';
//推上去？
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
    console.log('程序处于单个构建页面');
    const { currentSubjectDomain } = useCurrentSubjectDomainModel();
    const [topics, settopics] = useState([]);
    const [topicsData,settopicsData] = useState();
    const [currentTopic, setcurrentTopic] = useState();
    const [treeData, settreeData] = useState();
    const [assembles,setassembles] = useState();
    const textareaValueRef = useRef('');
    const [insertTopic1,setinsertTopic1] = useState();
    const {confirm} = Modal;
    const {TextArea} = Input;
    const resultTree = useRef();
   
 
    const handleTextareaChange= (e)=>{
        textareaValueRef.current = e.target.value;
    }
   
    const onClickTopic = (topicName,e) => {
        emptyChildren(treeRef.current);
        //console.log("重启时数据",treeRef.current.childNodes);
        setcurrentTopic(topicName);
        // 闪烁效果 
        e.persist();
        let my = setInterval(() => {
            let opacity = e.target.style.opacity;
            e.target.style.opacity = 1-(+opacity||0)
            e.target.style.color = 'red';     
        }, 500);
        var myvar1 = setInterval(
            async function fetchTreeData() {
             if(currentSubjectDomain.domain && topicName) {
                const result = await YottaAPI.getDynamicMulti(currentSubjectDomain.domain,topicName);
                resultTree.current = result;
                //  const result = resultTree.current;
                //  console.log('resulttttttt',result);
                 if(result){
                    console.log('result.code',result.code);
                    if(result.code === 200 ){
                       //emptyChildren(treeRef.current)
                       e.target.style.opacity = 1
                       e.target.style.color = 'green'
                         clearInterval(myvar1);
                         clearInterval(my)
                         //console.log("结束时数据",treeRef.current.childNodes);
                    }  
                 }
                //  const result = await YottaAPI.getDynamicTreeData(currentSubjectDomain.domain,topicName,true);
                // const result = await YottaAPI.getDynamicMulti(currentSubjectDomain.domain,topicName);
                //  console.log('result.code',result.code);
                //  if(result.code == 200 ){
                //       e.target.style.opacity = 1
                //       e.target.style.color = 'green'
                //       clearInterval(myvar1);
                //       clearInterval(my)
                //  }  
             }
             else{
                 clearInterval(myvar1);
             }
         },3000)
         if(e.target.style){
             console.log('wojinjinjinlaile');
             console.log('e.target.style.opacity',e.target.style.opacity)
         }
    };
    function emptyChildren(dom) {
        const children = dom.childNodes;
        while (children.length > 0) {
            dom.removeChild(children[0]);
        }
    };

    
   
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
    useEffect(()=>{
        async function insert(){
            await YottaAPI.insertTopic(currentSubjectDomain.domain,insertTopic1);
        }
        if(insertTopic1){
            insert(insertTopic1);
        }
    },[insertTopic1]) 
    const treeRef = useRef();
    useEffect(() => {   

        var myvar = setInterval(
           async function fetchTreeData() {
            console.log('currentTopic',currentTopic);

            if(currentSubjectDomain.domain && currentTopic){
                // const result = await YottaAPI.getDynamicTreeData(currentSubjectDomain.domain,currentTopic,true);
               // const result = await YottaAPI.getDynamicMulti(currentSubjectDomain.domain,currentTopic);
               const result = resultTree.current; 
               if(result){
                const treeData = result.data;
                console.log('result.code',result.code);
                if(result.code === 200){
                     clearInterval(myvar);
                }
                settreeData(treeData);
               }
            }
            else{
                clearInterval(myvar);
            }  
        },3000)
        // async function fetchTreeData(){
        //     const treeData = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
        //     if(treeData){
        //         settreeData(treeData)
        //     }
        // }
        // fetchTreeData()
    }, [currentTopic]);
    // 画分面树
    useEffect(() => {
        if (treeRef && treeData) {
            if(treeData.childrenNumber === 0){
                emptyChildren(treeRef.current); 
                console.log('该主题下暂无数据');    
            }
            else{
                if(treeRef.current.childNodes.length === 0 ){
                    console.log('调用drawTree函数')
                    drawTree(treeRef.current,treeData,clickFacet,clickBranch);
                }
                else{
                    console.log("画树完成");
                    //console.log('调用drawTreeDel函数')
                    //drawTree(treeRef.current, treeData,clickBranch);
                    //drawTreeDel(treeRef.current,treeData,clickBranch);
                 }
            }
        }
    }, [treeData])
    
    //删除分面调用接口
    async function clickBranch(facetId){
        const res = await YottaAPI.deleteAssembleByFacetId(facetId);
        setassembles(res);
        console.log("branch函数有调用");
        const treeData = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
            if(treeData){
                settreeData(treeData)
            }
        settreeData(treeData);
        
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
                settopics(topicsData.map((topic) =>topic.topicName
));
            }
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
        }
    }, [insertTopic1])
  
    
    return (
        <>
            
            <Card  extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertTopic}/>} title="主题列表" style={topicsStyle}>
                {
                    topics.map(
                        (topicName, index) =>
                            (
                                <Card.Grid style={{ width: '100%', height: '80%',opacity:1}} onClick={onClickTopic.bind(null, topicName)} key={index}>{topicName}</Card.Grid>
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
