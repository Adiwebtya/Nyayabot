/**
 * NyayaBot Legal Engine
 * Handles classification, entity extraction, and structured response generation.
 */

const CATEGORIES = {
    THEFT: "Theft / Robbery",
    ASSAULT: "Assault / Physical violence",
    SEXUAL_HARASSMENT: "Sexual harassment / assault",
    CYBERCRIME: "Cybercrime",
    FRAUD: "Fraud / financial scam",
    THREAT: "Threat / intimidation",
    DOMESTIC_VIOLENCE: "Domestic violence",
    PROPERTY_DAMAGE: "Property damage",
    STALKING: "Stalking / harassment",
    CORRUPTION: "Corruption or abuse of authority"
};

const LEGAL_MAPPINGS = {
    [CATEGORIES.THEFT]: {
        sections: "BNS Sections 303, 309, 310",
        meaning: "Theft involves taking someone's property without permission. Robbery is theft with force or threat of harm.",
        punishment: "Imprisonment for up to 3 years, or fine, or both. For robbery, up to 10 years rigorous imprisonment.",
        evidence: ["CCTV footage", "List of stolen items", "Witness details", "Purchase bills of items"],
        helpline: "100 or 112"
    },
    [CATEGORIES.ASSAULT]: {
        sections: "BNS Sections 115, 117, 131",
        meaning: "Assault is causing physical harm or using force to intimidate someone. Serious hurt carries higher penalties.",
        punishment: "Imprisonment from 1 to 7 years depending on severity, plus fines.",
        evidence: ["Medical report (MLC)", "Photos of injuries", "Witness statements", "Blood-stained clothes"],
        helpline: "100 or 112"
    },
    [CATEGORIES.SEXUAL_HARASSMENT]: {
        sections: "BNS Sections 73, 74, 63, POCSO (if minor)",
        meaning: "Unwelcome sexual advances, comments, or physical contact. These laws protect dignity and bodily autonomy.",
        punishment: "Imprisonment from 1 to 5 years for harassment; up to life imprisonment for serious assault.",
        evidence: ["Messages/Emails", "Witness accounts", "CCTV where applicable", "Phone recordings"],
        helpline: "1091 (Women Helpline)"
    },
    [CATEGORIES.CYBERCRIME]: {
        sections: "IT Act Sections 66C, 66D, 66E",
        meaning: "Crimes involving computers or the internet, like identity theft, online fraud, or hacking.",
        punishment: "Imprisonment for up to 3 years and/or fine up to ₹1-5 lakhs.",
        evidence: ["Screenshots", "Transaction IDs", "Email headers", "URL of suspect profiles"],
        helpline: "1930 (Cyber Crime Portal)"
    },
    [CATEGORIES.FRAUD]: {
        sections: "BNS Sections 318, 338",
        meaning: "Cheating someone by making false promises or using trickery for financial gain.",
        punishment: "Imprisonment for 3 to 7 years and a mandatory fine.",
        evidence: ["Bank statements", "Signed documents", "Chat history", "Contract copies"],
        helpline: "1930 or 100"
    },
    [CATEGORIES.THREAT]: {
        sections: "BNS Sections 351, 352",
        meaning: "Criminal intimidation—threatening someone with injury to their person, reputation, or property.",
        punishment: "Imprisonment for up to 2 years, or fine, or both.",
        evidence: ["Recordings of threats", "Witnesses who heard", "Screenshots of threats"],
        helpline: "100 or 112"
    },
    [CATEGORIES.DOMESTIC_VIOLENCE]: {
        sections: "BNS Section 85, Protection of Women from Domestic Violence Act 2005",
        meaning: "Abuse (physical, emotional, or economic) within a domestic relationship.",
        punishment: "Imprisonment for up to 3 years and liability for fine.",
        evidence: ["Medical records", "History of logs/incidents", "Police complaints", "Testimony"],
        helpline: "1091 or 181"
    },
    [CATEGORIES.PROPERTY_DAMAGE]: {
        sections: "BNS Section 324",
        meaning: "Mischief—knowingly causing damage or loss to someone's property.",
        punishment: "Imprisonment for up to 2 years, or fine, or both.",
        evidence: ["Photos of damage", "Repair estimates", "Witnesses", "CCTV footage"],
        helpline: "100"
    },
    [CATEGORIES.STALKING]: {
        sections: "BNS Sections 77, 78",
        meaning: "Repeatedly following or contacting someone despite clear lack of interest, or monitoring their online use.",
        punishment: "Imprisonment for up to 3 years (first conviction) to 5 years (subsequent).",
        evidence: ["Call logs", "Messages", "Timeline of incidents", "Videos of suspect following"],
        helpline: "1091 or 100"
    },
    [CATEGORIES.CORRUPTION]: {
        sections: "BNS Sections 198, 201, Prevention of Corruption Act",
        meaning: "Public servants taking bribes or abusing their position to cause harm or gain favor.",
        punishment: "Imprisonment for 3 to 7 years and fine.",
        evidence: ["Recordings", "Documentary proof", "Transaction trail", "Witnesses"],
        helpline: "1064 (Anti-Corruption)"
    }
};

