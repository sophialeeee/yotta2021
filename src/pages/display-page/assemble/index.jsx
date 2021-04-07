import React from 'react';
import classes from './index.module.css';
import { Modal, Select} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons'
import YottaAPI from '../../../apis/yotta-api';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawTreeNumber} from '../../../modules/facetTree';
import {Card,Alert,Input} from 'antd';
import {PlusOutlined, MinusOutlined, EditOutlined, CloseOutlined} from '@ant-design/icons';
import Leaf from '../../../components/Leaf'

const {confirm} = Modal;



function Assemble() {

    
    const {currentSubjectDomain} = useCurrentSubjectDomainModel();
    const [currentTopic,setcurrentTopic] = useState();
    const [topics,settopics] = useState([]);
    const [assembles,setassembles] = useState();
    const [treeData,settreeData] = useState();
    const [assnum,setassnum] = useState(0);
    const [newassnum, setnewassnum] = useState(0);
    const [facet, setfacet] = useState();
    const [currentFacetId, setcurrentFacetId] = useState();
    const textareaValueRef = useRef('');
    const [appendAssembleContent,setappendAssembleContent] = useState();
    const [deleteAssemble,setdeleteAssemble] = useState();
    const [updateAssembleId,setupdateAssembleId] = useState();
    const [updateAssembleContent,setupdateAssembleContent] = useState();
    const {TextArea} = Input;
   
 
    const handleTextareaChange= (e)=>{
        textareaValueRef.current = e.target.value;
    }
    
    const treeStyle = {
        width:'40%',
        position: 'absolute',
        left: '0%',
        textAlign: 'center',
        top:'50px',
        
      };
    const countStyle = {
        width:'20%',
        position:'absolute',
        left:'42%',
        textAlign:'center',
        top:'50px',
        lineHeight:'10px',
    }
    const increaseStyle = {
        width:'35%',
        position:'absolute',
        left:'63%',
        textAlign:'center',
        top:'50px',
        lineHeight:'10px',
    }
    const assembleStyle = {
        width:'56%',
        position:'absolute',
        left:'42%',
        textAlign:'center',
        top:'220px',
        height:'590px',
        overflow: 'auto',
    }


    const onAutoConstructClick = () => {
        let currentTopic1 = '';
        const onSelectChange = (e) => { 
            currentTopic1 = e;  
        }
        confirm({
            title: '请选择要装配的主题',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <span>
                    主题：
                </span>
                    <Select onSelect={onSelectChange}>
                        {
                            topics.map((topicName)=>(
                            <option value={topicName} >{topicName}</option> 
                            ))
                        }
                    </Select> 
                </div>   
                
            </>,
            okText: '开始装配',
            cancelText: '取消',
            onOk() {
                setcurrentTopic(currentTopic1);
               
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


    const treeRef = useRef();

    //根据domainName获取分面信息
    useEffect(()=>{
        async function fetchFacetData(){
            await YottaAPI.getFacetByDomainName(currentSubjectDomain.domain).then(res=>{
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
        }
        if(deleteAssemble){
            deleteAss();
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
            }
  
        }
        countUpdateAss();
    }, [assembles, currentTopic])




    useEffect(() => {
        async function fetchTreeData() {
            const treeData = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
            settreeData(treeData);
            console.log(treeData);
        }
        fetchTreeData();
    }, [currentTopic,appendAssembleContent, deleteAssemble, updateAssembleContent]);

   
    useEffect(() => {
        if (treeRef && treeData) {
            drawTreeNumber(treeRef.current, treeData, ()=>{});
        }
    }, [treeData])

    useEffect(() => {
        async function fetchTopicsData() {
            const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            settopics(topicsData.map((topic) => (topic.topicName)));
            setcurrentTopic(topicsData[0].topicName);  // 默认topic
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
            //setcurrentTopic('树状数组');
        }
    }, [currentSubjectDomain.domain])


    useEffect(()=>{
       
        async function fetchAssembleData(){
            await YottaAPI.getAssembleByName(currentSubjectDomain.domain,currentTopic).then(res=>{
                setassembles(res)
            })
        }
        fetchAssembleData();
        
    },[appendAssembleContent, deleteAssemble, updateAssembleContent, currentTopic])


    useEffect(() => {
        if (assembles ) {
            setassnum(assembles.length);
        }
    }, [appendAssembleContent, deleteAssemble, assembles, currentTopic])
    

    return (
        <>
             <a className={classes.hint} onClick={onAutoConstructClick} style={{fontSize:'20px'}}>
                    请选择要装配的主题
             </a>
             <Card title="主题分面树" style={treeStyle}>
                 <Card.Grid style={{width:'100%',height:'700px'}} >
                     <svg ref={ref => treeRef.current = ref} id='tree' style={{width:'100%',height:'620px'}}>    
                     </svg>
                 </Card.Grid> 
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
        

             <Card title="碎片" style={assembleStyle}>
                {
                    
                    assembles ? (
                        
                        assembles.map(
                            
                            (assemble)=>
                                (
                                    
                                    <Card.Grid style={{width:"100%",height:"80%"}} >
                                        <div style={{ borderRadius: 4, marginBottom: 16, }} dangerouslySetInnerHTML={{__html:assemble.assembleContent}}>
                                        </div>
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
