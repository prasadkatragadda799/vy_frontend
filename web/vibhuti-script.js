// VIBHUTI YOGA - TAB-BASED NAVIGATION (Show/Hide Sections)
// Only the active section is visible. Scrolling stays within that section.
// Switching sections is done ONLY by clicking the nav links.

let currentActiveSection = "home"; // Track which section is currently shown

function getHeaderHeight() {
  const header = document.getElementById("main-header");
  return header ? header.offsetHeight : 120;
}

function updateHeaderOffset() {
  const root = document.documentElement;
  const headerHeight = getHeaderHeight();
  const safeGap = window.innerWidth <= 768 ? 10 : 14;
  root.style.setProperty("--header-offset", `${headerHeight + safeGap}px`);
}

// ── Show a specific section, hide all others ─────────────────────────────────
function scrollToSection(sectionId) {
  showSection(sectionId);
}

function showSection(sectionId) {
  const allSections = document.querySelectorAll(".section-full");
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) return;

  // Registration form should only appear from an explicit Register click.
  // Reset it whenever user leaves the Courses section.
  if (sectionId !== "classes" && typeof window.resetRegistrationFormVisibility === "function") {
    window.resetRegistrationFormVisibility();
  }

  // Hide ALL sections
  allSections.forEach((section) => {
    section.style.display = "none";
  });

  // Show ONLY the target section
  targetSection.style.display = "";

  // Update nav highlight
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkSection =
      link.getAttribute("data-section") ||
      link.getAttribute("href")?.replace("#", "");
    link.classList.remove("active");
    if (linkSection === sectionId) {
      link.classList.add("active");
    }
  });

  // Scroll to the top of the content area
  if (window.innerWidth <= 768) {
    // Mobile: scroll window to top (below header)
    window.scrollTo({ top: 0, behavior: "instant" });
  } else {
    // Desktop: scroll internal container to top
    const scrollContainer = document.getElementById("scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }

  currentActiveSection = sectionId;
}

// ── Initialize: hide all sections except home ────────────────────────────────
function initTabNavigation() {
  const allSections = document.querySelectorAll(".section-full");

  // Hide all sections except home
  allSections.forEach((section) => {
    if (section.id !== "home") {
      section.style.display = "none";
    }
  });

  // Set home as active in nav
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkSection =
      link.getAttribute("data-section") ||
      link.getAttribute("href")?.replace("#", "");
    link.classList.remove("active");
    if (linkSection === "home") {
      link.classList.add("active");
    }
  });
}

function copyUPI() {
  const upiId = "srivsn@icici";
  navigator.clipboard
    .writeText(upiId)
    .then(() => {
      showCopyNotification();
    })
    .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = upiId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showCopyNotification();
    });
}

function showCopyNotification() {
  const notification = document.createElement("div");
  notification.textContent = "✓ UPI ID Copied!";
  notification.className = "copy-notification";
  document.body.appendChild(notification);
  setTimeout(() => {
    if (notification.parentNode) {
      document.body.removeChild(notification);
    }
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  updateHeaderOffset();

  // Initialize tab-based navigation
  initTabNavigation();

  // Navigation link click handlers
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href) {
        showSection(href.substring(1));
      }
    });
  });

  // Add toast CSS
  const style = document.createElement("style");
  style.textContent = `
        .copy-notification {
            position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
            background: #f5d794; color: #1a1442; padding: 12px 24px;
            border-radius: 30px; font-weight: bold; z-index: 10001;
            box-shadow: 0 10px 20px rgba(0,0,0,0.3); animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
    `;
  document.head.appendChild(style);
});

window.addEventListener("load", updateHeaderOffset);
window.addEventListener("resize", updateHeaderOffset, { passive: true });
window.addEventListener("orientationchange", updateHeaderOffset);

window.scrollToSection = scrollToSection;
window.showSection = showSection;
window.copyUPI = copyUPI;

// ============================================================================
// COURSE BENEFITS MODAL LOGIC & TTS
// ============================================================================
let currentModalCourseId = null;

function showCourseStory(courseId) {
  const course = courseData[courseId] ? (courseData[courseId][currentLang] || courseData[courseId]['en']) : null;
  if (!course) return;

  currentModalCourseId = courseId;
  document.getElementById('story-course-title').textContent = course.title;
  document.getElementById('story-course-desc').textContent = course.desc;

  // Try to find main image and set it up
  const cardImg = document.querySelector(`#course-${courseId} img`);
  const storyImg = document.getElementById('story-course-image');

  if (storyImg && cardImg) {
    storyImg.src = cardImg.src;
  }

  // Load extra storytelling image if available
  const extraImgElement = document.getElementById('story-extra-image');
  const gallerySection = document.getElementById('story-gallery-section');
  
  // Create a mapping or logic for extra images
  const extraImgSrc = `assets/${courseId}_detail_1.png`;
  
  // We can pre-check if image exists by trying to load it or just assigning it and using onerror
  extraImgElement.src = extraImgSrc;
  extraImgElement.onload = function() {
      gallerySection.style.display = 'block';
  };
  extraImgElement.onerror = function() {
      gallerySection.style.display = 'none';
  };

  const ul = document.getElementById('story-benefits-ul');
  ul.innerHTML = '';

  if (course.benefitsList) {
    course.benefitsList.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-check-circle"></i> <span>${item}</span>`;
      ul.appendChild(li);
    });
  }

  const page = document.getElementById('course-story-page');
  page.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCourseStory() {
  document.getElementById('course-story-page').classList.remove('active');
  document.body.style.overflow = 'auto'; // Restore scrolling
  window.speechSynthesis.cancel();
}

function speakModalDetails() {
  if (!currentModalCourseId || !courseData[currentModalCourseId]) return;
  const course = courseData[currentModalCourseId][currentLang] || courseData[currentModalCourseId]['en'];

  const benefitsText = course.benefitsList ? course.benefitsList.join('. ') : course.benefits;
  const fullText = `${course.title}. ${course.desc}. Key Benefits include: ${benefitsText}.`;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(fullText);
  if (currentLang === 'te') {
    utterance.lang = 'te-IN';
    if (cachedFemaleVoiceTE) utterance.voice = cachedFemaleVoiceTE;
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
  } else {
    utterance.lang = 'en-IN';
    if (cachedFemaleVoiceEN) utterance.voice = cachedFemaleVoiceEN;
    utterance.rate = 0.8;
    utterance.pitch = 0.9; // Lower pitch, slower rate for a very soft, calming voice
  }

  window.speechSynthesis.speak(utterance);
}

// ============================================================================
// BILINGUAL COURSE DATA (ENGLISH + TELUGU)
// ============================================================================
let currentLang = 'en'; // default English

