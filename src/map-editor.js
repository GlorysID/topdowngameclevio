const LEGACY_VILLAGE_STORAGE_KEY = "villageLayout.v1";
const LAYOUT_STORAGE_PREFIX = "gameLayout.";
const CUSTOM_ASSET_KEY = "villageCustomAssets.v1";
const BARRIER_TYPE = "barrier";
const BARRIER_DEFAULT_WIDTH = 160;
const BARRIER_DEFAULT_HEIGHT = 96;
const BARRIER_MIN_SIZE = 24;
const SELECTION_BOX_MIN_DRAG = 6;
const DUPLICATE_OFFSET = 34;
const HISTORY_LIMIT = 80;
const TRANSFER_MIME_TYPE = "application/x-map-editor-selection";
const DEFAULT_PLAYER_DEPTH = 20;

const EDITOR_TARGETS = {
  village: {
    label: "Desa Besar",
    storageKey: `${LAYOUT_STORAGE_PREFIX}village.v1`,
    width: 2200,
    height: 1400,
    defaultKey: "house2Day",
    hint: "Layout desa luar ruangan. Role penting: Rumah Kepala Desa dan Arah Kantor Desa."
  },
  home: {
    label: "Rumah Kepala Desa / Kamar",
    storageKey: `${LAYOUT_STORAGE_PREFIX}home.v1`,
    width: 1280,
    height: 780,
    defaultKey: "groundDetail1Day",
    hint: "Layout rumah Kepala Desa bagian dalam. Role penting: Pintu Rumah, Tempat Tidur, Cermin, Tas Uang."
  },
  office: {
    label: "Kantor Desa",
    storageKey: `${LAYOUT_STORAGE_PREFIX}office.v1`,
    width: 1280,
    height: 780,
    defaultKey: "groundDetail5Day",
    hint: "Layout kantor siang/malam. Role penting: Meja Proyek, Pintu Keluar, Kursi, Telepon, Jendela."
  },
  luxuryOffice: {
    label: "Kantor Desa Mewah",
    storageKey: `${LAYOUT_STORAGE_PREFIX}luxuryOffice.v1`,
    width: 1280,
    height: 780,
    defaultKey: "groundDetail4Day",
    hint: "Layout kantor setelah jadi mewah/emas. Role penting: Kursi, Telepon, Uang, Pintu, Jendela."
  },
  ceremony: {
    label: "Tempat Pidato",
    storageKey: `${LAYOUT_STORAGE_PREFIX}ceremony.v1`,
    width: 1280,
    height: 780,
    defaultKey: "bridgeDay",
    hint: "Layout pelantikan dan podium pidato."
  },
  act3Office: {
    label: "Kantor Hangus Act 3",
    storageKey: `${LAYOUT_STORAGE_PREFIX}act3Office.v1`,
    width: 1280,
    height: 780,
    defaultKey: "house2Night",
    hint: "Layout kantor yang hangus saat Act 3. Role penting: Puing Meja Proyek dan Keluar Act 3."
  },
  dreamBedroom: {
    label: "Kamar Kepala Desa (Mimpi)",
    storageKey: `${LAYOUT_STORAGE_PREFIX}dreamBedroom.v1`,
    width: 1280,
    height: 780,
    defaultKey: "groundDetail1Night",
    hint: "Layout kamar Kepala Desa saat mimpi dimulai. Role penting: Pintu Mimpi, Tempat Tidur, Cermin."
  },
  nightmare: {
    label: "Desa Mimpi Buruk",
    storageKey: `${LAYOUT_STORAGE_PREFIX}nightmare.v1`,
    width: 2200,
    height: 1400,
    defaultKey: "house2Night",
    hint: "Layout desa rusak di dalam mimpi. Role penting: Cermin/Sosok di ujung map."
  },
  ending: {
    label: "Ending Apocalypse",
    storageKey: `${LAYOUT_STORAGE_PREFIX}ending.v1`,
    width: 2600,
    height: 900,
    defaultKey: "tree1Night",
    hint: "Layout desa hancur untuk final walk."
  }
};

const DEFAULT_LAYOUTS = {
  village: {
    version: 2,
    target: "village",
    objects: [
      { key: "house2Day", x: 460, y: 382, scale: 2.8, depth: 18, label: "Rumah Kepala Desa", role: "chiefHome", labelOffsetY: 76 },
      { key: "house1Day", x: 915, y: 360, scale: 2.05, depth: 18, label: "Warung", flipX: true, labelOffsetY: 72 },
      { key: "house1Day", x: 555, y: 1005, scale: 2.05, depth: 18, label: "Balai Warga", labelOffsetY: 72 },
      { key: "house1Day", x: 1510, y: 305, scale: 1.9, depth: 18, label: "Rumah Warga", labelOffsetY: 74 },
      { key: "house2Day", x: 1980, y: 308, scale: 1.8, depth: 18, label: "Gudang", flipX: true, labelOffsetY: 80 },
      { key: "bridgeDay", x: 250, y: 1182, scale: 2, depth: 9, label: "Arah Kantor Desa", role: "officeExit", labelOffsetY: -36 },
      { key: "stairsDay", x: 500, y: 660, scale: 2.35, depth: 9 },
      { key: "pitDay", x: 1800, y: 326, scale: 2.15, depth: 12 },
      { key: "tree1Day", x: 820, y: 320, scale: 1.75, depth: 20 },
      { key: "tree2Day", x: 1010, y: 330, scale: 1.8, depth: 20 },
      { key: "tree3Day", x: 1470, y: 155, scale: 1.65, depth: 20 },
      { key: "tree1Day", x: 1960, y: 780, scale: 1.55, depth: 20 },
      { key: "terrain3Day", x: 320, y: 620, scale: 2.35, depth: 7 },
      { key: "terrain4Day", x: 450, y: 620, scale: 2.35, depth: 7 },
      { key: "terrain3Day", x: 580, y: 620, scale: 2.35, depth: 7 },
      { key: "terrain4Day", x: 710, y: 620, scale: 2.35, depth: 7 },
      { key: "terrain3Day", x: 1660, y: 502, scale: 2.35, depth: 7 },
      { key: "terrain4Day", x: 1790, y: 502, scale: 2.35, depth: 7 },
      { key: "terrain3Day", x: 1920, y: 502, scale: 2.35, depth: 7 },
      { key: "fence1Day", x: 230, y: 210, scale: 2.4, depth: 12 },
      { key: "fence2Day", x: 230, y: 286, scale: 2.4, depth: 12 },
      { key: "fence1Day", x: 635, y: 210, scale: 2.4, depth: 12 },
      { key: "fence2Day", x: 710, y: 210, scale: 2.4, depth: 12 },
      { key: "groundDetail1Day", x: 430, y: 850, scale: 2.25, depth: 11 },
      { key: "groundDetail2Day", x: 640, y: 890, scale: 2.25, depth: 11 },
      { key: "groundDetail3Day", x: 870, y: 930, scale: 2.25, depth: 11 },
      { key: "grassDetail1Day", x: 815, y: 440, scale: 2.2, depth: 13 },
      { key: "grassDetail2Day", x: 1010, y: 520, scale: 2.2, depth: 13 },
      { key: "grassDetail3Day", x: 1830, y: 1115, scale: 2.2, depth: 13 }
    ]
  },
  home: {
    version: 2,
    target: "home",
    objects: [
      { key: "stairsDay", x: 640, y: 704, scale: 2.2, depth: 18, label: "Pintu Rumah", role: "homeExit", labelOffsetY: -36 },
      { key: "groundDetail1Day", x: 820, y: 392, scale: 2.8, depth: 18, label: "Tempat Tidur", role: "bed", labelOffsetY: 36 },
      { key: "waterDetail1Night", x: 958, y: 282, scale: 2.8, depth: 19, label: "Cermin", role: "mirror", labelOffsetY: 28 },
      { key: "groundDetail4Day", x: 1010, y: 548, scale: 2.5, depth: 19, label: "Tas Uang", role: "moneyBag", labelOffsetY: 30 },
      { key: "fence1Day", x: 368, y: 368, scale: 2.4, depth: 17, label: "Ruang Tengah", labelOffsetY: 42 }
    ]
  },
  office: {
    version: 2,
    target: "office",
    objects: [
      { key: "groundDetail5Day", x: 640, y: 226, scale: 3.4, depth: 18, label: "Meja Proyek Desa", role: "projectDesk", labelOffsetY: 44 },
      { key: "stairsDay", x: 640, y: 704, scale: 2.35, depth: 18, label: "Pintu Keluar", role: "exitDoor", labelOffsetY: -38 },
      { key: "groundDetail4Day", x: 252, y: 640, scale: 2.4, depth: 19, label: "Tumpukan Uang", role: "moneyPile", labelOffsetY: 34 },
      { key: "waterDetail2Day", x: 845, y: 226, scale: 2.2, depth: 19, label: "Telepon", role: "phone", labelOffsetY: 28 },
      { key: "fence2Day", x: 202, y: 160, scale: 2.5, depth: 19, label: "Jendela", role: "window", labelOffsetY: 34 },
      { key: "pitDay", x: 640, y: 382, scale: 1.8, depth: 17, label: "Kursi", role: "chair", labelOffsetY: 42 }
    ]
  },
  luxuryOffice: {
    version: 2,
    target: "luxuryOffice",
    objects: [
      { key: "groundDetail5Day", x: 640, y: 226, scale: 3.7, depth: 18, label: "Meja Emas", role: "projectDesk", labelOffsetY: 46, tint: 0xffd45a },
      { key: "pitDay", x: 640, y: 360, scale: 2.1, depth: 19, label: "Kursi Emas", role: "chair", labelOffsetY: 44, tint: 0xffd21c },
      { key: "groundDetail4Day", x: 1010, y: 570, scale: 2.8, depth: 19, label: "Tumpukan Uang", role: "moneyPile", labelOffsetY: 34, tint: 0xffe066 },
      { key: "waterDetail2Day", x: 850, y: 218, scale: 2.35, depth: 20, label: "Telepon Misterius", role: "phone", labelOffsetY: 30 },
      { key: "fence2Day", x: 210, y: 158, scale: 2.55, depth: 19, label: "Jendela", role: "window", labelOffsetY: 34 },
      { key: "stairsDay", x: 640, y: 704, scale: 2.45, depth: 18, label: "Pintu Terkunci", role: "exitDoor", labelOffsetY: -38, tint: 0xffd21c },
      { key: "fence1Day", x: 210, y: 374, scale: 2.6, depth: 18, label: "Lemari Emas", role: "", labelOffsetY: 44, tint: 0xffc74a },
      { key: "fence1Day", x: 1070, y: 374, scale: 2.6, depth: 18, label: "Lemari Emas", role: "", labelOffsetY: 44, tint: 0xffc74a }
    ]
  },
  ceremony: {
    version: 2,
    target: "ceremony",
    objects: [
      { key: "bridgeDay", x: 640, y: 278, scale: 2.7, depth: 18, label: "Podium", role: "podium", labelOffsetY: 42 },
      { key: "fence1Day", x: 430, y: 328, scale: 2.5, depth: 16 },
      { key: "fence2Day", x: 850, y: 328, scale: 2.5, depth: 16 },
      { key: "tree1Day", x: 215, y: 620, scale: 1.55, depth: 20 },
      { key: "tree2Day", x: 1060, y: 614, scale: 1.6, depth: 20 }
    ]
  },
  act3Office: {
    version: 2,
    target: "act3Office",
    objects: [
      { key: "house2Night", x: 640, y: 304, scale: 2.4, depth: 18, label: "Kantor Hangus", labelOffsetY: 78 },
      { key: "groundDetail3Night", x: 640, y: 458, scale: 3.2, depth: 19, label: "Puing Meja Proyek", role: "actThreeRuin", labelOffsetY: 38 },
      { key: "bridgeNight", x: 640, y: 704, scale: 2.25, depth: 18, label: "Ke Pemukiman Warga", role: "actThreeExit", labelOffsetY: -40 },
      { key: "tree1Night", x: 172, y: 628, scale: 1.8, depth: 20, tint: 0x222222 },
      { key: "tree2Night", x: 1080, y: 624, scale: 1.8, depth: 20, tint: 0x222222 }
    ]
  },
  dreamBedroom: {
    version: 2,
    target: "dreamBedroom",
    objects: [
      { key: "groundDetail1Night", x: 820, y: 392, scale: 2.9, depth: 18, label: "Tempat Tidur Mimpi", role: "bed", labelOffsetY: 38, tint: 0x9b6572 },
      { key: "stairsNight", x: 640, y: 704, scale: 2.25, depth: 18, label: "Pintu Mimpi", role: "homeExit", labelOffsetY: -36 },
      { key: "waterDetail1Night", x: 958, y: 282, scale: 2.85, depth: 19, label: "Cermin Retak", role: "mirror", labelOffsetY: 28 },
      { key: "groundDetail4Night", x: 1010, y: 548, scale: 2.55, depth: 19, label: "Bayangan Tas Uang", role: "moneyBag", labelOffsetY: 30, tint: 0x5b4540 },
      { key: "fence2Night", x: 372, y: 370, scale: 2.65, depth: 17, label: "Ruang Tengah Gelap", labelOffsetY: 42 },
      { key: "waterDetail3Night", x: 640, y: 188, scale: 3.2, depth: 16, label: "Noda Gelap", labelOffsetY: 30, tint: 0x42101a }
    ]
  },
  nightmare: {
    version: 2,
    target: "nightmare",
    objects: [
      { key: "house2Night", x: 360, y: 382, scale: 2.15, depth: 18, label: "Rumah Dalam Mimpi", labelOffsetY: 76, tint: 0x565066 },
      { key: "house1Night", x: 760, y: 760, scale: 1.75, depth: 18, label: "Rumah Rusak", labelOffsetY: 70, tint: 0x555555 },
      { key: "house1Night", x: 1320, y: 420, scale: 1.65, depth: 18, label: "Gubuk Warga", labelOffsetY: 70, tint: 0x4b4b4b },
      { key: "house2Night", x: 1740, y: 836, scale: 1.6, depth: 18, label: "Rumah Retak", labelOffsetY: 74, tint: 0x505050 },
      { key: "tree1Night", x: 590, y: 338, scale: 1.8, depth: 20, tint: 0x333333 },
      { key: "tree2Night", x: 1010, y: 610, scale: 1.8, depth: 20, tint: 0x333333 },
      { key: "tree3Night", x: 1510, y: 1010, scale: 1.7, depth: 20, tint: 0x303030 },
      { key: "groundDetail1Night", x: 520, y: 730, scale: 2.25, depth: 12, tint: 0x4a4541 },
      { key: "groundDetail2Night", x: 900, y: 770, scale: 2.25, depth: 12, tint: 0x4a4541 },
      { key: "groundDetail3Night", x: 1260, y: 730, scale: 2.25, depth: 12, tint: 0x4a4541 },
      { key: "waterDetail3Night", x: 1980, y: 1150, scale: 3.4, depth: 21, label: "Cermin Gelap", role: "dreamMirror", labelOffsetY: 34 }
    ]
  },
  ending: {
    version: 2,
    target: "ending",
    objects: [
      { key: "tree1Night", x: 260, y: 230, scale: 1.65, depth: 12, tint: 0x111111 },
      { key: "tree2Night", x: 620, y: 704, scale: 1.55, depth: 12, tint: 0x111111 },
      { key: "house1Night", x: 1030, y: 245, scale: 1.45, depth: 13, label: "Gubuk Warga", labelOffsetY: 62, tint: 0x555555 },
      { key: "house2Night", x: 1660, y: 714, scale: 1.25, depth: 13, label: "Rumah Rusak", labelOffsetY: 64, tint: 0x555555 },
      { key: "waterDetail2Night", x: 1440, y: 526, scale: 3.1, depth: 16, label: "Genangan Hitam", labelOffsetY: 32, tint: 0x111111 },
      { key: "groundDetail5Night", x: 2040, y: 520, scale: 2.5, depth: 16, label: "Sampah", labelOffsetY: 34 }
    ]
  }
};

