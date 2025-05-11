import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Check, 
  Star, 
  Trophy, 
  BookOpen, 
  MessageSquare, 
  Headphones, 
  Brain, 
  Info, 
  DollarSign, 
  Phone, 
  Users 
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/40' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">News<span className="text-primary">IQ</span></span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6 ml-auto">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-primary transition-colors">
                <Info size={16} className="inline mr-1" /> Features
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium hover:text-primary transition-colors">
                <Users size={16} className="inline mr-1" /> Testimonials
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium hover:text-primary transition-colors">
                <DollarSign size={16} className="inline mr-1" /> Pricing
              </button>
            </nav>
            
            <div className="flex items-center space-x-4 ml-6">
              <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                <Phone size={16} className="inline mr-1" /> Contact
              </Link>
              <Button asChild size="sm">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-primary/90 to-violet-600 text-white pt-24">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Personalized News <span className="text-amber-300">Made Smarter</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-lg">
                NewsIQ delivers intelligent news tailored to your interests, with interactive quizzes to boost knowledge retention.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="bg-violet-700/60 text-white hover:bg-violet-700/80 border-white/20">
                  <button onClick={() => scrollToSection('features')}>Learn More</button>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/lovable-uploads/2cf273c4-1a34-4690-8407-e1fe77fa3d30.png" 
                alt="NewsIQ Digital News Platform" 
                className="rounded-lg shadow-xl animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-12 bg-background border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center p-4 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <BookOpen size={28} />
              </div>
              <h3 className="font-medium mb-1">Personalized Content</h3>
              <p className="text-muted-foreground text-sm">Tailored to your interests</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Brain size={28} />
              </div>
              <h3 className="font-medium mb-1">AI Summarization</h3>
              <p className="text-muted-foreground text-sm">Complex topics made simple</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <MessageSquare size={28} />
              </div>
              <h3 className="font-medium mb-1">Chat Interface</h3>
              <p className="text-muted-foreground text-sm">Ask questions about articles</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Headphones size={28} />
              </div>
              <h3 className="font-medium mb-1">Audio Features</h3>
              <p className="text-muted-foreground text-sm">Listen and interact by voice</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Trophy size={28} />
              </div>
              <h3 className="font-medium mb-1">Gamified Learning</h3>
              <p className="text-muted-foreground text-sm">Learn through quizzes and rewards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose NewsIQ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines the best of news aggregation with personalized learning to keep you informed and engaged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Content</h3>
                <p className="text-muted-foreground">
                  Articles curated based on your interests and preferences, saving you time and keeping you informed on topics that matter to you.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Quizzes</h3>
                <p className="text-muted-foreground">
                  Test your knowledge with quizzes tailored to each article, reinforcing what you've learned and earning points.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Conversations</h3>
                <p className="text-muted-foreground">
                  Have natural conversations about article content to deepen your understanding and find additional context.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/30c6a5f0-00d3-441b-b498-beac4b09c5b3.png" 
                alt="News Technology Showcase" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-4">AI-Powered News Experience</h2>
              <p className="text-lg mb-6">
                NewsIQ combines cutting-edge AI with intuitive design to transform how you consume news.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/20 p-1 rounded-full">
                    <Brain size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adaptive Difficulty</h3>
                    <p className="text-muted-foreground">Content automatically adjusts to your knowledge level, from beginner to advanced.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/20 p-1 rounded-full">
                    <MessageSquare size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Conversational Interface</h3>
                    <p className="text-muted-foreground">Ask questions and get immediate answers about any article's content.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary/20 p-1 rounded-full">
                    <Headphones size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Voice Interaction</h3>
                    <p className="text-muted-foreground">Listen to articles and interact with content using natural voice commands.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              NewsIQ makes staying informed and learning easy with a simple process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 hover:bg-accent/20 rounded-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-medium mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create your account and tell us your interests</p>
            </div>

            <div className="text-center p-6 hover:bg-accent/20 rounded-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-medium mb-2">Read Articles</h3>
              <p className="text-muted-foreground">Discover personalized content tailored to your preferences</p>
            </div>

            <div className="text-center p-6 hover:bg-accent/20 rounded-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-medium mb-2">Take Quizzes</h3>
              <p className="text-muted-foreground">Test your knowledge and earn points</p>
            </div>

            <div className="text-center p-6 hover:bg-accent/20 rounded-lg transition-all">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-medium mb-2">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your learning and compete on leaderboards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Experience */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <h2 className="text-3xl font-bold mb-4">News Wherever You Go</h2>
              <p className="text-lg mb-6">
                Access your personalized news experience on any device, anytime, anywhere.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-2 flex-shrink-0" />
                  <span>Seamless synchronization across all your devices</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-2 flex-shrink-0" />
                  <span>Offline reading mode for on-the-go access</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-2 flex-shrink-0" />
                  <span>Voice commands for hands-free operation</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-primary mr-2 flex-shrink-0" />
                  <span>Adjustable text size and reading modes</span>
                </li>
              </ul>
              
              <Button asChild className="mt-4">
                <Link to="/auth">Try for Free</Link>
              </Button>
            </div>
            
            <div className="order-1 md:order-2">
              <img 
                src="/lovable-uploads/981bfbee-b217-43f5-9a43-b658db3122f0.png" 
                alt="NewsIQ Mobile Experience" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thousands of users love how NewsIQ helps them stay informed and learn more effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic text-muted-foreground">
                  "NewsIQ has completely changed how I consume news. The personalized articles and quizzes have helped me retain information much better."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="font-medium text-primary">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">Marketing Executive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic text-muted-foreground">
                  "I love the gamification aspects. Competing on the leaderboard with colleagues has made staying informed fun and engaging!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="font-medium text-primary">AS</span>
                  </div>
                  <div>
                    <p className="font-medium">Alice Smith</p>
                    <p className="text-sm text-muted-foreground">Software Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic text-muted-foreground">
                  "The app's difficulty settings are perfect. I can adjust the content complexity based on my familiarity with different topics."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="font-medium text-primary">RJ</span>
                  </div>
                  <div>
                    <p className="font-medium">Robert Johnson</p>
                    <p className="text-sm text-muted-foreground">University Professor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your reading habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium mb-1">Basic</h3>
                  <div className="text-3xl font-bold mb-2">Free</div>
                  <p className="text-sm text-muted-foreground mb-4">Get started with the essentials</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {["5 articles per day", "Basic quizzes", "Standard topics", "Web access"].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check size={18} className="text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="w-full">
                  <Link to="/auth">Sign Up Free</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-primary relative hover:shadow-xl transition-all duration-300 scale-[1.02]">
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium mb-1">Pro</h3>
                  <div className="text-3xl font-bold mb-2">$9.99<span className="text-base font-normal">/mo</span></div>
                  <p className="text-sm text-muted-foreground mb-4">Everything you need to stay informed</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {["Unlimited articles", "Advanced quizzes", "All topics", "Web & mobile access", "Reading history", "Ad-free experience"].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check size={18} className="text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full">
                  <Link to="/auth">Get Pro</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium mb-1">Team</h3>
                  <div className="text-3xl font-bold mb-2">$29.99<span className="text-base font-normal">/mo</span></div>
                  <p className="text-sm text-muted-foreground mb-4">Perfect for organizations</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {["Everything in Pro", "5 team members", "Team leaderboards", "Analytics dashboard", "Custom topics", "Priority support"].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check size={18} className="text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="w-full">
                  <Link to="/auth">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-violet-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Smarter News Journey Today</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of users who are transforming how they consume news and information.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
            <Link to="/auth">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">NewsIQ</h3>
              <p className="text-muted-foreground mb-4">
                Intelligent news personalization and learning platform.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </Button>
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </Button>
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </Button>
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z"/>
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">API</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Press</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Support</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted-foreground/20 text-center text-muted-foreground">
            <p>&copy; 2025 NewsIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
