import { useState, useEffect } from 'react'
import '../../styles/workspace.css'

interface ComponentProperties {
    tensione?: string
    corrente?: string
    potenza?: string
    dimensioni?: string
    peso?: string
    certificazione?: string
    prezzo?: string
    [key: string]: string | undefined
}

interface Component {
    id: string
    name: string
    type: string
    brand: string
    properties: ComponentProperties
}

interface CanvasComponent extends Component {
    x: number
    y: number
    canvasId: string
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
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
    const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([])
    const [draggedComponent, setDraggedComponent] = useState<Component | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; componentId: string } | null>(null)

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
                            { 
                                id: 'comp1', 
                                name: 'Quadro Principale ABB 100A', 
                                type: 'Quadri Elettrici', 
                                brand: 'ABB',
                                properties: {
                                    tensione: '400V',
                                    corrente: '100A',
                                    potenza: '40kW',
                                    dimensioni: '600x400x200mm',
                                    peso: '25kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€1,250.00'
                                }
                            },
                            { 
                                id: 'comp2', 
                                name: 'Quadro Secondario ABB 63A', 
                                type: 'Quadri Elettrici', 
                                brand: 'ABB',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    potenza: '25kW',
                                    dimensioni: '500x350x180mm',
                                    peso: '18kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€850.00'
                                }
                            },
                            { 
                                id: 'comp3', 
                                name: 'Quadro Distribuzione ABB 32A', 
                                type: 'Quadri Elettrici', 
                                brand: 'ABB',
                                properties: {
                                    tensione: '400V',
                                    corrente: '32A',
                                    potenza: '12kW',
                                    dimensioni: '400x300x150mm',
                                    peso: '12kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€450.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'schneider',
                        name: 'Schneider Electric',
                        components: [
                            { 
                                id: 'comp4', 
                                name: 'Quadro Principale Schneider 100A', 
                                type: 'Quadri Elettrici', 
                                brand: 'Schneider Electric',
                                properties: {
                                    tensione: '400V',
                                    corrente: '100A',
                                    potenza: '40kW',
                                    dimensioni: '600x400x200mm',
                                    peso: '26kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€1,300.00'
                                }
                            },
                            { 
                                id: 'comp5', 
                                name: 'Quadro Secondario Schneider 63A', 
                                type: 'Quadri Elettrici', 
                                brand: 'Schneider Electric',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    potenza: '25kW',
                                    dimensioni: '500x350x180mm',
                                    peso: '19kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€900.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'siemens',
                        name: 'Siemens',
                        components: [
                            { 
                                id: 'comp6', 
                                name: 'Quadro Principale Siemens 100A', 
                                type: 'Quadri Elettrici', 
                                brand: 'Siemens',
                                properties: {
                                    tensione: '400V',
                                    corrente: '100A',
                                    potenza: '40kW',
                                    dimensioni: '600x400x200mm',
                                    peso: '24kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€1,200.00'
                                }
                            },
                            { 
                                id: 'comp7', 
                                name: 'Quadro Secondario Siemens 63A', 
                                type: 'Quadri Elettrici', 
                                brand: 'Siemens',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    potenza: '25kW',
                                    dimensioni: '500x350x180mm',
                                    peso: '17kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€800.00'
                                }
                            },
                            { 
                                id: 'comp8', 
                                name: 'Quadro Distribuzione Siemens 32A', 
                                type: 'Quadri Elettrici', 
                                brand: 'Siemens',
                                properties: {
                                    tensione: '400V',
                                    corrente: '32A',
                                    potenza: '12kW',
                                    dimensioni: '400x300x150mm',
                                    peso: '11kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€420.00'
                                }
                            }
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
        if (selectedComponent?.id === componentId) {
            setSelectedComponent(null)
        }
        setCanvasComponents(prev => prev.filter(comp => comp.id !== componentId))
    }

    const handleDragStart = (e: React.DragEvent, component: Component) => {
        setDraggedComponent(component)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', component.id)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        if (draggedComponent) {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            
            // Check if component already exists on canvas
            const existingIndex = canvasComponents.findIndex(comp => comp.id === draggedComponent.id)
            
            if (existingIndex === -1) {
                const canvasComponent: CanvasComponent = {
                    ...draggedComponent,
                    x: Math.max(0, x - 50),
                    y: Math.max(0, y - 30),
                    canvasId: `${draggedComponent.id}-${Date.now()}`
                }
                setCanvasComponents(prev => [...prev, canvasComponent])
            }
            setDraggedComponent(null)
        }
    }

    const handleComponentClick = (component: Component) => {
        setSelectedComponent(component)
    }

    const isComponentOnCanvas = (componentId: string) => {
        return canvasComponents.some(comp => comp.id === componentId)
    }

    const handleCanvasComponentRightClick = (e: React.MouseEvent, component: CanvasComponent) => {
        e.preventDefault()
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            componentId: component.canvasId
        })
    }

    const handleRemoveFromCanvas = (canvasId: string) => {
        const component = canvasComponents.find(comp => comp.canvasId === canvasId)
        if (component) {
            setCanvasComponents(prev => prev.filter(comp => comp.canvasId !== canvasId))
            if (selectedComponent?.id === component.id) {
                setSelectedComponent(null)
            }
        }
        setContextMenu(null)
    }

    const handleContextMenuClose = () => {
        setContextMenu(null)
    }

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setContextMenu(null)
            }
        }

        if (contextMenu) {
            document.addEventListener('keydown', handleEscape)
            return () => {
                document.removeEventListener('keydown', handleEscape)
            }
        }
    }, [contextMenu])

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
                                                        <div 
                                                            key={component.id} 
                                                            className="hierarchy-leaf-wrapper"
                                                        >
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
                            className="restore-icon right-panel-icon"
                            draggable={false}
                        />
                    </button>
                )}
                <div 
                    className={`canvas-container ${isDragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="canvas-grid">
                        {canvasComponents.map(comp => (
                            <div
                                key={comp.canvasId}
                                className="canvas-component"
                                style={{
                                    left: `${comp.x}px`,
                                    top: `${comp.y}px`
                                }}
                                onClick={() => handleComponentClick(comp)}
                                onContextMenu={(e) => handleCanvasComponentRightClick(e, comp)}
                            >
                                <div className="canvas-component-label">{comp.name}</div>
                            </div>
                        ))}
                    </div>
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
                            className="collapse-icon right-panel-icon"
                            draggable={false}
                        />
                    </button>
                </div>
                <div className="right-section-top">
                    <div className="properties-header">Proprietà Componente</div>
                    <div className="properties-content">
                        {selectedComponent ? (
                            <div className="properties-list">
                                <div className="property-group">
                                    <h4 className="property-component-name">{selectedComponent.name}</h4>
                                    <div className="property-component-brand">{selectedComponent.brand}</div>
                                </div>
                                {Object.entries(selectedComponent.properties).map(([key, value]) => (
                                    <div key={key} className="property-item">
                                        <span className="property-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                        <span className="property-value">{value}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-selection">Nessun componente selezionato</p>
                        )}
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
                                    <div 
                                        key={component.id} 
                                        className={`selected-component-item ${selectedComponent?.id === component.id ? 'active' : ''} ${isComponentOnCanvas(component.id) ? 'on-canvas' : ''}`}
                                        onClick={() => handleComponentClick(component)}
                                        draggable={!isComponentOnCanvas(component.id)}
                                        onDragStart={(e) => !isComponentOnCanvas(component.id) && handleDragStart(e, component)}
                                        onDragEnd={() => setDraggedComponent(null)}
                                    >
                                        <div className="selected-component-info">
                                            <div className="selected-component-name">
                                                {component.name}
                                                {isComponentOnCanvas(component.id) && (
                                                    <span className="canvas-indicator" title="Sul canvas">✓</span>
                                                )}
                                            </div>
                                            <div className="selected-component-details">{component.brand}</div>
                                        </div>
                                        <button 
                                            className="remove-component-button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeComponent(component.id)
                                            }}
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
            {contextMenu && (
                <>
                    <div 
                        className="context-menu-overlay"
                        onClick={handleContextMenuClose}
                    />
                    <div 
                        className="context-menu"
                        style={{
                            left: `${contextMenu.x}px`,
                            top: `${contextMenu.y}px`
                        }}
                    >
                        <button
                            className="context-menu-item"
                            onClick={() => handleRemoveFromCanvas(contextMenu.componentId)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <span>Rimuovi dal canvas</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Workspace

