import { MapPin, MessageCircle, Star, Utensils } from "lucide-react";

export const featuredSpots = [
    {
      id: "1",
      name: "Mama Sisi Amala Joint",
      location: "Yaba, Lagos",
      rating: 4.8,
      reviews: 245,
      priceRange: "₦800 - ₦1,500",
      specialties: ["Traditional Amala", "Ewedu", "Gbegiri"],
      distance: "0.5km"
    },
    {
      id: "2",
      name: "Amala Palace",
      location: "Ikeja, Lagos",
      rating: 4.5,
      reviews: 180,
      priceRange: "₦700 - ₦1,200",
      specialties: ["Amala", "Ofada Rice", "Pepper Soup"],
      distance: "1.2km"
    },
    {
      id: "3",
      name: "Iya Oyo Amala",
      location: "Surulere, Lagos",
      rating: 4.7,
      reviews: 300,
      priceRange: "₦600 - ₦1,000",
      specialties: ["Amala", "Ewedu", "Gbegiri"],
      distance: "2.0km"
    }
]


export const features = [
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: "Location-Based Search",
      description: "Find amala spots near you or any location in Nigeria"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-secondary" />,
      title: "AI Chat Assistant", 
      description: "Ask in English, Pidgin, or Yoruba - our AI understands"
    },
    {
      icon: <Star className="w-8 h-8 text-accent" />,
      title: "Reviews & Ratings",
      description: "Read authentic reviews from the community"
    },
    {
      icon: <Utensils className="w-8 h-8 text-primary" />,
      title: "Menu & Prices",
      description: "View detailed menus, prices, and specialties"
    }
  ];