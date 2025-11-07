import "../../styles/initialBody.css"

function InitialBody(){
    return(
        <div className="initial-body-container">
            <div className="project-logo"><img src="src/assets/file-box.svg" alt=""></img></div>
            <div className="project-header"><p>
            Nessun progetto aperto</p></div>
            <div className="project-desc"><p>
            Crea un nuovo progetto o aprine uno esistente per iniziare<br></br>
            a progettare il tuo preventivo. Usa la barra degli strumenti sopra o il menu File<br></br>
            per cominciare.</p></div>
            <div className="project-selection-buttons">
                <button className="project-button newProjectButton">Nuovo progetto</button>
                <button className="project-button openProjectButton">Apri progetto</button>
            </div>
        </div>
    )
} 

export default InitialBody;