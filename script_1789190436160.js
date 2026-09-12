/**
 * DEFENSE HERITAGE INTERACTIVE - MASTER JAVASCRIPT CONTROLLER
 * Features:
 * 1. Dark Mode / Theme Controller (Dual class & attribute support)
 * 2. Native Web Audio API Sound Engine (Tactical SFX without external audio files)
 * 3. Intersection Observer Scroll-Triggered Entrance Animations
 * 4. Operational Theater Filtering Engine
 * 5. Interactive Tactical Dossier Modal (<dialog> system)
 * 6. Tactical Assessment Quiz with 20s Countdown Clock & Rank Progression
 */

document.addEventListener('DOMContentLoaded', () => {
  const soundEngine = initAudio();
  initTheme(soundEngine);
  initScrollAnimations();
  initTheaterFilters(soundEngine);
  initDossierModal(soundEngine);
  initQuiz(soundEngine);
  initMissionGame(soundEngine);
  initAdvancedGames(soundEngine);
  initMotionLab();
});

/* ==========================================================================
   1. NATIVE WEB AUDIO API TACTICAL SFX ENGINE
   ========================================================================== */
function initAudio() {
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = soundToggleBtn?.querySelector('.sound-icon');
  
  let isSoundEnabled = localStorage.getItem('dhi-sound') !== 'false';
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function updateToggleUI() {
    if (soundToggleBtn) {
      soundToggleBtn.setAttribute('aria-pressed', isSoundEnabled ? 'true' : 'false');
    }
    if (soundIcon) {
      soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
    }
  }

  updateToggleUI();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('dhi-sound', isSoundEnabled ? 'true' : 'false');
      updateToggleUI();
      if (isSoundEnabled) {
        playTone(660, 'sine', 0.08, 0.05);
      }
    });
  }

  // Synthesizes a tone with attack and rapid exponential decay
  function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.05) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  return {
    playClick() {
      playTone(880, 'sine', 0.06, 0.04);
    },
    playDossierOpen() {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        [440, 660, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + (i * 0.05));
          gain.gain.setValueAtTime(0.03, now + (i * 0.05));
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.05) + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (i * 0.05));
          osc.stop(now + (i * 0.05) + 0.08);
        });
      } catch (e) {}
    },
    playCorrect() {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + (i * 0.08));
          gain.gain.setValueAtTime(0.06, now + (i * 0.08));
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.08) + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (i * 0.08));
          osc.stop(now + (i * 0.08) + 0.25);
        });
      } catch (e) {}
    },
    playError() {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        [160, 130].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + (i * 0.1));
          gain.gain.setValueAtTime(0.05, now + (i * 0.1));
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.1) + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (i * 0.1));
          osc.stop(now + (i * 0.1) + 0.18);
        });
      } catch (e) {}
    },
    playRankUp() {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const chord = [392.00, 523.25, 659.25, 783.99, 1046.50];
        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + (i * 0.09));
          gain.gain.setValueAtTime(0.07, now + (i * 0.09));
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.09) + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (i * 0.09));
          osc.stop(now + (i * 0.09) + 0.4);
        });
      } catch (e) {}
    },
    playTick() {
      playTone(1200, 'sine', 0.02, 0.015);
    }
  };
}

/* ==========================================================================
   2. DARK MODE TOGGLE & THEME CONTROLLER
   ========================================================================== */
function initTheme(sound) {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn?.querySelector('.theme-icon');
  const themeLabel = themeToggleBtn?.querySelector('.theme-label');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('dhi-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      sound.playClick();
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('dhi-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    
    // Toggle .dark-mode class for full dual-compatibility
    if (isDark) {
      document.body.classList.add('dark-mode');
      htmlRoot.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      htmlRoot.classList.remove('dark-mode');
    }

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
    if (themeIcon) {
      themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
    if (themeLabel) {
      themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
  }
}

/* ==========================================================================
   3. SCROLL-TRIGGERED ENTRANCE ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.timeline-item, .badge-card, .quiz-card').forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   4. OPERATIONAL THEATER FILTERING SYSTEM
   ========================================================================== */
function initTheaterFilters(sound) {
  const filterButtons = document.querySelectorAll('.theater-filters .filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const filterValue = btn.getAttribute('data-filter');

      // Update active states
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter timeline items
      timelineItems.forEach(item => {
        const itemTheater = item.getAttribute('data-theater');
        if (filterValue === 'all' || itemTheater === filterValue) {
          item.classList.remove('is-filtered-out');
          item.style.animation = 'none';
          // Trigger reflow to restart entrance
          void item.offsetWidth;
          item.style.animation = 'anim-slide-up-fade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        } else {
          item.classList.add('is-filtered-out');
        }
      });
    });
  });
}

/* ==========================================================================
   5. TACTICAL EVENT DOSSIER MODAL (<dialog>)
   ========================================================================== */
