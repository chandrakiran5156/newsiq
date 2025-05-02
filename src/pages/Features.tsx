
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, BookOpen, Trophy, Search, Clock, Star, Award } from 'lucide-react';

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      {/* Hero section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Features that Empower Your Learning</h1>
            <p className="text-lg text-muted-foreground mb-8">
              NewsIQ combines personalized news with interactive learning to keep you informed and engaged.
              Discover all the powerful features that help you maximize knowledge retention.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#core-features">Explore Features</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="core-features" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalized Content</h3>
                <p className="text-muted-foreground mb-4">
                  Our algorithm analyzes your preferences to deliver news and articles tailored specifically to your interests and reading level.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Content matched to your preference categories</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Adjustable difficulty levels</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Smart recommendations that improve over time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive Quizzes</h3>
                <p className="text-muted-foreground mb-4">
                  Reinforce your knowledge with quizzes tailored to each article you read, helping you retain information longer.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Custom quizzes for every article</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Instant feedback and explanations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Track your progress and improvement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Discovery</h3>
                <p className="text-muted-foreground mb-4">
                  Expand your horizons with our intelligent discovery system that helps you find new topics and interests.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Advanced search capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Topic exploration suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Trending topics and current events</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Award size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Achievement System</h3>
                <p className="text-muted-foreground mb-4">
                  Stay motivated with our comprehensive achievement system that rewards your learning journey.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Unlock badges as you reach milestones</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Track reading streaks and statistics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Compare progress with friends</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Star size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Leaderboards</h3>
                <p className="text-muted-foreground mb-4">
                  Compete with friends and other users on our dynamic leaderboards that track various metrics.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Daily, weekly and monthly rankings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Category-specific leaderboards</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Team competitions for organizations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Reading History</h3>
                <p className="text-muted-foreground mb-4">
                  Keep track of your reading habits with comprehensive history and analytics.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Access your complete reading history</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>View reading time analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Topic distribution visualization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Details */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Personalization That Adapts</h2>
              <p className="text-lg mb-6">
                NewsIQ's advanced algorithms learn from your reading habits and preferences to deliver increasingly relevant content over time.
              </p>
              <ul className="space-y-4">
                {[
                  "AI-powered content recommendations",
                  "Adjustable reading level for any topic",
                  "Content format preferences (summaries vs. deep dives)",
                  "Time-based delivery options"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary mr-3 flex items-center justify-center text-white">
                      {idx + 1}
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Personalization Feature Demo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Feature Detail */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 aspect-video bg-muted rounded-lg overflow-hidden border border-border">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Quiz System Demo</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-4">Interactive Learning System</h2>
              <p className="text-lg mb-6">
                Our quiz system is designed to maximize knowledge retention through active learning principles and spaced repetition.
              </p>
              <ul className="space-y-4">
                {[
                  "Customized quizzes based on article content",
                  "Explanations that reinforce learning",
                  "Performance tracking across topics",
                  "Difficulty that adjusts to your knowledge level"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary mr-3 flex items-center justify-center text-white">
                      {idx + 1}
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Table */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How We Compare</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-6 text-left">Features</th>
                  <th className="py-4 px-6 text-center bg-primary/10 border-x border-primary/20">
                    <span className="text-lg font-bold">NewsIQ</span>
                  </th>
                  <th className="py-4 px-6 text-center">Standard News Apps</th>
                  <th className="py-4 px-6 text-center">Learning Platforms</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Personalized Content",
                    newsiq: true,
                    standard: true,
                    learning: false
                  },
                  {
                    feature: "Interactive Quizzes",
                    newsiq: true,
                    standard: false,
                    learning: true
                  },
                  {
                    feature: "Reading Level Adjustment",
                    newsiq: true,
                    standard: false,
                    learning: true
                  },
                  {
                    feature: "Achievement System",
                    newsiq: true,
                    standard: false,
                    learning: true
                  },
                  {
                    feature: "Leaderboards",
                    newsiq: true,
                    standard: false,
                    learning: true
                  },
                  {
                    feature: "Current News Content",
                    newsiq: true,
                    standard: true,
                    learning: false
                  },
                  {
                    feature: "Knowledge Retention Focus",
                    newsiq: true,
                    standard: false,
                    learning: true
                  }
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-background/50" : ""}>
                    <td className="py-4 px-6 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center bg-primary/5 border-x border-primary/10">
                      {row.newsiq ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.standard ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.learning ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-violet-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience NewsIQ?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of users who are transforming how they consume news and information.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
            <Link to="/auth">Get Started for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
