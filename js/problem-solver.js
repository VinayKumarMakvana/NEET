/**
 * NEET OS: AI Step-by-Step Problem Explainer & Personalized Daily DPP Generator
 * Deconstructs multi-concept NEET Advanced problems & automatically pulls weak chapters from Mistake Notebook
 */

const ProblemSolverEngine = {
  SAMPLE_PROBLEMS: [
    {
      id: "adv_phy_rolling",
      subject: "Physics",
      source: "NEET Advanced Benchmark (Pure Rolling)",
      title: "Solid sphere rolling up a rough inclined plane without slipping",
      problemText: "A uniform solid sphere of mass $M$ and radius $R$ is rolling without slipping up a rough inclined plane of inclination $\\theta$. Find the acceleration of the center of mass of the sphere and the magnitude and direction of the frictional force acting on it.",
      steps: [
        {
          stepNum: 1,
          title: "🎯 Identify Free Body Diagram & Forces",
          content: "Forces acting on the sphere: Gravity $Mg$ acting downwards (resolves into $Mg\\sin\\theta$ parallel down the incline and $Mg\\cos\\theta$ perpendicular into the incline), Normal force $N = Mg\\cos\\theta$, and Static Friction $f$ along the incline."
        },
        {
          stepNum: 2,
          title: "📐 Linear & Rotational Equations of Motion",
          content: "1. Linear Translation down the incline: $$Mg\\sin\\theta - f = Ma$$<br>2. Rotational Torque about center of mass: $$\\tau = f \\cdot R = I \\alpha$$ where for a solid sphere, $$I = \\frac{2}{5}MR^2$$.<br>3. Condition for pure rolling without slipping: $$a = R\\alpha \\implies \\alpha = \\frac{a}{R}$$."
        },
        {
          stepNum: 3,
          title: "⚡ Substitute & Solve for Acceleration",
          content: "$$f \\cdot R = \\left(\\frac{2}{5}MR^2\\right)\\left(\\frac{a}{R}\\right) \\implies f = \\frac{2}{5}Ma$$<br>Substitute $f$ into the linear equation:<br>$$Mg\\sin\\theta - \\frac{2}{5}Ma = Ma \\implies Mg\\sin\\theta = \\frac{7}{5}Ma \\implies a = \\frac{5}{7}g\\sin\\theta$$"
        },
        {
          stepNum: 4,
          title: "💡 Magnitude & Direction of Friction",
          content: "$$f = \\frac{2}{5}M\\left(\\frac{5}{7}g\\sin\\theta\\right) = \\frac{2}{7}Mg\\sin\\theta$$ acting <strong>UP the inclined plane</strong>."
        },
        {
          stepNum: 5,
          title: "⚠️ Trap & Key Insight to Remember",
          content: "Whether the sphere is rolling UP or DOWN the incline, static friction acts UPWARDS to provide the clockwise/counter-torque required to match the linear deceleration/acceleration!"
        }
      ]
    },
    {
      id: "neet_bio_genetics",
      subject: "Biology",
      source: "NEET Benchmark (Genetics)",
      title: "Dihybrid Cross Probability Calculation",
      problemText: "In a Mendelian dihybrid cross (AaBb × AaBb), what is the probability of obtaining an offspring with the genotype Aabb?",
      steps: [
        {
          stepNum: 1,
          title: "🎯 Understand the Mendelian Cross",
          content: "Since genes A and B assort independently (Mendel's Law of Independent Assortment), we can calculate the probabilities of each gene separately and multiply them."
        },
        {
          stepNum: 2,
          title: "📐 Break Down Gene A",
          content: "For the cross Aa × Aa, the possible offspring genotypes are AA, Aa, and aa.<br>The probability of getting 'Aa' is $$\\frac{1}{2}$$ (or 2/4)."
        },
        {
          stepNum: 3,
          title: "⚡ Break Down Gene B",
          content: "For the cross Bb × Bb, the possible offspring genotypes are BB, Bb, and bb.<br>The probability of getting 'bb' is $$\\frac{1}{4}$$."
        },
        {
          stepNum: 4,
          title: "💡 Multiply Probabilities",
          content: "Probability of Aabb = Probability of 'Aa' × Probability of 'bb'<br>$$P = \\frac{1}{2} \\times \\frac{1}{4} = \\frac{1}{8}$$."
        }
      ]
    }
  ],

  // Generate Personalized Daily 5-Question DPP from Mistake Notebook
  generateDailyDPP() {
    const mistakes = (window.appState && window.appState.mistakes) || [];
    const questionsData = (window.QuestionsData && window.QuestionsData.questions) || [];

    let targetQuestions = [];
    if (mistakes.length > 0) {
      const weakChapterIds = mistakes.map(m => m.chapterId || m.chapter);
      targetQuestions = questionsData.filter(q => weakChapterIds.includes(q.chapterId) || weakChapterIds.includes(q.subject));
    }

    if (targetQuestions.length < 5) {
      targetQuestions = questionsData.slice(0, 10);
    }

    // Shuffle and pick 5
    const shuffled = targetQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
    return shuffled;
  }
};

window.ProblemSolverEngine = ProblemSolverEngine;
