// Converts all Redis content keys to bilingual {tr: "...", en: "..."} format
// Run: node seed-bilingual.js

require('dotenv').config();
const redis = require('./redis');

const EN_TRANSLATIONS = {
  company: {
    name: "Durukan Klima",
    shortName: "Durukan Klima",
    slogan: "Expert AC & Appliance Service",
    description: "Reliable air conditioning and boiler technical service in Adana Çukurova and Seyhan"
  },
  hero: {
    title: "Your Air Conditioning & Appliance Service Expert",
    subtitle: "Fast Solutions for Every Problem, Expert Service for Every Brand",
    stats: [
      { value: "500+", label: "Happy Customers" },
      { value: "10", label: "Years Experience" },
      { value: "100%", label: "Original Parts" }
    ]
  },
  contact: {
    hours: {
      weekdays: "08:00 - 19:00",
      saturday: "08:00 - 17:00",
      sunday: "Closed",
      emergency: "Weekdays 19:00 - 21:00 via WhatsApp"
    }
  },
  services: [
    {
      title: "AC Service",
      description: "AC maintenance, installation, fault diagnosis and gas refilling services. Expert technical service for all brands and models.",
      details: ["Annual maintenance", "Installation & removal", "Gas refilling", "Fault diagnosis"]
    },
    {
      title: "Washing & Dishwasher Machine",
      description: "Fast and guaranteed repair service for washing machine and dishwasher faults.",
      details: ["Pump replacement", "Door seal", "Electronic board", "Motor repair"]
    },
    {
      title: "Refrigerator & Freezer",
      description: "On-site technical service for refrigerator and freezer faults.",
      details: ["Gas refilling", "Thermostat replacement", "Compressor repair", "Door seal"]
    },
    {
      title: "Original Spare Parts",
      description: "100% original spare parts guarantee with white goods spare part sales for all brands.",
      details: ["Original parts guarantee", "All brands", "Fast supply", "Affordable price"]
    }
  ],
  whyUs: [
    { title: "Fast Response", description: "Same-day service guarantee to quickly solve your problem." },
    { title: "Original Parts", description: "We offer permanent solutions using only original spare parts." },
    { title: "Expert Team", description: "Safe service with our experienced and certified technicians." },
    { title: "Transparent Pricing", description: "No surprise costs. Clear price information before work begins." },
    { title: "Village Service", description: "We also serve surrounding villages on Tuesdays and Fridays." },
    { title: "Workmanship Warranty", description: "We offer workmanship warranty on all our repairs." },
    { title: "7/24 Support", description: "Our WhatsApp line is open day and night for emergencies." },
    { title: "On-site Service", description: "We come to your door without you having to move or stress about transport." }
  ],
  serviceArea: {
    center: "Adana Çukurova",
    districts: ["Çukurova", "Seyhan", "Sarıçam", "Yüreğir", "Kozan", "Ceyhan", "İmamoğlu"]
  },
  workingHours: {
    village: [
      { days: "Tuesday", hours: "09:00 – 17:00" },
      { days: "Friday", hours: "09:00 – 17:00" }
    ]
  },
  faq: [
    { question: "When should AC gas be refilled?", answer: "Your AC may need gas refilling if it's not cooling enough. We recommend annual maintenance." },
    { question: "How quickly does the AC service arrive in Adana?", answer: "As Durukan Klima, we respond to calls in Adana Çukurova and Seyhan on the same day, usually within 2-4 hours." },
    { question: "Which brands do you service?", answer: "We service all brands including Arçelik, Beko, Samsung, LG, Bosch, Daikin, Mitsubishi, Toshiba, Fujitsu, and more." },
    { question: "Do you providearranty on repairs?", answer: "Yes, we provide workmanship warranty on all our repairs and use original spare parts." },
    { question: "Do you service outside city center?", answer: "Yes, we serve all Adana districts including Çukurova, Seyhan, Sarıçam, Yüreğir, Kozan, Ceyhan, and İmamoğlu." },
    { question: "How much does AC maintenance cost?", answer: "AC maintenance prices vary by brand and model. Please call us or use our contact form for a free quote." }
  ],
  statistics: [
    { value: "500+", label: "Happy Customers", icon: "😊" },
    { value: "10", label: "Years Experience", icon: "🏆" },
    { value: "100%", label: "Original Parts", icon: "🛡️" },
    { value: "24/7", label: "WhatsApp Support", icon: "📞" }
  ]
};

function toBilingual(trValue, enValue) {
  if (typeof trValue === 'string') {
    return { tr: trValue, en: enValue || trValue };
  }
  if (Array.isArray(trValue)) {
    return trValue.map((item, i) => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const enItem = EN_TRANSLATIONS[Object.keys(EN_TRANSLATIONS).find(k => Array.isArray(EN_TRANSLATIONS[k]) && EN_TRANSLATIONS[k][i])]?.[i] || {};
        return toBilingualObj(item, enItem);
      }
      return item;
    });
  }
  return { tr: trValue, en: enValue || trValue };
}

function toBilingualObj(trObj, enObj = {}) {
  const result = {};
  for (const key of Object.keys(trObj)) {
    const enVal = enObj[key];
    if (typeof trObj[key] === 'string') {
      result[key] = { tr: trObj[key], en: enVal || trObj[key] };
    } else if (Array.isArray(trObj[key])) {
      result[key] = trObj[key].map((item, i) => {
        if (typeof item === 'object' && item !== null) {
          const enArray = Array.isArray(enObj[key]) ? enObj[key][i] : {};
          return toBilingualObj(item, enArray || {});
        }
        return item;
      });
    } else if (typeof trObj[key] === 'object' && trObj[key] !== null) {
      result[key] = toBilingualObj(trObj[key], enVal || {});
    } else {
      result[key] = { tr: trObj[key], en: enVal || trObj[key] };
    }
  }
  return result;
}

async function convertToBilingual() {
  try {
    const data = await redis.get('content');
    if (!data) {
      console.log('No content found in Redis');
      return;
    }

    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const bilingual = { _bilingual: true };

    for (const [key, value] of Object.entries(parsed)) {
      if (key === 'testimonials' || key === 'brands') {
        // testimonials and brands stay as arrays of objects - keep them as-is for now
        // They can be multilingual later if needed
        bilingual[key] = value;
      } else if (key === 'blog') {
        bilingual[key] = value;
      } else if (EN_TRANSLATIONS[key]) {
        bilingual[key] = toBilingualObj(value, EN_TRANSLATIONS[key]);
      } else {
        bilingual[key] = value;
      }
    }

    await redis.set('content', bilingual);
    console.log('✅ Content converted to bilingual format successfully!');
    console.log('   Set _bilingual flag to true');
  } catch (e) {
    console.error('Error converting content:', e.message);
  }
}

convertToBilingual();
