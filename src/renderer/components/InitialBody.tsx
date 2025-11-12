import { useState } from 'react'
import "../../styles/initialBody.css"
import NewProjectModal from "./NewProjectModal"
import OpenProjectModal from "./OpenProjectModal"

function InitialBody(){
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
    const [isOpenProjectModalOpen, setIsOpenProjectModalOpen] = useState(false)

    const handleNewProject = () => {
        setIsNewProjectModalOpen(true)
    }

    const handleCloseNewProjectModal = () => {
        setIsNewProjectModalOpen(false)
    }

    const handleOpenProject = () => {
        setIsOpenProjectModalOpen(true)
    }

    const handleCloseOpenProjectModal = () => {
        setIsOpenProjectModalOpen(false)
    }

    const handleOpenFile = () => {
        console.log('Opening file dialog...')
        // TODO: Implement file dialog
        setIsOpenProjectModalOpen(false)
    }

    const handleSubmit = (data: {
        progetto: string
        tipologia: string
        norma: string
        data: string
        descrizione: string
        note: string
    }) => {
        console.log('New project data:', data)
        // TODO: Handle project creation
    }

    return(
        <>
            <div className="initial-body-container">
                <div className="project-logo"><img src="src/assets/file-box.svg" alt=""></img></div>
                <div className="project-header"><p>
                Nessun progetto aperto</p></div>
                <div className="project-desc"><p>
                Crea un nuovo progetto o aprine uno esistente per iniziare<br></br>
                a progettare il tuo preventivo. Usa la barra degli strumenti sopra o il menu File<br></br>
                per cominciare.</p></div>
                <div className="project-selection-buttons">
                    <button className="project-button newProjectButton" onClick={handleNewProject}>Nuovo progetto</button>
                    <button className="project-button openProjectButton" onClick={handleOpenProject}>Apri progetto</button>
                </div>
            </div>
            <NewProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={handleCloseNewProjectModal}
                onSubmit={handleSubmit}
            />
            <OpenProjectModal
                isOpen={isOpenProjectModalOpen}
                onClose={handleCloseOpenProjectModal}
                onOpenFile={handleOpenFile}
            />
        </>
    )
} 

export default InitialBody;