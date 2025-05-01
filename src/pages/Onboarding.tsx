
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { categories } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { CheckIcon } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Form state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [notificationTime, setNotificationTime] = useState<string | null>(null);
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      // Final submission
      console.log('Onboarding completed with:', {
        categories: selectedCategories,
        difficulty,
        notificationTime
      });
      window.location.href = '/';
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Set Up Your NewsIQ</h1>
        <p className="text-muted-foreground">Let's personalize your experience</p>
      </div>
      
      <div className="mb-6">
        <Progress value={(step / totalSteps) * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">
              What topics interest you?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select at least 3 topics you'd like to see in your feed
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`relative p-4 rounded-lg border transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {selectedCategories.includes(category.id) && (
                    <span className="absolute top-2 right-2 text-primary">
                      <CheckIcon size={16} />
                    </span>
                  )}
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">
              What content depth do you prefer?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select your preferred level of content complexity
            </p>
            
            <RadioGroup value={difficulty || ''} onValueChange={setDifficulty}>
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 rounded-lg border p-4 ${difficulty === 'beginner' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                    <span className="font-medium">Beginner</span>
                    <p className="text-sm text-muted-foreground">
                      Easy-to-understand content with basic explanations
                    </p>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-3 rounded-lg border p-4 ${difficulty === 'intermediate' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                    <span className="font-medium">Intermediate</span>
                    <p className="text-sm text-muted-foreground">
                      Balanced content with some deeper insights
                    </p>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-3 rounded-lg border p-4 ${difficulty === 'advanced' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                    <span className="font-medium">Advanced</span>
                    <p className="text-sm text-muted-foreground">
                      In-depth analysis and expert-level content
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">
              When would you like to receive news updates?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select your preferred time for notifications
            </p>
            
            <RadioGroup value={notificationTime || ''} onValueChange={setNotificationTime}>
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 rounded-lg border p-4 ${notificationTime === 'morning' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="morning" id="morning" />
                  <Label htmlFor="morning" className="flex-1 cursor-pointer">
                    <span className="font-medium">Morning</span>
                    <p className="text-sm text-muted-foreground">
                      Get updates between 7AM - 9AM
                    </p>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-3 rounded-lg border p-4 ${notificationTime === 'afternoon' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="afternoon" id="afternoon" />
                  <Label htmlFor="afternoon" className="flex-1 cursor-pointer">
                    <span className="font-medium">Afternoon</span>
                    <p className="text-sm text-muted-foreground">
                      Get updates between 12PM - 2PM
                    </p>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-3 rounded-lg border p-4 ${notificationTime === 'evening' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="evening" id="evening" />
                  <Label htmlFor="evening" className="flex-1 cursor-pointer">
                    <span className="font-medium">Evening</span>
                    <p className="text-sm text-muted-foreground">
                      Get updates between 6PM - 8PM
                    </p>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-3 rounded-lg border p-4 ${notificationTime === 'none' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="flex-1 cursor-pointer">
                    <span className="font-medium">No Notifications</span>
                    <p className="text-sm text-muted-foreground">
                      I'll check the app myself
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}
        
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">
              You're all set!
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              We've personalized your NewsIQ experience based on your preferences. You can always change these settings later.
            </p>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium">Your Selected Topics</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map(catId => {
                      const category = categories.find(c => c.id === catId);
                      return category ? (
                        <span key={catId} className="bg-background px-3 py-1 rounded-full text-sm">
                          {category.icon} {category.name}
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">No topics selected</span>
                  )}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium">Content Depth</h3>
                <p className="text-sm mt-1 capitalize">
                  {difficulty || 'Not specified'}
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium">Notification Preference</h3>
                <p className="text-sm mt-1 capitalize">
                  {notificationTime === 'none' ? 'No notifications' : notificationTime || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handlePrevStep}>
            Back
          </Button>
        ) : (
          <div></div> // Empty div to maintain layout
        )}
        
        <Button 
          onClick={handleNextStep}
          disabled={
            (step === 1 && selectedCategories.length < 1) ||
            (step === 2 && !difficulty) ||
            (step === 3 && !notificationTime)
          }
        >
          {step === totalSteps ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
