import { useState } from 'react'
import '../../styles/workspace.css'

interface Component {
    id: string
    name: string
    type: string
    brand: string
}

interface WorkspaceProps {
    isLeftSectionVisible: boolean
    isRightSectionVisible: boolean
    onToggleLeftSection?: () => void
    onToggleRightSection?: () => void
}

function Workspace({ isLeftSectionVisible, isRightSectionVisible, onToggleLeftSection, onToggleRightSection }: WorkspaceProps) {
    const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set())
    const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set())
    const [selectedComponents, setSelectedComponents] = useState<Component[]>([])

    // Test data for Quadri Elettrici
    const componentData = {
        types: [
            {
                id: 'quadri-elettrici',
                name: 'Quadri Elettrici',
                brands: [
                    {
                        id: 'abb',
                        name: 'ABB',
                        components: [
                            { id: 'comp1', name: 'Quadro Principale ABB 100A', type: 'Quadri Elettrici', brand: 'ABB' },
                            { id: 'comp2', name: 'Quadro Secondario ABB 63A', type: 'Quadri Elettrici', brand: 'ABB' },
                            { id: 'comp3', name: 'Quadro Distribuzione ABB 32A', type: 'Quadri Elettrici', brand: 'ABB' }
                        ]
                    },
                    {
                        id: 'schneider',
                        name: 'Schneider Electric',
                        components: [
                            { id: 'comp4', name: 'Quadro Principale Schneider 100A', type: 'Quadri Elettrici', brand: 'Schneider Electric' },
                            { id: 'comp5', name: 'Quadro Secondario Schneider 63A', type: 'Quadri Elettrici', brand: 'Schneider Electric' }
                        ]
                    },
                    {
                        id: 'siemens',
                        name: 'Siemens',
                        components: [
                            { id: 'comp6', name: 'Quadro Principale Siemens 100A', type: 'Quadri Elettrici', brand: 'Siemens' },
                            { id: 'comp7', name: 'Quadro Secondario Siemens 63A', type: 'Quadri Elettrici', brand: 'Siemens' },
                            { id: 'comp8', name: 'Quadro Distribuzione Siemens 32A', type: 'Quadri Elettrici', brand: 'Siemens' }
                        ]
                    }
                ]
            }
        ]
    }

    const toggleType = (typeId: string) => {
        const newExpanded = new Set(expandedTypes)
        if (newExpanded.has(typeId)) {
            newExpanded.delete(typeId)
        } else {
            newExpanded.add(typeId)
        }
        setExpandedTypes(newExpanded)
    }

    const toggleBrand = (brandId: string) => {
        const newExpanded = new Set(expandedBrands)
        if (newExpanded.has(brandId)) {
            newExpanded.delete(brandId)
        } else {
            newExpanded.add(brandId)
        }
        setExpandedBrands(newExpanded)
    }

    const addComponent = (component: Component) => {
        setSelectedComponents(prev => [...prev, component])
    }

    const removeComponent = (componentId: string) => {
        setSelectedComponents(prev => prev.filter(comp => comp.id !== componentId))
    }

    return (
        <div className="workspace-container">
            <div className={`workspace-left-section ${isLeftSectionVisible ? 'visible' : 'hidden'}`}>
                <div className="left-section-header">
                    <div className="left-section-header-top">
                        <h3 className="left-section-title">Componenti</h3>
                        <button 
                            className="collapse-button"
                            onClick={onToggleLeftSection}
                            title="Collassa pannello"
                        >
                            <img
                                src={isLeftSectionVisible ? "src/assets/sidebar-collapse.svg" : "src/assets/sidebar-open.svg"}
                                alt={isLeftSectionVisible ? "Collapse" : "Expand"}
                                className="collapse-icon"
                                draggable={false}
                            />
                        </button>
                    </div>
                    <input 
                        type="text" 
                        className="component-search"
                        placeholder="Cerca componenti..."
                    />
                    <select className="component-filter">
                        <option value="">Tutti i filtri</option>
                        <option value="type">Per tipo</option>
                        <option value="brand">Per marca</option>
                    </select>
                </div>
                <div className="component-hierarchy">
                    {componentData.types.map(type => (
                        <div key={type.id} className="hierarchy-item">
                            <div 
                                className={`hierarchy-header ${expandedTypes.has(type.id) ? 'expanded' : ''}`}
                                onClick={() => toggleType(type.id)}
                            >
                                <span className="hierarchy-arrow">▶</span>
                                <span>{type.name}</span>
                            </div>
                            {expandedTypes.has(type.id) && (
                                <div className="hierarchy-content">
                                    {type.brands.map(brand => (
                                        <div key={brand.id} className="hierarchy-item">
                                            <div 
                                                className={`hierarchy-header ${expandedBrands.has(brand.id) ? 'expanded' : ''}`}
                                                onClick={() => toggleBrand(brand.id)}
                                            >
                                                <span className="hierarchy-arrow">▶</span>
                                                <span>{brand.name}</span>
                                            </div>
                                            {expandedBrands.has(brand.id) && (
                                                <div className="hierarchy-content">
                                                    {brand.components.map(component => (
                                                        <div key={component.id} className="hierarchy-leaf-wrapper">
                                                            <div className="hierarchy-leaf">{component.name}</div>
                                                            <button 
                                                                className="add-component-button"
                                                                onClick={() => addComponent(component)}
                                                                title="Aggiungi componente"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="workspace-canvas-section">
                {!isLeftSectionVisible && (
                    <button 
                        className="restore-left-panel-button"
                        onClick={onToggleLeftSection}
                        title="Mostra pannello componenti"
                    >
                        <img
                            src="src/assets/sidebar-open.svg"
                            alt="Expand"
                            className="restore-icon"
                            draggable={false}
                        />
                    </button>
                )}
                {!isRightSectionVisible && (
                    <button 
                        className="restore-right-panel-button"
                        onClick={onToggleRightSection}
                        title="Mostra pannello proprietà"
                    >
                        <img
                            src="src/assets/sidebar-open.svg"
                            alt="Expand"
                            className="restore-icon"
                            draggable={false}
                        />
                    </button>
                )}
                <div className="canvas-container">
                    <div className="canvas-grid"></div>
                </div>
            </div>

            <div className={`workspace-right-section ${isRightSectionVisible ? 'visible' : 'hidden'}`}>
                <div className="right-section-header">
                    <h3 className="right-section-title">Proprietà</h3>
                    <button 
                        className="collapse-button"
                        onClick={onToggleRightSection}
                        title="Collassa pannello"
                    >
                        <img
                            src={isRightSectionVisible ? "src/assets/sidebar-collapse.svg" : "src/assets/sidebar-open.svg"}
                            alt={isRightSectionVisible ? "Collapse" : "Expand"}
                            className="collapse-icon"
                            draggable={false}
                        />
                    </button>
                </div>
                <div className="right-section-top">
                    <div className="properties-header">Proprietà Componente</div>
                    <div className="properties-content">
                        <p className="no-selection">Nessun componente selezionato</p>
                    </div>
                </div>
                <div className="right-section-bottom">
                    <div className="selected-components-header">Componenti Selezionati</div>
                    <div className="selected-components-content">
                        {selectedComponents.length === 0 ? (
                            <p className="no-selection">Nessun componente selezionato</p>
                        ) : (
                            <div className="selected-components-list">
                                {selectedComponents.map(component => (
                                    <div key={component.id} className="selected-component-item">
                                        <div className="selected-component-info">
                                            <div className="selected-component-name">{component.name}</div>
                                            <div className="selected-component-details">{component.brand}</div>
                                        </div>
                                        <button 
                                            className="remove-component-button"
                                            onClick={() => removeComponent(component.id)}
                                            title="Rimuovi componente"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Workspace

