import '../../styles/top-menu-bar.css'

function TopMenuBar(){
    return(
        <div className="vertical-bar-container">
            <button className="menu-bar-button first-button">File</button>
            <button className="menu-bar-button">Modifica</button>
            <button className="menu-bar-button">Visualizza</button>
            <button className="menu-bar-button">?</button>
            <button className="menu-bar-button last-button">Guida</button>
        </div>
    )
}
export default TopMenuBar;