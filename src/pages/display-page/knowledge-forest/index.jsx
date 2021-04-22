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
import {ExclamationCircleOutlined} from "@ant-design/icons";
function KnowledgeForest () {
  const { currentSubjectDomain,setCurrentSubjectDomain } = useCurrentSubjectDomainModel();
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
  // 画认知关系图
  useEffect(() => {
    async function fetchDependencesMap () {
      await YottaAPI.getMap(currentSubjectDomain.domain).then(
        
        (res) => {
          if (res.data.relationCrossCommunity.length !==0 && mapRef ) {
          // if (res.data && mapRef && (learningPath.length !== 0)) {
          //   drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, clickTopic, clickFacet,onDeleteTopic,()=>{
          //     alert("装载主题")
          //   },select,onInsertTopic);
            drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, clickTopic, clickFacet);
          } else {
            alert("该课程下无知识森林数据！")
            history.push({pathname:'/nav',state:{login:true}})
          }
        }
      )
    }

    fetchDependencesMap();

  }, [currentSubjectDomain.domain]);

  /***  insert  ===============================================================================================================**/
  const textareaValueRef = useRef('');
  const {TextArea} = Input;
  const handleTextareaChange = (e) => {
    textareaValueRef.current = e.target.value;
  }
  // const [insertTopic, setInsertTopic] = useState();

  const onInsertTopic = () => {
    setTimeout(hide, 0);
    reSet()

    confirm({
      title: '请输入主题名称',
      icon: <ExclamationCircleOutlined/>,
      content: <>
        <TextArea maxLength={100} onChange={handleTextareaChange}/>
      </>,
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const Topic1 = textareaValueRef.current;
        textareaValueRef.current = '';

        console.log(currentSubjectDomain.domain,Topic1)
        const res = await YottaAPI.insertTopic_zyl(currentSubjectDomain.domain, Topic1);
        if (res.code == 200) {
          //重新获取重绘
          message.info(res.msg)
          init(currentSubjectDomain.domain)
        } else {
          message.warn(+res.msg)
        }
      },
      onCancel() {
      }
    })
  };
  /***  insert   ===============================================================================================================**/

  /***  delete  ===============================================================================================================**/

  const onDeleteTopic = (name,id) => {
    console.log(name)
    setTimeout(hide, 0);
    reSet()
    confirm({
      title: "确认删除主题："+name+" 吗？",
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const res = await YottaAPI.deleteTopic_zyl(currentSubjectDomain.domain, name);

        if (res.code == 200) {
          message.info(res.msg)
          init(currentSubjectDomain.domain)
        } else {
          message.warn(res.msg)
        }
      },
      onCancel() {
        console.log('cancel')
      }
    })

  };

  /***  delete  end  ===============================================================================================================**/
  /***  addRelation   start ===============================================================================================================**/
  let statu = 0
  let  firstSelect_Name = ''
  let  secSelect_Name = ''
  let hide=null
  const selecting = function (content) {
    hide = message.loading(content,20000);
  };
  const reSet = function () {
    statu = 0
    firstSelect_Name = ''
    secSelect_Name = ''
  };

  const select = async (par1, par2) => {
    console.log(par1, par2)
    if (par1 == -1) {
      message.info("该主题不可选")
    }

    if (statu == 0) {
      firstSelect_Name = par2
      selecting("已经选定主题: " + par2 + ", 请选择另一主题")
      statu = 1
    } else {
      secSelect_Name = par2
      if (statu == 1) {
        if (firstSelect_Name == secSelect_Name) {
          message.info("不可选相同主题")
          secSelect_Name = ''
          return
        }
        setTimeout(hide, 0);

        const res = await YottaAPI.insertRelation_zyl(currentSubjectDomain.domain, firstSelect_Name, secSelect_Name)
        if (res.code == 185) {
          message.warn(res.msg)
        } else {
          message.info(res.msg)
          setCurrentSubjectDomain(currentSubjectDomain.domain)
          // init(currentSubjectDomain.domain)
        }
        reSet()
      }
    }
  }
  /***  addRelation end ===============================================================================================================**/


  async function clickFacet (facetId) {
    const res = await YottaAPI.getASsembleByFacetId(facetId);
    setassembles(res);
    const res1 = await YottaAPI.getFacetName1(facetId);
    if (res1.facetName){
    setfacetName(res1.facetName);
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
    setTimeout(hide, 0);
    reSet()
      console.log("starttttt")
      init(currentSubjectDomain.domain)
  },[])
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



