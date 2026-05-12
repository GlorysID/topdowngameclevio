var gameState = {
  integrity: 100,
  wealth: 0,
  personalWealth: 0,
  totalCorrupted: 0,
  sanity: 100,
  act: 1,
  leader: 1,
  actTwoProjectAccepted: false,
  actTwoOfficeLuxury: false,
  actTwoLedgerDone: false,
  sanityGlitched: false,
  integrityGlitched: false,
  actThreeStarted: false
};

window.gameState = gameState;

const GAME_WIDTH = window.innerWidth || 1024;
const GAME_HEIGHT = window.innerHeight || 768;
const CENTER_X = GAME_WIDTH / 2;
const CENTER_Y = GAME_HEIGHT / 2;
const OFFICE_WIDTH = Math.min(960, GAME_WIDTH - 96);
const OFFICE_HEIGHT = Math.min(680, GAME_HEIGHT - 80);
const OFFICE_LEFT = CENTER_X - (OFFICE_WIDTH / 2);
const OFFICE_RIGHT = CENTER_X + (OFFICE_WIDTH / 2);
const OFFICE_TOP = CENTER_Y - (OFFICE_HEIGHT / 2);
const OFFICE_BOTTOM = CENTER_Y + (OFFICE_HEIGHT / 2);
const PLAYER_ASSET_PATH = "assets/images/kepaladesa1";
const PLAYER_SCALE = 0.46;
const VILLAGE_ASSET_PATH = "assets/assetdesa";

function getAssetUrl(path) {
  return new URL(path.split("/").map((part) => encodeURIComponent(part)).join("/"), window.location.href).href;
}

function getPlayerAssetSource(key, fileName) {
  if (window.PLAYER_ASSET_DATA && window.PLAYER_ASSET_DATA[key]) {
    return window.PLAYER_ASSET_DATA[key];
  }

  return `${PLAYER_ASSET_PATH}/${fileName}`;
}

function addPersonalWealth(amount) {
  gameState.personalWealth += amount;
  gameState.wealth = gameState.personalWealth;
  if (amount > 0) {
    gameState.totalCorrupted += amount;
  }
}

function resetCameraView(camera) {
  if (!camera) {
    return;
  }

  if (camera.fadeEffect && typeof camera.fadeEffect.reset === "function") {
    camera.fadeEffect.reset();
  }

  if (typeof camera.setAlpha === "function") {
    camera.setAlpha(1);
  }

  if (typeof camera.setZoom === "function") {
    camera.setZoom(1);
  }

  if (typeof camera.setRotation === "function") {
    camera.setRotation(0);
  }

  if (typeof camera.setScroll === "function") {
    camera.setScroll(0, 0);
  }
}

