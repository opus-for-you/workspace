import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Clock, Target, Zap, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditorialHeading, EditorialLabel, EditorialText, ProgressLine, BreathingContainer } from "@/components/editorial";
import { WeekProgress } from "@/components/week-progress";
import { format, startOfWeek, addDays } from "date-fns";
import type { SafeUser, Goal, Task } from "@shared/schema";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: user } = useQuery<SafeUser>({
    queryKey: ["/api/user"],
  });
  
  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });
  
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
  
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  const weekNumber = format(new Date(), "w");
  
  const thisWeekTasks = tasks
    .filter(t => t.status !== "done")
    .slice(0, 5);
  
  const activeGoals = goals
    .filter(g => g.progress < 100)
    .slice(0, 3);
  
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const totalConnections = 14;
  const currentStreak = 82;
  const alignmentScore = 92;
  
  return (
    <BreathingContainer>
      {/* Hero Section - North Star */}
      <motion.section 
        className="section-space"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <EditorialLabel className="mb-6">YOUR NORTH STAR</EditorialLabel>
        <EditorialHeading level={1} className="text-charcoal max-w-5xl mb-8">
          {user?.vision || "Build products that bridge human needs with technological possibility."}
        </EditorialHeading>
        
        <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Week {weekNumber} of {format(new Date(), "yyyy")}
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {alignmentScore}% Aligned
          </span>
        </div>
      </motion.section>
      
      {/* Main Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-16">
          {/* This Week Section */}
          <motion.section variants={item}>
            <div className="flex justify-between items-baseline border-b border-pearl pb-4 mb-8">
              <h3 className="text-editorial-sm tracking-wider text-charcoal">THIS WEEK</h3>
              <span className="text-editorial-sm text-muted-foreground">
                {format(weekStart, "MMM d")}-{format(weekEnd, "d")}
              </span>
            </div>
            
            <div className="space-y-6">
              {thisWeekTasks.length === 0 ? (
                <div className="text-center py-12 text-stone">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No tasks for this week. Start by setting your priorities.</p>
                </div>
              ) : (
                thisWeekTasks.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    className="group cursor-pointer border-b border-pearl pb-6 hover:border-charcoal/20 transition-all duration-300"
                    whileHover={{ x: 4 }}
                    data-testid={`task-${task.id}`}
                  >
                    <div className="flex items-start gap-6">
                      <span className="font-mono text-2xl font-light text-fog">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-xl text-charcoal mb-2">{task.title}</h4>
                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                          <span>{task.context || "Strategic Work"}</span>
                          <span className="text-fog">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.timing || "Flexible"}
                          </span>
                          {task.energy === "high" && (
                            <>
                              <span className="text-fog">•</span>
                              <span className="flex items-center gap-1 text-sage">
                                <Zap className="h-3 w-3" />
                                High Energy
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            <Button variant="ghost" className="mt-8 text-editorial-sm tracking-wider" data-testid="button-set-priority">
              <Target className="mr-2 h-4 w-4" />
              SET NEXT PRIORITY
            </Button>
          </motion.section>
          
          {/* Current Chapter */}
          <motion.section variants={item}>
            <h3 className="text-editorial-sm tracking-wider text-charcoal border-b border-pearl pb-4 mb-8">
              CURRENT CHAPTER
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { metric: currentStreak.toString(), unit: "DAYS", label: "Building thought leadership" },
                { metric: totalConnections.toString(), unit: "CONNECTIONS", label: "Strategic relationships" },
                { metric: completedTasks.toString(), unit: "MILESTONES", label: "Technical achievements" },
                { metric: alignmentScore.toString(), unit: "% ALIGNED", label: "With your vision" },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  data-testid={`stat-${stat.unit.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display text-5xl font-light text-charcoal group-hover:text-sage-deep transition-colors">
                      {stat.metric}
                    </span>
                    <span className="text-editorial-xs text-muted-foreground">
                      {stat.unit}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          {/* Active Goals */}
          <motion.section variants={item}>
            <div className="flex justify-between items-baseline border-b border-pearl pb-4 mb-8">
              <h3 className="text-editorial-sm tracking-wider text-charcoal">ACTIVE GOALS</h3>
              <Button variant="ghost" size="sm" className="text-editorial-xs tracking-wider" data-testid="button-view-all-goals">
                VIEW ALL
              </Button>
            </div>
            
            <div className="space-y-8">
              {activeGoals.length === 0 ? (
                <div className="text-center py-12 text-stone">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No active goals. Set your first goal to get started.</p>
                </div>
              ) : (
                activeGoals.map((goal) => (
                  <Card key={goal.id} className="editorial-card p-6" data-testid={`goal-${goal.id}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="editorial-label mb-2">{goal.category?.toUpperCase() || "GENERAL"}</p>
                        <h4 className="text-lg text-charcoal">{goal.title}</h4>
                      </div>
                      <span className="text-editorial-xs text-muted-foreground">
                        {goal.targetDate ? format(new Date(goal.targetDate), "MMM d") : "Ongoing"}
                      </span>
                    </div>
                    <ProgressLine progress={goal.progress || 0} />
                  </Card>
                ))
              )}
            </div>
          </motion.section>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-12">
          {/* Week Progress Tracker */}
          {user?.createdAt && (
            <motion.div variants={item}>
              <WeekProgress userCreatedAt={new Date(user.createdAt).toISOString()} />
            </motion.div>
          )}
          
          {/* Weekly Reflection */}
          <motion.div variants={item}>
            <Card className="editorial-card p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-editorial-sm tracking-wider">WEEKLY REFLECTION</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EditorialText className="mb-6">
                  What patterns are emerging in your work? Take 10 minutes to capture insights.
                </EditorialText>
                <Button className="w-full text-editorial-sm tracking-wider" data-testid="button-begin-reflection">
                  <BookOpen className="mr-2 h-4 w-4" />
                  BEGIN
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Energy Patterns */}
          <motion.div variants={item}>
            <h4 className="text-editorial-sm tracking-wider text-charcoal mb-6">
              ENERGY PATTERNS
            </h4>
            <div className="space-y-5">
              {[
                { label: "Peak Focus", time: "9-11 AM", level: 85 },
                { label: "Creative Flow", time: "2-4 PM", level: 70 },
                { label: "Strategic Thinking", time: "5-6 PM", level: 60 },
              ].map((pattern, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{pattern.label}</span>
                    <span className="text-charcoal">{pattern.time}</span>
                  </div>
                  <ProgressLine progress={pattern.level} animated />
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Upcoming */}
          <motion.div variants={item}>
            <h4 className="text-editorial-sm tracking-wider text-charcoal mb-6">
              NEXT WEEK
            </h4>
            <ul className="space-y-4">
              {["Product strategy session", "1:1 with Sarah Chen", "Technical review"].map(
                (item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center text-sm text-muted-foreground group cursor-pointer"
                    whileHover={{ x: 2 }}
                  >
                    <span className="mr-3 text-fog">—</span>
                    <span className="group-hover:text-charcoal transition-colors">{item}</span>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </BreathingContainer>
  );
}