const courseData = {
  intuition: {
    en: {
      title: 'Intuition Power (3 Levels)',
      desc: 'Wonders of the 6th & 7th Sense — A special camp designed for children aged 6 to 16 (as well as seniors) is being conducted by trainers from Vibhuti Yoga. This training programme is specifically designed to unlock the latent potential within children and to boost their self-confidence. The training refines and sensitises the children\'s senses, sharpens their intellect, and awakens the \'Third Eye\' — the 6th sense — enabling extraordinary perception even while blindfolded. This is a Rishi-inspired programme with proven successes.',
      benefits: 'Enhanced focus and IQ. Boosted creativity. Stress-free goal setting. Increased confidence. Meditation and mindfulness. Improved decision-making skills. Enhanced emotional intelligence. Support for slow learners and hyperactive children. Divine Vision awakened. All facets of academic intelligence sharpened. Latent potential and hidden talents revealed.',
      benefitsList: [
        'Unlocks latent potential within children & boosts self-confidence',
        'Refines and sensitises the children\'s senses — intellect becomes sharper',
        'Children become more active; laziness, stubbornness & rudeness diminish',
        'Interest, concentration & memory skills are significantly enhanced',
        'Fosters a unique sense of inner peace — purifies the mind & brings clarity',
        'Third Eye awakened — identify colours, objects & clothing while blindfolded',
        'Children can run, read, play games, write, colour, draw & skate blindfolded',
        'A Divine Vision is awakened within the children',
        'All facets of academic intelligence are sharpened',
        'Your child\'s latent potential & hidden talents will come to light',
        'Children gain a renewed sense of energy and joy',
        'Common parental concerns (lack of focus/concentration) significantly alleviated',
        'Rishi-inspired training programme with proven successes — a must at a young age'
      ],
      levels: ['🌱 1st Level - Foundation', '🌿 2nd Level - Intermediate', '🌳 3rd Level - Advanced'],
      badge: '3 Levels'
    },
    te: {
      title: 'అంతర్ దృష్టి శక్తి (3 స్థాయిలు)',
      desc: '6వ & 7వ ఇంద్రియాల అద్భుతాలు — 6 నుండి 16 సంవత్సరాల వయసు పిల్లలకు (మరియు పెద్దలకు) ప్రత్యేకంగా రూపొందించబడిన శిబిరం. ఈ శిక్షణ కార్యక్రమం పిల్లల్లోని సుప్త సామర్థ్యాలను వెలికితీసి, వారి ఆత్మవిశ్వాసాన్ని పెంచడానికి రూపొందించబడింది.',
      benefits: 'ఆరవ ఇంద్రియం మరియు ఉన్నత అవగాహన అభివృద్ధి. అంతర్గత మార్గదర్శకత్వం ద్వారా మెరుగైన నిర్ణయాధికారం.',
      benefitsList: [
        'పిల్లల్లోని సుప్త సామర్థ్యాలను వెలికితీయడం & ఆత్మవిశ్వాసం పెంపు',
        'ఇంద్రియాలను పదునుపెట్టడం — బుద్ధి తీక్షణతరం అవుతుంది',
        'పిల్లలు చురుకుగా మారతారు; సోమరితనం & మొండితనం తగ్గుతాయి',
        'ఆసక్తి, ఏకాగ్రత & జ్ఞాపకశక్తి గణనీయంగా మెరుగుపడతాయి',
        'అంతర్గత శాంతి — మనస్సు శుద్ధి & స్పష్టత',
        'మూడవ కన్ను మేల్కొలుపు — కళ్ళు మూసి రంగులు, వస్తువులు గుర్తించగలరు',
        'దివ్య దృష్టి మేల్కొలుపు & విద్యాసంబంధ తెలివి పదునుపడుతుంది',
        'ఋషి-స్ఫూర్తి శిక్షణ కార్యక్రమం — రుజువైన విజయాలతో'
      ],
      levels: ['🌱 1వ స్థాయి - పునాది', '🌿 2వ స్థాయి - మధ్యస్థం', '🌳 3వ స్థాయి - అధునాతనం'],
      badge: '3 స్థాయిలు'
    }
  },
  mind: {
    en: {
      title: 'Mind Power (3 Levels)',
      desc: 'Improves focus, concentration, and cognitive abilities through NLP techniques, stress-free goal setting, and boosted creativity for children. Includes Eklavya Vidye — 100% Memory Power: memorise entire textbook contents in just a few days, remember essential topics forever, replicate thousands of pages in minutes, and score high marks in exams.',
      benefits: 'Laser-sharp focus and concentration. Enhanced memory retention and recall. NLP techniques for overcoming negative patterns. Stress-free goal setting. Boosted creativity. 100% Memory Power through Eklavya Vidye.',
      benefitsList: [
        'Laser-sharp focus & concentration',
        'Enhanced memory retention & recall',
        'NLP techniques for overcoming negative patterns',
        'Stress-free goal setting & planning',
        'Boosted creativity & problem-solving',
        'Increased confidence & self-assurance',
        'Meditation & mindfulness skills',
        'Improved decision-making abilities',
        '📚 Eklavya Vidye — memorise entire textbook contents in a few days',
        'Easily remember essential topics forever',
        'Replicate thousands of pages in minutes',
        'Score high marks in exams with confidence',
        'Relieve confusion, forgetfulness, fatigue & stress',
        'Skills to remember more in less time — allow time for all-round growth',
        '⏱️ Minimum 1 week per course — limited seats per batch'
      ],
      levels: ['🌱 1st Level - Foundation', '🌿 2nd Level - Intermediate', '🌳 3rd Level - Advanced'],
      badge: '3 Levels'
    },
    te: {
      title: 'మనో శక్తి (3 స్థాయిలు)',
      desc: 'మానసిక స్పష్టత మరియు బలాన్ని పెంచే కేంద్రీకృత పద్ధతుల ద్వారా మీ మనస్సు యొక్క శక్తిని సాధించండి. ఏక్లవ్య విద్యే — 100% జ్ఞాపకశక్తి: కొన్ని రోజులలోనే మొత్తం పాఠ్యపుస్తక విషయాలను గుర్తుంచుకోండి.',
      benefits: 'పదునైన ఏకాగ్రత మరియు శ్రద్ధ. మెరుగైన జ్ఞాపకశక్తి. ఒత్తిడి నిర్మూలన మరియు మానసిక శాంతి.',
      benefitsList: [
        'పదునైన ఏకాగ్రత & శ్రద్ధ',
        'మెరుగైన జ్ఞాపకశక్తి & గుర్తుకు తెచ్చుకునే సామర్ధ్యం',
        'ఆలోచనలు & భావోద్వేగాలపై నియంత్రణ',
        'ఒత్తిడి నిర్మూలన & మానసిక శాంతి',
        '📚 ఏక్లవ్య విద్యే — పాఠ్యపుస్తక విషయాలను గుర్తుంచుకోండి',
        'ముఖ్యమైన అంశాలను శాశ్వతంగా గుర్తుంచుకోండి',
        'పరీక్షలలో మంచి మార్కులు సాధించండి',
        'తక్కువ సమయంలో ఎక్కువ గుర్తుంచుకునే నైపుణ్యాలు'
      ],
      levels: ['🌱 1వ స్థాయి - పునాది', '🌿 2వ స్థాయి - మధ్యస్థం', '🌳 3వ స్థాయి - అధునాతనం'],
      badge: '3 స్థాయిలు'
    }
  },
  holistic: {
    en: {
      title: 'Holistic Healing (3 Levels)',
      desc: 'Promotes emotional balance, physical well-being, and a positive mindset. Supports slow learners and hyperactive children with personalized guidance.',
      benefits: 'Emotional balance and well-being. Physical health and vitality. Positive mindset cultivation. Support for slow learners and hyperactive children. Addiction prevention and overall wellness. Personalized attention and holistic development. Better social skills and relationships. Enhanced emotional intelligence.',
      benefitsList: [
        'Emotional balance & physical well-being',
        'Positive mindset & inner peace cultivation',
        'Support for slow learners & hyperactive children',
        'Overall well-being & addiction prevention',
        'Personalized attention & holistic guidance',
        'Better social skills & relationships',
        'Enhanced emotional intelligence',
        'Holistic approach to child development'
      ],
      levels: ['✨ 1st Module - Basics', '💫 2nd Module - Practitioner', '⭐ 3rd Module - Master'],
      badge: '3 Modules'
    },
    te: {
      title: 'సమగ్ర ఉపశమన శక్తి',
      desc: 'శారీరక మరియు ఆధ్యాత్మిక ఆరోగ్యం కోసం విశ్వ శక్తిని ప్రసరింపజేయడానికి పవిత్ర ఉపశమన పద్ధతులను నేర్చుకోండి.',
      benefits: 'శక్తి ప్రసారం ద్వారా మిమ్మల్ని మీరు మరియు ఇతరులను స్వస్థపరచండి. శరీరం నుండి శక్తి అడ్డంకులను తొలగించండి. చక్రాలను సమతుల్యం చేయండి మరియు శక్తి ప్రవాహాన్ని పునరుద్ధరించండి. శారీరక నొప్పి మరియు దీర్ఘకాలిక అనారోగ్యాలను తగ్గించండి. సహజంగా రోగనిరోధక శక్తిని పెంచండి. ధృవీకరించబడిన శక్తి ఉపశమన అభ్యాసకుడు అవ్వండి.',
      benefitsList: [
        'శక్తి ప్రసారం ద్వారా మిమ్మల్ని & ఇతరులను స్వస్థపరచండి',
        'శరీరం నుండి శక్తి అడ్డంకులను తొలగించండి',
        'చక్రాలను సమతుల్యం చేయండి & శక్తి ప్రవాహం పునరుద్ధరించండి',
        'శారీరక నొప్పి & దీర్ఘకాలిక అనారోగ్యాలను తగ్గించండి',
        'సహజంగా రోగనిరోధక శక్తి & జీవశక్తిని పెంచండి',
        'ధృవీకరించబడిన శక్తి ఉపశమన అభ్యాసకుడు అవ్వండి'
      ],
      levels: ['✨ 1వ విభాగం - ప్రాథమిక', '💫 2వ విభాగం - అభ్యాసకుడు', '⭐ 3వ విభాగం - ప్రావీణ్యం'],
      badge: '3 విభాగాలు'
    }
  },
  akul: {
    en: {
      title: 'Akul Science',
      desc: 'Explore the ancient science of Akul — the formless, supreme consciousness beyond creation. A profound journey into the science of the unmanifest.',
      benefits: 'Access higher states of consciousness. Understand the science behind spiritual phenomena. Develop cosmic awareness and universal connection. Experience deep transcendental meditation. Activate dormant brain capacities. Achieve inner stillness and bliss.',
      benefitsList: [
        'Access higher states of consciousness',
        'Understand the science behind spiritual phenomena',
        'Develop cosmic awareness & universal connection',
        'Experience deep transcendental meditation',
        'Activate dormant brain capacities',
        'Achieve inner stillness & bliss (Ananda)'
      ],
      levels: ['🕉️ Theory & Philosophy', '🧘 Practical Meditation', '✨ Advanced Realization'],
      badge: 'New'
    },
    te: {
      title: 'అకుల్ విజ్ఞానం',
      desc: 'అకుల్ యొక్క ప్రాచీన విజ్ఞానాన్ని అన్వేషించండి — సృష్టికి అతీతమైన నిరాకార, పరమాత్మ చైతన్యం. అవ్యక్త విజ్ఞానంలోకి ఒక లోతైన ప్రయాణం.',
      benefits: 'చైతన్యం యొక్క ఉన్నత స్థితులను చేరుకోండి. ఆధ్యాత్మిక దృగ్విషయాల వెనుక ఉన్న విజ్ఞానాన్ని అర్థం చేసుకోండి. విశ్వ అవగాహన మరియు సార్వత్రిక అనుసంధానాన్ని అభివృద్ధి చేయండి. లోతైన అతీంద్రియ ధ్యానాన్ని అనుభవించండి. నిద్రాణ మెదడు సామర్థ్యాలను క్రియాశీలం చేయండి. అంతర్గత నిశ్చలత మరియు ఆనందాన్ని సాధించండి.',
      benefitsList: [
        'చైతన్యం యొక్క ఉన్నత స్థితులను చేరుకోండి',
        'ఆధ్యాత్మిక దృగ్విషయాల విజ్ఞానాన్ని అర్థం చేసుకోండి',
        'విశ్వ అవగాహన & సార్వత్రిక అనుసంధానాన్ని అభివృద్ధి చేయండి',
        'లోతైన అతీంద్రియ ధ్యానాన్ని అనుభవించండి',
        'నిద్రాణ మెదడు సామర్థ్యాలను క్రియాశీలం చేయండి',
        'అంతర్గత నిశ్చలత & ఆనందం (ఆనంద) సాధించండి'
      ],
      levels: ['🕉️ సిద్ధాంతం & తత్వశాస్త్రం', '🧘 ఆచరణాత్మక ధ్యానం', '✨ ఉన్నత సాక్షాత్కారం'],
      badge: 'కొత్త'
    }
  },
  dowsing: {
    en: {
      title: 'Dowsing — The Divine Art',
      desc: 'Dowsing is a divine art mentioned in the Koorma Purana. It is a multi-dimensional practice that explores the negative and positive vibrations of objects and space in the environment, linked with Cosmic Intelligence. Using tools like pendulums, L-rods, or Y-shaped twigs, dowsers detect hidden energy fields and answer questions by tapping into the subconscious mind. This art comes under the Occult Sciences.',
      benefits: 'Detect and measure subtle energy fields. Vastu/Feng Shui negative energy zone detection. Map dowsing and information dowsing. Aura checking and energetic imbalance detection. Field dowsing for locating water, minerals, and objects. Radiesthesia — sensitivity to radiations from materials.',
      benefitsList: [
        'Detect & measure subtle energy fields linked to Cosmic Intelligence',
        'Vastu/Feng Shui — detect negative energy zones & blocked pathways',
        'Field Dowsing — walk the terrain to locate water, minerals & objects',
        'Map Dowsing — locate items at a distance using maps',
        'Information Dowsing — gain spiritual insight on various subjects',
        'Aura checking & energetic imbalance detection',
        'Divination — get guidance on life questions through pendulum',
        'Radiesthesia — sensitivity to radiations emitted from materials',
        'Part of the ancient Occult Sciences tradition'
      ],
      levels: [],
      badge: '🎁 FREE'
    },
    te: {
      title: 'డౌసింగ్ — దివ్య కళ',
      desc: 'డౌసింగ్ కూర్మ పురాణంలో ప్రస్తావించబడిన దివ్య కళ. ఇది పరిసరంలోని వస్తువులు మరియు ప్రదేశం యొక్క ప్రతికూల మరియు సానుకూల కంపనాలను అన్వేషించే బహుళ-ఆయామ అభ్యాసం, విశ్వ బుద్ధితో అనుసంధానమైనది.',
      benefits: 'సూక్ష్మ శక్తి క్షేత్రాలను గుర్తించి కొలవండి. వాస్తు/ఫెంగ్ షుయ్ నెగటివ్ ఎనర్జీ జోన్ డిటెక్షన్.',
      benefitsList: [
        'విశ్వ బుద్ధితో అనుసంధానమైన సూక్ష్మ శక్తి క్షేత్రాల గుర్తింపు',
        'వాస్తు/ఫెంగ్ షుయ్ — ప్రతికూల శక్తి జోన్లు & అడ్డంకుల గుర్తింపు',
        'ఫీల్డ్ డౌసింగ్ — నీరు, ఖనిజాలు & వస్తువుల కనుగొనటం',
        'మ్యాప్ డౌసింగ్ — మ్యాప్‌లను ఉపయోగించి దూరంలో వస్తువుల గుర్తింపు',
        'ఆరా తనిఖీ & శక్తి అసమతుల్యత గుర్తింపు',
        'జీవిత ప్రశ్నలపై లోలకం ద్వారా మార్గదర్శకత్వం',
        'ప్రాచీన అతీంద్రియ విజ్ఞానాల సంప్రదాయంలో భాగం'
      ],
      levels: [],
      badge: '🎁 ఉచితం'
    }
  },
  agni: {
    en: {
      title: 'Nitya Agni Hotram',
      desc: 'Master the sacred Vedic fire technique — harness the transformative power of Agni for purification, energy activation, and spiritual awakening through ancient fire rituals.',
      benefits: 'Purify body, mind and environment with sacred fire. Boost digestive fire for health. Transform negative karma through fire rituals. Activate inner spiritual fire. Create protective energy shield around you. Harness fire element for manifestation power.',
      benefitsList: [
        'Purify body, mind & environment with sacred fire',
        'Boost digestive fire (Jatharagni) for health',
        'Transform negative karma through fire rituals',
        'Activate inner spiritual fire (Kundalini)',
        'Create protective energy shield around you',
        'Harness fire element for manifestation power'
      ],
      levels: [],
      badge: '🎁 FREE'
    },
    te: {
      title: 'నిత్య అగ్ని హోత్రం',
      desc: 'పవిత్ర వేద అగ్ని పద్ధతిని సాధించండి — ప్రాచీన అగ్ని కర్మల ద్వారా శుద్ధీకరణ, శక్తి క్రియాశీలత మరియు ఆధ్యాత్మిక మేల్కొలుపు కోసం అగ్ని యొక్క పరివర్తన శక్తిని ఉపయోగించుకోండి.',
      benefits: 'పవిత్ర అగ్నితో శరీరం, మనస్సు మరియు పరిసరాలను శుద్ధి చేయండి. ఆరోగ్యం కోసం జఠరాగ్నిని పెంచండి. అగ్ని కర్మల ద్వారా ప్రతికూల కర్మను రూపాంతరం చేయండి. అంతర్గత ఆధ్యాత్మిక అగ్నిని క్రియాశీలం చేయండి. మీ చుట్టూ రక్షణాత్మక శక్తి కవచాన్ని సృష్టించండి. వ్యక్తీకరణ శక్తి కోసం అగ్ని మూలకాన్ని ఉపయోగించుకోండి.',
      benefitsList: [
        'పవిత్ర అగ్నితో శరీరం, మనస్సు & పరిసరాలను శుద్ధి',
        'ఆరోగ్యం కోసం జఠరాగ్నిని పెంచండి',
        'అగ్ని కర్మల ద్వారా ప్రతికూల కర్మ రూపాంతరం',
        'అంతర్గత ఆధ్యాత్మిక అగ్ని (కుండలిని) క్రియాశీలత',
        'మీ చుట్టూ రక్షణాత్మక శక్తి కవచం సృష్టి',
        'వ్యక్తీకరణ శక్తి కోసం అగ్ని మూలకం ఉపయోగం'
      ],
      levels: [],
      badge: '🎁 ఉచితం'
    }
  },
  vaasthu: {
    en: {
      title: 'Vaasthu Vidya — Vedic Science of Space',
      desc: 'Vaasthu Vidya is an ancient Vedic science pioneered by Vishwakarma and Mayudu. Every house and structure is surrounded by planetary vibrations and Cosmic Energy. Where there are negative vibrations, they must be converted into positive vibrations to ensure a smooth life. If you have a Vaasthu issue in your house or business sector, you need not worry — no need to spend more money. With simple remedies, the energy dimensions can be corrected without heavy expense — no need to demolish or rebuild. This art comes under the Occult Sciences.',
      benefits: 'Identify negative vibrations in homes and business spaces. Convert negative energy dimensions to positive. Simple remedies without costly rebuilding.',
      benefitsList: [
        'Identify negative vibrations in homes & business spaces',
        'Convert negative energy to positive through simple remedies',
        'No demolition or costly rebuilding needed — no heavy expense',
        'Align structures with planetary vibrations & Cosmic Energy',
        'Ensure smooth & prosperous life through energy correction',
        'Simple remedies to change the energy dimensions for Vaasthu correction',
        'Ancient Vedic science pioneered by Vishwakarma & Mayudu',
        'Part of the Occult Sciences tradition',
        'Personalised Vaasthu consultation & correction'
      ],
      levels: [],
      badge: '🎁 FREE'
    },
    te: {
      title: 'వాస్తు విద్య — వేద ప్రదేశ విజ్ఞానం',
      desc: 'వాస్తు విద్య విశ్వకర్మ మరియు మయుడు ద్వారా ప్రారంభించబడిన ప్రాచీన వేద విజ్ఞానం. ప్రతి ఇల్లు మరియు నిర్మాణం గ్రహ కంపనాలు మరియు విశ్వ శక్తితో చుట్టబడి ఉంటుంది. సాధారణ ఉపాయాలతో శక్తి కొలతలను సరిచేయవచ్చు — ఎక్కువ ఖర్చు అవసరం లేదు.',
      benefitsList: [
        'ఇళ్లు & వ్యాపార ప్రదేశాలలో ప్రతికూల కంపనాల గుర్తింపు',
        'సాధారణ ఉపాయాల ద్వారా ప్రతికూల శక్తిని సానుకూలంగా మార్చడం',
        'కూల్చివేత లేదా ఖరీదైన పునర్నిర్మాణం అవసరం లేదు',
        'గ్రహ కంపనాలు & విశ్వ శక్తితో నిర్మాణాల సమలేఖనం',
        'శక్తి దిద్దుబాటు ద్వారా సజావు & సంపన్న జీవనం',
        'వాస్తు దిద్దుబాటు కోసం శక్తి కొలతలను సాధారణ ఉపాయాలతో మార్చండి',
        'విశ్వకర్మ & మయుడు ప్రారంభించిన ప్రాచీన వేద విజ్ఞానం',
        'అతీంద్రియ విజ్ఞానాల సంప్రదాయంలో భాగం'
      ],
      levels: [],
      badge: '🎁 ఉచితం'
    }
  },
  eklavya: {
    en: {
      title: 'Eklavya Vidye — 100% Memory Power',
      desc: '100% Mind Power Eklavya Vidye — memorise entire textbook contents in just a few days! Easily remember essential topics forever, replicate thousands of pages in minutes, score high marks in exams, and get a chance to become a world talent.',
      benefits: 'Memorise entire text contents in a few days. Easy to remember essential text topics forever. Replicate thousands of pages in minutes. Score good marks in exams. Relieve confusion, forgetfulness, fatigue, depression, and stress. Gain health and happiness. Remember more in less time. Allow time for all-round growth.',
      benefitsList: [
        'Memorise entire textbook contents in just a few days',
        'Easily remember essential topics forever',
        'Replicate thousands of pages in minutes',
        'Score high marks in exams with confidence',
        'Chance to become a world talent',
        'Relieve confusion, forgetfulness, fatigue & depression',
        'Gain health, happiness & stress-free learning',
        'Skills to remember more in less time',
        'Allow time for all-round growth & development'
      ],
      levels: ['📚 Minimum 1 week per course', '🎯 Limited seats per batch'],
      badge: '🎁 FREE'
    },
    te: {
      title: 'ఏక్లవ్య విద్యే — 100% జ్ఞాపకశక్తి',
      desc: '100% మైండ్ పవర్ ఏక్లవ్య విద్యే — కొన్ని రోజులలోనే మొత్తం పాఠ్యపుస్తక విషయాలను గుర్తుంచుకోండి! ముఖ్యమైన అంశాలను శాశ్వతంగా గుర్తుంచుకోండి, నిమిషాలలో వేల పేజీలను పునరుత్పత్తి చేయండి.',
      benefitsList: [
        'కొన్ని రోజులలోనే మొత్తం పాఠ్యపుస్తక విషయాలను గుర్తుంచుకోండి',
        'ముఖ్యమైన అంశాలను శాశ్వతంగా గుర్తుంచుకోండి',
        'నిమిషాలలో వేల పేజీలను పునరుత్పత్తి చేయండి',
        'పరీక్షలలో మంచి మార్కులు సాధించండి',
        'ప్రపంచ ప్రతిభావంతులు అయ్యే అవకాశం',
        'గందరగోళం, మరపు, అలసట & ఒత్తిడిని తొలగించండి',
        'ఆరోగ్యం, ఆనందం & ఒత్తిడి-రహిత అభ్యాసం',
        'తక్కువ సమయంలో ఎక్కువ గుర్తుంచుకునే నైపుణ్యాలు',
        'సర్వతోముఖ అభివృద్ధి కోసం సమయం'
      ],
      levels: ['📚 ప్రతి కోర్సుకు కనీసం 1 వారం', '🎯 ప్రతి బ్యాచ్‌కు పరిమిత సీట్లు'],
      badge: '🎁 ఉచితం'
    }
  },
  dhanur: {
    en: {
      title: 'Dhanur Vidya (धनुर्विद्या)',
      desc: 'The ancient Vedic science of archery & martial arts — one of the 64 Kalas. Encompasses bow, arrows, divine weapons, mental discipline & warrior ethics.',
      benefits: 'Develop warrior-level focus and discipline. Master ancient combat and self-defense arts. Build unshakeable mental fortitude. Connect with Kshatriya dharma lineage. Physical fitness and agility enhancement. Inner conquest, conquer the self.',
      benefitsList: [
        'Develop warrior-level focus & discipline',
        'Master ancient combat & self-defense arts',
        'Build unshakeable mental fortitude',
        'Connect with Kshatriya dharma lineage',
        'Physical fitness & agility enhancement',
        'Inner conquest — conquer the self'
      ],
      levels: ['🏹 Astra Vidya — Divine Weapons', '⚔️ Shastra Vidya — Combat Skills', '🧠 Dharana — Mental Discipline'],
      badge: '🏹 Partner'
    },
    te: {
      title: 'ధనుర్ విద్య (धनुर्विद्या)',
      desc: '64 కళలలో ఒకటైన విలువిద్య & యుద్ధ కళల ప్రాచీన వేద విజ్ఞానం. విల్లు, బాణాలు, దివ్యాస్త్రాలు, మానసిక క్రమశిక్షణ & క్షత్రియ ధర్మాన్ని కలిగి ఉంటుంది.',
      benefits: 'యోధ-స్థాయి ఫోకస్ మరియు క్రమశిక్షణ అభివృద్ధి. ప్రాచీన పోరాట మరియు ఆత్మ రక్షణ కళలను అధిగమించండి. చెదరని మానసిక ధృడత్వాన్ని నిర్మించండి. క్షత్రియ ధర్మ వంశంతో అనుసంధానం. శారీరక దృఢత్వం మరియు చురుకుదనం పెంపు. అంతర్గత విజయం — ఆత్మను జయించడం.',
      benefitsList: [
        'యోధ-స్థాయి ఫోకస్ & క్రమశిక్షణ అభివృద్ధి',
        'ప్రాచీన పోరాట & ఆత్మ రక్షణ కళలను నేర్చుకోండి',
        'చెదరని మానసిక ధృడత్వాన్ని నిర్మించండి',
        'క్షత్రియ ధర్మ వంశంతో అనుసంధానం',
        'శారీరక దృఢత్వం & చురుకుదనం పెంపు',
        'అంతర్గత విజయం — ఆత్మను జయించడం'
      ],
      levels: ['🏹 అస్త్ర విద్య — దివ్యాస్త్రాలు', '⚔️ శస్త్ర విద్య — పోరాట నైపుణ్యాలు', '🧠 ధారణ — మానసిక క్రమశిక్షణ'],
      badge: '🏹 భాగస్వామి'
    }
  },
  sri: {
    en: {
      title: 'Sri Vidya (श्रीविद्या)',
      desc: 'The supreme Tantric-Vedic tradition of worshipping Devi. A profound path focusing deeply on Sri Durga Sapta Sadi and Varahi Sadhana.',
      benefits: 'Supreme spiritual realization and liberation. Divine Mother grace and protection. Kundalini Shakti awakening and ascension. Material abundance through spiritual alignment. Mastery over the three states of consciousness. Connection with ancient Guru Parampara.',
      benefitsList: [
        'Supreme spiritual realization & liberation',
        'Divine Mother\'s grace & protection',
        'Kundalini Shakti awakening & ascension',
        'Material abundance through spiritual alignment',
        'Mastery over the three states of consciousness',
        'Connection with ancient Guru Parampara'
      ],
      levels: ['🌺 Sri Durga Sapta Sadi', '🔱 Varahi Sadhana', '🌙 Sri Chakra Worship'],
      badge: '🔱 Partner'
    },
    te: {
      title: 'శ్రీ విద్య (श्रीविद्या)',
      desc: 'దేవి (శక్తి) ని పరమ సత్యంగా — స్త్రీ రూపంలో పరబ్రహ్మగా ఆరాధించే అత్యున్నత తాంత్రిక-వేద సంప్రదాయం. పవిత్ర శ్రీ చక్ర ఆరాధన.',
      benefits: 'అత్యున్నత ఆధ్యాత్మిక సాక్షాత్కారం మరియు మోక్షం. దివ్య మాత కృప మరియు రక్షణ. కుండలిని శక్తి మేల్కొలుపు మరియు ఆరోహణ. ఆధ్యాత్మిక సమతుల్యత ద్వారా భౌతిక సమృద్ధి. చైతన్యం యొక్క మూడు స్థితులపై పట్టు. ప్రాచీన గురు పరంపరతో అనుసంధానం.',
      benefitsList: [
        'అత్యున్నత ఆధ్యాత్మిక సాక్షాత్కారం & మోక్షం',
        'దివ్య మాత కృప & రక్షణ',
        'కుండలిని శక్తి మేల్కొలుపు & ఆరోహణ',
        'ఆధ్యాత్మిక సమతుల్యత ద్వారా భౌతిక సమృద్ధి',
        'చైతన్యం యొక్క మూడు స్థితులపై పట్టు',
        'ప్రాచీన గురు పరంపరతో అనుసంధానం'
      ],
      levels: ['🌺 శ్రీ చక్ర / యంత్ర ఆరాధన', '🔱 పంచదశీ మంత్ర దీక్ష', '🌙 కుండలిని శక్తి మేల్కొలుపు'],
      badge: '🔱 భాగస్వామి'
    }
  },
  healing: {
    en: {
      title: '🙏 Aura Cleansing & Energy Healing',
      desc: 'Experience divine healing through the power of ancient Sanatana practices. Our expert healers cleanse negative aura, remove malefic energy attachments, balance disturbed chakras, and restore your natural divine light.',
      benefitsList: [
        'Complete aura purification & energetic reset',
        'Removal of evil eye (Nazar Dosh) & black magic effects',
        'Release of ancestral & karmic burdens',
        'Deep emotional trauma healing',
        'Enhanced spiritual protection for home & family',
        'Restoration of positive energy flow in life',
        'Relief from unexplained physical symptoms',
        'Mental clarity & removal of confusion/brain fog'
      ]
    },
    te: {
      title: '🙏 ఆరా శుద్ధీకరణ & శక్తి నయం',
      desc: 'ప్రాచీన సనాతన ఆచారాల శక్తి ద్వారా దివ్య ఉపశమనాన్ని అనుభవించండి. మా నిపుణ ఉపశమనకారులు ప్రతికూల ఆరాను శుద్ధి చేస్తారు, హానికరమైన శక్తి సంబంధాలను తొలగిస్తారు, అసమతుల్య చక్రాలను సమతుల్యం చేస్తారు మరియు మీ సహజ దివ్య కాంతిని పునరుద్ధరిస్తారు.',
      benefitsList: [
        'పూర్తి ఆరా శుద్ధీకరణ & శక్తి పునరుద్ధరణ',
        'దృష్టి దోషం (నజర్ దోష్) & మాయాజాలం ప్రభావాల తొలగింపు',
        'వంశపారంపర్య & కర్మ భారాల విడుదల',
        'లోతైన భావోద్వేగ గాయం నయం',
        'ఇల్లు & కుటుంబానికి మెరుగైన ఆధ్యాత్మిక రక్షణ',
        'జీవితంలో సానుకూల శక్తి ప్రవాహం పునరుద్ధరణ',
        'వివరించలేని శారీరక లక్షణాల నుండి ఉపశమనం',
        'మానసిక స్పష్టత & గందరగోళం తొలగింపు'
      ]
    }
  }
};

