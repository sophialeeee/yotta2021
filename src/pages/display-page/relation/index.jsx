import React from 'react';
import {Card, Table} from 'antd';
import {useState} from 'react';
import {useEffect} from 'react';
import YottaAPI from '../../../apis/yotta-api';
import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
import {drawMap} from '../../../modules/topicDependenceVisualization';
import {useRef} from 'react';

function Relation() {

    const {currentSubjectDomain} = useCurrentSubjectDomainModel();
    const [data, setdata] = useState([]);
    const [data1, setdata1] = useState();
    const [mapdata, setmapdata] = useState();
    const [learningPath, setlearningPath] = useState([]);
    const columns = [
        {
            title: '主题一',
            dataIndex: '主题一',
            key: '主题一',
            align: 'center',

        },
        {
            title: '主题二',
            dataIndex: '主题二',
            key: '主题二',
            align: 'center',
            // render:text => <a>{text}</a>,
        }
    ]
    const relationStyle = {
        width: '40%',
        position: 'absolute',
        left: '0%',
        textAlign: 'center',
        top: '5px'
    };
    const mapStyle = {
        width: '55%',
        position: 'absolute',
        right: '0%',
        textAlign: 'center',
        top: '5px'
    }
    const [relationData, setrelationData] = useState();
    // 设置依赖列表的格式
    const tableStyle = {
        width: '100%',
        height: '700px',
    }

    const mapRef = useRef();
    const treeRef = useRef();
    useEffect(() => {
        async function fetchrelationData() {
            await YottaAPI.generateDependences(currentSubjectDomain.domain, nameCheck(currentSubjectDomain.domain).isEnglish).then(
                res => setrelationData(res)
            )
        }

        fetchrelationData();
    }, [currentSubjectDomain.domain])

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

    useEffect(() => {
        if (relationData) {
            relationData.map((relation, index) => {
                data.push({'key': String(index + 1), '主题一': relation.startTopicName, '主题二': relation.endTopicName})
            })
        }
    }, [relationData])


    useEffect(() => {
        if (data) {
            setdata(data);
            setdata1(data[0]);
        }
    })


    // 画认知关系图
    useEffect(() => {
        async function fetchDependencesMap() {
            await YottaAPI.generateMap(currentSubjectDomain.domain).then(
                (res) => {
                    setmapdata(res.data);
                    if (JSON.stringify(res.data.topics) == '{}') {
                        alert("该课程下无依赖关系！");
                    } else if (res.data.topics && mapRef) {
                        if (res.data && mapRef) {
                            console.log('res.data', res.data);
                            drawMap(res.data, mapRef.current, treeRef.current, currentSubjectDomain.domain, learningPath, () => {
                            }, () => {
                            });
                        }
                    }
                }
            )
        }

        fetchDependencesMap();

    }, [currentSubjectDomain.domain])

    return (
        <>
            <Card title="认知关系挖掘" style={relationStyle}>
                <Card.Grid style={{width: '100%', height: '730px'}}>
                    {(data && data1) ?
                        (
                            <Table style={tableStyle} columns={columns} dataSource={data}/>
                        ) : (
                            <div>无数据</div>
                        )}
                </Card.Grid>
            </Card>
            <Card title="主题间认知路径图" style={mapStyle}>
                <div style={{width: '100%', height: '680px'}}>
                    <svg ref={ref => mapRef.current = ref} id='map' style={{width: '100%', height: '100%'}}></svg>
                    <svg ref={ref => treeRef.current = ref} id='tree'
                         style={{position: 'absolute', left: '-0', marginLeft: 0, marginTop: 56}}></svg>

                </div>
            </Card>
        </>
    );
}

export default Relation;
