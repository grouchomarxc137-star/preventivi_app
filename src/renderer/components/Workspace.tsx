import { useState, useEffect, useRef, useCallback } from 'react'
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
    onRegisterZoomHandlers?: (handlers: { zoomIn: () => void; zoomOut: () => void }) => void
}

function Workspace({ isLeftSectionVisible, isRightSectionVisible, onToggleLeftSection, onToggleRightSection, onRegisterZoomHandlers }: WorkspaceProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set())
    const [selectedComponents, setSelectedComponents] = useState<Component[]>([])
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
    const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([])
    const [draggedComponent, setDraggedComponent] = useState<Component | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; componentId: string } | null>(null)
    const workspaceRef = useRef<HTMLDivElement>(null)
    const [zoomLevel, setZoomLevel] = useState(1)
    const canvasGridRef = useRef<HTMLDivElement>(null)

    // Test data organized by sections
    const componentData = {
        sections: [
            {
                id: 'quadri',
                name: 'Quadri',
                brands: [
                    {
                        id: 'abb-quadri',
                        name: 'ABB',
                        components: [
                            { 
                                id: 'comp1', 
                                name: 'Quadro Principale ABB 100A', 
                                type: 'Quadri', 
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
                                type: 'Quadri', 
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
                                type: 'Quadri', 
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
                        id: 'schneider-quadri',
                        name: 'Schneider Electric',
                        components: [
                            { 
                                id: 'comp4', 
                                name: 'Quadro Principale Schneider 100A', 
                                type: 'Quadri', 
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
                                type: 'Quadri', 
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
                        id: 'siemens-quadri',
                        name: 'Siemens',
                        components: [
                            { 
                                id: 'comp6', 
                                name: 'Quadro Principale Siemens 100A', 
                                type: 'Quadri', 
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
                                type: 'Quadri', 
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
                            }
                        ]
                    },
                    {
                        id: 'bticino-quadri',
                        name: 'BITICINO',
                        components: [
                            { 
                                id: 'comp9', 
                                name: 'Quadro Principale BITICINO 100A', 
                                type: 'Quadri', 
                                brand: 'BITICINO',
                                properties: {
                                    tensione: '400V',
                                    corrente: '100A',
                                    potenza: '40kW',
                                    dimensioni: '600x400x200mm',
                                    peso: '23kg',
                                    certificazione: 'CEI EN 61439',
                                    prezzo: '€1,150.00'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'bars',
                name: 'Bars',
                brands: [
                    {
                        id: 'abb-bars',
                        name: 'ABB',
                        components: [
                            {
                                id: 'bar1',
                                name: 'Barra ABB 100A',
                                type: 'Bars',
                                brand: 'ABB',
                                properties: {
                                    corrente: '100A',
                                    dimensioni: 'Standard',
                                    prezzo: '€80.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'schneider-bars',
                        name: 'Schneider Electric',
                        components: [
                            {
                                id: 'bar2',
                                name: 'Barra Schneider 100A',
                                type: 'Bars',
                                brand: 'Schneider Electric',
                                properties: {
                                    corrente: '100A',
                                    dimensioni: 'Standard',
                                    prezzo: '€85.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'bticino-bars',
                        name: 'BITICINO',
                        components: [
                            {
                                id: 'bar3',
                                name: 'Barra BITICINO 63A',
                                type: 'Bars',
                                brand: 'BITICINO',
                                properties: {
                                    corrente: '63A',
                                    dimensioni: 'Standard',
                                    prezzo: '€75.00'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'interuttori',
                name: 'Interuttori',
                brands: [
                    {
                        id: 'abb-interuttori',
                        name: 'ABB',
                        components: [
                            {
                                id: 'int1',
                                name: 'Interruttore ABB 16A',
                                type: 'Interuttori',
                                brand: 'ABB',
                                properties: {
                                    tensione: '230V',
                                    corrente: '16A',
                                    potenza: '3.6kW',
                                    prezzo: '€45.00'
                                }
                            },
                            {
                                id: 'int2',
                                name: 'Interruttore ABB 32A',
                                type: 'Interuttori',
                                brand: 'ABB',
                                properties: {
                                    tensione: '230V',
                                    corrente: '32A',
                                    potenza: '7.4kW',
                                    prezzo: '€65.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'schneider-interuttori',
                        name: 'Schneider Electric',
                        components: [
                            {
                                id: 'int3',
                                name: 'Interruttore Schneider 16A',
                                type: 'Interuttori',
                                brand: 'Schneider Electric',
                                properties: {
                                    tensione: '230V',
                                    corrente: '16A',
                                    potenza: '3.6kW',
                                    prezzo: '€50.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'bticino-interuttori',
                        name: 'BITICINO',
                        components: [
                            {
                                id: 'int4',
                                name: 'Interruttore BITICINO 16A',
                                type: 'Interuttori',
                                brand: 'BITICINO',
                                properties: {
                                    tensione: '230V',
                                    corrente: '16A',
                                    potenza: '3.6kW',
                                    prezzo: '€42.00'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'commutatori',
                name: 'Commutatori',
                brands: [
                    {
                        id: 'abb-commutatori',
                        name: 'ABB',
                        components: [
                            {
                                id: 'com1',
                                name: 'Commutatore ABB 2 Posizioni',
                                type: 'Commutatori',
                                brand: 'ABB',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    prezzo: '€180.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'schneider-commutatori',
                        name: 'Schneider Electric',
                        components: [
                            {
                                id: 'com2',
                                name: 'Commutatore Schneider 2 Posizioni',
                                type: 'Commutatori',
                                brand: 'Schneider Electric',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    prezzo: '€190.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'bticino-commutatori',
                        name: 'BITICINO',
                        components: [
                            {
                                id: 'com3',
                                name: 'Commutatore BITICINO 2 Posizioni',
                                type: 'Commutatori',
                                brand: 'BITICINO',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    prezzo: '€175.00'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'distributori',
                name: 'Distributori',
                brands: [
                    {
                        id: 'abb-distributori',
                        name: 'ABB',
                        components: [
                            {
                                id: 'dist1',
                                name: 'Distributore ABB 3 Poli',
                                type: 'Distributori',
                                brand: 'ABB',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    prezzo: '€120.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'schneider-distributori',
                        name: 'Schneider Electric',
                        components: [
                            {
                                id: 'dist2',
                                name: 'Distributore Schneider 3 Poli',
                                type: 'Distributori',
                                brand: 'Schneider Electric',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    prezzo: '€125.00'
                                }
                            }
                        ]
                    },
                    {
                        id: 'bticino-distributori',
                        name: 'BITICINO',
                        components: [
                            {
                                id: 'dist3',
                                name: 'Distributore BITICINO 3 Poli',
                                type: 'Distributori',
                                brand: 'BITICINO',
                                properties: {
                                    tensione: '400V',
                                    corrente: '63A',
                                    prezzo: '€115.00'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId)
        } else {
            newExpanded.add(sectionId)
        }
        setExpandedSections(newExpanded)
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

    const collapseAll = () => {
        setExpandedSections(new Set())
        setExpandedBrands(new Set())
    }

    const handleZoomIn = useCallback(() => {
        setZoomLevel(prev => Math.min(prev + 0.1, 3)) // Max zoom 300%
    }, [])

    const handleZoomOut = useCallback(() => {
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5)) // Min zoom 50%
    }, [])

    // Register zoom handlers with parent component
    useEffect(() => {
        if (onRegisterZoomHandlers) {
            onRegisterZoomHandlers({
                zoomIn: handleZoomIn,
                zoomOut: handleZoomOut
            })
        }
    }, [onRegisterZoomHandlers, handleZoomIn, handleZoomOut])

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

    const updateComponentProperty = (componentId: string, propertyKey: string, value: string) => {
        const updatedProperty = { [propertyKey]: value }

        // Update in selectedComponents
        setSelectedComponents(prev => prev.map(comp => 
            comp.id === componentId 
                ? { ...comp, properties: { ...comp.properties, ...updatedProperty } }
                : comp
        ))

        // Update in canvasComponents
        setCanvasComponents(prev => prev.map(comp =>
            comp.id === componentId
                ? { ...comp, properties: { ...comp.properties, ...updatedProperty } }
                : comp
        ))

        // Update selectedComponent if it's the one being edited
        setSelectedComponent(prev => {
            if (prev?.id === componentId) {
                return {
                    ...prev,
                    properties: { ...prev.properties, ...updatedProperty }
                }
            }
            return prev
        })
    }

    const getEditablePropertyType = (key: string): 'input' | 'select' | 'readonly' => {
        const editableKeys = ['tensione', 'corrente', 'potenza', 'prezzo']
        const selectKeys: { [key: string]: string[] } = {
            tensione: ['230V', '400V', '690V'],
            corrente: ['16A', '32A', '63A', '100A', '125A', '160A'],
            potenza: ['5kW', '10kW', '12kW', '25kW', '40kW', '50kW']
        }

        if (selectKeys[key]) {
            return 'select'
        }
        if (editableKeys.includes(key)) {
            return 'input'
        }
        return 'readonly'
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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement

            // Don't deselect only if clicking directly on:
            // - Canvas components (the component itself on canvas)
            // - Selected component items (the item in the list)
            // - Context menu
            // - Property pane (properties panel, inputs, selects, labels)
            if (
                target.closest('.context-menu') ||
                target.closest('.canvas-component') ||
                target.closest('.selected-component-item') ||
                target.closest('.right-section-top') ||
                target.closest('.properties-content') ||
                target.closest('.properties-list') ||
                target.closest('.property-item') ||
                target.closest('.property-input') ||
                target.closest('.property-label') ||
                target.closest('.property-value')
            ) {
                return
            }

            // Deselect for all other clicks
            setSelectedComponent(null)
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="workspace-container" ref={workspaceRef}>
            <div className={`workspace-left-section ${isLeftSectionVisible ? 'visible' : 'hidden'}`}>
                <div className="left-section-header">
                    <div className="left-section-header-top">
                        <h3 className="left-section-title">Componenti</h3>
                        <div className="header-actions">
                            <button 
                                className="collapse-all-button"
                                onClick={collapseAll}
                                title="Collassa tutto"
                            >
                                Collassa tutto
                            </button>
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
                    {componentData.sections.map(section => (
                        <div key={section.id} className="hierarchy-item">
                            <div 
                                className={`hierarchy-header ${expandedSections.has(section.id) ? 'expanded' : ''}`}
                                onClick={() => toggleSection(section.id)}
                            >
                                <span className="hierarchy-arrow">▶</span>
                                <span>{section.name}</span>
                            </div>
                            {expandedSections.has(section.id) && (
                                <div className="hierarchy-content">
                                    {section.brands.map(brand => (
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
                    <div 
                        className="canvas-grid"
                        ref={canvasGridRef}
                        style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: 'top left',
                            width: `${100 / zoomLevel}%`,
                            height: `${100 / zoomLevel}%`
                        }}
                    >
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
                                {Object.entries(selectedComponent.properties).map(([key, value]) => {
                                    const editType = getEditablePropertyType(key)
                                    return (
                                        <div key={key} className="property-item">
                                            <span className="property-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                            {editType === 'select' ? (
                                                <select
                                                    className="property-input property-select"
                                                    value={value || ''}
                                                    onChange={(e) => updateComponentProperty(selectedComponent.id, key, e.target.value)}
                                                >
                                                    {key === 'tensione' && (
                                                        <>
                                                            <option value="230V">230V</option>
                                                            <option value="400V">400V</option>
                                                            <option value="690V">690V</option>
                                                        </>
                                                    )}
                                                    {key === 'corrente' && (
                                                        <>
                                                            <option value="16A">16A</option>
                                                            <option value="32A">32A</option>
                                                            <option value="63A">63A</option>
                                                            <option value="100A">100A</option>
                                                            <option value="125A">125A</option>
                                                            <option value="160A">160A</option>
                                                        </>
                                                    )}
                                                    {key === 'potenza' && (
                                                        <>
                                                            <option value="5kW">5kW</option>
                                                            <option value="10kW">10kW</option>
                                                            <option value="12kW">12kW</option>
                                                            <option value="25kW">25kW</option>
                                                            <option value="40kW">40kW</option>
                                                            <option value="50kW">50kW</option>
                                                        </>
                                                    )}
                                                </select>
                                            ) : editType === 'input' ? (
                                                <input
                                                    type="text"
                                                    className="property-input"
                                                    value={value || ''}
                                                    onChange={(e) => updateComponentProperty(selectedComponent.id, key, e.target.value)}
                                                    placeholder={`Inserisci ${key}`}
                                                />
                                            ) : (
                                                <span className="property-value">{value}</span>
                                            )}
                                        </div>
                                    )
                                })}
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