class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  preload() {
    this.loadPlayerAssets();
    this.loadVillageAssets();
  }

  loadVillageAssets() {
    const assets = {
      grassDay: "GRASS TILE - DAY.png",
      grassNight: "GRASS TILE - NIGHT.png",
      groundDay: "GROUND TILE - DAY.png",
      groundNight: "GROUND TILE - NIGHT.png",
      waterDay: "WATER TILE - DAY.png",
      waterNight: "WATER TILE - NIGHT.png",
      house1Day: "HOUSE 1 - DAY.png",
      house1Night: "HOUSE 1 - NIGHT.png",
      house2Day: "HOUSE 2 - DAY.png",
      house2Night: "HOUSE 2 - NIGHT.png",
      tree1Day: "TREE 1 - DAY.png",
      tree1Night: "TREE 1 - NIGHT.png",
      tree2Day: "TREE 2 - DAY.png",
      tree2Night: "TREE 2 - NIGHT.png",
      tree3Day: "TREE 3 - DAY.png",
      tree3Night: "TREE 3 - NIGHT.png",
      bridgeDay: "BRIDGE - DAY.png",
      bridgeNight: "BRIDGE - NIGHT.png",
      fence1Day: "FENCE 1 - DAY.png",
      fence1Night: "FENCE 1 - NIGHT.png",
      fence2Day: "FENCE 2 - DAY.png",
      fence2Night: "FENCE 2 - NIGHT.png",
      pitDay: "PIT - DAY.png",
      pitNight: "PIT - NIGHT.png",
      stairsDay: "STAIRS - DAY.png",
      stairsNight: "STAIRS - NIGHT.png",
      terrain1Day: "TERRAIN SET 1 - DAY.png",
      terrain2Day: "TERRAIN SET 2 - DAY.png",
      terrain3Day: "TERRAIN SET 3 - DAY.png",
      terrain4Day: "TERRAIN SET 4 - DAY.png",
      terrain5Day: "TERRAIN SET 5 - DAY.png",
      terrain3CurveDay: "TERRAIN SET 3 CURVES - DAY.png",
      terrain4CurveDay: "TERRAIN SET 4 CURVES - DAY.png",
      grassDetail1Day: "GRASS DETAIL 1 - DAY.png",
      grassDetail2Day: "GRASS DETAIL 2 - DAY.png",
      grassDetail3Day: "GRASS DETAIL 3 - DAY.png",
      groundDetail1Day: "GROUND DETAIL 1 - DAY.png",
      groundDetail2Day: "GROUND DETAIL 2 - DAY.png",
      groundDetail3Day: "GROUND DETAIL 3 - DAY.png",
      waterDetail1Night: "WATER DETAIL 1 - NIGHT.png",
      waterDetail2Night: "WATER DETAIL 2 - NIGHT.png",
      waterDetail3Night: "WATER DETAIL 3 - NIGHT.png"
    };

    Object.entries(assets).forEach(([key, fileName]) => {
      if (!this.textures.exists(key)) {
        const embeddedAsset = window.ASSETDESA_DATA && window.ASSETDESA_DATA[key];
        this.load.image(key, embeddedAsset || getAssetUrl(`${VILLAGE_ASSET_PATH}/${fileName}`));
      }
    });
  }

  addVillageAsset(key, x, y, scale = 1, depth = 10, options = {}) {
    if (!this.textures.exists(key)) {
      return null;
    }

    const image = this.add.image(x, y, key);
    image.setScale(scale);
    image.setDepth(depth);

    if (options.alpha !== undefined) {
      image.setAlpha(options.alpha);
    }

    if (options.tint !== undefined) {
      image.setTint(options.tint);
    }

    if (options.rotation !== undefined) {
      image.setRotation(options.rotation);
    }

    if (options.flipX) {
      image.setFlipX(true);
    }

    return image;
  }

  addTileArea(key, x, y, width, height, depth = 0, options = {}) {
    if (!this.textures.exists(key)) {
      return null;
    }

    const tile = this.add.tileSprite(x, y, width, height, key);
    tile.setDepth(depth);

    if (options.alpha !== undefined) {
      tile.setAlpha(options.alpha);
    }

    if (options.tint !== undefined) {
      tile.setTint(options.tint);
    }

    if (options.tileScale !== undefined) {
      tile.setTileScale(options.tileScale, options.tileScale);
    }

    return tile;
  }

  loadPlayerAssets() {
    if (this.textures.exists("kepaladesa_bawah_1")) {
      return;
    }

    for (let index = 1; index <= 4; index += 1) {
      const upKey = `kepaladesa_atas_${index}`;
      const downKey = `kepaladesa_bawah_${index}`;

      this.load.image(upKey, getPlayerAssetSource(upKey, `atas${index}.png`));
      this.load.image(downKey, getPlayerAssetSource(downKey, `bawah${index}.png`));
    }

    for (let index = 1; index <= 8; index += 1) {
      const sideKey = `kepaladesa_kanankiri_${index}`;
      this.load.image(sideKey, getPlayerAssetSource(sideKey, `kanankiri${index}.png`));
    }
  }

  createPlayerAnimations() {
    if (!this.anims.exists("kepaladesa_walk_down")) {
      this.anims.create({
        key: "kepaladesa_walk_down",
        frames: [1, 2, 3, 4].map((index) => ({ key: `kepaladesa_bawah_${index}` })),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists("kepaladesa_walk_up")) {
      this.anims.create({
        key: "kepaladesa_walk_up",
        frames: [1, 2, 3, 4].map((index) => ({ key: `kepaladesa_atas_${index}` })),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!this.anims.exists("kepaladesa_walk_side")) {
      this.anims.create({
        key: "kepaladesa_walk_side",
        frames: [1, 2, 3, 4, 5, 6, 7, 8].map((index) => ({ key: `kepaladesa_kanankiri_${index}` })),
        frameRate: 10,
        repeat: -1
      });
    }
  }

  createPlayerSprite(x, y) {
    this.createPlayerAnimations();

    const player = this.physics.add.sprite(x, y, "kepaladesa_bawah_1");
    player.setScale(PLAYER_SCALE);
    player.setOrigin(0.5, 0.88);
    player.setDepth(20);
    player.lastDirection = "down";

    if (gameState.leader === 2) {
      player.setTint(0xb8d8ff);
    }

    if (player.body) {
      player.body.setSize(34, 28);
      player.body.setOffset(34, 114);
    }

    return player;
  }

  getPlayerLabelY(player) {
    return player.y - player.displayHeight - 8;
  }

  updatePlayerAnimation(player) {
    if (!player || !player.body) {
      return;
    }

    const velocityX = player.body.velocity.x;
    const velocityY = player.body.velocity.y;

    if (Math.abs(velocityX) < 5 && Math.abs(velocityY) < 5) {
      player.anims.stop();
      player.setTexture(`kepaladesa_${player.lastDirection === "up" ? "atas" : player.lastDirection === "side" ? "kanankiri" : "bawah"}_1`);
      return;
    }

    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      player.lastDirection = "side";
      player.setFlipX(velocityX < 0);
      player.anims.play("kepaladesa_walk_side", true);
      return;
    }

    player.setFlipX(false);

    if (velocityY < 0) {
      player.lastDirection = "up";
      player.anims.play("kepaladesa_walk_up", true);
      return;
    }

    player.lastDirection = "down";
    player.anims.play("kepaladesa_walk_down", true);
  }

  createStatusUi() {
    this.statusText = this.add.text(16, 16, "", {
      fontFamily: "Courier New, monospace",
      fontSize: "18px",
      color: "#ffffff",
      lineSpacing: 6
    });

    this.statusText.setDepth(100);
    this.statusText.setScrollFactor(0);
    this.updateStatusUi();
  }

  updateStatusUi() {
    if (!this.statusText) {
      return;
    }

    const integrityText = gameState.integrityGlitched
      ? Phaser.Utils.Array.GetRandom(["ERR", "0x00", "!!!", "NULL", "9?", "----"])
      : gameState.integrity;
    const sanityText = gameState.sanityGlitched
      ? Phaser.Utils.Array.GetRandom(["#%?ERR", "NaN", "0xVOID", "!!!", "--/--"])
      : gameState.sanity;

    this.statusText.setText([
      `Integrity: ${integrityText}`,
      `Wealth: ${gameState.wealth}`,
      `Sanity: ${sanityText}`
    ]);

    if (gameState.integrityGlitched) {
      this.statusText.setColor(Date.now() % 420 < 210 ? "#ff2f3f" : "#ffe8e8");
    } else if (gameState.act === 3 && gameState.integrity <= 0) {
      this.statusText.setColor("#ff3434");
    } else {
      this.statusText.setColor("#ffffff");
    }
  }

  update() {
    this.updateStatusUi();
  }
}

class SceneSiang extends BaseScene {
  constructor() {
    super("SceneSiang");
  }

  preload() {
    this.loadPlayerAssets();
    this.loadVillageAssets();
  }

  create(data) {
    this.returningFromMiniGame = Boolean(data && data.returningFromMiniGame);
    this.wakeFromNightmare = Boolean(data && data.wakeFromNightmare);
    this.secondBribe = Boolean(data && data.secondBribe);
    this.secondReturn = Boolean(data && data.secondRun);
    this.actTwoStart = Boolean(data && data.actTwoStart);
    this.actTwoAfterMiniGame = Boolean(data && data.actTwoAfterMiniGame);
    this.actTwoLuxuryReveal = Boolean(data && data.actTwoLuxuryReveal);
    this.actThreeStart = Boolean(data && data.actThreeStart);
    this.actTwoProjectAvailable = this.actTwoStart && gameState.leader === 2 && !gameState.actTwoProjectAccepted;
    this.actTwoProjectStarted = false;
    this.whisperAudioContext = null;
    this.whisperNodes = null;
    this.actTwoDarkOverlay = null;
    this.ledgerHackActive = false;
    this.ledgerProgress = 0;
    this.ledgerCodeRows = [];
    this.ledgerCrackCount = 0;
    this.ledgerAudioContext = null;
    this.ledgerAudioNodes = null;
    this.ledgerRainTimer = null;
    this.goldenPrisonActive = false;
    this.goldenSeatCount = 0;
    this.wealthGrowthTimer = null;
    this.phoneRingTimer = null;
    this.prisonPhoneZone = null;
    this.prisonChairZone = null;
    this.prisonMoneyZone = null;
    this.prisonDoorZone = null;
    this.prisonMessageText = null;
    this.riotAudioContext = null;
    this.riotNodes = null;
    this.finalFallStarted = false;
    this.escapeShadow = null;
    this.escapeWindowZone = null;
    this.actThreeRuinZone = null;
    this.actThreeExitZone = null;
    this.actThreeChoiceStarted = false;
    this.actThreeStoryStarted = false;
    this.nextActThreeShakeAt = 0;
    this.exitUnlocked = false;
    this.secretary = null;
    this.secretaryLabel = null;
    this.footstepAudioContext = null;
    this.nextFootstepAt = 0;
    this.phase = "explore";
    this.inputLocked = false;
    this.playerSpeed = this.returningFromMiniGame ? 110 : 180;
    this.dialogQueue = [];
    this.dialogIndex = 0;
    this.dialogOnComplete = null;
    this.dialogAdvanceReady = false;
    this.dialogWaitingForChoice = false;
    this.termEndingStarted = false;
    this.arrestNarrationStarted = false;
    this.endOverlay = null;
    this.cameras.main.setBackgroundColor("#c6dfc7");

    if (this.actThreeStart) {
      gameState.act = 3;
      gameState.integrity = 0;
      gameState.personalWealth = -500;
      gameState.wealth = -500;
      gameState.sanity = 20;
      gameState.integrityGlitched = false;
      gameState.sanityGlitched = false;
      this.createActThreeProtestExterior();
    } else {
      this.createOffice();
      this.createCharacters();
    }
    this.createControls();
    this.createStatusUi();
    this.createInteractionUi();

    if (this.actThreeStart) {
      this.phase = "actThreePrologue";
      this.inputLocked = true;
      this.playerSpeed = 95;
      this.interactionText.setText("");
      this.time.delayedCall(500, () => this.startActThreeInaugurationStory());
      this.events.once("shutdown", this.shutdownSceneSiang, this);
      return;
    }

    if (this.returningFromMiniGame) {
      this.createPostMiniGameChanges();
    }

    if (this.actTwoLuxuryReveal) {
      this.startActTwoLuxuryReveal();
    } else if (this.actTwoAfterMiniGame) {
      this.interactionText.setText("Dana proyek masuk. Kantor terasa makin gelap meski lampu menyala.");
      this.time.delayedCall(2600, () => {
        if (this.interactionText && this.phase === "explore") {
          this.interactionText.setText("");
        }
      });
    }

    if (this.wakeFromNightmare) {
      this.cameras.main.shake(420, 0.006);
      this.interactionText.setText("Kepala Desa terbangun di meja kantor...");
      this.time.delayedCall(1600, () => {
        if (this.interactionText && this.phase === "woke") {
          this.interactionText.setText("");
        }
      });
      this.phase = "woke";
    }

    this.events.once("shutdown", this.shutdownSceneSiang, this);
  }

  update(time, delta) {
    super.update(time, delta);

    if (this.termEndingStarted) {
      return;
    }

    this.updatePlayerMovement();
    this.updateCharacterLabels();
    this.updateInteractionPrompt();
    this.handleDialogAdvance();
    this.handleInteraction();
    this.handleExitTrigger();
    this.updateHeavyFootsteps(time);
    this.updateGoldenPrisonDecay();
    this.updateEscapeAttempt();
    this.updateActThreeTension(time);
    this.handleActThreeExit();
  }

  createOffice() {
    this.add.rectangle(CENTER_X, CENTER_Y, OFFICE_WIDTH, OFFICE_HEIGHT, 0xd8c7a3, 1);
    this.add.rectangle(CENTER_X, CENTER_Y, OFFICE_WIDTH, OFFICE_HEIGHT).setStrokeStyle(12, 0x6d7a5f, 1);

    this.add.text(CENTER_X, OFFICE_TOP + 38, "Kantor Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#24352b"
    }).setOrigin(0.5);

    const deskY = OFFICE_TOP + 136;
    this.add.rectangle(CENTER_X, deskY, 440, 82, 0x79583f, 1);
    this.add.rectangle(CENTER_X, deskY, 440, 82).setStrokeStyle(3, 0x49311f, 1);

    this.add.text(CENTER_X, deskY, "Meja Proyek Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#fff3d1"
    }).setOrigin(0.5);

    this.frontDesk = this.add.rectangle(CENTER_X, deskY, 440, 82, 0x000000, 0);
    this.physics.add.existing(this.frontDesk, true);
    this.projectDeskZone = new Phaser.Geom.Rectangle(CENTER_X - 280, deskY - 112, 560, 260);

    if (gameState.leader === 2 && gameState.actTwoOfficeLuxury) {
      this.createActTwoLuxuryOffice(deskY);
    } else if (gameState.leader === 2) {
      this.createActTwoOfficeDamage(deskY);
    }
  }

  createActThreeProtestExterior() {
    this.cameras.main.setBackgroundColor("#1a1714");
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x2a211c, 1);
    this.add.rectangle(CENTER_X, GAME_HEIGHT - 110, GAME_WIDTH, 220, 0x1b1816, 1);

    const buildingY = CENTER_Y - 72;
    this.add.rectangle(CENTER_X, buildingY, Math.min(720, GAME_WIDTH - 140), 330, 0x211b18, 1)
      .setStrokeStyle(8, 0x060504, 1);
    this.add.triangle(CENTER_X, buildingY - 218, -390, 118, 0, -80, 390, 118, 0x130f0d, 1);
    this.add.text(CENTER_X, buildingY - 174, "KANTOR DESA", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#5f5a52",
      stroke: "#090706",
      strokeThickness: 4
    }).setOrigin(0.5);

    const doorY = buildingY + 100;
    this.add.rectangle(CENTER_X, doorY, 130, 170, 0x050403, 1).setStrokeStyle(4, 0x3f3028, 1);
    this.add.text(CENTER_X, doorY + 110, "HANGUS", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "28px",
      color: "#8f1f1f",
      stroke: "#050303",
      strokeThickness: 5
    }).setOrigin(0.5).setRotation(-0.08);

    this.add.text(CENTER_X - 226, buildingY - 38, "PEMBOHONG", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "22px",
      color: "#b52626",
      stroke: "#050303",
      strokeThickness: 4
    }).setOrigin(0.5).setRotation(-0.16);

    this.add.text(CENTER_X + 230, buildingY - 44, "KAS KOSONG", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "21px",
      color: "#b52626",
      stroke: "#050303",
      strokeThickness: 4
    }).setOrigin(0.5).setRotation(0.12);

    for (let index = 0; index < 14; index += 1) {
      const x = CENTER_X - 310 + ((index * 67) % 620);
      const y = buildingY - 120 + ((index * 43) % 240);
      this.add.line(0, 0, x - 34, y - 14, x + 30, y + 16, 0x050403, 1).setLineWidth(4);
      this.add.circle(x + 18, y + 12, Phaser.Math.Between(8, 18), 0x050403, 0.85);
    }

    this.add.text(CENTER_X - 250, buildingY + 170, "KAMI TIDAK\nPERCAYA LAGI", {
      fontFamily: "Arial, sans-serif",
      fontSize: "19px",
      color: "#2a1f1a",
      backgroundColor: "#e6ddc9",
      padding: { x: 10, y: 7 },
      align: "center"
    }).setOrigin(0.5).setRotation(-0.05);

    this.add.rectangle(CENTER_X, buildingY + 176, 260, 32, 0x3d3027, 1).setStrokeStyle(3, 0x120f0d, 1);
    this.add.rectangle(CENTER_X, buildingY + 126, 128, 88, 0x4f3b2b, 1).setStrokeStyle(3, 0x120f0d, 1);
    this.add.text(CENTER_X, buildingY + 126, "PODIUM", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#e1d4bf"
    }).setOrigin(0.5);

    const ruinY = buildingY + 64;
    this.add.rectangle(CENTER_X + 4, ruinY, 250, 44, 0x241a16, 1).setStrokeStyle(3, 0x090706, 1);
    this.add.rectangle(CENTER_X - 76, ruinY - 24, 98, 30, 0x120d0b, 1).setRotation(-0.13);
    this.add.rectangle(CENTER_X + 76, ruinY + 26, 120, 24, 0x120d0b, 1).setRotation(0.1);
    this.add.text(CENTER_X, ruinY - 54, "Puing Meja Proyek", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#c9bca8",
      backgroundColor: "#17110f",
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5);
    this.actThreeRuinZone = new Phaser.Geom.Rectangle(CENTER_X - 170, ruinY - 92, 340, 180);
    this.actThreeExitZone = new Phaser.Geom.Rectangle(0, GAME_HEIGHT - 96, GAME_WIDTH, 120);

    this.createDemoCrowd();
    this.player = this.createPlayerSprite(CENTER_X, buildingY + 208);
    this.player.body.setCollideWorldBounds(true);
    this.playerLabel = this.add.text(this.player.x, this.getPlayerLabelY(this.player), "Kepala Desa III", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#f3ece2",
      backgroundColor: "#17110f",
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5);
  }

  createDemoCrowd() {
    const villagers = [
      [CENTER_X - 360, GAME_HEIGHT - 150, 0x5a403d],
      [CENTER_X - 280, GAME_HEIGHT - 188, 0x3f4c4a],
      [CENTER_X + 278, GAME_HEIGHT - 186, 0x4b4a45],
      [CENTER_X + 360, GAME_HEIGHT - 148, 0x5a403d],
      [CENTER_X + 452, GAME_HEIGHT - 204, 0x3c3734]
    ];

    villagers.forEach(([x, y, bodyColor]) => {
      this.add.circle(x, y - 26, 15, 0xb99b84, 1).setStrokeStyle(2, 0x211915, 1);
      this.add.rectangle(x, y + 10, 30, 54, bodyColor, 1).setStrokeStyle(2, 0x161412, 1);
      this.add.rectangle(x - 6, y - 30, 5, 3, 0x241512, 1);
      this.add.rectangle(x + 6, y - 30, 5, 3, 0x241512, 1);
      this.add.rectangle(x, y - 15, 17, 3, 0x3b1717, 1);
    });

    for (let index = 0; index < 4; index += 1) {
      const x = CENTER_X - 430 + (index * 286);
      this.add.line(0, 0, x - 18, GAME_HEIGHT - 126, x - 18, GAME_HEIGHT - 218, 0x2e211a, 1).setLineWidth(4);
    }
  }

  createActTwoLuxuryOffice(deskY) {
    this.add.rectangle(CENTER_X, CENTER_Y + 156, OFFICE_WIDTH - 90, 138, 0x7f1018, 1)
      .setStrokeStyle(4, 0xd4a642, 1);
    this.add.rectangle(CENTER_X, deskY + 78, 490, 28, 0xd4a642, 1)
      .setStrokeStyle(2, 0x7f5510, 1);
    this.add.rectangle(CENTER_X, deskY + 22, 520, 22, 0xf2ca62, 0.92);

    const chairY = deskY - 86;
    this.add.rectangle(CENTER_X, chairY + 28, 102, 120, 0xc99727, 1)
      .setStrokeStyle(4, 0x6b4208, 1);
    this.add.circle(CENTER_X, chairY - 42, 48, 0xe5b844, 1)
      .setStrokeStyle(4, 0x6b4208, 1);
    this.add.text(CENTER_X, chairY - 44, "II", {
      fontFamily: "Georgia, serif",
      fontSize: "30px",
      color: "#fff4bd"
    }).setOrigin(0.5);

    const leftDecorX = OFFICE_LEFT + 104;
    const rightDecorX = OFFICE_RIGHT - 104;
    [leftDecorX, rightDecorX].forEach((x) => {
      this.add.rectangle(x, OFFICE_TOP + 176, 56, 150, 0x9b761f, 1).setStrokeStyle(3, 0x5a3a08, 1);
      this.add.circle(x, OFFICE_TOP + 84, 30, 0xe4bd4a, 1).setStrokeStyle(3, 0x6d4c0a, 1);
    });

    this.add.text(CENTER_X, OFFICE_BOTTOM - 20, "Kantor mewah di atas tanah yang sekarat", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#5b1018",
      backgroundColor: "#f3d884",
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5);
  }

  startActTwoLuxuryReveal() {
    this.phase = "luxuryReveal";
    this.inputLocked = true;

    if (this.player && this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
    }

    this.playLuxuryRevealSting();
    this.cameras.main.shake(360, 0.004);

    const veil = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x050507, 0.92);
    veil.setDepth(90);
    veil.setScrollFactor(0);

    const title = this.add.text(CENTER_X, CENTER_Y - 30, "Beberapa hari kemudian...", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#fff1bd",
      stroke: "#120b07",
      strokeThickness: 4
    }).setOrigin(0.5);
    title.setDepth(91);
    title.setScrollFactor(0);

    const subtitle = this.add.text(CENTER_X, CENTER_Y + 24, "Suara palu berhenti. Bau cat baru menutup bau tanah yang mati.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#e7d8bd",
      align: "center",
      wordWrap: { width: Math.min(820, GAME_WIDTH - 96) }
    }).setOrigin(0.5);
    subtitle.setDepth(91);
    subtitle.setScrollFactor(0);

    this.time.delayedCall(1700, () => {
      this.createLuxuryRevealSparkles();
      this.tweens.add({
        targets: [veil],
        alpha: 0.22,
        duration: 900,
        ease: "Sine.easeInOut"
      });
      this.tweens.add({
        targets: [title, subtitle],
        alpha: 0,
        duration: 700,
        onComplete: () => {
          title.destroy();
          subtitle.destroy();
          this.spawnLuxuryRevealCharacters();
          this.startLuxuryRevealDialog(veil);
        }
      });
    });
  }

  createLuxuryRevealSparkles() {
    for (let index = 0; index < 18; index += 1) {
      const x = OFFICE_LEFT + 80 + ((index * 97) % Math.max(120, OFFICE_WIDTH - 160));
      const y = OFFICE_TOP + 92 + ((index * 71) % Math.max(120, OFFICE_HEIGHT - 184));
      const sparkle = this.add.star(x, y, 4, 3, 11, 0xffe082, 0.92);
      sparkle.setDepth(92);
      sparkle.setAlpha(0);
      this.tweens.add({
        targets: sparkle,
        alpha: 1,
        scaleX: 1.35,
        scaleY: 1.35,
        duration: 180,
        delay: index * 45,
        yoyo: true,
        onComplete: () => sparkle.destroy()
      });
    }
  }

  spawnLuxuryRevealCharacters() {
    const y = OFFICE_TOP + 250;
    this.revealContractor = this.add.rectangle(CENTER_X - 110, y, 34, 42, 0xa45a2a, 1);
    this.revealContractor.setDepth(80);
    this.revealSecretary = this.add.rectangle(CENTER_X + 110, y, 32, 40, 0x3f6f86, 1);
    this.revealSecretary.setDepth(80);

    this.add.text(this.revealContractor.x, this.revealContractor.y - 34, "Kontraktor", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#3b1f0c",
      backgroundColor: "#ead3aa",
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5).setDepth(81);

    this.add.text(this.revealSecretary.x, this.revealSecretary.y - 34, "Sekretaris", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#e8f6ff",
      backgroundColor: "#173546",
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5).setDepth(81);
  }

  startLuxuryRevealDialog(veil) {
    this.showDialogSequence([
      {
        speaker: "Kontraktor",
        text: "Lihat, Pak. Kursi emas, karpet baru, papan nama baru. Dari luar, semuanya tampak berhasil."
      },
      {
        speaker: "Sekretaris",
        text: "Tapi warga di luar masih antre beras. Jalan yang retak belum disentuh sama sekali."
      },
      {
        speaker: "Kepala Desa Baru",
        text: "Mereka butuh sesuatu untuk dilihat. Kantor ini akan membuat mereka percaya aku sedang bekerja."
      },
      {
        speaker: "Narasi",
        text: "Kantor mewah berdiri lebih cepat daripada perut warga yang kosong bisa kenyang."
      }
    ], () => {
      this.phase = "explore";
      this.inputLocked = false;
      this.interactionText.setText("Kantor mewah di atas tanah yang sekarat");
      this.tweens.add({
        targets: veil,
        alpha: 0,
        duration: 700,
        onComplete: () => veil.destroy()
      });
      this.time.delayedCall(3200, () => {
        if (this.interactionText && this.phase === "explore") {
          this.interactionText.setText("");
        }
      });

      if (!gameState.actTwoLedgerDone) {
        this.time.delayedCall(1100, () => this.startNightOfficeGreedScene());
      }
    });
  }

  startNightOfficeGreedScene() {
    if (this.ledgerHackActive || gameState.actTwoLedgerDone) {
      return;
    }

    this.phase = "nightGreed";
    this.inputLocked = true;
    this.applyNightOfficeAtmosphere();
    this.spawnNightMysteriousFigure();
    this.showDialogSequence([
      {
        speaker: "Sosok Misterius",
        text: "Mimpi itu hanya untuk orang lemah. Kita tidak butuh tidur, kita butuh aset. Mari kita buat proyek 'Bendungan Desa' yang sebenarnya tidak akan pernah dibangun."
      }
    ], () => {
      this.startLedgerHackMiniGame();
    });
  }

  applyNightOfficeAtmosphere() {
    const night = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x02030a, 0.58);
    night.setDepth(62);
    night.setScrollFactor(0);

    const lampGlow = this.add.circle(CENTER_X, OFFICE_TOP + 72, 190, 0xffe39b, 0.16);
    lampGlow.setDepth(63);
    lampGlow.setScrollFactor(0);

    for (let index = 0; index < 4; index += 1) {
      const x = OFFICE_LEFT + 120 + (index * Math.max(120, (OFFICE_WIDTH - 240) / 3));
      this.add.rectangle(x, OFFICE_TOP + 84, 86, 58, 0x02040a, 1)
        .setStrokeStyle(3, 0xd8c56d, 0.35)
        .setDepth(64);
      this.add.text(x, OFFICE_TOP + 86, "GELAP", {
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        color: "#3b4050"
      }).setOrigin(0.5).setDepth(65);
    }
  }

  spawnNightMysteriousFigure() {
    const x = CENTER_X;
    const y = OFFICE_TOP + 222;
    this.mysteriousFigure = this.add.rectangle(x, y, 42, 54, 0x050505, 1);
    this.mysteriousFigure.setStrokeStyle(3, 0x4b4b58, 0.8);
    this.mysteriousFigure.setDepth(82);
    this.mysteriousLabel = this.add.text(x, y - 44, "Sosok Misterius", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#e0e0e8",
      backgroundColor: "#08080c",
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5);
    this.mysteriousLabel.setDepth(83);

    this.tweens.add({
      targets: this.mysteriousFigure,
      alpha: 0.45,
      duration: 620,
      yoyo: true,
      repeat: -1
    });
  }

  startLedgerHackMiniGame() {
    this.ledgerHackActive = true;
    this.ledgerProgress = 0;
    this.ledgerCrackCount = 0;
    this.phase = "ledgerHack";
    this.inputLocked = true;

    if (this.player && this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
    }

    this.createLedgerHackOverlay();
    this.startLedgerAudio();
    this.input.keyboard.on("keydown", this.handleLedgerKeyMash, this);
  }

  createLedgerHackOverlay() {
    this.ledgerContainer = this.add.container(0, 0);
    this.ledgerContainer.setDepth(200);
    this.ledgerContainer.setScrollFactor(0);

    const backdrop = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000407, 0.88);
    const scan = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x12ff91, 0.055);
    scan.setBlendMode(Phaser.BlendModes.ADD);

    this.ledgerContainer.add([backdrop, scan]);

    this.addLedgerCodeRows();

    this.ledgerTitleText = this.add.text(CENTER_X, 74, "THE LEDGER HACK", {
      fontFamily: "Courier New, monospace",
      fontSize: "36px",
      color: "#7dffbd",
      stroke: "#00180c",
      strokeThickness: 5
    }).setOrigin(0.5);
    this.ledgerContainer.add(this.ledgerTitleText);

    this.ledgerHintText = this.add.text(CENTER_X, 118, "Tekan tombol apa saja secepat mungkin", {
      fontFamily: "Courier New, monospace",
      fontSize: "18px",
      color: "#dbffe9"
    }).setOrigin(0.5);
    this.ledgerContainer.add(this.ledgerHintText);

    const barWidth = Math.min(760, GAME_WIDTH - 120);
    this.ledgerBarFrame = this.add.rectangle(CENTER_X, GAME_HEIGHT - 92, barWidth, 34, 0x06140e, 1)
      .setStrokeStyle(3, 0x7dffbd, 0.9);
    this.ledgerBarFill = this.add.rectangle(CENTER_X - (barWidth / 2) + 3, GAME_HEIGHT - 92, 1, 24, 0x31ff73, 1)
      .setOrigin(0, 0.5);
    this.ledgerProgressText = this.add.text(CENTER_X, GAME_HEIGHT - 134, "Dana Masuk ke Kantong: 0%", {
      fontFamily: "Courier New, monospace",
      fontSize: "20px",
      color: "#faffda"
    }).setOrigin(0.5);

    this.ledgerContainer.add([this.ledgerBarFrame, this.ledgerBarFill, this.ledgerProgressText]);
    this.ledgerBarWidth = barWidth - 6;
  }

  addLedgerCodeRows() {
    this.ledgerCodeRows = [];
    const columns = Math.max(8, Math.floor(GAME_WIDTH / 150));
    const rows = Math.max(8, Math.floor(GAME_HEIGHT / 64));

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const text = this.add.text(column * 150 + 18, 150 + (row * 64), this.createLedgerCodeLine(), {
          fontFamily: "Courier New, monospace",
          fontSize: "15px",
          color: row % 2 === 0 ? "#28ff83" : "#c8ff65",
          alpha: 0.72
        });
        text.speed = Phaser.Math.Between(38, 96);
        this.ledgerContainer.add(text);
        this.ledgerCodeRows.push(text);
      }
    }

    this.ledgerRainTimer = this.time.addEvent({
      delay: 90,
      loop: true,
      callback: () => this.updateLedgerCodeRows(90),
      callbackScope: this
    });
  }

  createLedgerCodeLine() {
    const codes = ["DANA_DESA", "BENDUNGAN", "500000000", "ASSET", "REKENING", "0xKAS", "VOID", "TRANSFER"];
    return `${Phaser.Utils.Array.GetRandom(codes)}:${Phaser.Math.Between(1000, 999999)};`;
  }

  updateLedgerCodeRows(delta) {
    if (!this.ledgerHackActive) {
      return;
    }

    this.ledgerCodeRows.forEach((row) => {
      row.y += row.speed * (delta / 1000);

      if (row.y > GAME_HEIGHT + 24) {
        row.y = 142;
        row.setText(this.createLedgerCodeLine());
        row.x += Phaser.Math.Between(-22, 22);
        row.x = Phaser.Math.Wrap(row.x, 12, GAME_WIDTH - 130);
      }
    });
  }

  handleLedgerKeyMash(event) {
    if (!this.ledgerHackActive || !event || event.repeat) {
      return;
    }

    this.ledgerProgress = Math.min(100, this.ledgerProgress + Phaser.Math.Between(3, 6));
    this.updateLedgerProgressUi();
    this.corruptLuxuryOffice(this.ledgerProgress);
    this.updateLedgerAudioIntensity();

    if (this.ledgerProgress >= 100) {
      this.finishLedgerHack();
    }
  }

  updateLedgerProgressUi() {
    this.ledgerBarFill.width = Math.max(1, this.ledgerBarWidth * (this.ledgerProgress / 100));
    this.ledgerProgressText.setText(`Dana Masuk ke Kantong: ${Math.floor(this.ledgerProgress)}%`);
    this.cameras.main.shake(70, 0.0025);
  }

  corruptLuxuryOffice(progress) {
    const goldAlpha = Phaser.Math.Clamp(progress / 130, 0.12, 0.82);
    if (!this.ledgerGoldOverlay) {
      this.ledgerGoldOverlay = this.add.rectangle(CENTER_X, CENTER_Y, OFFICE_WIDTH, OFFICE_HEIGHT, 0xffd21c, 0);
      this.ledgerGoldOverlay.setDepth(66);
      this.ledgerGoldOverlay.setBlendMode(Phaser.BlendModes.ADD);
    }
    this.ledgerGoldOverlay.setAlpha(goldAlpha);

    const neededCracks = Math.floor(progress / 14);
    while (this.ledgerCrackCount < neededCracks) {
      const x = Phaser.Math.Between(OFFICE_LEFT + 48, OFFICE_RIGHT - 48);
      const y = Phaser.Math.Between(OFFICE_TOP + 70, OFFICE_BOTTOM - 70);
      const crack = this.add.line(0, 0, x - 40, y - 18, x + 46, y + 24, 0x13090a, 0.96).setLineWidth(4);
      crack.setDepth(67);
      const hole = this.add.circle(x + 18, y + 10, Phaser.Math.Between(10, 22), 0x070405, 0.74);
      hole.setDepth(68);
      this.ledgerCrackCount += 1;
    }
  }

  finishLedgerHack() {
    if (!this.ledgerHackActive) {
      return;
    }

    this.ledgerHackActive = false;
    gameState.actTwoLedgerDone = true;
    addPersonalWealth(1000);
    gameState.integrity = Math.min(gameState.integrity, 7);
    gameState.sanityGlitched = true;
    this.updateStatusUi();

    this.input.keyboard.off("keydown", this.handleLedgerKeyMash, this);
    this.stopLedgerAudio();

    if (this.ledgerRainTimer) {
      this.ledgerRainTimer.remove(false);
      this.ledgerRainTimer = null;
    }

    this.ledgerProgressText.setText("TRANSFER SELESAI");
    this.ledgerHintText.setText("Bendungan Desa: tidak pernah dibangun");

    this.time.delayedCall(1200, () => {
      this.startGoldenPrisonExploration();
    });
  }

  startGoldenPrisonExploration() {
    if (this.goldenPrisonActive) {
      return;
    }

    this.goldenPrisonActive = true;
    this.goldenSeatCount = 0;
    this.phase = "goldenPrison";
    this.inputLocked = false;

    if (this.ledgerContainer) {
      this.tweens.add({
        targets: this.ledgerContainer,
        alpha: 0,
        duration: 650,
        onComplete: () => {
          this.ledgerContainer.destroy();
          this.ledgerContainer = null;
        }
      });
    }

    this.createGoldenPrisonObjects();
    this.startPhoneRinging();
    this.startWealthGrowth();
    this.startRiotAudio();
    this.showPrisonMessage("Kantor ini berkilau seperti istana. Pintu tidak bergerak sedikit pun.");
    this.time.delayedCall(1600, () => {
      gameState.integrityGlitched = true;
    });
  }

  createGoldenPrisonObjects() {
    const deskY = OFFICE_TOP + 136;
    this.add.rectangle(CENTER_X, CENTER_Y, OFFICE_WIDTH, OFFICE_HEIGHT, 0xffd329, 0.13)
      .setDepth(69)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.add.rectangle(CENTER_X, deskY, 500, 96, 0xffd21c, 0.96)
      .setStrokeStyle(5, 0x7f5207, 1)
      .setDepth(70);
    this.add.text(CENTER_X, deskY, "MEJA EMAS", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#4b2d00"
    }).setOrigin(0.5).setDepth(71);

    const chairY = deskY - 86;
    this.add.rectangle(CENTER_X, chairY + 28, 128, 140, 0xffd21c, 1)
      .setStrokeStyle(5, 0x7f5207, 1)
      .setDepth(72);
    this.add.circle(CENTER_X, chairY - 48, 58, 0xffe066, 1)
      .setStrokeStyle(5, 0x7f5207, 1)
      .setDepth(73);
    this.add.text(CENTER_X, chairY - 48, "TAHTA", {
      fontFamily: "Georgia, serif",
      fontSize: "18px",
      color: "#5b3400"
    }).setOrigin(0.5).setDepth(74);

    [OFFICE_LEFT + 108, OFFICE_RIGHT - 108].forEach((x) => {
      this.add.rectangle(x, OFFICE_TOP + 210, 76, 190, 0xffd21c, 1)
        .setStrokeStyle(4, 0x7f5207, 1)
        .setDepth(70);
      this.add.text(x, OFFICE_TOP + 210, "LEMARI\nEMAS", {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#4b2d00",
        align: "center"
      }).setOrigin(0.5).setDepth(71);
    });

    const moneyX = OFFICE_RIGHT - 150;
    const moneyY = OFFICE_BOTTOM - 170;
    for (let index = 0; index < 5; index += 1) {
      this.add.rectangle(moneyX + (index % 2) * 46, moneyY - Math.floor(index / 2) * 24, 76, 24, 0xf6d45b, 1)
        .setStrokeStyle(2, 0x6b4b09, 1)
        .setDepth(75);
    }
    this.add.text(moneyX + 24, moneyY + 28, "Tumpukan Uang", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#ffeeb0",
      backgroundColor: "#261b05",
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5).setDepth(76);

    const doorY = OFFICE_BOTTOM - 58;
    this.add.rectangle(CENTER_X, doorY, 170, 84, 0x17100b, 1)
      .setStrokeStyle(5, 0xffd21c, 1)
      .setDepth(72);
    this.add.rectangle(CENTER_X, doorY, 138, 22, 0xffd21c, 1)
      .setRotation(0.12)
      .setDepth(73);
    this.add.text(CENTER_X, doorY - 62, "Pintu Terkunci", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#ffeeb0",
      backgroundColor: "#150c08",
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(74);

    const phoneX = CENTER_X + 190;
    const phoneY = deskY - 12;
    this.prisonPhone = this.add.container(phoneX, phoneY).setDepth(90);
    const base = this.add.rectangle(0, 8, 58, 30, 0x090909, 1).setStrokeStyle(2, 0xffd21c, 0.8);
    const handle = this.add.rectangle(0, -12, 72, 16, 0x151515, 1).setStrokeStyle(2, 0xffd21c, 0.8);
    const redDot = this.add.circle(25, 8, 5, 0xff263f, 1);
    this.prisonPhone.add([base, handle, redDot]);
    this.tweens.add({
      targets: this.prisonPhone,
      angle: 4,
      duration: 90,
      yoyo: true,
      repeat: -1
    });

    this.prisonChairZone = new Phaser.Geom.Rectangle(CENTER_X - 88, chairY - 112, 176, 210);
    this.prisonMoneyZone = new Phaser.Geom.Rectangle(moneyX - 60, moneyY - 90, 170, 150);
    this.prisonPhoneZone = new Phaser.Geom.Rectangle(phoneX - 76, phoneY - 54, 152, 112);
    this.prisonDoorZone = new Phaser.Geom.Rectangle(CENTER_X - 110, doorY - 104, 220, 140);

    this.input.on("pointerdown", this.handleGoldenPrisonPointer, this);
  }

  handleGoldenPrisonPointer(pointer) {
    if (!this.goldenPrisonActive || this.inputLocked) {
      return;
    }

    const x = Number.isFinite(pointer.worldX) ? pointer.worldX : pointer.x;
    const y = Number.isFinite(pointer.worldY) ? pointer.worldY : pointer.y;

    if (this.prisonChairZone && Phaser.Geom.Rectangle.Contains(this.prisonChairZone, x, y)) {
      this.showPrisonMessage("Dingin dan keras. Tidak senyaman saat masih kayu.");
      return;
    }

    if (this.prisonMoneyZone && Phaser.Geom.Rectangle.Contains(this.prisonMoneyZone, x, y)) {
      this.showPrisonMessage("Cukup untuk membeli seluruh desa, tapi tidak bisa membeli satu pun teman.");
    }
  }

  showPrisonMessage(message) {
    if (!this.prisonMessageText) {
      this.prisonMessageText = this.add.text(CENTER_X, GAME_HEIGHT - 92, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#fff6c9",
        backgroundColor: "#100b08",
        padding: { x: 14, y: 8 },
        align: "center",
        wordWrap: { width: Math.min(860, GAME_WIDTH - 80) }
      }).setOrigin(0.5).setDepth(170);
      this.prisonMessageText.setScrollFactor(0);
    }

    this.prisonMessageText.setText(message);
    this.prisonMessageText.setAlpha(1);
    this.tweens.killTweensOf(this.prisonMessageText);
    this.tweens.add({
      targets: this.prisonMessageText,
      alpha: 0,
      duration: 650,
      delay: 3600
    });
  }

  startWealthGrowth() {
    if (this.wealthGrowthTimer) {
      return;
    }

    this.wealthGrowthTimer = this.time.addEvent({
      delay: 850,
      loop: true,
      callback: () => {
        addPersonalWealth(Phaser.Math.Between(8, 22));
        if (gameState.integrityGlitched) {
          return;
        }

        if (gameState.wealth > 1800 || this.goldenSeatCount > 0) {
          gameState.integrityGlitched = true;
        }
      }
    });
  }

  updateGoldenPrisonDecay() {
    if (!this.goldenPrisonActive) {
      return;
    }

    if (!gameState.integrityGlitched && Date.now() % 1600 < 40) {
      gameState.integrity = Math.max(0, gameState.integrity - 1);
    }
  }

  startPhoneRinging() {
    if (this.phoneRingTimer) {
      return;
    }

    this.phoneRingTimer = this.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => this.playPhoneRing()
    });
  }

  playPhoneRing() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    let audioContext;
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      return;
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(820, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.3);
    this.time.delayedCall(360, () => {
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
    });
  }

  answerMysteriousPhone() {
    const voices = [
      "Pak, anak saya sakit karena air sungai tercemar limbah proyek bapak...",
      "Pak, bendungan itu mana? Sawah kami sudah kering...",
      "Pak, kami mengetuk kantor dari tadi. Kenapa pintunya dikunci?",
      "Pak, uangnya bersinar di kantor bapak, tapi rumah kami gelap..."
    ];

    this.showDialogSequence([
      {
        speaker: "Telepon",
        text: Phaser.Utils.Array.GetRandom(voices)
      },
      {
        speaker: "Telepon",
        text: "Sambungan terputus."
      }
    ], () => {
      this.phase = "goldenPrison";
      this.inputLocked = false;
    });
  }

  sitOnGoldenChair() {
    this.goldenSeatCount += 1;
    gameState.integrityGlitched = true;
    const darkness = Math.min(0.78, this.goldenSeatCount * 0.16);

    if (!this.prisonDarkness) {
      this.prisonDarkness = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0);
      this.prisonDarkness.setDepth(160);
      this.prisonDarkness.setScrollFactor(0);
    }

    this.tweens.add({
      targets: this.prisonDarkness,
      alpha: darkness,
      duration: 600
    });

    this.raiseRiotVolume();
    this.cameras.main.shake(240, 0.004 + (this.goldenSeatCount * 0.001));
    this.showPrisonMessage(`Kursi emas menerima tubuhmu. Suara warga semakin dekat. (${this.goldenSeatCount}/3)`);

    if (this.goldenSeatCount >= 3) {
      this.startFinalFall();
    }
  }

  startRiotAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass || this.riotAudioContext) {
      return;
    }

    try {
      this.riotAudioContext = new AudioContextClass();
      const low = this.riotAudioContext.createOscillator();
      const high = this.riotAudioContext.createOscillator();
      const gain = this.riotAudioContext.createGain();
      low.type = "sawtooth";
      high.type = "triangle";
      low.frequency.setValueAtTime(74, this.riotAudioContext.currentTime);
      high.frequency.setValueAtTime(126, this.riotAudioContext.currentTime);
      gain.gain.setValueAtTime(0.012, this.riotAudioContext.currentTime);
      low.connect(gain);
      high.connect(gain);
      gain.connect(this.riotAudioContext.destination);
      low.start();
      high.start();
      this.riotNodes = { low, high, gain };
    } catch (error) {
      this.riotAudioContext = null;
      this.riotNodes = null;
    }
  }

  raiseRiotVolume() {
    if (!this.riotAudioContext || !this.riotNodes || this.riotAudioContext.state !== "running") {
      return;
    }

    const now = this.riotAudioContext.currentTime;
    const intensity = Math.min(1, this.goldenSeatCount / 3);
    this.riotNodes.gain.gain.setTargetAtTime(0.012 + intensity * 0.16, now, 0.2);
    this.riotNodes.low.frequency.setTargetAtTime(74 + intensity * 30, now, 0.2);
    this.riotNodes.high.frequency.setTargetAtTime(126 + intensity * 80, now, 0.2);
  }

  startFinalFall() {
    if (this.finalFallStarted) {
      return;
    }

    this.finalFallStarted = true;
    this.inputLocked = true;
    this.phase = "finalFallBreach";
    this.showPrisonMessage("Sesuatu menghantam pintu.");
    this.playDoorBreakSfx();
    this.cameras.main.shake(900, 0.018);
    this.breakGoldenDoor();

    this.time.delayedCall(650, () => {
      this.createOverrunShadow();
    });

    this.time.delayedCall(1700, () => {
      this.showFinalMysteriousDialog();
    });
  }

  playDoorBreakSfx() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    let audioContext;
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      return;
    }

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(92, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.42);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.56);
    this.time.delayedCall(700, () => {
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
    });
  }

  breakGoldenDoor() {
    const doorY = OFFICE_BOTTOM - 58;
    const chunks = [
      { x: CENTER_X - 52, y: doorY - 20, rotation: -0.7 },
      { x: CENTER_X + 44, y: doorY + 4, rotation: 0.62 },
      { x: CENTER_X, y: doorY + 36, rotation: 0.18 }
    ];

    chunks.forEach((chunk, index) => {
      const piece = this.add.rectangle(CENTER_X, doorY, 82, 32, 0xffd21c, 1)
        .setStrokeStyle(3, 0x5f3a05, 1)
        .setDepth(175);
      this.tweens.add({
        targets: piece,
        x: chunk.x,
        y: chunk.y,
        angle: Phaser.Math.RadToDeg(chunk.rotation),
        duration: 520 + (index * 90),
        ease: "Back.easeOut"
      });
    });

    this.add.rectangle(CENTER_X, doorY, 190, 120, 0x020202, 0.96)
      .setStrokeStyle(4, 0x070707, 1)
      .setDepth(174);
  }

  createOverrunShadow() {
    this.escapeShadow = this.add.rectangle(CENTER_X, OFFICE_BOTTOM - 28, 230, 72, 0x000000, 0.86);
    this.escapeShadow.setDepth(176);
    this.tweens.add({
      targets: this.escapeShadow,
      y: this.player ? this.player.y : CENTER_Y,
      scaleX: 3.2,
      scaleY: 5.2,
      alpha: 0.94,
      duration: 5200,
      ease: "Sine.easeIn"
    });
  }

  showFinalMysteriousDialog() {
    const x = CENTER_X + 116;
    const y = OFFICE_TOP + 140;
    this.mysteriousFigure = this.add.rectangle(x, y, 42, 54, 0x050505, 1)
      .setStrokeStyle(3, 0x55555f, 0.9)
      .setDepth(190);
    this.mysteriousLabel = this.add.text(x, y - 44, "Sosok Misterius", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#e6e6e6",
      backgroundColor: "#070707",
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(191);

    this.playSoftLaugh();
    this.showDialogSequence([
      {
        speaker: "Sosok Misterius",
        text: "Emas ini berat, bukan? Sayangnya, emas tidak bisa mengapung di tengah kemarahan rakyat."
      }
    ], () => {
      this.startEscapeAttempt();
    });
  }

  playSoftLaugh() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    let audioContext;
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      return;
    }

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 1.1);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 1.5);
    this.time.delayedCall(1700, () => {
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
    });
  }

  startEscapeAttempt() {
    this.phase = "escapeAttempt";
    this.inputLocked = false;
    this.playerSpeed = 20;
    this.escapeWindowZone = new Phaser.Geom.Rectangle(OFFICE_LEFT + 44, OFFICE_TOP + 70, 150, 160);
    this.showPrisonMessage("Lari lewat jendela.");
  }

  updateEscapeAttempt() {
    if (this.phase !== "escapeAttempt" || !this.escapeShadow || !this.player) {
      return;
    }

    const chaseSpeed = 1.4 + (this.goldenSeatCount * 0.35);
    const angle = Phaser.Math.Angle.Between(this.escapeShadow.x, this.escapeShadow.y, this.player.x, this.player.y);
    this.escapeShadow.x += Math.cos(angle) * chaseSpeed;
    this.escapeShadow.y += Math.sin(angle) * chaseSpeed;

    const distance = Phaser.Math.Distance.Between(this.escapeShadow.x, this.escapeShadow.y, this.player.x, this.player.y);
    if (distance < 120) {
      this.startOverrunGlitch();
      return;
    }

    if (this.escapeWindowZone && Phaser.Geom.Rectangle.Contains(this.escapeWindowZone, this.player.x, this.player.y)) {
      this.showPrisonMessage("Jendelanya tidak terbuka. Semua jalan keluar hanya pajangan.");
    }
  }

  startOverrunGlitch() {
    if (this.phase === "overrunGlitch") {
      return;
    }

    this.phase = "overrunGlitch";
    this.inputLocked = true;
    if (this.player && this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
    }

    this.cameras.main.shake(1400, 0.028);
    const colors = [0xff004c, 0x00f5ff, 0xfff200, 0x7d00ff, 0x00ff65];
    colors.forEach((color, index) => {
      const flash = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, color, 0.22);
      flash.setDepth(260 + index);
      flash.setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 180 + (index * 80),
        delay: index * 130,
        yoyo: true,
        repeat: 3,
        onComplete: () => flash.destroy()
      });
    });

    this.time.delayedCall(1700, () => this.showActThreeTransitionNarrative());
  }

  showActThreeTransitionNarrative() {
    const black = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1);
    black.setDepth(310);
    black.setScrollFactor(0);

    const text = this.add.text(CENTER_X, CENTER_Y, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: Math.min(920, GAME_WIDTH - 100) },
      lineSpacing: 10
    }).setOrigin(0.5).setDepth(311);
    text.setScrollFactor(0);

    const lines = [
      "Pejabat kedua tidak pernah terlihat lagi...",
      "Dia meninggalkan kantor mewah yang kini menjadi saksi bisu kehancuran.",
      "Kini, tidak ada lagi uang untuk dicuri. Yang tersisa hanyalah api.",
      "Beberapa minggu kemudian, desa dipaksa memilih pemimpin baru.",
      "Bukan karena percaya. Hanya karena kursi kosong selalu mencari korban berikutnya."
    ];

    lines.forEach((line, index) => {
      this.time.delayedCall(index * 2500, () => {
        text.setText(line);
        text.setAlpha(0);
        this.tweens.add({
          targets: text,
          alpha: 1,
          duration: 650
        });
      });
    });

    this.time.delayedCall((lines.length * 2500) + 900, () => {
      gameState.act = 3;
      gameState.actThreeStarted = true;
      gameState.leader = 3;
      this.scene.start("SceneSiang", {
        actThreeStart: true
      });
    });
  }

  stopRiotAudio() {
    if (this.riotNodes) {
      try {
        this.riotNodes.low.stop();
        this.riotNodes.high.stop();
      } catch (error) {
        // Riot audio may already be stopped.
      }
      this.riotNodes = null;
    }

    if (this.riotAudioContext && this.riotAudioContext.state !== "closed") {
      this.riotAudioContext.close();
    }

    this.riotAudioContext = null;
  }

  startLedgerAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    try {
      this.ledgerAudioContext = new AudioContextClass();
      const bass = this.ledgerAudioContext.createOscillator();
      const tick = this.ledgerAudioContext.createOscillator();
      const gain = this.ledgerAudioContext.createGain();
      bass.type = "sawtooth";
      tick.type = "square";
      bass.frequency.setValueAtTime(70, this.ledgerAudioContext.currentTime);
      tick.frequency.setValueAtTime(6, this.ledgerAudioContext.currentTime);
      gain.gain.setValueAtTime(0.035, this.ledgerAudioContext.currentTime);
      bass.connect(gain);
      tick.connect(gain);
      gain.connect(this.ledgerAudioContext.destination);
      bass.start();
      tick.start();
      this.ledgerAudioNodes = { bass, tick, gain };
    } catch (error) {
      this.ledgerAudioContext = null;
      this.ledgerAudioNodes = null;
    }
  }

  updateLedgerAudioIntensity() {
    if (!this.ledgerAudioContext || !this.ledgerAudioNodes || this.ledgerAudioContext.state !== "running") {
      return;
    }

    const intensity = this.ledgerProgress / 100;
    const now = this.ledgerAudioContext.currentTime;
    this.ledgerAudioNodes.bass.frequency.setTargetAtTime(70 + intensity * 160, now, 0.04);
    this.ledgerAudioNodes.tick.frequency.setTargetAtTime(6 + intensity * 24, now, 0.04);
    this.ledgerAudioNodes.gain.gain.setTargetAtTime(0.035 + intensity * 0.11, now, 0.04);
  }

  stopLedgerAudio() {
    if (this.ledgerAudioNodes) {
      try {
        this.ledgerAudioNodes.bass.stop();
        this.ledgerAudioNodes.tick.stop();
      } catch (error) {
        // Nodes can already be stopped during scene shutdown.
      }
      this.ledgerAudioNodes = null;
    }

    if (this.ledgerAudioContext && this.ledgerAudioContext.state !== "closed") {
      this.ledgerAudioContext.close();
    }

    this.ledgerAudioContext = null;
  }

  playDistantPoliceAndLaughter() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    let audioContext;
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      return;
    }

    const now = audioContext.currentTime;
    const siren = audioContext.createOscillator();
    const laugh = audioContext.createOscillator();
    const sirenGain = audioContext.createGain();
    const laughGain = audioContext.createGain();

    siren.type = "sine";
    siren.frequency.setValueAtTime(360, now);
    siren.frequency.linearRampToValueAtTime(560, now + 0.9);
    siren.frequency.linearRampToValueAtTime(360, now + 1.8);
    sirenGain.gain.setValueAtTime(0.0001, now);
    sirenGain.gain.exponentialRampToValueAtTime(0.055, now + 0.2);
    sirenGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

    laugh.type = "triangle";
    laugh.frequency.setValueAtTime(180, now + 0.45);
    laugh.frequency.exponentialRampToValueAtTime(92, now + 1.4);
    laugh.frequency.exponentialRampToValueAtTime(210, now + 2.1);
    laughGain.gain.setValueAtTime(0.0001, now + 0.45);
    laughGain.gain.exponentialRampToValueAtTime(0.13, now + 0.75);
    laughGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    siren.connect(sirenGain);
    laugh.connect(laughGain);
    sirenGain.connect(audioContext.destination);
    laughGain.connect(audioContext.destination);
    siren.start(now);
    laugh.start(now + 0.45);
    siren.stop(now + 3.1);
    laugh.stop(now + 3.3);

    this.time.delayedCall(3600, () => {
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
    });
  }

  playLuxuryRevealSting() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    let audioContext;
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      return;
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(620, now + 0.55);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.95);
    this.time.delayedCall(1100, () => {
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
    });
  }

  createActTwoOfficeDamage(deskY) {
    this.add.line(0, 0, CENTER_X - 130, deskY - 36, CENTER_X + 96, deskY + 28, 0x2a1a12, 1).setLineWidth(5);
    this.add.line(0, 0, CENTER_X + 118, deskY - 34, CENTER_X + 20, deskY + 34, 0x2a1a12, 1).setLineWidth(4);

    const plantX = OFFICE_RIGHT - 92;
    const plantY = OFFICE_BOTTOM - 92;
    this.add.rectangle(plantX, plantY + 28, 54, 44, 0x5c4030, 1).setStrokeStyle(3, 0x2f2119, 1);
    this.add.line(0, 0, plantX, plantY + 8, plantX - 28, plantY - 38, 0x5a4a35, 1).setLineWidth(5);
    this.add.line(0, 0, plantX, plantY + 8, plantX + 22, plantY - 42, 0x5a4a35, 1).setLineWidth(5);
    this.add.circle(OFFICE_LEFT + 78, OFFICE_TOP + 86, 24, 0x4d4b43, 0.32);
    this.add.text(CENTER_X, OFFICE_BOTTOM - 20, "Kantor warisan yang rusak", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#574233"
    }).setOrigin(0.5);
  }

  createCharacters() {
    const playerStartY = this.returningFromMiniGame
      ? CENTER_Y + Math.min(120, OFFICE_HEIGHT * 0.18)
      : this.wakeFromNightmare
        ? OFFICE_TOP + 258
      : OFFICE_BOTTOM - 60;
    this.player = this.createPlayerSprite(CENTER_X - 10, playerStartY);
    this.player.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.frontDesk);

    this.playerLabel = this.add.text(this.player.x, this.getPlayerLabelY(this.player), gameState.leader === 2 ? "Kepala Desa Baru" : "Kepala Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#10233d"
    }).setOrigin(0.5);

    this.contractor = null;
    this.contractorLabel = null;

    if (((!this.returningFromMiniGame && !this.wakeFromNightmare) || this.secondBribe) && gameState.leader === 1) {
      this.contractor = this.add.rectangle(CENTER_X, OFFICE_TOP + 246, 34, 42, 0xa45a2a, 1);
      this.contractorLabel = this.add.text(this.contractor.x, this.contractor.y - 34, "Kontraktor", {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#3b1f0c"
      }).setOrigin(0.5);
    }

    this.mysteriousFigure = null;
    this.mysteriousLabel = null;
  }

  createControls() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      continueDialog: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  createInteractionUi() {
    this.interactionText = this.add.text(CENTER_X, GAME_HEIGHT - 40, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#1d2a21",
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5);

    this.interactionText.setDepth(110);
  }

  updatePlayerMovement() {
    if (!this.player || this.inputLocked) {
      if (this.player && this.player.body) {
        this.player.body.setVelocity(0, 0);
        this.updatePlayerAnimation(this.player);
      }
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.left.isDown) {
      velocityX -= 1;
    }

    if (this.keys.right.isDown) {
      velocityX += 1;
    }

    if (this.keys.up.isDown) {
      velocityY -= 1;
    }

    if (this.keys.down.isDown) {
      velocityY += 1;
    }

    if (velocityX !== 0 || velocityY !== 0) {
      const length = Math.sqrt((velocityX * velocityX) + (velocityY * velocityY));
      velocityX = (velocityX / length) * this.playerSpeed;
      velocityY = (velocityY / length) * this.playerSpeed;
    }

    this.player.body.setVelocity(velocityX, velocityY);
    this.updatePlayerAnimation(this.player);
  }

  updateCharacterLabels() {
    if (this.playerLabel) {
      this.playerLabel.setPosition(this.player.x, this.getPlayerLabelY(this.player));
    }

    if (this.mysteriousLabel && this.mysteriousFigure) {
      this.mysteriousLabel.setPosition(this.mysteriousFigure.x, this.mysteriousFigure.y - 34);
    }

    if (this.secretaryLabel && this.secretary) {
      this.secretaryLabel.setPosition(this.secretary.x, this.secretary.y - 34);
    }
  }

  updateInteractionPrompt() {
    if (!this.interactionText) {
      return;
    }

    if (this.inputLocked) {
      if (this.phase !== "leaving") {
        this.interactionText.setText("");
      }
      return;
    }

    if (this.phase === "exit" && this.exitUnlocked) {
      this.interactionText.setPosition(CENTER_X, GAME_HEIGHT - 138);
      this.interactionText.setText("Berjalan ke Pintu Keluar");
      return;
    }

    this.interactionText.setPosition(CENTER_X, GAME_HEIGHT - 40);

    if (this.goldenPrisonActive) {
      if (this.isNearPrisonPhone()) {
        this.interactionText.setText("Tekan E untuk mengangkat Telepon Misterius");
        return;
      }

      if (this.isNearPrisonChair()) {
        this.interactionText.setText("Tekan E untuk duduk di Kursi Emas");
        return;
      }

      if (this.isNearPrisonDoor()) {
        this.interactionText.setText("Pintu terkunci dari luar");
        return;
      }
    }

    if (this.phase === "actThreeInauguration") {
      if (this.isNearActThreeRuins()) {
        this.interactionText.setText("Tekan E untuk memeriksa puing Meja Proyek");
        return;
      }

      this.interactionText.setText("Tidak ada tepuk tangan. Hanya tatapan marah dari jauh.");
      return;
    }

    if (this.phase === "actThreeExit") {
      if (this.isNearActThreeExit()) {
        this.interactionText.setText("Keluar menuju pemukiman warga...");
        return;
      }

      this.interactionText.setText("Pergi ke pemukiman warga.");
      return;
    }

    if (this.phase !== "explore") {
      this.interactionText.setText("");
      return;
    }

    if (this.isNearContractor()) {
      this.interactionText.setText("Tekan E untuk bicara");
      return;
    }

    if (this.isNearActTwoProjectDesk()) {
      this.interactionText.setText("Tekan E untuk memeriksa Meja Proyek Desa");
      return;
    }

    this.interactionText.setText("");
  }

  handleInteraction() {
    if (
      this.phase === "goldenPrison" &&
      !this.inputLocked &&
      Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      if (this.isNearPrisonPhone()) {
        this.answerMysteriousPhone();
        return;
      }

      if (this.isNearPrisonChair()) {
        this.sitOnGoldenChair();
        return;
      }
    }

    if (
      this.phase === "actThreeInauguration" &&
      !this.inputLocked &&
      this.isNearActThreeRuins() &&
      Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      this.startActThreeImpossibleChoice();
      return;
    }

    if (
      this.phase === "explore" &&
      !this.inputLocked &&
      this.isNearActTwoProjectDesk() &&
      Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      this.startActTwoProjectDeskInteraction();
      return;
    }

    if (
      this.phase === "explore" &&
      !this.inputLocked &&
      this.isNearContractor() &&
      Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      if (this.secondBribe) {
        this.startSecondBribeScene();
        return;
      }

      this.startContractorDeal();
    }
  }

  isNearContractor() {
    if (!this.contractor) {
      return false;
    }

    return Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.contractor.x,
      this.contractor.y
    ) < 96;
  }

  isNearActTwoProjectDesk() {
    if (!this.actTwoProjectAvailable || this.actTwoProjectStarted || !this.projectDeskZone || !this.player) {
      return false;
    }

    return Phaser.Geom.Rectangle.Contains(this.projectDeskZone, this.player.x, this.player.y);
  }

  isNearActThreeRuins() {
    return this.actThreeRuinZone && this.player && Phaser.Geom.Rectangle.Contains(this.actThreeRuinZone, this.player.x, this.player.y);
  }

  isNearActThreeExit() {
    return this.actThreeExitZone && this.player && Phaser.Geom.Rectangle.Contains(this.actThreeExitZone, this.player.x, this.player.y);
  }

  startActThreeInaugurationStory() {
    if (this.actThreeStoryStarted) {
      return;
    }

    this.actThreeStoryStarted = true;
    this.phase = "actThreePrologue";
    this.inputLocked = true;
    if (this.player && this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
    }

    this.showDialogSequence([
      {
        speaker: "Narasi",
        text: "Tiga minggu setelah kantor emas itu roboh, desa tidak merayakan apa pun."
      },
      {
        speaker: "Narasi",
        text: "Hutang menunggu di setiap rumah. Jalanan retak, kas desa kosong, dan nama kepala desa menjadi kata yang dibenci."
      },
      {
        speaker: "Narasi",
        text: "Namun kursi itu tidak boleh dibiarkan kosong. Pemerintah mengirim satu nama baru untuk dilantik di depan kantor yang hangus."
      },
      {
        speaker: "Narasi",
        text: "Tidak ada tepuk tangan. Hanya warga yang berdiri jauh, menatap podium dengan spanduk: KAMI TIDAK PERCAYA LAGI."
      }
    ], () => {
      this.phase = "actThreeInauguration";
      this.inputLocked = false;
      this.interactionText.setText("Tidak ada tepuk tangan.");
    });
  }

  startActThreeImpossibleChoice() {
    if (this.actThreeChoiceStarted) {
      return;
    }

    this.actThreeChoiceStarted = true;
    this.phase = "actThreeChoice";
    this.inputLocked = true;
    if (this.player && this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
    }

    this.showDialogSequence([
      {
        speaker: "Pikiran",
        text: "Tidak ada uang tersisa. Tidak ada semen. Tidak ada harapan."
      }
    ], () => {
      this.spawnActThreeMonsterShadow();
    });
  }

  spawnActThreeMonsterShadow() {
    const monsterX = CENTER_X + 190;
    const monsterY = CENTER_Y - 24;
    const shadow = this.add.container(monsterX, monsterY);
    shadow.setDepth(96);

    const body = this.add.ellipse(0, 34, 170, 230, 0x050505, 0.94).setStrokeStyle(4, 0x350809, 0.95);
    const head = this.add.circle(0, -96, 54, 0x020202, 0.98).setStrokeStyle(4, 0x5f1014, 0.9);
    const leftArm = this.add.rectangle(-92, 24, 34, 170, 0x030303, 0.92).setRotation(-0.42);
    const rightArm = this.add.rectangle(92, 24, 34, 170, 0x030303, 0.92).setRotation(0.42);
    const leftEye = this.add.circle(-18, -106, 7, 0xff3434, 1);
    const rightEye = this.add.circle(18, -106, 7, 0xff3434, 1);
    shadow.add([leftArm, rightArm, body, head, leftEye, rightEye]);
    shadow.setAlpha(0);
    this.mysteriousFigure = shadow;

    this.tweens.add({
      targets: shadow,
      alpha: 1,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    this.cameras.main.shake(600, 0.01);
    this.showDialogSequence([
      {
        speaker: "Sosok Misterius",
        text: "Bahkan aku pun tidak bisa memberimu uang sekarang. Semuanya sudah habis terbakar."
      }
    ], () => {
      this.startActThreeForcedExit();
    });
  }

  startActThreeForcedExit() {
    this.phase = "actThreeExit";
    this.inputLocked = false;
    this.playerSpeed = 80;
    this.showPrisonMessage("Tidak ada pilihan selain berjalan ke pemukiman warga.");
  }

  updateActThreeTension(time) {
    if (!this.actThreeStart) {
      return;
    }

    if (time >= this.nextActThreeShakeAt) {
      this.cameras.main.shake(140, 0.0018);
      this.nextActThreeShakeAt = time + 850;
    }
  }

  handleActThreeExit() {
    if (this.phase !== "actThreeExit" || this.inputLocked || !this.isNearActThreeExit()) {
      return;
    }

    this.inputLocked = true;
    this.player.body.setVelocity(0, 0);
    this.interactionText.setText("Menuju pemukiman warga...");
    this.cameras.main.fadeOut(900, 8, 6, 5);
    this.time.delayedCall(980, () => {
      this.scene.start("SceneEnding");
    });
  }

  isNearPrisonPhone() {
    return this.goldenPrisonActive && this.prisonPhoneZone && Phaser.Geom.Rectangle.Contains(this.prisonPhoneZone, this.player.x, this.player.y);
  }

  isNearPrisonChair() {
    return this.goldenPrisonActive && this.prisonChairZone && Phaser.Geom.Rectangle.Contains(this.prisonChairZone, this.player.x, this.player.y);
  }

  isNearPrisonDoor() {
    return this.goldenPrisonActive && this.prisonDoorZone && Phaser.Geom.Rectangle.Contains(this.prisonDoorZone, this.player.x, this.player.y);
  }

  startActTwoProjectDeskInteraction() {
    this.actTwoProjectStarted = true;
    this.phase = "actTwoDesk";
    this.showDialogSequence([
      {
        speaker: "Pikiran",
        text: "Kantor ini hancur, jalanan di luar rusak, dan kas desa kosong. Aku butuh dana cepat jika ingin terlihat bekerja."
      }
    ], () => {
      this.startActTwoCorruptionAtmosphere();
      this.spawnActTwoContractorAndShadow();
    });
  }

  startActTwoCorruptionAtmosphere() {
    if (!this.actTwoDarkOverlay) {
      this.actTwoDarkOverlay = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x07060a, 0);
      this.actTwoDarkOverlay.setDepth(60);
      this.actTwoDarkOverlay.setScrollFactor(0);
    }

    this.tweens.add({
      targets: this.actTwoDarkOverlay,
      alpha: 0.28,
      duration: 1800,
      ease: "Sine.easeInOut"
    });

    this.startWhisperAmbient();
  }

  spawnActTwoContractorAndShadow() {
    this.phase = "actTwoTrap";
    this.inputLocked = true;

    if (this.player && this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
    }

    const npcY = OFFICE_TOP + 246;
    this.contractor = this.add.rectangle(CENTER_X - 76, npcY, 34, 42, 0xa45a2a, 1);
    this.contractor.setDepth(75);
    this.contractorLabel = this.add.text(this.contractor.x, this.contractor.y - 34, "Kontraktor", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#3b1f0c",
      backgroundColor: "#ead3aa",
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    this.contractorLabel.setDepth(76);

    this.mysteriousFigure = this.add.rectangle(CENTER_X + 76, npcY, 34, 42, 0x111111, 1);
    this.mysteriousFigure.setStrokeStyle(2, 0x000000, 1);
    this.mysteriousFigure.setDepth(75);
    this.mysteriousLabel = this.add.text(this.mysteriousFigure.x, this.mysteriousFigure.y - 34, "Sosok Misterius", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#d8d8d8",
      backgroundColor: "#111111",
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    this.mysteriousLabel.setDepth(76);

    this.contractor.setAlpha(0);
    this.contractorLabel.setAlpha(0);
    this.mysteriousFigure.setAlpha(0);
    this.mysteriousLabel.setAlpha(0);

    this.tweens.add({
      targets: [this.contractor, this.contractorLabel, this.mysteriousFigure, this.mysteriousLabel],
      alpha: 1,
      duration: 520,
      ease: "Sine.easeOut",
      onComplete: () => this.startActTwoTrapDialog()
    });
  }

  startActTwoTrapDialog() {
    this.showDialogBox(
      "Kontraktor",
      "Selamat atas pelantikannya, Pak. Kami punya proyek 'Renovasi Kantor & Desa' senilai 500 Juta. Bapak cukup tanda tangan, ambil 200 Juta untuk bapak, sisanya kita pakai bahan bangunan seadanya. Kantor ini jadi bagus lagi, bapak jadi kaya. Deal?",
      "Demi Kemajuan (Terima Suap)",
      () => this.acceptActTwoBribe()
    );
  }

  acceptActTwoBribe() {
    gameState.actTwoProjectAccepted = true;
    this.stopWhisperAmbient();
    this.scene.start("MiniGameLaundering");
  }

  startWhisperAmbient() {
    if (this.whisperAudioContext) {
      if (this.whisperAudioContext.state === "suspended") {
        this.whisperAudioContext.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    try {
      this.whisperAudioContext = new AudioContextClass();
      const oscillator = this.whisperAudioContext.createOscillator();
      const tremolo = this.whisperAudioContext.createOscillator();
      const tremoloGain = this.whisperAudioContext.createGain();
      const gain = this.whisperAudioContext.createGain();

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(82, this.whisperAudioContext.currentTime);
      tremolo.type = "sine";
      tremolo.frequency.setValueAtTime(5.2, this.whisperAudioContext.currentTime);
      tremoloGain.gain.setValueAtTime(0.018, this.whisperAudioContext.currentTime);
      gain.gain.setValueAtTime(0.025, this.whisperAudioContext.currentTime);

      tremolo.connect(tremoloGain);
      tremoloGain.connect(gain.gain);
      oscillator.connect(gain);
      gain.connect(this.whisperAudioContext.destination);
      oscillator.start();
      tremolo.start();
      this.whisperNodes = { oscillator, tremolo, gain };
    } catch (error) {
      this.whisperAudioContext = null;
      this.whisperNodes = null;
    }
  }

  stopWhisperAmbient() {
    if (this.whisperNodes) {
      try {
        this.whisperNodes.oscillator.stop();
        this.whisperNodes.tremolo.stop();
      } catch (error) {
        // Audio nodes may already be stopped during scene shutdown.
      }
      this.whisperNodes = null;
    }

    if (this.whisperAudioContext && this.whisperAudioContext.state !== "closed") {
      this.whisperAudioContext.close();
    }

    this.whisperAudioContext = null;
  }

  startContractorDeal() {
    this.phase = "deal";
    this.showDialogSequence([
      {
        speaker: "Kontraktor",
        text: "Pak, proyek pembangunan jalan desa bisa mulai cepat kalau tanda tangan hari ini."
      },
      {
        speaker: "Kepala Desa",
        text: "Anggarannya besar. Pastikan warga benar-benar mendapat jalan yang layak."
      },
      {
        speaker: "Kontraktor",
        text: "Deal. Kami jalankan proyeknya, laporan administrasi menyusul sesuai kebutuhan."
      },
      {
        speaker: "Kepala Desa",
        text: "Baik. Proyek pembangunan jalan desa disetujui."
      }
    ], () => {
      gameState.act = 2;
      this.spawnMysteriousFigure();
    });
  }

  spawnMysteriousFigure() {
    const appearsBelow = this.player.y < GAME_HEIGHT - 170;
    const shadowX = Phaser.Math.Clamp(this.player.x + 66, 90, GAME_WIDTH - 90);
    const shadowY = Phaser.Math.Clamp(this.player.y + (appearsBelow ? 84 : -84), 110, GAME_HEIGHT - 100);

    this.phase = "mystery";
    this.inputLocked = true;
    this.player.body.setVelocity(0, 0);

    this.mysteriousFigure = this.add.rectangle(shadowX, shadowY, 34, 42, 0x111111, 1);
    this.mysteriousFigure.setAlpha(0);
    this.mysteriousFigure.setStrokeStyle(2, 0x000000, 1);
    this.mysteriousFigure.setDepth(15);

    this.mysteriousLabel = this.add.text(shadowX, shadowY - 34, "Sosok Misterius", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#101010"
    }).setOrigin(0.5);
    this.mysteriousLabel.setDepth(16);

    this.tweens.add({
      targets: this.mysteriousFigure,
      alpha: 1,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 450,
      ease: "Sine.easeOut",
      onComplete: () => this.startMysteriousTemptation()
    });
  }

  startMysteriousTemptation() {
    this.showDialogSequence([
      {
        speaker: "Sosok Misterius",
        text: "Deal selesai. Sekarang ada bagian yang tidak perlu tertulis."
      },
      {
        speaker: "Sosok Misterius",
        text: "Potong sedikit dana proyek. Ubah angka, rapikan laporan, lalu ambil keuntunganmu."
      }
    ], () => {
      this.showDialogBox(
        "Sosok Misterius",
        "Tidak ada jalan kembali setelah tanda tangan itu. Ambil bagianmu.",
        "Ambil bagianmu",
        () => this.acceptCorruptOffer()
      );
    });
  }

  acceptCorruptOffer() {
    gameState.act = 3;
    this.scene.start("MiniGameScene", {
      reward: 100,
      shakeMultiplier: 1
    });
  }

  startSecondBribeScene() {
    this.phase = "secondDeal";
    this.inputLocked = true;
    this.player.body.setVelocity(0, 0);

    this.showDialogSequence([
      {
        speaker: "Kontraktor",
        text: "Pak, proyek lanjutan bisa kita mainkan lagi. Nilainya dua kali lipat dari kemarin."
      },
      {
        speaker: "Kontraktor",
        text: "Bapak cukup rapikan laporan. Bagian bapak juga dua kali lipat."
      },
      {
        speaker: "Kepala Desa",
        text: "Tidak. Warga sudah mulai curiga."
      }
    ], () => {
      this.showDialogBox(
        "Kepala Desa",
        "Aku tidak mau lanjut. Warga sudah terluka karena proyek kemarin.",
        "Tolak",
        () => this.forceSecondBribe()
      );
    });
  }

  forceSecondBribe() {
    this.spawnSecondMysteriousFigure();
    this.showDialogSequence([
      {
        speaker: "Sosok Misterius",
        text: "Sudah terlambat untuk berhenti. Kamu sudah masuk dalam permainan ini."
      },
      {
        speaker: "Sosok Misterius",
        text: "Angkanya lebih besar. Ketakutanmu juga."
      }
    ], () => {
      gameState.act = 5;
      this.scene.start("MiniGameAct2");
    });
  }

  spawnSecondMysteriousFigure() {
    if (this.mysteriousFigure) {
      return;
    }

    const shadowX = OFFICE_RIGHT - 118;
    const shadowY = OFFICE_TOP + 242;
    this.mysteriousFigure = this.add.rectangle(shadowX, shadowY, 34, 42, 0x111111, 1);
    this.mysteriousFigure.setStrokeStyle(2, 0x000000, 1);
    this.mysteriousFigure.setDepth(15);

    this.mysteriousLabel = this.add.text(shadowX, shadowY - 34, "Sosok Misterius", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#101010"
    }).setOrigin(0.5);
    this.mysteriousLabel.setDepth(16);
  }

  createPostMiniGameChanges() {
    if (this.secondReturn) {
      this.startFirstTermEndingSequence();
      return;
    }

    this.phase = "postReturn";
    this.playerSpeed = 110;
    this.createVisualWealth();
    this.createExitDoor();
    this.createSecretaryEntrance();
  }

  createVisualWealth() {
    const bagX = OFFICE_LEFT + 96;
    const bagY = OFFICE_BOTTOM - 68;

    this.add.rectangle(bagX, bagY, 68, 42, 0x2d1d0f, 1).setStrokeStyle(3, 0x1a1209, 1);
    this.add.circle(bagX - 28, bagY - 10, 15, 0xd7ab36, 1).setStrokeStyle(2, 0x80611b, 1);
    this.add.circle(bagX - 2, bagY - 20, 17, 0xf2c94c, 1).setStrokeStyle(2, 0x80611b, 1);
    this.add.circle(bagX + 24, bagY - 8, 15, 0xd7ab36, 1).setStrokeStyle(2, 0x80611b, 1);
    this.add.text(bagX, bagY + 42, "Tas Uang", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#3f2815"
    }).setOrigin(0.5);
  }

  createExitDoor() {
    const doorY = OFFICE_BOTTOM - 36;

    this.add.rectangle(CENTER_X, doorY, 150, 72, 0x4e3828, 1);
    this.add.rectangle(CENTER_X, doorY, 150, 72).setStrokeStyle(4, 0x2a1c13, 1);
    this.add.circle(CENTER_X + 48, doorY, 5, 0xf1d36a, 1);
    this.add.text(CENTER_X, doorY - 52, "Pintu Keluar", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#3f2815"
    }).setOrigin(0.5);

    this.exitDoorZone = new Phaser.Geom.Rectangle(CENTER_X - 90, doorY - 74, 180, 112);
  }

  createSecretaryEntrance() {
    this.inputLocked = true;
    this.secretary = this.add.rectangle(OFFICE_LEFT + 52, this.player.y + 8, 34, 42, 0x7a4db4, 1);
    this.secretaryLabel = this.add.text(this.secretary.x, this.secretary.y - 34, "Sekretaris", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#301b52"
    }).setOrigin(0.5);

    this.time.delayedCall(350, () => {
      this.tweens.add({
        targets: this.secretary,
        x: this.player.x - 82,
        y: this.player.y,
        duration: 1200,
        ease: "Sine.easeInOut",
        onComplete: () => this.startSecretaryDialog()
      });
    });
  }

  startSecretaryDialog() {
    this.showDialogSequence([
      {
        speaker: "Sekretaris",
        text: "Pak, ini laporan proyeknya sudah jalan, tapi kontraktor bilang semennya dikurangi kualitasnya agar bapak dapat jatah. Warga mulai mengeluh jalannya agak retak."
      }
    ], () => {
      this.phase = "exit";
      this.exitUnlocked = true;
      this.interactionText.setText("Berjalan ke Pintu Keluar");
    });
  }

  createSecondReportEntrance() {
    this.inputLocked = true;
    this.secretary = this.add.rectangle(OFFICE_LEFT + 58, this.player.y + 12, 36, 44, 0x355f8c, 1);
    this.secretaryLabel = this.add.text(this.secretary.x, this.secretary.y - 34, "Bendahara", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#17304a"
    }).setOrigin(0.5);

    this.time.delayedCall(350, () => {
      this.tweens.add({
        targets: this.secretary,
        x: this.player.x - 86,
        y: this.player.y,
        duration: 1050,
        ease: "Sine.easeInOut",
        onComplete: () => this.startSecondReportDialog()
      });
    });
  }

  startSecondReportDialog() {
    this.showDialogSequence([
      {
        speaker: "Bendahara",
        text: "Pak, laporan lanjutan sudah masuk. Angkanya memang rapi, tapi keluhan warga makin banyak."
      },
      {
        speaker: "Bendahara",
        text: "Ada surat dari kecamatan. Mereka minta bukti material, foto lapangan, dan tanda tangan warga."
      },
      {
        speaker: "Kepala Desa",
        text: "Simpan dulu. Jangan sampai ada yang melihat sebelum aku siap."
      }
    ], () => {
      this.phase = "exit";
      this.exitUnlocked = true;
      this.interactionText.setText("Berjalan ke Pintu Keluar");
    });
  }

  startFirstTermEndingSequence() {
    this.termEndingStarted = true;
    this.inputLocked = true;
    this.phase = "termEnding";
    this.playerSpeed = 0;

    if (this.player && this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
    }

    if (this.interactionText) {
      this.interactionText.setText("");
    }

    this.cameras.main.shake(900, 0.008);
    this.endOverlay = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x7a1010, 0);
    this.endOverlay.setDepth(130);
    this.endOverlay.setScrollFactor(0);

    this.tweens.add({
      targets: this.endOverlay,
      alpha: 0.34,
      duration: 2400,
      ease: "Sine.easeInOut"
    });

    const grayOverlay = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x6f6f6f, 0);
    grayOverlay.setDepth(129);
    grayOverlay.setScrollFactor(0);
    this.tweens.add({
      targets: grayOverlay,
      alpha: 0.22,
      duration: 2600,
      ease: "Sine.easeInOut"
    });

    this.time.delayedCall(450, () => {
      this.spawnStarvingOfficeHallucinations();
    });
  }

  spawnStarvingOfficeHallucinations() {
    const positions = [
      [OFFICE_LEFT + 120, OFFICE_TOP + 170],
      [OFFICE_RIGHT - 130, OFFICE_TOP + 185],
      [OFFICE_LEFT + 145, OFFICE_BOTTOM - 150],
      [OFFICE_RIGHT - 150, OFFICE_BOTTOM - 140],
      [CENTER_X, OFFICE_TOP + 122]
    ];

    const count = Phaser.Math.Between(3, 5);
    positions.slice(0, count).forEach(([x, y], index) => {
      const villager = this.createStarvingOfficeVillager(x, y, index);
      villager.setAlpha(0);
      this.tweens.add({
        targets: villager,
        alpha: 0.92,
        duration: 120,
        ease: "Sine.easeOut",
        onComplete: () => {
          this.tweens.add({
            targets: villager,
            x: this.player.x + Phaser.Math.Between(-18, 18),
            y: this.player.y + Phaser.Math.Between(-10, 18),
            duration: 2200 + (index * 160),
            ease: "Sine.easeIn",
            onComplete: () => this.startArrestNarration()
          });
        }
      });
    });
  }

  createStarvingOfficeVillager(x, y, index) {
    const villager = this.add.container(x, y);
    villager.setDepth(150 + index);

    const body = this.add.rectangle(0, 22, 28, 62, index % 2 === 0 ? 0x3a3638 : 0x303836, 1);
    const head = this.add.circle(0, -24, 18, 0xded8ce, 1).setStrokeStyle(2, 0x6d6a68, 1);
    const leftEye = this.add.circle(-7, -29, 3, 0x1d1a1a, 1);
    const rightEye = this.add.circle(7, -29, 3, 0x1d1a1a, 1);
    const mouth = this.add.arc(0, -14, 8, 0, 180, false, 0x2a2222, 1).setScale(1, 0.45);
    const ribs = this.add.container(0, 8);
    for (let rib = 0; rib < 3; rib += 1) {
      ribs.add(this.add.line(0, 0, -9, rib * 8, 9, rib * 8, 0xb8afa8, 0.82).setLineWidth(2));
    }
    const armLeft = this.add.rectangle(-24, 10, 8, 48, 0xbdb7b1, 1).setRotation(-0.28);
    const armRight = this.add.rectangle(24, 10, 8, 48, 0xbdb7b1, 1).setRotation(0.28);
    const bowl = this.add.ellipse(0, 62, 36, 12, 0x211b19, 1).setStrokeStyle(2, 0x65534a, 1);
    const label = this.add.text(0, 84, index % 2 === 0 ? "Lapar..." : "Pak...", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#eadfd6",
      backgroundColor: "#171112",
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);

    villager.add([body, ribs, armLeft, armRight, head, leftEye, rightEye, mouth, bowl, label]);
    return villager;
  }

  startArrestNarration() {
    if (this.arrestNarrationStarted) {
      return;
    }

    this.arrestNarrationStarted = true;
    this.cameras.main.shake(700, 0.014);
    this.createPoliceLights();
    this.showNarrationSequence([
      "Halusinasi warga kelaparan memenuhi kantor desa.",
      "Kepala Desa Pertama jatuh terduduk dan berteriak: 'Saya yang mengambil uang itu... saya korupsi!'",
      "Polisi datang setelah mendengar pengakuannya di kantor desa.",
      `Korupsi senilai ${gameState.wealth} ditemukan. Dia resmi dicopot dan ditangkap.`
    ], () => this.startActTwo());
  }

  createPoliceLights() {
    const redLight = this.add.rectangle(CENTER_X - (GAME_WIDTH * 0.25), CENTER_Y, GAME_WIDTH / 2, GAME_HEIGHT, 0xff1028, 0);
    const blueLight = this.add.rectangle(CENTER_X + (GAME_WIDTH * 0.25), CENTER_Y, GAME_WIDTH / 2, GAME_HEIGHT, 0x1b5cff, 0);
    redLight.setDepth(210);
    blueLight.setDepth(211);
    redLight.setScrollFactor(0);
    blueLight.setScrollFactor(0);

    this.tweens.add({
      targets: redLight,
      alpha: 0.28,
      duration: 180,
      yoyo: true,
      repeat: 14
    });

    this.tweens.add({
      targets: blueLight,
      alpha: 0.24,
      duration: 180,
      delay: 90,
      yoyo: true,
      repeat: 14
    });

    this.playArrestSiren();
  }

  playArrestSiren() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    let audioContext;
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      return;
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, now);
    oscillator.frequency.linearRampToValueAtTime(760, now + 0.38);
    oscillator.frequency.linearRampToValueAtTime(440, now + 0.76);
    oscillator.frequency.linearRampToValueAtTime(760, now + 1.14);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 1.4);
    this.time.delayedCall(1700, () => {
      if (audioContext.state !== "closed") {
        audioContext.close();
      }
    });
  }

  showNarrationSequence(lines, onComplete) {
    const backdrop = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x08080a, 0.72);
    backdrop.setDepth(220);
    backdrop.setScrollFactor(0);

    const narrationText = this.add.text(CENTER_X, CENTER_Y, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: Math.min(920, GAME_WIDTH - 100) },
      lineSpacing: 8
    }).setOrigin(0.5);
    narrationText.setDepth(221);
    narrationText.setScrollFactor(0);

    lines.forEach((line, index) => {
      this.time.delayedCall(index * 2500, () => {
        narrationText.setText(line);
        narrationText.setAlpha(0);
        this.tweens.add({
          targets: narrationText,
          alpha: 1,
          duration: 350
        });
      });
    });

    this.time.delayedCall((lines.length * 2500) + 700, () => {
      if (onComplete) {
        onComplete();
      }
    });
  }

  startActTwo() {
    gameState.act = 2;
    gameState.integrity = 30;
    gameState.leader = 2;
    gameState.actTwoProjectAccepted = false;
    gameState.actTwoOfficeLuxury = false;
    gameState.actTwoLedgerDone = false;
    gameState.sanityGlitched = false;
    gameState.integrityGlitched = false;
    gameState.actThreeStarted = false;
    this.updateStatusUi();

    this.cameras.main.fadeOut(1200, 12, 12, 16);
    this.time.delayedCall(1300, () => {
      this.scene.start("ScenePelantikan");
    });
  }

  handleExitTrigger() {
    if (
      !this.returningFromMiniGame ||
      !this.exitUnlocked ||
      this.inputLocked ||
      this.phase !== "exit" ||
      !this.exitDoorZone
    ) {
      return;
    }

    if (Phaser.Geom.Rectangle.Contains(this.exitDoorZone, this.player.x, this.player.y + 20)) {
      this.phase = "leaving";
      this.inputLocked = true;
      this.player.body.setVelocity(0, 0);
      this.interactionText.setText("Keluar ke desa...");
      this.playHeavyFootstep();
      this.cameras.main.fadeOut(900, 12, 10, 26);
      this.time.delayedCall(950, () => {
        this.scene.start("SceneDesa", {
          secondDay: this.secondReturn,
          startAtOffice: true
        });
      });
    }
  }

  updateHeavyFootsteps(time) {
    if (!this.returningFromMiniGame || this.inputLocked || this.phase !== "exit" || !this.player.body) {
      return;
    }

    const isMoving = Math.abs(this.player.body.velocity.x) > 5 || Math.abs(this.player.body.velocity.y) > 5;
    if (!isMoving || time < this.nextFootstepAt) {
      return;
    }

    this.playHeavyFootstep();
    this.nextFootstepAt = time + 680;
  }

  ensureFootstepAudio() {
    if (this.footstepAudioContext) {
      if (this.footstepAudioContext.state === "suspended") {
        this.footstepAudioContext.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    this.footstepAudioContext = new AudioContextClass();
    if (this.footstepAudioContext.state === "suspended") {
      this.footstepAudioContext.resume();
    }
  }

  playHeavyFootstep() {
    this.ensureFootstepAudio();

    if (!this.footstepAudioContext || this.footstepAudioContext.state !== "running") {
      return;
    }

    const now = this.footstepAudioContext.currentTime;
    const oscillator = this.footstepAudioContext.createOscillator();
    const gain = this.footstepAudioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(58, now);
    oscillator.frequency.exponentialRampToValueAtTime(34, now + 0.18);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

    oscillator.connect(gain);
    gain.connect(this.footstepAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.28);
  }

  shutdownSceneSiang() {
    this.stopWhisperAmbient();
    this.input.keyboard.off("keydown", this.handleLedgerKeyMash, this);
    this.input.off("pointerdown", this.handleGoldenPrisonPointer, this);
    this.stopLedgerAudio();
    this.stopRiotAudio();

    if (this.ledgerRainTimer) {
      this.ledgerRainTimer.remove(false);
      this.ledgerRainTimer = null;
    }

    if (this.wealthGrowthTimer) {
      this.wealthGrowthTimer.remove(false);
      this.wealthGrowthTimer = null;
    }

    if (this.phoneRingTimer) {
      this.phoneRingTimer.remove(false);
      this.phoneRingTimer = null;
    }

    if (this.footstepAudioContext && this.footstepAudioContext.state !== "closed") {
      this.footstepAudioContext.close();
    }
  }

  showDialogSequence(dialogs, onComplete) {
    this.inputLocked = true;
    this.player.body.setVelocity(0, 0);
    this.interactionText.setText("");

    this.dialogQueue = dialogs;
    this.dialogIndex = 0;
    this.dialogOnComplete = onComplete;
    this.dialogWaitingForChoice = false;
    this.showNextDialog();
  }

  handleDialogAdvance() {
    if (
      !this.dialogContainer ||
      this.dialogWaitingForChoice ||
      !this.dialogAdvanceReady
    ) {
      return;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.interact) ||
      Phaser.Input.Keyboard.JustDown(this.keys.continueDialog)
    ) {
      this.showNextDialog();
    }
  }

  showNextDialog() {
    if (this.dialogIndex >= this.dialogQueue.length) {
      const onComplete = this.dialogOnComplete;
      this.closeDialogBox();
      this.dialogQueue = [];
      this.dialogIndex = 0;
      this.dialogOnComplete = null;
      this.dialogAdvanceReady = false;
      this.inputLocked = false;

      if (onComplete) {
        onComplete();
      }

      return;
    }

    const dialog = this.dialogQueue[this.dialogIndex];
    this.dialogIndex += 1;
    this.dialogAdvanceReady = false;
    this.showDialogBox(dialog.speaker, dialog.text);
    this.time.delayedCall(120, () => {
      this.dialogAdvanceReady = true;
    });
  }

  showDialogBox(speaker, text, buttonText, onButtonClick) {
    this.closeDialogBox();

    this.dialogContainer = this.add.container(0, 0);
    this.dialogContainer.setDepth(120);

    const panelWidth = Math.min(900, GAME_WIDTH - 80);
    const panelHeight = 210;
    const panelY = GAME_HEIGHT - 148;
    const panelLeft = CENTER_X - (panelWidth / 2);
    const panelRight = CENTER_X + (panelWidth / 2);
    const contentLeft = panelLeft + 30;

    const panel = this.add.rectangle(CENTER_X, panelY, panelWidth, panelHeight, 0x111820, 0.96);
    panel.setStrokeStyle(2, 0xffffff, 0.35);

    const speakerText = this.add.text(contentLeft, GAME_HEIGHT - 228, speaker, {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: speaker === "Sosok Misterius" ? "#d2d2d2" : "#ffcf7a"
    });

    const bodyText = this.add.text(contentLeft, GAME_HEIGHT - 194, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: panelWidth - 60 }
    });

    this.dialogContainer.add([panel, speakerText, bodyText]);

    if (!buttonText) {
      const continueText = this.add.text(panelRight - 30, GAME_HEIGHT - 64, "Tekan E / Spasi", {
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        color: "#c7d0df"
      }).setOrigin(1, 0.5);

      this.dialogContainer.add(continueText);
      return;
    }

    this.inputLocked = true;
    this.dialogWaitingForChoice = true;

    const buttonWidth = Math.min(panelWidth - 80, Math.max(210, (buttonText.length * 9) + 42));
    const button = this.add.rectangle(CENTER_X, GAME_HEIGHT - 64, buttonWidth, 44, 0xffbf47, 1);
    button.setStrokeStyle(2, 0x5a3a0b, 0.5);
    button.setInteractive({ useHandCursor: true });

    const label = this.add.text(CENTER_X, GAME_HEIGHT - 64, buttonText, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#1a1307"
    }).setOrigin(0.5);

    button.on("pointerover", () => button.setFillStyle(0xffd37a));
    button.on("pointerout", () => button.setFillStyle(0xffbf47));
    button.on("pointerdown", () => {
      button.disableInteractive();
      this.dialogWaitingForChoice = false;
      onButtonClick();
    });

    this.dialogContainer.add([button, label]);
  }

  closeDialogBox() {
    if (!this.dialogContainer) {
      return;
    }

    this.dialogContainer.destroy();
    this.dialogContainer = null;
  }
}

