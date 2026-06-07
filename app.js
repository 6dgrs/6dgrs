const screens = [...document.querySelectorAll(".screen")];
const bottomNavTargets = [
  { label: "Home", screen: "home" },
  { label: "Network", screen: "network-list" },
  { label: "Chats", screen: "chats" },
  { label: "Profile", screen: "my-profile" }
];

let tripReturnTarget = "trusted";
let homeFilter = "all";
let chatFilter = "all";
let chatMode = "default";
let verificationMethod = "qr";
let introMethod = "mutual";
let trustedMode = "onboarding";
let qrReturnTarget = "home";
let planFilter = "hosting";
let selectedPlanStatus = "discoverable";
let selectedPlanName = "Coffee in Shoreditch";
let requestFilter = "intro";
let networkFilter = "trusted";
let selectedProfileName = "Emma Laurent";
let verificationCountdownTimer = null;
let homeTripDateRange = "8/11/26-15/11/26";
let activeHomeTripId = "barcelona-nov";
let activeHomeCity = "Barcelona";
let activeHomeSelectorValue = "barcelona-nov";
let tripEditorMode = "create";
let editingTripId = null;
let instagramAccessUnlocked = false;
let onboardingSlide = 0;
let onboardingTimer = null;
let activeChatDetailMode = "default";
let selectedChatName = "Emma Laurent";
let selectedChatPath = "You → Laura → Emma";
let selectedChatPreview = "Friday works. Laura vouched for you.";
let pendingArchiveChatCard = null;
let pendingDeleteChatKey = "";
let pendingDeleteChatName = "";
let introThreadStarted = false;
let introThreadLeft = false;
let chatReturnTarget = "home";
let activeSettingsDetail = "phone";
const removedConnections = new Set();
const deletedChatKeys = new Set();
const screenHistory = [];
const rootScreens = new Set(["welcome", "home", "network-list", "chats", "my-profile"]);
const dirtyScreens = new Set(["basics", "profile-setup", "trip", "request-intro", "create-plan", "edit-plan", "edit-profile", "plan-chat"]);
const backFallbacks = {
  basics: "welcome",
  "profile-setup": "basics",
  trip: "trusted",
  trusted: "profile-setup",
  privacy: "trusted",
  "qr-reveal": "my-profile",
  "trusted-plans": "home",
  "nearby-people": "home",
  "suggested-connections": "home",
  "all-trips": "my-profile",
  "my-plans": "my-profile",
  "person-trips": "profile",
  "person-plans": "profile",
  "create-plan": "trusted-plans",
  "edit-plan": "my-plans",
  "plan-detail": "trusted-plans",
  "plan-requests": "edit-plan",
  "plan-chat": "chats",
  "city-mutuals": "home",
  "network-map": "network-list",
  "request-intro": "profile",
  "chat-detail": "chats",
  verify: "chat-detail",
  unlocked: "network-list",
  "edit-profile": "my-profile",
  settings: "my-profile",
  "settings-detail": "settings",
  notifications: "my-profile",
  "connection-requests": "my-profile",
  "safety-centre": "my-profile",
  "how-works": "my-profile",
  profile: "home"
};
const prototypeStorageKey = "sixdgrsPrototypeState";
const trustedFriendState = {
  used: 4,
  launchCap: 6,
  absoluteCap: 12,
  verifiedMeetups: 1,
  hostedPlans: 0,
  vouches: 1
};

const settingsState = {
  privacy: {
    currentCity: "Trusted connections only",
    trips: "Mutuals",
    intros: "Full trusted network",
    instagram: "Accepted connections",
    profile: "Trusted connections only"
  },
  notifications: {
    introRequests: true,
    acceptedRequests: true,
    tripOverlaps: true,
    trustedPlans: true,
    networkUnlocked: true,
    chatMessages: true
  },
  appearance: "Light",
  connectedAccounts: {
    instagram: true
  },
  blockedUsers: ["Mina Aoki", "Ren Sato"],
  reportHistory: ["Profile concern · Emma Laurent", "Plan report · Jazz night", "Safety note · Mayfair"]
};

const appState = {
  pendingIntroRequestActive: true,
  introRequestDeclined: false,
  introRequestAccepted: false,
  notificationsRead: false,
  generatedTrips: 0,
  confirmedMeetups: [],
  metConnections: [],
  trustedConnections: [],
  vouchedConnections: [],
  feedback: []
};

const notificationItems = [
  { id: "intro-noah", kind: "intro", title: "Intro request received", body: "Noah asked Laura to introduce you.", profile: "Noah Silva", active: true },
  { id: "plan-sofia", kind: "plan", title: "Plan join request", body: "Sofia requested to join Coffee in Shoreditch.", profile: "Sofia Marin", active: true },
  { id: "accepted-emma", kind: "open-chat", title: "Request accepted", body: "Emma accepted your Barcelona intro.", profile: "Emma Laurent", chatType: "direct_connection_chat", active: true },
  { id: "pending-jazz", kind: "plan-view", title: "Pending plan request", body: "Your jazz night request is waiting for host approval.", active: true },
  { id: "overlap-paris", kind: "home", title: "Trip overlap found", body: "Three trusted mutuals are in Paris next week.", active: true },
  { id: "trusted-emma", kind: "unlock", title: "Trusted Friend confirmed", body: "Emma became a Trusted Friend after mutual verification.", active: true },
  { id: "meetup-theo", kind: "network", title: "Meetup verified", body: "Your QR meetup with Theo was confirmed.", active: true },
  { id: "vouched-amara", kind: "profile", title: "New vouched connection", body: "Laura vouched for Amara in your London hub.", profile: "Amara Okoye", active: true }
];

const privacyOptions = {
  currentCity: { title: "Who can see current city", options: ["Nobody", "Trusted connections only", "Mutual connections", "Everyone allowed by trust rules"] },
  trips: { title: "Who can see trips", options: ["Nobody", "Trusted only", "Mutuals", "Network visibility"] },
  intros: { title: "Who can request intros", options: ["Nobody", "Trusted connections", "Mutual connections", "Full trusted network"] },
  instagram: { title: "Who can view Instagram", options: ["Nobody", "Accepted connections", "Trusted connections", "Everyone allowed"] },
  profile: { title: "Profile visibility", options: ["Hidden", "Trusted connections only", "Mutuals", "Discoverable"] }
};

const homeTrips = [
  { id: "barcelona-nov", city: "Barcelona", country: "Spain", start: "2026-11-08", end: "2026-11-15" },
  { id: "london-jun", city: "London", country: "United Kingdom", start: "2026-06-01", end: "2026-06-06" },
  { id: "tokyo-jul", city: "Tokyo", country: "Japan", start: "2026-07-18", end: "2026-07-25" }
];

const myTrips = [
  { id: "london-jun", city: "London", country: "United Kingdom", start: "2026-06-01", end: "2026-06-06", visibility: "trusted network only", status: "Open to meetups" },
  { id: "barcelona-jun", city: "Barcelona", country: "Spain", start: "2026-06-12", end: "2026-06-16", visibility: "visible to trusted networks", status: "Same dates active" },
  { id: "paris-jul", city: "Paris", country: "France", start: "2026-07-04", end: "2026-07-07", visibility: "open to meetups", status: "Upcoming" },
  { id: "tokyo-jul", city: "Tokyo", country: "Japan", start: "2026-07-18", end: "2026-07-25", visibility: "mutuals only", status: "Planning" },
  { id: "lisbon-aug", city: "Lisbon", country: "Portugal", start: "2026-08-18", end: "2026-08-22", visibility: "mutuals only", status: "Upcoming" },
  { id: "barcelona-nov", city: "Barcelona", country: "Spain", start: "2026-11-08", end: "2026-11-15", visibility: "open to meetups", status: "Trip selector active" },
  { id: "oslo-apr", city: "Oslo", country: "Norway", start: "2026-04-11", end: "2026-04-14", visibility: "trusted network only", status: "past" }
];

const homePeople = [
  { name: "Emma Laurent", city: "Oslo", country: "Norway", path: "You -> Laura -> Emma", badge: "2nd Degree", status: ["same", "visiting"], cta: "Request Intro", degree: 2, featured: true, tags: ["art", "gallery", "design", "coffee", "hidden gems"], bio: "Design-led traveler, weekend gallery wanderer, and believer in warm introductions over cold DMs.", plans: ["gallery", "coffee"], trips: [{ city: "Barcelona", start: "2026-11-10", end: "2026-11-14" }] },
  { name: "Mina Aoki", city: "Tokyo", country: "Japan", path: "Met at Gallery visit in Mayfair", badge: "Met", status: ["living"], cta: "Request Trusted Connection", met: true, featured: true, livesIn: "Tokyo", tags: ["food", "wellness", "design", "slow travel"], bio: "Quiet food spots, design hotels, and low-key neighbourhood rituals.", plans: ["gallery", "supper"] },
  { name: "Maya Brooks", city: "London", country: "United Kingdom", path: "You -> Laura -> Maya", badge: "Living here", status: ["living"], cta: "Request Intro", livesIn: "London", tags: ["architecture", "coffee", "local", "culture"], bio: "Architecture walks, espresso counters, and local introductions in London.", plans: ["coffee", "architecture"] },
  { name: "Ari Patel", city: "London", country: "United Kingdom", path: "You -> Theo -> Ari", badge: "2nd Degree", status: ["same", "visiting"], cta: "Request Intro", degree: 2, tags: ["coffee", "nightlife", "low-key", "music"], bio: "Low-key plans, record bars, coffee walks, and warm group hangs.", plans: ["coffee", "jazz"], trips: [{ city: "London", start: "2026-06-02", end: "2026-06-05" }] },
  { name: "Nia Mensah", city: "London", country: "United Kingdom", path: "You -> Amara -> Nia", badge: "Trusted local", status: ["living"], cta: "Explore", livesIn: "London", tags: ["local", "hidden gems", "food", "community"], bio: "Local supper clubs, hidden gems, and thoughtful introductions.", plans: ["supper", "coffee"] },
  { name: "Noah Silva", city: "Barcelona", country: "Spain", path: "You -> Amara -> Noah", badge: "2nd Degree", status: ["same", "visiting"], cta: "Request Intro", degree: 2, tags: ["design", "architecture", "coffee", "remote work"], bio: "Architecture, independent coffee spots, and remote-work friendly city days.", plans: ["coffee", "design"], trips: [{ city: "Barcelona", start: "2026-11-08", end: "2026-11-15" }] },
  { name: "Camille Roux", city: "Paris", country: "France", path: "You -> Emma -> Camille", badge: "Visiting soon", status: ["visiting"], cta: "Explore", tags: ["museum", "gallery", "design", "slow travel"], bio: "Museum weekends, gallery afternoons, quiet wine bars, and slow travel.", plans: ["gallery", "wine"], trips: [{ city: "Barcelona", start: "2026-11-12", end: "2026-11-16" }] },
  { name: "Ines Costa", city: "Barcelona", country: "Spain", path: "You -> Emma -> Ines", badge: "Living here", status: ["living"], cta: "Request Intro", livesIn: "Barcelona", tags: ["food", "coffee", "local", "hidden gems"], bio: "Barcelona local for thoughtful dinners, sunrise walks, and espresso spots.", plans: ["supper", "coffee"] },
  { name: "Ren Sato", city: "Tokyo", country: "Japan", path: "You -> Emma -> Ren", badge: "3rd Degree", status: ["same", "visiting"], cta: "Locked", degree: 3, locked: true, tags: ["digital nomad", "design", "city hubs"], bio: "Multi-city connector exploring design hotels and trusted hubs.", plans: ["remote work"], trips: [{ city: "Tokyo", start: "2026-07-20", end: "2026-07-24" }] }
];

const networkMovements = [
  { title: "Emma just landed in Lisbon", detail: "Open to local plans this week", tag: "Travel signal" },
  { title: "Theo unlocked Tokyo", detail: "Through Laura Chen", tag: "City hub" },
  { title: "Maya hosted Sunday Coffee", detail: "Shoreditch · 4 attended", tag: "Trusted Plan" },
  { title: "Sofia was vouched by Emma", detail: "New warm path available", tag: "Trust signal" },
  { title: "2 people are in Barcelona next week", detail: "Same-date overlap in your network", tag: "Trip overlap" }
];

const networkPeople = [
  { name: "Laura Chen", city: "London", path: "Added by QR · knows you IRL · recently added", badge: "Trusted Friend", cta: "Explore", degree: 1, recent: true, livesIn: "London" },
  { name: "Theo Jensen", city: "Oslo", path: "Verified one-to-one meetup · travelling next week", badge: "Trusted Friend", cta: "Explore", degree: 1, trips: [{ city: "London", start: "2026-06-04", end: "2026-06-08" }] },
  { name: "Sofia Marin", city: "Barcelona", path: "Invite link accepted · same dates as you", badge: "Trusted Friend", cta: "Explore", degree: 1, trips: [{ city: "Barcelona", start: "2026-11-09", end: "2026-11-14" }] },
  { name: "Amara Okoye", city: "London", path: "Imported contact · vouched · in London now", badge: "Trusted Friend", cta: "Explore", degree: 1, livesIn: "London" }
];

const metPeople = [
  { name: "Mina Aoki", city: "Tokyo", path: "Met in Mayfair · visiting next week", badge: "Met", cta: "Request Trusted Connection", met: true, trips: [{ city: "London", start: "2026-06-03", end: "2026-06-05" }] },
  { name: "Ari Patel", city: "London", path: "Met at Coffee in Shoreditch · in London until 16 Jun", badge: "Met", cta: "Request Trusted Connection", met: true, trips: [{ city: "London", start: "2026-06-01", end: "2026-06-16" }] },
  { name: "Nia Mensah", city: "London", path: "Met at Jazz night in Dalston · recently added", badge: "Met", cta: "Message", met: true, recent: true, livesIn: "London" }
];

const secondDegreePeople = [
  { name: "Emma Laurent", city: "Oslo", path: "You -> Laura -> Emma · same dates as you", badge: "2nd Degree", cta: "Request Intro", degree: 2, trips: [{ city: "Barcelona", start: "2026-11-10", end: "2026-11-14" }] },
  { name: "Noah Silva", city: "Barcelona", path: "You -> Amara -> Noah · in Barcelona until 15 Nov", badge: "2nd Degree", cta: "View Mutual Path", degree: 2, trips: [{ city: "Barcelona", start: "2026-11-08", end: "2026-11-15" }] },
  { name: "Maya Brooks", city: "London", path: "You -> Theo -> Maya · local in London", badge: "2nd Degree", cta: "Request Intro", degree: 2, livesIn: "London" }
];

const thirdDegreePeople = [
  { name: "Nina", city: "Paris", path: "You -> Laura -> Emma -> Nina", badge: "3rd Degree", cta: "Locked", degree: 3, locked: true },
  { name: "Ren", city: "Tokyo", path: "You -> Theo -> Mina -> Ren", badge: "3rd Degree", cta: "Locked", degree: 3, locked: true }
];

const chats = {
  all: [
    { name: "Intro Request", path: "Hugo → Emma via Laura", preview: "Hey Laura - would love an intro to Emma if it feels right. Looks like we both have similar interests and may be in Barcelona at the same time.", time: "Now", unread: true, type: "Intro Request", chatType: "intro_request", introRequest: true },
    { name: "Hugo & Emma", path: "Introduced by Laura", preview: "Laura introduced you both.", time: "1m", unread: true, type: "Intro Chat", chatType: "intro_chat", userRole: "introduced" },
    { name: "Emma Laurent", path: "You -> Laura -> Emma", preview: "Friday works. Laura vouched for you.", time: "2m", unread: true, type: "Direct Connection Chat", chatType: "direct_connection_chat", meetupRequired: true },
    { name: "Jonas Berg", path: "Hugo → Theo → Jonas", preview: "Theo introduced you both after the Oslo hub.", time: "6m", type: "Direct Connection Chat", chatType: "direct_connection_chat", meetupRequired: true },
    { name: "Mary Chen", path: "Hugo → Maya → Mary", preview: "Maya said you both like quiet dinner plans.", time: "11m", type: "Direct Connection Chat", chatType: "direct_connection_chat", meetupRequired: true },
    { name: "Laura Chen", path: "Trusted Friend", preview: "I can introduce you both if comfortable.", time: "14m", unread: true, trusted: true, chatType: "trusted_friend_chat" },
    { name: "Theo Jensen", path: "Oslo hub", preview: "Three trusted people are in Paris next week.", time: "1h", trusted: true, chatType: "trusted_friend_chat" },
    { name: "Coffee in Shoreditch", path: "Plan · private group", preview: "Amara shared the table details.", time: "Sat", trusted: true, screen: "plan-chat", chatType: "plan_chat" }
  ],
  unread: [
    { name: "Intro Request", path: "Hugo → Emma via Laura", preview: "Hey Laura - would love an intro to Emma if it feels right. Looks like we both have similar interests and may be in Barcelona at the same time.", time: "Now", unread: true, type: "Intro Request", chatType: "intro_request", introRequest: true },
    { name: "Emma Laurent", path: "You -> Laura -> Emma", preview: "Friday works. Laura vouched for you.", time: "2m", unread: true, type: "Direct Connection Chat", chatType: "direct_connection_chat", meetupRequired: true },
    { name: "Amara Okoye", path: "You -> Laura -> Amara", preview: "I have two London friends you should meet.", time: "9m", unread: true, type: "Direct Connection Chat", chatType: "direct_connection_chat", meetupRequired: true }
  ],
  trusted: [
    { name: "Laura Chen", path: "Trusted Friend", preview: "Added through QR in London.", time: "14m", trusted: true, chatType: "trusted_friend_chat" },
    { name: "Theo Jensen", path: "Trusted Friend", preview: "Met and verified in Oslo.", time: "1h", trusted: true, chatType: "trusted_friend_chat" },
    { name: "Sofia Marin", path: "Trusted Friend", preview: "Trusted connection from Barcelona.", time: "Yesterday", trusted: true, chatType: "trusted_friend_chat" }
  ],
  plans: [
    { name: "Coffee in Shoreditch", path: "Trusted Plan · 4/6", preview: "Amara shared the table details.", time: "Sat", trusted: true, screen: "plan-chat", chatType: "plan_chat" },
    { name: "Gallery visit in Mayfair", path: "Trusted Plan · 3/6", preview: "Emma added a meeting point near the entrance.", time: "Sun", trusted: true, screen: "plan-chat", chatType: "plan_chat" },
    { name: "Jazz night in Dalston", path: "Trusted Plan · pending", preview: "Waiting for host approval.", time: "Fri", trusted: true, screen: "plan-detail" }
  ]
};

const shareContacts = [
  { name: "Laura Chen", path: "Trusted Friend", preview: "Share Emma's profile with Laura.", time: "Trusted" },
  { name: "Theo Jensen", path: "Met in Oslo", preview: "Share Emma's profile with Theo.", time: "Trusted" },
  { name: "Amara Okoye", path: "Verified meetup", preview: "Share Emma's profile with Amara.", time: "Trusted" }
];

const cityMutuals = {
  Barcelona: [
    { name: "Noah Silva", city: "Barcelona", path: "You -> Amara -> Noah", badge: "2nd Degree", cta: "Request Intro" },
    { name: "Ines Costa", city: "Barcelona", path: "You -> Emma -> Ines", badge: "Foodie mutual", cta: "Request Intro" },
    { name: "Mateo Ruiz", city: "Barcelona", path: "You -> Laura -> Mateo", badge: "Living here", cta: "Explore" }
  ],
  Tokyo: [
    { name: "Mina Aoki", city: "Tokyo", path: "Met at Gallery visit in Mayfair", badge: "Met", cta: "Request Trusted Connection" },
    { name: "Ren Sato", city: "Tokyo", path: "You -> Emma -> Ren", badge: "Trusted local", cta: "Request Intro" }
  ]
};

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatTripDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";
  return `${Number(day)}/${Number(month)}/${year.slice(-2)}`;
}

function tripRangeLabel(trip) {
  const range = trip.end ? `${formatTripDate(trip.start)}-${formatTripDate(trip.end)}` : formatTripDate(trip.start);
  return `${trip.city} · ${range}`;
}

function displayTripDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function displayTripRange(trip) {
  if (!trip?.start) return "";
  return trip.end ? `${displayTripDate(trip.start)} - ${displayTripDate(trip.end)}` : displayTripDate(trip.start);
}

function isPastTrip(trip) {
  if ((trip?.status || "").toLowerCase() === "past") return true;
  const end = new Date(`${trip?.end || trip?.start || ""}T23:59:59`);
  if (Number.isNaN(end.getTime())) return false;
  return end < new Date();
}