const keywordMap = [
    { keywords: ['steal', 'stole', 'theft', 'rob', 'robbery', 'purse', 'wallet', 'phone', 'snatch', 'chori', 'chura', 'gayab', 'loot', 'cheena'], category: CATEGORIES.THEFT },
    { keywords: ['hit', 'beat', 'assault', 'slap', 'punch', 'attack', 'physical', 'maara', 'peeta', 'maarpit', 'hamla', 'chot'], category: CATEGORIES.ASSAULT },
    { keywords: ['sexual', 'molest', 'touch', 'rape', 'harass', 'comment', 'chedchad', 'badtameezi', 'galat', 'shoshan'], category: CATEGORIES.SEXUAL_HARASSMENT },
    { keywords: ['online', 'internet', 'hack', 'facebook', 'instagram', 'whatsapp', 'cyber', 'email', 'scam', 'cheat', 'otp', 'hacked'], category: CATEGORIES.CYBERCRIME },
    { keywords: ['fraud', 'scam', 'money', 'bank', 'cheat', 'financial', 'invest', 'dhokha', 'paisa', 'thagi', 'farzi'], category: CATEGORIES.FRAUD },
    { keywords: ['threat', 'kill', 'danger', 'scare', 'intimidate', 'dhamki', 'dhamkaya', 'maardunga', 'daraya'], category: CATEGORIES.THREAT },
    { keywords: ['husband', 'wife', 'in-laws', 'home', 'family', 'domestic', 'abuse', 'pati', 'sasural', 'maar-peet', 'ghar'], category: CATEGORIES.DOMESTIC_VIOLENCE },
    { keywords: ['damage', 'break', 'property', 'car', 'bike', 'house', 'window', 'todfod', 'nuksan', 'gadi'], category: CATEGORIES.PROPERTY_DAMAGE },
    { keywords: ['stalk', 'follow', 'repeatedly', 'tease', 'peecha', 'picha'], category: CATEGORIES.STALKING },
    { keywords: ['officer', 'bribe', 'police', 'authority', 'government', 'corrupt', 'rishwat', 'ghoos', 'afsar'], category: CATEGORIES.CORRUPTION }
];