const ROLE_OPTIONS = [
  ["", "Dekorasi"],
  ["barrier", "Shape: Barrier Block"],
  ["chiefHome", "Desa: Rumah Kepala Desa"],
  ["officeExit", "Desa: Arah Kantor Desa"],
  ["homeExit", "Rumah/Mimpi: Pintu"],
  ["bed", "Rumah: Tempat Tidur"],
  ["moneyBag", "Rumah: Tas Uang"],
  ["mirror", "Rumah: Cermin"],
  ["projectDesk", "Kantor: Meja Proyek"],
  ["exitDoor", "Kantor: Pintu Keluar"],
  ["phone", "Kantor Mewah: Telepon"],
  ["chair", "Kantor Mewah: Kursi"],
  ["moneyPile", "Kantor Mewah: Uang"],
  ["window", "Kantor Mewah: Jendela"],
  ["podium", "Pidato: Podium"],
  ["actThreeRuin", "Act 3: Puing Meja"],
  ["actThreeExit", "Act 3: Keluar"],
  ["dreamMirror", "Mimpi: Cermin/Sosok"]
];

let editorScene = null;
let selectedSprite = null;
let selectedSprites = [];
let currentTargetId = "village";
let assetDirectoryHandle = null;
let statusTimer = null;

function cloneLayout(layout) {
  return JSON.parse(JSON.stringify(layout));
}

function byId(id) {
  return document.getElementById(id);
}

function hasTransferPayload(event) {
  return Array.from((event.dataTransfer && event.dataTransfer.types) || []).includes(TRANSFER_MIME_TYPE);
}

function getTarget(targetId = currentTargetId) {
  return EDITOR_TARGETS[targetId] || EDITOR_TARGETS.village;
}

function getDefaultLayout(targetId) {
  const target = getTarget(targetId);
  const base = cloneLayout(DEFAULT_LAYOUTS[targetId] || DEFAULT_LAYOUTS.village);
  base.target = targetId;
  base.mapWidth = target.width;
  base.mapHeight = target.height;
  base.playerDepth = Number.isFinite(Number(base.playerDepth)) ? Number(base.playerDepth) : DEFAULT_PLAYER_DEPTH;
  return base;
}

function getStorageKey(targetId) {
  return getTarget(targetId).storageKey;
}

function writeStoredLayout(targetId, layout) {
  const target = getTarget(targetId);
  const normalized = normalizeLayout(layout, targetId);
  normalized.target = targetId;
  normalized.mapWidth = target.width;
  normalized.mapHeight = target.height;
  window.localStorage.setItem(getStorageKey(targetId), JSON.stringify(normalized));
  if (targetId === "village") {
    window.localStorage.setItem(LEGACY_VILLAGE_STORAGE_KEY, JSON.stringify(normalized));
  }
  return normalized;
}

function normalizeLayout(layout, targetId) {
  const target = getTarget(targetId);
  return {
    version: layout.version || 2,
    target: layout.target || targetId,
    mapWidth: layout.mapWidth || target.width,
    mapHeight: layout.mapHeight || target.height,
    playerDepth: Number.isFinite(Number(layout.playerDepth)) ? Number(layout.playerDepth) : DEFAULT_PLAYER_DEPTH,
    objects: Array.isArray(layout.objects) ? layout.objects : []
  };
}

function setEditorStatus(message, persist = false) {
  const status = byId("assetStatus");
  if (!status) {
    return;
  }

  status.textContent = message;
  window.clearTimeout(statusTimer);

  if (!persist && message) {
    statusTimer = window.setTimeout(() => {
      status.textContent = getTarget().hint;
    }, 4200);
  }
}

function keyFromFileName(fileName) {
  const base = fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .match(/[a-z0-9]+/g);
  const words = base && base.length ? base : ["asset"];
  return `custom${words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")}`;
}

function createUniqueAssetKey(baseKey) {
  let key = baseKey;
  let suffix = 2;
  while (window.ASSETDESA_DATA && window.ASSETDESA_DATA[key]) {
    key = `${baseKey}${suffix}`;
    suffix += 1;
  }
  return key;
}

