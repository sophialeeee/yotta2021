import React from 'react';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'
import {DownOutlined,UpOutlined} from '@ant-design/icons'


class Leaf extends React.Component {
  

  state = {
    showMore: true,
  };

  handleClick = () => {
    this.setState({ showMore: !this.state.showMore })
  }

  render() {
    const { assemble } = this.props;
    return (
      <div style={{ padding: '0px 8px',borderRadius: 4, border: '0px solid #bfbfbf', marginBottom: 8}}>
       {
         this.state.showMore ?
         (
            <button class="ant-btn ant-btn-ghost ant-btn-circle-outline ant-btn-sm" onClick={this.handleClick} style={{ position:"absolute",right:'8%'}}>
                <DownOutlined />
            </button>
         ) :
         (
            <button class="ant-btn ant-btn-ghost ant-btn-circle-outline ant-btn-sm" onClick={this.handleClick} style={{ position:"absolute",right:'8%'}}>
                <UpOutlined />
            </button>
         )
        }
        <div style={{paddingTop:'25px',paddingBottom:"10px"}}>
          {
            this.state.showMore ?
              (
                <div style={{overflow:"hidden",maxHeight:"135px"}} dangerouslySetInnerHTML={{__html: assemble.assembleContent}}></div>
              ) :
              (
                <HTMLEllipsis
                  unsafeHTML={assemble.assembleContent}
                  maxLine="99999"
                  ellipsisHTML="<a>...收起</a>"
                  basedOn="letters"
                />
              )
          }
        </div>

      </div>
    );
  }
}

export default Leaf;
