export interface SamplePreset {
  title: string;
  category: "Gaming Setup" | "Minimalist" | "Study Setup" | "Office Setup" | "Creative Workspace";
  setupType: string;
  imageUrl: string;
  description: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    title: "Nordic Minimalist Oak Studio",
    category: "Minimalist",
    setupType: "Standing Desk & Ultrawide",
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    description: "Solid oak custom motorized standing desk, 38-inch curved LG Ultrawide, Keychron Q1 Pro custom mechanical keyboard with brass plate, audioengine A2+ speakers, and hidden cable management spine.",
  },
  {
    title: "Cyber Cyberpunk Cyberstation",
    category: "Gaming Setup",
    setupType: "Triple OLED Monitor Setup",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description: "Custom water-cooled RTX 4090 rig in Lian Li O11 Dynamic EVO, triple 27-inch 240Hz monitors, dynamic Govee reactive backlighting, steelseries apex pro keyboard, and Herman Miller Embody chair.",
  },
  {
    title: "Deep Focus Architectural Study",
    category: "Study Setup",
    setupType: "Dual Vertical/Horizontal Setup",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    description: "Architectural research workspace with dual Dell UltraSharp 4K screens, BenQ ScreenBar Halo, analog drafting notes section, warm diffused ambient lighting, and walnut acoustic slat wall paneling.",
  },
  {
    title: "Executive Modern Suite",
    category: "Office Setup",
    setupType: "Clean Cable-Free Productivity",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    description: "Mac Studio M2 Ultra workstation paired with Apple Studio Display, MagSafe desktop charging groove, leather desk mat, and discreet underneath tray routing all power cables.",
  },
  {
    title: "Audio Engineer & Producer Loft",
    category: "Creative Workspace",
    setupType: "Dual Nearfield Studio Monitors",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    description: "Creative music production environment featuring Yamaha HS8 active studio monitors on decoupled iso-stands, Universal Audio Apollo x6 interface, Arturia Keystep Pro, and calibrated room acoustic treatment.",
  },
  {
    title: "Matte Black Developer Monolith",
    category: "Minimalist",
    setupType: "Single 49\" Super Ultrawide",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    description: "Samsung Odyssey OLED G9 49-inch curved monitor mounted on Ergotron heavy duty arm, HHKB Pro 2 silent keyboard, Logitech MX Master 3S, and stealth matte black finish.",
  },
];

