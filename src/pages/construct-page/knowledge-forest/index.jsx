import React from 'react';
import {Card, Badge, Divider, Modal} from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawMap} from '../../../modules/topicDependenceVisualization';
import { useRef } from 'react';
import Leaf from '../../../components/Leaf'
import {DeleteOutlined, ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
function KnowledgeForest() {
    const {currentSubjectDomain ,setCurrentSubjectDomain} = useCurrentSubjectDomainModel();
    // const [mapdata,setmapdata] = useState();
    const [learningPath,setlearningPath] = useState([]);
    const [currentTopic,setcurrentTopic] = useState('树状数组');
    const [assembles,setassembles] = useState();
    const [assnum,setassnum] = useState(0);
    // const [facetId,setfacetId] = useState();
    const [facetName,setfacetName] = useState('摘要');
    const {confirm} = Modal;
    const mapStyle = {
        width:'50%',
        position:'absolute',
        left:'0%',
        textAlign:'center',
        top:'5px'
    }
    const assembleStyle = {
        width:'47%',
        position:'absolute',
        right:'0%',
        textAlign:'center',
        top:'5px',
        height:'810px',
        overflow: 'auto',
    }
    const mapRef = useRef();
    const treeRef = useRef();
    // 画认知关系图
    useEffect(()=>{
        async function fetchDependencesMap(){
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    // setmapdata(res.data);
                    if(res.data&&mapRef){
                        drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,clickTopic, clickFacet);}
                }
            )

        }
        fetchDependencesMap();
    },[currentSubjectDomain.domain]);


    async  function  insertTopic(domainName, topicName){
        const res = await YottaAPI.insertTopic_zyl(domainName, topicName)
        const res_data  = res.data
        if (!res_data){
            alert('插入主题失败')
            return
        }
        if (res_data.code==200){

            setCurrentSubjectDomain()
            // //重新获取重绘
            // await YottaAPI.getMap(currentSubjectDomain.domain).then(
            //     (res) => {
            //         if(res.data&&mapRef){
            //             drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,clickTopic, clickFacet);}
            //     }
            // )
        }else {
            alert(res.data.msg)
        }



    }

    async function  deleteTopic_t  (domainName_p, topicName_p) {
        confirm({
            title: "确认删除该主题吗？",
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                const res = await YottaAPI.deleteTopic(domainName_p, topicName_p)
                const res_data  = res.data
                if (!res_data){
                    alert('删除失败')
                    return
                }
                if (res_data.code==200){
                    //重新获取重绘
                    setCurrentSubjectDomain()
                    // await YottaAPI.getMap(currentSubjectDomain.domain).then(
                    //     (res) => {
                    //         // setmapdata(res.data);
                    //         if(res.data&&mapRef){
                    //             drawMap(res.data,mapRef.current,treeRef.current,currentSubjectDomain.domain,learningPath,clickTopic, clickFacet);}
                    //     }
                    // )
                }else {
                    alert(res_data.msg)
                }
            },
            onCancel() {
                console.log('cancel')
            }
        })
    }

    async function clickFacet(facetId){
            const res = await YottaAPI.getASsembleByFacetId(facetId);
            setassembles(res);
            const res1 = await YottaAPI.getFacetName1(facetId);
            setfacetName(res1.facetName);
    }
    
    async function clickTopic(topicId,topicName){
        setcurrentTopic(topicName);
    }
        // clickFacet();
    useEffect(()=>{
        if(assembles){
            setassnum(assembles.length);   
    }
    },[assembles])
    
    if(!assembles){

        YottaAPI.getASsembleByFacetId(2).then(
            res=>
            {
                console.log('res11111111111111111111111',res);
                setassembles(res);
            }
        );

    }
    return (
        <>
            <Card title="主题间认知路径图" style={mapStyle}>
                <div style={{ width: '100%', height: '700px' }} >
                  <svg ref={ref => mapRef.current = ref} id='map' style={{ width: '100%',height:'100%' }}></svg>
                           <svg ref={ref=>treeRef.current = ref} id='tree' style={{position:'absolute',left:'0',marginLeft:30,
            visibility: 'hidden',
            top: 10,
            marginTop: 56}}></svg>
                </div>
            </Card>
            
            <Card  title="碎片" style={assembleStyle}>

                <Badge color="purple" text={'主题:'+currentTopic}/> &nbsp;&nbsp;&nbsp;  
                <Badge color="purple" text={'分面:'+facetName}/> &nbsp;&nbsp;&nbsp;  
                <Badge color="purple" text={'碎片数量:'+assnum}/> &nbsp;&nbsp; &nbsp; 
                <Divider></Divider>
                {
                    assembles? (
                            assembles.map(
                                (assemble)=>
                                    (
                                        <Leaf assemble={assemble} key={assemble.assembleId}></Leaf>
                                    )
                            )
                        ) :
                        (
                            null
                        )
                }
               
            </Card>
        </>
    );
};

export default KnowledgeForest;