// Static UI translations
const uiTranslations = {
  en: {
    ourCourses: 'Our Courses',
    freeTechniques: 'Free Techniques & Divine Sciences',
    freeTechSubtitle: 'These powerful techniques are included <strong>FREE</strong> when you register for any of our courses above',
    advancedVidyas: 'Advanced Divine Sciences (Vidyas)',
    vidyaSubtitle: 'We partner with expert Gurus for these advanced sacred sciences. <strong>We\'ll guide you to the right master.</strong>',
    divineHealing: 'Divine Healing Services',
    tapExplore: '✨ Tap to Explore Benefits',
    keyBenefits: '🌟 Key Benefits',
    register: 'Register',
    enquire: 'Enquire & Get Referred',
    freeNote: 'Included free with any course registration',
    referredCourse: 'Referred Course',
    healingTitle: '🙏 Aura Cleansing & Energy Healing',
    healingDesc: 'Experience divine healing through the power of ancient Sanatana practices. Our expert healers cleanse negative aura, remove malefic energy attachments, balance disturbed chakras, and restore your natural divine light.',
    healingFeatures: ['Negative Energy Removal', 'Aura Cleansing & Purification', 'Chakra Balancing & Alignment', 'Spiritual Protection Shield', 'Karmic Debt Cleansing', 'Emotional & Mental Healing'],
    healingBenefitsTitle: '🌟 Healing Benefits',
    healingBenefits: [
      'Complete aura purification & energetic reset',
      'Removal of evil eye (Nazar Dosh) & black magic effects',
      'Release of ancestral & karmic burdens',
      'Deep emotional trauma healing',
      'Enhanced spiritual protection for home & family',
      'Restoration of positive energy flow in life',
      'Relief from unexplained physical symptoms',
      'Mental clarity & removal of confusion/brain fog'
    ],
    bookHealing: 'Healing Requisition Form',
    healingPriceNote: 'Healing sessions are personalized. Contact us for consultation & pricing details.',
    tapExploreHealing: '✨ Tap to Explore Full Benefits',
    connectionTitle: '🌺 Connection to Vibhuti Yoga & Sanatana Vidya',
    connectionDhanur: 'Kshaatra — the outer warrior path, disciplined action',
    connectionSri: 'Brahma — the inner path of consciousness and devotion',
    connectionSummary: 'Together they represent the complete human being — the warrior with a refined inner life, and the devotee with a disciplined will — the very spirit of Sanatana Dharma.'
  },
  te: {
    ourCourses: 'మా కోర్సులు',
    freeTechniques: 'ఉచిత టెక్నిక్‌లు & దివ్య విజ్ఞానాలు',
    freeTechSubtitle: 'ఈ శక్తివంతమైన టెక్నిక్‌లు మీరు పైన ఉన్న ఏదైనా కోర్సుకు నమోదు చేసుకున్నప్పుడు <strong>ఉచితంగా</strong> చేర్చబడతాయి',
    advancedVidyas: 'ఆధునాతన దివ్య విజ్ఞానాలు (విద్యలు)',
    vidyaSubtitle: 'ఈ ఆధునాతన పవిత్ర విజ్ఞానాల కోసం మేము నిపుణ గురువులతో భాగస్వామ్యం కలిగి ఉన్నాము. <strong>మేము మిమ్మల్ని సరైన గురువు వద్దకు మార్గదర్శకత్వం చేస్తాము.</strong>',
    divineHealing: 'దివ్య నయం సేవలు',
    tapExplore: '✨ ప్రయోజనాలను అన్వేషించండి',
    keyBenefits: '🌟 ముఖ్య ప్రయోజనాలు',
    register: 'నమోదు',
    enquire: 'విచారించండి & రెఫరల్ పొందండి',
    freeNote: 'ఏదైనా కోర్సు నమోదుతో ఉచితంగా చేర్చబడింది',
    referredCourse: 'రెఫర్ చేయబడిన కోర్సు',
    healingTitle: '🙏 ఆరా శుద్ధీకరణ & శక్తి నయం',
    healingDesc: 'ప్రాచీన సనాతన ఆచారాల శక్తి ద్వారా దివ్య ఉపశమనాన్ని అనుభవించండి. మా నిపుణ ఉపశమనకారులు ప్రతికూల ఆరాను శుద్ధి చేస్తారు, హానికరమైన శక్తి సంబంధాలను తొలగిస్తారు, అసమతుల్య చక్రాలను సమతుల్యం చేస్తారు మరియు మీ సహజ దివ్య కాంతిని పునరుద్ధరిస్తారు.',
    healingFeatures: ['ప్రతికూల శక్తి తొలగింపు', 'ఆరా శుద్ధీకరణ & పవిత్రీకరణ', 'చక్ర సమతుల్యం & సమలేఖనం', 'ఆధ్యాత్మిక రక్షణ కవచం', 'కర్మ రుణ శుద్ధీకరణ', 'భావోద్వేగ & మానసిక నయం'],
    healingBenefitsTitle: '🌟 నయం ప్రయోజనాలు',
    healingBenefits: [
      'పూర్తి ఆరా శుద్ధీకరణ & శక్తి పునరుద్ధరణ',
      'దృష్టి దోషం (నజర్ దోష్) & మాయాజాలం ప్రభావాల తొలగింపు',
      'వంశపారంపర్య & కర్మ భారాల విడుదల',
      'లోతైన భావోద్వేగ గాయం నయం',
      'ఇల్లు & కుటుంబానికి మెరుగైన ఆధ్యాత్మిక రక్షణ',
      'జీవితంలో సానుకూల శక్తి ప్రవాహం పునరుద్ధరణ',
      'వివరించలేని శారీరక లక్షణాల నుండి ఉపశమనం',
      'మానసిక స్పష్టత & గందరగోళం తొలగింపు'
    ],
    bookHealing: 'హీలింగ్ అభ్యర్థన ఫారం',
    healingPriceNote: 'నయం సెషన్లు వ్యక్తిగతీకరించబడతాయి. సంప్రదింపు & ధరల వివరాల కోసం మమ్మల్ని సంప్రదించండి.',
    tapExploreHealing: '✨ పూర్తి ప్రయోజనాలను అన్వేషించండి',
    connectionTitle: '🌺 విభూతి యోగ & సనాతన విద్యతో అనుసంధానం',
    connectionDhanur: 'క్షాత్ర — బాహ్య యోధ మార్గం, క్రమశిక్షణతో కూడిన చర్య',
    connectionSri: 'బ్రహ్మ — చైతన్యం మరియు భక్తి యొక్క అంతర్గత మార్గం',
    connectionSummary: 'కలిసి వారు పూర్తి మానవుడిని సూచిస్తారు — పరిష్కృతమైన అంతర్గత జీవితంతో కూడిన యోధుడు, మరియు క్రమశిక్షణతో కూడిన సంకల్పంతో కూడిన భక్తుడు — సనాతన ధర్మ స్ఫూర్తి.'
  }
};

