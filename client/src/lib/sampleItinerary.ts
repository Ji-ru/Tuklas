import type { Itinerary } from '../types/itinerary';

export const sampleItinerary: Itinerary = {
  title: 'El Nido & Coron Premium Island-Hopping',
  duration: '3 Days, 2 Nights',
  days: [
    {
      dayNumber: 1,
      dayTitle: 'Coron Island Wonders',
      routingRationale: 'Morning arrival in Coron maximizes daylight hours for active snorkeling before afternoon sea breezes pick up.',
      estimatedCost: '₱4,200 PHP per person',
      transitDetails: {
        mode: 'flight',
        departureTime: '07:30 AM',
        arrivalTime: '08:40 AM',
        duration: '1h 10m'
      },
      activities: [
        {
          id: 1,
          type: 'Arrival',
          time: '08:40 AM',
          title: 'Busuanga Airport (Coron) Welcome',
          description: 'Land at Francisco B. Reyes Airport. Shared air-conditioned van transfer to Coron Town proper.',
          image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop',
          lat: 12.1221,
          lng: 120.1009
        },
        {
          id: 2,
          type: 'Activity',
          time: '10:00 AM',
          title: 'Kayangan Lake Tour',
          description: 'Hike up to the iconic Coron viewpoint, then plunge into the crystal-clear brackish waters of the cleanest lake in Asia.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
          lat: 11.9610,
          lng: 120.2235
        },
        {
          id: 3,
          type: 'Dining',
          time: '12:30 PM',
          title: 'Banul Beach Boodle Fight',
          description: 'Enjoy a traditional Filipino boodle fight lunch featuring grilled crab, pork belly, seaweed, and fresh mangoes right on the white sand.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
          lat: 11.9540,
          lng: 120.2110
        },
        {
          id: 4,
          type: 'Check-in',
          time: '03:30 PM',
          title: 'Funny Lion Resort Check-in',
          description: 'Unwind at a boutique resort. Relax by the pool or enjoy the rooftop jacuzzi overlooking the Coron bay.',
          image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
          lat: 12.0035,
          lng: 120.2081
        }
      ]
    },
    {
      dayNumber: 2,
      dayTitle: 'High-Speed Transit to El Nido',
      routingRationale: 'The 6:00 AM fast ferry avoids the rough afternoon swells of the Linapacan Strait.',
      estimatedCost: '₱3,800 PHP per person',
      transitDetails: {
        mode: 'ferry',
        departureTime: '06:00 AM',
        arrivalTime: '11:00 AM',
        duration: '5h 00m'
      },
      activities: [
        {
          id: 5,
          type: 'Transport',
          time: '05:30 AM',
          title: 'Coron Port Departure',
          description: 'Board the Montenegro Lines or Phimal Fast Ferry. Snag a window seat inside the air-conditioned cabin.',
          image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000&auto=format&fit=crop',
          lat: 12.0012,
          lng: 120.2025
        },
        {
          id: 6,
          type: 'Dining',
          time: '12:00 PM',
          title: 'Altrove Woodfired Pizza, El Nido',
          description: 'Arrive at El Nido Port and walk to the famous Altrove for their signature fresh woodfired pizzas.',
          image: 'https://images.unsplash.com/photo-1544030386-4e503b41d08e?q=80&w=1000&auto=format&fit=crop',
          lat: 11.1812,
          lng: 119.3905
        },
        {
          id: 7,
          type: 'Check-in',
          time: '02:00 PM',
          title: 'El Nido Resorts Miniloc Island Check-in',
          description: 'Take a resort pump-boat to Miniloc Island. Check into your overwater cottage nestled inside a dramatic limestone cove.',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
          lat: 11.1565,
          lng: 119.3195
        }
      ]
    },
    {
      dayNumber: 3,
      dayTitle: 'Premium Lagoons of Bacuit Bay',
      routingRationale: 'An early 8:00 AM departure beats the main tourist boat fleets arriving at 10:00 AM.',
      estimatedCost: '₱2,800 PHP per person',
      transitDetails: {
        mode: 'tricycle',
        departureTime: '08:00 AM',
        arrivalTime: '08:15 AM',
        duration: '15m'
      },
      activities: [
        {
          id: 8,
          type: 'Activity',
          time: '08:30 AM',
          title: 'Big Lagoon Kayaking',
          description: 'Quietly paddle through the towering karst walls of the Big Lagoon before the day trip tours crowd the waters.',
          image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1000&auto=format&fit=crop',
          lat: 11.1578,
          lng: 119.3168
        },
        {
          id: 9,
          type: 'Activity',
          time: '11:00 AM',
          title: 'Secret Beach Swim-Through',
          description: 'Swim through a tiny limestone keyhole opening to reveal a hidden white sand beach and pool completely enclosed by cliffs.',
          image: 'https://images.unsplash.com/photo-1432406186267-3c569027f543?q=80&w=1000&auto=format&fit=crop',
          lat: 11.1895,
          lng: 119.2882
        },
        {
          id: 10,
          type: 'Dining',
          time: '01:00 PM',
          title: 'Entalula Island Grill',
          description: 'A private beach picnic under the coconut trees. Feast on freshly grilled fish, shrimp, and chicken prepared right on the boat.',
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1000&auto=format&fit=crop',
          lat: 11.1601,
          lng: 119.3392
        }
      ]
    }
  ]
};