class SceneDesa extends BaseScene {
  constructor() {
    super("SceneDesa");
    this.playerSpeed = 105;
    this.nextFootstepAt = 0;
    this.footstepAudioContext = null;
    this.enteringHome = false;
    this.enteringOffice = false;
    this.inputLocked = false;
    this.secondDay = false;
    this.actThreeStart = false;
    this.startAtHome = false;
    this.startAtOffice = false;
    this.villageDialogQueue = [];
    this.villageDialogIndex = 0;
    this.villageDialogAdvanceReady = false;
    this.villageDialogOnComplete = null;
  }

  preload() {
    this.loadPlayerAssets();
    this.loadVillageAssets();
  }

  create(data) {
    this.playerSpeed = 105;
    this.mapWidth = 2200;
    this.mapHeight = 1400;
    this.nextFootstepAt = 0;
    this.enteringHome = false;
    this.enteringOffice = false;
    this.inputLocked = false;
    this.secondDay = Boolean(data && data.secondDay);
    this.actThreeStart = Boolean(data && data.actThreeStart);
    this.startAtHome = Boolean(data && data.startAtHome);
    this.startAtOffice = Boolean(data && data.startAtOffice);
    this.villageDialogQueue = [];
    this.villageDialogIndex = 0;
    this.villageDialogAdvanceReady = false;
    this.villageDialogOnComplete = null;
    this.cameras.main.setBackgroundColor("#6d8f69");

    this.createVillageMap();
    this.createVillagePlayer();
    this.createVillageControls();
    this.createStatusUi();
    this.createVillagePrompt();
    this.setupVillageCamera();
    this.events.once("shutdown", this.shutdownVillageScene, this);
  }

