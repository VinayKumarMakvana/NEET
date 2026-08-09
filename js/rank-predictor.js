/**
 * JEE OS: Advanced Marks vs Percentile, AIR Predictor & College Cutoff Engine
 * Realistic calibration based on NTA JEE Main and IIT JEE Advanced cutoff metrics
 */

const RankPredictor = {
  predictMain(marks) {
    const m = Math.max(0, Math.min(300, Number(marks) || 0));
    let percentile = 0;
    let predictedRank = 0;

    if (m >= 280) { percentile = 99.98; predictedRank = Math.round(150 - (m - 280) * 6); }
    else if (m >= 250) { percentile = 99.85; predictedRank = Math.round(1500 - (m - 250) * 45); }
    else if (m >= 220) { percentile = 99.40; predictedRank = Math.round(6000 - (m - 220) * 150); }
    else if (m >= 190) { percentile = 98.80; predictedRank = Math.round(13000 - (m - 190) * 230); }
    else if (m >= 160) { percentile = 97.50; predictedRank = Math.round(26000 - (m - 160) * 430); }
    else if (m >= 130) { percentile = 95.00; predictedRank = Math.round(52000 - (m - 130) * 850); }
    else if (m >= 100) { percentile = 90.00; predictedRank = Math.round(110000 - (m - 100) * 1900); }
    else if (m >= 70) { percentile = 80.00; predictedRank = Math.round(220000 - (m - 70) * 3600); }
    else { percentile = Math.max(10, (m * 1.14)).toFixed(2); predictedRank = Math.round(350000 - m * 1500); }

    predictedRank = Math.max(1, predictedRank);

    return {
      marks: m,
      percentile: typeof percentile === 'number' ? percentile.toFixed(2) : percentile,
      predictedRank,
      qualifyForAdvanced: m >= 85,
      colleges: this.getEligibleColleges(predictedRank, 'main')
    };
  },

  predictAdvanced(marks) {
    const m = Math.max(0, Math.min(360, Number(marks) || 0));
    let predictedRank = 0;

    if (m >= 280) predictedRank = Math.round(50 - (m - 280) * 0.5);
    else if (m >= 240) predictedRank = Math.round(250 - (m - 240) * 5);
    else if (m >= 200) predictedRank = Math.round(800 - (m - 200) * 13);
    else if (m >= 160) predictedRank = Math.round(2500 - (m - 160) * 42);
    else if (m >= 120) predictedRank = Math.round(6500 - (m - 120) * 100);
    else if (m >= 90) predictedRank = Math.round(14000 - (m - 90) * 250);
    else predictedRank = Math.round(25000 - m * 100);

    predictedRank = Math.max(1, predictedRank);

    return {
      marks: m,
      predictedRank,
      qualifyForIIT: m >= 85,
      colleges: this.getEligibleColleges(predictedRank, 'advanced')
    };
  },

  getEligibleColleges(rank, tier) {
    if (tier === 'advanced') {
      const iits = [
        { name: 'IIT Bombay — Computer Science & Engg', minRank: 65, tag: 'Dream Elite' },
        { name: 'IIT Delhi — Electrical Engineering', minRank: 450, tag: 'Top Tier' },
        { name: 'IIT Madras — Mechanical Engineering', minRank: 1800, tag: 'Premier IIT' },
        { name: 'IIT Kanpur — Aerospace Engineering', minRank: 3200, tag: 'Premier IIT' },
        { name: 'IIT Kharagpur — Electronics & Comm', minRank: 1200, tag: 'Premier IIT' },
        { name: 'IIT Roorkee — Data Science & AI', minRank: 2200, tag: 'High Chance' },
        { name: 'IIT Guwahati — Civil Engineering', minRank: 7500, tag: 'Safe Seat' },
        { name: 'IIT Hyderabad — Artificial Intelligence', minRank: 950, tag: 'Top Tier' },
        { name: 'IIT BHU Varanasi — Chemical Engineering', minRank: 9200, tag: 'Safe Seat' }
      ];
      return iits.filter(c => rank <= c.minRank * 1.35);
    } else {
      const nits = [
        { name: 'IIIT Hyderabad — Computer Science (CSE)', minRank: 1200, tag: 'Elite Coding Hub' },
        { name: 'NIT Trichy — Computer Science & Engg', minRank: 2500, tag: 'Top NIT' },
        { name: 'NIT Surathkal (Karnataka) — Information Tech', minRank: 4200, tag: 'Top NIT' },
        { name: 'NIT Warangal — Electronics & Comm', minRank: 6500, tag: 'Premier NIT' },
        { name: 'MNNIT Allahabad — CSE / Software', minRank: 8500, tag: 'High Placement' },
        { name: 'NIT Rourkela — Mechanical Engineering', minRank: 18000, tag: 'Safe NIT' },
        { name: 'NIT Calicut — Electrical & Electronics', minRank: 16000, tag: 'High Chance' },
        { name: 'IIIT Allahabad — IT / Business Informatics', minRank: 5500, tag: 'Top Tier' }
      ];
      return nits.filter(c => rank <= c.minRank * 1.35);
    }
  }
};
