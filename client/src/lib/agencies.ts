export interface Agency {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
}

export const agencies: Agency[] = [
  {
    id: "reed",
    name: "Reed Recruitment",
    address: "Part 1, First Floor, One New Walk, Leicester, LE1 7DD",
    phone: "0116 253 1471",
    email: "Not publicly available",
    lat: 52.6368,
    lng: -1.1396,
  },
  {
    id: "office-angels",
    name: "Office Angels",
    address: "118 Charles Street, Leicester, LE1 1LB",
    phone: "0116 251 3555",
    email: "leicester@office-angels.com",
    lat: 52.6354,
    lng: -1.1368,
  },
  {
    id: "regional-recruitment",
    name: "Regional Recruitment Services",
    address: "Unit 5, Centre Court Meridian North, Meridian Business Park, Leicester, LE19 1WR",
    phone: "0116 222 2590",
    email: "Not publicly available",
    lat: 52.5892,
    lng: -1.1526,
  },
  {
    id: "quest",
    name: "Quest Employment",
    address: "13-15 Belvoir Street, Leicester, LE1 6SL",
    phone: "0116 275 7733",
    email: "leicester@questemployment.co.uk",
    lat: 52.6298,
    lng: -1.1422,
  },
  {
    id: "sf-recruitment",
    name: "SF Recruitment",
    address: "Watling Suite, High Cross Business Park, Sharnford, East Midlands, LE10 3PG",
    phone: "0116 281 6670",
    email: "Not publicly available",
    lat: 52.5645,
    lng: -1.2134,
  },
  {
    id: "macildowie",
    name: "Macildowie Recruitment and Retention",
    address: "3 Merus Court Meridian Way, Leicester, LE19 1WY",
    phone: "0116 222 2590",
    email: "Not publicly available",
    lat: 52.5895,
    lng: -1.1542,
  },
  {
    id: "industria",
    name: "Industria Personnel Services",
    address: "80 Charles Street, Leicester, LE1 1FB",
    phone: "Not publicly available",
    email: "Not publicly available",
    lat: 52.6358,
    lng: -1.1372,
  },
  {
    id: "accept",
    name: "Accept Recruitment",
    address: "121 Barkby Rd, Leicester, LE4 9LU",
    phone: "0116 218 2133",
    email: "Not publicly available",
    lat: 52.6512,
    lng: -1.1098,
  },
];

export const requiredDocuments = {
  identity: [
    "Valid passport",
    "National identity card (for EU/EEA citizens)",
    "Driving license (generally accepted as secondary ID)",
  ],
  rightToWork: [
    "UK government share code for non-British/Irish citizens",
    "Valid visa or biometric card (if applicable)",
  ],
  address: [
    "Utility bills (water, electricity, gas) issued within last 3 months",
    "Bank statements issued within last 3 months",
    "Council Tax letter",
    "Tenancy agreement or mortgage statement",
  ],
  other: [
    "National Insurance Number (NIN)",
    "Updated CV tailored for UK job market",
    "References with contact details",
  ],
};
