/**
 * NEET UG 2028: Doctor Milestone & AIIMS Certificate Generator
 */

const CertificateGenerator = {
  saveDoctorName(name) {
    if (typeof appState !== 'undefined') {
      appState.doctorName = name;
      if (typeof saveState === 'function') saveState();
    }
  },

  saveTargetCollege(college) {
    if (typeof appState !== 'undefined') {
      appState.targetCollege = college;
      if (typeof saveState === 'function') saveState();
    }
  },

  generatePrintableCertificate() {
    const name = (typeof appState !== 'undefined' && appState.doctorName) ? appState.doctorName.trim() : 'Dr. Future AIIMSian';
    const college = (typeof appState !== 'undefined' && appState.targetCollege) ? appState.targetCollege.trim() : 'AIIMS New Delhi';
    const certId = 'AIIMS2028-' + Date.now().toString(36).toUpperCase();
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow popups to generate your Doctor Certificate.');
      return;
    }

    win.document.write(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>NEET UG 2028 Master Certificate - ${escapeHtml(name)}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Playfair+Display:ital,wght@0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .certificate-container {
            width: 1020px;
            height: 720px;
            background: #fffdfa;
            color: #0f172a;
            position: relative;
            padding: 60px;
            box-sizing: border-box;
            border: 18px solid #0d9488;
            outline: 6px solid #f59e0b;
            box-shadow: 0 25px 60px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            background-image: 
              radial-gradient(circle at 10% 10%, rgba(13, 148, 136, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.05) 0%, transparent 40%);
          }
          .crest {
            font-family: 'Cinzel', serif;
            font-size: 13px;
            letter-spacing: 4px;
            color: #0d9488;
            font-weight: 700;
          }
          h1 {
            font-family: 'Cinzel', serif;
            font-size: 38px;
            color: #0f172a;
            margin: 8px 0;
            letter-spacing: 1px;
          }
          .subtitle {
            font-size: 15px;
            color: #64748b;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .recipient-name {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            font-weight: 700;
            color: #0d9488;
            margin: 16px 0 8px;
            border-bottom: 2px solid #f59e0b;
            display: inline-block;
            padding: 0 40px 6px;
          }
          .citation {
            font-size: 15px;
            line-height: 1.6;
            color: #334155;
            max-width: 780px;
            margin: 0 auto;
          }
          .target-pill {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 4px 14px;
            border-radius: 999px;
            font-weight: 700;
            font-size: 14px;
            margin: 8px 0;
          }
          .footer-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
            padding: 0 20px;
          }
          .signature-box {
            text-align: center;
          }
          .sig-line {
            width: 180px;
            height: 1px;
            background: #94a3b8;
            margin-bottom: 6px;
          }
          .cert-id {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #94a3b8;
          }
          .gold-seal {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-family: 'Cinzel', serif;
            font-size: 11px;
            font-weight: 900;
            text-align: center;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
            border: 3px dashed #fff;
          }
          @media print {
            body { background: transparent; }
            .certificate-container { box-shadow: none; border-width: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div>
            <div class="crest">✦ MISSION 720 / 720 MEDICAL CURRICULUM MASTERY ✦</div>
            <h1>Certificate of Medical Entrance Distinction</h1>
            <p class="subtitle">Awarded for 100% Comprehensive Syllabus Completion</p>
          </div>

          <div>
            <p style="font-size:14px; color:#64748b;">This certificate is proudly conferred upon</p>
            <div class="recipient-name">${escapeHtml(name)}</div>
            <div class="target-pill">Target Destination: ${escapeHtml(college)}</div>
            <p class="citation">
              Having successfully mastered all 96 core units of Physics, Chemistry, Botany, and Zoology across the Class 11 & Class 12 NMC NEET UG Curriculum, demonstrating superior analytical accuracy, error log remediation, and steadfast dedication to the noble art and science of Medicine.
            </p>
          </div>

          <div class="footer-section">
            <div class="signature-box">
              <div class="sig-line"></div>
              <strong style="font-size:13px;">Chief Academic Mentor</strong>
              <div style="font-size:11px; color:#64748b;">NEET UG 2028 OS</div>
            </div>

            <div class="gold-seal">
              AIIMS<br>720/720<br>HONOR
            </div>

            <div class="signature-box">
              <div class="sig-line"></div>
              <strong style="font-size:13px;">Date: ${dateStr}</strong>
              <div class="cert-id">ID: ${certId}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);

    win.document.close();
    setTimeout(() => win.print(), 500);
  }
};
