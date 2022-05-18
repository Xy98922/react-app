import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw ,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
    static propTypes={
        initData:PropTypes.string  //限制props的属性
    }
    constructor(props) {
        super(props);
        const html = this.props.initData;
        if(html){
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
        }
        else{
            this.state={editorState: EditorState.createEmpty()}
        }
    }
  getDetail=()=>{
       return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
          editorStyle={{border:'1px solid #d9d9d9',height:'200px',marginTop:'15px'}}
        />
        {/* <textarea
          disabled
          style={{
            minHeight: '600px',
            minWidth: '1000px',
          }}
          value={}
        /> */}
      </div>
    );
  }
}