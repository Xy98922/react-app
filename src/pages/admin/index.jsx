import React,{ useEffect } from 'react'
import storageUtils from '../../utils/storageUtils';
import { Layout,message,Menu,Modal, Button } from 'antd';
import { useNavigate,useParams,Outlet,useLocation } from 'react-router-dom';
import { AppstoreOutlined, HomeOutlined, SettingOutlined,AlignLeftOutlined,
   ShoppingOutlined,TeamOutlined,BarChartOutlined,ToolOutlined,PieChartOutlined,AreaChartOutlined,
   LineChartOutlined,ExclamationCircleOutlined
  } from '@ant-design/icons';
import { weather } from '../../api';
import getTime from '../../utils/getTime'
// import PubSub from 'pubsub-js'
// import { useState,useEffect } from 'react';
// import { useParams } from 'react-router-dom';

export default function Admin() {
  //方式一:用组件传参方式pubsub

  // const [stata,method]=useState(0);
  // useEffect(()=>{
  //   PubSub.subscribe('login', function(msg,data){
  //     method(data);
  //   }); 
  // },[]);  //用这种方法，会导致页面刷新丢失state数据

  //方式二，用路由传参
  //const {id}=useParams();  //params传参需要修改对应的路由地址，而其他两种方式不需要
 
  //方式三使用Local Storage
  const { SubMenu } = Menu;
  const navigate=useNavigate();
  const data=storageUtils.getuser();
  const {id}=useParams();
  const { Header, Footer,Sider } = Layout;
  const { confirm } = Modal;
  const pathname=useLocation().pathname.split('/')[3];
  const routes=['','','home','category','edit','user','role','pie','line','bar'];
  const titles={'home':'首页','category':'品类管理','edit':'商品管理','user':'用户管理',
                'role':'角色管理','pie':'饼图','line':'折线图','bar':'条形图'}
  const rootSubmenuKeys = []; //里面的元素打开时，其他元素都关闭
  const [openKeys, setOpenKeys] = React.useState([]); //初始展开的SubMenu菜单项的key数组
  const [slectedkey, setSelectedkey] = React.useState([]); //默认选择的item数组
  const [myweather, setWeather] = React.useState(' '); 
  const [time, setTime] = React.useState(' '); 
  const [mytitle, setTitle] = React.useState(' '); 

  useEffect(()=>{
    if(data.data==undefined&&id===undefined)
      navigate('/login')
    else {
      if(data.data==undefined)
      message.success('你好！：'+id);
      else message.success('你好！'+data.data.data._id);
    };
    getweather();
    const timer=setInterval(() => {
       setTime(getTime());
    }, 1000); 
    return ()=>clearInterval(timer);
    },[]);

    useEffect(()=>setTitle(titles[pathname]))

    async function getweather(){
      setWeather(await weather());
    };
  //控制展开状态
  const onOpenChange = keys => {     //keys为此时开启状态的SubMenu数组
                                    //openkeys为上一时刻为开启状态的SubMenu数组
  //找到第一个不在上一时刻开启列表里面的SubMenu
  const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);//find方法返回满足提供的测试函数的数组中第一个元素的值。
   //如果rootSubmenuKeys没有找到的key
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {         //indexOf方法可返回某个指定的字符串值在字符串中首次出现的位置,若无则返回-1。
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []); //最多打开一个SubMenu
    }

  }; 
  const itemclick=({key})=>{
   // setTitle(pathname);
    setSelectedkey(`${key}`);
  }

  //设置子菜单的默认选项
  const titleclick=({key})=>{
    setSelectedkey(key=='sub1'?['3']:['7']);
    const rout=key=='sub1'?['3']:['7'];
    navigate(`/admin/${data.data.data._id}/${routes[Number(rout)]}`);

  }
  const navigation=({key})=> navigate(`/admin/${data.data.data._id}/${routes[key]}`);  
  function destroyAll() {
    Modal.destroyAll();
  }
  
  
  function showConfirm() {  
        confirm({
          icon: <ExclamationCircleOutlined />,
          content: '确认注销吗?',
          onOk() {
            storageUtils.removeuser();
            navigate('/login');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
  }
  
  return (
    <>
    <Layout style={{'height':'100%'}}>
    <Sider theme='dark'> 
      <Menu theme="dark" mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} style={{ width: '100%' }}
      onClick={itemclick} selectedKeys={slectedkey} onSelect={navigation}
      >
      <Menu.Item key="1" style={{height:'51px'}} icon={<SettingOutlined />} disabled={true}>后台管理系统</Menu.Item>
      <Menu.Item key="2" icon={<HomeOutlined />} >首页</Menu.Item>
      <SubMenu key="sub1" icon={<ShoppingOutlined />}  onTitleClick={titleclick} title="商品">
          <Menu.Item key="3" icon={<AlignLeftOutlined />}>品类管理</Menu.Item>
          <Menu.Item key="4" icon={<ToolOutlined />}>商品管理</Menu.Item>
      </SubMenu>
      <Menu.Item key="5" icon={<AppstoreOutlined />} > 用户管理       
      </Menu.Item>
      <Menu.Item key="6" icon={<TeamOutlined />} >角色管理
      </Menu.Item>
      <SubMenu key="sub2" icon={<BarChartOutlined />} onTitleClick={titleclick} title="图形图表">
          <Menu.Item key="7" icon={<PieChartOutlined />}> 饼形图       
          </Menu.Item>
          <Menu.Item key="8" icon={<LineChartOutlined />} >折线图
          </Menu.Item>
          <Menu.Item key="9" icon={<AreaChartOutlined />} >柱状图
          </Menu.Item>
      </SubMenu>
      </Menu>
    </Sider>
      <Layout>
        <Header style={{color:"white",textAlign:"left",paddingLeft:'40px',paddingRigth:'10px'}}>
        <div style={{display:'inline-block',marginRight:'60%'}}>{mytitle}</div>
        <div style={{display:'inline-block',marginRight:'10%'}}>{myweather.lives===undefined?null:myweather.lives[0].weather}</div>
        <div style={{display:'inline-block',marginRight:'0'}}>{time}</div>
        <Button size='small' style={{display:'inline-block',marginLeft:'5%'}} onClick={showConfirm}>注销</Button>
        </Header>
        <Outlet/>
        <Footer></Footer>
      </Layout>
    </Layout>
  </>
  )
}
