import React,{useState,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { List,Typography,message,Card } from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import { categoryIdtoName } from '../../../../api';


export default function Detail() {
  const { Meta } = Card;
  const  navigate=useNavigate();
  const {state:{details}}=useLocation();
  const {name,desc,price,categoryId,pCategoryId,imgs,detail}=details;
  const [categoryName, setCategoryName] = useState('');
  const data=[['商品名称',name],['商品描述',desc],['商品价格',price],
  ['所属分类',pCategoryId==='0'?categoryName[1]:`${categoryName[0]}->${categoryName[1]}`],['详情',<div dangerouslySetInnerHTML={{__html:detail}}></div>]];
  useEffect(async()=>{
    const [res1,res2]= await Promise.all([categoryIdtoName(categoryId),categoryIdtoName(pCategoryId)]);
   try{ if(res1.data.status===0||res1.data.status===0)
    setCategoryName([res2.data.data===undefined?'':res2.data.data.name,res1.data.data===undefined?'':res1.data.data.name])
    else message.error('分类信息错误');}
    catch(e){
      message.error('分类信息错误');
      console.log(e);   
    }
    console.log(details);
  },[])
  return (
    <List
      size="large"
      header={
      <>    
      <h2><a onClick={()=>navigate(-1)}><ArrowLeftOutlined style={{width:30,fontSize:18}}/></a>商品详情
      </h2>
      </>
      }
      footer={<>
      {imgs.map((a)=>
        <Card
    hoverable key={Math.random()}
    style={{ width: 240,float:'left',marginRight:'40px',height:'277px',position:'relative'}}
    cover={<img alt="example" src={`http://localhost:5000/upload/${a}`} />}
    >
    <Meta title={name} description={desc} style={{height:"95px",bottom:"0",position:'absolute'}} />
    </Card>
      )}
      </>}
      bordered
      dataSource={data}
      renderItem={item =><List.Item>
          <Typography.Text >{`${item[0]} :`}</Typography.Text> {item[1]}
        </List.Item>}
    />
  )
}