  createVillageMap() {
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    if (this.actThreeStart) {
      this.createActThreeSettlementMap();
      return;
    }

    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x0f5d8f, 1);
    this.addTileArea("waterDay", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 1, { tileScale: 3.2 });
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 150, this.mapHeight - 120, 0x8bd448, 1)
      .setStrokeStyle(10, 0x1f7147, 1);
    this.addTileArea("grassDay", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 170, this.mapHeight - 140, 2, { tileScale: 3.2 });

    this.add.text(140, 70, "Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#f4f0db"
    }).setOrigin(0.5);

    const editorLayout = this.getSavedVillageEditorLayout();
    if (editorLayout) {
      this.renderVillageEditorLayout(editorLayout);
    } else {
      this.createVillageGroundLayout();
      this.createVillageDecorationDetails();
      this.createVillageBuildings();
      this.addVillageTrees();
    }

    if (this.secondDay) {
      this.createDamagedRoadProject();
      this.createComplainingVillager();
    }
  }

  getSavedVillageEditorLayout() {
    if (!window.localStorage) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem("villageLayout.v1");
      if (!raw) {
        return null;
      }

      const layout = JSON.parse(raw);
      if (!layout || !Array.isArray(layout.objects) || layout.objects.length === 0) {
        return null;
      }

      return layout;
    } catch (error) {
      return null;
    }
  }

  renderVillageEditorLayout(layout) {
    const objects = [...layout.objects].sort((a, b) => (a.depth || 0) - (b.depth || 0));
    objects.forEach((object) => {
      this.addVillageAsset(object.key, object.x, object.y, object.scale || 1, object.depth || 10, {
        alpha: object.alpha === undefined ? 1 : object.alpha,
        rotation: object.rotation || 0,
        flipX: Boolean(object.flipX)
      });

      if (object.label) {
        this.add.text(object.x, object.y + ((object.labelOffsetY || 84) * (object.scale || 1)), object.label, {
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          color: "#fff4d4",
          backgroundColor: "#3d2a1e",
          padding: { x: 7, y: 3 }
        }).setOrigin(0.5).setDepth((object.depth || 10) + 30);
      }

      if (object.role === "chiefHome") {
        const scale = object.scale || 1;
        this.homeDoorZone = new Phaser.Geom.Rectangle(object.x - (28 * scale), object.y + (28 * scale), 56 * scale, 54 * scale);
      }

      if (object.role === "officeExit") {
        const scale = object.scale || 1;
        this.officeZone = new Phaser.Geom.Rectangle(object.x - (48 * scale), object.y - (28 * scale), 96 * scale, 70 * scale);
      }
    });

    if (!this.homeDoorZone) {
      this.homeDoorZone = new Phaser.Geom.Rectangle(398, 470, 124, 132);
    }

    if (!this.officeZone) {
      this.officeZone = new Phaser.Geom.Rectangle(152, 1126, 210, 132);
    }
  }

  createVillageGroundLayout() {
    const paths = [
      [840, 850, 1180, 150],
      [1210, 760, 170, 540],
      [370, 1085, 420, 150],
      [1600, 520, 520, 155],
      [1720, 900, 440, 170]
    ];

    paths.forEach(([x, y, width, height]) => {
      this.add.rectangle(x, y, width, height, 0xb76532, 1).setDepth(3);
      this.addTileArea("groundDay", x, y, width - 12, height - 12, 4, { tileScale: 2.7 });
    });

    const plateau = [
      [500, 390, 640, 420],
      [960, 345, 420, 310],
      [1650, 310, 540, 340],
      [520, 965, 520, 310]
    ];

    plateau.forEach(([x, y, width, height]) => {
      this.add.rectangle(x, y, width, height, 0x93db4f, 1).setDepth(5).setStrokeStyle(8, 0x2f7f45, 1);
      this.addTileArea("grassDay", x, y, width - 22, height - 22, 6, { tileScale: 3 });
    });

    const cliffPositions = [
      [320, 620], [450, 620], [580, 620], [710, 620],
      [1660, 502], [1790, 502], [1920, 502],
      [430, 1185], [560, 1185], [690, 1185]
    ];
    cliffPositions.forEach(([x, y], index) => {
      this.addVillageAsset(index % 2 === 0 ? "terrain3Day" : "terrain4Day", x, y, 2.35, 7);
    });

    this.addVillageAsset("stairsDay", 500, 660, 2.35, 9);
    this.addVillageAsset("bridgeDay", 250, 1182, 2, 9);
    this.officeZone = new Phaser.Geom.Rectangle(152, 1126, 210, 132);
  }

  createVillageDecorationDetails() {
    const fencePoints = [
      [230, 210], [230, 286], [230, 362], [230, 438],
      [635, 210], [710, 210], [785, 210], [860, 210],
      [1510, 140], [1585, 140], [1660, 140], [1735, 140], [1810, 140], [1885, 140],
      [1470, 452], [1545, 452], [1620, 452],
      [1840, 452], [1915, 452], [1990, 452],
      [1580, 1240], [1655, 1240], [1730, 1240], [1805, 1240], [1880, 1240]
    ];
    fencePoints.forEach(([x, y], index) => {
      this.addVillageAsset(index % 2 === 0 ? "fence1Day" : "fence2Day", x, y, 2.4, 12);
    });

    const groundDetails = [
      [430, 850], [640, 890], [870, 930], [1110, 875], [1420, 850], [1680, 585],
      [1785, 620], [1920, 760], [1540, 1010], [1750, 990], [520, 1115], [760, 1060]
    ];
    groundDetails.forEach(([x, y], index) => {
      this.addVillageAsset(["groundDetail1Day", "groundDetail2Day", "groundDetail3Day"][index % 3], x, y, 2.25, 11, {
        rotation: Phaser.Math.FloatBetween(-0.18, 0.18)
      });
    });

    const flowerSpots = [
      [815, 440], [870, 535], [1010, 520], [1090, 410], [1500, 262],
      [1730, 250], [1905, 300], [1830, 1115], [1920, 1110], [1985, 1180]
    ];
    flowerSpots.forEach(([x, y], index) => {
      this.addVillageAsset(["grassDetail1Day", "grassDetail2Day", "grassDetail3Day"][index % 3], x, y, 2.2, 13);
    });

    this.addVillageAsset("pitDay", 1800, 326, 2.15, 12);
    this.addVillageAsset("waterDay", 1800, 326, 2.8, 11, { alpha: 0.8 });
  }

  createVillageBuildings() {
    this.addVillageAsset("house2Day", 460, 382, 2.8, 18);
    this.add.text(460, 596, "Rumah Kepala Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#f4e5ca",
      backgroundColor: "#3d2a1e",
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(40);
    this.homeDoorZone = new Phaser.Geom.Rectangle(398, 470, 124, 132);

    this.addVillageAsset("house1Day", 915, 360, 2.05, 18, { flipX: true });
    this.add.text(915, 510, "Warung", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#fff4d4",
      backgroundColor: "#4b351f",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(40);

    this.addVillageAsset("house1Day", 555, 1005, 2.05, 18);
    this.add.text(555, 1156, "Balai Warga", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#ecf4ff",
      backgroundColor: "#34414a",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(40);

    this.addVillageAsset("house1Day", 1510, 305, 1.9, 18);
    this.add.text(1510, 444, "Rumah Warga", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#f2e2c5",
      backgroundColor: "#3d2a1e",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(40);

    this.addVillageAsset("house2Day", 1980, 308, 1.8, 18, { flipX: true });
    this.add.text(1980, 452, "Gudang", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#fff0c7",
      backgroundColor: "#4a3720",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(40);

    this.add.text(250, 1118, "Arah Kantor Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#efe5d1",
      backgroundColor: "#4e3828",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(40);
  }

  createActThreeSettlementMap() {
    this.cameras.main.setBackgroundColor("#191514");
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x2a2420, 1);
    this.addTileArea("grassNight", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 1, {
      tileScale: 2.4,
      tint: 0x4c4038
    });
    this.add.rectangle(this.mapWidth / 2, 730, this.mapWidth - 160, 128, 0x403a36, 1)
      .setStrokeStyle(3, 0x181413, 1);
    this.addTileArea("groundNight", this.mapWidth / 2, 730, this.mapWidth - 160, 128, 2, {
      tileScale: 2.1,
      tint: 0x5b514b
    });
    this.add.rectangle(1120, 720, 110, this.mapHeight - 220, 0x39332f, 1)
      .setStrokeStyle(3, 0x181413, 1);
    this.addTileArea("groundNight", 1120, 720, 110, this.mapHeight - 220, 2, {
      tileScale: 2.1,
      tint: 0x514842
    });

    this.add.text(180, 72, "Pemukiman Warga", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#d6c8b8"
    }).setOrigin(0.5);

    const houses = [
      [330, 386, 0x3d3028, 0x17110f, "Rumah Kosong"],
      [820, 454, 0x342a25, 0x130f0d, "Dapur Umum"],
      [1390, 1034, 0x302622, 0x0d0a09, "Gudang Terbakar"],
      [1710, 418, 0x3b2d27, 0x140f0d, "Rumah Retak"]
    ];

    houses.forEach(([x, y, wallColor, roofColor, label]) => {
      this.add.rectangle(x, y, 250, 150, wallColor, 1).setStrokeStyle(4, 0x0b0908, 1);
      this.add.triangle(x, y - 112, 0, -56, -148, 62, 148, 62, roofColor, 1);
      this.addVillageAsset(label === "Dapur Umum" ? "house2Night" : "house1Night", x, y - 4, label === "Dapur Umum" ? 1.58 : 1.72, 6, {
        tint: 0x7a6c62
      });
      this.add.line(0, 0, x - 92, y - 42, x + 84, y + 48, 0x080606, 1).setLineWidth(4);
      this.add.circle(x + 68, y + 26, 22, 0x080606, 0.86);
      this.add.text(x, y + 100, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        color: "#dbcab6",
        backgroundColor: "#181211",
        padding: { x: 7, y: 3 }
      }).setOrigin(0.5);
    });

    for (let index = 0; index < 18; index += 1) {
      const x = 260 + ((index * 137) % 1700);
      const y = 610 + ((index * 79) % 610);
      this.addVillageAsset(index % 2 === 0 ? "pitNight" : "groundDetail1Day", x, y, index % 2 === 0 ? 1.25 : 1.6, 4, {
        tint: 0x2c2522,
        rotation: Phaser.Math.FloatBetween(-0.4, 0.4)
      });
      this.add.circle(x, y, Phaser.Math.Between(12, 26), 0x151110, 0.86);
      this.add.rectangle(x + 10, y - 22, Phaser.Math.Between(28, 60), 8, 0x2d2521, 1).setRotation(Phaser.Math.FloatBetween(-0.7, 0.7));
    }

    for (let index = 0; index < 12; index += 1) {
      const x = 520 + (index * 84);
      const y = 814 + ((index % 3) * 46);
      this.add.circle(x, y - 25, 14, 0xb49a86, 1).setStrokeStyle(2, 0x1a1210, 1);
      this.add.rectangle(x, y + 8, 28, 52, 0x433a36, 1).setStrokeStyle(2, 0x151110, 1);
      this.add.rectangle(x - 5, y - 29, 4, 3, 0x241512, 1);
      this.add.rectangle(x + 5, y - 29, 4, 3, 0x241512, 1);
      this.add.rectangle(x, y - 15, 16, 3, 0x3b1717, 1);
    }

    this.add.text(1040, 676, "Mereka menunggu jawaban, bukan janji.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      color: "#f0e4d6",
      backgroundColor: "#17110f",
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5);
  }

  createDamagedRoadProject() {
    this.add.rectangle(780, 730, 360, 82, 0x5e554c, 0.85).setStrokeStyle(3, 0x3b342e, 1);
    this.add.text(780, 668, "Jalan Rusak", {
      fontFamily: "Arial, sans-serif",
      fontSize: "17px",
      color: "#fff1cf",
      backgroundColor: "#5b2e2e",
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5);

    const potholes = [
      [680, 726, 38, 18], [765, 748, 56, 22], [884, 716, 44, 20], [934, 758, 34, 16]
    ];

    potholes.forEach(([x, y, width, height]) => {
      this.add.ellipse(x, y, width, height, 0x282421, 1).setStrokeStyle(2, 0x181513, 1);
    });
  }

  createComplainingVillager() {
    const x = 700;
    const y = 650;
    this.complainingVillager = this.add.container(x, y);
    const body = this.add.rectangle(0, 20, 34, 58, 0x465a4d, 1);
    const head = this.add.circle(0, -24, 18, 0xd8b28d, 1).setStrokeStyle(2, 0x6b4d3b, 1);
    const eyeLeft = this.add.circle(-6, -28, 2, 0x1d1511, 1);
    const eyeRight = this.add.circle(6, -28, 2, 0x1d1511, 1);
    const mouth = this.add.rectangle(0, -15, 16, 3, 0x3b1717, 1);
    this.complainingVillager.add([body, head, eyeLeft, eyeRight, mouth]);
    this.complainingVillager.setDepth(20);

    this.complainingVillagerLabel = this.add.text(x, y - 70, "Warga", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#24331f",
      backgroundColor: "#f6e5c8",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5);
  }

  addVillageTrees() {
    const treePositions = [
      [160, 160], [620, 250], [1240, 210], [2050, 260],
      [210, 620], [720, 610], [1510, 645], [2020, 790],
      [170, 980], [860, 1000], [1640, 1080], [2000, 1240]
    ];

    treePositions.forEach(([x, y], index) => {
      const treeKey = ["tree1Day", "tree2Day", "tree3Day"][index % 3];
      this.addVillageAsset(treeKey, x, y + 14, 1.55, 7);
      this.add.rectangle(x, y + 22, 18, 46, 0x5c3a1f, 1);
      this.add.circle(x, y, 34, 0x2f6f36, 1);
      this.add.circle(x - 24, y + 14, 26, 0x3c8040, 1);
      this.add.circle(x + 24, y + 14, 26, 0x2d6634, 1);
    });

    for (let index = 0; index < 24; index += 1) {
      const key = ["grassDetail1Day", "grassDetail2Day", "grassDetail3Day"][index % 3];
      const x = 120 + ((index * 181) % (this.mapWidth - 220));
      const y = 150 + ((index * 97) % (this.mapHeight - 260));
      this.addVillageAsset(key, x, y, 1.5, 3, { alpha: 0.85 });
    }
  }

  createVillagePlayer() {
    const startX = this.actThreeStart ? 240 : this.startAtHome ? 460 : 240;
    const startY = this.actThreeStart ? 1118 : this.startAtHome ? 650 : 1118;
    this.player = this.createPlayerSprite(startX, startY);
    this.player.body.setCollideWorldBounds(true);

    this.playerLabel = this.add.text(this.player.x, this.getPlayerLabelY(this.player), this.actThreeStart ? "Kepala Desa III" : "Kepala Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#e7f0ff"
    }).setOrigin(0.5);
  }

  createVillageControls() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });
  }

  createVillagePrompt() {
    this.promptText = this.add.text(CENTER_X, GAME_HEIGHT - 40, this.actThreeStart ? "Berjalan ke pemukiman warga." : "Cari Rumah Kepala Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#24331f",
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5);
    this.promptText.setDepth(110);
    this.promptText.setScrollFactor(0);
  }

  setupVillageCamera() {
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(160, 110);
  }

  update(time, delta) {
    super.update(time, delta);
    this.updateVillageMovement();
    this.updateVillagePrompt();
    this.updateVillageFootsteps(time);
    this.handleVillageDialogAdvance();
    this.handleVillagerComplaint();
    this.handleOfficeEntry();
    this.handleHomeEntry();
  }

  updateVillageMovement() {
    if (this.enteringHome || this.enteringOffice || this.inputLocked) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.left.isDown) {
      velocityX -= 1;
    }

    if (this.keys.right.isDown) {
      velocityX += 1;
    }

    if (this.keys.up.isDown) {
      velocityY -= 1;
    }

    if (this.keys.down.isDown) {
      velocityY += 1;
    }

    if (velocityX !== 0 || velocityY !== 0) {
      const length = Math.sqrt((velocityX * velocityX) + (velocityY * velocityY));
      velocityX = (velocityX / length) * this.playerSpeed;
      velocityY = (velocityY / length) * this.playerSpeed;
    }

    this.player.body.setVelocity(velocityX, velocityY);
    this.updatePlayerAnimation(this.player);
    this.playerLabel.setPosition(this.player.x, this.getPlayerLabelY(this.player));
  }

  updateVillagePrompt() {
    if (this.enteringHome || this.enteringOffice || this.inputLocked) {
      return;
    }

    if (this.actThreeStart) {
      this.promptText.setText("Pemukiman menatap tanpa suara.");
      return;
    }

    if (this.secondDay) {
      if (this.isNearComplainingVillager()) {
        this.promptText.setText("Tekan E untuk bicara dengan Warga");
        return;
      }

      if (this.isNearOfficeZone()) {
        this.promptText.setText("Tekan E menuju Kantor Desa");
        return;
      }

      this.promptText.setText("Pergi ke Kantor Desa");
      return;
    }

    if (this.isNearHomeDoor()) {
      this.promptText.setText("Tekan E untuk masuk rumah");
      return;
    }

    this.promptText.setText("Cari Rumah Kepala Desa");
  }

  handleHomeEntry() {
    if (
      this.secondDay ||
      this.actThreeStart ||
      this.enteringHome ||
      !this.isNearHomeDoor() ||
      !Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      return;
    }

    this.enteringHome = true;
    this.player.body.setVelocity(0, 0);
    this.promptText.setText("Masuk rumah...");
    this.playVillageFootstep();
    this.cameras.main.fadeOut(700, 18, 14, 10);
    this.time.delayedCall(760, () => {
      this.scene.start("SceneRumah");
    });
  }

  handleVillagerComplaint() {
    if (
      !this.secondDay ||
      this.actThreeStart ||
      this.inputLocked ||
      !this.isNearComplainingVillager() ||
      !Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      return;
    }

    this.showVillageDialogSequence([
      { speaker: "Warga", text: "Jalannya sudah retak, Pak!" },
      { speaker: "Warga", text: "Anak saya jatuh karena lubang proyek bapak!" }
    ], () => {
      this.promptText.setText("Pergi ke Kantor Desa");
    });
  }

  handleOfficeEntry() {
    if (
      !this.secondDay ||
      this.actThreeStart ||
      this.enteringOffice ||
      this.inputLocked ||
      !this.isNearOfficeZone() ||
      !Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      return;
    }

    this.enteringOffice = true;
    this.player.body.setVelocity(0, 0);
    this.promptText.setText("Menuju Kantor Desa...");
    this.playVillageFootstep();
    this.cameras.main.fadeOut(700, 18, 14, 10);
    this.time.delayedCall(760, () => {
      this.scene.start("SceneSiang", {
        secondBribe: true
      });
    });
  }

  isNearHomeDoor() {
    return Phaser.Geom.Rectangle.Contains(this.homeDoorZone, this.player.x, this.player.y);
  }

  isNearOfficeZone() {
    return this.officeZone && Phaser.Geom.Rectangle.Contains(this.officeZone, this.player.x, this.player.y);
  }

  isNearComplainingVillager() {
    if (!this.complainingVillager) {
      return false;
    }

    return Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.complainingVillager.x,
      this.complainingVillager.y
    ) < 95;
  }

  showVillageDialogSequence(dialogs, onComplete) {
    this.inputLocked = true;
    this.player.body.setVelocity(0, 0);
    this.villageDialogQueue = dialogs;
    this.villageDialogIndex = 0;
    this.villageDialogOnComplete = onComplete;
    this.showNextVillageDialog();
  }

  handleVillageDialogAdvance() {
    if (!this.villageDialogContainer || !this.villageDialogAdvanceReady) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
      this.showNextVillageDialog();
    }
  }

  showNextVillageDialog() {
    if (this.villageDialogIndex >= this.villageDialogQueue.length) {
      const onComplete = this.villageDialogOnComplete;
      this.closeVillageDialogBox();
      this.villageDialogQueue = [];
      this.villageDialogIndex = 0;
      this.villageDialogAdvanceReady = false;
      this.villageDialogOnComplete = null;
      this.inputLocked = false;

      if (onComplete) {
        onComplete();
      }

      return;
    }

    const dialog = this.villageDialogQueue[this.villageDialogIndex];
    this.villageDialogIndex += 1;
    this.villageDialogAdvanceReady = false;
    this.showVillageDialogBox(dialog.speaker, dialog.text);
    this.time.delayedCall(140, () => {
      this.villageDialogAdvanceReady = true;
    });
  }

  showVillageDialogBox(speaker, text) {
    this.closeVillageDialogBox();

    this.villageDialogContainer = this.add.container(0, 0);
    this.villageDialogContainer.setDepth(160);
    this.villageDialogContainer.setScrollFactor(0);

    const panelWidth = Math.min(860, GAME_WIDTH - 80);
    const panelY = GAME_HEIGHT - 138;
    const panelLeft = CENTER_X - (panelWidth / 2);
    const panelRight = CENTER_X + (panelWidth / 2);
    const contentLeft = panelLeft + 28;

    const panel = this.add.rectangle(CENTER_X, panelY, panelWidth, 190, 0x172011, 0.96);
    panel.setStrokeStyle(2, 0xffffff, 0.25);
    const speakerText = this.add.text(contentLeft, GAME_HEIGHT - 210, speaker, {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#ffdf9d"
    });
    const bodyText = this.add.text(contentLeft, GAME_HEIGHT - 176, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: panelWidth - 56 }
    });
    const continueText = this.add.text(panelRight - 28, GAME_HEIGHT - 64, "Tekan E", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#dfe8d4"
    }).setOrigin(1, 0.5);

    this.villageDialogContainer.add([panel, speakerText, bodyText, continueText]);
  }

  closeVillageDialogBox() {
    if (!this.villageDialogContainer) {
      return;
    }

    this.villageDialogContainer.destroy();
    this.villageDialogContainer = null;
  }

  updateVillageFootsteps(time) {
    if (this.enteringHome || this.enteringOffice || this.inputLocked || !this.player.body) {
      return;
    }

    const isMoving = Math.abs(this.player.body.velocity.x) > 5 || Math.abs(this.player.body.velocity.y) > 5;
    if (!isMoving || time < this.nextFootstepAt) {
      return;
    }

    this.playVillageFootstep();
    this.nextFootstepAt = time + 720;
  }

  ensureVillageFootstepAudio() {
    if (this.footstepAudioContext) {
      if (this.footstepAudioContext.state === "suspended") {
        this.footstepAudioContext.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    this.footstepAudioContext = new AudioContextClass();
    if (this.footstepAudioContext.state === "suspended") {
      this.footstepAudioContext.resume();
    }
  }

  playVillageFootstep() {
    this.ensureVillageFootstepAudio();

    if (!this.footstepAudioContext || this.footstepAudioContext.state !== "running") {
      return;
    }

    const now = this.footstepAudioContext.currentTime;
    const oscillator = this.footstepAudioContext.createOscillator();
    const gain = this.footstepAudioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(52, now);
    oscillator.frequency.exponentialRampToValueAtTime(30, now + 0.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    oscillator.connect(gain);
    gain.connect(this.footstepAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  shutdownVillageScene() {
    if (this.footstepAudioContext && this.footstepAudioContext.state !== "closed") {
      this.footstepAudioContext.close();
    }
  }
}

class SceneRumah extends BaseScene {
  constructor() {
    super("SceneRumah");
    this.playerSpeed = 95;
    this.nextFootstepAt = 0;
    this.footstepAudioContext = null;
    this.sleeping = false;
    this.leavingHome = false;
    this.mirrorMessageUntil = 0;
  }

  preload() {
    this.loadPlayerAssets();
    this.loadVillageAssets();
  }

  create(data) {
    this.wakeFromNightmare = Boolean(data && data.wakeFromNightmare);
    this.secondDay = Boolean(data && data.secondDay) || this.wakeFromNightmare || gameState.wealth > 0;
    this.playerSpeed = 95;
    this.nextFootstepAt = 0;
    this.sleeping = false;
    this.leavingHome = false;
    this.mirrorMessageUntil = 0;
    this.cameras.main.setBackgroundColor("#1c1a24");

    this.createHomeMap();
    if (this.secondDay) {
      this.createBedroomAftermathObjects();
    }
    this.createHomePlayer();
    this.createHomeControls();
    this.createStatusUi();
    this.createHomePrompt();

    if (this.wakeFromNightmare) {
      this.cameras.main.shake(380, 0.006);
      this.promptText.setText("Kamu terbangun di kamar. Mimpi itu terasa nyata.");
    }

    this.events.once("shutdown", this.shutdownHomeScene, this);
  }

  createHomeMap() {
    const homeWidth = Math.min(1060, GAME_WIDTH - 96);
    const homeHeight = Math.min(650, GAME_HEIGHT - 80);
    const homeTop = CENTER_Y - (homeHeight / 2);
    const homeBottom = CENTER_Y + (homeHeight / 2);
    const livingX = CENTER_X - (homeWidth * 0.24);
    const bedroomX = CENTER_X + (homeWidth * 0.24);
    const bedroomY = CENTER_Y - 72;
    this.homeBedroomX = bedroomX;
    this.homeBedroomY = bedroomY;
    this.homeExitZone = new Phaser.Geom.Rectangle(CENTER_X - 100, homeBottom - 112, 200, 130);

    this.add.rectangle(CENTER_X, CENTER_Y, homeWidth, homeHeight, 0x4a3c35, 1);
    this.add.rectangle(CENTER_X, CENTER_Y, homeWidth, homeHeight).setStrokeStyle(10, 0x211a17, 1);

    this.add.text(CENTER_X, homeTop + 38, "Rumah Kepala Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#f1e7d2"
    }).setOrigin(0.5);

    this.add.rectangle(CENTER_X, homeBottom - 48, 180, 70, 0x3a241b, 1);
    this.add.rectangle(CENTER_X, homeBottom - 48, 180, 70).setStrokeStyle(3, 0x1d120d, 1);
    this.add.text(CENTER_X, homeBottom - 98, "Pintu Rumah", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#e5d8c4"
    }).setOrigin(0.5);

    this.add.rectangle(bedroomX, bedroomY, 340, 270, 0x2e3345, 1);
    this.add.rectangle(bedroomX, bedroomY, 340, 270).setStrokeStyle(5, 0x151824, 1);
    this.add.text(bedroomX, bedroomY - 118, "Kamar", {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#e8edf7"
    }).setOrigin(0.5);

    this.bed = this.add.rectangle(bedroomX, bedroomY + 18, 170, 96, 0x6f2630, 1);
    this.bed.setStrokeStyle(4, 0x321016, 1);
    this.add.rectangle(bedroomX, bedroomY - 18, 150, 30, 0xddd6c7, 1);
    this.add.text(bedroomX, bedroomY + 90, "Tempat Tidur", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#e8edf7"
    }).setOrigin(0.5);

    this.sleepZone = new Phaser.Geom.Rectangle(bedroomX - 110, bedroomY - 74, 220, 206);

    this.add.rectangle(livingX, CENTER_Y - 46, 250, 130, 0x5b4632, 1).setStrokeStyle(3, 0x2f241a, 1);
    this.add.text(livingX, CENTER_Y - 46, "Ruang Tengah", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#eadac5"
    }).setOrigin(0.5);
  }

  createBedroomAftermathObjects() {
    const bagX = this.homeBedroomX + 126;
    const bagY = this.homeBedroomY + 104;

    this.add.rectangle(bagX, bagY, 62, 38, 0x2d1d0f, 1).setStrokeStyle(3, 0x1a1209, 1);
    this.add.circle(bagX - 24, bagY - 8, 13, 0xd7ab36, 1).setStrokeStyle(2, 0x80611b, 1);
    this.add.circle(bagX, bagY - 18, 15, 0xf2c94c, 1).setStrokeStyle(2, 0x80611b, 1);
    this.add.circle(bagX + 22, bagY - 6, 13, 0xd7ab36, 1).setStrokeStyle(2, 0x80611b, 1);
    this.add.text(bagX, bagY + 38, "Tas Uang", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#e8d0a0"
    }).setOrigin(0.5);
    this.moneyBagZone = new Phaser.Geom.Rectangle(bagX - 54, bagY - 54, 108, 112);

    const mirrorX = this.homeBedroomX - 130;
    const mirrorY = this.homeBedroomY - 24;
    this.add.rectangle(mirrorX, mirrorY, 60, 110, 0x151a25, 1).setStrokeStyle(4, 0xc6d0e6, 0.7);
    this.add.rectangle(mirrorX, mirrorY + 72, 92, 14, 0x241b18, 1);
    this.add.text(mirrorX, mirrorY + 94, "Cermin", {
      fontFamily: "Arial, sans-serif",
      fontSize: "13px",
      color: "#e8edf7"
    }).setOrigin(0.5);
    this.mirrorZone = new Phaser.Geom.Rectangle(mirrorX - 54, mirrorY - 72, 108, 154);
  }

  createHomePlayer() {
    const startX = this.wakeFromNightmare ? this.homeBedroomX : CENTER_X;
    const startY = this.wakeFromNightmare
      ? this.homeBedroomY + 112
      : Math.min(GAME_HEIGHT - 150, CENTER_Y + 180);

    this.player = this.createPlayerSprite(startX, startY);
    this.player.body.setCollideWorldBounds(true);

    this.playerLabel = this.add.text(this.player.x, this.getPlayerLabelY(this.player), "Kepala Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#dfe9ff"
    }).setOrigin(0.5);
  }

  createHomeControls() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });
  }

  createHomePrompt() {
    this.promptText = this.add.text(CENTER_X, GAME_HEIGHT - 40, "Pulang. Masuk ke kamar dan tidur.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      backgroundColor: "#17151e",
      padding: { x: 14, y: 8 }
    }).setOrigin(0.5);

    this.promptText.setDepth(110);
    this.promptText.setScrollFactor(0);
  }

  update(time, delta) {
    super.update(time, delta);
    this.updateHomeMovement();
    this.updateHomePrompt();
    this.updateHomeFootsteps(time);
    this.handleHomeObjectInteractions();
    this.handleLeaveHomeForOffice();
    this.handleSleepInput();
  }

  updateHomeMovement() {
    if (this.sleeping) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.left.isDown) {
      velocityX -= 1;
    }

    if (this.keys.right.isDown) {
      velocityX += 1;
    }

    if (this.keys.up.isDown) {
      velocityY -= 1;
    }

    if (this.keys.down.isDown) {
      velocityY += 1;
    }

    if (velocityX !== 0 || velocityY !== 0) {
      const length = Math.sqrt((velocityX * velocityX) + (velocityY * velocityY));
      velocityX = (velocityX / length) * this.playerSpeed;
      velocityY = (velocityY / length) * this.playerSpeed;
    }

    this.player.body.setVelocity(velocityX, velocityY);
    this.updatePlayerAnimation(this.player);
    this.playerLabel.setPosition(this.player.x, this.getPlayerLabelY(this.player));
  }

  updateHomePrompt() {
    if (this.sleeping) {
      return;
    }

    if (this.secondDay) {
      if (this.time.now < this.mirrorMessageUntil) {
        this.promptText.setText(`Wajahmu terlihat lebih lelah dari biasanya. Sanity: ${gameState.sanity}`);
        return;
      }

      if (this.isNearMoneyBag()) {
        this.promptText.setText("Hasil kemarin... tapi kenapa rasanya sesak?");
        return;
      }

      if (this.isNearMirror()) {
        this.promptText.setText("Tekan E untuk bercermin");
        return;
      }

      if (this.isNearHomeExit()) {
        this.promptText.setText(this.wakeFromNightmare ? "Tekan E untuk keluar rumah menuju kantor" : "Pintu rumah");
        return;
      }

      if (this.wakeFromNightmare) {
        this.promptText.setText("Kamu terbangun di kamar. Mimpi itu terasa nyata.");
        return;
      }
    }

    if (this.isNearBed()) {
      this.promptText.setText("Tekan E untuk tidur");
      return;
    }

    this.promptText.setText("Masuk ke kamar dan dekati tempat tidur");
  }

  handleSleepInput() {
    if (
      this.sleeping ||
      this.wakeFromNightmare ||
      !this.isNearBed() ||
      !Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      return;
    }

    this.sleeping = true;
    this.player.body.setVelocity(0, 0);
    this.promptText.setText("Tidur terasa berat...");
    this.playHomeFootstep();
    this.cameras.main.fadeOut(1400, 5, 4, 16);
    this.time.delayedCall(1500, () => {
      this.scene.start("SceneMalam");
    });
  }

  handleHomeObjectInteractions() {
    if (!this.secondDay || this.sleeping || this.leavingHome) {
      return;
    }

    if (this.isNearMirror() && Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
      this.mirrorMessageUntil = this.time.now + 1800;
      this.promptText.setText(`Wajahmu terlihat lebih lelah dari biasanya. Sanity: ${gameState.sanity}`);
    }
  }

  handleLeaveHomeForOffice() {
    if (
      !this.wakeFromNightmare ||
      this.sleeping ||
      this.leavingHome ||
      !this.isNearHomeExit() ||
      !Phaser.Input.Keyboard.JustDown(this.keys.interact)
    ) {
      return;
    }

    this.leavingHome = true;
    this.player.body.setVelocity(0, 0);
    this.promptText.setText("Keluar rumah menuju kantor...");
    this.playHomeFootstep();
    this.cameras.main.fadeOut(700, 5, 4, 16);
    this.time.delayedCall(760, () => {
      this.scene.start("SceneDesa", {
        secondDay: true,
        startAtHome: true
      });
    });
  }

  isNearBed() {
    return Phaser.Geom.Rectangle.Contains(this.sleepZone, this.player.x, this.player.y);
  }

  isNearMoneyBag() {
    return this.moneyBagZone && Phaser.Geom.Rectangle.Contains(this.moneyBagZone, this.player.x, this.player.y);
  }

  isNearMirror() {
    return this.mirrorZone && Phaser.Geom.Rectangle.Contains(this.mirrorZone, this.player.x, this.player.y);
  }

  isNearHomeExit() {
    return this.homeExitZone && Phaser.Geom.Rectangle.Contains(this.homeExitZone, this.player.x, this.player.y + 20);
  }

  updateHomeFootsteps(time) {
    if (this.sleeping || !this.player.body) {
      return;
    }

    const isMoving = Math.abs(this.player.body.velocity.x) > 5 || Math.abs(this.player.body.velocity.y) > 5;
    if (!isMoving || time < this.nextFootstepAt) {
      return;
    }

    this.playHomeFootstep();
    this.nextFootstepAt = time + 760;
  }

  ensureHomeFootstepAudio() {
    if (this.footstepAudioContext) {
      if (this.footstepAudioContext.state === "suspended") {
        this.footstepAudioContext.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    this.footstepAudioContext = new AudioContextClass();
    if (this.footstepAudioContext.state === "suspended") {
      this.footstepAudioContext.resume();
    }
  }

  playHomeFootstep() {
    this.ensureHomeFootstepAudio();

    if (!this.footstepAudioContext || this.footstepAudioContext.state !== "running") {
      return;
    }

    const now = this.footstepAudioContext.currentTime;
    const oscillator = this.footstepAudioContext.createOscillator();
    const gain = this.footstepAudioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(46, now);
    oscillator.frequency.exponentialRampToValueAtTime(28, now + 0.22);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    oscillator.connect(gain);
    gain.connect(this.footstepAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.32);
  }

  shutdownHomeScene() {
    if (this.footstepAudioContext && this.footstepAudioContext.state !== "closed") {
      this.footstepAudioContext.close();
    }
  }
}

class SceneMalam extends BaseScene {
  constructor() {
    super("SceneMalam");
    this.playerSpeed = 120;
    this.nightmarePhase = "bedroom";
    this.hauntedVillagers = [];
    this.talkableVillager = null;
    this.inputLocked = false;
    this.dialogQueue = [];
    this.dialogIndex = 0;
    this.dialogAdvanceReady = false;
    this.dialogOnComplete = null;
    this.dreamEndingStarted = false;
    this.mirrorObject = null;
    this.mirrorZone = null;
    this.actTwoNightmare = false;
  }

  preload() {
    this.loadPlayerAssets();
    this.loadVillageAssets();
  }

  create(data) {
    this.playerSpeed = 120;
    this.nightmarePhase = "bedroom";
    this.hauntedVillagers = [];
    this.talkableVillager = null;
    this.inputLocked = false;
    this.dialogQueue = [];
    this.dialogIndex = 0;
    this.dialogAdvanceReady = false;
    this.dialogOnComplete = null;
    this.dreamEndingStarted = false;
    this.mirrorObject = null;
    this.mirrorZone = null;
    this.actTwoNightmare = Boolean(data && data.actTwoNightmare);
    resetCameraView(this.cameras.main);
    this.cameras.main.setBackgroundColor("#100f18");

    this.createNightmareControls();
    this.createDreamBedroom();
    this.createNightmarePlayer(this.dreamWakeX, this.dreamWakeY);
    this.createStatusUi();
    this.createNightmarePrompt(this.actTwoNightmare
      ? "Kamu terbangun. Sirine jauh masih berdenging di dalam kepala."
      : "Kamu terbangun di kamar yang terasa asing...");

    if (!this.actTwoNightmare) {
      this.cameras.main.fadeIn(1200, 4, 3, 10);
    }

    this.time.delayedCall(1700, () => {
      this.createNightmarePrompt(this.actTwoNightmare
        ? "Keluar rumah. Desa seperti menunggu untuk menagih semuanya."
        : "Keluar rumah. Suara warga memanggil dari luar.");
    });
  }

  update(time, delta) {
    super.update(time, delta);
    this.updateNightmareMovement();
    this.updateNightmarePrompt();
    this.handleNightmareDialogAdvance();
    this.handleVillagerInteraction();
    this.handleDreamEndingTrigger();
    this.updateNightmareCameraPulse(time);
  }

  createNightmareControls() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      continueDialog: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  createDreamBedroom() {
    const homeWidth = Math.min(1060, GAME_WIDTH - 96);
    const homeHeight = Math.min(650, GAME_HEIGHT - 80);
    const homeTop = CENTER_Y - (homeHeight / 2);
    const homeBottom = CENTER_Y + (homeHeight / 2);
    const livingX = CENTER_X - (homeWidth * 0.24);
    const bedroomX = CENTER_X + (homeWidth * 0.24);
    const bedroomY = CENTER_Y - 72;

    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x191625, 1);
    this.add.rectangle(CENTER_X, CENTER_Y, homeWidth, homeHeight, 0x2a2330, 1);
    this.add.rectangle(CENTER_X, CENTER_Y, homeWidth, homeHeight).setStrokeStyle(10, 0x08070c, 1);

    this.add.text(CENTER_X, homeTop + 38, "Rumah Kepala Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#e9e1f4"
    }).setOrigin(0.5);

    this.add.rectangle(CENTER_X, homeBottom - 48, 180, 70, 0x1a1114, 1);
    this.add.rectangle(CENTER_X, homeBottom - 48, 180, 70).setStrokeStyle(3, 0x08070c, 1);
    this.add.text(CENTER_X, homeBottom - 98, "Pintu Rumah", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#ddd1df"
    }).setOrigin(0.5);

    this.add.rectangle(bedroomX, bedroomY, 340, 270, 0x202334, 1);
    this.add.rectangle(bedroomX, bedroomY, 340, 270).setStrokeStyle(5, 0x0b0d16, 1);
    this.add.text(bedroomX, bedroomY - 118, "Kamar", {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#e8edf7"
    }).setOrigin(0.5);

    this.bed = this.add.rectangle(bedroomX, bedroomY + 18, 170, 96, 0x4a1e29, 1);
    this.bed.setStrokeStyle(4, 0x160b10, 1);
    this.add.rectangle(bedroomX, bedroomY - 18, 150, 30, 0xd6d0c8, 1);
    this.add.text(bedroomX, bedroomY + 90, "Tempat Tidur", {
      fontFamily: "Arial, sans-serif",
      fontSize: "15px",
      color: "#e8edf7"
    }).setOrigin(0.5);

    this.add.rectangle(livingX, CENTER_Y - 46, 250, 130, 0x322838, 1).setStrokeStyle(3, 0x120f16, 1);
    this.add.text(livingX, CENTER_Y - 46, "Ruang Tengah", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#eadac5"
    }).setOrigin(0.5);

    if (this.actTwoNightmare) {
      this.createActTwoBedroomDread(homeWidth, homeHeight);
    }

    this.exitZone = new Phaser.Geom.Rectangle(CENTER_X - 100, homeBottom - 118, 200, 140);
    this.dreamWakeX = bedroomX;
    this.dreamWakeY = bedroomY + 112;
  }

  createActTwoBedroomDread(homeWidth, homeHeight) {
    const overlay = this.add.rectangle(CENTER_X, CENTER_Y, homeWidth, homeHeight, 0x3f0712, 0.18);
    overlay.setDepth(2);

    for (let index = 0; index < 12; index += 1) {
      const x = CENTER_X - (homeWidth / 2) + 80 + ((index * 127) % Math.max(120, homeWidth - 160));
      const y = CENTER_Y - (homeHeight / 2) + 80 + ((index * 91) % Math.max(120, homeHeight - 160));
      this.add.line(0, 0, x - 32, y - 18, x + 38, y + 22, 0x1a090d, 0.85)
        .setLineWidth(3)
        .setDepth(3);
    }

    this.add.text(CENTER_X, CENTER_Y + 150, "Kantong penuh. Kepala semakin bising.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#d6c1c1",
      backgroundColor: "#14090d",
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(4);
  }

  createNightmarePlayer(x, y) {
    this.player = this.createPlayerSprite(x, y);
    this.player.body.setCollideWorldBounds(true);
    this.playerLabel = this.add.text(this.player.x, this.getPlayerLabelY(this.player), "Kepala Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#e6e6f0"
    }).setOrigin(0.5);
  }

  createNightmarePrompt(message) {
    if (!this.promptText) {
      this.promptText = this.add.text(CENTER_X, GAME_HEIGHT - 34, message, {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#140f18",
        padding: { x: 16, y: 9 },
        wordWrap: { width: Math.min(860, GAME_WIDTH - 80) }
      }).setOrigin(0.5);

      this.promptText.setDepth(140);
      this.promptText.setScrollFactor(0);
      return;
    }

    this.promptText.setText(message);
  }

  updateNightmareMovement() {
    if (!this.player || !this.player.body) {
      return;
    }

    if (this.inputLocked) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.left.isDown) {
      velocityX -= 1;
    }

    if (this.keys.right.isDown) {
      velocityX += 1;
    }

    if (this.keys.up.isDown) {
      velocityY -= 1;
    }

    if (this.keys.down.isDown) {
      velocityY += 1;
    }

    if (velocityX !== 0 || velocityY !== 0) {
      const length = Math.sqrt((velocityX * velocityX) + (velocityY * velocityY));
      velocityX = (velocityX / length) * this.playerSpeed;
      velocityY = (velocityY / length) * this.playerSpeed;
    }

    this.player.body.setVelocity(velocityX, velocityY);
    this.updatePlayerAnimation(this.player);

    if (this.playerLabel) {
      this.playerLabel.setPosition(this.player.x, this.getPlayerLabelY(this.player));
    }
  }

  updateNightmarePrompt() {
    if (this.nightmarePhase !== "bedroom") {
      return;
    }

    if (Phaser.Geom.Rectangle.Contains(this.exitZone, this.player.x, this.player.y)) {
      this.enterRuinedVillage();
    }
  }

  enterRuinedVillage() {
    if (this.nightmarePhase !== "bedroom") {
      return;
    }

    this.nightmarePhase = "village";
    this.player.body.setVelocity(0, 0);
    this.cameras.main.fadeOut(700, 5, 4, 12);

    this.time.delayedCall(760, () => {
      this.children.removeAll();
      this.statusText = null;
      this.promptText = null;
      this.playerLabel = null;
      this.hauntedVillagers = [];
      this.talkableVillager = null;
      this.mapWidth = 2200;
      this.mapHeight = 1400;
      this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
      this.cameras.main.setBackgroundColor("#0c0d12");

      this.createRuinedVillage();
      this.createNightmarePlayer(1780, 628);
      this.playerSpeed = 95;
      this.createStatusUi();
      this.createNightmarePrompt(this.actTwoNightmare
        ? "Desa hancur lebih parah. Bayangan warga terasa semakin dekat."
        : "Desa hancur. Cari warga yang masih bisa bicara.");
      this.setupNightmareCamera();
      this.cameras.main.fadeIn(900, 5, 4, 12);
    });
  }

  createRuinedVillage() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x1a1a1d, 1);
    this.addTileArea("grassNight", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 1, {
      tileScale: 2.4,
      tint: 0x34363a
    });
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth - 40, this.mapHeight - 40)
      .setStrokeStyle(12, 0x292b26, 1);

    this.add.text(140, 70, "Desa Dalam Mimpi", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#d9d4cf"
    }).setOrigin(0.5);

    this.add.rectangle(this.mapWidth / 2, 730, this.mapWidth - 160, 116, 0x3c3733, 1);
    this.addTileArea("groundNight", this.mapWidth / 2, 730, this.mapWidth - 160, 116, 2, {
      tileScale: 2.15,
      tint: 0x4a4541
    });
    this.add.rectangle(this.mapWidth / 2, 730, this.mapWidth - 160, 116).setStrokeStyle(3, 0x24201e, 1);
    this.add.rectangle(1120, 720, 100, this.mapHeight - 220, 0x393531, 1);
    this.addTileArea("groundNight", 1120, 720, 100, this.mapHeight - 220, 2, {
      tileScale: 2.15,
      tint: 0x4a4541
    });
    this.add.rectangle(1120, 720, 100, this.mapHeight - 220).setStrokeStyle(3, 0x24201e, 1);
    this.add.text(520, 730, "Jalan Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#bdb5ad"
    }).setOrigin(0.5);

    this.createBrokenHouses();
    this.createPovertyScenes();
    this.createHauntedVillagers();
    this.addNightmareTrees();
    this.createDreamMirror();

    if (this.actTwoNightmare) {
      this.createActTwoNightmareVillageDetails();
    }
  }

  createActTwoNightmareVillageDetails() {
    const redFog = this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x4b0611, 0.16);
    redFog.setDepth(6);

    for (let index = 0; index < 22; index += 1) {
      const x = 180 + ((index * 181) % 1900);
      const y = 220 + ((index * 137) % 1040);
      const shadow = this.add.rectangle(x, y, 28 + (index % 3) * 10, 96 + (index % 4) * 18, 0x050506, 0.42);
      shadow.setDepth(7);
      shadow.setRotation(Phaser.Math.FloatBetween(-0.12, 0.12));
    }

    this.add.text(1120, 650, "audit", {
      fontFamily: "Courier New, monospace",
      fontSize: "54px",
      color: "#6f111b",
      alpha: 0.35
    }).setOrigin(0.5).setRotation(-0.08).setDepth(8);
  }

  createBrokenHouses() {
    this.addRuinedBuilding(320, 380, 230, 150, 0x4a3930, 0x2b1917, "Rumah Warga", "#d8c9b8", {
      roofY: 280,
      roofTop: -58,
      roofLeft: -132,
      roofRight: 132,
      roofBottom: 52,
      labelY: 472
    });

    this.addRuinedBuilding(1780, 420, 320, 220, 0x3b2a24, 0x211515, "Rumah Kepala Desa", "#ead6c4", {
      assetKey: "house2Night",
      assetScale: 2.05,
      roofY: 270,
      roofTop: -70,
      roofLeft: -180,
      roofRight: 180,
      roofBottom: 76,
      labelY: 590,
      labelBackground: "#261819",
      door: { x: 1780, y: 498, width: 82, height: 136 },
      knob: { x: 1810, y: 498 }
    });

    this.addRuinedBuilding(880, 360, 240, 154, 0x504536, 0x33251e, "Warung", "#d7cbb2", {
      roofY: 250,
      roofTop: -56,
      roofLeft: -138,
      roofRight: 138,
      roofBottom: 62,
      labelY: 456
    });

    this.addRuinedBuilding(520, 1160, 260, 160, 0x354048, 0x1f282e, "Balai Warga", "#cbd4da", {
      roofY: 1034,
      roofTop: -60,
      roofLeft: -148,
      roofRight: 148,
      roofBottom: 76,
      labelY: 1268
    });

    this.addRuinedBuilding(1320, 1050, 260, 150, 0x514936, 0x382f22, "Gudang", "#d8cab0", {
      roofY: 936,
      roofTop: -54,
      roofLeft: -150,
      roofRight: 150,
      roofBottom: 64,
      labelY: 1144
    });

    this.add.rectangle(240, 1210, 168, 70, 0x302621, 1);
    this.add.text(240, 1168, "Arah Kantor Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#cfc3b3"
    }).setOrigin(0.5);
  }

  addRuinedBuilding(x, y, width, height, wallColor, roofColor, label, labelColor, options) {
    this.add.rectangle(x, y, width, height, wallColor, 1).setStrokeStyle(4, 0x151111, 1);
    this.add.triangle(x, options.roofY, 0, options.roofTop, options.roofLeft, options.roofBottom, options.roofRight, options.roofBottom, roofColor, 1);
    const houseKey = options.assetKey || (width > 260 ? "house2Night" : "house1Night");
    const houseScale = options.assetScale || (width > 260 ? 1.9 : 1.58);
    this.addVillageAsset(houseKey, x, y - 2, houseScale, 5, {
      tint: 0x5f5550,
      alpha: 0.92
    });

    if (options.door) {
      this.add.rectangle(options.door.x, options.door.y, options.door.width, options.door.height, 0x120d0d, 1);
      this.add.circle(options.knob.x, options.knob.y, 5, 0x6d5a3b, 1);
    } else {
      this.add.rectangle(x - width * 0.2, y + height * 0.18, 44, 58, 0x120d0d, 1);
    }

    this.add.rectangle(x + width * 0.24, y - height * 0.12, 56, 42, 0x080808, 1);
    this.add.line(0, 0, x + width * 0.12, y - height * 0.42, x - width * 0.18, y + height * 0.34, 0x090909, 1).setLineWidth(4);
    this.add.line(0, 0, x + width * 0.32, y - height * 0.28, x + width * 0.1, y + height * 0.42, 0x5b5250, 1).setLineWidth(3);

    const textConfig = {
      fontFamily: "Arial, sans-serif",
      fontSize: label === "Rumah Kepala Desa" ? "18px" : "16px",
      color: labelColor
    };

    if (options.labelBackground) {
      textConfig.backgroundColor = options.labelBackground;
      textConfig.padding = { x: 8, y: 4 };
    }

    this.add.text(x, options.labelY, label, textConfig).setOrigin(0.5);
  }

  createPovertyScenes() {
    const hungerSpots = [
      [610, 725], [820, 700], [1270, 760], [1600, 735], [1980, 770],
      [420, 1160], [1200, 1190], [1690, 1040]
    ];

    hungerSpots.forEach(([x, y], index) => {
      this.add.circle(x, y - 18, 16, 0xd8d1c9, 1).setStrokeStyle(2, 0x4a4545, 1);
      this.add.rectangle(x, y + 18, 32, 52, index % 2 === 0 ? 0x514849 : 0x3f4643, 1);
      this.add.line(0, 0, x - 10, y - 22, x + 10, y - 22, 0x2a2728, 1).setLineWidth(2);
      this.add.line(0, 0, x - 11, y - 8, x + 11, y - 8, 0x2a2728, 1).setLineWidth(2);
      this.add.text(x, y + 58, index % 3 === 0 ? "Lapar" : "Miskin", {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#c9c1bb"
      }).setOrigin(0.5);
    });

    for (let index = 0; index < 18; index += 1) {
      const x = 280 + ((index * 127) % 1900);
      const y = 520 + ((index * 83) % 760);
      this.add.rectangle(x, y, 38 + (index % 4) * 14, 14, 0x2c2927, 1)
        .setRotation((index % 5) * 0.22);
    }
  }

  createHauntedVillagers() {
    const positions = [
      [660, 590], [760, 890], [980, 640], [1220, 590], [1460, 865], [1730, 620],
      [2010, 930], [560, 1290], [830, 1270], [1130, 1010], [1370, 1290], [1640, 1240],
      [1960, 1245], [2050, 520]
    ];

    positions.forEach(([x, y], index) => {
      const villager = this.createPaleVillager(x, y, index);
      this.hauntedVillagers.push(villager);

      if (index === 5) {
        this.talkableVillager = villager;
        villager.isTalkable = true;
        villager.nameLabel = this.add.text(x, y - 76, "Warga Pucat", {
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#eee8e2",
          backgroundColor: "#181214",
          padding: { x: 7, y: 3 }
        }).setOrigin(0.5);
        villager.nameLabel.setDepth(25);
      }
    });
  }

  createPaleVillager(x, y, index) {
    const villager = this.add.container(x, y);
    const bodyColor = index % 2 === 0 ? 0x343438 : 0x2d3634;
    const face = this.add.circle(0, -26, 19, 0xdedbd6, 1).setStrokeStyle(2, 0x6d6a68, 1);
    const body = this.add.rectangle(0, 18, 34, 60, bodyColor, 1);
    const leftEye = this.add.circle(-7, -30, 3, 0x1d1a1a, 1);
    const rightEye = this.add.circle(7, -30, 3, 0x1d1a1a, 1);
    const mouth = this.add.rectangle(0, -17, 16, 3, 0x2a2222, 1);
    const armLeft = this.add.rectangle(-25, 10, 9, 44, 0xbdb7b1, 1).setRotation(-0.18);
    const armRight = this.add.rectangle(25, 10, 9, 44, 0xbdb7b1, 1).setRotation(0.18);

    villager.add([body, armLeft, armRight, face, leftEye, rightEye, mouth]);
    villager.setDepth(18);
    villager.setAlpha(0.9);
    return villager;
  }

  addNightmareTrees() {
    const treePositions = [
      [160, 160], [620, 250], [1240, 210], [2050, 260],
      [210, 620], [720, 610], [1510, 645], [2020, 790],
      [170, 980], [860, 1000], [1640, 1080], [2000, 1240]
    ];

    treePositions.forEach(([x, y], index) => {
      const treeKey = ["tree1Night", "tree2Night", "tree3Night"][index % 3];
      this.addVillageAsset(treeKey, x, y + 10, 1.55, 5, { tint: 0x5a5a5a });
      this.add.rectangle(x, y + 22, 18, 46, 0x2f221b, 1);
      this.add.circle(x, y, 34, 0x1f3528, 1);
      this.add.circle(x - 24, y + 14, 26, 0x273c2d, 1);
      this.add.circle(x + 24, y + 14, 26, 0x1b2e22, 1);
    });
  }

  createDreamMirror() {
    const mirrorX = 2060;
    const mirrorY = 155;

    this.add.rectangle(mirrorX, mirrorY, 250, 210, 0x050507, 0.82).setDepth(10);
    this.add.text(mirrorX, mirrorY - 118, "Ujung Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#6f6b78"
    }).setOrigin(0.5).setDepth(11);

    this.mirrorObject = this.add.container(mirrorX, mirrorY);
    this.mirrorObject.setDepth(35);

    const shadow = this.add.rectangle(0, 10, 74, 118, 0x070709, 1);
    shadow.setStrokeStyle(3, 0xaeb7ff, 0.45);
    const glass = this.add.rectangle(0, 0, 54, 92, 0x111523, 0.92);
    glass.setStrokeStyle(2, 0xe7ebff, 0.6);
    const glow = this.add.circle(0, 0, 58, 0x9aa8ff, 0.12);
    const face = this.add.rectangle(0, 10, 18, 48, 0x0a0a0d, 1);
    const eyeLeft = this.add.circle(-8, -8, 3, 0xffffff, 0.82);
    const eyeRight = this.add.circle(8, -8, 3, 0xffffff, 0.82);
    const base = this.add.rectangle(0, 76, 92, 12, 0x060607, 1);

    this.mirrorObject.add([glow, shadow, glass, face, eyeLeft, eyeRight, base]);

    this.tweens.add({
      targets: this.mirrorObject,
      alpha: 0.42,
      duration: 850,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1
    });

    this.mirrorZone = new Phaser.Geom.Rectangle(mirrorX - 72, mirrorY - 72, 144, 164);
  }

  handleDreamEndingTrigger() {
    if (
      this.nightmarePhase !== "village" ||
      this.dreamEndingStarted ||
      this.inputLocked ||
      !this.mirrorZone ||
      !this.player
    ) {
      return;
    }

    if (Phaser.Geom.Rectangle.Contains(this.mirrorZone, this.player.x, this.player.y)) {
      this.startDreamEnding();
    }
  }

  startDreamEnding() {
    this.dreamEndingStarted = true;
    this.inputLocked = true;

    if (this.player && this.player.body) {
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation(this.player);
    }

    if (this.promptText) {
      this.promptText.setText("");
    }

    gameState.sanity = Math.max(0, gameState.sanity - 10);
    this.updateStatusUi();
    this.showNightmareDialogBox(
      "Sosok Misterius",
      "Tidurlah... besok ada lebih banyak uang yang harus kita ambil.",
      ""
    );

    this.time.delayedCall(2300, () => this.finishDreamEnding());
  }

  finishDreamEnding() {
    this.closeNightmareDialogBox();
    this.cameras.main.shake(500, 0.012);

    this.time.delayedCall(260, () => {
      this.cameras.main.fadeOut(1400, 255, 255, 255);
      this.time.delayedCall(1500, () => {
        this.scene.start("SceneRumah", {
          wakeFromNightmare: true
        });
      });
    });
  }

  setupNightmareCamera() {
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(140, 100);
  }

  handleVillagerInteraction() {
    if (
      this.nightmarePhase !== "village" ||
      this.inputLocked ||
      !this.talkableVillager ||
      !this.player
    ) {
      return;
    }

    if (!this.isNearTalkableVillager()) {
      return;
    }

    this.createNightmarePrompt("Tekan E untuk bicara dengan Warga Pucat");

    if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
      this.showNightmareDialogSequence([
        {
          speaker: "Warga Pucat",
          text: "Pak... jalan yang bapak bangun retak sebelum hujan pertama turun."
        },
        {
          speaker: "Warga Pucat",
          text: "Anak-anak kami lapar. Semen dikurangi, uangnya hilang, tapi nama bapak masih tertulis di papan proyek."
        },
        {
          speaker: "Kepala Desa",
          text: "Ini hanya mimpi... kan?"
        },
        {
          speaker: "Warga Pucat",
          text: "Kalau ini mimpi, kenapa kami yang menanggung bangunnya?"
        }
      ], () => {
        this.createNightmarePrompt("Warga itu kembali diam. Semua mata tetap menatapmu.");
      });
    }
  }

  isNearTalkableVillager() {
    return Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.talkableVillager.x,
      this.talkableVillager.y
    ) < 95;
  }

  showNightmareDialogSequence(dialogs, onComplete) {
    this.inputLocked = true;
    this.player.body.setVelocity(0, 0);
    this.dialogQueue = dialogs;
    this.dialogIndex = 0;
    this.dialogOnComplete = onComplete;
    this.showNextNightmareDialog();
  }

  handleNightmareDialogAdvance() {
    if (!this.dialogContainer || !this.dialogAdvanceReady) {
      return;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.interact) ||
      Phaser.Input.Keyboard.JustDown(this.keys.continueDialog)
    ) {
      this.showNextNightmareDialog();
    }
  }

  showNextNightmareDialog() {
    if (this.dialogIndex >= this.dialogQueue.length) {
      const onComplete = this.dialogOnComplete;
      this.closeNightmareDialogBox();
      this.dialogQueue = [];
      this.dialogIndex = 0;
      this.dialogOnComplete = null;
      this.dialogAdvanceReady = false;
      this.inputLocked = false;

      if (onComplete) {
        onComplete();
      }

      return;
    }

    const dialog = this.dialogQueue[this.dialogIndex];
    this.dialogIndex += 1;
    this.dialogAdvanceReady = false;
    this.showNightmareDialogBox(dialog.speaker, dialog.text);
    this.time.delayedCall(140, () => {
      this.dialogAdvanceReady = true;
    });
  }

  showNightmareDialogBox(speaker, text, continueHint = "Tekan E / Spasi") {
    this.closeNightmareDialogBox();

    this.dialogContainer = this.add.container(0, 0);
    this.dialogContainer.setDepth(180);
    this.dialogContainer.setScrollFactor(0);

    const panelWidth = Math.min(900, GAME_WIDTH - 80);
    const panelHeight = 205;
    const panelY = GAME_HEIGHT - 148;
    const panelLeft = CENTER_X - (panelWidth / 2);
    const panelRight = CENTER_X + (panelWidth / 2);
    const contentLeft = panelLeft + 30;

    const panel = this.add.rectangle(CENTER_X, panelY, panelWidth, panelHeight, 0x0b0a0f, 0.96);
    panel.setStrokeStyle(2, 0xd8d0cf, 0.35);

    const speakerText = this.add.text(contentLeft, GAME_HEIGHT - 226, speaker, {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: speaker === "Warga Pucat" || speaker === "Sosok Misterius" ? "#dedbd6" : "#ffcf7a"
    });

    const bodyText = this.add.text(contentLeft, GAME_HEIGHT - 190, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: panelWidth - 60 }
    });

    this.dialogContainer.add([panel, speakerText, bodyText]);

    if (continueHint) {
      const continueText = this.add.text(panelRight - 30, GAME_HEIGHT - 64, continueHint, {
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        color: "#c9c1c1"
      }).setOrigin(1, 0.5);

      this.dialogContainer.add(continueText);
    }
  }

  closeNightmareDialogBox() {
    if (!this.dialogContainer) {
      return;
    }

    this.dialogContainer.destroy();
    this.dialogContainer = null;
  }

  updateNightmareCameraPulse(time) {
    if (this.nightmarePhase !== "village") {
      return;
    }

    const intensity = this.actTwoNightmare ? 0.024 : 0.012;
    const zoom = 1 + Math.sin(time * 0.0017) * intensity;
    this.cameras.main.setZoom(zoom);

    if (this.actTwoNightmare) {
      this.cameras.main.setRotation(Math.sin(time * 0.0011) * 0.004);
    }
  }
}