function initDossierModal(sound) {
  const modal = document.getElementById('event-dossier-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const bottomCloseBtn = document.getElementById('close-modal-bottom-btn');

  const titleEl = document.getElementById('modal-event-title');
  const tagEl = document.getElementById('modal-event-tag');
  const dateEl = document.getElementById('modal-event-date');
  const locationEl = document.getElementById('modal-event-location');
  const overviewEl = document.getElementById('modal-event-overview');
  const commandersEl = document.getElementById('modal-event-commanders');
  const objectiveEl = document.getElementById('modal-event-objective');
  const equipmentEl = document.getElementById('modal-event-equipment');
  const outcomeEl = document.getElementById('modal-event-outcome');

  // Complete Historical Defense Dossiers Dataset
  const dossiers = {
    'badgam': {
      title: "Battle of Badgam",
      tag: "GROUND DEFENSE / VALOR",
      date: "November 3, 1947",
      location: "Badgam, Kashmir Valley",
      overview: "A decisive defensive delaying action. Major Somnath Sharma's D Company of 4 Kumaon was heavily outnumbered by ~700 tribal raiders advancing on Srinagar. Despite being under lethal mortar barrage and suffering a fractured arm, Major Sharma coordinated mortar and air support until falling in action, ensuring Srinagar airfield was saved.",
      commanders: "Major Somnath Sharma, PVC (Posthumous)",
      objective: "Deny enemy advance toward Srinagar airfield and maintain aerial lifeline.",
      equipment: "Bren Light Machine Guns, 2-inch & 3-inch Mortars, Spitfire Air Support",
      outcome: "Airfield preserved; permitted airborne reinforcement of Indian troops to secure Kashmir."
    },
    'rezang-la': {
      title: "Battle of Rezang La",
      tag: "HIGH-ALTITUDE LAST STAND",
      date: "November 18, 1962",
      location: "Chushul Sector, Ladakh (16,000+ ft)",
      overview: "Regarded among military historians as one of the fiercest last stands in modern warfare. Charlie Company of 13 Kumaon stood at freezing sub-zero temperatures with crest winds. Under Major Shaitan Singh, 114 soldiers repulsed multiple frontal waves of assault, fighting till their final rounds in hand-to-hand combat.",
      commanders: "Major Shaitan Singh, PVC (Posthumous)",
      objective: "Hold the strategic pass guarding Chushul airstrip and the road to Leh.",
      equipment: ".303 Lee-Enfield Rifles, 3-inch Mortars, Light Machine Guns",
      outcome: "Inflicted devastating casualties on attacking forces; protected Ladakh gateway."
    },
    'asal-uttar': {
      title: "Battle of Asal Uttar",
      tag: "ARMORED WARFARE BREAKTHROUGH",
      date: "September 8–10, 1965",
      location: "Khem Karan Sector, Punjab",
      overview: "A tactical armored defensive masterpiece. Defending forces enticed 1st Armored Division tanks into a U-shaped horseshoe ambush by breaching Rohi Nullah canal bunds. The waterlogged fields bogged down Patton tanks, turning the battlefield into 'Patton Nagar'. CQMH Abdul Hamid destroyed multiple Patton tanks with a recoilless gun.",
      commanders: "Brigadier Thomas Theograj, CQMH Abdul Hamid, PVC",
      objective: "Halt hostile armored spearhead aimed at the Beas bridge and Grand Trunk Road.",
      equipment: "Centurion & AMX-13 Tanks, Jeep-mounted Recoilless Rifles (RCL)",
      outcome: "Over 90 enemy tanks captured, damaged, or destroyed; strategic western thrust crushed."
    },
    'operation-trident': {
      title: "Operation Trident",
      tag: "NAVAL MISSILE STRIKE",
      date: "December 4–5, 1971",
      location: "Karachi Harbor, Arabian Sea",
      overview: "First operational use of surface-to-surface anti-ship missiles in the Indo-Pacific. 25th Missile Boat Squadron (INS Nipat, Nirghat, and Veer) under Commander Babru Bhan Yadav penetrated heavily defended waters at night, sinking enemy destroyer PNS Khaibar, minesweeper PNS Muhafiz, and setting vital fuel storage facilities ablaze.",
      commanders: "Commander Babru Bhan Yadav, MVC; Admiral S.M. Nanda",
      objective: "Neutralize maritime strike capability and impose total maritime blockade.",
      equipment: "Osa-I Class Missile Boats, P-15 Termit (Styx) Anti-ship Cruise Missiles",
      outcome: "Karachi harbor blockaded; celebrated nationally every year on December 4 as Navy Day."
    },
    'longewala': {
      title: "Battle of Longewala",
      tag: "INFANTRY & AIR DEFENSE",
      date: "December 4–5, 1971",
      location: "Thar Desert, Rajasthan",
      overview: "Major K.S. Chandpuri with 120 soldiers of 23 Punjab held an isolated border post with zero immediate armor support against 45 tanks and 2,000+ mechanized infantry. Holding their ground throughout the cold desert night with jeep-mounted recoilless fire and minefields, Indian Air Force Hawker Hunters annihilated the armored columns at daybreak.",
      commanders: "Major (later Brig) Kuldip Singh Chandpuri, MVC; Wing Cdr M.S. Bawa",
      objective: "Prevent enemy armored push to Ramgarh and Jaisalmer.",
      equipment: "106mm RCL Guns, 81mm Mortars, IAF Hawker Hunter Strike Fighters",
      outcome: "36+ tanks destroyed or abandoned; total collapse of the hostile Thar offensive."
    },
    'basantar': {
      title: "Battle of Basantar",
      tag: "ARMORED BREAKTHROUGH",
      date: "December 15–17, 1971",
      location: "Shakargarh Sector, Basantar River",
      overview: "One of the most hard-fought tank confrontations of the 1971 war. The Poona Horse established a bridgehead across a mined riverbed. Second Lieutenant Arun Khetarpal, commanding 'Famagusta', engaged multiple enemy Patton tanks at point-blank range, single-handedly destroying four tanks even after his tank caught fire.",
      commanders: "2nd Lt Arun Khetarpal, PVC (Posthumous); Lt Col Hanut Singh, MVC",
      objective: "Secure Shakargarh salient bridgehead and neutralize counter-attacking armored regiments.",
      equipment: "Centurion Mk 7 Main Battle Tanks, Engineer Mine-clearing equipment",
      outcome: "Secured complete armored dominance over Shakargarh; shattered hostile counter-attacks."
    },
    'meghdoot': {
      title: "Operation Meghdoot",
      tag: "ARCTIC ALPINE OPERATION",
      date: "April 13, 1984",
      location: "Siachen Glacier, Karakoram Range",
      overview: "Pre-emptive high-altitude airborne deployment to secure the undelimited NJ9842 boundary. Kumaon troops and Ladakh Scouts were air-landed on Bilafond La and Sia La passes at altitudes above 18,000 feet, pre-empting hostile plans by four days and establishing permanent control along the Saltoro Ridge.",
      commanders: "Lt Gen P.N. Hoon; Brig Vijay Channa",
      objective: "Establish control over the Saltoro Ridge and all major passes leading into Siachen.",
      equipment: "Mi-8, Mi-17 & Chetak Helicopters, Extreme Cold Weather Clothing",
      outcome: "World's highest battlefield secured; complete territorial control of Siachen Glacier."
    },
    'cactus': {
      title: "Operation Cactus",
      tag: "EXPEDITIONARY AIRBORNE INTERVENTION",
      date: "November 3–5, 1988",
      location: "Malé & Hulhulé, Republic of Maldives",
      overview: "Textbook expeditionary precision intervention. Following an urgent distress call from the Maldivian president facing a mercenary coup, IL-76 aircraft transported paratroopers of the 50th Independent Parachute Brigade over 2,000 km non-stop, landing under blackout conditions and neutralizing hostile forces within 12 hours without casualties.",
      commanders: "Brigadier Farooq Bulsara; Air Vice Marshal Denzil Keelor",
      objective: "Secure Hulhulé airfield, rescue civilian leadership, and eliminate armed mercenary group.",
      equipment: "Ilyushin Il-76 Strategic Transports, Mirage 2000 Escorts, INS Betwa & Godavari",
      outcome: "Hostage crisis dissolved; legitimate government restored; praised globally by UN."
    },
    'safed-sagar': {
      title: "Operation Safed Sagar",
      tag: "HIGH-ALTITUDE COMBAT AIR POWER",
      date: "May 26 – July 12, 1999",
      location: "Kargil, Dras, Batalik Sectors (18,000+ ft)",
      overview: "First combat employment of air power at extreme Himalayan altitudes exceeding 30,000 feet. Indian Air Force customized Mirage 2000 and MiG-27 aircraft with Litening targeting pods to drop 1,000-lb laser-guided bombs with pinpoint precision on fortified redoubts at Tiger Hill and Muntho Dhalo.",
      commanders: "Air Chief Marshal A.Y. Tipnis; Wing Commander Raghunath Nambiar",
      objective: "Pulverize enemy supply dumps, logistics nodes, and fortified hilltop bunkers.",
      equipment: "Mirage 2000, MiG-21, MiG-27, Paveway Laser-Guided Bombs, Litening Pods",
      outcome: "Cut enemy replenishment lifelines, dramatically reducing ground assault casualties."
    },
    'tiger-hill': {
      title: "Battle of Tiger Hill",
      tag: "MOUNTAIN ASSAULT & COMBINED ARMS",
      date: "July 3–4, 1999",
      location: "Dras Sector, Kargil",
      overview: "The psychological and tactical turning point of the Kargil conflict. 18 Grenadiers, 8 Sikh, and 2 Naga troops launched a three-directional assault on Tiger Hill (16,608 ft). Grenadier Yogender Singh Yadav led the Ghatak assault team scaling a 1,000-foot vertical cliff face with ropes under lethal fire, clearing multi-tiered bunkers.",
      commanders: "Grenadier Yogender Singh Yadav, PVC; Lt Col R. Vishwanathan, MVC",
      objective: "Recapture Tiger Hill to remove direct artillery observation over NH 1D highway.",
      equipment: "Bofors 155mm Haubits FH77 Howitzers, Multi-Barrel Rocket Launchers (Grad MBRL)",
      outcome: "Peak recaptured; Highway 1D secured; precipitated rapid clearing of remaining sectors."
    },
    'raahat': {
      title: "Operation Raahat",
      tag: "TRI-SERVICE HUMANITARIAN EVACUATION",
      date: "April 1–11, 2015",
      location: "Sana'a, Aden, Al Hudaydah (Yemen) & Djibouti",
      overview: "Massive non-combatant defense and extraction operation amid intense active aerial bombardment. Indian Navy frigates (INS Sumitra, Mumbai, Tarkash) and Air Force C-17 Globemaster III transports extracted 4,640 Indian citizens and 960 foreign nationals from 41 countries across the Bab-el-Mandeb strait.",
      commanders: "General (Retd) V.K. Singh; Vice Admiral Girish Luthra",
      objective: "Evacuate endangered civilians from war zones under active airspace restrictions.",
      equipment: "Boeing C-17 Globemaster III, INS Tarkash, INS Mumbai, INS Sumitra",
      outcome: "5,600+ civilians safely evacuated; hailed internationally as a benchmark crisis mission."
    },
    'integrated-commands': {
      title: "Integrated Theater Commands & CDS",
      tag: "TRI-SERVICE DOCTRINAL MODERNIZATION",
      date: "January 2020 – Present",
      location: "National Defense Headquarters, New Delhi",
      overview: "The structural transformation of India's armed forces. Created the post of Chief of Defence Staff (CDS) and the Department of Military Affairs (DMA) to unify Army, Navy, and Air Force command architectures into integrated theater commands with joint cyber, space, logistics, and multi-domain defense capabilities.",
      commanders: "General Bipin Rawat, PVSM (First CDS); General Anil Chauhan, PVSM",
      objective: "Evolve tri-service jointness, multi-domain theater operations, and indigenous defense tech.",
      equipment: "Integrated Air Defense Network (IACCS), Tri-Service Cyber & Space Agencies",
      outcome: "Modern synchronized deterrence capable of rapid tri-service response."
    }
  };

  // Open modal on Inspect Dossier button click
  document.querySelectorAll('.btn-dossier').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playDossierOpen();
      const eventId = btn.getAttribute('data-event-id');
      const data = dossiers[eventId];
      if (!data || !modal) return;

      if (titleEl) titleEl.textContent = data.title;
      if (tagEl) tagEl.textContent = data.tag;
      if (dateEl) dateEl.textContent = data.date;
      if (locationEl) locationEl.textContent = data.location;
      if (overviewEl) overviewEl.textContent = data.overview;
      if (commandersEl) commandersEl.textContent = data.commanders;
      if (objectiveEl) objectiveEl.textContent = data.objective;
      if (equipmentEl) equipmentEl.textContent = data.equipment;
      if (outcomeEl) outcomeEl.textContent = data.outcome;

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    });
  });

  function closeModal() {
    sound.playClick();
    if (modal) {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (bottomCloseBtn) bottomCloseBtn.addEventListener('click', closeModal);

  // Close when clicking dialog backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeModal();
      }
    });
  }
}

