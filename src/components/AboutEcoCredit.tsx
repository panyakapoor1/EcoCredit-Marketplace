import { ImageWithFallback } from './figma/ImageWithFallback'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Leaf, ShieldCheck, Globe, TrendingUp, Users, Lock } from 'lucide-react'

interface AboutEcoCreditProps {
  onNavigate: (page: string) => void
}

export default function AboutEcoCredit({ onNavigate }: AboutEcoCreditProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Leaf className="w-12 h-12 text-[var(--teal)]" />
            <h1 className="text-5xl font-bold text-[var(--teal)]">EcoCredit India</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A revolutionary blockchain-powered platform enabling Indians to combat climate change through verified green actions. Join India's sustainable future with certified carbon credit trading.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={() => onNavigate('register')} 
              className="bg-[var(--teal)] hover:bg-[var(--teal)]/90 px-8 py-6"
            >
              Get Started
            </Button>
            <Button 
              onClick={() => onNavigate('login')} 
              variant="outline" 
              className="border-[var(--teal)] text-[var(--teal)] hover:bg-[var(--teal)]/10 px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4 pb-12">
        <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&h=600&fit=crop"
            alt="Sustainable environment"
            className="w-full h-[400px] object-cover"
          />
        </div>
      </section>

      {/* What is EcoCredit */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-[var(--teal)]">What is EcoCredit?</h2>
          <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            EcoCredit is a carbon trading platform that combines blockchain technology with AI verification to create a transparent, accessible marketplace for environmental impact.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-2 hover:border-[var(--teal)] transition-colors">
              <div className="w-16 h-16 bg-[var(--teal)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-[var(--teal)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Submit Green Actions</h3>
              <p className="text-muted-foreground">
                Document your eco-friendly activities with geotagged photos and detailed descriptions. From planting trees to using renewable energy.
              </p>
            </Card>

            <Card className="p-8 text-center border-2 hover:border-[var(--green)] transition-colors">
              <div className="w-16 h-16 bg-[var(--green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-[var(--green)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Verification</h3>
              <p className="text-muted-foreground">
                Our advanced AI system analyzes and verifies your submissions to ensure authenticity and calculate accurate carbon impact.
              </p>
            </Card>

            <Card className="p-8 text-center border-2 hover:border-[var(--light-blue)] transition-colors">
              <div className="w-16 h-16 bg-[var(--light-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[var(--light-blue)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trade Credits</h3>
              <p className="text-muted-foreground">
                Earn eco-credits for verified actions and trade them in our marketplace. Turn your environmental impact into tangible value.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-[#f0fdf4]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[var(--teal)]">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--teal)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-bold mb-2">Create Account</h3>
              <p className="text-muted-foreground text-sm">Sign up and complete your profile</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--green)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-bold mb-2">Submit Actions</h3>
              <p className="text-muted-foreground text-sm">Upload proof of your green initiatives</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--light-blue)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-bold mb-2">Get Verified</h3>
              <p className="text-muted-foreground text-sm">AI verifies and awards eco-credits</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--teal)] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-bold mb-2">Trade & Track</h3>
              <p className="text-muted-foreground text-sm">Trade credits and monitor your impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[var(--teal)]">Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Globe className="w-10 h-10 text-[var(--teal)]" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Blockchain Transparency</h3>
                <p className="text-muted-foreground">
                  Every transaction and verification is recorded on the blockchain, ensuring complete transparency and preventing fraud.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <ShieldCheck className="w-10 h-10 text-[var(--green)]" />
              </div>
              <div>
                <h3 className="font-bold mb-2">AI-Powered Verification</h3>
                <p className="text-muted-foreground">
                  Machine learning algorithms analyze photos, geolocation data, and action details to verify authenticity.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Users className="w-10 h-10 text-[var(--light-blue)]" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Community Driven</h3>
                <p className="text-muted-foreground">
                  Join a global community of environmental champions. Collaborate, compete, and celebrate positive impact together.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Lock className="w-10 h-10 text-[var(--teal)]" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and secured. You control what information is shared and with whom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-[var(--teal)] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="text-white/80">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2M+</div>
              <p className="text-white/80">Green Actions</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500K</div>
              <p className="text-white/80">Tons CO₂ Offset</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$10M+</div>
              <p className="text-white/80">Credits Traded</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-[#f0fdf4]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-[var(--teal)]">Ready to Make an Impact?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of individuals and businesses making a real difference in the fight against climate change.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={() => onNavigate('register')} 
              className="bg-[var(--teal)] hover:bg-[var(--teal)]/90 px-8 py-6"
            >
              Create Free Account
            </Button>
            <Button 
              onClick={() => onNavigate('login')} 
              variant="outline" 
              className="border-[var(--teal)] text-[var(--teal)] hover:bg-[var(--teal)]/10 px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
