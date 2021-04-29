import React from 'react';
import {Card, Badge, Divider, Modal, Alert, Input, message} from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import { drawMap } from '../../../modules/topicDependenceVisualization';
import { useRef } from 'react';
import Leaf from '../../../components/Leaf'
import {useHistory} from 'react-router-dom';
import {ExclamationCircleOutlined, ArrowRightOutlined, SwapRightOutlined} from "@ant-design/icons";
function KnowledgeForest () {
  const {currentSubjectDomain,setCurrentSubjectDomain} = useCurrentSubjectDomainModel();
  // const [mapdata,setmapdata] = useState();
  const initialAssemble = useRef();
  const {confirm} = Modal;

  const history = useHistory();
  const [learningPath, setlearningPath] = useState([]);
  const [currentTopic, setcurrentTopic] = useState('字符串');
  const [assembles, setassembles] = useState(initialAssemble.current);
  const [assnum, setassnum] = useState(0);
  // const [facetId,setfacetId] = useState();
  const [facetName, setfacetName] = useState('摘要');
  const mapStyle = {
    width: '56%',
    position: 'absolute',
    left: '0%',
    textAlign: 'center',
    top: '5px'
  }
  const assembleStyle = {
    width: '41%',
    position: 'absolute',
    right: '0%',
    textAlign: 'center',
    top: '5px',
    height: '810px',
    overflow: 'auto',
  }
  const mapRef = useRef();
  const treeRef = useRef();

  function nameCheck(originName) {
    // var tempName = originName;
    // if (originName.search('\\+') != -1){
    //     console.log("tempName", tempName);
    //     tempName = originName.replace("+", "jiahao");
    //     console.log("tempName", tempName);
    // };
    var english_name = /^[a-zA-Z]+$/.test(originName);
    // if (topicName.search('\\(') != -1){
    //     tempName = topicName.replace("(", " (");
    // };
    return {
        // checkedName: tempName,
        isEnglish: english_name
    }
}
  function emptyChildren(dom) {
    if (dom){
      const children = dom.childNodes;
      while (children.length > 0) {
        dom.removeChild(children[0]);
      }
    }

  };
  useEffect(() => {
    fetchMap();
  }, [currentSubjectDomain.domain]);

  let data;
  /***  insert  ===============================================================================================================**/
  async function fetchMap() {
    emptyChildren(mapRef.current)
    emptyChildren(treeRef.current)
    await YottaAPI.getMap(currentSubjectDomain.domain).then(
        (res) => {
          // setmapdata(res.data);
          if (res.data && mapRef&&mapRef.current) {
             drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, clickTopic,
                 clickFacet,
                 ()=>{},
                 ()=>{},
                 ()=>{},
                 ()=>{},
                 ()=>{},
                 ()=>{},'none',()=>{},()=>{});

          } else {
            if (res.data){
            }else {
              alert("该课程下无知识森林数据！")
            }

            // history({pathname:'/nav',state:{login:true}})
          }
        }
    )

  }



  async function clickFacet (facetId) {
    const res = await YottaAPI.getASsembleByFacetId(facetId);
    setassembles(res);
    const res1 = await YottaAPI.getFacetName1(facetId);
    if(res1){
        if (res1.facetName){
        setfacetName(res1.facetName);
      }
    }

  }

  async function clickTopic (topicId, topicName) {
    setcurrentTopic(topicName);
    setfacetName("未选择")
    await YottaAPI.getAssembleByName(currentSubjectDomain.domain,topicName).then(res=>{
      setassembles(res)
  })
  }


  // clickFacet();
  useEffect(() => {
    if (assembles) {
      setassnum(assembles.length);
    }
  }, [assembles])

    //  if(!assembles){
    //     YottaAPI.getASsembleByFacetId(2).then(
    //         res=>
    //         {
    //             console.log('res11111111111111111111111',res);
    //             setassembles(res);
    //         }
    //     );

    // }
    async function init(domain){
      if((!assembles)&&domain){

        const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
        if(topicsData)
        {setcurrentTopic(topicsData[0].topicName); 
        console.log("cTopic",currentTopic)
        await YottaAPI.getAssembleByName(currentSubjectDomain.domain,topicsData[0].topicName).then(res=>{
          setassembles(res)
      })}
          }
  }
  useEffect(()=>{

      console.log("starttttt")
      init(currentSubjectDomain.domain)
  },[])

  /***/
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      console.log('I am Update')
    } else {
      console.log('I am didUpdate')
      // emptyChildren(mapRef.current)
      // emptyChildren(treeRef.current)
    }
  });




  /* */


  return (
    <>
      <Card title="知识森林概览" style={mapStyle}>
        <div style={{ width: '100%', height: '700px'}}>
          <svg ref={ref => mapRef.current = ref} id='map' style={{ width: '100%', height: '100%'  }}></svg>
          <svg ref={ref => treeRef.current = ref} id='tree' style={{
            position: 'absolute', left: '0', marginLeft: 28,
            visibility: 'hidden',
            top: 10,
            marginTop: 68
          }}></svg>
        </div>
      </Card>

      <Card title="碎片" style={assembleStyle}>
      <div style={{height: "70px", marginTop: "15px"}}>
        <Badge color="white" text={'主题:' + currentTopic}/> &nbsp;&nbsp;&nbsp;
        <span style={{fontSize:"25px"}}>→</span>
        <Badge color="white" text={'分面:' + facetName} /> &nbsp;&nbsp;&nbsp;
        <span style={{fontSize:"25px"}}>→</span>
        <Badge color="white" text={'碎片数量:' + assnum} /> &nbsp;&nbsp; &nbsp;
      </div>
        {
          assembles ? (
            assembles.map(
              (assemble) =>
              (
                <Card.Grid style={{width:"100%",height:"80%"}}>
                  <Leaf assemble={assemble} key={assemble.assembleId}></Leaf>
                </Card.Grid>
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



