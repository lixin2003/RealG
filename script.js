const boardElement = document.getElementById("board");
const trayElement = document.getElementById("tray");
const stashElement = document.getElementById("stash");
const bgmAudio = document.getElementById("bgm-audio");

const startButton = document.getElementById("start-btn");
const undoButton = document.getElementById("undo-btn");
const shuffleButton = document.getElementById("shuffle-btn");
const removeButton = document.getElementById("remove-btn");
const restartButton = document.getElementById("restart-btn");
const leaderboardButton = document.getElementById("leaderboard-btn");
const prevTrackButton = document.getElementById("prev-track-btn");
const playPauseButton = document.getElementById("play-pause-btn");
const nextTrackButton = document.getElementById("next-track-btn");
const loopTrackButton = document.getElementById("loop-track-btn");

const statusText = document.getElementById("status-text");
const levelText = document.getElementById("level-text");
const remainingCount = document.getElementById("remaining-count");
const slotCount = document.getElementById("slot-count");
const statusStrip = document.querySelector(".status-strip");
const timerCard = document.getElementById("timer-card");
const timerText = document.getElementById("timer-text");
const undoCount = document.getElementById("undo-count");
const shuffleCount = document.getElementById("shuffle-count");
const removeCount = document.getElementById("remove-count");

const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const overlayBody = document.getElementById("overlay-body");
const overlayActions = document.getElementById("overlay-actions");
const boardWrap = document.querySelector(".board-frame");
const musicCover = document.getElementById("music-cover");
const musicTrackName = document.getElementById("music-track-name");

const slotLimit = 7;
const stashLimit = 3;
const tileTypes = [
  { id: "A1", label: "1", image: "assets/tiles/1.png" },
  { id: "A2", label: "2", image: "assets/tiles/2.png" },
  { id: "A3", label: "3", image: "assets/tiles/3.png" },
  { id: "A4", label: "4", image: "assets/tiles/4.png" },
  { id: "A5", label: "5", image: "assets/tiles/5.png" },
  { id: "A6", label: "6", image: "assets/tiles/6.png" },
  { id: "A7", label: "7", image: "assets/tiles/7.png" },
  { id: "A8", label: "8", image: "assets/tiles/8.png" },
  { id: "A9", label: "9", image: "assets/tiles/9.png" },
  { id: "A10", label: "10", image: "assets/tiles/10.png" },
  { id: "A11", label: "11", image: "assets/tiles/11.png" },
  { id: "A12", label: "12", image: "assets/tiles/12.png" },
  { id: "A13", label: "13", image: "assets/tiles/13.png" },
  { id: "A14", label: "14", image: "assets/tiles/14.png" },
  { id: "A15", label: "15", image: "assets/tiles/15.png" },
  { id: "A16", label: "16", image: "assets/tiles/16 (1).JPG" },
  { id: "A17", label: "17", image: "assets/tiles/17.png" },
  { id: "A18", label: "18", image: "assets/tiles/18.png" },
  { id: "A19", label: "19", image: "assets/tiles/19.png" },
  { id: "A20", label: "20", image: "assets/tiles/20.png" }
];
const levelDefinitions = window.LEVEL_DEFINITIONS || [];
const maxGenerationAttempts = 40;
const defaultToolCounts = {
  undoCount: 1,
  shuffleCount: 1,
  removeCount: 1
};
const musicTracks = [
  { title: "\u5bbe\u58eb-Benz", src: "assets/realg/%E5%AE%BE%E5%A3%AB-Benz.mp3" },
  { title: "\u724c\u5b50\u8d27-Luxury", src: "assets/realg/%E7%89%8C%E5%AD%90%E8%B4%A7-Luxury.mp3" },
  { title: "\u51b0\u7ea2\u8336-Ice Tea", src: "assets/realg/%E5%86%B0%E7%BA%A2%E8%8C%B6-Ice%20Tea.mp3" },
  { title: "\u5bb6\u548c\u4e07\u4e8b\u5174-Happy wife,Happy life", src: "assets/realg/%E5%AE%B6%E5%92%8C%E4%B8%87%E4%BA%8B%E5%85%B4-Happy%20wife,Happy%20life.mp3" },
  { title: "\u94b1-Power", src: "assets/realg/%E9%92%B1-Power.mp3" },
  { title: "\u6211\u7684\u5c0f\u82b3-Sarah", src: "assets/realg/%E6%88%91%E7%9A%84%E5%B0%8F%E8%8A%B3-%20Sarah.mp3" },
  { title: "\u8d62-I always win", src: "assets/realg/%E8%B5%A2-I%20always%20win.mp3" },
  { title: "\u6211\u7684\u54e5-Bro Being Bro", src: "assets/realg/%E6%88%91%E7%9A%84%E5%93%A5-Bro%20Being%20Bro.mp3" },
  { title: "\u661f\u68a6-XingMeng", src: "assets/realg/%E6%98%9F%E6%A2%A6-XingMeng.mp3" },
  { title: "\u534e\u4f57-Hua Tuo", src: "assets/realg/%E5%8D%8E%E4%BD%97-Hua%20Tuo.mp3" },
  { title: "\u4e0d\u6362-Stay", src: "assets/realg/%E4%B8%8D%E6%8D%A2-Stay.mp3" },
  { title: "\u68a6\u8bdd-Murmur", src: "assets/realg/%E6%A2%A6%E8%AF%9D-Murmur.mp3" },
  { title: "\u5b89\u5b89-Good Trip", src: "assets/realg/%E5%AE%89%E5%AE%89-Good%20Trip.mp3" }
];

let boardTiles = [];
let trayTiles = [];
let stashTiles = [];
let selectedTrayTileIds = [];
let removeModeActive = false;
let gameState = "idle";
let actionHistory = [];
let shuffleRemaining = 1;
let undoRemaining = 1;
let removeRemaining = 1;
let currentLevelIndex = 0;
let currentTrackIndex = 0;
let singleTrackLoop = true;
let levelTimerStartedAt = null;
let levelTimerIntervalId = null;
let latestClearTimeMs = null;
let hintOverlayTimeoutId = null;
let boardViewport = {
  contentWidth: 0,
  contentHeight: 0,
  minX: 0,
  minY: 0,
  scale: 1,
  minScale: 1,
  maxScale: 2.4,
  offsetX: 0,
  offsetY: 0,
  pressing: false,
  dragging: false,
  moved: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  originOffsetX: 0,
  originOffsetY: 0,
  lastTapSuppressUntil: 0,
  touches: new Map(),
  pinchDistance: 0,
  pinchScaleStart: 1
};

function updateMusicUi() {
  const track = musicTracks[currentTrackIndex];
  musicTrackName.textContent = track ? track.title : "\u672a\u64ad\u653e";
  musicCover.src = "assets/realg/%E5%B0%81%E9%9D%A2.png";
  playPauseButton.textContent = bgmAudio.paused ? "\u25b6" : "\u23f8";
  loopTrackButton.classList.toggle("active", singleTrackLoop);
}

function shuffleByLayer(slots, reverse = false) {
  const grouped = new Map();

  slots.forEach((slot) => {
    if (!grouped.has(slot.layer)) {
      grouped.set(slot.layer, []);
    }
    grouped.get(slot.layer).push(slot);
  });

  const layers = [...grouped.keys()].sort((first, second) => reverse ? second - first : first - second);
  return layers.flatMap((layer) => shuffle(grouped.get(layer)));
}

function loadTrack(trackIndex, shouldAutoplay = false) {
  if (!musicTracks.length) {
    return;
  }

  currentTrackIndex = (trackIndex + musicTracks.length) % musicTracks.length;
  bgmAudio.src = musicTracks[currentTrackIndex].src;
  bgmAudio.loop = singleTrackLoop;
  updateMusicUi();

  if (shouldAutoplay) {
    bgmAudio.play().catch(() => {
      updateMusicUi();
    });
  }
}

