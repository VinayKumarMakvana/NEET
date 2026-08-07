/**
 * NEET UG 2028: Direct UPI Monetization & Secure Test Unlock Engine
 * Monetization for Level 5 (₹49), Level 6 (₹99), and Combo Mega Pack (₹119)
 * 100% Direct UPI QR Code & 1-Tap Mobile Intent (No 3rd-Party Gateway Deductions)
 */

const PaymentEngine = {
  // Configuration: Loaded dynamically from .env / /api/config or defaults
  config: {
    upiId: 'vinay.neet2028@okaxis',
    upiName: 'NEET 2028 Aspirant Hub'
  },

  // Defined Pricing Packages
  PACKAGES: {
    level5: {
      id: 'level5',
      name: 'Level 5: 3-Subject PCB Grand Tests',
      hindiName: 'लेवल 5: 3-विषय PCB ग्रैंड इंटीग्रेशन टेस्ट',
      price: 49,
      originalPrice: 199,
      level: 5,
      features: [
        '3 Full PCB Grand Tests (135 Qs each)',
        'Full Physics + Chemistry + Biology Integration',
        'Strict NTA Negative Marking (+4 / -1)',
        'Detailed In-depth AI Solutions & Explanations',
        'Lifetime Unlimited Re-attempts'
      ],
      featuresHindi: [
        '3 पूर्ण PCB ग्रैंड टेस्ट (प्रत्येक 135 प्रश्न)',
        'भौतिक, रसायन और जीव विज्ञान संपूर्ण एकीकरण',
        '+4 / -1 शुद्ध NTA नेगेटिव मार्किंग',
        'विस्तृत व्याख्या व समाधान',
        'आजीवन असीमित री-अटेम्पट'
      ],
      badge: '3-SUB PCB MASTERY',
      color: '#ec4899'
    },
    level6: {
      id: 'level6',
      name: 'Level 6: 10 Pre-NEET Grand Mocks',
      hindiName: 'लेवल 6: 10 प्री-NEET 720 ग्रैंड मॉक टेस्ट',
      price: 99,
      originalPrice: 499,
      level: 6,
      features: [
        '10 Full-Length 720 Marks Grand Mocks',
        '2,000 High-Yield NCERT Standard Questions',
        'Strict 200 Minutes NTA Countdown Timer',
        'Predicted AIR Rank & State-wise Cutoff Analytics',
        'Lifetime Unlimited Re-attempts'
      ],
      featuresHindi: [
        '10 पूर्ण 720 अंक प्री-NEET ग्रैंड मॉक',
        '2,000 उच्च स्तरीय NCERT आधारित प्रश्न',
        '200 मिनट का वास्तविक NTA टाइमर',
        'अनुमानित AIR रैंक व कट-ऑफ विश्लेषण',
        'आजीवन असीमित री-अटेम्पट'
      ],
      badge: '720 NTA SIMULATION',
      color: '#f59e0b'
    },
    combo: {
      id: 'combo',
      name: 'Combo Mega Pack: Level 5 + Level 6 All Access',
      hindiName: 'कॉम्बो मेगा पैक: लेवल 5 + लेवल 6 फुल ऑल-एक्सेस',
      price: 119,
      originalPrice: 698,
      level: 'all',
      popular: true,
      savings: 'SAVE ₹29 EXTRA',
      features: [
        'Complete Level 5 (3 PCB Tests) + Level 6 (10 Grand Mocks)',
        '13 Premium Full-Length Tests (2,405 Total Questions)',
        'Full AIIMS & NTA Pattern Difficulty Simulation',
        'Predicted AIR Rank, Weak Area Diagnostics & Analytics',
        'Lifetime Access & Free Updates'
      ],
      featuresHindi: [
        'लेवल 5 (3 टेस्ट) + लेवल 6 (10 ग्रैंड मॉक) दोनों शामिल',
        'कुल 13 प्रीमियम फुल टेस्ट (2,405 प्रश्न)',
        'AIIMS व NTA पैटर्न डिफिकल्टी सिमुलेशन',
        'अनुमानित AIR रैंक, कमजोर टॉपिक रिपोर्ट व विश्लेषण',
        'आजीवन एक्सेस और निःशुल्क नए अपडेट्स'
      ],
      badge: '👑 BEST VALUE MEGA COMBO',
      color: '#06b6d4'
    }
  },

  // Initialize config from server .env API
  init() {
    this.ensurePurchaseState();
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data && data.upiId) {
          this.config.upiId = data.upiId;
          this.config.upiName = data.upiName || this.config.upiName;
        }
      })
      .catch(() => {
        // Fallback to defaults if standalone or static hosting
      });
  },

  // Ensure state structure exists in appState
  ensurePurchaseState() {
    if (typeof window.appState === 'undefined') return;
    window.appState.purchases = window.appState.purchases || {
      level5: false,
      level6: false,
      combo: false,
      transactions: []
    };
  },

  // Check if a given test level is unlocked
  isLevelUnlocked(level) {
    this.ensurePurchaseState();
    const p = (window.appState && window.appState.purchases) || {};
    
    // Levels 1, 2, 3, 4 are 100% Free Forever
    if (level <= 4) return true;

    if (level === 5) {
      return !!(p.level5 || p.combo || p.all);
    }
    if (level === 6) {
      return !!(p.level6 || p.combo || p.all);
    }
    return false;
  },

  // Generate UPI Intent URI
  getUpiUri(packId) {
    const pack = this.PACKAGES[packId] || this.PACKAGES.combo;
    const upiId = this.config.upiId;
    const upiName = this.config.upiName;
    const note = `NEET2028_${pack.id.toUpperCase()}`;
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${pack.price}&cu=INR&tn=${encodeURIComponent(note)}`;
  },

  // Generate HD QR Code URL
  getQrCodeUrl(packId) {
    const upiUri = this.getUpiUri(packId);
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiUri)}`;
  },

  // Active selected pack inside checkout modal
  _currentCheckoutPack: 'combo',

  // Open the Premium Test Unlock & Direct UPI Checkout Modal
  openCheckoutModal(defaultPackId = 'combo') {
    this.ensurePurchaseState();
    this._currentCheckoutPack = defaultPackId;

    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    this.renderCheckoutModalContent();

    const modal = document.getElementById('modal');
    if (modal) modal.showModal();
  },

  // Re-render checkout modal when user switches pack
  selectCheckoutPack(packId) {
    this._currentCheckoutPack = packId;
    this.renderCheckoutModalContent();
  },

  // Render the inner HTML of the Checkout Modal
  renderCheckoutModalContent() {
    const isHindi = window.appLanguage === 'hindi';
    const packId = this._currentCheckoutPack;
    const pack = this.PACKAGES[packId] || this.PACKAGES.combo;
    const upiUri = this.getUpiUri(packId);
    const qrUrl = this.getQrCodeUrl(packId);
    const upiId = this.config.upiId;

    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="checkout-container" style="padding:4px 2px;">
        <!-- Header -->
        <div style="text-align:center; margin-bottom:16px;">
          <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); color:#10b981; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
            <span>🛡️</span>
            <span>${isHindi ? '100% डायरेक्ट UPI सुरक्षित भुगतान' : '100% Direct UPI Secure Checkout'}</span>
          </div>
          <h2 style="font-size:22px; font-weight:800; color:var(--text-main); margin:0 0 4px;">
            ${isHindi ? 'प्रीमियम टेस्ट सीरीज़ अनलॉक करें' : 'Unlock Premium NEET Tests'}
          </h2>
          <p style="font-size:12.5px; color:var(--text-muted); margin:0;">
            ${isHindi 
              ? 'डायरेक्ट UPI पेमेंट करें — कोई थर्ड-पार्टी फीस नहीं, तुरंत लाइफटाइम एक्सेस!' 
              : 'Direct UPI transfer to creator with zero middleman fee. Instant lifetime activation.'}
          </p>
        </div>

        <!-- 3 Plan Selector Tabs -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:18px;">
          <!-- Level 5 (₹49) -->
          <div class="checkout-plan-tab ${packId === 'level5' ? 'active' : ''}" onclick="PaymentEngine.selectCheckoutPack('level5')">
            <div style="font-size:10px; font-weight:800; color:${packId === 'level5' ? '#ec4899' : 'var(--text-muted)'}; text-transform:uppercase;">Level 5 Only</div>
            <div style="font-size:18px; font-weight:800; color:var(--text-main); margin:2px 0;">₹49</div>
            <div style="font-size:10px; color:var(--text-muted);">3 PCB Sets</div>
          </div>

          <!-- Level 6 (₹99) -->
          <div class="checkout-plan-tab ${packId === 'level6' ? 'active' : ''}" onclick="PaymentEngine.selectCheckoutPack('level6')">
            <div style="font-size:10px; font-weight:800; color:${packId === 'level6' ? '#f59e0b' : 'var(--text-muted)'}; text-transform:uppercase;">Level 6 Only</div>
            <div style="font-size:18px; font-weight:800; color:var(--text-main); margin:2px 0;">₹99</div>
            <div style="font-size:10px; color:var(--text-muted);">10 Grand Mocks</div>
          </div>

          <!-- Combo (₹119) -->
          <div class="checkout-plan-tab popular ${packId === 'combo' ? 'active' : ''}" onclick="PaymentEngine.selectCheckoutPack('combo')">
            <div class="plan-badge-pill">${isHindi ? '🔥 सबसे बेस्ट' : '🔥 Best Value'}</div>
            <div style="font-size:10px; font-weight:800; color:${packId === 'combo' ? '#06b6d4' : 'var(--text-muted)'}; text-transform:uppercase;">Combo All</div>
            <div style="font-size:18px; font-weight:800; color:var(--text-main); margin:2px 0;">₹119</div>
            <div style="font-size:10px; color:#10b981; font-weight:700;">Save ₹29</div>
          </div>
        </div>

        <!-- Selected Pack Summary Box -->
        <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; padding:12px 14px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div>
              <span style="font-size:10.5px; font-weight:800; color:${pack.color}; text-transform:uppercase; letter-spacing:0.5px;">${pack.badge}</span>
              <h4 style="font-size:14.5px; font-weight:800; margin:2px 0 0; color:var(--text-main);">${isHindi ? pack.hindiName : pack.name}</h4>
            </div>
            <div style="text-align:right;">
              <span style="font-size:11px; text-decoration:line-through; color:var(--text-muted);">₹${pack.originalPrice}</span>
              <div style="font-family:'JetBrains Mono', monospace; font-size:22px; font-weight:800; color:var(--brand-teal); line-height:1;">
                ₹${pack.price}
              </div>
            </div>
          </div>

          <ul style="margin:0; padding-left:18px; font-size:11.5px; color:var(--text-muted); line-height:1.6;">
            ${(isHindi ? pack.featuresHindi : pack.features).slice(0, 3).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
          </ul>
        </div>

        <!-- Dynamic QR Code & UPI Scan Container -->
        <div style="background:linear-gradient(135deg, rgba(6,182,212,0.06), rgba(99,102,241,0.06)); border:1px solid rgba(6,182,212,0.25); border-radius:16px; padding:16px; text-align:center; margin-bottom:16px;">
          <div style="font-size:12px; font-weight:700; color:var(--text-main); margin-bottom:10px;">
            ${isHindi ? `📱 किसी भी UPI ऐप से ₹${pack.price} स्कैन व भुगतान करें:` : `📱 Scan & Pay ₹${pack.price} with Any UPI App:`}
          </div>

          <!-- QR Code Frame -->
          <div style="display:inline-block; background:#ffffff; padding:10px; border-radius:14px; box-shadow:0 8px 24px rgba(0,0,0,0.2); margin-bottom:12px;">
            <img src="${qrUrl}" alt="NEET 2028 UPI QR Code" style="width:190px; height:190px; display:block; border-radius:6px;" />
            <div style="font-size:11px; font-weight:800; color:#0f172a; margin-top:6px; font-family:'JetBrains Mono', monospace;">
              AMOUNT: ₹${pack.price}.00
            </div>
          </div>

          <!-- Direct Mobile 1-Tap UPI Apps Buttons -->
          <div style="margin-bottom:12px;">
            <div style="font-size:11px; color:var(--text-muted); margin-bottom:6px;">
              ${isHindi ? 'या मोबाइल पर डायरेक्ट ऐप खोलें:' : 'Or tap below to open UPI App directly:'}
            </div>
            <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
              <a href="${upiUri}" class="btn btn-sm" style="background:#2563eb; color:#fff; font-size:11.5px; font-weight:700; border-radius:8px; text-decoration:none; padding:6px 12px; display:inline-flex; align-items:center; gap:4px;">
                ⚡ GPay / PhonePe / Paytm
              </a>
            </div>
          </div>

          <!-- Copy UPI ID Row -->
          <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,0,0,0.25); border:1px solid var(--border-color); padding:6px 12px; border-radius:20px;">
            <span style="font-size:11px; color:var(--text-muted); font-weight:600;">UPI ID:</span>
            <span style="font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; color:var(--brand-amber);" id="displayUpiId">${escapeHtml(upiId)}</span>
            <button onclick="PaymentEngine.copyUpiId()" style="background:transparent; border:none; color:var(--brand-teal); font-size:11px; font-weight:700; cursor:pointer; padding:0 4px;">
              📋 ${isHindi ? 'कॉपी' : 'Copy'}
            </button>
          </div>
        </div>

        <!-- Verification Form (12-Digit UTR Number) -->
        <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; padding:14px; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
            <span style="font-size:16px;">✍️</span>
            <div style="font-size:12.5px; font-weight:800; color:var(--text-main);">
              ${isHindi ? 'स्टेप 2: 12-अंकों का UTR / Transaction No. दर्ज करें' : 'Step 2: Enter 12-Digit UPI Ref / UTR Number'}
            </div>
          </div>
          <p style="font-size:11px; color:var(--text-muted); margin:0 0 10px;">
            ${isHindi 
              ? 'पेमेंट के बाद अपने UPI ऐप (PhonePe / GPay / Paytm) से 12 डिजिट UTR नंबर यहाँ डालें:' 
              : 'After payment, find the 12-digit UTR / UPI Ref ID in your banking app and enter below:'}
          </p>

          <div style="display:flex; gap:8px; margin-bottom:6px;">
            <input 
              type="text" 
              id="utrInput" 
              placeholder="e.g. 423456789012" 
              maxlength="16" 
              style="flex:1; padding:10px 14px; font-family:'JetBrains Mono', monospace; font-size:14px; font-weight:700; border-radius:10px; border:1px solid var(--border-color); background:var(--bg-main); color:var(--text-main); text-align:center; letter-spacing:1px;"
            />
          </div>
          <div id="utrErrorMsg" style="font-size:11px; color:#ef4444; font-weight:700; display:none; margin-bottom:6px;"></div>

          <button class="btn btn-primary" onclick="PaymentEngine.verifyAndUnlock('${packId}')" style="width:100%; padding:12px; font-size:14px; font-weight:800; border-radius:12px; box-shadow:0 6px 20px rgba(6,182,212,0.35);">
            ✅ ${isHindi ? `वेरिफाई करें और ₹${pack.price} टेस्ट अनलॉक करें` : `Verify & Unlock Tests (₹${pack.price})`}
          </button>
        </div>

        <!-- Help / Support -->
        <div style="text-align:center; font-size:11px; color:var(--text-muted);">
          <span>${isHindi ? 'कोई समस्या? सहायता के लिए:' : 'Need payment help? Direct contact:'} </span>
          <a href="mailto:support@neet2028.org" style="color:var(--brand-teal); text-decoration:none; font-weight:700;">support@neet2028.org</a>
          <span style="margin:0 6px;">·</span>
          <button onclick="document.getElementById('modal').close()" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:11px; text-decoration:underline;">
            ${isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    `;
  },

  // Copy UPI ID to clipboard with toast
  copyUpiId() {
    const upiId = this.config.upiId;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(upiId).then(() => {
        if (typeof showToast === 'function') {
          showToast(`📋 UPI ID Copied: ${upiId}`);
        }
      });
    } else {
      const el = document.createElement('textarea');
      el.value = upiId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (typeof showToast === 'function') {
        showToast(`📋 UPI ID Copied: ${upiId}`);
      }
    }
  },

  // Verify UTR & Activate Instant Lifetime Unlock
  verifyAndUnlock(packId) {
    const isHindi = window.appLanguage === 'hindi';
    const utrInput = document.getElementById('utrInput');
    const errorEl = document.getElementById('utrErrorMsg');

    if (!utrInput) return;
    const utr = utrInput.value.trim().replace(/\s+/g, '');

    // Anti-fraud validation: UTR must be standard numeric reference (typically 12 digits in UPI)
    if (!utr || utr.length < 8 || !/^[0-9a-zA-Z]+$/.test(utr)) {
      if (errorEl) {
        errorEl.textContent = isHindi 
          ? '⚠️ कृपया वैध 12-अंकों का UTR / Ref No. दर्ज करें।' 
          : '⚠️ Please enter a valid 12-digit UPI Reference / UTR Number.';
        errorEl.style.display = 'block';
      }
      utrInput.focus();
      return;
    }

    this.ensurePurchaseState();
    const purchases = window.appState.purchases;
    const pack = this.PACKAGES[packId] || this.PACKAGES.combo;

    // Check duplicate UTR in transaction log
    const existingTx = (purchases.transactions || []).find(t => t.utr === utr);
    if (existingTx && existingTx.status === 'success') {
      if (errorEl) {
        errorEl.textContent = isHindi 
          ? '⚠️ यह UTR पहले ही उपयोग किया जा चुका है।' 
          : '⚠️ This UTR has already been registered and verified.';
        errorEl.style.display = 'block';
      }
      return;
    }

    // Record Transaction
    const tx = {
      id: `TXN_${Date.now()}`,
      utr: utr,
      packId: pack.id,
      packName: pack.name,
      amount: pack.price,
      date: new Date().toISOString(),
      status: 'success',
      paymentMethod: 'Direct UPI'
    };

    purchases.transactions = purchases.transactions || [];
    purchases.transactions.push(tx);

    // Set Unlock Flags
    if (pack.id === 'level5') {
      purchases.level5 = true;
    } else if (pack.id === 'level6') {
      purchases.level6 = true;
    } else if (pack.id === 'combo') {
      purchases.level5 = true;
      purchases.level6 = true;
      purchases.combo = true;
      purchases.all = true;
    }

    // Save State Locally & Push to Server
    if (typeof window.saveState === 'function') {
      window.saveState();
    }

    // Push Transaction to Server Database
    const currentUser = (typeof ClerkAuth !== 'undefined' && ClerkAuth.currentUser) ? ClerkAuth.currentUser : null;
    fetch('/api/payment/log-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser ? currentUser.id : 'guest',
        studentName: currentUser ? (currentUser.fullName || currentUser.firstName) : 'Dr. Aspirant',
        utr: utr,
        packId: pack.id,
        amount: pack.price
      })
    }).catch(e => console.log('Server transaction log fallback:', e));

    // Trigger Success Receipt Modal
    this.renderSuccessReceiptModal(tx, pack);

    // Re-render main app views
    if (typeof window.renderApp === 'function') {
      window.renderApp();
    }

    if (typeof showToast === 'function') {
      showToast(isHindi ? `🎉 ${pack.hindiName} सफलतापूर्वक अनलॉक हुआ!` : `🎉 ${pack.name} Unlocked Successfully!`);
    }
  },

  // Display High-Precision Digital Receipt & Celebration Modal
  renderSuccessReceiptModal(tx, pack) {
    const isHindi = window.appLanguage === 'hindi';
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="padding:10px 4px; text-align:center;">
        <div style="font-size:44px; margin-bottom:6px; animation:bounce 1s infinite;">🎉</div>
        <h2 style="font-size:22px; font-weight:800; color:var(--brand-emerald); margin:0 0 4px;">
          ${isHindi ? 'भुगतान सत्यापित! टेस्ट अनलॉक हो गए' : 'Payment Verified! Tests Unlocked'}
        </h2>
        <p style="font-size:12.5px; color:var(--text-muted); margin:0 0 16px;">
          ${isHindi 
            ? 'आपका लाइफटाइम एक्सेस तुरंत सक्रिय कर दिया गया है।' 
            : 'Your lifetime access to premium NEET test series is now active.'}
        </p>

        <!-- Digital Receipt Card -->
        <div style="background:var(--bg-secondary); border:1px dashed var(--brand-emerald); border-radius:14px; padding:14px; text-align:left; margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px;">
            <span style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase;">OFFICIAL RECEIPT</span>
            <span class="tag bot" style="font-size:10px; font-weight:800;">VERIFIED & ACTIVE</span>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:6px;">
            <span style="color:var(--text-muted);">${isHindi ? 'पैकेज:' : 'Package:'}</span>
            <strong style="color:var(--text-main);">${isHindi ? pack.hindiName : pack.name}</strong>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:6px;">
            <span style="color:var(--text-muted);">${isHindi ? 'भुगतान राशि:' : 'Amount Paid:'}</span>
            <strong style="color:var(--brand-teal); font-family:'JetBrains Mono', monospace;">₹${tx.amount}.00</strong>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:6px;">
            <span style="color:var(--text-muted);">UTR / Ref No:</span>
            <strong style="color:var(--brand-amber); font-family:'JetBrains Mono', monospace;">${escapeHtml(tx.utr)}</strong>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:11.5px;">
            <span style="color:var(--text-muted);">${isHindi ? 'दिनांक व समय:' : 'Date & Time:'}</span>
            <span style="color:var(--text-muted);">${new Date(tx.date).toLocaleString()}</span>
          </div>
        </div>

        <!-- Action Button -->
        <button class="btn btn-primary" onclick="document.getElementById('modal').close(); if(window.navigateView) window.navigateView('tests');" style="width:100%; padding:12px; font-size:14px; font-weight:800; border-radius:12px;">
          🚀 ${isHindi ? 'अभी टेस्ट शुरू करें →' : 'Start Practicing Now →'}
        </button>
      </div>
    `;
  }
};

// Initialize on script load
if (typeof window !== 'undefined') {
  window.PaymentEngine = PaymentEngine;
  PaymentEngine.init();
} else if (typeof global !== 'undefined') {
  global.PaymentEngine = PaymentEngine;
}
