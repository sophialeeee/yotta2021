import React, { useState, useEffect } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import dataTool from '../../lib/dataTool';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip'
import {useHistory} from 'react-router-dom';
import useCurrentSubjectDomainModel from '../../models/current-subject-domain';
import confirm from 'antd/lib/modal/confirm';
import YottaAPI from '../../apis/yotta-api';
import Charts from '../../pages/home-page/charts';
import { Tooltip } from 'antd';

function Gephi(props) {
    const { gephi, subjectName, update } = props;   //update
    let graph = dataTool.gexf.parse(gephi);
    console.log('graph', graph)
    let categories = [];
    let communityCount = 0;
    const history = useHistory();
    const { currentSubjectDomain, setCurrentSubjectDomain } = useCurrentSubjectDomainModel();
    document.oncontextmenu = function () { return false; }; 
    const onEvents = {
        'click': (data) => {

            if (data.dataType === 'node') {
                let currentDomainName = data.data.name;
                console.log(currentSubjectDomain.subject, currentDomainName)
                setCurrentSubjectDomain(currentSubjectDomain.subject, currentDomainName);
                history.push('/display-page');
            }
        },
        'contextmenu': (data) => {
            if (data.dataType == 'node') {
                let currentDomainName = data.data.id;
                confirm({
                    title: '确定删除课程吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                        YottaAPI.removeClass(currentSubjectDomain.subject, currentDomainName);
                        YottaAPI.deleteCompleteDomain(data.data.name);
                        console.log(currentSubjectDomain.subject, currentDomainName)
                        //document.location.reload()
                        update()
                        update()
                    },
                    onCancel() {

                    }
                })
            }
        },
    }

    graph.nodes.forEach(function (node) {
        communityCount = Math.max(communityCount, node.attributes.modularity_class);
        if (subjectName !== '计算机科学') {
            node.y = -node.y;
        }
        node.itemStyle = null;
        // node.symbolSize = 1;
        node.value = node.symbolSize;
        node.category = node.attributes.modularity_class;
        node.symbol = "path://M537.804,174.688c0-44.772-33.976-81.597-77.552-86.12c-12.23-32.981-43.882-56.534-81.128-56.534   c-16.304,0-31.499,4.59-44.514,12.422C319.808,17.949,291.513,0,258.991,0c-43.117,0-78.776,31.556-85.393,72.809   c-3.519-0.43-7.076-0.727-10.71-0.727c-47.822,0-86.598,38.767-86.598,86.598c0,2.343,0.172,4.638,0.354,6.933   c-24.25,15.348-40.392,42.333-40.392,73.153c0,27.244,12.604,51.513,32.273,67.387c-0.086,1.559-0.239,3.107-0.239,4.686   c0,47.822,38.767,86.598,86.598,86.598c14.334,0,27.817-3.538,39.723-9.696c16.495,11.848,40.115,26.67,51.551,23.715   c0,0,4.255,65.905,3.337,82.64c-1.75,31.843-11.303,67.291-18.025,95.979h104.117c0,0-15.348-63.954-16.018-85.307   c-0.669-21.354,6.675-60.675,6.675-60.675l36.118-37.36c13.903,9.505,30.695,14.908,48.807,14.908   c44.771,0,81.597-34.062,86.12-77.639c32.98-12.23,56.533-43.968,56.533-81.214c0-21.994-8.262-41.999-21.765-57.279   C535.71,195.926,537.804,185.561,537.804,174.688z M214.611,373.444c6.942-6.627,12.766-14.372,17.212-22.969l17.002,35.62   C248.816,386.096,239.569,390.179,214.611,373.444z M278.183,395.438c-8.798,1.597-23.782-25.494-34.416-47.517   c11.791,6.015,25.102,9.477,39.254,9.477c3.634,0,7.201-0.296,10.72-0.736C291.006,374.286,286.187,393.975,278.183,395.438z    M315.563,412.775c-20.35,5.651-8.167-36.501-2.334-60.904c4.218-1.568,8.301-3.413,12.183-5.604   c2.343,17.786,10.069,33.832,21.516,46.521C337.011,401.597,325.593,409.992,315.563,412.775z";
        node.symbolOffset = [0, '-100%'];
        node.label = {
            normal: {
                //show: node.symbolSize > 0
                show: 1
            }
        };
        node.symbolSize = node.symbolSize / 3 + 6;
    });
    let communitySize = [];
    for (var i = 0; i <= communityCount; i++) {
        categories[i] = { name: '社团' + (i + 1) };
        communitySize[i] = 0;
    }
    graph.nodes.forEach(function (node) {
        let size = node.symbolSize;
        let community = node.attributes.modularity_class;
        for (let i = 0; i <= communityCount; i++) {
            if (community === i) {
                if (size > communitySize[i]) {
                    categories[i] = { name: node.name };

                }
            }
        }
    });
    console.log('categories', categories)
    let option = {
        title: {
            text: subjectName,
            top: '90%',
            left: 'right'
        },
        tooltip: {
            show:true,
            trigger: 'item',
            formatter: function (params) {
                if (params.dataType == 'node') {
                    var tip ='<div style="padding:3px 12px 3px 12px;margin:-10px;border-radius:50px;background-color:#FFFFFF;color:#696969;border: 1.5px solid #696969;font-size:13px">点击查看，右键删除</div>'
                    return tip
                }
            },
        },
        legend: {
            // selectedMode: 'single',
            top: 'top',
            data: categories.map(function (a) {
                return a.name;
            }),
            textStyle: {
                fontSize: 14
            }
        },
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'none',
                data: graph.nodes,
                links: graph.links,
                // left: 20,
                top: '15%',
                // height: '100%',
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [0.5, 7],
                categories: categories,
                focusNodeAdjacency: true,
                roam: true,
                label: {
                    normal: {
                        position: 'right'
                    }
                },
                lineStyle: {
                    normal: {
                        curveness: 0.25,
                        color: 'source',
                        width: 3
                    }
                }
            }
        ]
    };
    return (
        <ReactEchartsCore echarts={echarts} option={option} onEvents={onEvents}
            style={{ height: 800, width: 1100, margin: 'auto auto' }} />
    )
    
}

export default Gephi;
