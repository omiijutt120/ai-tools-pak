#!/bin/bash
# ============================================================================
# AI Tools Pak — Oracle Cloud Always Free daily worker (cloud-init script)
# Paste into: Console > Compute > Instances > Create instance >
#            Advanced options > Management > Paste cloud-init script
# Runs once as root on first boot. Finishing steps (API key, deploy keys)
# are done via SSH by the provisioning agent — see oracle/README.md.
# ============================================================================
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
REPO_URL="https://github.com/omiijutt120/ai-tools-pak.git"
REPORTS_URL="https://github.com/omiijutt120/aitoolspak-seo-reports.git"
TZ_NAME="Asia/Karachi"

# Default user on Oracle Ubuntu images
APP_USER="ubuntu"
APP_HOME="/home/${APP_USER}"

log() { echo "[cloud-init] $*"; }

log "=== AI Tools Pak daily worker provisioning ==="

# --- 1. Timezone: 08:00 must mean Pakistan time ----------------------------
timedatectl set-timezone "${TZ_NAME}" || true
log "timezone: $(timedatectl show -p Timezone --value 2>/dev/null || echo ${TZ_NAME})"

# --- 2. System packages -----------------------------------------------------
apt-get update -y
apt-get install -y --no-install-recommends \
  curl ca-certificates git jq python3 python3-venv python3-pip unzip \
  build-essential

# Node 20 (Oracle ARM repo defaults are old)
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - || true
  apt-get install -y nodejs || apt-get install -y --no-install-recommends nodejs
fi
log "node: $(node --version 2>/dev/null || echo missing), python3: $(python3 --version 2>/dev/null || echo missing)"

# --- 3. uv (Hermes installer dependency) ------------------------------------
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh || true
fi
# ensure uv on PATH for the user session
echo 'export PATH="$HOME/.local/bin:$PATH"' > /etc/profile.d/uv-path.sh

# --- 4. App user setup (Hermes installs into $HOME) -------------------------
cat > /tmp/user-setup.sh <<'USEREOF'
#!/bin/bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
export PATH="$HOME/.local/bin:$PATH"
APP_HOME="$HOME"
REPO_URL="https://github.com/omiijutt120/ai-tools-pak.git"
REPORTS_URL="https://github.com/omiijutt120/aitoolspak-seo-reports.git"

log() { echo "[user-setup] $*"; }

# --- 4a. Clone repos --------------------------------------------------------
cd "$APP_HOME"
[ -d ai-tools-pak ] || git clone -q "$REPO_URL" ai-tools-pak
[ -d aitoolspak-seo-reports ] || git clone -q "$REPORTS_URL" aitoolspak-seo-reports
git -C ai-tools-pak config user.name "AI Tools Pak Bot"
git -C ai-tools-pak config user.email "omiijutt120@users.noreply.github.com"
git -C aitoolspak-seo-reports config user.name "AI Tools Pak Bot"
git -C aitoolspak-seo-reports config user.email "omiijutt120@users.noreply.github.com"
log "repos cloned"

# --- 4b. Hermes agent -------------------------------------------------------
if ! command -v hermes >/dev/null 2>&1 && [ ! -x "$HOME/.local/bin/hermes" ]; then
  curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
fi
export PATH="$HOME/.local/bin:$PATH"
log "hermes: $(hermes --version 2>/dev/null || echo 'installed but check PATH')"

# Hermes home
export HERMES_HOME="$HOME/.hermes"
mkdir -p "$HERMES_HOME"

# Provider key placeholder — real value injected by provisioning via SSH.
# (NEVER put the real API key inside cloud-init userdata; it is visible
#  in the instance metadata.)
if [ ! -f "$HERMES_HOME/.env" ]; then
  echo "# Hermes environment (provisioned)" > "$HERMES_HOME/.env"
  echo "OPENCODE_ZEN_API_KEY=" >> "$HERMES_HOME/.env"
fi

# --- 4c. Daily job files ----------------------------------------------------
mkdir -p "$APP_HOME/reports" "$APP_HOME/logs"
# daily prompt + wrapper are taken from the repo (single source of truth)
ln -sf "$APP_HOME/ai-tools-pak/oracle/daily-prompt.md" "$APP_HOME/daily-prompt.md"
ln -sf "$APP_HOME/ai-tools-pak/oracle/run-daily.sh"   "$APP_HOME/run-daily.sh"
chmod +x "$APP_HOME/run-daily.sh"

# --- 4d. SSH deploy keys for push access (registered on GitHub later) -------
if [ ! -f "$HOME/.ssh/id_ed25519" ]; then
  mkdir -p "$HOME/.ssh" && chmod 700 "$HOME/.ssh"
  ssh-keygen -t ed25519 -N "" -C "aitoolspak-vm" -f "$HOME/.ssh/id_ed25519" -q
fi
log "deploy key ready: $(cat "$HOME/.ssh/id_ed25519.pub")"

# --- 4e. Baseline SEO history (provisioner may overwrite with laptop copy) --
[ -f "$APP_HOME/seo_daily_history.json" ] || echo '{}' > "$APP_HOME/seo_daily_history.json"
USEREOF

chmod +x /tmp/user-setup.sh
runuser -u "${APP_USER}" -- /bin/bash /tmp/user-setup.sh
log "user setup done"

# --- 5. systemd timer (08:00 PKT, persistent) -------------------------------
cat > /etc/systemd/system/aitoolspak-daily.service <<UNIT
[Unit]
Description=AI Tools Pak daily SEO/GEO research
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=${APP_USER}
WorkingDirectory=${APP_HOME}
Environment=HOME=${APP_HOME}
Environment=PATH=/home/${APP_USER}/.local/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/bin/bash ${APP_HOME}/run-daily.sh
UNIT

cat > /etc/systemd/system/aitoolspak-daily.timer <<UNIT
[Unit]
Description=Run AI Tools Pak daily research at 08:00 PKT

[Timer]
OnCalendar=*-*-* 08:00:00
Persistent=true
Unit=aitoolspak-daily.service

[Install]
WantedBy=timers.target
UNIT

systemctl daemon-reload
systemctl enable aitoolspak-daily.timer
systemctl start aitoolspak-daily.timer
log "timer armed: $(systemctl list-timers aitoolspak-daily --no-pager | grep aitoolspak || true)"

log "=== cloud-init provisioning complete ==="
