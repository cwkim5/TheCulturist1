// ============================================================================
// [1. DATA & CONFIG] - 수치 밸런싱 테이블
// ============================================================================
const GAME_CONFIG = {
  PLAYER: {
    SPEED: 190,
    DAGGER_RANGE: 62,
    DAGGER_ARC_DEG: 85,
    DAGGER_DAMAGE: 35,
    DAGGER_COOLDOWN: 260,
    LUNGE_SPEED: 320,
    PARRY_WINDOW: 180,
    PARRY_COOLDOWN: 650,
  },
  ENEMY: {
    SPEED: 85,
    HP: 70,
    ATTACK_RANGE: 48,
    WINDUP_TIME: 650, // 카운터 타이밍 (0.65초)
    SPAWN_INTERVAL: 1600,
  },
  RANGED_ENEMY: {
    SPEED: 55, // 기본(85)보다 느림
    HP: 35, // 단검 1방 컷 (체력 낮음)
    ATTACK_RANGE: 140, // 140 거리에서 투사체 발사
    WINDUP_TIME: 800, // 기 모으는 시간 (0.8초간 황금빛 충전)
    PROJECTILE_SPEED: 220, // 투사체 날아오는 속도
    SPAWN_INTERVAL: 4500, // 4.5초마다 1마리 스폰
  },
  BOSS: {
    HP: 2500, // 압도적인 체력 (단검 데미지 35 기준 약 70방)
    SPEED: 70, // 묵직한 이속
    SPAWN_TIME: 100000, // 2분(120,000ms) 뒤 등장
  },
};

// ============================================================================
// [2. PRELOAD & INTRO SCENE] - 인트로 명언 및 타이틀
// ============================================================================
class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create() {
    const { width, height } = this.scale;
    this.createProceduralTextures();

    const quote = this.add
      .text(width / 2, height / 2, '“Fear is the greatest motivation.”', {
        fontFamily: 'Georgia, serif',
        fontSize: '24px',
        color: '#d8b4f8',
        fontStyle: 'italic',
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: '#ff003c',
          blur: 14,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: quote,
      alpha: 0.9,
      scale: { from: 0.94, to: 1.0 },
      duration: 1600,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.cameras.main.shake(200, 0.003);
        this.tweens.add({
          targets: quote,
          alpha: 0,
          delay: 1100,
          duration: 900,
          onComplete: () => this.showTitleScreen(),
        });
      },
    });
  }

  showTitleScreen() {
    const { width, height } = this.scale;
    const titleText = this.add
      .text(width / 2, height / 2 - 30, 'THE CULTIST', {
        fontFamily: 'Georgia, serif',
        fontSize: '46px',
        fontStyle: 'bold',
        color: '#e2e8f0',
        letterSpacing: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 50, '[ 클릭하여 의식 시작 ]', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#94a3b8',
      })
      .setOrigin(0.5);

    this.time.delayedCall(700, () => {
      this.cameras.main.flash(120, 180, 0, 30);
      this.cameras.main.shake(180, 0.012);
      titleText.setText('THE CULTURIST').setColor('#ff1e42');
      document.title = 'THE CULT [UR] IST';
    });

    this.time.addEvent({
      delay: 2400,
      loop: true,
      callback: () => {
        titleText.setText('YOU ARE CULTIST');
        this.time.delayedCall(70, () => titleText.setText('THE CULTURIST'));
      },
    });

    this.input.once('pointerdown', () => {
      this.cameras.main.fade(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('MainScene'));
    });
  }

  createProceduralTextures() {
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });

    gfx
      .fillStyle(0xffffff)
      .fillRect(0, 0, 4, 4)
      .generateTexture('px', 4, 4)
      .clear();

    gfx
      .fillStyle(0x1e1b24)
      .fillCircle(16, 16, 14)
      .lineStyle(2, 0x991b1b)
      .strokeCircle(16, 16, 14);
    gfx.generateTexture('cultist', 32, 32).clear();

    gfx
      .fillStyle(0x64748b)
      .fillCircle(16, 16, 13)
      .lineStyle(2, 0xe2e8f0)
      .strokeCircle(16, 16, 13);
    gfx
      .fillStyle(0x38bdf8)
      .fillRect(18, 12, 5, 8)
      .generateTexture('crusader', 32, 32)
      .clear();

    gfx
      .fillStyle(0xdc2626)
      .fillCircle(6, 6, 5)
      .generateTexture('blood_orb', 12, 12)
      .clear();
    // 사제 텍스처 (하얀 로브 + 황금빛 머리)
    gfx
      .fillStyle(0xf1f5f9)
      .fillCircle(16, 16, 12)
      .lineStyle(2, 0xfacc15)
      .strokeCircle(16, 16, 12);
    gfx
      .fillStyle(0xfacc15)
      .fillRect(16, 14, 6, 4)
      .generateTexture('inquisitor', 32, 32)
      .clear();

    // 빛의 투사체 (8x8 황금 구체)
    gfx
      .fillStyle(0xfde047)
      .fillCircle(4, 4, 4)
      .generateTexture('holy_bolt', 8, 8)
      .clear();

    gfx
      .fillStyle(0x1e293b)
      .fillRect(4, 4, 56, 56)
      .lineStyle(4, 0xb91c1c)
      .strokeRect(4, 4, 56, 56);
    gfx
      .fillStyle(0xef4444)
      .fillCircle(32, 32, 12)
      .generateTexture('boss', 64, 64)
      .clear();

    // ==========================================
    // [Act 2 텍스처 1] 딥 원 (Deep One) - 36x36
    // 지느러미와 날카로운 아가리, 노란 파충류 눈을 가진 심해 강습병
    // ==========================================
    const deepGfx = this.make.graphics({ x: 0, y: 0, add: false });

    // 1) 좌우 측면 가시 지느러미 (어두운 심해 청록)
    deepGfx.fillStyle(0x064e3b, 1);
    deepGfx.fillTriangle(14, 18, 6, 2, 24, 10); // 좌측 지느러미
    deepGfx.fillTriangle(14, 18, 6, 34, 24, 26); // 우측 지느러미

    // 2) 유선형 비늘 몸통 (청록색 몸체 + 밝은 에메랄드 테두리)
    deepGfx.fillStyle(0x0f766e, 1);
    deepGfx.lineStyle(2, 0x34d399, 0.9);
    deepGfx.fillEllipse(18, 18, 26, 18);
    deepGfx.strokeEllipse(18, 18, 26, 18);

    // 3) 전방(오른쪽)을 향한 하얀 이빨과 노란 심해어 안구
    deepGfx.fillStyle(0xfef08a, 1);
    deepGfx.fillCircle(23, 13, 2.5); // 왼쪽 눈
    deepGfx.fillCircle(23, 23, 2.5); // 오른쪽 눈
    deepGfx.fillStyle(0xef4444, 1);
    deepGfx.fillCircle(24, 13, 1); // 붉은 동공
    deepGfx.fillCircle(24, 23, 1);

    // 등줄기 발광 비늘 디테일
    deepGfx.fillStyle(0x10b981, 0.8);
    deepGfx.fillCircle(12, 18, 2.5);
    deepGfx.fillCircle(7, 18, 1.5);

    deepGfx.generateTexture('deep_one', 36, 36);
    deepGfx.destroy();

    // ==========================================
    // [Act 2 텍스처 2] 공허의 사역마 (Void Caller) - 40x40
    // 기하학적인 공허의 망토와 거대한 심연의 외눈을 가진 캐스터
    // ==========================================
    const voidGfx = this.make.graphics({ x: 0, y: 0, add: false });

    // 1) 후방으로 뻗은 3갈래 그림자 촉수 자락
    voidGfx.lineStyle(3, 0x3b0764, 0.9);
    voidGfx.lineBetween(18, 20, 3, 8);
    voidGfx.lineBetween(18, 20, 2, 20);
    voidGfx.lineBetween(18, 20, 3, 32);

    // 2) 비유클리드 마름모꼴 로브/외피
    voidGfx.fillStyle(0x4c1d95, 1);
    voidGfx.lineStyle(2, 0xc084fc, 1);
    voidGfx.beginPath();
    voidGfx.moveTo(35, 20); // 전방 뾰족한 코어
    voidGfx.lineTo(18, 6); // 좌측 어깨
    voidGfx.lineTo(7, 20); // 후방 꼬리
    voidGfx.lineTo(18, 34); // 우측 어깨
    voidGfx.closePath();
    voidGfx.fillPath();
    voidGfx.strokePath();

    // 3) 중앙의 거대한 공허의 외눈 (세로로 찢어진 보랏빛 동공)
    voidGfx.fillStyle(0x090414, 1);
    voidGfx.fillCircle(21, 20, 7);
    voidGfx.fillStyle(0xe879f9, 1);
    voidGfx.fillEllipse(22, 20, 4, 11); // 세로 동공
    voidGfx.fillStyle(0xffffff, 1);
    voidGfx.fillCircle(23, 18, 1.5); // 안구 하이라이트

    voidGfx.generateTexture('void_caller', 40, 40);
    voidGfx.destroy();

    // ==========================================
    // [플레이어 신격 폼 전용 텍스처 일괄 생성]
    // 어두운 심연의 코어 + 신격 고유의 빛나는 테두리
    // ==========================================
    const FORM_VISUALS = {
      'MORTAL CULTIST': { fill: 0x1c1624, stroke: 0x991b1b }, // 기본: 어두운 보라/검정 코어 + 피의 테두리
      HASTUR: { fill: 0x1c1917, stroke: 0xfacc15 }, // 하스터: 잿빛 코어 + 황금 테두리
      CTHULHU: { fill: 0x022c22, stroke: 0x10b981 }, // 크툴루: 짙은 해저 코어 + 에메랄드 테두리
      NYARLATHOTEP: { fill: 0x2e1065, stroke: 0xa855f7 }, // 니알라토텝: 짙은 우주 코어 + 보랏빛 테두리
      DAGON: { fill: 0x082f49, stroke: 0x0ea5e9 }, // 다곤: 심해 코어 + 청록색 테두리
      NODENS: { fill: 0x0f172a, stroke: 0x38bdf8 }, // 노덴스: 칠흑 코어 + 은푸른빛 테두리
      'THE FAITHLESS': { fill: 0x450a0a, stroke: 0xef4444 }, // 무신앙자: 응고된 핏빛 코어 + 선혈 테두리
      CTHUGHA: { fill: 0x450a0a, stroke: 0xf97316 }, // 크투가: 타오르는 석탄 코어 + 주황빛 테두리
    };

    const formGfx = this.make.graphics({ x: 0, y: 0, add: false });

    for (const [formName, colors] of Object.entries(FORM_VISUALS)) {
      formGfx.clear();
      formGfx.fillStyle(colors.fill, 1);
      formGfx.fillCircle(16, 16, 14); // 어두운 내부 코어
      formGfx.lineStyle(3, colors.stroke, 1);
      formGfx.strokeCircle(16, 16, 14); // 빛나는 외부 테두리

      // 텍스처 키를 "tex_HASTUR" 같은 형식으로 저장
      formGfx.generateTexture(`tex_${formName}`, 32, 32);
    }
    formGfx.destroy();

    // ==========================================
    // [Act 2 보스 텍스처] THE GREAT DEEP ONE (84x84) - 칠흑의 고대 투구 버전
    // ==========================================
    const gdoGfx = this.make.graphics({ x: 0, y: 0, add: false });

    // 1) 거대한 심해 측면 지느러미 (차분하고 어두운 심해 청록 톤 통일)
    gdoGfx.fillStyle(0x022c22, 1);
    gdoGfx.lineStyle(2, 0x0f766e, 0.9);
    gdoGfx.fillTriangle(34, 42, 8, 4, 54, 22);
    gdoGfx.strokeTriangle(34, 42, 8, 4, 54, 22);
    gdoGfx.fillTriangle(34, 42, 8, 80, 54, 62);
    gdoGfx.strokeTriangle(34, 42, 8, 80, 54, 62);

    // 2) 중갑 비늘 몸통 (어두운 청록 몸체 + 차가운 에메랄드 외곽선)
    gdoGfx.fillStyle(0x064e3b, 1);
    gdoGfx.lineStyle(2.5, 0x10b981, 0.85);
    gdoGfx.fillEllipse(38, 42, 56, 40);
    gdoGfx.strokeEllipse(38, 42, 56, 40);

    // 등줄기 고대 비늘 마디 디테일
    gdoGfx.fillStyle(0x022c22, 0.9);
    gdoGfx.fillCircle(24, 42, 5);
    gdoGfx.fillCircle(15, 42, 3.5);

    // 3) 투구 아래로 살짝 드러난 창백한 심해 아가리 이빨 (과한 붉은색 제거)
    gdoGfx.fillStyle(0x94a3b8, 0.85);
    gdoGfx.fillTriangle(64, 30, 73, 33, 64, 36); // 좌측 송곳니
    gdoGfx.fillTriangle(64, 48, 73, 51, 64, 54); // 우측 송곳니

    // 4) [핵심] 눈을 덮는 칠흑의 고대 투구 (Ancient Black Greathelm)
    gdoGfx.fillStyle(0x09080d, 1); // 완전한 칠흑색
    gdoGfx.lineStyle(2, 0x334155, 0.95); // 투구의 고대 강철 모서리
    gdoGfx.beginPath();
    gdoGfx.moveTo(68, 42); // 전방 뾰족한 투구 코날(Nasal guard)
    gdoGfx.lineTo(54, 23); // 좌측 투구 뿔/어깨각
    gdoGfx.lineTo(32, 27); // 후두부 상단
    gdoGfx.lineTo(38, 42); // 후두부 중앙 홈
    gdoGfx.lineTo(32, 57); // 후두부 하단
    gdoGfx.lineTo(54, 61); // 우측 투구 뿔/어깨각
    gdoGfx.closePath();
    gdoGfx.fillPath();
    gdoGfx.strokePath();

    // 투구 정수리를 가로지르는 고대 마루(Crest) 장식선
    gdoGfx.lineStyle(2, 0x1e293b, 1);
    gdoGfx.lineBetween(38, 42, 66, 42);

    // 5) 투구 장갑 틈새로 어둡게 파인 '눈알 없는 짙은 청록색 안와(Void Sockets)'
    // (동공 하이라이트 없이 죽은 심해의 색만 은은하게 감도는 슬릿 형태)
    gdoGfx.fillStyle(0x0d9488, 0.75);
    gdoGfx.fillTriangle(53, 28, 61, 36, 51, 35); // 왼쪽 눈 틈새
    gdoGfx.fillTriangle(53, 56, 61, 48, 51, 49); // 오른쪽 눈 틈새 (2페이즈 각성 위치!)

    gdoGfx.generateTexture('great_deep_one', 84, 84);
    gdoGfx.destroy();

    // [가시 모양 삼각형 탄환] (16x16, 우측 0 라디안 방향을 바라보도록 설계)
    const thornGfx = this.make.graphics({ x: 0, y: 0, add: false });
    thornGfx.fillStyle(0x10b981, 1);
    thornGfx.lineStyle(1.5, 0xa7f3d0, 1);
    thornGfx.fillTriangle(15, 8, 2, 2, 2, 14);
    thornGfx.strokeTriangle(15, 8, 2, 2, 2, 14);
    thornGfx.generateTexture('thorn_bolt', 16, 16);
    thornGfx.destroy();
  }
}

