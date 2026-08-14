/**
 * NEET OS: Advanced Marks vs Percentile, AIR Predictor & College Cutoff Engine
 * Realistic calibration based on NTA NEET Core and AIIMS AIIMS AIQ cutoff metrics
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

  predictAIIMS(marks) {
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
      qualifyForAIIMS: m >= 85,
      colleges: this.getEligibleColleges(predictedRank, 'advanced')
    };
  },

  getEligibleColleges(rank, tier) {
    if (tier === 'advanced') {
      const aiims = [
        { name: 'AIIMS New Delhi — MBBS', minRank: 55, tag: 'Dream Elite' },
        { name: 'JIPMER Puducherry — MBBS', minRank: 277, tag: 'Top Tier' },
        { name: 'CMC Vellore — MBBS', minRank: 400, tag: 'Premier Medical' },
        { name: 'MAMC New Delhi — MBBS', minRank: 90, tag: 'Premier Medical' },
        { name: 'VMMC & Safdarjung Hospital — MBBS', minRank: 130, tag: 'Top Tier' },
        { name: 'AIIMS Bhubaneswar — MBBS', minRank: 560, tag: 'High Chance' },
        { name: 'AIIMS Jodhpur — MBBS', minRank: 600, tag: 'Safe Seat' },
        { name: 'KGMU Lucknow — MBBS', minRank: 1200, tag: 'Top Tier' },
        { name: 'AFMC Pune — MBBS', minRank: 1800, tag: 'Safe Seat' }
      ];
      return aiims.filter(c => rank <= c.minRank * 1.35);
    } else {
      const gmcs = [
        { name: 'State Top Govt Medical College (GMC) — MBBS', minRank: 5000, tag: 'Elite State Hub' },
        { name: 'Seth GS Medical College Mumbai — MBBS', minRank: 900, tag: 'Top GMC' },
        { name: 'AIIMS Patna — MBBS', minRank: 1900, tag: 'Top GMC' },
        { name: 'BJ Medical College Ahmedabad — MBBS', minRank: 1200, tag: 'Premier GMC' },
        { name: 'Madras Medical College — MBBS', minRank: 1500, tag: 'High Placement' },
        { name: 'Stanley Medical College — MBBS', minRank: 3500, tag: 'Safe GMC' },
        { name: 'Bangalore Medical College — MBBS', minRank: 2200, tag: 'High Chance' },
        { name: 'SMS Medical College Jaipur — MBBS', minRank: 1800, tag: 'Top Tier' }
      ];
      return gmcs.filter(c => rank <= c.minRank * 1.35);
    }
  }
};