class ScenePelantikan extends BaseScene {
  constructor() {
    super("ScenePelantikan");
    this.speechIndex = 0;
    this.speechLines = [];
    this.crowd = [];
  }

  create() {
    this.speechIndex = 0;
    this.crowd = [];
    this.speechLines = [
      {
        speaker: "Narasi",
        text: "Setelah penangkapan itu, kamu berdiri di antara warga. Bukan lagi di balik meja kekuasaan."
      },
      {
        speaker: "Kepala Desa Baru",
        text: "Warga sekalian, masa lalu sudah berakhir. Desa ini akan kita bangun kembali."
      },
      {
        speaker: "Warga",
        text: "Semoga kali ini janji itu benar-benar sampai ke jalan kami."
      },
      {
        speaker: "Kepala Desa Baru",
        text: "Warisan yang tersisa memang rusak, tapi mulai hari ini kepemimpinan baru dimulai."
      }
    ];

    this.cameras.main.setBackgroundColor("#5d7465");
    this.createCeremonyGround();
    this.createCrowd();
    this.createNewLeaderPodium();
    this.createStatusUi();
    this.createSpeechUi();

    this.cameras.main.fadeIn(900, 12, 12, 16);
    this.time.delayedCall(650, () => this.showNextSpeechLine());
  }