function playPreviousTrack() {
  loadTrack(currentTrackIndex - 1, true);
}

function playNextTrack() {
  loadTrack(currentTrackIndex + 1, true);
}

function togglePlayPause() {
  if (!bgmAudio.src) {
    loadTrack(currentTrackIndex, true);
    return;
  }

  if (bgmAudio.paused) {
    bgmAudio.play().catch(() => {
      updateMusicUi();
    });
  } else {
    bgmAudio.pause();
  }
}

function toggleSingleTrackLoop() {
  singleTrackLoop = !singleTrackLoop;
  bgmAudio.loop = singleTrackLoop;
  updateMusicUi();
}

function getCurrentLevel() {
  return levelDefinitions[currentLevelIndex] || levelDefinitions[0];
}

function getToolCount(toolKey) {
  const currentLevel = getCurrentLevel();
  const fallback = defaultToolCounts[toolKey] || 0;
  const configuredCount = currentLevel && Number.isInteger(currentLevel[toolKey])
    ? currentLevel[toolKey]
    : fallback;
  return Math.max(1, configuredCount);
}

function getInitialViewScaleMultiplier() {
  const currentLevel = getCurrentLevel();
  const configuredMultiplier = currentLevel && Number.isFinite(currentLevel.initialViewScaleMultiplier)
    ? currentLevel.initialViewScaleMultiplier
    : 1;
  return Math.max(1, configuredMultiplier);
}

function isTimedLevel() {
  return currentLevelIndex === 1;
}

function formatElapsedTime(totalMilliseconds) {
  const totalSeconds = Math.max(0, Math.floor(totalMilliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getTimedLevelSummary() {
  if (!isTimedLevel() || !levelTimerStartedAt) {
    return "";
  }

  return `本次通关时间：${formatElapsedTime(Date.now() - levelTimerStartedAt)}`;
}

function getLatestClearTimeMs() {
  if (!isTimedLevel() || !levelTimerStartedAt) {
    return null;
  }

  return latestClearTimeMs || Math.max(0, Date.now() - levelTimerStartedAt);
}

function updateTimerUi() {
  if (!timerCard || !timerText) {
    return;
  }

  if (!isTimedLevel()) {
    timerCard.hidden = true;
    statusStrip?.classList.remove("has-timer");
    timerText.textContent = "00:00";
    return;
  }

  timerCard.hidden = false;
  statusStrip?.classList.add("has-timer");
  timerText.textContent = levelTimerStartedAt
    ? formatElapsedTime(Date.now() - levelTimerStartedAt)
    : "00:00";
}

function clearOverlayBody() {
  if (!overlayBody) {
    return;
  }

  overlayBody.innerHTML = "";
  overlayBody.hidden = true;
}

function clearHintOverlayTimer() {
  if (hintOverlayTimeoutId) {
    window.clearTimeout(hintOverlayTimeoutId);
    hintOverlayTimeoutId = null;
  }
}

function setOverlayBody(node) {
  if (!overlayBody) {
    return;
  }

  overlayBody.innerHTML = "";
  if (node) {
    overlayBody.appendChild(node);
    overlayBody.hidden = false;
  } else {
    overlayBody.hidden = true;
  }
}

function getStoredPlayerId() {
  try {
    return window.localStorage.getItem("realg_player_id") || "";
  } catch {
    return "";
  }
}

function setStoredPlayerId(playerId) {
  try {
    window.localStorage.setItem("realg_player_id", playerId);
  } catch {
    // Ignore localStorage write failures.
  }
}

async function loadLeaderboard(limit = 10) {
  const response = await fetch(`/api/leaderboard?levelId=stage-2&limit=${limit}`);
  if (!response.ok) {
    throw new Error("排行榜加载失败");
  }

  const payload = await response.json();
  return Array.isArray(payload.leaderboard) ? payload.leaderboard : [];
}

async function submitLeaderboardScore(playerId, clearTimeMs) {
  const response = await fetch("/api/submit-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      playerId,
      levelId: "stage-2",
      clearTimeMs
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "提交成绩失败");
  }

  return payload;
}

function renderLeaderboardNode(leaderboard) {
  const wrap = document.createElement("div");
  wrap.className = "leaderboard";

  if (!leaderboard.length) {
    const empty = document.createElement("div");
    empty.className = "leaderboard-empty";
    empty.textContent = "还没有成绩，来做第一个上榜的人。";
    wrap.appendChild(empty);
    return wrap;
  }

  const head = document.createElement("div");
  head.className = "leaderboard-head";
  head.innerHTML = "<span>排名</span><span>玩家</span><span>时间</span>";
  wrap.appendChild(head);

  leaderboard.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row";

    const rank = document.createElement("span");
    rank.className = "leaderboard-rank";
    rank.textContent = `#${entry.rank}`;

    const player = document.createElement("span");
    player.className = "leaderboard-player";
    player.textContent = entry.playerId;

    const time = document.createElement("span");
    time.className = "leaderboard-time";
    time.textContent = formatElapsedTime(entry.clearTimeMs);

    row.append(rank, player, time);
    wrap.appendChild(row);
  });

  return wrap;
}

async function showLeaderboardOverlay(message = "") {
  showOverlay("第二关排行榜", message);
  setOverlayActions([
    {
      label: "关闭",
      onClick: () => {
        hideOverlay();
      }
    }
  ]);

  const loading = document.createElement("div");
  loading.className = "leaderboard-empty";
  loading.textContent = "排行榜加载中...";
  setOverlayBody(loading);

  try {
    const leaderboard = await loadLeaderboard(10);
    setOverlayBody(renderLeaderboardNode(leaderboard));
  } catch (error) {
    const failed = document.createElement("div");
    failed.className = "leaderboard-empty";
    failed.textContent = error instanceof Error ? error.message : "排行榜加载失败";
    setOverlayBody(failed);
  }
}

function showScoreSubmitOverlay() {
  const clearTimeMs = getLatestClearTimeMs();
  const timedSummary = getTimedLevelSummary();

  showOverlay("第二关通关", timedSummary || "本次通关完成");

  const body = document.createElement("div");
  body.className = "overlay-form";

  const label = document.createElement("label");
  label.className = "overlay-label";
  label.setAttribute("for", "player-id-input");
  label.textContent = "输入你的玩家 ID（2-20 位，只能用字母、数字、下划线）";

  const input = document.createElement("input");
  input.id = "player-id-input";
  input.className = "overlay-input";
  input.type = "text";
  input.maxLength = 20;
  input.autocomplete = "nickname";
  input.placeholder = "例如：yang01";
  input.value = getStoredPlayerId();

  const hint = document.createElement("p");
  hint.className = "overlay-hint";
  hint.textContent = "提交后会按第二关最好成绩参与排行榜。";

  body.append(label, input, hint);
  setOverlayBody(body);

  setOverlayActions([
    {
      label: "提交成绩",
      onClick: async () => {
        const playerId = input.value.trim();
        if (!/^[A-Za-z0-9_]{2,20}$/.test(playerId)) {
          hint.textContent = "ID 不合法，请用 2-20 位字母、数字或下划线。";
          return;
        }

        if (!clearTimeMs) {
          hint.textContent = "当前没有可提交的通关时间。";
          return;
        }

        hint.textContent = "提交中...";
        try {
          await submitLeaderboardScore(playerId, clearTimeMs);
          setStoredPlayerId(playerId);
          await showLeaderboardOverlay(`成绩已提交，${playerId} 的通关时间是 ${formatElapsedTime(clearTimeMs)}。`);
        } catch (error) {
          hint.textContent = error instanceof Error ? error.message : "提交失败，请稍后再试。";
        }
      }
    },
    {
      label: "查看排行榜",
      className: "secondary",
      onClick: () => {
        showLeaderboardOverlay(timedSummary);
      }
    },
    {
      label: "再来一把",
      className: "secondary",
      onClick: () => {
        currentLevelIndex = 0;
        resetGame();
        startGame();
      }
    }
  ]);
}