/* ==========================================================================
   6. TACTICAL ASSESSMENT QUIZ & DYNAMIC COUNTDOWN CLOCK
   ========================================================================== */
function initQuiz(sound) {
  const quizForm = document.getElementById('quiz-form');
  const scoreCountEl = document.getElementById('score-count');
  const totalQuestionsEl = document.getElementById('total-questions');
  const statusTextEl = document.getElementById('user-status-text');
  const feedbackEl = document.getElementById('quiz-feedback');
  const submitBtn = document.getElementById('submit-quiz-btn');
  const nextBtn = document.getElementById('next-quiz-btn');

  const questionTextEl = document.getElementById('quiz-question-text');
  const optionLabels = document.querySelectorAll('.quiz-option-label');

  const timerSecondsEl = document.getElementById('timer-seconds');
  const timerFillEl = document.getElementById('quiz-timer-fill');

  // 5 Tactical Defense Questions
  const questions = [
    {
      question: "Which historic 1971 engagement saw a lone infantry post with 120 soldiers withstand a massive armored column in the Thar Desert?",
      options: [
        { key: "A", text: "Battle of Longewala" },
        { key: "B", text: "Battle of Asal Uttar" },
        { key: "C", text: "Battle of Badgam" }
      ],
      correct: "A",
      explanation: "At Longewala (Dec 1971), 120 soldiers of 23 Punjab stood fast overnight until IAF Hunter aircraft pulverized the armor."
    },
    {
      question: "In September 1965, which historic tank battle resulted in defending forces creating an armored graveyard by breaching canal bunds?",
      options: [
        { key: "A", text: "Operation Trident" },
        { key: "B", text: "Battle of Asal Uttar" },
        { key: "C", text: "Battle of Tololing" }
      ],
      correct: "B",
      explanation: "At Asal Uttar, canal bunds were breached to trap Patton tanks in marshland, resulting in the famous 'Patton Nagar'."
    },
    {
      question: "At the Battle of Rezang La (1962), which company led by Major Shaitan Singh made an epic last stand at 16,000 feet in Ladakh?",
      options: [
        { key: "A", text: "Charlie Company, 13 Kumaon" },
        { key: "B", text: "4th Kumaon Regiment" },
        { key: "C", text: "23 Punjab Battalion" }
      ],
      correct: "A",
      explanation: "Charlie Company of 13 Kumaon fought to the last man, repelling massive waves at -30°C in the Chushul sector."
    },
    {
      question: "Operation Meghdoot (April 1984) established military defense atop which strategic geographical feature?",
      options: [
        { key: "A", text: "Kargil Heights" },
        { key: "B", text: "Haji Pir Pass" },
        { key: "C", text: "Siachen Glacier" }
      ],
      correct: "C",
      explanation: "Operation Meghdoot pre-emptively secured the Siachen Glacier and major passes along the Saltoro Ridge."
    },
    {
      question: "Which swift overseas military operation in November 1988 saw paratroopers intervene in the Maldives to restore civilian democracy?",
      options: [
        { key: "A", text: "Operation Meghdoot" },
        { key: "B", text: "Operation Cactus" },
        { key: "C", text: "Operation Safed Sagar" }
      ],
      correct: "B",
      explanation: "Operation Cactus was executed in under 12 hours by the 50th Parachute Brigade, neutralizing an attempted coup."
    },
    {
      question: "In December 1971, which armored duel along the Basantar River saw 2nd Lt Arun Khetarpal destroy 4 enemy tanks from his Centurion tank?",
      options: [
        { key: "A", text: "Battle of Basantar" },
        { key: "B", text: "Battle of Longewala" },
        { key: "C", text: "Battle of Asal Uttar" }
      ],
      correct: "A",
      explanation: "2nd Lt Arun Khetarpal fought heroically with the Poona Horse at the Battle of Basantar, single-handedly neutralizing enemy tank assaults."
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  const QUESTION_TIME_LIMIT = 20; // 20-second tactical clock
  let timerInterval = null;
  let timeRemaining = QUESTION_TIME_LIMIT;

  const completionPctEl = document.getElementById('completion-pct');
  const completionBarEl = document.getElementById('quiz-completion-bar');

  if (totalQuestionsEl) {
    totalQuestionsEl.textContent = questions.length;
  }

  function startTimer() {
    clearInterval(timerInterval);
    timeRemaining = QUESTION_TIME_LIMIT;
    updateTimerUI();

    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimerUI();

      if (timeRemaining <= 5 && timeRemaining > 0) {
        sound.playTick();
      }

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        handleTimeExpired();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function updateTimerUI() {
    if (timerSecondsEl) {
      timerSecondsEl.textContent = `${timeRemaining}s`;
      if (timeRemaining <= 5) {
        timerSecondsEl.classList.add('warning');
      } else {
        timerSecondsEl.classList.remove('warning');
      }
    }

    if (timerFillEl) {
      const percentage = (timeRemaining / QUESTION_TIME_LIMIT) * 100;
      timerFillEl.style.width = `${percentage}%`;
      if (timeRemaining <= 5) {
        timerFillEl.classList.add('warning');
      } else {
        timerFillEl.classList.remove('warning');
      }
    }
  }

  function handleTimeExpired() {
    sound.playError();
    const currentQ = questions[currentQuestionIndex];
    quizForm.querySelectorAll('input[name="quiz-answer"]').forEach(input => {
      input.disabled = true;
    });

    if (feedbackEl) {
      const correctOpt = currentQ.options.find(o => o.key === currentQ.correct);
      feedbackEl.innerHTML = `<strong>Time Expired!</strong> The tactical answer was: <em>${correctOpt.text}</em>. ${currentQ.explanation}`;
      feedbackEl.className = "quiz-feedback incorrect";
      feedbackEl.hidden = false;
    }

    if (submitBtn) submitBtn.hidden = true;
    if (nextBtn) {
      nextBtn.hidden = false;
      nextBtn.textContent = currentQuestionIndex < questions.length - 1 ? "Next Question" : "View Final Rank";
    }
  }

  function loadQuestion(index) {
    const q = questions[index];
    if (!q) return;

    // Update Quiz Completion Progress Bar
    const progressPct = Math.round(((index + 1) / questions.length) * 100);
    if (completionPctEl) {
      completionPctEl.textContent = `${progressPct}%`;
    }
    if (completionBarEl) {
      completionBarEl.style.width = `${progressPct}%`;
      completionBarEl.parentElement?.setAttribute('aria-valuenow', progressPct);
    }

    if (questionTextEl) {
      questionTextEl.textContent = q.question;
    }

    optionLabels.forEach((label, i) => {
      const opt = q.options[i];
      if (opt) {
        const input = label.querySelector('input[type="radio"]');
        const textSpan = label.querySelector('.option-text');
        if (input) {
          input.value = opt.key;
          input.checked = false;
          input.disabled = false;
        }
        if (textSpan) {
          textSpan.textContent = opt.text;
        }
        label.style.display = 'flex';
      } else {
        label.style.display = 'none';
      }
    });

    if (feedbackEl) {
      feedbackEl.hidden = true;
      feedbackEl.className = 'quiz-feedback';
      feedbackEl.textContent = '';
    }

    if (submitBtn) submitBtn.hidden = false;
    if (nextBtn) nextBtn.hidden = true;

    startTimer();
  }

  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      stopTimer();
      const selected = quizForm.querySelector('input[name="quiz-answer"]:checked');
      if (!selected) return;

      const currentQ = questions[currentQuestionIndex];
      const isCorrect = selected.value === currentQ.correct;

      // Lock inputs after submission
      quizForm.querySelectorAll('input[name="quiz-answer"]').forEach(input => {
        input.disabled = true;
      });

      if (isCorrect) {
        score++;
        sound.playCorrect();
        if (scoreCountEl) scoreCountEl.textContent = score;
        feedbackEl.innerHTML = `<strong>Correct!</strong> Outstanding operational awareness. ${currentQ.explanation}`;
        feedbackEl.className = "quiz-feedback correct";
      } else {
        sound.playError();
        const correctOpt = currentQ.options.find(o => o.key === currentQ.correct);
        feedbackEl.innerHTML = `<strong>Incorrect.</strong> The correct answer was: <em>${correctOpt.text}</em>. ${currentQ.explanation}`;
        feedbackEl.className = "quiz-feedback incorrect";
      }

      feedbackEl.hidden = false;
      if (submitBtn) submitBtn.hidden = true;

      // Update Ranks and Badges
      updateRankProgression(score);

      if (currentQuestionIndex < questions.length - 1) {
        if (nextBtn) {
          nextBtn.hidden = false;
          nextBtn.textContent = "Next Question";
        }
      } else {
        if (nextBtn) {
          nextBtn.hidden = false;
          nextBtn.textContent = "Restart Assessment";
        }
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      sound.playClick();
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
      } else {
        // Reset quiz
        currentQuestionIndex = 0;
        score = 0;
        if (scoreCountEl) scoreCountEl.textContent = score;
        updateRankProgression(score);
        loadQuestion(currentQuestionIndex);
      }
    });
  }

  let previousRank = 'Cadet';
  function updateRankProgression(currentScore) {
    const badgeCadet = document.getElementById('badge-cadet');
    const badgeCommander = document.getElementById('badge-commander');
    const badgeGeneral = document.getElementById('badge-general');
    const flowSteps = document.querySelectorAll('.rank-hierarchy-progression .flow-step');

    let currentRank = 'Cadet';

    // Ranks:
    // Cadet: Initial rank
    // Commander: Score >= 3
    // General: Score >= 5
    const isCommanderUnlocked = currentScore >= 3;
    const isGeneralUnlocked = currentScore >= 5;

    if (isGeneralUnlocked) {
      currentRank = 'General';
    } else if (isCommanderUnlocked) {
      currentRank = 'Commander';
    }

    if (statusTextEl) {
      statusTextEl.textContent = currentRank;
    }

    // Play rank-up fanfare and trigger glowing text animation when rank changes
    if (currentRank !== previousRank) {
      sound.playRankUp();
      previousRank = currentRank;

      if (statusTextEl) {
        statusTextEl.classList.remove('rank-upgrade-glow');
        void statusTextEl.offsetWidth; // Reflow for restart
        statusTextEl.classList.add('rank-upgrade-glow');
        setTimeout(() => statusTextEl.classList.remove('rank-upgrade-glow'), 1500);
      }

      const newlyActiveBadge = currentRank === 'General' ? badgeGeneral : (currentRank === 'Commander' ? badgeCommander : null);
      if (newlyActiveBadge) {
        newlyActiveBadge.classList.add('rank-upgrade-glow');
        setTimeout(() => newlyActiveBadge.classList.remove('rank-upgrade-glow'), 1800);
      }
    }

    // Update Badges UI
    updateBadge(badgeCadet, true); // Always unlocked
    updateBadge(badgeCommander, isCommanderUnlocked);
    updateBadge(badgeGeneral, isGeneralUnlocked);

    // Update Flow Steps UI
    if (flowSteps.length >= 3) {
      flowSteps.forEach(step => step.classList.remove('current'));
      if (currentRank === 'Cadet') flowSteps[0].classList.add('current');
      if (currentRank === 'Commander') flowSteps[1].classList.add('current');
      if (currentRank === 'General') flowSteps[2].classList.add('current');
    }
  }

  function updateBadge(badgeEl, isUnlocked) {
    if (!badgeEl) return;
    const pill = badgeEl.querySelector('.badge-status-pill');
    if (isUnlocked) {
      badgeEl.classList.remove('locked');
      badgeEl.classList.add('active');
      if (pill) {
        pill.className = 'badge-status-pill unlocked';
        pill.textContent = 'Unlocked';
      }
    } else {
      badgeEl.classList.remove('active');
      badgeEl.classList.add('locked');
      if (pill) {
        pill.className = 'badge-status-pill locked';
        pill.textContent = 'Locked';
      }
    }
  }

  // Initial setup
  loadQuestion(0);
}

