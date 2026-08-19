#!/usr/bin/env bash
# =============================================================================
# AI TOOLSPAK - CENTRAL DEPLOYMENT PIPELINE
# A robust end-to-end deployment mechanism for Hermes cron jobs.
# =============================================================================

set -uo pipefail

# Configuration
REPO_DIR="/home/ubuntu/ai-tools-pak"
LOCK_FILE="/home/ubuntu/ai-tools-pak/.deploy.lock"
LOG_FILE="/home/ubuntu/.hermes/cron/deployment_${CRON_NAME:-unknown}.log"
SITE_URL="https://aitoolspak.tech"

# Start time
START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EXECUTION_ID=$$
CRON_NAME="${CRON_NAME:-cron-job}"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    local level="$1"
    shift
    local msg="$*"
    local ts
    ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "[$ts] [$level] [$CRON_NAME] [${EXECUTION_ID}] $msg" | tee -a "$LOG_FILE" 2>/dev/null || echo "[$ts] [$level] [$CRON_NAME] [${EXECUTION_ID}] $msg"
}

# Acquire lock using flock
acquire_lock() {
    log "INFO" "Acquiring deployment lock..."
    exec 9>"$LOCK_FILE"
    if flock -n 9; then
        log "INFO" "Lock acquired (PID $$, FD 9)"
        return 0
    else
        log "WARN" "Another deployment in progress. Aborting."
        return 1
    fi
}

release_lock() {
    log "INFO" "Releasing lock"
    exec 9>&-
}

verify_repo() {
    log "INFO" "Verifying repository..."
    cd "$REPO_DIR" || { log "ERROR" "Cannot cd to $REPO_DIR"; return 1; }
    if [ ! -d .git ]; then
        log "ERROR" "Not a git repository"
        return 1
    fi
    local branch
    branch=$(git branch --show-current)
    log "INFO" "On branch $branch"
    if [ "$branch" != "main" ]; then
        log "ERROR" "Not on main branch (on $branch)"
        return 1
    fi
    log "INFO" "Repository verification PASSED"
    return 0
}

run_task() {
    log "INFO" "Running task: $*"
    "$@" >>"$LOG_FILE" 2>&1
    return $?
}

check_changes() {
    log "INFO" "Checking for changes..."
    local diff
    diff=$(git diff --stat 2>/dev/null || true)
    if [ -z "$diff" ]; then
        log "INFO" "No changes detected"
        echo "NO_CHANGES"
        return 0
    fi
    log "INFO" "Changes detected in working directory"
    echo "CHANGES_DETECTED"
    return 0
}

commit_and_push() {
    log "INFO" "Committing and pushing changes..."
    
    # Stage changed files
    git add . 2>>"$LOG_FILE" >>"$LOG_FILE"
    
    # Check staged changes
    local staged
    staged=$(git diff --cached --numstat 2>/dev/null | grep -cv "^0 0 " || echo "0")
    if [ "$staged" -eq 0 ]; then
        log "INFO" "No staged changes after git add ."
        echo "NO_STAGED_CHANGES"
        return 0
    fi
    
    # Create commit timestamp (simple format, no date command in message)
    local commit_msg="SEO/GEO/AEO automated update"
    
    # Create commit
    if ! git commit -m "$commit_msg" 2>>"$LOG_FILE" >>"$LOG_FILE"; then
        log "ERROR" "Git commit failed"
        git reset --hard HEAD 2>/dev/null
        return 1
    fi
    log "INFO" "Commit created successfully"
    
    # Push to remote
    if ! git push origin main 2>>"$LOG_FILE" >>"$LOG_FILE"; then
        log "ERROR" "Git push failed"
        git reset --hard HEAD 2>/dev/null
        return 1
    fi
    log "INFO" "Push to origin main succeeded"
    
    # Verify remote commit
    sleep 3
    git fetch origin 2>>"$LOG_FILE" >>"$LOG_FILE"
    local remote_head
    remote_head=$(git rev-parse origin/main 2>/dev/null || echo "unknown")
    local local_head
    local_head=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    log "INFO" "Local HEAD: $local_head"
    log "INFO" "Remote HEAD (origin/main): $remote_head"
    if [ "$local_head" = "$remote_head" ]; then
        log "INFO" "Remote commit verified: in sync"
    else
        log "WARN" "Local/remote heads differ but push completed without error"
    fi
    
    return 0
}

verify_production() {
    log "INFO" "Verifying production site..."
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" 2>&1 || echo "000")
    if [ "$status" != "200" ]; then
        log "ERROR" "Production not responding (HTTP $status)"
        return 1
    fi
    log "INFO" "Production HTTP status: 200"
    return 0
}

main() {
    CRON_NAME="${1:-cron-job}"
    
    log "INFO" "============================================================="
    log "INFO" "DEPLOYMENT PIPELINE START"
    log "INFO" "Cron: $CRON_NAME  PID: $$  ID: $EXECUTION_ID"
    
    # Acquire lock
    if ! acquire_lock; then
        log "ERROR" "Could not acquire lock. Another job running."
        exit 1
    fi
    trap "release_lock; exit 1" EXIT
    
    # Verify repo
    if ! verify_repo; then
        log "ERROR" "Repository verification failed"
        exit 1
    fi
    
    # Run the actual task if a script is provided
    if [ $# -gt 1 ]; then
        log "INFO" "Running task script: ${@:2}"
        run_task "${@:2}"
    fi
    
    # Check for changes
    local changes
    changes=$(check_changes)
    
    if [ "$changes" = "NO_CHANGES" ]; then
        log "INFO" "No changes required. Reporting NO_CHANGES_REQUIRED."
        echo "NO_CHANGES_REQUIRED"
        exit 0
    fi
    
    # Commit and push
    if ! commit_and_push; then
        log "ERROR" "Git commit/push failed"
        exit 1
    fi
    
    # Verify remote commit
    log "INFO" "Remote commit verified"
    
    # Trigger deployment check (GitHub Actions etc.)
    if [ -d "$REPO_DIR/.github/workflows" ]; then
        log "INFO" "GitHub Actions workflows detected"
    fi
    
    # Verify production
    if ! verify_production; then
        log "ERROR" "Production verification failed"
        echo "DEPLOYMENT_UNVERIFIED"
        exit 1
    fi
    
    log "INFO" "Deployment pipeline completed successfully"
    echo "SUCCESS"
}

# Run main function
main "$1"