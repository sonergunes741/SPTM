import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { MissionProvider } from './context/MissionContext'
import { TaskProvider } from './context/TaskContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MissionProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </MissionProvider>
  </React.StrictMode>,
)
