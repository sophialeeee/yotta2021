import React from 'react';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'



class Leaf extends React.Component {
  

  state = {
    showMore: false,
  };

  handleClick = () => {
    this.setState({ showMore: !this.state.showMore })
  }

  render() {
    const { assemble } = this.props;
    return (
      <div style={{ borderRadius: 4, border: '1px solid #bfbfbf', marginBottom: 16 }}>
       
        <div style={{ padding: '4px 8px' }} onClick={this.handleClick}>
          {
            this.state.showMore ?
              (
                <div dangerouslySetInnerHTML={{__html: assemble.assembleContent}}></div>
              ) :
              (
                <HTMLEllipsis
                  unsafeHTML={assemble.assembleContent}
                  maxLine="5"
                  ellipsisHTML="<a>...查看更多</a>"
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
