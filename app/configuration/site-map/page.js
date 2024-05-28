"use client"
import Sitemap from './components/siteMap'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const SiteMapPage = ()=>{
    return <DndProvider backend={HTML5Backend}><Sitemap /></DndProvider>
}

export default SiteMapPage