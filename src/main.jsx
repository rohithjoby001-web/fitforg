// Fitforg — React entry point.
// The app is a vanilla-JS module (app.js) that owns the DOM directly.
// React here is just the build system (Vite + React plugin) and a thin
// bootstrap that imports the styles and the app module.
//
// To refactor pieces into proper React components later, see README.md.
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import './app.js'

// No React tree to render — the vanilla JS module owns #app, #nav, #splash.
// We still create a root so React DevTools don't complain and so future
// refactors can mount components here.
const root = document.createElement('div')
root.id = 'react-root'
root.style.display = 'none'
document.body.appendChild(root)
ReactDOM.createRoot(root).render(<></>)
