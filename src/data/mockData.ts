import { Product, Category, Order, Address } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbhO237OOVXeSHfMgurZU6cxr7F0VeOFnRfKqncfCDgkYy2EZuFif59Fn7mQZRJ6W5WLxqub0wrqWVnJq3WMI3BVOt18pwmDL2urAjku4fLZAnyeroFv3UffzS61IdB4rLYVLIbzmwC8BcTZgPzHNBVk6bPw_SkJ5JqoxpMO9LAbE8IZK_Nknm7qEzTktjqD0tSmGpfND1vEe6P_nZdXbaxg8QQiHQzwHufSMSsYkC0gevfQ1MbGaH-Q',
    description: 'Ethnic wear, western apparel, festive kurtas & footwear',
    itemCount: 1420,
  },
  {
    id: 'cat-mobiles',
    name: 'Mobiles & Tech',
    slug: 'mobiles',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaQu92SdLJKYmstYIy-KLicS04t2rL7HYz-exQ1dhtXbAjoE50ORDVXNd6TJa0CKihjRxSRO00_uxHHSEUmeUA4m5LAXiRFKQfh3mAnWklpLi5vsmiGou04wuQjd2kH0tE1bBeFNw1-KRDj_mt0fdl8f-y9j02Q_fWYx9a6VTjKcE-gnpLy1hKUshKTTIMZrfTO4FW3Fj9KLV7zgS0N-JqVsDWZcRbu0ZIn5dfts4cxqOfZd7B94S7cQ',
    description: '5G Smartphones, smartwatches, true wireless earbuds & accessories',
    itemCount: 890,
  },
  {
    id: 'cat-home',
    name: 'Home & Living',
    slug: 'home',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe7cRTHUb-wtrvkKjm3cY5idjynnVBc5w8VRCFjXzlan_GmH8-ayU-miHRbCh8pK1Kri3u4tqQdAodz-GduOBNGnIjMegt9mhB_iUBaIg88FJaHRgY3VH7x7HnoQpgdiBcIh377cxezZ3MSiphdOGvlwHsBKPH8L88p45jb0knmAw2YG-fyaZiBZxqfLSI-WgO_wAGHj-mvO0P2grT1_rCzI06lB2YNl3l94IZtPP6Y0n-PKxqZ5W8Yw',
    description: 'Cookware, decor, bedsheets, air fryers & organizers',
    itemCount: 650,
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Care',
    slug: 'beauty',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgxJ4vl3AY8RI9R13c8t8jKSMyYyLk-8TfDvCXBqg-tzVRvaePtnEfBePZ0mOgV03iNonGImLzYaCRVqkil5tdnpJbzLpe6JLwDOUx1gU5DY5aJgaFyAaCSCkeaz-jEyJRJgPNk-uh3N7GKU-B0J40RZx30BwYrtTj3HdOMpY6qcj-ZwjOrfU39ua8N5coVBjVjZCDdvmoUuNa8rAsexzJlmqAauI1M06_-t-yiy11xCS2NKYJ8DP7_w',
    description: 'Skincare serums, luxury perfumes, haircare & cosmetics',
    itemCount: 520,
  },
  {
    id: 'cat-grocery',
    name: 'Grocery & Food',
    slug: 'grocery',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB01wG6wSmBQPppKgkn427WxMe0kGBlNAaquyD6HIhU4_fk8OOvRlY9CXj-iWKu2Xxq6w6hIMMofhNafYuAxUGoL9fhW9wZ9YucrCXKHx3Bj1r6d197mYBNYpoTlbTVZPur8OSGywG_qsKlUQibcSEcrtgGsSv0bv3rsVskuXgh5kWH_QwKdgjxSFahouACITv0L9G7hK1B74ilsQn0d0Y4jB-daOULKB6O8ZnPfOpUCwQxBQSiezuQNg',
    description: 'Basmati rice, organic spices, dry fruits & cold-pressed oils',
    itemCount: 980,
  },
  {
    id: 'cat-electronics',
    name: 'Electronics & Audio',
    slug: 'electronics',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCue4FXTay5bdlvRu0P_C8jxcJBE2U4tBRBLcW0bB-GcvSyVqLAHtosfSUze6kSBLZCGAhqb1QCnn2yso7g7_04sNPUyxY17hOm31XH1iRje6q49zTOPeB2HmF4VVeRI6IdBbGEICjZnz3P6-8ipv09Pthd_oTo0uuDt4r1Ody5tB6d-BP0tAXQjq1EyRRd_-w5f82UvJGTG7ygppvHxTaRFyCu2-r1BQ1T4Pdk_UtsRgT78vt-0t8f7g',
    description: 'ANC headphones, Bluetooth soundbars, smart TVs & gaming gear',
    itemCount: 740,
  },
];

