const STORAGE_KEY = "villageLayout.v1";
const CUSTOM_ASSET_KEY = "villageCustomAssets.v1";
const MAP_WIDTH = 2200;
const MAP_HEIGHT = 1400;

const DEFAULT_LAYOUT = {
  version: 1,
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
};

let editorScene = null;
let selectedSprite = null;

function cloneLayout(layout) {
  return JSON.parse(JSON.stringify(layout));
}

function byId(id) {
  return document.getElementById(id);
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

class VillageEditorScene extends Phaser.Scene {
  constructor() {
    super("VillageEditorScene");
    this.objects = [];
    this.selectedKey = "house2Day";
    this.spaceKey = null;
  }

  preload() {
    Object.entries(window.ASSETDESA_DATA || {}).forEach(([key, src]) => {
      this.load.image(key, src);
    });
  }

  create() {
    editorScene = this;
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.setZoom(0.72);
    this.cameras.main.centerOn(MAP_WIDTH / 2, MAP_HEIGHT / 2);
    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.input.mouse.disableContextMenu();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.drawBaseMap();
    this.bindSceneInput();
    this.loadLayout(this.readStoredLayout() || cloneLayout(DEFAULT_LAYOUT));
    refreshExportText();
  }

  drawBaseMap() {
    this.add.rectangle(MAP_WIDTH / 2, MAP_HEIGHT / 2, MAP_WIDTH, MAP_HEIGHT, 0x0f5d8f, 1).setDepth(0);
    this.add.tileSprite(MAP_WIDTH / 2, MAP_HEIGHT / 2, MAP_WIDTH, MAP_HEIGHT, "waterDay").setTileScale(3.2).setDepth(1);
    this.add.rectangle(MAP_WIDTH / 2, MAP_HEIGHT / 2, MAP_WIDTH - 150, MAP_HEIGHT - 120, 0x8bd448, 1)
      .setStrokeStyle(10, 0x1f7147, 1)
      .setDepth(2);
    this.add.tileSprite(MAP_WIDTH / 2, MAP_HEIGHT / 2, MAP_WIDTH - 170, MAP_HEIGHT - 140, "grassDay").setTileScale(3.2).setDepth(3);

    const paths = [
      [840, 850, 1180, 150],
      [1210, 760, 170, 540],
      [370, 1085, 420, 150],
      [1600, 520, 520, 155],
      [1720, 900, 440, 170]
    ];
    paths.forEach(([x, y, width, height]) => {
      this.add.rectangle(x, y, width, height, 0xb76532, 1).setDepth(4);
      this.add.tileSprite(x, y, width - 12, height - 12, "groundDay").setTileScale(2.7).setDepth(5);
    });

    const plateaus = [
      [500, 390, 640, 420],
      [960, 345, 420, 310],
      [1650, 310, 540, 340],
      [520, 965, 520, 310]
    ];
    plateaus.forEach(([x, y, width, height]) => {
      this.add.rectangle(x, y, width, height, 0x93db4f, 1).setStrokeStyle(8, 0x2f7f45, 1).setDepth(6);
      this.add.tileSprite(x, y, width - 22, height - 22, "grassDay").setTileScale(3).setDepth(7);
    });
  }

  bindSceneInput() {
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (!gameObject.editorData) {
        return;
      }

      gameObject.setPosition(dragX, dragY);
      gameObject.editorData.x = Math.round(dragX);
      gameObject.editorData.y = Math.round(dragY);
      updateInspector(gameObject);
    });

    this.input.on("pointerdown", (pointer, targets) => {
      if (pointer.rightButtonDown()) {
        return;
      }

      if (targets.length === 0) {
        selectSprite(null);
      }
    });

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      const camera = this.cameras.main;
      camera.zoom = Phaser.Math.Clamp(camera.zoom - (deltaY * 0.001), 0.25, 2.4);
    });

    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown || (!pointer.rightButtonDown() && !this.spaceKey.isDown)) {
        return;
      }

      const camera = this.cameras.main;
      camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
      camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
    });
  }

  readStoredLayout() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  loadLayout(layout) {
    this.objects.forEach((sprite) => sprite.destroy());
    this.objects = [];
    selectSprite(null);
    layout.objects.forEach((object) => this.createObject(object));
    this.sortByDepth();
  }

  createObject(source) {
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
    sprite.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(sprite);
    sprite.on("pointerdown", (pointer) => {
      pointer.event.stopPropagation();
      selectSprite(sprite);
    });
    this.objects.push(sprite);
    return sprite;
  }

  addObjectAtScreen(key, clientX, clientY) {
    const rect = byId("editor-canvas").getBoundingClientRect();
    const point = this.cameras.main.getWorldPoint(clientX - rect.left, clientY - rect.top);
    const sprite = this.createObject({
      key,
      x: Math.round(point.x),
      y: Math.round(point.y),
      scale: defaultScaleFor(key),
      depth: defaultDepthFor(key)
    });
    selectSprite(sprite);
    refreshExportText();
  }

  duplicateSelected() {
    if (!selectedSprite) {
      return;
    }

    const data = { ...selectedSprite.editorData, id: undefined, x: selectedSprite.x + 34, y: selectedSprite.y + 34 };
    selectSprite(this.createObject(data));
    refreshExportText();
  }

  deleteSelected() {
    if (!selectedSprite) {
      return;
    }

    Phaser.Utils.Array.Remove(this.objects, selectedSprite);
    selectedSprite.destroy();
    selectSprite(null);
    refreshExportText();
  }

  sortByDepth() {
    this.objects.forEach((sprite) => sprite.setDepth(sprite.editorData.depth));
  }

  exportLayout() {
    return {
      version: 1,
      mapWidth: MAP_WIDTH,
      mapHeight: MAP_HEIGHT,
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
  return 2;
}

function defaultDepthFor(key) {
  if (key.includes("house")) return 18;
  if (key.includes("tree")) return 20;
  if (key.includes("terrain")) return 9;
  if (key.includes("fence") || key.includes("Detail")) return 12;
  return 10;
}

function selectSprite(sprite) {
  if (selectedSprite) {
    selectedSprite.clearTint();
  }

  selectedSprite = sprite;
  if (selectedSprite) {
    selectedSprite.setTint(0xfff2a6);
  }

  updateInspector(selectedSprite);
}

function updateInspector(sprite) {
  const disabled = !sprite;
  ["xInput", "yInput", "scaleInput", "depthInput", "rotationInput", "alphaInput", "labelInput", "roleInput"].forEach((id) => {
    byId(id).disabled = disabled;
  });

  if (!sprite) {
    byId("selectedName").textContent = "Belum ada asset dipilih";
    return;
  }

  const data = sprite.editorData;
  byId("selectedName").textContent = data.key;
  byId("xInput").value = Math.round(sprite.x);
  byId("yInput").value = Math.round(sprite.y);
  byId("scaleInput").value = data.scale;
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
  data.x = Number(byId("xInput").value || selectedSprite.x);
  data.y = Number(byId("yInput").value || selectedSprite.y);
  data.scale = Number(byId("scaleInput").value || data.scale);
  data.depth = Number(byId("depthInput").value || data.depth);
  data.rotation = Phaser.Math.DegToRad(Number(byId("rotationInput").value || 0));
  data.alpha = Number(byId("alphaInput").value || 1);
  data.label = byId("labelInput").value.trim();
  data.role = byId("roleInput").value;

  selectedSprite.setPosition(data.x, data.y);
  selectedSprite.setScale(data.scale);
  selectedSprite.setDepth(data.depth);
  selectedSprite.setRotation(data.rotation);
  selectedSprite.setAlpha(data.alpha);
  refreshExportText();
}

function refreshExportText() {
  if (!editorScene) {
    return;
  }

  byId("layoutJson").value = JSON.stringify(editorScene.exportLayout(), null, 2);
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

async function importAssetFiles(files) {
  if (!files || files.length === 0) {
    return;
  }

  const customAssets = readCustomAssets();
  const importedKeys = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      continue;
    }

    const key = createUniqueAssetKey(keyFromFileName(file.name));
    const src = await readFileAsDataUrl(file);
    const label = file.name.replace(/\.[^.]+$/, "");
    const asset = { src, label, fileName: file.name, importedAt: Date.now() };
    customAssets[key] = asset;
    window.ASSETDESA_DATA[key] = src;
    window.ASSETDESA_LABELS[key] = label;
    window.ASSETDESA_FILES[key] = file.name;
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
  }
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

  ["xInput", "yInput", "scaleInput", "depthInput", "rotationInput", "alphaInput", "labelInput", "roleInput"].forEach((id) => {
    byId(id).addEventListener("input", applyInspector);
  });

  byId("saveBtn").addEventListener("click", () => {
    const layout = editorScene.exportLayout();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    refreshExportText();
    alert("Layout tersimpan. Refresh index.html untuk melihat hasilnya di game.");
  });

  byId("importAssetBtn").addEventListener("click", () => {
    byId("assetFileInput").click();
  });
  byId("assetFileInput").addEventListener("change", async (event) => {
    await importAssetFiles([...event.target.files]);
    event.target.value = "";
  });
  byId("exportBtn").addEventListener("click", refreshExportText);
  byId("importBtn").addEventListener("click", () => {
    const layout = JSON.parse(byId("layoutJson").value);
    editorScene.loadLayout(layout);
    refreshExportText();
  });
  byId("resetBtn").addEventListener("click", () => {
    window.localStorage.removeItem(STORAGE_KEY);
    editorScene.loadLayout(cloneLayout(DEFAULT_LAYOUT));
    refreshExportText();
  });
  byId("duplicateBtn").addEventListener("click", () => editorScene.duplicateSelected());
  byId("deleteBtn").addEventListener("click", () => editorScene.deleteSelected());
  byId("frontBtn").addEventListener("click", () => {
    if (!selectedSprite) return;
    selectedSprite.editorData.depth += 1;
    selectedSprite.setDepth(selectedSprite.editorData.depth);
    updateInspector(selectedSprite);
    refreshExportText();
  });
  byId("backBtn").addEventListener("click", () => {
    if (!selectedSprite) return;
    selectedSprite.editorData.depth -= 1;
    selectedSprite.setDepth(selectedSprite.editorData.depth);
    updateInspector(selectedSprite);
    refreshExportText();
  });
}

hydrateCustomAssets();
buildPalette();
bindDomControls();

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
  scene: [VillageEditorScene]
});
