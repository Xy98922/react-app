import React,{useEffect} from 'react';
import './index.css';
import {Form, Input, Button, Checkbox } from 'antd';
import { regLogin } from '../../api';
import { useNavigate } from 'react-router-dom';
import PubSub from 'pubsub-js'
import storageUtils from '../../utils/storageUtils';

const Demo = () => {
    const [form]=Form.useForm();
    const navigate=useNavigate();
    const data=storageUtils.getuser();

    // useEffect(()=>{
    //   if(data.data!==undefined)
    //      navigate(`/admin/${data.data.data._id}`);
    // })
    async function onFinish(){
      const{username,password,remember}=form.getFieldValue();
      const response=await regLogin(username,password);
      const{data:{status},data:{data:{_id}}}=response;
      console.log(_id);
      if(status===0){
        navigate(`/admin/${_id}`);      
      PubSub.publish('login', _id);
      }
      if(remember)
      storageUtils.saveuser(response);   //保存到local_storage里面
    };
  

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };


    const myrule=()=>{
        let reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;  //邮箱验证
        const{username}=form.getFieldValue();
        console.log(reg.test(username));  
        return reg.test(form.getFieldValue().username);
    }


    return (
      <Form form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="Password"
          name="password"
          rules={[
              { required: true, message: 'Please input your password!' }, 
              { max: 5, message: '密码最大长度不得超过五位' },              
              { min: 2, message: '密码最小长度不得低于一位' }, 
        //       () => ({
        //     validator() {
        //       if (myrule()) {
        //         return Promise.resolve();
        //       }
        //       return Promise.reject(new Error('请输入正确的邮箱'));
        //     },
        //   }),          
              ]}   //设置规则
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

export default function Login() {
    
   //const [WrapLogin]=Form.useForm(Demo);   //高阶组件实现
 // console.log(WrapLogin)   
//  高阶组件
//   1).本质就是一个函数
//   2).接收一个组件(被包装组件)，返回一个新组件(包装组件)，
//   包装组件会向被包装组件传入特定属性
//   3.作用:拓展组件的功能   
/*
包装Form组件生成一个新的组件：Form(Demo)
新组件会向Form组件传送一个强大的对象属性：form
*/

  return (
    <div className="login">
        <header className="login-header">     
            <h2>React项目：后台管理系统</h2>       
        </header>
        <section className="login-content">
            <h2>用户登录</h2>
        <Demo/>
        </section>
    </div>
  )
}
