import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// Shared design tokens. Loaded before index.css so the app's own rules
// still win while the duplicated token block is being removed.
import '@lukea/sivu/styles.css'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />    
    </BrowserRouter>
)