// ============================================================================
// FEMALE VOICE SELECTION + TTS
// ============================================================================
let voicesLoaded = false;
let cachedFemaleVoiceEN = null;
let cachedFemaleVoiceTE = null;

function loadVoices() {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;
  voicesLoaded = true;

  // Find soft-spoken female English voice (calm, Indian or gentle British/Samantha preferred)
  const femaleKeywords = ['samantha', 'veena', 'neerja', 'lekha', 'google uk english female', 'female', 'woman', 'fiona', 'moira', 'victoria'];
  const indianKeywords = ['india', 'indian', 'hindi', 'en-in', 'en_in', 'veena', 'neerja', 'lekha'];

  // Priority 1: Indian female voice
  cachedFemaleVoiceEN = voices.find(v =>
    v.lang.toLowerCase().includes('en') &&
    (indianKeywords.some(k => v.name.toLowerCase().includes(k) || v.lang.toLowerCase().includes(k))) &&
    femaleKeywords.some(k => v.name.toLowerCase().includes(k))
  );

  // Priority 2: Any female English voice
  if (!cachedFemaleVoiceEN) {
    cachedFemaleVoiceEN = voices.find(v =>
      v.lang.toLowerCase().startsWith('en') &&
      femaleKeywords.some(k => v.name.toLowerCase().includes(k))
    );
  }

  // Priority 3: Google UK English Female (very common)
  if (!cachedFemaleVoiceEN) {
    cachedFemaleVoiceEN = voices.find(v => v.name.toLowerCase().includes('google uk english female'));
  }

  // Priority 4: Any high-pitched English voice
  if (!cachedFemaleVoiceEN) {
    cachedFemaleVoiceEN = voices.find(v => v.lang.toLowerCase().startsWith('en'));
  }

  // Find Telugu voice
  cachedFemaleVoiceTE = voices.find(v => v.lang.toLowerCase().includes('te'));
  if (!cachedFemaleVoiceTE) {
    cachedFemaleVoiceTE = voices.find(v => v.name.toLowerCase().includes('telugu'));
  }

  console.log('🔊 English voice:', cachedFemaleVoiceEN?.name || 'default');
  console.log('🔊 Telugu voice:', cachedFemaleVoiceTE?.name || 'default (will use lang tag)');
}

