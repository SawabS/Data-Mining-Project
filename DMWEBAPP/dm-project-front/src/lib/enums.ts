export const ENUMs = {
  GLOBAL: {
    API: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
    COOKIE_NAME: import.meta.env.VITE_COOKIE_NAME,
  },
  PARAMS: {
    PAGE: "page",
    LIMIT: "limit",
    SEARCH: "search",
    STATE: "state",
    CITY: "city",
    SEVERITY: "severity",
    DATE_LIMIT: "date_limit",
    POI: "poi",
    YEAR: "year",
    MONTH: "month",
    DAY_OF_WEEK: "day_of_week",
    TIME_OF_DAY: "time_of_day", // "day" | "night" | "all"
  },
  PAGES: {
    HOME: "/",
  },
} as const;

// Severity color palette - uses CSS variables for theme support
// These are fallback values, prefer using CSS var(--severity-X) in components
export const SEVERITY_COLORS: Record<number, string> = {
  1: "#4caf50", // Green - Low severity
  2: "#ffc107", // Yellow - Medium severity  
  3: "#ff9800", // Orange - High severity
  4: "#f44336", // Red - Critical severity
};

// Get severity color with CSS variable support - always use this for theme support
export const getSeverityColor = (severity: number): string => {
  return `var(--severity-${severity})`;
};

// Get severity color as raw value (for recharts and other libs that don't support CSS vars)
export const getSeverityColorRaw = (severity: number, isDark: boolean = false): string => {
  if (isDark) {
    const darkColors: Record<number, string> = {
      1: "#4caf50",
      2: "#ffc107", 
      3: "#ff9800",
      4: "#f44336",
    };
    return darkColors[severity] || darkColors[1];
  }
  const lightColors: Record<number, string> = {
    1: "#2e7d32",
    2: "#f9a825",
    3: "#ef6c00",
    4: "#c62828",
  };
  return lightColors[severity] || lightColors[1];
};

export const SEVERITY_LABELS: Record<number, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Critical",
};

// Chart colors that adapt to theme - use these CSS variables
export const CHART_COLORS = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  success: "var(--chart-3)",
  warning: "var(--chart-4)",
  info: "var(--chart-5)",
};

// Time of day options
export const TIME_OF_DAY_OPTIONS = [
  { value: "all", label: "All Times" },
  { value: "day", label: "Daytime (6AM - 6PM)" },
  { value: "night", label: "Nighttime (6PM - 6AM)" },
];

// Month options
export const MONTH_OPTIONS = [
  { value: "all", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Day of week options
export const DAY_OF_WEEK_OPTIONS = [
  { value: "all", label: "All Days" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};
