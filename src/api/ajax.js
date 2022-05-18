import { message } from "antd";
import axios from "axios";
export default function ajax(url,method,data={}){
    return new Promise((resolve,reject)=>{
        let promise;
        if(method==='GET')
        promise=axios.get(url,{params:data});
        else promise=axios.post(url,data);
        promise.then(response=>resolve(response)).catch(err=>message.error('请求出错了：'+err.message))
    });
   //我return的Promise只会是fulfilled状态，因为catch函数把axios请求的错误都捕获并处理了。
   //统一处理请求异常,方法：在外层自己套一个Promise，并且不调用reject（用catch处理异常）；
}
