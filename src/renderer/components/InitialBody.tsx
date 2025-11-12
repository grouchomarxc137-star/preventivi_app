import { useState } from 'react'
import "../../styles/initialBody.css"
import NewProjectModal from "./NewProjectModal"

function InitialBody(){
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleNewProject = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
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
                    <button className="project-button openProjectButton">Apri progetto</button>
                </div>
            </div>
            <NewProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />
        </>
    )
} 

export default InitialBody;