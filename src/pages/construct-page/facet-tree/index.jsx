import React from 'react';
import { drawTree,drawTreeNumber,drawTreeDel } from '../../../module/facetTree';
import { useEffect, useRef } from 'react';
import {Card, Select,Button} from 'antd';
import BatchConstruct from '../facet-tree/BatchConstruct';
import SingleConstruct from '../facet-tree/SingleConstruct';
import { useState } from 'react';
import { SecurityScanTwoTone } from '@ant-design/icons';

const {Option} = Select;
const batchStyle = {
    width:'9%',
    position:'absolute',
    left:'26%',
    textAlign:'center',
    top:'5px',
    lineHeight:'18px',
}

const stopStyle={
    width:'9%',
    position:'absolute',
    left:'26%',
  textAlign:'center',
    top:'55px',
    lineHeight:'9px'
}
 

function FacetTree() {
    
   const [type,settype] = useState("0");

   const handleType = (value)=>{
       console.log('value',value);
       settype(value);
   }


    return (
        <>
           {/* <Card style={stopStyle}>
                <Button shape='round' style={{ position:"absolute", left:'5%',top:'30%' }}>
                    暂停
                </Button>
                <Button shape='round' style={{ position:"absolute", right:'5%',top:'30%' }}>
                    继续
                </Button>
           </Card> */}
           <Select defaultValue="批量更新" size='large' style={batchStyle} onChange={handleType}>
               <Option value="0" size='large'>批量更新</Option>
               <Option value="1" size='large'>单个更新</Option>
           </Select>
           {
               type==="0"?(
                   <BatchConstruct/>
               ):
               (
                   <SingleConstruct/>
               )
           }
        </>
    );
}

export default FacetTree;