function stopLevelTimer() {
  if (levelTimerIntervalId) {
    window.clearInterval(levelTimerIntervalId);
    levelTimerIntervalId = null;
  }
}

function startLevelTimer() {
  stopLevelTimer();
  updateTimerUi();

  if (!isTimedLevel() || !levelTimerStartedAt) {
    return;
  }

  levelTimerIntervalId = window.setInterval(() => {
    updateTimerUi();
  }, 1000);
}

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function createDeck() {
  const currentLevel = getCurrentLevel();
  const selectedTypes = tileTypes.slice(0, currentLevel.typeCount);
  if (selectedTypes.length !== currentLevel.typeCount) {
    throw new Error(`Level ${currentLevel.id} requests ${currentLevel.typeCount} tile types, but only ${tileTypes.length} are available.`);
  }
  const pool = [];

  if (Array.isArray(currentLevel.deckDistribution) && currentLevel.deckDistribution.length > 0) {
    if (currentLevel.deckDistribution.length !== selectedTypes.length) {
      throw new Error(`Level ${currentLevel.id} deckDistribution length ${currentLevel.deckDistribution.length} does not match typeCount ${selectedTypes.length}.`);
    }

    selectedTypes.forEach((type, index) => {
      const copies = currentLevel.deckDistribution[index];
      for (let count = 0; count < copies; count += 1) {
        pool.push(type);
      }
    });

    return shuffle(pool);
  }

  selectedTypes.forEach((type) => {
    for (let count = 0; count < currentLevel.copiesPerType; count += 1) {
      pool.push(type);
    }
  });

  return shuffle(pool);
}

function createSlotBlueprints() {
  const blueprints = [];
  const currentLevel = getCurrentLevel();

  currentLevel.layers.forEach((layerConfig, layer) => {
    layerConfig.indexes.forEach((layoutIndex, slotIndex) => {
      const basePosition = currentLevel.layout[layoutIndex];
      blueprints.push({
        slotId: `slot-${layer}-${layoutIndex}-${slotIndex}`,
        x: basePosition.x + layerConfig.offsetX,
        y: basePosition.y + layerConfig.offsetY,
        width: currentLevel.tileSize,
        height: currentLevel.tileSize,
        layer
      });
    });
  });

  return blueprints;
}

function countTypes(tiles) {
  const counts = new Map();
  tiles.forEach((tile) => {
    counts.set(tile.typeId || tile.id, (counts.get(tile.typeId || tile.id) || 0) + 1);
  });
  return counts;
}

function countTrayNeeds() {
  const counts = new Map();
  trayTiles.forEach((tile) => {
    counts.set(tile.typeId, (counts.get(tile.typeId) || 0) + 1);
  });
  return counts;
}

function chooseVisibleTypeIds(availableCounts, visibleCount, trayCounts) {
  if (visibleCount === 0) {
    return [];
  }

  const currentLevel = getCurrentLevel();
  if (currentLevel.visibleStrategy === "scatter") {
    return chooseScatterVisibleTypeIds(availableCounts, visibleCount);
  }

  const workingCounts = new Map(availableCounts);
  const selected = [];
  const types = [...workingCounts.keys()];

  const tryTake = (typeId, amount) => {
    const current = workingCounts.get(typeId) || 0;
    if (current < amount || selected.length + amount > visibleCount) {
      return false;
    }

    for (let index = 0; index < amount; index += 1) {
      selected.push(typeId);
    }
    workingCounts.set(typeId, current - amount);
    return true;
  };

  const completionFirst = [...types].sort((firstType, secondType) => {
    const firstTray = (trayCounts.get(firstType) || 0) % 3;
    const secondTray = (trayCounts.get(secondType) || 0) % 3;
    const firstNeed = firstTray === 0 ? 99 : 3 - firstTray;
    const secondNeed = secondTray === 0 ? 99 : 3 - secondTray;

    if (firstNeed !== secondNeed) {
      return firstNeed - secondNeed;
    }

    return (workingCounts.get(secondType) || 0) - (workingCounts.get(firstType) || 0);
  });

  completionFirst.forEach((typeId) => {
    const trayCount = (trayCounts.get(typeId) || 0) % 3;
    if (trayCount === 0) {
      return;
    }

    const need = 3 - trayCount;
    tryTake(typeId, need);
  });

  const groupedTypes = [...types].sort((firstType, secondType) => {
    return (workingCounts.get(secondType) || 0) - (workingCounts.get(firstType) || 0);
  });

  groupedTypes.forEach((typeId) => {
    if (selected.length >= visibleCount) {
      return;
    }

    const current = workingCounts.get(typeId) || 0;
    if (current <= 0) {
      return;
    }

    if (current >= 3 && visibleCount - selected.length >= 3) {
      tryTake(typeId, 3);
      return;
    }

    if (current >= 2 && visibleCount - selected.length >= 2) {
      tryTake(typeId, 2);
      return;
    }

    tryTake(typeId, 1);
  });

  while (selected.length < visibleCount) {
    const fallback = groupedTypes.find((typeId) => (workingCounts.get(typeId) || 0) > 0);
    if (!fallback) {
      break;
    }
    tryTake(fallback, 1);
  }

  return selected;
}

function chooseScatterVisibleTypeIds(availableCounts, visibleCount) {
  const workingCounts = new Map(availableCounts);
  const selected = [];
  const selectedCounts = new Map();
  const types = [...workingCounts.keys()];
  const byScarcity = [...types].sort((firstType, secondType) => {
    return (workingCounts.get(firstType) || 0) - (workingCounts.get(secondType) || 0);
  });

  // First pass: reveal as many distinct types as possible to reduce immediate merges.
  byScarcity.forEach((typeId) => {
    if (selected.length >= visibleCount) {
      return;
    }

    const current = workingCounts.get(typeId) || 0;
    if (current <= 0) {
      return;
    }

    selected.push(typeId);
    selectedCounts.set(typeId, (selectedCounts.get(typeId) || 0) + 1);
    workingCounts.set(typeId, current - 1);
  });

  // Second pass: keep distribution flat and strongly suppress repeated top-layer types.
  while (selected.length < visibleCount) {
    const candidates = [...workingCounts.entries()]
      .filter(([, count]) => count > 0)
      .sort((firstEntry, secondEntry) => {
        const firstSelectedCount = selectedCounts.get(firstEntry[0]) || 0;
        const secondSelectedCount = selectedCounts.get(secondEntry[0]) || 0;

        if (firstSelectedCount !== secondSelectedCount) {
          return firstSelectedCount - secondSelectedCount;
        }

        return firstEntry[1] - secondEntry[1];
      });

    if (candidates.length === 0) {
      break;
    }

    const [typeId, count] = candidates[0];
    selected.push(typeId);
    selectedCounts.set(typeId, (selectedCounts.get(typeId) || 0) + 1);
    workingCounts.set(typeId, count - 1);
  }

  return selected;
}