// ============================================================================
// [3. MAIN GAME SCENE] - 전투, 카운터/패링, 현장 변이 시스템
// ============================================================================
class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    this.input.mouse.disableContextMenu();
    this.physics.world.setBounds(0, 0, 1400, 1400);
    this.act1BgGfx = this.drawRitualArena();

    this.state = {
      form: 'MORTAL CULTIST',
      kills: 0,
      canSlash: true,
      isParrying: false,
      canParry: true,
      shrinesSpawned: false,
      ascended: false,
      hp: 100,
      maxHp: 100,
      isGameOver: false,
      slashes: 0,
      successfulParries: 0,
      isDashing: false,
      canDash: true,
      dashCooldown: 800, // 대시 쿨타임 (0.8초)
      dashDuration: 180, // 대시 지속 시간 (0.18초 무적 질주)
      dashSpeed: 2600, // 대시 순간 속도
      emptySlashes: 0,
      comboStep: 0,
      comboTimer: null,
      nyarlaCombo: 0,
      isChaos: false,
      hasTakenDamage: false, // ★ 노히트(무피격) 체크용 플래그
      isTrueMortal: false, // ★ 트루 오리지널 하드코어 분기 진입 여부
      dashesUsed: 0, // ★ 대시 사용 횟수
      parriesAttempted: 0, // ★ 패링 시도 횟수
    };

    this.state.isExAwakened = false;
    this.state.awakeningTier = 0; // ★ 0: 기본 진화, 1: -α(알파), 2: -β(베타), 3: -Ω(오메가)
    this.state.awakeningPath = ''; // 'BETA' 또는 'GAMMA'
    this.state.dmgMult = 1.0; // ★ 전역 데미지 배율 (기본 1.0)
    this.state.orbDropRate = 0.7; // ★ 피구슬 스폰 확률 (기본 70%)

    this.ritualEvents = {
      10: () => this.spawnAscensionShrines(), // 10킬: 제단 스폰
      30: () => this.checkNyarlathotepEvolution(), // ★ 30킬: 니알라토텝 히든 체크
      40: () => this.checkFaithlessEvolution(), // 40킬: 무신앙자 체크
      50: () => this.triggerWaveEscalation(), // 50킬: 성벌군 증원 (스폰량 증가!)
      80: () => this.triggerSecondAscension(), // 80킬: 신격 2차 초월 각성!
      100: () => this.spawnBoss(), // 100킬: 대주교 강림
      101: () => {
        // 보스가 쓰러진 마지막 좌표를 가져오거나, 없으면 맵 중앙(700, 700)에 포탈 생성!
        const px = this.lastBossPos ? this.lastBossPos.x : 700;
        const py = this.lastBossPos ? this.lastBossPos.y : 700;
        this.startAct2Phase(px, py);
      },
      150: () => this.triggerWaveEscalation2(), // ★ 150킬: 공허의 침식 & 2막 적 강화!
      160: () => this.triggerTier2Evolution('BETA'), // ★ 160킬: 제단 없이 즉시 베타(-β) 초월 각성!
      200: () => this.spawnGreatDeepOne(), // ★ 200킬: 그레이트 딥 원 강림!
    };

    this.state.startTime = this.time.now;

    this.pauseText = this.add
      .text(400, 300, 'PAUSED', {
        fontFamily: 'Georgia, serif',
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(300)
      .setVisible(false);

    this.input.keyboard.on('keydown-ESC', () => {
      if (this.state.isGameOver) return;
      this.state.isPaused = !this.state.isPaused;

      if (this.state.isPaused) {
        this.physics.world.isPaused = true;
        this.time.paused = true;
        this.tweens.pauseAll(); // 트윈 일시정지
        this.pauseText.setVisible(true);
      } else {
        this.physics.world.isPaused = false;
        this.time.paused = false;
        this.tweens.resumeAll(); // 트윈 재개
        this.pauseText.setVisible(false);
      }
    });

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.spaceKey.on('down', () => this.performDash());

    this.bloodDecalGfx = this.add.graphics().setDepth(1);
    this.tentacleGfx = this.add.graphics().setDepth(9);
    this.chaosMarkGfx = this.add.graphics().setDepth(13); // ★ 니알라토텝 낙인 표시용 레이어

    this.enemies = this.physics.add.group();

    // 투사체 설정
    this.projectiles = this.physics.add.group();

    this.playerAuras = this.physics.add.group();

    this.cthulhuSpawns = this.physics.add.group();
    this.lastCthulhuSpitTime = 0;

    this.physics.add.overlap(
      this.cthulhuSpawns,
      this.enemies,
      (proj, enemy) => {
        if (!proj.active || !enemy.active || proj.isHitting) return;
        this.triggerCthulhuExplosion(proj);
      },
      null,
      this
    );

    // 2. 검기와 적의 충돌 판정 (관통 로직)
    this.physics.add.overlap(
      this.playerAuras,
      this.enemies,
      (aura, enemy) => {
        // 이미 이 검기에 맞은 적이거나, 적이 죽은 상태면 무시
        if (!enemy.active || aura.hitTargets.has(enemy)) return;

        // 타격 명단에 추가하고 데미지 부여 (검기 데미지는 65)
        aura.hitTargets.add(enemy);
        const knockbackAngle = Phaser.Math.Angle.Between(
          aura.x,
          aura.y,
          enemy.x,
          enemy.y
        );
        this.damageEnemy(enemy, 65, knockbackAngle, false);
      },
      null,
      this
    );

    this.player = this.physics.add
      .sprite(700, 700, 'tex_MORTAL CULTIST') // ★ 'cultist' -> 'tex_MORTAL CULTIST' 로 변경
      .setDepth(10)
      .setCollideWorldBounds(true)
      .setDrag(800);

    this.playerEyeGfx = this.add.graphics().setDepth(11);

    // 2. 투사체와 플레이어 충돌 판정 (다곤 수정)
    this.physics.add.overlap(
      this.player,
      this.projectiles,
      (player, bolt) => {
        if (bolt.isDeflected) return; // 이미 튕겨낸 건 무시

        if (this.state.isParrying) {
          this.cameras.main.flash(80, 56, 189, 248);
          this.registerParrySuccess(); // ★ 패링 성공 카운트!

          if (this.state.form === 'DAGON') {
            this.triggerDagonWave();
            bolt.isDeflected = true;
            bolt.setTint(0x0ea5e9); // 심해의 푸른빛으로 변환

            // 가장 가까운 적을 찾아 조준
            let target = this.enemies.getChildren()[0];
            if (target) {
              const reflectAngle = Phaser.Math.Angle.Between(
                bolt.x,
                bolt.y,
                target.x,
                target.y
              );
              bolt.setVelocity(
                Math.cos(reflectAngle) * 500,
                Math.sin(reflectAngle) * 500
              ); // 2배 이상 빠르게 역분사

              // ★ [80킬 초월: 다곤] 반사 탄환 좌우로 2발의 추가 심해 탄환 분열 발사!
              if (this.state.isExAwakened) {
                [-0.25, 0.25].forEach((offset) => {
                  const splitBolt = this.projectiles
                    .create(bolt.x, bolt.y, 'holy_bolt')
                    .setTint(0x38bdf8)
                    .setScale(1.3)
                    .setDepth(9);
                  splitBolt.isDeflected = true;
                  splitBolt.setVelocity(
                    Math.cos(reflectAngle + offset) * 480,
                    Math.sin(reflectAngle + offset) * 480
                  );
                  this.time.delayedCall(2500, () => {
                    if (splitBolt.active) splitBolt.destroy();
                  });
                });
              }
            }
          } else {
            bolt.destroy(); // 다곤이 아니면 그냥 파괴
          }
        } else {
          bolt.destroy();
          // ★ 무적 상태가 아닐 때만 화면 진동 및 데미지 적용
          if (!this.state.isDashing && !this.state.isInvulnerable) {
            this.cameras.main.shake(120, 0.012);
            this.cameras.main.flash(80, 180, 0, 0);
            this.takeDamage(12);
          }
        }
      },
      null,
      this
    );

    // 튕겨낸 투사체가 적을 맞췄을 때의 데미지 판정
    this.physics.add.overlap(
      this.enemies,
      this.projectiles,
      (enemy, bolt) => {
        if (bolt.isDeflected && enemy.active) {
          // 튕겨낸 투사체는 카운터 취급(true)으로 막대한 데미지를 입힘
          this.damageEnemy(
            enemy,
            90,
            Phaser.Math.Angle.Between(bolt.x, bolt.y, enemy.x, enemy.y),
            true
          );
          bolt.destroy();
        }
      },
      null,
      this
    );

    this.initAct1Loop();

    this.bloodOrbs = this.physics.add.group();
    this.shrines = this.physics.add.staticGroup();

    this.cameras.main
      .startFollow(this.player, true, 0.08, 0.08)
      .setBackgroundColor('#09080d');

    this.bloodEmitter = this.add
      .particles(0, 0, 'px', {
        color: [0xff002b, 0x990012, 0x4a0008],
        speed: { min: 60, max: 280 },
        scale: { start: 1.8, end: 0 },
        lifespan: { min: 250, max: 550 },
        emitting: false,
      })
      .setDepth(15);

    // ★ [무신앙자 전용] 붉은 안광 파티클 생성기
    this.redEyeEmitter = this.add
      .particles(0, 0, 'px', {
        color: [0xff0000, 0xb91c1c, 0xef4444], // 타오르는 붉은색 그라데이션
        speed: { min: 30, max: 80 }, // 뒤로 흩날리는 속도
        scale: { start: 1.5, end: 0 }, // 눈에서 나와서 점차 사라짐
        lifespan: { min: 200, max: 400 }, // 잔상 길이 (짧게 유지해서 속도감 부여)
        blendMode: Phaser.BlendModes.ADD, // 빛나는 효과
        frequency: 30, // 0.03초마다 생성 (자연스러운 줄기)
        emitting: false, // 기본은 꺼둠
      })
      .setDepth(14);

    this.keys = this.input.keyboard.addKeys('W,A,S,D');
    //this.input.on('pointerdown', (p) => p.rightButtonDown() ? this.performParry() : this.performDaggerSlash() );
    this.setupMobileControls(); // ★ 모바일 가상 패드 초기화 메서드 호출

    this.input.on('pointerdown', (p) => {
      if (this.isMobile) {
        const isJoyArea = p.x < 300 && p.y > 350;
        const isBtnArea = p.x > 500 && p.y > 300;
        if (isJoyArea || isBtnArea) return;
      }

      if (p.rightButtonDown() || this.state.form === 'DAGON') {
        this.performParry();
      } else {
        this.performDaggerSlash();
      }
    });

    this.time.addEvent({
      delay: 950,
      loop: true,
      callback: () => {
        if (this.state.form === 'HASTUR') this.triggerHasturWhip();
      },
    });

    this.physics.add.overlap(
      this.player,
      this.bloodOrbs,
      this.collectBlood,
      null,
      this
    );
    this.createHUD();
  }

  performDash() {
    if (
      !this.state.canDash ||
      this.state.isDashing ||
      this.physics.world.isPaused
    )
      return;

    this.state.canDash = false;
    this.state.dashesUsed++;
    this.state.isDashing = true;

    // 1. 방향 벡터 계산 (WASD)
    let vx = 0;
    let vy = 0;
    if (this.keys.W.isDown) vy -= 1;
    if (this.keys.S.isDown) vy += 1;
    if (this.keys.A.isDown) vx -= 1;
    if (this.keys.D.isDown) vx += 1;
    if (this.joyData && this.joyData.active && (this.joyData.vx !== 0 || this.joyData.vy !== 0)) {
      vx = this.joyData.vx;
      vy = this.joyData.vy;
    }

    let dashAngle;
    if (vx === 0 && vy === 0) {
      dashAngle = this.getAimAngle(); // ★ 가만히 서서 대시할 때도 통합 조준 방향 사용!
    } else {
      dashAngle = Math.atan2(vy, vx);
    }

    // 2. 극대화된 속도 적용 (2600!)
    this.player.setVelocity(
      Math.cos(dashAngle) * 2600,
      Math.sin(dashAngle) * 2600
    );
    this.player.setAlpha(0.7);

    const currentTexture = this.player.texture.key;
    const currentFrame = this.player.frame.name;

    const trailTimer = this.time.addEvent({
      delay: 15, // 0.015초 간격으로 더 촘촘하게
      repeat: 9,
      callback: () => {
        if (!this.player || !this.player.active) return;

        // 본체와 똑같은 텍스처와 프레임으로 생성해 오류 원천 차단
        const ghost = this.add
          .sprite(this.player.x, this.player.y, currentTexture, currentFrame)
          .setDepth(9)
          .setRotation(this.player.rotation)
          .setAlpha(0.3)
          .setBlendMode(Phaser.BlendModes.ADD);

        // 신격별 색상 세팅
        if (this.state.form === 'DAGON') {
          ghost.setTint(0x0ea5e9);
        } else {
          ghost.setTint(0xe2e8f0); // 투명도 높은 은빛
        }

        this.tweens.add({
          targets: ghost,
          alpha: 0,
          scale: 0.85,
          duration: 140,
          onComplete: () => ghost.destroy(),
        });

        // 4. [보너스 연출] 대시 후방으로 뿜어지는 기류 파티클 (하얀 점 'px'들을 흩뿌림)
        // 만약 'px'가 없다면 에러 없이 무시하도록 조건 추가
        if (this.textures.exists('px')) {
          for (let i = 0; i < 3; i++) {
            const p = this.add
              .image(
                this.player.x + Phaser.Math.Between(-8, 8),
                this.player.y + Phaser.Math.Between(-8, 8),
                'px'
              )
              .setDepth(8)
              .setAlpha(0.5)
              .setTint(0xffffff)
              .setScale(Phaser.Math.Between(1, 3));

            this.tweens.add({
              targets: p,
              x: p.x - Math.cos(dashAngle) * Phaser.Math.Between(10, 30),
              y: p.y - Math.sin(dashAngle) * Phaser.Math.Between(10, 30),
              alpha: 0,
              duration: 200,
              onComplete: () => p.destroy(),
            });
          }
        }
      },
    });

    if (this.state.form === 'THE FAITHLESS') {
      const hitCountMap = new Map(); // ★ 적 개체별 대시 다단히트 횟수 제한용

      this.time.addEvent({
        delay: 30,
        repeat: 3, // 총 4회 체크
        callback: () => {
          if (!this.enemies) return;
          const currentEnemies = [...this.enemies.getChildren()];
          currentEnemies.forEach((e) => {
            if (!e.active) return;
            const hits = hitCountMap.get(e) || 0;
            if (hits >= 2) return; // ★ 한 번의 대시로 동일 적에게 최대 2히트까지만 허용!

            if (
              Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                e.x,
                e.y
              ) <= 42
            ) {
              hitCountMap.set(e, hits + 1);
              this.cameras.main.shake(40, 0.004);
              this.damageEnemy(e, 14, dashAngle, false); // 틱당 14 (1.35배 적용 시 약 19, 2틱 합산 38 데미지)
            }
          });
        },
      });
    }
    // ★ [니알라토텝 기본 기믹] 대시 사용 시 표식(chaosStacks)이 묻은 모든 적 즉시 일제 격발!
    if (this.state.form === 'NYARLATHOTEP') {
      const markedEnemies = this.enemies
        .getChildren()
        .filter((e) => e.active && e.chaosStacks && e.chaosStacks > 0);

      if (markedEnemies.length > 0) {
        const linkGfx = this.add
          .graphics()
          .setDepth(13)
          .setBlendMode(Phaser.BlendModes.ADD);
        linkGfx.lineStyle(2, 0xd8b4f8, 0.85);

        markedEnemies.forEach((e) => {
          // 플레이어와 표식 대상 사이에 보랏빛 사슬 선 연결 연출
          linkGfx.lineBetween(this.player.x, this.player.y, e.x, e.y);
          // 즉시 강화 폭발(true) 실행!
          this.detonateChaosMark(e, true);
        });

        this.tweens.add({
          targets: linkGfx,
          alpha: 0,
          duration: 180,
          onComplete: () => linkGfx.destroy(),
        });
      }
    }
    // ★ [니알라토텝-β 전용] 대시 궤적을 따라 3개의 보랏빛 환영 지뢰 생성 및 연쇄 폭발!
    if (
      this.state.form === 'NYARLATHOTEP' &&
      this.state.awakeningPath === 'BETA'
    ) {
      for (let i = 0; i < 3; i++) {
        this.time.delayedCall(i * 35, () => {
          if (!this.player || !this.player.active || this.state.isGameOver)
            return;
          const mineX = this.player.x;
          const mineY = this.player.y;

          // 1) 바닥에 남는 보랏빛 차원 균열 구체
          const riftMine = this.add
            .circle(mineX, mineY, 12, 0x7e22ce, 0.65)
            .setStrokeStyle(2, 0xe879f9, 1)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(9);

          this.tweens.add({
            targets: riftMine,
            scale: 1.5,
            alpha: 0.9,
            duration: 320,
            ease: 'Sine.easeIn',
            onComplete: () => {
              riftMine.destroy();
              if (this.state.isGameOver) return;

              // 2) 0.32초 뒤 환영 폭발!
              const blast = this.add
                .circle(mineX, mineY, 18, 0xc084fc, 0.7)
                .setStrokeStyle(3, 0xffffff, 0.9)
                .setBlendMode(Phaser.BlendModes.ADD)
                .setDepth(14);

              this.tweens.add({
                targets: blast,
                scale: 4.2, // 반경 약 75px 폭발
                alpha: 0,
                duration: 220,
                ease: 'Cubic.easeOut',
                onComplete: () => blast.destroy(),
              });

              this.cameras.main.shake(60, 0.006);

              // 범위 내 적들에게 폭발 데미지(45) + 혼돈 낙인 1스택 자동 부여!
              this.enemies.getChildren().forEach((e) => {
                if (!e.active) return;
                if (
                  Phaser.Math.Distance.Between(mineX, mineY, e.x, e.y) <=
                  75 + (e.isBoss ? 24 : 0)
                ) {
                  this.damageEnemy(e, 45, dashAngle, false);
                  if (e.active) this.addChaosMark(e, 1);
                }
              });
            },
          });
        });
      }
    }

    // ★ [크툴루 전용 대시 피니셔] 80킬 알파(-α) 각성 시에만 스페이스바 대시 시 '심해의 아가리' 폭발 해금!
    if (this.state.form === 'CTHULHU' && this.state.isExAwakened) {
      const isBeta = this.state.awakeningPath === 'BETA';
      const crushRadius = isBeta ? 115 : 95;
      const crushDmg = 65;
      if (this.state.isAct2 && this.state.form === 'CTHULHU') this.state.gammaProgress++;

      const abyssMaw = this.add
        .circle(this.player.x, this.player.y, 20, 0x022c22, 0.75)
        .setStrokeStyle(4, 0x10b981, 1)
        .setDepth(13);

      for (let i = 0; i < 6; i++) {
        const ta = (i * Math.PI) / 3 + Math.random() * 0.3;
        const dist = crushRadius * 0.65;
        const spike = this.add
          .triangle(
            this.player.x + Math.cos(ta) * dist,
            this.player.y + Math.sin(ta) * dist,
            0, 18, 8, -14, 16, 18,
            0x34d399, 0.9
          )
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(14);

        this.tweens.add({
          targets: spike,
          scaleY: 1.6,
          alpha: 0,
          duration: 280,
          onComplete: () => spike.destroy(),
        });
      }

      this.tweens.add({
        targets: abyssMaw,
        scale: crushRadius / 20,
        alpha: 0,
        duration: 260,
        ease: 'Cubic.easeOut',
        onComplete: () => abyssMaw.destroy(),
      });

      this.cameras.main.shake(120, 0.012);
      // 모아둔 적들을 제자리에서 짓이기는 강력한 광역 딜
      this.applyAreaDamage(this.player.x, this.player.y, crushRadius, null, crushDmg);
    }

    // 5. 대시 속도 종료 및 초기화 (0.12초로 아주 기민하게 설정)
    this.time.delayedCall(120, () => {
      this.state.isDashing = false;
      this.player.setAlpha(1.0);
      trailTimer.destroy();
      this.restoreFormTint();
      // ★ [80킬 초월: 무신앙자] 대시 도착 지점에 핏빛 충격파 폭발!
      if (this.state.form === 'THE FAITHLESS' && this.state.isExAwakened) {
        const bloodNova = this.add
          .circle(this.player.x, this.player.y, 18, 0xdc2626, 0.5)
          .setStrokeStyle(3, 0xef4444, 0.9)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(13);
        this.tweens.add({
          targets: bloodNova,
          scale: 4.5,
          alpha: 0,
          duration: 220,
          onComplete: () => bloodNova.destroy(),
        });
        this.applyAreaDamage(this.player.x, this.player.y, 75, dashAngle, 30);
      }
    });

    this.time.delayedCall(this.state.dashCooldown, () => {
      this.state.canDash = true;
    });
  }

  drawRitualArena() {
    const g = this.add.graphics().setDepth(0).lineStyle(1, 0x1c1624, 0.6);
    for (let i = 0; i <= 1400; i += 64) {
      g.lineBetween(i, 0, i, 1400);
      g.lineBetween(0, i, 1400, i);
    }
    g.lineStyle(3, 0x3b0d1e, 0.8)
      .strokeCircle(700, 700, 180)
      .strokeCircle(700, 700, 145);

    return g;
  }

  drawFormEyes() {
    if (!this.player || !this.player.active || !this.playerEyeGfx) return;
    this.playerEyeGfx.clear();

    const form = this.state.form;
    const px = this.player.x;
    const py = this.player.y;
    const rot = this.player.rotation;

    // 로컬 좌표(x, y)를 플레이어의 회전각에 맞춰 월드 좌표로 변환하는 헬퍼
    const getPos = (lx, ly) => {
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      return {
        x: px + (lx * cos - ly * sin),
        y: py + (lx * sin + ly * cos),
      };
    };

    // 1. MORTAL CULTIST (기본: 붉은 쌍안)
    if (form === 'MORTAL CULTIST') {
      this.playerEyeGfx.fillStyle(0xff003c, 1);
      const e1 = getPos(6, -4);
      const e2 = getPos(6, 4);
      this.playerEyeGfx.fillRect(e1.x - 1, e1.y - 1, 3, 2);
      this.playerEyeGfx.fillRect(e2.x - 1, e2.y - 1, 3, 2);
    }
    // 2. HASTUR (황색의 왕: 이마 중앙의 커다란 황금빛 단안)
    else if (form === 'HASTUR') {
      const eye = getPos(7, 0);
      this.playerEyeGfx.fillStyle(0x000000, 0.9);
      this.playerEyeGfx.fillCircle(eye.x, eye.y, 4); // 눈두덩 검은 윤곽
      this.playerEyeGfx.fillStyle(0xfde047, 1);
      this.playerEyeGfx.fillCircle(eye.x, eye.y, 2.5); // 타오르는 황금 동공
    }
    // 3. NYARLATHOTEP (기어오는 혼돈: 비대칭 3개의 보라색 마안)
    else if (form === 'NYARLATHOTEP') {
      this.playerEyeGfx.fillStyle(0xd8b4f8, 1);
      const e1 = getPos(7, -3);
      const e2 = getPos(6, 4);
      const e3 = getPos(2, -1); // 이마 뒤틀린 위치
      this.playerEyeGfx.fillCircle(e1.x, e1.y, 1.8);
      this.playerEyeGfx.fillCircle(e2.x, e2.y, 2.2);
      this.playerEyeGfx.fillCircle(e3.x, e3.y, 1.5);
    }
    // 4. CTHULHU (크툴루: 심해 벌레/갑각류 형태의 녹색 4개 겹눈)
    else if (form === 'CTHULHU') {
      this.playerEyeGfx.fillStyle(0x34d399, 1);
      const eyes = [getPos(7, -4), getPos(7, 4), getPos(4, -6), getPos(4, 6)];
      eyes.forEach((e) => this.playerEyeGfx.fillCircle(e.x, e.y, 1.7));
    }
    // 5. DAGON (다곤: 가로로 찢어진 어류의 청록빛 눈동자)
    else if (form === 'DAGON') {
      const e1 = getPos(6, -5);
      const e2 = getPos(6, 5);
      this.playerEyeGfx.fillStyle(0x38bdf8, 1);
      this.playerEyeGfx.fillCircle(e1.x, e1.y, 2.5);
      this.playerEyeGfx.fillCircle(e2.x, e2.y, 2.5);
      this.playerEyeGfx.fillStyle(0x082f49, 1); // 물고기 특유의 수평 슬릿 동공
      this.playerEyeGfx.fillRect(e1.x - 2, e1.y - 0.5, 4, 1.2);
      this.playerEyeGfx.fillRect(e2.x - 2, e2.y - 0.5, 4, 1.2);
    }
    // 6. NODENS (노덴스: 차가운 심연의 십자(十字) 조준형 안광)
    else if (form === 'NODENS') {
      const eye = getPos(7, 0);
      this.playerEyeGfx.lineStyle(1.5, 0x38bdf8, 1);
      this.playerEyeGfx.lineBetween(eye.x - 4, eye.y, eye.x + 4, eye.y);
      this.playerEyeGfx.lineBetween(eye.x, eye.y - 4, eye.x, eye.y + 4);
      this.playerEyeGfx.fillStyle(0xffffff, 1);
      this.playerEyeGfx.fillCircle(eye.x, eye.y, 1.5); // 중심 백색 핵
    }
    // 7. THE FAITHLESS (무신앙자: 살의로 타오르는 역삼각형 형태의 핏빛 안광)
    else if (form === 'THE FAITHLESS') {
      this.playerEyeGfx.fillStyle(0xffffff, 1); // 붉은 몸체 대비 순백의 살기
      const e1 = getPos(6, -3);
      const e2 = getPos(6, 3);
      this.playerEyeGfx.fillRect(e1.x - 1, e1.y - 1.5, 3, 3);
      this.playerEyeGfx.fillRect(e2.x - 1, e2.y - 1.5, 3, 3);
    } else if (form === 'CTHUGHA') {
      // lx: 앞쪽 거리, ly: 좌우 거리
      // 왼쪽 눈 (뒤쪽/바깥쪽에서 앞쪽/안쪽으로 찢어진 \ 형태)
      const l1 = getPos(4, -7),
        l2 = getPos(9, -2);
      // 오른쪽 눈 (뒤쪽/바깥쪽에서 앞쪽/안쪽으로 찢어진 / 형태)
      const r1 = getPos(4, 7),
        r2 = getPos(9, 2);

      // 1. 바깥쪽 이글거리는 주황색 오라 (두꺼운 선)
      this.playerEyeGfx.lineStyle(4, 0xea580c, 0.85);
      this.playerEyeGfx.lineBetween(l1.x, l1.y, l2.x, l2.y);
      this.playerEyeGfx.lineBetween(r1.x, r1.y, r2.x, r2.y);

      // 2. 안쪽 꿰뚫어 보는 심연의 노란 불꽃 코어 (얇은 선으로 덧그리기)
      this.playerEyeGfx.lineStyle(1.5, 0xfef08a, 1);
      this.playerEyeGfx.lineBetween(l1.x, l1.y, l2.x, l2.y);
      this.playerEyeGfx.lineBetween(r1.x, r1.y, r2.x, r2.y);
    }
  }

  checkFaithlessEvolution() {
    // 이미 다른 신격으로 각성했다면 무시
    if (this.state.form !== 'MORTAL CULTIST') return;

    // ★ [하드코어 트루 오리지널 분기 조건 검사]
    // 조건: 40킬 달성 시점까지 1) 무피격(No-Hit) + 2) 슬래시 40회 이하 + 3) 패링 5회 이상
    const isTrueHardcoreCondition =
      !this.state.hasTakenDamage &&
      this.state.slashes <= 40 &&
      this.state.successfulParries >= 5;

    if (isTrueHardcoreCondition) {
      this.awakenTrueMortal(); // ★ 무신앙자 변이를 거부하고 순수한 필멸자로 각성!
    } else {
      // 조건 미달 시 기존대로 무신앙자(광전사)로 강제 변이
      this.awakenFaithless();

      this.cameras.main.flash(500, 255, 0, 0);
      const alertText = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY - 50,
          '신을 부정하는 자',
          {
            fontFamily: 'monospace',
            fontSize: '32px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 5,
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(100);

      this.tweens.add({
        targets: alertText,
        y: alertText.y - 40,
        alpha: 0,
        duration: 3000,
        ease: 'Power2',
        onComplete: () => alertText.destroy(),
      });
    }
  }

  // ★ [히든 각성: 니알라토텝] 30킬 무대시/무패링 달성 시 강림 연출
  checkNyarlathotepEvolution() {
    if (
      this.state.form === 'MORTAL CULTIST' &&
      this.state.dashesUsed === 0 &&
      this.state.parriesAttempted === 0
    ) {
      if (this.shrines) this.shrines.clear(true, true);

      const px = this.player.x;
      const py = this.player.y;

      // 1. 순간적인 시간 정지(슬로우 모션) 및 암흑 침식 오버레이
      this.physics.world.timeScale = 4.0;
      const darkVeil = this.add
        .rectangle(400, 300, 800, 600, 0x090414, 0.85)
        .setScrollFactor(0)
        .setDepth(180)
        .setAlpha(0);

      this.tweens.add({
        targets: darkVeil,
        alpha: 1,
        duration: 250,
        yoyo: true,
        hold: 650,
        onComplete: () => darkVeil.destroy(),
      });

      // 2. 플레이어 주변 공간이 찢어지는 비유클리드 보랏빛 균열선 8갈래
      const riftGfx = this.add
        .graphics()
        .setDepth(185)
        .setBlendMode(Phaser.BlendModes.ADD);

      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + Phaser.Math.FloatBetween(-0.2, 0.2);
        const len = Phaser.Math.Between(90, 180);
        riftGfx.lineStyle(Phaser.Math.Between(2, 4), 0xc084fc, 0.9);
        riftGfx.lineBetween(
          px - Math.cos(a) * (len * 0.4),
          py - Math.sin(a) * (len * 0.4),
          px + Math.cos(a) * len,
          py + Math.sin(a) * len
        );
      }

      this.tweens.add({
        targets: riftGfx,
        alpha: 0,
        duration: 850,
        ease: 'Cubic.easeOut',
        onComplete: () => riftGfx.destroy(),
      });

      // 3. 어둠 속에서 차례대로 떠지는 '혼돈의 외눈(Chaos Eyes)' 연출
      for (let i = 0; i < 9; i++) {
        this.time.delayedCall(i * 55, () => {
          const dist = Phaser.Math.Between(45, 160);
          const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const ex = px + Math.cos(ang) * dist;
          const ey = py + Math.sin(ang) * dist;

          const eyeOuter = this.add
            .ellipse(ex, ey, 28, 12, 0xa855f7, 0.9)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(186)
            .setScale(0);
          const eyePupil = this.add
            .ellipse(ex, ey, 4, 12, 0xffffff, 1)
            .setDepth(187)
            .setScale(0);

          this.tweens.add({
            targets: [eyeOuter, eyePupil],
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 180,
            yoyo: true,
            hold: 220,
            onComplete: () => {
              eyeOuter.destroy();
              eyePupil.destroy();
            },
          });
        });
      }

      // 4. 0.55초 뒤 본 각성 폭발 및 주변 적 강제 넉백 + 혼돈 낙인 일제 부여
      this.time.delayedCall(550, () => {
        this.physics.world.timeScale = 1.0;
        this.cameras.main.flash(700, 168, 85, 247);
        this.cameras.main.shake(650, 0.035);

        this.awakenNyarlathotep();

        // 이중 공허 충격파 링
        [0x9333ea, 0xe879f9].forEach((col, idx) => {
          const ring = this.add
            .circle(px, py, 20, col, 0.35)
            .setStrokeStyle(4 - idx, 0xffffff, 0.9)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(190);

          this.tweens.add({
            targets: ring,
            scale: 13 + idx * 4,
            alpha: 0,
            duration: 550 + idx * 120,
            ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy(),
          });
        });

        // 주변 적들을 밀쳐내며 동시에 혼돈 낙인 2스택씩 강제 주입!
        this.enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          const pushAngle = Phaser.Math.Angle.Between(px, py, e.x, e.y);
          e.setVelocity(Math.cos(pushAngle) * 480, Math.sin(pushAngle) * 480);
          e.isKnockedBack = true;
          this.addChaosMark(e, 2);
          this.time.delayedCall(250, () => {
            if (e.active) e.isKnockedBack = false;
          });
        });

        // 묵직하고 간결한 영문/한글 선언 배너
        const banner = this.add
          .text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 70,
            'THE CRAWLING CHAOS\n[ 기어오는 혼돈 : 니알라토텝 ]',
            {
              fontFamily: 'Georgia, serif',
              fontSize: '26px',
              color: '#e879f9',
              align: 'center',
              fontStyle: 'bold',
              stroke: '#090414',
              strokeThickness: 6,
            }
          )
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(200);

        this.tweens.add({
          targets: banner,
          y: banner.y - 30,
          alpha: 0,
          delay: 1600,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => banner.destroy(),
        });
      });
    }
  }

  createHUD() {
    this.hudForm = this.add
      .text(20, 20, 'FORM: MORTAL CULTIST', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#f8fafc',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(100);
    this.hudLv = this.add
      .text(20, 44, 'HP: 100/100', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#f43f5e',
      })
      .setScrollFactor(0)
      .setDepth(100);
    this.hudPacifist = this.add
      .text(20, 68, 'SLASHES: 0 | PARRIES: 0', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#0ea5e9',
      })
      .setScrollFactor(0)
      .setDepth(100);

    // ★ 좌측 HUD(x: 20~260)와 겹치지 않도록 우측 상단(중심 x: 530, 너비 420)으로 배치 & 반투명화
    this.bossHpBg = this.add
      .rectangle(530, 38, 420, 16, 0x0f172a, 0.75) // 배경 투명도 0.75
      .setStrokeStyle(1, 0x475569, 0.8)
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);

    // 시작점 x = 530 - (420 / 2) = 320
    this.bossHpBar = this.add
      .rectangle(320, 38, 420, 16, 0xb91c1c, 0.85) // 체력바 투명도 0.85
      .setScrollFactor(0)
      .setDepth(101)
      .setVisible(false)
      .setOrigin(0, 0.5);

    this.bossName = this.add
      .text(530, 18, '성벌군 대주교 (Grand Inquisitor)', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#f8fafc',
      })
      .setScrollFactor(0)
      .setDepth(102)
      .setOrigin(0.5)
      .setAlpha(0.9)
      .setVisible(false);

    this.hudGuide = this.add
      .text(
        20,
        565,
        '[WASD] 이동 | [좌클릭] 단검 베기 (적 붉은 점멸 시 카운터!) | [우클릭] 패링 | [spacebar] 대쉬',
        { fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }
      )
      .setScrollFactor(0)
      .setDepth(100);
    this.subliminalText = this.add
      .text(400, 300, 'YOU ARE\nCULTIST', {
        fontFamily: 'Georgia, serif',
        fontSize: '72px',
        color: '#ff003c',
        fontStyle: 'bold',
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200)
      .setAlpha(0);
  }

  update(time) {
    if (
      this.physics.world.isPaused ||
      this.state.isPaused ||
      this.state.isGameOver
    )
      return;
    this.handlePlayerMovement();
    this.handleEnemiesAI();
    if (this.state.isBossSpawned && this.boss && this.boss.active) {
      this.handleBossAI(time);
    }
    this.renderDynamicTentacles(time);
    this.renderChaosMarks(time); // ★ 적들에게 쌓인 혼돈 낙인 실시간 렌더링

    this.drawFormEyes();

    if (this.nodensEye) {
      const eyeAngle = this.player.rotation;
      this.nodensEye.setPosition(
        this.player.x + Math.cos(eyeAngle) * 7,
        this.player.y + Math.sin(eyeAngle) * 7
      );
    }

    if (this.state.form === 'NYARLATHOTEP' && this.state.isChaos) {
      // 1. 시간 종료 체크
      if (this.time.now > this.chaosEndTime) {
        this.state.isChaos = false;
        this.state.nyarlaCombo = 0;

        // 이펙트 및 타이머 정리
        if (this.chaosOverlay) this.chaosOverlay.destroy();
        if (this.chaosDamageTimer) this.chaosDamageTimer.remove();

        this.hudGuide
          .setText(
            '[각성: 니알라토텝] 기어오는 혼돈과 하나가 되었습니다.(5연속 처치 시 폭주)'
          )
          .setColor('#a855f7');
        this.updateHUD();
      }
      // 2. 유지 중일 때 보랏빛 혼돈 파티클 생성
      else {
        if (Phaser.Math.Between(0, 1) === 0) {
          // 50% 확률로 매 프레임 생성
          const p = this.add
            .circle(
              this.player.x + Phaser.Math.Between(-25, 25),
              this.player.y + Phaser.Math.Between(-25, 25),
              Phaser.Math.Between(2, 5),
              0xa855f7,
              0.8
            )
            .setDepth(11);

          this.tweens.add({
            targets: p,
            y: p.y - 40,
            alpha: 0,
            scale: 0,
            duration: 600,
            ease: 'Sine.easeOut',
            onComplete: () => p.destroy(),
          });
        }
      }
    }
    // ★ [무신앙자-β] 혈웅덩이 밟기 판정 및 광기 게이지 처리
    if (this.state.form === 'THE FAITHLESS' && this.state.awakeningPath === 'BETA') {
      if (this.bloodPools) {
        let steppingOnBlood = false;

        for (const pool of this.bloodPools) {
          if (pool.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, pool.x, pool.y) < 35) {
            steppingOnBlood = true;
            break;
          }
        }

        // 장판을 밟고 있다면 현재 시간 기준 3초(3000ms) 뒤로 광기 버프 지속시간 연장
        if (steppingOnBlood) {
          this.state.isMadness = true;
          this.state.madnessEndTime = time + 3000;
        }
      }

      // 광기(Madness) 상태 유지 및 시각 연출
      if (this.state.isMadness) {
        if (time > this.state.madnessEndTime) {
          this.state.isMadness = false;
          this.player.clearTint();
          this.restoreFormTint();
        } else {
          // 몸에서 붉은 기운이 끓어오르는 연출
          if (Math.random() < 0.12) this.player.setTint(0xff0000);
          else this.restoreFormTint();

          // 끓어오르는 핏방울 파티클
          if (Math.random() < 0.35) {
            const bp = this.add.circle(
              this.player.x + Phaser.Math.Between(-15, 15),
              this.player.y + Phaser.Math.Between(-15, 15),
              Math.random() * 3 + 1.5, 0xdc2626, 0.85
            ).setDepth(11);

            this.tweens.add({ targets: bp, y: bp.y - 25, alpha: 0, duration: 450, onComplete: () => bp.destroy() });
          }
        }
      }
    }
  }

  handlePlayerMovement() {
    this.player.setRotation(this.getAimAngle());

    if (!this.player.isLunging) {
      let vx = 0,
        vy = 0;
      const spd =
        this.state.form === 'THE FAITHLESS'
          ? GAME_CONFIG.PLAYER.SPEED * 1.35
          : GAME_CONFIG.PLAYER.SPEED;
      if (this.keys.A.isDown) vx = -spd;
      else if (this.keys.D.isDown) vx = spd;
      if (this.keys.W.isDown) vy = -spd;
      else if (this.keys.S.isDown) vy = spd;
      if (vx !== 0 && vy !== 0) {
        vx *= 0.7071;
        vy *= 0.7071;
      }
      // ★ 2. 모바일 조이스틱이 활성화된 경우 조이스틱 속도 우선 적용
      if (this.joyData && this.joyData.active) {
        vx = this.joyData.vx * spd;
        vy = this.joyData.vy * spd;
      }

      this.player.setVelocity(vx, vy);
    }

    this.bloodOrbs.getChildren().forEach((orb) => {
      if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          orb.x,
          orb.y
        ) < 120
      )
        this.physics.moveToObject(orb, this.player, 340);
    });

    // ★ [수정됨] 무신앙자 전용 붉은 안광 위치 실시간 업데이트 (에러 유발 코드 삭제)
    if (this.state.form === 'THE FAITHLESS') {
      const angle = this.player.rotation;

      // 플레이어 중심에서 눈 위치(앞쪽) 계산
      const offsetX = Math.cos(angle) * 7;
      const offsetY = Math.sin(angle) * 7;

      // setLocation 대신 가장 표준적인 setPosition 사용!
      this.redEyeEmitter.setPosition(
        this.player.x + offsetX,
        this.player.y + offsetY
      );

      // 플레이어가 움직이는 것만으로도 자연스럽게 뒤로 잔상이 남습니다!)
    }
  }

  performDaggerSlash() {
    if (!this.state.canSlash || this.physics.world.isPaused) return;
    this.state.canSlash = false;

    this.state.slashes++;
    this.updateHUD();

    // 노덴스 히든 해금 카운트 (0킬 상태에서 허공 베기 100회)
    if (this.state.form === 'MORTAL CULTIST' && this.state.kills === 0) {
      this.state.emptySlashes++;

      if (this.state.emptySlashes % 25 === 0 && this.state.emptySlashes < 100) {
        const step = this.state.emptySlashes / 25;
        this.cameras.main.shake(120 * step, 0.005 * step);

        const mouseWorld = this.cameras.main.getWorldPoint(
          this.input.activePointer.x,
          this.input.activePointer.y
        );
        for (let i = 0; i < step * 2; i++) {
          const crack = this.add
            .circle(
              mouseWorld.x + Phaser.Math.Between(-15, 15),
              mouseWorld.y + Phaser.Math.Between(-15, 15),
              2 + step,
              0xe2e8f0,
              0.9
            )
            .setDepth(15);

          this.tweens.add({
            targets: crack,
            scaleX: 4,
            scaleY: 0.2,
            rotation: Phaser.Math.FloatBetween(-Math.PI, Math.PI),
            alpha: 0,
            duration: 350,
            onComplete: () => crack.destroy(),
          });
        }
      }

      if (this.state.emptySlashes >= 100) {
        this.awakenNodens();
        return;
      }
    }

    const angle = this.getAimAngle();

    // 제단 타격 판정 (1막 신격 제단 & 2막 베타/감마 제단 공용)
    this.shrines.getChildren().forEach((s) => {
      if (
        Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y) <=
        GAME_CONFIG.PLAYER.DAGGER_RANGE + 25
      ) {
        if (s.tierType) {
          this.triggerTier2Evolution(s.tierType); // ★ 2막 베타/감마 각성
        } else if (s.godType) {
          this.triggerGruesomeEvolution(s.godType); // 1막 신격 각성
        }
      }
    });

    // =========================================================================
    // ★ [1순위 분기] 노덴스 (NODENS) 전용 3단 차원 절단 콤보
    // (기본 단검 이펙트보다 먼저 실행하고 return하여 평타 중복을 원천 차단!)
    // =========================================================================
    if (this.state.form === 'NODENS') {
      if (this.state.comboTimer) this.state.comboTimer.remove();
      this.state.comboStep = (this.state.comboStep || 0) + 1;
      let currentCooldown = 280;

      // 살짝 앞으로 미끄러지는 스텝
      this.player.isLunging = true;
      this.player.setVelocity(Math.cos(angle) * 240, Math.sin(angle) * 240);
      this.time.delayedCall(80, () => {
        if (this.player) this.player.isLunging = false;
      });

      // [1단] 가로 공간 절단
      if (this.state.comboStep === 1) {
        currentCooldown = 280;
        const slashX = this.player.x + Math.cos(angle) * 50;
        const slashY = this.player.y + Math.sin(angle) * 50;
        const rift = this.add
          .rectangle(slashX, slashY, 120, 6, 0x38bdf8, 1)
          .setRotation(angle + Math.PI / 2)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(14);

        this.tweens.add({
          targets: rift,
          scaleX: 1.5,
          alpha: 0,
          duration: 150,
          onComplete: () => rift.destroy(),
        });
        this.applyAreaDamage(slashX, slashY, 75, angle, 45);
      }
      // [2단] 심연의 직선 찌르기
      else if (this.state.comboStep === 2) {
        currentCooldown = 340;
        const thrustX = this.player.x + Math.cos(angle) * 80;
        const thrustY = this.player.y + Math.sin(angle) * 80;
        const thrust = this.add
          .rectangle(thrustX, thrustY, 160, 5, 0xe2e8f0, 1)
          .setRotation(angle)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(14);

        this.tweens.add({
          targets: thrust,
          scaleX: 1.8,
          alpha: 0,
          duration: 180,
          onComplete: () => thrust.destroy(),
        });
        this.applyAreaDamage(thrustX, thrustY, 65, angle, 65);
      }
      // [3단] 돌진 베기 + 차원 검기 발사
      else if (this.state.comboStep === 3) {
        const isBeta = this.state.awakeningPath === 'BETA';
        currentCooldown = isBeta ? 360 : this.state.isExAwakened ? 560 : 680;
        if (this.state.isAct2 && this.state.form === 'NODENS') this.state.gammaProgress++;
        // ★ 베타가 아니면 3단에서 콤보 종료(0), 베타면 4단 연계를 위해 유지!
        if (!isBeta) this.state.comboStep = 0;

        this.player.x += Math.cos(angle) * 40;
        this.player.y += Math.sin(angle) * 40;
        this.cameras.main.shake(150, 0.012);

        const waveAngles = this.state.isExAwakened
          ? [angle - 0.28, angle, angle + 0.28]
          : [angle];

        waveAngles.forEach((wAngle, idx) => {
          const isCenter = idx === 1 || waveAngles.length === 1;
          const projectile = this.add
            .rectangle(
              this.player.x,
              this.player.y,
              isCenter ? 155 : 125,
              12,
              isCenter ? 0x38bdf8 : 0x7dd3fc,
              1
            )
            .setRotation(wAngle + Math.PI / 2)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(14);

          this.tweens.add({
            targets: projectile,
            x: projectile.x + Math.cos(wAngle) * 290,
            y: projectile.y + Math.sin(wAngle) * 290,
            alpha: 0,
            scaleY: 2.2,
            duration: 380,
            ease: 'Cubic.easeOut',
            onComplete: () => projectile.destroy(),
          });

          const hitX = this.player.x + Math.cos(wAngle) * 145;
          const hitY = this.player.y + Math.sin(wAngle) * 145;
          this.applyAreaDamage(hitX, hitY, 140, wAngle, isCenter ? 110 : 55);
        });
      }
      // ★ [4단 - 노덴스-β 전용] 플레이어 중심 X자(Cross) 차원 절단 검기 발사!
      else if (this.state.comboStep >= 4) {
        currentCooldown = 620;
        this.state.comboStep = 0; // 4단 완료 후 초기화

        this.cameras.main.shake(220, 0.02);
        this.cameras.main.flash(120, 56, 189, 248);

        const startX = this.player.x;
        const startY = this.player.y;
        const travelDist = 340;
        const targetX = startX + Math.cos(angle) * travelDist;
        const targetY = startY + Math.sin(angle) * travelDist;

        // 공격 방향(angle)을 기준으로 ±45도(PI/4) 교차하는 X자 검기 2개 생성
        [-Math.PI / 4, Math.PI / 4].forEach((crossOffset) => {
          const blade = this.add
            .rectangle(startX, startY, 175, 10, 0xe0f2fe, 0.95)
            .setStrokeStyle(2, 0x38bdf8, 1)
            .setRotation(angle + crossOffset)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(15);

          this.tweens.add({
            targets: blade,
            x: targetX,
            y: targetY,
            scaleX: 1.45,
            scaleY: 1.8,
            alpha: 0,
            duration: 420,
            ease: 'Cubic.easeOut',
            onComplete: () => blade.destroy(),
          });
        });

        // X자 검기가 플레이어 중심에서 전방으로 훑고 지나가며 2연속 광역 절단 타격!
        this.applyAreaDamage(
          startX + Math.cos(angle) * 70,
          startY + Math.sin(angle) * 70,
          135,
          angle,
          85
        );
        this.time.delayedCall(140, () => {
          if (!this.state.isGameOver) {
            this.applyAreaDamage(
              startX + Math.cos(angle) * 210,
              startY + Math.sin(angle) * 210,
              155,
              angle,
              105
            );
          }
        });
      }

      this.time.delayedCall(currentCooldown, () => {
        this.state.canSlash = true;
      });

      if (this.state.comboStep > 0) {
        this.state.comboTimer = this.time.delayedCall(900, () => {
          this.state.comboStep = 0;
        });
      }
      return; // ★ 여기서 함수가 완전히 종료되므로 아래 기본 평타가 절대 나가지 않습니다!
    }

    // =========================================================================
    // [기본 런지 & 초승달 단검 궤적 이펙트] (노덴스가 아닐 때만 실행됨)
    // =========================================================================
    this.player.isLunging = true;
    const mult = this.state.form === 'THE FAITHLESS' ? 1.5 : 1.0;
    this.player.setVelocity(
      Math.cos(angle) * GAME_CONFIG.PLAYER.LUNGE_SPEED * mult,
      Math.sin(angle) * GAME_CONFIG.PLAYER.LUNGE_SPEED * mult
    );
    this.time.delayedCall(90, () => {
      this.player.isLunging = false;
    });

    const slashGfx = this.add
      .graphics()
      .setDepth(12)
      .setBlendMode(Phaser.BlendModes.ADD);
    const color =
      this.state.form === 'HASTUR'
        ? 0xfacc15
        : this.state.form === 'NYARLATHOTEP'
          ? 0xc084fc
          : this.state.form === 'CTHULHU'
            ? 0x10b981
            : this.state.form === 'CTHUGHA'
              ? 0xf97316
              : this.state.form === 'THE FAITHLESS'
                ? 0xef4444
                : 0xffffff;

    const halfArc = Phaser.Math.DegToRad(GAME_CONFIG.PLAYER.DAGGER_ARC_DEG / 2);
    const range = GAME_CONFIG.PLAYER.DAGGER_RANGE;
    const segments = 8;
    const maxThickness = 14;
    const points = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const a = angle - halfArc + t * (halfArc * 2);
      const r = range + Math.sin(t * Math.PI) * 3;
      points.push(
        new Phaser.Math.Vector2(
          this.player.x + Math.cos(a) * r,
          this.player.y + Math.sin(a) * r
        )
      );
    }

    for (let i = segments; i >= 0; i--) {
      const t = i / segments;
      const a = angle - halfArc + t * (halfArc * 2);
      const thickness = Math.sin(t * Math.PI) * maxThickness;
      const slant = (t - 0.5) * 0.06;
      const r = range - thickness;
      points.push(
        new Phaser.Math.Vector2(
          this.player.x + Math.cos(a + slant) * r,
          this.player.y + Math.sin(a + slant) * r
        )
      );
    }

    const EDGE_COLORS = {
      CTHULHU: 0x064e3b,
      NYARLATHOTEP: 0x4c1d95,
      HASTUR: 0x78350f,
      'THE FAITHLESS': 0x111827,
      CTHUGHA: 0x7c2d12,
    };

    const edgeColor = EDGE_COLORS[this.state.form] || 0x000000;
    slashGfx
      .fillStyle(color, 0.85)
      .fillPoints(points, true)
      .lineStyle(1.5, edgeColor, 0.9)
      .strokePoints(points, true);

    this.time.delayedCall(75, () => slashGfx.destroy());

    // =========================================================================
    // [크툴루 평타] 25킬당 촉수 1발 추가 (최초 1발은 블랙홀 인력, 이후 탄은 넉백 없는 광역딜)
    // =========================================================================
    if (this.state.form === 'CTHULHU') {
      const now = this.time.now;
      const isBeta = this.state.awakeningPath === 'BETA';
      const cthulhuCd = isBeta ? 1150 : this.state.isExAwakened ? 1400 : 2000;

      // ★ 핵심: 25킬마다 탄환 1발씩 추가 (기본 1발 + 킬수/25), 알파 각성 시 +2발 보너스
      const bonusShots = Math.floor(this.state.kills / 25);
      const totalShots = Math.min(1 + bonusShots + (this.state.isExAwakened ? 2 : 0), 5); // 최대 5발 제한

      if (!this.lastCthulhuSpitTime || now - this.lastCthulhuSpitTime >= cthulhuCd) {
        this.lastCthulhuSpitTime = now;
        const shootAngle = angle;

        for (let b = 0; b < totalShots; b++) {
          this.time.delayedCall(b * 90, () => {
            if (this.player && this.player.active) {
              const spread = (Math.random() - 0.5) * (0.15 + totalShots * 0.05);

              // ★ 첫 번째 탄(b === 0)에게만 블랙홀 인력 부여!
              const isBlackHole = (b === 0);
              this.fireCthulhuTendril(shootAngle + spread, isBlackHole);
            }
          });
        }
      }
    }

    if (this.state.form === 'THE FAITHLESS') {
      const isBeta = this.state.awakeningPath === 'BETA';
      const isGamma = this.state.awakeningPath === 'GAMMA';
      const isOmega = this.state.awakeningTier >= 3;

      const slashX = this.player.x + Math.cos(angle) * 48;
      const slashY = this.player.y + Math.sin(angle) * 48;

      // 1. [기본] 넓은 반원형 핏빛 참격
      const slash1 = this.add.ellipse(slashX, slashY, 105, 32, 0xb91c1c, 1).setRotation(angle).setDepth(14);
      this.tweens.add({ targets: slash1, scaleX: 1.45, scaleY: 2.3, alpha: 0, duration: 150, ease: 'Quad.easeOut', onComplete: () => slash1.destroy() });

      // 2. [80킬 알파(-α)] 십자(X) 교차 참격 추가
      if (this.state.isExAwakened) {
        const slash2 = this.add.ellipse(slashX, slashY, 115, 26, 0xef4444, 0.9).setRotation(angle + Math.PI / 2.2).setBlendMode(Phaser.BlendModes.ADD).setDepth(15);
        this.tweens.add({ targets: slash2, scaleX: 1.6, scaleY: 2.5, alpha: 0, duration: 170, ease: 'Quad.easeOut', onComplete: () => slash2.destroy() });
      }

      // 3. [160킬 베타(-β): The Butcher] 피 장판 유무에 따른 공격 변화!
      if (isBeta) {
        if (this.state.isMadness) {
          return;
          // 장판 밟음(광기 폭주): 피의 부메랑 투척!
          this.fireBloodBoomerang(angle);
        } else {
          // 장판 없음(기본): 전방을 휩쓰는 거대한 피의 검기(혈사파) 발사!
          const bloodWave = this.add.ellipse(slashX, slashY, 130, 15, 0xdc2626, 0.9)
            .setRotation(angle + Math.PI / 2).setBlendMode(Phaser.BlendModes.ADD).setDepth(14);

          this.tweens.add({
            targets: bloodWave,
            x: slashX + Math.cos(angle) * 280,
            y: slashY + Math.sin(angle) * 280,
            scaleX: 1.8, scaleY: 2.5, alpha: 0,
            duration: 350, ease: 'Cubic.easeOut',
            onComplete: () => bloodWave.destroy()
          });

          // 혈사파 비행 경로 광역 타격 (사거리 120 반경 내 42 데미지)
          this.applyAreaDamage(slashX + Math.cos(angle) * 140, slashY + Math.sin(angle) * 120, 125, angle, 42);
        }
      }

      // 4. [200킬 오메가(-Ω): GodSlayer] 기본적으로 혈사파 탑재
      if (isOmega && !isBeta) {
        const bloodWave = this.add.ellipse(slashX, slashY, 150, 18, 0xef4444, 0.95)
          .setRotation(angle + Math.PI / 2).setBlendMode(Phaser.BlendModes.ADD).setDepth(14);
        this.tweens.add({
          targets: bloodWave, x: slashX + Math.cos(angle) * 350, y: slashY + Math.sin(angle) * 350,
          scaleX: 2.2, scaleY: 3.0, alpha: 0, duration: 320, ease: 'Cubic.easeOut', onComplete: () => bloodWave.destroy()
        });
        this.applyAreaDamage(slashX + Math.cos(angle) * 175, slashY + Math.sin(angle) * 175, 180, angle, 85);
      }

      // 5. 근접 타격 판정 및 데미지 연산 (감마는 사거리와 화력이 극대화)
      const hitRange = isGamma ? 98 : (this.state.isExAwakened ? 82 : 68);
      const baseDmg = isGamma ? 60 : (this.state.isExAwakened ? 50 : 42);

      const nearby = [...this.enemies.getChildren()];
      nearby.forEach((e) => {
        if (!e.active) return;
        const effectiveRadius = hitRange + (e.isBoss ? 24 : 0);

        if (Phaser.Math.Distance.Between(slashX, slashY, e.x, e.y) <= effectiveRadius) {
          // 본체 타격 데미지
          this.damageEnemy(e, baseDmg, angle, e.isWindingUp);

          // ★ 분기별 흡혈률 연산: 베타는 35%, 오메가는 45%, 감마는 리스크(10%)
          const healChance = isOmega ? 20 : (isBeta ? 8 : (isGamma ? 14 : 10));
          const healAmt = isOmega ? 4 : (isBeta ? 3 : 2);

          if (Phaser.Math.Between(1, 100) <= healChance && this.state.hp < this.state.maxHp) {
            this.state.hp = Math.min(this.state.maxHp, this.state.hp + healAmt);
            this.updateHUD();
          }

          // [200킬 오메가(-Ω)] 타격당한 적 내부에서 핏빛 십자가 폭발
          if (isOmega && this.triggerOmegaBloodCross) {
            this.triggerOmegaBloodCross(e.x, e.y);
          }
        }
      });
    }


    // ★ [크투가 평타 리워크] 사거리 대폭 확장(105px) + 화상 적 타격 시 화염 링 & 30% 확률 화염 장판!
    else if (this.state.form === 'CTHUGHA') {
      const cthughaRange = GAME_CONFIG.PLAYER.DAGGER_RANGE + 43; // 62 + 43 = 105px!

      // 넓어진 사거리를 시각적으로 보여주는 전방 화염 호(Arc) 이펙트 추가
      const flameWave = this.add
        .ellipse(
          this.player.x + Math.cos(angle) * 58,
          this.player.y + Math.sin(angle) * 58,
          96,
          28,
          0xf97316,
          0.75
        )
        .setRotation(angle)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(13);

      this.tweens.add({
        targets: flameWave,
        scaleX: 1.35,
        scaleY: 1.8,
        alpha: 0,
        duration: 140,
        onComplete: () => flameWave.destroy(),
      });

      this.enemies.getChildren().forEach((e) => {
        if (!e.active) return;
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          e.x,
          e.y
        );
        const diff = Math.abs(
          Phaser.Math.Angle.Wrap(
            Phaser.Math.Angle.Between(
              this.player.x,
              this.player.y,
              e.x,
              e.y
            ) - angle
          )
        );

        if (
          dist <= cthughaRange + (e.isBoss ? 28 : 0) &&
          diff <= halfArc + 0.28
        ) {
          const isCounter = e.isWindingUp;
          const wasBurning = e.isBurning;
          const ex = e.x;
          const ey = e.y;

          this.damageEnemy(
            e,
            GAME_CONFIG.PLAYER.DAGGER_DAMAGE,
            angle,
            isCounter
          );

          // 이미 불타고 있던 적을 쳤을 때: 화염 링 폭발 + (80킬 알파 이상) 30% 확률로 화염 장판 생성!
          if (wasBurning) {
            this.triggerCthughaRing({ active: true, x: ex, y: ey });

            if (this.state.isExAwakened && Math.random() < 0.3) {
              this.spawnCthughaFireZone(ex, ey);
            }
          }

          if (e.active) {
            this.applyBurn(e);
          }
        }
      });
    }
    // 기본 폼 & 제단 3신 단검 타격 판정
    else {
      const isNyarlaChaos =
        this.state.form === 'NYARLATHOTEP' && this.state.isChaos;

      // ★ 니알라토텝 폭주(isChaos) 중 평타 시: 전방에 보랏빛 환영 아가리 참격 추가 발사!
      if (isNyarlaChaos) {
        const mawX = this.player.x + Math.cos(angle) * 58;
        const mawY = this.player.y + Math.sin(angle) * 58;
        [-0.35, 0.35].forEach((slashAngle) => {
          const claw = this.add
            .ellipse(mawX, mawY, 110, 18, 0xc084fc, 0.9)
            .setRotation(angle + slashAngle)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(14);
          this.tweens.add({
            targets: claw,
            scaleX: 1.4,
            scaleY: 0.2,
            alpha: 0,
            duration: 160,
            onComplete: () => claw.destroy(),
          });
        });
      }



      this.enemies.getChildren().forEach((enemy) => {
        if (!enemy.active) return;
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y
        );
        const diff = Math.abs(
          Phaser.Math.Angle.Wrap(
            Phaser.Math.Angle.Between(
              this.player.x,
              this.player.y,
              enemy.x,
              enemy.y
            ) - angle
          )
        );

        // 폭주 중에는 평타 사거리(+25)와 각도(+0.2)가 넓어져 직접 썰어버리는 맛 극대화!
        const chaosRangeBonus = isNyarlaChaos ? 25 : 0;
        const effectiveRange =
          GAME_CONFIG.PLAYER.DAGGER_RANGE +
          chaosRangeBonus +
          (enemy.isBoss ? 28 : 0);
        const effectiveArc =
          halfArc + (isNyarlaChaos ? 0.45 : enemy.isBoss ? 0.4 : 0.25);

        if (dist <= effectiveRange && diff <= effectiveArc) {
          const isCounter = enemy.isWindingUp;
          // ★ 하스터 폼일 때는 평타도 적을 밀쳐내지 않고 제자리에 묶어둠!
          const hitDir = this.state.form === 'HASTUR' ? null : angle;

          this.damageEnemy(
            enemy,
            GAME_CONFIG.PLAYER.DAGGER_DAMAGE,
            hitDir,
            isCounter
          );

          // ★ [하스터 전용] 평타 적중 시 감전 1스택 부여 + 80킬(-α) 이후 연쇄 번개 발동!
          if (this.state.form === 'HASTUR' && enemy.active) {
            this.addShockStack(enemy, 1);
            if (this.state.isExAwakened) {
              this.triggerHasturSlashChain(enemy);
            }
          }

          // ★ [니알라토텝 전용] 평타 적중 시 혼돈 낙인 부여 & 카운터 시 등 뒤 안전 도약
          if (this.state.form === 'NYARLATHOTEP' && enemy.active) {
            this.addChaosMark(enemy, isNyarlaChaos ? 2 : 1);
            if (isCounter) {
              this.triggerNyarlaBlink(enemy, false);
            }
          }
        }
      });
    }

    const isNyarlaChaos =
      this.state.form === 'NYARLATHOTEP' && this.state.isChaos;
    const cd =
      this.state.form === 'THE FAITHLESS' || isNyarlaChaos
        ? GAME_CONFIG.PLAYER.DAGGER_COOLDOWN * 0.62 // ★ 폭주 중엔 공속 대폭 상승!
        : GAME_CONFIG.PLAYER.DAGGER_COOLDOWN;
    this.time.delayedCall(cd, () => {
      this.state.canSlash = true;
    });
  }

  performParry() {
    if (!this.state.canParry) return;
    this.state.isParrying = true;
    this.state.canParry = false;
    this.state.parriesAttempted++;

    const isDagonBeta =
      this.state.form === 'DAGON' && this.state.awakeningPath === 'BETA';

    // 2막 제단 패링 상호작용 판정
    this.shrines.getChildren().forEach((s) => {
      if (
        Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y) <=
        85
      ) {
        if (s.tierType) this.triggerTier2Evolution(s.tierType);
      }
    });

    // ★ 다곤-β: 패링 링 시각 크기(24 -> 38) 증가 및 즉시 소형 파도('MINI') 방출!
    const ringRadius = isDagonBeta ? 38 : 24;
    const ring = this.add
      .circle(
        this.player.x,
        this.player.y,
        ringRadius,
        0x38bdf8,
        isDagonBeta ? 0.2 : 0
      )
      .setStrokeStyle(isDagonBeta ? 3 : 2, 0x38bdf8)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(15);

    if (isDagonBeta) {
      this.triggerDagonWave('MINI'); // 패링만 눌러도 소형 잔물결 파도 발생!
    }

    // 다곤-β는 패링 판정 유지 시간도 180ms -> 240ms로 소폭 여유 부여
    const parryWindow = isDagonBeta
      ? GAME_CONFIG.PLAYER.PARRY_WINDOW + 60
      : GAME_CONFIG.PLAYER.PARRY_WINDOW;

    this.time.delayedCall(parryWindow, () => {
      this.state.isParrying = false;
      ring.destroy();
    });
    this.time.delayedCall(GAME_CONFIG.PLAYER.PARRY_COOLDOWN, () => {
      this.state.canParry = true;
    });
  }

  restoreFormTint() {
    if (!this.player || !this.player.active) return;

    // 1. 단색으로 덮어버리던 Tint 제거
    this.player.clearTint();

    // 2. 현재 상태(form)에 맞는 고해상도 테두리 텍스처로 즉시 교체!
    const texKey = `tex_${this.state.form}`;
    if (this.textures.exists(texKey)) {
      this.player.setTexture(texKey);
    } else {
      // 예외 처리 (혹시 텍스처가 없다면 기본 컬티스트 텍스처로)
      this.player.setTexture('tex_MORTAL CULTIST');
    }
  }

  // hitAngle의 기본값을 null로 설정 (null이면 넉백 없음!)
  damageEnemy(enemy, baseDamage, hitAngle = null, isCounterHit = false) {
    if (!enemy || !enemy.active) return;

    let finalDmg =
      baseDamage *
      (this.state.form === 'THE FAITHLESS' ? 1.15 : 1) *
      (this.state.dmgMult || 1);

    // ★ 2. 그레이트 딥 원 특성: 받는 피해 70% 적용 (30% 피해 감소)
    if (enemy.isGreatDeepOne) {
      finalDmg *= 0.7;
    }

    if (isCounterHit) {
      if (this.state.isAct2 && this.state.form === 'THE FAITHLESS') this.state.gammaProgress++;
      finalDmg *=
        this.state.isTrueMortal && this.state.isExAwakened ? 4.2 : 3.0;
      enemy.isWindingUp = false;
      this.triggerCounterDopamine(enemy.x, enemy.y);
    } else if (hitAngle !== null) {
      // ★ 도트 데미지(hitAngle === null)일 때는 화면이 흔들리지 않도록 방지
      this.cameras.main.shake(70, 0.004);
    }

    // ★ 피격 시 백색 점멸 및 0.09초 뒤 상태별 고유 색상 완벽 복구 (중복 코드 통합)
    enemy.setTintFill(0xffffff);
    this.time.delayedCall(90, () => {
      if (!enemy || !enemy.active) return;
      if (enemy.isWindingUp) return; // 공격 전조 중이면 전조 색상 유지

      if (enemy.isBoss && enemy.phase === 2 && !enemy.isGreatDeepOne) {
        enemy.setTint(0xfca5a5);
      } else if (enemy.isBurning) {
        enemy.setTint(0xf97316); // 화상 상태면 주황빛 유지
      } else {
        enemy.clearTint();
      }
    });

    enemy.hp -= finalDmg;
    this.bloodEmitter.explode(
      isCounterHit ? 45 : hitAngle !== null ? 14 : 5, // 도트 데미지는 출혈 파티클도 작게
      enemy.x,
      enemy.y
    );

    // ★ 3. 넉백 처리부에 !enemy.knockbackImmune 조건 추가 (넉백 완전 면역!)
    if (hitAngle !== null && hitAngle !== undefined && !enemy.knockbackImmune) {
      enemy.setVelocity(Math.cos(hitAngle) * 260, Math.sin(hitAngle) * 260);
      enemy.isKnockedBack = true;

      this.time.delayedCall(120, () => {
        if (enemy.active) {
          enemy.isKnockedBack = false;
          if (enemy.body) enemy.setVelocity(0, 0);
        }
      });
    }

    if (enemy === this.boss) {
      const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
      this.bossHpBar.width = 420 * hpRatio;
    }

    if (enemy.hp <= 0) {
      if (enemy === this.boss) {
        this.bossDefeated();
        return;
      }
      this.killEnemy(enemy, isCounterHit);
    }
  }

  triggerCounterDopamine(x, y) {
    this.physics.world.isPaused = true;
    this.cameras.main.shake(160, 0.018);
    this.cameras.main.flash(90, 255, 255, 255);
    //this.subliminalText.setAlpha(0.85);

    if (this.state.form === 'HASTUR') {
      const spike = this.add
        .circle(x, y, 65, 0xfacc15, 0.35)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: spike,
        scale: 1.5,
        alpha: 0,
        duration: 220,
        onComplete: () => spike.destroy(),
      });
    }
    // setTimeout(() => { this.physics.world.isPaused = false; this.subliminalText.setAlpha(0); }, 75);
    this.time.delayedCall(75, () => {
      this.physics.world.isPaused = false;
    });
  }

  killEnemy(enemy, wasCounter) {
    if (enemy.chaosTimer) enemy.chaosTimer.remove();
    if (enemy.burnTimer) enemy.burnTimer.remove(); // 화상 타이머 정리


    // ★ [크투가-β 전용] 화상 상태에서 사망 시 불타는 영혼(화염구) 사출!
    if (
      this.state.form === 'CTHUGHA' &&
      this.state.awakeningPath === 'BETA' &&
      enemy.isBurning
    ) {
      this.spawnBurningSoul(enemy.x, enemy.y);
    }

    // ★ [무신앙자-β (The Butcher)] 적 처치 시 8초간 유지되는 피 장판 생성
    if (this.state.form === 'THE FAITHLESS' && this.state.awakeningPath === 'BETA') {
      this.spawnBloodPool(enemy.x, enemy.y);
    }

    this.bloodDecalGfx.fillStyle(0x450a0a, 0.75).fillCircle(enemy.x, enemy.y, Phaser.Math.Between(10, 22));

    // ★ 고정값 0.7 대신 this.state.orbDropRate 사용 (감마 선택 시 0.35로 작동!)
    if (Math.random() < (this.state.orbDropRate ?? 0.7)) {
      const orbCount = wasCounter ? 2 : 1;
      for (let i = 0; i < orbCount; i++) {
        this.bloodOrbs
          .create(
            enemy.x + Phaser.Math.Between(-12, 12),
            enemy.y + Phaser.Math.Between(-12, 12),
            'blood_orb'
          )
          .setBlendMode(Phaser.BlendModes.ADD);
      }
    }

    if (this.state.isBossActive || (this.boss && this.boss.active)) {
      // 킬 수는 올리지 않고 적만 파괴
      enemy.destroy();
      return;
    } else {
      enemy.destroy();
    }
    this.state.kills++;
    this.updateHUD();

    if (this.ritualEvents[this.state.kills]) {
      this.ritualEvents[this.state.kills](); // 해당 킬 수에 배정된 함수 실행
    }

    if (this.state.form === 'NYARLATHOTEP') {
      this.triggerNyarlaBlink(enemy, true);
    }
  }

  collectBlood(player, orb) {
    orb.destroy();
    if (this.state.isGameOver) return;

    // 피구슬 1개당 체력 0.5 회복 (최대 체력 초과 방지)
    if (this.state.hp < this.state.maxHp) {
      this.state.hp = Math.min(this.state.maxHp, this.state.hp + 0.5);
      this.updateHUD();
    }
  }

  spawnAscensionShrines() {
    if (this.state.form !== 'MORTAL CULTIST') return;

    const cx = 700;
    const cy = 700;
    const radius = 162.5; // 안쪽 원(145)과 바깥쪽 원(180)의 정중앙 둘레

    // 120도 간격의 3개 방향 각도 (12시, 4시, 8시 방향)
    const shrineConfigs = [
      {
        godType: 'HASTUR',
        color: 0xfacc15, // 황색
        angle: -Math.PI / 2, // 12시 방향 (북쪽)
      },
      {
        godType: 'CTHULHU', // 크툴루 제단 속성
        color: 0x10b981, // 에메랄드/심해 녹색
        angle: -Math.PI / 2 + (Math.PI * 2) / 3, // 4시 방향 (동남쪽)
      },
      {
        godType: 'CTHUGHA', // ★ 기존 니알라토텝 자리 대체!
        color: 0xf97316, // 타오르는 불꽃의 주황색
        angle: -Math.PI / 2 + (Math.PI * 4) / 3, // 8시 방향 (서남쪽)
      },
    ];

    shrineConfigs.forEach((cfg) => {
      const sx = cx + Math.cos(cfg.angle) * radius;
      const sy = cy + Math.sin(cfg.angle) * radius;

      const shrine = this.add
        .circle(sx, sy, 28, cfg.color, 0.25)
        .setStrokeStyle(3, cfg.color)
        .setDepth(5);

      this.physics.add.existing(shrine, true); // 정적 물리 바디
      shrine.godType = cfg.godType;
      this.shrines.add(shrine);

      // (선택 사항) 제단이 솟아오르는 가벼운 맥동 연출
      this.tweens.add({
        targets: shrine,
        scale: 1.15,
        alpha: 0.45,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    if (this.hudGuide) {
      this.hudGuide
        .setText('마법진에 형성된 세 개의 제단이 당신을 이끕니다.')
        .setColor('#facc15');
    }
  }

  // ★ [160킬 자동 진화 판정] 신격별 특수 조건 달성 시 감마(-γ), 미달 시 베타(-β) 진화
  evaluateTier2Evolution() {
    if (this.state.awakeningTier >= 2) return;

    const form = this.state.form;
    const prog = this.state.gammaProgress || 0;
    let isGammaUnlocked = false;

    // 신격별 고유 Tainted(감마) 해금 조건 판정
    switch (form) {
      case 'THE FAITHLESS':
        // 체력 45% 이하의 혈투 중이거나 카운터 8회 이상 달성 시
        isGammaUnlocked = this.state.hp <= this.state.maxHp * 0.45 || prog >= 8;
        break;
      case 'HASTUR':
        isGammaUnlocked = prog >= 12; // 3중첩 마비 12회 이상
        break;
      case 'CTHUGHA':
        isGammaUnlocked = prog >= 18; // 화염 링 폭발 18회 이상
        break;
      case 'CTHULHU':
        isGammaUnlocked = prog >= 15; // 대시 피니셔 타격 15회 이상
        break;
      case 'NYARLATHOTEP':
        isGammaUnlocked = prog >= 3; // 폭주(Chaos Mode) 3회 이상 진입
        break;
      case 'DAGON':
        isGammaUnlocked = prog >= 15; // 2막 패링 성공 15회 이상
        break;
      case 'NODENS':
        isGammaUnlocked = prog >= 12; // 3단 차원 검기 12회 이상 발동
        break;
      default:
        // MORTAL CULTIST (불굴의 필멸자): 2막 진입 후 무피격 유지 시 감마 각성
        isGammaUnlocked = (this.state.act2HitsTaken || 0) === 0;
        break;
    }

    this.triggerTier2Evolution(isGammaUnlocked ? 'GAMMA' : 'BETA');
  }

  // ★ [2막 제단 선택 완료] 베타(β) 또는 감마(γ) 스탯/배율 적용
  triggerTier2Evolution(tierType) {
    if (this.state.awakeningTier >= 2) return;
    this.state.awakeningTier = 2;
    this.state.awakeningPath = tierType; // 'BETA' or 'GAMMA'

    // 1. 제단 및 부속 텍스트/코어 깔끔하게 일괄 철거
    this.shrines.getChildren().forEach((s) => {
      if (s.decorations) s.decorations.forEach((d) => d.destroy());
    });
    this.shrines.clear(true, true);

    // ★ [1.0 최종 밸런싱] 160킬 베타(-β) 폼별 체력 및 최종 데미지 배율
    const TIER2_STATS = {
      // 1) 제단 3신 (안정적인 정통파)
      CTHULHU: { betaHp: 50, betaMult: 1.25, gammaMult: 1.85 }, // 심해 중장갑 (총 MaxHP 180)
      HASTUR: { betaHp: 35, betaMult: 1.3, gammaMult: 1.9 },    // 광역 CC 딜러 (총 MaxHP 155)
      CTHUGHA: { betaHp: 40, betaMult: 1.3, gammaMult: 2.0 },   // 중거리 화염 지속딜러 (총 MaxHP 160)

      // 2) 히든 신격 (고유 메커니즘 특화)
      DAGON: { betaHp: 45, betaMult: 1.3, gammaMult: 1.85 },        // 반사 탱커 (총 MaxHP 170)
      NODENS: { betaHp: 30, betaMult: 1.35, gammaMult: 2.0 },       // 4단 콤보 검성 (총 MaxHP 150)
      NYARLATHOTEP: { betaHp: 30, betaMult: 1.35, gammaMult: 2.05 },// 폭주 암살자 (총 MaxHP 145)
      'THE FAITHLESS': { betaHp: 25, betaMult: 1.2, gammaMult: 1.75 }, // 초고속 흡혈 광전사 (자체 1.15배 보유, 총 MaxHP 145)

      // 3) 하드코어 순수 인간 (TRUE MORTAL 보상 극대화)
      'MORTAL CULTIST': { betaHp: 40, betaMult: 1.5, gammaMult: 2.2 },
    };

    const st = TIER2_STATS[this.state.form] || TIER2_STATS['MORTAL CULTIST'];

    if (tierType === 'BETA') {
      // [β : 안정과 지배] 최대 체력 증가 + 풀피 회복 + 안정적 화력 상승

      if (this.state.form === 'DAGON') {
        this.player.body.setCircle(22, -6, -6); // 기본(16)보다 넓은 투사체 패링 반경 부여
      }

      this.state.maxHp += st.betaHp;
      this.state.hp = this.state.maxHp;
      this.state.dmgMult = st.betaMult;
      this.state.orbDropRate = 0.75; // 피구슬 스폰율 75%로 소폭 우대

      this.cameras.main.flash(600, 56, 189, 248);
      this.cameras.main.shake(450, 0.02);

      this.hudGuide
        .setText(
          `[β-각성] 신격의 통제력이 상승합니다! (데미지 x${st.betaMult})`
        )
        .setColor('#38bdf8');
    } else if (tierType === 'GAMMA') {
      // [γ : 광기와 파멸] 최대 체력 42%로 대폭 삭감 + 배율 2배 이상 폭증 + 피구슬 35%로 반감
      this.state.maxHp = Math.max(40, Math.floor(this.state.maxHp * 0.42));
      this.state.hp = this.state.maxHp;
      this.state.dmgMult = st.gammaMult;
      this.state.orbDropRate = 0.35; // 피구슬 스폰율 35%로 제한

      this.cameras.main.flash(750, 220, 38, 38);
      this.cameras.main.shake(700, 0.035);

      this.hudGuide
        .setText(
          `⚠️ [γ-각성: 광기 폭주] 생명력을 제물로 바쳐 파멸적인 화력을 얻었습니다! (데미지 x${st.gammaMult})`
        )
        .setColor('#f43f5e');
    }

    if (this.state.form === 'THE FAITHLESS') {
      if (tierType === 'BETA') {
        this.hudGuide.setText(`★ [The Butcher] 피의 검기가 빗발칩니다! 흡혈귀처럼 적을 도륙하십시오. (데미지 x${st.betaMult})`).setColor('#ef4444');
      } else {
        this.hudGuide.setText(`⚠️ [The Judgement] 이단 심문관들을 직접 단죄합니다! 공격 속도가 한계를 돌파합니다. (데미지 x${st.gammaMult})`).setColor('#f43f5e');
      }
    }


    // 3. 플레이어 중심 각성 충격파 링 연출 & 주변 적 넉백
    const ringColor = tierType === 'GAMMA' ? 0xff003c : 0x38bdf8;
    const waveRing = this.add
      .circle(this.player.x, this.player.y, 20, ringColor, 0.5)
      .setStrokeStyle(4, 0xffffff, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(20);

    this.tweens.add({
      targets: waveRing,
      scale: 14,
      alpha: 0,
      duration: 600,
      ease: 'Cubic.easeOut',
      onComplete: () => waveRing.destroy(),
    });

    this.enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      const a = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        e.x,
        e.y
      );
      e.setVelocity(Math.cos(a) * 480, Math.sin(a) * 480);
    });

    this.updateHUD();
  }

  triggerGruesomeEvolution(godType) {
    if (this.state.ascended) return;
    this.state.ascended = true;
    this.state.form = godType;
    this.shrines.clear(true, true);

    this.cameras.main.flash(450, 220, 0, 20);
    this.cameras.main.shake(500, 0.025);
    this.bloodEmitter.explode(90, this.player.x, this.player.y);

    const ring = this.add
      .circle(
        this.player.x,
        this.player.y,
        20,
        godType === 'HASTUR' ? 0xfacc15 : 0xa855f7,
        0.4
      )
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(20);
    this.tweens.add({
      targets: ring,
      scale: 12,
      alpha: 0,
      duration: 550,
      onComplete: () => ring.destroy(),
    });

    if (godType === 'HASTUR') {
      this.awakenHastur();
    } else if (godType === 'CTHUGHA') {
      this.awakenCthugha();
    } else if (godType === 'CTHULHU') {
      this.awakenCthulhu();
    }

    this.enemies.getChildren().forEach((e) => {
      const a = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        e.x,
        e.y
      );
      e.setVelocity(Math.cos(a) * 450, Math.sin(a) * 450);
    });
    document.title = `ASCENDED: ${godType}`;
    this.updateHUD();
  }

  // 1. 황색의 왕 - 하스터 각성
  awakenHastur() {
    this.state.form = 'HASTUR';
    this.state.ascended = true;
    this.state.canSlash = true;

    // ★ 스탯 표준화: 최대 체력 +20 & 풀피 회복
    this.state.maxHp += 20;
    this.state.hp = this.state.maxHp;

    this.player.setTint(0xfacc15);
    this.cameras.main.flash(500, 250, 204, 21);

    this.shrines.clear(true, true);
    this.hudGuide
      .setText(
        '[각성: 하스터] 황색의 왕이 도래했습니다. (번개 공격 및 감전 스탯 부여)'
      )
      .setColor('#facc15');

    this.restoreFormTint();
    this.updateHUD();
  }

  // ============================================================================
  // [하스터 전용 기믹] 황색의 감전 중첩 (10% / 20% 둔화 -> 3중첩 시 1초 마비)
  // ============================================================================
  addShockStack(enemy, stacks = 1) {
    if (!enemy || !enemy.active) return;

    // 이미 마비 상태인 적은 마비가 풀릴 때까지 스택이 쌓이지 않음
    if (enemy.isParalyzed) return;

    enemy.shockStacks = (enemy.shockStacks || 0) + stacks;

    // 4초간 추가 감전이 없으면 스택 자연 소멸
    if (enemy.shockTimer) enemy.shockTimer.remove();

    // ★ 3중첩 도달 시: 스택 소모 + 1초 마비(Stun) + 과전류 스파크 폭발!
    if (enemy.shockStacks >= 3) {
      enemy.shockStacks = 0;
      enemy.isParalyzed = true;
      if (this.state.isAct2 && this.state.form === 'HASTUR') this.state.gammaProgress++;

      // 일반 몹은 그 자리에서 즉시 정지 및 공격 전조 강제 캔슬!
      if (!enemy.isBoss && enemy.body) {
        enemy.setVelocity(0, 0);
        enemy.isWindingUp = false;
      }

      // 마비 과전류 폭발 이펙트 및 추가 데미지(35, 넉백 없음)
      const stunRing = this.add
        .circle(enemy.x, enemy.y, 24, 0xfef08a, 0.65)
        .setStrokeStyle(3, 0xfacc15, 1)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(15);

      this.tweens.add({
        targets: stunRing,
        scale: 1.8,
        alpha: 0,
        duration: 240,
        onComplete: () => stunRing.destroy(),
      });

      this.damageEnemy(enemy, 35, null, false);

      // 1초(1000ms) 뒤 마비 해제
      enemy.shockTimer = this.time.delayedCall(1000, () => {
        if (enemy && enemy.active) {
          enemy.isParalyzed = false;
        }
      });
    } else {
      // 1~2중첩 상태: 4초 유지 타이머
      enemy.shockTimer = this.time.delayedCall(4000, () => {
        if (enemy && enemy.active) {
          enemy.shockStacks = 0;
        }
      });
    }
  }

  // ★ [80킬 하스터-α 전용] 평타 적중 시 주변 적에게 뻗어나가는 연쇄 번개
  triggerHasturSlashChain(sourceEnemy) {
    if (!sourceEnemy || !sourceEnemy.active) return;

    // 다단 연쇄 시 과부하 방지를 위한 0.1초 내부 쿨타임
    const now = this.time.now;
    if (this.lastSlashChainTime && now - this.lastSlashChainTime < 100) return;
    this.lastSlashChainTime = now;

    const sx = sourceEnemy.x;
    const sy = sourceEnemy.y;

    const chainTargets = this.enemies
      .getChildren()
      .filter(
        (e) =>
          e.active &&
          e !== sourceEnemy &&
          Phaser.Math.Distance.Between(sx, sy, e.x, e.y) <= 150
      )
      .slice(0, 2); // 최대 2명에게 전이

    chainTargets.forEach((ct) => {
      const chainGfx = this.add
        .graphics()
        .setDepth(14)
        .setBlendMode(Phaser.BlendModes.ADD);
      chainGfx.lineStyle(2.5, 0xfef08a, 0.95);
      chainGfx.beginPath().moveTo(sx, sy);
      const midX = (sx + ct.x) / 2 + Phaser.Math.Between(-14, 14);
      const midY = (sy + ct.y) / 2 + Phaser.Math.Between(-14, 14);
      chainGfx.lineTo(midX, midY).lineTo(ct.x, ct.y).strokePath();

      this.tweens.add({
        targets: chainGfx,
        alpha: 0,
        duration: 160,
        onComplete: () => chainGfx.destroy(),
      });

      // 넉백 없이(null) 연쇄 번개 데미지(28) + 감전 1스택 전이!
      this.damageEnemy(ct, 28, null, false);
      if (ct.active) this.addShockStack(ct, 1);
    });
  }

  // 2. 기어오는 혼돈 - 니알라토텝 각성
  awakenNyarlathotep() {
    this.state.form = 'NYARLATHOTEP';
    this.state.ascended = true;
    this.state.canSlash = true;

    // ★ 스탯 표준화: 최대 체력 +15 & 풀피 회복
    this.state.maxHp += 15;
    this.state.hp = this.state.maxHp;

    this.player.setTint(0xa855f7);
    this.cameras.main.flash(500, 168, 85, 247);

    this.shrines.clear(true, true);
    this.hudGuide
      .setText(
        '[각성: 니알라토텝] 기어오는 혼돈과 하나가 되었습니다. (5연속 처치 시 폭주)'
      )
      .setColor('#a855f7');

    this.restoreFormTint();
    this.updateHUD();
  }

  // ★ [니알라토텝 전용 1] 혼돈의 낙인 중첩 (최대 스택 도달 시 즉시 과부하 폭발 추가!)
  addChaosMark(enemy, stacks = 1) {
    if (!enemy || !enemy.active) return;

    enemy.chaosStacks = (enemy.chaosStacks || 0) + stacks;

    // 80킬 알파(-α) 각성 시 4스택, 기본은 5스택에 도달하면 2초를 기다리지 않고 즉시 과부하 대폭발!
    const maxStackThreshold = this.state.isExAwakened ? 4 : 5;
    if (enemy.chaosStacks >= maxStackThreshold) {
      this.detonateChaosMark(enemy, true); // 즉시 강화 폭발!
      return;
    }

    // 2초간 추가 타격이 없으면 지연 폭발
    if (enemy.chaosTimer) enemy.chaosTimer.remove();
    enemy.chaosTimer = this.time.delayedCall(2000, () => {
      this.detonateChaosMark(enemy, false);
    });
  }

  // ★ 적에게 중첩된 혼돈 낙인(니알라토텝) 및 화상 표식(크투가) 실시간 렌더링
  renderChaosMarks(time) {
    if (!this.chaosMarkGfx) return;
    this.chaosMarkGfx.clear();

    this.enemies.getChildren().forEach((e) => {
      if (!e.active) return;

      // 1. [니알라토텝] 혼돈의 낙인 렌더링
      if (e.chaosStacks && e.chaosStacks > 0) {
        const stacks = e.chaosStacks;
        const isMax = stacks >= 5;
        const baseRadius = e.isBoss ? 38 : 22;

        this.chaosMarkGfx.lineStyle(
          isMax ? 2.5 : 1.5,
          isMax ? 0xf43f5e : 0xa855f7,
          Math.min(0.3 + stacks * 0.12, 0.9)
        );
        this.chaosMarkGfx.strokeCircle(e.x, e.y, baseRadius);

        const orbCount = Math.min(stacks, 6);
        const rotSpeed = time * 0.005;

        for (let i = 0; i < orbCount; i++) {
          const angle = rotSpeed + (i * (Math.PI * 2)) / orbCount;
          const ox = e.x + Math.cos(angle) * baseRadius;
          const oy = e.y + Math.sin(angle) * baseRadius;

          this.chaosMarkGfx.fillStyle(isMax ? 0xf43f5e : 0xc084fc, 0.95);
          this.chaosMarkGfx.fillCircle(ox, oy, 4);

          this.chaosMarkGfx.fillStyle(0xffffff, 1);
          this.chaosMarkGfx.fillCircle(ox, oy, 1.5);
        }
      }

      // 2. [크투가] 화상 상태 표식 렌더링 (일렁이는 이중 화염 고리 + 회전 불꽃)
      if (e.isBurning) {
        const bRadius = (e.isBoss ? 36 : 20) + Math.sin(time * 0.015) * 3;

        // 바깥쪽 진한 주황색 열기 고리
        this.chaosMarkGfx.lineStyle(2.5, 0xf97316, 0.9);
        this.chaosMarkGfx.strokeCircle(e.x, e.y, bRadius);

        // 안쪽 밝은 노란색 화염 코어 고리
        this.chaosMarkGfx.lineStyle(1.5, 0xfef08a, 0.95);
        this.chaosMarkGfx.strokeCircle(e.x, e.y, bRadius * 0.7);

        // 적 주변을 빠르게 회전하는 3개의 불꽃 코어 입자
        for (let i = 0; i < 3; i++) {
          const fAngle = -time * 0.008 + (i * (Math.PI * 2)) / 3;
          const fx = e.x + Math.cos(fAngle) * (bRadius * 0.85);
          const fy = e.y + Math.sin(fAngle) * (bRadius * 0.85);

          this.chaosMarkGfx.fillStyle(0xf97316, 1);
          this.chaosMarkGfx.fillCircle(fx, fy, 4.5);
          this.chaosMarkGfx.fillStyle(0xfef08a, 1);
          this.chaosMarkGfx.fillCircle(fx, fy, 2);
        }
      }

      // 3. [하스터] 감전 중첩(1~2스택) 및 마비(Paralyzed) 상태 렌더링
      if (e.isParalyzed) {
        // ★ 마비 상태: 적의 몸을 감싸고 파지직거리는 황금빛 지그재그 감전 속박 링
        const pRadius = e.isBoss ? 36 : 20;
        this.chaosMarkGfx.lineStyle(2.5, 0xfef08a, 0.95);
        this.chaosMarkGfx.beginPath();
        for (let i = 0; i <= 8; i++) {
          const a = (i * Math.PI) / 4 + time * 0.02;
          const jitter = i % 2 === 0 ? 4 : -4;
          const px = e.x + Math.cos(a) * (pRadius + jitter);
          const py = e.y + Math.sin(a) * (pRadius + jitter);
          if (i === 0) this.chaosMarkGfx.moveTo(px, py);
          else this.chaosMarkGfx.lineTo(px, py);
        }
        this.chaosMarkGfx.closePath().strokePath();
      } else if (e.shockStacks && e.shockStacks > 0) {
        // ★ 1~2중첩 둔화 상태: 적 주변을 궤도 회전하는 황금 스파크 구체 (1개 또는 2개)
        const sRadius = e.isBoss ? 34 : 20;
        this.chaosMarkGfx.lineStyle(1.5, 0xfacc15, 0.4 + e.shockStacks * 0.2);
        this.chaosMarkGfx.strokeCircle(e.x, e.y, sRadius);

        for (let i = 0; i < e.shockStacks; i++) {
          const sAngle = time * 0.008 + i * Math.PI;
          const sx = e.x + Math.cos(sAngle) * sRadius;
          const sy = e.y + Math.sin(sAngle) * sRadius;

          this.chaosMarkGfx.fillStyle(0xfacc15, 1);
          this.chaosMarkGfx.fillCircle(sx, sy, 4);
          this.chaosMarkGfx.fillStyle(0xffffff, 1);
          this.chaosMarkGfx.fillCircle(sx, sy, 1.8);
        }
      }
    });
  }

  // ★ 낙인 폭발 처리 (80킬 -α 각성 시 주변 광역 폭발 및 낙인 전염 기능 추가!)
  detonateChaosMark(enemy, isInstant = false) {
    if (!enemy || !enemy.active || !enemy.chaosStacks || enemy.chaosStacks <= 0)
      return;

    if (enemy.chaosTimer) {
      enemy.chaosTimer.remove();
      enemy.chaosTimer = null;
    }

    const stacks = enemy.chaosStacks;
    enemy.chaosStacks = 0; // 스택 초기화

    const isAlpha = this.state.isExAwakened; // ★ 80킬 알파 진화 여부
    const dmgPerStack = isInstant ? 38 : 28;
    const totalBurstDmg = stacks * dmgPerStack;

    const ex = enemy.x;
    const ey = enemy.y;

    // 폭발 반경 (알파 각성 시 광역으로 팽창)
    const burstCircle = this.add
      .circle(ex, ey, 18 + stacks * 5, isAlpha ? 0xa855f7 : 0x9333ea, 0.55)
      .setStrokeStyle(3, 0xf0abfc, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(15);

    this.tweens.add({
      targets: burstCircle,
      scale: isAlpha ? 2.6 : 1.8,
      alpha: 0,
      duration: 260,
      ease: 'Cubic.easeOut',
      onComplete: () => burstCircle.destroy(),
    });

    // 교차하는 보랏빛 이빨 참격 이펙트
    const jawCount = Math.min(stacks + (isAlpha ? 2 : 1), 5);
    for (let i = 0; i < jawCount; i++) {
      const jaw = this.add
        .ellipse(ex, ey, 65 + stacks * 8, 12, 0xd8b4f8, 0.95)
        .setRotation((i * Math.PI) / jawCount + Math.random() * 0.3)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(16);

      this.tweens.add({
        targets: jaw,
        scaleX: 1.5,
        scaleY: 0.2,
        alpha: 0,
        duration: 200,
        onComplete: () => jaw.destroy(),
      });
    }

    this.cameras.main.shake(120, Math.min(0.008 * stacks, 0.025));

    // 1. 숙주(본체) 적에게 낙인 폭발 데미지 부여
    const burstAngle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      ex,
      ey
    );
    this.damageEnemy(enemy, totalBurstDmg, burstAngle, false);

    // ★ 2. [80킬 알파(-α) 전용 특성] 폭발 주변(95px) 적들에게 스플래시 데미지 + 낙인 1스택 전염!
    if (isAlpha) {
      const splashDmg = Math.floor(totalBurstDmg * 0.5);
      const nearEnemies = [...this.enemies.getChildren()];
      nearEnemies.forEach((other) => {
        if (!other || !other.active || other === enemy) return;
        const d = Phaser.Math.Distance.Between(ex, ey, other.x, other.y);
        if (d <= 95) {
          const sAngle = Phaser.Math.Angle.Between(ex, ey, other.x, other.y);
          this.damageEnemy(other, splashDmg, sAngle, false);
          // 살아남은 주변 적에게 혼돈의 씨앗(1스택) 전염!
          if (other.active && (!other.chaosStacks || other.chaosStacks < 3)) {
            this.addChaosMark(other, 1);
          }
        }
      });
    }
  }

  // ★ [니알라토텝 전용] 폭주 스택 충전 및 폭주 시간 연장 (순간이동 여부와 무관하게 작동)
  addNyarlaCombo() {
    if (this.state.form !== 'NYARLATHOTEP') return;

    if (this.state.isChaos) {
      const maxEndTime = this.time.now + 7000;
      this.chaosEndTime = Math.min(this.chaosEndTime + 1500, maxEndTime);
      if (this.chaosOverlay) {
        this.chaosOverlay.alpha = 0.3;
        this.tweens.add({
          targets: this.chaosOverlay,
          alpha: 0.15,
          duration: 300,
        });
      }
    } else {
      this.state.nyarlaCombo++;
      const reqCombo = this.state.isExAwakened ? 4 : 5;
      if (this.state.nyarlaCombo >= reqCombo) {
        this.enterChaosMode();
      } else {
        if (this.nyarlaComboTimer) this.nyarlaComboTimer.remove();
        this.nyarlaComboTimer = this.time.delayedCall(3500, () => {
          this.state.nyarlaCombo = 0;
        });
      }
    }
  }

  // ★ [니알라토텝 폭주(isChaos) 전용] 배후 순간이동 & 0.5초 무적
  triggerNyarlaBlink(targetEnemy, isKill = false) {
    if (!this.player || !this.player.active) return;

    // 1. 폭주 스택/시간 갱신은 항상 실행
    this.addNyarlaCombo();

    // ★ 2. 핵심 변경: 폭주(isChaos) 상태가 아닐 때는 강제 순간이동을 하지 않음!
    // (단, 평상시 카운터/패링에 성공했다면 이동 없이 그 자리에서 표식만 즉시 격발시켜 보스전 딜링 유지)
    if (!this.state.isChaos) {
      if (targetEnemy && targetEnemy.active && !isKill) {
        if (!targetEnemy.chaosStacks || targetEnemy.chaosStacks < 1) {
          targetEnemy.chaosStacks = 1;
        }
        this.detonateChaosMark(targetEnemy, true);
      }
      return;
    }

    // --- 이하 코드는 오직 폭주(isChaos) 상태일 때만 실행됨! ---
    const oldX = this.player.x;
    const oldY = this.player.y;

    if (this.player.texture && this.player.texture.key) {
      const shadow = this.add
        .sprite(oldX, oldY, this.player.texture.key)
        .setTint(0x9333ea)
        .setAlpha(0.65)
        .setDepth(10);
      this.tweens.add({
        targets: shadow,
        alpha: 0,
        scale: 1.5,
        duration: 250,
        onComplete: () => shadow.destroy(),
      });
    }

    // [80킬 알파(-α) 특성] 폭주 순간이동 시 떠난 자리에 공허 폭발
    if (this.state.isExAwakened) {
      const voidBlast = this.add
        .circle(oldX, oldY, 15, 0xa855f7, 0.55)
        .setStrokeStyle(3, 0xd8b4f8, 1)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(14);

      this.tweens.add({
        targets: voidBlast,
        scale: 5.5,
        alpha: 0,
        duration: 260,
        ease: 'Cubic.easeOut',
        onComplete: () => voidBlast.destroy(),
      });

      this.applyAreaDamage(oldX, oldY, 85, 0, 55);
    }

    // 배후 또는 처치 위치로 순간이동
    if (targetEnemy && targetEnemy.active && !isKill) {
      const angleToEnemy = Phaser.Math.Angle.Between(
        oldX,
        oldY,
        targetEnemy.x,
        targetEnemy.y
      );
      const safeBehindDist = targetEnemy.isBoss ? 75 : 52;
      const newX = Phaser.Math.Clamp(
        targetEnemy.x + Math.cos(angleToEnemy) * safeBehindDist,
        50,
        1350
      );
      const newY = Phaser.Math.Clamp(
        targetEnemy.y + Math.sin(angleToEnemy) * safeBehindDist,
        50,
        1350
      );

      const riftLine = this.add
        .graphics()
        .setDepth(13)
        .setBlendMode(Phaser.BlendModes.ADD);
      riftLine.lineStyle(3, 0xc084fc, 0.9);
      riftLine.lineBetween(oldX, oldY, newX, newY);
      this.time.delayedCall(90, () => riftLine.destroy());

      this.player.setPosition(newX, newY);

      if (!targetEnemy.chaosStacks || targetEnemy.chaosStacks < 1) {
        targetEnemy.chaosStacks = 1;
      }
      this.detonateChaosMark(targetEnemy, true);
    } else if (targetEnemy) {
      const newX = Phaser.Math.Clamp(
        targetEnemy.x + Phaser.Math.Between(-15, 15),
        50,
        1350
      );
      const newY = Phaser.Math.Clamp(
        targetEnemy.y + Phaser.Math.Between(-15, 15),
        50,
        1350
      );
      this.player.setPosition(newX, newY);
    }

    // 폭주 순간이동 시 0.5초 무적 부여
    this.state.isInvulnerable = true;
    this.player.setAlpha(0.55);

    if (this.invulnTimer) this.invulnTimer.remove();
    this.invulnTimer = this.time.delayedCall(500, () => {
      if (this.state) this.state.isInvulnerable = false;
      if (this.player && this.player.active && !this.state.isDashing) {
        this.player.setAlpha(1.0);
      }
    });

    this.cameras.main.shake(80, 0.014);
  }

  // 3. 르뤼에의 군주 - 크툴루 각성
  awakenCthulhu() {
    this.state.form = 'CTHULHU';
    this.state.ascended = true;
    this.state.canSlash = true;

    // ★ 스탯 표준화: 탱커형 최대 체력 +30 & 풀피 회복
    this.state.maxHp += 30;
    this.state.hp = this.state.maxHp;
    this.lastCthulhuSpitTime = 0;

    this.cameras.main.flash(450, 16, 185, 129);

    this.shrines.clear(true, true);
    this.hudGuide
      .setText(
        '[각성: 크툴루] 르뤼에의 잠든 주인이 깨어납니다. (25킬마다 늘어나는 심해 구체를 소환)'
      )
      .setColor('#10b981');

    this.restoreFormTint();
    this.updateHUD();
  }

  awakenCthugha() {
    this.state.form = 'CTHUGHA';
    this.state.ascended = true;
    this.state.canSlash = true;

    this.state.maxHp += 20;
    this.state.hp = this.state.maxHp;

    this.player.setTint(0xf97316);
    this.cameras.main.flash(500, 249, 115, 22);

    this.shrines.clear(true, true);
    this.hudGuide
      .setText(
        '[각성: 크투가] 살아있는 불꽃이 깨어납니다. (화염 디버프 공격)'
      )
      .setColor('#f97316');

    this.restoreFormTint();
    this.updateHUD();
  }

  // ★ [크투가 1] 화상 부여 (이미 걸려있다면 지속시간 3초 리필!)
  applyBurn(enemy) {
    if (!enemy || !enemy.active) return;

    // 이미 화상 중이면 기존 타이머를 지우고 지속시간 갱신
    if (enemy.burnTimer) enemy.burnTimer.remove();

    enemy.isBurning = true;
    if (!enemy.isWindingUp) enemy.setTint(0xf97316);

    enemy.burnTimer = this.time.addEvent({
      delay: 500,
      repeat: 5, // 0.5초마다 6회 = 3초 지속
      callback: () => {
        if (!enemy || !enemy.active) {
          if (enemy.burnTimer) enemy.burnTimer.remove();
          return;
        }

        // 위로 피어오르는 불티 연출
        const ember = this.add
          .circle(
            enemy.x + Phaser.Math.Between(-10, 10),
            enemy.y + Phaser.Math.Between(-10, 10),
            Phaser.Math.Between(2, 4),
            0xfef08a,
            0.85
          )
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(12);

        this.tweens.add({
          targets: ember,
          y: ember.y - 22,
          alpha: 0,
          duration: 380,
          onComplete: () => ember.destroy(),
        });

        // 화상 도트 데미지 (14)
        this.damageEnemy(enemy, 14, null, false);

        if (enemy.burnTimer && enemy.burnTimer.getRepeatCount() === 0) {
          enemy.isBurning = false;
          if (enemy.active && !enemy.isWindingUp) enemy.clearTint();
        }
      },
    });
  }

  // ★ [크투가 2] 화상 상태인 적 추가 타격 시: 주변 화염 링 폭발 + 화상 전염!
  triggerCthughaRing(centerEnemy) {
    if (this.state.isAct2 && this.state.form === 'CTHUGHA') this.state.gammaProgress++;
    if (!centerEnemy || !centerEnemy.active) return;
    
    

    // 연쇄 폭발 시 프레임 드랍 및 무한 루프 방지를 위한 0.12초 내부 쿨타임
    const now = this.time.now;
    if (centerEnemy.lastRingTime && now - centerEnemy.lastRingTime < 120)
      return;
    centerEnemy.lastRingTime = now;

    const ex = centerEnemy.x;
    const ey = centerEnemy.y;
    const isBeta = this.state.awakeningPath === 'BETA';
    const ringRadius = isBeta ? 115 : 95;

    // 화염 링 시각 이펙트
    const fireRing = this.add
      .circle(ex, ey, 16, 0xf97316, 0.35)
      .setStrokeStyle(4, 0xfef08a, 0.95)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(14);

    this.tweens.add({
      targets: fireRing,
      scale: ringRadius / 16,
      alpha: 0,
      duration: 260,
      ease: 'Cubic.easeOut',
      onComplete: () => fireRing.destroy(),
    });

    this.cameras.main.shake(90, 0.008);

    // 링 범위 내의 적들에게 범위 데미지(42) 및 화상 전염!
    const targets = [...this.enemies.getChildren()];
    targets.forEach((e) => {
      if (!e || !e.active) return;
      const d = Phaser.Math.Distance.Between(ex, ey, e.x, e.y);
      if (d <= ringRadius + (e.isBoss ? 24 : 0)) {
        const pushAngle = Phaser.Math.Angle.Between(ex, ey, e.x, e.y);
        this.damageEnemy(e, 42, pushAngle, false);
        if (e.active) this.applyBurn(e); // 주변 적들도 모두 발화!
      }
    });
  }

  // ★ [크투가 3 - 알파/베타 전용] 공격 위치에 지속 화염 장판(Fire Zone) 설치
  spawnCthughaFireZone(x, y, customRadius = null) {
    const isBeta = this.state.awakeningPath === 'BETA';
    // 알파(80킬)는 반경 68px, 베타(160킬)는 반경 92px로 대폭 확장!
    const radius = customRadius || (isBeta ? 78 : 54);

    const zone = this.add
      .circle(x, y, radius, 0xea580c, 0.22)
      .setStrokeStyle(2.5, 0xf97316, 0.7)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(4);

    // 장판이 지글거리는 맥동 연출
    this.tweens.add({
      targets: zone,
      scale: 1.06,
      alpha: 0.32,
      yoyo: true,
      repeat: 3,
      duration: 250,
    });

    // 0.4초마다 4회(약 1.6초간) 장판 위 적들에게 화상 부여 및 데미지
    const zoneTimer = this.time.addEvent({
      delay: 400,
      repeat: 3,
      callback: () => {
        if (this.state.isGameOver) return;

        // 장판에서 솟아오르는 불꽃 파티클
        for (let i = 0; i < 3; i++) {
          const r = Math.random() * radius * 0.85;
          const a = Math.random() * Math.PI * 2;
          const spark = this.add
            .circle(x + Math.cos(a) * r, y + Math.sin(a) * r, 3, 0xfde047, 0.8)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(5);
          this.tweens.add({
            targets: spark,
            y: spark.y - 18,
            alpha: 0,
            duration: 300,
            onComplete: () => spark.destroy(),
          });
        }

        // 장판 범위 타격
        const enemies = [...this.enemies.getChildren()];
        enemies.forEach((e) => {
          if (!e || !e.active) return;
          if (
            Phaser.Math.Distance.Between(x, y, e.x, e.y) <=
            radius + (e.isBoss ? 22 : 0)
          ) {
            this.damageEnemy(e, 18, null, false);
            if (e.active) this.applyBurn(e);
          }
        });
      },
    });

    this.time.delayedCall(1650, () => {
      zoneTimer.remove();
      this.tweens.add({
        targets: zone,
        alpha: 0,
        scale: 0.8,
        duration: 200,
        onComplete: () => zone.destroy(),
      });
    });
  }

  // ★ [크투가 4 - 베타 전용] 화상 상태로 사망한 적에게서 '불타는 영혼(유도 화염구)' 사출!
  spawnBurningSoul(startX, startY) {
    if (this.state.isGameOver) return;

    // 주변(400px 이내)에서 살아있는 적 탐색
    const validTargets = this.enemies
      .getChildren()
      .filter(
        (e) =>
          e.active &&
          Phaser.Math.Distance.Between(startX, startY, e.x, e.y) <= 400
      )
      .sort(
        (a, b) =>
          Phaser.Math.Distance.Between(startX, startY, a.x, a.y) -
          Phaser.Math.Distance.Between(startX, startY, b.x, b.y)
      );

    // 불타는 영혼 본체 생성
    const soul = this.add
      .circle(startX, startY, 8, 0xfef08a, 1)
      .setStrokeStyle(3, 0xf97316, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(15);

    // 주변에 적이 없으면 제자리에서 작게 터지고 소멸
    if (validTargets.length === 0) {
      this.tweens.add({
        targets: soul,
        scale: 2.5,
        alpha: 0,
        duration: 250,
        onComplete: () => soul.destroy(),
      });
      return;
    }

    // 가장 가까운 적(또는 화상 걸린 적 우선)을 타겟으로 지정
    const target = validTargets.find((e) => e.isBurning) || validTargets[0];

    // 잔상 생성 타이머
    const trailEvent = this.time.addEvent({
      delay: 35,
      loop: true,
      callback: () => {
        if (!soul.active) return;
        const afterimg = this.add
          .circle(soul.x, soul.y, 5, 0xf97316, 0.65)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(14);
        this.tweens.add({
          targets: afterimg,
          scale: 0.2,
          alpha: 0,
          duration: 180,
          onComplete: () => afterimg.destroy(),
        });
      },
    });

    // 타겟을 향해 빠르게 날아가 타격!
    this.tweens.add({
      targets: soul,
      x: target.x,
      y: target.y,
      duration: 260,
      ease: 'Quad.easeIn',
      onUpdate: () => {
        // 날아가는 도중 타겟이 움직이면 좌표 실시간 추적
        if (target && target.active) {
          soul.x = Phaser.Math.Linear(soul.x, target.x, 0.25);
          soul.y = Phaser.Math.Linear(soul.y, target.y, 0.25);
        }
      },
      onComplete: () => {
        trailEvent.remove();
        soul.destroy();
        if (this.state.isGameOver || !target || !target.active) return;

        // ★ 핵심 연쇄 기믹: 타겟이 이미 화상 상태였다면 화염 링 폭발 트리거!
        const wasBurning = target.isBurning;
        const hitAngle = Phaser.Math.Angle.Between(
          startX,
          startY,
          target.x,
          target.y
        );

        this.damageEnemy(target, 45, hitAngle, false);

        if (target.active) {
          this.applyBurn(target);
          if (wasBurning) {
            this.triggerCthughaRing(target); // 화염구 타격으로도 화염 링 연쇄 폭발!
          }
        } else if (wasBurning) {
          // 만약 이 타격으로 적이 죽었더라도 화염 링은 터뜨려줌
          this.triggerCthughaRing({
            active: true,
            x: target.x,
            y: target.y,
          });
        }
      },
    });
  }

  // 4. 심해의 방벽 - 다곤 각성 (히든)
  awakenDagon() {
    this.state.ascended = true;
    this.state.form = 'DAGON';
    if (this.shrines) this.shrines.clear(true, true);

    // ★ 스탯 표준화: 최대 체력 +25 & 풀피 회복 추가
    this.state.maxHp += 25;
    this.state.hp = this.state.maxHp;

    this.cameras.main.flash(500, 14, 165, 233);
    this.cameras.main.shake(400, 0.02);

    const backAngle = this.player.rotation + Math.PI;
    const waterSplash = this.add
      .particles(
        this.player.x + Math.cos(backAngle) * 15,
        this.player.y + Math.sin(backAngle) * 15,
        'px',
        {
          color: [0x0ea5e9, 0x0284c7, 0x38bdf8],
          speed: { min: 80, max: 250 },
          scale: { start: 2.0, end: 0 },
          lifespan: { min: 300, max: 600 },
          emitting: false,
        }
      )
      .setDepth(15);

    waterSplash.explode(40);
    this.time.delayedCall(1000, () => waterSplash.destroy());

    // ❌ 기존 999 즉사 데미지 삭제 -> ✅ 심해의 수압으로 적들을 강하게 밀쳐내기만 함 (킬 카운트 상승 방지)
    const currentEnemies = [...this.enemies.getChildren()];
    currentEnemies.forEach((enemy) => {
      if (!enemy.active) return;
      const blastAngle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );
      enemy.setVelocity(Math.cos(blastAngle) * 500, Math.sin(blastAngle) * 500);
      enemy.isKnockedBack = true;
      this.time.delayedCall(250, () => {
        if (enemy.active) enemy.isKnockedBack = false;
      });
    });

    this.hudGuide
      .setText(
        '★ [히든 각성: 다곤] 불살의 방벽. 모든 클릭이 반사(Deflect)로 변합니다.'
      )
      .setColor('#0ea5e9');

    this.restoreFormTint();
    this.updateHUD();
  }

  // 5. 심연의 대공 - 노덴스 각성 (히든)
  awakenNodens() {
    this.state.ascended = true;
    this.state.form = 'NODENS';
    if (this.shrines) this.shrines.clear(true, true);

    // ★ 스탯 표준화: 최대 체력 +20 & 풀피 회복 추가
    this.state.maxHp += 20;
    this.state.hp = this.state.maxHp;

    this.cameras.main.flash(800, 240, 248, 255);
    this.cameras.main.shake(800, 0.03);

    // ❌ 기존 999 즉사 데미지 삭제 -> ✅ 차원 반동으로 주변 적들을 밀쳐내기만 함
    const currentEnemies = [...this.enemies.getChildren()];
    currentEnemies.forEach((enemy) => {
      if (!enemy.active) return;
      const blastAngle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );
      enemy.setVelocity(Math.cos(blastAngle) * 500, Math.sin(blastAngle) * 500);
      enemy.isKnockedBack = true;
      this.time.delayedCall(250, () => {
        if (enemy.active) enemy.isKnockedBack = false;
      });
    });

    this.state.canSlash = true;
    this.hudGuide
      .setText(
        '★ [엘더 갓: 노덴스 강림] 심연의 사냥꾼. 3단 공간 절단 콤보가 해금됩니다.'
      )
      .setColor('#38bdf8');

    this.restoreFormTint();
    this.updateHUD();
  }

  // 6. 광전사 - 무신앙자 각성 (히든 40킬)
  awakenFaithless() {
    this.state.ascended = true;
    this.state.form = 'THE FAITHLESS';
    if (this.shrines) this.shrines.clear(true, true);

    // ★ 스탯 표준화: 고난도 생존 보상으로 최대 체력 +20 & 풀피 회복
    this.state.maxHp += 20;
    this.state.hp = this.state.maxHp;

    this.cameras.main.flash(800, 185, 28, 28);
    this.cameras.main.shake(500, 0.04);

    this.redEyeEmitter.emitting = true;
    this.state.canSlash = true;

    this.hudGuide
      .setText(
        '★ [무신앙자 각성] 순수한 살육. 검이 붉게 물들고 대시 시 적을 찢어발깁니다.'
      )
      .setColor('#f87171');

    this.restoreFormTint();
    this.updateHUD();
  }

  spawnBloodPool(x, y) {
    return; // ★ [밸런스 패치] 피 장판 생성 임시 비활성화
    if (!this.bloodPools) this.bloodPools = [];

    // 바닥에 깔리는 선혈 장판
    const pool = this.add.circle(x, y, 35, 0x991b1b, 0.45)
      .setStrokeStyle(3, 0xdc2626, 0.7)
      .setDepth(3);

    // 숨쉬듯 꿀렁거리는 연출
    this.tweens.add({
      targets: pool,
      scale: 1.15,
      alpha: 0.25,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.bloodPools.push(pool);

    // 8초 뒤 서서히 굳으며 소멸
    this.time.delayedCall(8000, () => {
      this.tweens.add({
        targets: pool,
        alpha: 0,
        duration: 800,
        onComplete: () => {
          this.bloodPools = this.bloodPools.filter(p => p !== pool);
          pool.destroy();
        }
      });
    });
  }

  fireBloodBoomerang(angle) {
    return; // ★ [밸런스 패치] 피의 부메랑 투척 임시 비활성화
    this.cameras.main.shake(120, 0.012);

    const bx = this.player.x;
    const by = this.player.y;
    const dist = 320; // 부메랑 비행 거리
    const tx = bx + Math.cos(angle) * dist;
    const ty = by + Math.sin(angle) * dist;

    // 부메랑(초승달) 그래픽 그리기
    const bGfx = this.add.graphics();
    bGfx.fillStyle(0xdc2626, 0.95);
    bGfx.lineStyle(2, 0xffa5a5, 1);
    bGfx.beginPath();
    bGfx.arc(0, 0, 24, -Math.PI / 1.5, Math.PI / 1.5, false); // 바깥쪽 둥근 날
    bGfx.arc(0, 0, 12, Math.PI / 1.5, -Math.PI / 1.5, true);  // 안쪽 파인 날
    bGfx.closePath();
    bGfx.fillPath();
    bGfx.strokePath();

    const boomerang = this.add.container(bx, by, [bGfx]).setDepth(15);

    // 미친듯이 회전하는 애니메이션
    this.tweens.add({
      targets: boomerang,
      rotation: Math.PI * 16,
      duration: 900
    });

    // 날아갔다가 되돌아오는 (yoyo) 트윈
    this.tweens.add({
      targets: boomerang,
      x: tx,
      y: ty,
      duration: 450,
      ease: 'Quad.easeOut',
      yoyo: true, // 되돌아옴!
      onUpdate: () => {
        // 부메랑 잔상 파티클
        const trail = this.add.circle(boomerang.x, boomerang.y, 14, 0xb91c1c, 0.6).setBlendMode(Phaser.BlendModes.ADD).setDepth(14);
        this.tweens.add({ targets: trail, scale: 0.1, alpha: 0, duration: 180, onComplete: () => trail.destroy() });

        // 실시간 다단 히트 판정 (0.12초 간격으로 갈아버림)
        this.enemies.getChildren().forEach(e => {
          if (e.active && Phaser.Math.Distance.Between(boomerang.x, boomerang.y, e.x, e.y) < 40 + (e.isBoss ? 24 : 0)) {
            if (!e.lastBoomerangHit || this.time.now - e.lastBoomerangHit > 120) {
              e.lastBoomerangHit = this.time.now;

              // 넉백 없이(null) 제자리에서 믹서기처럼 다단히트 (데미지: 38)
              this.damageEnemy(e, 38, null, false);

              // 부메랑 흡혈(타격당 3% 확률로 1 회복)
              if (Math.random() < 0.03 && this.state.hp < this.state.maxHp) {
                this.state.hp = Math.min(this.state.maxHp, this.state.hp + 1);
                this.updateHUD();
              }
            }
          }
        });
      },
      onComplete: () => boomerang.destroy()
    });
  }

  // ★ [히든 하드코어 분기] 신도, 광기도 거부한 순수한 인간 (TRUE MORTAL)
  awakenTrueMortal() {
    this.state.ascended = true;
    this.state.isTrueMortal = true;
    // 폼은 'MORTAL CULTIST' 그대로 유지하여 기본 단검과 패링만으로 끝까지 싸움!

    // 남아있던 신들의 제단 영구 파괴
    if (this.shrines) this.shrines.clear(true, true);

    // 1. 비장한 순백/창백한 섬광과 묵직한 진동
    this.cameras.main.flash(900, 226, 232, 240);
    this.cameras.main.shake(600, 0.025);

    // 2. 플레이어 중심으로 제단을 거부하는 은백색 결계 링 한 번 방출
    const pureRing = this.add
      .circle(this.player.x, this.player.y, 16, 0xffffff, 0.3)
      .setStrokeStyle(3, 0xe2e8f0, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(20);

    this.tweens.add({
      targets: pureRing,
      scale: 12,
      alpha: 0,
      duration: 700,
      ease: 'Cubic.easeOut',
      onComplete: () => pureRing.destroy(),
    });

    // 3. 화면 중앙 하드코어 트루 분기 개방 선언 텍스트
    const trueBanner = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 60,
        '“신도, 광기도 필요 없다.”\n[ TRUE ORIGINAL : 불굴의 필멸자 ]',
        {
          fontFamily: 'Georgia, serif',
          fontSize: '24px',
          color: '#f8fafc',
          align: 'center',
          fontStyle: 'bold',
          stroke: '#0f172a',
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200);

    this.tweens.add({
      targets: trueBanner,
      y: trueBanner.y - 35,
      alpha: 0,
      delay: 1800,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => trueBanner.destroy(),
    });

    document.title = 'THE CULTURIST [TRUE MORTAL]';

    this.hudGuide
      .setText(
        '★ [HARDCORE TRUE ROUTE] 모든 변이를 거부했습니다. 오직 단검과 패링만으로 끝을 보십시오.'
      )
      .setColor('#e2e8f0');

    this.updateHUD();
  }

  registerParrySuccess() {
    if (this.state.isAct2 && this.state.form === 'DAGON') this.state.gammaProgress++;
    this.state.successfulParries++;
    this.updateHUD();

    // ★ 조건: 기본 폼 + 공격 0회 + 패링 12회 성공
    if (
      this.state.form === 'MORTAL CULTIST' &&
      this.state.slashes === 0 &&
      this.state.successfulParries >= 12
    ) {
      this.awakenDagon();
    }
  }

  // ★ [50킬 이벤트] 1차 증원 (기존보다 완만하게 조정하여 50~80킬 호흡 확보)
  triggerWaveEscalation() {
    this.cameras.main.shake(300, 0.012);
    this.cameras.main.flash(250, 180, 0, 0);

    this.initAct1Loop(850, 2400);

    // 즉석 소환도 4마리 -> 2마리로 축소
    for (let i = 0; i < 2; i++) this.spawnCrusader();

    this.hudGuide
      .setText('⚠️ [성벌군 증원] 성전사들의 추격이 조금씩 거세집니다.')
      .setColor('#f43f5e');
  }

  // ★ [150킬 이벤트] 공허의 침식 (배경 보랏빛 전환 & Act 2 몬스터 강화)
  triggerWaveEscalation2() {
    if (!this.state.isAct2 || this.state.isGameOver) return;
    this.state.isAct2Escalated = true; // ★ 몹 스펙 강화 플래그 ON

    this.cameras.main.flash(800, 147, 51, 234);
    this.cameras.main.shake(600, 0.025);

    const worldW = 1400;
    const worldH = 1400;
    const cx = worldW / 2;
    const cy = worldH / 2;

    // 1. 배경 그래픽(act2BgGfx)을 심해 청록색 -> 심연의 보랏빛(#070312)으로 전면 재렌더링
    this.cameras.main.setBackgroundColor('#070312');
    if (this.act2BgGfx) {
      this.act2BgGfx.clear();

      // (A) 공허의 기저 바닥색
      this.act2BgGfx.fillStyle(0x070312, 1);
      this.act2BgGfx.fillRect(0, 0, worldW, worldH);

      // (B) 보랏빛 고대 유적 석판과 균열
      this.act2BgGfx.lineStyle(2, 0x1e0b36, 0.75);
      for (let x = 0; x < worldW; x += 180) {
        for (let y = 0; y < worldH; y += 180) {
          const offsetX = ((y / 180) % 2) * 60;
          this.act2BgGfx.strokeRect(x + offsetX, y, 172, 172);

          if ((x + y) % 360 === 0) {
            this.act2BgGfx.lineStyle(1, 0x3b0764, 0.5);
            this.act2BgGfx.lineBetween(
              x + offsetX + 20,
              y + 20,
              x + offsetX + 150,
              y + 150
            );
            this.act2BgGfx.lineStyle(2, 0x1e0b36, 0.75);
          }
        }
      }

      // (C) 중앙 심연의 눈 문양 (보랏빛/자홍빛 개안)
      this.act2BgGfx.lineStyle(3, 0x4c1d95, 0.7);
      this.act2BgGfx.strokeCircle(cx, cy, 260);
      this.act2BgGfx.strokeEllipse(cx, cy, 480, 190);
      this.act2BgGfx.lineStyle(3, 0xa855f7, 0.8);
      this.act2BgGfx.strokeEllipse(cx, cy, 80, 185);

      // (D) 모놀리스 기둥 단상 테두리 보랏빛 갱신
      const pillarSpots = [
        { x: cx - 380, y: cy - 280 },
        { x: cx + 380, y: cy - 280 },
        { x: cx - 380, y: cy + 280 },
        { x: cx + 380, y: cy + 280 },
        { x: cx, y: cy - 420 },
        { x: cx, y: cy + 420 },
      ];
      pillarSpots.forEach((spot) => {
        this.act2BgGfx.fillStyle(0x0f051d, 0.9);
        this.act2BgGfx.fillCircle(spot.x, spot.y, 42);
        this.act2BgGfx.lineStyle(2, 0xa855f7, 0.45);
        this.act2BgGfx.strokeCircle(spot.x, spot.y, 42);
      });
    }

    // 2. 모놀리스 룬 코어 불빛을 보라색(0xd8b4f8)으로 변경
    if (this.act2Runes) {
      this.act2Runes.forEach((rune) => {
        if (rune && rune.active) rune.setFillStyle(0xd8b4f8, 0.65);
      });
    }

    // 3. 환경 부유 포자 파티클도 보라/자홍빛으로 교체
    if (this.act2AmbientParticles) {
      this.act2AmbientParticles.destroy();
    }
    this.act2AmbientParticles = this.add
      .particles(0, 0, 'px', {
        x: { min: 0, max: worldW },
        y: { min: 0, max: worldH },
        color: [0xa855f7, 0xd8b4f8, 0xe879f9],
        scale: { start: 2.0, end: 0 },
        alpha: { start: 0.5, end: 0 },
        speedY: { min: -35, max: -12 },
        speedX: { min: -15, max: 15 },
        lifespan: { min: 2000, max: 4000 },
        frequency: 70,
        blendMode: 'ADD',
      })
      .setDepth(-2);

    // 4. 스폰 주기 단축 (딥 원: 900 -> 700ms / 공허의 사역마: 2800 -> 2000ms)
    if (this.deepOneTimer) this.deepOneTimer.delay = 700;
    if (this.voidCallerTimer) this.voidCallerTimer.delay = 2000;

    // 5. 기존 필드에 살아있는 몹들도 즉시 강화 상태 부여
    this.enemies.getChildren().forEach((e) => {
      if (!e.active || e.isBoss) return;
      if (e.isDeepOne) {
        e.hp += 25;
        e.baseSpeed = 195;
        e.setTint(0xc084fc); // 공허에 물든 딥 원
      } else if (e.isVoidCaller) {
        e.hp += 40;
        e.baseSpeed = 80;
        e.setScale(1.15);
      }
    });

    // 즉석에서 공허의 사역마 2마리 기습 소환
    this.spawnVoidCaller();
    this.spawnVoidCaller();

    this.hudGuide
      .setText('🟣 [공허의 침식] 심해가 보랏빛 공허에 잠식됩니다! 적들이 광폭화합니다!')
      .setColor('#d8b4f8');
  }

  // ★ [80킬 이벤트] 신격 1차 초월 각성 (-α : Alpha Evolution)
  triggerSecondAscension() {
    if (this.state.awakeningTier >= 1) return;
    this.state.isExAwakened = true; // 기존 80킬 스킬 호환용 유지
    this.state.awakeningTier = 1; // ★ 1단계: 알파(-α) 돌입!

    // 체력 +20 추가 확장 및 50% 회복
    this.state.maxHp += 20;
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + 50);

    this.cameras.main.flash(700, 255, 255, 255);
    this.cameras.main.shake(600, 0.03);

    if (this.crusaderTimer) this.crusaderTimer.delay = 1050;
    if (this.inquisitorTimer) this.inquisitorTimer.delay = 3000;

    const exRing = this.add
      .circle(this.player.x, this.player.y, 20, 0xffffff, 0.6)
      .setStrokeStyle(4, 0xfacc15, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(20);

    this.tweens.add({
      targets: exRing,
      scale: 15,
      alpha: 0,
      duration: 650,
      ease: 'Cubic.easeOut',
      onComplete: () => exRing.destroy(),
    });

    const ALPHA_TEXTS = {
      HASTUR:
        '[α: 하스터] 황금 채찍이 주변 적들에게 연쇄 번개(Chain)로 전이됩니다!',
      CTHULHU:
        '[α: 크툴루] 심해 촉수가 5연발로 증가하고 재사용 대기시간이 감소합니다!',
      CTHUGHA:
        '★ [크투가-α 각성] 베기마다 타오르는 화염 장판이 생성되어 적들을 지속적으로 불태웁니다!',
      DAGON:
        '[α: 다곤] 패링 해일이 2연속 메아리치며, 반사 탄환이 3갈래로 분열됩니다!',
      NYARLATHOTEP:
        '[α: 니알라토텝] 순간이동 시 공허 폭발이 일며 4킬마다 폭주합니다!',
      NODENS: '[α: 노덴스] 3단 콤보의 차원 검기가 3갈래 폭풍으로 확장됩니다!',
      'THE FAITHLESS':
        '[The Murder] 살의가 형태를 갖춥니다. 참격이 십자(X) 형태로 교차하며 전방을 도륙합니다!',
      'MORTAL CULTIST':
        '[α: 필멸의 극의] 단검의 공격 속도와 치명타 위력이 한계를 돌파합니다!',
    };

    this.hudGuide
      .setText(ALPHA_TEXTS[this.state.form] || ALPHA_TEXTS['MORTAL CULTIST'])
      .setColor('#fde047');

    this.updateHUD();
  }

  triggerDagonWave(mode = 'NORMAL') {
    // 기존 triggerDagonWave(true) 호출과의 하위 호환성 유지
    const isEcho = mode === true || mode === 'ECHO';
    const isMini = mode === 'MINI';
    const isBeta = this.state.awakeningPath === 'BETA';

    let waveRadius = isEcho ? 250 : 200;
    let waveDmg = isEcho ? 70 : 95;

    if (isMini) {
      waveRadius = 115; // ★ 빈 패링 시 나가는 소형 파도 범위
      waveDmg = 40; // 소형 파도 기본 데미지
    } else if (isBeta) {
      waveRadius += 55; // ★ 다곤-β: 본 파도(200->255) 및 메아리 파도(250->305) 범위 대폭 증가!
    }

    const wave = this.add
      .circle(
        this.player.x,
        this.player.y,
        20,
        isMini ? 0x7dd3fc : isEcho ? 0x38bdf8 : 0x0ea5e9,
        isMini ? 0.3 : 0.45
      )
      .setStrokeStyle(isMini ? 3 : isEcho ? 6 : 4, 0x7dd3fc, 0.9)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(11);

    this.tweens.add({
      targets: wave,
      scale: waveRadius / 20,
      alpha: 0,
      duration: isMini ? 240 : 350,
      ease: 'Sine.easeOut',
      onComplete: () => wave.destroy(),
    });

    if (!isMini) {
      this.cameras.main.shake(160, isEcho ? 0.022 : 0.015);
    }

    this.enemies.getChildren().forEach((enemy) => {
      if (!enemy.active) return;
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );
      if (dist <= waveRadius + (enemy.isBoss ? 24 : 0)) {
        const knockbackAngle = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y
        );
        this.damageEnemy(enemy, waveDmg, knockbackAngle, false);
      }
    });

    // ★ 본 파도(NORMAL)일 때만 2차 메아리 해일 발동 (소형 파도는 메아리 안 침)
    if (this.state.isExAwakened && !isEcho && !isMini) {
      this.time.delayedCall(220, () => {
        if (this.player && this.player.active && !this.state.isGameOver) {
          this.triggerDagonWave('ECHO');
        }
      });
    }
  }

  renderDynamicTentacles(time) {
    this.tentacleGfx.clear();
    const form = this.state.form;

    // 1. 다곤 전용 심해 어인 꼬리 렌더링
    if (form === 'DAGON') {
      const baseAngle = this.player.rotation + Math.PI;
      const points = [{ x: this.player.x, y: this.player.y, width: 14 }];

      for (let i = 1; i <= 6; i++) {
        const dist = i * 11;
        const sway = Math.sin(time * 0.007 - i * 0.5) * (i * 3.5);
        const px =
          this.player.x +
          Math.cos(baseAngle) * dist +
          Math.cos(baseAngle + Math.PI / 2) * sway;
        const py =
          this.player.y +
          Math.sin(baseAngle) * dist +
          Math.sin(baseAngle + Math.PI / 2) * sway;
        points.push({ x: px, y: py, width: Math.max(14 - i * 1.8, 3) });
      }

      points.forEach((p, idx) => {
        this.tentacleGfx.fillStyle(0x0ea5e9, 0.9 - idx * 0.1);
        this.tentacleGfx.fillCircle(p.x, p.y, p.width);
      });
      return;
    }

    // 2. 3대 신격 촉수 렌더링
    if (form !== 'HASTUR' && form !== 'NYARLATHOTEP' && form !== 'CTHULHU')
      return;

    let count = form === 'CTHULHU' ? 6 : form === 'HASTUR' ? 5 : 4;
    let color =
      form === 'CTHULHU' ? 0x10b981 : form === 'HASTUR' ? 0xfacc15 : 0xa855f7;
    let lineWidth = form === 'CTHULHU' ? 4 : 3;

    this.tentacleGfx.lineStyle(lineWidth, color, 0.85);
    for (let i = 0; i < count; i++) {
      const baseAngle =
        this.player.rotation + Math.PI + (i - (count - 1) / 2) * 0.45;
      this.tentacleGfx.beginPath().moveTo(this.player.x, this.player.y);
      for (let s = 1; s <= 4; s++) {
        const lengthStep = form === 'CTHULHU' ? 13 : 11;
        const waveAmp = form === 'CTHULHU' ? 5.5 : 4.5;
        const w = Math.sin(time * 0.012 + i * 2 + s) * (s * waveAmp);
        this.tentacleGfx.lineTo(
          this.player.x +
          Math.cos(baseAngle) * (s * lengthStep) +
          Math.cos(baseAngle + 1.57) * w,
          this.player.y +
          Math.sin(baseAngle) * (s * lengthStep) +
          Math.sin(baseAngle + 1.57) * w
        );
      }
      this.tentacleGfx.strokePath();
    }
  }

  fireCthulhuTendril(angle, isBlackHole = false) {
    if (!this.player || !this.player.active) return;

    const isBeta = this.state.awakeningPath === 'BETA'; // ★ 베타 여부 확인
    const startX = this.player.x + Math.cos(angle) * 20;
    const startY = this.player.y + Math.sin(angle) * 20;

    const proj = this.cthulhuSpawns
      .create(startX, startY, 'holy_bolt')
      .setAlpha(0)
      .setDepth(11);

    if (!proj || !proj.body) return;

    proj.trailHistory = [];
    proj.body.setCircle(isBeta ? 14 : 10); // ★ 물리 판정 반경 확대 (10 -> 14)
    proj.isCthulhuSeeker = true;
    proj.isPlayerProjectile = true;
    proj.damage = this.state.isExAwakened ? 55 : 48;

    // ★ 투사체에 블랙홀 인력 여부 플래그 장착!
    proj.isBlackHole = isBlackHole;
    if (proj.setData) proj.setData('isBlackHole', isBlackHole);

    // 첫 번째 블랙홀 탄은 시각적으로 살짝 더 크고 짙은 에메랄드 코어로 구별감 부여
    if (isBlackHole) {
      proj.setScale(1.25);
    }

    const speed = 340;
    proj.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    proj.currentAngle = angle;

    // 2. 비주얼: 심해의 눈알 코어 + 에메랄드 촉수 파티클
    // ★ 베타 각성 시 심해 눈알 코어(6 -> 8.5) 및 동공(2.5 -> 3.8), 꼬리 파티클(3.2 -> 4.2) 확대!
    const coreEye = this.add
      .circle(startX, startY, isBeta ? 8.5 : 6, 0x022c22, 0.95)
      .setStrokeStyle(isBeta ? 3 : 2.5, 0x10b981, 1)
      .setDepth(12);

    const innerPupil = this.add
      .circle(startX, startY, isBeta ? 3.8 : 2.5, 0x6ee7b7, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(13);

    const tail = this.add
      .particles(0, 0, 'px', {
        color: [0x022c22, 0x064e3b, 0x10b981, 0x34d399],
        scale: { start: isBeta ? 4.2 : 3.2, end: 0 },
        alpha: { start: 0.75, end: 0 },
        speed: { min: 10, max: 35 },
        lifespan: { min: 180, max: 320 },
        frequency: 18,
        blendMode: 'ADD',
      })
      .setDepth(11);

    tail.startFollow(proj);

    // ★ 에러 방지: 변수를 미리 선언해두어 undefined 참조 에러 원천 차단
    let seekerTimer = null;
    let isCleanedUp = false;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;

      // 타이머 안전 제거
      if (seekerTimer) {
        seekerTimer.remove();
        seekerTimer = null;
      }

      // 시각 오브젝트 안전 제거
      if (coreEye && coreEye.active) coreEye.destroy();
      if (innerPupil && innerPupil.active) innerPupil.destroy();
      if (tail) {
        tail.stop();
        this.time.delayedCall(300, () => {
          if (tail && tail.destroy) tail.destroy();
        });
      }

      // 투사체 안전 소멸
      if (proj && proj.active) {
        proj.destroy();
      }
    };

    // 3. 실시간 유도 및 사인파(Sine) 촉수 무빙 타이머
    let tick = 0;
    seekerTimer = this.time.addEvent({
      delay: 25,
      loop: true,
      callback: () => {
        if (!proj || !proj.active || this.state.isGameOver) {
          cleanup();
          return;
        }
        if (this.physics.world.isPaused) return;

        tick++;

        // 가장 가까운 적 탐색
        let nearestEnemy = null;
        let minDist = 650;
        this.enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          const d = Phaser.Math.Distance.Between(proj.x, proj.y, e.x, e.y);
          if (d < minDist) {
            minDist = d;
            nearestEnemy = e;
          }
        });

        // 적 추적 회전 및 꿈틀거림(wiggle) 연산
        if (nearestEnemy) {
          const targetAngle = Phaser.Math.Angle.Between(
            proj.x,
            proj.y,
            nearestEnemy.x,
            nearestEnemy.y
          );
          proj.currentAngle = Phaser.Math.Angle.RotateTo(
            proj.currentAngle,
            targetAngle,
            0.09
          );
        }

        const wiggle = Math.sin(tick * 0.45) * 0.22;
        const finalAngle = proj.currentAngle + wiggle;

        proj.setVelocity(
          Math.cos(finalAngle) * speed,
          Math.sin(finalAngle) * speed
        );

        // 눈알 좌표 동기화
        if (coreEye && coreEye.active) coreEye.setPosition(proj.x, proj.y);
        if (innerPupil && innerPupil.active) {
          innerPupil.setPosition(
            proj.x + Math.cos(finalAngle) * 2,
            proj.y + Math.sin(finalAngle) * 2
          );
        }

        // 명중 체크
        if (nearestEnemy) {
          const hitDist = nearestEnemy.isBoss ? 42 : 24;
          if (minDist <= hitDist) {
            this.triggerCthulhuExplosion(proj);
            cleanup();
          }
        }
      },
    });

    // 4. 3.2초 내 명중 실패 시 자동 자폭
    this.time.delayedCall(3200, () => {
      if (proj && proj.active && !this.state.isGameOver) {
        this.triggerCthulhuExplosion(proj);
      }
      cleanup();
    });
  }

  triggerCthulhuExplosion(proj) {
    if (!proj || proj.isHitting) return;
    proj.isHitting = true;

    const ex = proj.x;
    const ey = proj.y;
    const isBeta = this.state.awakeningPath === 'BETA';
    const explosionRadius = isBeta ? 115 : 85;
    const explosionDmg = proj.damage || 48;
    const isBlackHole = proj.isBlackHole; // ★ 첫 번째 탄 여부 확인

    if (proj.body) proj.body.stop();
    if (proj.gfx) proj.gfx.destroy();
    proj.destroy();

    // 첫 탄(블랙홀) 폭발 시 시각적으로 더 묵직한 에메랄드 충격파 연출
    const ring = this.add
      .circle(ex, ey, 10, isBlackHole ? 0x059669 : 0x10b981, isBlackHole ? 0.6 : 0.45)
      .setStrokeStyle(isBlackHole ? 4 : 3, isBlackHole ? 0x6ee7b7 : 0x34d399, 0.9)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(14);

    this.tweens.add({
      targets: ring,
      scale: (isBlackHole ? explosionRadius * 1.2 : explosionRadius) / 10,
      alpha: 0,
      duration: isBlackHole ? 320 : 260,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });

    this.cameras.main.shake(isBlackHole ? 120 : 90, isBlackHole ? 0.009 : 0.006);

    // 광역 데미지 및 넉백 분기 처리
    const enemyList = [...this.enemies.getChildren()];
    enemyList.forEach((enemy) => {
      if (!enemy || !enemy.active) return;

      const dist = Phaser.Math.Distance.Between(ex, ey, enemy.x, enemy.y);
      const hitRadius = explosionRadius + (enemy.isBoss ? 24 : 0);

      if (dist <= hitRadius) {
        let hitAngle = null; // 기본(추가 탄환들)은 넉백 없음(null)

        if (isBlackHole) {
          // ★ 오직 첫 번째 탄(블랙홀 탄)만 폭발 중심(ex, ey)으로 적들을 강하게 끌어당김!
          hitAngle = dist < 2 ? null : Phaser.Math.Angle.Between(enemy.x, enemy.y, ex, ey);
        }

        this.damageEnemy(enemy, explosionDmg, hitAngle, false);
      }
    });
  }

  enterChaosMode() {
    if (this.state.isAct2 && this.state.form === 'NYARLATHOTEP') this.state.gammaProgress++;
    this.state.isChaos = true;
    this.state.nyarlaCombo = 0;
    this.chaosEndTime = this.time.now + 4000; // 기본 4초간 광기 폭주

    if (this.chaosOverlay) this.chaosOverlay.destroy();
    this.chaosOverlay = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x9333ea,
        0.15
      )
      .setScrollFactor(0)
      .setDepth(100);

    this.cameras.main.flash(400, 147, 51, 234);

    // ★ 기존의 수동적인 자동 데미지 타이머(chaosDamageTimer) 완전 삭제!
    // 대신 폭주 중에는 평타 공속/사거리 증가 + 평타 시 2중첩 낙인 + 대시 쿨타임 절반 단축이 적용됩니다.

    this.hudGuide
      .setText(
        '★ [기어오는 혼돈 폭주] 공격 속도와 사거리가 폭증하며, 모든 베기가 2중첩의 혼돈 낙인을 새깁니다!'
      )
      .setColor('#c084fc');
    this.updateHUD();
  }

  triggerHasturWhip() {
    if (
      this.state.isGameOver ||
      this.state.isPaused ||
      this.physics.world.isPaused
    )
      return;

    const isBeta = this.state.awakeningPath === 'BETA';
    const maxDist = 210;

    // 사거리 내의 모든 적을 거리순으로 정렬
    const validEnemies = this.enemies
      .getChildren()
      .filter(
        (e) =>
          e.active &&
          Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            e.x,
            e.y
          ) <= maxDist
      )
      .sort(
        (a, b) =>
          Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y) -
          Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y)
      );

    if (validEnemies.length === 0) return;

    // ★ 베타 각성 시 2발 발사: 적이 2명 이상이면 각각 타겟팅, 1명뿐이면 동일 적 2회 중복 타겟팅!
    const targets = isBeta
      ? [validEnemies[0], validEnemies[1] || validEnemies[0]]
      : [validEnemies[0]];

    targets.forEach((target, strikeIdx) => {
      // 동일 적을 2번 칠 때는 두 번째 번개에 0.07초 시차를 두어 이중 타격감과 궤적 분리 연출
      this.time.delayedCall(strikeIdx * 70, () => {
        if (!target || !target.active || !this.player || !this.player.active)
          return;

        const sx = this.player.x;
        const sy = this.player.y;
        const tx = target.x;
        const ty = target.y;
        const mainAngle = Phaser.Math.Angle.Between(sx, sy, tx, ty);
        const perpAngle = mainAngle + Math.PI / 2;

        // 1. 지그재그 황금 채찍 궤적 렌더링
        const whipGfx = this.add
          .graphics()
          .setDepth(14)
          .setBlendMode(Phaser.BlendModes.ADD);

        const segments = 6;
        const drawBolt = (width, color, alpha, jitterScale) => {
          whipGfx.lineStyle(width, color, alpha);
          whipGfx.beginPath().moveTo(sx, sy);
          for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const bx = Phaser.Math.Linear(sx, tx, t);
            const by = Phaser.Math.Linear(sy, ty, t);
            const offset = Phaser.Math.Between(-14, 14) * jitterScale;
            whipGfx.lineTo(
              bx + Math.cos(perpAngle) * offset,
              by + Math.sin(perpAngle) * offset
            );
          }
          whipGfx.lineTo(tx, ty);
          whipGfx.strokePath();
        };

        drawBolt(5, 0xfacc15, 0.85, 1.0);
        drawBolt(2, 0xfef08a, 1.0, 0.5);

        this.tweens.add({
          targets: whipGfx,
          alpha: 0,
          duration: 160,
          onComplete: () => whipGfx.destroy(),
        });

        // 2. 타격 지점 '황색 인장 (Yellow Sign)' 폭발 연출
        const signRadius = 75;
        const signGfx = this.add
          .graphics({ x: tx, y: ty })
          .setDepth(13)
          .setBlendMode(Phaser.BlendModes.ADD);

        signGfx.lineStyle(2.5, 0xfacc15, 0.9);
        signGfx.strokeCircle(0, 0, 22);
        signGfx.lineStyle(1.5, 0xfde047, 0.8);
        signGfx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = (i * (Math.PI * 2)) / 3 - Math.PI / 2;
          const px = Math.cos(a) * 20;
          const py = Math.sin(a) * 20;
          if (i === 0) signGfx.moveTo(px, py);
          else signGfx.lineTo(px, py);
        }
        signGfx.closePath().strokePath();

        this.tweens.add({
          targets: signGfx,
          scale: signRadius / 22,
          rotation: Math.PI / 1.5,
          alpha: 0,
          duration: 320,
          ease: 'Cubic.easeOut',
          onComplete: () => signGfx.destroy(),
        });

        for (let i = 0; i < 7; i++) {
          const spark = this.add
            .circle(tx, ty, Phaser.Math.Between(2, 3.5), 0xfef08a, 0.9)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(15);
          const sa = Math.random() * Math.PI * 2;
          const sd = Phaser.Math.Between(15, 55);
          this.tweens.add({
            targets: spark,
            x: tx + Math.cos(sa) * sd,
            y: ty + Math.sin(sa) * sd,
            alpha: 0,
            scale: 0.2,
            duration: 220,
            onComplete: () => spark.destroy(),
          });
        }

        this.cameras.main.shake(80, 0.006);

        // 3. 직격 및 인장 광역 데미지 판정 (★ 넉백 제거: hitAngle에 null 전달 + 감전 1스택!)
        const enemies = [...this.enemies.getChildren()];
        enemies.forEach((e) => {
          if (!e || !e.active) return;
          const d = Phaser.Math.Distance.Between(tx, ty, e.x, e.y);

          if (e === target) {
            this.damageEnemy(e, 65, null, false);
            if (e.active) this.addShockStack(e, 1);
          } else if (d <= signRadius) {
            this.damageEnemy(e, 35, null, false);
            if (e.active) this.addShockStack(e, 1);
          }
        });

        // 4. [80킬 알파 특성] 연쇄 번개 전이 (★ 넉백 제거 + 감전 1스택!)
        if (this.state.isExAwakened) {
          const chainTargets = this.enemies
            .getChildren()
            .filter(
              (e) =>
                e.active &&
                e !== target &&
                Phaser.Math.Distance.Between(tx, ty, e.x, e.y) <= 170
            )
            .slice(0, 2);

          chainTargets.forEach((ct) => {
            const chainGfx = this.add
              .graphics()
              .setDepth(14)
              .setBlendMode(Phaser.BlendModes.ADD);
            chainGfx.lineStyle(3, 0xfef08a, 0.9);
            chainGfx.beginPath().moveTo(tx, ty);
            const midX = (tx + ct.x) / 2 + Phaser.Math.Between(-15, 15);
            const midY = (ty + ct.y) / 2 + Phaser.Math.Between(-15, 15);
            chainGfx.lineTo(midX, midY).lineTo(ct.x, ct.y).strokePath();

            this.tweens.add({
              targets: chainGfx,
              alpha: 0,
              duration: 180,
              onComplete: () => chainGfx.destroy(),
            });

            this.damageEnemy(ct, 45, null, false);
            if (ct.active) this.addShockStack(ct, 1);
          });
        }

      });
    });
  }

  spawnCrusader() {
    if (this.state.isBossSpawned || this.state.isGameOver) return;
    if (
      this.state.isBossKilled ||
      this.state.isAct2Waiting ||
      this.state.isAct2
    )
      return;
    const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const e = this.enemies
      .create(
        Phaser.Math.Clamp(this.player.x + Math.cos(a) * 420, 60, 1340),
        Phaser.Math.Clamp(this.player.y + Math.sin(a) * 420, 60, 1340),
        'crusader'
      )
      .setDepth(8)
      .setCollideWorldBounds(true);

    e.hp = GAME_CONFIG.ENEMY.HP;
    e.isWindingUp = false;
    e.isAttacking = false;
    e.isKnockedBack = false;
  }
  spawnInquisitor() {
    if (this.state.isBossSpawned || this.state.isGameOver) return;
    if (
      this.state.isBossKilled ||
      this.state.isAct2Waiting ||
      this.state.isAct2
    )
      return;

    const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const ex = Phaser.Math.Clamp(this.player.x + Math.cos(a) * 480, 60, 1340);
    const ey = Phaser.Math.Clamp(this.player.y + Math.sin(a) * 480, 60, 1340);

    const enemy = this.enemies
      .create(ex, ey, 'inquisitor')
      .setDepth(8)
      .setCollideWorldBounds(true);
    enemy.hp = GAME_CONFIG.RANGED_ENEMY.HP;
    enemy.isRanged = true; // 원거리 적 구분용 플래그
    enemy.isWindingUp = false;
    enemy.isAttacking = false;
    enemy.isKnockedBack = false;
  }
  // [ACT 2 전용 근접 몹] 딥 원 (심해인)
  spawnDeepOne() {
    if (this.state.isGameOver || this.physics.world.isPaused) return;

    const edge = Phaser.Math.Between(0, 3);
    let sx, sy;
    if (edge === 0) {
      sx = Phaser.Math.Between(40, 1360);
      sy = 40;
    } else if (edge === 1) {
      sx = 1360;
      sy = Phaser.Math.Between(40, 1360);
    } else if (edge === 2) {
      sx = Phaser.Math.Between(40, 1360);
      sy = 1360;
    } else {
      sx = 40;
      sy = Phaser.Math.Between(40, 1360);
    }

    const deepOne = this.enemies
      .create(sx, sy, 'deep_one')
      .setDepth(8)
      .setCollideWorldBounds(true);
    deepOne.body.setCircle(14, 4, 4);

    deepOne.hp = 60;
    deepOne.baseSpeed = 160;
    deepOne.isDeepOne = true;
    deepOne.tick = Phaser.Math.Between(0, 100);

    const isEsc = this.state.isAct2Escalated;
    deepOne.hp = isEsc ? 90 : 60;         // 체력 60 -> 90 (단검 2방에 안 죽음)
    deepOne.baseSpeed = isEsc ? 195 : 160; // 이속 160 -> 195 대폭 상승
    deepOne.isDeepOne = true;
    deepOne.tick = Phaser.Math.Between(0, 100);
    if (isEsc) deepOne.setTint(0xc084fc);  // 보랏빛 공허 침식 외형
  }

  spawnVoidCaller() {
    if (this.state.isGameOver || this.physics.world.isPaused) return;

    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const dist = Phaser.Math.Between(500, 700);
    const clampedX = Phaser.Math.Clamp(
      this.player.x + Math.cos(angle) * dist,
      50,
      1350
    );
    const clampedY = Phaser.Math.Clamp(
      this.player.y + Math.sin(angle) * dist,
      50,
      1350
    );

    // ★ sx, sy 대신 clampedX, clampedY 적용 및 월드 바운드 추가
    const caller = this.enemies
      .create(clampedX, clampedY, 'void_caller')
      .setDepth(8)
      .setCollideWorldBounds(true);
    caller.body.setCircle(16, 4, 4);

    caller.hp = 120;
    caller.baseSpeed = 60;
    caller.isVoidCaller = true;
    caller.isRanged = true;

    const isEsc = this.state.isAct2Escalated;
    caller.hp = isEsc ? 165 : 120;        // 체력 120 -> 165
    caller.baseSpeed = isEsc ? 80 : 60;   // 추격 속도 상승
    caller.isVoidCaller = true;
    caller.isRanged = true;
    if (isEsc) caller.setScale(1.15);     // 덩치 15% 확대
  }

  initAct1Loop(
    cDelay = GAME_CONFIG.ENEMY.SPAWN_INTERVAL,
    iDelay = GAME_CONFIG.RANGED_ENEMY.SPAWN_INTERVAL
  ) {
    if (this.crusaderTimer) this.crusaderTimer.remove();
    if (this.inquisitorTimer) this.inquisitorTimer.remove();

    this.crusaderTimer = this.time.addEvent({
      delay: cDelay,
      loop: true,
      callback: () => this.spawnCrusader(),
    });

    this.inquisitorTimer = this.time.addEvent({
      delay: iDelay,
      loop: true,
      callback: () => this.spawnInquisitor(),
    });
  }

  initAct2Loop() {
    this.state.isAct2 = true;

    // 딥 원(근접) 고속 스폰 (0.9초 주기)
    this.deepOneTimer = this.time.addEvent({
      delay: 900,
      loop: true,
      callback: () => this.spawnDeepOne(),
    });

    // 공허의 사역마(원거리) 스폰 (2.8초 주기)
    this.voidCallerTimer = this.time.addEvent({
      delay: 2800,
      loop: true,
      callback: () => this.spawnVoidCaller(),
    });
  }

  spawnBoss() {
    if (this.state.isBossSpawned) return;
    this.state.isBossSpawned = true;

    this.cameras.main.flash(1000, 185, 28, 28);
    this.cameras.main.shake(1200, 0.035);

    this.bossHpBg.setVisible(true);
    this.bossHpBar.setVisible(true);
    this.bossName.setVisible(true);

    this.enemies.clear(true, true);

    const ex = Phaser.Math.Clamp(this.player.x + 300, 100, 1300);
    const ey = Phaser.Math.Clamp(this.player.y - 300, 100, 1300);

    this.boss = this.physics.add.sprite(ex, ey, 'boss').setDepth(12);
    // ★ 1. 맵 밖으로 날아가지 않도록 월드 경계 충돌 활성화!
    this.boss.setCollideWorldBounds(true);
    // ★ 2. 몸통 박치기 판정을 64x64 -> 38x38로 줄여 근접 평타 딜링 공간 확보!
    this.boss.body.setSize(38, 38).setOffset(13, 13);
    this.boss.hp = GAME_CONFIG.BOSS.HP;
    this.boss.maxHp = GAME_CONFIG.BOSS.HP;
    this.boss.isBoss = true;
    this.boss.phase = 1; // ★ 1페이즈 시작
    this.boss.isAttacking = false;
    this.boss.isHitCooldown = false;
    this.boss.nextPatternTime = this.time.now + 2000;

    this.enemies.add(this.boss);

    // ★ 보스 몸통 박치기(돌진) 피격 및 패링 판정 (막타 null 크래시 방지 적용)
    this.physics.add.overlap(this.player, this.boss, () => {
      if (
        !this.boss ||
        !this.boss.active ||
        this.state.isDashing ||
        this.boss.isHitCooldown
      )
        return;

      // ★ 1. 해일이나 카운터로 보스가 죽어서 null이 되기 전에 좌표를 미리 백업!
      const counterAngle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        this.boss.x,
        this.boss.y
      );

      if (this.state.isParrying) {
        this.registerParrySuccess();
        if (this.state.form === 'DAGON') this.triggerDagonWave();
        // ★ 니알라토텝으로 보스 돌진 패링 시 보스 등 뒤 안전거리로 도약 & 누적된 낙인 즉시 폭발!
        if (this.state.form === 'NYARLATHOTEP') {
          this.triggerNyarlaBlink(this.boss, false);
        }

        // ★ 2. 다곤 해일(triggerDagonWave)에 맞아 보스가 이미 죽었다면 즉시 종료!
        if (!this.boss || !this.boss.active) return;

        this.damageEnemy(this.boss, 110, counterAngle, true);
      } else {
        this.cameras.main.shake(200, 0.02);
        this.cameras.main.flash(120, 180, 0, 0);
        this.takeDamage(this.boss.phase === 2 ? 28 : 20);
      }

      // ★ 3. 카운터 타격(damageEnemy)으로 보스가 죽었다면 쿨타임 세팅 없이 종료!
      if (!this.boss || !this.boss.active) return;

      this.boss.isHitCooldown = true;
      this.time.delayedCall(500, () => {
        if (this.boss && this.boss.active) this.boss.isHitCooldown = false;
      });
    });
  }

  // ★ 보스 2페이즈 광폭화 각성 연출
  triggerBossPhase2() {
    if (!this.boss || !this.boss.active || this.boss.phase === 2) return;
    this.boss.phase = 2;
    this.boss.isAttacking = true;
    this.boss.setVelocity(0, 0);

    // 1. 강렬한 진홍빛/황금빛 화면 플래시 및 지진
    this.cameras.main.flash(900, 220, 38, 38);
    this.cameras.main.shake(900, 0.035);

    // 2. UI 이름 및 체력바 색상 변경
    this.bossName
      .setText('★ 광신도 처단자: 타락한 대주교 (PHASE 2) ★')
      .setColor('#fde047');
    this.bossHpBar.setFillStyle(0xdc2626);

    // 3. 거대한 신성 충격파 링 방출 (주변 플레이어 밀쳐내기)
    const shockwave = this.add
      .circle(this.boss.x, this.boss.y, 30, 0xfacc15, 0.45)
      .setStrokeStyle(5, 0xdc2626, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(15);

    this.tweens.add({
      targets: shockwave,
      scale: 10,
      alpha: 0,
      duration: 650,
      ease: 'Cubic.easeOut',
      onComplete: () => shockwave.destroy(),
    });

    // 보스 외형 변이 (크기 증가 및 붉은 아우라)
    this.boss.setScale(1.2);
    this.boss.setTint(0xfca5a5);

    this.time.delayedCall(900, () => {
      if (this.boss && this.boss.active) {
        this.boss.isAttacking = false;
        this.boss.nextPatternTime = this.time.now + 500;
      }
    });
  }

  // ============================================================================
  // [ACT 2 BOSS: THE GREAT DEEP ONE (그레이트 딥 원)]
  // ============================================================================

  spawnGreatDeepOne() {
    if (this.state.isAct2BossSpawned || this.state.isGameOver) return;
    this.state.isAct2BossSpawned = true;
    this.state.isBossSpawned = true; // update()에서 handleBossAI가 돌도록 활성화

    // 기존 Act 2 잡몹 스폰 중지 및 필드 클리어
    if (this.deepOneTimer) this.deepOneTimer.remove();
    if (this.voidCallerTimer) this.voidCallerTimer.remove();
    this.enemies.clear(true, true);
    this.projectiles.clear(true, true);

    this.cameras.main.flash(1000, 16, 185, 129);
    this.cameras.main.shake(1200, 0.04);

    // 보스 HUD 세팅
    this.bossHpBg.setVisible(true);
    this.bossHpBar.setVisible(true);
    this.bossHpBar.width = 420;
    this.bossHpBar.setFillStyle(0x10b981);
    this.bossName
      .setText('심해의 옛 지배자: THE GREAT DEEP ONE')
      .setColor('#6ee7b7')
      .setVisible(true);

    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const bx = Phaser.Math.Clamp(this.player.x + Math.cos(angle) * 360, 120, 1280);
    const by = Phaser.Math.Clamp(this.player.y + Math.sin(angle) * 360, 120, 1280);

    this.boss = this.physics.add.sprite(bx, by, 'great_deep_one').setDepth(12);
    this.boss.setCollideWorldBounds(true);
    this.boss.body.setCircle(28, 14, 14);

    this.boss.hp = 3800; // 받는 피해 70% 특성으로 체감 체력은 약 5,400!
    this.boss.maxHp = 3800;
    this.boss.isBoss = true;
    this.boss.isGreatDeepOne = true;
    this.boss.knockbackImmune = true; // ★ 넉백 완전 면역
    this.boss.phase = 1;
    this.boss.tick = 0;
    this.boss.isAttacking = false;
    this.boss.isHitCooldown = false;
    this.boss.nextPatternTime = this.time.now + 2400;

    this.enemies.add(this.boss);

    // 접촉 피해 & 패링 판정 (성벌군 대주교와 동일 구조)
    this.physics.add.overlap(this.player, this.boss, () => {
      if (
        !this.boss ||
        !this.boss.active ||
        this.boss.alpha < 0.5 || // 페이즈 2 은신 중일 때는 접촉 판정 무시
        this.state.isDashing ||
        this.boss.isHitCooldown
      )
        return;

      const counterAngle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        this.boss.x,
        this.boss.y
      );

      if (this.state.isParrying) {
        this.registerParrySuccess();
        if (this.state.form === 'DAGON') this.triggerDagonWave();
        if (this.state.form === 'NYARLATHOTEP') {
          this.triggerNyarlaBlink(this.boss, false);
        }
        if (!this.boss || !this.boss.active) return;
        this.damageEnemy(this.boss, 120, counterAngle, true);
      } else {
        this.cameras.main.shake(200, 0.022);
        this.cameras.main.flash(120, 180, 0, 0);
        this.takeDamage(this.boss.phase === 2 ? 30 : 22);
      }

      if (!this.boss || !this.boss.active) return;
      this.boss.isHitCooldown = true;
      this.time.delayedCall(500, () => {
        if (this.boss && this.boss.active) this.boss.isHitCooldown = false;
      });
    });

    this.hudGuide
      .setText('🌊 [THE GREAT DEEP ONE] 심해의 정점이 모습을 드러냈습니다! (넉백 면역 / 피해감소 30%)')
      .setColor('#34d399');
  }

  // 가시 탄환(삼각형) 발사 헬퍼
  fireThornProjectile(x, y, angle, speed, color = null) {
    if (this.state.isGameOver) return;
    const thorn = this.projectiles.create(x, y, 'thorn_bolt').setDepth(9);
    thorn.setRotation(angle);
    if (color) thorn.setTint(color);
    thorn.body.setCircle(5, 3, 3);
    thorn.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // 패링 반사 시 회전각도도 함께 바뀌도록 처리
    this.time.delayedCall(3800, () => {
      if (thorn && thorn.active) thorn.destroy();
    });
    return thorn;
  }

  // 그레이트 딥 원 메인 AI 루프
  handleGreatDeepOneAI(time) {
    if (!this.boss || !this.boss.active) return;

    // ★ [2페이즈 전용] 투구 속 오른쪽 눈(한쪽 눈) 위치에 포탈 파티클 & 안광 코어 실시간 고정!
    if (this.boss.phase === 2 && this.bossEyeCore && this.bossEyeParticles) {
      const rot = this.boss.rotation;
      const sc = this.boss.scaleX;
      // 84x84 텍스처 중심(42,42) 기준 투구 오른쪽 눈 슬릿 오프셋: 앞쪽 +16px, 우측 +11px
      const lx = 16 * sc;
      const ly = 11 * sc;
      const eyeX = this.boss.x + (lx * Math.cos(rot) - ly * Math.sin(rot));
      const eyeY = this.boss.y + (lx * Math.sin(rot) + ly * Math.cos(rot));

      this.bossEyeCore.setPosition(eyeX, eyeY);
      this.bossEyeParticles.setPosition(eyeX, eyeY);

      // 은신(잠수) 중일 때는 안광도 함께 어두워졌다가 출현 시 번쩍임!
      const isVisible = this.boss.alpha > 0.4;
      this.bossEyeCore.setVisible(isVisible);
      this.bossEyeParticles.emitting = isVisible;
    }

    // 체력 50% 이하 시 2페이즈 돌입
    if (this.boss.phase === 1 && this.boss.hp <= this.boss.maxHp * 0.5) {
      this.triggerGreatDeepOnePhase2();
      return;
    }

    if (this.boss.isAttacking) return;

    const isP2 = this.boss.phase === 2;
    const baseAngle = Phaser.Math.Angle.Between(
      this.boss.x,
      this.boss.y,
      this.player.x,
      this.player.y
    );

    if (time > this.boss.nextPatternTime) {
      this.boss.isAttacking = true;
      this.boss.setVelocity(0, 0);

      const pat = Phaser.Math.Between(0, 2);
      if (pat === 0) this.gdoPattern1_Dash(isP2);
      else if (pat === 1) this.gdoPattern2_Thorns(isP2);
      else if (pat === 2) this.gdoPattern3_Orbit(isP2);

      const cd = isP2
        ? Phaser.Math.Between(1800, 2600)
        : Phaser.Math.Between(2600, 3500);
      this.boss.nextPatternTime = time + cd;
    } else {
      // 평상시 딥원 특유의 어슬렁거리는 사인파(Sine) 유영 추격
      this.boss.tick = (this.boss.tick || 0) + 0.08;
      const wiggleAngle = baseAngle + Math.sin(this.boss.tick) * 0.5;
      const spd = isP2 ? 155 : 120;
      this.boss.setRotation(wiggleAngle);
      this.boss.setVelocity(
        Math.cos(wiggleAngle) * spd,
        Math.sin(wiggleAngle) * spd
      );
    }
  }

  // 2페이즈 각성 연출
  triggerGreatDeepOnePhase2() {
    this.boss.phase = 2;
    this.boss.isAttacking = true;
    this.boss.setVelocity(0, 0);

    this.cameras.main.flash(1000, 168, 85, 247);
    this.cameras.main.shake(1000, 0.04);

    this.bossName
      .setText('★ 심연의 포식자: THE GREAT DEEP ONE (PHASE 2) ★')
      .setColor('#e879f9');
    this.bossHpBar.setFillStyle(0xa855f7);

    const ring = this.add
      .circle(this.boss.x, this.boss.y, 35, 0xa855f7, 0.5)
      .setStrokeStyle(5, 0x10b981, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(15);

    this.tweens.add({
      targets: ring,
      scale: 12,
      alpha: 0,
      duration: 700,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });

    this.boss.setScale(1.18);
    // ★ 칠흑색 투구 간지를 살리기 위해 보스 본체에는 setTint를 씌우지 않고 원본 유지!
    this.boss.clearTint();

    // ★ [핵심 연출] 투구 속 오른쪽 눈 한쪽에서만 뿜어져 나오는 Act 2 포탈 심연 파티클!
    if (this.bossEyeParticles) this.bossEyeParticles.destroy();
    if (this.bossEyeCore) this.bossEyeCore.destroy();

    // 1) 타오르는 외눈 안광 코어
    this.bossEyeCore = this.add
      .circle(this.boss.x, this.boss.y, 4.5, 0xe879f9, 1)
      .setStrokeStyle(2, 0x10b981, 0.9)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(14);

    // 2) Act 2 포탈 중심부와 동일한 심연 입자 방출기 (움직일 때마다 안광 궤적을 남김)
    this.bossEyeParticles = this.add
      .particles(0, 0, 'px', {
        color: [0xe879f9, 0xa855f7, 0x10b981, 0x064e3b],
        scale: { start: 2.4, end: 0 },
        alpha: { start: 0.95, end: 0 },
        speed: { min: 15, max: 55 },
        angle: { min: 0, max: 360 },
        lifespan: { min: 220, max: 450 },
        frequency: 22,
        blendMode: 'ADD',
      })
      .setDepth(13);

    this.hudGuide
      .setText('⚠️ [PHASE 2] 고대 투구 너머로 심연의 안광이 타오릅니다!')
      .setColor('#e879f9');

    this.time.delayedCall(900, () => {
      if (this.boss && this.boss.active) {
        this.boss.isAttacking = false;
        this.boss.nextPatternTime = this.time.now + 400;
      }
    });
  }

  // --------------------------------------------------------------------------
  // [패턴 1]
  // P1: 딥원 무빙으로 어슬렁거리며 접근 후 3연속 맹렬한 돌진
  // P2: 모습이 완전히 사라졌다가 플레이어 주변 무작위 각도에서 기습 출현 돌진 3연타 (듀크 피시론)
  // --------------------------------------------------------------------------
  gdoPattern1_Dash(isP2) {
    if (!this.boss || !this.boss.active) return;

    if (!isP2) {
      // [P1] 0.9초간 어슬렁거리며 좁혀 들어온 뒤 3연속 돌진
      let stalkTicks = 0;
      const stalkTimer = this.time.addEvent({
        delay: 45,
        repeat: 18,
        callback: () => {
          if (!this.boss || !this.boss.active) return;
          stalkTicks++;
          const a =
            Phaser.Math.Angle.Between(
              this.boss.x,
              this.boss.y,
              this.player.x,
              this.player.y
            ) +
            Math.sin(stalkTicks * 0.6) * 0.65;
          this.boss.setRotation(a);
          this.boss.setVelocity(Math.cos(a) * 185, Math.sin(a) * 185);
        },
      });

      this.time.delayedCall(900, () => {
        stalkTimer.remove();
        this.executeGdoDashChain(3, false);
      });
    } else {
      // [P2] 듀크 피시론식 은신 -> 무작위 방향 워프 -> 돌진 3회 반복
      this.executeGdoDashChain(3, true);
    }
  }

  executeGdoDashChain(rem, isDukeMode) {
    if (!this.boss || !this.boss.active || this.state.isGameOver) return;
    if (rem <= 0) {
      this.boss.setVelocity(0, 0);
      this.boss.isAttacking = false;
      return;
    }

    if (isDukeMode) {
      // 1) 물거품과 함께 잠수(은신)
      this.boss.isInvulnerableBoss = true;
      this.tweens.add({
        targets: this.boss,
        alpha: 0,
        duration: 180,
        onComplete: () => {
          if (!this.boss || !this.boss.active) return;
          // 플레이어 주변 270px 반경의 무작위 각도로 순간이동
          const randAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const wx = Phaser.Math.Clamp(
            this.player.x + Math.cos(randAngle) * 270,
            90,
            1310
          );
          const wy = Phaser.Math.Clamp(
            this.player.y + Math.sin(randAngle) * 270,
            90,
            1310
          );
          this.boss.setPosition(wx, wy);

          const chargeAngle = Phaser.Math.Angle.Between(
            wx,
            wy,
            this.player.x,
            this.player.y
          );
          this.boss.setRotation(chargeAngle);

          // 출현 파문 및 돌진 궤적 경고선
          const splash = this.add
            .circle(wx, wy, 35, 0xa855f7, 0.5)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(11);
          this.tweens.add({
            targets: splash,
            scale: 2.2,
            alpha: 0,
            duration: 280,
            onComplete: () => splash.destroy(),
          });

          const warn = this.add
            .graphics()
            .setDepth(4)
            .lineStyle(34, 0xe879f9, 0.3)
            .lineBetween(
              wx,
              wy,
              wx + Math.cos(chargeAngle) * 440,
              wy + Math.sin(chargeAngle) * 440
            );

          this.boss.isInvulnerableBoss = false;
          this.boss.isWindingUp = true;
          this.tweens.add({ targets: this.boss, alpha: 1, duration: 150 });

          this.time.delayedCall(360, () => {
            warn.destroy();
            if (!this.boss || !this.boss.active) return;
            this.boss.isWindingUp = false;
            this.cameras.main.shake(160, 0.018);
            this.boss.setVelocity(
              Math.cos(chargeAngle) * 760,
              Math.sin(chargeAngle) * 760
            );

            this.time.delayedCall(380, () => {
              if (!this.boss || !this.boss.active) return;
              this.boss.setVelocity(0, 0);
              this.executeGdoDashChain(rem - 1, true);
            });
          });
        },
      });
    } else {
      // [P1 일반 3연속 돌진]
      const chargeAngle = Phaser.Math.Angle.Between(
        this.boss.x,
        this.boss.y,
        this.player.x,
        this.player.y
      );
      this.boss.setRotation(chargeAngle);
      this.boss.isWindingUp = true;
      this.boss.setTint(0xef4444);

      const warn = this.add
        .graphics()
        .setDepth(4)
        .lineStyle(28, 0x10b981, 0.28)
        .lineBetween(
          this.boss.x,
          this.boss.y,
          this.boss.x + Math.cos(chargeAngle) * 380,
          this.boss.y + Math.sin(chargeAngle) * 380
        );

      this.time.delayedCall(360, () => {
        warn.destroy();
        if (!this.boss || !this.boss.active) return;
        this.boss.isWindingUp = false;
        this.boss.clearTint();
        this.cameras.main.shake(140, 0.014);
        this.boss.setVelocity(
          Math.cos(chargeAngle) * 650,
          Math.sin(chargeAngle) * 650
        );

        this.time.delayedCall(360, () => {
          if (!this.boss || !this.boss.active) return;
          this.boss.setVelocity(0, 0);
          this.time.delayedCall(90, () =>
            this.executeGdoDashChain(rem - 1, false)
          );
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // [패턴 2]
  // P1: 입에서 삼각형 가시 탄환을 무작위로 대량 뱉어내 흩뿌림
  // P2: 맵 좌우/상하 양쪽에서 격자(Grid) 라인을 따라 가시 탄막이 교차 행진 (탄막 슈팅)
  // --------------------------------------------------------------------------
  gdoPattern2_Thorns(isP2) {
    if (!this.boss || !this.boss.active) return;

    if (!isP2) {
      // [P1] 플레이어 방향 중심으로 무작위 각도/속도의 가시 탄환 28발 난사
      this.boss.setTint(0x34d399);
      const baseA = Phaser.Math.Angle.Between(
        this.boss.x,
        this.boss.y,
        this.player.x,
        this.player.y
      );

      for (let i = 0; i < 24; i++) {
        this.time.delayedCall(i * 45, () => {
          if (!this.boss || !this.boss.active) return;
          const randSpread = Phaser.Math.FloatBetween(-1.15, 1.15);
          const randSpd = Phaser.Math.Between(210, 390);
          this.boss.setRotation(baseA + randSpread * 0.5);
          this.fireThornProjectile(
            this.boss.x,
            this.boss.y,
            baseA + randSpread,
            randSpd
          );
        });
      }

      this.time.delayedCall(1250, () => {
        if (this.boss && this.boss.active) {
          this.boss.clearTint();
          this.boss.isAttacking = false;
        }
      });
    } else {
      // [P2] 화면 양쪽(좌->우, 상->하) 격자 탄막 발사!
      this.cameras.main.shake(250, 0.015);
      const px = this.player.x;
      const py = this.player.y;
      const spacing = 105; // 격자 간격 (사이로 정밀 회피 가능)

      // 격자 예고 레이저 라인 표시
      const gridGfx = this.add
        .graphics()
        .setDepth(4)
        .lineStyle(1.5, 0xe879f9, 0.35);

      for (let i = -3; i <= 3; i++) {
        const rowY = Phaser.Math.Clamp(py + i * spacing, 60, 1340);
        const colX = Phaser.Math.Clamp(px + i * spacing, 60, 1340);
        gridGfx.lineBetween(px - 450, rowY, px + 450, rowY);
        gridGfx.lineBetween(colX, py - 450, colX, py + 450);
      }

      this.time.delayedCall(550, () => {
        gridGfx.destroy();
        if (!this.boss || !this.boss.active || this.state.isGameOver) return;

        // 2웨이브에 걸쳐 좌우 & 상하에서 격자 가시 사출
        for (let w = 0; w < 2; w++) {
          this.time.delayedCall(w * 650, () => {
            if (this.state.isGameOver) return;
            this.cameras.main.shake(120, 0.01);
            const offset = w * (spacing / 2); // 2번째 웨이브는 엇갈린 격자로 발사

            for (let i = -3; i <= 3; i++) {
              const rowY = Phaser.Math.Clamp(py + i * spacing + offset, 60, 1340);
              const colX = Phaser.Math.Clamp(px + i * spacing + offset, 60, 1340);

              // 좌측 -> 우측 & 우측 -> 좌측
              this.fireThornProjectile(px - 440, rowY, 0, 310, 0xe879f9);
              this.fireThornProjectile(px + 440, rowY, Math.PI, 310, 0xe879f9);

              // 상단 -> 하단 & 하단 -> 상단
              this.fireThornProjectile(colX, py - 380, Math.PI / 2, 310, 0xc084fc);
              this.fireThornProjectile(colX, py + 380, -Math.PI / 2, 310, 0xc084fc);
            }
          });
        }

        this.time.delayedCall(1500, () => {
          if (this.boss && this.boss.active) this.boss.isAttacking = false;
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // [패턴 3]
  // P1: 플레이어 기준 원 모양 궤도로 고속 회전하며 중심(플레이어)으로 가시 탄환 발사 (근접 공격 불가!)
  // P2: 정반대 대칭 위치에 '심연의 환영'을 생성해 양쪽에서 동시에 돌며 양방향 포위 사격!
  // --------------------------------------------------------------------------
  gdoPattern3_Orbit(isP2) {
    if (!this.boss || !this.boss.active) return;

    // ★ 기획 반영: 회전 패턴 중에는 근거리 공격(단검)에 맞지 않도록 무적 + 반투명 수중 유영 처리!
    // (단, 플레이어가 쏘거나 패링으로 튕겨낸 원거리 반사 탄환에는 타격 가능하도록 유지)
    this.boss.isInvulnerableBoss = true;
    this.boss.setAlpha(0.7);

    // 플레이어 주변에 근접 불가 궤도 링 시각 표시
    const orbitRadius = 240;
    const orbitGuide = this.add
      .circle(this.player.x, this.player.y, orbitRadius)
      .setStrokeStyle(2, isP2 ? 0xe879f9 : 0x10b981, 0.45)
      .setDepth(4);

    // P2 전용: 정반대(180도 대칭) 궤도를 도는 환영(Clone) 생성
    let clone = null;
    if (isP2) {
      clone = this.add
        .sprite(this.boss.x, this.boss.y, 'great_deep_one')
        .setTint(0xa855f7)
        .setAlpha(0.6)
        .setScale(1.18)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(11);
    }

    let currentOrbitAngle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.boss.x,
      this.boss.y
    );
    let step = 0;

    const orbitTimer = this.time.addEvent({
      delay: 30,
      repeat: 75, // 약 2.25초간 플레이어 주위를 공전
      callback: () => {
        if (!this.boss || !this.boss.active || this.state.isGameOver) {
          orbitGuide.destroy();
          if (clone) clone.destroy();
          orbitTimer.remove();
          return;
        }

        step++;
        currentOrbitAngle += isP2 ? 0.085 : 0.07;

        const cx = this.player.x;
        const cy = this.player.y;
        orbitGuide.setPosition(cx, cy);

        // 본체 위치 갱신 (플레이어 기준 원 궤도)
        const bx = Phaser.Math.Clamp(
          cx + Math.cos(currentOrbitAngle) * orbitRadius,
          60,
          1340
        );
        const by = Phaser.Math.Clamp(
          cy + Math.sin(currentOrbitAngle) * orbitRadius,
          60,
          1340
        );
        this.boss.setPosition(bx, by);
        const aimToPlayer = Phaser.Math.Angle.Between(bx, by, cx, cy);
        this.boss.setRotation(aimToPlayer);

        // P2 환영 위치 갱신 (정반대 +PI 각도)
        if (clone) {
          const oppAngle = currentOrbitAngle + Math.PI;
          const clX = Phaser.Math.Clamp(
            cx + Math.cos(oppAngle) * orbitRadius,
            60,
            1340
          );
          const clY = Phaser.Math.Clamp(
            cy + Math.sin(oppAngle) * orbitRadius,
            60,
            1340
          );
          clone.setPosition(clX, clY);
          const cloneAim = Phaser.Math.Angle.Between(clX, clY, cx, cy);
          clone.setRotation(cloneAim);

          if (step % 7 === 0) {
            this.fireThornProjectile(clX, clY, cloneAim, 330, 0xe879f9);
          }
        }

        // 본체 플레이어 조준 사격
        if (step % 7 === 0) {
          this.fireThornProjectile(
            bx,
            by,
            aimToPlayer,
            330,
            isP2 ? 0xc084fc : null
          );
        }
      },
    });

    this.time.delayedCall(2350, () => {
      orbitGuide.destroy();
      if (clone) clone.destroy();
      if (this.boss && this.boss.active) {
        this.boss.isInvulnerableBoss = false;
        this.boss.setAlpha(1.0);
        this.boss.isAttacking = false;
      }
    });
  }

  handleBossAI(time) {
    if (!this.boss || !this.boss.active) return;

    // ★ Act 2 보스(그레이트 딥 원)일 경우 전용 AI로 즉시 위임!
    if (this.boss.isGreatDeepOne) {
      this.handleGreatDeepOneAI(time);
      return;
    }

    // ★ 체력 50% 이하 시 즉시 2페이즈 돌입 체크
    if (this.boss.phase === 1 && this.boss.hp <= this.boss.maxHp * 0.5) {
      this.triggerBossPhase2();
      return;
    }

    if (this.boss.isKnockedBack || this.boss.isAttacking) return;

    const isP2 = this.boss.phase === 2;

    if (time > this.boss.nextPatternTime) {
      this.boss.isAttacking = true;
      this.boss.setVelocity(0, 0);

      // 1페이즈는 0~2번 패턴, 2페이즈는 신규 심판의 기둥(3번)까지 총 4개 패턴 구사
      const maxPattern = isP2 ? 3 : 2;
      const patternIndex = Phaser.Math.Between(0, maxPattern);

      if (patternIndex === 0) this.patternDash(isP2 ? 2 : 1); // P2: 2연속 돌진
      else if (patternIndex === 1) this.patternProjectiles(isP2);
      else if (patternIndex === 2) this.patternSummon(isP2);
      else if (patternIndex === 3) this.patternJudgmentPillars(); // ★ P2 전용 광역 낙인

      // 2페이즈에서는 패턴 간 쿨타임 대폭 단축
      const cd = isP2
        ? Phaser.Math.Between(1600, 2500)
        : Phaser.Math.Between(3000, 4200);
      this.boss.nextPatternTime = time + cd;
    } else {
      // 평상시 추격 속도도 2페이즈에서 1.45배 상승
      const moveSpd = isP2
        ? GAME_CONFIG.BOSS.SPEED * 1.45
        : GAME_CONFIG.BOSS.SPEED;
      this.physics.moveToObject(this.boss, this.player, moveSpd);
    }
  }

  // 패턴 1: 살육의 돌진 (바닥 궤적 경고선 + 2페이즈 2연속 드리프트 돌진)
  patternDash(remDashes = 1) {
    if (!this.boss || !this.boss.active) return;

    const isP2 = this.boss.phase === 2;
    const windup = isP2 ? 520 : 750;
    const dashSpeed = isP2 ? 680 : 520;

    this.boss.setTint(0xb91c1c);
    this.boss.isWindingUp = true; // ★ 돌진 직전 단검으로 베면 카운터 히트 가능!

    const targetAngle = Phaser.Math.Angle.Between(
      this.boss.x,
      this.boss.y,
      this.player.x,
      this.player.y
    );
    const dashDist = 380;
    const tx = this.boss.x + Math.cos(targetAngle) * dashDist;
    const ty = this.boss.y + Math.sin(targetAngle) * dashDist;

    // ★ 바닥에 붉은색 돌진 경고 레일 표시
    const warnLine = this.add
      .graphics()
      .setDepth(4)
      .lineStyle(isP2 ? 36 : 28, 0xdc2626, 0.28)
      .lineBetween(this.boss.x, this.boss.y, tx, ty);

    this.time.delayedCall(windup, () => {
      warnLine.destroy();
      if (!this.boss || !this.boss.active) return;

      this.boss.isWindingUp = false;
      if (isP2) this.boss.setTint(0xfca5a5);
      else this.boss.clearTint();

      this.cameras.main.shake(180, 0.015);
      this.boss.setVelocity(
        Math.cos(targetAngle) * dashSpeed,
        Math.sin(targetAngle) * dashSpeed
      );

      this.time.delayedCall(520, () => {
        if (!this.boss || !this.boss.active) return;
        this.boss.setVelocity(0, 0);

        // 2페이즈 남은 돌진 횟수가 있으면 즉시 2차 돌진 연계!
        if (remDashes > 1) {
          this.time.delayedCall(150, () => this.patternDash(remDashes - 1));
        } else {
          this.boss.isAttacking = false;
        }
      });
    });
  }

  // 패턴 2: 단죄의 산탄 (P1: 3갈래 부채꼴 / P2: 10갈래 전방위 회전 탄막 2연사)
  patternProjectiles(isP2 = false) {
    this.boss.setTint(0xfacc15);

    this.time.delayedCall(isP2 ? 450 : 600, () => {
      if (!this.boss || !this.boss.active) return;
      if (isP2) this.boss.setTint(0xfca5a5);
      else this.boss.clearTint();

      const baseAngle = Phaser.Math.Angle.Between(
        this.boss.x,
        this.boss.y,
        this.player.x,
        this.player.y
      );

      if (!isP2) {
        // 1페이즈: 3갈래 부채꼴
        for (let i = -1; i <= 1; i++) {
          this.fireBossBolt(baseAngle + i * 0.38, 350);
        }
        this.boss.isAttacking = false;
      } else {
        // ★ 2페이즈: 10갈래 전방위 노바 + 0.35초 뒤 엇박자 2차 발사
        const count = 10;
        for (let wave = 0; wave < 2; wave++) {
          this.time.delayedCall(wave * 350, () => {
            if (!this.boss || !this.boss.active) return;
            this.cameras.main.shake(100, 0.008);
            const offset = wave * (Math.PI / count); // 2차 탄막은 빈틈 각도로 발사
            for (let i = 0; i < count; i++) {
              const a = baseAngle + offset + (i * Math.PI * 2) / count;
              this.fireBossBolt(a, 380);
            }
            if (wave === 1) this.boss.isAttacking = false;
          });
        }
      }
    });
  }

  fireBossBolt(angle, speed) {
    const bolt = this.projectiles
      .create(this.boss.x, this.boss.y, 'holy_bolt')
      .setTint(0xff1e42)
      .setScale(1.6)
      .setDepth(9);
    bolt.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.time.delayedCall(3000, () => {
      if (bolt && bolt.active) bolt.destroy();
    });
  }

  // 패턴 3: 이단 심문 (P2에서는 원거리 사제까지 섞어서 소환)
  patternSummon(isP2 = false) {
    this.boss.setTint(0x94a3b8);

    this.time.delayedCall(isP2 ? 700 : 1000, () => {
      if (!this.boss || !this.boss.active) return;
      if (isP2) this.boss.setTint(0xfca5a5);
      else this.boss.clearTint();

      this.cameras.main.flash(180, 200, 200, 200);

      const summonCount = isP2 ? 3 : 2;
      for (let i = 0; i < summonCount; i++) {
        const isRanged = isP2 && i === 2; // P2 마지막 1마리는 원거리 사제로 소환
        const tex = isRanged ? 'inquisitor' : 'crusader';
        const e = this.enemies
          .create(
            Phaser.Math.Clamp(
              this.boss.x + Phaser.Math.Between(-80, 80),
              60,
              1340
            ),
            Phaser.Math.Clamp(
              this.boss.y + Phaser.Math.Between(-80, 80),
              60,
              1340
            ),
            tex
          )
          .setDepth(8)
          .setCollideWorldBounds(true);
        e.hp = isRanged ? GAME_CONFIG.RANGED_ENEMY.HP : GAME_CONFIG.ENEMY.HP;
        e.isRanged = isRanged;
        e.isWindingUp = false;
        e.isAttacking = false;
        e.isKnockedBack = false;
      }
      this.boss.isAttacking = false;
    });
  }

  // ★ 패턴 4 (2페이즈 전용): 하늘의 심판 (플레이어 위치를 추적하는 4연속 빛기둥 폭격)
  patternJudgmentPillars() {
    this.boss.setTint(0xfde047);

    const pillarCount = 4;
    const radius = 75;

    for (let i = 0; i < pillarCount; i++) {
      this.time.delayedCall(i * 260, () => {
        if (!this.boss || !this.boss.active || this.state.isGameOver) return;

        // 첫 번째는 플레이어 정위치, 나머지는 주변 랜덤 예측 좌표
        const px =
          i === 0
            ? this.player.x
            : this.player.x + Phaser.Math.Between(-110, 110);
        const py =
          i === 0
            ? this.player.y
            : this.player.y + Phaser.Math.Between(-110, 110);

        // 1. 바닥 경고 마법진 생성
        const warnCircle = this.add
          .circle(px, py, radius, 0xfacc15, 0.15)
          .setStrokeStyle(2, 0xfef08a, 0.85)
          .setDepth(4);

        const innerCore = this.add.circle(px, py, 5, 0xdc2626, 0.5).setDepth(4);

        // 안쪽 원이 바깥쪽 원까지 차오르면 폭발! (타이밍 직관화)
        this.tweens.add({
          targets: innerCore,
          scale: radius / 5,
          duration: 750,
          ease: 'Quad.easeIn',
          onComplete: () => {
            warnCircle.destroy();
            innerCore.destroy();
            if (this.state.isGameOver) return;

            // 2. 신성 빛기둥 폭발 이펙트
            const blast = this.add
              .circle(px, py, radius, 0xfef08a, 0.9)
              .setBlendMode(Phaser.BlendModes.ADD)
              .setDepth(15);

            this.tweens.add({
              targets: blast,
              scale: 1.35,
              alpha: 0,
              duration: 240,
              onComplete: () => blast.destroy(),
            });

            this.cameras.main.shake(120, 0.012);

            // 3. 범위 내 플레이어 피격 판정 (대시 무적으로 회피 가능)
            const dist = Phaser.Math.Distance.Between(
              px,
              py,
              this.player.x,
              this.player.y
            );
            if (dist <= radius) {
              this.takeDamage(22);
            }
          },
        });

        if (i === pillarCount - 1) {
          this.time.delayedCall(600, () => {
            if (this.boss && this.boss.active) {
              this.boss.setTint(0xfca5a5);
              this.boss.isAttacking = false;
            }
          });
        }
      });
    }
  }

  handleEnemiesAI() {
    this.enemies.getChildren().forEach((e) => {
      if (!e.active || e.isKnockedBack) return;
      if (e.isBoss) return;

      // ★ 1. [하스터 3중첩 마비] 마비 상태인 적은 이동 및 공격 판정 완전 정지!
      if (e.isParalyzed) {
        e.setVelocity(0, 0);
        return;
      }

      // ★ 2. [하스터 1~2중첩 둔화] 1스택: 0.9배(10% 둔화), 2스택: 0.8배(20% 둔화)
      const slowMult = e.shockStacks ? 1 - Math.min(e.shockStacks, 2) * 0.1 : 1.0;

      const dist = Phaser.Math.Distance.Between(
        e.x,
        e.y,
        this.player.x,
        this.player.y
      );
      const angle = Phaser.Math.Angle.Between(
        e.x,
        e.y,
        this.player.x,
        this.player.y
      );
      e.setRotation(angle);

      // ==========================================
      // [1] 원거리 적 (Act 1 사제 & Act 2 공허의 사역마)
      // ==========================================
      if (e.isRanged) {
        if (
          dist <= GAME_CONFIG.RANGED_ENEMY.ATTACK_RANGE &&
          !e.isWindingUp &&
          !e.isAttacking
        ) {
          e.isWindingUp = true;
          e.setVelocity(0, 0);

          // Act 2 사역마는 보라색, Act 1 사제는 황금빛 점멸
          e.setTint(e.isVoidCaller ? 0xa855f7 : 0xfde047);

          this.time.delayedCall(GAME_CONFIG.RANGED_ENEMY.WINDUP_TIME, () => {
            if (!e.active || !e.isWindingUp) return;
            e.isWindingUp = false;
            e.clearTint();

            const boltAngle = Phaser.Math.Angle.Between(
              e.x,
              e.y,
              this.player.x,
              this.player.y
            );
            const speed = GAME_CONFIG.RANGED_ENEMY.PROJECTILE_SPEED;

            if (e.isVoidCaller) {
              // ★ 150킬 이후(isAct2Escalated)에는 3갈래 -> 5갈래 부채꼴 탄막 + 탄속 1.25배!
              const spreadAngles = this.state.isAct2Escalated
                ? [-0.4, -0.2, 0, 0.2, 0.4]
                : [-0.25, 0, 0.25];
              const vSpeed = this.state.isAct2Escalated ? speed * 1.25 : speed;

              spreadAngles.forEach((offset) => {
                const bolt = this.projectiles
                  .create(e.x, e.y, 'holy_bolt')
                  .setDepth(9);
                bolt.setTint(this.state.isAct2Escalated ? 0xe879f9 : 0xa855f7);
                bolt.setVelocity(
                  Math.cos(boltAngle + offset) * vSpeed,
                  Math.sin(boltAngle + offset) * vSpeed
                );
                this.time.delayedCall(3000, () => {
                  if (bolt.active) bolt.destroy();
                });
              });
            } else {
              // Act 1 사제: 단일 투사체
              const bolt = this.projectiles
                .create(e.x, e.y, 'holy_bolt')
                .setDepth(9);
              bolt.setVelocity(
                Math.cos(boltAngle) * speed,
                Math.sin(boltAngle) * speed
              );
              this.time.delayedCall(3000, () => {
                if (bolt.active) bolt.destroy();
              });
            }

            e.isAttacking = true;
            this.time.delayedCall(1500, () => {
              if (e.active) e.isAttacking = false;
            });
          });
        } else if (!e.isWindingUp && !e.isAttacking) {
          // Act 2 몹은 별도의 baseSpeed를 세팅해뒀다면 그것을 사용
          this.physics.moveToObject(e, this.player, GAME_CONFIG.ENEMY.SPEED * slowMult);
        }
        return; // 원거리 로직 끝
      }

      // ==========================================
      // [2] 근접 적 (Act 1 성전사 & Act 2 딥 원)
      // ==========================================
      if (
        dist <= GAME_CONFIG.ENEMY.ATTACK_RANGE &&
        !e.isWindingUp &&
        !e.isAttacking
      ) {
        e.isWindingUp = true;
        e.setVelocity(0, 0);

        // Act 2 딥 원은 에메랄드색, Act 1 성전사는 붉은색 경고
        const warnColor = e.isDeepOne ? 0x10b981 : 0xff1e42;
        e.setTint(warnColor);
        const warn = this.add
          .graphics()
          .setDepth(4)
          .lineStyle(2, warnColor, 0.65)
          .lineBetween(
            e.x,
            e.y,
            e.x + Math.cos(angle) * 55,
            e.y + Math.sin(angle) * 55
          );

        this.time.delayedCall(GAME_CONFIG.ENEMY.WINDUP_TIME, () => {
          warn.destroy();
          if (!e.active || !e.isWindingUp) return;
          e.isWindingUp = false;
          e.isAttacking = true;
          if (e.isDeepOne && this.state.isAct2Escalated) e.setTint(0xc084fc);
          else e.clearTint();

          // 딥 원은 돌진 속도가 약간 더 빠름
          const lungeSpeed = e.isDeepOne ? 400 : 320;
          e.setVelocity(
            Math.cos(angle) * lungeSpeed,
            Math.sin(angle) * lungeSpeed
          );

          const parryReach =
            this.state.form === 'DAGON' && this.state.awakeningPath === 'BETA'
              ? 42
              : 18;
          if (
            Phaser.Math.Distance.Between(
              e.x,
              e.y,
              this.player.x,
              this.player.y
            ) <=
            GAME_CONFIG.ENEMY.ATTACK_RANGE + parryReach
          ) {
            if (this.state.isParrying) {
              this.registerParrySuccess();
              if (this.state.form === 'DAGON') this.triggerDagonWave();
              // ★ 니알라토텝 근접 패링 시 등 뒤로 도약 & 낙인 즉시 폭발!
              if (this.state.form === 'NYARLATHOTEP') {
                this.triggerNyarlaBlink(e, false);
              }
              this.damageEnemy(e, 90, angle + Math.PI, true);
            } else {
              this.cameras.main.shake(140, 0.015);
              // 피격 플래시도 몬스터에 맞게 색상 변경 (딥 원: 녹색 점멸, 성전사: 붉은 점멸)
              if (e.isDeepOne) this.cameras.main.flash(100, 16, 185, 129);
              else this.cameras.main.flash(100, 180, 0, 0);
              if (e.isDeepOne && this.state.isAct2Escalated) e.setTint(0xc084fc);
              else e.clearTint();

              this.takeDamage(15);
            }
          }
          this.time.delayedCall(350, () => {
            if (e.active) e.isAttacking = false;
          });
        });
      } else if (!e.isWindingUp && !e.isAttacking) {
        // ★ Act 2 딥 원 특수 무빙: 지그재그로 꿈틀거리며 추적
        if (e.isDeepOne) {
          e.tick = (e.tick || Phaser.Math.Between(0, 100)) + 0.1;
          const wiggleAngle = angle + Math.sin(e.tick) * 0.45; // 좌우 흔들림
          const speed = (e.baseSpeed || 160) * slowMult;
          e.setVelocity(
            Math.cos(wiggleAngle) * speed,
            Math.sin(wiggleAngle) * speed
          );
        } else {
          // Act 1 성전사: 정직한 직선 추적
          this.physics.moveToObject(e, this.player, (e.baseSpeed || GAME_CONFIG.RANGED_ENEMY.SPEED) * slowMult);
        }
      }
    });
  }

  updateHUD() {
    let suffix = '';

    // ★ 무신앙자(THE FAITHLESS) 전용 하드코어 칭호 시스템
    if (this.state.form === 'THE FAITHLESS') {
      if (this.state.awakeningTier === 1) suffix = ' [THE MURDER]';
      else if (this.state.awakeningTier === 2) {
        suffix = this.state.awakeningPath === 'GAMMA' ? ' [THE JUDGEMENT]' : ' [THE BUTCHER]';
      } else if (this.state.awakeningTier === 3) {
        suffix = ' [GODSLAYER]';
      }
    }
    // 다른 신격들은 기존 그리스 알파벳 유지
    else {
      if (this.state.awakeningTier === 1) suffix = '-α';
      else if (this.state.awakeningTier === 2) {
        suffix = this.state.awakeningPath === 'GAMMA' ? '-γ' : '-β';
      } else if (this.state.awakeningTier === 3) {
        suffix = '-Ω';
      }
    }

    this.hudForm.setText(`FORM: ${this.state.form}${suffix}`);

    this.hudLv.setText(
      `HP: ${Math.floor(this.state.hp)}/${this.state.maxHp} | SACRIFICES: ${this.state.kills
      }`
    );
    this.hudPacifist.setText(
      `SLASHES: ${this.state.slashes} | PARRIES: ${this.state.successfulParries}`
    );

    if (this.state.slashes > 0 && this.state.form === 'MORTAL CULTIST') {
      this.hudPacifist.setColor('#64748b');
    }
  }

  applyAreaDamage(x, y, radius, angle, damage) {
    if (!this.enemies) return;
    const currentEnemies = [...this.enemies.getChildren()];

    currentEnemies.forEach((e) => {
      if (!e.active) return;
      if (Phaser.Math.Distance.Between(x, y, e.x, e.y) <= radius) {
        // ★ 무조건 true였던 것을 e.isWindingUp으로 변경 (공격 전조를 캔슬할 때만 3배 카운터)
        this.damageEnemy(e, damage, angle, e.isWindingUp);
      }
    });
  }

  takeDamage(amount) {
    if (this.state.isGameOver) return;
    if (this.state.isDashing || this.state.isInvulnerable) return;

    this.state.hasTakenDamage = true;
    this.state.hp -= amount;
    this.updateHUD();

    // 피격 시 핏빛 플래시 후 복구
    this.player.setTintFill(0xff0000);
    this.time.delayedCall(80, () => {
      this.restoreFormTint();
    });

    if (this.state.hp <= 0) {
      this.state.hp = 0;
      this.triggerGameOver();
    }
  }

  bossDefeated() {
    if (!this.boss) return;
    const bx = this.boss.x;
    const by = this.boss.y;
    const wasGreatDeepOne = this.boss.isGreatDeepOne; // ★ 2막 보스 여부 확인!

    // 1. 보스 엔티티 및 잔여 투사체 즉시 소거
    this.boss.destroy();
    this.boss = null;
    this.projectiles.clear(true, true);
    if (this.bossEyeParticles) {
      this.bossEyeParticles.destroy();
      this.bossEyeParticles = null;
    }
    if (this.bossEyeCore) {
      this.bossEyeCore.destroy();
      this.bossEyeCore = null;
    }

    // 2. 보스 체력바 UI 숨기기 (다음 DLC 보스를 위해 초기화)
    this.bossHpBg.setVisible(false);
    this.bossHpBar.setVisible(false);
    this.bossName.setVisible(false);

    // 3. 처형 연출: 대폭발 혈흔 + 찰나의 슬로우 모션 도파민
    this.cameras.main.flash(900, 185, 28, 28);
    this.cameras.main.shake(1000, 0.04);
    this.bloodEmitter.explode(140, bx, by);

    // ★ 200킬 최종 보스(그레이트 딥 원) 처치 시: 슬로우 모션 도파민 후 최종 엔딩 시퀀스 돌입!
    if (wasGreatDeepOne) {
      this.state.isBossSpawned = false;
      this.state.kills++;
      this.updateHUD();

      // 처치 순간 1.2초간 극적인 슬로우 모션 및 에메랄드/보랏빛 이중 파동 방출
      this.physics.world.timeScale = 3.5;
      [0x10b981, 0xa855f7].forEach((col, idx) => {
        const endRing = this.add
          .circle(bx, by, 30, col, 0.45)
          .setStrokeStyle(5 - idx, 0xffffff, 1)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(190);

        this.tweens.add({
          targets: endRing,
          scale: 16 + idx * 5,
          alpha: 0,
          duration: 1100,
          ease: 'Cubic.easeOut',
          onComplete: () => endRing.destroy(),
        });
      });

      this.time.delayedCall(1200, () => {
        this.physics.world.timeScale = 1.0;
        this.triggerVictoryScreen();
      });
      return;
    }

    const bossOrbCount = Phaser.Math.Between(60, 80);
    for (let i = 0; i < bossOrbCount; i++) {
      const orb = this.bloodOrbs
        .create(bx, by, 'blood_orb')
        .setBlendMode(Phaser.BlendModes.ADD);

      // 방사형 각도와 랜덤 튕김 속도(140~420)
      const blastAngle = Math.random() * Math.PI * 2;
      const blastSpeed = Phaser.Math.Between(140, 420);

      orb.setVelocity(
        Math.cos(blastAngle) * blastSpeed,
        Math.sin(blastAngle) * blastSpeed
      );
      orb.setDrag(280); // 바닥에 미끄러지듯 멈추는 물리 마찰력
    }

    // 물리 시간 축을 느리게 만들어 처치 쾌감 극대화 (0.8초 뒤 정상 복귀)
    this.physics.world.timeScale = 3.0;
    this.time.delayedCall(800, () => {
      this.physics.world.timeScale = 1.0;
    });

    // 4. 승리 보상: 최대 체력 +10 확장
    this.state.maxHp += 10;
    this.updateHUD();

    // 5. DLC 페이즈 전환 상태 플래그
    this.state.isBossSpawned = false; // 일반/신규 몹 스폰 재개 허용 (또는 포탈 대기)
    this.state.dlcStage = 1; // ★ DLC Act 2 진입 플래그
    this.state.isBossKilled = true;
    this.state.isAct2Waiting = true; // 포탈 대기 상태 돌입!

    // 보스 사망 처리 로직 내부:
    this.lastBossPos = { x: bx, y: by }; // 보스 위치 기록

    this.state.kills++; // 100 -> 101킬 달성!
    this.updateHUD();

    // 기존의 의식 이벤트 호출문 실행 (101번 이벤트 발동!)
    if (this.ritualEvents[this.state.kills]) {
      this.ritualEvents[this.state.kills]();
    }

    // 6. 화면 중앙 경고 배너 연출 (게임을 멈추지 않고 실시간 오버레이)
    const banner = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 70,
        '대주교가 쓰러졌습니다.\n그러나 성소의 봉인이 깨지며 심연이 열립니다...',
        {
          fontFamily: 'Georgia, serif',
          fontSize: '22px',
          color: '#fde047',
          align: 'center',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 5,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200)
      .setAlpha(0);

    this.tweens.add({
      targets: banner,
      alpha: 1,
      y: banner.y - 15,
      duration: 600,
      hold: 2400,
      yoyo: true,
      onComplete: () => banner.destroy(),
    });

    this.hudGuide
      .setText(
        '★ [ACT II 개막] 성소의 결계가 무너졌습니다. 더 깊은 광기가 몰려옵니다.'
      )
      .setColor('#ef4444');
  }

  triggerGameOver() {
    this.state.isGameOver = true;
    this.physics.world.isPaused = true;
    //this.time.paused = true;
    this.player.setTint(0x4a0008);

    const { width, height } = this.scale;

    // 게임 오버 텍스트 연출
    const bg = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setScrollFactor(0)
      .setDepth(250);
    this.add
      .text(width / 2, height / 2 - 20, '의식 실패\n( RITUAL FAILED )', {
        fontFamily: 'Georgia, serif',
        fontSize: '32px',
        color: '#ff1e42',
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(300);

    if (this.state.kills >= 50) {
      const LORE_TIPS = [
        '피를 묻히지 않은 칼날이 허공을 수없이 가를 때, 심연의 사냥꾼이 깨어난다',
        '검을 휘두르지 않고 온전히 공격을 받아내면 심해의 군주가 응답할 것이다',
        '당신이 신을 섬기지 않는다면 끔찍한 운명을 맞이할 것이다..',
        '상처 없이 완벽한 동작으로 그들을 멸하여 진정한 모습으로 거듭나라',
        '적이 붉게 빛나는 순간 기습하여 그들의 허를 찔러라',
        'Ph nglui mglw nafh Cthulhu R lyeh wgah nagl fhtagn.',
        '인간이 느끼는 가장 강력하고 오래된 감정은 공포이다.\n또한 인간이 느끼는 가장 강력하고 오래된 공포는, 미지의 것에 대한 공포이다.\n-H.P.러브크래프트',
      ];

      const randomTip = Phaser.Utils.Array.GetRandom(LORE_TIPS);
      this.add
        .text(width / 2, height - 80, `[ Tips ]\n${randomTip}`, {
          fontFamily: 'Georgia, serif',
          fontSize: '13px',
          color: '#94a3b8',
          align: 'center',
          fontStyle: 'italic',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(300);
    }

    // 처음엔 투명하게(alpha: 0) 숨겨두어 연타 중 실수로 넘어가는 것을 방지
    const restartText = this.add
      .text(
        width / 2,
        height / 2 + 50,
        '- [R] 키 또는 클릭하여 처음부터 다시 시작 -',
        {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#94a3b8',
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(300)
      .setAlpha(0);

    // ★ 사망 후 1.2초(1200ms)가 지나야 재시작 텍스트가 나타나고 입력이 활성화됨!
    this.time.delayedCall(1200, () => {
      this.tweens.add({
        targets: restartText,
        alpha: 1,
        duration: 400,
      });

      const doRestart = () => {
        this.physics.world.isPaused = false;
        this.scene.restart();
      };

      // 1.2초 뒤부터 마우스 클릭 또는 R키 입력 허용
      this.input.once('pointerdown', doRestart);
      this.input.keyboard.once('keydown-R', doRestart);
    });
  }

  startAct2Phase(bx, by) {
    if (this.crusaderTimer) this.crusaderTimer.remove();
    if (this.inquisitorTimer) this.inquisitorTimer.remove();
    if (this.projectiles) this.projectiles.clear(true, true);
    if (this.enemies) this.enemies.clear(true, true);

    this.cameras.main.flash(600, 168, 85, 247);
    this.cameras.main.shake(500, 0.015);

    // 포탈 컨테이너 (외곽 기하학 링 + 내부 심연 소용돌이 + 코어)
    const portalOuter = this.add
      .circle(bx, by, 44, 0x090414, 0.9)
      .setStrokeStyle(3, 0x10b981, 0.9)
      .setDepth(5);

    const portalInner = this.add
      .circle(bx, by, 28, 0x020617, 1)
      .setStrokeStyle(2, 0xa855f7, 0.85)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(6);

    // 포탈 주변에서 빨려 들어가는 심연 입자
    const portalParticles = this.add
      .particles(bx, by, 'px', {
        color: [0x10b981, 0xa855f7, 0x064e3b],
        scale: { start: 2.5, end: 0 },
        alpha: { start: 0.8, end: 0 },
        speed: { min: 15, max: 45 },
        angle: { min: 0, max: 360 },
        lifespan: 700,
        frequency: 40,
        blendMode: 'ADD',
      })
      .setDepth(6);

    // 포탈 맥동 애니메이션
    this.tweens.add({
      targets: portalOuter,
      scale: 1.18,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: portalInner,
      scale: 0.75,
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // 포탈 위 안내 텍스트
    const portalLabel = this.add
      .text(bx, by - 62, '[ 심연의 문 ]', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#a7f3d0',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(20);

    this.hudGuide
      .setText(
        '🌀 대주교의 유해 위로 차원문이 열렸습니다. 포탈로 걸어가 심연으로 진입하십시오.'
      )
      .setColor('#34d399');

    // 플레이어가 포탈 반경(45px) 안으로 걸어 들어왔는지 체크하는 타이머
    let entered = false;
    const portalCheckTimer = this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (entered || !this.player || !this.player.active) return;

        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          bx,
          by
        );

        if (dist <= 45) {
          entered = true;
          portalCheckTimer.remove();

          // 포탈로 빨려 들어가는 연출
          this.player.setVelocity(0, 0);
          this.physics.world.pause();

          this.cameras.main.shake(700, 0.025);
          this.cameras.main.fade(700, 2, 6, 23); // 심연의 암흑으로 페이드아웃

          this.time.delayedCall(750, () => {
            portalOuter.destroy();
            portalInner.destroy();
            portalParticles.destroy();
            portalLabel.destroy();

            // ★ 2단계: 본격적인 크툴루 신화 배경(Act 2 월드) 구축 및 전환!
            this.buildAct2MythosWorld();
          });
        }
      },
    });
  }
  buildAct2MythosWorld() {
    this.state.isAct2 = true;
    this.state.isAct2Waiting = false;

    // 1. 기존 Act 1 회색 그리드 & 마법진 배경이 있다면 제거
    if (this.act1BgGfx) {
      this.act1BgGfx.destroy();
      this.act1BgGfx = null;
    }
    if (this.bloodDecalGfx) {
      this.bloodDecalGfx.clear();
    }

    const worldW = 1400;
    const worldH = 1400;

    // 2. 새로운 Act 2 전용 배경 Graphics 생성 (가장 아래 Depth)
    this.act2BgGfx = this.add.graphics().setDepth(-10);

    // (A) 심연의 기저 바닥색 (차가운 회색 대신 기괴한 심해 녹흑색 '#03090a')
    this.cameras.main.setBackgroundColor('#03090a');
    this.act2BgGfx.fillStyle(0x03090a, 1);
    this.act2BgGfx.fillRect(0, 0, worldW, worldH);

    // (B) 반듯한 격자(Grid) 대신, 불규칙하고 거대한 '고대 유적 석판(Cyclopean Slabs)'과 균열 그리기
    this.act2BgGfx.lineStyle(2, 0x0b211d, 0.7);
    for (let x = 0; x < worldW; x += 180) {
      for (let y = 0; y < worldH; y += 180) {
        // 비유클리드 느낌을 위해 석판 모서리를 살짝씩 비틀어 배치
        const offsetX = ((y / 180) % 2) * 60;
        this.act2BgGfx.strokeRect(x + offsetX, y, 172, 172);

        // 석판 내부의 기하학적 고대 문양(사선 균열)
        if ((x + y) % 360 === 0) {
          this.act2BgGfx.lineStyle(1, 0x113830, 0.4);
          this.act2BgGfx.lineBetween(
            x + offsetX + 20,
            y + 20,
            x + offsetX + 150,
            y + 150
          );
          this.act2BgGfx.lineStyle(2, 0x0b211d, 0.7);
        }
      }
    }

    // (C) 맵 중앙: 기존의 인위적인 마법진 대신 '잠든 옛 지배자의 거대한 심연의 눈(Eldritch Eye) 문양'
    const cx = worldW / 2;
    const cy = worldH / 2;
    this.act2BgGfx.lineStyle(3, 0x0f3d33, 0.6);
    this.act2BgGfx.strokeCircle(cx, cy, 260);
    this.act2BgGfx.strokeEllipse(cx, cy, 480, 190); // 가로로 찢어진 거대 안구 형상
    this.act2BgGfx.strokeEllipse(cx, cy, 80, 185); // 세로로 찢어진 파충류/심연 동공

    // (D) 맵 곳곳에 솟아있는 '고대 모놀리스(Monolith) 기둥'과 신비로운 발광 룬 오브젝트 배치
    const pillarSpots = [
      { x: cx - 380, y: cy - 280 },
      { x: cx + 380, y: cy - 280 },
      { x: cx - 380, y: cy + 280 },
      { x: cx + 380, y: cy + 280 },
      { x: cx, y: cy - 420 },
      { x: cx, y: cy + 420 },
    ];

    this.act2Runes = [];

    pillarSpots.forEach((spot) => {
      // 기둥 바닥 그림자 및 석조 단상
      this.act2BgGfx.fillStyle(0x071714, 0.9);
      this.act2BgGfx.fillCircle(spot.x, spot.y, 42);
      this.act2BgGfx.lineStyle(2, 0x10b981, 0.35);
      this.act2BgGfx.strokeCircle(spot.x, spot.y, 42);

      // 은은하게 숨 쉬듯 빛나는 고대 룬 코어
      const runeGlow = this.add
        .circle(spot.x, spot.y, 8, 0x10b981, 0.5)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(-5);

      this.act2Runes.push(runeGlow);

      this.tweens.add({
        targets: runeGlow,
        alpha: 0.15,
        scale: 1.8,
        duration: Phaser.Math.Between(1400, 2200),
        yoyo: true,
        repeat: -1,
      });
    });

    // (E) 공기 중에 부유하는 심해 발광 포자(Eldritch Spores) 환경 파티클
    this.act2AmbientParticles = this.add
      .particles(0, 0, 'px', {
        x: { min: 0, max: worldW },
        y: { min: 0, max: worldH },
        color: [0x10b981, 0x6ee7b7, 0xa855f7],
        scale: { start: 1.8, end: 0 },
        alpha: { start: 0.45, end: 0 },
        speedY: { min: -25, max: -8 },
        speedX: { min: -10, max: 10 },
        lifespan: { min: 2500, max: 4500 },
        frequency: 90,
        blendMode: 'ADD',
      })
      .setDepth(-2);

    // 3. 플레이어를 새로운 심연 맵의 정중앙으로 재배치하고 물리 엔진 재개
    this.player.setPosition(cx, cy);
    this.physics.world.resume();
    this.cameras.main.fadeIn(1000, 2, 6, 23);

    this.initAct2Loop();

    // 4. 모험의 시작을 알리는 챕터 타이틀 연출
    const chapterTitle = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        'ACT II : 가라앉은 고대 도시\n[ SUNKEN R’LYEH ]',
        {
          fontFamily: 'Georgia, serif',
          fontSize: '26px',
          color: '#6ee7b7',
          align: 'center',
          fontStyle: 'bold',
          stroke: '#022c22',
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200);

    this.tweens.add({
      targets: chapterTitle,
      alpha: 0,
      y: chapterTitle.y - 30,
      delay: 2200,
      duration: 1200,
      onComplete: () => chapterTitle.destroy(),
    });

    this.hudGuide
      .setText(
        '🌌 [ACT II] 의식의 방을 벗어나 고대 신들의 영역에 발을 들였습니다.'
      )
      .setColor('#6ee7b7');
  }

  setupMobileControls() {
    // ★ 1. 순수 모바일/태블릿 OS일 때만 모바일 모드로 확정
    const os = this.sys.game.device.os;
    this.isMobile = os.android || os.iOS || os.iPad || os.iPhone || os.windowsPhone;

    this.joyData = {
      active: false,
      pointerId: null,
      vx: 0,
      vy: 0,
      angle: 0,
    };
    this.lastAimAngle = 0;

    // 데스크톱(Mac, Windows, Linux) 환경이면 가상 UI를 아예 생성하지 않고 종료
    if (!this.isMobile) return;

    // 모바일용 하단 가이드 텍스트 변경
    if (this.hudGuide) {
      this.hudGuide.setText(
        '[좌측 패드] 이동 | [ 우측 버튼] 베기 / 패링 / 대시 (가장 가까운 적 자동 조준)'
      );
    }

    const joyX = 115;
    const joyY = 475;
    const joyRadius = 52;

    // 2. 좌측 가상 조이스틱 UI
    this.joyBase = this.add
      .circle(joyX, joyY, joyRadius, 0x0f172a, 0.45)
      .setStrokeStyle(2.5, 0x64748b, 0.7)
      .setScrollFactor(0)
      .setDepth(210);

    this.joyThumb = this.add
      .circle(joyX, joyY, 24, 0xe2e8f0, 0.65)
      .setScrollFactor(0)
      .setDepth(211);

    // 화면 좌측 절반(x < 400) 터치 시 조이스틱 활성화
    this.input.on('pointerdown', (p) => {
      if (p.x < 400 && !this.joyData.active) {
        this.joyData.active = true;
        this.joyData.pointerId = p.id;
        this.updateJoystick(p);
      }
    });

    this.input.on('pointermove', (p) => {
      if (this.joyData.active && p.id === this.joyData.pointerId) {
        this.updateJoystick(p);
      }
    });

    const releaseJoystick = (p) => {
      if (this.joyData.active && p.id === this.joyData.pointerId) {
        this.joyData.active = false;
        this.joyData.pointerId = null;
        this.joyData.vx = 0;
        this.joyData.vy = 0;
        this.joyThumb.setPosition(joyX, joyY);
      }
    };
    this.input.on('pointerup', releaseJoystick);
    this.input.on('pointerupoutside', releaseJoystick);

    // 3. 우측 액션 버튼 3종 생성 헬퍼 (베기 / 패링 / 대시)
    const createTouchBtn = (bx, by, radius, color, label, callback) => {
      const btn = this.add
        .circle(bx, by, radius, color, 0.35)
        .setStrokeStyle(3, color, 0.9)
        .setScrollFactor(0)
        .setDepth(210)
        .setInteractive();

      const txt = this.add
        .text(bx, by, label, {
          fontFamily: 'monospace',
          fontSize: radius > 35 ? '15px' : '12px',
          color: '#ffffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(211);

      btn.on('pointerdown', () => {
        if (this.state.isGameOver || this.state.isPaused) return;
        btn.setScale(0.88).setAlpha(0.8);
        callback();
      });
      btn.on('pointerup', () => btn.setScale(1.0).setAlpha(1.0));
      btn.on('pointerout', () => btn.setScale(1.0).setAlpha(1.0));

      return { btn, txt };
    };

    // 우측 하단 아케이드식 삼각 배치
    // 1) 메인 단검 베기 (우측 하단 대형 버튼)
    createTouchBtn(695, 490, 44, 0xef4444, 'SLASH', () => {
      if (this.state.form === 'DAGON') this.performParry();
      else this.performDaggerSlash();
    });

    // 2) 패링 (베기 버튼 좌측)
    createTouchBtn(590, 515, 34, 0x38bdf8, 'PARRY', () => {
      this.performParry();
    });

    // 3) 대시 (베기 버튼 상단)
    createTouchBtn(665, 390, 34, 0xa855f7, 'DASH', () => {
      this.performDash();
    });

    // 4) 우측 상단 일시정지(PAUSE) 작은 버튼
    createTouchBtn(760, 35, 20, 0x64748b, '||', () => {
      this.input.keyboard.emit('keydown-ESC');
    });
  }

  // 조이스틱 벡터 계산
  updateJoystick(p) {
    const joyX = 115;
    const joyY = 475;
    const maxDist = 52;

    const dx = p.x - joyX;
    const dy = p.y - joyY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const clampedDist = Math.min(dist, maxDist);
    this.joyThumb.setPosition(
      joyX + Math.cos(angle) * clampedDist,
      joyY + Math.sin(angle) * clampedDist
    );

    // 데드존(8px) 이상 밀었을 때만 이동 반영
    if (dist > 8) {
      const force = clampedDist / maxDist;
      this.joyData.vx = Math.cos(angle) * force;
      this.joyData.vy = Math.sin(angle) * force;
      this.joyData.angle = angle;
      this.lastAimAngle = angle;
    } else {
      this.joyData.vx = 0;
      this.joyData.vy = 0;
    }
  }

  // ★ [핵심] PC 마우스 조준 & 모바일 스마트 오토에임 통합 각도 반환기
  getAimAngle() {
    if (!this.isMobile) {
      const worldPoint = this.cameras.main.getWorldPoint(
        this.input.activePointer.x,
        this.input.activePointer.y
      );
      return Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        worldPoint.x,
        worldPoint.y
      );
    }

    // 모바일 1순위: 근접 반경(220px) 내에 활성화된 적이나 제단이 있으면 가장 가까운 대상 자동 조준!
    let nearestTarget = null;
    let minDist = 220;

    this.enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
      if (d < minDist) {
        minDist = d;
        nearestTarget = e;
      }
    });

    // 주변에 적이 없고 제단이 가까이 있다면 제단 조준
    if (!nearestTarget && this.shrines) {
      this.shrines.getChildren().forEach((s) => {
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
        if (d < 120) nearestTarget = s;
      });
    }

    if (nearestTarget) {
      this.lastAimAngle = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        nearestTarget.x,
        nearestTarget.y
      );
      return this.lastAimAngle;
    }

    // 모바일 2순위: 주변에 적이 없으면 현재 조이스틱을 밀고 있는 방향(또는 마지막 이동 방향) 반환
    return this.lastAimAngle || 0;
  }

}





new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  // ★ 1. 모바일 화면 크기에 맞춰 비율을 유지하며 꽉 차게 정렬
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // ★ 2. 멀티터치 지원 (조이스틱 + 공격/대시 동시 입력용 포인터 3개 확보)
  input: {
    activePointers: 3,
  },
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [PreloadScene, MainScene],
});

// =========================================================================
// [DLC 확장 진입점] 대주교가 죽은 자리(bx, by)에서 시작되는 신규 이벤트
// =========================================================================