function readCustomAssets() {
  try {
    return JSON.parse(window.localStorage.getItem(CUSTOM_ASSET_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function saveCustomAssets(customAssets) {
  window.localStorage.setItem(CUSTOM_ASSET_KEY, JSON.stringify(customAssets));
}

function hydrateCustomAssets() {
  window.ASSETDESA_DATA = window.ASSETDESA_DATA || {};
  window.ASSETDESA_LABELS = window.ASSETDESA_LABELS || {};
  window.ASSETDESA_FILES = window.ASSETDESA_FILES || {};

  const customAssets = readCustomAssets();
  Object.entries(customAssets).forEach(([key, asset]) => {
    if (!asset || !asset.src) {
      return;
    }

    window.ASSETDESA_DATA[key] = asset.src;
    window.ASSETDESA_LABELS[key] = asset.label || key;
    window.ASSETDESA_FILES[key] = asset.fileName || `${key}.png`;
  });
}

function getEditorAssets() {
  const labels = window.ASSETDESA_LABELS || {};
  return Object.keys(window.ASSETDESA_DATA || {})
    .map((key) => [key, labels[key] || key])
    .sort((a, b) => a[1].localeCompare(b[1]));
}

class GameLayoutEditorScene extends Phaser.Scene {
  constructor() {
    super("GameLayoutEditorScene");
    this.objects = [];
    this.selectedKey = getTarget().defaultKey;
    this.spaceKey = null;
    this.targetId = currentTargetId;
    this.mapWidth = getTarget().width;
    this.mapHeight = getTarget().height;
    this.resizeHandles = [];
    this.selectionBox = null;
    this.selectionStart = null;
    this.isSelectingBox = false;
    this.groupDragState = null;
    this.undoStack = [];
    this.redoStack = [];
    this.pendingHistory = null;
    this.inspectorHistoryActive = false;
    this.isRestoringHistory = false;
  }

  preload() {
    Object.entries(window.ASSETDESA_DATA || {}).forEach(([key, src]) => {
      this.load.image(key, src);
    });
  }

  create() {
    editorScene = this;
    this.input.mouse.disableContextMenu();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.bindSceneInput();
    this.switchTarget(currentTargetId, true);
    refreshAssetListFromServer();
  }

  switchTarget(targetId, initial = false) {
    const target = getTarget(targetId);
    const storedLayout = this.readStoredLayout(targetId) || getDefaultLayout(targetId);
    currentTargetId = EDITOR_TARGETS[targetId] ? targetId : "village";
    this.targetId = currentTargetId;
    this.selectedKey = target.defaultKey;
    this.mapWidth = target.width;
    this.mapHeight = target.height;
    this.playerDepth = Number.isFinite(Number(storedLayout.playerDepth)) ? Number(storedLayout.playerDepth) : DEFAULT_PLAYER_DEPTH;

    selectSprite(null);
    this.clearResizeHandles();
    this.objects = [];
    this.children.list.slice().forEach((child) => child.destroy());
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.drawBaseMap();
    this.loadLayout(storedLayout);
    this.resetHistory();
    this.cameras.main.setZoom(initial ? 0.72 : Math.min(this.cameras.main.zoom, 0.9));
    this.cameras.main.centerOn(this.mapWidth / 2, this.mapHeight / 2);
    refreshExportText();
    updateLayoutSettingsPanel();
    updateTransferPanel();
    setEditorStatus(target.hint, true);
  }

  drawBaseMap() {
    if (this.targetId === "home") {
      this.drawHomeBase();
      return;
    }

    if (this.targetId === "office") {
      this.drawOfficeBase();
      return;
    }

    if (this.targetId === "luxuryOffice") {
      this.drawLuxuryOfficeBase();
      return;
    }

    if (this.targetId === "ceremony") {
      this.drawCeremonyBase();
      return;
    }

    if (this.targetId === "act3Office") {
      this.drawActThreeOfficeBase();
      return;
    }

    if (this.targetId === "dreamBedroom") {
      this.drawDreamBedroomBase();
      return;
    }

    if (this.targetId === "nightmare") {
      this.drawNightmareBase();
      return;
    }

    if (this.targetId === "ending") {
      this.drawEndingBase();
      return;
    }

    this.drawVillageBase();
  }

  drawTile(key, x, y, width, height, depth, tileScale = 3, tint = null, alpha = 1) {
    if (!this.textures.exists(key)) {
      return null;
    }

    const tile = this.add.tileSprite(x, y, width, height, key).setDepth(depth);
    tile.setTileScale(tileScale, tileScale);
    tile.setAlpha(alpha);
    if (tint !== null) {
      tile.setTint(tint);
    }
    return tile;
  }

  drawVillageBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x0f5d8f, 1).setDepth(0);
    this.drawTile("waterDay", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 1, 3.2);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 150, this.mapHeight - 120, 0x8bd448, 1)
      .setStrokeStyle(10, 0x1f7147, 1)
      .setDepth(2);
    this.drawTile("grassDay", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 170, this.mapHeight - 140, 3, 3.2);

    const paths = [
      [840, 850, 1180, 150],
      [1210, 760, 170, 540],
      [370, 1085, 420, 150],
      [1600, 520, 520, 155],
      [1720, 900, 440, 170]
    ];
    paths.forEach(([x, y, width, height]) => {
      this.add.rectangle(x, y, width, height, 0xb76532, 1).setDepth(4);
      this.drawTile("groundDay", x, y, width - 12, height - 12, 5, 2.7);
    });

    const plateaus = [
      [500, 390, 640, 420],
      [960, 345, 420, 310],
      [1650, 310, 540, 340],
      [520, 965, 520, 310]
    ];
    plateaus.forEach(([x, y, width, height]) => {
      this.add.rectangle(x, y, width, height, 0x93db4f, 1).setStrokeStyle(8, 0x2f7f45, 1).setDepth(6);
      this.drawTile("grassDay", x, y, width - 22, height - 22, 7, 3);
    });
  }

  drawHomeBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x201a18, 1).setDepth(0);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 110, this.mapHeight - 86, 0x4a3c35, 1)
      .setStrokeStyle(10, 0x211a17, 1)
      .setDepth(1);
    this.drawTile("groundDay", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 140, this.mapHeight - 120, 2, 4.1, 0xb79a75, 0.36);
    this.add.rectangle(820, 390, 360, 280, 0x2e3345, 0.86).setStrokeStyle(5, 0x151824, 1).setDepth(3);
    this.add.rectangle(388, 390, 300, 170, 0x5b4632, 0.9).setStrokeStyle(4, 0x2f241a, 1).setDepth(3);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight - 76, 210, 84, 0x3a241b, 1).setStrokeStyle(4, 0x1d120d, 1).setDepth(3);
    this.addGuideText(this.mapWidth / 2, 54, "Rumah Kepala Desa");
    this.addGuideText(820, 214, "Kamar");
  }

  drawOfficeBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x2a2d26, 1).setDepth(0);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 110, this.mapHeight - 86, 0xd8c7a3, 1)
      .setStrokeStyle(12, 0x6d7a5f, 1)
      .setDepth(1);
    this.drawTile("groundDay", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 150, this.mapHeight - 124, 2, 3.9, 0xd8c7a3, 0.25);
    this.add.rectangle(this.mapWidth / 2, 226, 480, 96, 0x79583f, 0.72).setStrokeStyle(3, 0x49311f, 1).setDepth(3);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight - 72, 170, 88, 0x4e3828, 0.92).setStrokeStyle(4, 0x2a1c13, 1).setDepth(3);
    this.addGuideText(this.mapWidth / 2, 52, "Kantor Desa");
  }

  drawLuxuryOfficeBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x1e1710, 1).setDepth(0);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 110, this.mapHeight - 86, 0xe6cf77, 1)
      .setStrokeStyle(12, 0x7f5510, 1)
      .setDepth(1);
    this.drawTile("groundDay", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 150, this.mapHeight - 124, 2, 3.9, 0xffd21c, 0.32);
    this.add.rectangle(this.mapWidth / 2, 226, 520, 108, 0xffd21c, 0.86).setStrokeStyle(5, 0x7f5207, 1).setDepth(3);
    this.add.rectangle(this.mapWidth / 2, 534, this.mapWidth - 210, 145, 0x7f1018, 0.95).setStrokeStyle(4, 0xd4a642, 1).setDepth(3);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight - 72, 190, 92, 0x17100b, 1).setStrokeStyle(5, 0xffd21c, 1).setDepth(3);
    this.addGuideText(this.mapWidth / 2, 52, "Kantor Desa Mewah");
    this.addGuideText(this.mapWidth / 2, 108, "Scene setelah kantor diperbaiki menjadi emas");
  }

  drawCeremonyBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x6f8b73, 1).setDepth(0);
    this.drawTile("grassDay", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 1, 3.4, 0x9ed675, 0.54);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight - 120, this.mapWidth, 240, 0x6a5a45, 1).setDepth(2);
    this.add.rectangle(this.mapWidth / 2, 278, 700, 140, 0x8d5b3d, 1).setStrokeStyle(4, 0x4f2f25, 1).setDepth(3);
    this.add.rectangle(this.mapWidth / 2, 215, 728, 22, 0x5f2c2c, 1).setDepth(4);
    this.addGuideText(this.mapWidth / 2, 92, "Tempat Pidato / Pelantikan");
  }

  drawActThreeOfficeBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x1a1714, 1).setDepth(0);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight - 110, this.mapWidth, 220, 0x1b1816, 1).setDepth(1);
    this.add.rectangle(this.mapWidth / 2, 328, 760, 350, 0x211b18, 1).setStrokeStyle(8, 0x060504, 1).setDepth(2);
    this.add.triangle(this.mapWidth / 2, 118, -410, 120, 0, -84, 410, 120, 0x130f0d, 1).setDepth(3);
    this.addGuideText(this.mapWidth / 2, 74, "Kantor Hangus Act 3");
  }

  drawDreamBedroomBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x08070d, 1).setDepth(0);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 110, this.mapHeight - 86, 0x2a2330, 1)
      .setStrokeStyle(10, 0x08070c, 1)
      .setDepth(1);
    this.drawTile("groundNight", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 140, this.mapHeight - 120, 2, 4.1, 0x43354a, 0.36);
    this.add.rectangle(820, 390, 360, 280, 0x202334, 0.88).setStrokeStyle(5, 0x0b0d16, 1).setDepth(3);
    this.add.rectangle(388, 390, 300, 170, 0x322838, 0.9).setStrokeStyle(4, 0x120f16, 1).setDepth(3);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight - 76, 210, 84, 0x1a1114, 1).setStrokeStyle(4, 0x08070c, 1).setDepth(3);
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 110, this.mapHeight - 86, 0x3f0712, 0.14).setDepth(4);
    this.addGuideText(this.mapWidth / 2, 54, "Kamar Kepala Desa (Mimpi)");
    this.addGuideText(820, 214, "Kamar");
  }

  drawNightmareBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x0c0d12, 1).setDepth(0);
    this.drawTile("grassNight", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 1, 2.4, 0x34363a, 0.58);
    this.add.rectangle(this.mapWidth / 2, 730, this.mapWidth - 160, 116, 0x3c3733, 1).setDepth(2);
    this.drawTile("groundNight", this.mapWidth / 2, 730, this.mapWidth - 180, 96, 3, 2.15, 0x4a4541, 0.72);
    this.add.rectangle(1120, 720, 100, this.mapHeight - 220, 0x393531, 1).setDepth(2);
    this.drawTile("groundNight", 1120, 720, 86, this.mapHeight - 240, 3, 2.15, 0x4a4541, 0.72);
    this.add.rectangle(1940, 1145, 330, 250, 0x07070a, 0.74).setStrokeStyle(5, 0x050408, 1).setDepth(4);
    this.addGuideText(160, 70, "Desa Mimpi Buruk");
    this.addGuideText(1940, 990, "Ujung Map Gelap");
  }

  drawEndingBase() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x1b1714, 1).setDepth(0);
    this.drawTile("grassNight", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 1, 2.5, 0x2a221f, 0.55);
    this.add.rectangle(this.mapWidth / 2, 520, this.mapWidth - 120, 180, 0x282421, 1).setStrokeStyle(4, 0x080706, 1).setDepth(2);
    this.drawTile("groundNight", this.mapWidth / 2, 520, this.mapWidth - 120, 160, 3, 2.2, 0x39322e, 0.62);
    this.addGuideText(210, 100, "Ending Apocalypse");
  }

  addGuideText(x, y, text) {
    this.add.text(x, y, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#fff4d7",
      stroke: "#1d1713",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(40);
  }

  captureHistoryState() {
    return {
      layout: this.exportLayout(),
      selectedIds: selectedSprites
        .filter((sprite) => sprite && sprite.editorData)
        .map((sprite) => sprite.editorData.id),
      primaryId: selectedSprite && selectedSprite.editorData ? selectedSprite.editorData.id : null
    };
  }

  historyLayoutKey(layout) {
    return JSON.stringify({
      target: layout.target,
      mapWidth: layout.mapWidth,
      mapHeight: layout.mapHeight,
      playerDepth: layout.playerDepth,
      objects: layout.objects
    });
  }

  isSameHistoryLayout(a, b) {
    if (!a || !b) {
      return false;
    }
    return this.historyLayoutKey(a) === this.historyLayoutKey(b);
  }

  pushUndoSnapshot(state) {
    if (this.isRestoringHistory || !state) {
      return;
    }

    const last = this.undoStack[this.undoStack.length - 1];
    if (last && this.isSameHistoryLayout(last.layout, state.layout)) {
      return;
    }

    this.undoStack.push(state);
    if (this.undoStack.length > HISTORY_LIMIT) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  recordUndoPoint() {
    this.pushUndoSnapshot(this.captureHistoryState());
  }

  beginHistoryEdit() {
    if (this.isRestoringHistory || this.pendingHistory) {
      return;
    }
    this.pendingHistory = this.captureHistoryState();
  }

  commitHistoryEdit() {
    if (!this.pendingHistory) {
      return;
    }

    const current = this.captureHistoryState();
    if (!this.isSameHistoryLayout(this.pendingHistory.layout, current.layout)) {
      this.pushUndoSnapshot(this.pendingHistory);
    }
    this.pendingHistory = null;
  }

  resetHistory() {
    this.undoStack = [];
    this.redoStack = [];
    this.pendingHistory = null;
    this.inspectorHistoryActive = false;
  }

  restoreHistoryState(state) {
    if (!state || !state.layout) {
      return;
    }

    this.isRestoringHistory = true;
    this.pendingHistory = null;
    this.inspectorHistoryActive = false;
    this.loadLayout(state.layout);

    const selected = (state.selectedIds || [])
      .map((id) => this.objects.find((sprite) => sprite.editorData.id === id))
      .filter(Boolean);
    const primary = this.objects.find((sprite) => sprite.editorData.id === state.primaryId) || selected[selected.length - 1] || null;
    selectSprites(selected, primary);
    refreshExportText();
    this.isRestoringHistory = false;
  }

  undoLastChange() {
    if (this.undoStack.length === 0) {
      setEditorStatus("Belum ada perubahan yang bisa di-undo.");
      return;
    }

    const current = this.captureHistoryState();
    const previous = this.undoStack.pop();
    this.redoStack.push(current);
    this.restoreHistoryState(previous);
    setEditorStatus("Undo berhasil. Tekan Ctrl+Y atau Ctrl+Shift+Z untuk redo.");
  }

  redoLastChange() {
    if (this.redoStack.length === 0) {
      setEditorStatus("Belum ada perubahan yang bisa di-redo.");
      return;
    }

    const current = this.captureHistoryState();
    const next = this.redoStack.pop();
    this.undoStack.push(current);
    this.restoreHistoryState(next);
    setEditorStatus("Redo berhasil.");
  }

  beginInspectorHistory() {
    if (!selectedSprite || this.inspectorHistoryActive) {
      return;
    }
    this.recordUndoPoint();
    this.inspectorHistoryActive = true;
  }

  endInspectorHistory() {
    this.inspectorHistoryActive = false;
  }

  bindSceneInput() {
    this.input.on("dragstart", (pointer, gameObject) => {
      if (gameObject.barrierHandleData) {
        this.groupDragState = null;
        this.beginHistoryEdit();
        return;
      }

      if (!gameObject.editorData) {
        this.groupDragState = null;
        return;
      }

      this.beginHistoryEdit();

      if (selectedSprites.length <= 1 || !selectedSprites.includes(gameObject)) {
        this.groupDragState = null;
        return;
      }

      this.groupDragState = {
        anchor: gameObject,
        anchorX: gameObject.x,
        anchorY: gameObject.y,
        members: selectedSprites.map((sprite) => ({
          sprite,
          x: sprite.x,
          y: sprite.y
        }))
      };
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (gameObject.barrierHandleData) {
        this.resizeOrScaleObjectFromHandle(gameObject, dragX, dragY);
        return;
      }

      if (!gameObject.editorData) {
        return;
      }

      if (this.groupDragState && selectedSprites.includes(gameObject)) {
        const deltaX = dragX - this.groupDragState.anchorX;
        const deltaY = dragY - this.groupDragState.anchorY;
        this.groupDragState.members.forEach(({ sprite, x, y }) => {
          sprite.setPosition(x + deltaX, y + deltaY);
          sprite.editorData.x = Math.round(sprite.x);
          sprite.editorData.y = Math.round(sprite.y);
          this.syncObjectLabel(sprite);
        });
        this.updateResizeHandles(selectedSprite);
        updateInspector(selectedSprite);
        return;
      }

      gameObject.setPosition(dragX, dragY);
      gameObject.editorData.x = Math.round(dragX);
      gameObject.editorData.y = Math.round(dragY);
      this.syncObjectLabel(gameObject);
      this.updateResizeHandles(gameObject);
      updateInspector(gameObject);
    });

    this.input.on("dragend", () => {
      this.groupDragState = null;
      this.commitHistoryEdit();
      refreshExportText();
    });

    this.input.on("pointerdown", (pointer, targets) => {
      if (pointer.rightButtonDown()) {
        return;
      }

      if (targets.length === 0) {
        const point = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.selectionStart = point;
        this.isSelectingBox = false;
        this.clearSelectionBox();
      }
    });

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      const camera = this.cameras.main;
      camera.zoom = Phaser.Math.Clamp(camera.zoom - (deltaY * 0.001), 0.25, 2.4);
    });

    this.input.on("pointermove", (pointer) => {
      if (this.selectionStart && pointer.isDown && !pointer.rightButtonDown() && !this.spaceKey.isDown) {
        this.updateSelectionBox(pointer);
        return;
      }

      if (!pointer.isDown || (!pointer.rightButtonDown() && !this.spaceKey.isDown)) {
        return;
      }

      const camera = this.cameras.main;
      camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
      camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
    });

    this.input.on("pointerup", () => {
      if (!this.selectionStart) {
        return;
      }

      if (this.isSelectingBox && this.selectionBox) {
        const selectionBounds = this.selectionBox.getBounds();
        const selected = this.objects.filter((sprite) => {
          if (!sprite || !sprite.editorData) {
            return false;
          }
          return Phaser.Geom.Rectangle.Overlaps(selectionBounds, sprite.getBounds());
        });
        selectSprites(selected, selected[selected.length - 1] || null);
        if (selected.length > 0) {
          setEditorStatus(`${selected.length} asset dipilih. Drag salah satunya untuk memindahkan grup, atau tekan Ctrl+D untuk duplikasi.`);
        }
      } else {
        selectSprites([]);
      }

      this.selectionStart = null;
      this.isSelectingBox = false;
      this.clearSelectionBox();
    });
  }

  readStoredLayout(targetId = this.targetId) {
    if (window.SAVED_GAME_LAYOUTS && window.SAVED_GAME_LAYOUTS[targetId]) {
      const layout = window.SAVED_GAME_LAYOUTS[targetId];
      if (layout && Array.isArray(layout.objects) && layout.objects.length > 0) {
        return normalizeLayout(layout, targetId);
      }
    }

    try {
      const raw = window.localStorage.getItem(getStorageKey(targetId))
        || (targetId === "village" ? window.localStorage.getItem(LEGACY_VILLAGE_STORAGE_KEY) : null);
      return raw ? normalizeLayout(JSON.parse(raw), targetId) : null;
    } catch (error) {
      return null;
    }
  }

  loadLayout(layout) {
    this.objects.forEach((sprite) => this.destroyEditorObject(sprite));
    this.objects = [];
    selectSprite(null);
    const normalized = normalizeLayout(layout, this.targetId);
    this.playerDepth = Number.isFinite(Number(normalized.playerDepth)) ? Number(normalized.playerDepth) : DEFAULT_PLAYER_DEPTH;
    normalized.objects.forEach((object) => this.createObject(object));
    this.sortByDepth();
    updateLayoutSettingsPanel();
  }

  createObject(source) {
    if (source.type === BARRIER_TYPE || source.role === "barrier") {
      return this.createBarrierObject(source);
    }

    if (!this.textures.exists(source.key)) {
      return null;
    }

    const data = {
      id: source.id || `obj-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      key: source.key,
      x: Math.round(source.x),
      y: Math.round(source.y),
      scale: Number(source.scale || 1),
      depth: Number(source.depth || 10),
      rotation: Number(source.rotation || 0),
      alpha: source.alpha === undefined ? 1 : Number(source.alpha),
      flipX: Boolean(source.flipX),
      tint: source.tint,
      label: source.label || "",
      labelOffsetY: source.labelOffsetY || 84,
      role: source.role || ""
    };

    const sprite = this.add.image(data.x, data.y, data.key);
    sprite.editorData = data;
    sprite.setScale(data.scale);
    sprite.setDepth(data.depth);
    sprite.setRotation(data.rotation);
    sprite.setAlpha(data.alpha);
    sprite.setFlipX(data.flipX);
    if (data.tint !== undefined) {
      sprite.setTint(data.tint);
    }
    sprite.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(sprite);
    sprite.on("pointerdown", (pointer) => {
      pointer.event.stopPropagation();
      handleObjectPointerSelection(sprite, pointer);
    });
    this.objects.push(sprite);
    this.syncObjectLabel(sprite);
    return sprite;
  }

  createBarrierObject(source) {
    const data = {
      id: source.id || `barrier-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      type: BARRIER_TYPE,
      key: "",
      x: Math.round(source.x),
      y: Math.round(source.y),
      width: Math.max(BARRIER_MIN_SIZE, Number(source.width || BARRIER_DEFAULT_WIDTH)),
      height: Math.max(BARRIER_MIN_SIZE, Number(source.height || BARRIER_DEFAULT_HEIGHT)),
      scale: 1,
      depth: Number(source.depth || 250),
      rotation: 0,
      alpha: source.alpha === undefined ? 0.18 : Number(source.alpha),
      flipX: false,
      label: source.label || "Barrier",
      labelOffsetY: source.labelOffsetY || 22,
      role: "barrier"
    };

    const barrier = this.add.rectangle(data.x, data.y, data.width, data.height, 0x00d5ff, data.alpha)
      .setStrokeStyle(3, 0x00f5ff, 0.86)
      .setDepth(data.depth);
    barrier.editorData = data;
    barrier.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(barrier);
    barrier.on("pointerdown", (pointer) => {
      pointer.event.stopPropagation();
      handleObjectPointerSelection(barrier, pointer);
    });
    this.objects.push(barrier);
    this.syncObjectLabel(barrier);
    return barrier;
  }

  syncObjectLabel(sprite) {
    if (!sprite || !sprite.editorData) {
      return;
    }

    const data = sprite.editorData;
    if (!data.label) {
      if (sprite.editorLabel) {
        sprite.editorLabel.destroy();
        sprite.editorLabel = null;
      }
      return;
    }

    if (!sprite.editorLabel) {
      sprite.editorLabel = this.add.text(sprite.x, sprite.y, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#fff4d4",
        backgroundColor: "#2f2117",
        padding: { x: 6, y: 3 }
      }).setOrigin(0.5);
    }

    sprite.editorLabel.setText(data.label);
    sprite.editorLabel.setPosition(sprite.x, sprite.y + ((data.labelOffsetY || 84) * data.scale));
    sprite.editorLabel.setDepth(data.depth + 100);
  }

  destroyEditorObject(sprite) {
    if (!sprite) {
      return;
    }

    if (sprite === selectedSprite || selectedSprites.includes(sprite)) {
      this.clearResizeHandles();
    }

    if (sprite.editorLabel) {
      sprite.editorLabel.destroy();
    }
    sprite.destroy();
  }

  clearResizeHandles() {
    this.resizeHandles.forEach((handle) => handle.destroy());
    this.resizeHandles = [];
  }

  clearSelectionBox() {
    if (this.selectionBox) {
      this.selectionBox.destroy();
      this.selectionBox = null;
    }
  }

  updateSelectionBox(pointer) {
    const point = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const left = Math.min(this.selectionStart.x, point.x);
    const top = Math.min(this.selectionStart.y, point.y);
    const width = Math.abs(point.x - this.selectionStart.x);
    const height = Math.abs(point.y - this.selectionStart.y);

    if (!this.isSelectingBox && (width >= SELECTION_BOX_MIN_DRAG || height >= SELECTION_BOX_MIN_DRAG)) {
      this.isSelectingBox = true;
      selectSprites([]);
      this.selectionBox = this.add.rectangle(left, top, width, height, 0x6fe7ff, 0.14)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x6fe7ff, 0.95)
        .setDepth(9997);
    }

    if (!this.selectionBox) {
      return;
    }

    this.selectionBox.setPosition(left, top);
    this.selectionBox.setSize(width, height);
  }

  showResizeHandles(target) {
    this.clearResizeHandles();
    if (!target || !target.editorData) {
      return;
    }

    ["nw", "ne", "sw", "se"].forEach((corner) => {
      const handle = this.add.rectangle(0, 0, 18, 18, 0xfff06a, 1)
        .setStrokeStyle(2, 0x1f1600, 1)
        .setDepth(10000)
        .setInteractive({ draggable: true, useHandCursor: true });
      handle.barrierHandleData = { target, corner };
      handle.on("pointerdown", (pointer) => {
        pointer.event.stopPropagation();
      });
      this.input.setDraggable(handle);
      this.resizeHandles.push(handle);
    });

    this.updateResizeHandles(target);
  }

  updateResizeHandles(target = selectedSprite) {
    if (!target || !target.editorData || this.resizeHandles.length === 0) {
      return;
    }

    const data = target.editorData;
    const isBarrier = data.type === BARRIER_TYPE;
    const halfWidth = isBarrier ? (data.width / 2) : (Math.abs(target.displayWidth) / 2);
    const halfHeight = isBarrier ? (data.height / 2) : (Math.abs(target.displayHeight) / 2);

    const positions = {
      nw: [target.x - halfWidth, target.y - halfHeight],
      ne: [target.x + halfWidth, target.y - halfHeight],
      sw: [target.x - halfWidth, target.y + halfHeight],
      se: [target.x + halfWidth, target.y + halfHeight]
    };

    this.resizeHandles.forEach((handle) => {
      const position = positions[handle.barrierHandleData.corner];
      handle.setPosition(position[0], position[1]);
    });
  }

  resizeOrScaleObjectFromHandle(handle, dragX, dragY) {
    const { target, corner } = handle.barrierHandleData || {};
    if (!target || !target.editorData) {
      return;
    }

    const data = target.editorData;
    const isBarrier = data.type === BARRIER_TYPE;

    if (isBarrier) {
      let left = data.x - (data.width / 2);
      let right = data.x + (data.width / 2);
      let top = data.y - (data.height / 2);
      let bottom = data.y + (data.height / 2);

      if (corner.includes("w")) left = Math.min(dragX, right - BARRIER_MIN_SIZE);
      if (corner.includes("e")) right = Math.max(dragX, left + BARRIER_MIN_SIZE);
      if (corner.includes("n")) top = Math.min(dragY, bottom - BARRIER_MIN_SIZE);
      if (corner.includes("s")) bottom = Math.max(dragY, top + BARRIER_MIN_SIZE);

      data.width = Math.round(right - left);
      data.height = Math.round(bottom - top);
      data.x = Math.round(left + (data.width / 2));
      data.y = Math.round(top + (data.height / 2));

      target.setPosition(data.x, data.y);
      target.setSize(data.width, data.height);
      target.input.hitArea.setTo(-data.width / 2, -data.height / 2, data.width, data.height);
    } else {
      // Scaling for Sprites
      let newHalfWidth = Math.abs(dragX - target.x);
      let newHalfHeight = Math.abs(dragY - target.y);

      const originalWidth = target.width;
      const originalHeight = target.height;

      if (originalWidth > 0 && originalHeight > 0) {
        const scaleX = newHalfWidth / (originalWidth / 2);
        const scaleY = newHalfHeight / (originalHeight / 2);
        // Uniform scaling
        data.scale = Math.max(0.05, Number(((scaleX + scaleY) / 2).toFixed(3)));
        target.setScale(data.scale);
      }
    }

    this.syncObjectLabel(target);
    this.updateResizeHandles(target);
    updateInspector(target);
    refreshExportText();
  }

  async addObjectAtScreen(key, clientX, clientY) {
    const rect = byId("editor-canvas").getBoundingClientRect();
    const point = this.cameras.main.getWorldPoint(clientX - rect.left, clientY - rect.top);

    if (!this.textures.exists(key)) {
      const src = window.ASSETDESA_DATA && window.ASSETDESA_DATA[key];
      if (!src) {
        setEditorStatus(`Gagal: Asset dengan key "${key}" tidak ditemukan di manifest.`);
        return;
      }

      setEditorStatus(`Memuat asset "${key}"...`);
      await new Promise((resolve) => {
        this.load.image(key, src);
        this.load.once(`filecomplete-image-${key}`, resolve);
        this.load.once(`loaderror-image-${key}`, resolve);
        this.load.start();
      });
    }

    if (!this.textures.exists(key)) {
      setEditorStatus(`Gagal memuat file gambar untuk "${key}". Cek apakah file ada di folder assets/assetdesa.`);
      return;
    }

    this.recordUndoPoint();
    const sprite = this.createObject({
      key,
      x: Math.round(point.x),
      y: Math.round(point.y),
      scale: defaultScaleFor(key),
      depth: defaultDepthFor(key)
    });

    if (sprite) {
      selectSprite(sprite);
      refreshExportText();
      setEditorStatus(`Asset "${key}" berhasil ditambahkan.`);
    }
  }

  addBarrierAtCameraCenter() {
    const canvas = byId("editor-canvas");
    const rect = canvas.getBoundingClientRect();
    const point = this.cameras.main.getWorldPoint(rect.width / 2, rect.height / 2);
    this.recordUndoPoint();
    const barrier = this.createObject({
      type: BARRIER_TYPE,
      x: Math.round(point.x),
      y: Math.round(point.y),
      width: BARRIER_DEFAULT_WIDTH,
      height: BARRIER_DEFAULT_HEIGHT,
      depth: 250,
      label: "Barrier"
    });

    selectSprite(barrier);
    refreshExportText();
    setEditorStatus("Barrier Block dibuat. Tarik kotak kuning di sudutnya untuk mengubah ukuran langsung di canvas.");
  }

  duplicateSelected() {
    const selection = selectedSprites.length > 0 ? selectedSprites : (selectedSprite ? [selectedSprite] : []);
    if (selection.length === 0) {
      return;
    }

    this.recordUndoPoint();
    const duplicates = selection
      .map((sprite) => this.createObject({
        ...sprite.editorData,
        id: undefined,
        x: Math.round(sprite.x + DUPLICATE_OFFSET),
        y: Math.round(sprite.y + DUPLICATE_OFFSET)
      }))
      .filter(Boolean);

    selectSprites(duplicates, duplicates[duplicates.length - 1] || null);
    if (duplicates.length > 0) {
      setEditorStatus(`${duplicates.length} asset terduplikasi. Drag salah satu hasil duplikat untuk memindahkan semuanya di ${getTarget().label}.`);
    }
    refreshExportText();
  }

  deleteSelected() {
    const selection = selectedSprites.length > 0 ? [...selectedSprites] : (selectedSprite ? [selectedSprite] : []);
    if (selection.length === 0) {
      return;
    }

    this.recordUndoPoint();
    selection.forEach((sprite) => {
      Phaser.Utils.Array.Remove(this.objects, sprite);
      this.destroyEditorObject(sprite);
    });
    selectSprites([]);
    setEditorStatus(`${selection.length} asset dihapus dari ${getTarget().label}.`);
    refreshExportText();
  }

  selectAllObjects() {
    selectSprites(this.objects.slice(), this.objects[this.objects.length - 1] || null);
    if (this.objects.length > 0) {
      setEditorStatus(`${this.objects.length} asset dipilih di ${getTarget().label}.`);
    }
  }

  adjustDepthForSelection(delta) {
    const selection = selectedSprites.length > 0 ? selectedSprites : (selectedSprite ? [selectedSprite] : []);
    if (selection.length === 0) {
      return;
    }

    this.recordUndoPoint();
    selection.forEach((sprite) => {
      sprite.editorData.depth += delta;
      sprite.setDepth(sprite.editorData.depth);
      this.syncObjectLabel(sprite);
    });
    this.sortByDepth();
    updateInspector(selectedSprite);
    refreshExportText();
  }

  setPlayerDepth(depth) {
    const nextDepth = Number(depth);
    if (!Number.isFinite(nextDepth)) {
      return;
    }

    this.recordUndoPoint();
    this.playerDepth = Math.round(nextDepth);
    updateLayoutSettingsPanel();
    refreshExportText();
    setEditorStatus(`Player Layer ${getTarget().label} diubah ke ${this.playerDepth}. Klik Save ke Game agar dipakai di game.`);
  }

  sortByDepth() {
    this.objects.forEach((sprite) => {
      sprite.setDepth(sprite.editorData.depth);
      this.syncObjectLabel(sprite);
    });
    this.updateResizeHandles();
  }

  getCurrentSelection() {
    return selectedSprites
      .filter((sprite) => sprite && sprite.scene && sprite.editorData && this.objects.includes(sprite));
  }

  getSelectionBounds(selection) {
    const bounds = selection.map((sprite) => sprite.getBounds());
    const left = Math.min(...bounds.map((rect) => rect.left));
    const right = Math.max(...bounds.map((rect) => rect.right));
    const top = Math.min(...bounds.map((rect) => rect.top));
    const bottom = Math.max(...bounds.map((rect) => rect.bottom));
    return {
      left,
      right,
      top,
      bottom,
      centerX: left + ((right - left) / 2),
      centerY: top + ((bottom - top) / 2)
    };
  }

  createMovedObjectData(sprite, index, selectionBounds, targetId) {
    const target = getTarget(targetId);
    const data = { ...sprite.editorData };
    const idPrefix = data.type === BARRIER_TYPE ? "barrier" : "obj";
    const nextX = (target.width / 2) + (data.x - selectionBounds.centerX);
    const nextY = (target.height / 2) + (data.y - selectionBounds.centerY);

    return {
      ...data,
      id: `${idPrefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}-${index}`,
      x: Math.round(Phaser.Math.Clamp(nextX, 40, target.width - 40)),
      y: Math.round(Phaser.Math.Clamp(nextY, 40, target.height - 40))
    };
  }

  moveSelectionToTarget(targetId) {
    if (!EDITOR_TARGETS[targetId]) {
      return;
    }

    if (targetId === this.targetId) {
      setEditorStatus("Itu layout yang sedang aktif. Pilih layout tujuan yang berbeda.");
      return;
    }

    const selection = this.getCurrentSelection();
    if (selection.length === 0) {
      setEditorStatus("Pilih asset dulu sebelum dipindahkan ke layout lain.");
      return;
    }

    const selectionBounds = this.getSelectionBounds(selection);
    const movedObjects = selection.map((sprite, index) => this.createMovedObjectData(sprite, index, selectionBounds, targetId));
    const movedIds = movedObjects.map((object) => object.id);
    const sourceTargetId = this.targetId;
    const sourceLabel = getTarget(sourceTargetId).label;
    const destinationLabel = getTarget(targetId).label;

    selection.forEach((sprite) => {
      Phaser.Utils.Array.Remove(this.objects, sprite);
      this.destroyEditorObject(sprite);
    });
    selectSprites([]);
    writeStoredLayout(sourceTargetId, this.exportLayout());

    const destinationLayout = normalizeLayout(this.readStoredLayout(targetId) || getDefaultLayout(targetId), targetId);
    destinationLayout.objects = [...destinationLayout.objects, ...movedObjects];
    writeStoredLayout(targetId, destinationLayout);

    byId("layoutTarget").value = targetId;
    this.switchTarget(targetId);
    const movedSprites = movedIds
      .map((id) => this.objects.find((sprite) => sprite.editorData.id === id))
      .filter(Boolean);
    selectSprites(movedSprites, movedSprites[movedSprites.length - 1] || null);
    refreshExportText();
    setEditorStatus(`${selection.length} asset dipindahkan dari ${sourceLabel} ke ${destinationLabel}. Asset muncul di tengah layout tujuan dan sudah terseleksi.`);
  }

  exportLayout() {
    return {
      version: 2,
      target: this.targetId,
      mapWidth: this.mapWidth,
      mapHeight: this.mapHeight,
      playerDepth: Number.isFinite(Number(this.playerDepth)) ? Number(this.playerDepth) : DEFAULT_PLAYER_DEPTH,
      objects: this.objects
        .map((sprite) => ({
          ...sprite.editorData,
          x: Math.round(sprite.x),
          y: Math.round(sprite.y),
          scale: Number(sprite.editorData.scale.toFixed(3)),
          depth: Number(sprite.editorData.depth),
          rotation: Number(sprite.editorData.rotation.toFixed(4)),
          alpha: Number(sprite.editorData.alpha.toFixed(3))
        }))
        .sort((a, b) => a.depth - b.depth)
    };
  }
}

