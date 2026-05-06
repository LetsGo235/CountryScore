const DEFAULT_CATEGORIES = [
  {
    key: "costOfLiving",
    label: "Cost of Living",
    subcategories: ["Rent", "Groceries", "Bills", "Transport Costs"]
  },
  {
    key: "safety",
    label: "Safety",
    subcategories: ["Crime", "Police", "Night Safety", "Family Safety"]
  },
  {
    key: "jobs",
    label: "Jobs",
    subcategories: ["Job Availability", "Salary", "Career Growth", "Work Culture"]
  },
  {
    key: "healthcare",
    label: "Healthcare",
    subcategories: ["Access", "Quality", "Waiting Times", "Affordability"]
  },
  {
    key: "education",
    label: "Education",
    subcategories: ["Schools", "Universities", "Affordability", "Quality"]
  },
  {
    key: "freedom",
    label: "Freedom",
    subcategories: ["Speech", "Politics", "Personal Freedom", "Internet Access"]
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
    subcategories: ["Happiness", "Food", "Culture", "Things To Do"]
  },
  {
    key: "infrastructure",
    label: "Infrastructure",
    subcategories: ["Public Transport", "Roads", "Internet", "Public Services"]
  }
];

const STATUS_LABELS = {
  current_resident: "Lives there",
  former_resident: "Used to live there",
  visited: "Visited",
  never_been: "Outside opinion"
};

const STATUS_WEIGHT = {
  current_resident: 1.0,
  former_resident: 0.82,
  visited: 0.55,
  never_been: 0.25
};

const SAMPLE_REVIEWS = [
  {
    id: "sample-1",
    timestamp: "2026-05-01T10:00:00Z",
    country: "Netherlands",
    status: "current_resident",
    category: "infrastructure",
    subcategory: "Public Transport",
    score: 9,
    displayName: "Amsterdam resident",
    title: "Easy to move around",
    comment: "Trains, bikes and city transport make daily life smooth. Expensive, but the system works."
  },
  {
    id: "sample-2",
    timestamp: "2026-05-01T11:00:00Z",
    country: "Netherlands",
    status: "current_resident",
    category: "costOfLiving",
    subcategory: "Rent",
    score: 5,
    displayName: "Local reviewer",
    title: "Housing is the pain point",
    comment: "Quality of life is strong, but rent and housing availability pull the score down."
  },
  {
    id: "sample-3",
    timestamp: "2026-05-02T08:00:00Z",
    country: "USA",
    status: "former_resident",
    category: "jobs",
    subcategory: "Career Growth",
    score: 8.5,
    displayName: "Former resident",
    title: "High opportunity, uneven life quality",
    comment: "Career upside is real, but healthcare and safety vary heavily depending on where you are."
  },
  {
    id: "sample-4",
    timestamp: "2026-05-02T09:30:00Z",
    country: "USA",
    status: "former_resident",
    category: "healthcare",
    subcategory: "Affordability",
    score: 4,
    displayName: "Former resident",
    title: "Too expensive",
    comment: "Healthcare quality can be great, but cost and insurance complexity hurt the experience."
  },
  {
    id: "sample-5",
    timestamp: "2026-05-03T13:20:00Z",
    country: "Japan",
    status: "visited",
    category: "safety",
    subcategory: "Night Safety",
    score: 10,
    displayName: "Visitor",
    title: "Felt extremely safe",
    comment: "As a visitor, public areas and transport felt calm, orderly and safe even late."
  },
  {
    id: "sample-6",
    timestamp: "2026-05-04T15:10:00Z",
    country: "Germany",
    status: "current_resident",
    category: "healthcare",
    subcategory: "Access",
    score: 8,
    displayName: "Resident",
    title: "Reliable but slow sometimes",
    comment: "The system is stable and practical, though appointments and bureaucracy can take time."
  },
  {
    id: "sample-7",
    timestamp: "2026-05-05T19:00:00Z",
    country: "United Kingdom",
    status: "visited",
    category: "lifestyle",
    subcategory: "",
    score: 8,
    displayName: "Visitor",
    title: "Great culture and energy",
    comment: "The cities have strong culture and history, but the cost in major areas is noticeable."
  }
];