export const PRODUCTS: Product[] = [
  // --- MOBILES & TECH ---
  {
    id: 'prod-titan-watch',
    name: 'Titan Smart Pro Fitness Watch with AMOLED Display',
    brand: 'Titan',
    category: 'Mobiles',
    price: 4999,
    originalPrice: 7999,
    discountPercent: 37,
    rating: 4.6,
    ratingCount: 3120,
    isBestSeller: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNfJPlSyDrak9vAVXg5Qg4dkZNcMOt8kNMMKXS7WhAJp09WF4YL82bSSdflC9el89nTMaM_I2QJbHRYQUJLOgUlbOHn9EiBUaMO6O4x8vY6ID7mLC9CJsmLrfswk8ld3vyaxoQ6gmp3re-IxkYMYscnjq_fBqY2fj2mUX8oyjM3po3ZE2F2faAOKeo2jVdckaA02Dh9ZL2_iOS3I6n5uQGEW5iRFmgEDc1F1ewfPUuZJjJ48mQrulSaw',
    seller: {
      id: 'seller-titan-official',
      name: 'Titan Official Retail',
      rating: 4.9,
      reviewsCount: 8400,
      isVerified: true,
      city: 'Mumbai',
    },
    inStock: true,
    stockCount: 45,
    deliveryTimeText: 'Free Delivery in 2 Days',
    description: 'Titan Smart Pro comes with a 1.19" AMOLED crystal display, built-in GPS, body temperature tracker, 14-day battery life, and 14+ sports modes. Encased in an aircraft-grade aluminum alloy body with premium silicon straps.',
    specifications: {
      'Brand': 'Titan',
      'Display': '1.19 inch AMOLED (390x390)',
      'Battery': '14 Days Typical Use',
      'Sensors': 'Optical Heart Rate, SpO2, Accelerometer, GPS',
      'Water Resistance': '5 ATM (50m)'
    },
    reviews: [
      {
        id: 'rev-3',
        author: 'Vikram Mehta',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Crystal clear AMOLED screen and very accurate heart rate and GPS tracking. Looks ultra-premium!',
        date: 'Nov 04, 2025',
        avatarLetter: 'V'
      }
    ],
    tags: ['smartwatch', 'titan', 'amoled', 'fitness', 'wearable', 'mobiles']
  },
  {
    id: 'prod-soundcore-earbuds',
    name: 'SoundCore Life Note E True Wireless Earbuds',
    brand: 'SoundCore',
    category: 'Mobiles',
    price: 1899,
    originalPrice: 2999,
    discountPercent: 37,
    rating: 4.5,
    ratingCount: 3410,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVSG8CECGlloBsMvU298mDmD8gFU0cHrAMhUYz2tVcYd5RV_SWLqn3XTTqy2hafDai0JFeT3UVTgOSvqO3gNqeJsK9Fc3LZSbBq3Tdd05R5Mv7B0Qk95B5Cq1MpxHW6c2X5Z0o3o4WguQuKE25k62vGjmA6nII66m0muKNonKeR5TLcip-uJ-LuHBbBeIsGhtpiQqnKDlhvP9NpoFjZzwT-P3Fq0Dk8MrKeQPn3LTtU8_eSO6LNGM5Ig',
    seller: {
      id: 'seller-soundcore',
      name: 'SoundCore Direct',
      rating: 4.6,
      reviewsCount: 5400,
      isVerified: true,
      city: 'Hyderabad',
    },
    inStock: true,
    stockCount: 55,
    deliveryTimeText: 'Free Delivery Tomorrow',
    description: 'Compact earbuds with big bass. 10mm oversized drivers, 3 EQ modes (Soundcore Signature, Bass Booster, Podcast), 32-hour total playtime with USB-C fast charging.',
    specifications: {
      'Brand': 'SoundCore',
      'Driver Size': '10mm',
      'Playtime': '8h single / 32h with case',
      'Bluetooth': '5.2 with AI-enhanced calls',
      'Waterproof': 'IPX5'
    },
    reviews: [
      {
        id: 'rev-8',
        author: 'Aditya Rao',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Unbeatable sound under ₹2000! Bass is punchy and battery easily lasts all week.',
        date: 'Jul 20, 2026',
        avatarLetter: 'A'
      }
    ],
    tags: ['earbuds', 'wireless', 'tws', 'soundcore', 'anc', 'under 2000', 'audio', 'mobiles']
  },
  {
    id: 'prod-noise-buds-anc',
    name: 'Noise Buds VS104 Pro ANC True Wireless',
    brand: 'Noise',
    category: 'Mobiles',
    price: 1599,
    originalPrice: 3499,
    discountPercent: 54,
    rating: 4.4,
    ratingCount: 6890,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGJeTQUBtKwUI5GJKajjzYSvwp3ROS7n8QGu7MmRG0X4YT0wFfu6I-pQAQjepD6fTSqQ9J1fMCrHdimjL2rmtuS9KJJcpzBnP9cbCz86HZqBI4RXBM1jKiA8hS6teDeQ37wX_eML7FrTLXfhtHcIx4cugcyYD6j1BM_tNoUXl6VOztu3CsTPwj7904PaKdfhTVVG5y1W2i2BjI8oGPzQrxf0uJC6-G6U3QHp75NGqceAKwJdCkW91MAQ',
    seller: {
      id: 'seller-noise',
      name: 'Noise Official Hub',
      rating: 4.5,
      reviewsCount: 12000,
      isVerified: true,
      city: 'Gurugram',
    },
    inStock: true,
    stockCount: 90,
    deliveryTimeText: 'Free Delivery in 2 Days',
    description: 'Active Noise Cancellation up to 25dB, Instacharge (10 min charge = 150 min playtime), Quad mic with Environmental Noise Cancellation for crystal clear calls.',
    specifications: {
      'Brand': 'Noise',
      'ANC': 'Up to 25dB Active Noise Cancellation',
      'Total Playtime': '40 Hours',
      'Latency': 'Low latency gaming mode 50ms',
      'Charging': 'Type-C Instacharge'
    },
    reviews: [
      {
        id: 'rev-9',
        author: 'Sneha Roy',
        isVerifiedBuyer: true,
        rating: 4,
        comment: 'Great ANC performance in buses and metro. Beautiful white finish!',
        date: 'Aug 02, 2026',
        avatarLetter: 'S'
      }
    ],
    tags: ['earbuds', 'noise', 'anc', 'wireless', 'under 2000', 'audio', 'mobiles']
  },
  {
    id: 'prod-oneplus-nord-ce4',
    name: 'OnePlus Nord CE4 5G (8GB RAM, 128GB, Celadon Marble)',
    brand: 'OnePlus',
    category: 'Mobiles',
    price: 24999,
    originalPrice: 26999,
    discountPercent: 7,
    rating: 4.7,
    ratingCount: 8940,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaQu92SdLJKYmstYIy-KLicS04t2rL7HYz-exQ1dhtXbAjoE50ORDVXNd6TJa0CKihjRxSRO00_uxHHSEUmeUA4m5LAXiRFKQfh3mAnWklpLi5vsmiGou04wuQjd2kH0tE1bBeFNw1-KRDj_mt0fdl8f-y9j02Q_fWYx9a6VTjKcE-gnpLy1hKUshKTTIMZrfTO4FW3Fj9KLV7zgS0N-JqVsDWZcRbu0ZIn5dfts4cxqOfZd7B94S7cQ',
    seller: {
      id: 'seller-electromart',
      name: 'ElectroMart India',
      rating: 4.8,
      reviewsCount: 10450,
      isVerified: true,
      city: 'Bangalore',
    },
    inStock: true,
    stockCount: 30,
    deliveryTimeText: 'Delivery by Tomorrow 10 AM',
    description: 'Powered by Snapdragon 7 Gen 3, 100W SUPERVOOC fast charging, 5500mAh massive battery, 120Hz AMOLED display with Aqua Touch technology.',
    specifications: {
      'Brand': 'OnePlus',
      'Processor': 'Snapdragon 7 Gen 3',
      'RAM': '8GB LPDDR4X',
      'Storage': '128GB UFS 3.1',
      'Battery': '5500 mAh with 100W Charging',
      'Camera': '50MP Sony LYT-600 OIS + 8MP Ultra-Wide'
    },
    reviews: [
      {
        id: 'rev-10',
        author: 'Arjun Deshmukh',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Lightning fast phone! Charges 0 to 100% in 28 mins. The marble back looks breathtaking.',
        date: 'Aug 11, 2026',
        avatarLetter: 'A'
      }
    ],
    tags: ['oneplus', 'smartphone', '5g', 'snapdragon', 'fast charge', 'mobiles']
  },

  // --- FASHION ---
  {
    id: 'prod-manyavar-kurta',
    name: "Manyavar Men's Royal Indigo Cotton Blend Kurta Set",
    brand: 'Manyavar',
    category: 'Fashion',
    price: 1499,
    originalPrice: 2999,
    discountPercent: 50,
    rating: 4.7,
    ratingCount: 5200,
    isBestSeller: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnCujq3j0t33iTlWSGpxZFhEu2qTsBr9xJqbveVO8BoFvYizP_I03LUTffyf0Ujm5PZLZRaVTjR0R7hTo6vxpRIJ9gqYSzXnv-StV9sdNk0RwnB3yYTWyKDN_p0F2HFM73HHKVflHlbtZPx9DvhFIFDCBu9k-hKWhV8e1sEB13gjuGtu-MihPRxnSgN5Mdcr0XjbQpTPK6N7as6gR5MCssdTIKFExAkpnsdKmQhbqwGhbpRuwVwUVM4Q',
    seller: {
      id: 'seller-manyavar',
      name: 'Ethnic Trendz India',
      rating: 4.7,
      reviewsCount: 6800,
      isVerified: true,
      city: 'Kolkata',
    },
    inStock: true,
    stockCount: 60,
    deliveryTimeText: 'Free Delivery in 3 Days',
    description: 'Elevate your festive and wedding occasions with this rich indigo blue Manyavar Kurta and Pyjama set. Tailored in breathable cotton-rich blend featuring intricate collar embroidery and mother-of-pearl buttons.',
    specifications: {
      'Brand': 'Manyavar',
      'Fabric': 'Premium Cotton Blend',
      'Fit': 'Regular Fit',
      'Length': 'Knee Length',
      'Occasion': 'Festive, Wedding, Celebrations'
    },
    reviews: [
      {
        id: 'rev-4',
        author: 'Pooja Verma',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Bought this for my brother for Diwali. Fitting is impeccable and the fabric is extremely soft.',
        date: 'Oct 24, 2025',
        avatarLetter: 'P'
      }
    ],
    tags: ['kurta', 'ethnic', 'men', 'festive', 'wedding', 'manyavar', 'fashion']
  },
  {
    id: 'prod-banarasi-silk-saree',
    name: 'Karagiri Handwoven Banarasi Silk Zari Saree',
    brand: 'Karagiri',
    category: 'Fashion',
    price: 3499,
    originalPrice: 6999,
    discountPercent: 50,
    rating: 4.8,
    ratingCount: 3820,
    isBestSeller: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbhO237OOVXeSHfMgurZU6cxr7F0VeOFnRfKqncfCDgkYy2EZuFif59Fn7mQZRJ6W5WLxqub0wrqWVnJq3WMI3BVOt18pwmDL2urAjku4fLZAnyeroFv3UffzS61IdB4rLYVLIbzmwC8BcTZgPzHNBVk6bPw_SkJ5JqoxpMO9LAbE8IZK_Nknm7qEzTktjqD0tSmGpfND1vEe6P_nZdXbaxg8QQiHQzwHufSMSsYkC0gevfQ1MbGaH-Q',
    seller: {
      id: 'seller-karagiri',
      name: 'Varanasi Silk Emporium',
      rating: 4.9,
      reviewsCount: 14500,
      isVerified: true,
      city: 'Varanasi',
    },
    inStock: true,
    stockCount: 40,
    deliveryTimeText: 'Free Delivery in 2 Days',
    description: 'Exquisite magenta pink Banarasi silk saree adorned with intricate golden zari floral jaal work. Includes an unstitched matching designer blouse piece.',
    specifications: {
      'Brand': 'Karagiri',
      'Fabric': 'Pure Katan Silk Blend',
      'Weave': 'Banarasi Brocade Zari',
      'Length': '6.3 meters with blouse piece',
      'Occasion': 'Wedding, Traditional Functions'
    },
    reviews: [
      {
        id: 'rev-11',
        author: 'Meenakshi Iyer',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Pure luxury! The zari shine is authentic and not at all gaudy. Received countless compliments.',
        date: 'Jan 15, 2026',
        avatarLetter: 'M'
      }
    ],
    tags: ['saree', 'silk', 'banarasi', 'ethnic', 'wedding', 'women', 'fashion']
  },
  {
    id: 'prod-puma-sneakers',
    name: 'Puma Rebound V6 High-Top Unisex Sneakers',
    brand: 'Puma',
    category: 'Fashion',
    price: 2799,
    originalPrice: 4999,
    discountPercent: 44,
    rating: 4.5,
    ratingCount: 4320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaQu92SdLJKYmstYIy-KLicS04t2rL7HYz-exQ1dhtXbAjoE50ORDVXNd6TJa0CKihjRxSRO00_uxHHSEUmeUA4m5LAXiRFKQfh3mAnWklpLi5vsmiGou04wuQjd2kH0tE1bBeFNw1-KRDj_mt0fdl8f-y9j02Q_fWYx9a6VTjKcE-gnpLy1hKUshKTTIMZrfTO4FW3Fj9KLV7zgS0N-JqVsDWZcRbu0ZIn5dfts4cxqOfZd7B94S7cQ',
    seller: {
      id: 'seller-puma-official',
      name: 'Puma India Official',
      rating: 4.8,
      reviewsCount: 22000,
      isVerified: true,
      city: 'Bangalore',
    },
    inStock: true,
    stockCount: 85,
    deliveryTimeText: 'Free Express Delivery',
    description: 'Retro basketball silhouette meets contemporary comfort. Featuring SoftFoam+ sockliner for supreme all-day cushioning and durable rubber cupsole.',
    specifications: {
      'Brand': 'Puma',
      'Upper Material': 'Synthetic Leather',
      'Sole': 'Anti-Skid Rubber',
      'Closure': 'Lace-Up',
      'Style': 'High-Top Lifestyle Sneaker'
    },
    reviews: [
      {
        id: 'rev-12',
        author: 'Rohan Gupta',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Great ankle support and super stylish with jeans and cargos.',
        date: 'Jul 30, 2026',
        avatarLetter: 'R'
      }
    ],
    tags: ['shoes', 'sneakers', 'puma', 'footwear', 'casual', 'fashion']
  },

  // --- GROCERY & GOURMET ---
  {
    id: 'prod-kohinoor-rice-5kg',
    name: 'Kohinoor Super Value Authentic Basmati Rice (5 kg)',
    brand: 'Kohinoor',
    category: 'Grocery',
    price: 549,
    originalPrice: 645,
    discountPercent: 15,
    rating: 4.3,
    ratingCount: 1245,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6SMKNc05nVwLgQoJGSOlrqkOsYmqIEEpS6Ai2P9enLB12aRc0O1tmfxU4L0K50XL_WuKx7Y_j6AL2yLrJK6KOmjEb8c6GQrIGk7QrWOcEn8iDOtPt-lTAythigrSvBvIs9hOq4oKIv6aJzwn8hSyxUxeytKj0nXvjXTqmw1LAoFSfZYIaP3_3xwa7qLgLxaLaP-wRhxdu56_3LU08TYvcF-TWTMMxYRbWr3Ln_wzdSMR0Pd97MIMdSw',
    seller: {
      id: 'seller-sharma-wholesalers',
      name: 'Sharma Wholesalers',
      rating: 4.3,
      reviewsCount: 1245,
      isVerified: true,
      city: 'Delhi',
    },
    inStock: true,
    stockCount: 120,
    deliveryTimeText: 'Express Delivery in 4 Hours',
    description: 'Aged to perfection for over 2 years in pristine Himalayan foothills, Kohinoor Super Value Authentic Basmati Rice delivers slender grains that elongate up to 2.5x upon cooking with captivating aroma.',
    specifications: {
      'Brand': 'Kohinoor',
      'Weight': '5 kg',
      'Grain Type': 'Long Grain Basmati',
      'Dietary Preference': 'Vegetarian, Gluten Free',
      'Country of Origin': 'India'
    },
    reviews: [
      {
        id: 'rev-5',
        author: 'Suresh Raina',
        isVerifiedBuyer: true,
        rating: 4,
        comment: 'Great fragrant rice for daily biryani and pulao. Fast delivery by Sharma Wholesalers.',
        date: 'Aug 10, 2026',
        avatarLetter: 'S'
      }
    ],
    tags: ['rice', 'basmati', 'grocery', '5kg', 'kohinoor', 'food']
  },
  {
    id: 'prod-india-gate-5kg',
    name: 'India Gate Classic Basmati Rice - 5kg Aged Pack',
    brand: 'India Gate',
    category: 'Grocery',
    price: 899,
    originalPrice: 999,
    discountPercent: 10,
    rating: 4.8,
    ratingCount: 4890,
    isBestSeller: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2Nr1wjAqMDrTysnPawyT5IEd_0HvLoCVVS1HcvhwVJPo6FnZHyjvF0PKIX6kdwRtCOVTsLUo22Ej3Sgl5n5g40_g5Wpv8NEv4Qrzen0ZZ4WcXquRApsVZ47756iAakphE5a9-gPlH7qiPIHmk2pxQx8cfzizvCWyd4yvnVRHKkBJwpylBT-FaqvSOmhoAk7kxo14vsdQ6kIqerGC2RW0EvSHrgC9ERAMialTmd72TeIaoE_4Omk5Bzw',
    seller: {
      id: 'seller-megamart',
      name: 'MegaMart Daily',
      rating: 4.8,
      reviewsCount: 4890,
      isVerified: true,
      city: 'Chandigarh',
    },
    inStock: true,
    stockCount: 80,
    deliveryTimeText: 'Delivery by Tomorrow Morning',
    description: 'The world benchmark for basmati rice. India Gate Classic features flawless pearlescent extra-long grains with unmatched sweet aroma, ideal for celebratory biryanis and royal banquets.',
    specifications: {
      'Brand': 'India Gate',
      'Weight': '5 kg',
      'Aging': 'Aged 2+ Years',
      'Grain Length': '8.4mm average cooked'
    },
    reviews: [
      {
        id: 'rev-6',
        author: 'Deepika Sen',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'No comparison to India Gate Classic. Every single grain stays separate and fluffy.',
        date: 'Aug 14, 2026',
        avatarLetter: 'D'
      }
    ],
    tags: ['rice', 'basmati', 'india gate', 'grocery', '5kg', 'premium']
  },
  {
    id: 'prod-daawat-rozana-5kg',
    name: 'Daawat Rozana Super Basmati Rice 5kg',
    brand: 'Daawat',
    category: 'Grocery',
    price: 410,
    originalPrice: 450,
    discountPercent: 9,
    rating: 4.1,
    ratingCount: 856,
    isLimitedStock: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB0-9UkfvuYSsfiJbhGXOUycIXkGi2QMhy0KCMOIkN93NihO0wLrZbkpHza8QlUcsgTnKfTTgwcSNrTK7erYNu8Vza1ieQzXEsrY4JmQQCt5L-sFluOtIMwc1OMh-0rWUV87aKMYjf7Llo1FCCj2ao_lCmiWGf0WRPGzJ5_QURJLmDfo2sueUHbeE5Si4IQGVcBLZrbot0lR-MhiIGnUbfgoNXxiVjkqoBCqe1Wgp1-Q09xUU-u7IZ_A',
    seller: {
      id: 'seller-patel',
      name: 'Patel Groceries',
      rating: 4.1,
      reviewsCount: 856,
      isVerified: true,
      city: 'Ahmedabad',
    },
    inStock: true,
    stockCount: 12,
    deliveryTimeText: 'Delivery in 1 Day',
    description: 'Daawat Rozana Super is the quintessential everyday basmati rice that offers supreme value without compromising on taste and grain elongation.',
    specifications: {
      'Brand': 'Daawat',
      'Weight': '5 kg',
      'Variety': 'Rozana Super'
    },
    reviews: [
      {
        id: 'rev-7',
        author: 'Kunal Joshi',
        isVerifiedBuyer: true,
        rating: 4,
        comment: 'Great value for money basmati rice for everyday family meals.',
        date: 'Aug 18, 2026',
        avatarLetter: 'K'
      }
    ],
    tags: ['rice', 'daawat', 'grocery', '5kg', 'rozana']
  },
  {
    id: 'prod-organic-ghee-1l',
    name: 'Anveshan Vedic A2 Gir Cow Ghee (1 Litre Bilona Method)',
    brand: 'Anveshan',
    category: 'Grocery',
    price: 1399,
    originalPrice: 1699,
    discountPercent: 18,
    rating: 4.9,
    ratingCount: 3200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB01wG6wSmBQPppKgkn427WxMe0kGBlNAaquyD6HIhU4_fk8OOvRlY9CXj-iWKu2Xxq6w6hIMMofhNafYuAxUGoL9fhW9wZ9YucrCXKHx3Bj1r6d197mYBNYpoTlbTVZPur8OSGywG_qsKlUQibcSEcrtgGsSv0bv3rsVskuXgh5kWH_QwKdgjxSFahouACITv0L9G7hK1B74ilsQn0d0Y4jB-daOULKB6O8ZnPfOpUCwQxBQSiezuQNg',
    seller: {
      id: 'seller-organic-store',
      name: 'Pure Roots Organics',
      rating: 4.9,
      reviewsCount: 9200,
      isVerified: true,
      city: 'Jaipur',
    },
    inStock: true,
    stockCount: 70,
    deliveryTimeText: 'Free Delivery in 24 Hours',
    description: 'Crafted using the traditional bilona churning method from whole curd of grass-fed A2 Gir cows. Rich in granular texture, gold aroma, and natural omega fatty acids.',
    specifications: {
      'Brand': 'Anveshan',
      'Volume': '1 Litre Glass Jar',
      'Processing': 'Traditional Wooden Bilona Method',
      'Purity': '100% Preservative Free'
    },
    reviews: [
      {
        id: 'rev-13',
        author: 'Swati Kulkarni',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Tastes exactly like the ghee my grandmother used to make in the village. Danedar and fragrant!',
        date: 'Jul 12, 2026',
        avatarLetter: 'S'
      }
    ],
    tags: ['ghee', 'organic', 'a2', 'grocery', 'bilona', 'ayurvedic']
  },

  // --- ELECTRONICS & AUDIO ---
  {
    id: 'prod-sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    brand: 'Sony',
    category: 'Electronics',
    price: 29990,
    originalPrice: 34990,
    discountPercent: 14,
    rating: 4.8,
    ratingCount: 4289,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCue4FXTay5bdlvRu0P_C8jxcJBE2U4tBRBLcW0bB-GcvSyVqLAHtosfSUze6kSBLZCGAhqb1QCnn2yso7g7_04sNPUyxY17hOm31XH1iRje6q49zTOPeB2HmF4VVeRI6IdBbGEICjZnz3P6-8ipv09Pthd_oTo0uuDt4r1Ody5tB6d-BP0tAXQjq1EyRRd_-w5f82UvJGTG7ygppvHxTaRFyCu2-r1BQ1T4Pdk_UtsRgT78vt-0t8f7g',
    seller: {
      id: 'seller-electromart',
      name: 'ElectroMart India',
      rating: 4.8,
      reviewsCount: 10450,
      isVerified: true,
      city: 'Bangalore',
    },
    inStock: true,
    stockCount: 18,
    deliveryTimeText: 'Free Delivery by Tomorrow, 11 AM',
    description: 'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE – Extreme and Hires audio support the WH-1000XM5 headphones provide awe-inspiring audio quality.',
    specifications: {
      'Brand': 'Sony',
      'Model Name': 'WH-1000XM5',
      'Color': 'Platinum Silver',
      'Headphone Type': 'Over-Ear',
      'Connectivity': 'Bluetooth 5.2',
      'Battery Life': 'Up to 30 hours with ANC on',
      'Weight': '250 g',
      'Warranty': '1 Year Manufacturer Warranty'
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Rahul K.',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Absolutely stunning sound quality and the ANC is out of this world. Battery life is solid as well. Best purchase this year.',
        date: 'Oct 12, 2025',
        avatarLetter: 'R'
      }
    ],
    tags: ['headphones', 'sony', 'anc', 'wireless', 'noise cancelling', 'bluetooth', 'audio', 'electronics']
  },
  {
    id: 'prod-samsung-qled-tv',
    name: 'Samsung 55" Crystal 4K Vivid Pro Ultra HD Smart TV',
    brand: 'Samsung',
    category: 'Electronics',
    price: 43990,
    originalPrice: 68900,
    discountPercent: 36,
    rating: 4.7,
    ratingCount: 7650,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe7cRTHUb-wtrvkKjm3cY5idjynnVBc5w8VRCFjXzlan_GmH8-ayU-miHRbCh8pK1Kri3u4tqQdAodz-GduOBNGnIjMegt9mhB_iUBaIg88FJaHRgY3VH7x7HnoQpgdiBcIh377cxezZ3MSiphdOGvlwHsBKPH8L88p45jb0knmAw2YG-fyaZiBZxqfLSI-WgO_wAGHj-mvO0P2grT1_rCzI06lB2YNl3l94IZtPP6Y0n-PKxqZ5W8Yw',
    seller: {
      id: 'seller-electromart',
      name: 'ElectroMart India',
      rating: 4.8,
      reviewsCount: 10450,
      isVerified: true,
      city: 'Bangalore',
    },
    inStock: true,
    stockCount: 15,
    deliveryTimeText: 'Free Scheduled Installation Included',
    description: 'Dynamic Crystal Color brings 1 billion shades to life. Powered by Crystal Processor 4K, Object Tracking Sound Lite, and SolarCell Remote control.',
    specifications: {
      'Brand': 'Samsung',
      'Screen Size': '55 Inches (138 cm)',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Refresh Rate': '50 Hertz with Motion Xcelerator',
      'Sound Output': '20W with Q-Symphony'
    },
    reviews: [
      {
        id: 'rev-14',
        author: 'Manish Chawla',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Picture clarity is mind-blowing. Samsung installation technician arrived within 24 hours.',
        date: 'Aug 05, 2026',
        avatarLetter: 'M'
      }
    ],
    tags: ['tv', 'samsung', '4k', 'smart tv', 'electronics', 'home']
  },

  // --- HOME & LIVING ---
  {
    id: 'prod-prestige-cookware',
    name: 'Prestige Omega Deluxe Granite Cookware Set (3-Piece)',
    brand: 'Prestige',
    category: 'Home',
    price: 2499,
    originalPrice: 4250,
    discountPercent: 41,
    rating: 4.6,
    ratingCount: 5120,
    isBestSeller: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe7cRTHUb-wtrvkKjm3cY5idjynnVBc5w8VRCFjXzlan_GmH8-ayU-miHRbCh8pK1Kri3u4tqQdAodz-GduOBNGnIjMegt9mhB_iUBaIg88FJaHRgY3VH7x7HnoQpgdiBcIh377cxezZ3MSiphdOGvlwHsBKPH8L88p45jb0knmAw2YG-fyaZiBZxqfLSI-WgO_wAGHj-mvO0P2grT1_rCzI06lB2YNl3l94IZtPP6Y0n-PKxqZ5W8Yw',
    seller: {
      id: 'seller-kitchen-hub',
      name: 'Kitchen World Hub',
      rating: 4.7,
      reviewsCount: 7800,
      isVerified: true,
      city: 'Pune',
    },
    inStock: true,
    stockCount: 95,
    deliveryTimeText: 'Free Delivery Tomorrow',
    description: 'Includes Omni Tawa (28cm), Fry Pan (24cm) with Glass Lid, and Kadai (24cm). 5-layer durable German non-stick granite coating with induction and gas compatible base.',
    specifications: {
      'Brand': 'Prestige',
      'Material': 'Virgin Aluminium with Granite Coating',
      'Components': 'Tawa, Fry Pan with Glass Lid, Kadai',
      'Compatibility': 'Gas & Induction Friendly',
      'Dishwasher Safe': 'Yes'
    },
    reviews: [
      {
        id: 'rev-15',
        author: 'Sunita Sharma',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Requires almost zero oil for cooking dosas and curries. Very easy to wash.',
        date: 'Jun 22, 2026',
        avatarLetter: 'S'
      }
    ],
    tags: ['cookware', 'prestige', 'kitchen', 'non-stick', 'home', 'tawa']
  },
  {
    id: 'prod-philips-airfryer',
    name: 'Philips Digital Air Fryer HD9252 with Rapid Air Tech',
    brand: 'Philips',
    category: 'Home',
    price: 6999,
    originalPrice: 11995,
    discountPercent: 42,
    rating: 4.8,
    ratingCount: 9400,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB01wG6wSmBQPppKgkn427WxMe0kGBlNAaquyD6HIhU4_fk8OOvRlY9CXj-iWKu2Xxq6w6hIMMofhNafYuAxUGoL9fhW9wZ9YucrCXKHx3Bj1r6d197mYBNYpoTlbTVZPur8OSGywG_qsKlUQibcSEcrtgGsSv0bv3rsVskuXgh5kWH_QwKdgjxSFahouACITv0L9G7hK1B74ilsQn0d0Y4jB-daOULKB6O8ZnPfOpUCwQxBQSiezuQNg',
    seller: {
      id: 'seller-kitchen-hub',
      name: 'Kitchen World Hub',
      rating: 4.7,
      reviewsCount: 7800,
      isVerified: true,
      city: 'Pune',
    },
    inStock: true,
    stockCount: 35,
    deliveryTimeText: 'Free Delivery in 2 Days',
    description: 'Fry, bake, grill, roast and reheat with 90% less oil! Patented starfish design circulates hot air for crispy outside and tender inside samosas, fries, and tikkas.',
    specifications: {
      'Brand': 'Philips',
      'Capacity': '4.1 Litres',
      'Power': '1400 Watts',
      'Presets': '7 One-Touch Digital Presets',
      'Keep Warm': 'Up to 30 mins'
    },
    reviews: [
      {
        id: 'rev-16',
        author: 'Nikhil Saxena',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Game changer for healthy cooking! Paneer tikka and french fries come out super crispy.',
        date: 'Jul 19, 2026',
        avatarLetter: 'N'
      }
    ],
    tags: ['airfryer', 'philips', 'appliances', 'healthy', 'home', 'kitchen']
  },

  // --- BEAUTY & CARE ---
  {
    id: 'prod-mamaearth-vitamin-c',
    name: 'Mamaearth Vitamin C Daily Glow Face Serum (30ml)',
    brand: 'Mamaearth',
    category: 'Beauty',
    price: 549,
    originalPrice: 699,
    discountPercent: 21,
    rating: 4.6,
    ratingCount: 11400,
    isBestSeller: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgxJ4vl3AY8RI9R13c8t8jKSMyYyLk-8TfDvCXBqg-tzVRvaePtnEfBePZ0mOgV03iNonGImLzYaCRVqkil5tdnpJbzLpe6JLwDOUx1gU5DY5aJgaFyAaCSCkeaz-jEyJRJgPNk-uh3N7GKU-B0J40RZx30BwYrtTj3HdOMpY6qcj-ZwjOrfU39ua8N5coVBjVjZCDdvmoUuNa8rAsexzJlmqAauI1M06_-t-yiy11xCS2NKYJ8DP7_w',
    seller: {
      id: 'seller-mamaearth',
      name: 'Honasa Direct',
      rating: 4.8,
      reviewsCount: 18900,
      isVerified: true,
      city: 'Gurugram',
    },
    inStock: true,
    stockCount: 150,
    deliveryTimeText: 'Free Delivery in 24 Hours',
    description: 'Enriched with 10% Vitamin C and 5% Niacinamide, this lightweight serum fades dark spots, promotes even skin tone, and delivers radiant luminous glow naturally.',
    specifications: {
      'Brand': 'Mamaearth',
      'Volume': '30 ml',
      'Key Ingredients': 'Vitamin C, Niacinamide, Turmeric',
      'Skin Type': 'All Skin Types, Dermatologically Tested',
      'Toxin Free': 'No Parabens, Silicones or Mineral Oil'
    },
    reviews: [
      {
        id: 'rev-17',
        author: 'Divya Nair',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Absorbs within seconds without stickiness. My acne marks faded significantly in 2 weeks.',
        date: 'Aug 08, 2026',
        avatarLetter: 'D'
      }
    ],
    tags: ['skincare', 'serum', 'vitamin c', 'beauty', 'mamaearth', 'glow']
  },
  {
    id: 'prod-plum-green-tea-night-gel',
    name: 'Plum Green Tea Renewed Clarity Night Gel (50g)',
    brand: 'Plum',
    category: 'Beauty',
    price: 465,
    originalPrice: 575,
    discountPercent: 19,
    rating: 4.7,
    ratingCount: 7800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgxJ4vl3AY8RI9R13c8t8jKSMyYyLk-8TfDvCXBqg-tzVRvaePtnEfBePZ0mOgV03iNonGImLzYaCRVqkil5tdnpJbzLpe6JLwDOUx1gU5DY5aJgaFyAaCSCkeaz-jEyJRJgPNk-uh3N7GKU-B0J40RZx30BwYrtTj3HdOMpY6qcj-ZwjOrfU39ua8N5coVBjVjZCDdvmoUuNa8rAsexzJlmqAauI1M06_-t-yiy11xCS2NKYJ8DP7_w',
    seller: {
      id: 'seller-plum',
      name: 'Pureplay Skin Sciences',
      rating: 4.8,
      reviewsCount: 9500,
      isVerified: true,
      city: 'Thane',
    },
    inStock: true,
    stockCount: 110,
    deliveryTimeText: 'Free Delivery Tomorrow',
    description: 'Ultra-light, refreshing night gel with Green Tea extracts and Argan oil. Hydrates oily and acne-prone skin overnight while preventing breakouts.',
    specifications: {
      'Brand': 'Plum',
      'Weight': '50 grams',
      'Form': 'Non-Comedogenic Gel',
      'Purity': '100% Vegan & Cruelty Free'
    },
    reviews: [
      {
        id: 'rev-18',
        author: 'Rashi Agarwal',
        isVerifiedBuyer: true,
        rating: 5,
        comment: 'Wake up with soft, oil-free, glowing skin. Perfect night cream for humid weather.',
        date: 'Jul 28, 2026',
        avatarLetter: 'R'
      }
    ],
    tags: ['skincare', 'night gel', 'green tea', 'beauty', 'plum', 'vegan']
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Tejal Patil',
    phone: '+91 98201 45678',
    addressLine1: 'Flat 402, Sunshine Heights, Powai Vihar',
    addressLine2: 'Near Hiranandani Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    isDefault: true,
    type: 'Home'
  },
  {
    id: 'addr-2',
    fullName: 'Tejal Patil',
    phone: '+91 98201 45678',
    addressLine1: 'Mindspace IT Park, Building 4, 3rd Floor',
    addressLine2: 'Malad West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400064',
    isDefault: false,
    type: 'Work'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-10921',
    orderNumber: 'BZ-2026-89412',
    date: '19 Aug 2026, 04:30 PM',
    status: 'Shipped',
    items: [
      {
        product: PRODUCTS[0], // Titan Smart Pro
        quantity: 1
      }
    ],
    totalAmount: 4999,
    discountAmount: 3000,
    shippingFee: 0,
    deliveryAddress: INITIAL_ADDRESSES[0],
    paymentMethod: 'UPI (Google Pay)',
    returnEligibleUntil: '29 Aug 2026',
    returnStatus: 'None',
    trackingEvents: [
      {
        title: 'Order Placed & Confirmed',
        description: 'Payment authorized via UPI (Google Pay). Seller verified.',
        timestamp: '19 Aug, 04:30 PM',
        location: 'Mumbai Hub',
        completed: true,
        current: false
      },
      {
        title: 'Packed & Dispatched',
        description: 'Quality tested & sealed in tamper-evident packaging.',
        timestamp: '19 Aug, 08:15 PM',
        location: 'Titan Retail Hub, Bhiwandi',
        completed: true,
        current: false
      },
      {
        title: 'In Transit - Air Corridor Express',
        description: 'Shipment connected to fast surface/air logistics network.',
        timestamp: '20 Aug, 05:40 AM',
        location: 'National Sorting Center',
        completed: true,
        current: true
      },
      {
        title: 'Out for Doorstep Delivery',
        description: 'Delivery Executive will arrive with secure OTP.',
        timestamp: 'Expected Today 03:00 PM',
        location: 'Powai Delivery Hub',
        completed: false,
        current: false
      },
      {
        title: 'Delivered',
        description: 'Package handed over to recipient.',
        timestamp: 'Expected Today 05:00 PM',
        location: 'Powai Vihar, Mumbai',
        completed: false,
        current: false
      }
    ]
  }
];

export const SAMPLE_ADDRESSES = INITIAL_ADDRESSES;
export const SAMPLE_ORDERS = INITIAL_ORDERS;
