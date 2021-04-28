import React from 'react';
import {Card, Badge, Divider, Modal, Alert, Input, message, Select} from 'antd';
import {useState} from 'react';
import {useEffect} from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawMap} from '../../../modules/topicDependenceVisualization';
import {useRef} from 'react';
import Leaf from '../../../components/Leaf'
import {DeleteOutlined, ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import {getMap} from "echarts/lib/echarts";

function KnowledgeForest() {
    const [appendAssembleContent, setappendAssembleContent] = useState();
    const [currentFacetId, setcurrentFacetId] = useState();
    const [facet, setfacet] = useState();
    const [deleteAssemble, setdeleteAssemble] = useState();
    const [appendAssembleContentFlagToFetch, setappendAssembleContentFlagToFetch] = useState();  //新增碎片后前往获取碎片列表
    const [appendAssembleContentFlagToSort, setappendAssembleContentFlagToSort] = useState();   //新增碎片获取列表后，前往置顶步骤
    const [deleteAssembleToFetch, setdeleteAssembleToFetch] = useState();
    const [deleteAssembleToSort, setdeleteAssembleToSort] = useState();
    const [treeData, settreeData] = useState();
    const [mapdata, setmapdata] = useState();

    var [relationData, setrelationData] = useState();
    var [deleteTopicStart, setDeleteTopic1] = useState();
    var [deleteTopicEnd, setDeleteTopic2] = useState();
    var [insertTopic1, setinsertTopic1] = useState();
    var [insertTopic2, setinsertTopic2] = useState();
    const {currentSubjectDomain, setCurrentSubjectDomain} = useCurrentSubjectDomainModel();
    // const [mapdata,setmapdata] = useState();

    const [learningPath, setlearningPath] = useState([]);
    const [insertFacet1, setinsertFacet1] = useState();
    const [currentTopic, setcurrentTopic] = useState('树状数组');
    const [topicName2, settopicName2] = useState();
    const [assembles, setassembles] = useState();
    const [assnum, setassnum] = useState(0);
    // const [facetId,setfacetId] = useState();
    const [facetName, setfacetName] = useState('摘要');
    const {confirm} = Modal;
    const mapStyle = {
        width: '56%',
        position: 'absolute',
        left: '0%',
        height: '810px',
        textAlign: 'center',
        top: '5px',
        //overflow:'scroll'
    }
    const assembleStyle = {
        width: '42%',
        position: 'absolute',
        right: '0%',
        textAlign: 'center',
        top: '5px',
        height: '810px',
        overflow: 'auto',
    }
    const mapRef = useRef();
    const treeRef = useRef();
    // localStorage.removeItem('state');//刷新清空状态量
    function emptyChildren(dom) {
        if (dom) {
            const children = dom.childNodes;
            while (children.length > 0) {
                dom.removeChild(children[0]);
            }
        }

    };


    useEffect(() => {
        fetchMap()
    }, [currentSubjectDomain.domain]);
    let dataTemp = []

    /***  assemble start  ===============================================================================================================**/

    async function assembleTopic(topicId, topicName) {
        confirm({
            title: '是否要装配该主题？',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                setcurrentTopic(currentTopic);
            },
            onCancel() {

            }
        })

    }


    /***  assemble end  ===============================================================================================================**/


    /***  insert  ===============================================================================================================**/
    async function fetchMap() {
        emptyChildren(mapRef.current)
        emptyChildren(treeRef.current)
        const res = await YottaAPI.generateDependences(currentSubjectDomain.domain, nameCheck(currentSubjectDomain.domain).isEnglish);
        if (res) {
            res.map((relation, index) => {
                dataTemp.push({'key': String(index + 1), '主题一': relation.startTopicName, '主题二': relation.endTopicName})
            })
        }
        dataTemp = dataTemp.slice(-res.length)
        await YottaAPI.getMap(currentSubjectDomain.domain).then(
            (res) => {
                // setmapdata(res.data);
                if (res.data && mapRef && mapRef.current) {
                    data_temp = res.data
                    // drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, clickTopic, clickFacet,()=>{},()=>{},()=>{},()=>{},()=>{});
                    drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, clickTopic, clickFacet, onDeleteTopic, () => {
                    }, select, onInsertTopic, () => {
                    }, 'yes', 'yes', 'yes');
                } else {
                    if (res.data) {
                    } else {
                        alert("该课程下无知识森林数据！")
                    }

                    // history({pathname:'/nav',state:{login:true}})
                }
            }
        )

    }

    const textareaValueRef = useRef('');
    const {TextArea} = Input;
    const handleTextareaChange = (e) => {
        textareaValueRef.current = e.target.value;
    }


    async function getGenerateDependency(topicName) {
        await sleep();
        await sleep();
        await sleep();
        let getGenerateDependency_loading = message.loading('耗时操作，生成碎片关系...', 0, () => {

        })

        const resGetGenerateDependency = await YottaAPI.getGenerateDependency_zyl(currentSubjectDomain.domain, topicName);
        if (resGetGenerateDependency.code == 200) {
            message.info(resGetGenerateDependency.msg, 3)
            setTimeout(getGenerateDependency_loading, 2)
            message.info('刷新知识森林概览')
            fetchMap()
        } else {
            message.info(resGetGenerateDependency.msg, 3)
            setTimeout(getGenerateDependency_loading, 1)
            message.info('刷新知识森林概览')

            fetchMap()
        }

    }


    async function askIncremental(topicName) {

        var timer = setInterval(async function () {
            const resIncremental = await YottaAPI.spiderFacet_zyl(currentSubjectDomain.domain, topicName);
            if (resIncremental.code == 200) {
                message.info('爬取结束，共有碎片' + caluNum(resIncremental.data) + '个')
                await sleep();

                getGenerateDependency(topicName)
                setTimeout(timer)

            } else if (resIncremental.code == 301) {
                // message.info(resIncremental.msg)
                message.info('已经爬取碎片' + caluNum(resIncremental.data) + '个')
            } else if (resIncremental.code == 300) {
                await sleep();


                // startSpider(topicName)
            }
        }, 1800);


    }

    function caluNum(res) {
        let total_num = 0
        for (let i = 0; i < res.childrenNumber; i++) {
            let child = res.children[i]
            for (let j = 0; j < child.length; j++) {
                total_num += child[j].childrenNumber
            }
        }
        return total_num
    }


    const sleepTime = 1000

    function sleep() {
        return new Promise(resolve => setTimeout(resolve, sleepTime))
    }

    async function startSpider(topicName) {
        const resStartSpider = await YottaAPI.startSpider_zyl(currentSubjectDomain.domain, topicName);
        if (resStartSpider.code == 200) {
            await sleep();
            askIncremental(topicName)

        } else {
            message.warn(resStartSpider.msg)
        }


    }

    async function handleInsert() {
        const topicName = textareaValueRef.current;
        textareaValueRef.current = '';

        message.info('插入主题：' + topicName)
        await sleep();
        const resInsertTopic = await YottaAPI.insertTopic_zyl(currentSubjectDomain.domain, topicName);
        if (resInsertTopic.code == 200) {

            message.info(resInsertTopic.msg)
            message.info('开始启动爬虫,爬取主题' + topicName + '相关碎片')
            await sleep();

            startSpider(topicName)

        } else {
            message.warn(resInsertTopic.msg)
        }
    }

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
            onOk() {
                handleInsert()
            },
            onCancel() {
            }
        })
    };
    /***  insert   ===============================================================================================================**/


    /***  delete  ===============================================================================================================**/

    const onDeleteTopic = (name, id) => {
        console.log("构建delete", name)
        setTimeout(hide, 0);
        reSet()
        confirm({
            title: "确认删除主题：" + name + " 吗？",
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                const res = await YottaAPI.deleteTopic_zyl(currentSubjectDomain.domain, name);

                if (res.code == 200) {
                    message.info(res.msg)
                    fetchMap();

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

    let firstSelect_Name = ''
    let secSelect_Name = ''
    let firstSelect_id = 0
    let secSelect_id = 0
    let hide = null
    const selecting = function (content) {
        hide = message.loading(content, 8, () => {
            reSet()
        });
    };
    const reSet = function () {
        statu = 0
        firstSelect_Name = ''
        secSelect_Name = ''
    };
    let data_temp;

    function checkExitRelation() {

        let has = false;
        for (var i = 0; i < dataTemp.length; i++) {
            let relation = dataTemp[i]
            if (relation['主题一'] == firstSelect_Name && relation['主题二'] == secSelect_Name) {
                has = true
            }

        }
        return has
    }

    const select = async (par1, par2) => {
        console.log(par1, par2)
        if (par1 == -1) {
            message.info("该主题不可选")
        }

        if (statu == 0) {
            firstSelect_Name = par2
            firstSelect_id = par1
            selecting("已经选定主题: " + par2 + ", 请选择另一主题")
            statu = 1
        } else {
            secSelect_Name = par2
            secSelect_id = par1
            if (statu == 1) {

                if (firstSelect_Name == secSelect_Name) {
                    message.info("不可选相同主题")
                    secSelect_Name = ''
                    firstSelect_id = 0
                    return
                }
                let has = checkExitRelation()
                if (has) {
                    message.info("关系已经存在")
                    setTimeout(hide, 0);
                    reSet()
                    return
                }

                confirm({
                    title: "确认添加关系：" + firstSelect_Name + "--> " + secSelect_Name + " 吗？",
                    okText: '确定',
                    cancelText: '取消',
                    async onOk() {
                        setTimeout(hide, 0);

                        const res = await YottaAPI.insertRelation_zyl(currentSubjectDomain.domain, firstSelect_Name, secSelect_Name)
                        if (res.code == 185) {
                            message.warn(res.msg)
                        } else {
                            message.info(res.msg)
                            fetchMap();
                        }
                        reSet()
                    },
                    onCancel() {
                        console.log('cancel')
                    }
                })
            }
        }
    }
    /***  addRelation end ===============================================================================================================**/


    /***  assembleTopic start ===============================================================================================================**/


    /***  assembleTopic end ===============================================================================================================**/



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
                setassembles(res);
            })
        }
    }

    useEffect(() => {

        console.log("starttttt")
        setTimeout(hide, 0);
        reSet()
        init(currentSubjectDomain.domain)

    }, [])


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

    useEffect(() => {
        async function insertFacet() {
            await YottaAPI.insertFirstLayerFacet(currentSubjectDomain.domain, topicName2, insertFacet1);
            fetchMap();
            const treeData2 = await YottaAPI.getCompleteTopicByTopicName(topicName2);

            //   window.flag = false;
            //   console.log("shanchuhou", window.flag);
            if (treeData) {
                console.log("新的画树数据", treeData2);
                emptyChildren(treeRef.current);
                settreeData(treeData2);
                fetchMap();
            }
        }

        if (topicName2 && insertFacet1) {
            insertFacet(topicName2, insertFacet1);
        }
    }, [topicName2])

    //删除分面调用接口
    let clickflag = true;
    const onClickBranch = (facetId) => {
        if (!clickflag) {
            clickflag = true;
            console.log("return flag");
            return
        }
        if (facetId) {
            confirm({
                title: "确认删除该分面吗？",
                okText: '确定',
                cancelText: '取消',
                async onOk() {
                    ClickBranch(facetId)

                    //   if (res.code == 200) {
                    //       message.info(res.msg)
                    //       fetchMap();

                    //   } else {
                    //       message.warn(res.msg)
                    //   }
                    clickflag = false;
                },
                onCancel() {
                    //clickflag = false;
                    console.log('cancel')
                }
            })
        }
    };


    async function ClickBranch(facetId) {

        if (facetId > 0) {
            const res = await YottaAPI.deleteAssembleByFacetId(facetId);
            console.log("传入删除id", facetId);
            setassembles(res);
            if (res.code == 200) {
                message.info(res.msg)
                fetchMap();

            } else {
                message.warn(res.msg)
            }
        }

        console.log("currentTopic clickbranch", currentTopic);
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

    //删除依赖
    function nameCheck(originName) {
        var tempName = originName;
        if (originName == undefined) {
            return {
                checkedName: '',
                isEnglish: ''
            }
        }
        if (originName.search('\\+') != -1) {
            console.log("tempName", tempName);
            tempName = originName.replace("+", "jiahao");
            console.log("tempName", tempName);
        }
        ;
        var english_name = /^[a-zA-Z]+$/.test(originName);
        // if (topicName.search('\\(') != -1){
        //     tempName = topicName.replace("(", " (");
        // };
        return {
            checkedName: tempName,
            isEnglish: english_name
        }
    }

    useEffect(() => {
        async function deleteRelation() {

            const response = await YottaAPI.deleteRelation(currentSubjectDomain.domain, nameCheck(deleteTopicStart).checkedName, nameCheck(deleteTopicEnd).checkedName);
            if (response) {
                infoDelete();
            }
            ;
            const res = await YottaAPI.generateDependences(currentSubjectDomain.domain, nameCheck(currentSubjectDomain.domain).isEnglish);
            setrelationData(res);
            fetchMap();
            emptyChildren(mapRef.current);
            emptyChildren(treeRef.current);
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if (res.data && mapRef) {
                        // console.log('res.data',res.data);
                        drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, clickTopic, clickFacet, onDeleteTopic, assembleTopic, select, onInsertTopic, (a, b) => {
                            onDeleteRelation(a, b)
                            console.log("relationdata", a, b);
                        }, 'yes', 'yes', 'yes', onClickBranch, clickBranchAdd.bind(null, currentTopic));
                    }
                }
            )
            const result = await YottaAPI.getDomainGraph(currentSubjectDomain.domain);
            //setGephi(result);
        }

        if (deleteTopicStart) {
            console.log('useEffect:', deleteTopicStart, deleteTopicEnd)
            deleteRelation(deleteTopicStart, deleteTopicEnd);
            if (insertTopic1 === deleteTopicStart && insertTopic2 === deleteTopicEnd) {
                setinsertTopic1("***");
            }
            ;
            setDeleteTopic1();
        }
    }, [deleteTopicStart, deleteTopicEnd])


    const onDeleteRelation = (relationOne, relationTwo, e) => {
        confirm({
            title: '确定删除关系吗？',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                console.log("ll", relationOne);
                setDeleteTopic1(relationOne);
                console.log('relationOne', deleteTopicStart);
                // setDeleteTopic1('relationOne');
                // console.log('relationOne',deleteTopicStart);
                setDeleteTopic2(relationTwo);
                console.log('relationTwo', deleteTopicEnd);
            },
            onCancel() {
            }
        })
    };

    //删除碎片后，获取碎片列表
    useEffect(() => {
        async function fetchAssembleData() {
            const res = await YottaAPI.getAssembleByName(currentSubjectDomain.domain, currentTopic);
            if (res) {
                setassembles(res);
                console.log("获取碎片");
                setdeleteAssembleToSort(res);
            }
        }

        fetchAssembleData();
    }, [deleteAssembleToFetch])


    // 重新计算碎片
    useEffect(() => {
        if (assembles) {
            console.log("重新计算碎片个数");
            setassnum(assembles.length);
            if (appendAssembleContentFlagToSort) {
                for (var ass_index = 0; ass_index < assembles.length; ass_index++) {
                    if (assembles[ass_index].assembleContent == appendAssembleContent) {
                        const assemble_temp = assembles[ass_index];
                        assembles.splice(ass_index, 1);
                        assembles.unshift(assemble_temp);
                        console.log("置顶成功");
                        console.log(assembles[0]);
                        break;
                    }
                }
            }
        }
    }, [appendAssembleContentFlagToSort, deleteAssembleToSort, currentTopic])


    /*碎片部分增删操作*/

    //根据domainName,topicName获取分面信息
    useEffect(() => {
        async function fetchFacetData() {
            await YottaAPI.getFacetsInTopic(currentSubjectDomain.domain, currentTopic).then(res => {
                setfacet(res)
            })
        }

        fetchFacetData();
    }, [appendAssembleContent, deleteAssemble, currentTopic])

    //增加碎片
    const onAppendAssemble = () => {
        let facetId = '';
        const onSelectChange = (id) => {
            facetId = id;
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
                            facet.map((facet1) => (
                                <option value={facet1.facetId}>{facet1.facetName}</option>
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
                console.log('newAssemble', newAssemble);

            },
            onCancel() {

            }
        })
    };

    //新增和渲染完成后获取碎片列表
    useEffect(() => {
        async function fetchAssembleData() {
            const res = await YottaAPI.getAssembleByName(currentSubjectDomain.domain, currentTopic);
            if (res) {
                setassembles(res);
                console.log("获取碎片");
                setappendAssembleContentFlagToSort(appendAssembleContentFlagToFetch);
            }
        }

        fetchAssembleData();
    }, [appendAssembleContentFlagToFetch])


    //新增碎片
    useEffect(() => {
        async function append() {
            console.log("新增碎片", appendAssembleContent);
            await YottaAPI.appendAssemble("人工", currentSubjectDomain.domain, currentFacetId, appendAssembleContent, "null");
            infoInsert();
            setappendAssembleContentFlagToFetch(appendAssembleContent);
        }

        if (appendAssembleContent) {
            append();
        }
    }, [appendAssembleContent])

    //删除碎片
    useEffect(() => {
        async function deleteAss() {
            console.log(deleteAssemble);
            await YottaAPI.deleteAssemble(deleteAssemble);
            infoDelete();
        }

        if (deleteAssemble) {
            deleteAss();
            setdeleteAssembleToFetch(deleteAssemble);
        }
    }, [deleteAssemble])

    // 删除碎片
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

    //删除碎片后，获取碎片列表
    useEffect(() => {
        async function fetchAssembleData() {
            const res = await YottaAPI.getAssembleByName(currentSubjectDomain.domain, currentTopic);
            if (res) {
                setassembles(res);
                console.log("获取碎片");
                setdeleteAssembleToSort(res);
            }
        }

        fetchAssembleData();
    }, [deleteAssembleToFetch])


    // 重新计算碎片
    useEffect(() => {
        if (assembles) {
            console.log("重新计算碎片个数");
            setassnum(assembles.length);
            if (appendAssembleContentFlagToSort) {
                for (var ass_index = 0; ass_index < assembles.length; ass_index++) {
                    if (assembles[ass_index].assembleContent == appendAssembleContent) {
                        const assemble_temp = assembles[ass_index];
                        assembles.splice(ass_index, 1);
                        assembles.unshift(assemble_temp);
                        console.log("置顶成功");
                        console.log(assembles[0]);
                        break;
                    }
                }
            }
        }
    }, [appendAssembleContentFlagToSort, deleteAssembleToSort, currentTopic])


    const infoFinish = () => {
        //message.config({duration: 1,  maxCount: 3})
        message.success('碎片构建成功，已全部展示！')
    };
    const infoDelete = () => {
        message.config({duration: 1, maxCount: 3})
        message.info('碎片删除成功，正在重新构建，请稍后！')
    };
    const infoInsert = () => {
        message.config({duration: 1, maxCount: 3})
        message.info('碎片插入成功，正在重新构建，请稍后！')
    };
    const infoConstructing = () => {
        message.config({duration: 1, maxCount: 3})
        message.info('正在构建碎片，请稍后！')
    };


    return (
        <>
            <Card title="主题间认知路径图" style={mapStyle}>
                <div style={{width: '100%', height: '700px'}}>
                    <svg ref={ref => mapRef.current = ref} id='map' style={{width: '100%', height: '100%'}}></svg>
                    <svg ref={ref => treeRef.current = ref} id='tree' style={{
                        position: 'absolute', left: '0',
                        marginLeft: 26,
                        visibility: 'hidden',
                        top: 10,
                        marginTop: 30,
                        //overflow:'scroll'
                    }}></svg>
                </div>
            </Card>

            <Card title="碎片" style={assembleStyle}
                  extra={<PlusOutlined style={{top: '50px'}} onClick={onAppendAssemble}/>}>
                <div style={{height: "54px", marginTop: "25px"}}>
                    <Badge color="purple" text={'主题:' + currentTopic}/> &nbsp;&nbsp;&nbsp;
                    <Badge color="purple" text={'分面:' + facetName}/> &nbsp;&nbsp;&nbsp;
                    <Badge color="purple" text={'碎片数量:' + assnum}/> &nbsp;&nbsp; &nbsp;
                </div>


                {
                    assembles ? (
                            assembles.map(
                                (assemble, index) =>
                                    (
                                        <Card.Grid style={{width: "100%"}}>
                                            <button class="ant-btn ant-btn-ghost ant-btn-circle-outline ant-btn-sm"
                                                    onClick={onDeleteAssemble.bind(null, assemble.assembleId)}
                                                    style={{position: "absolute", right: '3%'}}>
                                                <DeleteOutlined/>
                                            </button>
                                            <Leaf assemble={assemble} key={index}></Leaf>
                                        </Card.Grid>
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



