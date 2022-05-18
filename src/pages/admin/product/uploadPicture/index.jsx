import React  from 'react';
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { productUpdateApi } from '../../../../api';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [

    ],
    _id:'',
    categoryId:'',
    pCategoryId:'',
    imgs:[],
  };
  componentDidMount=()=>{
      const {_id,categoryId,pCategoryId,imgs}=this.props.record;
      this.setState({
          _id,categoryId,pCategoryId,imgs
      })
    console.log('this.props.record: ',this.props.record);
    if(imgs!==undefined){
      for(const a of imgs){
        const obj={
          uid:Math.random(),
          name:a,
          url:`http://localhost:5000/upload/${a}`,
        }
        this.state.fileList.push(obj);
     }
     this.setState();
    }
    
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  handleChange =async({ fileList,file }) =>{
    if (file.status === 'done') {
        console.log(file);
        if (file.response.status === 0) {
          message.success(`${  file.name} 上传成功`);
          const newImg= file.response.data.url.split('/')[4];
          console.log(newImg);
          this.props.uploadPic(newImg);      
        }
      } 
      else if (  file.status === 'error') {
        message.error(`${  file.name} 上传失败.`);
      }
      else if(file.status === 'removed'){
        this.state.imgs=[];
        for(const a of fileList){
          this.state.imgs.push(a.name);
        }
        const newImgs=this.state.imgs;                
        const obj={_id:this.state._id,categoryId:this.state.categoryId,pCategoryId:this.state.pCategoryId,imgs:newImgs};
        const result=await productUpdateApi(obj);
        if(result.data.status===0)
        message.success('更新成功');
        else message.warning('更新失败');
        message.success(`${  file.name} 已被删除.`);
        console.log(fileList);
      }
    this.setState({ fileList });
  } 

  render() {
    console.log(this);
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action='/manage/img/upload'
          listType="picture-card"
          fileList={fileList}
          name='image'
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
