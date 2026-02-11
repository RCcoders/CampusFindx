export interface Item {
  id: string;
  type: "found" | "lost";
  category: string;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  status: "pending" | "claimed" | "verified" | "returned";
  reward?: number;
  reportedBy: string;
  claims: number;
}

export const stubFoundItems: Item[] = [
  {
    id: "1",
    type: "found",
    category: "Electronics",
    title: "Black iPhone 14",
    description: "Found near Library Block A, screen is locked",
    location: "Library Block A",
    date: "2024-01-15",
    imageUrl: "https://images.unsplash.com/photo-1592286927505-c80d2b4a7f8d?w=400",
    status: "pending",
    reportedBy: "Security Office",
    claims: 2
  },
  {
    id: "2",
    type: "found",
    category: "Accessories",
    title: "Blue Water Bottle",
    description: "Insulated water bottle with stickers, found in cafeteria",
    location: "Main Cafeteria",
    date: "2024-01-16",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    status: "pending",
    reportedBy: "Security Office",
    claims: 0
  },
  {
    id: "3",
    type: "found",
    category: "Documents",
    title: "Student ID Card",
    description: "ID card found near hostel gate (details blurred for privacy)",
    location: "Boys Hostel Gate",
    date: "2024-01-14",
    status: "verified",
    reportedBy: "Security Office",
    claims: 1
  },
  {
    id: "4",
    type: "found",
    category: "Accessories",
    title: "Red Backpack",
    description: "Medium-sized red backpack found in lecture hall",
    location: "Lecture Hall 3",
    date: "2024-01-15",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    status: "pending",
    reportedBy: "Security Office",
    claims: 1
  }
];

export const stubLostItems: Item[] = [
  {
    id: "5",
    type: "lost",
    category: "Electronics",
    title: "Black Laptop Charger",
    description: "HP laptop charger, lost somewhere between library and hostel",
    location: "Library to Hostel area",
    date: "2024-01-15",
    status: "pending",
    reward: 200,
    reportedBy: "Rahul Kumar",
    claims: 0
  },
  {
    id: "6",
    type: "lost",
    category: "Accessories",
    title: "Silver Watch",
    description: "Fastrack silver watch with black dial, lost in sports complex",
    location: "Sports Complex",
    date: "2024-01-13",
    status: "pending",
    reward: 500,
    reportedBy: "Priya Sharma",
    claims: 0
  },
  {
    id: "7",
    type: "lost",
    category: "Documents",
    title: "Wallet with College ID",
    description: "Brown leather wallet containing college ID and some cash",
    location: "Academic Block B",
    date: "2024-01-14",
    status: "pending",
    reward: 300,
    reportedBy: "Amit Patel",
    claims: 0
  }
];

export const allStubItems = [...stubFoundItems, ...stubLostItems];
