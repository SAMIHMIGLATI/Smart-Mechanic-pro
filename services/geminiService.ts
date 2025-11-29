
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, FaultCodeData, TruckBrand, Language } from "../types";

// Safely initialize AI only if API Key exists
const apiKey = process.env.API_KEY;
const ai = apiKey && apiKey.length > 0 ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = 'gemini-2.5-flash';

// --- OFFICIAL RENAULT TRUCKS STANDARD 70 627 CONTEXT ---
const RENAULT_STANDARD_CONTEXT = `
  REFERENCE DOCUMENT: **Renault Trucks Standard 70 627 - Norme de Repérage des Codes Défauts**.
  AND: **OrionPart Spare Parts Catalog for Renault Trucks & Buses**.
  
  CRITICAL DEFINITIONS (FROM PDF & SAE J1587/J1939):
  1. **MID (Module Identifier)**:
     - MID 128: Engine Control (EMS/EECU).
     - MID 136: EBS Braking System.
     - MID 144: Vehicle Control Unit (VECU).
     - MID 185: Air Production Management (APM/EAC).

  2. **SID/PID (Component Identifiers) - EXAMPLES:**
     - **SID 232**: 5V Sensor Supply (Alimentation capteurs 5V). *Critical: This powers multiple sensors.*
     - **PID 94**: Fuel Delivery Pressure.
     - **PID 100**: Oil Pressure.
     - **SID 254**: Controller Internal Fault (ECU).

  3. **FMI (Failure Mode Identifier) - ELECTRICAL INTERPRETATION:**
     - **FMI 3**: Voltage Above Normal (Short to Power).
     - **FMI 4**: Voltage Below Normal (Short to Ground).
     - **FMI 5**: Current Below Normal (Open Circuit).
     - **FMI 9**: Abnormal Update Rate (CAN Bus).

  4. **CATALOG MATCHING INSTRUCTIONS (ORION PART):**
     - Identify the faulty component and match it to one of these names:
       - "Air Compressor"
       - "Feed Pump"
       - "Fuel Hand Pump"
       - "Fuel Filter"
       - "Oil Pressure Sensor"
       - "Wheel Speed Sensor"
       - "Foot Brake Valve"
       - "EBS Control Modulator"
       - "Circuit Protection Valve" (APM)
       - "NOx Sensor"
       - "Oil Level Sensor"
       - "Cabin Tilting Pump"
       - "Water Pump"
       - "Servo Pump"
       - "Tie Rod"
       - "5V Sensor Supply" (For SID 232)
       - "ECU Unit"
     - Use these EXACT names in the 'partName' field.
`;

// --- MOCK DATA FOR DEMO MODE ---
const getMockDiagnosis = (lang: Language): DiagnosisResult => {
  return {
    system: "Engine Management System (MID 128)",
    description: "SID 232 Detected: 5V Sensor Supply Voltage Fault. This component provides power to critical engine sensors (Boost, Oil Pressure).",
    symptoms: ["Engine stalling", "Multiple sensor codes", "Check Engine Light"],
    causes: ["Short circuit in sensor wiring", "Faulty 5V Regulator inside ECU", "Damaged sensor shorting the 5V line"],
    solutions: ["Disconnect sensors one by one to find the short", "Check ECU Pin for exactly 5.0V", "Inspect engine harness for rubbing"],
    severity: "high",
    partName: "5V Sensor Supply"
  };
};

