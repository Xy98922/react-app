//包含应用中所有的接口请求函数的模块
import ajax from "./ajax";
import getWeather from "./jsonp";
export const regLogin=(username,password)=>ajax('/login','POST',{username,password});
export const weather=()=>getWeather(`https://restapi.amap.com/v3/weather/weatherInfo?key=1d5ae0bf9429961bf766c427f93b9ce2&city=500000`);
export const categoryinfo=(a)=>ajax('/manage/category/list','GET',{"parentId":a});
export const productList=(pageNum,pageSize)=>ajax('/manage/product/list','GET',{pageNum,pageSize});
export const updateCategory=(categoryId,categoryName)=>ajax('/manage/category/update','POST',{categoryId,categoryName});
export const productAddApi=(obj)=>ajax('/manage/product/add','POST',obj);
export const addcategory=(parentId,categoryName)=>ajax('/manage/category/add','POST',{parentId,categoryName});
export const searchProduct=(obj)=>ajax('/manage/product/search','GET',obj);
export const searchProductBydesc=(obj)=>ajax('/manage/product/search','GET',obj);
export const productUpdateApi=(obj)=>ajax('/manage/product/update','POST',obj);
export const updateStatus=(obj)=>ajax('/manage/product/updateStatus','POST',obj);
export const categoryIdtoName=(categoryId)=>ajax('/manage/category/info','GET',{categoryId});

    