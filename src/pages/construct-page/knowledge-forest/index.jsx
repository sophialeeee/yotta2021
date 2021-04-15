import React from 'react';
import {Card, Badge, Divider, Modal, Alert, Input} from 'antd';
import {useState} from 'react';
import {useEffect} from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawMap,} from '../../../modules/topicDependenceVisualization';
import {useRef} from 'react';
import Leaf from '../../../components/Leaf'
import {DeleteOutlined, ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";

function KnowledgeForest() {

    const {currentSubjectDomain, setCurrentSubjectDomain} = useCurrentSubjectDomainModel();
    // const [mapdata,setmapdata] = useState();
    const [learningPath, setlearningPath] = useState([]);

    const [currentTopic, setcurrentTopic] = useState('树状数组');

    const [assembles, setassembles] = useState();
    const [assnum, setassnum] = useState(0);
    // const [facetId,setfacetId] = useState();
    const [facetName, setfacetName] = useState('摘要');
    const {confirm} = Modal;
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
        async function fetchDependencesMap() {
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    // setmapdata(res.data);
                    if (res.data && mapRef) {

                        console.log(res.data)
                        drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, clickTopic, clickFacet, onInsertTopic, OnDeleteTopic);
                    } else {
                        alert("该课程下无知识森林数据！")
                        //history.push({pathname:'/nav',state:{login:true}})
                    }
                }
            )

        }

        fetchDependencesMap();
    }, [currentSubjectDomain.domain]);

    /***  insert  ===============================================================================================================**/
    const textareaValueRef = useRef('');
    const {TextArea} = Input;
    const [insertTopic, setInsertTopic] = useState();
    const handleTextareaChange = (e) => {
        textareaValueRef.current = e.target.value;
    }
    const onInsertTopic = () => {
        confirm({
            title: '请输入主题名称',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <TextArea maxLength={100} onChange={handleTextareaChange}/>
            </>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const Topic1 = textareaValueRef.current;
                textareaValueRef.current = '';
                setInsertTopic(Topic1);
                console.log('Topic1', Topic1);

            },
            onCancel() {

            }
        })
    };
    useEffect(() => {
        async function insert() {
            await YottaAPI.insertTopic(currentSubjectDomain.domain, insertTopic);
            setCurrentSubjectDomain()
            // const res = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);

            // settopicData(topicsData);
        }

        if (insertTopic) {
            insert(insertTopic);
        }
    }, [insertTopic])

    /***  insert   ===============================================================================================================**/




    /***  delete  ===============================================================================================================**/

    async function OnDeleteTopic(id) {
        confirm({
            title: "确认删除该主题吗？",
            okText: '确定',
            cancelText: '取消',
            async onOk() {

                const res = id
                const res_data = res.data
                if (!res_data) {
                    alert('删除失败')
                    return
                }
                if (res_data.code == 200) {
                    //重新获取重绘
                    setCurrentSubjectDomain()

                } else {
                    alert(res_data.msg)
                }
            },
            onCancel() {
                console.log('cancel')
            }
        })
    }


    /***  delete  ===============================================================================================================**/


    async function clickFacet(facetId) {
        const res = await YottaAPI.getASsembleByFacetId(facetId);
        setassembles(res);
        const res1 = await YottaAPI.getFacetName1(facetId);
        if (res1) {
            setfacetName(res1.facetName);
        }
    }

    async function clickTopic(topicId, topicName) {
        setcurrentTopic(topicName);
        setfacetName("未选择")
        await YottaAPI.getAssembleByName(currentSubjectDomain.domain, topicName).then(res => {
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
    async function init(domain) {
        if ((!assembles) && domain) {

            const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            setcurrentTopic(topicsData[0].topicName);
            console.log("cTopic", currentTopic)
            await YottaAPI.getAssembleByName(currentSubjectDomain.domain, topicsData[0].topicName).then(res => {
                setassembles(res)
            })
        }
    }

    useEffect(() => {
        console.log("starttttt")
        init(currentSubjectDomain.domain)
    }, [])
    return (
        <>
            <Card title="主题间认知路径图" style={mapStyle}>
                <div style={{width: '100%', height: '700px'}}>
                    <svg ref={ref => mapRef.current = ref} id='map' style={{width: '100%', height: '100%'}}></svg>
                    <svg ref={ref => treeRef.current = ref} id='tree' style={{
                        position: 'absolute', left: '0', marginLeft: 30,
                        visibility: 'hidden',
                        top: 10,
                        marginTop: 56
                    }}></svg>
                </div>
            </Card>

            <Card title="碎片" style={assembleStyle}>

                <Badge color="purple" text={'主题:' + currentTopic}/> &nbsp;&nbsp;&nbsp;
                <Badge color="purple" text={'分面:' + facetName}/> &nbsp;&nbsp;&nbsp;
                <Badge color="purple" text={'碎片数量:' + assnum}/> &nbsp;&nbsp; &nbsp;
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
                            <Alert style={{fontSize: '20px'}} message="点击左侧圆形布局图以查看碎片" type="info"/>
                        )
                }

            </Card>
        </>
    );
};

export default KnowledgeForest;



