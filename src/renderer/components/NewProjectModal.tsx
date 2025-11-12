import { useState } from 'react'
import '../../styles/newProjectModal.css'

interface NewProjectModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: {
        progetto: string
        tipologia: string
        norma: string
        data: string
        descrizione: string
        note: string
    }) => void
}

function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
    const [formData, setFormData] = useState({
        progetto: '',
        tipologia: '',
        norma: '',
        data: '',
        descrizione: '',
        note: ''
    })

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setFormData({ progetto: '', tipologia: '', norma: '', data: '', descrizione: '', note: '' })
        onClose()
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Nuovo Progetto</h2>
                    <button className="modal-close-button" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-field">
                        <label htmlFor="progetto">Progetto</label>

                        <input
                            id="progetto"
                            type="text"
                            placeholder="es. Impianto Ufficio 1"
                            value={formData.progetto}
                            onChange={(e) => handleChange('progetto', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="tipologia">Tipologia</label>
                        <select
                            id="tipologia"
                            value={formData.tipologia}
                            onChange={(e) => handleChange('tipologia', e.target.value)}
                            required
                        >
                            <option value="">Seleziona la tipologia</option>
                            <option value="Residenziale">Residenziale</option>
                            <option value="Commerciale">Commerciale</option>
                            <option value="Industriale">Industriale</option>
                            <option value="Ristrutturazione">Ristrutturazione</option>
                            <option value="Nuova Costruzione">Nuova Costruzione</option>
                            <option value="Altro">Altro</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="norma">Norma</label>
                        <select
                            id="norma"
                            value={formData.norma}
                            onChange={(e) => handleChange('norma', e.target.value)}
                            required
                        >
                            <option value="">Seleziona la norma</option>
                            <option value="Civile (CEI EN 60898)">Civile (CEI EN 60898)</option>
                            <option value="Industriale (CEI EN 60947-2)">Industriale (CEI EN 60947-2)</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="data">Data</label>
                        <input
                            id="data"
                            type="date"
                            value={formData.data}
                            placeholder="Seleziona la data"
                            onChange={(e) => handleChange('data', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="descrizione">Descrizione</label>
                        <textarea
                            id="descrizione"
                            value={formData.descrizione}
                            placeholder="Breve descrizione del progetto..."
                            onChange={(e) => handleChange('descrizione', e.target.value)}
                            rows={4}
                            
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="note">Note</label>
                        <textarea
                            id="note"
                            value={formData.note}
                            placeholder="Note aggiuntive..."
                            onChange={(e) => handleChange('note', e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="button-secondary" onClick={onClose}>
                            Annulla
                        </button>
                        <button type="submit" className="button-primary">
                            Crea Progetto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewProjectModal

