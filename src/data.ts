/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getLocalDateString } from './utils/date';

 export const MOTIVATIONAL_QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "Discipline is choosing between what you want now and what you want most. — Abraham Lincoln",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "The pain of discipline weighs ounces, the pain of regret weighs tons. — Jim Rohn",
  "A year from now you may wish you had started today. — Karen Lamb",
  "Small daily improvements are the key to staggering long-term results. — Robin Sharma",
  "Motivation is what gets you started. Habit is what keeps you going. — Jim Rohn",
  "The way to get started is to quit talking and begin doing. — Walt Disney",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work. — Stephen King",
  "You must do the things you think you cannot do. — Eleanor Roosevelt",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "Action is the foundational key to all success. — Pablo Picasso",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "The future depends on what you do today. — Mahatma Gandhi",
  "There is no substitute for hard work. — Thomas Edison",
  "Well done is better than well said. — Benjamin Franklin",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Fear kills more dreams than failure ever will. — Suzy Kassem",
  "Procrastination is the thief of time. — Edward Young",
  "The expert in anything was once a beginner. — Helen Hayes",
  "Wherever you are, be all there. — Jim Elliot",
  "Champions keep playing until they get it right. — Billie Jean King",
  "Setting goals is the first step in turning the invisible into the visible. — Tony Robbins",
  "Whether you think you can or you think you can't, you're right. — Henry Ford",
  "I never dreamed about success. I worked for it. — Estée Lauder",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Perseverance is not a long race; it is many short races one after another. — Walter Elliot",
  "You miss 100% of the shots you don't take. — Wayne Gretzky",
  "Hard work beats talent when talent doesn't work hard. — Tim Notke",
  "Do the hard jobs first. The easy jobs will take care of themselves. — Dale Carnegie",
  "Nothing will work unless you do. — Maya Angelou",
  "Energy and persistence conquer all things. — Benjamin Franklin",
  "Great things are done by a series of small things brought together. — Vincent Van Gogh",
  "Genius is one percent inspiration and ninety-nine percent perspiration. — Thomas Edison",
  "Vision without execution is just hallucination. — Thomas Edison",
  "The difference between ordinary and extraordinary is that little extra. — Jimmy Johnson",
  "You can't build a reputation on what you're going to do. — Henry Ford",
  "Success usually comes to those too busy to be looking for it. — Henry David Thoreau",
  "The only place where success comes before work is in the dictionary. — Vidal Sassoon",
  "Either you run the day, or the day runs you. — Jim Rohn",
  "Days are expensive. When you spend a day you have one less day to spend. So spend each one wisely. — Jim Rohn",
  "What you do today can improve all your tomorrows. — Ralph Marston",
  "Push yourself, because no one else is going to do it for you. — Anonymous",
  "The best time to plant a tree was 20 years ago. The second best time is now. — Chinese Proverb",
  "Not all storms come to disrupt your life, some come to clear your path. — Anonymous",
  "You don't need more time, you just need to decide. — Seth Godin",
  "Start where you are. Use what you have. Do what you can. — Arthur Ashe",
  "Dream big. Start small. But most of all, start. — Simon Sinek",
  "Don't count the days, make the days count. — Muhammad Ali",
  "Great works are performed not by strength but by perseverance. — Samuel Johnson",
  "Losing an hour in the morning can put the whole day behind. — Richard Cecil",
  "If you wait, all that happens is you get older. — Larry McMurtry",
  "The only limit to our realization of tomorrow is our doubts of today. — Franklin D. Roosevelt",
] 
   
  
];

export const PRESET_SUBJECTS: Record<string, { emoji: string; color: string }> = {
  "Physics":      { emoji: "⚛️",  color: "#FF8A65" },
  "Maths":        { emoji: "🧮",  color: "#4fc3f7" },
  "Chemistry":    { emoji: "🧪",  color: "#ba68c8" },
  "Biology":      { emoji: "🧬",  color: "#81c784" },
  "Computer Sci": { emoji: "💻",  color: "#f06292" },
  "Electronics":  { emoji: "🔌",  color: "#4dd0e1" },
  "AI / ML":      { emoji: "🤖",  color: "#64b5f6" },
  "Robotics":     { emoji: "🦾",  color: "#90a4ae" },
  "Web Dev":      { emoji: "🌐",  color: "#4db6ac" },
  "Programming":  { emoji: "⌨️",  color: "#9575cd" },
  "Accountancy":  { emoji: "📚",  color: "#26a69a" },
  "Business Stud.": { emoji: "💼",  color: "#ab47bc" },
  "Statistics":   { emoji: "📊",  color: "#29b6f6" }
};

export const PALETTE = [
  "#FF8A65", "#4fc3f7", "#ba68c8", "#81c784", "#ffd54f",
  "#ffb74d", "#4dd0e1", "#f06292", "#4db6ac", "#e57373",
  "#64b5f6", "#a1887f", "#9575cd", "#90a4ae", "#d4e157",
  "#ef5350", "#ec407a", "#ab47bc", "#7e57c2", "#5c6bc0",
  "#42a5f5", "#26a69a", "#66bb6a", "#9ccc65", "#c0ca33",
  "#fdd835", "#ffa726", "#8d6e63", "#78909c", "#546e7a"
];

export const DEFAULT_DATA = {
  subjects: {},
  classes_per_day: 4,
  skip_sunday: true,
  course_name: "My Backlog Tracker",
  last_updated: getLocalDateString(),
  setup_done: false,
  theme: "dark" as const,
  auto_growth_enabled: true
};