function buildBoardTiles() {
  const currentLevel = getCurrentLevel();
  const deck = createDeck();
  const slots = createSlotBlueprints();
  if (slots.length !== deck.length) {
    throw new Error(`Level slot count ${slots.length} does not match deck size ${deck.length} for ${currentLevel.id}`);
  }

  const visibleLayer = Math.max(...slots.map((slot) => slot.layer));
  const visibleSlots = shuffle(slots.filter((slot) => slot.layer === visibleLayer));
  const hiddenSlots = slots.filter((slot) => slot.layer !== visibleLayer);
  const workingDeck = [...deck];
  const workingCounts = countTypes(workingDeck);
  const deepPriorityIds = new Set(currentLevel.deepPriorityTypeIds || []);
  const visibleCounts = deepPriorityIds.size > 0
    ? new Map([...workingCounts.entries()].filter(([typeId]) => !deepPriorityIds.has(typeId)))
    : workingCounts;
  const visibleSourceCounts = visibleCounts.size >= visibleSlots.length ? visibleCounts : workingCounts;
  const visibleTypeIds = chooseVisibleTypeIds(visibleSourceCounts, visibleSlots.length, new Map());
  const selectedVisibleTiles = [];

  visibleTypeIds.forEach((typeId) => {
    const tileIndex = workingDeck.findIndex((tile) => tile.id === typeId);
    if (tileIndex !== -1) {
      selectedVisibleTiles.push(workingDeck.splice(tileIndex, 1)[0]);
    }
  });

  const deepPriorityTiles = [];
  const normalHiddenTiles = [];

  workingDeck.forEach((tile) => {
    if (deepPriorityIds.has(tile.id)) {
      deepPriorityTiles.push(tile);
      return;
    }
    normalHiddenTiles.push(tile);
  });

  const orderedHiddenDeck = [
    ...shuffle(deepPriorityTiles),
    ...shuffle(normalHiddenTiles)
  ];
  const orderedDeck = [...selectedVisibleTiles, ...orderedHiddenDeck];
  const orderedSlots = [
    ...visibleSlots,
    ...shuffleByLayer(hiddenSlots)
  ];

  return orderedSlots.map((slot, deckIndex) => {
    const type = orderedDeck[deckIndex];
    return {
      uid: `tile-${slot.slotId}-${deckIndex}`,
      typeId: type.id,
      typeLabel: type.label,
      image: type.image,
      x: slot.x,
      y: slot.y,
      width: slot.width,
      height: slot.height,
      layer: slot.layer,
      removed: false
    };
  });
}

function simulateInsert(trayState, typeId) {
  const nextTray = trayState.map((tile) => ({ ...tile }));
  let lastMatchIndex = -1;

  nextTray.forEach((tile, index) => {
    if (tile.typeId === typeId) {
      lastMatchIndex = index;
    }
  });

  const insertIndex = lastMatchIndex === -1 ? nextTray.length : lastMatchIndex + 1;
  nextTray.splice(insertIndex, 0, { typeId });

  const indices = [];
  nextTray.forEach((tile, index) => {
    if (tile.typeId === typeId) {
      indices.push(index);
    }
  });

  if (indices.length >= 3) {
    const removing = new Set(indices.slice(0, 3));
    return nextTray.filter((_, index) => !removing.has(index));
  }

  return nextTray;
}

function cloneTiles(tiles) {
  return tiles.map((tile) => ({ ...tile }));
}

function getBlockThresholdRatio() {
  const currentLevel = getCurrentLevel();
  return currentLevel.blockThresholdRatio || 0.22;
}

function getInteractionBlockThresholdRatio(tile) {
  const currentLevel = getCurrentLevel();
  const baseRatio = Number.isFinite(currentLevel.interactionBlockThresholdRatio)
    ? currentLevel.interactionBlockThresholdRatio
    : getBlockThresholdRatio() + 0.2;
  const maxLayer = Array.isArray(currentLevel.layers) ? currentLevel.layers.length - 1 : 0;
  const depthFromTop = Math.max(0, maxLayer - tile.layer);
  const depthBonus = Number.isFinite(currentLevel.interactionDeepLayerBonus)
    ? currentLevel.interactionDeepLayerBonus
    : 0;
  return Math.min(0.72, baseRatio + depthFromTop * depthBonus);
}

function getBlockedState(tiles, tile) {
  const threshold = tile.width * tile.height * getBlockThresholdRatio();
  return tiles.some((candidate) => {
    if (candidate.removed || candidate.uid === tile.uid || candidate.layer <= tile.layer) {
      return false;
    }

    return overlapArea(tile, candidate) > threshold;
  });
}

function isBoardSolvable(seedTiles, seedTray = []) {
  const stack = [
    {
      board: cloneTiles(seedTiles),
      tray: seedTray.map((tile) => ({ ...tile }))
    }
  ];
  const visited = new Set();
  let expansionCount = 0;
  const maxExpansions = 1200;

  while (stack.length > 0 && expansionCount < maxExpansions) {
    const current = stack.pop();
    expansionCount += 1;

    const remainingTiles = current.board.filter((tile) => !tile.removed);
    const traySignature = current.tray.map((tile) => tile.typeId).join(",");
    const boardSignature = remainingTiles
      .map((tile) => `${tile.uid}:${tile.removed ? 1 : 0}`)
      .join("|");
    const signature = `${boardSignature}__${traySignature}`;

    if (visited.has(signature)) {
      continue;
    }
    visited.add(signature);

    if (remainingTiles.length === 0 && current.tray.length === 0) {
      return true;
    }

    if (current.tray.length >= slotLimit) {
      continue;
    }

    const availableTiles = remainingTiles.filter((tile) => !getBlockedState(current.board, tile));
    if (availableTiles.length === 0) {
      continue;
    }

    const prioritizedTiles = [...availableTiles].sort((first, second) => {
      const firstNeed = current.tray.filter((tile) => tile.typeId === first.typeId).length % 3;
      const secondNeed = current.tray.filter((tile) => tile.typeId === second.typeId).length % 3;
      return secondNeed - firstNeed;
    });

    prioritizedTiles.slice(0, 4).forEach((candidate) => {
      const nextBoard = cloneTiles(current.board);
      const boardTile = nextBoard.find((tile) => tile.uid === candidate.uid);
      boardTile.removed = true;

      stack.push({
        board: nextBoard,
        tray: simulateInsert(current.tray, candidate.typeId)
      });
    });
  }

  return false;
}

function passesHeuristicValidation(seedTiles, seedTray = []) {
  const currentLevel = getCurrentLevel();
  const availableTiles = seedTiles.filter((tile) => !getBlockedState(seedTiles, tile));
  const minAvailableTiles = currentLevel.heuristicMinAvailableTiles || 6;
  if (availableTiles.length < minAvailableTiles) {
    return false;
  }

  const availableCounts = countTypes(availableTiles);
  const trayCounts = countTypes(seedTray);
  const completableTypes = [...availableCounts.keys()].filter((typeId) => {
    const trayCount = (trayCounts.get(typeId) || 0) % 3;
    if (trayCount === 0) {
      return false;
    }

    return (availableCounts.get(typeId) || 0) >= 3 - trayCount;
  });

  const pairTypes = [...availableCounts.values()].filter((count) => count >= 2).length;
  const minPairTypes = currentLevel.heuristicMinPairTypes || 3;
  return completableTypes.length >= 1 || pairTypes >= minPairTypes;
}

function validateGeneratedBoard(seedTiles, seedTray = []) {
  const currentLevel = getCurrentLevel();
  if (currentLevel.solverMode === "heuristic") {
    return passesHeuristicValidation(seedTiles, seedTray);
  }

  return isBoardSolvable(seedTiles, seedTray);
}

function generatePlayableBoard(seedTray = []) {
  const currentLevel = getCurrentLevel();
  const attempts = currentLevel.maxGenerationAttempts || maxGenerationAttempts;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const candidateBoard = buildBoardTiles();
    if (validateGeneratedBoard(candidateBoard, seedTray)) {
      return candidateBoard;
    }
  }

  return buildBoardTiles();
}

function getActiveTiles() {
  return boardTiles.filter((tile) => !tile.removed);
}

