/**
 * NEET OS: Audio Revision & Formula Podcast Player (Web Speech API)
 * Hands-free audio revision for Botany, Zoology, Physics & Chemistry
 */

const AudioPodcastEngine = {
  currentUtterance: null,
  isPlaying: false,
  currentTrack: null,
  playbackSpeed: 1.0,

  EPISODES: [
    {
      id: "ep_inorganic_trends",
      title: "Inorganic Chemistry: Periodic Trends & Coordination Color Rules",
      hindi: "अकार्बनिक रसायन: आवर्त सारणी के नियम एवं उपसहसंयोजन रंग",
      subject: "Chemistry",
      duration: "4 mins",
      icon: "🧪",
      audioScript: "Welcome to NEET OS Inorganic Chemistry Audio Flash. Let us review the key periodic trends. First, Ionization Enthalpy generally increases across a period and decreases down a group. Remember the key exception: Beryllium has higher ionization enthalpy than Boron due to fully filled 2s orbital. Similarly, Nitrogen has higher ionization enthalpy than Oxygen due to half-filled stable 2p orbital. In Coordination Compounds, Crystal Field Splitting depends on the spectrochemical series. Strong field ligands like Carbon Monoxide and Cyanide cause large splitting and pair up electrons, forming low spin diamagnetic complexes. Transition metal complexes are colored due to d to d electronic transitions.",
      keyPoints: [
        "Ionization Exception: Be > B and N > O",
        "Spectrochemical Series: I⁻ < Br⁻ < S²⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ < CO",
        "Color in coordination complexes is caused by d-d electronic transition."
      ]
    },
    {
      id: "ep_physics_mechanics_laws",
      title: "Physics: Rotational Dynamics & Kepler's Gravitational Laws",
      hindi: "भौतिकी: घूर्णन गति एवं केपलर के गुरुत्वाकर्षण नियम",
      subject: "Physics",
      duration: "3.5 mins",
      icon: "⚛️",
      audioScript: "Welcome to Physics Super Recall. In rotational motion, torque equals the rate of change of angular momentum. When net external torque on a system is zero, total angular momentum is strictly conserved. In pure rolling on a flat surface, the point of contact has zero instantaneous velocity. In gravitation, Kepler's second law states that the areal velocity of a planet remains constant, which is a direct consequence of conservation of angular momentum. Escape velocity from Earth surface is approximately 11.2 kilometers per second, which equals square root of 2 times the orbital velocity.",
      keyPoints: [
        "Conservation of Angular Momentum when net external torque = 0.",
        "Areal velocity is constant due to central gravitational force.",
        "Escape velocity = sqrt(2 * G * M / R) ≈ 11.2 km/s."
      ]
    },
    {
      id: "ep_bio_genetics",
      title: "Biology: Molecular Basis of Inheritance & Operon Concept",
      hindi: "जीव विज्ञान: वंशागति का आणविक आधार एवं ओपेरॉन संकल्पना",
      subject: "Biology",
      duration: "4 mins",
      icon: "🧬",
      audioScript: "Welcome to Biology Molecular Genetics Recall. According to Chargaff's rule in double stranded DNA, the ratio of Adenine to Thymine and Guanine to Cytosine is constant and equals one. The DNA double helix has a pitch of 3.4 nanometers with 10 base pairs in each turn. In transcription, RNA polymerase binds to the promoter region. For regulation of gene expression, the Lac Operon is an inducible system. In the absence of lactose, the repressor binds to the operator, preventing transcription. When lactose, the inducer, is present, it binds the repressor, allowing RNA polymerase to transcribe the Z, Y, and A genes.",
      keyPoints: [
        "Chargaff's Rule: A=T and G=C in double-stranded DNA",
        "DNA Pitch: 3.4 nm (34 Å) with distance between bp = 0.34 nm",
        "Lac Operon: Inducible operon, Lactose acts as the inducer."
      ]
    }
  ],

  playEpisode(episodeId) {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    const episode = this.EPISODES.find(e => e.id === episodeId);
    if (!episode) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    this.currentTrack = episode;
    this.currentUtterance = new SpeechSynthesisUtterance(episode.audioScript);
    this.currentUtterance.rate = this.playbackSpeed;
    this.currentUtterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('India')));
    if (englishVoice) {
      this.currentUtterance.voice = englishVoice;
    }

    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      this.updatePlayerUI();
    };

    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.updatePlayerUI();
    };

    this.currentUtterance.onerror = () => {
      this.isPlaying = false;
      this.updatePlayerUI();
    };

    window.speechSynthesis.speak(this.currentUtterance);
  },

  pauseOrResume() {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      this.isPlaying = false;
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPlaying = true;
    }
    this.updatePlayerUI();
  },

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.updatePlayerUI();
  },

  changeSpeed(speed) {
    this.playbackSpeed = speed;
    if (this.isPlaying && this.currentTrack) {
      const remainingText = "Speed changed."; 
      // SpeechSynthesis API doesn't allow live speed change easily, we just restart or let it be for next play
    }
    document.getElementById('podcastSpeedBtn').textContent = `${speed}x`;
  },

  updatePlayerUI() {
    const playBtn = document.getElementById('podcastPlayBtn');
    if (playBtn) {
      playBtn.innerHTML = this.isPlaying ? '<i class="ph-fill ph-pause"></i>' : '<i class="ph-fill ph-play"></i>';
    }
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="podcast-header" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="font-size:22px; color:var(--text-heading); display:flex; align-items:center; gap:10px;">
            <i class="ph-fill ph-headphones" style="color:var(--brand-emerald);"></i> NEET Audio Flash Podcasts
          </h2>
          <p style="color:var(--text-muted); font-size:14px; margin-top:8px;">Hands-free passive revision for Physics concepts & Biology processes.</p>
        </div>
        <div style="text-align:right;">
          <button id="podcastSpeedBtn" onclick="AudioPodcastEngine.changeSpeed(AudioPodcastEngine.playbackSpeed === 1.0 ? 1.5 : (AudioPodcastEngine.playbackSpeed === 1.5 ? 2.0 : 1.0))" class="btn ghost btn-sm">1x</button>
        </div>
      </div>
      
      <div style="display:flex; flex-direction:column; gap:16px;">
    `;

    this.EPISODES.forEach(ep => {
      let subColor = 'var(--brand-cyan)';
      if(ep.subject === 'Chemistry') subColor = 'var(--brand-rose)';
      if(ep.subject === 'Biology') subColor = 'var(--brand-emerald)';

      html += `
        <div class="podcast-card" style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; gap:16px; align-items:center; transition:0.2s;">
          <button onclick="AudioPodcastEngine.playEpisode('${ep.id}')" style="background:${subColor}22; color:${subColor}; width:50px; height:50px; border-radius:50%; border:none; font-size:20px; cursor:pointer; display:flex; justify-content:center; align-items:center; flex-shrink:0;" class="hover-scale">
            <i class="ph-fill ph-play"></i>
          </button>
          <div style="flex:1;">
            <span style="font-size:10px; font-weight:800; color:${subColor}; background:rgba(255,255,255,0.05); padding:2px 8px; border-radius:4px; margin-bottom:4px; display:inline-block;">${ep.subject.toUpperCase()}</span>
            <h4 style="font-size:15px; font-weight:700; color:var(--text-heading); margin-bottom:2px;">${ep.title}</h4>
            <div style="font-size:12px; color:var(--text-muted); font-family:'Noto Sans Devanagari';">${ep.hindi}</div>
            
            <div style="margin-top:10px; font-size:12px; color:var(--text-dim); display:flex; flex-direction:column; gap:4px;">
              ${ep.keyPoints.map(k => `<div><i class="ph-bold ph-check" style="color:${subColor};"></i> ${k}</div>`).join('')}
            </div>
          </div>
          <div style="text-align:right; font-size:12px; color:var(--text-dim); font-weight:600;">
            <i class="ph-fill ph-clock"></i> ${ep.duration}
          </div>
        </div>
      `;
    });

    html += `
      </div>
      
      <!-- Sticky Player Controls -->
      <div style="position:sticky; bottom:20px; background:var(--glass-bg); backdrop-filter:blur(16px); border:1px solid var(--border-color); border-radius:12px; padding:16px 20px; margin-top:30px; display:flex; justify-content:space-between; align-items:center; box-shadow:var(--shadow-lg);">
        <div style="display:flex; align-items:center; gap:12px;">
          <div id="activeTrackIcon" style="font-size:24px;">📻</div>
          <div>
            <div id="activeTrackTitle" style="font-size:14px; font-weight:700; color:var(--text-heading);">Not Playing</div>
            <div style="font-size:11px; color:var(--text-muted);">Select a track to begin audio revision</div>
          </div>
        </div>
        <div style="display:flex; gap:12px;">
          <button id="podcastPlayBtn" onclick="AudioPodcastEngine.pauseOrResume()" class="btn primary" style="width:44px; height:44px; border-radius:50%; padding:0; display:flex; justify-content:center; align-items:center; font-size:20px;">
            <i class="ph-fill ph-play"></i>
          </button>
          <button onclick="AudioPodcastEngine.stop()" class="btn ghost" style="width:44px; height:44px; border-radius:50%; padding:0; display:flex; justify-content:center; align-items:center; font-size:20px; color:#ef4444;">
            <i class="ph-fill ph-stop"></i>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
};

window.AudioPodcastEngine = AudioPodcastEngine;
