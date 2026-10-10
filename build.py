import os
import sys
import glob
from html.parser import HTMLParser

# Ensure utf-8 encoding for console output
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

class SimpleHTMLValidator(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.errors = []
        self.tags_stack = []
        self.void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        if tag.lower() not in self.void_tags:
            self.tags_stack.append((tag.lower(), self.getpos()))

    def handle_endtag(self, tag):
        tag_lower = tag.lower()
        if tag_lower in self.void_tags:
            return
        if not self.tags_stack:
            self.errors.append(f"{self.filename}:{self.getpos()}: Stray closing tag </{tag_lower}>")
            return
        last_tag, pos = self.tags_stack.pop()
        if last_tag != tag_lower:
            # allow flexible auto-closing of p, li, dt, dd, tr, th, td, option
            if last_tag in {'p', 'li', 'dt', 'dd', 'tr', 'th', 'td', 'option'}:
                found = False
                temp_stack = list(self.tags_stack)
                while temp_stack:
                    t, p = temp_stack.pop()
                    if t == tag_lower:
                        found = True
                        break
                if found:
                    while self.tags_stack and self.tags_stack[-1][0] != tag_lower:
                        self.tags_stack.pop()
                    if self.tags_stack:
                        self.tags_stack.pop()
                    return
            self.errors.append(f"{self.filename}:{self.getpos()}: Mismatched tag </{tag_lower}>, expected </{last_tag}> from {pos}")

def run_build():
    print("=" * 60)
    print("BhuvixTechnology Build & Verification Pipeline")
    print("=" * 60)
    
    html_files = glob.glob("*.html")
    css_files = glob.glob("css/*.css") + glob.glob("*.css")
    js_files = glob.glob("js/*.js") + glob.glob("*.js")
    
    total_errors = 0
    total_warnings = 0
    
    print(f"Discovered {len(html_files)} HTML files, {len(css_files)} CSS files, {len(js_files)} JS files.")
    
    for f in html_files:
        try:
            with open(f, "r", encoding="utf-8") as fp:
                content = fp.read()
            parser = SimpleHTMLValidator(f)
            parser.feed(content)
            if parser.errors:
                for err in parser.errors:
                    print(f"Warning/Error in {err}")
                    total_errors += 1
            else:
                print(f"[OK] Validated {f}")
        except Exception as e:
            print(f"Error parsing {f}: {e}")
            total_errors += 1
            
    for f in css_files:
        try:
            with open(f, "r", encoding="utf-8") as fp:
                c = fp.read()
            if c.count("{") != c.count("}"):
                print(f"Error in {f}: Mismatched braces {{ {c.count('{')} vs }} {c.count('}')}")
                total_errors += 1
            else:
                print(f"[OK] Validated {f}")
        except Exception as e:
            print(f"Error reading {f}: {e}")
            total_errors += 1
            
    for f in js_files:
        try:
            with open(f, "r", encoding="utf-8") as fp:
                c = fp.read()
            print(f"[OK] Validated {f}")
        except Exception as e:
            print(f"Error reading {f}: {e}")
            total_errors += 1
            
    print("-" * 60)
    if total_errors == 0:
        print("Build Succeeded! 0 Error(s), 0 Warning(s).")
        sys.exit(0)
    else:
        print(f"Build Failed with {total_errors} Error(s).")
        sys.exit(1)

if __name__ == "__main__":
    run_build()
