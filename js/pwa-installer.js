/**
 * NEET UG 2028: Progressive Web App (PWA) Offline & Native Install Engine
 * Supports 1-Click Desktop App (Windows/Mac/Linux) & Mobile Home Screen (Android/iOS)
 */

const PWAInstaller = {
  deferredPrompt: null,
  isInstalled: false,

  init() {
    // Check if already in standalone/PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      this.isInstalled = true;
      this.updateInstallButtons();
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent default mini-infobar
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstalled = false;
      this.updateInstallButtons();
      console.log('⚡ PWA Install Prompt Captured & Ready');
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isInstalled = true;
      this.updateInstallButtons();
      if (typeof showToast === 'function') {
        showToast('🎉 NEET UG 2028 App successfully installed on your device!');
      }
    });

    // Initial render check
    document.addEventListener('DOMContentLoaded', () => {
      this.updateInstallButtons();
    });
  },

  async install() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        this.isInstalled = true;
      }
      this.deferredPrompt = null;
      this.updateInstallButtons();
    } else {
      // Fallback instructions based on OS / Browser
      this.showInstallGuidanceModal();
    }
  },

  updateInstallButtons() {
    const installBtns = document.querySelectorAll('.pwa-install-btn');
    installBtns.forEach(btn => {
      if (this.isInstalled) {
        btn.innerHTML = '✓ App Installed';
        btn.classList.add('installed');
        btn.disabled = true;
        btn.title = 'NEET OS is already installed on this device';
      } else {
        btn.innerHTML = '📲 Install App';
        btn.classList.remove('installed');
        btn.disabled = false;
        btn.title = 'Install NEET OS directly on your Desktop / Phone for 100% Offline Access';
      }
    });
  },

  showInstallGuidanceModal() {
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('modal');
    if (!modalBody || !modal) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    modalBody.innerHTML = `
      <div style="text-align:center; padding:10px 0;">
        <span class="eyebrow">OFFLINE & DESKTOP INSTALLATION</span>
        <h2 style="font-size:24px; margin:8px 0 16px;">📲 Install NEET UG 2028 OS</h2>
        
        <p style="font-size:14px; color:var(--text-muted); line-height:1.6; margin-bottom:20px;">
          Install this Medical Entrance OS on your <strong>Windows PC, Mac, Android, or iPhone</strong> to study with zero browser distractions, full screen focus, and fast offline access!
        </p>

        <div style="background:rgba(13, 148, 136, 0.08); border:1px solid rgba(13, 148, 136, 0.3); border-radius:12px; padding:18px; text-align:left; margin-bottom:20px;">
          ${isIOS ? `
            <h4 style="color:var(--brand-emerald); margin-bottom:10px;">🍎 For Apple iPhone / iPad (Safari):</h4>
            <ol style="font-size:13px; line-height:1.8; margin-left:20px; color:var(--text-main);">
              <li>Tap the <strong>Share button</strong> (box with arrow <span style="font-size:16px;">⎙ / ⬆</span>) at the bottom of Safari.</li>
              <li>Scroll down and tap <strong>"Add to Home Screen" (+)</strong>.</li>
              <li>Tap <strong>"Add"</strong> on the top right.</li>
            </ol>
          ` : `
            <h4 style="color:var(--brand-emerald); margin-bottom:10px;">💻 For Windows / Mac / Android Chrome & Edge:</h4>
            <ol style="font-size:13px; line-height:1.8; margin-left:20px; color:var(--text-main);">
              <li>Look at the right side of your browser address bar for the <strong>Install icon (🖥️ / ⬇️)</strong>.</li>
              <li>Or click the 3 dots menu (⋮) on top right &rarr; select <strong>"Install NEET UG 2028"</strong>.</li>
              <li>Click <strong>"Install"</strong> to launch as a standalone desktop application.</li>
            </ol>
          `}
        </div>

        <div style="display:flex; justify-content:center; gap:12px;">
          <button class="btn btn-primary" onclick="document.getElementById('modal').close()">Got it, Thanks! ✓</button>
        </div>
      </div>
    `;

    modal.showModal();
  }
};

window.PWAInstaller = PWAInstaller;
PWAInstaller.init();