function compactTripRange(trip) {
  if (!trip?.start) return "";
  const start = new Date(`${trip.start}T00:00:00`);
  const end = new Date(`${trip.end || trip.start}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return displayTripRange(trip);
  const startDay = start.toLocaleDateString("en-GB", { day: "numeric" });
  const startMonth = start.toLocaleDateString("en-GB", { month: "short" });
  const endDay = end.toLocaleDateString("en-GB", { day: "numeric" });
  const endMonth = end.toLocaleDateString("en-GB", { month: "short" });
  return startMonth === endMonth ? `${startDay}-${endDay} ${endMonth}` : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
}

function getSelectedHomeTrip() {
  return homeTrips.find((trip) => trip.id === activeHomeTripId) || homeTrips[0];
}

function visibleHomeTrips() {
  const trips = myTrips.filter((trip) => trip.status !== "past" && trip.start);
  return trips.filter((trip, index, list) => list.findIndex((item) => item.id === trip.id) === index);
}

function homeCityOptions() {
  const cities = [
    "London",
    ...homeTrips.map((trip) => trip.city),
    ...myTrips.map((trip) => trip.city),
    ...homePeople.map((person) => person.livesIn || person.city),
    ...homePeople.flatMap((person) => (person.trips || []).map((trip) => trip.city))
  ].filter(Boolean);
  return [...new Set(cities)];
}

function homeTripOptionLabel(trip) {
  return `${trip.city} · ${displayTripRange(trip)}`;
}

function tripById(id) {
  return [...homeTrips, ...myTrips].find((trip) => trip.id === id);
}

function getHomeSelectorContext() {
  const selectedTrip = tripById(activeHomeTripId) || getSelectedHomeTrip();
  if (homeFilter === "same") {
    if (!selectedTrip?.city || !selectedTrip?.start) return { type: "empty-trip" };
    return { type: "trip", city: selectedTrip.city, trip: selectedTrip };
  }
  if (homeFilter === "in-town" || homeFilter === "locals") {
    return { type: "city", city: activeHomeCity };
  }
  return { type: "broad" };
}

function updateHomeTripDateRange() {
  const start = formatTripDate(document.querySelector("#tripStartDate")?.value);
  const end = formatTripDate(document.querySelector("#tripEndDate")?.value);
  const destination = document.querySelector(".trip-card input[type='text']")?.value.trim() || "Upcoming trip";
  if (start && end) homeTripDateRange = `${start}-${end}`;
  if (start && !end) homeTripDateRange = start;
  if (start) {
    const [city = destination, country = ""] = destination.split(",").map((part) => part.trim());
    const savedTrip = {
      id: `saved-${Date.now()}`,
      city,
      country,
      start: document.querySelector("#tripStartDate")?.value,
      end: document.querySelector("#tripEndDate")?.value,
      visibility: "trusted network only",
      status: "New trip"
    };
    homeTrips.unshift(savedTrip);
    myTrips.push(savedTrip);
    activeHomeTripId = savedTrip.id;
  }
}

function selectedEditingTrip() {
  return myTrips.find((trip) => trip.id === editingTripId);
}

function parseTripDestination(value) {
  const [city = "Upcoming trip", ...countryParts] = value.split(",").map((part) => part.trim()).filter(Boolean);
  return {
    city,
    country: countryParts.join(", ") || ""
  };
}

function renderTripEditor() {
  const isEditing = tripEditorMode === "edit";
  const trip = isEditing ? selectedEditingTrip() : null;
  const screen = document.querySelector("#trip");
  const title = screen?.querySelector(".page-header h1");
  const copy = screen?.querySelector(".page-header p:last-child");
  const destination = screen?.querySelector(".trip-card input[type='text']");
  const start = document.querySelector("#tripStartDate");
  const end = document.querySelector("#tripEndDate");
  const visibility = document.querySelector("#tripVisibility");
  const saveButton = screen?.querySelector("[data-trip-save]");
  const skipButton = screen?.querySelector("[data-trip-skip]");

  if (title) title.textContent = isEditing ? "Manage Trip" : "Upcoming Trips";
  if (copy) copy.textContent = isEditing ? "Edit the details your trusted network can see." : "Add where you are going next and decide how open your trip feels.";
  if (saveButton) saveButton.textContent = isEditing ? "Save Changes" : "Save Trip";
  if (skipButton) skipButton.textContent = isEditing ? "Cancel" : "I'll do it later";

  if (isEditing && !trip) {
    tripEditorMode = "create";
    editingTripId = null;
    showUtilityFeedback("Trip unavailable", "This trip could not be loaded. It may have been deleted or reset in Developer Mode.");
    showScreen("all-trips", { replace: true });
    return;
  }

  if (!isEditing || !trip) return;
  if (destination) destination.value = [trip.city, trip.country].filter(Boolean).join(", ");
  if (start) start.value = trip.start || "";
  if (end) end.value = trip.end || "";
  if (visibility) {
    const normalized = (trip.visibility || "").toLowerCase();
    [...visibility.options].forEach((option) => {
      const optionValue = option.textContent.toLowerCase();
      option.selected = normalized.includes(optionValue) || optionValue.includes(normalized.replace("visible to ", ""));
    });
  }
  markScreenClean("trip");
}

function saveEditedTrip() {
  const trip = selectedEditingTrip();
  if (!trip) return;
  const destinationValue = document.querySelector(".trip-card input[type='text']")?.value.trim() || `${trip.city}, ${trip.country}`;
  const { city, country } = parseTripDestination(destinationValue);
  const visibility = document.querySelector("#tripVisibility")?.value || trip.visibility;
  const openToMeetups = document.querySelector(".trip-card .toggle-card.active")?.textContent.includes("Open to Meetups");

  trip.city = city;
  trip.country = country;
  trip.start = document.querySelector("#tripStartDate")?.value || trip.start;
  trip.end = document.querySelector("#tripEndDate")?.value || trip.end;
  trip.visibility = visibility.toLowerCase();
  if (openToMeetups) trip.status = trip.status === "past" ? "past" : "Open to meetups";

  const homeTrip = homeTrips.find((item) => item.id === trip.id);
  if (homeTrip) {
    homeTrip.city = trip.city;
    homeTrip.country = trip.country;
    homeTrip.start = trip.start;
    homeTrip.end = trip.end;
  }

  tripEditorMode = "create";
  editingTripId = null;
  renderAllTrips();
  renderHomeTripSelect();
  renderHomePeople();
  renderHomeSuggestions();
  persistPrototypeState();
  markScreenClean("trip");
  showScreen("all-trips", { replace: true });
}

function datesOverlap(firstStart, firstEnd, secondStart, secondEnd) {
  if (!firstStart || !secondStart) return false;
  const aStart = new Date(firstStart);
  const aEnd = new Date(firstEnd || firstStart);
  const bStart = new Date(secondStart);
  const bEnd = new Date(secondEnd || secondStart);
  return aStart <= bEnd && bStart <= aEnd;
}

function overlapDayCount(firstStart, firstEnd, secondStart, secondEnd) {
  if (!datesOverlap(firstStart, firstEnd, secondStart, secondEnd)) return 0;
  const aStart = new Date(firstStart);
  const aEnd = new Date(firstEnd || firstStart);
  const bStart = new Date(secondStart);
  const bEnd = new Date(secondEnd || secondStart);
  const start = new Date(Math.max(aStart.getTime(), bStart.getTime()));
  const end = new Date(Math.min(aEnd.getTime(), bEnd.getTime()));
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

function sameCity(a, b) {
  return Boolean(a && b && a.toLowerCase() === b.toLowerCase());
}

function personLivesInTripCity(person, context) {
  return sameCity(person.livesIn, context?.city);
}

function personVisitsTripCity(person, context) {
  return (person.trips || []).some((personTrip) => sameCity(personTrip.city, context?.city));
}

function personTripInCity(person, context) {
  return (person.trips || []).find((personTrip) => sameCity(personTrip.city, context?.city));
}

function personTripOverlaps(person, context) {
  const trip = context?.trip || context;
  if (!trip?.city || !trip?.start || !trip?.end) return false;
  return (person.trips || []).some((personTrip) => (
    sameCity(personTrip.city, trip?.city) &&
    datesOverlap(personTrip.start, personTrip.end, trip.start, trip.end)
  ));
}

function personMatchesSelectedTrip(person, trip) {
  if (trip?.type === "empty-trip") return false;
  if (!trip) return person.featured;
  if (homeFilter === "locals") return personLivesInTripCity(person, trip);
  if (homeFilter === "in-town") return personLivesInTripCity(person, trip) || personVisitsTripCity(person, trip);
  if (homeFilter === "same") return personTripOverlaps(person, trip);
  return true;
}

function planMatchesHomeFilter(plan, trip) {
  if (trip?.type === "empty-trip") return false;
  if (!trip) return true;
  if (homeFilter === "same" && !trip?.city) return false;
  const planInCity = sameCity(plan.city, trip.city);
  if (homeFilter === "same") return planInCity;
  if (homeFilter === "locals") return planInCity && plan.visibility !== "Invite link only";
  if (homeFilter === "in-town") return planInCity;
  return planInCity;
}

function planRelationshipLabel(plan) {
  const parts = pathParts(plan.path || "");
  if (parts.length > 2) return `Mutual via ${parts[1]}`;
  if (plan.visibility.includes("2nd")) return "2nd Degree";
  if (plan.visibility.includes("Trusted")) return "Trusted Network";
  if (plan.visibility.includes("Mutual")) return "Mutual connections";
  return plan.visibility;
}

function planTrustState(plan) {
  if (plan.mine || plan.host === "You" || plan.host === "Hugo" || plan.role === "hosting") {
    return { active: true, locked: false, label: "Hosted by You", action: "Manage Plan" };
  }
  if (plan.role === "attending" || plan.role === "pending" || plan.role === "past" || ["accepted", "pending", "past"].includes(plan.viewerStatus)) {
    return { active: true, locked: false, label: planRelationshipLabel(plan), action: "Open" };
  }
  if (isTrustedConnection(plan.host) || isMetConnection(plan.host)) {
    return { active: true, locked: false, label: isTrustedConnection(plan.host) ? "Trusted Host" : "Met Host", action: "Request to Join" };
  }
  if (isActiveTrustPath(plan.path, plan.host)) {
    return { active: true, locked: false, label: planRelationshipLabel(plan), action: "Request to Join" };
  }
  const oldPath = archivedPath(pathParts(plan.path).length ? [plan.path] : [], plan.host);
  return {
    active: false,
    locked: true,
    archived: true,
    label: "Locked Path",
    action: "Locked Path",
    note: `Previously reachable${viaName(oldPath) ? ` via ${viaName(oldPath)}` : ""}. Reopen the trust path to request this plan.`
  };
}

function homePlanCard(plan, index = 0) {
  const max = Math.min(plan.max, 6);
  const spotsLeft = Math.max(0, max - plan.joined);
  const trustState = planTrustState(plan);
  return `
    <article class="plan-card compact home-discovery-plan ${trustState.locked ? "locked-relation" : ""}" ${trustState.locked ? "" : `data-next="plan-detail" data-plan-name="${plan.name}" data-plan-status="discoverable"`}>
      <div class="avatar" style="background:linear-gradient(145deg, ${index % 2 ? "#79dccb,#7c72ff" : "#ffbfa3,#a79cff"})"></div>
      <div>
        <h3>${plan.name}</h3>
        <div class="plan-status-line"><span class="trust-badge">Hosted by ${plan.host}</span><span class="trust-badge plan-state">${trustState.label}</span></div>
        <p>${plan.location}${plan.city ? `, ${plan.city}` : ""}</p>
        <div class="plan-meta"><span>${plan.time}</span><span>${plan.joined}/${max} attending</span><span>${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left</span></div>
      </div>
      <button ${trustState.locked ? "disabled" : `data-next="plan-detail" data-plan-name="${plan.name}" data-plan-status="discoverable"`}>${trustState.action}</button>
    </article>
  `;
}

function homeCardContext(person) {
  const context = getHomeSelectorContext();
  const cityTrip = personTripInCity(person, context);
  const isLocal = personLivesInTripCity(person, context);
  const overlaps = personTripOverlaps(person, context);

  if (homeFilter === "same" && cityTrip && overlaps) {
    const days = overlapDayCount(cityTrip.start, cityTrip.end, context.trip?.start, context.trip?.end);
    return `Also in ${cityTrip.city} · ${compactTripRange(cityTrip)} · Same dates as you · Overlaps ${days} day${days === 1 ? "" : "s"}`;
  }
  if (homeFilter === "in-town" && cityTrip && !isLocal) {
    return `${person.city} · In town until ${displayTripDate(cityTrip.end || cityTrip.start)}`;
  }
  if (homeFilter === "locals" && isLocal) {
    return `${person.city} · Based in ${person.livesIn}`;
  }
  if (isLocal) {
    return `${person.city} · Local connection based in ${person.livesIn}`;
  }
  if (cityTrip) {
    return `${person.city} · Visiting ${cityTrip.city}`;
  }
  return "";
}

const myConnectionSignal = {
  tags: ["explorer", "food", "art", "gallery", "design", "coffee", "hidden gems", "slow travel", "architecture"],
  bio: "Warm-intro traveller based in Tokyo, with London as home, looking for thoughtful city rituals, design hotels, gallery afternoons, and trusted local plans.",
  plans: ["coffee", "gallery", "jazz", "design"]
};

const semanticGroups = [
  ["gallery", "museum", "art", "culture"],
  ["coffee", "espresso", "cafe"],
  ["design", "architecture", "design hotels"],
  ["food", "supper", "dinner"],
  ["hidden gems", "local", "neighbourhood"],
  ["slow travel", "low-key", "quiet"],
  ["jazz", "music", "nightlife"],
  ["remote work", "digital nomad", "city hubs"]
];

function semanticBucket(value) {
  const normalized = String(value || "").toLowerCase();
  const group = semanticGroups.find((items) => items.some((item) => normalized.includes(item)));
  return group?.[0] || normalized;
}

function semanticSet(items = []) {
  return new Set(items.map(semanticBucket).filter(Boolean));
}

function sharedSemanticCount(first = [], second = []) {
  const firstSet = semanticSet(first);
  const secondSet = semanticSet(second);
  return [...firstSet].filter((item) => secondSet.has(item)).length;
}

function bioSemanticHits(bio = "") {
  const normalized = bio.toLowerCase();
  return semanticGroups.filter((items) => (
    items.some((item) => normalized.includes(item)) &&
    items.some((item) => myConnectionSignal.bio.toLowerCase().includes(item))
  )).length;
}

function bestTripOverlap(person) {
  const personTrips = person.trips || [];
  let best = null;
  personTrips.forEach((personTrip) => {
    myTrips.forEach((myTrip) => {
      if (!sameCity(personTrip.city, myTrip.city)) return;
      const overlap = overlapDayCount(personTrip.start, personTrip.end, myTrip.start, myTrip.end);
      if (overlap && (!best || overlap > best.overlap)) best = { personTrip, myTrip, overlap };
    });
  });
  return best;
}

function mutualCount(person) {
  return Math.max(0, pathParts(person.path || "").length - 2);
}

function suggestedConnectionScore(person) {
  const sharedTags = sharedSemanticCount(myConnectionSignal.tags, person.tags || []);
  const sharedPlans = sharedSemanticCount(myConnectionSignal.plans, person.plans || []);
  const bioHits = bioSemanticHits(person.bio || "");
  const overlap = bestTripOverlap(person);
  const mutuals = mutualCount(person);
  const cityOverlap = person.livesIn === "London" || person.city === activeHomeCity || person.livesIn === activeHomeCity;
  let score = sharedTags * 3 + sharedPlans * 2 + bioHits * 2 + mutuals + (cityOverlap ? 2 : 0);
  if (overlap) score += 7 + overlap.overlap;
  if (person.featured) score += 2;
  if (person.met || isMetConnection(person.name)) score += 2;
  if (isTrustedConnection(person.name)) score += 3;
  if (person.locked) score -= 4;

  let reason = "You may get along";
  let reasons = [];
  if (overlap) reason = overlap.overlap > 2 ? `Also in ${overlap.personTrip.city} ${compactTripRange(overlap.personTrip)}` : `Same dates in ${overlap.personTrip.city}`;
  else if (sharedTags >= 2 && sharedPlans) reason = "Shared gallery + coffee interests";
  else if (sharedTags >= 3) reason = "Similar travel style";
  else if (sharedPlans >= 2) reason = "Both like low-key plans";
  else if (bioHits >= 2) reason = "Similar profile energy";
  else if (mutuals > 1) reason = `${mutuals} mutual trusted friends`;
  else if (mutuals === 1) reason = `Trusted through ${pathParts(person.path || "")[1] || "a mutual"}`;
  else if (cityOverlap) reason = `Active in ${person.livesIn || person.city}`;

  const tagReasons = [...semanticSet(person.tags || [])].filter((tag) => semanticSet(myConnectionSignal.tags).has(tag));
  if (tagReasons.includes("coffee")) reasons.push("love coffee spots");
  if (tagReasons.includes("gallery")) reasons.push("enjoy galleries");
  if (tagReasons.includes("design")) reasons.push("save design hotels");
  if (tagReasons.includes("hidden gems")) reasons.push("look for hidden gems");
  if (tagReasons.includes("slow travel")) reasons.push("travel slowly");
  if (tagReasons.includes("food")) reasons.push("like thoughtful food plans");
  if (tagReasons.includes("jazz")) reasons.push("like low-key music spots");
  if (sharedPlans >= 2) reasons.push("join similar low-key plans");
  if (bioHits >= 2) reasons.push("have similar profile energy");
  if (!reasons.length && mutuals > 1) reasons.push(`share ${mutuals} trusted connections`);
  if (!reasons.length && mutuals === 1) reasons.push(`know ${pathParts(person.path || "")[1] || "a mutual"}`);
  if (!reasons.length) reasons.push(reason.toLowerCase());

  return { person, score, reason, reasons: [...new Set(reasons)].slice(0, 2) };
}

function suggestedConnections() {
  const ranked = homePeople
    .filter((person) => {
      const state = connectionStateForPerson(person);
      return !person.locked && !state?.locked && !state?.archived;
    })
    .map(suggestedConnectionScore)
    .sort((a, b) => b.score - a.score);
  const stable = ranked.slice(0, 2);
  const rotatingPool = ranked.slice(2);
  const daySeed = Math.floor(Date.now() / 86400000);
  const rotated = rotatingPool.length
    ? rotatingPool.slice(daySeed % rotatingPool.length).concat(rotatingPool.slice(0, daySeed % rotatingPool.length)).slice(0, 3)
    : [];
  return stable.concat(rotated).map(({ person, reason, reasons }) => ({
    ...person,
    suggestionReason: reason,
    suggestionReasons: reasons,
    cta: person.cta === "Explore" ? "Explore" : person.cta
  }));
}

function suggestedLocationLine(person) {
  const overlap = bestTripOverlap(person);
  if (overlap) return `${person.city} · Also in ${overlap.personTrip.city} ${compactTripRange(overlap.personTrip)}`;
  if (person.livesIn === activeHomeCity || person.city === activeHomeCity) return `${person.city} · In your network this week`;
  if ((person.tags || []).some((tag) => ["coffee", "gallery", "design"].includes(semanticBucket(tag)))) {
    return `${person.city} · Shared gallery + coffee interests`;
  }
  return `${person.city} · ${person.suggestionReason || "Curated through your trusted network"}`;
}

function currentTrustedFriendCap() {
  const meetupUnlock = trustedFriendState.verifiedMeetups >= 2 ? 2 : 0;
  const earned = meetupUnlock + trustedFriendState.hostedPlans + trustedFriendState.vouches;
  return Math.min(trustedFriendState.absoluteCap, trustedFriendState.launchCap + earned);
}

function renderTrustCaps() {
  const slotCopy = document.querySelector("#trustedSlotCopy");
  if (slotCopy) {
    slotCopy.textContent = `${trustedFriendState.used}/${trustedFriendState.launchCap} used · max ${trustedFriendState.absoluteCap} · unlock more through verified meetups, hosting and trusted vouches.`;
  }
  const networkSlotCopy = document.querySelector("#networkTrustedSlotCopy");
  if (networkSlotCopy) {
    networkSlotCopy.textContent = `${trustedFriendState.used}/${trustedFriendState.launchCap} launch slots used · cap ${trustedFriendState.absoluteCap}`;
  }
  const mapTrustedSlotCount = document.querySelector("#mapTrustedSlotCount");
  if (mapTrustedSlotCount) {
    mapTrustedSlotCount.textContent = `${trustedFriendState.used}/${trustedFriendState.launchCap}`;
  }
  const mapMetCount = document.querySelector("#mapMetCount");
  if (mapMetCount) {
    mapMetCount.textContent = `${uniquePeopleByName([...metPeople, ...dynamicMetPeople()]).filter((person) => !isTrustedConnection(person.name)).length}`;
  }
  const mapTrustedCap = document.querySelector("#mapTrustedCap");
  if (mapTrustedCap) {
    mapTrustedCap.textContent = `${trustedFriendState.absoluteCap}`;
  }
}

function stopVerificationCountdown() {
  if (verificationCountdownTimer) {
    window.clearInterval(verificationCountdownTimer);
    verificationCountdownTimer = null;
  }
}

function startVerificationCountdown(durationSeconds = 600) {
  stopVerificationCountdown();
  const timer = document.querySelector("#mutualCountdown");
  const cta = document.querySelector("[data-complete-verification]");
  if (!timer) return;

  const expiresAt = Date.now() + durationSeconds * 1000;
  const update = () => {
    const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    timer.textContent = formatCountdown(remaining);
    if (remaining === 0) {
      stopVerificationCountdown();
      if (cta && verificationMethod === "mutual") {
        cta.textContent = "Window Expired";
        cta.disabled = true;
      }
    }
  };

  if (cta) cta.disabled = false;
  update();
  verificationCountdownTimer = window.setInterval(update, 1000);
}

const discoverablePlans = [
  { name: "Coffee in Shoreditch", host: "Amara", path: "You -> Laura -> Amara", time: "Sat, 2:00 PM", location: "Shoreditch", city: "London", joined: 3, max: 6, visibility: "Mutual connections", status: "Open to request", viewerStatus: "discoverable" },
  { name: "Gallery visit in Mayfair", host: "Emma", path: "You -> Laura -> Emma", time: "Sun, 11:30 AM", location: "Mayfair", city: "London", joined: 3, max: 6, visibility: "2nd Degree", status: "Open to request", viewerStatus: "discoverable" },
  { name: "Jazz night in Dalston", host: "Sofia", path: "You -> Laura -> Sofia", time: "Fri, 9:00 PM", location: "Dalston", city: "London", joined: 2, max: 6, visibility: "Mutual connections", status: "Open to request", viewerStatus: "discoverable" },
  { name: "Dinner in Soho", host: "Noah", path: "You -> Emma -> Noah", time: "Thu, 8:00 PM", location: "Soho", city: "London", joined: 4, max: 6, visibility: "2nd Degree", status: "Open to request", viewerStatus: "discoverable" }
];

const myPlans = {
  hosting: [
    { name: "Coffee in Shoreditch", host: "You", path: "Hosted by you", time: "Sat, 2:00 PM", location: "Shoreditch", joined: 3, max: 6, visibility: "Mutual connections", status: "2 pending requests", role: "hosting", mine: true },
    { name: "Late lunch in Notting Hill", host: "You", path: "Invite link only", time: "Tue, 1:00 PM", location: "Notting Hill", joined: 1, max: 6, visibility: "Invite link only", status: "Draft open", role: "hosting", mine: true },
    { name: "Dinner in Soho", host: "You", path: "Direct Trusted Friends only", time: "Thu, 8:00 PM", location: "Soho", joined: 4, max: 6, visibility: "Trusted Friends", status: "Confirmed", role: "hosting", mine: true }
  ],
  attending: [
    { name: "Gallery visit in Mayfair", host: "Emma", path: "You -> Laura -> Emma", time: "Sun, 11:30 AM", location: "Mayfair", joined: 3, max: 6, visibility: "2nd Degree", status: "Accepted", role: "attending" },
    { name: "Sunday walk in Hampstead", host: "Laura", path: "Trusted Friend", time: "Sun, 9:30 AM", location: "Hampstead", joined: 2, max: 6, visibility: "Mutual connections", status: "Group chat open", role: "attending" }
  ],
  pending: [
    { name: "Jazz night in Dalston", host: "Sofia", path: "You -> Laura -> Sofia", time: "Fri, 9:00 PM", location: "Dalston", joined: 3, max: 6, visibility: "Mutual connections", status: "Pending approval", role: "pending" }
  ],
  past: [
    { name: "Design stores in Marylebone", host: "Maya", path: "You -> Amara -> Maya", time: "Sat, 4:00 PM", location: "Marylebone", joined: 4, max: 6, visibility: "2nd Degree", status: "Met created", role: "past" },
    { name: "Low-key supper club", host: "Noah", path: "You -> Emma -> Noah", time: "Wed, 7:30 PM", location: "Hackney", joined: 6, max: 6, visibility: "2nd Degree", status: "Verified attendees", role: "past" }
  ]
};

const previewPlans = [
  discoverablePlans[0],
  discoverablePlans[1],
  discoverablePlans[2]
];

const emmaTrips = [
  { city: "Barcelona", country: "Spain", start: "2026-06-12", end: "2026-06-16", visibility: "open to meetups", status: "same dates" },
  { city: "Paris", country: "France", start: "2026-07-04", end: "2026-07-07", visibility: "trusted network only", status: "visible" },
  { city: "Oslo", country: "Norway", start: "2026-04-11", end: "2026-04-14", visibility: "past visible", status: "past" }
];

const emmaPlans = {
  hosting: [
    { name: "Gallery visit in Mayfair", host: "Emma", path: "You -> Laura -> Emma", time: "Sun, 11:30 AM", location: "Mayfair", joined: 3, max: 6, visibility: "2nd Degree", status: "Request to join", viewerStatus: "discoverable" }
  ],
  attending: [
    { name: "Coffee in Shoreditch", host: "Amara", path: "You -> Laura -> Amara", time: "Sat, 2:00 PM", location: "Shoreditch", joined: 3, max: 6, visibility: "Mutual connections", status: "Accepted", viewerStatus: "accepted", role: "attending" }
  ],
  past: [
    { name: "Design stores in Marylebone", host: "Maya", path: "You -> Emma -> Maya", time: "Sat, 4:00 PM", location: "Marylebone", joined: 4, max: 6, visibility: "2nd Degree", status: "Past", role: "past" }
  ]
};

const personProfiles = {
  "Emma Laurent": {
    name: "Emma Laurent",
    initials: "EL",
    city: "Oslo",
    homeCity: "Oslo",
    relationship: "Mutual via Laura",
    path: "You -> Laura -> Emma",
    paths: ["You -> Laura -> Emma", "You -> Maya -> Emma"],
    action: "Request Intro",
    bio: "Design-led traveller, weekend gallery wanderer, and believer in warm introductions over cold DMs.",
    interests: ["Hidden Gems", "Art & Culture", "Coffee Spots", "Luxury Travel"],
    stats: "14 countries visited · 9 trusted hubs",
    vouches: [["Laura", "\"Thoughtful, kind, easy to meet.\""], ["Amara", "\"Always knows the place.\""]],
    instagram: "emma.laurent",
    trips: emmaTrips,
    plans: emmaPlans
  },
  "Noah Silva": {
    name: "Noah Silva",
    initials: "NS",
    city: "Barcelona",
    homeCity: "Barcelona",
    relationship: "2nd Degree",
    path: "You -> Amara -> Noah",
    paths: ["You -> Amara -> Noah"],
    action: "Request Intro",
    bio: "Barcelona-based connector for design hotels, late dinners, and easy mutual introductions.",
    interests: ["Foodie", "Architecture", "Nightlife", "Local Host"],
    stats: "9 countries visited · 5 trusted hubs",
    vouches: [["Amara", "\"Warm, generous and thoughtful.\""], ["Emma", "\"Knows quiet places well.\""]],
    instagram: "noah.silva",
    trips: [{ city: "Barcelona", country: "Spain", start: "2026-11-08", end: "2026-11-15", visibility: "open to meetups", status: "same dates" }],
    plans: {
      hosting: [{ name: "Rooftop Drinks in Soho", host: "Noah", path: "You -> Emma -> Noah", time: "Fri, 7:00 PM", location: "Soho", city: "London", joined: 4, max: 6, visibility: "2nd Degree", status: "Open to request", viewerStatus: "discoverable" }],
      attending: [],
      past: []
    }
  },
  "Camille Roux": {
    name: "Camille Roux",
    initials: "CR",
    city: "Paris",
    homeCity: "Paris",
    relationship: "Same Dates",
    path: "You -> Emma -> Camille",
    paths: ["You -> Emma -> Camille"],
    action: "Explore",
    bio: "Visiting soon for galleries, bakeries, and slow mornings between trusted plans.",
    interests: ["Galleries", "Slow travel", "Coffee Spots"],
    stats: "7 countries visited · 3 trusted hubs",
    vouches: [["Emma", "\"Curious and easy company.\""]],
    instagram: "camille.roux",
    trips: [{ city: "Barcelona", country: "Spain", start: "2026-11-12", end: "2026-11-16", visibility: "open to meetups", status: "same dates overlap" }],
    plans: { hosting: [], attending: [], past: [] }
  },
  "Maya Brooks": {
    name: "Maya Brooks",
    initials: "MB",
    city: "London",
    homeCity: "London",
    relationship: "Lives Here",
    path: "You -> Laura -> Maya",
    paths: ["You -> Laura -> Maya"],
    action: "Request Intro",
    bio: "London local who hosts quiet design walks and trusted, small-group plans.",
    interests: ["Design hotels", "Hidden Gems", "Art & Culture"],
    stats: "11 countries visited · 7 trusted hubs",
    vouches: [["Amara", "\"A calm, thoughtful host.\""], ["Laura", "\"Great instincts for people.\""]],
    instagram: "maya.brooks",
    trips: [],
    plans: {
      hosting: [],
      attending: [],
      past: [{ name: "Design stores in Marylebone", host: "Maya", path: "You -> Amara -> Maya", time: "Sat, 4:00 PM", location: "Marylebone", joined: 4, max: 6, visibility: "2nd Degree", status: "Past", role: "past", viewerStatus: "past", viewerAttended: true }]
    }
  },
  "Amara Okoye": {
    name: "Amara Okoye",
    initials: "AO",
    city: "London",
    homeCity: "Lagos",
    relationship: "Trusted Friend",
    path: "Trusted Friend · 1st Degree",
    directRelationship: "Trusted Friend",
    action: "Message",
    bio: "Trusted friend and warm London host for small, thoughtful plans.",
    interests: ["Supper clubs", "Coffee Spots", "Local Host"],
    stats: "16 countries visited · 10 trusted hubs",
    vouches: [["Laura", "\"Always makes people feel welcome.\""], ["Theo", "\"Deeply reliable.\""]],
    instagram: "amara.okoye",
    trips: [],
    plans: {
      hosting: [{ name: "Coffee in Shoreditch", host: "Amara", path: "Trusted Friend", time: "Sat, 2:00 PM", location: "Shoreditch", city: "London", joined: 4, max: 6, visibility: "Mutual connections", status: "Accepted", viewerStatus: "accepted", role: "attending" }],
      attending: [],
      past: []
    }
  },
  "Laura Chen": {
    name: "Laura Chen",
    initials: "LC",
    city: "London",
    homeCity: "London",
    relationship: "Trusted Friend",
    path: "Trusted Friend · 1st Degree",
    directRelationship: "Trusted Friend",
    action: "Message",
    bio: "A trusted London connector who makes warm, thoughtful introductions.",
    interests: ["Coffee Spots", "Galleries", "Hidden Gems"],
    stats: "12 countries visited · 8 trusted hubs",
    vouches: [["Amara", "\"A natural bridge between good people.\""]],
    instagram: "laura.chen",
    trips: [],
    plans: { hosting: [], attending: [], past: [] }
  },
  "Theo Jensen": {
    name: "Theo Jensen",
    initials: "TJ",
    city: "Oslo",
    homeCity: "Oslo",
    relationship: "Trusted Friend",
    path: "Trusted Friend · verified meetup",
    directRelationship: "Trusted Friend",
    action: "Message",
    bio: "Trusted friend with a careful eye for safe, high-quality city plans.",
    interests: ["Local Host", "Jazz bars", "Design hotels"],
    stats: "10 countries visited · 6 trusted hubs",
    vouches: [["Laura", "\"Reliable, calm and generous.\""]],
    instagram: "theo.jensen",
    trips: [],
    plans: { hosting: [], attending: [], past: [] }
  },
  "Sofia Marin": {
    name: "Sofia Marin",
    initials: "SM",
    city: "Barcelona",
    homeCity: "Barcelona",
    relationship: "Mutual via Laura",
    path: "You -> Laura -> Sofia",
    paths: ["You -> Laura -> Sofia"],
    action: "Request Intro",
    bio: "Barcelona-based trusted mutual who prefers small, thoughtful plans and calm local introductions.",
    interests: ["Local Host", "Coffee Spots", "Hidden Gems"],
    stats: "8 countries visited · 4 trusted hubs",
    vouches: [["Laura", "\"Thoughtful and easy to host.\""]],
    instagram: "sofia.marin",
    trips: [],
    plans: { hosting: [], attending: [], past: [] }
  },
  "Ari Patel": {
    name: "Ari Patel",
    initials: "AP",
    city: "London",
    homeCity: "London",
    relationship: "Met",
    path: "Met at Coffee in Shoreditch",
    directRelationship: "Met",
    action: "Request Trusted Connection",
    bio: "London-based coffee and gallery person who likes low-key plans with trusted mutuals.",
    interests: ["Coffee Spots", "Galleries", "Low-key Plans"],
    stats: "6 countries visited · 3 trusted hubs",
    vouches: [["Theo", "\"Reliable and kind in small groups.\""]],
    instagram: "ari.patel",
    trips: [],
    plans: { hosting: [], attending: [], past: [] }
  },
  "Mina Aoki": {
    name: "Mina Aoki",
    initials: "MA",
    city: "Tokyo",
    homeCity: "Tokyo",
    relationship: "Met",
    path: "Met at Gallery visit in Mayfair",
    directRelationship: "Met",
    action: "Request Trusted Connection",
    bio: "Tokyo local who loves design hotels, quiet food spots, and thoughtful city rituals.",
    interests: ["Design Hotels", "Foodie", "Slow Travel"],
    stats: "13 countries visited · 6 trusted hubs",
    vouches: [["Emma", "\"Generous with local recommendations.\""]],
    instagram: "mina.aoki",
    trips: [],
    plans: { hosting: [], attending: [], past: [] }
  },
  "Ines Costa": {
    name: "Ines Costa",
    initials: "IC",
    city: "Barcelona",
    homeCity: "Barcelona",
    relationship: "Mutual via Emma",
    path: "You -> Emma -> Ines",
    paths: ["You -> Emma -> Ines"],
    action: "Request Intro",
    bio: "Barcelona local for thoughtful dinners, sunrise walks, and espresso spots.",
    interests: ["Coffee Spots", "Foodie", "Local Host"],
    stats: "7 countries visited · 4 trusted hubs",
    vouches: [["Emma", "\"A warm local connector.\""]],
    instagram: "ines.costa",
    trips: [],
    plans: { hosting: [], attending: [], past: [] }
  },
  "Jonas Berg": {
    name: "Jonas Berg",
    initials: "JB",
    city: "Oslo",
    homeCity: "Oslo",
    relationship: "Introduced via Theo",
    path: "Hugo -> Theo -> Jonas",
    paths: ["Hugo -> Theo -> Jonas"],
    action: "Message",
    bio: "Oslo trusted mutual interested in city hubs, coffee walks, and low-key plans.",
    interests: ["Coffee Spots", "City Hubs", "Slow Travel"],
    stats: "5 countries visited · 2 trusted hubs",
    vouches: [["Theo", "\"A careful, thoughtful introduction.\""]],
    instagram: "jonas.berg",
    trips: [],
    plans: { hosting: [], attending: [], past: [] }
  },
  "Mary Chen": {
    name: "Mary Chen",
    initials: "MC",
    city: "London",
    homeCity: "London",
    relationship: "Introduced via Maya",
    path: "Hugo -> Maya -> Mary",
    paths: ["Hugo -> Maya -> Mary"],
    action: "Message",
    bio: "London mutual who likes quiet dinner plans, galleries, and warm introductions.",
    interests: ["Dinner Plans", "Galleries", "Hidden Gems"],
    stats: "9 countries visited · 5 trusted hubs",
    vouches: [["Maya", "\"Good energy for small trusted plans.\""]],
    instagram: "mary.chen",
    trips: [],
    plans: { hosting: [], attending: [], past: [] }
  }
};

const planJoinRequests = [
  { name: "Sofia Marin", path: "You -> Laura -> Sofia", vouch: "Vouched by Laura", message: "I know Amara through the Oslo hub and would love to join for coffee." },
  { name: "Ari Patel", path: "You -> Theo -> Ari", vouch: "Verified meetup", message: "I will be nearby after a gallery visit and can keep it low-key." },
  { name: "Maya Brooks", path: "You -> Amara -> Maya", vouch: "2 mutuals", message: "Laura mentioned this plan and said it may be a good fit." }
];

const connectionRequests = {
  intro: [
    { name: "Noah Silva", path: "You -> Laura -> Noah", type: "Intro request received", status: "Waiting for you", actions: true },
    { name: "Ines Costa", path: "You -> Emma -> Ines", type: "Intro request received", status: "New" }
  ],
  sent: [
    { name: "Emma Laurent", path: "You -> Laura -> Emma", type: "Via mutual friend", status: "Sent to Laura" },
    { name: "Maya Brooks", path: "You -> Amara -> Maya", type: "Direct request", status: "Waiting" }
  ],
  accepted: [
    { name: "Theo Jensen", path: "You -> Theo", type: "Accepted request", status: "Chat open" },
    { name: "Sofia Marin", path: "You -> Laura -> Sofia", type: "Accepted plan request", status: "Added to chat" }
  ],
  met: [
    { name: "Mina Aoki", path: "Met at Gallery visit in Mayfair", type: "Trusted Friend request", status: "Needs mutual accept" },
    { name: "Ari Patel", path: "Met at Coffee in Shoreditch", type: "Upgrade from Met", status: "Slot required" },
    { name: "Nia Mensah", path: "Met at Jazz night in Dalston", type: "Message open", status: "Network locked" }
  ],
  meetups: [
    { name: "Emma Laurent", path: "You -> Laura -> Emma", type: "Pending meetup", status: "Verify after coffee" },
    { name: "Amara Okoye", path: "You -> Laura -> Amara", type: "Pending plan meetup", status: "QR available" }
  ]
};

const clusterNetworks = {
  Laura: { state: "unlocked", path: "Trusted Friend · 1st Degree", people: ["Maya", "Ari", "Sofia"] },
  Emma: { state: "locked", path: "2nd Degree via Laura · request intro first", people: ["Locked", "Locked", "Locked"] },
  Theo: { state: "unlocked", path: "Trusted Friend · 1st Degree", people: ["Mina", "Ari", "Ren"] },
  Noah: { state: "locked", path: "2nd Degree via Amara · network locked", people: ["Locked", "Locked", "Locked"] },
  Mina: { state: "locked", path: "Met only · network stays locked until upgrade", people: ["Locked", "Locked", "Locked"] }
};

function readPrototypeState() {
  try {
    return JSON.parse(window.localStorage.getItem(prototypeStorageKey) || "{}");
  } catch {
    return {};
  }
}

function mergeObject(target, source) {
  if (!source || typeof source !== "object") return;
  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value) && target[key] && typeof target[key] === "object") {
      mergeObject(target[key], value);
    } else {
      target[key] = value;
    }
  });
}

function replaceArray(target, source) {
  if (Array.isArray(source)) target.splice(0, target.length, ...source);
}

function applyStoredPrototypeState() {
  const stored = readPrototypeState();
  mergeObject(settingsState, stored.settingsState);
  mergeObject(appState, stored.appState);
  replaceArray(notificationItems, stored.notificationItems);
  replaceArray(planJoinRequests, stored.planJoinRequests);
  replaceArray(myTrips, stored.myTrips);
  replaceArray(homeTrips, stored.homeTrips);
  replaceArray(homePeople, stored.homePeople);
  replaceArray(networkPeople, stored.networkPeople);
  replaceArray(discoverablePlans, stored.discoverablePlans);
  if (stored.connectionRequests && typeof stored.connectionRequests === "object") {
    Object.entries(stored.connectionRequests).forEach(([group, requests]) => {
      if (connectionRequests[group]) replaceArray(connectionRequests[group], requests);
    });
  }
  if (stored.myPlans && typeof stored.myPlans === "object") {
    Object.entries(stored.myPlans).forEach(([group, plans]) => {
      if (myPlans[group]) replaceArray(myPlans[group], plans);
    });
  }
  if (stored.chats && typeof stored.chats === "object") {
    Object.entries(stored.chats).forEach(([group, items]) => {
      if (chats[group]) replaceArray(chats[group], items);
    });
  }
  if (Array.isArray(stored.removedConnections)) {
    removedConnections.clear();
    stored.removedConnections.forEach((name) => removedConnections.add(name));
  }
  if (Array.isArray(stored.deletedChatKeys)) {
    deletedChatKeys.clear();
    stored.deletedChatKeys.forEach((key) => deletedChatKeys.add(key));
  }
  mergeObject(trustedFriendState, stored.trustedFriendState);
  if (typeof stored.instagramAccessUnlocked === "boolean") instagramAccessUnlocked = stored.instagramAccessUnlocked;
  if (typeof stored.introThreadStarted === "boolean") introThreadStarted = stored.introThreadStarted;
  if (typeof stored.introThreadLeft === "boolean") introThreadLeft = stored.introThreadLeft;
  if (typeof stored.activeHomeTripId === "string") activeHomeTripId = stored.activeHomeTripId;
  if (typeof stored.activeHomeCity === "string") activeHomeCity = stored.activeHomeCity;
  if (typeof stored.activeHomeSelectorValue === "string") activeHomeSelectorValue = stored.activeHomeSelectorValue;
  if (typeof stored.homeFilter === "string") homeFilter = stored.homeFilter;
}

function persistPrototypeState() {
  const snapshot = {
    settingsState,
    appState,
    notificationItems,
    connectionRequests,
    planJoinRequests,
    myPlans,
    chats,
    myTrips,
    homeTrips,
    homePeople,
    networkPeople,
    discoverablePlans,
    removedConnections: [...removedConnections],
    deletedChatKeys: [...deletedChatKeys],
    trustedFriendState,
    instagramAccessUnlocked,
    introThreadStarted,
    introThreadLeft,
    activeHomeTripId,
    activeHomeCity,
    activeHomeSelectorValue,
    homeFilter
  };
  try {
    window.localStorage.setItem(prototypeStorageKey, JSON.stringify(snapshot));
  } catch {
    // Local persistence is best-effort in the static prototype.
  }
  updateNotificationBadges();
}

function activeNotificationCount() {
  return notificationItems.filter((item) => item.active).length;
}

function updateNotificationBadges() {
  const count = activeNotificationCount();
  document.querySelectorAll("#home .icon-button[data-next='notifications']").forEach((button) => {
    let badge = button.querySelector(".app-notification-badge");
    if (!count) {
      badge?.remove();
      button.setAttribute("aria-label", "Notifications");
      return;
    }
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "app-notification-badge";
      button.appendChild(badge);
    }
    badge.textContent = String(count);
    button.setAttribute("aria-label", `${count} notifications`);
  });
  const profileNotification = document.querySelector("#profileMenu [data-next='notifications']");
  if (profileNotification) {
    profileNotification.dataset.count = count ? String(count) : "";
  }
}

function upsertNotification(item) {
  const existing = notificationItems.find((notification) => notification.id === item.id);
  if (existing) {
    Object.assign(existing, item, { active: true });
  } else {
    notificationItems.unshift({ ...item, active: true });
  }
  appState.notificationsRead = false;
}

function upsertConnectionRequest(group, request) {
  const requests = connectionRequests[group];
  if (!requests) return;
  const existing = requests.find((item) => item.name === request.name && item.type === request.type);
  if (existing) {
    Object.assign(existing, request);
  } else {
    requests.unshift(request);
  }
}

function upsertPlanJoinRequest(request) {
  const existing = planJoinRequests.find((item) => item.name === request.name && item.path === request.path);
  if (existing) {
    Object.assign(existing, request);
  } else {
    planJoinRequests.unshift(request);
  }
  syncPlanRequestCounts();
}

function upsertChat(filter, chat) {
  const target = chats[filter];
  if (!target) return;
  const existing = target.find((item) => item.name === chat.name && item.chatType === chat.chatType);
  if (existing) {
    Object.assign(existing, chat);
  } else {
    target.unshift(chat);
  }
  deletedChatKeys.delete(chatKey(chat));
  deletedChatKeys.delete(chatKey(chat.name));
}

function chatKey(chat = {}) {
  if (typeof chat === "string") return `${chat}::`.toLowerCase();
  return `${chat.name || "chat"}::${chat.chatType || chat.type || ""}`.toLowerCase();
}

function isChatDeleted(chat = {}) {
  return deletedChatKeys.has(chatKey(chat)) || deletedChatKeys.has(chatKey(chat.name || chat));
}

function findChatByName(name) {
  return Object.values(chats).flat().find((chat) => chat.name === name && !isChatDeleted(chat));
}

function allUniqueChats() {
  const seen = new Set();
  return Object.values(chats).flat().filter((chat) => {
    if (isChatDeleted(chat)) return false;
    const key = chatKey(chat);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function addNotificationEvent(kind) {
  const now = Date.now();
  const events = {
    introRequest: {
      id: `dev-intro-${now}`,
      kind: "intro",
      title: "Intro request received",
      body: "Noah asked Laura to introduce you.",
      profile: "Noah Silva"
    },
    acceptedIntro: {
      id: `dev-accepted-intro-${now}`,
      kind: "open-chat",
      title: "Intro accepted",
      body: "Laura introduced Hugo and Emma.",
      profile: "Emma Laurent",
      chatType: "intro_chat"
    },
    declinedIntro: {
      id: `dev-declined-intro-${now}`,
      kind: "profile",
      title: "Intro request closed",
      body: "Laura replied not right now.",
      profile: "Laura Chen"
    },
    introChat: {
      id: `dev-intro-chat-${now}`,
      kind: "open-chat",
      title: "Intro chat created",
      body: "Hugo and Emma can now chat through Laura's introduction.",
      profile: "Emma Laurent",
      chatType: "intro_chat"
    },
    directChat: {
      id: `dev-direct-chat-${now}`,
      kind: "open-chat",
      title: "Direct chat opened",
      body: "Emma is ready to continue the conversation.",
      profile: "Emma Laurent",
      chatType: "direct_connection_chat"
    },
    planChat: {
      id: `dev-plan-chat-${now}`,
      kind: "open-chat",
      title: "Plan chat updated",
      body: "Coffee in Shoreditch has new plan chat activity.",
      profile: "Coffee in Shoreditch",
      chatType: "plan_chat"
    },
    planJoin: {
      id: `dev-plan-join-${now}`,
      kind: "plan",
      title: "Plan join request",
      body: "Noah requested to join Coffee in Shoreditch.",
      profile: "Noah Silva"
    },
    planApproval: {
      id: `dev-plan-approval-${now}`,
      kind: "plan-view",
      title: "Plan request approved",
      body: "Your developer coffee plan was added to pending plans."
    },
    trip: {
      id: `dev-trip-${now}`,
      kind: "home",
      title: "Trip overlap found",
      body: "A new Madrid trip created trusted overlap signals."
    },
    tripOverlap: {
      id: `dev-trip-overlap-${now}`,
      kind: "home",
      title: "Trip overlap found",
      body: "Emma will also be in Barcelona during your travel dates."
    }
  };
  if (events[kind]) upsertNotification(events[kind]);
}

function syncPlanRequestCounts() {
  const requestCount = planJoinRequests.length;
  if (myPlans.hosting[0]) {
    myPlans.hosting[0].status = requestCount
      ? `${requestCount} pending request${requestCount === 1 ? "" : "s"}`
      : "No pending requests";
  }
}

function publishCreatedPlan() {
  const screen = document.querySelector("#create-plan");
  const fields = screen?.querySelectorAll("input, select") || [];
  const title = fields[0]?.value.trim() || "New trusted plan";
  const locationValue = fields[1]?.value.trim() || "London";
  const dateValue = fields[2]?.value || "";
  const timeValue = fields[3]?.value || "";
  const maxValue = Math.min(Number(fields[4]?.value || 4), 6);
  const visibility = fields[5]?.value || "Mutual connections";
  const [location = locationValue] = locationValue.split(",").map((part) => part.trim()).filter(Boolean);
  const displayDate = dateValue ? new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short" }) : "Soon";
  const displayTime = timeValue || "TBC";
  const plan = {
    name: title,
    host: "You",
    path: "Hosted by you",
    time: `${displayDate}, ${displayTime}`,
    location,
    joined: 1,
    max: maxValue,
    visibility,
    status: "No pending requests",
    role: "hosting",
    mine: true
  };
  upsertPlan("hosting", plan);
  selectedPlanName = plan.name;
  selectedPlanStatus = "hosting";
  syncPlanRequestCounts();
  persistPrototypeState();
}

function upsertPlan(group, plan) {
  const target = myPlans[group];
  if (!target) return;
  const existing = target.find((item) => item.name === plan.name);
  if (existing) {
    Object.assign(existing, plan);
  } else {
    target.unshift(plan);
  }
}

function emptyState(title, body, action = "") {
  return `
    <div class="empty-card polished-empty-state">
      <strong>${title}</strong>
      <p>${body}</p>
      ${action}
    </div>
  `;
}

function unavailableState(title, body, actionLabel = "Go back") {
  return emptyState(title, body, `<button type="button" class="soft-action" data-back>${actionLabel}</button>`);
}

function activeScreenId() {
  return document.querySelector(".screen.active")?.dataset.screen || "welcome";
}

function markScreenClean(id = activeScreenId()) {
  document.querySelector(`[data-screen="${id}"]`)?.removeAttribute("data-dirty");
}

function hasUnsavedChanges(id = activeScreenId()) {
  return dirtyScreens.has(id) && document.querySelector(`[data-screen="${id}"]`)?.dataset.dirty === "true";
}

function fallbackForScreen(id) {
  if (id === "qr-reveal") return qrReturnTarget || "my-profile";
  if (id === "trip") return tripReturnTarget || "trusted";
  return backFallbacks[id] || "home";
}

function showScreen(id, options = {}) {
  const current = activeScreenId();
  if (!options.replace && current && current !== id) {
    screenHistory.push(current);
  }
  if (current === "verify" && id !== "verify") stopVerificationCountdown();
  document.querySelector("#profileMenu")?.classList.remove("open");
  screens.forEach((screen) => screen.classList.toggle("active", screen.dataset.screen === id));
  document.querySelectorAll(".bottom-nav").forEach(renderNav);
  const active = document.querySelector(`[data-screen="${id}"] .scroll-area`);
  if (active) active.scrollTop = 0;
  if (id === "home") {
    renderHomePeople();
    renderHomePlans();
    renderHomeSuggestions();
    renderNetworkMovement();
  }
  if (id === "chats") renderChats();
  if (id === "chat-detail") renderChatDetail();
  if (id === "request-intro") renderIntroMethod(introMethod);
  if (id === "nearby-people") renderNearbyPeoplePage();
  if (id === "suggested-connections") renderSuggestedConnectionsPage();
  if (id === "network-map") renderCityHub(document.querySelector(".city-node.active")?.dataset.city || "Oslo");
  if (id === "all-trips") renderAllTrips();
  if (id === "trip") renderTripEditor();
  if (id === "my-plans") renderMyPlans();
  if (id === "person-trips") renderPersonTrips();
  if (id === "person-plans") renderPersonPlans();
  if (id === "plan-detail") renderPlanDetail();
  if (id === "edit-plan") renderEditPlan();
  if (id === "plan-chat") renderPlanChat();
  if (id === "trusted-plans") renderTrustedPlans();
  if (id === "connection-requests") renderConnectionRequests();
  if (id === "plan-requests") renderPlanRequests();
  if (id === "settings") syncSettingsRows();
  if (id === "settings-detail") renderSettingsDetail();
  if (id === "notifications") renderNotifications();
  if (id === "profile") renderProfile();
  updateNotificationBadges();
  renderTrustCaps();
}

function confirmDiscardChanges(onDiscard) {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Discard changes">
      <strong>Discard changes?</strong>
      <p>Your draft will not be saved if you leave this screen.</p>
      <div>
        <button type="button" data-keep-editing>Keep editing</button>
        <button type="button" data-discard-changes>Discard</button>
      </div>
    </div>
  `;
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-keep-editing]") || event.target === dialog) {
      dialog.remove();
      return;
    }
    if (event.target.closest("[data-discard-changes]")) {
      dialog.remove();
      onDiscard();
    }
  });
  document.body.append(dialog);
}