/* ==========================================================================
   7. MISSION COMMAND LEARNING GAME
   Scenario-based choices with immediate historical context
   ========================================================================== */
function initMissionGame(sound) {
  const gameCard = document.querySelector('.mission-game-card');
  const statusEl = document.getElementById('mission-game-status');
  const scoreEl = document.getElementById('mission-game-score');
  const streakEl = document.getElementById('mission-game-streak');
  const progressEl = document.querySelector('.mission-game-progress');
  const progressBarEl = document.getElementById('mission-game-progress-bar');
  const eraEl = document.getElementById('mission-game-era');
  const titleEl = document.getElementById('mission-game-title');
  const scenarioEl = document.getElementById('mission-game-scenario');
  const optionsEl = document.getElementById('mission-game-options');
  const feedbackEl = document.getElementById('mission-game-feedback');
  const nextBtn = document.getElementById('mission-game-next');

  if (!gameCard || !optionsEl) return;

  const missions = [
    {
      era: '1947 // KASHMIR VALLEY',
      title: 'The airfield is the lifeline.',
      scenario: 'At Badgam, a larger force is moving toward Srinagar while your unit is outnumbered. Which decision best protects the valley?',
      options: [
        'Hold the blocking position and coordinate mortar and air support.',
        'Abandon the position immediately and move all troops to the mountains.',
        'Split the unit into small patrols with no fixed defensive line.'
      ],
      correct: 0,
      lesson: 'Major Somnath Sharma’s stand at Badgam delayed the advance long enough for Srinagar airfield to remain open to reinforcements.'
    },
    {
      era: '1965 // KHEM KARAN SECTOR',
      title: 'Turn armour into a disadvantage.',
      scenario: 'Enemy Patton tanks are approaching across flat ground. Your fields can be flooded before the assault. What is the strongest defensive move?',
      options: [
        'Meet the entire armoured column in open ground.',
        'Breach canal bunds, shape the approach, and draw the tanks into waterlogged fields.',
        'Withdraw beyond the river and leave the roads unobserved.'
      ],
      correct: 1,
      lesson: 'At Asal Uttar, waterlogged terrain helped defending forces trap and defeat a much larger armoured attack.'
    },
    {
      era: '1971 // THAR DESERT',
      title: 'Hold until the sky changes the odds.',
      scenario: 'Your isolated post at Longewala has a small garrison, minefields, and anti-tank weapons. A large armoured column arrives at night. What is the call?',
      options: [
        'Hold the post through the night and call for air support at first light.',
        'Chase the column into the desert before sunrise.',
        'Leave the post and wait for reinforcements at a distant road junction.'
      ],
      correct: 0,
      lesson: 'At Longewala, a disciplined night defence preserved the position until Indian Air Force Hunters could strike the exposed armour at dawn.'
    },
    {
      era: '1984 // SIACHEN GLACIER',
      title: 'The pass is the objective.',
      scenario: 'You must secure a high-altitude glacier before another force occupies the key passes. Supplies are difficult, weather is severe, and speed matters. What is the priority?',
      options: [
        'Wait for perfect weather and a larger conventional force.',
        'Secure the Saltoro Ridge passes first, then build the logistics chain behind them.',
        'Focus only on the valley floor and leave the ridgeline unoccupied.'
      ],
      correct: 1,
      lesson: 'Operation Meghdoot succeeded by taking and sustaining the dominant heights and passes along the Saltoro Ridge.'
    },
    {
      era: '1999 // KARGIL HEIGHTS',
      title: 'Recover the ridge, one objective at a time.',
      scenario: 'In the Kargil sector, fortified positions overlook the road from steep heights. A direct rush would expose the force. Which approach fits the terrain?',
      options: [
        'Use coordinated artillery and deliberate high-altitude assaults to recover each position.',
        'Ignore the heights and move the convoy faster along the road.',
        'Attack every ridge at once without reconnaissance or fire support.'
      ],
      correct: 0,
      lesson: 'Operation Vijay combined artillery, intelligence, and carefully planned assaults to recapture the heights that dominated the Srinagar–Leh route.'
    }
  ];

  let currentMission = 0;
  let score = 0;
  let streak = 0;
  let answered = false;
  let complete = false;

  function renderMission() {
    const mission = missions[currentMission];
    answered = false;
    complete = false;

    statusEl.textContent = `Mission ${String(currentMission + 1).padStart(2, '0')} / ${String(missions.length).padStart(2, '0')}`;
    eraEl.textContent = mission.era;
    titleEl.textContent = mission.title;
    scenarioEl.textContent = mission.scenario;
    scoreEl.textContent = score;
    streakEl.textContent = streak > 1 ? `${streak} decision streak` : (streak === 1 ? '1 decision streak' : 'No streak yet');

    const progress = Math.round(((currentMission + 1) / missions.length) * 100);
    progressBarEl.style.width = `${progress}%`;
    progressEl.setAttribute('aria-valuenow', progress);

    optionsEl.innerHTML = '';
    mission.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mission-option';
      button.dataset.optionIndex = String(index);
      button.innerHTML = `<span class="mission-option-key">${String.fromCharCode(65 + index)}</span><span class="mission-option-text">${option}</span><span class="mission-option-arrow" aria-hidden="true">↗</span>`;
      button.addEventListener('click', () => answerMission(index));
      optionsEl.appendChild(button);
    });

    feedbackEl.hidden = true;
    feedbackEl.className = 'mission-game-feedback';
    feedbackEl.textContent = '';
    nextBtn.hidden = true;
  }

  function answerMission(selectedIndex) {
    if (answered) return;
    answered = true;

    const mission = missions[currentMission];
    const isCorrect = selectedIndex === mission.correct;
    const optionButtons = optionsEl.querySelectorAll('.mission-option');
    optionButtons.forEach((button, index) => {
      button.disabled = true;
      if (index === mission.correct) button.classList.add('is-correct');
      if (index === selectedIndex && !isCorrect) button.classList.add('is-wrong');
    });

    if (isCorrect) {
      score++;
      streak++;
      sound.playCorrect();
      feedbackEl.innerHTML = `<strong>Strong call.</strong> ${mission.lesson}`;
      feedbackEl.className = 'mission-game-feedback correct';
    } else {
      streak = 0;
      sound.playError();
      const correctText = mission.options[mission.correct];
      feedbackEl.innerHTML = `<strong>Reconsider the move.</strong> The best decision was <em>${correctText}</em>. ${mission.lesson}`;
      feedbackEl.className = 'mission-game-feedback incorrect';
    }

    scoreEl.textContent = score;
    streakEl.textContent = streak > 1 ? `${streak} decision streak` : (streak === 1 ? '1 decision streak' : 'Streak reset');
    feedbackEl.hidden = false;
    nextBtn.hidden = false;
    nextBtn.innerHTML = currentMission < missions.length - 1 ? 'Next Mission <span aria-hidden="true">↗</span>' : 'See Debrief <span aria-hidden="true">↗</span>';
  }

  function showDebrief() {
    complete = true;
    statusEl.textContent = 'MISSION DEBRIEF';
    eraEl.textContent = score >= 4 ? 'COMMAND RATING // FIELD READY' : 'COMMAND RATING // KEEP TRAINING';
    titleEl.textContent = score === missions.length ? 'Excellent command decisions.' : `You scored ${score} of ${missions.length}.`;
    scenarioEl.textContent = score >= 4
      ? 'You consistently protected the objective, used terrain well, and understood when patience created an advantage.'
      : 'Replay the missions to compare your instinct with the historical decisions that shaped each operation.';
    optionsEl.innerHTML = '';
    progressBarEl.style.width = '100%';
    progressEl.setAttribute('aria-valuenow', '100');
    feedbackEl.hidden = false;
    feedbackEl.className = 'mission-game-feedback debrief';
    feedbackEl.innerHTML = '<strong>Lesson logged.</strong> History is strategy under pressure: protect the objective, read the terrain, and use the force you have well.';
    nextBtn.hidden = false;
    nextBtn.innerHTML = 'Play Again <span aria-hidden="true">↻</span>';
  }

  nextBtn.addEventListener('click', () => {
    sound.playClick();
    if (complete) {
      currentMission = 0;
      score = 0;
      streak = 0;
      renderMission();
      return;
    }

    if (!answered) return;
    if (currentMission < missions.length - 1) {
      currentMission++;
      renderMission();
    } else {
      showDebrief();
    }
  });

  renderMission();
}

