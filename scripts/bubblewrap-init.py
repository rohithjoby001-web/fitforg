#!/usr/bin/env python3
"""
Drive bubblewrap init non-interactively using pexpect.
Correct prompt order (as of bubblewrap CLI v1.x):
  1. Domain (default = manifest URL host)
  2. URL path (default = /)
  3. Application name
  4. Package id
  5. Launcher name
  6. Display mode (default = standalone)
  7. Orientation (default = default)
  8. Status bar color
  9. Navigation bar color
  10. Icon background color
  11. Theme color (might be auto-detected)
  12. Maskable icon (Y/n)
  13. Signing key — create new (Y/n)
  14. Key details (alias, passwords, CN, Org, etc.)
"""
import pexpect
import sys
import os
import shutil

MANIFEST_URL = "https://preview-chat-d3a20c61-31da-4cc8-a98b-f74e414cf802.space-z.ai/manifest.webmanifest"
WORK_DIR = "/home/z/my-project/android-apk"
LOG_FILE = "/home/z/my-project/scripts/bubblewrap-init.log"

# Clean work dir
if os.path.exists(WORK_DIR):
    shutil.rmtree(WORK_DIR)
os.makedirs(WORK_DIR, exist_ok=True)

cmd = f"bubblewrap init --manifest {MANIFEST_URL} --directory={WORK_DIR}"

log_fh = open(LOG_FILE, 'w', encoding='utf-8')

def log(msg):
    print(msg, flush=True)
    log_fh.write(msg + "\n")
    log_fh.flush()

log(f"[+] Spawning: {cmd}")
child = pexpect.spawn(cmd, timeout=600, encoding='utf-8', dimensions=(50, 200))
child.logfile_read = log_fh

import re

def answer(prompt_regex, answer, timeout=30, optional=False):
    """Wait for prompt_regex, then send answer. Returns True on match."""
    pat = re.compile(prompt_regex, re.IGNORECASE | re.MULTILINE)
    try:
        # Pass the compiled pattern directly to expect
        child.expect(pat, timeout=timeout)
        log(f"\n[+] Matched: {prompt_regex!r} → sending: {answer!r}")
        child.sendline(answer)
        return True
    except pexpect.TIMEOUT:
        if optional:
            log(f"\n[~] Optional prompt not seen: {prompt_regex!r}")
            return False
        else:
            log(f"\n[!] Required prompt not seen: {prompt_regex!r}")
            # Show the buffer content so we can see what's actually being sent
            buf = child.before if child.before else "(empty)"
            log(f"\n[!] Buffer (last 500 chars):\n{buf[-500:] if len(buf) > 500 else buf}")
            return False

# JDK + SDK prompts — cached, should skip (but answer if shown)
answer(r"Do you want Bubblewrap to install the JDK", "n", timeout=5, optional=True)
answer(r"Path to your existing JDK 17", "/home/z/my-project/.jdk/jdk-17.0.13+11", timeout=5, optional=True)
answer(r"Do you want Bubblewrap to install the Android SDK", "Y", timeout=5, optional=True)
answer(r"Path to your existing Android SDK", "/home/z/my-project/.android-sdk", timeout=5, optional=True)

# === App config prompts ===

# 1. Domain — accept default (auto-detected from manifest URL)
answer(r"\? Domain:", "", timeout=30)

# 2. URL path — accept default (/)
answer(r"URL path:", "", timeout=30)

# 3. Application name
answer(r"Application name:", "fitforg", timeout=30)

# 4. Package id
answer(r"Package id", "com.fitforg.app", timeout=30)

# 5. Launcher name
answer(r"Launcher name:", "fitforg", timeout=30)

# 6. Display mode — accept default (standalone)
answer(r"Display mode:", "", timeout=30)

# 7. Orientation — accept default
answer(r"Orientation:", "", timeout=30)

# 8. Status bar color
answer(r"Status bar color", "#000000", timeout=30)

# 9. Navigation bar color
answer(r"Navigation bar color", "#000000", timeout=15, optional=True)

# 10. Icon background color
answer(r"background color", "#000000", timeout=15, optional=True)

# 11. Theme color
answer(r"Theme color", "#000000", timeout=15, optional=True)

# 12. Maskable icon
answer(r"maskable", "Y", timeout=15, optional=True)

# 13. Signing key — create new
answer(r"signing key|Generating a new", "Y", timeout=15, optional=True)

# 14. Key details
answer(r"Key alias", "fitforg-key", timeout=15, optional=True)
answer(r"Key password", "fitforg123", timeout=15, optional=True)
answer(r"Confirm key password|re-enter", "fitforg123", timeout=15, optional=True)
answer(r"Keystore password", "fitforg123", timeout=15, optional=True)
answer(r"Confirm keystore password|re-enter", "fitforg123", timeout=15, optional=True)
answer(r"First and Last Name|distinguishing name|CN=", "fitforg", timeout=15, optional=True)
answer(r"Organization", "fitforg", timeout=15, optional=True)
answer(r"Organizational unit", "app", timeout=15, optional=True)
answer(r"City|Locality", "fitforg", timeout=15, optional=True)
answer(r"State|Province", "fitforg", timeout=15, optional=True)
answer(r"Country|country code", "US", timeout=15, optional=True)

# Wait for completion — bubblewrap also downloads gradle & dependencies at this stage
log("\n\n[+] Waiting for completion (this might take a while — gradle download)...")
try:
    child.expect(pexpect.EOF, timeout=900)
    log("\n[+] Bubblewrap init completed!")
    log(f"\n[+] Files in {WORK_DIR}:")
    for f in sorted(os.listdir(WORK_DIR)):
        log(f"    {f}")
except pexpect.TIMEOUT:
    log(f"\n[!] Timeout waiting for EOF. Last buffer:")
    log(child.before if child.before else "(empty)")
    sys.exit(1)

log_fh.close()