function confirmCancelHostedPlan() {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Cancel plan">
      <strong>Cancel this plan?</strong>
      <p>This will permanently cancel the plan for all attendees. This action can't be undone.</p>
      <div>
        <button type="button" data-keep-plan>Keep Plan</button>
        <button type="button" data-confirm-cancel-plan>Cancel Plan</button>
      </div>
    </div>
  `;
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-keep-plan]") || event.target === dialog) {
      dialog.remove();
      return;
    }
    if (event.target.closest("[data-confirm-cancel-plan]")) {
      dialog.remove();
      planFilter = "hosting";
      showScreen("my-plans", { replace: true });
    }
  });
  document.body.append(dialog);
}

function confirmDeleteTrip(tripId) {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Delete trip">
      <strong>Delete this trip?</strong>
      <p>This will remove the trip from your profile and matching views.</p>
      <div>
        <button type="button" data-keep-trip>Cancel</button>
        <button type="button" data-confirm-delete-trip>Delete Trip</button>
      </div>
    </div>
  `;
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-keep-trip]") || event.target === dialog) {
      dialog.remove();
      return;
    }
    if (event.target.closest("[data-confirm-delete-trip]")) {
      const tripIndex = myTrips.findIndex((trip) => trip.id === tripId);
      if (tripIndex >= 0) myTrips.splice(tripIndex, 1);
      const homeIndex = homeTrips.findIndex((trip) => trip.id === tripId);
      if (homeIndex >= 0) homeTrips.splice(homeIndex, 1);
      if (activeHomeTripId === tripId) activeHomeTripId = homeTrips[0]?.id || myTrips[0]?.id || "";
      dialog.remove();
      renderAllTrips();
      renderHomeTripSelect();
      renderHomePeople();
      renderHomeSuggestions();
      persistPrototypeState();
      showScreen("all-trips", { replace: true });
    }
  });
  document.body.append(dialog);
}

function confirmRemoveConnection(name) {
  const profile = personProfiles[name];
  if (!profile) return;
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Remove connection">
      <strong>Remove from network?</strong>
      <p>This will remove this person as an active connection. Any network paths that depend on them may become locked, but your past chats, plans and meetup history will remain archived.</p>
      <div>
        <button type="button" data-keep-connection>Keep Connection</button>
        <button type="button" data-confirm-remove-connection>Remove</button>
      </div>
    </div>
  `;
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-keep-connection]") || event.target === dialog) {
      dialog.remove();
      return;
    }
    if (event.target.closest("[data-confirm-remove-connection]")) {
      removedConnections.add(name);
      removeGraphFlag("trustedConnections", name);
      removeGraphFlag("metConnections", name);
      if ((profile.directRelationship === "Trusted Friend" || profile.relationship === "Trusted Friend") && trustedFriendState.used > 0) trustedFriendState.used -= 1;
      Object.values(chats).flat().forEach((chat) => {
        if (chat.name === name || pathDependsOnRemoved(chat.path, chat.name)) chat.archived = true;
      });
      dialog.remove();
      showUtilityFeedback("Network path archived", `${profile.name.split(" ")[0]}'s active branch was removed. Dependent paths are now archived or locked until the path reopens.`);
      refreshTrustGraphViews();
    }
  });
  document.body.append(dialog);
}

function confirmReconnection(name) {
  const profile = profileForName(name);
  if (!profile) return;
  document.querySelector(".discard-dialog")?.remove();
  const firstName = profile.name.split(" ")[0];
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Request reconnection">
      <strong>Reconnect with ${firstName}?</strong>
      <p>You’re no longer actively connected, but you can request to reconnect. If ${firstName} accepts, your connection becomes active again and your shared network path reopens. Past chats, plans and meetup history remain preserved.</p>
      <div>
        <button type="button" data-cancel-reconnect>Cancel</button>
        <button type="button" data-send-reconnect>Send Request</button>
      </div>
    </div>
  `;
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-cancel-reconnect]") || event.target === dialog) {
      dialog.remove();
      return;
    }
    if (event.target.closest("[data-send-reconnect]")) {
      removedConnections.delete([...removedConnections].find((removed) => nameKey(removed) === nameKey(name)) || name);
      addGraphFlag("trustedConnections", name);
      if ((profile.directRelationship === "Trusted Friend" || profile.relationship === "Trusted Friend") && trustedFriendState.used < currentTrustedFriendCap()) trustedFriendState.used += 1;
      Object.values(chats).flat().forEach((chat) => {
        if (chat.name === name || pathParts(chat.path).some((part) => nameKey(part) === nameKey(name))) chat.archived = false;
      });
      dialog.remove();
      showUtilityFeedback("Path reopened", `${firstName}'s trusted branch is active again. Dependent people, plans and city routes can reopen where the path is valid.`);
      refreshTrustGraphViews();
    }
  });
  document.body.append(dialog);
}

function confirmTrustedUpgrade(name) {
  const profile = profileForName(name);
  if (!profile) return;
  document.querySelector(".discard-dialog")?.remove();
  const firstName = profile.name.split(" ")[0];
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Upgrade trusted connection">
      <strong>Make ${firstName} a Trusted Friend?</strong>
      <p>This uses a Trusted Friend slot and opens ${firstName}'s wider network branch. You can remove this connection later without deleting past chats, plans or meetup history.</p>
      <div>
        <button type="button" data-dialog-close>Cancel</button>
        <button type="button" data-confirm-trust-upgrade="${profile.name}">Confirm Trusted Friend</button>
      </div>
    </div>
  `;
  document.body.append(dialog);
}

function showUtilityFeedback(title, body, actionLabel = "Done") {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="${title}">
      <strong>${title}</strong>
      <p>${body}</p>
      <div>
        <button type="button" data-dialog-close>${actionLabel}</button>
      </div>
    </div>
  `;
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-dialog-close]") || event.target === dialog) dialog.remove();
  });
  document.body.append(dialog);
}

function syncSettingsRows() {
  Object.entries(settingsState.privacy).forEach(([key, value]) => {
    const target = document.querySelector(`[data-setting-value="${key}"]`);
    if (target) target.textContent = value;
  });
  Object.entries(settingsState.notifications).forEach(([key, enabled]) => {
    const row = document.querySelector(`[data-notification-setting="${key}"]`);
    const value = document.querySelector(`[data-setting-value="${key}"]`);
    if (value) value.textContent = enabled ? "On" : "Off";
    if (row) {
      row.classList.toggle("is-off", !enabled);
      row.setAttribute("aria-pressed", String(enabled));
    }
  });
  document.querySelector('[data-setting-value="appearance"]')?.replaceChildren(document.createTextNode(settingsState.appearance));
  document.querySelector('[data-setting-value="connected"]')?.replaceChildren(document.createTextNode(settingsState.connectedAccounts.instagram ? "Instagram connected" : "No connected accounts"));
  document.querySelector('[data-setting-value="blocked"]')?.replaceChildren(document.createTextNode(`${settingsState.blockedUsers.length} blocked`));
  document.querySelector('[data-setting-value="reports"]')?.replaceChildren(document.createTextNode(`${settingsState.reportHistory.length} submitted`));
}

function profileForName(name = "") {
  if (!name || name === "You" || name === "Hugo") return null;
  if (personProfiles[name]) return personProfiles[name];
  const first = name.split(" ")[0].toLowerCase();
  return Object.values(personProfiles).find((profile) => profile.name.split(" ")[0].toLowerCase() === first) || null;
}

function openDirectChatWith(name = "Emma Laurent", options = {}) {
  const profile = profileForName(name);
  const isKnownDemoUser = name === "Hugo" || name === "You";
  if (!profile && !isKnownDemoUser && !options.allowUnavailable) {
    showUtilityFeedback("Chat unavailable", "This person cannot be messaged right now. Their profile may be locked, archived, or unavailable.");
    return;
  }
  const requestedMode = options.mode || "";
  const normalizedMode = requestedMode === "intro_chat"
    ? "intro-group"
    : requestedMode === "intro_request"
      ? "intro-request"
      : requestedMode;
  selectedChatName = profile?.name || name;
  selectedChatPath = options.path || profile?.path || "Direct conversation";
  selectedChatPreview = options.preview || `Message ${selectedChatName.split(" ")[0]}.`;
  activeChatDetailMode = normalizedMode || (profile?.directRelationship === "Trusted Friend" ? "trusted_friend_chat" : "direct_connection_chat");
  chatMode = "default";
  showScreen("chat-detail");
}

function renderNotifications() {
  const list = document.querySelector("#notifications .notification-list");
  if (!list) return;
  const activeItems = notificationItems.filter((item) => item.active);
  list.innerHTML = activeItems.length ? activeItems.map((item) => {
    let actions = "";
    if (item.kind === "intro" || item.kind === "plan") {
      actions = `<div class="notification-actions"><button type="button" data-notification-action="accept" data-notification-id="${item.id}">Accept</button><button type="button" data-notification-action="decline" data-notification-id="${item.id}">Decline</button><button type="button" data-notification-profile="${item.profile}">View Profile</button></div>`;
    } else if (item.kind === "open-chat") {
      actions = `<div class="notification-actions"><button type="button" data-notification-chat="${item.profile}" data-chat-type="${item.chatType || "direct_connection_chat"}">Open Chat</button><button type="button" data-notification-profile="${item.profile}">View Profile</button></div>`;
    } else {
      const targets = {
        "plan-view": `<button data-next="trusted-plans">View Plan</button>`,
        home: `<button data-next="home">See People</button>`,
        unlock: `<button data-next="unlocked">View Unlock</button>`,
        network: `<button data-next="network-map">Explore</button>`,
        profile: `<button type="button" data-notification-profile="${item.profile}">View Profile</button>`
      };
      actions = `<div class="notification-actions">${targets[item.kind] || ""}</div>`;
    }
    return `<article class="notification-card" data-notification-card="${item.id}"><span>${item.title}</span><strong>${item.body}</strong>${actions}</article>`;
  }).join("") : emptyState("No notifications yet", "Intro requests, plan updates and trip overlaps will appear here.", `<button type="button" class="soft-action" data-settings-detail="developer">Generate test activity</button>`);
  updateNotificationBadges();
}

function renderSettingsDetail() {
  const title = document.querySelector("#settingsDetailTitle");
  const copy = document.querySelector("#settingsDetailCopy");
  const content = document.querySelector("#settingsDetailContent");
  if (!title || !copy || !content) return;
  const detail = activeSettingsDetail;
  const pages = {
    phone: {
      title: "Phone Number",
      copy: "View, update, or verify your phone number.",
      body: `<section class="form-card"><label>Current number<input placeholder="+44 ••• ••• 2841" /></label><label>New phone number<input type="tel" placeholder="Enter phone number" /></label><button type="button" data-settings-feedback="Verification code sent">Send verification code</button><button type="button" data-settings-feedback="Phone number saved">Save phone number</button></section>`
    },
    email: {
      title: "Email",
      copy: "Update your email address and review verification status.",
      body: `<section class="form-card"><label>Email address<input type="email" placeholder="ifunanya@example.com" /></label><div class="settings-status-card"><strong>Verified</strong><span>Your email is verified for account recovery.</span></div><button type="button" data-settings-feedback="Email update saved">Save email</button><button type="button" data-settings-feedback="Verification email sent">Resend verification</button></section>`
    },
    security: {
      title: "Password & Security",
      copy: "Change password, manage 2FA, and review active sessions.",
      body: `<section class="settings-section detail-actions"><button type="button" data-settings-feedback="Password reset email sent">Change password<span>Send secure reset link</span></button><button type="button" data-detail-toggle="2FA" aria-pressed="true">Two-factor authentication<span>On</span><i aria-hidden="true"></i></button><button type="button" data-settings-feedback="Sessions reviewed">Active sessions<span>2 devices</span></button></section>`
    },
    connected: {
      title: "Connected Accounts",
      copy: "Manage Instagram and future trust-building integrations.",
      body: `<section class="settings-section detail-actions"><button type="button" data-instagram-toggle>Instagram<span>${settingsState.connectedAccounts.instagram ? "Connected" : "Not connected"}</span></button><button type="button" data-settings-feedback="More connected accounts are coming soon">Additional platforms<span>Coming soon</span></button></section>`
    },
    blocked: {
      title: "Blocked Users",
      copy: "View and manage people removed from your visible trusted graph.",
      body: `<section class="settings-section detail-actions">${settingsState.blockedUsers.map((name) => `<button type="button" data-unblock-user="${name}">${name}<span>Unblock</span></button>`).join("") || emptyState("No blocked users", "People you block will appear here so you can unblock them later.")}</section>`
    },
    reports: {
      title: "Report History",
      copy: "Review submitted reports and keep a record of safety actions.",
      body: `<section class="settings-section detail-actions">${settingsState.reportHistory.map((item) => `<button type="button" data-settings-feedback="Report opened">${item}<span>View</span></button>`).join("") || emptyState("No report history", "Reports and safety notes you submit during testing will appear here.")}<button type="button" class="muted-plan-action" data-clear-report-history>Clear report history<span>Local history only</span></button></section>`
    },
    verification: {
      title: "Verification Settings",
      copy: "Manage QR, location, and future identity verification options.",
      body: `<section class="settings-section detail-actions"><button type="button" data-detail-toggle="QR verification" aria-pressed="true">QR verification<span>On</span><i aria-hidden="true"></i></button><button type="button" data-detail-toggle="Location verification" aria-pressed="true">Location verification<span>On</span><i aria-hidden="true"></i></button><button type="button" data-settings-feedback="Identity verification will be available in beta">Identity verification<span>Coming soon</span></button></section>`
    },
    appearance: {
      title: "Appearance",
      copy: "Choose how the app should look on this device.",
      body: `<section class="select-group single-select settings-choice-group">${["Light", "Dark", "System default"].map((mode) => `<button class="option-card ${settingsState.appearance === mode ? "selected" : ""}" type="button" data-appearance-choice="${mode}" aria-pressed="${settingsState.appearance === mode}">${mode}</button>`).join("")}</section>`
    },
    help: {
      title: "Help Centre",
      copy: "Find answers, contact support, and review community guidance.",
      body: `<section class="settings-section detail-actions"><button type="button" data-settings-feedback="What is 6dgrs opened">What is 6dgrs<span>Trusted routes through real people</span></button><button type="button" data-settings-feedback="Trusted introductions opened">Trusted Introductions<span>How warm intros work</span></button><button type="button" data-settings-feedback="Trusted Plans opened">Trusted Plans<span>Small hosted meetups</span></button><button type="button" data-settings-feedback="Trips opened">Trips<span>Travel visibility and overlaps</span></button><button type="button" data-settings-feedback="Messaging opened">Messaging<span>Intro, direct and plan chats</span></button><button type="button" data-settings-feedback="Privacy opened">Privacy<span>Control who sees what</span></button><button type="button" data-settings-feedback="Safety opened">Safety<span>Meet with trust</span></button><button type="button" data-settings-feedback="Reporting opened">Reporting<span>Report or block concerns</span></button><button type="button" data-settings-feedback="Verification opened">Verification<span>QR, location and identity</span></button><button type="button" data-settings-feedback="Support request started">Contact Support<span>Message the 6dgrs team</span></button></section>`
    },
    terms: {
      title: "Terms of Service",
      copy: "Review the current beta terms.",
      body: `<section class="safety-card legal-copy"><h2>Terms of Service</h2><p>6dgrs is a trusted-introduction and small-plans beta. You are responsible for keeping account details accurate, using introductions respectfully, and meeting people safely.</p><p>Community standards prohibit harassment, impersonation, pressure, spam, unsafe plans, and misuse of another person's trust path.</p><p>Introductions and plans are social tools, not guarantees. Hosts choose who joins a plan, and 6dgrs may limit, suspend, or remove accounts that undermine safety or trust.</p><p>User content, including messages, trip details, photos, and profile information, must be yours to share and may be moderated where safety requires it.</p><p>6dgrs is not liable for offline behaviour between users, but reports, blocks, and verification tools help preserve a safer trusted network.</p></section>`
    },
    privacyPolicy: {
      title: "Privacy Policy",
      copy: "Review how 6dgrs handles account, trip, plan, and trust data.",
      body: `<section class="safety-card legal-copy"><h2>Privacy Policy</h2><p>6dgrs uses email and phone number for account access, safety, recovery, and verification. Instagram connection is optional and used as a trust signal when you choose to connect it.</p><p>Trip, city, plan, and network information power trusted introductions, overlap matching, city hubs, and privacy-aware discovery.</p><p>Location information is only used where you enable city, trip, or meetup verification features. Network paths may be archived to preserve history without keeping active access open.</p><p>Data retention keeps past chats, plans, reports, and meetup records where they support safety and relationship history. You can request account deletion, access, correction, or visibility changes from settings.</p></section>`
    },
    developer: {
      title: "Developer Mode",
      copy: "Internal testing tools. This will be removed before launch.",
      body: `<section class="safety-card developer-warning"><h2>Developer Mode</h2><p>Developer Mode is for internal testing and will be removed before launch.</p></section><section class="settings-section detail-actions developer-actions"><button type="button" data-dev-action="intro-request">Generate Intro Request</button><button type="button" data-dev-action="accepted-intro">Generate Accepted Intro</button><button type="button" data-dev-action="declined-intro">Generate Declined Intro</button><button type="button" data-dev-action="intro-chat">Generate Intro Chat</button><button type="button" data-dev-action="direct-chat">Generate Direct Chat</button><button type="button" data-dev-action="plan-chat">Generate Plan Chat</button><button type="button" data-dev-action="plan-join">Generate Plan Join Request</button><button type="button" data-dev-action="plan-approval">Generate Plan Approval Request</button><button type="button" data-dev-action="trip-overlap">Generate Trip Overlap</button><button type="button" data-dev-action="notifications">Generate Notifications</button><button type="button" data-dev-action="trips">Generate Trips</button><button type="button" data-dev-action="empty-states">Show Empty States</button><button type="button" data-dev-action="read-notifications">Mark Notifications Read</button><button type="button" data-dev-action="reset">Reset Demo Data</button></section>`
    }
  };
  const page = pages[detail] || pages.phone;
  title.textContent = page.title;
  copy.textContent = page.copy;
  content.innerHTML = page.body;
}

