// BhuvixTechnology Core Interactivity
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrambleText();
  initCareerSignal();
  initOfficeTabs();
  initLiveClocks();
  initBookingModal();
  initToolsInteractive();
});

// Mobile Navigation Menu
function initMobileMenu() {
  const toggle = document.querySelector('.navMobileToggle');
  const panel = document.querySelector('.navMobilePanel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    panel.classList.toggle('open');
  });

  // Close panel on link click
  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      panel.classList.remove('open');
    });
  });
}

// Scramble Text Effect for Hero
function initScrambleText() {
  const el = document.querySelector('.heroDecrypt');
  if (!el) return;

  const targetText = el.getAttribute('data-text') || "Enhance your tech career.";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let iteration = 0;
  let interval = null;

  function runScramble() {
    iteration = 0;
    clearInterval(interval);

    interval = setInterval(() => {
      el.innerText = targetText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return targetText[index];
          }
          if (letter === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
  }

  runScramble();
  el.addEventListener('mouseenter', runScramble);
}

// Career Signal Dashboard State Switcher
function initCareerSignal() {
  const metrics = document.querySelectorAll('.signalMetric');
  const scoreNum = document.querySelector('.bigScore span');
  const scoreTrack = document.querySelector('.scoreTrack i');
  const signalDesc = document.querySelector('.signalSide p');

  if (!metrics.length || !scoreNum || !scoreTrack) return;

  const data = [
    {
      score: 84,
      desc: "Strong foundation. Your profile is marketable — sharpen your positioning to unlock higher tier opportunities in the US market."
    },
    {
      score: 91,
      desc: "Exceptional alignment. Your technical capabilities strongly match target roles. Focus on high-impact project storytelling."
    },
    {
      score: 76,
      desc: "Good readiness. Strengthen behavioral STAR-framework scenarios and system design confidence to secure top offers."
    }
  ];

  metrics.forEach((metric, index) => {
    metric.addEventListener('click', () => {
      metrics.forEach(m => m.classList.remove('active'));
      metric.classList.add('active');

      const item = data[index] || data[0];
      scoreNum.textContent = item.score;
      scoreTrack.style.width = item.score + '%';
      if (signalDesc) {
        signalDesc.textContent = item.desc;
      }
    });
  });
}

// Office Tabs Switcher
function initOfficeTabs() {
  const tabs = document.querySelectorAll('.officeTabBtn');
  const locationEl = document.querySelector('.officeLocation');
  const directionsLink = document.querySelector('.officeDirectionsLink');

  if (!tabs.length || !locationEl) return;

  const officeData = {
    noida: {
      role: "Head Office",
      city: "Noida, Uttar Pradesh",
      address: "B-24, Sector 62 Rd, Institutional Area, Sector 62, Noida, Uttar Pradesh 201309",
      hours: "Mon–Fri · 10 AM – 7 PM IST",
      map: "https://www.google.com/maps/search/?api=1&query=Sector+62+Noida+Uttar+Pradesh"
    },
    bangalore: {
      role: "Innovation Hub",
      city: "Bengaluru, Karnataka",
      address: "Outer Ring Rd, Bellandur, Bengaluru, Karnataka 560103",
      hours: "Mon–Fri · 9:30 AM – 6:30 PM IST",
      map: "https://www.google.com/maps/search/?api=1&query=Bellandur+Bengaluru"
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const locKey = tab.getAttribute('data-office');
      const d = officeData[locKey];
      if (d) {
        const role = locationEl.querySelector('.officeRole');
        const city = locationEl.querySelector('strong');
        const addr = locationEl.querySelector('p');
        if (role) role.textContent = d.role;
        if (city) city.textContent = d.city;
        if (addr) addr.textContent = d.address;
        if (directionsLink) directionsLink.href = d.map;
      }
    });
  });
}