/* ==========================================================================
   8. ADVANCED LEARNING GAMES
   Operation ordering puzzle + timed intelligence intercept
   ========================================================================== */
function initAdvancedGames(sound) {
  initSequenceGame(sound);
  initIntelIntercept(sound);
}

function initSequenceGame(sound) {
  const listEl = document.getElementById('sequence-list');
  const roundEl = document.getElementById('sequence-round');
  const scoreEl = document.getElementById('sequence-score');
  const feedbackEl = document.getElementById('sequence-feedback');
  const submitBtn = document.getElementById('sequence-submit');
  const nextBtn = document.getElementById('sequence-next');

  if (!listEl || !submitBtn || !nextBtn) return;

  const rounds = [
    {
      title: 'Battle of Asal Uttar',
      steps: [
        'Read the canal-and-field terrain',
        'Breach canal bunds to flood the approach',
        'Fix the armoured column inside the marsh',
        'Engage the trapped tanks with anti-tank fire'
      ],
      startOrder: [2, 0, 3, 1]
    },
    {
      title: 'Battle of Longewala',
      steps: [
        'Fortify the isolated post and lay defensive obstacles',
        'Hold the position through the night',
        'Coordinate air support for first light',
        'Strike the exposed armoured column at dawn'
      ],
      startOrder: [1, 3, 0, 2]
    },
    {
      title: 'Operation Meghdoot',
      steps: [
        'Reconnoitre the passes and weather windows',
        'Air-land troops onto the key heights',
        'Secure the Saltoro Ridge positions',
        'Build a reliable high-altitude resupply chain'
      ],
      startOrder: [3, 1, 0, 2]
    }
  ];

  let roundIndex = 0;
  let score = 0;
  let order = [];
  let answered = false;
  let complete = false;

  function renderRound() {
    const round = rounds[roundIndex];
    order = [...round.startOrder];
    answered = false;
    complete = false;
    roundEl.textContent = `Round ${String(roundIndex + 1).padStart(2, '0')} / ${String(rounds.length).padStart(2, '0')}`;
    scoreEl.textContent = `Score ${score}`;
    feedbackEl.hidden = true;
    feedbackEl.className = 'advanced-game-feedback';
    feedbackEl.textContent = '';
    submitBtn.hidden = false;
    nextBtn.hidden = true;
    renderSteps();
  }

  function renderSteps() {
    const round = rounds[roundIndex];
    listEl.innerHTML = '';
    order.forEach((stepIndex, position) => {
      const row = document.createElement('div');
      row.className = 'sequence-row';
      row.innerHTML = `
        <span class="sequence-position">${position + 1}</span>
        <span class="sequence-step">${round.steps[stepIndex]}</span>
        <span class="sequence-move-controls">
          <button type="button" class="sequence-move" data-position="${position}" data-direction="-1" aria-label="Move step up" ${position === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="sequence-move" data-position="${position}" data-direction="1" aria-label="Move step down" ${position === order.length - 1 ? 'disabled' : ''}>↓</button>
        </span>
      `;
      listEl.appendChild(row);
    });

    listEl.querySelectorAll('.sequence-move').forEach(button => {
      button.addEventListener('click', () => {
        if (answered) return;
        const position = Number(button.dataset.position);
        const direction = Number(button.dataset.direction);
        const swapPosition = position + direction;
        if (swapPosition < 0 || swapPosition >= order.length) return;
        [order[position], order[swapPosition]] = [order[swapPosition], order[position]];
        sound.playClick();
        renderSteps();
      });
    });
  }

  function lockSequence() {
    if (answered) return;
    answered = true;
    const round = rounds[roundIndex];
    const isCorrect = order.every((stepIndex, index) => stepIndex === index);
    const rows = listEl.querySelectorAll('.sequence-row');
    rows.forEach((row, index) => {
      row.classList.add(order[index] === index ? 'is-correct' : 'is-wrong');
      row.querySelectorAll('button').forEach(button => {
        button.disabled = true;
      });
    });

    if (isCorrect) {
      score += 2;
      sound.playCorrect();
      feedbackEl.innerHTML = `<strong>Sequence locked.</strong> ${round.title} works because the decision-maker changes the terrain or timing before committing force.`;
      feedbackEl.className = 'advanced-game-feedback correct';
    } else {
      sound.playError();
      const correctOrder = round.steps.map((step, index) => `${index + 1}. ${step}`).join(' ');
      feedbackEl.innerHTML = `<strong>Sequence unstable.</strong> The strongest order is: ${correctOrder}`;
      feedbackEl.className = 'advanced-game-feedback incorrect';
    }

    feedbackEl.hidden = false;
    submitBtn.hidden = true;
    nextBtn.hidden = false;
    nextBtn.innerHTML = roundIndex < rounds.length - 1 ? 'Next Round <span aria-hidden="true">↗</span>' : 'See Debrief <span aria-hidden="true">↗</span>';
    scoreEl.textContent = `Score ${score}`;
  }

  function showSequenceDebrief() {
    complete = true;
    roundEl.textContent = 'SEQUENCE DEBRIEF';
    listEl.innerHTML = '';
    feedbackEl.hidden = false;
    feedbackEl.className = 'advanced-game-feedback debrief';
    feedbackEl.innerHTML = `<strong>${score} / 6 points.</strong> ${score >= 4 ? 'You understand how terrain, timing, and logistics create an advantage.' : 'Replay the sequence rounds and look for the move that changes the conditions before the final strike.'}`;
    submitBtn.hidden = true;
    nextBtn.hidden = false;
    nextBtn.innerHTML = 'Play Again <span aria-hidden="true">↻</span>';
  }

  submitBtn.addEventListener('click', () => {
    sound.playClick();
    lockSequence();
  });

  nextBtn.addEventListener('click', () => {
    sound.playClick();
    if (complete) {
      roundIndex = 0;
      score = 0;
      renderRound();
      return;
    }
    if (roundIndex < rounds.length - 1) {
      roundIndex++;
      renderRound();
    } else {
      showSequenceDebrief();
    }
  });

  renderRound();
}

