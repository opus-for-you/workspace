import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const PROMPTS = [
  {
    text: "What's one small step you can take today toward your biggest goal?",
    category: "Action"
  },
  {
    text: "Which connection would benefit most from your attention this week?",
    category: "Relationships"
  },
  {
    text: "What recent win deserves more celebration than you gave it?",
    category: "Gratitude"
  },
  {
    text: "What's draining your energy that you could eliminate or delegate?",
    category: "Energy"
  },
  {
    text: "If you could only complete three tasks this week, which would matter most?",
    category: "Priorities"
  }
];

export function ReflectionPrompt() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const promptIndex = dayOfYear % PROMPTS.length;
  const prompt = PROMPTS[promptIndex];

  return (
    <Card className="relative overflow-hidden animate-fade-in bg-gradient-to-br from-sage-soft to-background border-sage/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full blur-3xl" />
      <CardContent className="pt-6 pb-6 relative">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-sage-deep/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-sage-deep" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wide uppercase text-sage">
                Daily Reflection
              </span>
              <span className="text-xs text-muted-foreground">• {prompt.category}</span>
            </div>
            <blockquote className="font-editorial text-lg leading-relaxed text-foreground/90">
              "{prompt.text}"
            </blockquote>
            <Link href="/reviews" data-testid="link-weekly-review">
              <Button 
                variant="ghost" 
                size="sm"
                className="group -ml-3 text-sage-deep hover:text-sage-deep"
              >
                Capture your thoughts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
