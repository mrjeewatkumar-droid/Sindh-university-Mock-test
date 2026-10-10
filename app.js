/* Sindh University Entry Test — Mock Practice Paper
   Single-page test app. Static site, no backend required.
   - Email can attempt once (tracked per browser via localStorage)
   - 90-minute timer, auto-submit on expiry
   - Tab-switch restriction: 3 violations = auto-submit
   - Result shown on submit; full history stored for the publisher
*/
(function () {
  "use strict";

  var TOTAL = QUESTIONS.length;
  var TIME_MS = CONFIG.TIME_LIMIT_MINUTES * 60 * 1000;
  var SESSION_KEY = "su_active_session_v1";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var session = null;      // {name,email,endTime,startedAt,answers,violations}
  var submitted = false;
  var timerId = null;

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function show(id) { $(id).classList.remove("hidden"); }
  function hide(id) { $(id).classList.add("hidden"); }

  /* ---------- storage ---------- */
  function getAttempts() {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveAttempts(a) {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(a)); } catch (e) {}
  }
  function saveSession() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
  }
  function loadSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
    catch (e) { return null; }
  }
  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  /* ---------- toast ---------- */
  var toastTimer = null;
  function toast(msg, isAlert) {
    var t = $("toast");
    t.textContent = msg;
    t.className = "toast" + (isAlert ? " alert" : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.add("hidden"); }, 4000);
  }

  /* ---------- start screen ---------- */
  function emailUsed(email) {
    var low = email.trim().toLowerCase();
    return getAttempts().some(function (a) { return (a.email || "").toLowerCase() === low; });
  }

  function fmtLeft(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60), ss = s % 60;
    return m + ":" + (ss < 10 ? "0" : "") + ss;
  }

  function refreshResumeBox() {
    var s = loadSession();
    var box = $("resume-box");
    if (s && s.endTime > Date.now() && !submitted) {
      show("resume-box");
      $("resume-time").textContent = fmtLeft(s.endTime - Date.now());
    } else {
      hide("resume-box");
      if (s) clearSession();
    }
  }

  function beginTest(name, email, existing) {
    if (existing) {
      session = existing;
    } else {
      var now = Date.now();
      session = {
        name: name, email: email,
        startedAt: now, endTime: now + TIME_MS,
        answers: {}, violations: 0
      };
    }
    submitted = false;
    saveSession();
    hide("screen-start"); hide("screen-result"); show("screen-quiz");
    $("qh-candidate").textContent = session.name + " · " + session.email;
    renderQuiz();
    updateAnswered();
    updateViolations();
    startTimer();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);
  }

  /* ---------- quiz rendering ---------- */
  function sectionOf(qIndex) {
    var n = qIndex + 1;
    for (var i = 0; i < SECTIONS.length; i++) {
      if (n >= SECTIONS[i].from && n <= SECTIONS[i].to) return SECTIONS[i];
    }
    return SECTIONS[0];
  }

  function renderQuiz() {
    var wrap = $("questions");
    var pal = $("palette");
    wrap.innerHTML = ""; pal.innerHTML = "";
    var html = "";
    var cur = null;
    for (var i = 0; i < TOTAL; i++) {
      var sec = sectionOf(i);
      if (sec !== cur) {
        cur = sec;
        html += '<h2 class="section-head" id="sec-' + sec.id + '">' +
          esc(sec.title) + ' <span style="font-size:14px;color:#66716b">(Q' +
          sec.from + '–' + sec.to + ')</span></h2>';
      }
      var q = QUESTIONS[i];
      html += '<div class="question" id="qcard-' + i + '">' +
        '<span class="q-num">Q' + (i + 1) + '</span>' +
        '<div class="q-text">' + esc(q[0]) + '</div><div class="options">';
      for (var o = 0; o < 4; o++) {
        var checked = session.answers[i] === o ? " checked" : "";
        html += '<label><input type="radio" name="q' + i + '" value="' + o + '"' + checked +
          '><span class="opt-letter">' + ANSWER_LETTERS[o] + ')</span><span>' + esc(q[1][o]) + '</span></label>';
      }
      html += '</div></div>';
    }
    wrap.innerHTML = html;

    var ph = "";
    for (var j = 0; j < TOTAL; j++) {
      var cls = session.answers[j] !== undefined ? "answered" : "";
      if (j === 0 || sectionOf(j) !== sectionOf(j - 1)) cls += " sec-start";
      ph += '<button data-q="' + j + '" class="' + cls + '">' + (j + 1) + '</button>';
    }
    pal.innerHTML = ph;

    wrap.addEventListener("change", function (e) {
      if (e.target && e.target.name && e.target.name.charAt(0) === "q") {
        var qi = parseInt(e.target.name.slice(1), 10);
        session.answers[qi] = parseInt(e.target.value, 10);
        saveSession();
        updateAnswered();
        var btn = pal.querySelector('button[data-q="' + qi + '"]');
        if (btn) btn.classList.add("answered");
        var lbl = e.target.closest("label");
        var card = e.target.closest(".question");
        card.querySelectorAll("label").forEach(function (l) { l.classList.remove("chosen"); });
        if (lbl) lbl.classList.add("chosen");
      }
    });
    pal.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var card = $("qcard-" + b.getAttribute("data-q"));
      if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    // mark previously chosen labels (resume)
    Object.keys(session.answers).forEach(function (k) {
      var card = $("qcard-" + k);
      if (!card) return;
      var inp = card.querySelector('input[value="' + session.answers[k] + '"]');
      if (inp && inp.closest("label")) inp.closest("label").classList.add("chosen");
    });
  }

  function countAnswered() { return Object.keys(session.answers).length; }
  function updateAnswered() {
    $("answered-count").textContent = countAnswered() + " / " + TOTAL + " answered";
  }
  function updateViolations() {
    var v = $("violations");
    v.textContent = "Tab violations: " + session.violations + "/" + CONFIG.MAX_TAB_VIOLATIONS;
    v.classList.toggle("warn", session.violations > 0);
  }

  /* ---------- timer ---------- */
  function startTimer() {
    clearInterval(timerId);
    var el = $("timer");
    function tick() {
      var left = session.endTime - Date.now();
      if (left <= 0) {
        el.textContent = "0:00";
        finalize(true, "Time expired — auto-submitted");
        return;
      }
      el.textContent = fmtLeft(left);
      el.classList.toggle("low", left <= 5 * 60 * 1000);
    }
    tick();
    timerId = setInterval(tick, 1000);
  }

  /* ---------- tab-switch restriction ---------- */
  function onVisibility() {
    if (submitted || !session) return;
    if (document.hidden) {
      session.violations++;
      saveSession();
      updateViolations();
      if (session.violations >= CONFIG.MAX_TAB_VIOLATIONS) {
        finalize(true, "Auto-submitted: tab-switching limit reached");
      } else {
        toast("⚠️ Warning " + session.violations + "/" + CONFIG.MAX_TAB_VIOLATIONS +
          ": leaving the test tab is not allowed. " +
          (CONFIG.MAX_TAB_VIOLATIONS - session.violations) + " warning(s) left.", true);
      }
    }
  }
  function onBeforeUnload(e) {
    if (!submitted && session) { e.preventDefault(); e.returnValue = ""; }
  }

  /* ---------- submit / scoring ---------- */
  function requestSubmit() {
    if (submitted) return;
    var un = TOTAL - countAnswered();
    if (un > 0 && !confirm("You have " + un + " unanswered question(s). Submit anyway?")) return;
    finalize(false, "Submitted by candidate");
  }

  function scoreSections() {
    return SECTIONS.map(function (sec) {
      var correct = 0;
      for (var n = sec.from; n <= sec.to; n++) {
        var i = n - 1;
        if (session.answers[i] === QUESTIONS[i][2]) correct++;
      }
      return { id: sec.id, title: sec.title, from: sec.from, to: sec.to, correct: correct, total: sec.to - sec.from + 1 };
    });
  }

  /* ---------- central results collector (no setup needed) ----------
     Every submission is POSTed to a collector inbox; an hourly job mirrors
     new results into the GitHub repo (results/results.md + results.csv). */
  function buildResultPayload(attempt) {
    var answerString = [];
    for (var i = 0; i < TOTAL; i++) {
      var a = attempt.answers[i];
      answerString.push((i + 1) + (a === undefined ? "-" : ANSWER_LETTERS[a]));
    }
    return {
      secret: CONFIG.RESULTS_SECRET,
      name: attempt.name, email: attempt.email,
      score: attempt.score, total: attempt.total, pct: attempt.pct,
      sections: attempt.sections,
      startedAt: attempt.startedAt, submittedAt: attempt.submittedAt,
      violations: attempt.violations,
      auto: attempt.auto, reason: attempt.reason,
      answerString: answerString.join(" ")
    };
  }
  function sendResultToCollector(attempt) {
    if (!CONFIG.COLLECTOR_URL) return;
    try {
      // no-cors + text/plain: the POST goes through without a preflight.
      fetch(CONFIG.COLLECTOR_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(buildResultPayload(attempt))
      }).catch(function () { /* local result is unaffected by logging failures */ });
    } catch (e) { /* never block the result screen */ }
  }

  /* ---------- central results dashboard (Google Sheet, optional) ---------- */
  function sendResultToSheet(attempt) {
    if (!CONFIG.RESULTS_URL) return;
    try {
      var payload = buildResultPayload(attempt);
      // text/plain avoids a CORS preflight; Apps Script parses the body as JSON.
      fetch(CONFIG.RESULTS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).catch(function () { /* local result is unaffected by logging failures */ });
    } catch (e) { /* never block the result screen */ }
  }

  function finalize(auto, reason) {
    if (submitted) return;
    submitted = true;
    clearInterval(timerId);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("beforeunload", onBeforeUnload);

    var sections = scoreSections();
    var score = sections.reduce(function (s, x) { return s + x.correct; }, 0);
    var now = Date.now();
    var attempt = {
      name: session.name, email: session.email,
      score: score, total: TOTAL,
      pct: Math.round(score / TOTAL * 100),
      sections: sections.map(function (x) { return { title: x.title, correct: x.correct, total: x.total }; }),
      startedAt: session.startedAt, submittedAt: now,
      violations: session.violations,
      auto: !!auto, reason: reason,
      answers: session.answers
    };
    var a = getAttempts();
    a.push(attempt);
    saveAttempts(a);
    sendResultToCollector(attempt);
    sendResultToSheet(attempt);
    clearSession();
    renderResult(attempt);
    hide("screen-quiz"); show("screen-result");
    window.scrollTo(0, 0);
    if (auto) setTimeout(function () { toast(reason, true); }, 300);
  }

  /* ---------- result ---------- */
  function renderResult(attempt) {
    $("result-candidate").textContent = attempt.name + " · " + attempt.email;
    $("result-score").textContent = attempt.score;
    $("result-pct").textContent = attempt.pct + "%";
    var note = attempt.pct >= 80 ? "Excellent" : attempt.pct >= 60 ? "Good" :
               attempt.pct >= 50 ? "Satisfactory" : "Needs improvement";
    $("result-note").textContent = note;
    $("result-meta").textContent =
      "Submitted " + new Date(attempt.submittedAt).toLocaleString() +
      " · Tab violations: " + attempt.violations +
      (attempt.auto ? " · " + attempt.reason : "");

    var tb = $("result-breakdown").querySelector("tbody");
    tb.innerHTML = attempt.sections.map(function (s) {
      return "<tr><td>" + esc(s.title) + "</td><td>" + s.total + "</td><td>" +
        s.correct + "</td><td>" + s.correct + " / " + s.total + "</td></tr>";
    }).join("");

    var rev = $("result-review");
    var html = "";
    for (var i = 0; i < TOTAL; i++) {
      var q = QUESTIONS[i];
      var picked = attempt.answers[i];
      var correct = q[2];
      html += '<div class="question"><span class="q-num">Q' + (i + 1) + '</span>' +
        '<div class="q-text">' + esc(q[0]) + '</div>';
      if (picked === undefined) {
        html += '<div class="rev-skip">Not answered. Correct answer: ' +
          ANSWER_LETTERS[correct] + ") " + esc(q[1][correct]) + '</div>';
      } else {
        for (var o = 0; o < 4; o++) {
          var cls = "rev-opt";
          var tag = "";
          if (o === correct) { cls += " correct"; tag = '<span class="rev-tag ok">✓ Correct answer</span>'; }
          if (o === picked && o !== correct) { cls += " wrong-pick"; tag = '<span class="rev-tag bad">✗ Your answer</span>'; }
          if (o === picked && o === correct) { tag = '<span class="rev-tag ok">✓ Your answer</span>'; }
          html += '<div class="' + cls + '"><strong>' + ANSWER_LETTERS[o] + ')</strong> ' +
            esc(q[1][o]) + tag + '</div>';
        }
      }
      html += '</div>';
    }
    rev.innerHTML = html;

    $("btn-download-csv").onclick = function () { downloadCSV([attempt], "test-result-" + safe(attempt.email) + ".csv"); };
  }

  /* ---------- CSV ---------- */
  function safe(s) { return String(s).replace(/[^\w.-]+/g, "_"); }
  function csvCell(v) {
    v = String(v == null ? "" : v);
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function attemptToRow(a, idx) {
    var secs = {};
    (a.sections || []).forEach(function (s) { secs[s.title] = s.correct + "/" + s.total; });
    return [
      idx, a.name, a.email, a.score, a.total, a.pct + "%",
      new Date(a.startedAt).toLocaleString(),
      new Date(a.submittedAt).toLocaleString(),
      a.violations, a.auto ? "Yes" : "No", a.reason || "",
      secs["English"] || "", secs["General Knowledge & Current Affairs"] || "",
      secs["Mathematics"] || "", secs["IQ & Logical Reasoning"] || "",
      secs["Everyday Science & Computer"] || ""
    ].map(csvCell).join(",");
  }
  function downloadCSV(attempts, filename) {
    var header = ["#", "Name", "Email", "Score", "Total", "Percentage", "Started", "Submitted",
      "TabViolations", "AutoSubmitted", "Reason", "English", "GK", "Math", "IQ", "Science"].map(csvCell).join(",");
    var rows = attempts.map(function (a, i) { return attemptToRow(a, i + 1); });
    var blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    var aEl = document.createElement("a");
    aEl.href = URL.createObjectURL(blob);
    aEl.download = filename || "test-history.csv";
    document.body.appendChild(aEl);
    aEl.click();
    setTimeout(function () { URL.revokeObjectURL(aEl.href); aEl.remove(); }, 500);
  }

  /* ---------- admin ---------- */
  function renderHistory() {
    var a = getAttempts();
    var tb = $("history-table").querySelector("tbody");
    if (!a.length) {
      tb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#66716b">No attempts yet.</td></tr>';
      return;
    }
    tb.innerHTML = a.map(function (x, i) {
      return "<tr><td>" + (i + 1) + "</td><td>" + esc(x.name) + "</td><td>" + esc(x.email) +
        "</td><td><strong>" + x.score + "/" + x.total + "</strong></td><td>" + x.pct + "%</td><td>" +
        x.violations + "</td><td>" + esc(new Date(x.submittedAt).toLocaleString()) +
        "</td><td>" + (x.auto ? "Yes" : "No") + "</td></tr>";
    }).join("");
  }

  /* ---------- events ---------- */
  $("btn-start").addEventListener("click", function () {
    var name = $("input-name").value.trim();
    var email = $("input-email").value.trim();
    var err = $("start-error");
    function fail(msg) { err.textContent = msg; show("start-error"); }
    hide("start-error");
    if (!name) return fail("Please enter your full name.");
    if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.");
    if (emailUsed(email)) return fail("This email has already been used for this test. Each email can attempt the test only once.");
    beginTest(name, email, null);
  });

  $("btn-resume").addEventListener("click", function () {
    var s = loadSession();
    if (!s) { refreshResumeBox(); return; }
    if (emailUsed(s.email)) {
      clearSession();
      $("start-error").textContent = "This email has already submitted the test and cannot resume.";
      show("start-error");
      refreshResumeBox();
      return;
    }
    beginTest(s.name, s.email, s);
  });

  $("btn-submit").addEventListener("click", requestSubmit);
  $("btn-submit-bottom").addEventListener("click", requestSubmit);
  $("btn-new").addEventListener("click", function () {
    hide("screen-result"); show("screen-start");
    $("input-name").value = ""; $("input-email").value = "";
    refreshResumeBox();
  });

  $("btn-admin").addEventListener("click", function () {
    show("admin-modal"); hide("admin-error");
    $("input-admin-code").value = "";
    hide("admin-view"); show("admin-login");
  });
  $("btn-admin-close").addEventListener("click", function () { hide("admin-modal"); });
  $("admin-modal").addEventListener("click", function (e) {
    if (e.target === $("admin-modal")) hide("admin-modal");
  });
  $("btn-admin-login").addEventListener("click", function () {
    if ($("input-admin-code").value === CONFIG.ADMIN_CODE) {
      hide("admin-login"); show("admin-view"); hide("admin-error");
      renderHistory();
    } else {
      $("admin-error").textContent = "Incorrect publisher code.";
      show("admin-error");
    }
  });
  $("btn-export-all").addEventListener("click", function () {
    var a = getAttempts();
    if (!a.length) return toast("No attempts to export yet.");
    downloadCSV(a, "sindh-test-history.csv");
  });
  $("btn-clear-history").addEventListener("click", function () {
    if (confirm("Delete ALL saved test history? This cannot be undone.")) {
      saveAttempts([]);
      renderHistory();
      toast("Test history cleared.");
    }
  });

  refreshResumeBox();
  setInterval(refreshResumeBox, 5000);
})();
