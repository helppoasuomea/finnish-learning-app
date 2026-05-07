import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AllDecks } from './pages/AllDecksPage'
import './App.css'
import { DeckDetailsPage } from './pages/DeckDetailsPage'
import { IndexPage } from './pages/IndexPage'
import axios from 'axios'
import { UserContextProvider } from './contexts/UserContext'
import { DeckContextProvider } from './contexts/DeckContext'
import { SidebarProvider, useSidebar } from './contexts/SidebarContext'
import { Toaster } from "@/components/ui/toaster"
import { Header } from './components/Header'
import { VocabularyPage } from './components/vocabulary-page'
import { useEffect } from 'react'
import { SettingsPage } from './components/SettingsPage'
import { Sidebar } from './components/Sidebar'
import { SavedSentencesPage } from './components/SavedSentencesPage'
import { ReviewDashboardPage } from './pages/ReviewDashboardPage'
import { HistoryPage } from './pages/HistoryPage'
import { AuthPage } from './pages/AuthPage'
import { GrammarIndex } from './components/GrammarPage/GrammarBrowser'
import { GrammarTopicPage } from './components/GrammarPage/GrammarTopicPage'
import { BrowsePage } from './pages/BrowsePage'
import { PublicDeckPage } from './pages/PublicDeckPage'

axios.defaults.baseURL = 'http://localhost:2323/api/'
axios.defaults.withCredentials = true

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/grammar"];

function App() {
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
      const userId = localStorage.getItem('userId')
      const isAuthRoute = AUTH_ROUTES.includes(location.pathname)
      const isPublicRoute = PUBLIC_ROUTES.some(r => location.pathname === r || location.pathname.startsWith(r + '/'))
      if (!userId && !isAuthRoute && !isPublicRoute) navigate('/')
  }, [navigate, location.pathname])

  // Scroll to top on route change. Skip when the URL carries a #hash so
  // deep-links to a specific section (e.g. /grammar/foo#suffixes) still work.
  useEffect(() => {
      if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname, location.hash])

  return (
    <UserContextProvider>
      <DeckContextProvider>
        <SidebarProvider>
          <AppContent
            location={location}
          />
        </SidebarProvider>
      </DeckContextProvider>
    </UserContextProvider>
  )
}

const AppContent = ({ location }: { location: any }) => {
  const { sidebarWidth } = useSidebar();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  if (isAuthRoute) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<AuthPage initialMode="signin" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
        </Routes>
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-tk-paper">
      <Sidebar />
      <div
        className="flex-1 transition-all duration-300 bg-tk-paper"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Show Header on mobile */}
        {location.pathname !== '/' && (
          <div className="md:hidden">
            <Header />
          </div>
        )}
        <Routes>
          {/* Routes that need deck context */}
          <Route index element={<IndexPage />} />
          <Route path="/view-all-decks" element={<AllDecks />} />
          <Route path="/view-decks/:id" element={<DeckDetailsPage />} />
          <Route path='/vocabulary' element={<VocabularyPage />} />
          <Route path='/saved-sentences' element={<SavedSentencesPage />} />
          <Route path='/review' element={<ReviewDashboardPage />} />
          <Route path='/history' element={<HistoryPage />} />
          <Route path='/grammar' element={<GrammarIndex />} />
          <Route path='/grammar/:topicId' element={<GrammarTopicPage />} />
          <Route path='/browse' element={<BrowsePage />} />
          <Route path='/browse/:id' element={<PublicDeckPage />} />

          {/* Routes that DON'T need deck context */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
