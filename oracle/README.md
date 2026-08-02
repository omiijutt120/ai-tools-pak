# README — AI Tools Pak daily worker on Oracle Cloud (runbook)
See https://github.com/omiijutt120/ai-tools-pak/tree/main/oracle

# Oracle Cloud Always Free migration — step-by-step

Goal: the daily SEO/GEO/AEO research runs at 08:00 PKT on an Oracle Cloud
free-tier VM, independent of the laptop being on/off/asleep. Reports are
pushed to the private repo **aitoolspak-seo-reports** (readable from any
device at https://github.com/omiijutt120/aitoolspak-seo-reports).

## What you need to do (only you can do these — ~15 minutes)

### Step 1 — Create the Oracle Cloud account
1. Go to https://signup.cloud.oracle.com (the "Start for free" plan).
2. Sign up with email + password, verify the email, then verify the phone
   number with an OTP.
3. Oracle requires a credit/debit card for identity verification.
   **Always Free is genuinely free** — there is a temporary authorization
   hold (typically $1, released) but you are never charged while staying
   inside free-tier limits. Choose the home region closest to Pakistan
   for latency — `ap-mumbai-1` (Mumbai) is the usual choice; Frankfurt
   (`eu-frankfurt-1`) also works well.
4. After signup you land in the Oracle Cloud console.

### Step 2 — Create the VM instance
1. Console: **Compute → Instances → Create instance**.
2. Name: `aitoolspak-daily` (anything).
3. Placement/Image: **Ubuntu 22.04 (or 24.04)** — the ARM (AArch64) image.
4. Shape: **VM.Standard.A1.Flex** (Ampere ARM, 4 OCPU / 24 GB RAM — free).
   Do NOT pick an Intel/AMD shape that exceeds Always Free limits. You may
   reduce OCPU/RAM to 2/12 if preferred — 1 OCPU is enough for this job.
5. **Add SSH keys**: choose "Paste public keys" and paste exactly this:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPoDvFodk/VfBNmIk1wxbpI1ccruUcQG5e84Ca/IVCpz oracle-aitoolspak
```

6. **Boot volume**: default (46.8 GB) is fine and free.
7. **Advanced options → Management → Paste cloud-init script**: open
   `oracle/cloud-init.sh` from this repo, copy its full contents, paste
   into the box.
8. **Create**. Wait ~2–3 minutes for the instance to reach "Running".

### Step 3 — Hand me the public IP
1. In the instance details, copy the **Public IP address** (e.g. 152.70.x.x).
2. Send it to me here in chat. That's it — I will SSH in from your machine
   (the private key is already on this laptop) and finish the provisioning:
   - verify the install (Node, Python, uv, Hermes)
   - inject the `OPENCODE_ZEN_API_KEY` into the VM's Hermes `.env`
     (transferred from this laptop without being displayed)
   - generate git deploy keys for `ai-tools-pak` and
     `aitoolspak-seo-reports`, register them on GitHub
   - copy the SEO history baseline (`seo_daily_history.json`)
   - run a live test of the daily job
   - once a test report lands in the reports repo, I will disable the
     local cron so the job does not run twice

## What the VM does (after provisioning)
- systemd timer `aitoolspak-daily.timer` fires at **08:00 PKT** every day
  (`Persistent=true` → catches up if the VM was off).
- Runs `hermes -z` (one-shot agent) with the prompt in
  `oracle/daily-prompt.md`: pull repo → health check → audits → SERP
  snapshot → indexation → performance → GEO/AEO freshness → write + push
  report to `aitoolspak-seo-reports/<YYYY-MM-DD>.md`.
- All logs: `journalctl -u aitoolspak-daily` and
  `~/daily-run.log`.

## Cost / limits
- A1.Flex 4 OCPU/24 GB, 200 GB block storage, 10 TB egress: all inside
  Always Free. Keep total free resources (instances/storage) under the
  Always Free caps or you will be billed.
- The opencode-zen free model endpoint is reachable from the VM the same
  way it is from the laptop; if Oracle's IP gets rate-limited by DDG
  (datacenter IPs throttle faster than home IPs), the daily job already
  waits between queries and degrades gracefully.

## Verification checklist (what "done" looks like)
1. `ssh -i ~/.ssh/oracle_aitoolspak ubuntu@<IP>` works.
2. `systemctl list-timers aitoolspak-daily` shows the timer armed.
3. A report file exists in the reports repo dated today.
4. Local cron job `e58df7081117` is paused/removed (I do this after #3).
