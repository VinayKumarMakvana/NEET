/**
 * NEET UG 2028: Direct UPI & Auto-Approval Engine
 * Monetization for Level 4, 5, 6 (₹99) - Valid for 1 Year
 */

const PaymentEngine = {
  config: {
    upiId: 'vinay.makvana@ptyes',
    upiName: 'NEET 2028 Aspirant Hub'
  },

  init() {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.config.upiId = data.upiId || this.config.upiId;
          this.config.upiName = data.upiName || this.config.upiName;
        }
      })
      .catch(() => {});
  },

  isLevelUnlocked(levelNum) {
    if (levelNum <= 3) return true; // Level 1, 2, 3 are 100% Free
    
    // Level 4, 5, 6 require Premium
    if (!ClerkAuth.isAuthenticated()) return false;
    if (ClerkAuth.currentUser && ClerkAuth.currentUser.isPremium) return true;
    
    return false;
  },

  openCheckoutModal() {
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    this.renderCheckoutModalContent();

    const modal = document.getElementById('modal');
    if (modal) modal.showModal();
  },

  renderCheckoutModalContent() {
    const isHindi = window.appLanguage === 'hindi';
    
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    const initialAmount = 99;
    const initialUpiUrl = `upi://pay?pa=${this.config.upiId}&pn=${encodeURIComponent(this.config.upiName)}&am=${initialAmount}&cu=INR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(initialUpiUrl)}&margin=10`;

    modalBody.innerHTML = `
      <div class="checkout-container" style="padding:4px 2px;">
        <div style="text-align:center; margin-bottom:12px;">
          <h2 style="font-size:22px; font-weight:800; color:var(--text-main); margin:0 0 4px;">
            ${isHindi ? 'NEET OS प्रीमियम अनलॉक करें' : 'Unlock NEET OS Premium'}
          </h2>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px; text-align:left; background:var(--bg-card); padding:10px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-weight:700; color:var(--brand-gold); margin-bottom:6px;">${isHindi ? 'आपको क्या मिलेगा:' : 'What you get (1-Year Access):'}</div>
            <ul style="margin:0; padding-left:20px; line-height:1.6;">
              <li><strong>Level 4:</strong> 2-Subject Combo Tests</li>
              <li><strong>Level 5:</strong> 3-Subject Combo Tests</li>
              <li><strong>Level 6:</strong> 10 Pre-NEET Grand Mocks (720 Marks)</li>
              <li>All Premium Analytics & Mock Features</li>
            </ul>
          </div>
        </div>

        <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:14px; padding:16px; margin-bottom:16px; text-align:center;">
          <img src="${qrUrl}" alt="UPI QR Code" style="width:160px; height:160px; border-radius:8px; border:4px solid white; box-shadow:0 4px 12px rgba(0,0,0,0.1); margin-bottom:12px;">
          <div style="font-size:13px; font-weight:700; color:var(--text-main); margin-bottom:4px;">
            Scan & Pay <span style="color:var(--brand-teal);">₹99</span>
          </div>
          <div style="font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--text-muted); background:var(--bg-surface); padding:4px 8px; border-radius:6px; display:inline-block; margin-bottom:12px;">
            ${this.config.upiId}
          </div>
          <a href="${initialUpiUrl}" class="btn primary" style="width:100%; padding:11px; font-size:14px; font-weight:800; display:block; text-decoration:none; box-sizing:border-box;">
            <i class="ph-fill ph-rocket"></i> Pay via UPI App (1-Tap)
          </a>
        </div>
        
        <div style="background:var(--bg-surface); border:1px dashed var(--border-color); border-radius:12px; padding:12px; margin-bottom:16px; text-align:left;">
          <div style="font-size:11.5px; font-weight:700; color:var(--text-main); margin-bottom:6px;">
            ${isHindi ? 'भुगतान के बाद 12-अंकों का UTR / Reference No. दर्ज करें:' : 'After Payment, enter 12-Digit UPI Ref / UTR No:'}
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <input type="text" id="premiumUtrInput" placeholder="e.g. 412982736192" style="min-width:0; flex:1 1 140px; padding:8px 12px; border-radius:8px; background:var(--bg-card); border:1px solid var(--border-color); color:var(--text-main); font-family:'JetBrains Mono', monospace; font-size:12.5px; outline:none;">
            <button class="btn gold btn-sm" id="verifyPayBtn" onclick="PaymentEngine.submitUtr()" style="flex:1 1 auto; white-space:nowrap; font-weight:700;">
              Unlock Now 🚀
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async submitUtr() {
    const isHindi = window.appLanguage === 'hindi';
    const btn = document.getElementById('verifyPayBtn');
    const input = document.getElementById('premiumUtrInput');
    const utr = input ? input.value.trim() : '';

    if (!ClerkAuth.isAuthenticated()) {
      alert("Please login first to process payment.");
      return;
    }

    if (utr.length < 10) {
      alert(isHindi ? "कृपया सही 12-अंकों का UTR दर्ज करें।" : "Please enter a valid 12-digit UTR/Reference number.");
      return;
    }

    if(btn) {
      btn.innerText = isHindi ? 'वेरिफाई कर रहे हैं...' : 'Verifying...';
      btn.disabled = true;
    }

    try {
      const user = ClerkAuth.getCurrentUser();
      const res = await fetch('/api/payment/submit-utr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, utr: utr, amount: 99 })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit UTR');
      }

      // Auto-Approve successful!
      ClerkAuth.currentUser.isPremium = true;
      localStorage.setItem('neet_active_student_session', JSON.stringify(ClerkAuth.currentUser));
      this.renderSuccessReceiptModal();

    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
      if(btn) {
         btn.innerText = 'Unlock Now 🚀';
         btn.disabled = false;
      }
    }
  },

  renderSuccessReceiptModal() {
    const isHindi = window.appLanguage === 'hindi';
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="padding:10px 4px; text-align:center;">
        <div style="font-size:44px; margin-bottom:6px; animation:bounce 1s infinite;">🎉</div>
        <h2 style="font-size:22px; font-weight:800; color:var(--brand-emerald); margin:0 0 4px;">
          ${isHindi ? 'बधाई हो! सभी लेवल्स अनलॉक हो गए!' : 'Congratulations! All Levels Unlocked!'}
        </h2>
        <p style="font-size:12.5px; color:var(--text-muted); margin:0 0 16px;">
          ${isHindi 
            ? 'आपका 1 साल का प्रीमियम एक्सेस तुरंत सक्रिय हो गया है!' 
            : 'Your 1-year premium access is now active!'}
        </p>
        <button class="btn btn-primary" onclick="document.getElementById('modal').close(); if(window.navigateView) window.navigateView('tests');" style="width:100%; padding:12px; font-size:14px; font-weight:800; border-radius:12px;">
          🚀 ${isHindi ? 'अभी टेस्ट शुरू करें →' : 'Start Practicing Now →'}
        </button>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.PaymentEngine = PaymentEngine;
  PaymentEngine.init();
}