function overlapArea(first, second) {
  const left = Math.max(first.x, second.x);
  const right = Math.min(first.x + first.width, second.x + second.width);
  const top = Math.max(first.y, second.y);
  const bottom = Math.min(first.y + first.height, second.y + second.height);

  if (right <= left || bottom <= top) {
    return 0;
  }

  return (right - left) * (bottom - top);
}

function isBlocked(tile) {
  const threshold = tile.width * tile.height * getInteractionBlockThresholdRatio(tile);
  return boardTiles.some((candidate) => {
    if (candidate.removed || candidate.uid === tile.uid || candidate.layer <= tile.layer) {
      return false;
    }

    return overlapArea(tile, candidate) > threshold;
  });
}

function getAvailableTiles(tiles = getActiveTiles()) {
  return tiles.filter((tile) => !isBlocked(tile));
}

function updateStatus(text) {
  statusText.textContent = text;
}

function updateLevelLabel() {
  const currentLevel = getCurrentLevel();
  levelText.textContent = currentLevelIndex === 0 ? "\u7b2c1\u5173" : "\u7b2c2\u5173";
  if (boardWrap && currentLevel) {
    boardWrap.style.setProperty("--board-min-height", `${currentLevel.boardMinHeight}px`);
  }
  boardElement.classList.toggle("board-grid-hidden", currentLevel?.showBoardGrid === false);
}

function updateCounters() {
  const remaining = getActiveTiles().length;
  remainingCount.textContent = String(remaining);
  slotCount.textContent = `${trayTiles.length} / ${slotLimit}`;
  undoButton.disabled = actionHistory.length === 0 || gameState !== "running" || undoRemaining === 0;
  shuffleButton.disabled = shuffleRemaining === 0 || gameState !== "running";
  removeButton.disabled = removeRemaining === 0 || gameState !== "running" || trayTiles.length < 3 || stashTiles.length > 0;
  removeButton.classList.toggle("active", removeModeActive);
  undoCount.textContent = String(undoRemaining);
  shuffleCount.textContent = String(shuffleRemaining);
  removeCount.textContent = String(removeRemaining);
}

function showOverlay(title, text) {
  clearHintOverlayTimer();
  overlayTitle.textContent = title;
  overlayText.textContent = text || "";
  overlayText.hidden = !text;
  clearOverlayBody();
  overlay.querySelector(".overlay-card")?.classList.remove("hint-card");
  overlay.classList.add("visible");
}

function hideOverlay() {
  clearHintOverlayTimer();
  overlay.querySelector(".overlay-card")?.classList.remove("hint-card");
  overlay.classList.remove("visible");
}

function showHintOverlay(title, text, durationMs = 3000) {
  clearHintOverlayTimer();
  overlayTitle.textContent = title;
  overlayText.textContent = text || "";
  overlayText.hidden = !text;
  clearOverlayBody();
  overlay.querySelector(".overlay-card")?.classList.add("hint-card");
  overlay.classList.add("visible");
  setOverlayActions([]);

  hintOverlayTimeoutId = window.setTimeout(() => {
    overlay.querySelector(".overlay-card")?.classList.remove("hint-card");
    overlay.classList.remove("visible");
    hintOverlayTimeoutId = null;
  }, durationMs);
}

function setOverlayActions(actions = []) {
  overlayActions.innerHTML = "";

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    if (action.className) {
      button.className = action.className;
    }
    button.addEventListener("click", action.onClick);
    overlayActions.appendChild(button);
  });
}

function createTileElement(tile) {
  const button = document.createElement("button");
  const padding = Math.max(4, Math.round(tile.width * 0.08));
  const radius = Math.max(12, Math.round(tile.width * 0.22));
  const imageRadius = Math.max(8, Math.round(tile.width * 0.14));

  button.type = "button";
  button.className = "tile";
  button.dataset.uid = tile.uid;
  button.style.left = `${tile.renderX}px`;
  button.style.top = `${tile.renderY}px`;
  button.style.width = `${tile.width}px`;
  button.style.height = `${tile.height}px`;
  button.style.padding = `${padding}px`;
  button.style.borderRadius = `${radius}px`;
  button.style.zIndex = String(20 + tile.layer * 10);

  const image = document.createElement("img");
  image.src = tile.image;
  image.alt = "\u724c\u9762\u56fe\u7247";
  image.style.borderRadius = `${imageRadius}px`;

  button.appendChild(image);
  button.addEventListener("click", () => {
    if (Date.now() < boardViewport.lastTapSuppressUntil) {
      return;
    }
    handleTileClick(tile.uid);
  });
  return button;
}

function updateBoardViewportMetrics() {
  if (!boardTiles.length) {
    boardViewport.contentWidth = 0;
    boardViewport.contentHeight = 0;
    return;
  }

  const bounds = boardTiles.reduce((accumulator, tile) => {
    return {
      minX: Math.min(accumulator.minX, tile.x),
      minY: Math.min(accumulator.minY, tile.y),
      maxX: Math.max(accumulator.maxX, tile.x + tile.width),
      maxY: Math.max(accumulator.maxY, tile.y + tile.height)
    };
  }, {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  });

  const padding = 24;
  const contentWidth = Math.max(1, bounds.maxX - bounds.minX + padding * 2);
  const contentHeight = Math.max(1, bounds.maxY - bounds.minY + padding * 2);
  const availableWidth = Math.max(1, boardWrap.clientWidth - 16);
  const availableHeight = Math.max(1, boardWrap.clientHeight - 16);
  const minScale = Math.min(1, availableWidth / contentWidth, availableHeight / contentHeight);

  boardViewport.contentWidth = contentWidth;
  boardViewport.contentHeight = contentHeight;
  boardViewport.minX = bounds.minX - padding;
  boardViewport.minY = bounds.minY - padding;
  boardViewport.minScale = minScale;
  boardViewport.maxScale = Math.max(2.4, minScale * 3.2);

  boardTiles.forEach((tile) => {
    tile.renderX = tile.x - boardViewport.minX;
    tile.renderY = tile.y - boardViewport.minY;
  });
}

function clampBoardOffset(rawX, rawY, scale = boardViewport.scale) {
  const availableWidth = Math.max(1, boardWrap.clientWidth - 16);
  const availableHeight = Math.max(1, boardWrap.clientHeight - 16);
  const scaledWidth = boardViewport.contentWidth * scale;
  const scaledHeight = boardViewport.contentHeight * scale;

  const minOffsetX = scaledWidth > availableWidth ? availableWidth - scaledWidth : (availableWidth - scaledWidth) / 2;
  const maxOffsetX = scaledWidth > availableWidth ? 0 : minOffsetX;
  const minOffsetY = scaledHeight > availableHeight ? availableHeight - scaledHeight : (availableHeight - scaledHeight) / 2;
  const maxOffsetY = scaledHeight > availableHeight ? 0 : minOffsetY;

  return {
    x: Math.min(maxOffsetX, Math.max(minOffsetX, rawX)),
    y: Math.min(maxOffsetY, Math.max(minOffsetY, rawY))
  };
}

function applyBoardTransform() {
  const clamped = clampBoardOffset(boardViewport.offsetX, boardViewport.offsetY, boardViewport.scale);
  boardViewport.offsetX = clamped.x;
  boardViewport.offsetY = clamped.y;
  boardElement.style.width = `${boardViewport.contentWidth}px`;
  boardElement.style.height = `${boardViewport.contentHeight}px`;
  boardElement.style.transform = `translate(${boardViewport.offsetX}px, ${boardViewport.offsetY}px) scale(${boardViewport.scale})`;
}

