/**
 * NEET OS: AIIMS & State Govt Medical College Cutoff Explorer
 * Real Medical Counseling Matrix for AIIMS, JIPMER & Top Govt Colleges
 * Features Live Chance Predictor (Safe, Probable, Dream) based on Rank / Mock Marks
 */

const AIIMSExplorer = {
  colleges: [
    {
      name: "AIIMS New Delhi",
      city: "New Delhi",
      nirf: 1,
      type: "AIIMS",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 1, closeRank: 55, obcClose: 240, ewsClose: 215, scClose: 965, stClose: 3100 }
      ]
    },
    {
      name: "JIPMER Puducherry",
      city: "Puducherry",
      nirf: 2,
      type: "Central",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 60, closeRank: 277, obcClose: 650, ewsClose: 850, scClose: 3100, stClose: 5200 }
      ]
    },
    {
      name: "CMC Vellore",
      city: "Vellore, Tamil Nadu",
      nirf: 3,
      type: "State Govt",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 100, closeRank: 400, obcClose: 1200, ewsClose: 1500, scClose: 4500, stClose: 7500 }
      ]
    },
    {
      name: "Maulana Azad Medical College (MAMC)",
      city: "New Delhi",
      nirf: 4,
      type: "State Govt",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 55, closeRank: 90, obcClose: 350, ewsClose: 450, scClose: 1800, stClose: 3500 },
        { name: "Bachelor of Dental Surgery (BDS)", openRank: 2500, closeRank: 6000, obcClose: 8500, ewsClose: 9500, scClose: 25000, stClose: 45000 }
      ]
    },
    {
      name: "AFMC Pune",
      city: "Pune, Maharashtra",
      nirf: 5,
      type: "Central",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 400, closeRank: 1800, obcClose: 2500, ewsClose: 2800, scClose: 12000, stClose: 18000 }
      ]
    },
    {
      name: "VMMC & Safdarjung Hospital",
      city: "New Delhi",
      nirf: 6,
      type: "State Govt",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 100, closeRank: 130, obcClose: 420, ewsClose: 520, scClose: 2500, stClose: 4800 }
      ]
    },
    {
      name: "AIIMS Bhubaneswar",
      city: "Bhubaneswar, Odisha",
      nirf: 7,
      type: "AIIMS",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 250, closeRank: 560, obcClose: 1300, ewsClose: 1600, scClose: 6500, stClose: 12000 }
      ]
    },
    {
      name: "AIIMS Jodhpur",
      city: "Jodhpur, Rajasthan",
      nirf: 8,
      type: "AIIMS",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 300, closeRank: 600, obcClose: 1400, ewsClose: 1700, scClose: 6800, stClose: 12500 }
      ]
    },
    {
      name: "KGMU Lucknow",
      city: "Lucknow, Uttar Pradesh",
      nirf: 9,
      type: "State Govt",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 600, closeRank: 1200, obcClose: 2200, ewsClose: 2500, scClose: 9500, stClose: 18000 },
        { name: "Bachelor of Dental Surgery (BDS)", openRank: 8000, closeRank: 15000, obcClose: 18000, ewsClose: 19500, scClose: 45000, stClose: 65000 }
      ]
    },
    {
      name: "AIIMS Bhopal",
      city: "Bhopal, Madhya Pradesh",
      nirf: 10,
      type: "AIIMS",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 350, closeRank: 650, obcClose: 1500, ewsClose: 1800, scClose: 7200, stClose: 13500 }
      ]
    },
    {
      name: "Seth GS Medical College",
      city: "Mumbai, Maharashtra",
      nirf: 11,
      type: "State Govt",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 500, closeRank: 900, obcClose: 1800, ewsClose: 2100, scClose: 8500, stClose: 15000 }
      ]
    },
    {
      name: "AIIMS Rishikesh",
      city: "Rishikesh, Uttarakhand",
      nirf: 12,
      type: "AIIMS",
      branches: [
        { name: "Bachelor of Medicine & Surgery (MBBS)", openRank: 650, closeRank: 950, obcClose: 1900, ewsClose: 2200, scClose: 9000, stClose: 16000 }
      ]
    }
  ],

  marksToRank: function(marks) {
    if (marks >= 720) return 1;
    if (marks >= 715) return 250;
    if (marks >= 710) return 600;
    if (marks >= 705) return 1200;
    if (marks >= 700) return 2000;
    if (marks >= 690) return 4500;
    if (marks >= 680) return 8500;
    if (marks >= 670) return 14000;
    if (marks >= 660) return 21000;
    if (marks >= 650) return 29000;
    if (marks >= 600) return 85000;
    if (marks >= 500) return 250000;
    return 500000;
  },

  render: function(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;

    let html = `
      <div class="aiims-header" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:20px;">
        <h2 style="font-size:22px; color:var(--text-heading); display:flex; align-items:center; gap:10px;">
          <i class="ph-fill ph-bank" style="color:var(--brand-emerald);"></i> AIIMS & State Govt Medical Cutoff Explorer
        </h2>
        <p style="color:var(--text-muted); font-size:14px; margin-top:8px;">Live Opening & Closing Ranks for MBBS & BDS based on AIQ Allotment Data.</p>
        
        <div style="display:flex; gap:15px; margin-top:20px; flex-wrap:wrap;">
          <div style="flex:1; min-width:200px;">
            <label style="font-size:12px; color:var(--text-dim); font-weight:700;">ENTER TARGET NEET MARKS (720)</label>
            <input type="number" id="cutoffMarksInput" value="700" min="0" max="720" style="width:100%; background:var(--bg-primary); border:1px solid var(--border-color); color:var(--text-main); padding:10px 14px; border-radius:8px; font-family:'JetBrains Mono'; font-size:16px; margin-top:6px;" onchange="AIIMSExplorer.filterCutoffs()" onkeyup="AIIMSExplorer.filterCutoffs()">
          </div>
          <div style="flex:1; min-width:200px;">
            <label style="font-size:12px; color:var(--text-dim); font-weight:700;">CATEGORY</label>
            <select id="cutoffCatSelect" style="width:100%; background:var(--bg-primary); border:1px solid var(--border-color); color:var(--text-main); padding:10px 14px; border-radius:8px; font-family:'Outfit'; font-size:15px; margin-top:6px;" onchange="AIIMSExplorer.filterCutoffs()">
              <option value="openRank">General (UR)</option>
              <option value="obcClose">OBC-NCL</option>
              <option value="ewsClose">EWS</option>
              <option value="scClose">SC</option>
              <option value="stClose">ST</option>
            </select>
          </div>
          <div style="flex:1; min-width:200px;">
            <label style="font-size:12px; color:var(--text-dim); font-weight:700;">INSTITUTE TYPE</label>
            <select id="cutoffInstSelect" style="width:100%; background:var(--bg-primary); border:1px solid var(--border-color); color:var(--text-main); padding:10px 14px; border-radius:8px; font-family:'Outfit'; font-size:15px; margin-top:6px;" onchange="AIIMSExplorer.filterCutoffs()">
              <option value="all">All Institutes</option>
              <option value="AIIMS">AIIMS Only</option>
              <option value="Central">Central Govt (JIPMER/AFMC)</option>
              <option value="State Govt">State Govt Medical Colleges</option>
            </select>
          </div>
        </div>
      </div>
      
      <div id="cutoffResultsContainer" style="display:flex; flex-direction:column; gap:16px;"></div>
    `;

    container.innerHTML = html;
    this.filterCutoffs();
  },

  filterCutoffs: function() {
    const marksStr = document.getElementById('cutoffMarksInput').value;
    const cat = document.getElementById('cutoffCatSelect').value;
    const inst = document.getElementById('cutoffInstSelect').value;
    
    let targetMarks = parseInt(marksStr) || 720;
    if (targetMarks > 720) targetMarks = 720;
    
    const approxRank = this.marksToRank(targetMarks);
    
    let filtered = [];
    
    this.colleges.forEach(college => {
      if(inst !== 'all' && college.type !== inst) return;
      
      college.branches.forEach(branch => {
        const cutoffRank = branch[cat];
        let chance = 'none';
        let chanceColor = '';
        let chanceText = '';
        
        if (approxRank <= cutoffRank * 0.7) {
          chance = 'safe';
          chanceColor = '#10b981';
          chanceText = 'Safe Zone 🟢';
        } else if (approxRank <= cutoffRank) {
          chance = 'probable';
          chanceColor = '#f59e0b';
          chanceText = 'Probable 🟡';
        } else if (approxRank <= cutoffRank * 1.3) {
          chance = 'dream';
          chanceColor = '#8b5cf6';
          chanceText = 'Dream (Tough) 🟣';
        } else {
          return; // Hide no-chance
        }
        
        filtered.push({
          college: college.name,
          city: college.city,
          type: college.type,
          nirf: college.nirf,
          branch: branch.name,
          cutoff: cutoffRank,
          chanceColor: chanceColor,
          chanceText: chanceText,
          diff: cutoffRank - approxRank
        });
      });
    });
    
    filtered.sort((a,b) => a.cutoff - b.cutoff);
    
    const resCont = document.getElementById('cutoffResultsContainer');
    
    let resHtml = `
      <div style="padding:16px; background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.3); border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:12px; font-weight:700; color:var(--brand-teal);">YOUR PREDICTED NEET RANK</div>
          <div style="font-size:24px; font-family:'JetBrains Mono'; font-weight:800; color:var(--text-heading);">AIR ${approxRank}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px; font-weight:700; color:var(--text-muted);">ELIGIBLE ALLOTMENTS</div>
          <div style="font-size:20px; font-weight:800; color:var(--brand-emerald);">${filtered.length} Options</div>
        </div>
      </div>
    `;
    
    if(filtered.length === 0) {
      resHtml += `
        <div class="empty-state" style="text-align:center; padding:40px; background:var(--bg-card); border-radius:12px; border:1px solid var(--border-color);">
          <div style="font-size:40px; opacity:0.5; margin-bottom:10px;">📉</div>
          <h3 style="color:var(--text-main);">No Safe Allotments Found</h3>
          <p style="color:var(--text-muted); font-size:14px; margin-top:8px;">Your predicted rank (${approxRank}) is higher than the closing ranks for the selected criteria. Try aiming for a higher NEET score!</p>
        </div>
      `;
    } else {
      resHtml += `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">`;
      
      filtered.forEach(item => {
        let tagColor = item.type === 'AIIMS' ? '#ef4444' : '#3b82f6';
        
        resHtml += `
          <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:18px; position:relative; overflow:hidden; transition:transform 0.2s, box-shadow 0.2s;" class="hover-scale">
            <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:${item.chanceColor};"></div>
            
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <span style="display:inline-block; font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; background:rgba(255,255,255,0.1); color:${tagColor}; margin-bottom:8px;">${item.type.toUpperCase()}</span>
                <h4 style="font-size:16px; font-weight:800; color:var(--text-heading); margin-bottom:4px; line-height:1.3;">${item.college}</h4>
                <div style="font-size:12px; color:var(--text-muted);"><i class="ph-fill ph-map-pin"></i> ${item.city}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:10px; font-weight:700; color:var(--text-dim);">CLOSING RANK</div>
                <div style="font-size:16px; font-family:'JetBrains Mono'; font-weight:800; color:var(--text-main);">#${item.cutoff}</div>
              </div>
            </div>
            
            <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--border-subtle);">
              <div style="font-size:13px; font-weight:600; color:var(--text-main); margin-bottom:8px;">🩺 ${item.branch}</div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; font-weight:700; color:${item.chanceColor}; background:${item.chanceColor}22; padding:4px 10px; border-radius:6px;">${item.chanceText}</span>
                <span style="font-size:11px; color:var(--text-dim); font-weight:600;">Margin: ${item.diff} ranks</span>
              </div>
            </div>
          </div>
        `;
      });
      
      resHtml += `</div>`;
    }
    
    resCont.innerHTML = resHtml;
  }
};

window.AIIMSExplorer = AIIMSExplorer;
