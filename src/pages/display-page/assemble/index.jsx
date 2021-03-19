import React from 'react';
import classes from './index.module.css';
import { Modal, Select} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons'
import YottaAPI from '../../../apis/yotta-api';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawTreeNumber} from '../../../modules/facetTree';
import {Card} from 'antd';


const {confirm} = Modal;





function Assemble() {

   
    
    const {currentSubjectDomain} = useCurrentSubjectDomainModel();
    const [currentTopic,setcurrentTopic] = useState();
    const [topics,settopics] = useState([]);
    const [assembles,setassembles] = useState();
    const [treeData,settreeData] = useState();
    const [assnum,setassnum] = useState(0);
    
 
      
    
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

    const treeRef = useRef();

    useEffect(() => {
        console.log(currentTopic);
        async function fetchTreeData() {
            const treeData = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
            settreeData(treeData);
            
        }
        fetchTreeData();
    }, [currentTopic]);


    useEffect(() => {
        if (treeRef && treeData) {
            drawTreeNumber(treeRef.current, treeData, d => { });
        }
    }, [treeData])

    useEffect(() => {
        async function fetchTopicsData() {
            const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            settopics(topicsData.map((topic) => topic.topicName));
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
            setcurrentTopic('树状数组');
        }
    }, [currentSubjectDomain.domain])

   

    useEffect(()=>{
       
        async function fetchAssembleData(){
            await YottaAPI.getAssembleByName(currentSubjectDomain.domain,currentTopic).then(res=>{
                setassembles(res)
            })
        }
        fetchAssembleData();
        
    },[currentTopic,currentSubjectDomain])
   
    useEffect(() => {
        if (assembles ) {
            setassnum(assembles.length);
        }
    }, [assembles,currentTopic])
    
  

    return (
        <>
             <a className={classes.hint} onClick={onAutoConstructClick}>
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
                     碎片个数：   {assnum}
                </Card.Grid> 
                
             </Card>
             <Card title="增量统计" style={increaseStyle}>
                <Card.Grid style={{width:'100%',height:'100px'}} >
                    近一个月新增碎片数量：0
                </Card.Grid>  
             </Card>
       

             <Card  title="碎片" style={assembleStyle}>
                {
                    
                    assembles ? (
                        
                         assembles.map(
                            
                               (assemble)=>
                                   (
                                   
                                       <div style={{ borderRadius: 4, border: '1px solid #bfbfbf', marginBottom: 16}} dangerouslySetInnerHTML={{__html:assemble.assembleContent}}>

                                       </div>

                               
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
}


export default Assemble;