function initIntelIntercept(sound) {
  const roundEl = document.getElementById('intel-hard-round');
  const timerEl = document.getElementById('intel-hard-timer');
  const cluesEl = document.getElementById('intel-hard-clues');
  const optionsEl = document.getElementById('intel-hard-options');
  const feedbackEl = document.getElementById('intel-hard-feedback');
  const nextBtn = document.getElementById('intel-hard-next');

  if (!cluesEl || !optionsEl || !nextBtn) return;

  const signals = [
    {
      clues: ['Canal bunds breached', 'Patton tanks bogged down', 'Khem Karan sector', 'September 1965'],
      options: ['Battle of Rezang La', 'Battle of Asal Uttar', 'Battle of Basantar', 'Operation Trident'],
      correct: 1,
      explanation: 'The flooded fields at Asal Uttar turned a superior armoured thrust into a tactical defeat.'
    },
    {
      clues: ['Night strike', 'Missile boats', 'Karachi harbour', 'PNS Khaibar'],
      options: ['Operation Cactus', 'Operation Meghdoot', 'Operation Trident', 'Operation Raahat'],
      correct: 2,
      explanation: 'Operation Trident was the 1971 naval strike that hit Karachi harbour and helped establish maritime pressure.'
    },
    {
      clues: ['16,000 feet', 'Charlie Company', '13 Kumaon', 'Chushul sector'],
      options: ['Battle of Badgam', 'Battle of Rezang La', 'Battle of Longewala', 'Capture of Tiger Hill'],
      correct: 1,
      explanation: 'Major Shaitan Singh and Charlie Company made the famed stand at Rezang La in Ladakh.'
    },
    {
      clues: ['Saltoro Ridge', 'Glacier', 'Pre-emptive deployment', 'April 1984'],
      options: ['Operation Vijay', 'Operation Meghdoot', 'Operation Cactus', 'Operation Safed Sagar'],
      correct: 1,
      explanation: 'Operation Meghdoot secured the critical heights and passes around the Siachen Glacier.'
    },
    {
      clues: ['Evacuation mission', 'Yemen', 'C-17 Globemaster', 'April 2015'],
      options: ['Operation Raahat', 'Operation Trident', 'Operation Pawan', 'Operation Cactus'],
      correct: 0,
      explanation: 'Operation Raahat evacuated thousands of people from Yemen using coordinated air and naval assets.'
    }
  ];

  let signalIndex = 0;
  let score = 0;
  let timer = null;
  let secondsRemaining = 12;
  let answered = false;
  let complete = false;

  function updateTimer() {
    timerEl.textContent = `${secondsRemaining}s`;
    timerEl.classList.toggle('is-warning', secondsRemaining <= 4);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();
    secondsRemaining = 12;
    updateTimer();
    timer = setInterval(() => {
      secondsRemaining--;
      updateTimer();
      if (secondsRemaining <= 4 && secondsRemaining > 0) sound.playTick();
      if (secondsRemaining <= 0) {
        stopTimer();
        answerSignal(null);
      }
    }, 1000);
  }

  function renderSignal() {
    const signal = signals[signalIndex];
    answered = false;
    complete = false;
    roundEl.textContent = `Signal ${String(signalIndex + 1).padStart(2, '0')} / ${String(signals.length).padStart(2, '0')}`;
    timerEl.textContent = '12s';
    timerEl.classList.remove('is-warning');
    feedbackEl.hidden = true;
    feedbackEl.className = 'advanced-game-feedback';
    feedbackEl.textContent = '';
    nextBtn.hidden = true;

    cluesEl.innerHTML = signal.clues.map((clue, index) => `<span class="intel-clue"><b>${String(index + 1).padStart(2, '0')}</b>${clue}</span>`).join('');
    optionsEl.innerHTML = signal.options.map((option, index) => `
      <button type="button" class="intel-hard-option" data-option-index="${index}">
        <span class="intel-option-key">${String.fromCharCode(65 + index)}</span>
        <span>${option}</span>
      </button>
    `).join('');
    optionsEl.querySelectorAll('.intel-hard-option').forEach(button => {
      button.addEventListener('click', () => answerSignal(Number(button.dataset.optionIndex)));
    });
    startTimer();
  }

  function answerSignal(selectedIndex) {
    if (answered) return;
    answered = true;
    stopTimer();
    const signal = signals[signalIndex];
    const isCorrect = selectedIndex === signal.correct;
    optionsEl.querySelectorAll('.intel-hard-option').forEach((button, index) => {
      button.disabled = true;
      if (index === signal.correct) button.classList.add('is-correct');
      if (index === selectedIndex && !isCorrect) button.classList.add('is-wrong');
    });

    if (isCorrect) {
      score++;
      sound.playCorrect();
      feedbackEl.innerHTML = `<strong>Signal identified.</strong> ${signal.explanation}`;
      feedbackEl.className = 'advanced-game-feedback correct';
    } else {
      sound.playError();
      const reason = selectedIndex === null ? 'The window closed.' : `You selected ${signal.options[selectedIndex]}.`;
      feedbackEl.innerHTML = `<strong>${reason}</strong> The signal identified <em>${signal.options[signal.correct]}</em>. ${signal.explanation}`;
      feedbackEl.className = 'advanced-game-feedback incorrect';
    }

    feedbackEl.hidden = false;
    nextBtn.hidden = false;
    nextBtn.innerHTML = signalIndex < signals.length - 1 ? 'Next Signal <span aria-hidden="true">↗</span>' : 'See Debrief <span aria-hidden="true">↗</span>';
  }

  function showIntelDebrief() {
    complete = true;
    roundEl.textContent = 'SIGNAL DEBRIEF';
    timerEl.textContent = `${score} / ${signals.length}`;
    timerEl.classList.remove('is-warning');
    cluesEl.innerHTML = '';
    optionsEl.innerHTML = '';
    feedbackEl.hidden = false;
    feedbackEl.className = 'advanced-game-feedback debrief';
    feedbackEl.innerHTML = `<strong>Intercept complete.</strong> You identified ${score} of ${signals.length} operations. ${score >= 4 ? 'Your recall is field-ready.' : 'Replay once more and scan for the place, unit, and method clues together.'}`;
    nextBtn.hidden = false;
    nextBtn.innerHTML = 'Play Again <span aria-hidden="true">↻</span>';
  }

  nextBtn.addEventListener('click', () => {
    sound.playClick();
    if (complete) {
      signalIndex = 0;
      score = 0;
      renderSignal();
      return;
    }
    if (signalIndex < signals.length - 1) {
      signalIndex++;
      renderSignal();
    } else {
      showIntelDebrief();
    }
  });

  renderSignal();
}

