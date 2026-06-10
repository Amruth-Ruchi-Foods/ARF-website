export interface Testimonial {
  id: string;
  author: string;
  location: string;
  text: string;
  rating: number;
  product: string;
}

export const staticTestimonials: Testimonial[] = [
  { id: 't01', author: 'Priya Sharma',      location: 'Bengaluru',   rating: 5, product: 'Buttermilk Mix',       text: 'The Buttermilk Mix has become a daily ritual. My digestion improved so much since I started having it after lunch. Tastes exactly like homemade chaas!' },
  { id: 't02', author: 'Arjun Mehta',       location: 'Mumbai',      rating: 5, product: 'Khajur Mix',           text: 'I carry the Khajur Mix everywhere as my pre-gym snack. No more energy crashes mid-workout. Zero refined sugar — just pure natural goodness.' },
  { id: 't03', author: 'Sunita Reddy',      location: 'Hyderabad',   rating: 5, product: 'Ghee Roasted Seeds',   text: 'The Ghee Roasted Seeds are absolutely addictive! I sprinkle them on salads and oatmeal every morning. You can taste the quality of the ghee.' },
  { id: 't04', author: 'Rahul Nair',        location: 'Kochi',       rating: 5, product: 'Khajur Mix',           text: 'Finally found a brand that takes ingredients seriously. Everything from ARF feels honest and wholesome. The Khajur Mix is a staple in our household.' },
  { id: 't05', author: 'Meena Iyer',        location: 'Chennai',     rating: 5, product: 'Flax Mix Seeds',       text: 'My doctor recommended flax seeds and I was struggling to eat them plain. ARF\'s Flax Mix is so tasty I actually look forward to it every morning!' },
  { id: 't06', author: 'Vikram Patel',      location: 'Ahmedabad',   rating: 5, product: 'Buttermilk Mix',       text: 'Ordered for my parents and they absolutely love it. My mother says it reminds her of the chaas her mother used to make. Authentic taste, great quality.' },
  { id: 't07', author: 'Ananya Krishnan',   location: 'Bengaluru',   rating: 5, product: 'Jumbo Kajur',          text: 'The Jumbo Kajur are the most plump and juicy dates I\'ve ever had. My kids eat them instead of chocolates now. Best decision I made for their health.' },
  { id: 't08', author: 'Deepak Joshi',      location: 'Pune',        rating: 4, product: 'Ghee Roasted Seeds',   text: 'Great product, great taste. The seeds are perfectly roasted and the ghee flavour is subtle but present. Will definitely reorder.' },
  { id: 't09', author: 'Kavitha Suresh',    location: 'Coimbatore',  rating: 5, product: 'Khajur Seed Powder',   text: 'I add the Khajur Seed Powder to my morning milk and it has genuinely helped with my sleep quality. Natural and effective — no side effects at all.' },
  { id: 't10', author: 'Sanjay Gupta',      location: 'Delhi',       rating: 5, product: 'Flax Mix Seeds',       text: 'Been using ARF products for 6 months now. My cholesterol levels have improved and my doctor was surprised. Consistency with good products really works.' },
  { id: 't11', author: 'Lakshmi Venkat',    location: 'Mysuru',      rating: 5, product: 'Buttermilk Mix',       text: 'I was skeptical at first but after one sip I was sold. The spice blend is perfect — not too strong, not too mild. Exactly what a good buttermilk should taste like.' },
  { id: 't12', author: 'Rohit Desai',       location: 'Nagpur',      rating: 4, product: 'Jumbo Kajur',          text: 'Excellent quality dates. Packaging is very good and they arrived fresh. Great for breaking fast during Ramadan. Will order again.' },
  { id: 't13', author: 'Pooja Agarwal',     location: 'Jaipur',      rating: 5, product: 'Ghee Roasted Seeds',   text: 'I gift these to everyone now. My colleagues at work are all hooked. The ghee roasted seeds are the perfect healthy desk snack.' },
  { id: 't14', author: 'Suresh Kumar',      location: 'Bengaluru',   rating: 5, product: 'Khajur Mix',           text: 'My 70-year-old father has more energy since he started the Khajur Mix. He takes it with warm milk every night. The whole family has noticed the difference.' },
  { id: 't15', author: 'Nandini Rao',       location: 'Mangaluru',   rating: 5, product: 'Flax Mix Seeds',       text: 'Post-pregnancy I was looking for natural ways to boost nutrition. The Flax Mix has been a game changer. Hair fall reduced noticeably in just 2 months.' },
  { id: 't16', author: 'Aditya Singh',      location: 'Lucknow',     rating: 5, product: 'Buttermilk Mix',       text: 'The convenience is unmatched. Just mix with water and you have a perfect probiotic drink. No more buying expensive probiotic supplements.' },
  { id: 't17', author: 'Rekha Pillai',      location: 'Thiruvananthapuram', rating: 5, product: 'Khajur Seed Powder', text: 'My husband has been using Khajur Seed Powder for his joint pain and the results are remarkable. Natural remedies really do work when the quality is right.' },
  { id: 't18', author: 'Manish Tiwari',     location: 'Bhopal',      rating: 4, product: 'Ghee Roasted Seeds',   text: 'Good product, good price. The seeds are crunchy and flavourful. I mix them into my trail mix for treks. Highly recommended for outdoor enthusiasts.' },
  { id: 't19', author: 'Divya Menon',       location: 'Kochi',       rating: 5, product: 'Jumbo Kajur',          text: 'These dates are a revelation. Soft, sweet, and absolutely fresh. I\'ve tried many brands but ARF\'s Jumbo Kajur are in a different league entirely.' },
  { id: 't20', author: 'Karthik Rajan',     location: 'Chennai',     rating: 5, product: 'Flax Mix Seeds',       text: 'As a nutritionist I recommend ARF products to my clients. The ingredient quality is transparent and the nutritional profile is excellent. Trustworthy brand.' },
  { id: 't21', author: 'Smita Kulkarni',    location: 'Pune',        rating: 5, product: 'Buttermilk Mix',       text: 'My IBS has been much more manageable since I started the Buttermilk Mix. The probiotics in it are genuinely helpful. Thank you ARF for this product.' },
  { id: 't22', author: 'Nikhil Sharma',     location: 'Gurugram',    rating: 5, product: 'Khajur Mix',           text: 'Perfect for my intermittent fasting routine. The Khajur Mix gives me sustained energy during my eating window without any sugar spikes.' },
  { id: 't23', author: 'Usha Narayanan',    location: 'Bengaluru',   rating: 5, product: 'Ghee Roasted Seeds',   text: 'I\'ve been making my own roasted seeds for years but ARF\'s version is honestly better. The ghee quality is exceptional and the roasting is perfect.' },
  { id: 't24', author: 'Prasad Hegde',      location: 'Hubli',       rating: 4, product: 'Khajur Seed Powder',   text: 'Good product. Takes a few weeks to see results but it\'s worth the patience. I add it to my coffee and it gives a nice earthy flavour too.' },
  { id: 't25', author: 'Geeta Mishra',      location: 'Varanasi',    rating: 5, product: 'Jumbo Kajur',          text: 'Ordered as prasad for a puja and everyone asked where I got such beautiful dates. The size and quality are truly jumbo. Will order every month.' },
  { id: 't26', author: 'Ravi Chandran',     location: 'Madurai',     rating: 5, product: 'Flax Mix Seeds',       text: 'My wife started adding these to our rotis and the family doesn\'t even notice but we\'re all getting the nutrition. Clever way to eat healthy!' },
  { id: 't27', author: 'Pallavi Jain',      location: 'Indore',      rating: 5, product: 'Buttermilk Mix',       text: 'Summer in Indore is brutal and this Buttermilk Mix is my lifesaver. Cooling, refreshing, and actually good for you. Better than any packaged drink.' },
  { id: 't28', author: 'Venkat Subramanian',location: 'Bengaluru',   rating: 5, product: 'Khajur Mix',           text: 'I run marathons and the Khajur Mix is my go-to recovery food. Natural sugars, minerals, and it tastes amazing. My running group is all hooked now.' },
  { id: 't29', author: 'Shobha Reddy',      location: 'Vijayawada',  rating: 4, product: 'Ghee Roasted Seeds',   text: 'Very good quality. The seeds are fresh and the ghee aroma is wonderful. I wish the pack size was bigger because I finish it too quickly!' },
  { id: 't30', author: 'Amit Verma',        location: 'Kanpur',      rating: 5, product: 'Khajur Seed Powder',   text: 'I was having trouble sleeping for months. A friend suggested Khajur Seed Powder in warm milk. Within 2 weeks my sleep improved dramatically. Natural magic.' },
  { id: 't31', author: 'Chitra Balaji',     location: 'Bengaluru',   rating: 5, product: 'Flax Mix Seeds',       text: 'As someone with PCOS, I was advised to include flax seeds in my diet. ARF\'s mix makes it so easy and delicious. My hormone levels have improved noticeably.' },
  { id: 't32', author: 'Harish Gowda',      location: 'Mysuru',      rating: 5, product: 'Jumbo Kajur',          text: 'Gifted these to my boss and he called to ask where I bought them. The presentation is beautiful and the dates are exceptional. Perfect corporate gift.' },
  { id: 't33', author: 'Madhuri Patil',     location: 'Kolhapur',    rating: 5, product: 'Buttermilk Mix',       text: 'My children refused to drink plain buttermilk but they love this mix. Getting probiotics into fussy kids is a win. Thank you for making it tasty!' },
  { id: 't34', author: 'Sunil Bhat',        location: 'Mangaluru',   rating: 4, product: 'Ghee Roasted Seeds',   text: 'Solid product. The seeds are well-seasoned and the ghee is clearly good quality. A healthy alternative to chips that actually satisfies the craving.' },
  { id: 't35', author: 'Anita Kapoor',      location: 'Chandigarh',  rating: 5, product: 'Khajur Mix',           text: 'I\'m a diabetic and was worried about dates but my doctor said the natural sugars in Khajur Mix are fine in moderation. My energy levels are so much better.' },
  { id: 't36', author: 'Rajesh Nambiar',    location: 'Kozhikode',   rating: 5, product: 'Flax Mix Seeds',       text: 'The omega-3 content in these seeds is exactly what I needed post my cardiac event. My cardiologist approved and I\'ve been on it for 8 months now.' },
  { id: 't37', author: 'Swati Deshpande',   location: 'Nashik',      rating: 5, product: 'Buttermilk Mix',       text: 'I run a small café and started serving this as a house special. Customers keep asking for the recipe. The spice blend is perfectly balanced.' },
  { id: 't38', author: 'Mohan Das',         location: 'Bhubaneswar', rating: 4, product: 'Khajur Seed Powder',   text: 'Good product with visible results over time. I mix it with ashwagandha milk and it\'s become my evening ritual. Packaging could be improved but product is great.' },
  { id: 't39', author: 'Leela Krishnamurthy',location: 'Bengaluru',  rating: 5, product: 'Jumbo Kajur',          text: 'I\'ve been buying dates for 30 years and these are among the best I\'ve had. Meaty, sweet, and absolutely fresh. ARF has a loyal customer in me.' },
  { id: 't40', author: 'Tarun Malhotra',    location: 'Amritsar',    rating: 5, product: 'Ghee Roasted Seeds',   text: 'Being Punjabi, ghee is sacred to us. The quality of ghee used in these seeds is evident from the first bite. Authentic and delicious.' },
  { id: 't41', author: 'Saranya Murugan',   location: 'Coimbatore',  rating: 5, product: 'Flax Mix Seeds',       text: 'My mother-in-law who is very particular about food quality gave these a thumbs up. That\'s the highest endorsement possible in our household!' },
  { id: 't42', author: 'Girish Kamath',     location: 'Udupi',       rating: 5, product: 'Buttermilk Mix',       text: 'Being from coastal Karnataka, buttermilk is part of our culture. This mix captures the authentic taste perfectly. Reminds me of my grandmother\'s kitchen.' },
  { id: 't43', author: 'Preeti Saxena',     location: 'Agra',        rating: 4, product: 'Khajur Mix',           text: 'Good product, fast delivery. The Khajur Mix is a great healthy snack option. I keep it in my office drawer for afternoon hunger pangs.' },
  { id: 't44', author: 'Balachandran K',    location: 'Thrissur',    rating: 5, product: 'Khajur Seed Powder',   text: 'Traditional medicine has always valued date seeds. ARF has made it accessible and convenient. My whole family uses it and we\'ve all noticed better sleep.' },
  { id: 't45', author: 'Namrata Joshi',     location: 'Pune',        rating: 5, product: 'Ghee Roasted Seeds',   text: 'I\'m a fitness trainer and I recommend these to all my clients as a post-workout snack. Clean ingredients, good macros, and most importantly — delicious.' },
  { id: 't46', author: 'Sridhar Iyengar',   location: 'Bengaluru',   rating: 5, product: 'Jumbo Kajur',          text: 'Ordered 3 boxes for Diwali gifting. Everyone loved them. The dates are beautifully packed and taste premium. Will make this my go-to festive gift.' },
  { id: 't47', author: 'Kamala Devi',       location: 'Tirupati',    rating: 5, product: 'Flax Mix Seeds',       text: 'My nutritionist put me on a seed rotation diet and ARF\'s Flax Mix fits perfectly. The quality is consistent every time I order. Very reliable brand.' },
  { id: 't48', author: 'Ashwin Rao',        location: 'Bengaluru',   rating: 5, product: 'Buttermilk Mix',       text: 'I work in tech and sit for long hours. The Buttermilk Mix after lunch has genuinely helped with my afternoon energy slump. No more 3pm coffee needed!' },
  { id: 't49', author: 'Jayalakshmi S',     location: 'Salem',       rating: 5, product: 'Khajur Mix',           text: 'My son is an athlete and the Khajur Mix is his favourite recovery food. Natural, nutritious, and he actually enjoys eating it. ARF understands health.' },
  { id: 't50', author: 'Prakash Hegde',     location: 'Dharwad',     rating: 5, product: 'Ghee Roasted Seeds',   text: 'Five stars isn\'t enough. The Ghee Roasted Seeds are a masterpiece of simple, honest food. No unnecessary additives, just pure flavour. ARF for life!' },
];

/** Returns static + any good user-submitted feedbacks merged together */
export function getAllTestimonials(): Testimonial[] {
  try {
    const saved: { id: string; author: string; location: string; rating: number; productName: string; text: string }[] =
      JSON.parse(localStorage.getItem('arf_product_feedback') || '[]');
    const dynamic: Testimonial[] = saved.map((f) => ({
      id: f.id,
      author: f.author,
      location: f.location,
      rating: f.rating,
      product: f.productName,
      text: f.text,
    }));
    return [...dynamic, ...staticTestimonials];
  } catch {
    return staticTestimonials;
  }
}

// Keep backward-compat export
export const testimonials = staticTestimonials;
