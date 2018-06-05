import React,{Component} from 'react'

class FailInfoView extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    searchText: "",
    addFunc: () => {}
  }

  render() {

    return (
      <div style={{display: "flex",marginTop: 50}}>
        <div style={{height: 30,fontSize: 50,color: 'red'}}>系统上暂无此人的相关出生信息，是否将 </div>
        <div style={{height: 30,fontSize: 50,color: 'red'}}> "{this.props.searchText}"添加到系统中 ?</div>
        <button
          onClick={this.props.addFunc}
          style={{height: 70,fontSize: 50,backgroundColor: 'gray'}}> 添加 </button>
      </div>
    )
  }
}

export default FailInfoView
