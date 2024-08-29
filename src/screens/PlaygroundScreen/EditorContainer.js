import { useContext, useRef, useState } from "react";
import "./EditorContainer.scss";
import Editor from "@monaco-editor/react";
import { PlaygroundContext } from "../../Providers/PlaygroundProvider";
// import { makeSubmission } from "./service";

const editorOptions = {
    fontSize:16,
    wordWrap: "on",
}

const fileExtensionMapping = {
    cpp: 'cpp',
    javascript: 'js',
    python: 'py',
    java: 'java',
    html: 'html'
}

export const EditorContainer = ({fileId, folderId, runCode}) => {

    const {getDefaultCode, getLanguage, updateLanguage} = useContext(PlaygroundContext);

    const [code, setCode] = useState(() => {
        return getDefaultCode(fileId, folderId);
    });

    const [language, setLanguage] = useState(() => getLanguage(fileId, folderId));
    const [theme, setTheme] = useState('vs-dark');
    const codeRef = useRef(code);
    // console.log(codeRef);

    const onChangeCode = (newCode) => {
        // console.log({newCode})
        // setCode(newCode);
        codeRef.current=newCode;
    }

    const onUploadCode = (event) => {
        const file = event.target.files[0];
        const fileType = file.type.includes("text")
        // console.log({fileType})
        if(fileType){
            const blob = new Blob([file]);
            const fileReader = new FileReader();
            fileReader.readAsText(blob);
            fileReader.onload = function(value){
                const importedCode = value.target.result;
                setCode(importedCode);
                codeRef.current=importedCode;
            }
        }
        else {
            alert ("Upload a text file!!")
        }

    }

    const exportCode  = () => {
        // console.log(codeRef.current);
        const codeValue=codeRef.current?.trim();
        if(!codeValue){
            alert("No code to export!!");
        }

        const codeBlob = new Blob([codeValue], {type: "text/plain"});
        const downloadUrl = URL.createObjectURL(codeBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `code.${fileExtensionMapping[language]}`;
        link.click();

    }

    const onChangeLanguage = (e) => {
        updateLanguage(fileId, folderId, e.target.value);
        setLanguage(e.target.value);   
    }

    const onChangeTheme = (e) => {
        setTheme(e.target.value);
    }

    const onRunCode = () => {
        runCode({code: codeRef.current, language});
    }

    return (
        <div className="root-editor-container">
            <div className="editor-header">
                <div className="editor-left-container">
                    <b className="title">{"title of card"}</b>
                    <span className="material-symbols-outlined">edit</span>
                    <button>Save Code</button>
                </div>
                <div className="ediotr-right-container">
                    <select onChange={onChangeLanguage} value={language} >
                        <option value="cpp">CPP</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="html">HTML</option>
                        <option value="javascript">Javascript</option>
                    </select>

                    <select onChange={onChangeTheme} value={theme}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    </select>
                </div>
            </div>
            <div className="editor-body">
                <Editor 
                    height={"100%"}
                    language={language}
                    options={editorOptions}
                    theme={theme}
                    onChange={onChangeCode}
                    value={code}
                />

            </div>
            <div className="editor-footer">
                <button className="btn">
                    <span className="material-symbols-outlined">fullscreen</span>
                    <span>Full Screen</span>
                </button>
                <label className="btn" htmlFor="import-code">
                    <span className="material-symbols-outlined">cloud_upload</span>
                    <span>Import Code</span>
                </label>
                <input type="file" id="import-code" style={{display: 'none'}} onChange={onUploadCode} />
                <button className="btn" onClick={exportCode}>
                    <span className="material-symbols-outlined">cloud_download</span>
                    <span>Export Code</span>
                </button>
                <button className="btn" onClick={onRunCode}>
                <span className="material-symbols-outlined">play_arrow</span>
                <span>Run Code</span>
                </button>

            </div>

        </div>
    );
}