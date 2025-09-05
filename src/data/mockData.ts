import type { Post } from "../types";

export const mockPosts: Post[] = [
  {
    id: "post_001",
    title: "Amazing sunset photos from my vacation",
    content:
      "Just got back from an incredible trip to Bali. The sunsets there are absolutely breathtaking! Here are some photos I took during my stay. The colors in the sky were beyond anything I could have imagined.",
    author: {
      id: "user_001",
      username: "wanderlust_jane",
    },
    reportedReason: "Spam",
    reportedAt: "2025-01-20T14:30:00Z",
    status: "pending",
    reportCount: 2,
    images: [
      "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "post_002",
    title: "New restaurant review - terrible service!",
    content:
      "Went to this new place downtown last night. The food was okay but the service was absolutely horrible. The waiter was rude and kept us waiting for over an hour. Would not recommend to anyone.",
    author: {
      id: "user_002",
      username: "foodie_mike",
    },
    reportedReason: "Harassment",
    reportedAt: "2025-01-20T12:15:00Z",
    status: "pending",
    reportCount: 5,
  },
  {
    id: "post_003",
    title: "Check out my new business venture!",
    content:
      "Hey everyone! I just started my own consulting business and I'm looking for clients. We specialize in digital marketing and social media growth. Contact me for a free consultation!",
    author: {
      id: "user_003",
      username: "entrepreneur_alex",
    },
    reportedReason: "Inappropriate Content",
    reportedAt: "2025-01-20T09:45:00Z",
    status: "pending",
    reportCount: 1,
  },
  {
    id: "post_004",
    title: "Great community event last weekend",
    content:
      "The local charity run was amazing! So many people came out to support a great cause. We raised over $10,000 for the local food bank. Thanks to everyone who participated!",
    author: {
      id: "user_004",
      username: "community_helper",
    },
    reportedReason: "Misinformation",
    reportedAt: "2025-01-19T16:20:00Z",
    status: "approved",
    reportCount: 1,
  },
  {
    id: "post_005",
    title: "Selling brand new iPhone - cheap!",
    content:
      "Brand new iPhone 15 Pro Max for sale. Still in box, never opened. Selling for $200 cash only. Contact me ASAP as I need to sell quickly!",
    author: {
      id: "user_005",
      username: "deals_hunter",
    },
    reportedReason: "Scam",
    reportedAt: "2025-01-19T11:30:00Z",
    status: "rejected",
    reportCount: 8,
  },
  {
    id: "post_006",
    title: "Weekly workout routine sharing",
    content:
      "Sharing my weekly workout routine that has been working great for me. Monday: Chest and triceps, Tuesday: Back and biceps, Wednesday: Rest day, Thursday: Legs, Friday: Shoulders, Weekend: Cardio and flexibility.",
    author: {
      id: "user_006",
      username: "fitness_guru",
    },
    reportedReason: "Off-topic",
    reportedAt: "2025-01-19T08:15:00Z",
    status: "pending",
    reportCount: 1,
  },
  {
    id: "post_007",
    title: "Political discussion getting heated",
    content:
      "I think we need to have a serious discussion about the current political climate. The recent policies have been affecting our community in ways that we need to address.",
    author: {
      id: "user_007",
      username: "political_observer",
    },
    reportedReason: "Political Content",
    reportedAt: "2025-01-18T19:45:00Z",
    status: "pending",
    reportCount: 12,
  },
  {
    id: "post_008",
    title: "Recipe share: Grandma's chocolate cookies",
    content:
      "My grandmother's secret chocolate cookie recipe that has been in our family for generations. Ingredients: 2 cups flour, 1 cup butter, 1/2 cup cocoa powder, 1 cup sugar, 2 eggs, 1 tsp vanilla extract...",
    author: {
      id: "user_008",
      username: "baker_betty",
    },
    reportedReason: "Copyright",
    reportedAt: "2025-01-18T15:30:00Z",
    status: "approved",
    reportCount: 1,
  },
  ...Array.from({ length: 25 }).map<Post>((_, i) => ({
    id: `post_${9 + i}`,
    title: `Sample pending post ${i + 9}`,
    content: `This is a mock pending post number ${
      i + 9
    }. It's generated for pagination testing with random reported reasons and counts.`,
    author: {
      id: `user_${9 + i}`,
      username: `user_${9 + i}`,
    },
    reportedReason: [
      "Spam",
      "Harassment",
      "Scam",
      "Off-topic",
      "Misinformation",
      "Inappropriate Content",
    ][i % 6],
    reportedAt: `2025-01-${18 + (i % 10)}T${String(10 + (i % 10)).padStart(
      2,
      "0"
    )}:00:00Z`,
    status: "pending" as const, 
    reportCount: (i % 12) + 1,
  })),
];
