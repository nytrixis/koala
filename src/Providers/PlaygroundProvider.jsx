import { createContext, useState, useEffect } from "react";
import {v4} from 'uuid';
export const PlaygroundContext = createContext();

const initialData = [
    {
        id: v4(),
        title: 'Hello World',
        files: [
            {
                id: v4(),
                title: 'index',
                code: `cout<<"hello world";`,
                language: 'cpp',
            }
        ]

    },
    {
        id: v4(),
        title: 'Full Stack',
        files: [
            {
                id: v4(),
                title: 'test',
                code: `console.log("hello world");`,
                language: 'javascript',
            }
        ]

    }
];
export const defaultCodes = {
    ['cpp']: `cout<<"hello world";`,
    ['javascript']: `console.log("hello world");`,
    ['python']: `print("hello world")`,
    ['java']: `System.out.println("hello world");`,
    ['html']: `<h1>hello world</h1>`,
}

export const PlaygroundProvider = ({children}) => {
    const [folders, setFolders] = useState(() => {
        if(localStorage.getItem('data')){
            return JSON.parse(localStorage.getItem('data'));
        }
        return initialData;
    });
    const createNewBattlefield = (newBattlefield) => {
        const {fileName, folderName, language} = newBattlefield;
        const newFolders = [...folders];
        newFolders.push({
            id:v4(),
            title: folderName,
            files: [
                {
                    id: v4(),
                    title: fileName,
                    code: defaultCodes[language],
                    language: language
                }
            ],
            // language: language
        })
        localStorage.setItem('data', JSON.stringify(newFolders));
        setFolders(newFolders);
    }

    const createNewFolder = (folderName) => {
        const newFolder= {
            id: v4(),
            title: folderName,
            files: []
        }

        const allFolders = [...folders, newFolder];
        folders.push(newFolder);
        localStorage.setItem('data', JSON.stringify(allFolders));
        setFolders(allFolders);
    }

    const deleteFolder = (id) => {
        const updatedFoldersList = folders.filter ((folderItem) => {
            return folderItem.id !== id;
        })

        localStorage.setItem('data', JSON.stringify(updatedFoldersList));
        setFolders(updatedFoldersList);
    }

    const editFolderTitle = (newFolderName, id) => {
        const updatedFoldersList = folders.map ((folderItem) => {
            if(folderItem.id === id) {
                folderItem.title = newFolderName;
            }
            return folderItem;
        })
        localStorage.setItem('data', JSON.stringify(updatedFoldersList));
        setFolders(updatedFoldersList);
    }

    const editFileTitle = (newFileName, folderId, fileId) => {
        const copiedFolders = [...folders];
        for (let i =0; i<copiedFolders.length; i++) {
            if(folderId === copiedFolders[i].id){
                const files = copiedFolders[i].files;
                for(let j = 0; j<files.length; j++) {
                    if(files[i].id === fileId){
                        files[i].title = newFileName;
                        break;

                    }
                }
                break;
            }
            localStorage.setItem('data', JSON.stringify(copiedFolders));
            setFolders(copiedFolders);
        }

    }

    const deleteFile = (folderId, fileId) => {

        const copiedFolders  = [...folders];
        for (let i=0; i<copiedFolders.length; i++) {
            if(copiedFolders[i].id === folderId) {
                const files = [...copiedFolders[i].files];
                copiedFolders[i].files=files.filter((file) => {
                    return file.id !== fileId;
                })
                break;
            }
        }
        localStorage.setItem('data', JSON.stringify(copiedFolders));
        setFolders(copiedFolders);
    }

    const createBattlefield = (folderId, file) => {
        const copiedFolders  = [...folders]
        for (let i=0; i<copiedFolders.length; i++) {
            if(copiedFolders[i].id === folderId) {
                copiedFolders[i].files.push(file);
                break;
            }
        }
        localStorage.setItem('data', JSON.stringify(copiedFolders));
        setFolders(folders);
    }

    const getDefaultCode = (fileId, folderId) => {
        for(let i =0; i<folders.length; i++){
            if(folders[i].id === folderId){
                for(let j=0; j<folders[i].files.length; j++){
                    const currentFile = folders[i].files[j];
                    if(fileId === currentFile.id){
                        return currentFile.code;
                    }
                }
            }
        }
    }

    const updateLanguage = (fileId, folderId, language) => {
        const newFolders = [...folders];
        for(let i =0; i<newFolders.length; i++){
            if(newFolders[i].id === folderId){
                for(let j=0; j<newFolders[i].files.length; j++){
                    const currentFile = newFolders[i].files[j];
                    if(fileId === currentFile.id){
                        newFolders[i].files[j].code=defaultCodes[language];
                        newFolders[i].files[j].language=language;

                    }
                }
            }
        }
        setFolders(newFolders);
    }

    const getLanguage = (fileId, folderId) => {
        for(let i =0; i<folders.length; i++){
            if(folders[i].id === folderId){
                for(let j=0; j<folders[i].files.length; j++){
                    const currentFile = folders[i].files[j];
                    if(fileId === currentFile.id){
                        return currentFile.language;
                    }
                }
            }
        }
    }


    useEffect(() => {

        if(!localStorage.getItem('data')){
            localStorage.setItem('data', JSON.stringify(folders));
        }
    }, [])
    const battlefieldFeatures = {
        folders,
        createNewBattlefield,
        createNewFolder,
        deleteFolder,
        editFolderTitle,
        editFileTitle,
        deleteFile,
        createBattlefield,
        getDefaultCode,
        getLanguage,
        updateLanguage
    }
    // const obj = {name: 'nandinee'};
    return (
        <PlaygroundContext.Provider value={battlefieldFeatures}>
            {children}
        </PlaygroundContext.Provider>

    );
}