function defaultScaleFor(key) {
  if (key.includes("house2")) return 2.5;
  if (key.includes("house1")) return 1.9;
  if (key.includes("terrain")) return 2.3;
  if (key.includes("tree")) return 1.6;
  if (key.includes("fence")) return 2.2;
  if (key.includes("Detail")) return 2.1;
  if (key.includes("custom")) return 1;
  return 2;
}

function defaultDepthFor(key) {
  if (key.includes("house")) return 18;
  if (key.includes("tree")) return 20;
  if (key.includes("terrain")) return 9;
  if (key.includes("fence") || key.includes("Detail")) return 12;
  return 10;
}

function restoreSpriteStyle(sprite) {
  if (!sprite || !sprite.scene || !sprite.editorData) {
    return;
  }

  if (sprite.editorData.type === BARRIER_TYPE) {
    sprite.setStrokeStyle(3, 0x00f5ff, 0.86);
    return;
  }

  if (sprite.clearTint) {
    sprite.clearTint();
  }
  if (sprite.editorData.tint !== undefined && sprite.setTint) {
    sprite.setTint(sprite.editorData.tint);
  }
}

function applySelectionStyle(sprite) {
  if (!sprite || !sprite.scene || !sprite.editorData) {
    return;
  }

  if (sprite.editorData.type === BARRIER_TYPE) {
    sprite.setStrokeStyle(4, 0xfff06a, 1);
  } else if (sprite.setTint) {
    sprite.setTint(0xfff2a6);
  }
}