function fitBoardToViewport(resetView = false) {
  if (!boardTiles.length) {
    boardViewport.contentWidth = 0;
    boardViewport.contentHeight = 0;
    boardElement.style.width = "0";
    boardElement.style.height = "0";
    boardElement.style.transform = "none";
    return;
  }
  updateBoardViewportMetrics();
  const availableWidth = Math.max(1, boardWrap.clientWidth - 16);
  const availableHeight = Math.max(1, boardWrap.clientHeight - 16);

  if (resetView || boardViewport.scale < boardViewport.minScale || boardViewport.scale === 1) {
    const initialScale = Math.min(
      boardViewport.maxScale,
      Math.max(boardViewport.minScale, boardViewport.minScale * getInitialViewScaleMultiplier())
    );
    boardViewport.scale = initialScale;
    const centered = clampBoardOffset(
      (availableWidth - boardViewport.contentWidth * initialScale) / 2,
      (availableHeight - boardViewport.contentHeight * initialScale) / 2,
      initialScale
    );
    boardViewport.offsetX = centered.x;
    boardViewport.offsetY = centered.y;
  }

  applyBoardTransform();
}

function zoomBoard(nextScale, originX, originY) {
  const clampedScale = Math.min(boardViewport.maxScale, Math.max(boardViewport.minScale, nextScale));
  const scaleRatio = clampedScale / boardViewport.scale;
  const localX = originX - boardViewport.offsetX;
  const localY = originY - boardViewport.offsetY;

  boardViewport.offsetX = originX - localX * scaleRatio;
  boardViewport.offsetY = originY - localY * scaleRatio;
  boardViewport.scale = clampedScale;
  applyBoardTransform();
}

function onBoardPointerDown(event) {
  if (overlay.classList.contains("visible")) {
    return;
  }

  if (event.button !== 0) {
    return;
  }

  boardViewport.pressing = true;
  boardViewport.dragging = false;
  boardViewport.moved = false;
  boardViewport.pointerId = event.pointerId;
  boardViewport.startX = event.clientX;
  boardViewport.startY = event.clientY;
  boardViewport.originOffsetX = boardViewport.offsetX;
  boardViewport.originOffsetY = boardViewport.offsetY;
}

function onBoardPointerMove(event) {
  if ((!boardViewport.pressing && !boardViewport.dragging) || boardViewport.pointerId !== event.pointerId) {
    return;
  }

  const deltaX = event.clientX - boardViewport.startX;
  const deltaY = event.clientY - boardViewport.startY;

  if (!boardViewport.dragging && (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6)) {
    boardViewport.dragging = true;
    boardViewport.moved = true;
    boardWrap.classList.add("dragging");
    boardWrap.setPointerCapture(event.pointerId);
  }

  if (!boardViewport.dragging) {
    return;
  }

  boardViewport.offsetX = boardViewport.originOffsetX + deltaX;
  boardViewport.offsetY = boardViewport.originOffsetY + deltaY;
  applyBoardTransform();
}

function endBoardPointer(event) {
  if (boardViewport.pointerId === event.pointerId) {
    if (boardViewport.moved) {
      boardViewport.lastTapSuppressUntil = Date.now() + 120;
    }
    boardViewport.pressing = false;
    boardViewport.dragging = false;
    boardViewport.pointerId = null;
    boardWrap.classList.remove("dragging");
  }
}

function onBoardWheel(event) {
  event.preventDefault();
  const rect = boardWrap.getBoundingClientRect();
  const originX = event.clientX - rect.left;
  const originY = event.clientY - rect.top;
  const multiplier = event.deltaY < 0 ? 1.12 : 0.9;
  zoomBoard(boardViewport.scale * multiplier, originX, originY);
}

function touchDistance(first, second) {
  const deltaX = first.clientX - second.clientX;
  const deltaY = first.clientY - second.clientY;
  return Math.hypot(deltaX, deltaY);
}

function touchCenter(first, second) {
  return {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2
  };
}

function onBoardTouchStart(event) {
  for (const touch of event.changedTouches) {
    boardViewport.touches.set(touch.identifier, touch);
  }

  if (boardViewport.touches.size === 2) {
    const [first, second] = [...boardViewport.touches.values()];
    boardViewport.pinchDistance = touchDistance(first, second);
    boardViewport.pinchScaleStart = boardViewport.scale;
  }
}

function onBoardTouchMove(event) {
  for (const touch of event.changedTouches) {
    boardViewport.touches.set(touch.identifier, touch);
  }

  if (boardViewport.touches.size === 2) {
    event.preventDefault();
    const [first, second] = [...boardViewport.touches.values()];
    const nextDistance = touchDistance(first, second);
    if (!boardViewport.pinchDistance) {
      boardViewport.pinchDistance = nextDistance;
      boardViewport.pinchScaleStart = boardViewport.scale;
      return;
    }

    const center = touchCenter(first, second);
    const rect = boardWrap.getBoundingClientRect();
    const scaleFactor = nextDistance / boardViewport.pinchDistance;
    zoomBoard(boardViewport.pinchScaleStart * scaleFactor, center.x - rect.left, center.y - rect.top);
    boardViewport.lastTapSuppressUntil = Date.now() + 120;
  }
}

function onBoardTouchEnd(event) {
  for (const touch of event.changedTouches) {
    boardViewport.touches.delete(touch.identifier);
  }

  if (boardViewport.touches.size < 2) {
    boardViewport.pinchDistance = 0;
  }
}

function renderBoard(resetView = false) {
  updateBoardViewportMetrics();
  boardElement.innerHTML = "";

  const activeTiles = boardTiles
    .filter((tile) => !tile.removed)
    .sort((first, second) => first.layer - second.layer || first.y - second.y || first.x - second.x);

  activeTiles.forEach((tile) => {
    const tileElement = createTileElement(tile);
    const blocked = isBlocked(tile);
    tileElement.classList.toggle("blocked", blocked);
    tileElement.classList.toggle("available", !blocked);
    tileElement.disabled = blocked || gameState !== "running";
    boardElement.appendChild(tileElement);
  });

  fitBoardToViewport(resetView);
}

function createEmptyTraySlot() {
  const slot = document.createElement("div");
  slot.className = "tray-slot";
  return slot;
}

function toggleTraySelection(tileId) {
  if (gameState !== "running" || !removeModeActive) {
    return;
  }

  const selectedIndex = selectedTrayTileIds.indexOf(tileId);
  if (selectedIndex !== -1) {
    selectedTrayTileIds.splice(selectedIndex, 1);
  } else if (selectedTrayTileIds.length < 3) {
    selectedTrayTileIds.push(tileId);
  }

  if (selectedTrayTileIds.length === 3) {
    finalizeRemoveSelection();
    return;
  }

  renderTray();
  updateCounters();
}

function finalizeRemoveSelection() {
  if (selectedTrayTileIds.length !== 3) {
    return;
  }

  const selectedSet = new Set(selectedTrayTileIds);
  const movingTiles = trayTiles.filter((tile) => selectedSet.has(tile.uid)).map((tile) => ({ ...tile }));
  if (movingTiles.length !== 3) {
    return;
  }

  trayTiles = trayTiles.filter((tile) => !selectedSet.has(tile.uid));
  stashTiles = movingTiles;
  selectedTrayTileIds = [];
  removeModeActive = false;
  removeTriples();

  removeRemaining -= 1;
  actionHistory = [];
  updateCounters();
  renderTray();
  renderStash();
  checkWinOrLose();
}

function createTrayTileElement(tile) {
  const tileElement = document.createElement("button");
  tileElement.type = "button";
  tileElement.className = "tray-tile";
  tileElement.classList.toggle("selected", selectedTrayTileIds.includes(tile.uid));
  tileElement.disabled = gameState !== "running";

  const image = document.createElement("img");
  image.src = tile.image;
  image.alt = "\u69fd\u4f4d\u724c\u9762";

  tileElement.append(image);
  tileElement.addEventListener("click", () => toggleTraySelection(tile.uid));
  return tileElement;
}

