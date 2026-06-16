import { useState } from "react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Leaf, Menu, User, LogOut } from "lucide-react"

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  userEmail?: string;
  userRole?: string;
  onLogout?: () => void;
}

export default function Navigation({ currentPage, onNavigate, isAuthenticated, userEmail, userRole, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'submit', label: 'Submit Action', icon: '📤' },
    { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'impact', label: 'Impact Tracking', icon: '📈' }
  ]

  const handleMobileNavigate = (page: string) => {
    onNavigate(page)
    setIsMobileMenuOpen(false)
  }

  const handleMobileLogout = () => {
    onLogout?.()
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate(isAuthenticated ? 'home' : 'about')}
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#008080] rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#008080]">EcoCredit India</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-[#008080] ${
                      currentPage === item.id 
                        ? 'text-[#008080] border-b-2 border-[#008080]' 
                        : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* User Menu - Authenticated Desktop */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{userEmail}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onLogout}
                  className="hover:bg-red-50 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            /* User Menu - Not Authenticated Desktop */
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate('login')}
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="bg-[#008080] hover:bg-[#008080]/90"
                onClick={() => onNavigate('register')}
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="p-2 bg-[#008080] rounded-lg">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    EcoCredit India
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-full">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Welcome back!</p>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{userEmail}</p>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <div className="space-y-2">
                        {navItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleMobileNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                              currentPage === item.id 
                                ? 'bg-[#008080]/10 text-[#008080] border-l-4 border-[#008080]' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Logout Button */}
                      <div className="pt-4 border-t border-gray-200">
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                          onClick={handleMobileLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* Not Authenticated Mobile Menu */
                    <div className="space-y-4">
                      <p className="text-gray-600 text-center">
                        Join India's carbon credit marketplace
                      </p>
                      
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleMobileNavigate('login')}
                        >
                          Sign In
                        </Button>
                        <Button 
                          className="w-full bg-[#008080] hover:bg-[#008080]/90"
                          onClick={() => handleMobileNavigate('register')}
                        >
                          Get Started
                        </Button>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleMobileNavigate('about')}
                          className="w-full text-left px-4 py-2 text-gray-600 hover:text-[#008080] transition-colors"
                        >
                          Learn About EcoCredit India
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}