function handleObjectPointerSelection(sprite, pointer) {
  const event = pointer.event || {};
  if (event.shiftKey) {
    toggleSpriteSelection(sprite);
    return;
  }

  if (selectedSprites.length > 1 && selectedSprites.includes(sprite)) {
    selectedSprite = sprite;
    updateInspector(selectedSprite);
    return;
  }

  selectSprite(sprite);
}

function toggleSpriteSelection(sprite) {
  if (!sprite) {
    return;
  }

  if (selectedSprites.includes(sprite)) {
    selectSprites(selectedSprites.filter((item) => item !== sprite), selectedSprite === sprite ? null : selectedSprite);
    return;
  }

  selectSprites([...selectedSprites, sprite], sprite);
}

function selectSprites(sprites, primary = null) {
  if (editorScene) {
    editorScene.clearResizeHandles();
  }

  selectedSprites.forEach(restoreSpriteStyle);

  selectedSprites = [...new Set((sprites || []).filter(Boolean))];
  selectedSprite = primary && selectedSprites.includes(primary)
    ? primary
    : selectedSprites[selectedSprites.length - 1] || null;

  selectedSprites.forEach(applySelectionStyle);

  if (selectedSprites.length === 1 && selectedSprite && editorScene) {
    editorScene.showResizeHandles(selectedSprite);
  }

  updateInspector(selectedSprite);
  updateTransferPanel();
}

