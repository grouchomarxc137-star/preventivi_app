import "../../styles/secondaryTopMenuBar.css"

interface SecondaryTopMenuBarProps {
    onNewProject?: () => void
    onOpenProject?: () => void
}

function SecondaryTopMenuBar({ onNewProject, onOpenProject }: SecondaryTopMenuBarProps){
    return(
            <div className="vertical-bar-container secondary-bar">
            <div className="secondary-group explorer-group first-group">
                <button 
                    className="secondary-menu-items-button"
                    onClick={onOpenProject}
                >
                    <img
                        className="secondary-menu-items"
                        src="src/assets/folder-open.svg"
                        alt="Open folder"
                        draggable={false}
                    />
                </button>
                <button 
                    className="secondary-menu-items-button"
                    onClick={onNewProject}
                >
                    <img
                        className="secondary-menu-items"
                        src="src/assets/add-file.svg"
                        alt="Add file"
                        draggable={false}
                    />
                </button>
                <button className="secondary-menu-items-button">
                    <img
                        className="secondary-menu-items"
                        src="src/assets/save-file.svg"
                        alt="Save file"
                        draggable={false}
                    />
                </button>
            </div>

            <div className="secondary-group settings-group">
                
                <button className="secondary-menu-items-button">
                    <img
                        className="secondary-menu-items"
                        src="src/assets/settings.svg"
                        alt="Open settings"
                        draggable={false}
                    />
                </button>
            </div>
        </div>
    )
}
export default SecondaryTopMenuBar;