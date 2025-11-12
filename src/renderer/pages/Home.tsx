import { useState } from 'react'
import SecondaryTopMenuBar from "../components/SecondaryTopMenuBar";
import TopMenuBar from "../components/TopMenuBar";
import BottomMenuBar from "../components/BottomMenuBar";
import InitialBody from "../components/InitialBody";
import NewProjectModal from "../components/NewProjectModal";
import OpenProjectModal from "../components/OpenProjectModal";

function Home(){
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
        commessa: string
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
            <TopMenuBar 
                onNewProject={handleNewProject}
                onOpenProject={handleOpenProject}
            />
            <SecondaryTopMenuBar 
  
                onOpenProject={handleOpenProject}
            />
            <BottomMenuBar />
            <InitialBody 
                onNewProject={handleNewProject}
                onOpenProject={handleOpenProject}
            />
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
export default Home;