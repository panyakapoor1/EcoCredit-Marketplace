import { AppProvider, useApp } from "./contexts/AppContext"
import { ReactLenis } from '@studio-freight/react-lenis'
import { AnimatePresence, motion } from 'framer-motion'
import Navigation from "./components/Navigation"
import AboutEcoCredit from "./components/AboutEcoCredit"
import Login from "./components/Login"
import Register from "./components/Register"
import LandingPage from "./components/LandingPage"
import SubmitAction from "./components/SubmitAction"
import Marketplace from "./components/Marketplace"
import Dashboard from "./components/Dashboard"
import ImpactTracking from "./components/ImpactTracking"
import Footer from "./components/Footer"
import NotificationSystem from "./components/NotificationSystem"

function AppContent() {
  const { state, dispatch } = useApp()

  // Smooth scroll is handled by ReactLenis, but we can keep standard effect if needed.
  // We'll reset scroll to top using AnimatePresence onExitComplete instead.

  const handleNavigate = (page: string) => {
    dispatch({ type: 'SET_PAGE', payload: page })
  }

  const handleLogin = (user: any) => {
    dispatch({ type: 'LOGIN', payload: user })
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', message: 'Successfully logged in!' } })
  }

  const handleRegister = (user: any) => {
    dispatch({ type: 'LOGIN', payload: user })
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', message: 'Account created successfully!' } })
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', message: 'You have been logged out' } })
  }

  const renderCurrentPage = () => {
    // Pre-login pages
    if (!state.isAuthenticated) {
      switch (state.currentPage) {
        case 'about':
          return <AboutEcoCredit onNavigate={handleNavigate} />
        case 'login':
          return <Login onNavigate={handleNavigate} onLogin={handleLogin} />
        case 'register':
          return <Register onNavigate={handleNavigate} onRegister={handleRegister} />
        default:
          return <AboutEcoCredit onNavigate={handleNavigate} />
      }
    }

    // Post-login pages
    switch (state.currentPage) {
      case 'home':
        return <LandingPage onNavigate={handleNavigate} />
      case 'submit':
        return <SubmitAction />
      case 'marketplace':
        return <Marketplace />
      case 'dashboard':
        return <Dashboard />
      case 'impact':
        return <ImpactTracking />
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation 
        currentPage={state.currentPage} 
        onNavigate={handleNavigate}
        isAuthenticated={state.isAuthenticated}
        userEmail={state.user?.email}
        userRole={state.user?.role}
        onLogout={handleLogout}
      />
      <main className="min-h-screen">
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <motion.div
            key={state.currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      {state.isAuthenticated && <Footer onNavigate={handleNavigate} />}
      <NotificationSystem />
    </div>
  )
}

export default function App() {
  return (
    <ReactLenis root>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ReactLenis>
  )
}