export const analyzeFaultCode = async (data: FaultCodeData, brand: TruckBrand, model: string | undefined, lang: Language): Promise<DiagnosisResult> => {
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockDiagnosis(lang);
  }

  const codeString = `MID ${data.mid} ${data.pid ? `PID ${data.pid}` : data.sid ? `SID ${data.sid}` : ''} FMI ${data.fmi}`;
  
  let langInstruction = 'Output Language: English.';
  if (lang === 'ar') langInstruction = 'Output Language: ARABIC (اللغة العربية). Translate technical terms accurately but keep Part Names in English for catalog matching.';
  if (lang === 'fr') langInstruction = 'Output Language: FRENCH (Français). Keep Part Names in English for catalog matching.';

  const prompt = `
    ROLE: Tier 3 Master Diagnostic Technician for ${brand} Trucks.
    
    ${RENAULT_STANDARD_CONTEXT}

    INPUT FAULT CODE: ${codeString}
    
    TASK:
    1. **REVEAL COMPONENT**: 
       - Identify the exact component (e.g., if SID 232, component is "5V Sensor Supply").
       - **CRITICAL**: Set 'partName' to the EXACT catalog name from the list above.
    
    2. **DEFINE COMPONENT**:
       - Briefly explain what this component does (e.g., "Supplies regulated power to pressure sensors").
    
    3. **CORRECT THE ERROR**:
       - Provide specific electrical tests based on the FMI (e.g., "Check continuity between Pin A and B", "Verify voltage is 5.0V").

    ${langInstruction}
    
    RETURN JSON FORMAT:
    {
      "system": "System Name (MID)",
      "description": "Definition of the component and the fault.",
      "symptoms": ["Symptom 1", "Symptom 2"],
      "causes": ["Cause 1", "Cause 2"],
      "solutions": ["Correction Step 1", "Correction Step 2"],
      "severity": "low" | "medium" | "high",
      "partName": "Exact Catalog Name"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            system: { type: Type.STRING },
            description: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
            partName: { type: Type.STRING }
          },
          required: ["system", "description", "solutions", "severity", "partName"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as DiagnosisResult;
  } catch (error) {
    console.error("Error analyzing fault code:", error);
    return getMockDiagnosis(lang);
  }
};

export const analyzeImageFault = async (base64Image: string, brand: TruckBrand, model: string | undefined, lang: Language): Promise<DiagnosisResult> => {
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return getMockDiagnosis(lang);
  }

  let langInstruction = 'Output Language: English.';
  if (lang === 'ar') langInstruction = 'Output Language: ARABIC.';
  if (lang === 'fr') langInstruction = 'Output Language: FRENCH.';

  const prompt = `
    ROLE: Master Technician & Spare Parts Specialist.
    ${RENAULT_STANDARD_CONTEXT}
    
    **VALIDATION & ANALYSIS:**
    Analyze the image content. It is considered VALID if it contains:
    1. A Truck Dashboard/Instrument Cluster.
    2. A Diagnostic Tool Screen (Scanner) or text with Fault Codes.
    3. A **TRUCK SPARE PART** (e.g., Compressor, Valve, Sensor, Pump, Filter, Tie Rod).
    
    **IF INVALID (Selfie, Food, Landscape, Animal, Random Object):**
    - Return JSON with 'system': "INVALID_IMAGE_ERROR" and 'description': "REJECTED".
    
    **IF VALID:**
    1. **Identify the Component/Fault**: 
       - If it's a code like "SID 232", identify the component "5V Sensor Supply".
       - If it's a physical part, identify it (e.g., "Air Compressor").
       - Set 'partName' to the EXACT catalog name.
    2. **Map to OrionPart Catalog**:
       - Prioritize Orion Catalog nomenclature.
    3. **Provide Diagnosis**:
       - **Define**: What is this part?
       - **Correct**: How to fix the error?

    ${langInstruction}
    
    Return JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            system: { type: Type.STRING },
            description: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
            partName: { type: Type.STRING }
          },
          required: ["system", "description", "solutions", "severity", "partName"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as DiagnosisResult;

    if (result.system === "INVALID_IMAGE_ERROR" || result.description === "REJECTED") {
       throw new Error("INVALID_IMAGE_CONTENT");
    }

    return result;

  } catch (error: any) {
    console.error("Error analyzing image:", error);
    if (error.message === "INVALID_IMAGE_CONTENT") {
        throw error; 
    }
    return getMockDiagnosis(lang);
  }
};

export const sendChatMessage = async (history: any[], message: string, brand: TruckBrand, model: string | undefined, lang: Language) => {
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "Demo Mode: I cannot chat right now.";
  }

  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: history,
      config: {
        systemInstruction: `You are a Truck Mechanic Assistant. Reference Renault Standard 70 627. Suggest parts from OrionPart catalog.`
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    return "Connection Error.";
  }
};