// Live Clocks for Global Offices
function initLiveClocks() {
  function updateClocks() {
    const now = new Date();
    
    // India Office (IST = UTC + 5:30)
    const istOptions = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const istTime = new Intl.DateTimeFormat([], istOptions).format(now);
    const clockIndia = document.getElementById('clockIndia');
    if (clockIndia) clockIndia.textContent = istTime + ' IST';

    // US Office (Eastern Time = America/Detroit)
    const edtOptions = { timeZone: 'America/Detroit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const edtTime = new Intl.DateTimeFormat([], edtOptions).format(now);
    const clockUSA = document.getElementById('clockUSA');
    if (clockUSA) clockUSA.textContent = edtTime + ' EDT';
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

// Booking Modal Logic
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('.openBookingModal');
  const closeBtn = modal.querySelector('.modalClose');
  const form = modal.querySelector('#bookingForm');
  const successBox = modal.querySelector('#bookingSuccess');

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      if (form) form.style.display = 'flex';
      if (successBox) successBox.style.display = 'none';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || "Candidate";
      const email = form.querySelector('[name="email"]')?.value || "";
      const slot = form.querySelector('[name="slot"]')?.value || "Tomorrow";

      form.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
        successBox.innerHTML = `
          <div style="text-align:center; padding: 20px 0;">
            <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
            <h3 style="font-family: var(--font-heading); font-size: 24px; margin-bottom: 8px;">Consultation Confirmed!</h3>
            <p style="color: var(--muted); font-size: 14px; margin-bottom: 18px;">Thank you, <strong>${name}</strong>. A calendar invite and consultation link have been sent to <strong>${email}</strong> for <strong>${slot}</strong>.</p>
            <button type="button" class="primary closeAfterSuccess"><span class="blobBtnLabel">Close Window</span></button>
          </div>
        `;
        successBox.querySelector('.closeAfterSuccess')?.addEventListener('click', () => {
          modal.classList.remove('open');
        });
      }
    });
  }
}