function selectSprite(sprite) {
  selectSprites(sprite ? [sprite] : [], sprite);
}

function updateInspector(sprite) {
  const hasMultiSelection = selectedSprites.length > 1;
  const disabled = !sprite || hasMultiSelection;
  ["xInput", "yInput", "scaleInput", "depthInput", "rotationInput", "alphaInput", "labelInput", "roleInput"].forEach((id) => {
    byId(id).disabled = disabled;
  });

  if (hasMultiSelection) {
    byId("selectedName").textContent = `${selectedSprites.length} asset dipilih (${getTarget().label})`;
    ["xInput", "yInput", "scaleInput", "depthInput", "rotationInput", "alphaInput", "labelInput"].forEach((id) => {
      byId(id).value = "";
    });
    byId("roleInput").value = "";
    return;
  }

  if (!sprite) {
    byId("selectedName").textContent = "Belum ada asset dipilih";
    return;
  }

  const data = sprite.editorData;
  const isBarrier = data.type === BARRIER_TYPE;
  byId("selectedName").textContent = isBarrier
    ? `Barrier Block ${data.width}x${data.height} (${getTarget().label})`
    : `${data.key} (${getTarget().label})`;
  byId("xInput").value = Math.round(sprite.x);
  byId("yInput").value = Math.round(sprite.y);
  byId("scaleInput").value = data.scale;
  byId("scaleInput").disabled = isBarrier;
  byId("depthInput").value = data.depth;
  byId("rotationInput").value = Math.round(Phaser.Math.RadToDeg(data.rotation));
  byId("alphaInput").value = data.alpha;
  byId("labelInput").value = data.label || "";
  byId("roleInput").value = data.role || "";
}

