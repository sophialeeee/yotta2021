import React from 'react';
import { Card, Badge, Divider,Alert } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import { drawMap } from '../../../modules/topicDependenceVisualization';
import { useRef } from 'react';
import Leaf from '../../../components/Leaf'

function KnowledgeForest () {
  const { currentSubjectDomain } = useCurrentSubjectDomainModel();
  // const [mapdata,setmapdata] = useState();
  const initialAssemble = useRef();
  const [learningPath, setlearningPath] = useState([]);
  const [currentTopic, setcurrentTopic] = useState('字符串');
  const [assembles, setassembles] = useState(initialAssemble.current);
  const [assnum, setassnum] = useState(0);
  // const [facetId,setfacetId] = useState();
  const [facetName, setfacetName] = useState('摘要');
  const mapStyle = {
    width: '50%',
    position: 'absolute',
    left: '0%',
    textAlign: 'center',
    top: '5px'
  }
  const assembleStyle = {
    width: '47%',
    position: 'absolute',
    right: '0%',
    textAlign: 'center',
    top: '5px',
    height: '810px',
    overflow: 'auto',
  }
  const mapRef = useRef();
  const treeRef = useRef();
  // 画认知关系图
  useEffect(() => {
    async function fetchDependencesMap () {
      await YottaAPI.getMap(currentSubjectDomain.domain).then(
        (res) => {
          if (res.data.relationCrossCommunity.length !==0 && mapRef ) {
          // if (res.data && mapRef && (learningPath.length !== 0)) {
            drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, clickTopic, clickFacet);
          } else {
            alert("该课程下无知识森林数据！")
          }
        }
      )
    }

    fetchDependencesMap();

  }, [currentSubjectDomain.domain]);


  async function clickFacet (facetId) {
    const res = await YottaAPI.getASsembleByFacetId(facetId);
    setassembles(res);
    const res1 = await YottaAPI.getFacetName1(facetId);
    setfacetName(res1.facetName);
  }

  async function clickTopic (topicId, topicName) {
    setcurrentTopic(topicName);
  }


  // clickFacet();
  useEffect(() => {
    if (assembles) {
      setassnum(assembles.length);
    }
  }, [assembles])

     if(!assembles){
        YottaAPI.getASsembleByFacetId(2).then(
            res=>
            {
                console.log('res11111111111111111111111',res);
                setassembles(res);
            }
        );
       
    }
  //   async function init(domain){
  //     if((!assembles)&&domain){

  //             const res= await YottaAPI.getFirstTopicByDomainName(domain)
  //             console.log("resssssssss",res)
  //             if(res.data.code===200)
  //             {
  //               console.log("resssssssss",res.data.topicName)
                
  //               if(res.data.data&&res.data.data.children)
  //                 {
  //                   setcurrentTopic(res.data.data.topicName);
  //                   setfacetName(res.data.data.children[0].facetName)
                  
  //                   const res1 = await YottaAPI.getASsembleByFacetId(res.data.data.children[0].facetId);
  //                   setassembles(res1);
  //             }else{;}  
  //             }else{
  //               ;
  //             }
  //         }
  // }
  // useEffect(()=>{
  //     console.log("starttttt")
  //     init(currentSubjectDomain.domain)
  // },[])
  return (
    <>
      <Card title="知识森林概览" style={mapStyle}>
        <div style={{ width: '100%', height: '700px' }}>
          <svg ref={ref => mapRef.current = ref} id='map' style={{ width: '100%', height: '100%' }}></svg>
          <svg ref={ref => treeRef.current = ref} id='tree' style={{
            position: 'absolute', left: '0', marginLeft: 30,
            visibility: 'hidden',
            top: 10,
            marginTop: 56
          }}></svg>
        </div>
      </Card>

      <Card title="碎片" style={assembleStyle}>

        <Badge color="purple" text={'主题:' + currentTopic} /> &nbsp;&nbsp;&nbsp;
                <Badge color="purple" text={'分面:' + facetName} /> &nbsp;&nbsp;&nbsp;
                <Badge color="purple" text={'碎片数量:' + assnum} /> &nbsp;&nbsp; &nbsp;
                <Divider></Divider>
        {
          assembles ? (
            assembles.map(
              (assemble) =>
              (
                <Leaf assemble={assemble} key={assemble.assembleId}></Leaf>
              )
            )
          ) :
            (
                <Alert style={{fontSize:'20px'}}message="点击左侧圆形布局图以查看碎片" type="info" />
            )
        }

      </Card>
    </>
  );
}

export default KnowledgeForest;



