import axios from 'axios';
import CONSTS from '../constants';

async function gets(apiName){
    let result = undefined;
    try{
        result = await axios.get(CONSTS.BASE_URL + apiName);
    }catch (e) {
        console.log(e);
    }
    return result && result.data.data;
}
async function posts(apiName){
    let result = undefined;
    try{
        result = await axios.post(CONSTS.BASE_URL+apiName);
    }catch(e){
        console.log(e);
    }
    return result && result.data.data;
}
async function gets_8083(apiName){
    let result = undefined;
    try{
        result = await axios.get(CONSTS.BASE_URL_8083 + apiName);
    }catch (e) {
        console.log(e);
    }
    return result && result.data.data;
}

const YottaAPI = {
    // 根据用户名和密码登录系统
    Login(userName,password){
       
        
        // let result =  axios.post(`http://47.95.145.72:8083/user/login?userName=${encodeURI(userName)}&password=${encodeURI(password)}&ip=ha&place=ha&date=ha`);
        let result = axios.post(`http://zscl.xjtudlc.com:8083/user/login?userName=${encodeURI(userName)}&password=${encodeURI(password)}&ip=ha&place=ha&date=ha`);
        return result;
    },
    // 根据用户名获取学科和课程
    getDomainsBySubject(userName) {
        let result =  axios.get(`http://47.95.145.72:8083/domain/getDomainsAndSubjectsByUseId?userName=${encodeURI(userName)}`);
        return result;
    },
    // 获取学科和课程
    // getDomainsBySubject() {
    //     let result =  gets('domain/getDomainsGroupBySubject');
    //     return result;
    // },
    // 统计知识主题
    async getCountTopic(){
        return await gets('statistics/countTopic');
    },
    // 统计知识碎片
    async getCountAssemble(){
        return await gets('statistics/countAssemble');
    },
    // 获取图
    async getSubjectGraph(subject){
        return await axios.get(`http://47.95.145.72:8083/subject/getSubjectGraphByName?subjectName=${encodeURI(subject)}`);
    },
    // 获取画课程间认知关系的图
    async getDomainGraph(domain){
        return await posts(`dependency/getDependenciesByDomainNameSaveAsGexf?domainName=${encodeURI(domain)}`);
        // return await gets_8083('dependency/getDependenciesByDomainNameSaveAsGexf?domainName=${encodeURI(domain)}')
    },
    
    // 根据分面id获取碎片内容
    async getASsembleByFacetId(facetId){
        return await gets(`assemble/getAssemblesByFacetId?facetId=${encodeURI(facetId)}`);
    },
    // 根据课程名+主题名+用户id获取碎片内容
    // async getAssembleByName(domainName,topicNames,userId){
    //     return await posts(`assemble/getAssemblesByDomainNameAndTopicNamesAndUserId?domainName=${encodeURI(domainName)}&topicNames=${encodeURI(topicNames)}&userId=${encodeURI(userId)}`);
    // },
    // 根据课程名+主题名获取碎片内容
    async getAssembleByName(domainName,topicName){
        return await gets(`assemble/getAssemblesInTopic?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
       
    },
    // 根据主题名获取画分面树的数据
    async getCompleteTopicByTopicName(topicName){
        return await posts(`topic/getCompleteTopicByTopicName?topicName=${encodeURI(topicName)}&hasFragment=emptyAssembleContent`);
    },

    // 根据主题名获取画分面树的数据 new
    async getCompleteTopicByNameAndDomainName(domainName,topicName){
        return await gets(`topic/getCompleteTopicByNameAndDomainName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
    },

    // 根据主题名获取画分面树的数据（动态）
    async getDynamicTreeData(domainName,topicName,flag){
        let result = undefined;
        try{
            result = await axios.post(`http://10.181.204.48:8083/spiderDynamicOutput/spiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}&incremental=${encodeURI(flag)}`)
            console.log('构建好的树数据',result.data);
            result = result.data;
        }
        catch(error){
            console.log('动态构建的error0',error.response);
           // console.log('动态构建的error',error.response.data);
            if(error){
                if(error.response){
                    result = error.response.data;
                }
                
            }
            
        }
        return result;
    },
    // 输入课程名、主题名，爬取该主题下的分面树和分面下的碎片
    async getDynamicSingle(domainName,topicName,flag){
        let result = undefined;
        try{
            result = await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/incrementalSpiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`)
            console.log('构建好的树数据',result.data);
            result = result.data;
        }
        catch(error){
            console.log('动态构建的error0',error.response);
           // console.log('动态构建的error',error.response.data);
            if(error){
                if(error.response){
                    result = error.response.data;
                }
                
            }
            
        }
        return result;
    },
    // 输入课程名、主题名，增量爬取该主题下的分面树和分面下的碎片
    async getDynamicMulti(domainName,topicName,flag){
        let result = undefined;
        try{
            // result = await axios.post(`http://10.181.204.48:8083/spiderDynamicOutput/incrementalSpiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`)
            result = await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/incrementalSpiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`)
            //  result = await axios.post(`http://10.181.58.80:8083/newSpiderFor2021/spiderTopicAndFragmentByDomainName?domainName=${encodeURI(domainName)}`)
            console.log('构建好的树数据',result.data);
            result = result.data;
        }
        catch(error){
            console.log('动态构建的error0',error.response);
           // console.log('动态构建的error',error.response.data);
            if(error){
                if(error.response){
                    result = error.response.data;
                }
                
            }
            
        }
        return result;
    },

    async startSpider(domainName,topicName){
        return await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/startIncrementalSpiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
    },

    
    async stopSpider(domainName,topicName){
        return await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/stopIncrementalSpiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
    },


    async pauseSpider(domainName,topicName){
        return await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/pauseIncrementalSpiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
    },

    async continueSpider(domainName,topicName){
        return await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/continueIncrementalSpiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
    },

    // 根据课程名获取所有的主题名
    async getTopicsByDomainName(domainName){
        return await gets(`topic/getTopicsByDomainName?domainName=${encodeURI(domainName)}`);
    },
    // 根据课程名动态获取主题名
    async getDynamicTopics(subjectName,domainName){
        return await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/spiderTopicBySubjectAndDomainName?subjectName=${encodeURI(subjectName)}&domainName=${encodeURI(domainName)}`);
    },

    async getFirstTopicByDomainName(domainName){
        return await axios.post(`http://zscl.xjtudlc.com:8083/topic/getFirstTopicByDomainName?domainName=${encodeURI(domainName)}`);
    },
    // 根据课程名获取画依赖关系的数据
    async getDependenceByDomainName(domainName){
        return await gets(`?domainName=${encodeURI(domainName)}`);
    },

    // 根据课程名获取画依赖表的数据
    async getDependences(domainName){
        return await gets(`dependency/getDependenciesByDomainName?domainName=${encodeURI(domainName)}`);
    },

    // 结合麻珂欣师姐的知识关系抽取算法获取关系依赖
    async generateDependences(domainName, isEnglish){
        return await posts(`dependency/generateDependencyByDomainName?domainName=${encodeURI(domainName)}&isEnglish=${encodeURI(isEnglish)}`);
    },

     async getMap(domainName){
        return await axios.get(`http://47.95.145.72/dependences/?domainName=${encodeURI(domainName)}`);
        // return await axios.get('http://47.95.145.72/dependences/?domainName=${encodeURI(domainName)}');
    },

    async generateMap(domainName){
        return await axios.get(`http://47.95.145.72:8081/dependences/?domainName=${encodeURI(domainName)}`);
        // return await axios.get('http://47.95.145.72/dependences/?domainName=${encodeURI(domainName)}');
    },
    
    // 根据分面id获取碎片信息
    async getFacetName(facetId){
        return await axios.get((`assemble/getAssemblesByFacetId/?facetId=${encodeURI(facetId)}`))
        return await gets('assemble/getAssemblesByFacetId/?domainName=${encodeURI(domainName)}')
    },
    // 根据分面id获取分面名
    async getFacetName1(facetId){
        return await gets((`/facet/getFacetNameAndParentFacetNameByFacetId?facetId=${encodeURI(facetId)}`))
    },

    // 分面页添加API,添加主题
    async insertTopic(domainName,topicName){
        return await gets((`topic/insertTopicByNameAndDomainName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`));
    },

    async insertTopic_zyl(domainName,topicName){
        let result = undefined;
        try{
            result = await axios.get(`http://47.95.145.72:8083/topic/insertTopicByNameAndDomainName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
            result = result.data;
        }
        catch(error){
            if(error){
                if(error.response){
                    result = error.response.data;
                }
            }
        }
        return result;
    },



    async startSpider_zyl(domainName,topicName){
        let result = undefined;
        try{
            result = await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/startSpiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
            result = result.data;
        }
        catch(error){
            if(error){
                if(error.response){
                    result = error.response.data;
                }
            }
        }
        return result;
    },

    async spiderFacet_zyl(domainName,topicName){
        let result = undefined;
        try{
            result = await axios.post(`http://47.95.145.72:8083/spiderDynamicOutput/spiderFacetAssembleTreeByDomianAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
            result = result.data;
        }
        catch(error){
            if(error){
                if(error.response){
                    result = error.response.data;
                }
            }
        }
        return result;
    },

    async getGenerateDependency_zyl(domainName,topicName){
        let result = undefined;
        try{
            result = await axios.post(`http://47.95.145.72:8083/dependency/getGenerateDependencyWithNewTopic?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`,{},{timeout:10000});
            result = result.data;
        }
        catch(error){
            if(error){
                if(error.response){
                    result = error.response.data;
                }
            }
        }
        return result;
    },


    async deleteTopic_zyl(domainName,topicName){

        let result = undefined;
        try{
            result = await axios.post(`http://47.95.145.72:8083/topic/deleteTopicCompleteByDomainNameAndTopicName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
            result = result.data;
        }
        catch(error){
            if(error){
                if(error.response){
                    result = error.response.data;
                }
            }
        }
        return result;
    },

    async insertRelation_zyl(domainName, startTopicName, endTopicName){
        let result = undefined;
        try{
            result = await axios.post(`http://47.95.145.72:8083/dependency/insertDependency?domainName=${encodeURI(domainName)}&startTopicName=${encodeURI(startTopicName)}&endTopicName=${encodeURI(endTopicName)}`);
            result = result.data;
        }
        catch(error){
            if(error){
                if(error.response){
                    result = error.response.data;
                }
            }
        }
        return result;
    },



    async countUpdateAssemble(domainName){
        return await gets((`assemble/countUpdateAssemble?domainName=${encodeURI(domainName)}`));
    },

    async appendAssemble(sourceName, domainName,facetId, assembleContent, url){
        return await posts((`assemble/appendAssemble?sourceName=${encodeURI(sourceName)}&domainName=${encodeURI(domainName)}&facetId=${encodeURI(facetId)}&assembleContent=${encodeURI(assembleContent)}&url=${encodeURI(url)}`));
    },

    async deleteAssemble(assembleId){
        return await gets((`assemble/deleteAssemble?assembleId=${encodeURI(assembleId)}`));
    },

    async updateAssemble(assembleId, assembleContent, sourceName, url){
        return await posts((`assemble/updateAssemble?assembleId=${encodeURI(assembleId)}&assembleContent=${encodeURI(assembleContent)}&sourceName=${encodeURI(sourceName)}&url=${encodeURI(url)}`))
    },

    // 添加一级分面
    async insertFirstLayerFacet(domainName,topicName,facetName){
        return await gets((`facet/insertFirstLayerFacet?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}&facetName=${encodeURI(facetName)}`));
    },
    async getFacetByDomainName(domainName){
        return await gets((`facet/getByDomainName?domainName=${encodeURI(domainName)}`));
    },

    // 主题关系删除
    async deleteRelation(domainName, startTopicName, endTopicName){
        return await axios.post((`http://47.95.145.72:8083/dependency/deleteDependencyByTopicName?domainName=${encodeURI(domainName)}&startTopicName=${encodeURI(startTopicName)}&endTopicName=${encodeURI(endTopicName)}`))
    },

    // 主题关系插入
    async insertRelation(domainName, startTopicName, endTopicName){
        return await posts((`dependency/insertDependency?domainName=${encodeURI(domainName)}&startTopicName=${encodeURI(startTopicName)}&endTopicName=${encodeURI(endTopicName)}`))
    },
    //根据分面id删除该分面下子分面以及该分面下碎片
    async deleteAssembleByFacetId(facetId){
        return await gets((`facet/deleteFacetCompleteByFacetId?facetId=${encodeURI(facetId)}`))
    },
    // 获得特定知识主题的所有分面信息
    async getFacetsInTopic(domainName, topicName){
        return await gets((`facet/getFacetsInTopic?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`));
    },

    // 删除主题
    async deleteTopic(domainName,topicName){
        return await axios.get(`http://47.95.145.72:8083/topic/deleteTopicByNameAndDomainName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
        // return await axios.post(`http://47.95.145.72:8084/topic/deleteTopicByNameAndDomainName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`);
        // return await gets((`topic/deleteTopicByNameAndDomainName?domainName=${encodeURI(domainName)}&topicName=${encodeURI(topicName)}`))
    },

    //删除课程
    async removeClass(subjectName, removeDomainName) {
        return await axios.get(`http://47.95.145.72:8083/subject/getSubjectGraphByName/removeClass?subjectName=${encodeURI(subjectName)}&removeDomainName=${encodeURI(removeDomainName)}`);
    },
    //添加课程
    async addClass(subjectName, addDomainName) {
        return await axios.get(`http://47.95.145.72:8083/subject/getSubjectGraphByName/addClass?subjectName=${encodeURI(subjectName)}&addDomainName=${encodeURI(addDomainName)}`);
    },

};

export default YottaAPI;