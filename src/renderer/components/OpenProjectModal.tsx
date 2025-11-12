import '../../styles/openProjectModal.css'

interface OpenProjectModalProps {
    isOpen: boolean
    onClose: () => void
    onOpenFile: () => void
}

function OpenProjectModal({ isOpen, onClose, onOpenFile }: OpenProjectModalProps) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Apri Progetto</h2>
                    <button className="modal-close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <p className="modal-description">
                        Seleziona un progetto recente oppure scorrere per un file progetto.
                    </p>
                    <div className="modal-content-wrapper">
                        <div className="recent-projects-section">
                            <div className="section-header-row">
                                <div className="section-header">
                                    <img 
                                        src="src/assets/recent-project.svg" 
                                        alt="Recent projects"
                                        className="section-icon"
                                        width="20"
                                        height="20"
                                        draggable={false}
                                    />
                                    <h3>Progetti recenti</h3>
                                </div>
                                <button className="open-file-button" onClick={onOpenFile}>
                                    <svg
                                        className="section-icon"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {/* Placeholder icon - user will replace later */}
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    <span>Apri</span>
                                </button>
                            </div>
                            <div className="recent-projects-list">
                                {/* Empty state - projects will be added here */}
                                <p className="empty-state">Nessun progetto recente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpenProjectModal

