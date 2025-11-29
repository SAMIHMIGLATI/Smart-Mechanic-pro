
import React, { useState, useEffect } from 'react';
import { DiagnosisResult } from '../types';
import { AlertTriangle, Activity, CheckCircle2, AlertOctagon, Cpu, FileText, ListChecks, ShoppingCart, Tag, Phone, Wrench } from 'lucide-react';

interface DiagnosisResultProps {
  result: DiagnosisResult | null;
}

// --- ORION PART CATALOG DATABASE (Extracted from PDF) ---
interface CatalogPart {
  partNumber: string;
  name: string;
  oemRefs: string[];
  model: string;
  category: string; // Used for fuzzy matching logic
  imageUrl: string;
}

// Data extracted from OrionPart Renault Catalog PDF
// Images are high-quality representatives matching the part type
const ORION_CATALOG: CatalogPart[] = [
  // --- AIR COMPRESSORS (Pages 5-15) ---
  {
    partNumber: "301250",
    name: "AIR COMPRESSOR",
    oemRefs: ["7421353473", "9125140040"],
    model: "RENAULT",
    category: "compressor",
    imageUrl: "https://images.unsplash.com/photo-1635773054098-333c1b3c7b8e?auto=format&fit=crop&q=80&w=600"
  },
  {
    partNumber: "301252",
    name: "AIR COMPRESSOR (MAGNUM)",
    oemRefs: ["5000678923", "5000693172"],
    model: "RENAULT MAGNUM",
    category: "compressor",
    imageUrl: "https://images.unsplash.com/photo-1635773054098-333c1b3c7b8e?auto=format&fit=crop&q=80&w=600"
  },
  {
    partNumber: "301264",
    name: "AIR COMPRESSOR (PREMIUM)",
    oemRefs: ["4123520040", "7421353457"],
    model: "RENAULT PREMIUM",
    category: "compressor",
    imageUrl: "https://images.unsplash.com/photo-1635773054098-333c1b3c7b8e?auto=format&fit=crop&q=80&w=600"
  },
  // --- FUEL SYSTEM (Pages 83-89) ---
  {
    partNumber: "301031",
    name: "FEED PUMP",
    oemRefs: ["5001821529", "0440008108"],
    model: "RENAULT PREMIUM",
    category: "feed_pump",
    imageUrl: "https://images.unsplash.com/photo-1635773053677-62bd1343e743?auto=format&fit=crop&q=80&w=600"
  },
  {
    partNumber: "303295",
    name: "FUEL FILTER",
    oemRefs: ["0870017560", "7701017732"],
    model: "RENAULT",
    category: "fuel_filter",
    imageUrl: "https://images.unsplash.com/photo-1633856269347-5800e3974008?q=80&w=600"
  },
  {
    partNumber: "301973",
    name: "FUEL HAND PUMP",
    oemRefs: ["5001832885"],
    model: "RENAULT",
    category: "hand_pump",
    imageUrl: "https://images.unsplash.com/photo-1635773053677-62bd1343e743?auto=format&fit=crop&q=80&w=600"
  },
  // --- VALVES & BRAKES (Pages 39-74) ---
  {
    partNumber: "303070",
    name: "FOOT BRAKE VALVE",
    oemRefs: ["5021170165", "MB4630"],
    model: "RENAULT",
    category: "brake_valve",
    imageUrl: "https://images.unsplash.com/photo-1615828799497-6a4a6006e00f?auto=format&fit=crop&q=80&w=600"
  },
  {
    partNumber: "303216",
    name: "EBS CONTROL MODULATOR",
    oemRefs: ["5010457557", "0486203030N50"],
    model: "RENAULT",
    category: "modulator",
    imageUrl: "https://images.unsplash.com/photo-1615828799497-6a4a6006e00f?auto=format&fit=crop&q=80&w=600"
  },
  {
    partNumber: "301476",
    name: "CIRCUIT PROTECTION VALVE (APM)",
    oemRefs: ["5010216965", "AE4440"],
    model: "RENAULT",
    category: "apm",
    imageUrl: "https://images.unsplash.com/photo-1555617984-7a39d7506664?auto=format&fit=crop&q=80&w=600"
  },
  {
    partNumber: "303276",
    name: "BRAKE CYLINDER",
    oemRefs: ["7421149777"],
    model: "RENAULT",
    category: "brake_cylinder",
    imageUrl: "https://images.unsplash.com/photo-1615828799497-6a4a6006e00f?auto=format&fit=crop&q=80&w=600"
  },
  // --- SENSORS & ELECTRICAL (Pages 107-111) ---
  {
    partNumber: "302018",
    name: "OIL PRESSURE SENSOR",
    oemRefs: ["7420514065", "7420803650"],
    model: "RENAULT",
    category: "oil_sensor",
    imageUrl: "https://plus.unsplash.com/premium_photo-1663045618239-2a912e783709?q=80&w=600"
  },
  {
    partNumber: "301441",
    name: "WHEEL SPEED SENSOR",
    oemRefs: ["5010422332", "5430041687"],
    model: "RENAULT",
    category: "speed_sensor",
    imageUrl: "https://images.unsplash.com/photo-1535443763820-23df21c454c5?q=80&w=600"
  },
  {
    partNumber: "301850",
    name: "NOX SENSOR",
    oemRefs: ["7422827993", "5WK97371"],
    model: "RENAULT",
    category: "nox",
    imageUrl: "https://images.unsplash.com/photo-1555617984-7a39d7506664?auto=format&fit=crop&q=80&w=600"
  },
  {
    partNumber: "302016",
    name: "OIL LEVEL SENSOR",
    oemRefs: ["7421521353", "7422022794"],
    model: "RENAULT",
    category: "level_sensor",
    imageUrl: "https://plus.unsplash.com/premium_photo-1663045618239-2a912e783709?q=80&w=600"
  },
  {
    partNumber: "302015",
    name: "ACCELERATOR PEDAL SENSOR",
    oemRefs: ["7421059642", "7482492421"],
    model: "RENAULT",
    category: "pedal_sensor",
    imageUrl: "https://plus.unsplash.com/premium_photo-1663045618239-2a912e783709?q=80&w=600"
  },
  {
    partNumber: "SID232",
    name: "5V SENSOR SUPPLY (ECU)",
    oemRefs: ["7421648908", "SID 232"],
    model: "RENAULT TRUCKS",
    category: "5v_supply",
    imageUrl: "https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?q=80&w=600"
  },
  // --- CABIN & BODY (Pages 47-51) ---
  {
    partNumber: "301191",
    name: "CABIN TILTING PUMP",
    oemRefs: ["5010316436"],
    model: "RENAULT",
    category: "tilt_pump",
    imageUrl: "https://images.unsplash.com/photo-1603418480826-7821a403b6b8?q=80&w=600"
  },
  {
    partNumber: "301194",
    name: "CABIN TILTING CYLINDER",
    oemRefs: ["5010629264"],
    model: "RENAULT MAGNUM",
    category: "tilt_cylinder",
    imageUrl: "https://images.unsplash.com/photo-1516937941348-c03e586103da?q=80&w=600"
  },
  // --- COOLING (Pages 157-159) ---
  {
    partNumber: "301080",
    name: "WATER PUMP",
    oemRefs: ["5010330029", "5001837309"],
    model: "RENAULT PREMIUM",
    category: "water_pump",
    imageUrl: "https://images.unsplash.com/photo-1616540310566-c644b1508e6d?q=80&w=600"
  },
  {
    partNumber: "301390",
    name: "WATER EXPANSION TANK",
    oemRefs: ["7401676400", "7401676576"],
    model: "RENAULT",
    category: "expansion_tank",
    imageUrl: "https://images.unsplash.com/photo-1579633659223-c4b699c27732?auto=format&fit=crop&q=80&w=600"
  },
  // --- STEERING & SUSPENSION (Pages 135-145) ---
  {
    partNumber: "301040",
    name: "SERVO PUMP",
    oemRefs: ["5010600054", "5001865396"],
    model: "RENAULT PREMIUM 400",
    category: "servo_pump",
    imageUrl: "https://images.unsplash.com/photo-1635773053677-62bd1343e743?auto=format&fit=crop&q=80&w=600"
  },
  {
    partNumber: "301236",
    name: "TIE ROD",
    oemRefs: ["5000761671", "5010104288"],
    model: "RENAULT",
    category: "tie_rod",
    imageUrl: "https://images.unsplash.com/photo-1530062825238-99307738a2cb?q=80&w=600"
  },
  {
    partNumber: "302398",
    name: "TIE ROD",
    oemRefs: ["7421051046"],
    model: "RENAULT",
    category: "tie_rod",
    imageUrl: "https://images.unsplash.com/photo-1530062825238-99307738a2cb?q=80&w=600"
  },
  {
    partNumber: "302066",
    name: "CABLE HARNESS",
    oemRefs: ["7421068284", "4213659462"],
    model: "RENAULT PREMIUM",
    category: "harness",
    imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600"
  },
  {
    partNumber: "302096",
    name: "CALIPER BRAKE ADJUSTING DUST COVER",
    oemRefs: ["5001868119", "0501316391"],
    model: "RENAULT",
    category: "caliper_kit",
    imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600"
  }
];

const getOrionPart = (searchTerm: string | undefined): CatalogPart | null => {
  if (!searchTerm) return null;
  const term = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, ''); // Normalize string

  // Helper to match strings
  const matches = (target: string) => {
    const t = target.toLowerCase().replace(/[^a-z0-9]/g, '');
    return t.includes(term) || term.includes(t);
  };

  // Search logic with prioritization
  const part = ORION_CATALOG.find(p => {
    // 1. Check Category Code
    if (matches(p.category)) return true;
    
    // 2. Check Part Name
    if (matches(p.name)) return true;

    // 3. Intelligent Keyword Mapping for Specific Codes
    if ((term.includes('sid') && term.includes('232')) || (term.includes('5v') && term.includes('supply'))) {
        if (p.category === '5v_supply') return true;
    }

    // 4. General Keywords
    if (term.includes('oil') && term.includes('pressure') && p.category === 'oil_sensor') return true;
    if (term.includes('speed') && term.includes('sensor') && p.category === 'speed_sensor') return true;
    if (term.includes('nox') && p.category === 'nox') return true;
    if (term.includes('compressor') && p.category === 'compressor') return true;
    if (term.includes('brake') && term.includes('valve') && p.category === 'brake_valve') return true;
    if (term.includes('modulator') && p.category === 'modulator') return true;
    if (term.includes('apm') && p.category === 'apm') return true;
    if (term.includes('feed') && p.category === 'feed_pump') return true;
    if (term.includes('fuel') && term.includes('pump') && p.category === 'feed_pump') return true;
    if (term.includes('water') && term.includes('pump') && p.category === 'water_pump') return true;
    if (term.includes('expansion') && p.category === 'expansion_tank') return true;
    if (term.includes('tilt') && term.includes('pump') && p.category === 'tilt_pump') return true;
    if (term.includes('servo') && p.category === 'servo_pump') return true;
    if (term.includes('rod') && p.category === 'tie_rod') return true;
    if (term.includes('filter') && term.includes('fuel') && p.category === 'fuel_filter') return true;
    if (term.includes('harness') && p.category === 'harness') return true;

    return false;
  });

  return part || null;
};

const DiagnosisResultCard: React.FC<DiagnosisResultProps> = ({ result }) => {
  const [catalogPart, setCatalogPart] = useState<CatalogPart | null>(null);
  
  useEffect(() => {
    if (result && result.partName) {
      const part = getOrionPart(result.partName);
      setCatalogPart(part);
    } else {
      setCatalogPart(null);
    }
  }, [result]);

  if (!result) return null;

  const severityConfig = {
    low: {
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
      label: 'خطورة منخفضة'
    },
    medium: {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
      label: 'خطورة متوسطة'
    },
    high: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertOctagon className="w-8 h-8 text-red-500" />,
      label: 'خطورة عالية'
    }
  };

  const config = severityConfig[result.severity];

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Main Status Card */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-zinc-100">
        <div className={`p-1 h-2 w-full ${result.severity === 'high' ? 'bg-red-500' : result.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4" />
                {result.system}
              </div>
              <div className="prose prose-lg text-zinc-600 leading-relaxed font-medium">
                <p>{result.description}</p>
              </div>
            </div>
            
            <div className={`flex flex-col items-center justify-center p-6 rounded-xl ${config.bg} border ${config.border} min-w-[160px] shrink-0`}>
              {config.icon}
              <span className={`mt-2 font-bold ${config.color}`}>{config.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENT DETECTED / CATALOG CARD */}
      <div className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-800 flex flex-col md:flex-row group relative">
          <div className="absolute top-0 right-0 bg-[#0099cc] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 uppercase tracking-wider">
            OrionPart Catalog
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-center relative z-10">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
                <Wrench className="w-4 h-4" />
                {catalogPart ? "Component Identified (Orion)" : "Component Detected"}
            </div>
            
            {catalogPart ? (
              <>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-1 leading-tight tracking-tight">
                  {catalogPart.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                   <Tag className="w-4 h-4 text-zinc-500" />
                   <span className="text-xl font-mono text-[#0099cc] font-bold">{catalogPart.partNumber}</span>
                </div>
                
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 mb-4">
                   <p className="text-zinc-500 text-xs uppercase font-bold mb-2">Reference Numbers (OEM)</p>
                   <div className="flex flex-wrap gap-2">
                      {catalogPart.oemRefs.map((ref, i) => (
                        <span key={i} className="text-zinc-300 font-mono text-sm bg-zinc-950 px-2 py-1 rounded border border-zinc-700">
                          {ref}
                        </span>
                      ))}
                   </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                   <p className="text-zinc-400 text-xs">Fits: <span className="text-white font-bold">{catalogPart.model}</span></p>
                   <button className="bg-[#0099cc] hover:bg-[#0088bb] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-colors">
                     <Phone className="w-3 h-3" />
                     Order Now
                   </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                  {result.partName || 'Unknown Component'}
                </h3>
                <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                  Component identification based on Standard 70 627 diagnosis.
                </p>
                <div className="p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
                  <p className="text-zinc-400 text-xs">Physical inspection recommended.</p>
                </div>
              </>
            )}
          </div>
          
          <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-white p-6 flex items-center justify-center">
            <img 
              src={catalogPart ? catalogPart.imageUrl : "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600"}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600";
              }}
              alt={catalogPart ? catalogPart.name : 'Part Image'} 
              className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
            />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Causes & Symptoms */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-zinc-100 h-full">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
              <Activity className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-lg text-zinc-800">الأسباب (Possible Causes)</h3>
            </div>
            <ul className="space-y-4">
              {result.causes.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-zinc-700 font-medium">{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-zinc-100 h-full">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
              <FileText className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-lg text-zinc-800">الأعراض الظاهرة</h3>
            </div>
            <ul className="space-y-3">
              {result.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 shrink-0"></span>
                  <span className="text-zinc-700">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Solutions Timeline & Correction */}
        <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
            <ListChecks className="w-6 h-6 text-green-400" />
            <h3 className="font-bold text-xl">خطوات الإصلاح (Correction)</h3>
          </div>
          
          <div className="space-y-0 relative pl-4 flex-1">
            <div className="absolute right-0 top-2 bottom-4 w-0.5 bg-zinc-700 md:right-4"></div>

            {result.solutions.map((solution, idx) => (
              <div key={idx} className="relative flex items-start gap-6 mb-8 last:mb-0 group">
                <div className="flex-1 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50 hover:bg-zinc-800 transition-colors">
                  <p className="text-zinc-300 leading-relaxed font-mono text-sm">{solution}</p>
                </div>
                <div className="absolute -right-1.5 md:right-[11px] top-4 w-4 h-4 rounded-full bg-zinc-900 border-4 border-green-500 z-10"></div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-zinc-800">
            <div className="flex items-start gap-3 text-xs text-zinc-400 bg-zinc-950 p-3 rounded">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <p>Warning: Always use a digital multimeter for electrical tests. Values are factory reference.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResultCard;
