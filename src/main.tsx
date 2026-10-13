import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// Shared design tokens. Loaded before index.css so the app's own rules
// still win while the duplicated token block is being removed.
import '@lukea/sivu/styles.css'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SivuProvider } from '@lukea/sivu'

// theme is pinned to light on purpose. sivu ships a full dark palette and
// this app has always defined one, but nothing has ever rendered it -- there
// was no toggle and no way to set the class. Switching it on means auditing
// ~7,500 lines of light-first CSS first. See the dark-mode audit issue.
//
// Do not pass compatScope="ops" here: that hands --card and --accent the ops
// hex values, and this app needs them to hold shadcn's HSL channels.
ReactDOM.createRoot(document.getElementById('root')!).render(
    <SivuProvider theme="light">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SivuProvider>
)
