export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  url: string;
  likes?: number;
}

export const instagramPosts: InstagramPost[] = [
  { id: 'ig-001', image: '/images/post/1.png', caption: 'Pure nutrition from nature 🌿', url: 'https://www.instagram.com/arffoods/', likes: 142 },
  { id: 'ig-002', image: '/images/post/2.png', caption: 'Natural energy for your day 💪', url: 'https://www.instagram.com/arffoods/', likes: 218 },
  { id: 'ig-003', image: '/images/post/3.png', caption: 'Wholesome ingredients, zero compromise 🌾', url: 'https://www.instagram.com/arffoods/', likes: 189 },
  { id: 'ig-004', image: '/images/post/4.png', caption: 'From nature to your table ✨', url: 'https://www.instagram.com/arffoods/', likes: 305 },
  { id: 'ig-005', image: '/images/post/5.png', caption: 'Healthy snacking made easy 🥜', url: 'https://www.instagram.com/arffoods/', likes: 167 },
  { id: 'ig-006', image: '/images/post/6.png', caption: 'ARF — Amruth Ruchi Foods 🍃', url: 'https://www.instagram.com/arffoods/', likes: 241 },
];
