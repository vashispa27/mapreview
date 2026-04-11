export interface SitePhoto {
  url: string
  caption: string
}

export interface VideoTestimonial {
  id: string
  name: string
  title?: string
  videoUrl: string
  thumbnailUrl: string
  duration: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  image?: string
  category: string
  featured?: boolean
}

export interface CustomDomainSettings {
  customDomain?: string
  status: "not_configured" | "pending" | "verified" | "failed"
  sslEnabled: boolean
}

export interface ProFeatures {
  videoTestimonials: VideoTestimonial[]
  menuItems: MenuItem[]
  menuCategories: string[]
  customDomain: CustomDomainSettings
  showVideoTestimonials: boolean
  showMenu: boolean
}

export interface BusinessData {
  id: string
  name: string
  category: string
  rating: number
  totalReviews: number
  address: string
  phone: string
  website?: string
  heroImage?: string
  socials?: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
  hours: {
    day: string
    hours: string
  }[]
  photos: SitePhoto[]
  availablePhotos: SitePhoto[]
  reviews: {
    author: string
    avatar?: string
    jtbdHeader?: string
    rating: number
    date: string
    text: string
    photos?: string[]
  }[]
  description: string
  features: string[]
  priceLevel: string
  // Pro Features
  proFeatures?: ProFeatures
}

export interface SiteConfig {
  colorScheme: ColorScheme
  layout: "modern" | "classic" | "minimal" | "elegant" | "bold" | "studio"
  fontStyle: "sans" | "serif" | "rounded"
  animations: boolean
}

export const layoutOptions = [
  {
    id: "modern" as const,
    name: "Modern",
    description: "Clean lines, bold sections",
    icon: "layout-grid",
    isPremium: false,
  },
  {
    id: "classic" as const,
    name: "Classic",
    description: "Traditional, elegant feel",
    icon: "layout-list",
    isPremium: false,
  },
  {
    id: "minimal" as const,
    name: "Minimal",
    description: "Simple, content-focused",
    icon: "layout-template",
    isPremium: false,
  },
  {
    id: "elegant" as const,
    name: "Elegant",
    description: "Luxury, refined aesthetic",
    icon: "sparkles",
    isPremium: true,
  },
  {
    id: "bold" as const,
    name: "Bold",
    description: "Dynamic, eye-catching design",
    icon: "zap",
    isPremium: true,
  },
  {
    id: "studio" as const,
    name: "Studio",
    description: "Creative, portfolio style",
    icon: "palette",
    isPremium: true,
  },
]

export const fontOptions = [
  {
    id: "sans" as const,
    name: "Clean Sans",
    description: "Modern & professional",
    preview: "font-sans",
  },
  {
    id: "serif" as const,
    name: "Elegant Serif",
    description: "Classic & refined",
    preview: "font-serif",
  },
  {
    id: "rounded" as const,
    name: "Friendly Rounded",
    description: "Warm & approachable",
    preview: "font-sans",
  },
]

export interface ColorScheme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  muted: string
}

export const colorSchemes: ColorScheme[] = [
  {
    id: "forest",
    name: "Forest Green",
    primary: "#2d6a4f",
    secondary: "#40916c",
    accent: "#95d5b2",
    background: "#f8faf9",
    text: "#1b4332",
    muted: "#74796e",
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    primary: "#0077b6",
    secondary: "#00b4d8",
    accent: "#90e0ef",
    background: "#f8fcff",
    text: "#03045e",
    muted: "#6b7280",
  },
  {
    id: "sunset",
    name: "Warm Sunset",
    primary: "#e63946",
    secondary: "#f4a261",
    accent: "#e9c46a",
    background: "#fffbf5",
    text: "#1d3557",
    muted: "#6b7280",
  },
  {
    id: "lavender",
    name: "Soft Lavender",
    primary: "#7c3aed",
    secondary: "#a78bfa",
    accent: "#c4b5fd",
    background: "#faf8ff",
    text: "#1e1b4b",
    muted: "#6b7280",
  },
  {
    id: "coral",
    name: "Coral Pink",
    primary: "#f472b6",
    secondary: "#fb7185",
    accent: "#fda4af",
    background: "#fff5f7",
    text: "#831843",
    muted: "#6b7280",
  },
  {
    id: "midnight",
    name: "Midnight Dark",
    primary: "#6366f1",
    secondary: "#818cf8",
    accent: "#a5b4fc",
    background: "#0f172a",
    text: "#f1f5f9",
    muted: "#94a3b8",
  },
]

