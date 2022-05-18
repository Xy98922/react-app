import { Table, Space,Button,Card,Input,Select,Modal,Form,message,Cascader} from 'antd';
import React, { useState, useEffect,useRef } from 'react';
import {Link} from 'react-router-dom';
import { categoryinfo,addcategory,updateCategory,categoryIdtoName,
         productList,productAddApi,searchProduct,productUpdateApi,updateStatus
} from '../../../api';
import PicturesWall from './uploadPicture';
import RichTextEditor from './richTexteditor';

export function Category(){
  const columsarr=[
    [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
        width:'83%',
        render: text => <a href=''>{`${text}`}</a>, //渲染行
      },
      
      {
        title: '操作',
        key: 'action',
        render: (a,record,c) => (
          <Space size="middle">      
          {/* <Input onChange={inputEditChange}/>
          <a onClick={()=>handleOk(record._id)}>直接提交</a> */}
          <a onClick={()=>showModal(record._id)}>修改分类名称</a>
          <a onClick={()=>getChilddata(record)}>查看子分类</a>
          </Space>
        ),//渲染行
      }
    ],
    [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
        width:'90%',
        render: text => <a href=''>{text}</a>, //渲染行
      },
      
      {
        title: '操作',
        key: 'action',
        render: (a,record,c) => (
          <Space size="middle">        
          <a onClick={()=>showModal(record._id)}>修改分类名称</a>       
          </Space>
        ),//渲染行
      }
    ]
  ];
  const [dataSource,setDataSource]=useState([]);
  const [columns,setColumn]=useState();
  const [loading,setLoading]=useState(false);
  const [parentId,setParentId]=useState('0');
  const [parentIdName,setparentIdName]=useState('');
  const [addcategoryname,setAddcategoryName]=useState('');
  const [editNameAndId,seteditNameAndId]=useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const { Option } = Select;
  const getChilddata=async(record)=>{
    const {_id,name}=record;
    setLoading(true);
    loadItem(_id);
    setLoading(false);  
    setParentId(_id);
    setparentIdName(name);
    setColumn(columsarr[1]);
  }
  async function loadItem(id){
  setLoading(true);
  let {data:{data}}= await categoryinfo(id);
  for(let i=0;i<data.length;i++){
     data[i].key=data[i]._id;
   }
   setLoading(false);
   setDataSource(data);
   setParentId(id);
   if(id==='0')
   setColumn(columsarr[0]);
  }
  const confirm=async()=>{
    const {data:{status}}=await addcategory(parentId,addcategoryname);
    console.log(status===0,status)
    if(status===0)
      message.success('添加分类成功');
    loadItem(parentId);
    setIsAddVisible(false);
  }
  const inputName=(event)=>setAddcategoryName(event.target.value);
  const inputEditChange=(event)=>seteditNameAndId([event.target.value,editNameAndId[1]]);
  const selectList=(option)=>option==='一级分类列表'?loadItem('0'):loadItem(parentId);
  useEffect(()=>loadItem('0'),[]);
  useEffect(()=>{
    console.log(editNameAndId)
    loadItem(parentId); //如果此时不更新Table，Table中的组件的state值还停留在上次获取的state时候，只有组件更新了，才能获取最新的state值
  },[editNameAndId]);
  useEffect(()=>{
    console.log('parentId:',parentId)
  },[parentId]);
  const showModal = (id) => {
   setIsModalVisible(true);
   seteditNameAndId([editNameAndId[0],id]);
  };
  const showAddmodal = () =>setIsAddVisible(true);
  const redirectId=value=>{
  const [id,name]=value.split('&')
  console.log(id,name);
  if(id==='0');
    loadItem(id);
  setparentIdName(name);
  }
   
  const handleOk = async(id) => {
    if(id===undefined)
    id='624443a42a2f464dac522d74';
     setIsModalVisible(false);
    console.log('handleOk: ',id,editNameAndId[0]);
    const {data:{status}}= await updateCategory(editNameAndId[1],editNameAndId[0]);
    console.log(status===0,status)
    if(status===0){
      loadItem(parentId); 
      message.success('更新分类成功');
    }
  };
 const handleCancel = () => setIsModalVisible(false);
 const handleAddCancel = () => setIsAddVisible(false);
  return (
    <>
   <Card size="Default size card" title={parentId==='0'?'一级分类列表':<><a onClick={()=>loadItem('0')}>一级分类列表</a>-&gt;{parentIdName}</>}
       extra={<>
        <Button  size='small' onClick={showAddmodal} type='primary'>&nbsp;+添加&nbsp;</Button>      
        <Modal destroyOnClose={true} title={parentId==='0'?'一级分类列表':'二级分类列表'} visible={isAddVisible} onOk={confirm} onCancel={handleAddCancel}>
        <Select placeholder="点击选择其他分类" onChange={redirectId} style={{ width: 220 ,marginBottom:30}} allowClear>
        <Option  value='0'>返回首级列表</Option>)
        {dataSource.map((a)=>
        <Option key={a._id} value={`${a._id}&${a.name}`}>{a.name}</Option>)        
        }
        </Select>
        <Input onChange={inputName} />
      </Modal> 
      </>     
      }
       style={{ width: '100%',padding:'0px'}}>     
     <Table columns={columns} pagination={{defaultPageSize:7}} loading={loading} dataSource={dataSource} />
      <Modal title="修改分类名称" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input onChange={inputEditChange} />
      </Modal>
      <Button size='small' onClick={handleOk} type='primary'>&nbsp;Test&nbsp;</Button> 
      {/* 同样的回调函数，函数操作的参数相同，但所在域不同，获取参数的结果也不同，若获取的参数维持在上个状态，须对组件重新加载，更新域中的状态值 */}
   </Card>
    </>
  )
}
export function Edit(){
  
  const columns=[
    
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width:'15%',
        align:'center',
        render: text => <a href=''>{`${text}`}</a>, //渲染行
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
        align:'center',
        width:'50%',
        render: text => <a href=''>{`${text}`}</a>, 
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        width:'10%',
        align:'center',
        render: text => <a href=''>{`${text}`}</a>, //渲染行
      },
      {
        title: '状态',
        dataIndex: 'name',
        key: 'name',
        align:'center',
        width:'15%',
        render: (a,record,c) => (
          <Space size="middle">   
          <h2>{record.status===1?'在售':'已下架'}</h2>
          <Button onClick={()=>updateStatusClick(record._id,record.status)} size='small'>{record.status===1?'下架':'上线'}</Button>
          </Space>
        ), //渲染行
      },
      {
        title: '操作',
        key: 'action',
        align:'center',
        render: (a,record,c) =>(      
          <Space size="middle">              
          <Link to='/admin/6237fc87b1ee5fba29ec0210/detail' state={{details:record}}>详情</Link>
          <a onClick={()=>editProduct(record)}>修改</a>
          </Space>
        ),//渲染行
      }
  ];
  const [dataSource,setDataSource]=useState([]);
  const [loading,setLoading]=useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [pageInfo, setPageInfo] = useState([]);
  const [addOredit, setaddOredit] = useState('add');
  const [searchMethod, setSearchMethod] = useState('productName');
  const [preInfo, setPreInfo] = useState('');
  const [options, setOptions] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [defaultSelect, setDefaultSelect] = useState('');
  const { Option } = Select;
  const { Search } = Input;
  const [form] = Form.useForm();
  const richTextRef=useRef();
  const loadItem=async function(pageNum,pageSize){ 
    setLoading(true);
    const {data:{data:{list,total}}}= await productList(pageNum,pageSize);
    for(let i=0;i<list.length;i++){
    list[i].key=list[i]._id;
    }
    setPageInfo([pageNum,pageSize,total])
    setLoading(false);
    setDataSource(list);  
  }
  const onFinish=async(values)=>{
    console.log(values);
    values.detail=richTextRef.current.getDetail();
    if(values.Category.length===2){
      const [pCategoryId,categoryId]=values.Category;
      values.pCategoryId=pCategoryId.split(',')[1];
      values.categoryId=categoryId===undefined?undefined:categoryId.split(',')[1];
    }
    else{
      values.categoryId=values.Category[0].split(',')[1];
      values.pCategoryId='0';
    }
    if(addOredit==='add'){
      const result=await productAddApi(values);
      if(result.data.status===0)
      message.success('添加商品成功');
      else
      message.warning('添加商品失败',result);
      console.log(result.status)

    }
    else{
      values._id=preInfo._id;
      const result=await productUpdateApi(values);
      if(result.data.status===0)
      message.success('更新商品成功');
      else message.warning('更新商品失败');
    }  
    loadItem(pageInfo[0],pageInfo[1]);
    setIsAddVisible(false);
  }
  const onFinishFailed=()=>{}
  useEffect(async()=>{
    setLoading(true);
    const {data:{data}}=await categoryinfo('0');
    for(const a of data){
      a.value= `${a.parentId},${a._id}`;
      a.label=a.name;
      a.isLeaf=false;
    }
    setOptions(data);
    loadItem(3,8);
  },[]);
  const showAddmodal = () =>{
    setPreInfo({});
    setIsAddVisible(true);
    setaddOredit('add');
  }; 
  const handleAddOk = () => setIsAddVisible(false); 
  const handleAddCancel = () => {
    loadItem(pageInfo[0],pageInfo[1]);
    setIsAddVisible(false);
  }
  const searchChange=value=>setSearchMethod(value);
  const pageChange=(page,pageSize)=>loadItem(page,pageSize);
  const onSearch=async value=>{
  setLoading(true);
  const obj={
      pageNum:pageInfo[0],
      pageSize:pageInfo[1],
      [searchMethod]:value,
  } 
  const {data:{data:{pages,pageSize,total,list}}}= await searchProduct(obj); 
  for(let i=0;i<list.length;i++){
    if(list[i]!==null)
    list[i].key=Math.random();
  }
  setLoading(false);
  setPageInfo([Number(pages)>=0?pages:1,Number(pageSize)>=0?pageSize:1,Number(total)>=0?total:1]);
  setLoading(false);
  setDataSource(list);  
  };
  const editProduct=async(record)=>{
    console.log('record:',record);
    console.log('options:',options);
    setPreInfo(record);
    const [res1,res2]= await Promise.all([categoryIdtoName(record.categoryId),categoryIdtoName(record.pCategoryId)]);
    try{if(res1.data.status===0||res1.data.status===0)
    setCategoryName([res2.data.data===undefined?'':res2.data.data.name,res1.data.data===undefined?'':res1.data.data.name])}
    catch(e){    
      message.warning('分类信息错误');
    }  
    setDefaultSelect([`0,${record.pCategoryId}`,`${record.pCategoryId},${record.categoryId}`]);
    for(const a of options){
      if(a.value===`0,${record.pCategoryId}`){
        a.loading = true;
        const {data:{data}}=await categoryinfo(record.pCategoryId);
        if(data.length<1)
            a.isLeaf=true;
        a.loading = false;
        for(const a of data){
          a.value= `${a.parentId},${a._id}`;
          a.label=a.name;
        }
        console.log(data);
        a.children = data;
        setOptions([...options]);   
      }       
    }
    setIsAddVisible(true);
    console.log(record);
    console.log(res1);
    setaddOredit(record.name);
  }
  const updateStatusClick=async(id,prestatus)=>{
     const obj={
      productId:id,
      status:prestatus===0?1:0,
     }
     const result=await updateStatus(obj);
     console.log(result);
     if(result.data.status===0){
       message.success(prestatus===0?'上架成功':'下架成功');
       loadItem(pageInfo[0],pageInfo[1]);
     }
  }  
    const loadData =async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const {data:{data}}=await categoryinfo(targetOption._id);
    if(data.length<1)
        targetOption.isLeaf=true;
    targetOption.loading = false;
    for(const a of data){
      a.value= `${a.parentId},${a._id}`;
      a.label=a.name;
    }
    console.log(data);
    targetOption.children = data;
    setOptions([...options]);   
  };
  const uploadPic=(value)=>{
    if(addOredit==='add'){
      const preInfo=form.getFieldValue('imgs');
      if(preInfo===undefined){
        form.setFieldsValue({imgs:[value]});
      }
      else{
       form.setFieldsValue({imgs:[...preInfo,value]});
       }
    }
    else{
      const preImgs=preInfo.imgs;
      if(preImgs.length===0){
        form.setFieldsValue({imgs:[value]});
      }
      else if(form.getFieldValue('imgs')===undefined){
       form.setFieldsValue({imgs:[...preImgs,value]});
       }
       else {
        const preInfo=form.getFieldValue('imgs');
        form.setFieldsValue({imgs:[...preInfo,value]});
       }
    }
    console.log('uploadPic',form.getFieldValue('imgs'));
  }

  return (
    <>
   <Card size="Default size card"  title={
    <>
      <Select onChange={searchChange} defaultValue='productName'  allowClear>
      <Option value="productName">按名称搜索</Option>
      <Option value="productDesc">按描述搜索</Option>
      </Select>  
      <Search placeholder="输入关键字" onSearch={onSearch} enterButton  style={{width:250,marginLeft:20}}/> 
    </>}
    extra={ <Button  size='middle' onClick={showAddmodal} type='primary'>&nbsp;+添加商品&nbsp;</Button>  } style={{ width: '100%',padding:'0px'}}>     
     <Table columns={columns} pagination={{current:pageInfo[0],pageSize:pageInfo[1],total:pageInfo[2],onChange:pageChange}} loading={loading} dataSource={dataSource} />
      <Modal  width='900px' footer={false} title={
        addOredit==='add'?<h2>'添加商品'</h2>:
        <>
          <h2>{`要修改的修改商品为:${addOredit}`} </h2>
          <h2>{preInfo.pCategoryId==='0'?`所属分类为：${categoryName[1]}`:`所属分类为：${categoryName[0]}——>${categoryName[1]}`} </h2>         
        </>} visible={isAddVisible} onOk={handleAddOk} onCancel={handleAddCancel} destroyOnClose={true}>
      <Form
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={{ 
      remember: true,
      Category:preInfo.pCategoryId==='0'?[defaultSelect[1]]:[defaultSelect[0],defaultSelect[1]],
      name:preInfo.name,
      desc:preInfo.desc,
      price:preInfo.price,
      detail:preInfo.detail,
       }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      preserve={false}
      form={form}
    >
      <Form.Item
        label="分类"
        name="Category"
        rules={[{ required: true, message: '请输入' }]}
      >
       <Cascader options={options} style={{width:'350px'}} loadData={loadData} changeOnSelect />
      </Form.Item>

      <Form.Item
        label="商品名称"
        name="name"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input style={{width:'350px'}}/>
      </Form.Item>
             
      <Form.Item
        label="商品描述"
        name="desc"
        rules={[{ required: false, message: '请输入' }]}
      >
        <Input style={{width:'350px'}}/>
      </Form.Item>
     
      <Form.Item
        label="商品价格"
        name="price"
        rules={[{ required: false, message: '请输入' },
        () => ({
            validator(_, value) {
              if (Number(value)>0) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('输入的金额要大于零'));
            },
          }),
        ]}
      >
        <Input prefix="￥" suffix="RMB" style={{width:'350px'}}/>
      </Form.Item>

      <Form.Item
        label="商品详情"
        name="detail"
        rules={[{ required: false, message: '请输入' }]}
      >
        <RichTextEditor ref={richTextRef} initData={preInfo.detail}/>
      </Form.Item>

      <Form.Item
        label="商品图片"
        name="imgs"
      >
        <PicturesWall record={preInfo} uploadPic={uploadPic} addOredit={addOredit} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
        <Button type="primary" htmlType="submit" style={{float:'right'}}>
          提交
        </Button>
      </Form.Item>
    </Form>
      </Modal>
   </Card>
    </>
  )
}