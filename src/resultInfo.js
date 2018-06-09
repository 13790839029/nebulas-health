import React, {Component} from 'react'


class ResultInfo extends Component{
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    keyInfo: "林庭辉",
    valueInfo: "1996年6月生，籍贯广东汕头，出生健康状况良好",
    accountInfo: "n1WvBffdccA8HHKpJERKPTQhF3hYbTc5DRR"
  }

  render() {
    return (
      <div style={{
          width: "70%",
          height: 200,
          marginTop: 50,
          display: "flex",
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <h1 style={{margin: 0,fontSize: 45}}>姓名： {this.props.keyInfo}</h1>
          <div style={{backgroundColor: "black",width: "100%",height: 3}}/>
          <h2 style={{margin: 0,marginLeft: 100}}>出生健康状况： {this.props.valueInfo}</h2>
          <h2 style={{margin: 0,alignSelf: 'flex-end'}}>数据提交者: {this.props.accountInfo}</h2>
      </div>
    )
  }
}

export default ResultInfo
