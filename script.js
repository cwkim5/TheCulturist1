// ============================================================================
// [1. DATA & CONFIG] - 수치 밸런싱 테이블
// ============================================================================
const GAME_CONFIG = {
  DEBUG_UNLOCK_TAINTED: true,
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
    HP: 85,
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
      .text(width / 2, height / 2 + 50, '[ CLICK TO COMMENCE RITUAL ]', {
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

    gfx
      .fillStyle(0xffffff, 1)
      .fillCircle(5, 5, 4)
      .lineStyle(1.5, 0x67e8f9, 0.9)
      .strokeCircle(5, 5, 4)
      .generateTexture('dream_bolt', 10, 10)
      .clear();

    // [Dreamlands 몹 1] 나이트건트 (Nightgaunt) - 얼굴 없는 검은 날개 추격자 (36x36)
    const ashGfx = this.make.graphics({ x: 0, y: 0, add: false });
    ashGfx.fillStyle(0x160f29, 1); // 칠흑빛 심야 보라 몸체
    ashGfx.lineStyle(2, 0xc084fc, 0.9); // 몽환적인 연보라 윤곽선
    // 박쥐 날개 + 뾰족한 몸체 실루엣
    ashGfx.beginPath();
    ashGfx.moveTo(30, 18); // 얼굴 없는 매끈한 머리
    ashGfx.lineTo(18, 4);  // 좌측 날개 끝
    ashGfx.lineTo(6, 10);
    ashGfx.lineTo(12, 18); // 꼬리/허리
    ashGfx.lineTo(6, 26);
    ashGfx.lineTo(18, 32); // 우측 날개 끝
    ashGfx.closePath();
    ashGfx.fillPath();
    ashGfx.strokePath();
    // 머리 앞쪽 은빛 초승달 뿔 2개 (눈 대신 뿔로 전방 방향성 표현)
    ashGfx.lineStyle(2, 0xe2e8f0, 1);
    ashGfx.lineBetween(24, 14, 34, 11);
    ashGfx.lineBetween(24, 22, 34, 25);
    ashGfx.generateTexture('ashen_hound', 36, 36);
    ashGfx.destroy();

    // [Dreamlands 몹 2] 문비스트 저격수 (Moon-Beast) - 창백한 달빛 저격수 (36x36)
    const snpGfx = this.make.graphics({ x: 0, y: 0, add: false });
    snpGfx.fillStyle(0x2e1065, 1); // 깊은 자수정 로브
    snpGfx.lineStyle(2, 0xe2e8f0, 0.9); // 창백한 은빛 테두리
    snpGfx.fillCircle(13, 18, 11);
    snpGfx.strokeCircle(13, 18, 11);
    // 창백한 달빛 얼굴(코어)
    snpGfx.fillStyle(0xd8b4fe, 0.9);
    snpGfx.fillCircle(15, 18, 5);
    // 은빛 저격 지팡이 + 마젠타/선혈 조준 코어 (보라 배경에서 시인성 확보)
    snpGfx.fillStyle(0xe2e8f0, 1);
    snpGfx.fillRect(17, 16, 17, 4);
    snpGfx.fillStyle(0xff0055, 1);
    snpGfx.fillCircle(34, 18, 2.8);
    snpGfx.generateTexture('blood_sniper', 36, 36);
    snpGfx.destroy();

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

    // ★ [다곤 패링 반사 전용] 심해의 푸른 가시(바늘) 텍스처 생성 (28x10)
    const needleGfx = this.make.graphics({ x: 0, y: 0, add: false });
    // 1) 바깥쪽 날카로운 심해 청록색 칼날 외곽
    needleGfx.fillStyle(0x0ea5e9, 0.95);
    needleGfx.beginPath();
    needleGfx.moveTo(28, 5);  // 바늘 앞쪽 끝단 (예리한 꼭짓점)
    needleGfx.lineTo(6, 0);   // 상단 날개각
    needleGfx.lineTo(0, 5);   // 꼬리 끝
    needleGfx.lineTo(6, 10);  // 하단 날개각
    needleGfx.closePath();
    needleGfx.fillPath();

    // 2) 중심부 짙은 심해 코어 & 창백한 네온 하이라이트 (다크 판타지 톤 유지)
    needleGfx.fillStyle(0x082f49, 1);
    needleGfx.fillTriangle(20, 5, 6, 2.5, 6, 7.5);
    needleGfx.lineStyle(1.2, 0x7dd3fc, 0.9);
    needleGfx.beginPath().moveTo(2, 5).lineTo(26, 5).strokePath();

    needleGfx.generateTexture('dagon_needle', 28, 10);
    needleGfx.destroy();

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
      dashDuration: 100, // 대시 지속 시간 (0.18초 무적 질주)
      dashSpeed: 800, // 대시 순간 속도
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
        const px = 700;
        const py = 700;
        this.startAct2Phase(px, py);
      },

      150: () => {
        if (this.state.isTaintedAct2) {
          this.spawnDreamMidBoss(); // ★ 드림랜드: 중간 보스 강림
        } else {
          this.triggerWaveEscalation2();  // 기존 심해 루트: 공허 폭주 (기존 150킬 로직)
        }
      },

      160: () => {
        // ★ 드림랜드는 중간 보스 처치 시 감마 진화하므로 160킬에서는 일반 루트(BETA)만 실행
        if (!this.state.isTaintedAct2) {
          this.triggerTier2Evolution('BETA');
        }
      },
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

          // ★ [추가] 패링 성공 시 일시 무적 부여 (다곤 600ms, 그 외 400ms)
          const invDuration = this.state.form === 'DAGON' ? 600 : 400;
          this.state.isInvulnerable = true;
          this.player.setAlpha(0.75);
          if (this.parryInvTimer) this.parryInvTimer.remove();
          this.parryInvTimer = this.time.delayedCall(invDuration, () => {
            this.state.isInvulnerable = false;
            if (this.player && this.player.active) {
              this.player.setAlpha(1);
              this.restoreFormTint();
            }
          });

          if (this.state.form === 'DAGON') {
            this.triggerDagonWave();
            if (!bolt || !bolt.active || !bolt.body) return;
            bolt.isDeflected = true;

            // ★ 가장 가까운 살아있는 적 탐색 (없으면 날아오던 역방향으로 반사)
            let target = null;
            let minDist = Infinity;
            this.enemies.getChildren().forEach((e) => {
              if (!e.active) return;
              const d = Phaser.Math.Distance.Between(bolt.x, bolt.y, e.x, e.y);
              if (d < minDist) {
                minDist = d;
                target = e;
              }
            });

            const reflectAngle = target
              ? Phaser.Math.Angle.Between(bolt.x, bolt.y, target.x, target.y)
              : Math.atan2(-bolt.body.velocity.y, -bolt.body.velocity.x);

            // ★ 본체 탄환도 파란 바늘(dagon_needle)로 교체 및 진행 방향 회전!
            bolt.setTexture('dagon_needle');
            bolt.clearTint(); // Preload에서 그린 바늘 본연의 투톤 컬러 유지
            bolt.setScale(1.3);
            bolt.setRotation(reflectAngle);
            bolt.setVelocity(
              Math.cos(reflectAngle) * 500,
              Math.sin(reflectAngle) * 500
            );

            // ★ [80킬 초월: 다곤] 반사 탄환 좌우로 2발의 추가 심해 바늘 분열 발사!
            if (this.state.isExAwakened) {
              [-0.25, 0.25].forEach((offset) => {
                const splitAngle = reflectAngle + offset;
                const splitBolt = this.projectiles
                  .create(bolt.x, bolt.y, 'dagon_needle')
                  .setScale(1.3)
                  .setRotation(splitAngle) // ★ 분열 바늘도 각도에 맞춰 회전!
                  .setDepth(9);
                splitBolt.isDeflected = true;
                splitBolt.setVelocity(
                  Math.cos(splitAngle) * 480,
                  Math.sin(splitAngle) * 480
                );
                this.time.delayedCall(2500, () => {
                  if (splitBolt.active) splitBolt.destroy();
                });
              });
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
        if (!bolt || !bolt.active || !enemy || !enemy.active) return;
        if (bolt.isDeflected) {
          this.damageEnemy(
            enemy,
            65, // ★ 기존 90 -> 65로 하향
            Phaser.Math.Angle.Between(bolt.x, bolt.y, enemy.x, enemy.y),
            false // ★ 기존 true(3배 카운터) -> false로 변경 (270 -> 65)
          );
          if (bolt && bolt.active) bolt.destroy();
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

    this.input.on('pointerdown', (p) => {
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

    let dashAngle;
    if (vx === 0 && vy === 0) {
      dashAngle = this.getAimAngle(); // ★ 가만히 서서 대시할 때도 통합 조준 방향 사용!
    } else {
      dashAngle = Math.atan2(vy, vx);
    }

    // 2. 극대화된 속도 적용
    this.player.setVelocity(
      Math.cos(dashAngle) * this.state.dashSpeed,
      Math.sin(dashAngle) * this.state.dashSpeed
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
    this.time.delayedCall(this.state.dashDuration, () => {
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
      const isGamma = this.state.awakeningPath === 'GAMMA';

      if (isGamma) {
        // ★ [감마 전용] 양옆에서 앞쪽으로 날카롭게 휘어지는 검붉은 악마 뿔 2자루
        const drawHorn = (side) => {
          const base1 = getPos(2, side * 11);
          const base2 = getPos(-3, side * 13);
          const mid = getPos(8, side * 20);
          const tip = getPos(19, side * 15); // 앞쪽을 향해 굽은 뿔 끝

          this.playerEyeGfx.fillStyle(0x450a0a, 1);
          this.playerEyeGfx.lineStyle(2, 0xef4444, 1);
          this.playerEyeGfx.beginPath();
          this.playerEyeGfx.moveTo(base1.x, base1.y);
          this.playerEyeGfx.lineTo(mid.x, mid.y);
          this.playerEyeGfx.lineTo(tip.x, tip.y);
          this.playerEyeGfx.lineTo(base2.x, base2.y);
          this.playerEyeGfx.closePath();
          this.playerEyeGfx.fillPath();
          this.playerEyeGfx.strokePath();
        };
        drawHorn(-1); // 왼쪽 뿔
        drawHorn(1);  // 오른쪽 뿔

        // 살인마 특유의 날카롭게 찢어진 핏빛+백색 안광
        const l1 = getPos(4, -6), l2 = getPos(9, -2);
        const r1 = getPos(4, 6), r2 = getPos(9, 2);
        this.playerEyeGfx.lineStyle(3.5, 0xff003c, 0.9);
        this.playerEyeGfx.lineBetween(l1.x, l1.y, l2.x, l2.y);
        this.playerEyeGfx.lineBetween(r1.x, r1.y, r2.x, r2.y);
        this.playerEyeGfx.lineStyle(1.5, 0xffffff, 1);
        this.playerEyeGfx.lineBetween(l1.x, l1.y, l2.x, l2.y);
        this.playerEyeGfx.lineBetween(r1.x, r1.y, r2.x, r2.y);
      } else {
        // 기존 무신앙자 안광 유지
        this.playerEyeGfx.fillStyle(0xffffff, 1);
        const e1 = getPos(6, -3);
        const e2 = getPos(6, 3);
        this.playerEyeGfx.fillRect(e1.x - 1, e1.y - 1.5, 3, 3);
        this.playerEyeGfx.fillRect(e2.x - 1, e2.y - 1.5, 3, 3);
      }
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

        // 묵직하고 간결한 영문 선언 배너
        const banner = this.add
          .text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 70,
            'THE CRAWLING CHAOS\n[ Nyarlathotep ]',
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
      .text(530, 18, 'Grand Inquisitor', {
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
        '[WASD] Move | [L-Click] Dagger Slash | [R-Click] Parry | [SPACE] Dash',
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
      if (this.state.awakeningPath !== 'BETA' && this.time.now > this.chaosEndTime) {
        this.state.isChaos = false;
        this.state.nyarlaCombo = 0;

        // 이펙트 및 타이머 정리
        if (this.chaosOverlay) this.chaosOverlay.destroy();
        if (this.chaosDamageTimer) this.chaosDamageTimer.remove();

        this.hudGuide
          .setText(
            '[Awakening: Nyarlathotep] One with the Crawling Chaos. (Rampage at 5 consecutive kills)'
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
  }

  handlePlayerMovement() {
    this.player.setRotation(this.getAimAngle());

    if (!this.player.isLunging && !this.state.isDashing) {
      let vx = 0,
        vy = 0;
      // 1. 폼별 이동 속도 배율 사전(Dictionary) 정의
      const speedMultipliers = {
        'THE FAITHLESS': 1.35,  // 무신앙자는 가장 빠른 1.35배
        'NYARLATHOTEP': 1.25,   // 예: 기동성이 중요한 폼은 1.25배
        'HASTUR': 1.15,         // 예: 밸런스형 폼은 1.15배
        'DAGON': 1.10,          // 예: 묵직한 폼도 최소 1.1배 상승
        'CTHUGHA': 1.15,
        // ... 추가되는 폼 이름과 배율을 여기에 계속 적어주면 됩니다.
      };

      // 2. 현재 폼에 해당하는 배율을 찾고, 목록에 없으면 기본 폼으로 간주해 1.0배 적용
      // 만약 진화 전 폼 이름이 'MORTAL'이나 'NORMAL'이라면 1.0이 들어갑니다.
      const multiplier = speedMultipliers[this.state.form] || 1.0;

      const spd = GAME_CONFIG.PLAYER.SPEED * multiplier;

      if (this.keys.A.isDown) vx = -spd;
      else if (this.keys.D.isDown) vx = spd;
      if (this.keys.W.isDown) vy = -spd;
      else if (this.keys.S.isDown) vy = spd;
      if (vx !== 0 && vy !== 0) {
        vx *= 0.7071;
        vy *= 0.7071;
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

    // 1. 노덴스 히든 해금 체크 (각성 시 즉시 종료)
    if (this.checkNodensUnlock()) {
      this.state.canSlash = true;
      return;
    }

    const angle = this.getAimAngle();

    // 2. 제단 타격 판정
    this.checkShrineInteraction();

    // 3. 노덴스 전용 4단 콤보 (독자적인 쿨다운 사용)
    if (this.state.form === 'NODENS') {
      this.slashNodens(angle);
      return;
    }

    // 4. 공통 런지(돌진/반동) 및 초승달 궤적 + 기본 폼 판정
    const form = this.state.form;
    const isNyarlaChaos = form === 'NYARLATHOTEP' && this.state.isChaos;
    const usesStandardHit = form !== 'THE FAITHLESS' && form !== 'CTHUGHA';
    const isFaithlessGamma = form === 'THE FAITHLESS' && this.state.awakeningPath === 'GAMMA';

    this.applySlashLunge(angle, form);
    if (!isFaithlessGamma) {
      this.playCrescentSlash(angle, usesStandardHit);
    }

    // 5. 폼별 특수 공격 라우팅
    if (form === 'CTHULHU') this.slashCthulhu(angle);
    else if (isFaithlessGamma) this.slashFaithlessGammaWhip(angle); // ★ 감마 전용 채찍!
    else if (form === 'THE FAITHLESS') this.slashFaithless(angle);
    else if (form === 'CTHUGHA') this.slashCthugha(angle);
    else if (isNyarlaChaos) this.playNyarlaChaosClaw(angle);

    // 6. 공격 쿨다운 복구
    const cd =
      form === 'THE FAITHLESS' || isNyarlaChaos
        ? GAME_CONFIG.PLAYER.DAGGER_COOLDOWN * 0.62
        : GAME_CONFIG.PLAYER.DAGGER_COOLDOWN;

    this.time.delayedCall(cd, () => {
      this.state.canSlash = true;
    });
  }

  checkNodensUnlock() {
    if (this.state.form !== 'MORTAL CULTIST' || this.state.kills !== 0) return false;
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
      return true;
    }
    return false;
  }

  checkShrineInteraction() {
    this.shrines.getChildren().forEach((s) => {
      if (
        Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y) <=
        GAME_CONFIG.PLAYER.DAGGER_RANGE + 25
      ) {
        if (s.tierType) this.triggerTier2Evolution(s.tierType);
        else if (s.godType) this.triggerGruesomeEvolution(s.godType);
      }
    });
  }

  applySlashLunge(angle, form) {
    this.player.isLunging = true;
    if (form === 'CTHUGHA') {
      this.player.setVelocity(Math.cos(angle + Math.PI) * 350, Math.sin(angle + Math.PI) * 350);
      this.time.delayedCall(120, () => {
        if (this.player) this.player.isLunging = false;
      });
    } else {
      const mult = form === 'THE FAITHLESS' ? 1.5 : 1.0;
      this.player.setVelocity(
        Math.cos(angle) * GAME_CONFIG.PLAYER.LUNGE_SPEED * mult,
        Math.sin(angle) * GAME_CONFIG.PLAYER.LUNGE_SPEED * mult
      );
      this.time.delayedCall(90, () => {
        if (this.player) this.player.isLunging = false;
      });
    }
  }

  slashFaithlessGammaWhip(angle) {
    const maxRange = 245;
    const hitEnemies = new Set(); // 클릭 1회당 동일 적 중복 타격 방지 (밸런스 유지)

    // 1. 배경에 깔리는 반투명 핏빛 부채꼴 잔상 (공격 범위 볼륨감 확보)
    const fanGfx = this.add.graphics().setDepth(13).setBlendMode(Phaser.BlendModes.ADD);
    fanGfx.fillStyle(0x991b1b, 0.22);
    fanGfx.slice(this.player.x, this.player.y, maxRange, angle - 0.85, angle + 0.85, false);
    fanGfx.fillPath();
    this.tweens.add({
      targets: fanGfx,
      alpha: 0,
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => fanGfx.destroy(),
    });

    // 2. 3가닥 혈뢰 채찍이 엇갈리며 난도질 (좌상 -> 우하 -> 정면 교차)
    const lashOffsets = [-0.52, 0.52, Phaser.Math.FloatBetween(-0.18, 0.18)];
    const curveDirs = [1, -1, Phaser.Math.RND.pick([-1, 1])];

    lashOffsets.forEach((offset, idx) => {
      this.time.delayedCall(idx * 42, () => {
        if (!this.player || !this.player.active || this.state.isGameOver) return;

        const sx = this.player.x;
        const sy = this.player.y;
        const lashAngle = angle + offset;
        const perpAngle = lashAngle + Math.PI / 2;
        const lashLen = maxRange * Phaser.Math.FloatBetween(0.92, 1.05);
        const segments = 8;

        // 지그재그 혈뢰 마디 좌표 생성
        const pts = [{ x: sx, y: sy }];
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const r = t * lashLen;
          const bend = Math.sin(t * Math.PI) * 26 * curveDirs[idx]; // 채찍 휘어짐
          const jitter = i === segments ? 0 : Phaser.Math.Between(-14, 14) * (0.4 + t * 0.6); // 하스터식 번개 굴곡
          const perp = bend + jitter;

          pts.push({
            x: sx + Math.cos(lashAngle) * r + Math.cos(perpAngle) * perp,
            y: sy + Math.sin(lashAngle) * r + Math.sin(perpAngle) * perp,
          });
        }

        const lashGfx = this.add.graphics().setDepth(14).setBlendMode(Phaser.BlendModes.ADD);
        const drawPath = (width, color, alpha) => {
          lashGfx.lineStyle(width, color, alpha);
          lashGfx.beginPath();
          pts.forEach((pt, i) => (i === 0 ? lashGfx.moveTo(pt.x, pt.y) : lashGfx.lineTo(pt.x, pt.y)));
          lashGfx.strokePath();
        };

        // 반투명 3중 발광 레이어 (넓은 혈기 -> 선혈 -> 날카로운 백색 핵)
        drawPath(16, 0x7f1d1d, 0.32);
        drawPath(7, 0xff003c, 0.62);
        drawPath(2, 0xfecaca, 0.85);

        // 채찍 끝단 X자 찢김 섬광
        const tip = pts[pts.length - 1];
        lashGfx.lineStyle(2, 0xff003c, 0.75);
        lashGfx.lineBetween(tip.x - 14, tip.y - 14, tip.x + 14, tip.y + 14);
        lashGfx.lineBetween(tip.x + 14, tip.y - 14, tip.x - 14, tip.y + 14);

        this.tweens.add({
          targets: lashGfx,
          alpha: 0,
          duration: 185,
          ease: 'Cubic.easeOut',
          onComplete: () => lashGfx.destroy(),
        });

        if (idx === 0) this.cameras.main.shake(80, 0.007);

        // ★ 3가닥이 나가는 동안 부채꼴 범위 내 적 판정
        [...this.enemies.getChildren()].forEach((e) => {
          if (!e.active || hitEnemies.has(e)) return;

          const dist = Phaser.Math.Distance.Between(sx, sy, e.x, e.y);
          const enemyAngle = Phaser.Math.Angle.Between(sx, sy, e.x, e.y);
          const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - angle));

          if (dist <= maxRange + (e.isBoss ? 28 : 14) && angleDiff <= 0.85) {
            hitEnemies.add(e);

            const isTipHit = dist >= 150;
            const dmg = isTipHit ? 78 : 58;
            this.damageEnemy(e, dmg, enemyAngle, e.isWindingUp);

            if (isTipHit) {
              this.bloodEmitter.explode(20, e.x, e.y);
              const crack = this.add
                .circle(e.x, e.y, 12, 0xff003c, 0.55)
                .setStrokeStyle(2, 0xfecaca, 0.9)
                .setBlendMode(Phaser.BlendModes.ADD)
                .setDepth(15);
              this.tweens.add({
                targets: crack,
                scale: 2.5,
                alpha: 0,
                duration: 160,
                onComplete: () => crack.destroy(),
              });
            }

            // 흡혈
            if (Phaser.Math.Between(1, 100) <= 14 && this.state.hp < this.state.maxHp) {
              this.state.hp = Math.min(this.state.maxHp, this.state.hp + 2);
              this.updateHUD();
            }
          }
        });
      });
    });
  }

  playCrescentSlash(angle, usesStandardHit) {
    const form = this.state.form;
    const isNyarlaChaos = form === 'NYARLATHOTEP' && this.state.isChaos;
    const isNyarlaBeta = form === 'NYARLATHOTEP' && this.state.awakeningPath === 'BETA';

    const now = this.time.now;
    if (this.lastSlashTime && now - this.lastSlashTime < 600) {
      this.slashCombo = ((this.slashCombo || 0) % 3) + 1; // 1 -> 2 -> 3 -> 1 순환
    } else {
      this.slashCombo = 1;
    }
    this.lastSlashTime = now;

    const isWildSlash = this.slashCombo === 3; // ★ 3타째에 양방향 난도질 발동!
    const dir = this.slashCombo === 2 ? -1 : 1;

    const COLOR_MAP = {
      HASTUR: { fill: 0xfacc15, edge: 0x78350f },
      NYARLATHOTEP: { fill: 0xc084fc, edge: 0x4c1d95 },
      CTHULHU: { fill: 0x10b981, edge: 0x064e3b },
      CTHUGHA: { fill: 0xf97316, edge: 0x7c2d12 },
      'THE FAITHLESS': { fill: 0xef4444, edge: 0x111827 },
    };
    const { fill: color, edge: edgeColor } = COLOR_MAP[form] || { fill: 0xffffff, edge: 0x111827 };

    const slashGfx = this.add.graphics().setDepth(12);
    const halfArc = Phaser.Math.DegToRad(GAME_CONFIG.PLAYER.DAGGER_ARC_DEG / 2) * 1.15;
    const range = GAME_CONFIG.PLAYER.DAGGER_RANGE;
    const segments = 14;
    const maxThickness = range * 0.45;
    const hitEnemies = new Set();

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 160,
      ease: 'Linear',
      onUpdate: (tween) => {
        if (!slashGfx.active) return;
        const p = tween.getValue();
        const headT = Phaser.Math.Clamp(p * 3.5, 0, 1);
        const tailT = Phaser.Math.Clamp((p - 0.15) / 0.85, 0, 1);

        slashGfx.clear();
        if (headT - tailT <= 0.02) return;

        const currentThick = maxThickness * (1 - Math.pow(p, 1.3));
        const points = [];

        for (let i = 0; i <= segments; i++) {
          const localT = i / segments;
          const t = Phaser.Math.Linear(tailT, headT, localT);
          const sweepT = isWildSlash ? 1 - t : (dir === 1 ? t : 1 - t);
          const a = angle - halfArc + sweepT * (halfArc * 2);
          const r = range * (0.95 + Math.sin(t * Math.PI) * 0.1);
          points.push(new Phaser.Math.Vector2(this.player.x + Math.cos(a) * r, this.player.y + Math.sin(a) * r));
        }

        // 안쪽 곡선 (★ 3타일 때만 바깥쪽과 반대로 교차하며 양방향 난도질 연출!)
        for (let i = segments; i >= 0; i--) {
          const localT = i / segments;
          const t = Phaser.Math.Linear(tailT, headT, localT);
          const sweepT = isWildSlash ? t : (dir === 1 ? t : 1 - t);
          const a = angle - halfArc + sweepT * (halfArc * 2);
          const crescent = Math.sin(localT * Math.PI);
          const outerR = range * (0.95 + Math.sin(t * Math.PI) * 0.1);
          const r = Math.max(0, outerR - crescent * currentThick);
          points.push(new Phaser.Math.Vector2(this.player.x + Math.cos(a) * r, this.player.y + Math.sin(a) * r));
        }

        slashGfx.fillStyle(color, 1).fillPoints(points, true).lineStyle(2, edgeColor, 1).strokePoints(points, true);

        if (usesStandardHit && p <= 0.65) {
          [...this.enemies.getChildren()].forEach((enemy) => {
            if (!enemy.active || hitEnemies.has(enemy)) return;

            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            const diff = Math.abs(
              Phaser.Math.Angle.Wrap(Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y) - angle)
            );

            const chaosRangeBonus = isNyarlaBeta ? 48 : isNyarlaChaos ? 25 : 0;
            const enemyRadius = enemy.isBoss ? 28 : (enemy.displayWidth || 32) * 0.35;
            const effectiveRange = range + chaosRangeBonus + enemyRadius;
            const effectiveArc =
              halfArc + (isNyarlaBeta ? 0.55 : isNyarlaChaos ? 0.45 : enemy.isBoss ? 0.4 : 0.25);

            if (dist <= effectiveRange && diff <= effectiveArc) {
              hitEnemies.add(enemy);
              const isCounter = enemy.isWindingUp;
              const hitDir = form === 'HASTUR' ? null : angle;

              this.damageEnemy(enemy, GAME_CONFIG.PLAYER.DAGGER_DAMAGE, hitDir, isCounter);

              if (form === 'HASTUR' && enemy.active) {
                this.addShockStack(enemy, 1);
                if (this.state.isExAwakened) this.triggerHasturSlashChain(enemy);
              }

              if (form === 'NYARLATHOTEP' && enemy.active) {
                this.addChaosMark(enemy, isNyarlaBeta ? 3 : isNyarlaChaos ? 2 : 1);
                if (isCounter) this.triggerNyarlaBlink(enemy, false);
              }
            }
          });
        }
      },
      onComplete: () => slashGfx.destroy(),
    });
  }

  slashNodens(angle) {
    if (this.state.comboTimer) this.state.comboTimer.remove();
    this.state.comboStep = (this.state.comboStep || 0) + 1;
    let currentCooldown = 280;

    this.player.isLunging = true;
    this.player.setVelocity(Math.cos(angle) * 240, Math.sin(angle) * 240);
    this.time.delayedCall(80, () => {
      if (this.player) this.player.isLunging = false;
    });

    if (this.state.comboStep === 1) {
      currentCooldown = 280;
      const slashX = this.player.x + Math.cos(angle) * 50;
      const slashY = this.player.y + Math.sin(angle) * 50;
      const rift = this.add
        .rectangle(slashX, slashY, 120, 6, 0x38bdf8, 1)
        .setRotation(angle + Math.PI / 2)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(14);
      this.tweens.add({ targets: rift, scaleX: 1.5, alpha: 0, duration: 150, onComplete: () => rift.destroy() });
      this.applyAreaDamage(slashX, slashY, 75, angle, 45);
    } else if (this.state.comboStep === 2) {
      currentCooldown = 340;
      const thrustX = this.player.x + Math.cos(angle) * 80;
      const thrustY = this.player.y + Math.sin(angle) * 80;
      const thrust = this.add
        .rectangle(thrustX, thrustY, 160, 5, 0xe2e8f0, 1)
        .setRotation(angle)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(14);
      this.tweens.add({ targets: thrust, scaleX: 1.8, alpha: 0, duration: 180, onComplete: () => thrust.destroy() });
      this.applyAreaDamage(thrustX, thrustY, 65, angle, 65);
    } else if (this.state.comboStep === 3) {
      const isBeta = this.state.awakeningPath === 'BETA';
      currentCooldown = isBeta ? 360 : this.state.isExAwakened ? 560 : 680;
      if (!isBeta) this.state.comboStep = 0;

      this.player.x += Math.cos(angle) * 40;
      this.player.y += Math.sin(angle) * 40;
      this.cameras.main.shake(150, 0.012);

      const waveAngles = this.state.isExAwakened ? [angle - 0.28, angle, angle + 0.28] : [angle];
      waveAngles.forEach((wAngle, idx) => {
        const isCenter = idx === 1 || waveAngles.length === 1;
        const projectile = this.add
          .rectangle(this.player.x, this.player.y, isCenter ? 155 : 125, 12, isCenter ? 0x38bdf8 : 0x7dd3fc, 1)
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
        this.applyAreaDamage(
          this.player.x + Math.cos(wAngle) * 145,
          this.player.y + Math.sin(wAngle) * 145,
          140,
          wAngle,
          isCenter ? 110 : 55
        );
      });
    } else if (this.state.comboStep >= 4) {
      currentCooldown = 620;
      this.state.comboStep = 0;

      this.cameras.main.shake(220, 0.02);
      this.cameras.main.flash(120, 56, 189, 248);

      const startX = this.player.x;
      const startY = this.player.y;
      const targetX = startX + Math.cos(angle) * 340;
      const targetY = startY + Math.sin(angle) * 340;

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

      this.applyAreaDamage(startX + Math.cos(angle) * 70, startY + Math.sin(angle) * 70, 135, angle, 85);
      this.time.delayedCall(140, () => {
        if (!this.state.isGameOver) {
          this.applyAreaDamage(startX + Math.cos(angle) * 210, startY + Math.sin(angle) * 210, 155, angle, 105);
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
  }

  slashCthulhu(angle) {
    const now = this.time.now;
    const isBeta = this.state.awakeningPath === 'BETA';
    const cthulhuCd = isBeta ? 1150 : this.state.isExAwakened ? 1400 : 2000;
    const totalShots = Math.min(1 + Math.floor(this.state.kills / 25) + (this.state.isExAwakened ? 2 : 0), 5);

    if (!this.lastCthulhuSpitTime || now - this.lastCthulhuSpitTime >= cthulhuCd) {
      this.lastCthulhuSpitTime = now;
      for (let b = 0; b < totalShots; b++) {
        this.time.delayedCall(b * 90, () => {
          if (this.player && this.player.active) {
            const spread = (Math.random() - 0.5) * (0.15 + totalShots * 0.05);
            this.fireCthulhuTendril(angle + spread, b === 0);
          }
        });
      }
    }
  }

  slashFaithless(angle) {
    const isBeta = this.state.awakeningPath === 'BETA';
    const isGamma = this.state.awakeningPath === 'GAMMA';
    const isOmega = this.state.awakeningTier >= 3;

    const slashX = this.player.x + Math.cos(angle) * 48;
    const slashY = this.player.y + Math.sin(angle) * 48;

    const slash1 = this.add.ellipse(slashX, slashY, 105, 32, 0xb91c1c, 1).setRotation(angle).setDepth(14);
    this.tweens.add({ targets: slash1, scaleX: 1.45, scaleY: 2.3, alpha: 0, duration: 150, ease: 'Quad.easeOut', onComplete: () => slash1.destroy() });

    if (this.state.isExAwakened) {
      const slash2 = this.add
        .ellipse(slashX, slashY, 115, 26, 0xef4444, 0.9)
        .setRotation(angle + Math.PI / 2.2)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(15);
      this.tweens.add({ targets: slash2, scaleX: 1.6, scaleY: 2.5, alpha: 0, duration: 170, ease: 'Quad.easeOut', onComplete: () => slash2.destroy() });
    }

    if (isBeta && this.state.awakeningTier >= 2) {
      const bloodWave = this.add
        .ellipse(slashX, slashY, 130, 15, 0xdc2626, 0.9)
        .setRotation(angle + Math.PI / 2)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(14);
      this.tweens.add({
        targets: bloodWave,
        x: slashX + Math.cos(angle) * 280,
        y: slashY + Math.sin(angle) * 280,
        scaleX: 1.8,
        scaleY: 2.5,
        alpha: 0,
        duration: 350,
        ease: 'Cubic.easeOut',
        onComplete: () => bloodWave.destroy(),
      });
      this.applyAreaDamage(slashX + Math.cos(angle) * 140, slashY + Math.sin(angle) * 140, 125, angle, 42);
    }

    if (isOmega && !isBeta) {
      const bloodWave = this.add
        .ellipse(slashX, slashY, 150, 18, 0xef4444, 0.95)
        .setRotation(angle + Math.PI / 2)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(14);
      this.tweens.add({
        targets: bloodWave,
        x: slashX + Math.cos(angle) * 350,
        y: slashY + Math.sin(angle) * 350,
        scaleX: 2.2,
        scaleY: 3.0,
        alpha: 0,
        duration: 320,
        ease: 'Cubic.easeOut',
        onComplete: () => bloodWave.destroy(),
      });
      this.applyAreaDamage(slashX + Math.cos(angle) * 175, slashY + Math.sin(angle) * 175, 180, angle, 85);
    }

    const hitRange = isGamma ? 98 : this.state.isExAwakened ? 82 : 68;
    const baseDmg = isGamma ? 60 : this.state.isExAwakened ? 50 : 42;

    [...this.enemies.getChildren()].forEach((e) => {
      if (!e.active) return;
      if (Phaser.Math.Distance.Between(slashX, slashY, e.x, e.y) <= hitRange + (e.isBoss ? 24 : 0)) {
        this.damageEnemy(e, baseDmg, angle, e.isWindingUp);

        const healChance = isOmega ? 20 : isBeta ? 8 : isGamma ? 14 : 10;
        const healAmt = isOmega ? 4 : isBeta ? 3 : 2;
        if (Phaser.Math.Between(1, 100) <= healChance && this.state.hp < this.state.maxHp) {
          this.state.hp = Math.min(this.state.maxHp, this.state.hp + healAmt);
          this.updateHUD();
        }
        if (isOmega && this.triggerOmegaBloodCross) this.triggerOmegaBloodCross(e.x, e.y);
      }
    });
  }

  slashCthugha(angle) {
    const halfArc = Phaser.Math.DegToRad(GAME_CONFIG.PLAYER.DAGGER_ARC_DEG / 2) * 1.15;
    const cthughaRange = GAME_CONFIG.PLAYER.DAGGER_RANGE + 43;

    const flameWave = this.add
      .ellipse(this.player.x + Math.cos(angle) * 58, this.player.y + Math.sin(angle) * 58, 96, 28, 0xf97316, 0.75)
      .setRotation(angle)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(13);

    this.tweens.add({ targets: flameWave, scaleX: 1.35, scaleY: 1.8, alpha: 0, duration: 140, onComplete: () => flameWave.destroy() });

    [...this.enemies.getChildren()].forEach((e) => {
      if (!e.active) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
      const enemyAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);
      const diff = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - angle));

      if (dist <= cthughaRange + (e.isBoss ? 28 : 0) && diff <= halfArc + 0.28) {
        const wasBurning = e.isBurning;
        const ex = e.x;
        const ey = e.y;

        this.damageEnemy(e, GAME_CONFIG.PLAYER.DAGGER_DAMAGE, enemyAngle, e.isWindingUp);

        if (wasBurning) {
          this.triggerCthughaRing({ active: true, x: ex, y: ey });
          if (this.state.isExAwakened && Math.random() < 0.3) this.spawnCthughaFireZone(ex, ey);
        }
        if (e.active) this.applyBurn(e);
      }
    });
  }

  playNyarlaChaosClaw(angle) {
    const isNyarlaBeta = this.state.awakeningPath === 'BETA';
    const reachOffset = isNyarlaBeta ? 75 : 58;
    const mawX = this.player.x + Math.cos(angle) * reachOffset;
    const mawY = this.player.y + Math.sin(angle) * reachOffset;

    [-0.35, 0.35].forEach((slashAngle) => {
      const claw = this.add
        .ellipse(mawX, mawY, isNyarlaBeta ? 140 : 110, isNyarlaBeta ? 22 : 18, 0xc084fc, 0.9)
        .setRotation(angle + slashAngle)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(14);
      this.tweens.add({
        targets: claw,
        scaleX: isNyarlaBeta ? 1.6 : 1.4,
        scaleY: 0.2,
        alpha: 0,
        duration: 160,
        onComplete: () => claw.destroy(),
      });
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
    if (!enemy || !enemy.active || enemy.isInvulnerableBoss) return;


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
      } else if (enemy.isDeepOne && this.state.isAct2Escalated) {
        enemy.setTint(0xc084fc);
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
    if (hitAngle !== null && hitAngle !== undefined && !enemy.isBoss && !enemy.isDeepOne) {
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
    this.cameras.main.shake(100, 0.01);
    const cam = this.cameras.main;
    // 0x3a0000: 묵직한 검붉은색 (원하는 피 색깔 헥사코드로 변경 가능)
    const bloodFlash = this.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, 0xffffff);

    bloodFlash.setScrollFactor(0); // 플레이어가 이동해도 화면에 고정되도록 설정
    bloodFlash.setDepth(9999);     // 다른 모든 오브젝트 위에 덮기
    bloodFlash.alpha = 0.5;        // 핵심: 초기 투명도를 40%로 제한해서 암전 느낌 방지 (조절 가능)

    // 플래시가 서서히 사라지는 연출 (Tween)
    this.tweens.add({
      targets: bloodFlash,
      alpha: 0,
      duration: 120, // 0.12초 만에 스르륵 빠짐
      ease: 'Quad.easeOut',
      onComplete: () => bloodFlash.destroy() // 연출 끝나면 찌꺼기 없이 삭제
    });

    // 3. 역경직 해제
    this.time.delayedCall(80, () => {
      this.physics.world.isPaused = false;
    });



    if (this.state.form === 'HASTUR') {
      const counterRadius = 115;

      // 1) 거대한 황색의 인장 마법진 시각 연출
      const signGfx = this.add
        .graphics({ x, y })
        .setDepth(16)
        .setBlendMode(Phaser.BlendModes.ADD);

      signGfx.fillStyle(0xfacc15, 0.25);
      signGfx.fillCircle(0, 0, 24);
      signGfx.lineStyle(3, 0xfef08a, 1);
      signGfx.strokeCircle(0, 0, 24);
      signGfx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (i * (Math.PI * 2)) / 3 - Math.PI / 2;
        const px = Math.cos(a) * 22;
        const py = Math.sin(a) * 22;
        if (i === 0) signGfx.moveTo(px, py);
        else signGfx.lineTo(px, py);
      }
      signGfx.closePath().strokePath();

      this.tweens.add({
        targets: signGfx,
        scale: counterRadius / 24,
        rotation: Math.PI / 1.5,
        alpha: 0,
        duration: 320,
        ease: 'Cubic.easeOut',
        onComplete: () => signGfx.destroy(),
      });

      // 2) 역경직 해제 직후(85ms) 주변 적들에게 광역 카운터 뇌격(45 데미지) + 감전 1스택 부여!
      // (setTimeout/delayedCall을 통해 원래 카운터 대상과의 무한 재귀 호출 방지)
      this.time.delayedCall(85, () => {
        if (this.state.isGameOver) return;
        const nearEnemies = [...this.enemies.getChildren()];
        nearEnemies.forEach((e) => {
          if (!e || !e.active) return;
          const dist = Phaser.Math.Distance.Between(x, y, e.x, e.y);
          // 중심에 있던 원래 타겟(dist < 8)은 이미 본 카운터 데미지를 입었으므로 주변 적들만 타격
          if (dist >= 8 && dist <= counterRadius + (e.isBoss ? 24 : 0)) {
            this.damageEnemy(e, 45, null, false);
            if (e.active) this.addShockStack(e, 1);
          }
        });
      });
    }
  }

  killEnemy(enemy, wasCounter) {
    if (!enemy || !enemy.active || enemy.isDead) return;
    enemy.isDead = true;
    const ex = enemy.x;
    const ey = enemy.y;
    const isMidBoss = enemy.isDreamMidBoss;
    const isSniper = enemy.isBloodSniper;

    if (enemy.chaosTimer) enemy.chaosTimer.remove();
    if (enemy.burnTimer) enemy.burnTimer.remove();

    // 크투가-β 화상 사망 시 불타는 영혼 사출
    if (this.state.form === 'CTHUGHA' && this.state.awakeningPath === 'BETA' && enemy.isBurning) {
      this.spawnBurningSoul(ex, ey);
    }

    // ★ 누락되었던 바닥 혈흔 그리기 복구!
    const decalColor = this.state.isTaintedAct2 ? 0x1e1633 : 0x660000;
    this.bloodDecalGfx
      .fillStyle(decalColor, 0.45)
      .fillCircle(ex, ey, Phaser.Math.Between(8, 16));

    // 피구슬 드롭
    if (Math.random() < (this.state.orbDropRate ?? 0.7)) {
      const orbCount = wasCounter ? 2 : 1;
      for (let i = 0; i < orbCount; i++) {
        this.bloodOrbs
          .create(ex + Phaser.Math.Between(-12, 12), ey + Phaser.Math.Between(-12, 12), 'blood_orb')
          .setBlendMode(Phaser.BlendModes.ADD);
      }
    }

    // 보스전 중 잡몹 처치 시 킬 수 미증가
    if (this.boss && this.boss.active) {
      enemy.destroy();
      return;
    }

    // ★ 일반 문비스트만 1/3 확률로 2초 지연 잔상 발동 (중간 보스 제외)
    if (isSniper && !isMidBoss && Math.random() < 1 / 3) {
      this.triggerUndeadLastStand(ex, ey);
    }

    enemy.destroy();

    // ★ 니알라토텝 처치 순간이동은 destroy 전에 좌표 확보
    if (this.state.form === 'NYARLATHOTEP') {
      this.triggerNyarlaBlink({ x: ex, y: ey, active: false }, true);
    }

    if (isMidBoss) {
      this.onDreamMidBossDefeated();
    }

    this.state.kills++;
    this.updateHUD();

    if (this.ritualEvents[this.state.kills]) {
      this.ritualEvents[this.state.kills]();
    }

    this.time.delayedCall(50, () => this.checkWaveAcceleration());
  }

  triggerUndeadLastStand(x, y) {
    if (this.state.isGameOver) return;

    // 1. 시체 자리에서 보라색 잔영 생성 (기상 연출)
    const husk = this.add
      .sprite(x, y, 'blood_sniper')
      .setTint(0xc084fc) // ★ 몽환 보라
      .setAlpha(0.25)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(13);

    // 기상 중 맥동 (1.3초)
    const pulseTween = this.tweens.add({
      targets: husk,
      alpha: 0.85,
      scale: 1.15,
      duration: 260,
      yoyo: true,
      repeat: 2,
    });

    // 2. 1.3초 뒤: 플레이어 위치 조준 고정 + 붉은 레이저 0.7초간 표시
    this.time.delayedCall(1300, () => {
      if (this.state.isGameOver || !this.player || !this.player.active) {
        husk.destroy();
        return;
      }

      pulseTween.stop();
      husk.setAlpha(0.95).setScale(1.1);

      const lockAngle = Phaser.Math.Angle.Between(x, y, this.player.x, this.player.y);
      husk.setRotation(lockAngle);

      const warnLine = this.add
        .graphics()
        .setDepth(4)
        .lineStyle(2, 0x67e8f9, 0.9) // ★ 마젠타 레이저
        .lineBetween(x, y, x + Math.cos(lockAngle) * 520, y + Math.sin(lockAngle) * 520);

      // 3. 총 2.0초 시점(0.7초 뒤): 최후의 저격탄 발사 및 소멸
      this.time.delayedCall(700, () => {
        warnLine.destroy();
        if (this.state.isGameOver) {
          husk.destroy();
          return;
        }

        const bolt = this.projectiles
          .create(x, y, 'dream_bolt') // ★ 순백+시안 달빛탄 (초록색 변질 해결)
          .setDepth(9)
          .setScale(1.3);

        bolt.setVelocity(Math.cos(lockAngle) * 560, Math.sin(lockAngle) * 560);
        this.time.delayedCall(2500, () => {
          if (bolt && bolt.active) bolt.destroy();
        });

        this.tweens.add({
          targets: husk,
          alpha: 0,
          scale: 1.5,
          duration: 240,
          onComplete: () => husk.destroy(),
        });
      });
    });
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
        .setText('Three altars have risen upon the ritual circle, guiding your path.')
        .setColor('#facc15');
    }
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

      // ★ [니알라토텝-β] 각성 즉시 영구적인 혼돈 폭주(Permanent Chaos) 상태 돌입!
      if (this.state.form === 'NYARLATHOTEP') {
        this.enterChaosMode();
        this.chaosEndTime = Infinity;
      }

      this.state.maxHp += st.betaHp;
      this.state.hp = this.state.maxHp;
      this.state.dmgMult = st.betaMult;
      this.state.orbDropRate = 0.75; // 피구슬 스폰율 75%로 소폭 우대

      this.cameras.main.flash(600, 56, 189, 248);
      this.cameras.main.shake(450, 0.02);

      this.hudGuide
        .setText(
          `[Beta Awakening] Divine control increases! (DAMAGE x${st.betaMult})`
        )
        .setColor('#38bdf8');
    } else if (tierType === 'GAMMA') {
      // ★ 입장 시 이미 체력 패널티를 치렀으므로, 여기서는 체력을 깎지 않고 풀피 회복 + 화력 폭증만 부여
      this.state.hp = this.state.maxHp;
      this.state.dmgMult = st.gammaMult;
      this.state.orbDropRate = 0.35; // 피구슬 스폰율 35% 유지

      this.cameras.main.flash(750, 220, 38, 38);
      this.cameras.main.shake(700, 0.035);

      this.hudGuide
        .setText(
          `⚠️ [γ-Awakening: Tainted Madness] Ruinous power unleashed! (DAMAGE x${st.gammaMult})`
        )
        .setColor('#f43f5e');
    }

    if (this.state.form === 'THE FAITHLESS') {
      if (tierType === 'BETA') {
        this.hudGuide.setText(`[The Butcher] Blood-slashes rage! Harvest your foes like a vampire. (DAMAGE x${st.betaMult})`).setColor('#ef4444');
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
        '[Awakening: Hastur] The King in Yellow has arrived. (Grants lightning strikes and shock status)'
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

  // ★ [80킬 하스터-α 전용] 평타 적중 시 주변 적에게 뻗어나가는 연쇄 번개 + 소형 마법진 폭발!
  triggerHasturSlashChain(sourceEnemy) {
    if (!sourceEnemy || !sourceEnemy.active) return;

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
      .slice(0, 2);

    chainTargets.forEach((ct) => {
      const cx = ct.x;
      const cy = ct.y;

      const chainGfx = this.add
        .graphics()
        .setDepth(14)
        .setBlendMode(Phaser.BlendModes.ADD);
      chainGfx.lineStyle(2.5, 0xfef08a, 0.95);
      chainGfx.beginPath().moveTo(sx, sy);
      const midX = (sx + cx) / 2 + Phaser.Math.Between(-14, 14);
      const midY = (sy + cy) / 2 + Phaser.Math.Between(-14, 14);
      chainGfx.lineTo(midX, midY).lineTo(cx, cy).strokePath();

      this.tweens.add({
        targets: chainGfx,
        alpha: 0,
        duration: 160,
        onComplete: () => chainGfx.destroy(),
      });

      // ★ 단일 타격 대신 착탄 지점에 반경 52px 소형 황색 인장 범위 공격 발동!
      this.spawnMiniYellowSign(cx, cy, 52, 28);
    });
  }


  // ★ [하스터 전용 헬퍼] 연쇄 번개 착탄 지점에 소형 황색 인장 마법진 생성 & 광역 감전 타격
  spawnMiniYellowSign(x, y, radius, damage) {
    if (this.state.isGameOver) return;

    // 1. 소형 황색의 인장 (원 + 내부 삼각형) 그래픽 연출
    const miniSign = this.add
      .graphics({ x, y })
      .setDepth(13)
      .setBlendMode(Phaser.BlendModes.ADD);

    miniSign.lineStyle(2, 0xfacc15, 0.95);
    miniSign.strokeCircle(0, 0, 14);
    miniSign.lineStyle(1.5, 0xfef08a, 0.85);
    miniSign.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (i * (Math.PI * 2)) / 3 - Math.PI / 2;
      const px = Math.cos(a) * 12;
      const py = Math.sin(a) * 12;
      if (i === 0) miniSign.moveTo(px, py);
      else miniSign.lineTo(px, py);
    }
    miniSign.closePath().strokePath();

    this.tweens.add({
      targets: miniSign,
      scale: radius / 14,
      rotation: -Math.PI / 1.5,
      alpha: 0,
      duration: 240,
      ease: 'Cubic.easeOut',
      onComplete: () => miniSign.destroy(),
    });

    // 2. 마법진 범위(radius) 내 모든 적에게 광역 데미지 & 감전 1스택 부여 (넉백 없음)
    const enemies = [...this.enemies.getChildren()];
    enemies.forEach((e) => {
      if (!e || !e.active) return;
      const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
      if (d <= radius + (e.isBoss ? 22 : 0)) {
        this.damageEnemy(e, damage, null, false);
        if (e.active) this.addShockStack(e, 1);
      }
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
        '[Awakening: Nyarlathotep] One with the Crawling Chaos. (Rampage at 5 consecutive kills)'
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
        '[Awakening: Cthulhu] The sleeping master of R\'lyeh awakens. (Summons abyss orbs that multiply every 25 kills)'
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
        '[Awakening: Cthugha] The Living Flame awakens. (Applies burn debuffs)'
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
      if (!e || !e.active || e === centerEnemy) return;
      const d = Phaser.Math.Distance.Between(ex, ey, e.x, e.y);

      if (d <= ringRadius + (e.isBoss ? 24 : 0)) {
        // ★ 거리가 2px 미만(동일 좌표)이면 0도(오른쪽) 버그가 나므로 플레이어 기준 각도로 대체!
        const pushAngle = d > 2
          ? Phaser.Math.Angle.Between(ex, ey, e.x, e.y)
          : Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);

        this.damageEnemy(e, 42, pushAngle, false);
        if (e.active) this.applyBurn(e);
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

  // ★ [크투가 4 - 베타 전용] 화상 사망 시 사출되는 유도 화염 영혼 (타겟 증발 및 자기 타겟팅 버그 완벽 수정)
  spawnBurningSoul(startX, startY) {
    if (this.state.isGameOver) return;

    // 1. 불타는 영혼 비주얼 코어 생성
    const soul = this.add
      .circle(startX, startY, 8, 0xf97316, 1)
      .setStrokeStyle(3, 0xdc2626, 1)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(15);

    // 2. 살아있는 적 탐색 헬퍼 (★ 거리 5px 초과 조건으로 방금 죽은 자기 자신을 타겟팅하는 버그 원천 차단!)
    const findTarget = (cx, cy) => {
      const valid = this.enemies
        .getChildren()
        .filter((e) => {
          if (!e.active || e.hp <= 0) return false;
          const d = Phaser.Math.Distance.Between(cx, cy, e.x, e.y);
          return d > 5 && d <= 550; // 자기 자신(d=0) 제외, 사거리 550px로 넉넉하게 확장
        })
        .sort(
          (a, b) =>
            Phaser.Math.Distance.Between(cx, cy, a.x, a.y) -
            Phaser.Math.Distance.Between(cx, cy, b.x, b.y)
        );
      return valid.find((e) => e.isBurning) || valid[0] || null;
    };

    let target = findTarget(startX, startY);

    // 주변에 적이 아예 없으면 제자리에서 화염 폭발을 일으키며 소멸
    if (!target) {
      this.tweens.add({
        targets: soul,
        scale: 3.0,
        alpha: 0,
        duration: 250,
        onComplete: () => soul.destroy(),
      });
      return;
    }

    // 3. 실시간 유도 비행 타이머 (타겟이 이동하거나 도중에 죽어도 끝까지 재추적!)
    const speed = 17; // 20ms당 17px 이동 (초속 850px의 초고속 유도탄)
    let ticks = 0;

    const flyTimer = this.time.addEvent({
      delay: 20,
      loop: true,
      callback: () => {
        if (!soul.active || this.state.isGameOver) {
          flyTimer.remove();
          if (soul.active) soul.destroy();
          return;
        }
        if (this.physics.world.isPaused) return;

        ticks++;

        // ★ 날아가는 도중 타겟이 다른 폭발에 맞아 죽었다면 즉시 새로운 타겟 재탐색!
        if (!target || !target.active || target.hp <= 0) {
          target = findTarget(soul.x, soul.y);
          if (!target) {
            // 더 이상 맵에 살아있는 적이 없으면 현재 위치에 광역 폭발 후 종료
            flyTimer.remove();
            this.triggerCthughaRing({ active: true, x: soul.x, y: soul.y });
            soul.destroy();
            return;
          }
        }

        // 잔상 이펙트
        if (ticks % 2 === 0) {
          const afterimg = this.add
            .circle(soul.x, soul.y, 5, 0xdc2626, 0.7)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setDepth(14);
          this.tweens.add({
            targets: afterimg,
            scale: 0.2,
            alpha: 0,
            duration: 160,
            onComplete: () => afterimg.destroy(),
          });
        }

        // 타겟을 향해 전진
        const dist = Phaser.Math.Distance.Between(soul.x, soul.y, target.x, target.y);
        const moveAngle = Phaser.Math.Angle.Between(soul.x, soul.y, target.x, target.y);

        // ★ 명중 판정!
        if (dist <= speed + (target.isBoss ? 28 : 14) || ticks > 70) {
          flyTimer.remove();
          const tx = target.x;
          const ty = target.y;
          const wasBurning = target.isBurning;

          soul.destroy();

          // 직격 데미지(55) 및 화상 부여
          this.damageEnemy(target, 55, moveAngle, false);

          if (target.active) {
            this.applyBurn(target);
            if (wasBurning) this.triggerCthughaRing(target);
          } else if (wasBurning) {
            this.triggerCthughaRing({ active: true, x: tx, y: ty });
          }
        } else {
          soul.x += Math.cos(moveAngle) * speed;
          soul.y += Math.sin(moveAngle) * speed;
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


    this.playDagonCutscene();

    this.hudGuide
      .setText(
        '★ [Hidden Awakening: Dagon] Barrier of Non-Violence. Every click becomes a Deflect.'
      )
      .setColor('#0ea5e9');

    this.restoreFormTint();
    this.updateHUD();
  }

  playDagonCutscene() {
    const px = this.player.x;
    const py = this.player.y;
    this.state.isInvulnerable = true;
    this.physics.world.timeScale = 4.0;

    // 1. 심해 잠수 암전 오버레이
    const abyssVeil = this.add
      .rectangle(400, 300, 800, 600, 0x02131f, 0.8)
      .setScrollFactor(0)
      .setDepth(180)
      .setAlpha(0);

    this.tweens.add({
      targets: abyssVeil,
      alpha: 1,
      duration: 250,
      yoyo: true,
      hold: 550,
      onComplete: () => abyssVeil.destroy(),
    });

    // 2. 바깥에서 플레이어 중심으로 빨려 들어오는 3중 수압 링 (패링 에너지 응축)
    for (let i = 0; i < 3; i++) {
      this.time.delayedCall(i * 110, () => {
        const pressureRing = this.add
          .circle(px, py, 220, 0x0ea5e9, 0)
          .setStrokeStyle(4 - i, 0x38bdf8, 0.9)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(185);

        this.tweens.add({
          targets: pressureRing,
          scale: 0.1,
          alpha: 0,
          duration: 380,
          ease: 'Cubic.easeIn',
          onComplete: () => pressureRing.destroy(),
        });
      });
    }

    // 3. 0.55초 뒤 심해 해일 폭발 및 각성 완료
    this.time.delayedCall(550, () => {
      this.physics.world.timeScale = 1.0;
      this.state.isInvulnerable = false;
      this.cameras.main.flash(650, 14, 165, 233);
      this.cameras.main.shake(600, 0.03);

      // 이중 해일 링 방출
      [0x0ea5e9, 0x7dd3fc].forEach((col, idx) => {
        const tidalWave = this.add
          .circle(px, py, 20, col, 0.35)
          .setStrokeStyle(5 - idx * 2, 0xffffff, 0.9)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(190);

        this.tweens.add({
          targets: tidalWave,
          scale: 15 + idx * 4,
          alpha: 0,
          duration: 600 + idx * 120,
          ease: 'Cubic.easeOut',
          onComplete: () => tidalWave.destroy(),
        });
      });

      // 주변 적 강제 넉백 (기존 로직)
      this.enemies.getChildren().forEach((e) => {
        if (!e.active) return;
        const a = Phaser.Math.Angle.Between(px, py, e.x, e.y);
        e.setVelocity(Math.cos(a) * 550, Math.sin(a) * 550);
        e.isKnockedBack = true;
        this.time.delayedCall(250, () => { if (e.active) e.isKnockedBack = false; });
      });

      // 영문 선언 배너
      this.showAwakeningBanner('BARRIER OF THE ABYSS\n[ Dagon ]', '#38bdf8', '#082f49');
    });
  }

  // 5. 심연의 대공 - 노덴스 각성 (히든)
  awakenNodens() {
    this.state.ascended = true;
    this.state.form = 'NODENS';
    if (this.shrines) this.shrines.clear(true, true);

    // ★ 스탯 표준화: 최대 체력 +20 & 풀피 회복 추가
    this.state.maxHp += 20;
    this.state.hp = this.state.maxHp;

    this.state.canSlash = true;


    this.playNodensCutscene();
    this.hudGuide
      .setText(
        '★ [Elder God: Nodens] Hunter of the Abyss. Unlocks the triple-stage spatial slash combo.'
      )
      .setColor('#38bdf8');

    this.restoreFormTint();
    this.updateHUD();
  }

  playNodensCutscene() {
    const px = this.player.x;
    const py = this.player.y;
    this.state.isInvulnerable = true;
    this.physics.world.timeScale = 4.0;

    // 1. 차가운 심연 암전
    const voidVeil = this.add
      .rectangle(400, 300, 800, 600, 0x050a14, 0.88)
      .setScrollFactor(0)
      .setDepth(180)
      .setAlpha(0);

    this.tweens.add({
      targets: voidVeil,
      alpha: 1,
      duration: 200,
      yoyo: true,
      hold: 600,
      onComplete: () => voidVeil.destroy(),
    });

    // 2. 화면 전체를 가르는 고속 차원 참격 6연타 (UI 좌표계 기준)
    for (let i = 0; i < 6; i++) {
      this.time.delayedCall(i * 65, () => {
        const angle = Phaser.Math.FloatBetween(-Math.PI, Math.PI);
        const sx = Phaser.Math.Between(180, 620);
        const sy = Phaser.Math.Between(140, 460);

        const slashLine = this.add
          .rectangle(sx, sy, 900, 4, i % 2 === 0 ? 0x38bdf8 : 0xffffff, 1)
          .setRotation(angle)
          .setScrollFactor(0)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(186)
          .setScale(0, 1);

        this.tweens.add({
          targets: slashLine,
          scaleX: 1,
          scaleY: 0.1,
          alpha: 0,
          duration: 320,
          ease: 'Cubic.easeOut',
          onComplete: () => slashLine.destroy(),
        });
      });
    }

    // 3. 0.55초 뒤 플레이어 중심 거대 십자(+) 차원 폭발
    this.time.delayedCall(550, () => {
      this.physics.world.timeScale = 1.0;
      this.state.isInvulnerable = false;
      this.cameras.main.flash(700, 224, 242, 254);
      this.cameras.main.shake(650, 0.035);

      // 십자(+) 안광 폭발 연출
      [0, Math.PI / 2].forEach((rot) => {
        const cross = this.add
          .rectangle(px, py, 520, 14, 0xe0f2fe, 0.95)
          .setRotation(rot)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(190);

        this.tweens.add({
          targets: cross,
          scaleX: 1.5,
          scaleY: 0,
          alpha: 0,
          duration: 450,
          ease: 'Cubic.easeOut',
          onComplete: () => cross.destroy(),
        });
      });

      // 주변 적 넉백
      this.enemies.getChildren().forEach((e) => {
        if (!e.active) return;
        const a = Phaser.Math.Angle.Between(px, py, e.x, e.y);
        e.setVelocity(Math.cos(a) * 550, Math.sin(a) * 550);
        e.isKnockedBack = true;
        this.time.delayedCall(250, () => { if (e.active) e.isKnockedBack = false; });
      });

      this.showAwakeningBanner('HUNTER OF THE ABYSS\n[ Nodens ]', '#e0f2fe', '#0f172a');
    });
  }

  // 6. 광전사 - 무신앙자 각성 (히든 40킬)
  awakenFaithless() {
    this.state.ascended = true;
    this.state.form = 'THE FAITHLESS';
    if (this.shrines) this.shrines.clear(true, true);

    // ★ 스탯 표준화: 고난도 생존 보상으로 최대 체력 +20 & 풀피 회복
    this.state.maxHp += 20;
    this.state.hp = this.state.maxHp;

    this.redEyeEmitter.emitting = true;
    this.state.canSlash = true;

    this.playFaithlessCutscene();

    this.hudGuide
      .setText(
        '★ [The Faithless Awakening] Pure carnage. Your blade turns crimson, and dashing rips enemies apart.'
      )
      .setColor('#f87171');

    this.restoreFormTint();
    this.updateHUD();
  }

  playFaithlessCutscene() {
    const px = this.player.x;
    const py = this.player.y;
    this.state.isInvulnerable = true;
    this.physics.world.timeScale = 4.0;

    // 1. 검붉은 살기(Bloodlust) 암전 오버레이
    const bloodVeil = this.add
      .rectangle(400, 300, 800, 600, 0x1a0004, 0.85)
      .setScrollFactor(0)
      .setDepth(180)
      .setAlpha(0);

    this.tweens.add({
      targets: bloodVeil,
      alpha: 1,
      duration: 200,
      yoyo: true,
      hold: 550,
      onComplete: () => bloodVeil.destroy(),
    });

    // 2. 화면을 거칠게 찢어발기는 핏빛 난도질 (5연속)
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 80, () => {
        const rx = Phaser.Math.Between(220, 580);
        const ry = Phaser.Math.Between(180, 420);
        const rot = Phaser.Math.FloatBetween(-Math.PI, Math.PI);

        // 두꺼운 검붉은 외곽 + 날카로운 선혈 코어
        const gash = this.add
          .ellipse(rx, ry, 420, 26, 0x991b1b, 0.95)
          .setStrokeStyle(3, 0xff003c, 1)
          .setRotation(rot)
          .setScrollFactor(0)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(186)
          .setScale(0.1, 1);

        this.cameras.main.shake(70, 0.01);

        this.tweens.add({
          targets: gash,
          scaleX: 1.4,
          scaleY: 0.15,
          alpha: 0,
          duration: 260,
          ease: 'Cubic.easeOut',
          onComplete: () => gash.destroy(),
        });
      });
    }

    // 3. 0.55초 뒤 플레이어 중심 거대 X자 혈폭 + 안광 점화
    this.time.delayedCall(550, () => {
      this.physics.world.timeScale = 1.0;
      this.state.isInvulnerable = false;
      this.cameras.main.flash(650, 185, 28, 28);
      this.cameras.main.shake(700, 0.04);

      // 대량 혈흔 파티클 폭발
      if (this.bloodEmitter) {
        this.bloodEmitter.explode(110, px, py);
      }

      // 플레이어 중심 거대 X자(45도, -45도) 핏빛 참격
      [Math.PI / 4, -Math.PI / 4].forEach((rot) => {
        const xSlash = this.add
          .ellipse(px, py, 360, 28, 0xef4444, 0.95)
          .setRotation(rot)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(190);

        this.tweens.add({
          targets: xSlash,
          scaleX: 1.6,
          scaleY: 0.1,
          alpha: 0,
          duration: 420,
          ease: 'Cubic.easeOut',
          onComplete: () => xSlash.destroy(),
        });
      });

      // 핏빛 충격파 링
      const bloodNova = this.add
        .circle(px, py, 24, 0x991b1b, 0.45)
        .setStrokeStyle(5, 0xef4444, 1)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(189);

      this.tweens.add({
        targets: bloodNova,
        scale: 14,
        alpha: 0,
        duration: 550,
        ease: 'Cubic.easeOut',
        onComplete: () => bloodNova.destroy(),
      });

      // 주변 적 강제 넉백
      this.enemies.getChildren().forEach((e) => {
        if (!e.active) return;
        const a = Phaser.Math.Angle.Between(px, py, e.x, e.y);
        e.setVelocity(Math.cos(a) * 580, Math.sin(a) * 580);
        e.isKnockedBack = true;
        this.time.delayedCall(250, () => { if (e.active) e.isKnockedBack = false; });
      });

      // 영문 선언 배너
      this.showAwakeningBanner('PURE CARNAGE\n[ The Faithless ]', '#ef4444', '#1a0004');
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
        '“Neither gods nor madness are needed.”\n[ TRUE ORIGINAL : The Indomitable Mortal ]',
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
        '★ [HARDCORE TRUE ROUTE] All mutations rejected. Survive with only your dagger and parry.'
      )
      .setColor('#e2e8f0');

    this.updateHUD();
  }

  showAwakeningBanner(text, color, strokeColor) {
    const banner = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY - 70, text, {
        fontFamily: 'Georgia, serif',
        fontSize: '26px',
        color: color,
        align: 'center',
        fontStyle: 'bold',
        stroke: strokeColor,
        strokeThickness: 6,
      })
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

  // ★ [50킬 이벤트] 1차 증원 (부드럽고 묵직한 easeInOut 점멸 적용)
  triggerWaveEscalation() {
    this.state.isAct1Escalated = true;

    // 1. 즉발성 flash를 빼고 묵직한 진동만 유지해 눈부심 방지
    this.cameras.main.shake(800, 0.018);

    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    // 2. 화면 테두리 프레임 (alpha 0에서 시작해 부드럽게 호흡하듯 점멸)
    const warningOverlay = this.add
      .rectangle(cx, cy, 800, 600, 0x660000, 0)
      .setStrokeStyle(18, 0xdc2626, 1)
      .setScrollFactor(0)
      .setDepth(195)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0);

    this.tweens.add({
      targets: warningOverlay,
      alpha: 0.45,
      duration: 550, // 호흡을 살짝 늘려 easeInOut 곡선이 잘 느껴지도록 조정
      yoyo: true,
      repeat: 2, // 3회 부드럽게 명멸 후 자연스럽게 alpha 0으로 소멸
      ease: 'Cubic.easeInOut',
      onComplete: () => warningOverlay.destroy(),
    });

    // 3. 화면 중앙 영문 경고 배너 (등장 및 소멸 모두 easeInOut으로 통일)
    const warnBanner = this.add
      .text(
        cx,
        cy - 55,
        '⚠️ INQUISITION REINFORCEMENTS ⚠️\n[ THE CRUSADE INTENSIFIES ]',
        {
          fontFamily: 'Georgia, serif',
          fontSize: '28px',
          color: '#ef4444',
          align: 'center',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 6,
          shadow: {
            offsetX: 0,
            offsetY: 0,
            color: '#991b1b',
            blur: 16,
            fill: true,
          },
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200)
      .setAlpha(0)
      .setScale(0.92);

    this.tweens.add({
      targets: warnBanner,
      alpha: 1,
      scale: 1.0,
      duration: 450,
      ease: 'Cubic.easeInOut',
      onComplete: () => {
        this.tweens.add({
          targets: warnBanner,
          y: warnBanner.y - 25,
          alpha: 0,
          delay: 1400,
          duration: 650,
          ease: 'Cubic.easeInOut',
          onComplete: () => warnBanner.destroy(),
        });
      },
    });

    // 4. 스폰 주기 단축 및 현재 필드 적 이속 1.35배 가속
    this.initAct1Loop(850, 2400);

    this.enemies.getChildren().forEach((e) => {
      if (!e.active || e.isBoss || e.isDeepOne || e.isVoidCaller) return;
      if (e.isRanged) e.baseSpeed = GAME_CONFIG.RANGED_ENEMY.SPEED * 1.35;
      else e.baseSpeed = GAME_CONFIG.ENEMY.SPEED * 1.35;
    });

    for (let i = 0; i < 3; i++) this.spawnCrusader();

    this.hudGuide
      .setText('⚠️ [Inquisition Reinforcements] Enemy movement speed and spawn rate increased!')
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
      .setText('🟣 [Void Erosion] The abyss turns purple. Enemies berserk!')
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
        '[α: Hastur] The golden whip discharges chain lightning across nearby foes!',
      CTHULHU:
        '[α: Cthulhu] Abyssal tendrils increase to 5 rapid strikes, and cooldown is reduced!',
      CTHUGHA:
        '[α: Cthugha]Every slash manifests searing fire zones to scorch enemies!',
      DAGON:
        '[α: Dagon] Parry tidal waves echo twice, and deflected bolts split into 3 shards!',
      NYARLATHOTEP:
        '[α: Nyarlathotep] Teleporting triggers a void blast, driving you into a rampage every 4 kills!',
      NODENS: '[α: Nodens] The triple-stage spatial slash expands into a triple-wave dimensional storm!',
      'THE FAITHLESS':
        '[The Murder] Bloodlust takes form. Slashes cross in an X-shape to slaughter all before you!',
      'MORTAL CULTIST':
        '[α: Apex Mortal] Dagger attack speed and critical power break their mortal limits!',
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

    [...this.enemies.getChildren()].forEach((enemy) => {
      if (!enemy || !enemy.active) return;
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
    const tier = this.state.awakeningTier || 0; // 0: 기본, 1: 알파, 2: 베타

    // ========================================================================
    // 1. 다곤 (DAGON) : 심해 어인 꼬리
    // ========================================================================
    if (form === 'DAGON') {
      const baseAngle = this.player.rotation + Math.PI;
      const segs = 6 + tier;
      const points = [{ x: this.player.x, y: this.player.y, width: 14 }];

      for (let i = 1; i <= segs; i++) {
        const dist = i * 11;
        const sway = Math.sin(time * 0.007 - i * 0.5) * (i * 3.5);
        const px = this.player.x + Math.cos(baseAngle) * dist + Math.cos(baseAngle + Math.PI / 2) * sway;
        const py = this.player.y + Math.sin(baseAngle) * dist + Math.sin(baseAngle + Math.PI / 2) * sway;
        points.push({ x: px, y: py, width: Math.max(14 - i * 1.8, 3) });
      }

      points.forEach((p, idx) => {
        this.tentacleGfx.fillStyle(tier >= 2 ? 0x38bdf8 : 0x0ea5e9, 0.9 - idx * 0.1);
        this.tentacleGfx.fillCircle(p.x, p.y, p.width);
      });
      return;
    }

    // ========================================================================
    // 2. 크투가 (CTHUGHA) : 검붉은 심연의 열기 아지랑이
    // ========================================================================
    if (form === 'CTHUGHA') {
      const rings = 1 + tier;
      const cthughaColors = [0xf97316, 0xdc2626, 0x7f1d1d];

      for (let r = 0; r < rings; r++) {
        const radius = 17 + r * 5.5;
        const color = cthughaColors[r] || 0x7f1d1d;
        this.tentacleGfx.lineStyle(2.5 - r * 0.4, color, 0.85 - r * 0.22);
        this.tentacleGfx.beginPath();

        for (let i = 0; i <= 24; i++) {
          const a = (i * Math.PI * 2) / 24;
          const wave = Math.sin(time * 0.015 + i * 3 + r * 2) * (2.2 + tier * 1.1);
          const wx = this.player.x + Math.cos(a) * (radius + wave);
          const wy = this.player.y + Math.sin(a) * (radius + wave);
          if (i === 0) this.tentacleGfx.moveTo(wx, wy);
          else this.tentacleGfx.lineTo(wx, wy);
        }
        this.tentacleGfx.closePath().strokePath();
      }
      return;
    }

    // ========================================================================
    // 3. 노덴스 & 무신앙자 (NODENS & THE FAITHLESS) : 회전하는 검기/혈기
    // ========================================================================
    if (form === 'NODENS' || form === 'THE FAITHLESS') {
      if (tier === 0) return;
      const isNodens = form === 'NODENS';
      const bladeCount = tier * 2;
      this.tentacleGfx.lineStyle(2, isNodens ? 0x38bdf8 : 0xef4444, 0.8);

      for (let i = 0; i < bladeCount; i++) {
        const orbitAngle = time * (isNodens ? 0.005 : -0.008) + (i * Math.PI * 2) / bladeCount;
        const r = 22 + Math.sin(time * 0.01 + i) * 3;
        this.tentacleGfx.beginPath();
        this.tentacleGfx.arc(this.player.x, this.player.y, r, orbitAngle, orbitAngle + 0.8);
        this.tentacleGfx.strokePath();
      }
      return;
    }

    // ========================================================================
    // 4. 니알라토텝 (NYARLATHOTEP) : 서로 교차하며 유영하는 이중 그림자 칼날 꼬리
    // ========================================================================
    if (form === 'NYARLATHOTEP') {
      const isChaos = this.state.isChaos;
      const backAngle = this.player.rotation + Math.PI;
      const segs = 18;
      const maxLen = 46 + tier * 8;
      const speed = isChaos ? 0.01 : 0.005;

      const fillColor = isChaos ? 0x3b0764 : 0x4c1d95;
      const strokeColor = isChaos ? 0xd8b4f8 : 0xa855f7;
      const baseAlpha = isChaos ? 0.5 : 0.32;

      // ★ 2개의 리본이 위상차(Math.PI)를 두고 DNA 나선처럼 서로 교차!
      for (let strand = 0; strand < 2; strand++) {
        const phaseOffset = strand * Math.PI; // 180도 반대 위상으로 교차
        const leftPts = [];
        const rightPts = [];
        const spinePts = [];

        for (let i = 0; i <= segs; i++) {
          const t = i / segs;
          const dist = 10 + t * maxLen;

          // 두 가닥이 반대 방향으로 파동치며 등 뒤에서 X자로 계속 교차함
          const waveAngle = backAngle + Math.sin(time * speed - t * 4.5 + phaseOffset) * (0.42 + t * 0.35);

          const cx = this.player.x + Math.cos(waveAngle) * dist;
          const cy = this.player.y + Math.sin(waveAngle) * dist;
          spinePts.push({ x: cx, y: cy });

          const halfWidth = (1 - t) * (4.0 + tier * 0.7) * Math.sin(t * Math.PI * 0.85 + 0.3);
          const perpAngle = waveAngle + Math.PI / 2;

          leftPts.push(new Phaser.Math.Vector2(
            cx + Math.cos(perpAngle) * halfWidth,
            cy + Math.sin(perpAngle) * halfWidth
          ));
          rightPts.unshift(new Phaser.Math.Vector2(
            cx - Math.cos(perpAngle) * halfWidth,
            cy - Math.sin(perpAngle) * halfWidth
          ));
        }

        const polyPoints = leftPts.concat(rightPts);

        this.tentacleGfx.fillStyle(fillColor, baseAlpha);
        this.tentacleGfx.fillPoints(polyPoints, true);

        this.tentacleGfx.lineStyle(1.5, strokeColor, baseAlpha + 0.25);
        this.tentacleGfx.strokePoints(polyPoints, true);

        this.tentacleGfx.lineStyle(1, 0xe879f9, baseAlpha + 0.15);
        this.tentacleGfx.beginPath();
        spinePts.forEach((pt, idx) => {
          if (idx === 0) this.tentacleGfx.moveTo(pt.x, pt.y);
          else this.tentacleGfx.lineTo(pt.x, pt.y);
        });
        this.tentacleGfx.strokePath();
      }

      // 알파/베타 진화 시 측면 초승달 환영 날개
      if (tier >= 1) {
        [-1, 1].forEach((dir) => {
          const wingAngle = backAngle + dir * (0.85 + Math.sin(time * 0.006) * 0.15);
          const wx = this.player.x + Math.cos(wingAngle) * 22;
          const wy = this.player.y + Math.sin(wingAngle) * 22;

          this.tentacleGfx.lineStyle(2, strokeColor, baseAlpha + 0.1);
          this.tentacleGfx.beginPath();
          this.tentacleGfx.arc(wx, wy, 10 + tier * 3, wingAngle - 0.9, wingAngle + 0.9);
          this.tentacleGfx.strokePath();
        });
      }

      return;
    }

    // ========================================================================
    // 5. 하스터 (HASTUR) : 고정 5촉수 + 생멸을 반복하는 황색 인장 마법진
    // ========================================================================
    if (form === 'HASTUR') {
      // (A) 진화 시 플레이어 위치에서 생겼다가 사라지기를 반복하는 마법진 오라
      if (tier >= 1) {
        // 1.8초 주기로 0 -> 1로 팽창하며 서서히 나타났다 사라짐
        const cycle = (time % 1800) / 1800;
        const auraAlpha = Math.sin(cycle * Math.PI) * (tier >= 2 ? 0.65 : 0.45);
        const auraRadius = 18 + cycle * (tier >= 2 ? 26 : 18);
        const rot = time * 0.002;

        this.tentacleGfx.lineStyle(2, 0xfacc15, auraAlpha);
        this.tentacleGfx.strokeCircle(this.player.x, this.player.y, auraRadius);

        // 마법진 내부의 회전하는 황색 삼각 인장 (Yellow Sign)
        this.tentacleGfx.lineStyle(1.5, 0xfef08a, auraAlpha * 0.9);
        this.tentacleGfx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = rot + (i * Math.PI * 2) / 3;
          const vx = this.player.x + Math.cos(a) * auraRadius;
          const vy = this.player.y + Math.sin(a) * auraRadius;
          if (i === 0) this.tentacleGfx.moveTo(vx, vy);
          else this.tentacleGfx.lineTo(vx, vy);
        }
        this.tentacleGfx.closePath().strokePath();

        // 베타(Tier 2) 진화 시 역회전하는 두 번째 외곽 결계 링 추가!
        if (tier >= 2) {
          const cycle2 = ((time + 900) % 1800) / 1800; // 첫 번째 링과 엇박자 호흡
          const alpha2 = Math.sin(cycle2 * Math.PI) * 0.5;
          const rad2 = 22 + cycle2 * 28;
          this.tentacleGfx.lineStyle(1.5, 0xfde047, alpha2);
          this.tentacleGfx.strokeCircle(this.player.x, this.player.y, rad2);
        }
      }

      // (B) 하스터 촉수는 원래 길이(4마디, 간격 11)와 원래 개수(5개)로 깔끔하게 고정!
      const count = 5;
      this.tentacleGfx.lineStyle(3, 0xfacc15, 0.85);
      for (let i = 0; i < count; i++) {
        const baseAngle = this.player.rotation + Math.PI + (i - (count - 1) / 2) * 0.45;
        this.tentacleGfx.beginPath().moveTo(this.player.x, this.player.y);
        for (let s = 1; s <= 4; s++) {
          const w = Math.sin(time * 0.012 + i * 2 + s) * (s * 4.5);
          this.tentacleGfx.lineTo(
            this.player.x + Math.cos(baseAngle) * (s * 11) + Math.cos(baseAngle + 1.57) * w,
            this.player.y + Math.sin(baseAngle) * (s * 11) + Math.sin(baseAngle + 1.57) * w
          );
        }
        this.tentacleGfx.strokePath();
      }
      return;
    }

    // ========================================================================
    // 6. 크툴루 (CTHULHU) : 길이 고정 + 현재 발사되는 탄환 수만큼 촉수 개수 증가!
    // ========================================================================
    if (form === 'CTHULHU') {
      // 평타 탄환 수 공식과 100% 동일하게 동기화 (기본 1발 + 25킬당 1발 + 알파 각성 시 2발, 최대 5발)
      const bonusShots = Math.floor(this.state.kills / 25);
      const currentBullets = Math.min(1 + bonusShots + (this.state.isExAwakened ? 2 : 0), 5);

      // 기본 촉수 3가닥 + 현재 탄환 수(1~5) = 총 4가닥에서 시작해 탄환이 늘어날 때마다 최대 8가닥까지 증가!
      // (만약 정확히 탄환 개수와 1:1로 맞추고 싶다면 아래 식을 const count = currentBullets; 로 바꾸셔도 됩니다!)
      const count = 3 + currentBullets;
      const spread = count > 6 ? 0.36 : 0.45; // 가닥이 많아지면 부채꼴 간격을 살짝 좁혀 밀도 유지

      this.tentacleGfx.lineStyle(4, 0x10b981, 0.85);
      for (let i = 0; i < count; i++) {
        const baseAngle = this.player.rotation + Math.PI + (i - (count - 1) / 2) * spread;
        this.tentacleGfx.beginPath().moveTo(this.player.x, this.player.y);
        // ★ 길이는 늘리지 않고 원래의 4마디(s <= 4, 간격 13)로 고정!
        for (let s = 1; s <= 4; s++) {
          const w = Math.sin(time * 0.012 + i * 2 + s) * (s * 5.5);
          this.tentacleGfx.lineTo(
            this.player.x + Math.cos(baseAngle) * (s * 13) + Math.cos(baseAngle + 1.57) * w,
            this.player.y + Math.sin(baseAngle) * (s * 13) + Math.sin(baseAngle + 1.57) * w
          );
        }
        this.tentacleGfx.strokePath();
      }
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

    // 3. 실시간 유도(베타 전용) 및 사인파(Sine) 촉수 무빙 타이머
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

        // 가장 가까운 적 탐색 (명중 판정 및 베타 유도용)
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

        // ★ 베타(-β) 진화 시에만 적을 향해 회전(유도)
        if (isBeta && nearestEnemy) {
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

        // 평상시엔 조준 방향으로 사인파를 그리며 꿈틀대며 전진
        const wiggle = Math.sin(tick * 0.45) * (isBeta ? 0.22 : 0.32);
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
        '★ [Chaos Rampage] Attack speed and range massively increased! Every slash inflicts 2 Chaos marks.'
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

        // 4. [80킬 알파 특성] 연쇄 번개 전이 + 착탄 지점 소형 마법진 광역 폭발!
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
            const cx = ct.x;
            const cy = ct.y;

            const chainGfx = this.add
              .graphics()
              .setDepth(14)
              .setBlendMode(Phaser.BlendModes.ADD);
            chainGfx.lineStyle(3, 0xfef08a, 0.9);
            chainGfx.beginPath().moveTo(tx, ty);
            const midX = (tx + cx) / 2 + Phaser.Math.Between(-15, 15);
            const midY = (ty + cy) / 2 + Phaser.Math.Between(-15, 15);
            chainGfx.lineTo(midX, midY).lineTo(cx, cy).strokePath();

            this.tweens.add({
              targets: chainGfx,
              alpha: 0,
              duration: 180,
              onComplete: () => chainGfx.destroy(),
            });

            // ★ 단일 타격 대신 착탄 지점에 반경 55px 소형 황색 인장 범위 폭발!
            this.spawnMiniYellowSign(cx, cy, 55, 38);
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
    e.baseSpeed = this.state.isAct1Escalated ? GAME_CONFIG.ENEMY.SPEED * 1.35 : GAME_CONFIG.ENEMY.SPEED;
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
    enemy.baseSpeed = this.state.isAct1Escalated ? GAME_CONFIG.RANGED_ENEMY.SPEED * 1.35 : GAME_CONFIG.RANGED_ENEMY.SPEED;
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

    const isEsc = this.state.isAct2Escalated;

    // ★ 중복 할당 정리 및 체력 상향 (기존 60/90 -> 95/140)
    deepOne.hp = isEsc ? 140 : 95;
    deepOne.baseSpeed = isEsc ? 195 : 160;
    deepOne.isDeepOne = true;
    deepOne.isKnockbackImmune = true; // ★ 넉백 면역 플래그
    deepOne.tick = Phaser.Math.Between(0, 100);

    if (isEsc) deepOne.setTint(0xc084fc);
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

  spawnAshenHound() {
    if (this.state.isGameOver || this.physics.world.isPaused) return;
    const edge = Phaser.Math.Between(0, 3);
    const sx = edge === 1 ? 1360 : edge === 3 ? 40 : Phaser.Math.Between(40, 1360);
    const sy = edge === 0 ? 40 : edge === 2 ? 1360 : Phaser.Math.Between(40, 1360);

    const hound = this.enemies
      .create(sx, sy, 'ashen_hound')
      .setDepth(8)
      .setCollideWorldBounds(true);
    hound.body.setCircle(13, 5, 5);

    const isEsc = this.state.isAct2Escalated;
    hound.hp = isEsc ? 120 : 85;
    hound.baseSpeed = isEsc ? 215 : 180; // 딥 원보다 빠른 직선 추격
    hound.isAshenHound = true;
    hound.isTaintedEnemy = true;
  }

  spawnBloodSniper() {
    if (this.state.isGameOver || this.physics.world.isPaused) return;
    const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const sx = Phaser.Math.Clamp(this.player.x + Math.cos(a) * 520, 50, 1350);
    const sy = Phaser.Math.Clamp(this.player.y + Math.sin(a) * 520, 50, 1350);

    const sniper = this.enemies
      .create(sx, sy, 'blood_sniper')
      .setDepth(8)
      .setCollideWorldBounds(true);
    sniper.body.setCircle(13, 5, 5);

    const isEsc = this.state.isAct2Escalated;
    sniper.hp = isEsc ? 130 : 95;
    sniper.baseSpeed = isEsc ? 75 : 55;
    sniper.isBloodSniper = true;
    sniper.isRanged = true;
    sniper.isTaintedEnemy = true;
  }

  fireBloodSniper(e) {
    e.isWindingUp = true;
    e.setVelocity(0, 0);

    const lockAngle = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
    e.setRotation(lockAngle);
    e.setTint(0xff003c);

    // 조준 레이저 (0.7초간 유지 후 발사 직전 번쩍임)
    const laser = this.add
      .graphics()
      .setDepth(4)
      .lineStyle(2, 0x67e8f9, 0.9)
      .lineBetween(
        e.x,
        e.y,
        e.x + Math.cos(lockAngle) * 520,
        e.y + Math.sin(lockAngle) * 520
      );

    this.time.delayedCall(700, () => {
      laser.destroy();
      // ★ 카운터로 캔슬되길 원하면 (!e.active || !e.isWindingUp) 유지
      if (!e || !e.active || !e.isWindingUp) return;

      e.isWindingUp = false;
      e.clearTint();

      // 실제 고속 저격탄 발사
      const bolt = this.projectiles
        .create(e.x, e.y, 'dream_bolt') // ★ 순백+시안 달빛탄 (초록색 변질 해결)
        .setDepth(9)
        .setScale(1.3);

      bolt.setVelocity(Math.cos(lockAngle) * 540, Math.sin(lockAngle) * 540);
      this.time.delayedCall(2500, () => {
        if (bolt && bolt.active) bolt.destroy();
      });

      // 발사 후 1.6초 쿨타임
      e.isAttacking = true;
      this.time.delayedCall(1600, () => {
        if (e && e.active) e.isAttacking = false;
      });
    });
  }

  spawnDreamMidBoss() {
    if (this.state.isGameOver) return;

    // 1. 등장 연출
    this.cameras.main.flash(500, 254, 240, 138);
    this.cameras.main.shake(450, 0.02);
    this.hudGuide
      .setText('🌙 [MID-BOSS] Warden of Kadath descends! Defeat it to claim Gamma Awakening.')
      .setColor('#fef08a');

    // 2. 중간 보스 생성 (맵 중앙 기준 플레이어 반대편 또는 상단)
    const bx = 700;
    const by = this.player.y > 700 ? 320 : 1080;

    const midBoss = this.enemies
      .create(bx, by, 'blood_sniper')
      .setScale(2.2)
      .setTint(0xfef08a)
      .setDepth(10)
      .setCollideWorldBounds(true);

    midBoss.body.setCircle(14, 4, 4);
    midBoss.hp = 650; // 감마 진화 전 화력 기준 적정 체력 (테스트 후 조정)
    midBoss.baseSpeed = 85;
    midBoss.isRanged = true;
    midBoss.isBloodSniper = true; // 기존 저격 AI 재활용
    midBoss.isDreamMidBoss = true; // ★ 처치 판별용 플래그
  }

  onDreamMidBossDefeated() {
    // 1. 즉시 감마 진화 발동
    this.triggerTier2Evolution('GAMMA');

    // 2. 200킬까지 드림랜드 적 강화 (스폰 속도 & 스탯 상향)
    this.state.isAct2Escalated = true;
    if (this.deepOneTimer) this.deepOneTimer.delay = 650;    // 나이트건트 스폰 가속
    if (this.voidCallerTimer) this.voidCallerTimer.delay = 2000; // 문비스트 스폰 가속

    this.hudGuide
      .setText('⚡ [GAMMA AWAKENED] The Dreamlands tremble! Enemies grow fiercer until 200 kills.')
      .setColor('#f43f5e');
  }

  checkWaveAcceleration() {
    if (this.state.isBossSpawned || this.state.isAct2Waiting || this.state.isGameOver) return;
    const activeEnemies = this.enemies.getChildren().filter(e => e.active && !e.isBoss).length;

    if (activeEnemies <= 1) {
      if (this.state.isAct2) {
        if (this.state.isTaintedAct2) {
          this.spawnAshenHound();
          this.spawnAshenHound();
          if (this.state.kills >= 130 && Math.random() < 0.4) this.spawnBloodSniper();
        } else {
          this.spawnDeepOne();
          this.spawnDeepOne();
          if (this.state.kills >= 130 && Math.random() < 0.4) this.spawnVoidCaller();
        }
      } else {
        this.spawnCrusader();
        this.spawnCrusader();
        if (this.state.kills >= 30 && Math.random() < 0.4) this.spawnInquisitor();
      }
    }
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

    if (this.state.isTaintedAct2) {
      // ★ 사후 황무지 전용 몹 스폰 루프
      this.deepOneTimer = this.time.addEvent({
        delay: 850,
        loop: true,
        callback: () => this.spawnAshenHound(), // 신규 근접 몹
      });
      this.voidCallerTimer = this.time.addEvent({
        delay: 2600,
        loop: true,
        callback: () => this.spawnBloodSniper(), // 신규 원거리 몹
      });
    } else {
      // 기존 심해 르뤼에 루프
      this.deepOneTimer = this.time.addEvent({
        delay: 900,
        loop: true,
        callback: () => this.spawnDeepOne(),
      });
      this.voidCallerTimer = this.time.addEvent({
        delay: 2800,
        loop: true,
        callback: () => this.spawnVoidCaller(),
      });
    }
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

        if (!this.boss || !this.boss.active) return;

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
      .setText('★ The Grand Cultist Slayer (PHASE 2) ★')
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
      .setText('THE GREAT DEEP ONE')
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
      .setText('🌊 [THE GREAT DEEP ONE HAS AWAKENED!]')
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
      .setText('★ THE GREAT DEEP ONE (PHASE 2) ★')
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
      .setText('⚠️ [PHASE 2] Abyssal eyes flare from beneath the ancient helm!')
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
    this.boss.isWindingUp = true; // ★ 탄환 발사 전조 카운터 허용

    this.time.delayedCall(isP2 ? 450 : 600, () => {
      if (!this.boss || !this.boss.active) return;
      this.boss.isWindingUp = false; // ★ 발사 시점에 해제
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
    this.boss.isWindingUp = true; // ★ 몹 소환 전조 카운터 허용

    this.time.delayedCall(isP2 ? 700 : 1000, () => {
      if (!this.boss || !this.boss.active) return;
      this.boss.isWindingUp = false; // ★ 소환 시점에 해제
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

      if (e.isBloodSniper) {
        if (dist <= 340 && !e.isWindingUp && !e.isAttacking) {
          this.fireBloodSniper(e);
        } else if (!e.isWindingUp && !e.isAttacking) {
          this.physics.moveToObject(e, this.player, (e.baseSpeed || 55) * slowMult);
        }
        return;
      }

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
          this.physics.moveToObject(e, this.player, (e.baseSpeed || GAME_CONFIG.RANGED_ENEMY.SPEED) * slowMult);
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
          this.physics.moveToObject(e, this.player, (e.baseSpeed || GAME_CONFIG.ENEMY.SPEED) * slowMult);
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

    // 물리 시간 축을 느리게 만들어 처치 쾌감 극대화 (0.8초 뒤 정상 복귀)
    this.physics.world.timeScale = 3.0;
    this.time.delayedCall(800, () => {
      this.physics.world.timeScale = 1.0;
    });

    this.state.maxHp += 10;
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + 50);
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
        'The Grand Inquisitor has fallen.\nYet the sanctuary seal shatters, and the abyss opens...',
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
        '[ACT II Begins] The sanctuary seal is broken. A deeper madness approaches.'
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
      .text(width / 2, height / 2 - 20, 'RITUAL FAILED', {
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
        '"When a bloodless blade cleaves the air endlessly, the abyssal hunter awakens."',
        '"Endure incoming strikes without swinging your blade, and the deep lord shall reply."',
        '"Deny the service of the gods, and meet a terrible fate.."',
        '"Vanquish them flawlessly without a scratch to ascend into your true form."',
        '"Ambush foes the instant they flash red, striking their vulnerable guard."',
        '"Ph nglui mglw nafh Cthulhu R lyeh wgah nagl fhtagn."',
        '"The oldest and strongest emotion of mankind is fear, and the deepest fear is the unknown of the dark."',
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
        '- Press [R] or Click to Restart -',
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

  // ★ [최종 보스 처치] 승리(클리어) 연출 및 엔딩 화면
  triggerVictoryScreen() {
    if (this.state.isGameOver) return;
    this.state.isGameOver = true;

    // 1. 모든 스폰 루프 정지 및 잔존 적/투사체 일괄 정리
    if (this.crusaderTimer) this.crusaderTimer.remove();
    if (this.inquisitorTimer) this.inquisitorTimer.remove();
    if (this.deepOneTimer) this.deepOneTimer.remove();
    if (this.voidCallerTimer) this.voidCallerTimer.remove();

    this.projectiles.clear(true, true);
    this.enemies.getChildren().forEach((e) => {
      if (e.active) e.destroy();
    });

    // 플레이어 무적 및 정지
    this.state.isInvulnerable = true;
    this.player.setVelocity(0, 0);


    // 2. 신격별 고유 테마 컬러 및 승천 타이틀 매핑
    const FORM_THEMES = {
      'MORTAL CULTIST': { color: '#ef4444', hex: 0x991b1b, title: 'THE USURPER OF THE ABYSS' },
      HASTUR: { color: '#facc15', hex: 0xfacc15, title: 'THE KING IN YELLOW REIGNS' },
      CTHULHU: { color: '#10b981', hex: 0x10b981, title: 'LORD OF SUNKEN R\'LYEH' },
      NYARLATHOTEP: { color: '#c084fc', hex: 0xa855f7, title: 'THE CRAWLING CHAOS TRIUMPHS' },
      DAGON: { color: '#38bdf8', hex: 0x0ea5e9, title: 'SOVEREIGN OF THE TRENCHES' },
      NODENS: { color: '#7dd3fc', hex: 0x38bdf8, title: 'HUNTER OF THE GREAT ABYSS' },
      'THE FAITHLESS': { color: '#f87171', hex: 0xef4444, title: 'THE GODSLAYER UNBOUND' },
      CTHUGHA: { color: '#fb923c', hex: 0xf97316, title: 'THE LIVING FLAME CONSUMES ALL' },
    };

    const theme = FORM_THEMES[this.state.form] || FORM_THEMES['MORTAL CULTIST'];
    const tierSuffix =
      this.state.awakeningTier >= 2
        ? ` - ${this.state.awakeningPath || 'BETA'}`
        : this.state.awakeningTier === 1
          ? ' - ALPHA'
          : '';

    // 3. 카메라 슬로우 모션 여운 & 진동/플래시
    this.cameras.main.shake(900, 0.025);
    this.cameras.main.flash(700, 255, 255, 255);

    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    // 4. 심연의 암전 배경 레이어 (서서히 페이드 인)
    const bgOverlay = this.add
      .rectangle(cx, cy, 800, 600, 0x05050a, 0)
      .setScrollFactor(0)
      .setDepth(300);

    // 외곽 신격 테마 프레임
    const borderFrame = this.add
      .rectangle(cx, cy, 760, 560)
      .setStrokeStyle(4, theme.hex, 0)
      .setScrollFactor(0)
      .setDepth(301);

    this.tweens.add({
      targets: bgOverlay,
      fillAlpha: 0.88,
      duration: 1200,
      ease: 'Cubic.easeOut',
    });

    this.tweens.add({
      targets: borderFrame,
      strokeAlpha: 0.6,
      duration: 1500,
      ease: 'Cubic.easeOut',
    });

    // 5. 메인 승리 타이틀
    const titleText = this.add
      .text(cx, cy - 110, 'APOTHEOSIS COMPLETE', {
        fontFamily: 'Georgia, serif',
        fontSize: '42px',
        color: theme.color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 8,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: theme.color,
          blur: 22,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(302)
      .setAlpha(0)
      .setScale(0.85);

    // 서브 타이틀 (달성한 신격 문구)
    const subTitle = this.add
      .text(cx, cy - 50, `[ ${theme.title} ]`, {
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        color: '#e2e8f0',
        letterSpacing: 3,
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(302)
      .setAlpha(0);

    // 6. 전투 기록 요약 (최종 폼, 총 처치 수, 패링 횟수 등)
    const statsSummary = [
      `ASCENDED FORM :  ${this.state.form}${tierSuffix}`,
      `TOTAL SACRIFICES :  ${this.state.kills} KILLS`,
      `PARRIES EXECUTED :  ${this.state.successfulParries || 0}`,
      `REMAINING VITALITY :  ${Math.max(0, Math.floor(this.state.hp))} / ${this.state.maxHp}`,
    ].join('\n\n');

    const statsText = this.add
      .text(cx, cy + 45, statsSummary, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#cbd5e1',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(302)
      .setAlpha(0);

    // 7. 텍스트 순차 등장 연출
    this.tweens.add({
      targets: titleText,
      alpha: 1,
      scale: 1,
      delay: 400,
      duration: 800,
      ease: 'Back.easeOut',
    });

    this.tweens.add({
      targets: [subTitle, statsText],
      alpha: 1,
      delay: 900,
      duration: 800,
      ease: 'Cubic.easeOut',
    });

    const isFirstClear = localStorage.getItem('culturist_act2_cleared') !== 'true';
    if (this.state.isTaintedAct2) {
      localStorage.setItem('culturist_tainted_cleared', 'true'); // ★ 은열쇠 획득 기록
    } else {
      localStorage.setItem('culturist_act2_cleared', 'true');
    }

    // ★ 1회차 일반 Act 2 클리어 시(또는 Tainted 미진입 클리어 시) 해금 힌트 표시
    if (isFirstClear && !this.state.isTaintedAct2) {
      const hintText = this.add
        .text(
          cx,
          cy + 125,
          '“A tainted rift now stirs at the northern edge of the sanctuary...”',
          {
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            color: '#ff1e42',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: {
              offsetX: 0,
              offsetY: 0,
              color: '#dc2626',
              blur: 12,
              fill: true,
            },
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(302)
        .setAlpha(0);

      this.tweens.add({
        targets: hintText,
        alpha: 1,
        delay: 1400, // 스탯 텍스트(900ms) 직후, 재시작 문구(1800ms) 직전에 등장
        duration: 800,
        ease: 'Cubic.easeOut',
      });
    }

    // 8. 1.8초 뒤 재시작 안내 문구 활성화 (사망 화면처럼 연타로 인한 즉시 스킵 방지)
    this.time.delayedCall(1800, () => {
      const promptText = this.add
        .text(cx, cy + 175, '— CLICK OR PRESS [SPACE] TO BEGIN A NEW CYCLE —', {
          fontFamily: 'Georgia, serif',
          fontSize: '16px',
          color: '#fde047',
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(302)
        .setAlpha(0);

      this.tweens.add({
        targets: promptText,
        alpha: 1,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      const restartGame = () => {
        this.scene.restart();
      };

      this.input.once('pointerdown', restartGame);
      this.input.keyboard.once('keydown-SPACE', restartGame);
    });
  }

  startAct2Phase(bx = 700, by = 700) {
    this.state.isAct2Waiting = true;

    // 1. Act 1 스폰 타이머 및 잔여 오브젝트 정리
    if (this.crusaderTimer) this.crusaderTimer.remove();
    if (this.inquisitorTimer) this.inquisitorTimer.remove();
    if (this.enemies) this.enemies.clear(true, true);
    if (this.projectiles) this.projectiles.clear(true, true);
    if (this.bloodOrbs) this.bloodOrbs.clear(true, true);

    // 2. 일반 Act 2 포탈 생성 (보스 처치 위치 또는 중앙)
    const hasTrueKey = localStorage.getItem('culturist_tainted_cleared') === 'true';

    const portalOuter = this.add
      .circle(bx, by, 44, hasTrueKey ? 0x1a0b04 : 0x090414, 0.9)
      .setStrokeStyle(3, hasTrueKey ? 0xfacc15 : 0x10b981, 0.95)
      .setDepth(5);

    const portalInner = this.add
      .circle(bx, by, 28, 0x020617, 1)
      .setStrokeStyle(2, hasTrueKey ? 0xff1e42 : 0x6ee7b7, 0.85)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(6);

    this.tweens.add({
      targets: [portalOuter, portalInner],
      scale: 1.08,
      duration: hasTrueKey ? 450 : 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const portalParticles = this.add
      .particles(bx, by, 'px', {
        color: hasTrueKey ? [0xfacc15, 0xff1e42, 0xffffff] : [0x10b981, 0x6ee7b7, 0xa855f7],
        scale: { start: 2.2, end: 0 },
        alpha: { start: 0.85, end: 0 },
        speed: { min: 15, max: 45 },
        angle: { min: 0, max: 360 },
        lifespan: 700,
        frequency: 45,
        blendMode: 'ADD',
      })
      .setDepth(6);

    const portalLabel = this.add
      .text(
        bx,
        by - 62,
        hasTrueKey ? "[ Unsealed Gate : True R'lyeh ]" : '[ Abyssal Gate ]',
        {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: hasTrueKey ? '#facc15' : '#6ee7b7',
          stroke: '#000000',
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5)
      .setDepth(20);

    // 3. 포탈 일괄 정리용 배열 및 헬퍼
    const allPortalObjs = [portalOuter, portalInner, portalParticles, portalLabel];
    const allPortalTimers = [];
    let entered = false;

    const cleanupPortals = () => {
      allPortalTimers.forEach((t) => t.remove());
      allPortalObjs.forEach((o) => {
        if (o && o.active) o.destroy();
      });
    };

    // 4. 일반 Act 2 포탈 진입 체크
    const portalCheckTimer = this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (entered || !this.player || !this.player.active) return;

        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, bx, by) <= 45) {
          entered = true;
          this.state.isTaintedAct2 = false;
          allPortalTimers.forEach((t) => t.remove());

          this.player.setVelocity(0, 0);
          this.physics.world.pause();
          this.cameras.main.shake(700, 0.025);
          this.cameras.main.fade(700, 2, 6, 23);

          this.time.delayedCall(750, () => {
            cleanupPortals();
            this.buildAct2MythosWorld(false);
          });
        }
      },
    });
    allPortalTimers.push(portalCheckTimer);

    // 5. 조건 충족 시 맵 북쪽 끝(700, 110)에 Tainted 포탈 생성
    const isTaintedUnlocked =
      GAME_CONFIG.DEBUG_UNLOCK_TAINTED ||
      localStorage.getItem('culturist_act2_cleared') === 'true';

    if (isTaintedUnlocked) {
      const tx = 700;
      const ty = 110;

      const tOuter = this.add
        .circle(tx, ty, 40, 0x160a24, 0.9)
        .setStrokeStyle(3, 0xa855f7, 0.95)
        .setDepth(5);

      const tInner = this.add
        .circle(tx, ty, 24, 0x090414, 1)
        .setStrokeStyle(2, 0xe2e8f0, 0.85)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(6);

      this.tweens.add({
        targets: [tOuter, tInner],
        scale: 1.1,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      const tParticles = this.add
        .particles(tx, ty, 'px', {
          color: [0xa855f7, 0xc084fc, 0xe2e8f0],
          scale: { start: 2.2, end: 0 },
          alpha: { start: 0.85, end: 0 },
          speed: { min: 15, max: 45 },
          angle: { min: 0, max: 360 },
          lifespan: 700,
          frequency: 45,
          blendMode: 'ADD',
        })
        .setDepth(6);

      const tLabel = this.add
        .text(tx, ty - 58, '[ Gate of Slumber : Sacrifice 50% Max HP ]', {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#d8b4fe',
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(20);

      allPortalObjs.push(tOuter, tInner, tParticles, tLabel);

      const taintedCheckTimer = this.time.addEvent({
        delay: 50,
        loop: true,
        callback: () => {
          if (entered || !this.player || !this.player.active) return;

          if (Phaser.Math.Distance.Between(this.player.x, this.player.y, tx, ty) <= 45) {
            entered = true;
            this.state.isTaintedAct2 = true;
            allPortalTimers.forEach((t) => t.remove());

            // 입장 패널티: 최대 체력 절반 삭감 (최소 40 보장)
            this.state.maxHp = Math.max(40, Math.floor(this.state.maxHp * 0.5));
            this.state.hp = Math.min(this.state.hp, this.state.maxHp);
            this.updateHUD();

            this.player.setVelocity(0, 0);
            this.physics.world.pause();
            this.cameras.main.shake(800, 0.03);
            this.cameras.main.fade(700, 26, 0, 4);

            this.time.delayedCall(750, () => {
              cleanupPortals();
              this.buildAct2MythosWorld(true);
            });
          }
        },
      });
      allPortalTimers.push(taintedCheckTimer);
    }

    this.hudGuide
      .setText('🌌 A dimensional rift has opened. Step into the Abyssal Gate.')
      .setColor('#6ee7b7');
  }

  buildAct2MythosWorld(isTainted = false) {
    this.state.isAct2 = true;
    this.state.isAct2Waiting = false;

    if (this.bloodEmitter) {
      this.bloodEmitter.setParticleTint(isTainted ? [0xa855f7, 0xd8b4fe, 0x6b21a8] : 0xdc2626);
    }

    if (this.act1BgGfx) {
      this.act1BgGfx.destroy();
      this.act1BgGfx = null;
    }
    if (this.bloodDecalGfx) {
      this.bloodDecalGfx.clear();
      this.bloodDecalGfx.setDepth(-6);
    }

    const worldW = 1400;
    const worldH = 1400;
    const cx = worldW / 2;
    const cy = worldH / 2;

    // ★ 루트별 컬러 팔레트 세팅 (사후 황무지 vs 심해 르뤼에)
    const pal = isTainted
      ? {
        bgHex: '#2c283b',      // 채도를 살짝 뺀 차분한 달빛 대리석
        bgNum: 0x2c283b,
        slab: 0x3f3954,        // 은은한 석판
        crack: 0x524b6e,       // 틈새
        center: 0xcbd5e1,      // 노란색 제거 -> 창백한 은빛 마법진
        pillarBg: 0x363147,
        rune: 0xe2e8f0,        // 순백/은빛 룬
        particles: [0xffffff, 0xe2e8f0, 0xc4b5fd], // 하얀 성운 + 연보라만 유지
        title: 'ACT II [DREAMLANDS] : Unknown Kadath\nTHE DREAMLANDS',
        titleColor: '#e2e8f0',
        guide: '[THE DREAMLANDS] Half your vitality remains in the waking world. Survive for Gamma Awakening.',
      }
      : {
        bgHex: '#03090a',
        bgNum: 0x03090a,
        slab: 0x0b211d,
        crack: 0x113830,
        center: 0x0f3d33,
        pillarBg: 0x071714,
        rune: 0x10b981,
        particles: [0x10b981, 0x6ee7b7, 0xa855f7],
        title: 'ACT II : The Sunken Ancient City\nSUNKEN R’LYEH',
        titleColor: '#6ee7b7',
        guide: '🌌 [ACT II] You have left the Chamber of Ritual and stepped into the domain of the Elder Gods.',
      };

    this.act2BgGfx = this.add.graphics().setDepth(-10);
    this.cameras.main.setBackgroundColor(pal.bgHex);
    this.act2BgGfx.fillStyle(pal.bgNum, 1).fillRect(0, 0, worldW, worldH);

    // 석판 & 균열
    this.act2BgGfx.lineStyle(2, pal.slab, 0.7);
    for (let x = 0; x < worldW; x += 180) {
      for (let y = 0; y < worldH; y += 180) {
        const offsetX = ((y / 180) % 2) * 60;
        this.act2BgGfx.strokeRect(x + offsetX, y, 172, 172);
        if ((x + y) % 360 === 0) {
          this.act2BgGfx.lineStyle(1, pal.crack, 0.55);
          this.act2BgGfx.lineBetween(x + offsetX + 20, y + 20, x + offsetX + 150, y + 150);
          this.act2BgGfx.lineStyle(2, pal.slab, 0.7);
        }
      }
    }

    // 중앙 문양
    this.act2BgGfx.lineStyle(3, pal.center, 0.65);
    this.act2BgGfx.strokeCircle(cx, cy, 260);
    this.act2BgGfx.strokeEllipse(cx, cy, 480, 190);
    this.act2BgGfx.strokeEllipse(cx, cy, 80, 185);

    // 모놀리스 기둥 & 룬 코어
    const pillarSpots = [
      { x: cx - 380, y: cy - 280 }, { x: cx + 380, y: cy - 280 },
      { x: cx - 380, y: cy + 280 }, { x: cx + 380, y: cy + 280 },
      { x: cx, y: cy - 420 }, { x: cx, y: cy + 420 },
    ];

    this.act2Runes = [];
    pillarSpots.forEach((spot) => {
      this.act2BgGfx.fillStyle(pal.pillarBg, 0.9).fillCircle(spot.x, spot.y, 42);
      this.act2BgGfx.lineStyle(2, pal.rune, 0.4).strokeCircle(spot.x, spot.y, 42);

      const runeGlow = this.add
        .circle(spot.x, spot.y, 8, pal.rune, 0.5)
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

    // 환경 파티클 (황무지는 바람에 날리는 재/불티, 심해는 위로 뜨는 포자)
    this.act2AmbientParticles = this.add
      .particles(0, 0, 'px', {
        x: { min: 0, max: worldW },
        y: { min: 0, max: worldH },
        color: pal.particles,
        scale: { start: 2.0, end: 0 },
        alpha: { start: 0.5, end: 0 },
        speedX: isTainted ? { min: -18, max: 18 } : { min: -10, max: 10 },
        speedY: isTainted ? { min: -22, max: 12 } : { min: -25, max: -8 },
        lifespan: { min: 2500, max: 4500 },
        frequency: 75,
        blendMode: 'ADD',
      })
      .setDepth(-2);

    this.player.setPosition(cx, cy);
    this.physics.world.resume();
    this.cameras.main.fadeIn(1000, isTainted ? 13 : 2, isTainted ? 6 : 6, isTainted ? 24 : 23);

    this.initAct2Loop();

    // 챕터 타이틀 & 가이드
    const chapterTitle = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY - 50, pal.title, {
        fontFamily: 'Georgia, serif',
        fontSize: '26px',
        color: pal.titleColor,
        align: 'center',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
      })
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

    this.hudGuide.setText(pal.guide).setColor(pal.titleColor);
  }


  // ★ [핵심] PC 마우스 조준 & 모바일 스마트 오토에임 통합 각도 반환기
  getAimAngle() {
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



}


new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [PreloadScene, MainScene],
});