function openPrivacySelector(key) {
  const setting = privacyOptions[key];
  if (!setting) return;
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card settings-selector-card" role="dialog" aria-modal="true" aria-label="${setting.title}">
      <h2>${setting.title}</h2>
      <div class="select-group single-select">
        ${setting.options.map((option) => `<button type="button" class="option-card ${settingsState.privacy[key] === option ? "selected" : ""}" data-privacy-option="${key}" data-privacy-value="${option}" aria-pressed="${settingsState.privacy[key] === option}">${option}</button>`).join("")}
      </div>
      <div><button type="button" data-dialog-close>Cancel</button><button type="button" data-save-privacy-setting="${key}">Save</button></div>
    </div>
  `;
  document.body.append(dialog);
}

function confirmDeleteAccountStepOne() {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Delete account">
      <strong>Delete your account?</strong>
      <p>This action cannot be undone.</p>
      <div><button type="button" data-dialog-close>Cancel</button><button type="button" data-delete-account-final-step>Continue</button></div>
    </div>
  `;
  document.body.append(dialog);
}

function confirmDeleteAccountFinal() {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Final delete account confirmation">
      <strong>Final confirmation</strong>
      <p>Deleting removes your account from this prototype flow. Type DELETE to confirm this destructive action.</p>
      <input id="deleteConfirmInput" class="modal-input" placeholder="Type DELETE" autocomplete="off" />
      <small id="deleteConfirmError" class="modal-error" aria-live="polite"></small>
      <div><button type="button" data-dialog-close>Keep Account</button><button type="button" data-confirm-delete-account>Delete Account</button></div>
    </div>
  `;
  document.body.append(dialog);
}

function openSafetyAction(label = "") {
  const normalized = label.toLowerCase();
  if (normalized.includes("report")) {
    showSafetyModal({
      title: "Report a user",
      body: "Tell us what happened. This is stored locally in the prototype and would be sent privately to safety support in beta.",
      placeholder: "Add report details",
      action: "Submit Report",
      type: "report"
    });
    return;
  }
  if (normalized.includes("block")) {
    showSafetyModal({
      title: "Block someone",
      body: "Blocking removes the person from your visible trusted graph in this prototype.",
      placeholder: "Name of person to block",
      action: "Block User",
      type: "block"
    });
    return;
  }
  if (normalized.includes("contact")) {
    showSafetyModal({
      title: "Contact us",
      body: "Send a note to the 6dgrs team. This is saved locally in the prototype.",
      placeholder: "How can we help?",
      action: "Send Message",
      type: "contact"
    });
    return;
  }
  showUtilityFeedback("Meeting safety guidance", "Meet in public places, verify identity through trusted routes, share plans with trusted friends, and report concerns quickly.");
}

function showSafetyModal({ title, body, placeholder, action, type }) {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  const inputTag = type === "block"
    ? `<input id="safetyActionInput" class="modal-input" placeholder="${placeholder}" />`
    : `<textarea id="safetyActionInput" placeholder="${placeholder}"></textarea>`;
  dialog.innerHTML = `
    <div class="discard-card intro-compose-card" role="dialog" aria-modal="true" aria-label="${title}">
      <h2>${title}</h2>
      <p>${body}</p>
      ${inputTag}
      <small id="safetyActionError" class="modal-error" aria-live="polite"></small>
      <div><button type="button" data-dialog-close>Cancel</button><button type="button" data-submit-safety-action="${type}">${action}</button></div>
    </div>
  `;
  document.body.append(dialog);
}

function submitSafetyAction(type) {
  const input = document.querySelector("#safetyActionInput");
  const error = document.querySelector("#safetyActionError");
  const value = input?.value.trim() || "";
  if (!value) {
    if (error) error.textContent = "Add a little detail to continue.";
    return;
  }
  if (type === "report") {
    settingsState.reportHistory.unshift(`User report · ${value.slice(0, 42)}`);
    document.querySelector(".discard-dialog")?.remove();
    syncSettingsRows();
    persistPrototypeState();
    showUtilityFeedback("Report submitted", "Your report was recorded locally for prototype testing.");
    return;
  }
  if (type === "block") {
    if (!settingsState.blockedUsers.includes(value)) settingsState.blockedUsers.unshift(value);
    document.querySelector(".discard-dialog")?.remove();
    syncSettingsRows();
    persistPrototypeState();
    showUtilityFeedback("User blocked", `${value} has been added to blocked users.`);
    return;
  }
  if (type === "contact") {
    settingsState.reportHistory.unshift(`Support note · ${value.slice(0, 42)}`);
    document.querySelector(".discard-dialog")?.remove();
    syncSettingsRows();
    persistPrototypeState();
    showUtilityFeedback("Message sent", "Your note was saved locally for prototype testing.");
  }
}

function openFeedbackForm() {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card feedback-card" role="dialog" aria-modal="true" aria-label="Send feedback">
      <h2>Send Feedback</h2>
      <p>This helps make 6dgrs clearer for friends and family testers.</p>
      <label>What confused you?<textarea data-feedback-field="confused" placeholder="Anything unclear?"></textarea></label>
      <label>What did you like?<textarea data-feedback-field="liked" placeholder="What felt useful or polished?"></textarea></label>
      <label>What felt broken?<textarea data-feedback-field="broken" placeholder="Buttons, pages, wording, layout..."></textarea></label>
      <label>Would you use this?<select data-feedback-field="wouldUse"><option>Yes</option><option>Maybe</option><option>No</option></select></label>
      <label>Any other notes?<textarea data-feedback-field="notes" placeholder="Anything else testers should tell us?"></textarea></label>
      <small id="feedbackError" class="modal-error" aria-live="polite"></small>
      <div><button type="button" data-dialog-close>Cancel</button><button type="button" data-submit-feedback>Save Feedback</button></div>
    </div>
  `;
  document.body.append(dialog);
}

function submitFeedback() {
  const fields = [...document.querySelectorAll("[data-feedback-field]")];
  const feedback = fields.reduce((item, field) => {
    item[field.dataset.feedbackField] = field.value.trim();
    return item;
  }, { createdAt: new Date().toISOString() });
  const hasText = ["confused", "liked", "broken", "notes"].some((key) => feedback[key]);
  if (!hasText) {
    const error = document.querySelector("#feedbackError");
    if (error) error.textContent = "Add at least one note to save feedback.";
    return;
  }
  appState.feedback = Array.isArray(appState.feedback) ? appState.feedback : [];
  appState.feedback.unshift(feedback);
  persistPrototypeState();
  document.querySelector(".discard-dialog")?.remove();
  showUtilityFeedback("Thank you", "Your feedback was saved locally in this prototype.");
}

function navigateBackFrom(current) {
  markScreenClean(current);
  const target = current === "unlocked" ? fallbackForScreen(current) : screenHistory.pop() || fallbackForScreen(current);
  showScreen(target, { replace: true });
}

function goBack() {
  const current = activeScreenId();
  if (current === "chats" && chatMode !== "default") {
    const target = chatReturnTarget || screenHistory.pop() || "home";
    chatMode = "default";
    showScreen(target, { replace: true });
    return;
  }
  if (rootScreens.has(current)) return;
  if (hasUnsavedChanges(current)) {
    confirmDiscardChanges(() => navigateBackFrom(current));
    return;
  }
  navigateBackFrom(current);
}

