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


export const searchResults = [
    {
      id: "1",
      name: "Mama Sisi Amala Joint",
      address: "15 Herbert Macaulay Way, Yaba, Lagos",
      distance: "0.5km",
      rating: 4.8,
      reviewCount: 245,
      priceRange: "₦800 - ₦1,500",
      isOpen: true,
      specialties: ["Traditional Amala", "Ewedu", "Gbegiri", "Assorted Meat"],
      phone: "+234 802 123 4567"
    },
    {
      id: "2",
      name: "Iya Basira Spot",
      address: "23 Allen Avenue, Ikeja, Lagos",
      distance: "1.2km", 
      rating: 4.6,
      reviewCount: 189,
      priceRange: "₦600 - ₦1,200",
      isOpen: true,
      specialties: ["Amala Dudu", "Assorted", "Fresh Fish", "Special Stew"],
      phone: "+234 803 987 6543"
    },
    {
      id: "3",
      name: "Buka Express",
      address: "12 Adeola Odeku Street, Victoria Island, Lagos",
      distance: "2.1km",
      rating: 4.4,
      reviewCount: 156,
      priceRange: "₦1,000 - ₦2,000",
      isOpen: false,
      specialties: ["Premium Amala", "Special Stew", "Peppered Meat"],
      phone: "+234 804 555 1234"
    },
    {
      id: "4",
      name: "Alhaja Ramota Kitchen",
      address: "45 Ikorodu Road, Fadeyi, Lagos",
      distance: "3.5km",
      rating: 4.9,
      reviewCount: 312,
      priceRange: "₦700 - ₦1,300",
      isOpen: true,
      specialties: ["Authentic Amala", "Homemade Ewedu", "Fresh Pepper Soup"],
      phone: "+234 805 222 3333"
    },
    {
      id: "5",
      name: "Uncle Jide's Place",
      address: "8 Adeniyi Jones Avenue, Ikeja, Lagos",
      distance: "4.0km",
      rating: 4.3,
      reviewCount: 98,
      priceRange: "₦500 - ₦1,000",
      isOpen: true,
      specialties: ["Budget Amala", "Student Special", "Quick Service"],
      phone: "+234 806 111 2222"
    }
  ];