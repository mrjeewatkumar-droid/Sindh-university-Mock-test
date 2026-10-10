#!/bin/bash
# Mirror collected test results into the GitHub repo.
# Polls the webhook.site inbox for new submissions and commits them to
# results/results.csv + results/results.md (a readable table in the repo).
# Designed to run hourly via cron.
set -u
TOKEN="407f6b18-2aff-4ef6-acef-f773898cb42d"
OWNER="mrjeewatkumar-droid"
REPO="Sindh-university-Mock-test"
STATE_DIR="$HOME/.su-mirror"
LEDGER="$STATE_DIR/ledger.jsonl"
mkdir -p "$STATE_DIR"
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

# 1. Fetch inbox (newest first)
curl -s --max-time 60 "https://webhook.site/token/$TOKEN/requests?sorting=newest&per_page=100" -o "$WORK/inbox.json" || { echo "inbox fetch failed"; exit 1; }

# 2. Extract new, valid results and append to ledger
node -e "
const fs=require('fs');
const inbox=JSON.parse(fs.readFileSync('$WORK/inbox.json','utf8'));
const have=new Set();
try{fs.readFileSync('$LEDGER','utf8').split('\n').filter(Boolean).forEach(l=>{try{have.add(JSON.parse(l)._rid)}catch(e){}})}catch(e){}
const out=[];
for(const r of (inbox.data||[])){
  if(have.has(r.uuid)) continue;
  let p=null; try{p=JSON.parse(r.content)}catch(e){}
  if(!p||typeof p.name!=='string'||typeof p.email!=='string'||typeof p.score!=='number') continue;
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) continue;
  p._rid=r.uuid; p._at=r.created_at;
  out.push(JSON.stringify(p));
}
if(out.length) fs.appendFileSync('$LEDGER', out.join('\n')+'\n');
console.log('new results: '+out.length);
"

# 3. Rebuild CSV + Markdown from ledger
node -e "
const fs=require('fs');
let rows=[]; try{rows=fs.readFileSync('$LEDGER','utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l))}catch(e){}
const secs=t=>{const m={};(t||[]).forEach(s=>m[s.title]=s.correct+'/'+s.total);return m;};
const q=v=>{v=String(v==null?'':v);return /[\",\n]/.test(v)?'\"'+v.replace(/\"/g,'\"\"')+'\"':v;};
const head=['Timestamp','Name','Email','Score','Total','Percentage','English','General Knowledge','Mathematics','IQ','Everyday Science & Computer','Tab Violations','Auto Submitted','Reason'];
const body=rows.map(p=>{const s=secs(p.sections);return [p._at||new Date(p.submittedAt).toISOString(),p.name,p.email,p.score,p.total,p.pct+'%',s['English']||'',s['General Knowledge & Current Affairs']||'',s['Mathematics']||'',s['IQ & Logical Reasoning']||'',s['Everyday Science & Computer']||'',p.violations,p.auto?'Yes':'No',p.reason||''];});
fs.writeFileSync('$WORK/results.csv',[head,...body].map(r=>r.map(q).join(',')).join('\n')+'\n');
const md=['# Test Results','', 'Total attempts: '+body.length,'',
 '| # | Timestamp | Name | Email | Score | Total | % | English | GK | Math | IQ | Science | Violations | Auto | Reason |',
 '|---|-----------|------|-------|-------|-------|---|---------|----|------|----|---------|------------|------|--------|'];
body.forEach((r,i)=>md.push('| '+(i+1)+' | '+r.map(c=>String(c).replace(/\|/g,'\\\\|')).join(' | ')+' |'));
fs.writeFileSync('$WORK/results.md',md.join('\n')+'\n');
console.log('ledger rows: '+rows.length);
"

# 4. Push both files (skip if ledger empty and files don't exist remotely)
if [ ! -s "$LEDGER" ]; then echo "no results yet"; exit 0; fi
push_one() {
  local rp=$1 lp=$2 b64 sha out
  b64=$(base64 -w0 "$lp")
  sha=$(gh api repos/$OWNER/$REPO/contents/"$rp" --jq .sha 2>/dev/null || echo "")
  for i in 1 2 3; do
    if [ -n "$sha" ]; then out=$(gh api -X PUT repos/$OWNER/$REPO/contents/"$rp" -f message="Update test results" -f content="$b64" -f sha="$sha" -f branch=main --jq '.commit.sha' 2>&1)
    else out=$(gh api -X PUT repos/$OWNER/$REPO/contents/"$rp" -f message="Add test results" -f content="$b64" -f branch=main --jq '.commit.sha' 2>&1); fi
    case "$out" in *message*) sleep 5; sha=$(gh api repos/$OWNER/$REPO/contents/"$rp" --jq .sha 2>/dev/null || echo "");; *) echo "$rp -> $out"; return 0;; esac
  done
  echo "FAILED $rp"; return 1
}
push_one results/results.csv "$WORK/results.csv" && push_one results/results.md "$WORK/results.md" && echo "MIRROR OK"