function applyInspector() {
  if (!selectedSprite) {
    return;
  }

  const data = selectedSprite.editorData;
  const isBarrier = data.type === BARRIER_TYPE;
  data.x = Number(byId("xInput").value || selectedSprite.x);
  data.y = Number(byId("yInput").value || selectedSprite.y);
  data.scale = isBarrier ? 1 : Number(byId("scaleInput").value || data.scale);
  data.depth = Number(byId("depthInput").value || data.depth);
  data.rotation = isBarrier ? 0 : Phaser.Math.DegToRad(Number(byId("rotationInput").value || 0));
  data.alpha = Number(byId("alphaInput").value || 1);
  data.label = byId("labelInput").value.trim();
  data.role = isBarrier ? "barrier" : byId("roleInput").value;

  selectedSprite.setPosition(data.x, data.y);
  if (isBarrier) {
    selectedSprite.setFillStyle(0x00d5ff, data.alpha);
    selectedSprite.setSize(data.width, data.height);
    selectedSprite.input.hitArea.setTo(-data.width / 2, -data.height / 2, data.width, data.height);
  } else {
    selectedSprite.setScale(data.scale);
    selectedSprite.setRotation(data.rotation);
  }
  selectedSprite.setDepth(data.depth);
  selectedSprite.setAlpha(data.alpha);
  editorScene.syncObjectLabel(selectedSprite);
  editorScene.updateResizeHandles(selectedSprite);
  editorScene.sortByDepth();
  refreshExportText();
  triggerAutoSave();
}

function refreshExportText() {
  if (!editorScene) {
    return;
  }

  byId("layoutJson").value = JSON.stringify(editorScene.exportLayout(), null, 2);
}

function buildTargetSelect() {
  const select = byId("layoutTarget");
  select.innerHTML = "";
  Object.entries(EDITOR_TARGETS).forEach(([targetId, target]) => {
    const option = document.createElement("option");
    option.value = targetId;
    option.textContent = target.label;
    select.appendChild(option);
  });
  select.value = currentTargetId;
}

function updateTransferPanel() {
  const handle = byId("transferHandle");
  const targets = document.querySelectorAll(".layout-drop-target");
  const count = selectedSprites.filter((sprite) => sprite && sprite.scene && sprite.editorData).length;

  if (handle) {
    handle.textContent = count > 0
      ? `Tarik ${count} asset terpilih`
      : "Pilih asset dulu";
    handle.draggable = count > 0;
    handle.classList.toggle("is-disabled", count === 0);
  }

  targets.forEach((target) => {
    const targetId = target.dataset.targetId;
    const disabled = count === 0 || targetId === currentTargetId;
    target.classList.toggle("is-current", targetId === currentTargetId);
    target.classList.toggle("is-disabled", disabled);
    target.setAttribute("aria-disabled", disabled ? "true" : "false");
  });
}

function updateLayoutSettingsPanel() {
  const input = byId("playerDepthInput");
  if (!input || !editorScene) {
    return;
  }

  const playerDepth = Number.isFinite(Number(editorScene.playerDepth))
    ? Number(editorScene.playerDepth)
    : DEFAULT_PLAYER_DEPTH;
  input.value = playerDepth;
}

function buildLayoutDropTargets() {
  const container = byId("layoutDropTargets");
  if (!container) {
    return;
  }

  container.innerHTML = "";
  Object.entries(EDITOR_TARGETS).forEach(([targetId, target]) => {
    const dropTarget = document.createElement("div");
    dropTarget.className = "layout-drop-target";
    dropTarget.dataset.targetId = targetId;
    dropTarget.textContent = target.label;
    dropTarget.setAttribute("role", "button");
    dropTarget.setAttribute("tabindex", "0");

    dropTarget.addEventListener("dragover", (event) => {
      if (!editorScene || !hasTransferPayload(event)) {
        return;
      }
      if (selectedSprites.length === 0 || targetId === currentTargetId) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      dropTarget.classList.add("is-hover");
    });

    dropTarget.addEventListener("dragleave", () => {
      dropTarget.classList.remove("is-hover");
    });

    dropTarget.addEventListener("drop", (event) => {
      event.preventDefault();
      dropTarget.classList.remove("is-hover");
      if (editorScene && hasTransferPayload(event)) {
        editorScene.moveSelectionToTarget(targetId);
      }
    });

    container.appendChild(dropTarget);
  });

  updateTransferPanel();
}

function buildRoleOptions() {
  const select = byId("roleInput");
  select.innerHTML = "";
  ROLE_OPTIONS.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });
}

function buildPalette() {
  const palette = byId("assetPalette");
  palette.innerHTML = "";
  getEditorAssets().forEach(([key, label]) => {
    addPaletteItem(key, label);
  });
}

function addPaletteItem(key, label) {
  if (!window.ASSETDESA_DATA || !window.ASSETDESA_DATA[key]) {
    return;
  }

  const palette = byId("assetPalette");
  const button = document.createElement("button");
  button.className = "asset-item";
  button.draggable = true;
  button.dataset.key = key;
  button.innerHTML = `<img src="${window.ASSETDESA_DATA[key]}" alt=""><span>${label}</span>`;
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", key);
  });
  button.addEventListener("click", () => {
    if (editorScene) {
      editorScene.selectedKey = key;
      setEditorStatus(`Asset aktif: ${label}`);
    }
  });
  palette.appendChild(button);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function addTextureFromDataUrl(key, src) {
  if (!editorScene || editorScene.textures.exists(key)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      editorScene.textures.addImage(key, image);
      resolve();
    };
    image.onerror = reject;
    image.src = src;
  });
}

async function chooseAssetFolder() {
  if (!window.showDirectoryPicker) {
    setEditorStatus("Browser ini belum mengizinkan editor menulis file ke folder. Asset tetap masuk ke editor lewat localStorage.", true);
    return null;
  }

  try {
    assetDirectoryHandle = await window.showDirectoryPicker({
      id: "assetdesa-folder",
      mode: "readwrite"
    });
    const folderName = assetDirectoryHandle.name || "folder terpilih";
    setEditorStatus(`Folder aktif: ${folderName}. Pilih folder assets/assetdesa agar file import benar-benar tersimpan di sana.`, true);
    return assetDirectoryHandle;
  } catch (error) {
    setEditorStatus("Folder asset belum dipilih. Import tetap bisa jalan, tapi file fisiknya belum disalin ke assets/assetdesa.", true);
    return null;
  }
}

async function getAvailableFolderFileName(directoryHandle, originalName) {
  const extensionMatch = originalName.match(/\.[^.]+$/);
  const extension = extensionMatch ? extensionMatch[0] : ".png";
  const cleanBase = originalName
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w .()\-]+/g, "_")
    .trim() || "asset";
  let fileName = `${cleanBase}${extension}`;
  let suffix = 2;

  while (true) {
    try {
      await directoryHandle.getFileHandle(fileName, { create: false });
      fileName = `${cleanBase}-${suffix}${extension}`;
      suffix += 1;
    } catch (error) {
      return fileName;
    }
  }
}

async function writeFileToAssetFolder(file) {
  if (!assetDirectoryHandle) {
    return { saved: false, fileName: file.name };
  }

  const fileName = await getAvailableFolderFileName(assetDirectoryHandle, file.name);
  const handle = await assetDirectoryHandle.getFileHandle(fileName, { create: true });
  const writable = await handle.createWritable();
  await writable.write(file);
  await writable.close();
  return { saved: true, fileName };
}

