
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Trophy, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 px-6 py-16 md:py-24">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                News<span className="text-primary">IQ</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                Stay informed, test your knowledge, and compete with friends
              </p>
              <p className="text-lg mb-8">
                NewsIQ personalizes your reading experience and makes learning fun with 
                quizzes, achievements, and leaderboards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base">
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-background rounded-xl shadow-2xl overflow-hidden border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
                  alt="NewsIQ App" 
                  className="w-full h-auto rounded-t-lg" 
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">Personalized News Feed</h3>
                  <p className="text-muted-foreground">Content tailored to your interests and expertise level</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 container max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose NewsIQ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Brain size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Personalization</h3>
            <p className="text-muted-foreground">Content tailored to your interests and expertise level</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <BookOpen size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Learn with Quizzes</h3>
            <p className="text-muted-foreground">Test your knowledge with quizzes after each article</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Trophy size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Earn Achievements</h3>
            <p className="text-muted-foreground">Collect badges and track your progress</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Users size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compete with Friends</h3>
            <p className="text-muted-foreground">Join leaderboards and challenge your network</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to boost your knowledge?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of readers who are expanding their horizons with NewsIQ
          </p>
          <Button asChild size="lg" variant="secondary" className="text-primary">
            <Link to="/signup" className="flex items-center gap-2">
              Join Now <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              News<span className="text-primary">IQ</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Making news reading more engaging and educational
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NewsIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
