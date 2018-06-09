import React, { Component } from 'react';
import ResultInfo from './resultInfo'
import FailInfoView from './failInfoView'

var NebPay = require("nebpay.js");
var nebPay = new NebPay();

var Nebulas = require('nebulas')
var Neb = Nebulas.Neb; // Neb
var neb = new Neb(new Nebulas.HttpRequest("https://mainnet.nebulas.io"));
var Account = Nebulas.Account;
var api = neb.api;

const dappAddress = "n1eRyosxMEy9ov3AQWjAj7KWGP2U79odzQ1"

class App extends Component {

  constructor(props) {
    super(props)
    // state里面的内容属于私有，只有内部能够访问
    // 状态机变量
    // 一旦状态机变量的值一旦发生变化，就会重新调用render函数渲染UI
    this.state = {
      isResult: false,
      resultObj: {},
      isSearchFail: false,
      isShowInputView: false
    }
  }

  cbPush = (resp) => {
      console.log("response of push: " + JSON.stringify(resp))
      var intervalQuery = setInterval(() => {
        api.getTransactionReceipt({hash: resp["txhash"]}).then((receipt) => {
            console.log("判断数据提交到区块链的状态")
            // console.log(receipt)
            if (receipt["status"] === 2) {
                console.log("pending.....")
            } else if (receipt["status"] === 1){
                console.log("交易成功......")
                //清除定时器
                clearInterval(intervalQuery)
            }else {
                console.log("交易失败......")
                //清除定时器
                clearInterval(intervalQuery)
            }
        });
      }, 5000);

  }

  render() {
    return (
      <div style={{backgroundImage:"url('../images/bg.jpg')",flex: 1,display: "flex",flexDirection: 'column',alignItems: 'center',height: '100%'}}>
        <div div style={{marginLeft: 1500,alignItems: 'center'}}>

            <img src="images/星云健康.png" style={{width: 2500,height: 600}}></img>

        </div>
        <div style={{width: "100%",display: "flex",justifyContent: 'center'}}>
          <img src="images/logo.png" style={{marginTop: 20,width: 300,height: 300,marginRight: 50}}></img>
          <div style={{fontFamily: '"黑体"',fontSize:120,marginTop: 120}}>中国居民出生健康信息查询系统</div>
        </div>

        <div style={{width: "100%",height: 100,marginTop: 100,marginBottom: 100,display: "flex",justifyContent: 'center'}}>
            <input
              ref="inputRef"
              style={{borderWidth: 3,borderColor: "gray",fontSize: 50,flex: 1,marginLeft: 100}}
              placeholder="请输入姓名"/>
            <button
              onClick={() => {
                console.log("搜索")
                console.log(this.refs.inputRef.value)
                this.setState({isShowInputView: false})
                var from = "n1WvBffdccA8HHKpJERKPTQhF3hYbTc5DRR"
                var value = "0";
                var nonce = "0"
                var gas_price = "1000000"
                var gas_limit = "2000000"
                var callFunction = "get";
                var callArgs = "[\"" + this.refs.inputRef.value + "\"]"; //in the form of ["args"]
                var contract = {
                    "function": callFunction,
                    "args": callArgs
                }

                neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then( (resp) => {

                    console.log("数据查询完成\n")
                    console.log(resp)
                    console.log(resp["result"])
                    if (resp["result"] !== "null") {
                        console.log("========================")
                        //修改状态机变量的值
                        // 如何修改状态机变量的值
                        // this.state.isResult = true
                        // 正确的姿势
                        this.setState({isResult: true})
                        // "Error: empty key"
                        var obj = {}
                        if (resp["result"] == "Error: empty key") {
                          obj["key"] = ""
                          obj["value"] = resp["result"]
                          obj["author"] = ""
                        } else {
                          obj = JSON.parse(resp["result"])
                        }
                        // '{"key":"lintinghui","value":"林庭辉","author":"n1PWA8VdvvuRkjdizMEg8MKMB7T45BR7cWS"}'
                        this.setState({resultObj: obj,isSearchFail: false})
                    } else {
                        console.log("-------------------------")
                        this.setState({isResult: false,isSearchFail: true})
                    }
                }).catch(function (err) {

                    console.log("error:" + err.message)
                })
              }}
              style={{width: 250,marginLeft: 40,fontSize: 50,marginRight: 100}} >SEARCH</button>
        </div>
        {
          this.state.isShowInputView ?
          <div style={{width: "90%",display: 'flex',height: 100,marginTop: 50}}>
            <div style={{fontFamily: '"黑体"',fontSize:80}}>请输入该居民出生健康信息</div>
            <input
              ref="inputValueRef"
              style={{borderWidth: 2,borderColor: "gray",fontSize: 50,flex: 1,marginLeft: 50}}/>
            <button
              onClick={() => {
                console.log("调用合约的save方法!")
                var value = "0";
                var callFunction = "save"
                //this.refs.inputValueRef.value =  this.refs.inputValueRef1.value + this.refs.inputValueRef2.value + this.refs.inputValueRef3.value
                var callArgs = "[\"" + this.refs.inputRef.value + "\",\"" + this.refs.inputValueRef.value+ " \"]"
                console.log(callArgs)
                nebPay.call(dappAddress, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                    listener: this.cbPush        //设置listener, 处理交易返回信息
                });

              }}
              style={{width: 200,marginLeft: 40,fontSize: 50,marginRight: 100}} >SAVE</button>
          </div>:
          <div style={{display: "flex",width: "90%",justifyContent: 'center'}}>
            {
              this.state.isResult ?
                <ResultInfo
                  keyInfo={this.state.resultObj["key"]}
                  valueInfo={this.state.resultObj["value"]}
                  accountInfo={this.state.resultObj["author"]}
                />
              :
              <div>
                {
                  this.state.isSearchFail?
                  <FailInfoView
                    addFunc={() => {
                      console.log("app.js FailInfoView")
                      this.setState({isShowInputView: true})
                    }}
                    searchText={this.refs.inputRef.value}/>
                  :
                  <div />
                }
              </div>
            }
          </div>
        }


      </div>
    );
  }
}

export default App;
