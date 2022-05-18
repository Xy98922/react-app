import JsonP from "jsonp";
export default function getWeather(url){
    return new Promise((resolve,reject)=>{
        JsonP(url,function(err, res){
            if(res.status === '1') {
                resolve(res)}
            else console.log(err);
            })
    })
}