export function generateMockBusinessData(url: string): BusinessData {
  // Generate a consistent ID from the URL
  const id = btoa(url).slice(0, 12).replace(/[^a-zA-Z0-9]/g, "x")

  // Mock data for demonstration
  return {
    id,
    name: "The Golden Spoon Bistro",
    category: "Italian Restaurant",
    rating: 4.7,
    totalReviews: 342,
    address: "123 Main Street, Downtown, CA 90210",
    phone: "(555) 123-4567",
    website: "https://example.com/fresh-bites",
    socials: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com"
    },
    heroImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80",
    hours: [
      { day: "Monday - Friday", hours: "11:00 AM - 10:00 PM" },
      { day: "Tuesday", hours: "11:00 AM - 10:00 PM" },
      { day: "Wednesday", hours: "11:00 AM - 10:00 PM" },
      { day: "Thursday", hours: "11:00 AM - 11:00 PM" },
      { day: "Friday", hours: "11:00 AM - 11:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 11:00 PM" },
      { day: "Sunday", hours: "10:00 AM - 9:00 PM" },
    ],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
        caption: "Restaurant Interior",
      },
      {
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        caption: "Signature Pasta Dish",
      },
      {
        url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
        caption: "Outdoor Seating Area",
      },
      {
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        caption: "Wood-fired Pizza",
      },
      {
        url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
        caption: "Chef in Action",
      },
      {
        url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
        caption: "Dessert Selection",
      },
    ],
    availablePhotos: [],
    reviews: [
      {
        author: "Sarah M.",
        avatar: "https://i.pravatar.cc/100?u=sarah",
        rating: 5,
        date: "2 weeks ago",
        text: "Absolutely incredible dining experience! The homemade pasta was cooked to perfection, and the truffle risotto was out of this world. The staff was attentive without being intrusive. Will definitely be coming back!",
      },
      {
        author: "Michael R.",
        avatar: "https://i.pravatar.cc/100?u=michael",
        rating: 5,
        date: "1 month ago",
        text: "Best Italian food in the city, hands down. The wood-fired pizzas have that authentic crispy crust, and the tiramisu is a must-try. Great wine selection too!",
      },
      {
        author: "Emily K.",
        avatar: "https://i.pravatar.cc/100?u=emily",
        rating: 4,
        date: "1 month ago",
        text: "Lovely atmosphere and delicious food. The only reason for 4 stars is the wait time on a Friday night, but honestly the food made it worth it. The carbonara was divine!",
      },
      {
        author: "David L.",
        avatar: "https://i.pravatar.cc/100?u=david",
        rating: 5,
        date: "2 months ago",
        text: "Celebrated our anniversary here and it was perfect. The staff even brought out a complimentary dessert with a candle. The osso buco melted in my mouth. Highly recommend!",
      },
      {
        author: "Jennifer T.",
        avatar: "https://i.pravatar.cc/100?u=jennifer",
        rating: 5,
        date: "2 months ago",
        text: "As someone who lived in Italy for 3 years, I can say this is the real deal. Authentic flavors, fresh ingredients, and genuine hospitality. A gem!",
      },
    ],
    description:
      "The Golden Spoon Bistro brings authentic Italian cuisine to the heart of downtown. Our chef, trained in Naples, uses only the freshest ingredients and traditional techniques passed down through generations. From our hand-rolled pasta to our wood-fired pizzas, every dish tells a story of passion and craftsmanship.",
    features: [
      "Outdoor Seating",
      "Full Bar",
      "Private Dining",
      "Takeout Available",
      "Vegetarian Options",
      "Gluten-Free Menu",
      "Free WiFi",
      "Wheelchair Accessible",
    ],
    priceLevel: "$$",
    // Pro Features - Mock Data for Testing
    proFeatures: {
      showVideoTestimonials: true,
      showMenu: true,
      videoTestimonials: [
        {
          id: "vt1",
          name: "Maria Santos",
          title: "Regular Customer",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnailUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
          duration: "0:45",
        },
        {
          id: "vt2",
          name: "James Wilson",
          title: "Food Blogger",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
          duration: "1:20",
        },
        {
          id: "vt3",
          name: "Sophie Chen",
          title: "Local Influencer",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnailUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
          duration: "0:58",
        },
      ],
      menuCategories: ["Appetizers", "Main Course", "Pasta", "Desserts", "Beverages"],
      menuItems: [
        {
          id: "m1",
          name: "Bruschetta Classica",
          description: "Toasted bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil",
          price: "$12",
          image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80",
          category: "Appetizers",
          featured: true,
        },
        {
          id: "m2",
          name: "Truffle Risotto",
          description: "Creamy Arborio rice with black truffle shavings and aged Parmesan",
          price: "$28",
          image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
          category: "Main Course",
          featured: true,
        },
        {
          id: "m3",
          name: "Spaghetti Carbonara",
          description: "Classic Roman pasta with guanciale, egg yolk, Pecorino Romano, and black pepper",
          price: "$22",
          image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
          category: "Pasta",
          featured: false,
        },
        {
          id: "m4",
          name: "Osso Buco",
          description: "Braised veal shanks with vegetables, white wine, and gremolata",
          price: "$38",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
          category: "Main Course",
          featured: true,
        },
        {
          id: "m5",
          name: "Tiramisu",
          description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream",
          price: "$14",
          image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
          category: "Desserts",
          featured: true,
        },
        {
          id: "m6",
          name: "Panna Cotta",
          description: "Silky vanilla cream with mixed berry compote",
          price: "$12",
          image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
          category: "Desserts",
          featured: false,
        },
      ],
      customDomain: {
        customDomain: "goldenspoobistro.com",
        status: "pending",
        sslEnabled: true,
      },
    },
  }
}