/* ==========================================================================
   9. MOTION LAB CONTROLLER
   Live canvas radar, immersive mode, loader transition, and archive flipbook
   ========================================================================== */
function initMotionLab() {
  const loader = document.getElementById('site-loader');
  const loaderPercentage = loader?.querySelector('.loader-percentage');

  if (loader) {
    const startTime = performance.now();
    const loaderDuration = 850;

    function finishLoader(now) {
      const progress = Math.min((now - startTime) / loaderDuration, 1);
      if (loaderPercentage) {
        loaderPercentage.textContent = `${Math.round(progress * 100).toString().padStart(2, '0')}%`;
      }

      if (progress < 1) {
        requestAnimationFrame(finishLoader);
      } else {
        loader.classList.add('is-loaded');
        window.setTimeout(() => loader.remove(), 700);
      }
    }

    requestAnimationFrame(finishLoader);
  }

  const immersiveToggle = document.getElementById('immersive-toggle');
  if (immersiveToggle) {
    immersiveToggle.addEventListener('click', () => {
      const isImmersive = document.body.classList.toggle('immersive-mode');
      immersiveToggle.setAttribute('aria-pressed', isImmersive ? 'true' : 'false');
      immersiveToggle.textContent = isImmersive ? 'Exit Immersive Mode' : 'Immersive Mode';
    });
  }

  initRadarCanvas();
  initArchiveFlipbook();
}