function ensureBackButtons() {
  screens.forEach((screen) => {
    if (rootScreens.has(screen.dataset.screen) || screen.querySelector(".screen-back-button")) return;
    const existingBack = [...screen.querySelectorAll("button")]
      .find((button) => button.textContent.trim().toLowerCase() === "back");
    if (existingBack) {
      existingBack.removeAttribute("data-next");
      existingBack.classList.add("back-placeholder");
      existingBack.setAttribute("aria-hidden", "true");
      existingBack.tabIndex = -1;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "screen-back-button";
    button.dataset.back = "";
    button.setAttribute("aria-label", "Go back");
    screen.append(button);
    screen.classList.add("has-back-nav");
  });
}

function cleanBrandingImages() {
  document.querySelectorAll(".onboarding-brand img, .brand-small img").forEach((image) => image.remove());
}

function renderInstagramAccess() {
  const profile = personProfiles[selectedProfileName] || personProfiles["Emma Laurent"];
  const card = document.querySelector("#emmaInstagramCard");
  const status = document.querySelector("#emmaInstagramStatus");
  const hint = document.querySelector("#emmaInstagramHint");
  if (!card || !status || !hint) return;
  const unlocked = instagramAccessUnlocked || profile.relationship === "Trusted Friend";
  card.dataset.trustedInstagram = String(unlocked);
  card.dataset.instagramProfile = profile.instagram;
  card.classList.toggle("locked", !unlocked);
  card.classList.toggle("unlocked", unlocked);
  status.textContent = unlocked
    ? `Trusted contact confirmed. Open ${profile.name.split(" ")[0]}'s Instagram travel photos.`
    : `Connect as trusted contacts to view ${profile.name.split(" ")[0]}'s travel photos.`;
  hint.textContent = unlocked
    ? `@${profile.instagram} opens in Instagram.`
    : "Locked until a trusted connection is established.";
}

function selectedProfile() {
  return personProfiles[selectedProfileName] || {
    name: selectedProfileName || "Unavailable profile",
    initials: "?",
    city: "Unavailable",
    homeCity: "",
    relationship: "Unavailable",
    path: "No active trust path",
    directRelationship: "",
    action: "Unavailable",
    bio: "This profile cannot be loaded right now. It may have been removed, archived, or outside your current trust path.",
    interests: ["Unavailable"],
    stats: "No profile data available",
    vouches: [],
    instagram: "",
    trips: [],
    plans: { hosting: [], attending: [], past: [] },
    unavailable: true
  };
}

function nameKey(name = "") {
  return name.split(" ")[0].toLowerCase();
}

function normalizeTrustPath(path = "") {
  return String(path || "").replaceAll("→", "->").replace(/\s+via\s+/gi, " -> ");
}

function canonicalPersonName(name = "") {
  if (!name || name === "You" || name === "Hugo") return name;
  return profileForName(name)?.name || name;
}

function isRemovedName(name = "") {
  const key = nameKey(name);
  return [...removedConnections].some((removed) => nameKey(removed) === key);
}

function pathParts(path = "") {
  const normalized = normalizeTrustPath(path);
  return normalized.includes("->") ? normalized.split("->").map((part) => part.trim()).filter(Boolean) : [];
}

function graphList(key) {
  if (!Array.isArray(appState[key])) appState[key] = [];
  return appState[key];
}

function hasGraphFlag(key, name = "") {
  const normalized = nameKey(canonicalPersonName(name));
  return graphList(key).some((item) => nameKey(canonicalPersonName(item)) === normalized);
}

function addGraphFlag(key, name = "") {
  const canonical = canonicalPersonName(name);
  if (!canonical || canonical === "You" || canonical === "Hugo") return;
  const list = graphList(key);
  if (!hasGraphFlag(key, canonical)) list.unshift(canonical);
}

function removeGraphFlag(key, name = "") {
  const normalized = nameKey(canonicalPersonName(name));
  appState[key] = graphList(key).filter((item) => nameKey(canonicalPersonName(item)) !== normalized);
}

function isMetConnection(name = "") {
  const profile = profileForName(name);
  return Boolean(
    profile?.directRelationship === "Met" ||
    hasGraphFlag("metConnections", name) ||
    (Array.isArray(appState.confirmedMeetups) && appState.confirmedMeetups.some((meetup) => nameKey(meetup.person) === nameKey(name)))
  );
}

function directTrustedNames() {
  const profileTrusted = Object.values(personProfiles)
    .filter((profile) => profile.directRelationship === "Trusted Friend" || hasGraphFlag("trustedConnections", profile.name))
    .map((profile) => profile.name);
  return [...new Set([...profileTrusted, ...graphList("trustedConnections")])]
    .filter((name) => name && !isRemovedName(name));
}

function isTrustedConnection(name = "") {
  const key = nameKey(name);
  return directTrustedNames().some((trustedName) => nameKey(trustedName) === key);
}

function isVouchedConnection(name = "") {
  return hasGraphFlag("vouchedConnections", name) || Boolean(profileForName(name)?.vouches?.length);
}

function pathDependsOnRemoved(path = "", targetName = "") {
  const parts = pathParts(path);
  const targetKey = nameKey(targetName || parts.at(-1) || "");
  return parts.slice(1, -1).some((part) => isRemovedName(part)) || (targetKey && isRemovedName(targetKey));
}

function pathFirstHopIsTrusted(path = "") {
  const parts = pathParts(path);
  if (parts.length < 2) return false;
  const firstHop = parts[1];
  return firstHop === "You" || firstHop === "Hugo" || isTrustedConnection(firstHop);
}

function isActiveTrustPath(path = "", targetName = "") {
  const parts = pathParts(path);
  if (!parts.length) return false;
  const target = targetName || parts.at(-1);
  if (isRemovedName(target)) return false;
  if (isTrustedConnection(target) || isMetConnection(target)) return true;
  return parts.length >= 3 && pathFirstHopIsTrusted(path) && !pathDependsOnRemoved(path, target);
}

function activePath(paths = [], targetName = "") {
  return paths.find((path) => isActiveTrustPath(path, targetName));
}

function archivedPath(paths = [], targetName = "") {
  return paths.find((path) => !isActiveTrustPath(path, targetName)) || paths[0] || "";
}

function viaName(path = "") {
  const parts = pathParts(path);
  return parts.length > 2 ? parts[1] : "";
}

function displayTrustPath(path = "") {
  return pathParts(path).join(" → ") || path;
}

function connectionStateForProfile(profile) {
  const paths = profile.paths || (pathParts(profile.path).length ? [profile.path] : []);
  const isTrusted = isTrustedConnection(profile.name);
  const isMet = !isTrusted && isMetConnection(profile.name);
  const directRelationship = isTrusted ? "Trusted Friend" : isMet ? "Met" : (profile.directRelationship || (["Trusted Friend", "Met"].includes(profile.relationship) ? profile.relationship : ""));
  const removedSelf = isRemovedName(profile.name);
  const livePath = activePath(paths, profile.name);
  const oldPath = archivedPath(paths, profile.name);
  const removedVia = viaName(oldPath);

  if (removedSelf) {
    return {
      state: "archived",
      relationship: "Archived Path",
      path: `Previously connected${removedVia ? ` via ${removedVia}` : ""}`,
      canRemove: false,
      removeLabel: "",
      archived: true,
      locked: false,
      action: "Request Reconnection"
    };
  }
  if (directRelationship) {
    return {
      state: "direct",
      relationship: directRelationship,
      path: directRelationship === "Trusted Friend" ? "Direct trusted connection" : "Met in person · wider network stays locked until Trusted Friend",
      canRemove: true,
      removeLabel: directRelationship === "Trusted Friend" ? "Remove Trusted Friend" : "Remove Met Contact",
      locked: false,
      action: directRelationship === "Trusted Friend" ? "Message" : "Request Trusted Connection"
    };
  }
  if (livePath) {
    const via = viaName(livePath);
    return {
      state: "active-path",
      relationship: via ? `Connected via ${via}` : profile.relationship,
      path: displayTrustPath(livePath),
      canRemove: true,
      removeLabel: "Remove from Network",
      locked: false,
      action: profile.action || "Request Intro"
    };
  }
  return {
    state: "archived",
    relationship: "Archived Path",
    path: `Previously connected${removedVia ? ` via ${removedVia}` : ""}`,
    canRemove: false,
    removeLabel: "",
    archived: true,
    locked: true,
    action: "Request Reconnection"
  };
}

function connectionStateForPerson(person) {
  const profile = personProfiles[person.name];
  if (profile) return connectionStateForProfile(profile);
  const paths = pathParts(person.path).length ? [person.path] : [];
  if (isTrustedConnection(person.name)) {
    return {
      state: "direct",
      relationship: "Trusted Friend",
      path: "Direct trusted connection",
      locked: false,
      action: "Message"
    };
  }
  if (isMetConnection(person.name) || person.met) {
    return {
      state: "met",
      relationship: "Met",
      path: "Met in person · network remains locked until Trusted Friend",
      locked: false,
      action: "Request Trusted Connection"
    };
  }
  if (paths.length && !activePath(paths, person.name)) {
    const oldPath = archivedPath(paths, person.name);
    return {
      relationship: "Archived Path",
      path: `Previously connected${viaName(oldPath) ? ` via ${viaName(oldPath)}` : ""} · No active trust path`,
      archived: true,
      locked: true,
      action: "Request Reconnection"
    };
  }
  if (paths.length) {
    const livePath = activePath(paths, person.name);
    const via = viaName(livePath);
    return {
      relationship: via ? `Connected via ${via}` : person.badge,
      path: displayTrustPath(livePath),
      archived: false,
      locked: false,
      action: person.cta || "Request Intro"
    };
  }
  return null;
}

function refreshTrustGraphViews() {
  renderProfile();
  renderHomePeople();
  renderHomePlans();
  renderHomeSuggestions();
  renderSuggestedConnectionsPage();
  renderNearbyPeoplePage();
  renderNetworkMovement();
  renderNetworkLists();
  renderCityMutuals(document.querySelector("#cityMutualTitle")?.textContent || "Barcelona");
  renderCityHub(document.querySelector(".city-node.active")?.dataset.city || "Oslo");
  renderTrustedPlans();
  renderMyPlans();
  renderPersonPlans();
  renderConnectionRequests();
  renderPlanRequests();
  renderChats();
  renderPlanDetail();
  renderTrustCaps();
  persistPrototypeState();
}

function allPlansFlat() {
  return [
    ...discoverablePlans,
    ...Object.values(myPlans).flat(),
    ...Object.values(personProfiles).flatMap((profile) => Object.values(profile.plans || {}).flat())
  ];
}

function findSelectedPlan() {
  const matches = allPlansFlat().filter((plan) => plan.name === selectedPlanName);
  const roleMatch = matches.find((plan) => {
    if (selectedPlanStatus === "hosting") return plan.role === "hosting" || plan.mine;
    if (selectedPlanStatus === "accepted") return plan.role === "attending" || plan.viewerStatus === "accepted";
    if (selectedPlanStatus === "pending") return plan.role === "pending" || plan.viewerStatus === "pending";
    if (selectedPlanStatus === "past") return plan.role === "past" || plan.viewerStatus === "past";
    if (selectedPlanStatus === "discoverable") return plan.viewerStatus === "discoverable" && !plan.mine;
    return false;
  });
  return roleMatch || matches.find((plan) => plan.role || plan.viewerStatus) || matches[0];
}

function fallbackPlan() {
  return {
    name: selectedPlanName || "Plan unavailable",
    host: "Unavailable",
    path: "No active plan data",
    time: "Unavailable",
    location: "Unavailable",
    joined: 0,
    max: 0,
    visibility: "Unavailable",
    unavailable: true
  };
}

function selectedPlan() {
  return findSelectedPlan() || discoverablePlans[0] || myPlans.hosting[0] || fallbackPlan();
}

function planStatusForName(name) {
  if ((myPlans.hosting || []).some((plan) => plan.name === name)) return "hosting";
  if ((myPlans.attending || []).some((plan) => plan.name === name)) return "accepted";
  if ((myPlans.pending || []).some((plan) => plan.name === name)) return "pending";
  if ((myPlans.past || []).some((plan) => plan.name === name)) return "past";
  return "discoverable";
}

function planPreviewRow(plan) {
  const role = plan.host === selectedProfile().name ? "Hosting" : plan.role === "past" ? "Past" : "Attending";
  return `<div class="trip-row"><strong>${role}</strong><span>${plan.name} · ${plan.time}</span></div>`;
}

function renderProfile() {
  const profile = selectedProfile();
  const root = document.querySelector("#profile .scroll-area");
  if (!root) return;
  if (profile.unavailable) {
    root.innerHTML = `
      <div class="cover"></div>
      <section class="profile-head">
        <div class="profile-avatar">${profile.initials}</div>
        <h1>${profile.name}</h1>
        <span class="trust-badge relationship-badge">Unavailable</span>
        <p>${profile.path}</p>
      </section>
      <section class="content-section">${unavailableState("Profile cannot be loaded", profile.bio)}</section>
    `;
    return;
  }
  const connectionState = connectionStateForProfile(profile);
  const upcomingTrips = profile.trips.filter((trip) => trip.status !== "past").slice(0, 2);
  const allPlans = [...(profile.plans.hosting || []), ...(profile.plans.attending || []), ...(profile.plans.past || [])];
  const activePlans = allPlans.filter((plan) => plan.role !== "past").length;
  const pastPlans = allPlans.filter((plan) => plan.role === "past").length;
  const actionLabel = connectionState.action || (profile.relationship === "Trusted Friend" ? "Message" : profile.relationship === "Met" ? "Request Trusted Connection" : "Request Intro");
  const actionTarget = actionLabel === "Message" ? "chat-detail" : "request-intro";
  const isTrustUpgradeAction = actionLabel === "Request Trusted Connection";
  const chatTypeAttr = actionLabel === "Message"
    ? ` data-chat-type="${profile.directRelationship === "Trusted Friend" ? "trusted_friend_chat" : "direct_connection_chat"}" data-chat-name="${profile.name}" data-chat-path="${connectionState.path}" data-chat-preview="Message ${profile.name.split(" ")[0]} directly."`
    : "";
  const primaryAction = connectionState.archived
    ? `<button type="button" data-request-reconnect="${profile.name}">Request Reconnection</button>`
    : isTrustUpgradeAction
      ? `<button type="button" data-trust-upgrade="${profile.name}">${actionLabel}</button>`
      : `<button ${connectionState.locked ? "disabled" : `data-next="${actionTarget}" data-profile-name="${profile.name}"${chatTypeAttr}`}>${actionLabel}</button>`;
  root.innerHTML = `
    <div class="cover"></div>
    <section class="profile-head">
      <div class="profile-avatar">${profile.initials}</div><div class="verified">Verified</div>
      <h1>${profile.name}</h1><span class="trust-badge relationship-badge">${connectionState.relationship}</span><p>Currently in ${profile.city} · ${connectionState.path}</p>
      <div class="profile-actions">${primaryAction}<button type="button" data-share-profile>Share Profile</button></div>
    </section>
    <section class="content-section"><h2>About</h2><p class="about-copy">${profile.bio}</p><div class="chip-cloud static">${profile.interests.map((interest) => `<span>${interest}</span>`).join("")}</div></section>
    <section class="content-section"><div class="section-heading"><h2>Upcoming Trips</h2><button data-next="person-trips">View all trips →</button></div><div class="profile-carousel discovery-trips">${upcomingTrips.length ? upcomingTrips.map((trip) => `<div class="trip-row"><strong>${trip.city}</strong><span>${displayTripRange(trip)} · ${trip.visibility} · ${trip.status}</span></div>`).join("") : `<div class="trip-row muted"><strong>No visible trips</strong><span>Nothing visible right now</span></div>`}</div></section>
    <section class="content-section compact-plans-preview"><div class="section-heading"><div><h2>Plans</h2><span>${activePlans} active · ${pastPlans} past</span></div><button data-next="person-plans">View all Plans →</button></div>${allPlans.slice(0, 2).map(planPreviewRow).join("") || `<div class="trip-row muted"><strong>No visible plans</strong><span>No current plan previews</span></div>`}</section>
    <section class="presence-card"><div class="presence-world"></div><div><h2>Global Presence</h2><p>${profile.stats}</p><button data-next="network-map">Open Network Explorer</button></div></section>
    <section class="content-section"><h2>Vouched By</h2><div class="testimonial-row">${profile.vouches.map(([name, quote]) => `<div>${name}<span>${quote}</span></div>`).join("")}</div></section>
    <button class="instagram-lock locked" type="button" id="emmaInstagramCard" data-instagram-profile="${profile.instagram}" data-trusted-instagram="false"><strong>Instagram</strong><span id="emmaInstagramStatus">Connect as trusted contacts to view ${profile.name.split(" ")[0]}'s travel photos.</span><small id="emmaInstagramHint">Locked until a trusted connection is established.</small></button>
    ${connectionState.canRemove ? `<div class="profile-utility-actions"><button type="button" data-remove-connection="${profile.name}">Remove from Network</button></div>` : `<p class="archived-path-note">You’re no longer actively connected. Past chats, plans and meetup history remain preserved.</p>`}
  `;
  renderInstagramAccess();
}

function renderTrustedMode(mode = "onboarding") {
  trustedMode = mode;
  const instruction = document.querySelector("#trustedInstruction");
  const cta = document.querySelector("#trustedCta");
  if (!instruction || !cta) return;
  if (mode === "add-friends") {
    instruction.textContent = "Add Trusted Friends intentionally. Slots are limited and wider networks unlock only for 1st Degree relationships.";
    cta.textContent = "Done";
    cta.dataset.next = "network-list";
  } else {
    instruction.textContent = "Add up to 6 Trusted Friends to start your network.";
    cta.textContent = "Continue";
    cta.dataset.next = "privacy";
  }
  renderTrustCaps();
}

function renderQrRevealMode(returnTarget = "home") {
  qrReturnTarget = returnTarget;
  const cta = document.querySelector("#qr-reveal .primary-button");
  if (cta) {
    cta.textContent = returnTarget === "home" ? "Home" : "Continue";
    cta.dataset.next = returnTarget;
  }
}

function renderNav(nav) {
  const current = document.querySelector(".screen.active")?.dataset.screen;
  const isActive = (item) => (
    item.screen === current ||
    (current === "network-map" && item.screen === "network-list") ||
    (current === "city-mutuals" && item.screen === "home") ||
    (["trusted-plans", "nearby-people", "suggested-connections", "create-plan", "plan-detail", "plan-chat", "notifications", "connection-requests"].includes(current) && item.screen === "home") ||
    (["my-profile", "all-trips", "my-plans", "edit-plan", "plan-requests", "person-trips", "person-plans", "edit-profile", "settings", "settings-detail", "safety-centre", "how-works", "profile"].includes(current) && item.screen === "my-profile")
  );
  nav.innerHTML = bottomNavTargets.map((item) => (
    `<button class="${isActive(item) ? "active" : ""}" data-next="${item.screen}">${item.label}</button>`
  )).join("");
}

function personCard(person, index = 0) {
  const color = index % 3 === 0 ? "#ffbfa3,#a79cff" : index % 3 === 1 ? "#79dccb,#7c72ff" : "#ffd89b,#6c63ff";
  const pathState = connectionStateForPerson(person);
  const isArchived = Boolean(pathState?.archived);
  const isLocked = !isArchived && (pathState?.locked || person.locked || person.degree === 3);
  const cardCta = pathState?.action || person.cta;
  const nextScreen = cardCta.includes("Request") || cardCta.includes("Path") ? "request-intro" : "profile";
  const hasProfile = Boolean(personProfiles[person.name]);
  const action = isArchived ? "Request Reconnection" : isLocked ? "Locked" : cardCta;
  const isMessageAction = action === "Message";
  const isHomeDiscovery = ["home", "nearby-people"].includes(activeScreenId());
  const parts = pathParts(person.path || "");
  const mutualName = parts.length > 2 ? parts[1] : "";
  const relationship = pathState?.relationship || (person.badge === "Living here" ? "Lives Here"
    : person.badge === "Trusted local" ? "Local Host"
      : person.degree === 2 && mutualName ? `Mutual via ${mutualName}`
        : person.badge);
  const context = pathState?.path || (person.met
    ? `${person.path}. Met in person - not yet added to trusted circle.`
    : person.degree === 2 && mutualName
      ? `Visible through ${mutualName}. Request an intro before messaging.`
      : person.degree === 3
        ? "Limited preview - unlock through a trusted connection."
        : person.livesIn
          ? `Local connection based in ${person.livesIn}.`
          : person.trips?.length
            ? `Visiting ${person.trips[0].city} during your selected dates.`
            : person.path);
  const discoveryContext = isHomeDiscovery ? homeCardContext(person) : "";
  const suggestionContext = person.suggestionReason ? suggestedLocationLine(person) : "";
  const suggestionWhy = person.suggestionReasons?.length
    ? `<div class="suggestion-why"><strong>Because you both...</strong>${person.suggestionReasons.map((reason) => `<span>${reason}</span>`).join("")}</div>`
    : "";
  return `
    <article class="person-card ${isLocked ? "locked-relation" : ""}" ${hasProfile ? `data-next="profile" data-profile-name="${person.name}"` : ""}>
      <div class="avatar" style="background:linear-gradient(145deg, ${color})"></div>
      <div>
        <h3>${person.name}</h3>
        <span class="trust-badge relationship-badge">${relationship}</span>
        <p>${suggestionContext || discoveryContext || `${person.city} · ${context}`}</p>
        ${suggestionWhy}
      </div>
      <button ${isArchived ? `type="button" data-request-reconnect="${person.name}"` : isLocked ? "disabled" : action === "Request Trusted Connection" ? `type="button" data-trust-upgrade="${person.name}"` : isMessageAction ? `type="button" data-message-person="${person.name}"` : `data-next="${nextScreen}" ${hasProfile ? `data-profile-name="${person.name}"` : ""}`}>${action}</button>
    </article>
  `;
}

function chatCard(chat, index, mode = "default") {
  const action = mode === "share" ? `<button class="share-contact" data-share-contact="${chat.name}">Share</button>` : "";
  const normalizedType = (chat.chatType || "").replaceAll("-", "_");
  const isArchivedChat = Boolean(chat.archived || pathDependsOnRemoved(chat.path, chat.name));
  const isPlanChat = chat.screen === "plan-chat" || normalizedType === "plan_chat" || normalizedType === "archived_plan_chat";
  const destination = isPlanChat ? "plan-chat" : (chat.screen || "chat-detail");
  const planStatus = normalizedType === "archived_plan_chat" || isArchivedChat && isPlanChat ? "past" : (chat.planStatus || planStatusForName(chat.name));
  const planAttrs = isPlanChat ? ` data-plan-name="${chat.name}" data-plan-status="${planStatus}"` : "";
  const detailAttrs = !isPlanChat && normalizedType
    ? ` data-chat-type="${normalizedType}" data-chat-role="${chat.userRole || ""}" data-chat-path="${chat.path}" data-chat-preview="${chat.preview}"${isArchivedChat ? ` data-chat-archived="true"` : ""}`
    : "";
  const hasPathRoute = chat.path.includes("->") || chat.path.includes("→");
  const chatType = chat.type || (isPlanChat ? (planStatus === "past" ? "Archived Plan Chat" : "Private Plan Chat") : chat.trusted ? "Trusted Friend Chat" : hasPathRoute ? "Direct Connection Chat" : "1:1 Chat");
  const introActions = chat.introRequest ? `
    <div class="intro-request-actions">
      <button class="primary-mini" type="button" data-introduce>Introduce</button>
      <button class="secondary-mini" type="button" data-intro-reply>Reply</button>
      <button class="text-mini" type="button" data-intro-soft-decline>Not right now</button>
    </div>
  ` : "";
  const context = isArchivedChat
    ? "Archived conversation · history preserved."
    : isPlanChat
    ? "Hosted by Amara · 4 attendees · Accepted"
    : chat.introRequest || chatType === "Intro Chat"
      ? ""
    : chat.path.includes("Trusted Friend")
      ? "Trusted circle conversation."
      : hasPathRoute
        ? (chatType === "Intro Chat" ? "" : "Visible through a mutual introduction path.")
        : chat.preview;
  return `
    <article class="chat-card ${mode === "share" ? "share-mode" : ""} ${chat.introRequest ? "intro-request-card" : ""} ${chat.muted ? "is-muted" : ""} ${isArchivedChat ? "archived-chat-card" : ""}" ${mode === "share" || chat.introRequest && !isArchivedChat ? "" : `data-next="${destination}"${planAttrs}${detailAttrs}`} data-chat-name="${chat.name}">
      <div class="avatar online" style="background:linear-gradient(145deg, ${index % 2 ? "#79dccb,#7c72ff" : "#ffbfa3,#a79cff"})"></div>
      <div>
        <div class="meta"><h3>${chat.name}</h3><p>${chat.time}</p></div>
        <span class="trust-badge relationship-badge">${chatType}</span><span class="muted-indicator" ${chat.muted ? "" : "hidden"} aria-label="Muted"></span>
        <p>${chat.preview}</p>
        ${context ? `<small class="context-copy">${context}</small>` : ""}
        ${introActions}
      </div>
      ${mode === "share" ? "" : `<div class="chat-card-utilities">${isArchivedChat ? `<button class="chat-icon-button chat-unarchive-icon" type="button" data-chat-unarchive aria-label="Restore archived chat"></button><button class="chat-icon-button chat-delete-archived-icon" type="button" data-chat-delete-archived aria-label="Delete archived chat permanently"></button>` : `<button class="chat-icon-button chat-mute-icon" type="button" data-chat-mute aria-label="Mute chat"></button><button class="chat-icon-button chat-archive-icon" type="button" data-chat-archive aria-label="Archive chat"></button>`}</div>`}
      ${action}
    </article>
  `;
}

function planShareComposer() {
  const plan = selectedPlan();
  const max = Math.min(plan.max || 6, 6);
  return `
    <section class="plan-share-composer">
      <article class="plan-card share-plan-preview">
        <div class="avatar" style="background:linear-gradient(145deg, #ffbfa3,#a79cff)"></div>
        <div>
          <h3>${plan.name}</h3>
          <div class="plan-status-line"><span class="trust-badge">Hosted by ${plan.host}</span><span class="trust-badge plan-state">${plan.viewerStatus === "pending" ? "Pending Approval" : "Open to Join"}</span></div>
          <p>${plan.location} · ${plan.time}</p>
          <div class="plan-meta"><span>${plan.joined}/${max} attending</span><span>${plan.visibility}</span></div>
          <small class="context-copy">Share this plan with someone trusted. They will still need host approval before chat unlocks.</small>
        </div>
      </article>
      <div class="share-send-box">
        <label>Send to<select><option>Laura Chen</option><option>Theo Jensen</option><option>Amara Okoye</option></select></label>
        <label>Message<textarea placeholder="Thought you might like this trusted plan."></textarea></label>
        <button class="primary-button" type="button">Send Plan</button>
      </div>
    </section>
  `;
}

function planCard(plan, index = 0, compact = false) {
  const max = Math.min(plan.max, 6);
  const trustState = planTrustState(plan);
  const isHosting = plan.role === "hosting" || plan.mine;
  const isAttending = plan.role === "attending";
  const isPending = plan.role === "pending" || plan.viewerStatus === "pending";
  const isPast = plan.role === "past" || plan.viewerStatus === "past";
  const actionLabel = isHosting
    ? (compact ? "Manage" : "Manage")
    : isAttending || plan.viewerStatus === "accepted"
      ? (compact ? "Open Chat" : "Open Group Chat")
      : isPending
        ? "Pending Approval"
        : isPast
          ? "View Chat History"
          : trustState.locked
            ? "Locked Path"
          : "Request to Join";
  const actionTarget = isHosting ? "edit-plan" : (isAttending || plan.viewerStatus === "accepted" || isPast) ? "plan-chat" : "plan-detail";
  const spotsLeft = Math.max(0, max - plan.joined);
  const statusBadge = isHosting ? "Hosting"
    : isAttending || plan.viewerStatus === "accepted" ? "Attending"
      : isPending ? "Pending Approval"
        : isPast ? "Past Meetup"
          : trustState.locked ? "Locked Path"
          : spotsLeft === 0 ? "Full" : "Open to Join";
  const spotBadge = spotsLeft === 0 ? "Full" : `${spotsLeft} Spot${spotsLeft === 1 ? "" : "s"} Left`;
  const visibilityBadge = plan.visibility.includes("Invite") ? "Invite Only"
    : plan.visibility.includes("Trusted") ? "Trusted Circle Only"
      : plan.visibility.includes("Mutual") ? "Mutuals Only"
        : plan.visibility;
  const planContext = isHosting
    ? "You are hosting - manage requests before people enter chat."
    : isAttending || plan.viewerStatus === "accepted"
      ? "You are accepted - group chat is unlocked."
      : isPending
        ? "You requested to join - awaiting host approval."
        : isPast
          ? "This plan has ended - archived chat is read only."
          : trustState.locked
            ? trustState.note
          : `Open to ${plan.visibility.toLowerCase()} visiting ${plan.location}.`;
  return `
    <article class="plan-card ${compact ? "compact" : ""} ${isPast ? "past-plan-card" : ""} ${trustState.locked ? "locked-relation" : ""}">
      <div class="avatar" style="background:linear-gradient(145deg, ${index % 2 ? "#79dccb,#7c72ff" : "#ffbfa3,#a79cff"})"></div>
      <div>
        <h3>${plan.name}</h3>
        <div class="plan-status-line"><span class="trust-badge">Hosted by ${plan.host}</span><span class="trust-badge plan-state">${statusBadge}</span></div>
        <p>${plan.path}</p>
        <div class="plan-meta"><span>${plan.time}</span><span>${plan.location}</span></div>
        <div class="plan-meta"><span>${plan.joined}/${max}</span><span>${spotBadge}</span><span>${visibilityBadge}</span></div>
        <small class="context-copy">${planContext}</small>
      </div>
      <button ${trustState.locked ? "disabled" : `data-next="${actionTarget}" data-plan-name="${plan.name}" data-plan-status="${plan.viewerStatus || plan.role || "discoverable"}"`}>${actionLabel}</button>
    </article>
  `;
}

function myPlanCard(plan, index = 0) {
  const max = Math.min(plan.max, 6);
  const role = plan.role || (plan.mine ? "hosting" : "attending");
  const isHosting = role === "hosting";
  const isAttending = role === "attending";
  const isPending = role === "pending";
  const isPast = role === "past";
  const hostLabel = isHosting ? "Hosted by You" : `Hosted by ${plan.host}`;
  const statusBadge = isHosting ? "Host" : isAttending ? "Accepted" : isPending ? "Pending Approval" : "Past";
  const pendingRequestCount = isHosting ? Number((plan.status || "").match(/\d+/)?.[0] || 0) : 0;
  const context = isHosting
    ? ""
    : isAttending
      ? "Accepted - chat unlocked."
      : isPending
        ? "Waiting for host confirmation before joining chat."
        : "This plan has ended - archived chat is read only.";
  const actions = isHosting
    ? `<button data-next="edit-plan" data-plan-name="${plan.name}" data-plan-status="hosting">Manage Plan</button><button data-next="plan-chat" data-plan-name="${plan.name}" data-plan-status="hosting">Open Plan Chat</button><button data-next="chats" data-chat-mode="plan-share" data-plan-name="${plan.name}" data-plan-status="hosting">Share Plan</button>`
    : isAttending
      ? `<button data-next="plan-chat" data-plan-name="${plan.name}" data-plan-status="accepted">Open Plan Chat</button><button data-next="chats">Message Host</button><button data-next="chats" data-chat-mode="plan-share" data-plan-name="${plan.name}" data-plan-status="accepted">Share Plan</button>`
      : isPending
        ? `<button data-next="chats">Message Host</button><button data-next="chats" data-chat-mode="plan-share" data-plan-name="${plan.name}" data-plan-status="pending">Share Plan</button><button class="muted-plan-action" type="button">Cancel Request</button>`
        : `<button class="muted-plan-action" data-next="plan-chat" data-plan-name="${plan.name}" data-plan-status="past">View Chat History</button>`;

  return `
    <article class="plan-card my-plan-role-card ${isPast ? "past-plan-card" : ""}">
      ${isHosting ? `<button class="plan-request-bell" data-next="plan-requests" data-plan-name="${plan.name}" aria-label="${pendingRequestCount ? `${pendingRequestCount} pending requests` : "Plan requests"}"><svg class="bell-symbol" aria-hidden="true" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>${pendingRequestCount ? `<span class="bell-count">${pendingRequestCount}</span>` : ""}</button>` : ""}
      <div class="avatar" style="background:linear-gradient(145deg, ${index % 2 ? "#79dccb,#7c72ff" : "#ffbfa3,#a79cff"})"></div>
      <div>
        <h3>${plan.name}</h3>
        <div class="plan-status-line"><span class="trust-badge">${hostLabel}</span><span class="trust-badge plan-state">${statusBadge}</span></div>
        <p>${plan.location} · ${plan.time}</p>
        <div class="plan-meta"><span>${plan.joined}/${max} attending</span><span>${plan.visibility}</span></div>
        ${context ? `<small class="context-copy">${context}</small>` : ""}
      </div>
      <div class="plan-card-actions">${actions}</div>
    </article>
  `;
}

function renderEditPlan() {
  const plan = findSelectedPlan() || selectedPlan();
  const hub = document.querySelector("#edit-plan .plan-management-hub");
  const formLabels = document.querySelectorAll("#edit-plan .form-card > label");
  const titleInput = formLabels[0]?.querySelector("input");
  const locationInput = formLabels[1]?.querySelector("input");
  const chatButton = document.querySelector("#edit-plan .chat-cta");
  if (plan.unavailable) {
    if (hub) {
      hub.querySelector("strong").textContent = "Plan unavailable";
      hub.querySelector("span").textContent = "This plan cannot be edited right now.";
    }
    if (chatButton) chatButton.disabled = true;
    return;
  }
  if (hub) {
    hub.querySelector("strong").textContent = plan.name;
    hub.querySelector("span").textContent = `${plan.time} · ${plan.location}`;
  }
  if (titleInput) {
    titleInput.value = "";
    titleInput.placeholder = plan.name;
  }
  if (locationInput) {
    locationInput.value = "";
    locationInput.placeholder = plan.location;
  }
  if (chatButton) {
    chatButton.dataset.planName = plan.name;
    chatButton.dataset.planStatus = "hosting";
  }
}

function saveEditedPlan() {
  const plan = findSelectedPlan();
  if (!plan) {
    showUtilityFeedback("Plan unavailable", "This plan could not be saved because it is no longer available.");
    return false;
  }
  const screen = document.querySelector("#edit-plan");
  const labels = [...(screen?.querySelectorAll(".form-card > label, .form-grid label") || [])];
  const title = labels[0]?.querySelector("input")?.value.trim();
  const date = labels[1]?.querySelector("input")?.value;
  const time = labels[2]?.querySelector("input")?.value;
  const location = labels[3]?.querySelector("input")?.value.trim();
  const description = labels[4]?.querySelector("textarea")?.value.trim();
  const max = Number.parseInt(labels[5]?.querySelector("select")?.value, 10);
  const visibility = labels[6]?.querySelector("select")?.value;
  const oldName = plan.name;
  if (title) plan.name = title;
  if (location) plan.location = location;
  if (description) plan.description = description;
  if (Number.isFinite(max)) plan.max = Math.min(max, 6);
  if (visibility) plan.visibility = visibility;
  if (date || time) {
    const day = date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short" }) : (plan.time.split(",")[0] || "Soon");
    plan.time = `${day}, ${time || plan.time.split(", ")[1] || "TBC"}`;
  }
  selectedPlanName = plan.name;
  if (oldName !== plan.name) {
    allPlansFlat().forEach((item) => {
      if (item !== plan && item.name === oldName && item.role === plan.role) Object.assign(item, plan);
    });
  }
  persistPrototypeState();
  return true;
}

function renderPlanChat() {
  const plan = findSelectedPlan() || selectedPlan();
  const isArchived = selectedPlanStatus === "past";
  const isHost = selectedPlanStatus === "hosting" || plan.host === "You";
  const isGuest = selectedPlanStatus === "accepted" && !isHost;
  const title = document.querySelector("#plan-chat .chat-top strong");
  const sub = document.querySelector("#plan-chat .chat-top span");
  const status = document.querySelector("#planChatStatus");
  const composer = document.querySelector("#planChatComposer");
  const quickActions = document.querySelector("#plan-chat .chat-quick-actions");
  const strip = document.querySelector("#plan-chat .participant-strip");
  const reminder = document.querySelector("#plan-chat .plan-reminder");
  const messages = document.querySelector("#plan-chat .plan-messages");
  if (plan.unavailable) {
    if (title) title.textContent = "Plan unavailable";
    if (sub) sub.textContent = "This plan could not be loaded";
    if (status) status.innerHTML = `<span class="trust-badge relationship-badge">Unavailable</span><small>No active plan chat data</small>`;
    if (quickActions) {
      quickActions.hidden = true;
      quickActions.innerHTML = "";
    }
    if (strip) strip.innerHTML = "";
    if (messages) messages.innerHTML = unavailableState("Chat unavailable", "This plan chat may have been removed, archived, or reset.");
    if (composer) {
      composer.classList.add("archived");
      composer.innerHTML = `<div class="archived-status-bar">Chat unavailable</div>`;
    }
    return;
  }
  const hostLabel = plan.host === "You" ? "Hugo" : plan.host;
  const hostFirst = hostLabel;
  const participants = [hostFirst, "Laura", "Theo", plan.host === "You" ? "Amara" : "Hugo"];
  const uniqueParticipants = [...new Set(participants)];
  const profileNames = {
    Amara: "Amara Okoye",
    Hugo: "Hugo",
    Laura: "Laura Chen",
    Theo: "Theo Jensen",
    Emma: "Emma Laurent",
    Noah: "Noah Silva",
    Camille: "Camille Roux",
    Maya: "Maya Brooks"
  };
  if (title) title.textContent = plan.name;
  if (sub) sub.textContent = `${plan.time} · ${plan.location}`;
  if (status) {
    status.innerHTML = isArchived
      ? `<span class="trust-badge relationship-badge">Archived Plan Chat</span><small>Hosted by ${hostLabel} · ${uniqueParticipants.length} attendees · Read only</small>`
      : `<span class="trust-badge relationship-badge">Private Plan Chat</span><small>Hosted by ${hostLabel} · ${uniqueParticipants.length} attendees</small>`;
  }
  if (composer) {
    composer.classList.toggle("archived", isArchived);
    composer.innerHTML = isArchived
      ? `<div class="archived-status-bar">Archived after meetup · Read only</div>`
      : `<input placeholder="Message the plan group" /><button type="button" class="photo-upload-button" aria-label="Add photo"></button><button aria-label="Send message">➤</button>`;
  }
  if (strip) {
    const participantLinks = uniqueParticipants.map((name, index) => {
      const isYou = name === "You";
      const label = index === 0 ? `${name} (Host)` : name;
      const profileName = profileNames[name] || name;
      return isYou
        ? `<button type="button">${label}</button>`
        : `<button data-next="profile" data-profile-name="${profileName}">${label}</button>`;
    }).join("<span>•</span>");
    strip.innerHTML = `<div>${participantLinks}</div>`;
  }
  document.querySelector("#planRecapCard")?.remove();
  if (isArchived && reminder && messages) {
    const recap = document.createElement("section");
    recap.className = "plan-recap-card";
    recap.id = "planRecapCard";
    recap.innerHTML = `
      <span>Plan Recap</span>
      <strong>${plan.name}</strong>
      <small>${plan.time} · Hosted by ${plan.host}</small>
      <div><span>4 attendees</span><span>12 messages</span><span>3 photos shared</span></div>
    `;
    reminder.insertBefore(recap, messages);
  }
  if (quickActions) {
    quickActions.hidden = isArchived;
    if (isArchived) {
      quickActions.innerHTML = "";
      return;
    }
    if (!isArchived && isHost) {
      quickActions.innerHTML = `<button class="small-pill" data-next="edit-plan" data-plan-name="${plan.name}" data-plan-status="hosting">Edit Plan</button><button class="small-pill" data-next="plan-requests" data-plan-name="${plan.name}">Review Requests</button><button class="small-pill" data-next="chats" data-chat-mode="plan-share" data-plan-name="${plan.name}" data-plan-status="hosting">Share</button>`;
    } else if (!isArchived && isGuest) {
      quickActions.innerHTML = `<button class="small-pill" data-next="chats">Message Host</button><button class="small-pill" data-next="chats" data-chat-mode="plan-share" data-plan-name="${plan.name}" data-plan-status="accepted">Share Plan</button><button class="small-pill muted-plan-action" type="button">Leave Plan</button>`;
    }
  }
}

function renderHomePlans() {
  const list = document.querySelector("#homePlans");
  if (!list) return;
  const plans = discoverablePlans.filter((plan) => (
    !plan.mine &&
    plan.role !== "attending" &&
    plan.role !== "pending" &&
    plan.viewerStatus === "discoverable" &&
    plan.joined < Math.min(plan.max, 6) &&
    planTrustState(plan).active
  ));
  list.innerHTML = plans.length
    ? plans.slice(0, 4).map(homePlanCard).join("")
    : emptyState("No trusted plans nearby", "Small plans from trusted paths will appear here when they match your city or trips.", `<button type="button" class="soft-action" data-next="create-plan">Create a plan</button>`);
}

function renderTrustedPlans() {
  const list = document.querySelector("#trustedPlansList");
  if (!list) return;
  const plans = discoverablePlans.filter((plan) => planTrustState(plan).active || planTrustState(plan).locked);
  list.innerHTML = plans.length
    ? plans.map((plan, index) => planCard(plan, index)).join("")
    : emptyState("No trusted plans nearby", "Plans you can request to join will appear here as your network becomes active.", `<button type="button" class="soft-action" data-next="create-plan">Host one</button>`);
}

function renderMyPlans() {
  const list = document.querySelector("#myPlansList");
  if (!list) return;
  syncPlanRequestCounts();
  const plans = myPlans[planFilter] || [];
  list.innerHTML = plans.length
    ? plans.map(myPlanCard).join("")
    : emptyState(`No ${planFilter} plans`, "Plans in this state will appear here as you host, join, request, or complete plans.", `<button type="button" class="soft-action" data-next="create-plan">Create plan</button>`);
}

function renderPersonPlans() {
  const list = document.querySelector("#personPlansList");
  if (!list) return;
  const profile = selectedProfile();
  document.querySelector("#person-plans h1").textContent = `${profile.name}'s Plans`;
  document.querySelector("#person-plans .network-header p").textContent = `Plans ${profile.name.split(" ")[0]} is hosting, attending, or has completed.`;
  const plans = profile.plans[planFilter] || profile.plans.hosting || [];
  list.innerHTML = plans.length ? plans.map(personPlanCard).join("") : emptyState("No visible plans", "Plans this person shares with your trust level will appear here.");
}

function personPlanCard(plan, index = 0) {
  const isPast = plan.role === "past" || plan.viewerStatus === "past";
  const viewerAccepted = plan.viewerStatus === "accepted" || plan.role === "attending";
  const viewerPending = plan.viewerStatus === "pending";
  const viewerAttended = Boolean(plan.viewerAttended || viewerAccepted || plan.host === "You");
  const isInformationalPast = isPast && !viewerAttended;
  const action = isInformationalPast ? ""
    : isPast ? `<button class="muted-plan-action" data-next="plan-chat" data-plan-name="${plan.name}" data-plan-status="past">View Chat History</button>`
      : viewerAccepted ? `<button data-next="plan-chat" data-plan-name="${plan.name}" data-plan-status="accepted">Open Chat</button>`
        : viewerPending ? `<button class="muted-plan-action" type="button">Cancel Request</button><button data-next="chats">Message Host</button>`
          : `<button data-next="plan-detail" data-plan-name="${plan.name}" data-plan-status="discoverable">Request to Join</button>`;
  const badge = isPast ? "Past" : viewerAccepted ? "Accepted" : viewerPending ? "Pending Approval" : "Open to Join";
  const context = isInformationalPast
    ? "Past plan - you did not attend."
    : isPast
      ? "You attended this past plan - archived chat is available."
      : viewerAccepted
        ? "You are accepted - group chat is unlocked."
        : viewerPending
          ? "Waiting for host approval before chat unlocks."
          : "You can request to join this plan.";
  return `
    <article class="plan-card ${isPast ? "past-plan-card" : ""}">
      <div class="avatar" style="background:linear-gradient(145deg, ${index % 2 ? "#79dccb,#7c72ff" : "#ffbfa3,#a79cff"})"></div>
      <div>
        <h3>${plan.name}</h3>
        <div class="plan-status-line"><span class="trust-badge">Hosted by ${plan.host}</span><span class="trust-badge plan-state">${badge}</span></div>
        <p>${plan.location} · ${plan.time}</p>
        <div class="plan-meta"><span>${plan.joined}/${Math.min(plan.max, 6)} attending</span><span>${plan.visibility}</span></div>
        <small class="context-copy">${context}</small>
      </div>
      ${action ? `<div class="plan-card-actions">${action}</div>` : ""}
    </article>
  `;
}

function renderPlanDetail() {
  const status = selectedPlanStatus;
  const plan = findSelectedPlan() || selectedPlan();
  const actionGrid = document.querySelector("#planDetailActions");
  const joinNote = document.querySelector("#planJoinNote");
  const attendees = document.querySelector("#planAttendees");
  const heroBadge = document.querySelector("#planDetailBadge");
  const hero = document.querySelector("#plan-detail .plan-hero");
  const requestsButton = document.querySelector("#planDetailRequests");
  if (plan.unavailable) {
    if (hero) {
      hero.querySelector("h1").textContent = "Plan unavailable";
      hero.querySelector("p").textContent = "This plan may have been removed, archived, or reset.";
      hero.querySelector(".host-line strong").textContent = "No active plan";
      hero.querySelector(".host-line span").textContent = "Try returning to plans and opening it again.";
    }
    if (heroBadge) heroBadge.textContent = "Unavailable";
    if (requestsButton) requestsButton.hidden = true;
    if (joinNote) joinNote.hidden = true;
    if (attendees) attendees.hidden = true;
    if (actionGrid) actionGrid.innerHTML = unavailableState("Plan no longer exists", "The plan could not be loaded from the current prototype state.");
    return;
  }
  if (hero) {
    hero.querySelector("h1").textContent = plan.name;
    hero.querySelector("p").textContent = `${plan.time} · ${plan.location}`;
    hero.querySelector(".host-line strong").textContent = `Hosted by ${plan.host}`;
    hero.querySelector(".host-line span").textContent = plan.path;
  }
  if (heroBadge) heroBadge.textContent = status === "hosting" ? "Hosting" : status === "accepted" ? "Accepted" : status === "pending" ? "Pending" : "Discoverable";
  if (requestsButton) requestsButton.hidden = status !== "hosting";
  if (joinNote) joinNote.hidden = status === "hosting" || status === "accepted" || status === "pending";
  if (attendees) attendees.hidden = false;
  if (!actionGrid) return;
  if (status === "hosting") {
    actionGrid.innerHTML = `<button data-next="edit-plan" data-plan-name="${plan.name}" data-plan-status="hosting">Edit Plan</button><button data-next="plan-requests" data-plan-name="${plan.name}">View Requests</button><button data-next="plan-chat" data-plan-name="${plan.name}" data-plan-status="hosting">Message Group</button><button data-next="chats" data-chat-mode="plan-share" data-plan-name="${plan.name}" data-plan-status="hosting">Share Plan</button>`;
  } else if (status === "accepted") {
    actionGrid.innerHTML = `<button data-next="plan-chat" data-plan-name="${plan.name}" data-plan-status="accepted">Open Group Chat</button><button data-next="chats">Message Host</button><button data-next="chats" data-chat-mode="plan-share" data-plan-name="${plan.name}" data-plan-status="accepted">Share Plan</button>`;
  } else if (status === "pending") {
    actionGrid.innerHTML = `<button disabled>Pending Approval</button><button data-cancel-plan-request>Cancel Request</button><button data-next="chats">Message Host</button>`;
  } else {
    actionGrid.innerHTML = `<button data-request-plan>Request to Join</button><button data-next="chats">Message Host</button><button data-next="chats" data-chat-mode="plan-share" data-plan-name="${plan.name}" data-plan-status="discoverable">Share Plan</button>`;
  }
}

function tripManagementActions(trip, options = {}) {
  const canEdit = options.canEdit !== false;
  return `
    <div class="trip-card-actions" aria-label="Trip actions">
      ${canEdit ? `<button type="button" data-edit-trip="${trip.id}">Edit</button>` : ""}
      <button class="delete-trip-action" type="button" data-delete-trip="${trip.id}">Delete</button>
    </div>
  `;
}

function tripCard(trip, manageable = false) {
  return `
    <article class="trip-full-card ${manageable ? "manageable-trip-card" : ""}">
      <strong>${trip.city}</strong>
      <span class="trip-country">${trip.country}</span>
      <span class="trip-dates">${displayTripRange(trip)}</span>
      <span class="trust-badge">${trip.visibility}</span>
      ${trip.status ? `<span class="trust-badge trip-status">${trip.status}</span>` : ""}
      ${manageable ? tripManagementActions(trip) : ""}
    </article>
  `;
}

function pastTripCard(trip, manageable = false) {
  return `
    <article class="past-trip-card ${manageable ? "manageable-trip-card" : ""}">
      <strong>${trip.city}</strong>
      <span>${trip.country}</span>
      <em>${displayTripRange(trip)}</em>
      <small>Past</small>
    </article>
  `;
}

function tripsSections(trips, options = {}) {
  const manageable = Boolean(options.manageable);
  const upcoming = trips
    .filter((trip) => !isPastTrip(trip))
    .sort((a, b) => new Date(a.start) - new Date(b.start));
  const past = trips
    .filter(isPastTrip)
    .sort((a, b) => new Date(b.start) - new Date(a.start));
  return `
    <section class="content-section"><h2>Upcoming Trips</h2><div class="people-stack upcoming-trip-list">${upcoming.length ? upcoming.map((trip) => tripCard(trip, manageable)).join("") : emptyState("No upcoming trips", "Add a trip to unlock city overlaps and trusted introductions.", manageable ? `<button type="button" class="soft-action" data-next="trip">Add trip</button>` : "")}</div></section>
    <section class="content-section"><h2>Past Trips</h2><div class="past-trips-carousel">${past.length ? past.map((trip) => pastTripCard(trip, manageable)).join("") : emptyState("No past trips yet", "Completed trips will move here as your travel history grows.")}</div></section>
  `;
}

function requestCard(request, index = 0, group = requestFilter) {
  const status = (request.status || "").toLowerCase();
  const trustState = connectionStateForPerson({ name: request.name, path: request.path, badge: request.type, cta: "Request Intro" });
  const pathLocked = Boolean(trustState?.locked);
  const reconnectTarget = viaName(archivedPath(pathParts(request.path).length ? [request.path] : [], request.name)) || request.name;
  const isNew = request.actions || status.includes("new") || status.includes("waiting for you");
  const isAccepted = status.includes("accepted") || status.includes("chat open") || status.includes("added");
  const isDeclined = status.includes("declined");
  const isWaiting = !isNew && !isAccepted && !isDeclined && (status.includes("waiting") || status.includes("sent") || status.includes("pending"));
  const profileAttr = `data-profile-name="${request.name}"`;
  const actions = pathLocked
    ? `<div class="request-actions"><button type="button" data-request-reconnect="${reconnectTarget}">Request Reconnection</button><button data-next="profile" ${profileAttr}>View Profile</button></div>`
    : isNew
    ? `<div class="request-actions"><button type="button" data-request-response="accept" data-request-group="${group}" data-request-index="${index}">Accept</button><button type="button" data-request-response="decline" data-request-group="${group}" data-request-index="${index}">Decline</button><button data-next="profile" ${profileAttr}>View Profile</button></div>`
    : isAccepted
      ? `<div class="request-actions"><button type="button" data-message-person="${request.name}">Message</button><button data-next="profile" ${profileAttr}>View Profile</button></div>`
      : isDeclined
        ? `<div class="request-actions"><button data-next="profile" ${profileAttr}>View Profile</button></div>`
        : isWaiting
          ? `<div class="request-actions status-only"><span>Status only · ${request.status}</span></div>`
          : `<div class="request-actions"><button data-next="profile" ${profileAttr}>View Profile</button></div>`;
  const requestContext = pathLocked
    ? "This request depends on an archived trust path. Reconnect before continuing."
    : request.type.includes("Intro")
    ? "Visible through a mutual path - decide whether to continue the introduction."
    : request.type.includes("Trusted Friend")
      ? "Met in person - can become trusted only after mutual acceptance."
      : request.type.includes("meetup")
        ? "Pending real-world confirmation before trust changes."
        : "Track where this connection currently stands.";
  return `
    <article class="request-card">
      <div class="avatar" style="background:linear-gradient(145deg, ${index % 2 ? "#79dccb,#7c72ff" : "#ffbfa3,#a79cff"})"></div>
      <div>
        <h3>${request.name}</h3>
        <p>${request.path}</p>
        <span class="trust-badge">${pathLocked ? "Archived Path · Locked" : `${request.type} · ${request.status}`}</span>
        <small class="context-copy">${requestContext}</small>
      </div>
      ${actions}
    </article>
  `;
}

function renderConnectionRequests() {
  const list = document.querySelector("#connectionRequestList");
  if (!list) return;
  const requests = connectionRequests[requestFilter] || [];
  const labels = {
    intro: ["No intro requests", "Warm intro requests from your trusted network will appear here."],
    met: ["No met upgrades", "People you have met can request trusted upgrades here."],
    sent: ["No sent requests", "Intro and trusted requests you send will be tracked here."],
    meetups: ["No pending meetups", "Meetups needing verification will appear here."]
  };
  const [title, body] = labels[requestFilter] || ["No requests", "Requests will appear here when there is something to review."];
  list.innerHTML = requests.length ? requests.map((request, index) => requestCard(request, index, requestFilter)).join("") : emptyState(title, body);
}

function renderPlanRequests() {
  const list = document.querySelector("#planRequestsList");
  if (!list) return;
  syncPlanRequestCounts();
  list.innerHTML = planJoinRequests.map((request, index) => {
    const trustState = connectionStateForPerson({ name: request.name, path: request.path, badge: request.vouch });
    const locked = Boolean(trustState?.locked);
    const reconnectTarget = viaName(archivedPath(pathParts(request.path).length ? [request.path] : [], request.name)) || request.name;
    return `
      <article class="request-card plan-request ${locked ? "locked-relation" : ""}">
        <div class="avatar" style="background:linear-gradient(145deg, ${index % 2 ? "#79dccb,#7c72ff" : "#ffbfa3,#a79cff"})"></div>
        <div>
          <h3>${request.name}</h3>
          <p>${locked ? trustState.path : request.path}</p>
          <span class="trust-badge">${locked ? "Archived Path · Locked" : request.vouch}</span>
          <p>${locked ? "This join request no longer has an active trust path." : request.message}</p>
        </div>
        <div class="request-actions">${locked ? `<button type="button" data-request-reconnect="${reconnectTarget}">Request Reconnection</button><button data-next="profile" data-profile-name="${request.name}">View Profile</button>` : `<button type="button" data-plan-request-response="accept" data-plan-request-index="${index}">Accept</button><button type="button" data-plan-request-response="reject" data-plan-request-index="${index}">Reject</button><button data-next="profile" data-profile-name="${request.name}">View Profile</button>`}</div>
      </article>
    `;
  }).join("") || emptyState("No plan requests", "Join requests will appear here before people enter the plan chat.");
}

function networkPersonMatches(person, group, query) {
  const haystack = `${person.name} ${person.city || ""} ${person.path || ""} ${person.badge || ""}`.toLowerCase();
  const activeTrip = getSelectedHomeTrip();
  if (query && !haystack.includes(query)) return false;
  if (networkFilter === "trusted") return group === "trusted";
  if (networkFilter === "mutuals") return group === "second";
  if (networkFilter === "nearby") return personLivesInTripCity(person, activeTrip) || personVisitsTripCity(person, activeTrip);
  if (networkFilter === "met") return group === "met";
  if (networkFilter === "travelling") return Boolean(person.trips?.length);
  return true;
}

function profileNetworkPerson(name, fallback = {}) {
  const profile = profileForName(name);
  if (!profile) return null;
  const state = connectionStateForProfile(profile);
  return {
    name: profile.name,
    city: profile.city,
    livesIn: profile.city,
    path: state.path,
    badge: state.relationship,
    cta: state.action,
    degree: state.relationship === "Trusted Friend" ? 1 : fallback.degree,
    trips: profile.trips || fallback.trips || [],
    recent: fallback.recent
  };
}

function uniquePeopleByName(people = []) {
  const seen = new Set();
  return people.filter((person) => {
    if (!person?.name) return false;
    const key = nameKey(person.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dynamicTrustedPeople() {
  const staticNames = new Set(networkPeople.map((person) => nameKey(person.name)));
  return directTrustedNames()
    .filter((name) => !staticNames.has(nameKey(name)))
    .map((name) => profileNetworkPerson(name))
    .filter(Boolean);
}

function dynamicMetPeople() {
  const staticNames = new Set(metPeople.map((person) => nameKey(person.name)));
  const names = [
    ...graphList("metConnections"),
    ...(Array.isArray(appState.confirmedMeetups) ? appState.confirmedMeetups.map((meetup) => meetup.person) : [])
  ];
  return uniquePeopleByName(names.map((name) => profileNetworkPerson(name)).filter(Boolean))
    .filter((person) => !staticNames.has(nameKey(person.name)) && !isTrustedConnection(person.name));
}

function renderNetworkLists() {
  const query = document.querySelector("#networkSearch")?.value.trim().toLowerCase() || "";
  let totalVisible = 0;
  const staticTrustedPeople = networkPeople.filter((person) => isTrustedConnection(person.name));
  const staticMutualPeople = networkPeople.filter((person) => !isTrustedConnection(person.name) && !isMetConnection(person.name));
  const groups = [
    { key: "trusted", selector: ".network-cards", people: uniquePeopleByName([...staticTrustedPeople, ...dynamicTrustedPeople()]) },
    { key: "met", selector: ".met-cards", people: uniquePeopleByName([...metPeople, ...dynamicMetPeople()]).filter((person) => !isTrustedConnection(person.name)) },
    { key: "second", selector: ".trusted-cards", people: uniquePeopleByName([...staticMutualPeople, ...secondDegreePeople]).filter((person) => !isTrustedConnection(person.name) && !isMetConnection(person.name)) },
    { key: "third", selector: ".third-degree-cards", people: thirdDegreePeople.filter((person) => !isTrustedConnection(person.name) && !isMetConnection(person.name)) }
  ];
  groups.forEach((group) => {
    const target = document.querySelector(group.selector);
    if (!target) return;
    const section = target.closest(".content-section");
    const people = group.people.filter((person) => networkPersonMatches(person, group.key, query));
    totalVisible += people.length;
    if (section) section.hidden = !people.length;
    target.innerHTML = people.map(personCard).join("");
  });
  if (!totalVisible) {
    const fallback = document.querySelector(".network-cards");
    const section = fallback?.closest(".content-section");
    if (section) {
      section.hidden = false;
      section.querySelector("h2").textContent = "Network results";
    }
    if (fallback) fallback.innerHTML = emptyState("No network results", "Try another search, switch filters, or add trusted people to expand your graph.", `<button type="button" class="soft-action" data-add-friends>Add trusted</button>`);
  }
}

function getSearchResults() {
  const query = document.querySelector("#homeSearch")?.value.trim().toLowerCase() || "";
  const selectedContext = getHomeSelectorContext();
  let results = query
    ? homePeople.filter((person) => `${person.name} ${person.city} ${person.country}`.toLowerCase().includes(query))
    : [...homePeople];

  if (homeFilter !== "all") {
    results = results.filter((person) => personMatchesSelectedTrip(person, selectedContext));
  } else {
    results = results.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }
  return { query, results };
}

function renderHomeTripSelect() {
  const select = document.querySelector("#homeTripSelect");
  if (!select) return;
  const tripOptions = visibleHomeTrips();
  const cityOptions = homeCityOptions();
  if (homeFilter === "same") {
    select.setAttribute("aria-label", "Choose trip dates");
    select.innerHTML = tripOptions.map((trip) => `<option value="${trip.id}">${homeTripOptionLabel(trip)}</option>`).join("");
    if (!tripOptions.some((trip) => trip.id === activeHomeTripId)) {
      activeHomeTripId = tripOptions[0]?.id || activeHomeTripId;
    }
    activeHomeSelectorValue = activeHomeTripId;
  } else if (homeFilter === "in-town" || homeFilter === "locals") {
    select.setAttribute("aria-label", "Choose city");
    select.innerHTML = cityOptions.map((city) => `<option value="city:${city}">${city}</option>`).join("");
    activeHomeSelectorValue = `city:${activeHomeCity}`;
  } else {
    select.innerHTML = "";
    return;
  }
  if (![...select.options].some((option) => option.value === activeHomeSelectorValue)) {
    activeHomeSelectorValue = select.options[0]?.value || activeHomeSelectorValue;
  }
  select.value = activeHomeSelectorValue;
}

function renderHomeFilterTabs() {
  const selectedTrip = getSelectedHomeTrip();
  const sameDatesTab = document.querySelector('[data-home-filter="same"]');
  if (!sameDatesTab) return;
  const hasActiveTrip = Boolean(selectedTrip?.city && selectedTrip?.start);
  sameDatesTab.hidden = !hasActiveTrip;
  if (!hasActiveTrip && homeFilter === "same") {
    homeFilter = "all";
    document.querySelectorAll("[data-home-filter]").forEach((button) => {
      button.classList.toggle("active", button.dataset.homeFilter === "all");
    });
  }
}

function renderHomePeople() {
  const nearby = document.querySelector("#nearbyPeople");
  if (!nearby) return;
  document.querySelector("#homeResultSummary")?.remove();
  renderHomeFilterTabs();
  const { query, results } = getSearchResults();
  const title = document.querySelector("#homePeopleTitle");
  const datePill = document.querySelector("#homePeopleDates");
  if (title) title.textContent = query ? `People in ${query.replace(/\b\w/g, (char) => char.toUpperCase())}` : "Trusted People Nearby";
  if (datePill) {
    datePill.hidden = homeFilter === "all";
    if (homeFilter !== "all") renderHomeTripSelect();
  }
  nearby.innerHTML = results.length
    ? results.slice(0, 3).map(personCard).join("")
    : emptyState("No network results", "Try another city, remove the search text, or add a trusted connection.");
}

function renderHomeSuggestions() {
  const suggested = document.querySelector("#suggestedPeople");
  if (!suggested) return;
  const people = suggestedConnections();
  suggested.innerHTML = people.length
    ? people.slice(0, 3).map(personCard).join("")
    : emptyState("No suggested introductions yet", "Add a trip or trusted connection to improve matching.", `<button type="button" class="soft-action" data-next="trip">Add trip</button>`);
}

function renderNetworkMovement() {
  const row = document.querySelector("#networkMovement");
  if (!row) return;
  row.innerHTML = networkMovements.map((item) => `
    <button class="network-movement-card" type="button">
      <span>${item.tag}</span>
      <strong>${item.title}</strong>
      <small>${item.detail}</small>
    </button>
  `).join("");
}

function renderSuggestedConnectionsPage() {
  const list = document.querySelector("#suggestedPeopleAll");
  if (!list) return;
  const people = suggestedConnections();
  list.innerHTML = people.length
    ? people.map(personCard).join("")
    : emptyState("No suggested introductions yet", "Your strongest matches will appear here once there is enough trip or network context.", `<button type="button" class="soft-action" data-next="trip">Add trip</button>`);
}

function renderNearbyPeoplePage() {
  const list = document.querySelector("#nearbyPeopleAll");
  if (!list) return;
  const { query, results } = getSearchResults();
  const title = document.querySelector("#nearbyPeoplePageTitle");
  const copy = document.querySelector("#nearbyPeoplePageCopy");
  const selectedTrip = getSelectedHomeTrip();
  const filterLabel = document.querySelector(`[data-home-filter="${homeFilter}"]`)?.textContent || "All";
  if (title) title.textContent = query ? `People in ${query.replace(/\b\w/g, (char) => char.toUpperCase())}` : "Trusted People Nearby";
  if (copy) {
    const context = getHomeSelectorContext();
    const contextLabel = context.type === "trip" ? tripRangeLabel(context.trip) : context.city;
    copy.textContent = `${results.length} ${filterLabel.toLowerCase()} match${results.length === 1 ? "" : "es"} for ${contextLabel}.`;
  }
  list.innerHTML = results.length
    ? results.map(personCard).join("")
    : emptyState("No network results", "Try another city, remove the search text, or switch filters.");
}

function renderAllTrips() {
  const list = document.querySelector("#allTripsList");
  const copy = document.querySelector("#allTripsCopy");
  if (!list) return;
  const upcomingCount = myTrips.filter((trip) => !isPastTrip(trip)).length;
  if (copy) copy.textContent = `${upcomingCount} upcoming trip${upcomingCount === 1 ? "" : "s"}`;
  list.innerHTML = tripsSections(myTrips, { manageable: true });
}

function renderPersonTrips() {
  const list = document.querySelector("#personTripsList");
  if (!list) return;
  const profile = selectedProfile();
  document.querySelector("#person-trips h1").textContent = `${profile.name}'s Trips`;
  list.innerHTML = tripsSections(profile.trips);
}

function renderChats() {
  const list = document.querySelector(".chat-list");
  if (!list) return;
  const headerCopy = document.querySelector("#chatContextCopy");
  const headerTitle = document.querySelector("#chats .compact-header h1");
  const tabs = document.querySelector("#chats .chat-tabs");
  const source = chatMode === "share"
    ? shareContacts
    : chatFilter === "archived"
      ? allUniqueChats().filter((chat) => chat.archived || pathDependsOnRemoved(chat.path, chat.name))
      : (chats[chatFilter] || [])
        .filter((chat) => !chat.archived && !pathDependsOnRemoved(chat.path, chat.name))
        .filter((chat) => !chat.introRequest || appState.pendingIntroRequestActive);
  if (headerTitle) headerTitle.textContent = chatMode === "plan-share" ? "Share Plan" : "Chats";
  if (tabs) tabs.hidden = chatMode === "plan-share";
  if (headerCopy) {
    if (chatMode === "plan-share") {
      headerCopy.textContent = "Send this trusted plan to someone in your circle.";
    } else if (chatMode === "share") {
      headerCopy.textContent = "Choose a trusted contact to share Emma's profile with.";
    } else if (chatFilter === "archived") {
      headerCopy.textContent = "Archived conversations with relationship history preserved.";
    } else if (chatFilter === "plans") {
      headerCopy.textContent = "Trusted Plan group chats only.";
    } else {
      headerCopy.textContent = "Trusted conversations only.";
    }
  }
  list.innerHTML = chatMode === "plan-share"
    ? planShareComposer()
    : source.length
      ? source.map((chat, index) => chatCard(chat, index, chatMode)).join("")
      : emptyState(chatFilter === "archived" ? "No archived chats" : chatFilter === "plans" ? "No plan chats" : "No chats yet", chatFilter === "archived" ? "Conversations you archive will remain available here for history." : chatFilter === "plans" ? "Plan chats will appear when you host or join a plan." : "Trusted conversations, intro chats and direct messages will appear here.");
}

function renderChatDetail() {
  const screen = document.querySelector("#chat-detail .chat-detail");
  if (!screen) return;
  const chatName = selectedChatName || "Emma Laurent";
  const chatPath = selectedChatPath || "You → Laura → Emma";
  const chatPreview = selectedChatPreview || "Friday works. Laura vouched for you.";
  const chatProfileName = personProfiles[chatName] ? chatName : "Emma Laurent";

  if (activeChatDetailMode === "archived_chat") {
    screen.innerHTML = `
      <header class="chat-top direct-chat-top"><div class="avatar-img"></div><div><strong>${chatName}</strong><span>Archived conversation · history preserved</span></div></header>
      <div class="messages">
        <p class="bubble theirs">${chatPreview}</p>
        <p class="bubble mine">Archived path only. Past chats, plans and meetup history remain available.</p>
      </div>
      <div class="archived-status-bar">Archived chat · replies closed</div>
    `;
    return;
  }

  if (activeChatDetailMode === "intro-request" || activeChatDetailMode === "intro_request") {
    screen.innerHTML = `
      <header class="chat-top direct-chat-top">
        <div class="avatar-img"></div>
        <div><strong>Intro Request</strong><span>Hugo → Emma via Laura</span></div>
      </header>
      <div class="direct-chat-actions compact-chat-actions intro-request-compact-actions">
        <button data-next="profile" data-profile-name="Emma Laurent">Profile</button>
      </div>
      <div class="messages">
        <p class="bubble theirs">Hey Laura - would love an intro to Emma if it feels right. Looks like we both have similar interests and may be in Barcelona at the same time.</p>
        <div class="intro-request-actions chat-detail-intro-actions">
          <button class="primary-mini" type="button" data-introduce>Introduce</button>
          <button class="secondary-mini" type="button" data-intro-reply>Reply</button>
          <button class="text-mini" type="button" data-intro-soft-decline>Not right now</button>
        </div>
      </div>
      <div class="composer"><input placeholder="Happy to intro - what are you hoping to connect on?" /><button type="button" class="photo-upload-button" aria-label="Add photo"></button><button aria-label="Send message">➤</button></div>
    `;
    return;
  }

  if (activeChatDetailMode === "intro-reply") {
    screen.innerHTML = `
      <header class="chat-top direct-chat-top"><div class="avatar-img"></div><div><strong>Hugo</strong><span>Intro request clarification</span></div></header>
      <div class="direct-chat-actions compact-chat-actions intro-request-compact-actions">
        <button data-next="profile" data-profile-name="Emma Laurent">Profile</button>
      </div>
      <div class="messages">
        <p class="bubble theirs">Hey Laura - would love an intro to Emma if it feels right.</p>
        <p class="bubble mine">Happy to intro - what are you hoping to connect on?</p>
      </div>
      <div class="composer"><input placeholder="Message Hugo" /><button type="button" class="photo-upload-button" aria-label="Add photo"></button><button aria-label="Send message">➤</button></div>
    `;
    return;
  }

  if (activeChatDetailMode === "intro-group") {
    const isIntroducerView = !introThreadLeft;
    const footerActions = isIntroducerView
      ? `<div class="intro-chat-footer-actions"><button type="button">Mute Chat</button><button type="button" data-leave-intro-chat>Leave Chat</button></div>`
      : "";
    screen.innerHTML = `
      <header class="chat-top intro-chat-top">
        <div class="avatar-img"></div>
        <div><strong>Hugo & Emma</strong><span>Introduced by Laura</span></div>
      </header>
      <div class="direct-chat-actions compact-chat-actions">
        <button data-next="profile" data-profile-name="Emma Laurent">Profile</button>
        <button data-next="person-trips" data-profile-name="Emma Laurent">Trips</button>
        <button data-next="person-plans" data-profile-name="Emma Laurent">Plans</button>
      </div>
      <div class="messages">
        <p class="bubble theirs">Thought you two should meet - you're both in Barcelona next week and seem like a great fit. You both love galleries, coffee spots and slow travel.</p>
        <p class="bubble mine">Thank you Laura. Emma, lovely to meet you here.</p>
        <p class="bubble theirs">Likewise. I have a gallery afternoon saved for Saturday if you are around.</p>
      </div>
      ${isIntroducerView ? "" : `<button class="meetup-button" data-next="verify">Confirm Meetup</button>`}
      ${footerActions}
      <div class="composer"><input placeholder="Write a message" /><button type="button" class="photo-upload-button" aria-label="Add photo"></button><button aria-label="Send message">➤</button></div>
    `;
    return;
  }

  if (activeChatDetailMode === "direct-connection" || activeChatDetailMode === "direct_connection_chat") {
    screen.innerHTML = `
      <header class="chat-top direct-chat-top"><div class="avatar-img"></div><div><strong>${chatName}</strong><span>${chatPath} · Not yet Met</span></div></header>
      <div class="direct-chat-actions compact-chat-actions">
        <button data-next="profile" data-profile-name="${chatProfileName}">Profile</button>
        <button data-next="person-trips" data-profile-name="${chatProfileName}">Trips</button>
        <button data-next="person-plans" data-profile-name="${chatProfileName}">Plans</button>
      </div>
      <div class="messages">
        <p class="bubble theirs">${chatPreview}</p>
        <p class="bubble mine">Perfect. I am in Barcelona from Thursday and would love that.</p>
      </div>
      <button class="meetup-button" data-next="verify">Confirm Meetup</button>
      <div class="composer"><input placeholder="Message ${chatName.split(" ")[0]}" /><button type="button" class="photo-upload-button" aria-label="Add photo"></button><button aria-label="Send message">➤</button></div>
    `;
    return;
  }

  screen.innerHTML = `
    <header class="chat-top direct-chat-top"><div class="avatar-img"></div><div><strong>${chatName}</strong><span>Trusted Friend · 1st Degree</span></div></header>
    <div class="direct-chat-actions compact-chat-actions">
      <button data-next="profile" data-profile-name="${chatProfileName}">Profile</button>
      <button data-next="person-trips" data-profile-name="${chatProfileName}">Trips</button>
      <button data-next="person-plans" data-profile-name="${chatProfileName}">Plans</button>
    </div>
    <div class="messages"><p class="bubble theirs">${chatPreview}</p><p class="bubble mine">Thank you. I will send a warm note.</p></div>
    <div class="composer"><input placeholder="Message ${chatName.split(" ")[0]}" /><button type="button" class="photo-upload-button" aria-label="Add photo"></button><button aria-label="Send message">➤</button></div>
  `;
}

function confirmIntroduce() {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card intro-compose-card" role="dialog" aria-modal="true" aria-label="Introduce Hugo and Emma">
      <h2>Introduce Hugo and Emma?</h2>
      <p>You can edit the note before opening the shared intro chat.</p>
      <textarea id="introComposeMessage" placeholder="Thought you two should meet - you're both in Barcelona next week and seem like a great fit. You both love galleries, coffee spots and slow travel."></textarea>
      <div><button type="button" data-dialog-close>Cancel</button><button type="button" data-send-intro-message>Send Intro</button></div>
    </div>
  `;
  document.body.appendChild(dialog);
}

function confirmIntroSoftDecline() {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card intro-compose-card" role="dialog" aria-modal="true" aria-label="Not right now">
      <h2>Not right now?</h2>
      <p>Keep it soft. You can send a note or close this without replying.</p>
      <textarea placeholder="Not right now, but happy to reconnect another time."></textarea>
      <div><button type="button" data-dialog-close>Cancel</button><button type="button" data-send-intro-decline-note>Send Note</button></div>
    </div>
  `;
  document.body.appendChild(dialog);
}

function confirmArchiveChat(chatName = "this chat") {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Archive chat">
      <h2>Archive chat?</h2>
      <p>This will remove the conversation from your inbox, but the history will remain available where relevant.</p>
      <div><button type="button" data-dialog-close>Cancel</button><button type="button" data-confirm-archive-chat>Archive Chat</button></div>
    </div>
  `;
  document.body.appendChild(dialog);
}

function confirmDeleteArchivedChat(chatName = "this archived chat", key = "") {
  pendingDeleteChatName = chatName;
  pendingDeleteChatKey = key;
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Delete archived chat">
      <h2>Delete archived chat?</h2>
      <p>This permanently removes ${chatName} from this prototype. It cannot be restored or undone.</p>
      <div><button type="button" data-dialog-close>Cancel</button><button type="button" data-confirm-delete-archived-chat>Delete Chat</button></div>
    </div>
  `;
  document.body.appendChild(dialog);
}

function showPhotoSourceSheet() {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Add photo">
      <h2>Add photo</h2>
      <p>Share a photo into this conversation.</p>
      <div><button type="button" data-dialog-close>Take Photo</button><button type="button" data-dialog-close>Choose From Library</button></div>
    </div>
  `;
  document.body.appendChild(dialog);
}

function confirmLeaveIntroChat() {
  document.querySelector(".discard-dialog")?.remove();
  const dialog = document.createElement("div");
  dialog.className = "discard-dialog";
  dialog.innerHTML = `
    <div class="discard-card" role="dialog" aria-modal="true" aria-label="Leave intro chat">
      <h2>Leave intro chat?</h2>
      <p>You introduced Hugo and Emma. Leaving now will remove you from this conversation, but they can continue chatting directly.</p>
      <p>You can still view this introduction later in your archive.</p>
      <div><button type="button" data-dialog-close>Stay</button><button type="button" data-confirm-leave-intro>Leave Chat</button></div>
    </div>
  `;
  document.body.appendChild(dialog);
}

function renderVerification(method = "qr") {
  stopVerificationCountdown();
  verificationMethod = method;
  const panel = document.querySelector("#verificationPanel");
  if (!panel) return;
  const cta = document.querySelector("[data-complete-verification]");
  if (cta) cta.disabled = false;
  const views = {
    qr: `
      <div class="verify-card qr-confirm">
        <div class="real-qr asset-qr"><img src="./assets/personal-key-qr.png" alt="Meetup confirmation QR code" /></div>
        <strong>Scan Emma's meetup QR</strong>
        <span>QR confirms you met in person. Emma becomes a Trusted Friend only after both people accept and a slot is available.</span>
      </div>
    `,
    location: `
      <div class="verify-card location-confirm">
        <div class="location-pulse"><i></i><i></i></div>
        <strong>Phone location check</strong>
        <span>You and Emma need to be in the same place. Same-location verification supports a Trusted Friend upgrade, not automatic network access.</span>
        <small>You: 12m nearby · Emma: waiting to confirm</small>
      </div>
    `,
    mutual: `
      <div class="verify-card mutual-confirm">
        <strong>Timed mutual confirmation</strong>
        <span>Both people must tap yes on their own phone within 10 minutes before the Trusted Friend request can complete.</span>
        <div class="confirm-row"><span>You</span><strong>Ready to confirm</strong></div>
        <div class="confirm-row"><span>Emma</span><strong>Waiting</strong></div>
        <div class="confirm-row"><span>Window</span><strong id="mutualCountdown">10:00</strong></div>
      </div>
    `
  };
  panel.innerHTML = views[method];
  if (cta) {
    const labels = {
      qr: "Complete QR Scan",
      location: "Confirm Same Location",
      mutual: "Confirm on This Phone"
    };
    cta.textContent = labels[method];
  }
  if (method === "mutual") startVerificationCountdown();
}

function completeVerification() {
  stopVerificationCountdown();
  const panel = document.querySelector("#verificationPanel");
  const cta = document.querySelector("[data-complete-verification]");
  if (!panel || !cta) return;

  cta.disabled = true;
  cta.textContent = "Confirming...";

  const copy = {
    qr: ["QR matched", "Both phones confirmed an in-person meetup. Emma becomes Met first, not automatically Trusted Friend."],
    location: ["Same place confirmed", "Both phones were verified in the same location. Emma becomes Met first, not automatically Trusted Friend."],
    mutual: ["Both people confirmed", "You and Emma tapped yes within the meetup window. Emma becomes Met first, not automatically Trusted Friend."]
  };

  panel.innerHTML = `
    <div class="verify-card confirmation-complete">
      <div class="confirmed-mark"></div>
      <strong>${copy[verificationMethod][0]}</strong>
      <span>${copy[verificationMethod][1]}</span>
    </div>
  `;

  window.setTimeout(() => {
    instagramAccessUnlocked = true;
    trustedFriendState.verifiedMeetups += 1;
    appState.confirmedMeetups = Array.isArray(appState.confirmedMeetups) ? appState.confirmedMeetups : [];
    const metPerson = selectedChatName && selectedChatName !== "Intro Request" ? selectedChatName : "Emma Laurent";
    addGraphFlag("metConnections", metPerson);
    appState.confirmedMeetups.unshift({
      person: metPerson,
      method: verificationMethod,
      confirmedAt: new Date().toISOString()
    });
    addNotificationEvent("directChat");
    persistPrototypeState();
    cta.disabled = false;
    showScreen("unlocked", { replace: true });
    cta.textContent = "Complete Verification";
    renderVerification("qr");
    refreshTrustGraphViews();
  }, 850);
}

function personCityNames(person = {}) {
  const cities = new Set();
  const add = (value) => {
    if (typeof value === "string" && value.trim()) cities.add(value.trim());
  };
  add(person.city);
  add(person.livesIn);
  (person.trips || []).forEach((trip) => add(trip.city));
  const profile = profileForName(person.name);
  if (profile) {
    add(profile.city);
    add(profile.homeCity);
    (profile.trips || []).forEach((trip) => add(trip.city));
  }
  return [...cities];
}

function cityMatchesPerson(city = "", person = {}) {
  const target = city.toLowerCase();
  return personCityNames(person).some((name) => name.toLowerCase() === target);
}

function graphPersonFromProfile(profile) {
  const firstPath = profile.paths?.[0] || profile.path || "";
  return {
    name: profile.name,
    city: profile.city,
    path: firstPath,
    badge: profile.relationship || profile.directRelationship || "Mutual Connection",
    cta: profile.directRelationship === "Trusted Friend" ? "Message" : "Request Intro",
    trips: profile.trips
  };
}

function cityGraphPeople(city = "Oslo") {
  const raw = [
    ...homePeople,
    ...networkPeople,
    ...metPeople,
    ...secondDegreePeople,
    ...thirdDegreePeople,
    ...Object.values(personProfiles).map(graphPersonFromProfile)
  ];
  const seen = new Set();
  return raw
    .filter((person) => person?.name && !seen.has(nameKey(person.name)) && cityMatchesPerson(city, person) && seen.add(nameKey(person.name)))
    .map((person) => ({ person, state: connectionStateForPerson(person) || {} }))
    .sort((a, b) => {
      const aActive = !a.state.locked && !a.state.archived;
      const bActive = !b.state.locked && !b.state.archived;
      if (aActive !== bActive) return aActive ? -1 : 1;
      if (isTrustedConnection(a.person.name) !== isTrustedConnection(b.person.name)) return isTrustedConnection(a.person.name) ? -1 : 1;
      if (isMetConnection(a.person.name) !== isMetConnection(b.person.name)) return isMetConnection(a.person.name) ? -1 : 1;
      return a.person.name.localeCompare(b.person.name);
    });
}

function visibleCityGraphPeople(city = "Oslo") {
  return cityGraphPeople(city).filter(({ state }) => !state.locked && !state.archived);
}

function branchPeopleFor(name = "", city = "") {
  const rootKey = nameKey(name);
  return cityGraphPeople(city)
    .filter(({ person }) => nameKey(person.name) !== rootKey)
    .filter(({ person }) => pathParts(person.path || profileForName(person.name)?.path || "").some((part) => nameKey(part) === rootKey))
    .slice(0, 3);
}

function updateCityHubCounts() {
  document.querySelectorAll(".city-node").forEach((node) => {
    const city = node.dataset.city;
    const active = visibleCityGraphPeople(city).length;
    const span = node.querySelector("span");
    if (span) span.textContent = `${active} active`;
  });
}

function renderCityHub(city = "Oslo") {
  updateCityHubCounts();
  const card = document.querySelector(".cluster-card");
  if (!card) return;
  const people = cityGraphPeople(city);
  const active = people.filter(({ state }) => !state.locked && !state.archived);
  const locked = people.filter(({ state }) => state.locked || state.archived);
  const slots = card.querySelectorAll("[data-cluster-person]");
  const displayPeople = [...active, ...locked].slice(0, slots.length);
  slots.forEach((slot, index) => {
    const item = displayPeople[index];
    if (!item) {
      slot.hidden = true;
      return;
    }
    const firstName = item.person.name.split(" ")[0];
    const lockedState = Boolean(item.state.locked || item.state.archived);
    slot.hidden = false;
    slot.textContent = firstName;
    slot.dataset.clusterPerson = item.person.name;
    slot.dataset.networkState = item.state.archived ? "archived" : lockedState ? "locked" : "unlocked";
    slot.classList.toggle("locked", lockedState);
    slot.setAttribute("aria-label", `${lockedState ? "Preview" : "Open"} ${firstName}'s ${city} branch`);
  });
  const title = card.querySelector("p strong");
  const copy = card.querySelector("p span");
  if (title) title.textContent = `${city} trusted hub`;
  if (copy) copy.textContent = `${active.length} active ${active.length === 1 ? "path" : "paths"} · ${locked.length} locked or archived ${locked.length === 1 ? "branch" : "branches"}.`;
}

function renderCityMutuals(city) {
  const title = document.querySelector("#cityMutualTitle");
  const copy = document.querySelector("#cityMutualCopy");
  const list = document.querySelector("#cityMutualPeople");
  const graphPeople = cityGraphPeople(city);
  const activePeople = graphPeople.filter(({ state }) => !state.locked && !state.archived);
  const lockedCount = graphPeople.length - activePeople.length;
  if (title) title.textContent = city;
  if (copy) copy.textContent = `${activePeople.length} active ${activePeople.length === 1 ? "path" : "paths"} in this city${lockedCount ? ` · ${lockedCount} locked or archived` : ""}.`;
  if (list) {
    list.innerHTML = activePeople.length
      ? activePeople.map(({ person }) => personCard(person)).join("")
      : emptyState("No active paths in this city", "Reconnect a trusted route, confirm a meetup, or add a trip to open this hub.");
  }
  updateCityHubCounts();
}

function renderClusterNetwork(name, state) {
  const card = document.querySelector(".cluster-card");
  const panel = document.querySelector("#personNetworkPanel");
  if (!card || !panel) return;
  const activeCity = document.querySelector(".city-node.active")?.dataset.city || "Oslo";
  const network = clusterNetworks[name] || { state, path: "Trusted path pending", people: [] };
  const profileName = profileForName(name)?.name || name;
  const isArchived = isRemovedName(profileName);
  const personState = profileForName(name) ? connectionStateForProfile(profileForName(name)) : null;
  const isMetOnly = isMetConnection(profileName) && !isTrustedConnection(profileName);
  const isLocked = isArchived || personState?.locked || isMetOnly || (network.state || state) === "locked";
  const branch = branchPeopleFor(profileName, activeCity);
  const branchNames = branch.length ? branch.map(({ person, state: branchState }) => ({ name: person.name.split(" ")[0], locked: Boolean(branchState.locked || branchState.archived) })) : network.people.map((person) => ({ name: person, locked: isLocked }));
  const title = isArchived ? "Archived path" : isMetOnly ? "Met connection" : isLocked ? "Locked network" : `${profileName.split(" ")[0]}'s branch`;
  const description = isArchived
    ? `Previously connected via ${profileName}. Reconnection can reopen this branch.`
    : isMetOnly
      ? `${profileName.split(" ")[0]} is Met. Their wider network stays locked until you both become Trusted Friends.`
      : isLocked
        ? `${profileName.split(" ")[0]}'s wider circle needs an active trust path before it opens.`
        : `${personState?.relationship || network.path} · ${branchNames.length || 1} visible ${branchNames.length === 1 ? "route" : "routes"} in ${activeCity}.`;
  card.classList.add("has-network");
  card.querySelectorAll("[data-cluster-person]").forEach((person) => {
    person.classList.toggle("focused", person.dataset.clusterPerson === name);
  });
  panel.innerHTML = `
    <div class="person-network-card ${isLocked ? "locked-preview" : "unlocked-preview"}">
      <div>
        <strong>${title}</strong>
        <span>${description}</span>
      </div>
      <div class="micro-network" aria-label="${name}'s network preview">
        ${branchNames.slice(0, 3).map((person) => `<span class="micro-node ${person.locked ? "locked-micro-node" : ""}">${isLocked || person.locked ? "" : person.name}</span>`).join("") || `<span class="micro-node"></span><span class="micro-node"></span>`}
      </div>
      <button class="network-action" ${isArchived ? `type="button" data-request-reconnect="${profileName}"` : isLocked ? `type="button" data-profile-name="${profileName}" data-next="request-intro"` : `type="button" data-profile-name="${profileName}" data-next="profile"`}>${isArchived ? "Request Reconnection" : isLocked ? "Request Intro" : "Open Profile"}</button>
    </div>
  `;
}

function renderIntroMethod(method = "mutual") {
  introMethod = method;
  document.querySelector("#introPreview")?.remove();
  const profile = selectedProfile();
  const parts = pathParts(profile.path || "");
  const mutualName = parts.length >= 3 ? parts[1] : "Laura";
  const firstName = profile.name.split(" ")[0];
  const title = document.querySelector("#introTitle");
  const pathLine = document.querySelector("#introPathLine");
  const note = document.querySelector("#introMethodNote");
  const message = document.querySelector("#introMessage");
  const cta = document.querySelector("[data-send-intro]");
  const recipient = document.querySelector("#introRecipient");
  if (title) title.textContent = method === "mutual" ? `Request intro to ${firstName} via ${mutualName}` : `Request ${firstName} directly`;
  if (pathLine) pathLine.textContent = method === "mutual" ? `Connected via ${mutualName}` : `Direct request to ${firstName}`;
  const mutualPathActive = method !== "mutual" || isActiveTrustPath(profile.path, profile.name);
  if (method === "mutual") {
    if (recipient) recipient.innerHTML = `<span>Send ${mutualName} a note</span><strong>${mutualName}</strong>`;
    if (note) note.textContent = mutualPathActive
      ? `This lands as a normal chat with ${mutualName}, not a formal approval request.`
      : `This intro path is no longer active. Reconnect with ${mutualName} before requesting this introduction.`;
    if (message) {
      message.value = "";
      message.placeholder = mutualPathActive
        ? `Hey ${mutualName} - would love an intro to ${firstName} if it feels right. Looks like we both have similar interests and may be in Barcelona at the same time.`
        : `Reconnect with ${mutualName} to reopen this path.`;
    }
    if (cta) {
      cta.textContent = mutualPathActive ? "Send Request" : "Path unavailable";
      cta.disabled = !mutualPathActive;
    }
  } else {
    if (recipient) recipient.innerHTML = `<span>Sending to</span><strong>${profile.name}</strong>`;
    if (note) note.textContent = `This goes directly to ${firstName}. Your profile stays partially hidden until ${firstName} accepts.`;
    if (message) {
      message.value = "";
      message.placeholder = `Hey ${firstName} - ${mutualName} is our mutual connection. I would love to connect if it feels right.`;
    }
    if (cta) {
      cta.textContent = `Send to ${firstName}`;
      cta.disabled = false;
    }
  }
}

function setPrivacyMode(selected) {
  const modes = [...document.querySelectorAll("[data-privacy-mode]")];
  if (!modes.length) return;

  if (!selected) {
    const hasActive = modes.some((option) => option.classList.contains("active"));
    if (!hasActive) modes[0].classList.add("active");
  } else {
    const activeCount = modes.filter((option) => option.classList.contains("active")).length;
    const isActive = selected.classList.contains("active");
    if (!(isActive && activeCount === 1)) {
      selected.classList.toggle("active");
    }
  }

  modes.forEach((option) => {
    option.setAttribute("aria-pressed", option.classList.contains("active") ? "true" : "false");
  });
}

function renderOnboardingCarousel() {
  const track = document.querySelector("#onboardingTrack");
  const dots = document.querySelector("#onboardingDots");
  if (!track || !dots) return;
  const slides = [...track.querySelectorAll(".onboarding-slide")];
  onboardingSlide = Math.min(Math.max(onboardingSlide, 0), slides.length - 1);
  track.scrollTo({ left: track.clientWidth * onboardingSlide, behavior: "smooth" });
  dots.innerHTML = slides.map((_, index) => (
    `<button type="button" class="${index === onboardingSlide ? "active" : ""}" data-onboarding-dot="${index}" aria-label="Go to intro slide ${index + 1}"></button>`
  )).join("");
}

function startOnboardingAutoPlay() {
  const track = document.querySelector("#onboardingTrack");
  if (!track) return;
  window.clearInterval(onboardingTimer);
  onboardingTimer = window.setInterval(() => {
    const slides = track.querySelectorAll(".onboarding-slide").length;
    onboardingSlide = (onboardingSlide + 1) % slides;
    renderOnboardingCarousel();
  }, 3600);
}

function resetOnboardingAutoPlay() {
  startOnboardingAutoPlay();
}

function hydrateLists() {
  renderOnboardingCarousel();
  startOnboardingAutoPlay();
  renderHomePeople();
  renderHomePlans();
  renderHomeSuggestions();
  renderNetworkMovement();
  renderNetworkLists();
  renderTrustCaps();
  renderChats();
  renderVerification("qr");
  renderTrustedPlans();
  renderConnectionRequests();
  renderPlanRequests();
  renderNotifications();
  syncSettingsRows();
}

function closeCluster() {
  const sky = document.querySelector(".city-sky");
  if (!sky) return;
  sky.classList.remove("expanded");
  const card = document.querySelector(".cluster-card");
  card?.classList.remove("open", "has-network");
  document.querySelector("#personNetworkPanel")?.replaceChildren();
  document.querySelectorAll("[data-cluster-person]").forEach((person) => person.classList.remove("focused"));
  document.querySelectorAll(".city-node").forEach((node) => node.classList.remove("active"));
}

function bindInteractions() {
  document.querySelector("#homeSearch")?.addEventListener("input", () => {
    renderHomePeople();
    renderHomePlans();
    renderHomeSuggestions();
  });
  document.querySelector("#networkSearch")?.addEventListener("input", renderNetworkLists);
  let swipeBackStart = null;

  document.querySelector("#homeTripSelect")?.addEventListener("change", (event) => {
    activeHomeSelectorValue = event.target.value;
    if (activeHomeSelectorValue.startsWith("city:")) {
      activeHomeCity = activeHomeSelectorValue.replace("city:", "");
    } else {
      activeHomeTripId = activeHomeSelectorValue;
      activeHomeCity = (tripById(activeHomeTripId) || getSelectedHomeTrip()).city;
      homeTripDateRange = tripRangeLabel(getSelectedHomeTrip()).split(" · ")[1] || homeTripDateRange;
    }
    renderHomePeople();
    renderHomePlans();
  });

  const onboardingTrack = document.querySelector("#onboardingTrack");
  if (onboardingTrack) {
    let swipeStart = 0;
    onboardingTrack.addEventListener("pointerdown", (event) => {
      swipeStart = event.clientX;
    });
    onboardingTrack.addEventListener("pointerup", (event) => {
      const delta = event.clientX - swipeStart;
      if (Math.abs(delta) < 36) return;
      const slides = onboardingTrack.querySelectorAll(".onboarding-slide").length;
      onboardingSlide = Math.min(Math.max(onboardingSlide + (delta < 0 ? 1 : -1), 0), slides - 1);
      renderOnboardingCarousel();
      resetOnboardingAutoPlay();
    });
  }

  document.addEventListener("input", (event) => {
    const screen = event.target.closest(".screen");
    if (screen && dirtyScreens.has(screen.dataset.screen) && !event.target.closest("#homeSearch")) {
      screen.dataset.dirty = "true";
    }
  });

  document.addEventListener("focusin", (event) => {
    const field = event.target.closest("input[placeholder], textarea[placeholder]");
    if (!field) return;
    if (!field.dataset.placeholderText) field.dataset.placeholderText = field.placeholder;
    field.placeholder = "";
  });

  document.addEventListener("focusout", (event) => {
    const field = event.target.closest("input, textarea");
    if (!field?.dataset.placeholderText || field.value.trim()) return;
    field.placeholder = field.dataset.placeholderText;
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.clientX > 28 || rootScreens.has(activeScreenId())) return;
    if (event.target.closest(".onboarding-track, .plan-preview-stack, .profile-carousel, .mini-card-row, .unlock-strip, .testimonial-row, input, textarea, select, button")) return;
    swipeBackStart = { x: event.clientX, y: event.clientY };
  });

  document.addEventListener("pointerup", (event) => {
    if (!swipeBackStart) return;
    const deltaX = event.clientX - swipeBackStart.x;
    const deltaY = Math.abs(event.clientY - swipeBackStart.y);
    swipeBackStart = null;
    if (deltaX > 86 && deltaY < 54) goBack();
  });

  document.addEventListener("click", (event) => {
    const profileMenuToggle = event.target.closest("[data-profile-menu]");
    const profileMenu = document.querySelector("#profileMenu");
    if (profileMenuToggle) {
      profileMenu?.classList.toggle("open");
      return;
    }
    if (profileMenu && !event.target.closest("#profileMenu")) {
      profileMenu.classList.remove("open");
    }

    const back = event.target.closest("[data-back]");
    if (back) {
      goBack();
      return;
    }

    if (event.target.closest("[data-dialog-close]")) {
      document.querySelector(".discard-dialog")?.remove();
      return;
    }

    if (event.target.closest("[data-open-feedback]")) {
      document.querySelector("#profileMenu")?.classList.remove("open");
      openFeedbackForm();
      return;
    }

    if (event.target.closest("[data-submit-feedback]")) {
      submitFeedback();
      return;
    }

    if (event.target.closest("[data-send-intro-message]")) {
      document.querySelector(".discard-dialog")?.remove();
      introThreadStarted = true;
      introThreadLeft = false;
      appState.introRequestAccepted = true;
      appState.pendingIntroRequestActive = false;
      addNotificationEvent("introChat");
      persistPrototypeState();
      activeChatDetailMode = "intro-group";
      showScreen("chat-detail");
      return;
    }

    if (event.target.closest("[data-send-intro-decline-note]")) {
      document.querySelector(".discard-dialog")?.remove();
      appState.pendingIntroRequestActive = false;
      appState.introRequestDeclined = true;
      connectionRequests.intro.forEach((request) => {
        if (request.name === "Noah Silva" || request.status === "Waiting for you" || request.status === "New") {
          request.status = "Declined";
          request.actions = false;
        }
      });
      renderChats();
      renderConnectionRequests();
      addNotificationEvent("declinedIntro");
      persistPrototypeState();
      showUtilityFeedback("Intro request declined", "Not right now, but happy to reconnect another time.");
      return;
    }

    if (event.target.closest("[data-confirm-leave-intro]")) {
      document.querySelector(".discard-dialog")?.remove();
      introThreadLeft = true;
      activeChatDetailMode = "direct_connection_chat";
      selectedChatName = "Emma Laurent";
      selectedChatPath = "Introduced by Laura";
      selectedChatPreview = "Laura introduced you both. You can keep chatting directly.";
      upsertChat("all", { name: "Emma Laurent", path: "Introduced by Laura", preview: selectedChatPreview, time: "Now", unread: true, type: "Direct Connection Chat", chatType: "direct_connection_chat", meetupRequired: true });
      renderChatDetail();
      persistPrototypeState();
      return;
    }

    if (event.target.closest("[data-confirm-archive-chat]")) {
      document.querySelector(".discard-dialog")?.remove();
      const chat = findChatByName(pendingArchiveChatCard?.dataset.chatName || "");
      if (chat) chat.archived = true;
      pendingArchiveChatCard?.remove();
      pendingArchiveChatCard = null;
      persistPrototypeState();
      showUtilityFeedback("Chat archived", "The conversation left your inbox. History remains available where relevant.");
      return;
    }

    if (event.target.closest("[data-confirm-delete-archived-chat]")) {
      document.querySelector(".discard-dialog")?.remove();
      if (pendingDeleteChatKey) deletedChatKeys.add(pendingDeleteChatKey);
      Object.values(chats).forEach((items) => {
        for (let index = items.length - 1; index >= 0; index -= 1) {
          if (chatKey(items[index]) === pendingDeleteChatKey || items[index].name === pendingDeleteChatName) {
            items.splice(index, 1);
          }
        }
      });
      const deletedName = pendingDeleteChatName || "Archived chat";
      pendingDeleteChatKey = "";
      pendingDeleteChatName = "";
      persistPrototypeState();
      renderChats();
      showUtilityFeedback("Archived chat deleted", `${deletedName} was permanently removed from this prototype.`);
      return;
    }

    const confirmTrustUpgrade = event.target.closest("[data-confirm-trust-upgrade]");
    if (confirmTrustUpgrade) {
      const name = confirmTrustUpgrade.dataset.confirmTrustUpgrade;
      document.querySelector(".discard-dialog")?.remove();
      addGraphFlag("trustedConnections", name);
      removeGraphFlag("metConnections", name);
      if (trustedFriendState.used < currentTrustedFriendCap()) trustedFriendState.used += 1;
      addNotificationEvent("acceptedIntro");
      refreshTrustGraphViews();
      showUtilityFeedback("Trusted Friend added", `${name.split(" ")[0]}'s branch is now active. City hubs, suggestions and plans can expand through this trusted route.`);
      return;
    }

    const onboardingDot = event.target.closest("[data-onboarding-dot]");
    if (onboardingDot) {
      onboardingSlide = Number(onboardingDot.dataset.onboardingDot);
      renderOnboardingCarousel();
      resetOnboardingAutoPlay();
      return;
    }

    const tripSave = event.target.closest("[data-trip-save]");
    if (tripSave) {
      if (tripEditorMode === "edit") {
        saveEditedTrip();
        return;
      }
      updateHomeTripDateRange();
      markScreenClean("trip");
      if (tripReturnTarget === "trusted") renderTrustedMode("onboarding");
      persistPrototypeState();
      showScreen(tripReturnTarget);
      return;
    }

    const tripSkip = event.target.closest("[data-trip-skip]");
    if (tripSkip) {
      tripEditorMode = "create";
      editingTripId = null;
      markScreenClean("trip");
      if (tripReturnTarget === "trusted") renderTrustedMode("onboarding");
      showScreen(tripReturnTarget);
      return;
    }

    const editTrip = event.target.closest("[data-edit-trip]");
    if (editTrip) {
      tripEditorMode = "edit";
      editingTripId = editTrip.dataset.editTrip;
      tripReturnTarget = "all-trips";
      showScreen("trip");
      return;
    }

    const deleteTrip = event.target.closest("[data-delete-trip]");
    if (deleteTrip) {
      confirmDeleteTrip(deleteTrip.dataset.deleteTrip);
      return;
    }

    const removeConnection = event.target.closest("[data-remove-connection]");
    if (removeConnection) {
      confirmRemoveConnection(removeConnection.dataset.removeConnection);
      return;
    }

    const requestReconnect = event.target.closest("[data-request-reconnect]");
    if (requestReconnect) {
      confirmReconnection(requestReconnect.dataset.requestReconnect);
      return;
    }

    const trustUpgrade = event.target.closest("[data-trust-upgrade]");
    if (trustUpgrade) {
      confirmTrustedUpgrade(trustUpgrade.dataset.trustUpgrade);
      return;
    }

    const shareContact = event.target.closest("[data-share-contact]");
    if (shareContact) {
      shareContact.textContent = "Shared";
      shareContact.classList.add("shared");
      return;
    }

    const shareProfile = event.target.closest("[data-share-profile]");
    if (shareProfile) {
      chatReturnTarget = activeScreenId();
      chatMode = "share";
      chatFilter = "all";
      document.querySelectorAll("#chats [data-chat-filter]").forEach((button) => button.classList.toggle("active", button.dataset.chatFilter === "all"));
      showScreen("chats");
      return;
    }

    const chatMute = event.target.closest("[data-chat-mute]");
    if (chatMute) {
      const card = chatMute.closest(".chat-card");
      const indicator = card?.querySelector(".muted-indicator");
      const isMuted = card?.classList.contains("is-muted");
      const chat = findChatByName(card?.dataset.chatName || "");
      if (chat) chat.muted = !isMuted;
      if (indicator) indicator.hidden = isMuted;
      card?.classList.toggle("is-muted", !isMuted);
      card?.querySelectorAll("[data-chat-mute]").forEach((button) => {
        button.setAttribute("aria-label", isMuted ? "Mute chat" : "Unmute chat");
      });
      persistPrototypeState();
      showUtilityFeedback(isMuted ? "Chat unmuted" : "Chat muted", isMuted ? "Push notifications are back on for this conversation." : "Messages still arrive, but push notifications are paused.");
      return;
    }

    const chatArchive = event.target.closest("[data-chat-archive]");
    if (chatArchive) {
      const card = chatArchive.closest(".chat-card");
      pendingArchiveChatCard = card;
      confirmArchiveChat(card?.dataset.chatName || "this chat");
      return;
    }

    const chatUnarchive = event.target.closest("[data-chat-unarchive]");
    if (chatUnarchive) {
      const card = chatUnarchive.closest(".chat-card");
      const chat = findChatByName(card?.dataset.chatName || "");
      if (chat) chat.archived = false;
      persistPrototypeState();
      renderChats();
      showUtilityFeedback("Chat restored", "The conversation is back in your active inbox.");
      return;
    }

    const chatDeleteArchived = event.target.closest("[data-chat-delete-archived]");
    if (chatDeleteArchived) {
      const card = chatDeleteArchived.closest(".chat-card");
      const chat = findChatByName(card?.dataset.chatName || "");
      confirmDeleteArchivedChat(card?.dataset.chatName || "this archived chat", chat ? chatKey(chat) : chatKey(card?.dataset.chatName || ""));
      return;
    }

    const introduce = event.target.closest("[data-introduce]");
    if (introduce) {
      confirmIntroduce();
      return;
    }

    const introReply = event.target.closest("[data-intro-reply]");
    if (introReply) {
      selectedChatName = "Hugo";
      selectedChatPath = "Intro request reply";
      selectedChatPreview = "Happy to intro - what are you hoping to connect on?";
      activeChatDetailMode = "intro-reply";
      showScreen("chat-detail");
      return;
    }

    const introSoftDecline = event.target.closest("[data-intro-soft-decline]");
    if (introSoftDecline) {
      confirmIntroSoftDecline();
      return;
    }

    const connectionResponse = event.target.closest("[data-request-response]");
    if (connectionResponse) {
      const card = connectionResponse.closest(".request-card");
      const accepted = connectionResponse.dataset.requestResponse === "accept";
      const group = connectionResponse.dataset.requestGroup || requestFilter;
      const request = connectionRequests[group]?.[Number(connectionResponse.dataset.requestIndex)];
      if (request) {
        request.status = accepted ? "Accepted" : "Declined";
        request.actions = false;
        if (accepted && group === "met") {
          addGraphFlag("trustedConnections", request.name);
          removeGraphFlag("metConnections", request.name);
          if (trustedFriendState.used < currentTrustedFriendCap()) trustedFriendState.used += 1;
          addNotificationEvent("acceptedIntro");
        }
        if (accepted && group === "intro") {
          introThreadStarted = true;
          appState.pendingIntroRequestActive = false;
          upsertChat("all", { name: "Hugo & Emma", path: "Introduced by Laura", preview: "Laura introduced you both.", time: "Now", unread: true, type: "Intro Chat", chatType: "intro_chat", userRole: "introduced" });
        }
      }
      card?.classList.add(accepted ? "request-accepted" : "request-declined");
      card?.querySelectorAll(".request-actions button").forEach((button) => {
        if (button !== connectionResponse) button.disabled = true;
      });
      connectionResponse.textContent = accepted ? "Accepted" : "Declined";
      connectionResponse.disabled = true;
      persistPrototypeState();
      refreshTrustGraphViews();
      showUtilityFeedback(accepted ? "Request accepted" : "Request declined", accepted ? "The connection request has been accepted." : "The request has been declined.");
      return;
    }

    const planRequestResponse = event.target.closest("[data-plan-request-response]");
    if (planRequestResponse) {
      const card = planRequestResponse.closest(".request-card");
      const accepted = planRequestResponse.dataset.planRequestResponse === "accept";
      card?.classList.add(accepted ? "request-accepted" : "request-declined");
      card?.querySelectorAll(".request-actions button").forEach((button) => {
        if (button !== planRequestResponse) button.disabled = true;
      });
      planRequestResponse.textContent = accepted ? "Accepted" : "Rejected";
      planRequestResponse.disabled = true;
      const requestIndex = Number(planRequestResponse.dataset.planRequestIndex);
      if (!Number.isNaN(requestIndex)) planJoinRequests.splice(requestIndex, 1);
      syncPlanRequestCounts();
      persistPrototypeState();
      showUtilityFeedback(accepted ? "Request accepted" : "Request rejected", accepted ? "They can now enter the plan chat." : "The join request has been rejected.");
      renderPlanRequests();
      return;
    }

    const leaveIntroChat = event.target.closest("[data-leave-intro-chat]");
    if (leaveIntroChat) {
      confirmLeaveIntroChat();
      return;
    }

    const muteChat = event.target.closest(".intro-chat-footer-actions button:not([data-leave-intro-chat]), .direct-chat-actions button:not([data-next])");
    if (muteChat) {
      muteChat.classList.toggle("active");
      showUtilityFeedback(muteChat.classList.contains("active") ? "Chat muted" : "Chat unmuted", muteChat.classList.contains("active") ? "Messages still arrive, but push notifications are paused." : "Push notifications are back on for this conversation.");
      return;
    }

    const addFriends = event.target.closest("[data-add-friends]");
    if (addFriends) {
      renderTrustedMode("add-friends");
      showScreen("trusted");
      return;
    }

    const qrShortcut = event.target.closest("[data-qr-shortcut]");
    if (qrShortcut) {
      const current = document.querySelector(".screen.active")?.dataset.screen || "home";
      renderQrRevealMode(current);
      showScreen("qr-reveal");
      return;
    }

    const filter = event.target.closest("[data-home-filter]");
    if (filter) {
      homeFilter = filter.dataset.homeFilter;
      if (homeFilter === "same") activeHomeSelectorValue = activeHomeTripId;
      if (homeFilter === "in-town" || homeFilter === "locals") activeHomeSelectorValue = `city:${activeHomeCity}`;
      filter.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
      filter.classList.add("active");
      renderHomePeople();
      renderHomePlans();
      renderHomeSuggestions();
      return;
    }

    const chatTab = event.target.closest("[data-chat-filter]");
    if (chatTab) {
      chatMode = "default";
      chatFilter = chatTab.dataset.chatFilter;
      chatTab.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
      chatTab.classList.add("active");
      renderChats();
      return;
    }

    const planTab = event.target.closest("[data-plan-filter]");
    if (planTab) {
      planFilter = planTab.dataset.planFilter;
      planTab.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
      planTab.classList.add("active");
      renderTrustedPlans();
      renderMyPlans();
      renderPersonPlans();
      return;
    }

    const requestTab = event.target.closest("[data-request-filter]");
    if (requestTab) {
      requestFilter = requestTab.dataset.requestFilter;
      requestTab.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
      requestTab.classList.add("active");
      renderConnectionRequests();
      return;
    }

    const networkTab = event.target.closest("[data-network-filter]");
    if (networkTab) {
      networkFilter = networkTab.dataset.networkFilter;
      document.querySelectorAll("[data-network-filter]").forEach((button) => button.classList.toggle("selected", button === networkTab));
      renderNetworkLists();
      return;
    }

    const profileTab = event.target.closest("[data-profile-tab]");
    if (profileTab) {
      const activeTab = profileTab.dataset.profileTab;
      profileTab.parentElement.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button === profileTab));
      document.querySelectorAll("[data-profile-panel]").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.profilePanel === activeTab);
      });
      return;
    }

    const cityMutual = event.target.closest("[data-city-mutual]");
    if (cityMutual) {
      renderCityMutuals(cityMutual.dataset.cityMutual);
      showScreen("city-mutuals");
      return;
    }

    const complete = event.target.closest("[data-complete-verification]");
    if (complete) {
      completeVerification();
      return;
    }

    const instagramCard = event.target.closest("[data-instagram-profile]");
    if (instagramCard) {
      if (instagramCard.dataset.trustedInstagram !== "true") {
        instagramCard.classList.add("locked-pulse");
        window.setTimeout(() => instagramCard.classList.remove("locked-pulse"), 700);
        return;
      }
      const username = instagramCard.dataset.instagramProfile;
      window.location.href = `instagram://user?username=${username}`;
      window.setTimeout(() => {
        window.location.href = `https://www.instagram.com/${username}/`;
      }, 650);
      return;
    }

    const introSend = event.target.closest("[data-send-intro]");
    if (introSend) {
      markScreenClean("request-intro");
      chatMode = "default";
      chatFilter = "all";
      appState.pendingIntroRequestActive = true;
      upsertConnectionRequest("sent", { name: "Emma Laurent", path: "You -> Laura -> Emma", type: introMethod === "mutual" ? "Via mutual friend" : "Direct request", status: introMethod === "mutual" ? "Sent to Laura" : "Waiting" });
      upsertNotification({
        id: `sent-intro-${Date.now()}`,
        kind: "intro",
        title: "Intro request sent",
        body: introMethod === "mutual" ? "Your intro request was sent to Laura." : "Your direct intro request was sent to Emma.",
        profile: introMethod === "mutual" ? "Laura Chen" : "Emma Laurent",
        active: true
      });
      persistPrototypeState();
      introSend.textContent = "Request sent";
      window.setTimeout(() => showScreen("chats"), 450);
      return;
    }

    const requestPlan = event.target.closest("[data-request-plan]");
    if (requestPlan) {
      const requestedPlan = selectedPlan();
      const message = document.querySelector("#planJoinMessage")?.value.trim();
      if (message) requestPlan.dataset.requestMessage = message;
      const textarea = document.querySelector("#planJoinMessage");
      if (textarea) textarea.value = "";
      selectedPlanStatus = "pending";
      upsertPlan("pending", { ...requestedPlan, role: "pending", viewerStatus: "pending", status: "Pending Approval" });
      upsertNotification({
        id: `plan-request-${selectedPlanName.replaceAll(" ", "-").toLowerCase()}`,
        kind: "plan-view",
        title: "Plan request sent",
        body: `Your request to join ${selectedPlanName} is waiting for host approval.`,
        active: true
      });
      persistPrototypeState();
      renderPlanDetail();
      return;
    }

    const cancelPlanRequest = event.target.closest("[data-cancel-plan-request]");
    if (cancelPlanRequest) {
      const pendingIndex = myPlans.pending.findIndex((plan) => plan.name === selectedPlanName);
      if (pendingIndex >= 0) myPlans.pending.splice(pendingIndex, 1);
      selectedPlanStatus = "discoverable";
      notificationItems.forEach((item) => {
        if (item.id.startsWith("plan-request-")) item.active = false;
      });
      persistPrototypeState();
      renderPlanDetail();
      return;
    }

    const mutedPlanAction = event.target.closest(".muted-plan-action:not([data-next]):not([data-clear-report-history])");
    if (mutedPlanAction) {
      const label = mutedPlanAction.textContent.trim();
      if (label.includes("Leave")) {
        const planIndex = myPlans.attending.findIndex((plan) => plan.name === selectedPlanName);
        if (planIndex >= 0) myPlans.attending.splice(planIndex, 1);
        persistPrototypeState();
        showUtilityFeedback("Plan left", "You have left this plan in the local prototype.");
        showScreen("my-plans");
        return;
      }
      if (label.includes("Cancel Request")) {
        const planIndex = myPlans.pending.findIndex((plan) => plan.name === selectedPlanName);
        if (planIndex >= 0) myPlans.pending.splice(planIndex, 1);
        persistPrototypeState();
        showUtilityFeedback("Request cancelled", "Your pending request was cancelled.");
        renderPersonPlans();
        renderMyPlans();
        return;
      }
      showUtilityFeedback("Action saved", `${label} is wired in the local prototype.`);
      return;
    }

    const savePlan = event.target.closest("[data-save-plan]");
    if (savePlan) {
      if (!saveEditedPlan()) return;
      markScreenClean("edit-plan");
      savePlan.textContent = "Saved";
      window.setTimeout(() => {
        savePlan.textContent = "Save Changes";
        selectedPlanStatus = "hosting";
        showScreen("plan-detail", { replace: true });
      }, 550);
      return;
    }

    const cancelHostedPlan = event.target.closest("[data-cancel-hosted-plan]");
    if (cancelHostedPlan) {
      confirmCancelHostedPlan();
      return;
    }

    const close = event.target.closest("[data-close-cluster]");
    if (close) {
      closeCluster();
      return;
    }

    const clusterPerson = event.target.closest("[data-cluster-person]");
    if (clusterPerson) {
      renderClusterNetwork(clusterPerson.dataset.clusterPerson, clusterPerson.dataset.networkState);
      return;
    }

    const uploadAction = event.target.closest(".upload-wide, .photo-tile");
    if (uploadAction) {
      uploadAction.classList.add("selected");
      showUtilityFeedback("Photo action", "This opens the photo picker in the live app.");
      return;
    }

    const quietDanger = event.target.closest(".quiet-danger");
    if (quietDanger) {
      quietDanger.textContent = "Removed";
      quietDanger.disabled = true;
      return;
    }

    const wideAction = event.target.closest(".wide-action");
    if (wideAction) {
      const previous = wideAction.textContent;
      wideAction.textContent = previous.includes("QR") ? "Scanner ready" : previous.includes("Invite") ? "Invite copied" : "Contacts ready";
      window.setTimeout(() => {
        wideAction.textContent = previous;
      }, 900);
      return;
    }

    const photoUpload = event.target.closest(".photo-upload-button");
    if (photoUpload) {
      showPhotoSourceSheet();
      return;
    }

    const safetyAction = event.target.closest(".action-grid button:not([data-next])");
    if (safetyAction) {
      const label = safetyAction.textContent.trim();
      openSafetyAction(label);
      return;
    }

    const submitSafety = event.target.closest("[data-submit-safety-action]");
    if (submitSafety) {
      submitSafetyAction(submitSafety.dataset.submitSafetyAction);
      return;
    }

    const settingsDetail = event.target.closest("[data-settings-detail]");
    if (settingsDetail) {
      activeSettingsDetail = settingsDetail.dataset.settingsDetail;
      showScreen("settings-detail");
      return;
    }

    const privacySetting = event.target.closest("[data-privacy-setting]");
    if (privacySetting) {
      openPrivacySelector(privacySetting.dataset.privacySetting);
      return;
    }

    const privacyOption = event.target.closest("[data-privacy-option]");
    if (privacyOption) {
      privacyOption.closest(".settings-selector-card")?.querySelectorAll("[data-privacy-option]").forEach((button) => {
        button.classList.toggle("selected", button === privacyOption);
        button.setAttribute("aria-pressed", String(button === privacyOption));
      });
      return;
    }

    const savePrivacy = event.target.closest("[data-save-privacy-setting]");
    if (savePrivacy) {
      const key = savePrivacy.dataset.savePrivacySetting;
      const selected = document.querySelector(`[data-privacy-option="${key}"].selected`);
      if (selected) settingsState.privacy[key] = selected.dataset.privacyValue;
      document.querySelector(".discard-dialog")?.remove();
      syncSettingsRows();
      persistPrototypeState();
      showUtilityFeedback("Privacy updated", `${privacyOptions[key]?.title || "Setting"} is now ${settingsState.privacy[key]}.`);
      return;
    }

    const notificationSetting = event.target.closest("[data-notification-setting]");
    if (notificationSetting) {
      const key = notificationSetting.dataset.notificationSetting;
      settingsState.notifications[key] = !settingsState.notifications[key];
      syncSettingsRows();
      persistPrototypeState();
      return;
    }

    const detailToggle = event.target.closest("[data-detail-toggle]");
    if (detailToggle) {
      const enabled = detailToggle.getAttribute("aria-pressed") !== "true";
      detailToggle.setAttribute("aria-pressed", String(enabled));
      detailToggle.classList.toggle("is-off", !enabled);
      const value = detailToggle.querySelector("span");
      if (value) value.textContent = enabled ? "On" : "Off";
      return;
    }

    const instagramToggle = event.target.closest("[data-instagram-toggle]");
    if (instagramToggle) {
      settingsState.connectedAccounts.instagram = !settingsState.connectedAccounts.instagram;
      renderSettingsDetail();
      syncSettingsRows();
      persistPrototypeState();
      showUtilityFeedback(settingsState.connectedAccounts.instagram ? "Instagram connected" : "Instagram disconnected", settingsState.connectedAccounts.instagram ? "Instagram is available for trusted profile context." : "Instagram is no longer connected.");
      return;
    }

    const unblockUser = event.target.closest("[data-unblock-user]");
    if (unblockUser) {
      settingsState.blockedUsers = settingsState.blockedUsers.filter((name) => name !== unblockUser.dataset.unblockUser);
      renderSettingsDetail();
      syncSettingsRows();
      persistPrototypeState();
      showUtilityFeedback("User unblocked", `${unblockUser.dataset.unblockUser} is no longer blocked.`);
      return;
    }

    const clearReportHistory = event.target.closest("[data-clear-report-history]");
    if (clearReportHistory) {
      settingsState.reportHistory = [];
      renderSettingsDetail();
      syncSettingsRows();
      persistPrototypeState();
      showUtilityFeedback("Report history cleared", "Local report history has been cleared in this prototype.");
      return;
    }

    const appearanceChoice = event.target.closest("[data-appearance-choice]");
    if (appearanceChoice) {
      settingsState.appearance = appearanceChoice.dataset.appearanceChoice;
      renderSettingsDetail();
      syncSettingsRows();
      persistPrototypeState();
      showUtilityFeedback("Appearance updated", `${settingsState.appearance} appearance selected.`);
      return;
    }

    const settingsFeedback = event.target.closest("[data-settings-feedback]");
    if (settingsFeedback) {
      showUtilityFeedback(settingsFeedback.dataset.settingsFeedback, "This action is wired in the prototype and will connect to backend services in beta.");
      return;
    }

    const devAction = event.target.closest("[data-dev-action]");
    if (devAction) {
      const action = devAction.dataset.devAction;
      if (action === "intro-request") {
        appState.pendingIntroRequestActive = true;
        appState.introRequestDeclined = false;
        upsertConnectionRequest("intro", { name: "Noah Silva", path: "You -> Laura -> Noah", type: "Intro request received", status: "Waiting for you", actions: true });
        addNotificationEvent("introRequest");
      }
      if (action === "accepted-intro") {
        appState.introRequestAccepted = true;
        introThreadStarted = true;
        introThreadLeft = false;
        upsertChat("all", { name: "Hugo & Emma", path: "Introduced by Laura", preview: "Laura introduced you both.", time: "Now", unread: true, type: "Intro Chat", chatType: "intro_chat", userRole: "introduced" });
        addNotificationEvent("acceptedIntro");
      }
      if (action === "declined-intro") {
        appState.pendingIntroRequestActive = false;
        appState.introRequestDeclined = true;
        connectionRequests.intro.forEach((request) => {
          if (request.name === "Noah Silva") {
            request.status = "Declined";
            request.actions = false;
          }
        });
        addNotificationEvent("declinedIntro");
      }
      if (action === "intro-chat") {
        introThreadStarted = true;
        introThreadLeft = false;
        upsertChat("all", { name: "Hugo & Emma", path: "Introduced by Laura", preview: "Laura introduced you both.", time: "Now", unread: true, type: "Intro Chat", chatType: "intro_chat", userRole: "introduced" });
        addNotificationEvent("introChat");
      }
      if (action === "direct-chat") {
        introThreadLeft = true;
        activeChatDetailMode = "direct_connection_chat";
        upsertChat("all", { name: "Emma Laurent", path: "Introduced by Laura", preview: "Laura introduced you both. You can keep chatting directly.", time: "Now", unread: true, type: "Direct Connection Chat", chatType: "direct_connection_chat", meetupRequired: true });
        addNotificationEvent("directChat");
      }
      if (action === "plan-chat") {
        selectedPlanName = "Coffee in Shoreditch";
        selectedPlanStatus = "hosting";
        upsertChat("all", { name: "Coffee in Shoreditch", path: "Plan · private group", preview: "New plan chat activity from Developer Mode.", time: "Now", unread: true, trusted: true, screen: "plan-chat", chatType: "plan_chat", planStatus: "hosting" });
        upsertChat("plans", { name: "Coffee in Shoreditch", path: "Plan · private group", preview: "New plan chat activity from Developer Mode.", time: "Now", unread: true, trusted: true, screen: "plan-chat", chatType: "plan_chat", planStatus: "hosting" });
        addNotificationEvent("planChat");
      }
      if (action === "plan-join") {
        upsertPlanJoinRequest({ name: "Noah Silva", path: "You -> Laura -> Noah", vouch: "2 mutuals", message: "Developer generated join request." });
        addNotificationEvent("planJoin");
      }
      if (action === "plan-approval") {
        myPlans.pending.unshift({ name: "Developer coffee plan", host: "Emma", path: "You -> Laura -> Emma", time: "Fri, 3:00 PM", location: "Soho", joined: 2, max: 6, visibility: "Mutual connections", status: "Pending approval", role: "pending" });
        addNotificationEvent("planApproval");
      }
      if (action === "trip-overlap") {
        appState.generatedTrips += 1;
        homeTrips.unshift({ id: `developer-overlap-${Date.now()}`, city: "Barcelona", country: "Spain", start: "2026-11-10", end: "2026-11-14", visibility: "trusted network only", status: "Trip overlap" });
        addNotificationEvent("tripOverlap");
      }
      if (action === "notifications") notificationItems.forEach((item) => { item.active = true; });
      if (action === "trips") {
        appState.generatedTrips += 1;
        myTrips.unshift({ id: `developer-trip-${Date.now()}`, city: "Madrid", country: "Spain", start: "2026-09-12", end: "2026-09-15", visibility: "trusted network only", status: "Developer trip" });
        addNotificationEvent("trip");
      }
      if (action === "empty-states") {
        notificationItems.forEach((item) => { item.active = false; });
        Object.values(connectionRequests).forEach((requests) => requests.splice(0, requests.length));
        planJoinRequests.splice(0, planJoinRequests.length);
        Object.values(chats).forEach((items) => items.forEach((chat) => { chat.archived = true; }));
        myPlans.hosting.splice(0, myPlans.hosting.length);
        myPlans.attending.splice(0, myPlans.attending.length);
        myPlans.pending.splice(0, myPlans.pending.length);
        myPlans.past.splice(0, myPlans.past.length);
        myTrips.splice(0, myTrips.length);
        homeTrips.splice(0, homeTrips.length);
        homePeople.splice(0, homePeople.length);
        networkPeople.splice(0, networkPeople.length);
        discoverablePlans.splice(0, discoverablePlans.length);
        activeHomeTripId = "";
        syncPlanRequestCounts();
      }
      if (action === "read-notifications") {
        appState.notificationsRead = true;
        notificationItems.forEach((item) => { item.active = false; });
      }
      if (action === "reset") {
        window.localStorage.removeItem(prototypeStorageKey);
        window.location.reload();
        return;
      }
      renderSettingsDetail();
      renderChats();
      renderNotifications();
      renderConnectionRequests();
      renderPlanRequests();
      renderMyPlans();
      persistPrototypeState();
      showUtilityFeedback("Developer action applied", "Demo state updated locally for testing.");
      return;
    }

    const deleteAccount = event.target.closest("[data-delete-account]");
    if (deleteAccount) {
      confirmDeleteAccountStepOne();
      return;
    }

    const deleteAccountFinalStep = event.target.closest("[data-delete-account-final-step]");
    if (deleteAccountFinalStep) {
      confirmDeleteAccountFinal();
      return;
    }

    const confirmDeleteAccount = event.target.closest("[data-confirm-delete-account]");
    if (confirmDeleteAccount) {
      const value = document.querySelector("#deleteConfirmInput")?.value.trim().toUpperCase();
      const error = document.querySelector("#deleteConfirmError");
      if (value !== "DELETE") {
        if (error) error.textContent = "Type DELETE to confirm account deletion.";
        return;
      }
      appState.accountDeletionQueued = true;
      persistPrototypeState();
      document.querySelector(".discard-dialog")?.remove();
      showUtilityFeedback("Account deletion queued", "In the live beta, this would start permanent account deletion after backend confirmation.");
      return;
    }

    const sendButton = event.target.closest(".composer button:not(.photo-upload-button), .chat-input button:not(.photo-upload-button)");
    if (sendButton) {
      const input = sendButton.parentElement?.querySelector("input, textarea");
      if (input) input.value = "";
      const previous = sendButton.textContent;
      sendButton.textContent = "Sent";
      window.setTimeout(() => {
        sendButton.textContent = previous;
      }, 750);
      return;
    }

    const messagePerson = event.target.closest("[data-message-person]");
    if (messagePerson) {
      openDirectChatWith(messagePerson.dataset.messagePerson, {
        preview: `Start a direct conversation with ${messagePerson.dataset.messagePerson.split(" ")[0]}.`
      });
      return;
    }

    const notificationAction = event.target.closest("[data-notification-action]");
    if (notificationAction) {
      const item = notificationItems.find((notification) => notification.id === notificationAction.dataset.notificationId);
      const accepted = notificationAction.dataset.notificationAction === "accept";
      if (item) {
        item.active = false;
        if (accepted && item.kind === "plan" && myPlans.hosting[0]) {
          myPlans.hosting[0].joined = Math.min(myPlans.hosting[0].max, myPlans.hosting[0].joined + 1);
        }
        if (item.kind === "plan") {
          const requestIndex = planJoinRequests.findIndex((request) => request.name === item.profile);
          if (requestIndex >= 0) planJoinRequests.splice(requestIndex, 1);
          syncPlanRequestCounts();
        }
        if (accepted && item.kind === "intro") {
          introThreadStarted = true;
          appState.pendingIntroRequestActive = false;
          upsertChat("all", { name: "Hugo & Emma", path: "Introduced by Laura", preview: "Laura introduced you both.", time: "Now", unread: true, type: "Intro Chat", chatType: "intro_chat", userRole: "introduced" });
        }
        if (!accepted && item.kind === "intro") {
          appState.pendingIntroRequestActive = false;
          appState.introRequestDeclined = true;
        }
      }
      renderNotifications();
      persistPrototypeState();
      showUtilityFeedback(accepted ? "Request accepted" : "Request declined", accepted ? "The request has been accepted and the relevant state updated." : "The request has been declined and removed from active alerts.");
      return;
    }

    const notificationProfile = event.target.closest("[data-notification-profile]");
    if (notificationProfile) {
      selectedProfileName = notificationProfile.dataset.notificationProfile;
      showScreen("profile");
      return;
    }

    const notificationChat = event.target.closest("[data-notification-chat]");
    if (notificationChat) {
      const chatType = notificationChat.dataset.chatType || "direct_connection_chat";
      if (chatType === "plan_chat" || chatType === "archived_plan_chat") {
        selectedPlanName = notificationChat.dataset.notificationChat;
        selectedPlanStatus = chatType === "archived_plan_chat" ? "past" : planStatusForName(selectedPlanName);
        showScreen("plan-chat");
        return;
      }
      openDirectChatWith(notificationChat.dataset.notificationChat, {
        mode: chatType,
        preview: "Open the conversation from this notification."
      });
      return;
    }

    const city = event.target.closest(".city-node");
    if (city) {
      const sky = document.querySelector(".city-sky");
      const card = document.querySelector(".cluster-card");
      sky.classList.add("expanded");
      document.querySelectorAll(".city-node").forEach((node) => node.classList.remove("active"));
      city.classList.add("active");
      card.classList.add("open");
      card.classList.remove("has-network");
      document.querySelector("#personNetworkPanel")?.replaceChildren();
      document.querySelectorAll("[data-cluster-person]").forEach((person) => person.classList.remove("focused"));
      renderCityHub(city.dataset.city);
      return;
    }

    const sky = event.target.closest(".city-sky.expanded");
    if (sky && !event.target.closest(".cluster-card, .map-bottom, .map-top, .bottom-nav")) {
      closeCluster();
      return;
    }

    const next = event.target.closest("[data-next]");
    if (next) {
      document.querySelector("#profileMenu")?.classList.remove("open");
      const current = document.querySelector(".screen.active")?.dataset.screen;
      if (next.textContent.trim().toLowerCase() === "back") {
        goBack();
        return;
      }
      if (next.dataset.profileName) selectedProfileName = next.dataset.profileName;
      if (next.dataset.planName) selectedPlanName = next.dataset.planName;
      if (next.dataset.planStatus) selectedPlanStatus = next.dataset.planStatus;
      if (next.dataset.chatName) selectedChatName = next.dataset.chatName;
      if (next.dataset.chatPath) selectedChatPath = next.dataset.chatPath;
      if (next.dataset.chatPreview) selectedChatPreview = next.dataset.chatPreview;
      if (next.dataset.next === "my-plans") planFilter = "hosting";
      if (next.dataset.next === "trip") {
        tripEditorMode = "create";
        editingTripId = null;
        tripReturnTarget = current === "home" ? "home" : "trusted";
      }
      if (next.dataset.next === "trusted") renderTrustedMode("onboarding");
      if (next.dataset.next === "qr-reveal") renderQrRevealMode("home");
      if (next.dataset.next === "chats" && !next.dataset.chatMode && next.textContent.toLowerCase().includes("message")) {
        const plan = selectedPlan();
        const recipient = next.dataset.messagePerson || (next.textContent.toLowerCase().includes("host") ? plan.host : selectedProfileName);
        openDirectChatWith(recipient === "You" ? "Hugo" : recipient, {
          preview: next.textContent.toLowerCase().includes("host") ? `Message ${recipient} about ${plan.name}.` : `Message ${recipient}.`
        });
        return;
      }
      if (next.dataset.chatMode) {
        chatMode = next.dataset.chatMode;
        chatReturnTarget = current || "home";
        chatFilter = "all";
        document.querySelectorAll("#chats [data-chat-filter]").forEach((button) => button.classList.toggle("active", button.dataset.chatFilter === "all"));
      } else if (next.dataset.next === "chats") {
        chatMode = "default";
      }
      if (next.dataset.next === "chat-detail") {
        if (next.dataset.chatArchived === "true") {
          activeChatDetailMode = "archived_chat";
        } else if (next.dataset.chatType === "intro_chat") {
          activeChatDetailMode = "intro-group";
          introThreadStarted = true;
          introThreadLeft = next.dataset.chatRole !== "introducer";
        } else if (next.dataset.chatType) {
          activeChatDetailMode = next.dataset.chatType;
        } else if (!introThreadStarted) {
          activeChatDetailMode = "default";
        }
      }
      showScreen(next.dataset.next);
      return;
    }

    const publishPlan = event.target.closest("[data-publish-plan]");
    if (publishPlan) {
      publishCreatedPlan();
      planFilter = "hosting";
      selectedPlanStatus = "hosting";
      markScreenClean("create-plan");
      showScreen("my-plans");
      return;
    }

    const selectable = event.target.closest(".selectable button");
    if (selectable) {
      const group = selectable.closest(".selectable");
      const maxSelected = Number(group?.dataset.maxSelected || 0);
      const selectedCount = group?.querySelectorAll("button.selected").length || 0;
      if (!selectable.classList.contains("selected") && maxSelected && selectedCount >= maxSelected) {
        selectable.blur();
        return;
      }
      selectable.classList.toggle("selected");
      selectable.blur();
    }

    const single = event.target.closest(".single-select .option-card");
    if (single) {
      single.parentElement.querySelectorAll(".option-card").forEach((option) => {
        option.classList.remove("selected");
        option.setAttribute("aria-pressed", "false");
      });
      single.classList.add("selected");
      single.setAttribute("aria-pressed", "true");
      if (single.dataset.verifyMethod) renderVerification(single.dataset.verifyMethod);
      if (single.dataset.introMethod) renderIntroMethod(single.dataset.introMethod);
    }

    const toggle = event.target.closest(".exclusive-toggles .toggle-card");
    if (toggle) {
      toggle.parentElement.querySelectorAll(".toggle-card").forEach((card) => card.classList.remove("active"));
      toggle.classList.add("active");
    }

    const privacyMode = event.target.closest("[data-privacy-mode]");
    if (privacyMode) {
      setPrivacyMode(privacyMode);
      return;
    }

    const privacyExtra = event.target.closest("[data-privacy-extra]");
    if (privacyExtra) {
      privacyExtra.classList.toggle("active");
      privacyExtra.setAttribute("aria-pressed", privacyExtra.classList.contains("active") ? "true" : "false");
      return;
    }

    const setting = event.target.closest(".setting-card");
    if (setting) setting.classList.toggle("active");
  });

}

applyStoredPrototypeState();
cleanBrandingImages();
hydrateLists();
setPrivacyMode();
ensureBackButtons();
document.querySelectorAll(".bottom-nav").forEach(renderNav);
bindInteractions();
updateNotificationBadges();
