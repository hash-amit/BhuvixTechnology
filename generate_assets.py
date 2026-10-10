import os

def create_svgs():
    assets = {
        "assets/logo.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <defs>
    <linearGradient id="bhuvixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7a18" />
      <stop offset="50%" stop-color="#ff4500" />
      <stop offset="100%" stop-color="#ffd21f" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="6" y="6" width="88" height="88" rx="24" fill="#090d16" stroke="url(#bhuvixGrad)" stroke-width="2.5"/>
  <path d="M28 26 L46 26 C57 26 64 32 64 41 C64 48 59 52 52 54 C62 56 68 62 68 72 C68 82 59 88 47 88 L28 88 Z" fill="none" stroke="url(#bhuvixGrad)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="32" y1="55" x2="52" y2="55" stroke="url(#bhuvixGrad)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="70" cy="30" r="5" fill="#ffd21f" filter="url(#glow)"/>
  <path d="M60 48 L76 64 M76 48 L60 64" stroke="#ff7a18" stroke-width="4.5" stroke-linecap="round"/>
</svg>''',

        "assets/logo-horizontal.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" fill="none">
  <defs>
    <linearGradient id="bGradH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7a18" />
      <stop offset="100%" stop-color="#ffd21f" />
    </linearGradient>
  </defs>
  <g transform="translate(4, 6) scale(0.55)">
    <rect x="4" y="4" width="84" height="84" rx="22" fill="#0c101c" stroke="url(#bGradH)" stroke-width="3"/>
    <path d="M26 24 L44 24 C54 24 62 30 62 39 C62 46 56 50 50 52 C58 54 64 60 64 69 C64 78 56 84 44 84 L26 84 Z" fill="none" stroke="url(#bGradH)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="28" y1="52" x2="48" y2="52" stroke="url(#bGradH)" stroke-width="6" stroke-linecap="round"/>
    <circle cx="68" cy="28" r="4.5" fill="#ffd21f"/>
  </g>
  <text x="66" y="38" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="700" font-size="22" fill="#080808" letter-spacing="-0.03em">BHUVIX<tspan fill="#ff6b2c">TECH</tspan></text>
  <text x="68" y="50" font-family="'DM Sans', sans-serif" font-weight="600" font-size="8.5" fill="#717a84" letter-spacing="0.22em">GLOBAL CAREER INFRASTRUCTURE</text>
</svg>''',

        "assets/logo-horizontal-white.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" fill="none">
  <defs>
    <linearGradient id="bGradHW" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7a18" />
      <stop offset="100%" stop-color="#ffd21f" />
    </linearGradient>
  </defs>
  <g transform="translate(4, 6) scale(0.55)">
    <rect x="4" y="4" width="84" height="84" rx="22" fill="#141926" stroke="url(#bGradHW)" stroke-width="3"/>
    <path d="M26 24 L44 24 C54 24 62 30 62 39 C62 46 56 50 50 52 C58 54 64 60 64 69 C64 78 56 84 44 84 L26 84 Z" fill="none" stroke="url(#bGradHW)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="28" y1="52" x2="48" y2="52" stroke="url(#bGradHW)" stroke-width="6" stroke-linecap="round"/>
    <circle cx="68" cy="28" r="4.5" fill="#ffd21f"/>
  </g>
  <text x="66" y="38" font-family="'Space Grotesk', -apple-system, sans-serif" font-weight="700" font-size="22" fill="#ffffff" letter-spacing="-0.03em">BHUVIX<tspan fill="#ff6b2c">TECH</tspan></text>
  <text x="68" y="50" font-family="'DM Sans', sans-serif" font-weight="600" font-size="8.5" fill="#9ea7b2" letter-spacing="0.22em">GLOBAL CAREER INFRASTRUCTURE</text>
</svg>''',

        "assets/badge-everify.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" fill="none">
  <rect width="160" height="50" rx="8" fill="#ffffff" stroke="#d5dbe2" stroke-width="1.5"/>
  <circle cx="25" cy="25" r="14" fill="#003366"/>
  <path d="M19 25 L23 29 L31 20" stroke="#ffd21f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="46" y="24" font-family="'Space Grotesk', sans-serif" font-size="13" font-weight="700" fill="#003366">E-Verify</text>
  <text x="46" y="36" font-family="'DM Sans', sans-serif" font-size="8.5" font-weight="500" fill="#606d7b">Employer Agent</text>
</svg>''',

        "assets/badge-dhs.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" fill="none">
  <rect width="160" height="50" rx="8" fill="#ffffff" stroke="#d5dbe2" stroke-width="1.5"/>
  <circle cx="25" cy="25" r="14" fill="#0d2c54"/>
  <circle cx="25" cy="25" r="11" fill="none" stroke="#ffd21f" stroke-width="1.2"/>
  <text x="25" y="28" font-family="sans-serif" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">DHS</text>
  <text x="46" y="24" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="700" fill="#0d2c54">U.S. DHS</text>
  <text x="46" y="36" font-family="'DM Sans', sans-serif" font-size="8" font-weight="500" fill="#606d7b">Compliance Assured</text>
</svg>''',

        "assets/badge-ssa.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" fill="none">
  <rect width="160" height="50" rx="8" fill="#ffffff" stroke="#d5dbe2" stroke-width="1.5"/>
  <circle cx="25" cy="25" r="14" fill="#1b4965"/>
  <circle cx="25" cy="25" r="11" fill="none" stroke="#a2d2ff" stroke-width="1.2"/>
  <text x="25" y="28" font-family="sans-serif" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">SSA</text>
  <text x="46" y="24" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="700" fill="#1b4965">SSA Verified</text>
  <text x="46" y="36" font-family="'DM Sans', sans-serif" font-size="8" font-weight="500" fill="#606d7b">Authorized Partner</text>
</svg>''',
    }

    # Enterprise Partner Logos
    partners = [
        ("walmart", "Walmart", "#0071dc", '<path d="M14 6 L14 18 M6 14 L18 6 M6 6 L18 14" stroke="#ffc220" stroke-width="3" stroke-linecap="round"/>'),
        ("deloitte", "Deloitte.", "#000000", '<circle cx="68" cy="18" r="3.5" fill="#86bc25"/>'),
        ("ibm", "IBM", "#1f70c1", '<text x="10" y="22" font-family="sans-serif" font-size="18" font-weight="900" fill="#1f70c1" letter-spacing="2">IBM</text>'),
        ("google", "Google", "#4285f4", '<text x="8" y="22" font-family="sans-serif" font-size="18" font-weight="700" fill="#ea4335">G<tspan fill="#ea4335">o</tspan><tspan fill="#fbbc05">o</tspan><tspan fill="#4285f4">g</tspan><tspan fill="#34a853">l</tspan><tspan fill="#ea4335">e</tspan></text>'),
        ("paypal", "PayPal", "#003087", '<path d="M8 6 L14 6 C18 6 21 8 20 13 C19 17 16 19 12 19 L9 19 L6 30" stroke="#003087" stroke-width="3.5" stroke-linecap="round"/>'),
        ("cognizant", "Cognizant", "#0033a0", '<text x="6" y="21" font-family="sans-serif" font-size="15" font-weight="700" fill="#0033a0">Cognizant</text>'),
        ("wipro", "Wipro", "#1e398b", '<text x="6" y="21" font-family="sans-serif" font-size="17" font-weight="700" fill="#1e398b">wipro</text>'),
        ("capgemini", "Capgemini", "#111111", '<path d="M12 24 C8 20 8 14 14 10 C20 7 26 12 24 18" stroke="#1192e8" stroke-width="3" fill="none"/><text x="32" y="21" font-family="sans-serif" font-size="14" font-weight="700" fill="#111">Capgemini</text>'),
        ("bank-of-america", "Bank of America", "#e31837", '<text x="4" y="20" font-family="sans-serif" font-size="13" font-weight="800" fill="#012169">BANK OF <tspan fill="#e31837">AMERICA</tspan></text>'),
        ("hcl", "HCLTech", "#00539b", '<text x="6" y="21" font-family="sans-serif" font-size="17" font-weight="800" fill="#00539b">HCL<tspan fill="#ff6b2c">Tech</tspan></text>'),
        ("microsoft", "Microsoft", "#737373", '<rect x="4" y="6" width="9" height="9" fill="#f25022"/><rect x="15" y="6" width="9" height="9" fill="#7fba00"/><rect x="4" y="17" width="9" height="9" fill="#00a4ef"/><rect x="15" y="17" width="9" height="9" fill="#ffb900"/><text x="30" y="22" font-family="sans-serif" font-size="15" font-weight="600" fill="#737373">Microsoft</text>'),
        ("cisco", "CISCO", "#00bceb", '<text x="6" y="22" font-family="sans-serif" font-size="18" font-weight="900" fill="#00bceb" letter-spacing="3">CISCO</text>')
    ]

    for p_id, p_name, p_color, p_inner in partners:
        assets[f"assets/partner-{p_id}.svg"] = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 36" fill="none">
  {p_inner}
  {"" if "text" in p_inner else f'<text x="28" y="22" font-family="sans-serif" font-size="16" font-weight="700" fill="{p_color}">{p_name}</text>'}
</svg>'''

    for path, content in assets.items():
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f"Created {path}")

create_svgs()
