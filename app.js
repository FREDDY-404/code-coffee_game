/* =========================
   Navigation (Tabs)
========================= */
const views = ["homeView", "charadesView", "debugView"];
const tabButtons = document.querySelectorAll(".tab");

function showView(id) {
  views.forEach(v => document.getElementById(v).classList.remove("active"));
  document.getElementById(id).classList.add("active");
  tabButtons.forEach(b => b.classList.toggle("active", b.dataset.view === id));
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

document.getElementById("goCharades").addEventListener("click", () => showView("charadesView"));
document.getElementById("goDebug").addEventListener("click", () => showView("debugView"));

/* =========================
   Global Stats (Home)
========================= */
let statCharadesScore = 0;
let statDebugRounds = 0;
let statTotalAnswers = 0;

function updateHomeStats() {
  document.getElementById("statCharadesScore").textContent = String(statCharadesScore);
  document.getElementById("statDebugRounds").textContent = String(statDebugRounds);
  document.getElementById("statTotalAnswers").textContent = String(statTotalAnswers);

  const top = getTopTeamName();
  document.getElementById("statDebugTopTeam").textContent = top || "-";
}

/* =========================
   Programming Charades
========================= */
// Real programming language logos (served from the Devicon CDN).
const LANGS = [
  { name: "Golang", aliases: ["golang", "go"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
  { name: "Type Script", aliases: ["type script", "typescript", "ts"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "C#", aliases: ["c#", "csharp", "c sharp"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
  { name: "Python", aliases: ["python", "py"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "JavaScript", aliases: ["javascript", "js", "java script"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Java", aliases: ["java"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "C++", aliases: ["c++", "cpp", "c plus plus"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Ruby", aliases: ["ruby", "rb"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" },
  { name: "Swift", aliases: ["swift"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
  { name: "Kotlin", aliases: ["kotlin", "kt"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
  { name: "Rust", aliases: ["rust"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg" },
  { name: "CSS", aliases: ["css", "cascading style sheets"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "HTML", aliases: ["html", "html5"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "PHP", aliases: ["php"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "C", aliases: ["c", "c language"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  { name: "R", aliases: ["r", "r language"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
  { name: "Dart", aliases: ["dart"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
  { name: "Bash", aliases: ["bash", "shell", "sh"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
  { name: "Lua", aliases: ["lua"], logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg" },
];

function showLanguageLogo(lang) {
  logoFrame.innerHTML = "";

  const logoWrap = document.createElement("div");
  logoWrap.className = "logoCard";

  const img = document.createElement("img");
  img.src = lang.logo;
  img.alt = `${lang.name} logo`;
  img.loading = "eager";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";

  const caption = document.createElement("div");
  caption.className = "logoCaption";
  caption.textContent = `Language: ${lang.name}`;

  img.addEventListener("error", () => {
    img.replaceWith(buildLogoFallback(lang.name));
  });

  logoWrap.appendChild(img);
  logoWrap.appendChild(caption);
  logoFrame.appendChild(logoWrap);
}

function buildLogoFallback(name) {
  const fallback = document.createElement("div");
  fallback.className = "logoFallback";
  fallback.textContent = name;
  return fallback;
}

const logoFrame = document.getElementById("logoFrame");
const guessInput = document.getElementById("guessInput");
const charadesScoreEl = document.getElementById("charadesScore");
const charadesResult = document.getElementById("charadesResult");
const hintLine = document.getElementById("hintLine");
const roundBadge = document.getElementById("charadesRoundBadge");

let charadesRound = 0;
let charadesScore = 0;
let currentLang = null;

function normalizeGuess(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, " ");
}

function startCharadesRound() {
  charadesRound += 1;
  roundBadge.textContent = `Round ${charadesRound}`;
  if (charadesResult) charadesResult.textContent = "Waiting...";
  hintLine.textContent = "Hint: -";
  if (guessInput) {
    guessInput.value = "";
    guessInput.focus();
  }

  currentLang = LANGS[Math.floor(Math.random() * LANGS.length)];
  showLanguageLogo(currentLang);
}

function submitCharadesGuess() {
  if (!guessInput || !charadesResult || !charadesScoreEl) return;
  if (!currentLang) {
    charadesResult.textContent = "Press Start first.";
    return;
  }
  const g = normalizeGuess(guessInput.value);
  if (!g) {
    charadesResult.textContent = "Type a guess first.";
    return;
  }

  const ok = currentLang.aliases.includes(g);
  if (ok) {
    charadesScore += 1;
    statCharadesScore = charadesScore;
    charadesResult.textContent = `Correct! It was ${currentLang.name}. (+1)`;
  } else {
    charadesResult.textContent = "Not quite. Try Hint or Reveal, or press Next.";
  }

  charadesScoreEl.textContent = String(charadesScore);
  updateHomeStats();
}

function hintCharades() {
  if (!currentLang) return;
  const name = currentLang.name;
  const first = name[0];
  const len = name.length;
  hintLine.textContent = `Hint: starts with "${first}" | length ${len}`;
}

function revealCharades() {
  if (!currentLang) return;
  if (charadesResult) charadesResult.textContent = `Reveal: ${currentLang.name}`;
}

document.getElementById("charadesStart").addEventListener("click", startCharadesRound);
const submitGuessBtn = document.getElementById("submitGuess");
if (submitGuessBtn) submitGuessBtn.addEventListener("click", submitCharadesGuess);
document.getElementById("charadesHint").addEventListener("click", hintCharades);
document.getElementById("charadesReveal").addEventListener("click", revealCharades);
const skipCharadesBtn = document.getElementById("skipCharades");
if (skipCharadesBtn) {
  skipCharadesBtn.addEventListener("click", () => {
    if (charadesResult) {
      charadesResult.textContent = "Skipped. Press Start / Next for a new logo.";
    }
    startCharadesRound();
  });
}
if (guessInput) {
  guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitCharadesGuess();
  });
}

document.getElementById("charadesReset").addEventListener("click", () => {
  charadesRound = 0;
  charadesScore = 0;
  currentLang = null;
  logoFrame.innerHTML = `<div class="muted">Press <b>Start</b> to show a logo</div>`;
  if (charadesScoreEl) charadesScoreEl.textContent = "0";
  if (charadesResult) charadesResult.textContent = "Waiting...";
  hintLine.textContent = "Hint: -";
  roundBadge.textContent = "Round 1";
  statCharadesScore = 0;
  updateHomeStats();
});

/* =========================
   Debug Wars (Team Ladder)
========================= */
const TEAMS = [
  { id: "team1", name: "🔴 Red Byte Team", color: "red" },
  { id: "team2", name: "🟢 Green Logic Team", color: "green" },
  { id: "team3", name: "🔵 Blue Code Team", color: "blue" },
  { id: "team4", name: "🟡 Yellow Syntax Team", color: "yellow" },
  { id: "team5", name: "🟣 Purple Stack Team", color: "purple" },
];

const QUESTION_POOL = [
  {
    level: 1,
    levelLabel: "Easy",
    title: "Wrong comparison operator",
    code: `age = INPUT()
IF age = 18
  PRINT "Adult"
END IF`,
    question: "What should be fixed?",
    options: [
      "Use == (comparison) instead of = (assignment)",
      "Remove INPUT()",
      "Use ELSE only",
      "Change 18 to \"18\""
    ],
    answerIndex: 0
  },
  {
    level: 1,
    levelLabel: "Easy",
    title: "Variable not initialized",
    code: `total = total + price
PRINT total`,
    question: "What is the error?",
    options: [
      "total is used before it is initialized",
      "price must be a string",
      "PRINT cannot print numbers",
      "Addition is not allowed"
    ],
    answerIndex: 0
  },
  {
    level: 1,
    levelLabel: "Easy",
    title: "Missing return",
    code: `FUNCTION add(a, b)
  c = a + b
END FUNCTION

PRINT add(2, 3)`,
    question: "What is missing?",
    options: [
      "Return c inside the function",
      "Use global variables only",
      "Call add without arguments",
      "Replace PRINT with INPUT"
    ],
    answerIndex: 0
  },
  {
    level: 1,
    levelLabel: "Easy",
    title: "Array index out of bounds",
    code: `nums = [5, 9, 2]
PRINT nums[3]`,
    question: "What is the bug?",
    options: [
      "Index 3 is out of range (valid indexes are 0..2)",
      "Arrays cannot store numbers",
      "PRINT cannot print arrays",
      "Square brackets are wrong"
    ],
    answerIndex: 0
  },
  {
    level: 1,
    levelLabel: "Easy",
    title: "String vs number",
    code: `a = "5"
b = 2
PRINT a + b`,
    question: "What's the most likely issue?",
    options: [
      "Type mismatch: convert \"5\" to number or b to string",
      "You cannot print",
      "b must be 0",
      "Quotes are not allowed"
    ],
    answerIndex: 0
  },
  {
    level: 2,
    levelLabel: "Medium",
    title: "Off-by-one loop",
    code: `items = ["A", "B", "C"]
FOR i = 0 TO len(items)
  PRINT items[i]
END FOR`,
    question: "What is the bug?",
    options: [
      "Loop should stop at len(items) - 1 (use i < len(items))",
      "Arrays must be 1-indexed",
      "PRINT cannot print strings",
      "len(items) is always 0"
    ],
    answerIndex: 0
  },
  {
    level: 2,
    levelLabel: "Medium",
    title: "Infinite loop",
    code: `x = 1
WHILE x < 5
  PRINT x
END WHILE`,
    question: "How to fix it?",
    options: [
      "Increment x inside the loop (x = x + 1)",
      "Change WHILE to IF",
      "Remove PRINT",
      "Set x = 0"
    ],
    answerIndex: 0
  },
  {
    level: 2,
    levelLabel: "Medium",
    title: "Wrong operator precedence",
    code: `result = 10 + 2 * 5
PRINT result`,
    question: "A junior expects 60. What do you explain?",
    options: [
      "Multiplication happens before addition, so result is 20 unless parentheses are used",
      "Addition always happens first, so result is 60",
      "The code will crash",
      "2 * 5 is invalid"
    ],
    answerIndex: 0
  },
  {
    level: 2,
    levelLabel: "Medium",
    title: "Wrong boolean logic",
    code: `x = 7
IF x > 0 OR x < 5
  PRINT "Between 1 and 4"
END IF`,
    question: "What should be used instead of OR?",
    options: [
      "AND",
      "NOT",
      "XOR",
      "=="
    ],
    answerIndex: 0
  },
  {
    level: 2,
    levelLabel: "Medium",
    title: "Redundant condition",
    code: `name = INPUT()
IF name != ""
  PRINT "Hello " + name
ELSE IF name == ""
  PRINT "Enter a name"
END IF`,
    question: "What is the issue?",
    options: [
      "ELSE IF should be ELSE (the second condition is redundant)",
      "name must be integer",
      "Use FOR instead of IF",
      "INPUT is not allowed"
    ],
    answerIndex: 0
  },
  {
    level: 3,
    levelLabel: "Hard",
    title: "Missing base case",
    code: `FUNCTION factorial(n)
  RETURN n * factorial(n - 1)
END FUNCTION

PRINT factorial(5)`,
    question: "What is missing?",
    options: [
      "A base case for n (e.g., n == 0 or n == 1)",
      "A global variable named factorial",
      "A loop instead of recursion",
      "PRINT should be inside the function"
    ],
    answerIndex: 0
  },
  {
    level: 3,
    levelLabel: "Hard",
    title: "Null check order",
    code: `IF user.name != "" AND user != null
  PRINT user.name
END IF`,
    question: "What should be fixed?",
    options: [
      "Check user != null before accessing user.name",
      "Use OR instead of AND",
      "Compare to single quotes instead of double quotes",
      "Remove PRINT"
    ],
    answerIndex: 0
  },
  {
    level: 3,
    levelLabel: "Hard",
    title: "Modify list while iterating",
    code: `FOR item IN items
  IF item == target
    items.remove(item)
  END IF
END FOR`,
    question: "What is the bug?",
    options: [
      "Removing while iterating can skip items; remove after the loop or iterate over a copy",
      "FOR loops cannot use IN",
      "remove() only works on numbers",
      "target must be uppercase"
    ],
    answerIndex: 0
  },
  {
    level: 3,
    levelLabel: "Hard",
    title: "Shared list alias",
    code: `a = [1, 2, 3]
b = a
b.append(4)
PRINT a`,
    question: "Why does a change?",
    options: [
      "b references the same list; make a copy for b",
      "append always modifies both lists",
      "PRINT mutates arrays",
      "Lists are immutable"
    ],
    answerIndex: 0
  },
  {
    level: 3,
    levelLabel: "Hard",
    title: "Integer division",
    code: `avg = 5 / 2
PRINT avg`,
    question: "A learner expects 2.5. What's the issue?",
    options: [
      "Integer division truncates; use floating division or cast to float",
      "5 / 2 is invalid",
      "PRINT rounds automatically",
      "avg must be a string"
    ],
    answerIndex: 0
  },
  {
    level: 4,
    levelLabel: "Advanced",
    title: "Race condition",
    code: `counter = 0

PARALLEL DO 100 TIMES
  counter = counter + 1
END`,
    question: "What is the bug?",
    options: [
      "Race condition on counter; use a lock or atomic increment",
      "counter must start at 1",
      "PARALLEL is not allowed",
      "Add a print statement"
    ],
    answerIndex: 0
  },
  {
    level: 4,
    levelLabel: "Advanced",
    title: "SQL injection risk",
    code: `query = "SELECT * FROM users WHERE name = '" + input + "'"
db.execute(query)`,
    question: "What should be fixed?",
    options: [
      "Use parameterized queries to avoid injection",
      "Use DELETE instead of SELECT",
      "Uppercase the input",
      "Add LIMIT 1 only"
    ],
    answerIndex: 0
  },
  {
    level: 4,
    levelLabel: "Advanced",
    title: "Event listener leak",
    code: `FUNCTION showPanel()
  window.addEventListener("resize", onResize)
END FUNCTION

// showPanel is called many times`,
    question: "What is the issue?",
    options: [
      "Listeners keep piling up; add once or remove on hide",
      "resize events cannot be handled",
      "onResize must return a value",
      "window is undefined"
    ],
    answerIndex: 0
  },
  {
    level: 4,
    levelLabel: "Advanced",
    title: "Slow nested search",
    code: `FOR each user IN users
  FOR each order IN orders
    IF order.userId == user.id
      total = total + order.amount
    END IF
  END FOR
END FOR`,
    question: "What is the performance issue?",
    options: [
      "This is O(n*m); pre-index orders by userId with a map",
      "FOR loops are always slow",
      "total should be a string",
      "user.id must be unique"
    ],
    answerIndex: 0
  },
  {
    level: 4,
    levelLabel: "Advanced",
    title: "Mutable default argument",
    code: `FUNCTION addItem(item, list = [])
  list.append(item)
  RETURN list
END FUNCTION

PRINT addItem("A")
PRINT addItem("B")`,
    question: "What is the bug?",
    options: [
      "The default list is reused across calls; create a new list each time",
      "append only works on numbers",
      "PRINT mutates lists",
      "Functions cannot have defaults"
    ],
    answerIndex: 0
  },
  {
    level: 5,
    levelLabel: "Expert",
    title: "Deadlock risk",
    code: `LOCK A
LOCK B
// work
UNLOCK B
UNLOCK A

// In another thread
LOCK B
LOCK A`,
    question: "What is the bug?",
    options: [
      "Potential deadlock due to inconsistent lock order",
      "Locks must be released in the same thread only",
      "LOCK cannot be nested",
      "UNLOCK should happen before work"
    ],
    answerIndex: 0
  },
  {
    level: 5,
    levelLabel: "Expert",
    title: "Floating point equality",
    code: `x = 0.1 + 0.2
IF x == 0.3
  PRINT "Equal"
END IF`,
    question: "What is the issue?",
    options: [
      "Floating point precision; compare with a tolerance",
      "0.1 + 0.2 is always 0.3",
      "PRINT cannot print decimals",
      "x must be an integer"
    ],
    answerIndex: 0
  },
  {
    level: 5,
    levelLabel: "Expert",
    title: "Integer overflow",
    code: `count = 2147483000
count = count + 1000
PRINT count`,
    question: "What can go wrong?",
    options: [
      "32-bit overflow; use a larger integer type",
      "Addition is not allowed",
      "PRINT will crash",
      "Numbers must be quoted"
    ],
    answerIndex: 0
  },
  {
    level: 5,
    levelLabel: "Expert",
    title: "TOCTOU bug",
    code: `IF fileExists(path)
  openFile(path)
END IF`,
    question: "What is the issue?",
    options: [
      "The file can change between check and use; handle open errors atomically",
      "fileExists always returns false",
      "openFile must be called before checking",
      "IF cannot be used with files"
    ],
    answerIndex: 0
  },
  {
    level: 5,
    levelLabel: "Expert",
    title: "Lost update",
    code: `balance = getBalance(userId)
balance = balance - amount
saveBalance(userId, balance)`,
    question: "What is the risk?",
    options: [
      "Concurrent updates can be lost; use a transaction or atomic update",
      "balance must be a string",
      "saveBalance cannot be called twice",
      "amount must be negative"
    ],
    answerIndex: 0
  },
];

const teamsGrid = document.getElementById("teamsGrid");
const scoreboardEl = document.getElementById("scoreboard");
const debugRoundsEl = document.getElementById("debugRounds");
const totalSubmissionsEl = document.getElementById("totalSubmissions");
const teamQuestionPanel = document.getElementById("teamQuestionPanel");
const teamQuestionTitle = document.getElementById("teamQuestionTitle");
const teamQuestionProgress = document.getElementById("teamQuestionProgress");
const teamQuestionBody = document.getElementById("teamQuestionBody");

let debugRounds = 0;
let debugCorrectAnswers = 0;
let selectedTeamId = null;
let teamQuestionSets = {};
let teamProgress = {};
let teamStats = {};
let winnerShown = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function assignQuestionsToTeams() {
  const byLevel = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  QUESTION_POOL.forEach(q => {
    if (byLevel[q.level]) byLevel[q.level].push(q);
  });

  Object.keys(byLevel).forEach(level => {
    byLevel[level] = shuffle(byLevel[level]);
  });

  teamQuestionSets = {};
  teamProgress = {};
  teamStats = {};
  TEAMS.forEach((team, idx) => {
    const ladder = [
      byLevel[1][idx],
      byLevel[2][idx],
      byLevel[3][idx],
      byLevel[4][idx],
      byLevel[5][idx],
    ].filter(Boolean);

    teamQuestionSets[team.id] = ladder;
    teamProgress[team.id] = {
      index: 0,
      answered: false,
      selectedIndex: null,
      feedback: "Choose one option, then click Submit Answer."
    };
    teamStats[team.id] = {
      attempts: 0,
      correct: 0
    };
  });
}

function getTopTeamName() {
  if (statTotalAnswers === 0) return "-";
  const accuracy = Math.round((debugCorrectAnswers / statTotalAnswers) * 100);
  return `${accuracy}%`;
}

function renderScoreboard() {
  const accuracy = statTotalAnswers === 0
    ? 0
    : Math.round((debugCorrectAnswers / statTotalAnswers) * 100);

  scoreboardEl.innerHTML = `
    <div class="teamScore">
      <div class="name" style="color:var(--green)">Correct</div>
      <div class="points">${debugCorrectAnswers}</div>
      <div class="muted small">Right answers</div>
    </div>
    <div class="teamScore">
      <div class="name" style="color:var(--blue)">Attempts</div>
      <div class="points">${statTotalAnswers}</div>
      <div class="muted small">Submitted answers</div>
    </div>
    <div class="teamScore">
      <div class="name" style="color:var(--yellow)">Accuracy</div>
      <div class="points">${accuracy}%</div>
      <div class="muted small">Overall result</div>
    </div>
  `;

  debugRoundsEl.textContent = String(debugRounds);
  totalSubmissionsEl.textContent = String(statTotalAnswers);
  updateHomeStats();
}

function renderTeams() {
  if (!teamsGrid) return;
  teamsGrid.innerHTML = TEAMS.map(team => `
    <button class="teamPick${team.id === selectedTeamId ? " active" : ""}" data-team="${team.id}" data-color="${team.color}" type="button">
      ${escapeHtml(team.name)}
    </button>
  `).join("");

  teamsGrid.querySelectorAll(".teamPick").forEach(btn => {
    btn.addEventListener("click", () => {
      selectTeam(btn.dataset.team);
    });
  });
}

function renderTeamQuestionPanel() {
  if (!teamQuestionPanel || !teamQuestionBody || !teamQuestionTitle || !teamQuestionProgress) return;

  if (!selectedTeamId) {
    teamQuestionPanel.hidden = true;
    return;
  }

  const team = TEAMS.find(t => t.id === selectedTeamId);
  const progress = teamProgress[selectedTeamId];
  const ladder = teamQuestionSets[selectedTeamId] || [];

  teamQuestionPanel.hidden = false;
  teamQuestionTitle.textContent = `${team ? team.name : "Team"} Questions`;

  if (!progress || ladder.length === 0) {
    teamQuestionProgress.textContent = "No questions found";
    teamQuestionBody.innerHTML = `<div class="muted">No questions available.</div>`;
    return;
  }

  if (progress.index >= ladder.length) {
    teamQuestionProgress.textContent = `Completed ${ladder.length} of ${ladder.length}`;
    teamQuestionBody.innerHTML = `
      <div class="teamCard debugQuestionCard">
        <div class="qTitle">All done</div>
        <div class="muted small">This team has completed its 5 questions.</div>
      </div>
    `;
    return;
  }

  const q = ladder[progress.index];
  const feedbackText = progress.feedback || "Choose one option, then click Submit Answer.";

  teamQuestionProgress.textContent = `Question ${progress.index + 1} of ${ladder.length} \u2022 ${q.levelLabel}`;
  teamQuestionBody.innerHTML = `
    <div class="teamCard debugQuestionCard">
      <div class="qTitle">${escapeHtml(q.title)}</div>
      <div class="muted small">${escapeHtml(q.question)}</div>

      <div class="codeBox">${escapeHtml(q.code)}</div>

      <div class="options" role="radiogroup" aria-label="Debug question options">
        ${q.options.map((opt, i) => {
          const checked = progress.selectedIndex === i ? "checked" : "";
          const disabled = progress.answered ? "disabled" : "";
          const disabledClass = progress.answered ? " disabled" : "";
          return `
            <label class="option${disabledClass}">
              <input type="radio" name="debug_option" value="${i}" ${checked} ${disabled} />
              <div>${escapeHtml(opt)}</div>
            </label>
          `;
        }).join("")}
      </div>

      <div class="result" id="debugFeedback">${escapeHtml(feedbackText)}</div>
    </div>
  `;
}

function isTeamFinished(teamId) {
  const progress = teamProgress[teamId];
  const ladder = teamQuestionSets[teamId] || [];
  if (!progress || ladder.length === 0) return false;
  const lastIndex = ladder.length - 1;
  if (progress.index >= ladder.length) return true;
  return progress.index >= lastIndex && progress.answered;
}

function areAllTeamsFinished() {
  return TEAMS.every(team => isTeamFinished(team.id));
}

function getWinnerTeams() {
  let best = null;
  let winners = [];

  TEAMS.forEach(team => {
    const stats = teamStats[team.id] || { attempts: 0, correct: 0 };
    const attempts = stats.attempts;
    const correct = stats.correct;
    const accuracy = attempts === 0 ? 0 : correct / attempts;

    const score = { accuracy, correct, attempts };

    if (!best) {
      best = score;
      winners = [team];
      return;
    }

    if (accuracy > best.accuracy || (accuracy === best.accuracy && correct > best.correct)) {
      best = score;
      winners = [team];
      return;
    }

    if (accuracy === best.accuracy && correct === best.correct) {
      winners.push(team);
    }
  });

  return { winners, best };
}

function showWinnerModal() {
  const modal = document.getElementById("winnerModal");
  const body = document.getElementById("winnerBody");
  const title = document.getElementById("winnerTitle");
  if (!modal || !body || !title) return;

  const { winners, best } = getWinnerTeams();
  const totalAttempts = TEAMS.reduce((sum, t) => sum + (teamStats[t.id]?.attempts || 0), 0);

  if (!best || totalAttempts === 0) {
    title.textContent = "No Winner Yet";
    body.innerHTML = "No answers were submitted. Play a round to crown a winner.";
  } else if (winners.length > 1) {
    title.textContent = "It's a Tie!";
    const names = winners.map(t => `<span class="winnerName">${escapeHtml(t.name)}</span>`).join(" &amp; ");
    const accuracy = Math.round((best.accuracy || 0) * 100);
    body.innerHTML = `${names} share the top spot with ${accuracy}% accuracy (${best.correct}/${best.attempts}).`;
  } else {
    const winner = winners[0];
    const accuracy = Math.round((best.accuracy || 0) * 100);
    title.textContent = "Winner!";
    body.innerHTML = `<span class="winnerName">${escapeHtml(winner.name)}</span> wins with ${accuracy}% accuracy (${best.correct}/${best.attempts}).`;
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  winnerShown = true;
}

function hideWinnerModal() {
  const modal = document.getElementById("winnerModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function selectTeam(teamId) {
  selectedTeamId = teamId;
  renderTeams();
  renderTeamQuestionPanel();
}

function showSelectTeamMessage(message) {
  if (!teamQuestionPanel || !teamQuestionTitle || !teamQuestionProgress || !teamQuestionBody) return;
  teamQuestionPanel.hidden = false;
  teamQuestionTitle.textContent = "Team Questions";
  teamQuestionProgress.textContent = "Select a team";
  teamQuestionBody.innerHTML = `<div class="muted">${escapeHtml(message)}</div>`;
}

function newDebugRound() {
  if (!selectedTeamId) {
    showSelectTeamMessage("Select a team to start the 5-question ladder.");
    return;
  }

  const progress = teamProgress[selectedTeamId];
  const ladder = teamQuestionSets[selectedTeamId] || [];
  if (!progress || ladder.length === 0) return;

  if (progress.index >= ladder.length) {
    progress.feedback = "Team completed all questions.";
    renderTeamQuestionPanel();
    return;
  }

  if (!progress.answered) {
    progress.feedback = "Submit an answer before moving to the next question.";
    renderTeamQuestionPanel();
    return;
  }

  progress.index += 1;
  progress.answered = false;
  progress.selectedIndex = null;
  progress.feedback = "Choose one option, then click Submit Answer.";
  renderTeamQuestionPanel();
}

function submitDebugAnswers() {
  if (!selectedTeamId) {
    showSelectTeamMessage("Select a team before submitting an answer.");
    return;
  }

  const progress = teamProgress[selectedTeamId];
  const ladder = teamQuestionSets[selectedTeamId] || [];
  if (!progress || progress.index >= ladder.length) return;

  if (progress.answered) {
    progress.feedback = "Already submitted. Click Next Question.";
    renderTeamQuestionPanel();
    return;
  }

  const selected = document.querySelector('input[name="debug_option"]:checked');
  if (!selected) {
    progress.feedback = "Select one option first.";
    renderTeamQuestionPanel();
    return;
  }

  statTotalAnswers += 1;
  debugRounds += 1;
  statDebugRounds = debugRounds;

  const q = ladder[progress.index];
  const chosen = Number(selected.value);
  const isCorrect = chosen === q.answerIndex;

  progress.selectedIndex = chosen;
  const stats = teamStats[selectedTeamId];
  if (stats) {
    stats.attempts += 1;
    if (isCorrect) stats.correct += 1;
  }

  if (isCorrect) {
    debugCorrectAnswers += 1;
    progress.feedback = "Correct! Click Next Question to continue.";
  } else {
    const rightAnswer = q.options[q.answerIndex];
    progress.feedback = `Incorrect. Correct answer: ${rightAnswer}`;
  }

  progress.answered = true;
  renderTeamQuestionPanel();
  renderScoreboard();

  if (!winnerShown && areAllTeamsFinished()) {
    showWinnerModal();
  }
}

document.getElementById("debugNewRound").addEventListener("click", newDebugRound);
document.getElementById("debugSubmit").addEventListener("click", submitDebugAnswers);

document.getElementById("debugReset").addEventListener("click", () => {
  debugRounds = 0;
  debugCorrectAnswers = 0;
  statDebugRounds = 0;
  statTotalAnswers = 0;
  selectedTeamId = null;
  winnerShown = false;
  hideWinnerModal();

  assignQuestionsToTeams();
  renderTeams();
  renderTeamQuestionPanel();
  renderScoreboard();
});

/* Init */
(function init() {
  // Charades initial placeholder
  logoFrame.innerHTML = `<div class="muted">Press <b>Start</b> to show a logo</div>`;
  // Debug initial state
  assignQuestionsToTeams();
  renderTeams();
  renderTeamQuestionPanel();
  renderScoreboard();
  updateHomeStats();

  const winnerClose = document.getElementById("winnerClose");
  const winnerReset = document.getElementById("winnerReset");
  const winnerModal = document.getElementById("winnerModal");
  if (winnerClose) winnerClose.addEventListener("click", hideWinnerModal);
  if (winnerReset) winnerReset.addEventListener("click", () => {
    hideWinnerModal();
    document.getElementById("debugReset").click();
  });
  if (winnerModal) {
    winnerModal.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.dataset && target.dataset.close === "winnerModal") {
        hideWinnerModal();
      }
    });
  }
})();