async function importAssetFiles(files) {
  if (!files || files.length === 0) {
    return;
  }

  if (!assetDirectoryHandle && window.showDirectoryPicker) {
    await chooseAssetFolder();
  }

  const customAssets = readCustomAssets();
  const importedKeys = [];
  let copiedCount = 0;

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      continue;
    }

    const key = createUniqueAssetKey(keyFromFileName(file.name));
    let folderFileName = file.name;
    let storedInFolder = false;

    try {
      const folderResult = await writeFileToAssetFolder(file);
      folderFileName = folderResult.fileName;
      storedInFolder = folderResult.saved;
      copiedCount += storedInFolder ? 1 : 0;
    } catch (error) {
      setEditorStatus("Asset masuk ke editor, tapi gagal disalin ke folder. Cek izin folder browser.", true);
    }

    const src = await readFileAsDataUrl(file);
    const label = folderFileName.replace(/\.[^.]+$/, "");
    const asset = {
      src,
      label,
      fileName: folderFileName,
      importedAt: Date.now(),
      storedInAssetFolder: storedInFolder
    };
    customAssets[key] = asset;
    window.ASSETDESA_DATA[key] = src;
    window.ASSETDESA_LABELS[key] = label;
    window.ASSETDESA_FILES[key] = folderFileName;
    await addTextureFromDataUrl(key, src);
    importedKeys.push(key);
  }

  try {
    saveCustomAssets(customAssets);
  } catch (error) {
    alert("Asset berhasil masuk sementara, tapi gagal disimpan. File mungkin terlalu besar untuk localStorage.");
  }

  buildPalette();
  if (importedKeys.length > 0 && editorScene) {
    editorScene.selectedKey = importedKeys[0];
    setEditorStatus(`${importedKeys.length} asset diimport. ${copiedCount} file tersalin ke folder asset.`, true);
  }
}

async function syncWithServer() {
  if (!editorScene) return;

  const allLayouts = {};
  for (const id of Object.keys(EDITOR_TARGETS)) {
    if (id === currentTargetId) {
      allLayouts[id] = editorScene.exportLayout();
    } else {
      const stored = editorScene.readStoredLayout(id) || getDefaultLayout(id);
      allLayouts[id] = stored;
    }
  }

  const body = `window.GENERATED_GAME_LAYOUTS = ${JSON.stringify(allLayouts, null, 2)};\nwindow.SAVED_GAME_LAYOUTS = window.GENERATED_GAME_LAYOUTS;`;

  try {
    const response = await fetch("/__save-layouts", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: body
    });
    const data = await response.json();
    if (data.ok) {
      setEditorStatus("Layout berhasil disimpan ke file project! Sekarang perubahan terbawa saat folder dipindah.", true);
      return true;
    }
  } catch (error) {
    console.error("Gagal save ke server:", error);
    setEditorStatus("Gagal simpan ke file. Pastikan editor dibuka lewat buka-map-editor.bat.", true);
    return false;
  }
  return false;
}

async function saveCurrentLayout() {
  const layout = editorScene.exportLayout();
  writeStoredLayout(currentTargetId, layout);
  refreshExportText();

  const serverSaved = await syncWithServer();
  if (!serverSaved) {
    alert(`Layout ${getTarget().label} tersimpan di browser, tapi GAGAL simpan ke file project. Pastikan server Python jalan.`);
  } else {
    setEditorStatus(`Layout ${getTarget().label} tersimpan ke browser dan file project.`, true);
  }
}

function isTypingInForm(event) {
  const tagName = event.target && event.target.tagName;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(tagName);
}

function bindDomControls() {
  const canvas = byId("editor-canvas");
  canvas.addEventListener("dragover", (event) => event.preventDefault());
  canvas.addEventListener("drop", (event) => {
    event.preventDefault();
    const key = event.dataTransfer.getData("text/plain");
    if (editorScene && key) {
      editorScene.addObjectAtScreen(key, event.clientX, event.clientY);
    }
  });

  byId("layoutTarget").addEventListener("change", (event) => {
    if (editorScene) {
      editorScene.switchTarget(event.target.value);
      updateTransferPanel();
    }
  });

  ["xInput", "yInput", "scaleInput", "depthInput", "rotationInput", "alphaInput", "labelInput", "roleInput"].forEach((id) => {
    const input = byId(id);
    input.addEventListener("input", () => {
      if (editorScene) {
        editorScene.beginInspectorHistory();
      }
      applyInspector();
    });
    input.addEventListener("change", () => {
      if (editorScene) {
        editorScene.endInspectorHistory();
      }
    });
    input.addEventListener("blur", () => {
      if (editorScene) {
        editorScene.endInspectorHistory();
      }
    });
  });

  byId("playerDepthInput").addEventListener("change", (event) => {
    if (editorScene) {
      editorScene.setPlayerDepth(event.target.value);
    }
  });
  byId("playerDepthInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && editorScene) {
      event.preventDefault();
      editorScene.setPlayerDepth(event.target.value);
      event.currentTarget.blur();
    }
  });

  byId("saveBtn").addEventListener("click", saveCurrentLayout);
  byId("barrierBtn").addEventListener("click", () => {
    if (editorScene) {
      editorScene.addBarrierAtCameraCenter();
    }
  });
  byId("assetFolderBtn").addEventListener("click", chooseAssetFolder);
  byId("importAssetBtn").addEventListener("click", () => {
    byId("assetFileInput").click();
  });
  byId("assetFileInput").addEventListener("change", async (event) => {
    await importAssetFiles([...event.target.files]);
    event.target.value = "";
  });
  byId("transferHandle").addEventListener("dragstart", (event) => {
    if (!editorScene || selectedSprites.length === 0) {
      event.preventDefault();
      setEditorStatus("Pilih asset dulu sebelum dipindahkan ke layout lain.");
      return;
    }

    event.dataTransfer.setData(TRANSFER_MIME_TYPE, currentTargetId);
    event.dataTransfer.effectAllowed = "move";
    setEditorStatus("Lepaskan ke nama layout tujuan di panel Pindah ke Layout.");
  });
  byId("transferHandle").addEventListener("dragend", () => {
    document.querySelectorAll(".layout-drop-target").forEach((target) => target.classList.remove("is-hover"));
  });
  byId("exportBtn").addEventListener("click", refreshExportText);
  byId("importBtn").addEventListener("click", () => {
    const layout = normalizeLayout(JSON.parse(byId("layoutJson").value), currentTargetId);
    if (layout.target && EDITOR_TARGETS[layout.target] && layout.target !== currentTargetId) {
      byId("layoutTarget").value = layout.target;
      editorScene.switchTarget(layout.target);
    }
    editorScene.recordUndoPoint();
    editorScene.loadLayout(layout);
    refreshExportText();
  });
  byId("resetBtn").addEventListener("click", () => {
    editorScene.recordUndoPoint();
    window.localStorage.removeItem(getStorageKey(currentTargetId));
    if (currentTargetId === "village") {
      window.localStorage.removeItem(LEGACY_VILLAGE_STORAGE_KEY);
    }
    editorScene.loadLayout(getDefaultLayout(currentTargetId));
    refreshExportText();
  });
  byId("duplicateBtn").addEventListener("click", () => editorScene.duplicateSelected());
  byId("deleteBtn").addEventListener("click", () => editorScene.deleteSelected());
  byId("frontBtn").addEventListener("click", () => {
    editorScene.adjustDepthForSelection(1);
  });
  byId("backBtn").addEventListener("click", () => {
    editorScene.adjustDepthForSelection(-1);
  });

  window.addEventListener("keydown", (event) => {
    if (!editorScene) {
      return;
    }

    const key = event.key.toLowerCase();
    if (event.ctrlKey && key === "z") {
      event.preventDefault();
      editorScene.endInspectorHistory();
      if (event.shiftKey) {
        editorScene.redoLastChange();
      } else {
        editorScene.undoLastChange();
      }
      return;
    }

    if (event.ctrlKey && key === "y") {
      event.preventDefault();
      editorScene.endInspectorHistory();
      editorScene.redoLastChange();
      return;
    }

    if (isTypingInForm(event)) {
      return;
    }

    if (event.ctrlKey && key === "d") {
      event.preventDefault();
      editorScene.duplicateSelected();
      return;
    }

    if (event.ctrlKey && key === "a") {
      event.preventDefault();
      editorScene.selectAllObjects();
      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      editorScene.deleteSelected();
      return;
    }

    if (event.key === "Escape") {
      selectSprites([]);
      setEditorStatus("Selection dibersihkan.");
    }
  });
}

async function refreshAssetListFromServer() {
  try {
    const response = await fetch("/__asset-list");
    const data = await response.json();
    if (data.ok && Array.isArray(data.assets)) {
      window.ASSETDESA_DATA = window.ASSETDESA_DATA || {};
      window.ASSETDESA_LABELS = window.ASSETDESA_LABELS || {};
      window.ASSETDESA_FILES = window.ASSETDESA_FILES || {};

      data.assets.forEach((asset) => {
        window.ASSETDESA_DATA[asset.key] = asset.src;
        window.ASSETDESA_LABELS[asset.key] = asset.label;
        window.ASSETDESA_FILES[asset.key] = asset.fileName;
      });

      if (editorScene) {
        let needsLoad = false;
        data.assets.forEach((asset) => {
          if (!editorScene.textures.exists(asset.key)) {
            editorScene.load.image(asset.key, asset.src);
            needsLoad = true;
          }
        });

        if (needsLoad) {
          editorScene.load.once("complete", () => {
            buildPalette();
          });
          editorScene.load.start();
        } else {
          buildPalette();
        }
      } else {
        buildPalette();
      }
    }
  } catch (error) {
    console.log("Gagal mengambil list asset dari server, menggunakan data statis.");
  }
}

hydrateCustomAssets();
buildTargetSelect();
buildLayoutDropTargets();
buildRoleOptions();
buildPalette();
bindDomControls();
updateLayoutSettingsPanel();
setEditorStatus(getTarget().hint, true);

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "editor-canvas",
  backgroundColor: "#0f5d8f",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: "100%",
    height: "100%"
  },
  scene: [GameLayoutEditorScene]
});
