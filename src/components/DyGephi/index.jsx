import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import dataTool from '../../lib/dataTool';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend';


function DyGephi(props) {
    const {gephi, domainName, topicList} = props;
    let graph = dataTool.gexf.parse(gephi);
    let categories = [];
    let communityCount = 0;

    graph.nodes.forEach(function (node) {
        communityCount = Math.max(communityCount, node.attributes.modularity_class);
        node.itemStyle = null;
        // node.symbolSize = 1;
        node.value = node.symbolSize;
        node.category = node.attributes.modularity_class;
        node.label = {
            normal: {
                show: node.symbolSize > 0
            }
        };
        node.symbolSize = node.symbolSize / 3 + 6;
        // console.log(node)
    });
    let communitySize = [];
    for (var i = 0; i <= communityCount; i++) {
        categories[i] = {name: '社团' + (i + 1)};
        communitySize[i] = 0;
    }
    graph.nodes.forEach(function (node) {
        let size = node.symbolSize;
        let community = node.attributes.modularity_class;
        for (let i = 0; i <= communityCount; i++) {
            if (community === i) {
                if (size > communitySize[i]) {
                    categories[i] = {name: node.name};
                    communitySize[i] = size
                }
            }
        }
    });
    
    let option = {
        title: {
            text: domainName,
            top: '90%',
            left: 'right'
        },
        tooltip: {},
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
    
    let categories_new = categories;
    categories_new[communityCount + 1] = {name: "not in topicList", itemStyle: { normal: { color: 'grey',}}};
    
        for (let i = 0; i < option.series[0].data.length; i++) {
            if (!(topicList.indexOf(option.series[0].data[i].name) > -1)) {
                option.series[0].data[i].category = communityCount + 1;
            };
        };
        option.series[0].categories = categories_new;
      

    return (
        <ReactEchartsCore echarts={echarts} option={option}
                          style={{height: '90%', width: '100%', margin: 'auto'}}/>
    );


}

function Gephi_new2(props) {
    const {gephi, domainName, topicList} = props;
    let graph = dataTool.gexf.parse(gephi);
    let categories = [];
    let communityCount = 0;

    graph.nodes.forEach(function (node) {
        communityCount = Math.max(communityCount, node.attributes.modularity_class);
        node.itemStyle = null;
        // node.symbolSize = 1;
        node.value = node.symbolSize;
        node.category = node.attributes.modularity_class;
        node.label = {
            normal: {
                show: node.symbolSize > 0
            }
        };
        node.symbolSize = node.symbolSize / 3 + 6;
    });

    let communitySize = [];
    for (var i = 0; i <= communityCount; i++) {
        categories[i] = {name: '社团' + (i + 1)};
        communitySize[i] = 0;
    }
    graph.nodes.forEach(function (node) {
        let size = node.symbolSize;
        let community = node.attributes.modularity_class;
        for (let i = 0; i <= communityCount; i++) {
            if (community === i) {
                if (size > communitySize[i]) {
                    categories[i] = {name: node.name};
                    communitySize[i] = size;
                }
            }
        }
    });
    graph.nodes.forEach(function (node) {
        if (!(topicList.indexOf(node.name) > -1)) {
            node.category = communityCount + 1;
        };
    });
    let categories_new = [];
    categories.forEach(function (a) {
        categories_new.push(a)
    });
    categories_new[communityCount + 1] = {name: "not in topicList", itemStyle: { normal: { color: 'grey',}}};
    let option = {
        title: {
            text: domainName,
            top: '90%',
            left: 'right'
        },
        tooltip: {},
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
                categories: categories_new,
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
    console.log(option);
    return (
        <ReactEchartsCore echarts={echarts} option={option}
                          style={{height: '90%', width: '100%', margin: 'auto'}}/>
    );


}

function Gephi(props) {
    const {gephi, subjectName} = props;
    let graph = dataTool.gexf.parse(gephi);
    let categories = [];
    let communityCount = 0;

    graph.nodes.forEach(function (node) {
        communityCount = Math.max(communityCount, node.attributes.modularity_class);
        node.itemStyle = null;
        // node.symbolSize = 1;
        node.value = node.symbolSize;
        node.category = node.attributes.modularity_class;
        node.label = {
            normal: {
                show: node.symbolSize > 0
            }
        };
        node.symbolSize = node.symbolSize / 3 + 6;
    });
    let communitySize = [];
    for (var i = 0; i <= communityCount; i++) {
        categories[i] = {name: '社团' + (i + 1)};
        communitySize[i] = 0;
    }
    graph.nodes.forEach(function (node) {
        let size = node.symbolSize;
        let community = node.attributes.modularity_class;
        for (let i = 0; i <= communityCount; i++) {
            if (community === i) {
                if (size > communitySize[i]) {
                    categories[i] = {name: node.name};
                    communitySize[i] = size;
                }
            }
        }
    });
    let option = {
        title: {
            text: subjectName,
            top: '90%',
            left: 'right'
        },
        tooltip: {},
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
        <ReactEchartsCore echarts={echarts} option={option}
                          style={{height: '90%', width: '100%', margin: 'auto'}}/>
    );


}

export default DyGephi;
