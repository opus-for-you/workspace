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
    <div className="relative overflow-hidden animate-fade-in bg-white rounded-organic shadow-organic p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-alabaster/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="relative">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-primary/10 rounded-organic-sm">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-widest uppercase text-primary font-medium">
                Daily Reflection
              </span>
              <span className="text-xs text-stone">• {prompt.category}</span>
            </div>
            <blockquote className="font-serif text-xl font-light leading-relaxed text-charcoal">
              "{prompt.text}"
            </blockquote>
            <Link href="/reviews" data-testid="link-weekly-review">
              <Button 
                variant="ghost" 
                size="sm"
                className="group -ml-3 text-primary hover:text-primary"
              >
                Capture your thoughts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