  createCeremonyGround() {
    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x6f8b73, 1);
    this.add.rectangle(CENTER_X, GAME_HEIGHT - 120, GAME_WIDTH, 240, 0x6a5a45, 1);

    for (let x = 80; x < GAME_WIDTH; x += 160) {
      this.add.circle(x, GAME_HEIGHT - 190 + ((x / 80) % 2) * 16, 14, 0x506f4d, 0.55);
      this.add.circle(x + 36, GAME_HEIGHT - 168, 10, 0x4c6848, 0.45);
    }

    const stageWidth = Math.min(620, GAME_WIDTH - 160);
    const stageY = Math.max(170, GAME_HEIGHT * 0.28);
    this.add.rectangle(CENTER_X, stageY + 58, stageWidth, 116, 0x8d5b3d, 1)
      .setStrokeStyle(4, 0x4f2f25, 1);
    this.add.rectangle(CENTER_X, stageY + 6, stageWidth + 28, 18, 0x5f2c2c, 1);
    this.add.text(CENTER_X, stageY - 46, "Pelantikan Kepala Desa Baru", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#fff4d7",
      stroke: "#33231f",
      strokeThickness: 4,
      align: "center"
    }).setOrigin(0.5);
    this.add.text(CENTER_X, stageY + 92, "Balai Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#f9dfb1"
    }).setOrigin(0.5);
  }

  createCrowd() {
    const stageY = Math.max(170, GAME_HEIGHT * 0.28);
    const panelTop = GAME_HEIGHT - 167;
    const firstRowY = Math.min(panelTop - 116, Math.max(stageY + 150, panelTop - 160));
    const rows = [
      { y: firstRowY, count: 7, spread: Math.min(760, GAME_WIDTH - 160) },
      { y: firstRowY + 46, count: 9, spread: Math.min(880, GAME_WIDTH - 110) },
      { y: firstRowY + 92, count: 8, spread: Math.min(820, GAME_WIDTH - 150) }
    ];
    const colors = [0x6f8fa5, 0xb78c64, 0x8f6c86, 0x4d7a72, 0xa66d58, 0x736f99];

    rows.forEach((row, rowIndex) => {
      const startX = CENTER_X - (row.spread / 2);
      const gap = row.spread / Math.max(1, row.count - 1);

      for (let index = 0; index < row.count; index += 1) {
        const x = startX + (gap * index) + ((rowIndex % 2) * 18);
        const y = row.y + ((index % 2) * 10);
        const color = colors[(index + rowIndex) % colors.length];
        const label = rowIndex === 2 && index === 3 ? "Kamu (Warga)" : "";
        const citizen = this.createCitizen(x, y, color, label, label ? 1.1 : 1);
        this.crowd.push(citizen);
      }
    });
  }

  createCitizen(x, y, color, label, scale) {
    const citizen = this.add.container(x, y);
    citizen.setScale(scale || 1);
    citizen.setDepth(40 + Math.floor(y / 20));

    const shadow = this.add.ellipse(0, 34, 44, 13, 0x202020, 0.18);
    const body = this.add.rectangle(0, 10, 30, 46, color, 1).setStrokeStyle(2, 0x2d2a25, 0.6);
    const head = this.add.circle(0, -20, 16, 0xcaa279, 1).setStrokeStyle(2, 0x6f4d38, 0.55);
    const hair = this.add.rectangle(0, -31, 25, 9, 0x2f2420, 1);
    const leftEye = this.add.circle(-5, -21, 2, 0x181818, 1);
    const rightEye = this.add.circle(5, -21, 2, 0x181818, 1);

    citizen.add([shadow, body, head, hair, leftEye, rightEye]);

    if (label) {
      const marker = this.add.text(0, -58, label, {
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        color: "#fff2b0",
        stroke: "#221a12",
        strokeThickness: 3
      }).setOrigin(0.5);
      citizen.add(marker);
    }

    this.tweens.add({
      targets: citizen,
      y: y - 4,
      duration: 900 + ((x + y) % 400),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    return citizen;
  }

  createNewLeaderPodium() {
    const stageY = Math.max(170, GAME_HEIGHT * 0.28);
    const podiumY = stageY + 62;

    const leader = this.createPlayerSprite(CENTER_X, podiumY - 8);
    leader.setScale(PLAYER_SCALE * 0.86);
    leader.setTint(0xb8d8ff);
    leader.setDepth(80);
    leader.lastDirection = "down";
    leader.setTexture("kepaladesa_bawah_1");

    if (leader.body) {
      leader.body.enable = false;
    }

    this.add.rectangle(CENTER_X, podiumY + 34, 150, 72, 0x5b382a, 1)
      .setStrokeStyle(4, 0x2d1b16, 1)
      .setDepth(82);
    this.add.text(CENTER_X, podiumY + 32, "PIDATO", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffe7b3"
    }).setOrigin(0.5).setDepth(83);
    this.add.text(CENTER_X, podiumY - 96, "Kepala Desa Baru", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      stroke: "#1d2730",
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(84);
  }

  createSpeechUi() {
    const panelWidth = Math.min(920, GAME_WIDTH - 64);
    const panelHeight = 150;
    const panelY = GAME_HEIGHT - 92;
    const panel = this.add.rectangle(CENTER_X, panelY, panelWidth, panelHeight, 0x171211, 0.9);
    panel.setStrokeStyle(3, 0xe0c08c, 0.6);
    panel.setDepth(160);
    panel.setScrollFactor(0);

    this.speechSpeakerText = this.add.text(CENTER_X - (panelWidth / 2) + 26, panelY - 54, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#ffcf7a"
    });
    this.speechSpeakerText.setDepth(161);
    this.speechSpeakerText.setScrollFactor(0);

    this.speechBodyText = this.add.text(CENTER_X - (panelWidth / 2) + 26, panelY - 20, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "19px",
      color: "#ffffff",
      wordWrap: { width: panelWidth - 52 },
      lineSpacing: 5
    });
    this.speechBodyText.setDepth(161);
    this.speechBodyText.setScrollFactor(0);
  }

  showNextSpeechLine() {
    if (this.speechIndex >= this.speechLines.length) {
      this.endCeremony();
      return;
    }

    const line = this.speechLines[this.speechIndex];
    this.speechSpeakerText.setText(line.speaker);
    this.speechBodyText.setText(line.text);
    this.cameras.main.shake(120, 0.0015);
    this.speechIndex += 1;
    this.time.delayedCall(3100, () => this.showNextSpeechLine());
  }

  endCeremony() {
    this.speechSpeakerText.setText("Narasi");
    this.speechBodyText.setText("Kerumunan bubar pelan. Kekuasaan berganti tangan, tapi desa tetap membawa luka lama.");
    this.time.delayedCall(2200, () => {
      this.cameras.main.fadeOut(1200, 255, 245, 215);
      this.time.delayedCall(1300, () => {
        this.scene.start("SceneSiang", {
          actTwoStart: true
        });
      });
    });
  }
}

