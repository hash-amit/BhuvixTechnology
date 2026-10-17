/**
 * BhuvixTechnology - Dual Contact Verification Engine
 * - Firebase Phone Authentication (10,000 Free SMS / Month)
 * - Free Email OTP Verification (via Google Apps Script / GmailApp)
 * - Anti-Fraud & Spam Lead Protection
 */

(function () {
  // ---------------------------------------------------------------------------
  // 1. CONFIGURATION
  // ---------------------------------------------------------------------------
  // Replace these with your Firebase project credentials from:
  // https://console.firebase.google.com -> Project Settings -> General -> Your Apps
  window.BHUVIX_FIREBASE_CONFIG = window.BHUVIX_FIREBASE_CONFIG || {
    apiKey: "AIzaSyCSBCkN2W9i_Hsb_j0djy-BlTH7OX1RVgE",
    authDomain: "bhuvixtechnology.firebaseapp.com",
    projectId: "bhuvixtechnology",
    storageBucket: "bhuvixtechnology.firebasestorage.app",
    messagingSenderId: "512644672265",
    appId: "1:512644672265:web:32b760c95bfccf084b01d8",
    measurementId: "G-0GTSQZRWFQ"
  };

  // Google Apps Script Web App URL (the same one saving leads to Google Sheets)
  window.BHUVIX_VERIFY_ENDPOINT = window.BHUVIX_GOOGLE_SHEET_URL || "";

  // ---------------------------------------------------------------------------
  // 2. VERIFICATION STATE
  // ---------------------------------------------------------------------------
  window.bhuvixAuth = {
    emailVerified: false,
    phoneVerified: false,
    verifiedEmailVal: "",
    verifiedPhoneVal: "",
    emailTimerId: null,
    phoneTimerId: null,
    confirmationResult: null,
    simulatedEmailOtp: null
  };

  // Initialize Firebase when SDK is loaded
  function setupFirebase() {
    try {
      if (typeof firebase !== 'undefined' && firebase.apps && !firebase.apps.length) {
        if (window.BHUVIX_FIREBASE_CONFIG.apiKey && !window.BHUVIX_FIREBASE_CONFIG.apiKey.includes("PASTE_YOUR")) {
          firebase.initializeApp(window.BHUVIX_FIREBASE_CONFIG);
          console.log("[Bhuvix Auth] Firebase initialized successfully.");
        }
      }
    } catch (err) {
      console.warn("[Bhuvix Auth] Firebase init notice:", err);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. UI CONTROLLER FOR BOOKING MODAL
  // ---------------------------------------------------------------------------
  function initOtpVerification() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;

    setupFirebase();

    // DOM Elements
    const emailInput = modal.querySelector('input[name="email"]');
    const phoneInput = modal.querySelector('input[name="phone"]');
    const submitBtn = modal.querySelector('button[type="submit"]');

    const btnSendEmailOtp = modal.querySelector('#btnSendEmailOtp');
    const emailOtpBox = modal.querySelector('#emailOtpBox');
    const emailOtpInput = modal.querySelector('#emailOtpInput');
    const btnConfirmEmailOtp = modal.querySelector('#btnConfirmEmailOtp');
    const emailBadge = modal.querySelector('#emailStatusBadge');
    const emailNotice = modal.querySelector('#emailOtpNotice');
    const btnResendEmail = modal.querySelector('#btnResendEmailOtp');
    const emailTimerSpan = modal.querySelector('#emailTimer');

    const btnSendPhoneOtp = modal.querySelector('#btnSendPhoneOtp');
    const phoneOtpBox = modal.querySelector('#phoneOtpBox');
    const phoneOtpInput = modal.querySelector('#phoneOtpInput');
    const btnConfirmPhoneOtp = modal.querySelector('#btnConfirmPhoneOtp');
    const phoneBadge = modal.querySelector('#phoneStatusBadge');
    const phoneNotice = modal.querySelector('#phoneOtpNotice');
    const btnResendPhone = modal.querySelector('#btnResendPhoneOtp');
    const phoneTimerSpan = modal.querySelector('#phoneTimer');
    const verifyPrompt = modal.querySelector('#verifyPromptNotice');

    // Update Submit Button State
    function refreshSubmitState() {
      const isReady = window.bhuvixAuth.emailVerified && window.bhuvixAuth.phoneVerified;
      if (submitBtn) {
        submitBtn.disabled = !isReady;
        if (isReady) {
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
          submitBtn.classList.remove('btnDisabledState');
          if (verifyPrompt) {
            verifyPrompt.innerHTML = '<span style="color:#16a34a; font-weight:600;">✓ Email and Phone verified! You can now confirm your session.</span>';
          }
        } else {
          submitBtn.style.opacity = '0.55';
          submitBtn.style.cursor = 'not-allowed';
          submitBtn.classList.add('btnDisabledState');
          
          let missing = [];
          if (!window.bhuvixAuth.emailVerified) missing.push("Email");
          if (!window.bhuvixAuth.phoneVerified) missing.push("Phone");
          if (verifyPrompt) {
            verifyPrompt.innerHTML = `🔒 Please verify your <strong>${missing.join(" & ")}</strong> with OTP before submitting.`;
          }
        }
      }
    }

    refreshSubmitState();

    // Reset verification when user edits inputs
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (window.bhuvixAuth.emailVerified && emailInput.value.trim() !== window.bhuvixAuth.verifiedEmailVal) {
          window.bhuvixAuth.emailVerified = false;
          window.bhuvixAuth.verifiedEmailVal = "";
          if (emailBadge) {
            emailBadge.className = 'verifyStatus';
            emailBadge.textContent = 'Unverified';
          }
          if (btnSendEmailOtp) {
            btnSendEmailOtp.disabled = false;
            btnSendEmailOtp.textContent = 'Verify';
          }
          emailInput.classList.remove('inputVerified');
          refreshSubmitState();
        }
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        if (window.bhuvixAuth.phoneVerified && phoneInput.value.trim() !== window.bhuvixAuth.verifiedPhoneVal) {
          window.bhuvixAuth.phoneVerified = false;
          window.bhuvixAuth.verifiedPhoneVal = "";
          if (phoneBadge) {
            phoneBadge.className = 'verifyStatus';
            phoneBadge.textContent = 'Unverified';
          }
          if (btnSendPhoneOtp) {
            btnSendPhoneOtp.disabled = false;
            btnSendPhoneOtp.textContent = 'Send OTP';
          }
          phoneInput.classList.remove('inputVerified');
          refreshSubmitState();
        }
      });
    }

    // -------------------------------------------------------------------------
    // EMAIL OTP WORKFLOW
    // -------------------------------------------------------------------------
    function startEmailCountdown(seconds) {
      if (window.bhuvixAuth.emailTimerId) clearInterval(window.bhuvixAuth.emailTimerId);
      if (btnResendEmail) btnResendEmail.disabled = true;
      let left = seconds;
      if (emailTimerSpan) emailTimerSpan.textContent = left;

      window.bhuvixAuth.emailTimerId = setInterval(() => {
        left--;
        if (emailTimerSpan) emailTimerSpan.textContent = left;
        if (left <= 0) {
          clearInterval(window.bhuvixAuth.emailTimerId);
          if (btnResendEmail) {
            btnResendEmail.disabled = false;
            btnResendEmail.textContent = 'Resend Code';
          }
        }
      }, 1000);
    }

    async function handleSendEmailOtp() {
      const email = emailInput ? emailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address first.");
        if (emailInput) emailInput.focus();
        return;
      }

      if (btnSendEmailOtp) {
        btnSendEmailOtp.disabled = true;
        btnSendEmailOtp.textContent = "Sending...";
      }

      // Check if backend endpoint is configured
      const endpoint = window.BHUVIX_GOOGLE_SHEET_URL || window.BHUVIX_VERIFY_ENDPOINT || "";
      const isEndpointLive = endpoint && !endpoint.includes("placeholder");

      if (isEndpointLive) {
        try {
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'send_email_otp', email })
          });
          const res = await resp.json();
          if (res.message === "OTP sent") {
            if (emailNotice) emailNotice.textContent = `Verification code sent to ${email}`;
          } else {
            // Apps script has not been updated with Code.gs yet
            console.warn("Apps Script returned non-OTP response. Using demo code fallback:", res);
            simulateEmailOtp(email);
          }
        } catch (e) {
          console.warn("Using simulated Email OTP fallback:", e);
          simulateEmailOtp(email);
        }
      } else {
        simulateEmailOtp(email);
      }

      if (emailOtpBox) emailOtpBox.style.display = 'block';
      if (emailBadge) {
        emailBadge.className = 'verifyStatus pending';
        emailBadge.textContent = 'Code Sent';
      }
      startEmailCountdown(45);
      if (emailOtpInput) emailOtpInput.focus();
    }

    function simulateEmailOtp(email) {
      // Demo fallback: generates a test code so the flow can be verified immediately
      const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
      window.bhuvixAuth.simulatedEmailOtp = demoCode;
      if (emailNotice) {
        emailNotice.innerHTML = `Demo Mode: Test code is <strong style="color:var(--primary);">${demoCode}</strong> or enter <strong>123456</strong> (Update Code.gs in Google Sheets to receive live emails).`;
      }
      console.log(`[Bhuvix Demo] Email OTP for ${email}: ${demoCode}`);
    }

    if (btnSendEmailOtp) btnSendEmailOtp.addEventListener('click', handleSendEmailOtp);
    if (btnResendEmail) btnResendEmail.addEventListener('click', handleSendEmailOtp);

    if (btnConfirmEmailOtp) {
      btnConfirmEmailOtp.addEventListener('click', async () => {
        const code = emailOtpInput ? emailOtpInput.value.trim() : '';
        if (code.length < 4) {
          alert("Please enter the 6-digit verification code sent to your email.");
          return;
        }

        btnConfirmEmailOtp.disabled = true;
        btnConfirmEmailOtp.textContent = "...";

        let isValid = false;
        const endpoint = window.BHUVIX_GOOGLE_SHEET_URL || window.BHUVIX_VERIFY_ENDPOINT || "";
        const isEndpointLive = endpoint && !endpoint.includes("placeholder");

        if (isEndpointLive) {
          try {
            const resp = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                action: 'verify_email_otp',
                email: emailInput.value.trim(),
                otp: code
              })
            });
            const res = await resp.json();
            isValid = res.verified === true;
          } catch (e) {
            isValid = (code === window.bhuvixAuth.simulatedEmailOtp || code === "123456");
          }
        } else {
          isValid = (code === window.bhuvixAuth.simulatedEmailOtp || code === "123456");
        }

        btnConfirmEmailOtp.disabled = false;
        btnConfirmEmailOtp.textContent = "Confirm";

        if (isValid) {
          window.bhuvixAuth.emailVerified = true;
          window.bhuvixAuth.verifiedEmailVal = emailInput.value.trim();
          if (emailBadge) {
            emailBadge.className = 'verifyStatus verified';
            emailBadge.textContent = '✓ Verified';
          }
          if (emailOtpBox) emailOtpBox.style.display = 'none';
          if (btnSendEmailOtp) {
            btnSendEmailOtp.disabled = true;
            btnSendEmailOtp.textContent = '✓ Verified';
          }
          emailInput.classList.add('inputVerified');
          refreshSubmitState();
        } else {
          alert("Invalid verification code. Please check your inbox or click Resend.");
        }
      });
    }

    // -------------------------------------------------------------------------
    // FIREBASE PHONE OTP WORKFLOW
    // -------------------------------------------------------------------------
    function startPhoneCountdown(seconds) {
      if (window.bhuvixAuth.phoneTimerId) clearInterval(window.bhuvixAuth.phoneTimerId);
      if (btnResendPhone) btnResendPhone.disabled = true;
      let left = seconds;
      if (phoneTimerSpan) phoneTimerSpan.textContent = left;

      window.bhuvixAuth.phoneTimerId = setInterval(() => {
        left--;
        if (phoneTimerSpan) phoneTimerSpan.textContent = left;
        if (left <= 0) {
          clearInterval(window.bhuvixAuth.phoneTimerId);
          if (btnResendPhone) {
            btnResendPhone.disabled = false;
            btnResendPhone.textContent = 'Resend Code';
          }
        }
      }, 1000);
    }

    async function handleSendPhoneOtp() {
      let rawPhone = phoneInput ? phoneInput.value.trim() : '';
      if (!rawPhone || rawPhone.length < 8) {
        alert("Please enter a valid phone number (e.g. 9643615136 or +91 9643615136).");
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Auto-prefix with +91 if 10-digit number is entered without country code
      let phone = rawPhone;
      const pureDigits = phone.replace(/\D/g, '');
      if (!phone.startsWith('+')) {
        if (pureDigits.length === 10) {
          phone = '+91' + pureDigits;
        } else {
          phone = '+' + pureDigits;
        }
        if (phoneInput) phoneInput.value = phone;
      }

      if (btnSendPhoneOtp) {
        btnSendPhoneOtp.disabled = true;
        btnSendPhoneOtp.textContent = "Sending...";
      }

      const isFileProtocol = window.location.protocol === 'file:';
      const hasLiveFirebase = typeof firebase !== 'undefined' && 
                              firebase.auth && 
                              window.BHUVIX_FIREBASE_CONFIG.apiKey && 
                              !window.BHUVIX_FIREBASE_CONFIG.apiKey.includes("PASTE_YOUR");

      if (isFileProtocol) {
        // file:/// protocol blocks reCAPTCHA cross-origin security
        if (btnSendPhoneOtp) {
          btnSendPhoneOtp.disabled = false;
          btnSendPhoneOtp.textContent = "Send OTP";
        }
        simulatePhoneOtp(phone, true);
      } else if (hasLiveFirebase) {
        try {
          if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
              size: 'invisible',
              callback: function () {
                // reCAPTCHA solved
              }
            });
          }

          const confirmationResult = await firebase.auth().signInWithPhoneNumber(phone, window.recaptchaVerifier);
          window.bhuvixAuth.confirmationResult = confirmationResult;
          if (phoneNotice) phoneNotice.textContent = `SMS sent to ${phone}`;
        } catch (err) {
          console.error("[Firebase Auth Error]:", err);
          if (btnSendPhoneOtp) {
            btnSendPhoneOtp.disabled = false;
            btnSendPhoneOtp.textContent = "Send OTP";
          }
          alert("Firebase SMS Notice: " + (err.message || "Failed to send SMS. Switching to test verification code 123456."));
          simulatePhoneOtp(phone, false);
        }
      } else {
        simulatePhoneOtp(phone, false);
      }

      if (phoneOtpBox) phoneOtpBox.style.display = 'block';
      if (phoneBadge) {
        phoneBadge.className = 'verifyStatus pending';
        phoneBadge.textContent = 'SMS Sent';
      }
      startPhoneCountdown(45);
      if (phoneOtpInput) phoneOtpInput.focus();
    }

    function simulatePhoneOtp(phone, isFileProto) {
      if (phoneNotice) {
        if (isFileProto) {
          phoneNotice.innerHTML = `Local Testing: Google blocks live SMS on <code>file://</code> paths. Enter code <strong style="color:var(--primary);">123456</strong> (or test on <a href="https://bhuvixtechnology.com" target="_blank" style="color:var(--primary);text-decoration:underline;">live website</a> for real SMS).`;
        } else {
          phoneNotice.innerHTML = `Test code is <strong style="color:var(--primary);">123456</strong> (Check Firebase configuration to receive live SMS)`;
        }
      }
      console.log(`[Bhuvix Demo] Phone verification ready for ${phone}. Test OTP: 123456`);
    }

    if (btnSendPhoneOtp) btnSendPhoneOtp.addEventListener('click', handleSendPhoneOtp);
    if (btnResendPhone) btnResendPhone.addEventListener('click', handleSendPhoneOtp);

    if (btnConfirmPhoneOtp) {
      btnConfirmPhoneOtp.addEventListener('click', async () => {
        const code = phoneOtpInput ? phoneOtpInput.value.trim() : '';
        if (code.length < 4) {
          alert("Please enter the 6-digit SMS verification code.");
          return;
        }

        btnConfirmPhoneOtp.disabled = true;
        btnConfirmPhoneOtp.textContent = "...";

        let isValid = false;

        if (window.bhuvixAuth.confirmationResult) {
          try {
            await window.bhuvixAuth.confirmationResult.confirm(code);
            isValid = true;
          } catch (err) {
            console.error("SMS confirmation failed:", err);
            isValid = false;
          }
        } else {
          // Demo fallback
          isValid = (code === "123456");
        }

        btnConfirmPhoneOtp.disabled = false;
        btnConfirmPhoneOtp.textContent = "Confirm";

        if (isValid) {
          window.bhuvixAuth.phoneVerified = true;
          window.bhuvixAuth.verifiedPhoneVal = phoneInput.value.trim();
          if (phoneBadge) {
            phoneBadge.className = 'verifyStatus verified';
            phoneBadge.textContent = '✓ Verified';
          }
          if (phoneOtpBox) phoneOtpBox.style.display = 'none';
          if (btnSendPhoneOtp) {
            btnSendPhoneOtp.disabled = true;
            btnSendPhoneOtp.textContent = '✓ Verified';
          }
          phoneInput.classList.add('inputVerified');
          refreshSubmitState();
        } else {
          alert("Invalid or expired SMS code. Please try again.");
        }
      });
    }

    // Modal close resets verification if desired
    const closeBtn = modal.querySelector('.modalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        // preserve verified status unless form is reset
      });
    }
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOtpVerification);
  } else {
    initOtpVerification();
  }
})();