// Load voices
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices(); // try immediately
}

let currentSpeech = null;

function speakCourse(courseId) {
  const data = courseData[courseId];
  if (!data) return;

  const langData = data[currentLang];
  if (!langData) return;

  // Stop any current speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.course-tts-btn.speaking').forEach(btn => {
      btn.classList.remove('speaking');
    });
    if (currentSpeech === courseId) {
      currentSpeech = null;
      return;
    }
  }

  const keyBenefitsLabel = currentLang === 'te' ? 'ముఖ్య ప్రయోజనాలు' : 'Key benefits';
  const benefitsText = Array.isArray(langData.benefitsList)
    ? langData.benefitsList.join('. ')
    : (langData.benefits || '');
  const text = `${langData.title}. ${langData.desc} ${keyBenefitsLabel}: ${benefitsText}`;
  const utterance = new SpeechSynthesisUtterance(text);

  if (currentLang === 'te') {
    utterance.lang = 'te-IN';
    if (cachedFemaleVoiceTE) utterance.voice = cachedFemaleVoiceTE;
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
  } else {
    utterance.lang = 'en-IN';
    if (cachedFemaleVoiceEN) utterance.voice = cachedFemaleVoiceEN;
    utterance.rate = 0.8;
    utterance.pitch = 0.9; // Lower pitch, slower rate for a soft, calming presentation
  }

  // Find and highlight the button
  const card = document.getElementById(`course-${courseId}`);
  const btn = card ? card.querySelector('.course-tts-btn') : null;

  if (btn) btn.classList.add('speaking');
  currentSpeech = courseId;

  utterance.onend = () => {
    if (btn) btn.classList.remove('speaking');
    currentSpeech = null;
  };
  utterance.onerror = () => {
    if (btn) btn.classList.remove('speaking');
    currentSpeech = null;
  };

  window.speechSynthesis.speak(utterance);
}

