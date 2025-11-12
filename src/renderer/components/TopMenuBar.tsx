import { useState, useRef, useEffect } from 'react'
import '../../styles/top-menu-bar.css'

interface TopMenuBarProps {
    onNewProject?: () => void
    onOpenProject?: () => void
}

function TopMenuBar({ onNewProject, onOpenProject }: TopMenuBarProps) {
    const [isFileMenuOpen, setIsFileMenuOpen] = useState(false)
    const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false)
    const fileMenuRef = useRef<HTMLDivElement>(null)
    const helpMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
                setIsFileMenuOpen(false)
            }
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
                setIsHelpMenuOpen(false)
            }
        }

        if (isFileMenuOpen || isHelpMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isFileMenuOpen, isHelpMenuOpen])

    const handleFileClick = () => {
        setIsFileMenuOpen(!isFileMenuOpen)
        setIsHelpMenuOpen(false)
    }

    const handleHelpClick = () => {
        setIsHelpMenuOpen(!isHelpMenuOpen)
        setIsFileMenuOpen(false)
    }

    const handleMenuItemClick = (action: string) => {
        setIsFileMenuOpen(false)
        if (action === 'new-project' && onNewProject) {
            onNewProject()
        } else if (action === 'open-project' && onOpenProject) {
            onOpenProject()
        } else if (action === 'exit') {
            window.ipcRenderer.send('app:exit')
        }
    }

    return(
        <div className="vertical-bar-container">
            <div className="menu-item-wrapper" ref={fileMenuRef}>
                <button 
                    className={`menu-bar-button first-button ${isFileMenuOpen ? 'active' : ''}`}
                    onClick={handleFileClick}
                >
                    File
                </button>
                {isFileMenuOpen && (
                    <div className="dropdown-menu">
                        <button 
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('new-project')}
                        >
                            Nuovo progetto
                        </button>
                        <button 
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('open-project')}
                        >
                            Apri Progetto
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item disabled" disabled>Salva</button>
                        <button className="dropdown-item disabled" disabled>Salva con nome</button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item disabled" disabled>Anteprima di stampa</button>
                        <button className="dropdown-item disabled" disabled>Esporta</button>
                        <div className="dropdown-divider"></div>
                        <button 
                            className="dropdown-item"
                            onClick={() => handleMenuItemClick('exit')}
                        >
                            Esci
                        </button>
                    </div>
                )}
            </div>
            <button className="menu-bar-button">Modifica</button>
            <button className="menu-bar-button">Visualizza</button>
            <div className="menu-item-wrapper" ref={helpMenuRef}>
                <button 
                    className={`menu-bar-button ${isHelpMenuOpen ? 'active' : ''}`}
                    onClick={handleHelpClick}
                >
                    ?
                </button>
                {isHelpMenuOpen && (
                    <div className="dropdown-menu">
                        <button className="dropdown-item">Verifica Aggiornamenti</button>
                        <button className="dropdown-item">Aiuto</button>
                        <button className="dropdown-item">Informazioni</button>
                    </div>
                )}
            </div>
            <button className="menu-bar-button last-button">Guida</button>
        </div>
    )
}
export default TopMenuBar;