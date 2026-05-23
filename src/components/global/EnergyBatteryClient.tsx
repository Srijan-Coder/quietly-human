"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Task {
  id: string;
  text: string;
  cost: number;
}

export default function EnergyBatteryClient() {
  const [maxEnergy, setMaxEnergy] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [costInput, setCostInput] = useState<number>(1);
  const [stage, setStage] = useState<"setting_battery" | "planning">("setting_battery");

  const totalCost = tasks.reduce((sum, t) => sum + t.cost, 0);
  const remainingEnergy = maxEnergy - totalCost;
  const isOverdrawn = remainingEnergy < 0;

  const handleSetBattery = (level: number) => {
    setMaxEnergy(level);
    setStage("planning");
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || costInput < 1 || costInput > 10) return;
    setTasks([...tasks, { id: Date.now().toString(), text: input.trim(), cost: costInput }]);
    setInput("");
    setCostInput(1);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const reset = () => {
    setStage("setting_battery");
    setTasks([]);
    setMaxEnergy(0);
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-6">
      <AnimatePresence mode="wait">
        
        {stage === "setting_battery" && (
          <motion.div
            key="setting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            className="w-full flex flex-col items-center max-w-lg"
          >
            <div className="text-4xl mb-6 grayscale opacity-50">🔋</div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-4 text-center text-balance">
              The Energy Battery
            </h2>
            <p className="text-brand-soft text-sm text-center mb-12">
              Before you make a to-do list, you must honestly assess your physical and mental capacity for today.
            </p>

            <h3 className="text-xs uppercase tracking-widest text-brand-text mb-6">How many bars of energy do you actually have?</h3>
            
            <div className="flex gap-2 mb-12 w-full justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSetBattery(level)}
                  className={`w-8 h-16 border rounded-sm transition-all ${
                    level <= 3 ? "border-red-500/50 hover:bg-red-500/20" : 
                    level <= 6 ? "border-[#fca311]/50 hover:bg-[#fca311]/20" : 
                    "border-green-500/50 hover:bg-green-500/20"
                  }`}
                />
              ))}
            </div>
            
            <Link href="/toolkit" className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors">
              Cancel
            </Link>
          </motion.div>
        )}

        {stage === "planning" && (
          <motion.div
            key="planning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col lg:flex-row gap-12 lg:gap-24 items-start"
          >
            {/* The Battery Visual */}
            <div className="w-full lg:w-1/3 flex flex-col items-center">
              <h3 className="text-[10px] uppercase tracking-widest text-brand-soft mb-6">Today's Capacity</h3>
              
              <div className="w-24 border-4 border-brand-border rounded-xl p-2 relative flex flex-col-reverse gap-1 mb-2 bg-brand-bg shadow-lg h-[400px]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-3 bg-brand-border rounded-t-md" />
                
                {[...Array(maxEnergy)].map((_, i) => {
                  const isConsumed = i >= remainingEnergy;
                  const isDeficit = i >= maxEnergy; // if we had overdraw bars, but we just show red
                  return (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        opacity: isConsumed && !isOverdrawn ? 0.2 : 1,
                        backgroundColor: isOverdrawn ? "#ef4444" : isConsumed ? "#333" : 
                                       (remainingEnergy <= 2 ? "#ef4444" : remainingEnergy <= 5 ? "#fca311" : "#22c55e")
                      }}
                      className="w-full flex-1 rounded-sm transition-colors duration-500"
                    />
                  );
                })}
              </div>
              
              <div className={`mt-4 text-center ${isOverdrawn ? 'text-red-500 animate-pulse' : 'text-brand-text'}`}>
                <span className="font-serif text-3xl block">{remainingEnergy}</span>
                <span className="text-[10px] uppercase tracking-widest block">Bars Remaining</span>
              </div>
              
              <button onClick={reset} className="mt-8 text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors">
                Reset Day
              </button>
            </div>

            {/* Task Planner */}
            <div className="w-full lg:w-2/3">
              <h2 className="font-serif text-2xl text-brand-text mb-8">Plan your day.</h2>
              
              <form onSubmit={addTask} className="flex gap-4 mb-8 bg-brand-card/30 p-4 rounded-xl border border-brand-border">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Task name..."
                  className="flex-1 bg-transparent border-b border-brand-border focus:outline-none focus:border-brand-accent text-brand-text text-sm pb-1"
                />
                <div className="flex items-center gap-2 border-b border-brand-border pb-1">
                  <span className="text-[10px] uppercase text-brand-soft">Cost:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={costInput}
                    onChange={e => setCostInput(parseInt(e.target.value) || 1)}
                    className="w-12 bg-transparent text-center text-brand-text focus:outline-none"
                  />
                  <span className="text-[10px] uppercase text-brand-soft">Bars</span>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="text-brand-accent uppercase tracking-widest text-[10px] hover:text-brand-text transition-colors disabled:opacity-30"
                >
                  Add
                </button>
              </form>

              {isOverdrawn && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8"
                >
                  <p className="text-red-400 text-sm text-center">
                    ⚠️ You do not have the energy for this list. You must move something to tomorrow.
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {tasks.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-4 border border-brand-border rounded-lg bg-brand-bg group"
                    >
                      <span className="text-brand-text text-sm">{task.text}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-brand-soft">-{task.cost} Bars</span>
                        <button 
                          onClick={() => removeTask(task.id)}
                          className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-accent transition-colors"
                        >
                          {isOverdrawn ? "Move to tomorrow" : "Remove"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                  <p className="text-center text-brand-soft text-xs py-8 border border-brand-border/50 border-dashed rounded-lg">
                    Add a task to see how it drains your battery.
                  </p>
                )}
              </div>
              
              <div className="mt-12 flex justify-end">
                <Link
                  href="/toolkit"
                  className="px-6 py-2 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors"
                >
                  Done Planning
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
