export interface Service {
  id: string
  title: string
  description: string
  icon: string
  price: {
    min: number
    max: number
    currency: string
  }
  estimatedTime: string
  category: 'maintenance' | 'repair' | 'cleaning' | 'inspection'
  isPopular: boolean
}

export const services: Service[] = [
  {
    id: 'basic-wash',
    title: 'Basic Car Wash',
    description: 'Exterior wash, wheel cleaning, and basic interior vacuuming',
    icon: '🚗',
    price: {
      min: 15,
      max: 25,
      currency: 'USD'
    },
    estimatedTime: '30-45 minutes',
    category: 'cleaning',
    isPopular: true
  },
  {
    id: 'oil-change',
    title: 'Oil Change',
    description: 'Full synthetic oil change with filter replacement',
    icon: '🛢️',
    price: {
      min: 40,
      max: 80,
      currency: 'USD'
    },
    estimatedTime: '45-60 minutes',
    category: 'maintenance',
    isPopular: true
  },
  {
    id: 'tire-rotation',
    title: 'Tire Rotation',
    description: 'Professional tire rotation and balance',
    icon: '🔄',
    price: {
      min: 20,
      max: 40,
      currency: 'USD'
    },
    estimatedTime: '30-45 minutes',
    category: 'maintenance',
    isPopular: false
  },
  {
    id: 'brake-inspection',
    title: 'Brake Inspection',
    description: 'Complete brake system inspection and report',
    icon: '🛑',
    price: {
      min: 30,
      max: 50,
      currency: 'USD'
    },
    estimatedTime: '30-45 minutes',
    category: 'inspection',
    isPopular: false
  },
  {
    id: 'premium-detail',
    title: 'Premium Detailing',
    description: 'Full interior and exterior detailing with wax',
    icon: '✨',
    price: {
      min: 150,
      max: 250,
      currency: 'USD'
    },
    estimatedTime: '3-4 hours',
    category: 'cleaning',
    isPopular: true
  },
  {
    id: 'battery-check',
    title: 'Battery Check',
    description: 'Battery health check and terminal cleaning',
    icon: '🔋',
    price: {
      min: 20,
      max: 30,
      currency: 'USD'
    },
    estimatedTime: '15-30 minutes',
    category: 'inspection',
    isPopular: false
  }
] 