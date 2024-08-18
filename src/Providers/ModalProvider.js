import { createContext, useState } from "react";

export const ModalContext=createContext();

export const modalConstants = {
    CREATE_BATTLEFIELD: 'CREATE_BATTLEFIELD',
    CREATE_FOLDER: 'CREATE_FOLDER'
}

export const ModalProvider = ({children}) => {
    const [modalType, setModalType] = useState(null);
    const closeModal = () => {
        setModalType(null);
    }
    console.log({modalType});
    const modalFeatures = {
        openModal: setModalType,
        closeModal,
        activeModal:modalType
    }
    return (
        <ModalContext.Provider value={modalFeatures}>
            {children}
        </ModalContext.Provider>
    );
}