export const analyzeIncident = async (description, history = []) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const text = description.toLowerCase();

    // Basic Language Detection
    const hindiKeywords = ['chori', 'maara', 'peeta', 'dhamki', 'paisa', 'mera', 'hai', 'hai', 'ki', 'ko', 'se'];
    const isHindiHinglish = hindiKeywords.some(kw => text.includes(kw));

    // Safety/Danger Check
    const dangerKeywords = ['kill', 'suicide', 'dead', 'now', 'danger', 'gun', 'knife', 'emergency', 'jaan', 'khatra', 'maardunga'];
    const isImmediateDanger = dangerKeywords.some(kw => text.includes(kw));

    if (isImmediateDanger) {
        return {
            type: 'URGENT',
            summary: isHindiHinglish
                ? "🚨 KHATRA DETECTED. KRIPYA TURANT 100 YA 112 PAR CALL KAREIN. INTEZAR NA KAREIN."
                : "🚨 IMMEDIATE DANGER DETECTED. PLEASE CALL 100 OR 112 RIGHT NOW. DO NOT WAIT FOR THIS CHAT.",
            details: {
                category: "Urgent Safety / Suraksha",
                sections: "N/A",
                meaning: isHindiHinglish ? "Aapki suraksha sabse pehle hai." : "Your safety is the highest priority.",
                evidence: [],
                steps: isHindiHinglish
                    ? ["Turant 100 call karein", "Surakshit jagah par jayein", "Aas paas ke logo ko batayein"]
                    : ["Call 100 immediately", "Move to a safe public place", "Alert people around you"],
                resources: "Police: 100, Emergency: 112"
            }
        };
    }

    // Detection of Informational Queries
    const infoKeywords = ['what is', 'saja', 'punishment', 'law', 'kanoon', 'section', 'dhara', 'matlab', 'meaning'];
    const isAwarenessQuery = infoKeywords.some(kw => text.includes(kw));

    // Classification
    let matchedCategories = [];
    keywordMap.forEach(item => {
        if (item.keywords.some(kw => text.includes(kw))) {
            matchedCategories.push(item.category);
        }
    });

    if (isAwarenessQuery && matchedCategories.length > 0) {
        const primaryCategory = matchedCategories[0];
        const mappings = LEGAL_MAPPINGS[primaryCategory];
        return {
            type: 'AWARENESS',
            summary: isHindiHinglish
                ? `Maine **${primaryCategory}** ke bare mein jankari dhund li hai:`
                : `Here is the general information regarding **${primaryCategory}**:`,
            details: {
                title: `${mappings.sections} – ${primaryCategory}`,
                meaning: mappings.meaning,
                punishment: mappings.punishment
            }
        };
    }

    // Check for lack of detail
    if (matchedCategories.length === 0 || text.split(' ').length < 3) {
        return {
            type: 'CLARIFICATION',
            summary: isHindiHinglish
                ? "Mujhe is baare mein thodi aur jankari chahiye. Kya aap bata sakte hain:"
                : "I need a bit more information to help you better. Could you clarify:",
            questions: isHindiHinglish
                ? ["Ye kab hua?", "Kya aapko koi chot aayi hai?", "Kya aap us vyakti ko jaante hain?", "Kya aapke paas koi saboot hai (messages/photos)?"]
                : ["When did this happen?", "Did you suffer any physical harm?", "Do you know the person who committed this act?", "Do you have any evidence like messages or photos?"]
        };
    }

    // Primary Category Selection (for simplicity in demo)
    const primaryCategory = matchedCategories[0];
    const mappings = LEGAL_MAPPINGS[primaryCategory];

    // Entity Extraction (Heuristic)
    const victim = text.includes('me') || text.includes('my') ? "Likely User" : "Unknown Participant";
    const offender = text.includes('boss') ? "Employer" :
        text.includes('neighbor') ? "Neighbor" :
            text.includes('husband') || text.includes('wife') ? "Spouse" : "Unknown Person";
    const location = text.includes('work') || text.includes('office') ? "Workplace" :
        text.includes('bus') || text.includes('train') ? "Public Transport" :
            text.includes('home') || text.includes('house') ? "Residence" : "Public/Unknown";
    const severity = text.includes('hurt') || text.includes('severe') || text.includes('threat') ? "High" : "Medium";

    return {
        type: 'ANALYSIS',
        summary: isHindiHinglish
            ? `Aapki baaton se lagta hai ki ye **${primaryCategory}** ka mamla hai. Maine isse jude kanoon aur kadam niche diye hain.`
            : `Based on your description, this incident appears to be a case of **${primaryCategory}**. I have extracted the details and mapped them to the relevant Indian laws.`,
        details: {
            entities,
            sections: legalSections,
            meaning: mappings.meaning,
            evidence: evidenceSuggestions,
            steps: legalSteps,
            resources: emergencyResources,
            firDraft: firDraft
        },
        disclaimer: isHindiHinglish
            ? "DISCLAIMER: Ye FIR draft sirf jankari ke liye hai. Kripya ise police mein jama karne se pehle kisi kanooni visheshagya se salaah lein."
            : "DISCLAIMER: This FIR draft is for educational purposes only. Please consult a legal professional or a police officer to ensure all details are accurate before submission."
    };
};

/**
 * Returns nearby resources based on the provided city/location.
 */
export const findHelpByLocation = (location) => {
    const city = location.toLowerCase().trim();

    const cityData = {
        "delhi": { station: "Central Delhi Police Station", portal: "https://cybercrime.gov.in", women: "1091", police: "100", fraud: "1930" },
        "mumbai": { station: "Marine Drive Police Station", portal: "https://cybercrime.gov.in", women: "103", police: "100", fraud: "1930" },
        "bangalore": { station: "Cubbon Park Police Station", portal: "https://cybercrime.gov.in", women: "1091", police: "100", fraud: "1930" },
        "bengaluru": { station: "Cubbon Park Police Station", portal: "https://cybercrime.gov.in", women: "1091", police: "100", fraud: "1930" },
        "hyderabad": { station: "Banjara Hills Police Station", portal: "https://cybercrime.gov.in", women: "1091", police: "100", fraud: "1930" },
        "chennai": { station: "Anna Nagar Police Station", portal: "https://cybercrime.gov.in", women: "1091", police: "100", fraud: "1930" },
        "kolkata": { station: "Park Street Police Station", portal: "https://cybercrime.gov.in", women: "1091", police: "100", fraud: "1930" }
    };

    const data = cityData[city] || {
        station: `Local Police Station in ${location}`,
        portal: "https://cybercrime.gov.in",
        women: "1091",
        police: "100",
        fraud: "1930"
    };

    return {
        type: 'LOCATION_RESOURCES',
        summary: `Here are the nearby legal help resources for **${location}**:`,
        details: data
    };
};