class MiniGameScene extends BaseScene {
  constructor() {
    super("MiniGameScene");
    this.numberTargets = [];
    this.timeLimit = 10;
    this.remainingTime = 10;
    this.gameEnded = false;
    this.nextHeartbeatAt = 0;
    this.audioContext = null;
    this.cursorPoint = { x: CENTER_X, y: CENTER_Y };
    this.shakeMultiplier = 1;
    this.rewardAmount = 100;
    this.secondRun = false;
  }

  create(data) {
    this.numberTargets = [];
    this.timeLimit = data && data.secondRun ? 16 : 10;
    this.remainingTime = this.timeLimit;
    this.gameEnded = false;
    this.nextHeartbeatAt = 0;
    this.cursorPoint = { x: CENTER_X, y: CENTER_Y };
    this.secondRun = Boolean(data && data.secondRun);
    this.shakeMultiplier = data && data.shakeMultiplier ? data.shakeMultiplier : 1;
    this.rewardAmount = data && data.reward ? data.reward : 100;
    this.cameras.main.setBackgroundColor("#251d2a");
    this.input.setDefaultCursor("none");

    this.add.text(CENTER_X, 68, "Manipulasi Angka", {
      fontFamily: "Arial, sans-serif",
      fontSize: "38px",
      color: "#f5f7ff"
    }).setOrigin(0.5);

    this.add.text(CENTER_X, 112, "Klik setiap angka 3 kali sebelum waktu habis.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#cbd5f0"
    }).setOrigin(0.5);

    this.createStatusUi();
    this.createTimerUi();
    this.createBudgetDocument();
    this.createCustomCursor();
    this.input.on("pointerdown", this.handlePointerDown, this);
    this.timerEvent = this.time.addEvent({
      delay: 100,
      loop: true,
      callback: this.updateCountdown,
      callbackScope: this
    });

    this.events.once("shutdown", this.shutdownMiniGame, this);
  }

  createTimerUi() {
    this.timerText = this.add.text(GAME_WIDTH - 32, 26, this.remainingTime.toFixed(1), {
      fontFamily: "Courier New, monospace",
      fontSize: "28px",
      color: "#ffdddd"
    }).setOrigin(1, 0);

    this.progressText = this.add.text(GAME_WIDTH - 32, 62, "Angka bersih: 0/5", {
      fontFamily: "Arial, sans-serif",
      fontSize: "17px",
      color: "#f1d7d7"
    }).setOrigin(1, 0);
  }

  createBudgetDocument() {
    const documentPanel = this.add.rectangle(CENTER_X, 426, 760, 500, 0xfffdf7, 1);
    documentPanel.setStrokeStyle(4, 0xddd1b8, 1);

    this.add.text(CENTER_X, 210, "Laporan Anggaran", {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#232323"
    }).setOrigin(0.5);

    this.add.text(CENTER_X, 252, "Proyek Pembangunan Jalan Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#5b5b5b"
    }).setOrigin(0.5);

    const positions = [
      { x: CENTER_X - 210, y: 330 },
      { x: CENTER_X + 210, y: 330 },
      { x: CENTER_X, y: 418 },
      { x: CENTER_X - 210, y: 506 },
      { x: CENTER_X + 210, y: 506 }
    ];

    positions.forEach((position) => {
      const amountText = this.add.text(position.x, position.y, this.createRandomBudgetNumber(), {
        fontFamily: "Courier New, monospace",
        fontSize: "34px",
        color: "#8d1f1f"
      }).setOrigin(0.5);

      this.numberTargets.push({
        text: amountText,
        clicks: 0,
        erased: false
      });
    });
  }

  createRandomBudgetNumber() {
    const millions = Phaser.Math.Between(40, 180);
    return `${millions}.000.000`;
  }

  createCustomCursor() {
    const outerShadow = this.add.circle(0, 0, 16, 0x000000, 0);
    outerShadow.setStrokeStyle(5, 0x000000, 0.95);

    const outer = this.add.circle(0, 0, 13, 0x000000, 0);
    outer.setStrokeStyle(3, 0xffe14d, 1);

    const horizontalShadow = this.add.rectangle(0, 0, 32, 5, 0x000000, 0.95);
    const verticalShadow = this.add.rectangle(0, 0, 5, 32, 0x000000, 0.95);
    const horizontal = this.add.rectangle(0, 0, 28, 2, 0xff3355, 1);
    const vertical = this.add.rectangle(0, 0, 2, 28, 0xff3355, 1);
    const centerDot = this.add.circle(0, 0, 3, 0xffffff, 1);

    this.fakeCursor = this.add.container(CENTER_X, CENTER_Y, [
      outerShadow,
      horizontalShadow,
      verticalShadow,
      outer,
      horizontal,
      vertical,
      centerDot
    ]);
    this.fakeCursor.setDepth(500);
  }

  handlePointerDown() {
    if (this.gameEnded) {
      return;
    }

    this.ensureHeartbeatAudio();

    const clickedTarget = this.numberTargets.find((target) => {
      return !target.erased && Phaser.Geom.Rectangle.Contains(
        target.text.getBounds(),
        this.cursorPoint.x,
        this.cursorPoint.y
      );
    });

    if (!clickedTarget) {
      this.cameras.main.shake(70, 0.002);
      return;
    }

    this.eraseNumber(clickedTarget);
  }

  eraseNumber(target) {
    target.clicks += 1;
    target.text.setAlpha(1 - (target.clicks * 0.2));
    target.text.setScale(1 + (target.clicks * 0.04));
    this.tweens.add({
      targets: target.text,
      scaleX: 1,
      scaleY: 1,
      duration: 90,
      ease: "Sine.easeOut"
    });

    if (target.clicks < 3) {
      return;
    }

    target.erased = true;
    target.text.setText("0");
    target.text.setAlpha(1);
    target.text.setColor("#555555");
    this.updateProgressUi();

    if (this.numberTargets.every((numberTarget) => numberTarget.erased)) {
      this.finishMiniGame(true);
    }
  }

  updateProgressUi() {
    const erasedCount = this.numberTargets.filter((target) => target.erased).length;
    this.progressText.setText(`Angka bersih: ${erasedCount}/${this.numberTargets.length}`);
  }

  updateCountdown() {
    if (this.gameEnded) {
      return;
    }

    this.remainingTime = Math.max(0, this.remainingTime - 0.1);
    this.timerText.setText(this.remainingTime.toFixed(1));

    if (this.remainingTime <= 3) {
      this.timerText.setColor("#ff6a6a");
    }

    if (this.remainingTime <= 0) {
      this.finishMiniGame(false);
    }
  }

  update(time, delta) {
    super.update(time, delta);

    if (this.gameEnded) {
      return;
    }

    this.updateShakingCursor();
    this.updateHeartbeat(time);
  }

  updateShakingCursor() {
    const pointer = this.input.activePointer;
    const urgency = 1 - (this.remainingTime / this.timeLimit);
    const shakePower = Phaser.Math.Linear(3, 48, urgency) * this.shakeMultiplier;
    const offsetX = Phaser.Math.FloatBetween(-shakePower, shakePower);
    const offsetY = Phaser.Math.FloatBetween(-shakePower, shakePower);
    const pointerX = Number.isFinite(pointer.worldX) ? pointer.worldX : pointer.x;
    const pointerY = Number.isFinite(pointer.worldY) ? pointer.worldY : pointer.y;

    this.cursorPoint.x = Phaser.Math.Clamp(pointerX + offsetX, 0, GAME_WIDTH);
    this.cursorPoint.y = Phaser.Math.Clamp(pointerY + offsetY, 0, GAME_HEIGHT);
    this.fakeCursor.setPosition(this.cursorPoint.x, this.cursorPoint.y);
  }

  updateHeartbeat(time) {
    const urgency = 1 - (this.remainingTime / this.timeLimit);
    const heartbeatInterval = Phaser.Math.Linear(920, 260, urgency);

    if (time < this.nextHeartbeatAt) {
      return;
    }

    this.playHeartbeat();
    this.nextHeartbeatAt = time + heartbeatInterval;
  }

  ensureHeartbeatAudio() {
    if (this.audioContext) {
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    this.audioContext = new AudioContextClass();
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  playHeartbeat() {
    this.ensureHeartbeatAudio();

    if (!this.audioContext || this.audioContext.state !== "running") {
      return;
    }

    const now = this.audioContext.currentTime;
    this.playHeartbeatPulse(now, 0, 84, 0.1);
    this.playHeartbeatPulse(now, 0.15, 58, 0.13);
  }

  playHeartbeatPulse(startTime, offset, frequency, duration) {
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const pulseStart = startTime + offset;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, pulseStart);
    gain.gain.setValueAtTime(0.0001, pulseStart);
    gain.gain.exponentialRampToValueAtTime(0.35, pulseStart + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, pulseStart + duration);

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start(pulseStart);
    oscillator.stop(pulseStart + duration + 0.03);
  }

  finishMiniGame(succeeded) {
    if (this.gameEnded) {
      return;
    }

    this.gameEnded = true;
    this.input.setDefaultCursor("default");
    this.input.off("pointerdown", this.handlePointerDown, this);

    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }

    addPersonalWealth(this.rewardAmount);

    const resultMessage = succeeded
      ? "Jejak dihapus... tapi hati tidak tenang"
      : "Warga mulai curiga dengan laporanmu!";

    if (succeeded) {
      gameState.sanity = Math.max(0, gameState.sanity - 20);
    } else {
      gameState.integrity = Math.max(0, gameState.integrity - 40);
    }

    this.updateStatusUi();
    this.showResultMessage(resultMessage);

    this.time.delayedCall(2300, () => {
      gameState.act = 4;
      this.scene.start("SceneSiang", {
        returningFromMiniGame: true,
        miniGameSucceeded: succeeded,
        secondRun: this.secondRun
      });
    });
  }

  showResultMessage(message) {
    this.add.rectangle(CENTER_X, GAME_HEIGHT - 76, 650, 52, 0x111723, 0.9).setDepth(450);
    this.add.text(CENTER_X, GAME_HEIGHT - 76, message, {
      fontFamily: "Arial, sans-serif",
      fontSize: "19px",
      color: "#ffffff"
    }).setOrigin(0.5).setDepth(451);
  }

  shutdownMiniGame() {
    this.input.setDefaultCursor("default");
    this.input.off("pointerdown", this.handlePointerDown, this);

    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}

class MiniGameAct2 extends BaseScene {
  constructor() {
    super("MiniGameAct2");
    this.budgetBalls = [];
    this.duration = 15;
    this.remainingTime = 15;
    this.totalStolen = 0;
    this.gameEnded = false;
    this.audioContext = null;
    this.privateZone = null;
    this.villageZone = null;
    this.spawnTimer = null;
    this.distortionGraphics = null;
    this.draggedBall = null;
    this.actTwoLeaderRun = false;
  }

  create(data) {
    this.budgetBalls = [];
    this.duration = 15;
    this.remainingTime = 15;
    this.totalStolen = 0;
    this.gameEnded = false;
    this.draggedBall = null;
    this.actTwoLeaderRun = Boolean(data && data.actTwoLeaderRun);
    this.cameras.main.setBackgroundColor("#141827");
    this.input.setDefaultCursor("grab");

    this.createStatusUi();
    this.createSpreadsheetBoard();
    this.createActTwoHud();
    this.createDistortionLayer();
    this.bindDragEvents();

    this.spawnBudgetBall();
    this.spawnTimer = this.time.addEvent({
      delay: 620,
      loop: true,
      callback: this.spawnBudgetBall,
      callbackScope: this
    });

    this.events.once("shutdown", this.shutdownMiniGameAct2, this);
  }

  createSpreadsheetBoard() {
    const boardWidth = Math.min(1080, GAME_WIDTH - 80);
    const boardHeight = Math.min(520, GAME_HEIGHT - 190);
    const boardTop = 126;
    const boardLeft = CENTER_X - (boardWidth / 2);
    const columnWidth = boardWidth / 2;
    const boardCenterY = boardTop + (boardHeight / 2);

    this.add.rectangle(CENTER_X, boardCenterY, boardWidth, boardHeight, 0xf1f5f9, 1)
      .setStrokeStyle(4, 0x334155, 1);
    this.add.rectangle(CENTER_X, boardTop + 34, boardWidth, 68, 0xd8e2ef, 1)
      .setStrokeStyle(2, 0x8798aa, 1);
    this.add.line(0, 0, CENTER_X, boardTop, CENTER_X, boardTop + boardHeight, 0x73869b, 1)
      .setLineWidth(3);

    for (let row = 1; row <= 8; row += 1) {
      const y = boardTop + 68 + (row * ((boardHeight - 68) / 9));
      this.add.line(0, 0, boardLeft, y, boardLeft + boardWidth, y, 0xcbd5e1, 0.9).setLineWidth(1);
    }

    this.add.text(boardLeft + (columnWidth / 2), boardTop + 34, "Dana Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#1e3a5f"
    }).setOrigin(0.5);