// ============================================================================
// LANGUAGE SWITCHING
// ============================================================================
function switchLanguage(lang) {
  if (lang !== 'en' && lang !== 'te') return;
  currentLang = lang;

  // Stop any ongoing speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.course-tts-btn.speaking').forEach(btn => {
      btn.classList.remove('speaking');
    });
  }

  // Update toggle UI
  const toggleEN = document.getElementById('lang-toggle-en');
  const toggleTE = document.getElementById('lang-toggle-te');
  if (toggleEN && toggleTE) {
    toggleEN.classList.toggle('active', lang === 'en');
    toggleTE.classList.toggle('active', lang === 'te');
  }

  const ui = uiTranslations[lang];

  // Update section headings
  updateText('heading-our-courses', ui.ourCourses);
  updateText('heading-free-tech', ui.freeTechniques);
  updateHTML('subtitle-free-tech', ui.freeTechSubtitle);
  updateText('heading-vidyas', ui.advancedVidyas);
  updateHTML('subtitle-vidyas', ui.vidyaSubtitle);
  updateText('heading-healing', ui.divineHealing);

  // Update connection block
  updateText('connection-title-text', ui.connectionTitle);
  updateText('connection-dhanur-val', ui.connectionDhanur);
  updateText('connection-sri-val', ui.connectionSri);
  updateText('connection-summary-text', ui.connectionSummary);

  // Update healing block
  updateText('healing-title-text', ui.healingTitle);
  updateText('healing-desc-text', ui.healingDesc);
  updateText('healing-book-btn-text', ui.bookHealing);
  updateText('healing-price-note', ui.healingPriceNote);
  updateText('healing-benefits-title', ui.healingBenefitsTitle);

  // Update healing features
  const healingFeatureEls = document.querySelectorAll('[data-healing-feature]');
  healingFeatureEls.forEach((el, i) => {
    if (ui.healingFeatures[i]) el.textContent = ui.healingFeatures[i];
  });

  // Update healing benefits
  const healingBenefitEls = document.querySelectorAll('[data-healing-benefit]');
  healingBenefitEls.forEach((el, i) => {
    if (ui.healingBenefits[i]) el.textContent = ui.healingBenefits[i];
  });

  // Update each course card
  Object.keys(courseData).forEach(courseId => {
    const data = courseData[courseId][lang];
    if (!data) return;

    // Title
    updateText(`title-${courseId}`, data.title);
    // Description
    updateText(`desc-${courseId}`, data.desc);
    // Badge
    updateText(`badge-${courseId}`, data.badge);
    // Benefits title
    updateText(`benefits-title-${courseId}`, ui.keyBenefits);
    // Explore button text
    updateText(`explore-btn-${courseId}`, ui.tapExplore);

    // Benefits list items
    const benefitsItems = document.querySelectorAll(`[data-benefit-item="${courseId}"]`);
    benefitsItems.forEach((el, i) => {
      if (data.benefitsList[i]) el.textContent = data.benefitsList[i];
    });

    // Level items
    const levelItems = document.querySelectorAll(`[data-level-item="${courseId}"]`);
    levelItems.forEach((el, i) => {
      if (data.levels[i]) el.textContent = data.levels[i];
    });

    // Register/Enquire buttons
    const regBtn = document.querySelector(`#course-${courseId} [data-register-text]`);
    if (regBtn) {
      const isRef = regBtn.hasAttribute('data-reference');
      regBtn.childNodes.forEach(node => {
        if (node.nodeType === 3) { // text node
          node.textContent = ' ' + (isRef ? ui.enquire : ui.register);
        }
      });
    }

    // Free note
    const freeNote = document.querySelector(`#course-${courseId} [data-free-note]`);
    if (freeNote) {
      freeNote.childNodes.forEach(node => {
        if (node.nodeType === 3) node.textContent = ' ' + ui.freeNote;
      });
    }

    // Referred Course badge
    const refBadge = document.querySelector(`#course-${courseId} [data-ref-badge]`);
    if (refBadge) {
      refBadge.childNodes.forEach(node => {
        if (node.nodeType === 3) node.textContent = ' ' + ui.referredCourse;
      });
    }
  });

  // Update explore buttons for healing
  const healExploreBtn = document.getElementById('explore-btn-healing');
  if (healExploreBtn) healExploreBtn.textContent = ui.tapExploreHealing;
}

function updateText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function updateHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// Make functions globally accessible
window.toggleBenefits = toggleBenefits;
window.speakCourse = speakCourse;
window.switchLanguage = switchLanguage;
window.switchVidyaTab = function () { }; // Keep for compatibility