// Interactive Career Intelligence Tools
function initToolsInteractive() {
  const toolModal = document.getElementById('toolModal');
  if (!toolModal) return;

  const toolTriggers = document.querySelectorAll('[data-open-tool]');
  const toolModalTitle = document.getElementById('toolModalTitle');
  const toolModalBody = document.getElementById('toolModalBody');
  const closeBtn = toolModal.querySelector('.modalClose');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => toolModal.classList.remove('open'));
  }
  toolModal.addEventListener('click', (e) => {
    if (e.target === toolModal) toolModal.classList.remove('open');
  });

  toolTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const toolType = btn.getAttribute('data-open-tool');
      renderTool(toolType);
      toolModal.classList.add('open');
    });
  });

  function renderTool(type) {
    if (type === 'resume') {
      toolModalTitle.textContent = "Resume Analyzer & ATS Checker";
      toolModalBody.innerHTML = `
        <div class="toolForm">
          <label style="font-size:12px; font-weight:600; color:#505c68; display:block; margin-bottom:6px;">Paste Your Resume Text or Bullet Points:</label>
          <textarea id="resumeInput" rows="6" placeholder="Paste your professional experience, technical skills, and achievements here... (e.g. Senior Software Engineer with 5+ years experience in AWS, React, Python, CI/CD, Microservices)" style="width:100%; border:1px solid #d4dee7; border-radius:14px; padding:12px; font-family:inherit; font-size:13px; outline:none; resize:vertical;"></textarea>
          <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
            <button type="button" id="analyzeResumeBtn" class="primary"><span class="blobBtnLabel">Run Free ATS Analysis ↗</span></button>
            <span style="font-size:11px; color:#8593a1;">Confidential · No Data Saved</span>
          </div>
          <div id="resumeOutput" style="margin-top:20px; display:none; border-top:1px solid #e1e7ec; padding-top:20px;"></div>
        </div>
      `;

      document.getElementById('analyzeResumeBtn')?.addEventListener('click', () => {
        const text = document.getElementById('resumeInput')?.value || "";
        const output = document.getElementById('resumeOutput');
        if (!text.trim()) {
          alert("Please paste your resume content to analyze.");
          return;
        }

        // Calculation logic
        const keywords = ["aws", "cloud", "python", "react", "docker", "kubernetes", "microservices", "sql", "ci/cd", "leadership", "agile", "architecture", "api"];
        const lower = text.toLowerCase();
        let found = keywords.filter(k => lower.includes(k));
        let score = Math.min(95, Math.max(58, 60 + found.length * 4));

        output.style.display = 'block';
        output.innerHTML = `
          <div style="background:#f7fafc; border:1px solid #dce4ea; border-radius:18px; padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <div>
                <span style="font-size:10px; letter-spacing:0.16em; font-weight:700; color:var(--primary);">ATS READINESS SCORE</span>
                <h4 style="font-family:var(--font-heading); font-size:26px; color:var(--ink);">${score}/100</h4>
              </div>
              <div style="padding:6px 14px; background:#e6f8ef; color:#0e884d; border-radius:99px; font-size:11px; font-weight:700;">
                ${score >= 80 ? 'Market Ready' : 'Needs Optimization'}
              </div>
            </div>
            <p style="font-size:12.5px; color:#5a6878; margin-bottom:12px;"><strong>Detected High-Impact Keywords:</strong> ${found.length ? found.map(f => `<span style="display:inline-block; background:#fff; border:1px solid #d7e0e7; border-radius:6px; padding:2px 8px; margin:2px; font-size:11px;">${f}</span>`).join(" ") : "None detected. Recommend adding core technical proficiencies."}</p>
            <p style="font-size:12px; color:#788694;"><strong>Bhuvix Recommendation:</strong> ${score >= 80 ? 'Strong presentation. Enhance quantitative metrics (% improvements, revenue, scalability scale) for U.S. client MSP filters.' : 'Your resume lacks critical industry keywords. A structured ATS Rebranding will boost recruiter callbacks by 3.4x.'}</p>
          </div>
        `;
      });
    } else if (type === 'linkedin') {
      toolModalTitle.textContent = "LinkedIn Profile & Positioning Analyzer";
      toolModalBody.innerHTML = `
        <div class="toolForm">
          <label style="font-size:12px; font-weight:600; color:#505c68; display:block; margin-bottom:6px;">Paste Your LinkedIn Headline & About Summary:</label>
          <textarea id="liInput" rows="5" placeholder="e.g. Senior Full Stack Engineer | React & Cloud Architect | Helping Fortune 500 scale distributed applications..." style="width:100%; border:1px solid #d4dee7; border-radius:14px; padding:12px; font-family:inherit; font-size:13px; outline:none; resize:vertical;"></textarea>
          <div style="margin-top:14px;">
            <button type="button" id="analyzeLiBtn" class="primary"><span class="blobBtnLabel">Evaluate LinkedIn Positioning ↗</span></button>
          </div>
          <div id="liOutput" style="margin-top:20px; display:none; border-top:1px solid #e1e7ec; padding-top:20px;"></div>
        </div>
      `;

      document.getElementById('analyzeLiBtn')?.addEventListener('click', () => {
        const text = document.getElementById('liInput')?.value || "";
        const output = document.getElementById('liOutput');
        if (!text.trim()) {
          alert("Please enter your LinkedIn headline or summary.");
          return;
        }

        output.style.display = 'block';
        output.innerHTML = `
          <div style="background:#f7fafc; border:1px solid #dce4ea; border-radius:18px; padding:20px;">
            <span style="font-size:10px; letter-spacing:0.16em; font-weight:700; color:var(--primary);">SEARCH VISIBILITY INDEX</span>
            <h4 style="font-family:var(--font-heading); font-size:26px; color:var(--ink); margin-bottom:10px;">88% Profile Strength</h4>
            <p style="font-size:12.5px; color:#556372; line-height:1.5;">Your positioning is clear. To maximize recruiter search algorithms (Boolean Search), include target location badges, primary engineering stack keywords, and verifiable achievement metrics.</p>
          </div>
        `;
      });
    } else if (type === 'match') {
      toolModalTitle.textContent = "Job Match Score Calculator";
      toolModalBody.innerHTML = `
        <div class="toolForm">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:12px; font-weight:600; color:#505c68; display:block; margin-bottom:4px;">Your Skills / Resume Summary:</label>
              <textarea id="matchResume" rows="5" placeholder="e.g. Python, Django, AWS, PostgreSQL, Docker, Microservices, 4 years backend development" style="width:100%; border:1px solid #d4dee7; border-radius:12px; padding:10px; font-family:inherit; font-size:12.5px;"></textarea>
            </div>
            <div>
              <label style="font-size:12px; font-weight:600; color:#505c68; display:block; margin-bottom:4px;">Target Job Description:</label>
              <textarea id="matchJob" rows="5" placeholder="e.g. Looking for a Python Cloud Engineer with AWS, Kubernetes, CI/CD, Kafka, and PostgreSQL experience..." style="width:100%; border:1px solid #d4dee7; border-radius:12px; padding:10px; font-family:inherit; font-size:12.5px;"></textarea>
            </div>
          </div>
          <button type="button" id="calcMatchBtn" class="primary"><span class="blobBtnLabel">Calculate Match Score ↗</span></button>
          <div id="matchOutput" style="margin-top:20px; display:none;"></div>
        </div>
      `;

      document.getElementById('calcMatchBtn')?.addEventListener('click', () => {
        const res = document.getElementById('matchResume')?.value || "";
        const job = document.getElementById('matchJob')?.value || "";
        const output = document.getElementById('matchOutput');
        if (!res.trim() || !job.trim()) {
          alert("Please enter both your skills and the job description.");
          return;
        }

        output.style.display = 'block';
        output.innerHTML = `
          <div style="background:#fff7f2; border:1px solid rgba(255,107,44,0.3); border-radius:18px; padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:10px; letter-spacing:0.16em; font-weight:700; color:var(--primary);">ROLE FIT ANALYSIS</span>
                <h4 style="font-family:var(--font-heading); font-size:28px; color:var(--ink);">87% Alignment</h4>
              </div>
              <div style="padding:6px 12px; background:#ffd21f; color:#070b12; border-radius:99px; font-weight:700; font-size:11px;">High Probability</div>
            </div>
            <p style="font-size:12.5px; color:#5a6878; margin-top:10px;">Our Custom Job Campaigns will position your key highlights specifically for hiring managers evaluating this tier of roles.</p>
          </div>
        `;
      });
    } else if (type === 'interview') {
      toolModalTitle.textContent = "Interview Readiness Assessment";
      toolModalBody.innerHTML = `
        <div class="toolForm">
          <div class="formGroup" style="margin-bottom:12px;">
            <label>Target Role Specialization:</label>
            <select id="intRole" style="padding:10px; border:1px solid #d4dee7; border-radius:10px;">
              <option>Full Stack / Software Engineering</option>
              <option>Cloud / DevOps / SRE</option>
              <option>Data Engineering / Data Science</option>
              <option>Product / Project Management</option>
              <option>QA / Automation Testing</option>
            </select>
          </div>
          <div class="formGroup" style="margin-bottom:16px;">
            <label>Current Experience Level:</label>
            <select id="intExp" style="padding:10px; border:1px solid #d4dee7; border-radius:10px;">
              <option>Entry Level / Graduate (0–2 years)</option>
              <option>Mid-Level Professional (3–5 years)</option>
              <option>Senior / Lead Professional (6+ years)</option>
            </select>
          </div>
          <button type="button" id="intEvalBtn" class="primary"><span class="blobBtnLabel">Generate Readiness Report ↗</span></button>
          <div id="intOutput" style="margin-top:20px; display:none;"></div>
        </div>
      `;

      document.getElementById('intEvalBtn')?.addEventListener('click', () => {
        const output = document.getElementById('intOutput');
        output.style.display = 'block';
        output.innerHTML = `
          <div style="background:#f7fafc; border:1px solid #dce4ea; border-radius:18px; padding:20px;">
            <span style="font-size:10px; letter-spacing:0.16em; font-weight:700; color:var(--primary);">INTERVIEW READINESS BENCHMARK</span>
            <h4 style="font-family:var(--font-heading); font-size:24px; color:var(--ink); margin:6px 0 12px;">Technical: 82% | Behavioral: 74%</h4>
            <p style="font-size:12.5px; color:#5a6878;">Bhuvix personalized 1-on-1 mock interviews provide role-specific technical deep-dives and US behavioral coaching to ensure offer conversion.</p>
          </div>
        `;
      });
    }
  }
}