    this.add.text(boardLeft + columnWidth + (columnWidth / 2), boardTop + 34, "Kantong Pribadi", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#6e1f1f"
    }).setOrigin(0.5);

    this.add.rectangle(boardLeft + (columnWidth / 2), boardCenterY + 28, columnWidth - 36, boardHeight - 112, 0xdff4e7, 0.62)
      .setStrokeStyle(2, 0x8ab69c, 0.8);
    this.add.rectangle(boardLeft + columnWidth + (columnWidth / 2), boardCenterY + 28, columnWidth - 36, boardHeight - 112, 0xfbe2e2, 0.68)
      .setStrokeStyle(2, 0xb95d5d, 0.9);

    this.villageZone = new Phaser.Geom.Rectangle(boardLeft + 18, boardTop + 78, columnWidth - 36, boardHeight - 96);
    this.privateZone = new Phaser.Geom.Rectangle(boardLeft + columnWidth + 18, boardTop + 78, columnWidth - 36, boardHeight - 96);

    this.add.text(CENTER_X, 62, "Pembagian Anggaran Gelap", {
      fontFamily: "Arial, sans-serif",
      fontSize: "38px",
      color: "#f8fafc",
      stroke: "#07111f",
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  createActTwoHud() {
    this.timerText = this.add.text(GAME_WIDTH - 28, 22, "15.0", {
      fontFamily: "Courier New, monospace",
      fontSize: "30px",
      color: "#ffe1e1"
    }).setOrigin(1, 0).setDepth(220);

    this.totalText = this.add.text(GAME_WIDTH - 28, 62, "Uang diseret: 0", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#fff4bd"
    }).setOrigin(1, 0).setDepth(220);

    this.warningText = this.add.text(CENTER_X, GAME_HEIGHT - 34, "Seret bola anggaran ke Kantong Pribadi. Hindari file AUDIT merah.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#e7edf7",
      backgroundColor: "#141827",
      padding: { x: 12, y: 7 },
      align: "center",
      wordWrap: { width: Math.min(900, GAME_WIDTH - 44) }
    }).setOrigin(0.5).setDepth(220);
  }

  createDistortionLayer() {
    this.distortionGraphics = this.add.graphics();
    this.distortionGraphics.setDepth(180);
    this.distortionGraphics.setBlendMode(Phaser.BlendModes.ADD);

    this.redShiftOverlay = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0xff173e, 0.045);
    this.redShiftOverlay.setDepth(181);
    this.redShiftOverlay.setBlendMode(Phaser.BlendModes.ADD);

    this.cyanShiftOverlay = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x17e6ff, 0.035);
    this.cyanShiftOverlay.setDepth(182);
    this.cyanShiftOverlay.setBlendMode(Phaser.BlendModes.ADD);
  }

  bindDragEvents() {
    this.input.on("pointerdown", this.handleActTwoPointerDown, this);
    this.input.on("pointermove", this.handleActTwoPointerMove, this);
    this.input.on("pointerup", this.handleActTwoPointerUp, this);
    this.input.on("pointerupoutside", this.handleActTwoPointerUp, this);
  }

  spawnBudgetBall() {
    if (this.gameEnded) {
      return;
    }

    const isAudit = Phaser.Math.Between(1, 100) <= 18;
    const amount = Phaser.Utils.Array.GetRandom([20, 35, 50, 75, 100]);
    const x = Phaser.Math.Between(58, GAME_WIDTH - 58);
    const ball = this.add.container(x, 104);
    ball.setSize(74, 74);
    ball.setDepth(90);
    ball.ballData = {
      amount,
      isAudit,
      dragging: false,
      removed: false
    };

    const ghostRed = this.add.circle(-5, 0, 31, 0xff2551, isAudit ? 0.22 : 0.18);
    const ghostCyan = this.add.circle(5, 0, 31, 0x2df7ff, isAudit ? 0.18 : 0.14);
    const fill = this.add.circle(0, 0, 30, isAudit ? 0xb31325 : 0xf7d15f, 1)
      .setStrokeStyle(4, isAudit ? 0x5c0710 : 0x6f5218, 1);
    const label = this.add.text(0, -2, isAudit ? "AUDIT" : `${amount}jt`, {
      fontFamily: "Arial, sans-serif",
      fontSize: isAudit ? "15px" : "18px",
      color: isAudit ? "#ffffff" : "#1f2937",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const hitHint = this.add.circle(0, 0, 40, 0xffffff, 0.001);
    ball.add([hitHint, ghostRed, ghostCyan, fill, label]);
    this.budgetBalls.push(ball);

    if (isAudit) {
      this.tweens.add({
        targets: ball,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 260,
        yoyo: true,
        repeat: -1
      });
    }
  }

  handleActTwoPointerDown(pointer) {
    if (this.gameEnded) {
      return;
    }

    const pointerPosition = this.getActTwoPointerPosition(pointer);
    const ball = this.findBudgetBallAt(pointerPosition.x, pointerPosition.y);

    if (!ball) {
      return;
    }

    this.ensureActTwoAudio();
    this.draggedBall = ball;
    ball.ballData.dragging = true;
    ball.setDepth(240);
    this.input.setDefaultCursor("grabbing");
  }

  handleActTwoPointerMove(pointer) {
    if (this.gameEnded || !this.draggedBall || !this.draggedBall.ballData) {
      return;
    }

    const pointerPosition = this.getActTwoPointerPosition(pointer);
    this.draggedBall.setPosition(pointerPosition.x, pointerPosition.y);
  }

  handleActTwoPointerUp() {
    if (this.gameEnded || !this.draggedBall || !this.draggedBall.ballData) {
      return;
    }

    const ball = this.draggedBall;
    this.draggedBall = null;

    if (ball.ballData.removed) {
      return;
    }

    ball.ballData.dragging = false;
    ball.setDepth(90);
    this.input.setDefaultCursor("grab");

    if (Phaser.Geom.Rectangle.Contains(this.privateZone, ball.x, ball.y)) {
      this.collectPrivateBall(ball);
      return;
    }

    if (Phaser.Geom.Rectangle.Contains(this.villageZone, ball.x, ball.y)) {
      this.removeBudgetBall(ball);
    }
  }

  getActTwoPointerPosition(pointer) {
    return {
      x: Number.isFinite(pointer.worldX) ? pointer.worldX : pointer.x,
      y: Number.isFinite(pointer.worldY) ? pointer.worldY : pointer.y
    };
  }

  findBudgetBallAt(x, y) {
    for (let index = this.budgetBalls.length - 1; index >= 0; index -= 1) {
      const ball = this.budgetBalls[index];

      if (!ball || !ball.ballData || ball.ballData.removed) {
        continue;
      }

      if (Phaser.Math.Distance.Between(x, y, ball.x, ball.y) <= 58) {
        return ball;
      }
    }

    return null;
  }

  collectPrivateBall(ball) {
    if (ball.ballData.isAudit) {
      gameState.integrity = Math.max(0, gameState.integrity - 35);
      this.updateStatusUi();
      this.playSoftSiren();
      this.flashAuditWarning();
      this.removeBudgetBall(ball);
      return;
    }

    this.totalStolen += ball.ballData.amount;
    this.totalText.setText(`Uang diseret: ${this.totalStolen}`);
    this.playCashBlip();
    this.cameras.main.shake(90, 0.0025);
    this.removeBudgetBall(ball);
  }

  flashAuditWarning() {
    this.warningText.setText("AUDIT masuk kantong pribadi. Integrity jatuh.");
    this.warningText.setColor("#ffb4b4");
    this.cameras.main.shake(420, 0.011);

    const flash = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0xff001d, 0.22);
    flash.setDepth(260);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 620,
      onComplete: () => flash.destroy()
    });

    this.time.delayedCall(1300, () => {
      if (!this.gameEnded && this.warningText) {
        this.warningText.setText("Seret bola anggaran ke Kantong Pribadi. Hindari file AUDIT merah.");
        this.warningText.setColor("#e7edf7");
      }
    });
  }

  removeBudgetBall(ball) {
    ball.ballData.removed = true;
    if (this.draggedBall === ball) {
      this.draggedBall = null;
    }

    Phaser.Utils.Array.Remove(this.budgetBalls, ball);
    this.tweens.killTweensOf(ball);
    ball.destroy();
  }

  update(time, delta) {
    super.update(time, delta);

    if (this.gameEnded) {
      return;
    }

    this.remainingTime = Math.max(0, this.remainingTime - (delta / 1000));
    this.timerText.setText(this.remainingTime.toFixed(1));

    if (this.remainingTime <= 5) {
      this.timerText.setColor("#ff6f6f");
    }

    this.updateFallingBalls(delta);
    this.updateMentalDistortion(time);

    if (this.remainingTime <= 0) {
      this.finishActTwoMiniGame();
    }
  }

  updateFallingBalls(delta) {
    const speed = 125 + (this.totalStolen * 0.85) + ((this.duration - this.remainingTime) * 7);

    [...this.budgetBalls].forEach((ball) => {
      if (!ball.ballData || ball.ballData.dragging || ball.ballData.removed) {
        return;
      }

      ball.y += speed * (delta / 1000);

      if (ball.y > GAME_HEIGHT + 70) {
        this.removeBudgetBall(ball);
      }
    });
  }

  updateMentalDistortion(time) {
    const greed = Phaser.Math.Clamp(this.totalStolen / 650, 0, 1);
    const pulse = Math.sin(time * 0.004);
    const wavePower = 8 + (greed * 24);

    this.redShiftOverlay.setAlpha(0.035 + (greed * 0.06));
    this.cyanShiftOverlay.setAlpha(0.025 + (greed * 0.045));
    this.redShiftOverlay.setX(CENTER_X + Math.sin(time * 0.006) * (4 + greed * 10));
    this.cyanShiftOverlay.setX(CENTER_X - Math.cos(time * 0.005) * (4 + greed * 10));

    this.distortionGraphics.clear();
    this.distortionGraphics.lineStyle(2, 0x7cf7ff, 0.08 + (greed * 0.12));

    for (let y = 96; y < GAME_HEIGHT; y += 24) {
      const offset = Math.sin((time * 0.006) + (y * 0.045)) * wavePower;
      this.distortionGraphics.beginPath();
      this.distortionGraphics.moveTo(-20 + offset, y);
      this.distortionGraphics.lineTo(GAME_WIDTH + 20 + offset, y + Math.sin(time * 0.004 + y) * 4);
      this.distortionGraphics.strokePath();
    }
  }

  finishActTwoMiniGame() {
    if (this.gameEnded) {
      return;
    }

    this.gameEnded = true;
    this.input.setDefaultCursor("default");
    this.draggedBall = null;
    resetCameraView(this.cameras.main);

    if (this.spawnTimer) {
      this.spawnTimer.remove(false);
      this.spawnTimer = null;
    }

    addPersonalWealth(this.totalStolen);
    gameState.act = this.actTwoLeaderRun ? 2 : 6;
    gameState.sanity = Math.max(0, gameState.sanity - 15);
    this.updateStatusUi();

    [...this.budgetBalls].forEach((ball) => this.removeBudgetBall(ball));

    this.add.rectangle(CENTER_X, CENTER_Y, Math.min(720, GAME_WIDTH - 80), 132, 0x090b12, 0.92)
      .setStrokeStyle(3, 0xffd37a, 0.55)
      .setDepth(300);
    this.add.text(CENTER_X, CENTER_Y, `Total masuk kantong: ${this.totalStolen}\nMalam terasa lebih berat dari sebelumnya.`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#ffffff",
      align: "center",
      lineSpacing: 8
    }).setOrigin(0.5).setDepth(301);

    this.time.delayedCall(2300, () => {
      this.input.setDefaultCursor("default");

      if (this.actTwoLeaderRun) {
        this.scene.start("SceneSiang", {
          actTwoStart: true,
          actTwoAfterMiniGame: true
        });
        return;
      }

      this.scene.start("SceneSiang", {
        returningFromMiniGame: true,
        miniGameSucceeded: true,
        secondRun: true
      });
    });
  }

  ensureActTwoAudio() {
    if (this.audioContext) {
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    this.audioContext = new AudioContextClass();
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  playCashBlip() {
    this.ensureActTwoAudio();

    if (!this.audioContext || this.audioContext.state !== "running") {
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
  }

  playSoftSiren() {
    this.ensureActTwoAudio();

    if (!this.audioContext || this.audioContext.state !== "running") {
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(430, now);
    oscillator.frequency.linearRampToValueAtTime(720, now + 0.34);
    oscillator.frequency.linearRampToValueAtTime(430, now + 0.72);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.78);
    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.82);
  }

  shutdownMiniGameAct2() {
    this.input.setDefaultCursor("default");
    this.input.off("pointerdown", this.handleActTwoPointerDown, this);
    this.input.off("pointermove", this.handleActTwoPointerMove, this);
    this.input.off("pointerup", this.handleActTwoPointerUp, this);
    this.input.off("pointerupoutside", this.handleActTwoPointerUp, this);

    if (this.spawnTimer) {
      this.spawnTimer.remove(false);
      this.spawnTimer = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}

class MiniGameLaundering extends BaseScene {
  constructor() {
    super("MiniGameLaundering");
    this.funds = [];
    this.draggedFund = null;
    this.totalStolen = 0;
    this.duration = 15;
    this.remainingTime = 15;
    this.gameEnded = false;
    this.secretZone = null;
    this.villageZone = null;
    this.spawnTimer = null;
    this.audioContext = null;
    this.bgmNodes = null;
  }

  create() {
    this.funds = [];
    this.draggedFund = null;
    this.totalStolen = 0;
    this.duration = 15;
    this.remainingTime = 15;
    this.gameEnded = false;
    this.secretZone = null;
    this.villageZone = null;
    this.spawnTimer = null;
    this.cameras.main.setBackgroundColor("#101827");
    this.input.setDefaultCursor("grab");

    this.createStatusUi();
    this.createLaunderingDashboard();
    this.createLaunderingHud();
    this.createGreedLayer();
    this.bindLaunderingInput();

    this.spawnFallingFund();
    this.spawnTimer = this.time.addEvent({
      delay: 560,
      loop: true,
      callback: this.spawnFallingFund,
      callbackScope: this
    });

    this.events.once("shutdown", this.shutdownMiniGameLaundering, this);
  }

  createLaunderingDashboard() {
    const boardWidth = Math.min(1120, GAME_WIDTH - 76);
    const boardHeight = Math.min(540, GAME_HEIGHT - 178);
    const boardTop = 116;
    const boardLeft = CENTER_X - (boardWidth / 2);
    const boardCenterY = boardTop + (boardHeight / 2);
    const columnWidth = boardWidth / 2;

    this.add.rectangle(CENTER_X, boardCenterY, boardWidth, boardHeight, 0x0f1d2b, 1)
      .setStrokeStyle(4, 0x7bd3ff, 0.62);
    this.add.rectangle(CENTER_X, boardTop + 34, boardWidth, 68, 0x17344a, 1)
      .setStrokeStyle(2, 0x7bd3ff, 0.42);
    this.add.line(0, 0, CENTER_X, boardTop, CENTER_X, boardTop + boardHeight, 0x7bd3ff, 0.55)
      .setLineWidth(3);

    for (let row = 1; row <= 9; row += 1) {
      const y = boardTop + 68 + (row * ((boardHeight - 82) / 10));
      this.add.line(0, 0, boardLeft, y, boardLeft + boardWidth, y, 0x355b72, 0.72).setLineWidth(1);
    }

    this.add.text(boardLeft + (columnWidth / 2), boardTop + 34, "Dana Desa", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#c9f4ff"
    }).setOrigin(0.5);

    this.add.text(boardLeft + columnWidth + (columnWidth / 2), boardTop + 34, "Rekening Rahasia", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#ffe099"
    }).setOrigin(0.5);

    this.add.rectangle(boardLeft + (columnWidth / 2), boardCenterY + 24, columnWidth - 34, boardHeight - 112, 0x123545, 0.78)
      .setStrokeStyle(2, 0x5db8d5, 0.72);
    this.add.rectangle(boardLeft + columnWidth + (columnWidth / 2), boardCenterY + 24, columnWidth - 34, boardHeight - 112, 0x3a2410, 0.82)
      .setStrokeStyle(2, 0xf4c95d, 0.85);

    this.villageZone = new Phaser.Geom.Rectangle(boardLeft + 17, boardTop + 78, columnWidth - 34, boardHeight - 98);
    this.secretZone = new Phaser.Geom.Rectangle(boardLeft + columnWidth + 17, boardTop + 78, columnWidth - 34, boardHeight - 98);

    this.add.text(CENTER_X, 58, "Pencucian Dana Proyek", {
      fontFamily: "Arial, sans-serif",
      fontSize: "38px",
      color: "#f8fbff",
      stroke: "#020914",
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  createLaunderingHud() {
    this.timerText = this.add.text(GAME_WIDTH - 28, 22, "15.0", {
      fontFamily: "Courier New, monospace",
      fontSize: "30px",
      color: "#ffe9e9"
    }).setOrigin(1, 0).setDepth(240);

    this.totalText = this.add.text(GAME_WIDTH - 28, 62, "Dicuci: 0 Juta", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#fff3bd"
    }).setOrigin(1, 0).setDepth(240);

    this.helpText = this.add.text(CENTER_X, GAME_HEIGHT - 34, "Seret dana ke Rekening Rahasia. Jangan sentuh AUDIT merah.", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#dff7ff",
      backgroundColor: "#0b1420",
      padding: { x: 12, y: 7 },
      align: "center",
      wordWrap: { width: Math.min(900, GAME_WIDTH - 44) }
    }).setOrigin(0.5).setDepth(240);
  }

  createGreedLayer() {
    this.greedOverlay = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0xffdc45, 0);
    this.greedOverlay.setDepth(190);
    this.greedOverlay.setBlendMode(Phaser.BlendModes.ADD);

    this.greedPulse = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0xff2f7d, 0);
    this.greedPulse.setDepth(191);
    this.greedPulse.setBlendMode(Phaser.BlendModes.ADD);
  }

  bindLaunderingInput() {
    this.input.on("pointerdown", this.handleLaunderingPointerDown, this);
    this.input.on("pointermove", this.handleLaunderingPointerMove, this);
    this.input.on("pointerup", this.handleLaunderingPointerUp, this);
    this.input.on("pointerupoutside", this.handleLaunderingPointerUp, this);
  }

  spawnFallingFund() {
    if (this.gameEnded) {
      return;
    }

    const isAudit = Phaser.Math.Between(1, 100) <= 20;
    const amount = Phaser.Utils.Array.GetRandom([25, 40, 50, 75, 100]);
    const x = Phaser.Math.Between(70, GAME_WIDTH - 70);
    const fund = this.add.container(x, 102);
    fund.setDepth(90);
    fund.fundData = {
      amount,
      isAudit,
      dragging: false,
      removed: false
    };

    const glow = this.add.circle(0, 0, 42, isAudit ? 0xff1028 : 0xffe16a, isAudit ? 0.18 : 0.12);
    const body = this.add.circle(0, 0, 31, isAudit ? 0xc51324 : 0xf4cf5b, 1)
      .setStrokeStyle(4, isAudit ? 0x5a0710 : 0x705218, 1);
    const icon = this.add.text(0, isAudit ? -4 : -2, isAudit ? "AUDIT" : `${amount}J`, {
      fontFamily: "Arial, sans-serif",
      fontSize: isAudit ? "13px" : "18px",
      color: isAudit ? "#ffffff" : "#182235",
      fontStyle: "bold"
    }).setOrigin(0.5);
    const lens = isAudit ? this.add.circle(13, 12, 8, 0xffffff, 0).setStrokeStyle(2, 0xffffff, 0.95) : null;
    const handle = isAudit ? this.add.line(0, 0, 20, 20, 28, 28, 0xffffff, 0.95).setLineWidth(3) : null;

    fund.add(isAudit ? [glow, body, icon, lens, handle] : [glow, body, icon]);
    this.funds.push(fund);

    if (isAudit) {
      this.tweens.add({
        targets: fund,
        scaleX: 1.12,
        scaleY: 1.12,
        duration: 260,
        yoyo: true,
        repeat: -1
      });
    }
  }

  handleLaunderingPointerDown(pointer) {
    if (this.gameEnded) {
      return;
    }

    this.ensureLaunderingBgm();
    const pointerPosition = this.getLaunderingPointerPosition(pointer);
    const fund = this.findFundAt(pointerPosition.x, pointerPosition.y);

    if (!fund) {
      return;
    }

    if (fund.fundData.isAudit) {
      this.triggerAuditPenalty(fund);
      return;
    }

    this.draggedFund = fund;
    fund.fundData.dragging = true;
    fund.setDepth(250);
    this.input.setDefaultCursor("grabbing");
  }

  handleLaunderingPointerMove(pointer) {
    if (this.gameEnded || !this.draggedFund || !this.draggedFund.fundData) {
      return;
    }

    const pointerPosition = this.getLaunderingPointerPosition(pointer);
    this.draggedFund.setPosition(pointerPosition.x, pointerPosition.y);
    this.checkDraggedFundAuditCollision();
  }

  handleLaunderingPointerUp() {
    if (this.gameEnded || !this.draggedFund || !this.draggedFund.fundData) {
      return;
    }

    const fund = this.draggedFund;
    this.draggedFund = null;

    if (fund.fundData.removed) {
      return;
    }

    fund.fundData.dragging = false;
    fund.setDepth(90);
    this.input.setDefaultCursor("grab");

    if (Phaser.Geom.Rectangle.Contains(this.secretZone, fund.x, fund.y)) {
      this.collectSecretFund(fund);
      return;
    }

    if (Phaser.Geom.Rectangle.Contains(this.villageZone, fund.x, fund.y)) {
      this.removeLaunderingFund(fund);
    }
  }

  getLaunderingPointerPosition(pointer) {
    return {
      x: Number.isFinite(pointer.worldX) ? pointer.worldX : pointer.x,
      y: Number.isFinite(pointer.worldY) ? pointer.worldY : pointer.y
    };
  }

  findFundAt(x, y) {
    for (let index = this.funds.length - 1; index >= 0; index -= 1) {
      const fund = this.funds[index];

      if (!fund || !fund.fundData || fund.fundData.removed) {
        continue;
      }

      if (Phaser.Math.Distance.Between(x, y, fund.x, fund.y) <= 58) {
        return fund;
      }
    }

    return null;
  }

  checkDraggedFundAuditCollision() {
    if (!this.draggedFund || this.draggedFund.fundData.isAudit) {
      return;
    }

    const auditFund = this.funds.find((fund) => {
      return fund &&
        fund.fundData &&
        fund.fundData.isAudit &&
        !fund.fundData.removed &&
        Phaser.Math.Distance.Between(this.draggedFund.x, this.draggedFund.y, fund.x, fund.y) < 48;
    });

    if (auditFund) {
      this.triggerAuditPenalty(auditFund);
    }
  }

  collectSecretFund(fund) {
    this.totalStolen += fund.fundData.amount;
    this.totalText.setText(`Dicuci: ${this.totalStolen} Juta`);
    this.playLaunderingBlip();
    this.cameras.main.shake(80, 0.002);
    this.removeLaunderingFund(fund);
  }

  triggerAuditPenalty(fund) {
    gameState.integrity = Math.max(0, gameState.integrity - 20);
    this.updateStatusUi();
    this.flashAuditScreen();
    this.playAuditSiren();
    this.removeLaunderingFund(fund);
  }

  flashAuditScreen() {
    this.helpText.setText("AUDIT menyentuh aliran dana. Integrity desa -20.");
    this.helpText.setColor("#ffb7b7");
    this.cameras.main.shake(360, 0.01);

    const flash = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0xff001d, 0.32);
    flash.setDepth(300);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 540,
      onComplete: () => flash.destroy()
    });

    this.time.delayedCall(1200, () => {
      if (!this.gameEnded && this.helpText) {
        this.helpText.setText("Seret dana ke Rekening Rahasia. Jangan sentuh AUDIT merah.");
        this.helpText.setColor("#dff7ff");
      }
    });
  }

  removeLaunderingFund(fund) {
    fund.fundData.removed = true;

    if (this.draggedFund === fund) {
      this.draggedFund = null;
    }

    Phaser.Utils.Array.Remove(this.funds, fund);
    this.tweens.killTweensOf(fund);
    fund.destroy();
  }

  update(time, delta) {
    super.update(time, delta);

    if (this.gameEnded) {
      return;
    }

    this.remainingTime = Math.max(0, this.remainingTime - (delta / 1000));
    this.timerText.setText(this.remainingTime.toFixed(1));

    if (this.remainingTime <= 5) {
      this.timerText.setColor("#ff7474");
    }

    this.updateLaunderingFunds(delta);
    this.updateGreedEffects(time);
    this.updateLaunderingBgm();

    if (this.remainingTime <= 0) {
      this.finishLaundering();
    }
  }

  updateLaunderingFunds(delta) {
    const speed = 116 + (this.totalStolen * 0.5) + ((this.duration - this.remainingTime) * 8);

    [...this.funds].forEach((fund) => {
      if (!fund.fundData || fund.fundData.dragging || fund.fundData.removed) {
        return;
      }

      fund.y += speed * (delta / 1000);

      if (fund.y > GAME_HEIGHT + 70) {
        this.removeLaunderingFund(fund);
      }
    });
  }

  updateGreedEffects(time) {
    const greed = Phaser.Math.Clamp(this.totalStolen / 700, 0, 1);
    this.greedOverlay.setAlpha(0.04 + (greed * 0.18));
    this.greedPulse.setAlpha((0.03 + greed * 0.09) * (0.5 + (Math.sin(time * 0.009) * 0.5)));
  }

  finishLaundering() {
    if (this.gameEnded) {
      return;
    }

    this.gameEnded = true;
    this.input.setDefaultCursor("default");
    this.draggedFund = null;
    resetCameraView(this.cameras.main);

    if (this.spawnTimer) {
      this.spawnTimer.remove(false);
      this.spawnTimer = null;
    }

    addPersonalWealth(this.totalStolen);
    gameState.act = 2;
    gameState.sanity = Math.max(0, gameState.sanity - 12);
    gameState.actTwoOfficeLuxury = true;
    this.updateStatusUi();
    [...this.funds].forEach((fund) => this.removeLaunderingFund(fund));

    this.add.rectangle(CENTER_X, CENTER_Y, Math.min(820, GAME_WIDTH - 80), 150, 0x080d14, 0.94)
      .setStrokeStyle(3, 0xffd15a, 0.62)
      .setDepth(310);
    this.add.text(CENTER_X, CENTER_Y, `Total uang dicuri: ${this.totalStolen} Juta\nKantor diperbaiki, tapi perut warga masih kosong.`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#ffffff",
      align: "center",
      lineSpacing: 8,
      wordWrap: { width: Math.min(760, GAME_WIDTH - 120) }
    }).setOrigin(0.5).setDepth(311);

    this.time.delayedCall(2700, () => {
      this.scene.start("SceneSiang", {
        actTwoStart: true,
        actTwoAfterMiniGame: true,
        actTwoLuxuryReveal: true
      });
    });
  }

  ensureLaunderingBgm() {
    if (this.audioContext) {
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    try {
      this.audioContext = new AudioContextClass();
      const bass = this.audioContext.createOscillator();
      const pulse = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      bass.type = "sawtooth";
      pulse.type = "square";
      bass.frequency.setValueAtTime(92, this.audioContext.currentTime);
      pulse.frequency.setValueAtTime(3.4, this.audioContext.currentTime);
      gain.gain.setValueAtTime(0.045, this.audioContext.currentTime);
      bass.connect(gain);
      pulse.connect(gain);
      gain.connect(this.audioContext.destination);
      bass.start();
      pulse.start();
      this.bgmNodes = { bass, pulse, gain };
    } catch (error) {
      this.audioContext = null;
      this.bgmNodes = null;
    }
  }

  updateLaunderingBgm() {
    if (!this.audioContext || !this.bgmNodes || this.audioContext.state !== "running") {
      return;
    }

    const greed = Phaser.Math.Clamp(this.totalStolen / 700, 0, 1);
    const now = this.audioContext.currentTime;
    this.bgmNodes.bass.frequency.setTargetAtTime(92 + (greed * 92), now, 0.08);
    this.bgmNodes.pulse.frequency.setTargetAtTime(3.4 + (greed * 9), now, 0.08);
    this.bgmNodes.gain.gain.setTargetAtTime(0.045 + (greed * 0.075), now, 0.08);
  }

  playLaunderingBlip() {
    this.ensureLaunderingBgm();

    if (!this.audioContext || this.audioContext.state !== "running") {
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(580, now);
    oscillator.frequency.exponentialRampToValueAtTime(980, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.17);
  }

  playAuditSiren() {
    this.ensureLaunderingBgm();

    if (!this.audioContext || this.audioContext.state !== "running") {
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(420, now);
    oscillator.frequency.linearRampToValueAtTime(780, now + 0.24);
    oscillator.frequency.linearRampToValueAtTime(420, now + 0.48);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.58);
  }

  shutdownMiniGameLaundering() {
    this.input.setDefaultCursor("default");
    this.input.off("pointerdown", this.handleLaunderingPointerDown, this);
    this.input.off("pointermove", this.handleLaunderingPointerMove, this);
    this.input.off("pointerup", this.handleLaunderingPointerUp, this);
    this.input.off("pointerupoutside", this.handleLaunderingPointerUp, this);

    if (this.spawnTimer) {
      this.spawnTimer.remove(false);
      this.spawnTimer = null;
    }

    if (this.bgmNodes) {
      try {
        this.bgmNodes.bass.stop();
        this.bgmNodes.pulse.stop();
      } catch (error) {
        // Audio may already be stopped while leaving the scene.
      }
      this.bgmNodes = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }

    this.audioContext = null;
  }
}

class SceneEnding extends BaseScene {
  constructor() {
    super("SceneEnding");
    this.mapWidth = 2600;
    this.mapHeight = 900;
    this.walkEnded = false;
    this.restartButton = null;
  }

  preload() {
    this.loadPlayerAssets();
    this.loadVillageAssets();
  }

  create() {
    gameState.act = 3;
    gameState.integrity = 0;
    gameState.sanity = 0;
    gameState.wealth = -500;
    this.walkEnded = false;
    this.cameras.main.setBackgroundColor("#0d0b0a");
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);

    this.createApocalypseMap();
    this.createFinalWalkCrowd();
    this.createEndingPlayer();
    this.createStatusUi();
    this.setupEndingCamera();
    this.startFinalWalk();
  }

  createApocalypseMap() {
    this.add.rectangle(this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 0x1b1714, 1);
    this.addTileArea("grassNight", this.mapWidth / 2, this.mapHeight / 2, this.mapWidth, this.mapHeight, 1, {
      tileScale: 2.5,
      tint: 0x2a221f
    });
    this.add.rectangle(this.mapWidth / 2, 520, this.mapWidth - 120, 180, 0x282421, 1).setStrokeStyle(4, 0x080706, 1);
    this.addTileArea("groundNight", this.mapWidth / 2, 520, this.mapWidth - 120, 180, 2, {
      tileScale: 2.2,
      tint: 0x39322e
    });
    this.add.rectangle(this.mapWidth / 2, 520, this.mapWidth - 180, 118, 0x151313, 0.75);

    for (let index = 0; index < 34; index += 1) {
      const x = 120 + (index * 74);
      const y = 462 + ((index % 4) * 28);
      const waterKey = ["waterDetail1Night", "waterDetail2Night", "waterDetail3Night"][index % 3];
      this.addVillageAsset(waterKey, x - 6, y + 3, 2.1, 4, { tint: 0x0c0b0b, alpha: 0.78 });
      this.add.ellipse(x, y, Phaser.Math.Between(52, 96), Phaser.Math.Between(18, 34), 0x030303, 0.78);
      this.add.rectangle(x + 16, y - 16, Phaser.Math.Between(26, 72), 9, 0x3c352f, 1)
        .setRotation(Phaser.Math.FloatBetween(-0.75, 0.75));
      this.add.circle(x - 22, y + 8, Phaser.Math.Between(8, 18), 0x090808, 0.85);
    }

    for (let index = 0; index < 18; index += 1) {
      const x = 90 + (index * 145);
      const y = index % 2 === 0 ? 230 : 710;
      this.addVillageAsset(["tree1Night", "tree2Night", "tree3Night"][index % 3], x, y + 34, 1.55, 5, {
        tint: 0x090909,
        alpha: 0.82
      });
      this.add.rectangle(x, y + 36, 16, 90, 0x050403, 1);
      this.add.line(0, 0, x, y - 2, x - 34, y - 58, 0x050403, 1).setLineWidth(7);
      this.add.line(0, 0, x, y + 6, x + 42, y - 48, 0x050403, 1).setLineWidth(6);
      this.add.line(0, 0, x, y + 28, x - 28, y - 16, 0x050403, 1).setLineWidth(5);
    }

    const shacks = [
      [290, 260], [650, 720], [1020, 260], [1360, 725], [1700, 260], [2070, 720], [2360, 282]
    ];
    shacks.forEach(([x, y], index) => {
      this.add.rectangle(x, y, 190, 118, index % 2 === 0 ? 0x4b3d31 : 0x3e3d3b, 1).setStrokeStyle(3, 0x11100f, 1);
      this.addVillageAsset(index % 2 === 0 ? "house1Night" : "house2Night", x, y - 6, index % 2 === 0 ? 1.32 : 1.12, 6, {
        tint: 0x4a4039,
        alpha: 0.82
      });
      this.add.rectangle(x + 8, y - 72, 214, 34, 0x5d6264, 1)
        .setStrokeStyle(3, 0x171817, 1)
        .setRotation(index % 2 === 0 ? -0.08 : 0.07);
      this.add.rectangle(x - 50, y + 12, 48, 78, 0x17110f, 1);
      this.add.line(0, 0, x - 86, y - 38, x + 88, y + 42, 0x120f0d, 1).setLineWidth(4);
    });

    this.add.text(210, 110, "Desa Setelah Semuanya Diambil", {
      fontFamily: "Arial, sans-serif",
      fontSize: "30px",
      color: "#cfc2b4",
      backgroundColor: "#0f0c0b",
      padding: { x: 12, y: 7 }
    }).setOrigin(0, 0.5);

    this.createHungryChild(1450, 430);
  }

  createHungryChild(x, y) {
    this.add.rectangle(x, y + 28, 32, 42, 0x5f554c, 1).setStrokeStyle(2, 0x17110f, 1);
    this.add.circle(x, y - 8, 16, 0xb59b85, 1).setStrokeStyle(2, 0x271b17, 1);
    this.add.rectangle(x - 7, y - 12, 4, 3, 0x17100d, 1);
    this.add.rectangle(x + 7, y - 12, 4, 3, 0x17100d, 1);
    this.add.rectangle(x, y + 1, 15, 3, 0x2a1512, 1);
    this.add.line(0, 0, x - 12, y + 46, x - 30, y + 66, 0x5f554c, 1).setLineWidth(5);
    this.add.line(0, 0, x + 12, y + 46, x + 30, y + 66, 0x5f554c, 1).setLineWidth(5);
    this.add.text(x, y - 52, "Kelaparan", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#eadccc",
      backgroundColor: "#17110f",
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5);
  }

  createFinalWalkCrowd() {
    for (let index = 0; index < 26; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const x = 280 + (index * 82);
      const y = 520 + (side * 112) + ((index % 3) * 12);
      this.createHopelessVillager(x, y);
    }
  }

  createHopelessVillager(x, y) {
    this.add.rectangle(x, y + 18, 30, 54, 0x3b3732, 1).setStrokeStyle(2, 0x11100f, 1);
    this.add.circle(x, y - 24, 15, 0xb49a86, 1).setStrokeStyle(2, 0x1a1210, 1);
    this.add.rectangle(x - 5, y - 20, 4, 3, 0x201512, 1);
    this.add.rectangle(x + 5, y - 20, 4, 3, 0x201512, 1);
    this.add.rectangle(x, y - 10, 16, 3, 0x2b1715, 1);
    this.add.line(0, 0, x - 15, y - 12, x - 28, y + 18, 0x3b3732, 1).setLineWidth(5);
    this.add.line(0, 0, x + 15, y - 12, x + 28, y + 18, 0x3b3732, 1).setLineWidth(5);
  }

  createEndingPlayer() {
    this.player = this.createPlayerSprite(120, 520);
    this.player.body.setCollideWorldBounds(true);
    this.playerLabel = this.add.text(this.player.x, this.getPlayerLabelY(this.player), "Kepala Desa III", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#e7f0ff",
      backgroundColor: "#17110f",
      padding: { x: 6, y: 2 }
    }).setOrigin(0.5);
  }

  setupEndingCamera() {
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(160, 80);
  }

  startFinalWalk() {
    this.player.body.setVelocity(95, 0);
    this.updatePlayerAnimation(this.player);
    this.time.delayedCall(1300, () => this.showEndingLine("Inilah warisan yang kalian bangun."));
    this.time.delayedCall(4700, () => this.showEndingLine("Emas di kantor desa tidak bisa dimakan."));
    this.time.delayedCall(8200, () => this.showEndingLine("Korupsi tidak hanya mencuri uang, ia mencuri masa depan."));
  }

  showEndingLine(message) {
    const text = this.add.text(CENTER_X, CENTER_Y, message, {
      fontFamily: "Arial, sans-serif",
      fontSize: "34px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: Math.min(920, GAME_WIDTH - 90) },
      stroke: "#000000",
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(180);
    text.setScrollFactor(0);
    text.setAlpha(0);

    this.tweens.add({
      targets: text,
      alpha: 1,
      duration: 650,
      yoyo: true,
      hold: 1800,
      onComplete: () => text.destroy()
    });
  }

  update() {
    super.update();

    if (!this.player || this.walkEnded) {
      return;
    }

    this.playerLabel.setPosition(this.player.x, this.getPlayerLabelY(this.player));

    if (this.player.x >= this.mapWidth - 360) {
      this.finishFinalWalk();
    }
  }

  finishFinalWalk() {
    if (this.walkEnded) {
      return;
    }

    this.walkEnded = true;
    this.player.body.setVelocity(0, 0);
    this.updatePlayerAnimation(this.player);
    this.cameras.main.fadeOut(2200, 0, 0, 0);
    this.time.delayedCall(2400, () => this.showGameOverScreen());
  }

  showGameOverScreen() {
    resetCameraView(this.cameras.main);
    this.cameras.main.stopFollow();
    this.cameras.main.setScroll(0, 0);

    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1)
      .setDepth(300)
      .setScrollFactor(0);

    const total = gameState.totalCorrupted || Math.max(0, gameState.personalWealth);
    this.add.text(CENTER_X, CENTER_Y - 126, "GAME OVER", {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "48px",
      color: "#ffeded",
      stroke: "#6b0000",
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(301).setScrollFactor(0);

    this.add.text(CENTER_X, CENTER_Y - 24, `Total Uang yang Dikorupsi: ${total}\nNyawa Desa: Mati`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "25px",
      color: "#ffffff",
      align: "center",
      lineSpacing: 14
    }).setOrigin(0.5).setDepth(301).setScrollFactor(0);

    this.restartButton = this.add.rectangle(CENTER_X, CENTER_Y + 116, 270, 54, 0xeadccc, 1)
      .setStrokeStyle(3, 0x3b1717, 1)
      .setInteractive({ useHandCursor: true })
      .setDepth(301)
      .setScrollFactor(0);

    const restartLabel = this.add.text(CENTER_X, CENTER_Y + 116, "Renungkan (Restart)", {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#1b1110"
    }).setOrigin(0.5).setDepth(302).setScrollFactor(0);

    this.restartButton.on("pointerover", () => this.restartButton.setFillStyle(0xffffff));
    this.restartButton.on("pointerout", () => this.restartButton.setFillStyle(0xeadccc));
    this.restartButton.on("pointerdown", () => {
      this.restartButton.disableInteractive();
      restartLabel.setText("Mengulang...");
      this.restartGame();
    });
  }

  restartGame() {
    gameState.integrity = 100;
    gameState.wealth = 0;
    gameState.personalWealth = 0;
    gameState.totalCorrupted = 0;
    gameState.sanity = 100;
    gameState.act = 1;
    gameState.leader = 1;
    gameState.actTwoProjectAccepted = false;
    gameState.actTwoOfficeLuxury = false;
    gameState.actTwoLedgerDone = false;
    gameState.sanityGlitched = false;
    gameState.integrityGlitched = false;
    gameState.actThreeStarted = false;
    this.scene.start("SceneSiang");
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#111723",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "game-container",
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [SceneSiang, SceneDesa, SceneRumah, SceneMalam, ScenePelantikan, MiniGameScene, MiniGameAct2, MiniGameLaundering, SceneEnding]
};

window.game = new Phaser.Game(config);