function renderTray() {
  trayElement.innerHTML = "";

  for (let index = 0; index < slotLimit; index += 1) {
    const slot = createEmptyTraySlot();
    if (trayTiles[index]) {
      slot.appendChild(createTrayTileElement(trayTiles[index]));
    }
    trayElement.appendChild(slot);
  }
}

function createEmptyStashSlot() {
  const slot = document.createElement("div");
  slot.className = "stash-slot";
  return slot;
}

function createStashTileElement(tile) {
  const tileElement = document.createElement("div");
  tileElement.className = "stash-tile";

  const image = document.createElement("img");
  image.src = tile.image;
  image.alt = "\u4e34\u65f6\u69fd\u4f4d\u724c\u9762";

  tileElement.append(image);
  return tileElement;
}

function renderStash() {
  stashElement.innerHTML = "";

  for (let index = 0; index < stashLimit; index += 1) {
    const slot = createEmptyStashSlot();
    if (stashTiles[index]) {
      slot.appendChild(createStashTileElement(stashTiles[index]));
    }
    stashElement.appendChild(slot);
  }
}

function getInsertIndex(tile) {
  let lastMatchIndex = -1;

  trayTiles.forEach((trayTile, index) => {
    if (trayTile.typeId === tile.typeId) {
      lastMatchIndex = index;
    }
  });

  return lastMatchIndex === -1 ? trayTiles.length : lastMatchIndex + 1;
}

function removeTriples() {
  const groups = new Map();
  const removedTiles = [];

  [
    { area: "tray", tiles: trayTiles },
    { area: "stash", tiles: stashTiles }
  ].forEach(({ area, tiles }) => {
    tiles.forEach((tile, index) => {
      if (!groups.has(tile.typeId)) {
        groups.set(tile.typeId, []);
      }
      groups.get(tile.typeId).push({
        area,
        index,
        tile: { ...tile }
      });
    });
  });

  groups.forEach((entries) => {
    if (entries.length >= 3) {
      removedTiles.push(...entries.slice(0, 3));
    }
  });

  if (removedTiles.length === 0) {
    return [];
  }

  const trayIndexesToRemove = new Set(
    removedTiles.filter((entry) => entry.area === "tray").map((entry) => entry.index)
  );
  const stashIndexesToRemove = new Set(
    removedTiles.filter((entry) => entry.area === "stash").map((entry) => entry.index)
  );

  trayTiles = trayTiles.filter((_, index) => !trayIndexesToRemove.has(index));
  stashTiles = stashTiles.filter((_, index) => !stashIndexesToRemove.has(index));
  selectedTrayTileIds = selectedTrayTileIds.filter((tileId) => trayTiles.some((tile) => tile.uid === tileId));

  return removedTiles;
}

function tryRearrangeActiveTiles(activeTiles, trayState, attempts = 12) {
  const sourceSlots = activeTiles.map((tile) => ({
    x: tile.x,
    y: tile.y,
    layer: tile.layer,
    width: tile.width,
    height: tile.height
  }));

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const openSlots = [];
    const closedSlots = [];

    activeTiles.forEach((tile) => {
      const slot = {
        x: tile.x,
        y: tile.y,
        layer: tile.layer,
        width: tile.width,
        height: tile.height
      };

      if (isBlocked(tile)) {
        closedSlots.push(slot);
      } else {
        openSlots.push(slot);
      }
    });

    const availableTypeCounts = countTypes(activeTiles);
    const trayTypeCounts = countTypes(trayState);
    const visibleTypeIds = chooseVisibleTypeIds(availableTypeCounts, openSlots.length, trayTypeCounts);
    const buckets = new Map();

    activeTiles.forEach((tile) => {
      if (!buckets.has(tile.typeId)) {
        buckets.set(tile.typeId, []);
      }
      buckets.get(tile.typeId).push(tile);
    });

    const selectedOpenTiles = [];
    visibleTypeIds.forEach((typeId) => {
      const bucket = buckets.get(typeId);
      if (bucket && bucket.length > 0) {
        selectedOpenTiles.push(bucket.pop());
      }
    });

    const remainingTiles = shuffle([...buckets.values()].flat());
    const orderedTiles = [...selectedOpenTiles, ...remainingTiles];
    const orderedSlots = [...shuffle(openSlots), ...shuffle(closedSlots)];

    orderedTiles.forEach((tile, index) => {
      const slot = orderedSlots[index];
      tile.x = slot.x;
      tile.y = slot.y;
      tile.layer = slot.layer;
      tile.width = slot.width;
      tile.height = slot.height;
    });

    if (validateGeneratedBoard(boardTiles, trayState)) {
      return true;
    }
  }

  activeTiles.forEach((tile, index) => {
    const slot = sourceSlots[index];
    tile.x = slot.x;
    tile.y = slot.y;
    tile.layer = slot.layer;
    tile.width = slot.width;
    tile.height = slot.height;
  });

  return false;
}

function snapshotAction(tile, insertIndex, removedTrayTiles) {
  actionHistory.push({
    boardTileId: tile.uid,
    insertedTrayTile: {
      uid: tile.uid,
      typeId: tile.typeId,
      typeLabel: tile.typeLabel,
      image: tile.image
    },
    insertIndex,
    removedTrayTiles
  });
}

function hasUndoRescue() {
  return gameState === "running" && undoRemaining > 0 && actionHistory.length > 0;
}

function hasShuffleRescue() {
  return gameState === "running" && shuffleRemaining > 0;
}

function showStuckOverlay() {
  const actions = [];

  if (hasUndoRescue()) {
    actions.push({
      label: "\u64a4\u56de\u4e00\u6b65",
      onClick: () => {
        hideOverlay();
        undoLastMove();
      }
    });
  }

  if (hasShuffleRescue()) {
    actions.push({
      label: "\u4f7f\u7528\u6d17\u724c",
      className: "secondary",
      onClick: () => {
        hideOverlay();
        shuffleBoard();
      }
    });
  }

  actions.push({
    label: "\u91cd\u65b0\u5f00\u59cb",
    className: actions.length > 0 ? "secondary" : "",
    onClick: () => {
      resetGame();
      startGame();
    }
  });

  updateStatus("\u9700\u8981\u9053\u5177");
  showOverlay("\u6682\u65f6\u65e0\u724c\u53ef\u70b9", "");
  setOverlayActions(actions);
}

function undoLastMove() {
  if (gameState !== "running" || actionHistory.length === 0 || undoRemaining === 0) {
    return;
  }

  const lastAction = actionHistory.pop();

  lastAction.removedTrayTiles
    .sort((first, second) => first.index - second.index)
    .forEach((entry) => {
      trayTiles.splice(entry.index, 0, entry.tile);
    });

  const insertedIndex = trayTiles.findIndex((tile) => tile.uid === lastAction.insertedTrayTile.uid);
  if (insertedIndex !== -1) {
    trayTiles.splice(insertedIndex, 1);
  }

  const boardTile = boardTiles.find((tile) => tile.uid === lastAction.boardTileId);
  if (boardTile) {
    boardTile.removed = false;
  }

  undoRemaining -= 1;
  renderTray();
  renderBoard(false);
  updateCounters();
  checkWinOrLose();
}

function shuffleBoard() {
  if (gameState !== "running" || shuffleRemaining === 0) {
    return;
  }

  const activeTiles = getActiveTiles();
  tryRearrangeActiveTiles(activeTiles, trayTiles);

  shuffleRemaining -= 1;
  actionHistory = [];
  renderBoard(false);
  updateCounters();
  checkWinOrLose();
}

function removeThreeTiles() {
  if (gameState !== "running" || removeRemaining === 0) {
    return;
  }

  if (stashTiles.length > 0) {
    return;
  }

  removeModeActive = !removeModeActive;
  if (!removeModeActive) {
    selectedTrayTileIds = [];
  }

  updateCounters();
  renderTray();
}

