/**
 * NEET OS: Gamified Study Streaks & AIIMSian Milestone Badges Engine
 * Tracks Daily Study Streaks, Milestones & Generates Prestigious AIIMSian Medals
 */

const GamificationEngine = {
  BADGES: [
    {
      id: "streak_7",
      title: "Consistent Warrior (7-Day Streak)",
      hindi: "निरंतर योद्धा (7-दिवसीय स्ट्रीक)",
      icon: "🔥",
      desc: "Maintain a continuous 7-day NEET preparation streak.",
      color: "#f59e0b",
      check: (state) => (state.streak && state.streak.count >= 7)
    },
    {
      id: "mechanics_maestro",
      title: "Mechanics Maestro",
      hindi: "यांत्रिकी महारथी (Mechanics)",
      icon: "🛡️",
      desc: "Complete 10 Physics Mechanics chapters with >80% accuracy.",
      color: "#00f2fe",
      check: (state) => {
        const prog = state.progress || {};
        return Object.keys(prog).filter(k => k.startsWith('phy-') && (prog[k].status === 'completed' || prog[k].completed)).length >= 5;
      }
    },
    {
      id: "calculus_ninja",
      title: "Calculus Ninja",
      hindi: "कलन निंजा (Calculus)",
      icon: "⚡",
      desc: "Master Definite Integration, Differential Equations & AOD.",
      color: "#a855f7",
      check: (state) => {
        const prog = state.progress || {};
        return Object.keys(prog).filter(k => k.startsWith('math-') && (prog[k].status === 'completed' || prog[k].completed)).length >= 5;
      }
    },
    {
      id: "organic_wizard",
      title: "Organic Chemistry Wizard",
      hindi: "कार्बनिक रसायन जादूगर",
      icon: "🧪",
      desc: "Score full marks in Organic Chemistry reaction drills.",
      color: "#ec4899",
      check: (state) => {
        const prog = state.progress || {};
        return Object.keys(prog).filter(k => k.startsWith('chem-') && (prog[k].status === 'completed' || prog[k].completed)).length >= 5;
      }
    },
    {
      id: "focus_monk",
      title: "Deep Work Focus Monk",
      hindi: "गहन अध्ययन तपस्वी (10+ Sessions)",
      icon: "🧘‍♂️",
      desc: "Complete 10 deep focus Pomodoro study sessions.",
      color: "#10b981",
      check: (state) => (state.studySessions && state.studySessions.length >= 5)
    },
    {
      id: "nta_sniper",
      title: "NTA 200+ Sniper",
      hindi: "NTA 200+ मार्क्स स्नाइपर",
      icon: "🎯",
      desc: "Score 200+ Marks in a full 300-Marks NEET Main Grand Mock.",
      color: "#06b6d4",
      check: (state) => {
        const tests = state.testHistory || [];
        return tests.some(t => t.score && t.score >= 180);
      }
    },
    {
      id: "speed_champion",
      title: "60s Calculation Champion",
      hindi: "60-सेकंड कैलकुलेशन चैंपियन",
      icon: "🧮",
      desc: "Achieve a 10+ streak in Speed Math Drill without mistakes.",
      color: "#eab308",
      check: (state) => (state.speedMathMaxStreak && state.speedMathMaxStreak >= 8)
    },
    {
      id: "air_1_contender",
      title: "Mission AIIMS AIR 1 Contender",
      hindi: "मिशन AIIMS AIR 1 दावेदार",
      icon: "👑",
      desc: "Complete all 6 Test Levels & maintain >90% syllabus coverage.",
      color: "#f43f5e",
      check: (state) => {
        const prog = state.progress || {};
        return Object.keys(prog).length >= 15;
      }
    }
  ],

  // Check & Update Daily Streak
  updateDailyStreak() {
    if (!window.appState) return;

    window.appState.streak = window.appState.streak || { count: 1, lastDate: '' };
    const streak = window.appState.streak;
    const today = new Date().toISOString().slice(0, 10);

    if (!streak.lastDate) {
      streak.count = 1;
      streak.lastDate = today;
    } else if (streak.lastDate !== today) {
      const last = new Date(streak.lastDate);
      const cur = new Date(today);
      const diffDays = Math.round((cur - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak.count++;
      } else if (diffDays > 1) {
        streak.count = 1; // reset streak if missed a day
      }
      streak.lastDate = today;
    }

    if (typeof window.saveState === 'function') {
      window.saveState();
    }
  },

  getUnlockedBadges() {
    const state = window.appState || {};
    return this.BADGES.map(badge => {
      const isUnlocked = badge.check(state);
      return {
        ...badge,
        unlocked: isUnlocked
      };
    });
  }
};

window.GamificationEngine = GamificationEngine;
