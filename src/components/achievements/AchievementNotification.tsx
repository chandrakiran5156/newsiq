
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Award } from "lucide-react";

interface AchievementNotificationProps {
  achievementName: string | null;
  achievementDescription?: string;
  onDismiss: () => void;
}

export function AchievementNotification({ 
  achievementName, 
  achievementDescription,
  onDismiss
}: AchievementNotificationProps) {
  const { toast } = useToast();
  
  useEffect(() => {
    if (achievementName) {
      const { dismiss } = toast({
        title: "Achievement Unlocked!",
        description: (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Award className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{achievementName}</span>
            </div>
            {achievementDescription && (
              <p className="text-sm text-muted-foreground">{achievementDescription}</p>
            )}
          </div>
        ),
        duration: 5000,
        onOpenChange: (open) => {
          if (!open) {
            onDismiss();
          }
        }
      });
    }
  }, [achievementName, achievementDescription, onDismiss, toast]);

  return null;
}
