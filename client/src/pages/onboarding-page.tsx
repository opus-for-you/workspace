import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: "vision",
    text: "What does meaningful work look like to you?",
    placeholder: "Forget titles. Think impact.",
  },
  {
    id: "energy",
    text: "When do you lose track of time at work?",
    placeholder: "These moments reveal your true strengths.",
  },
  {
    id: "direction",
    text: "Who do you want to become professionally?",
    placeholder: "Not what. Who.",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const completeMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete onboarding");
      }
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Welcome to Opus!",
        description: "Your journey begins now.",
      });
      navigate("/dashboard", { replace: true });
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (inputValue.trim()) {
      const updatedAnswers = { ...answers, [questions[currentQuestion].id]: inputValue };
      setAnswers(updatedAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setInputValue("");
        setIsTyping(false);
      } else {
        completeMutation.mutate(updatedAnswers);
      }
    }
  };

  const handleInputFocus = () => {
    setIsTyping(true);
  };

  const handleInputBlur = () => {
    if (!inputValue.trim()) {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isTyping ? 0.3 : 1, 
                y: isTyping ? -50 : 0 
              }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl text-charcoal font-display font-light mb-12"
              data-testid={`heading-question-${currentQuestion}`}
            >
              {questions[currentQuestion].text}
            </motion.h1>

            <motion.div
              animate={{ scale: isTyping ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={questions[currentQuestion].placeholder}
                className="w-full p-4 bg-transparent border-b-2 border-stone focus:border-sage-deep 
                         outline-none resize-none text-lg transition-all duration-300 font-light"
                rows={3}
                data-testid={`input-${questions[currentQuestion].id}`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: inputValue.trim() ? 1 : 0.3 }}
            >
              <Button
                onClick={handleNext}
                disabled={!inputValue.trim() || completeMutation.isPending}
                className="mt-8 px-8 py-3 bg-sage-deep text-cream hover:bg-sage transition-colors"
                data-testid="button-next"
              >
                {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-12 gap-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentQuestion ? "bg-sage-deep w-8" : "bg-stone"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