function initRadarCanvas() {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const targets = Array.from({ length: 18 }, (_, index) => ({
    angle: (index / 18) * Math.PI * 2,
    distance: 0.22 + ((index * 0.137) % 0.63),
    size: 1.4 + ((index * 0.31) % 2.2),
    phase: index * 0.7
  }));

  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function renderRadar(time) {
    const bounds = canvas.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const radius = Math.min(centerX, centerY) * 0.92;

    context.clearRect(0, 0, bounds.width, bounds.height);
    context.save();
    context.translate(centerX, centerY);

    targets.forEach((target) => {
      const pulse = 0.58 + Math.sin(time * 0.002 + target.phase) * 0.32;
      const x = Math.cos(target.angle) * radius * target.distance;
      const y = Math.sin(target.angle) * radius * target.distance;

      context.beginPath();
      context.fillStyle = `rgba(214, 170, 75, ${Math.max(0.18, pulse)})`;
      context.shadowColor = 'rgba(214, 170, 75, 0.8)';
      context.shadowBlur = 8;
      context.arc(x, y, target.size, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
    });

    context.beginPath();
    context.strokeStyle = 'rgba(145, 163, 95, 0.48)';
    context.lineWidth = 1;
    context.moveTo(-radius, 0);
    context.lineTo(radius, 0);
    context.moveTo(0, -radius);
    context.lineTo(0, radius);
    context.stroke();
    context.restore();

    requestAnimationFrame(renderRadar);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(renderRadar);
}

function initArchiveFlipbook() {
  const flipbook = document.getElementById('archive-flipbook');
  const nextButton = document.getElementById('flipbook-next');
  const currentPage = flipbook?.querySelector('.page-current');
  const nextPage = flipbook?.querySelector('.page-next');
  const frameCount = document.getElementById('flipbook-frame-count');

  if (!flipbook || !nextButton || !currentPage || !nextPage) return;

  const frames = [
    'image_1789191662455.png',
    'image_1789191680239.png',
    'image_1789191700352.png',
    'image_1789191748610.png'
  ];
  let currentIndex = 0;
  let isTurning = false;

  nextButton.addEventListener('click', () => {
    if (isTurning) return;
    isTurning = true;

    const nextIndex = (currentIndex + 1) % frames.length;
    const followingIndex = (nextIndex + 1) % frames.length;
    nextPage.src = frames[nextIndex];
    flipbook.classList.add('is-turning');

    window.setTimeout(() => {
      currentPage.src = frames[nextIndex];
      nextPage.src = frames[followingIndex];
      flipbook.classList.remove('is-turning');
      currentIndex = nextIndex;
      isTurning = false;
      if (frameCount) frameCount.textContent = String(currentIndex + 1).padStart(2, '0');
    }, 820);
  });
}