function checkWinOrLose() {
  const remaining = getActiveTiles().length;
  const availableMoves = getAvailableTiles().length;

  if (remaining === 0 && trayTiles.length === 0) {
    gameState = "won";
    stopLevelTimer();
    updateTimerUi();
    updateStatus("\u5df2\u901a\u5173");
    latestClearTimeMs = getLatestClearTimeMs();
    const nextLevelExists = currentLevelIndex < levelDefinitions.length - 1;
    const timedSummary = getTimedLevelSummary();
    if (isTimedLevel()) {
      showScoreSubmitOverlay();
    } else {
      showOverlay(
        nextLevelExists ? "\u672c\u5173\u5b8c\u6210" : "\u606d\u559c\u4f60\u662f\u4e00\u540d\u771f\u6b63\u7684GAI\u5b5d\u5b50",
        timedSummary
      );
      setOverlayActions(
        nextLevelExists
          ? [
              {
                label: "\u8fdb\u5165\u4e0b\u4e00\u5173",
                onClick: () => {
                  currentLevelIndex += 1;
                  resetGame();
                  startGame();
                }
              },
              {
                label: "\u91cd\u65b0\u6311\u6218",
                className: "secondary",
                onClick: () => {
                  resetGame();
                  startGame();
                }
              }
            ]
          : [
              {
                label: "\u518d\u6765\u4e00\u628a",
                onClick: () => {
                  currentLevelIndex = 0;
                  resetGame();
                  startGame();
                }
              }
            ]
      );
    }
    renderBoard(false);
    return;
  }

  if (remaining === 0 && trayTiles.length > 0) {
    gameState = "lost";
    stopLevelTimer();
    updateTimerUi();
    updateStatus("\u6311\u6218\u5931\u8d25");
    showOverlay("\u724c\u9762\u5df2\u6e05\u7a7a", "");
    setOverlayActions([
      {
        label: "\u91cd\u65b0\u5f00\u59cb",
        onClick: () => {
          resetGame();
          startGame();
        }
      }
    ]);
    renderBoard(false);
    return;
  }

  if (trayTiles.length >= slotLimit) {
    gameState = "lost";
    stopLevelTimer();
    updateTimerUi();
    updateStatus("\u6311\u6218\u5931\u8d25");
    showOverlay("\u69fd\u4f4d\u5df2\u6ee1", "");
    setOverlayActions([
      {
        label: "\u91cd\u65b0\u5f00\u59cb",
        onClick: () => {
          resetGame();
          startGame();
        }
      }
    ]);
    renderBoard(false);
    return;
  }

  if (availableMoves === 0) {
    if (hasUndoRescue() || hasShuffleRescue()) {
      showStuckOverlay();
      renderBoard(false);
      return;
    }

    gameState = "lost";
    stopLevelTimer();
    updateTimerUi();
    updateStatus("\u65e0\u724c\u53ef\u70b9");
    showOverlay("\u5c40\u9762\u9501\u6b7b", "");
    setOverlayActions([
      {
        label: "\u91cd\u65b0\u5f00\u59cb",
        onClick: () => {
          resetGame();
          startGame();
        }
      }
    ]);
    renderBoard(false);
  }
}

function handleTileClick(tileId) {
  if (gameState !== "running") {
    return;
  }

  const tile = boardTiles.find((candidate) => candidate.uid === tileId);
  if (!tile || tile.removed || isBlocked(tile)) {
    return;
  }

  tile.removed = true;

  const insertIndex = getInsertIndex(tile);
  trayTiles.splice(insertIndex, 0, {
    uid: tile.uid,
    typeId: tile.typeId,
    typeLabel: tile.typeLabel,
    image: tile.image
  });

  const removedTrayTiles = removeTriples();
  snapshotAction(tile, insertIndex, removedTrayTiles);
  selectedTrayTileIds = selectedTrayTileIds.filter((tileId) => trayTiles.some((trayTile) => trayTile.uid === tileId));
  if (selectedTrayTileIds.length === 0) {
    removeModeActive = false;
  }
  updateCounters();
  renderTray();
  renderStash();
  renderBoard(false);
  checkWinOrLose();
}

function resetGame() {
  boardTiles = generatePlayableBoard();
  trayTiles = [];
  stashTiles = [];
  selectedTrayTileIds = [];
  removeModeActive = false;
  actionHistory = [];
  shuffleRemaining = getToolCount("shuffleCount");
  undoRemaining = getToolCount("undoCount");
  removeRemaining = getToolCount("removeCount");
  stopLevelTimer();
  clearHintOverlayTimer();
  levelTimerStartedAt = null;
  latestClearTimeMs = null;
  gameState = "idle";
  updateLevelLabel();
  updateStatus("\u672a\u5f00\u59cb");
  updateCounters();
  updateTimerUi();
  renderTray();
  renderStash();
  renderBoard(true);
}

function startGame() {
  if (gameState === "running") {
    return;
  }

  if (gameState === "won" || gameState === "lost") {
    boardTiles = generatePlayableBoard();
    trayTiles = [];
    stashTiles = [];
    selectedTrayTileIds = [];
    removeModeActive = false;
    actionHistory = [];
    shuffleRemaining = getToolCount("shuffleCount");
    undoRemaining = getToolCount("undoCount");
    removeRemaining = getToolCount("removeCount");
  }

  if (isTimedLevel()) {
    levelTimerStartedAt = Date.now();
  } else {
    levelTimerStartedAt = null;
  }
  startLevelTimer();

  setOverlayActions([]);
  gameState = "running";
  updateLevelLabel();
  updateStatus("\u8fdb\u884c\u4e2d");
  hideOverlay();
  updateCounters();
  renderTray();
  renderStash();
  renderBoard(true);

  showHintOverlay("操作提示", "可以双指缩放画面，拖动查看更深层卡牌。", 1500);
}

startButton.addEventListener("click", () => {
  startGame();
});

undoButton.addEventListener("click", undoLastMove);
shuffleButton.addEventListener("click", shuffleBoard);
removeButton.addEventListener("click", removeThreeTiles);
leaderboardButton.addEventListener("click", () => {
  showLeaderboardOverlay("第二关历史排行榜");
});
restartButton.addEventListener("click", () => {
  currentLevelIndex = 0;
  resetGame();
  showOverlay("\u51c6\u5907\u5f00\u59cb", "");
  setOverlayActions([]);
});

prevTrackButton.addEventListener("click", playPreviousTrack);
playPauseButton.addEventListener("click", togglePlayPause);
nextTrackButton.addEventListener("click", playNextTrack);
loopTrackButton.addEventListener("click", toggleSingleTrackLoop);
bgmAudio.addEventListener("play", updateMusicUi);
bgmAudio.addEventListener("pause", updateMusicUi);
bgmAudio.addEventListener("ended", () => {
  if (!singleTrackLoop) {
    playNextTrack();
  }
});

resetGame();
loadTrack(0, false);
showOverlay("\u51c6\u5907\u5f00\u59cb", "");
setOverlayActions([]);

boardWrap.addEventListener("pointerdown", onBoardPointerDown);
boardWrap.addEventListener("pointermove", onBoardPointerMove);
boardWrap.addEventListener("pointerup", endBoardPointer);
boardWrap.addEventListener("pointercancel", endBoardPointer);
boardWrap.addEventListener("wheel", onBoardWheel, { passive: false });
boardWrap.addEventListener("touchstart", onBoardTouchStart, { passive: false });
boardWrap.addEventListener("touchmove", onBoardTouchMove, { passive: false });
boardWrap.addEventListener("touchend", onBoardTouchEnd, { passive: false });
boardWrap.addEventListener("touchcancel", onBoardTouchEnd, { passive: false });
window.addEventListener("resize", () => fitBoardToViewport(true));



