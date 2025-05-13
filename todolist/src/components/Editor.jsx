import "./Editor.css"
import {useState,useRef} from "react";
// 엔터키 누르면 추가되는거 안돼는듯 다해보고 수정하기.. 어디가 문제인지 못찾음 
const Editor=({onCreate})=>{
    const [content, setContent]=useState("");
    const contentRef = useRef();
    const onChangeContent = (e)=>{
        setContent(e.target.value);

    }

    const onKeydown =(e)=>{
        if(e.keyCode === 13){
            onSubmit();
        }
    };

    const onSubmit = ()=>{
        if(content ===""){
            contentRef.current.focus();
            return ;
        }
        onCreate(content);
        setContent("");
    }
    return(
        <div className="Editor">
            <input
            ref={contentRef} 
            value={content} 
            onKeydown={onKeydown}
            onChange={onChangeContent}
            placeholder="새로운 Todo..."
            />
            <button onClick={onSubmit}>추가</button>
        </div>
    )
};

export default Editor;