export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school?: string;
  quote: string;
  score?: string;
  subject?: string;
}

export const testimonials: Testimonial[] = [
  // Discord Community Testimonials
  {
    id: "bj13",
    name: "@bj13_",
    role: "Discord Community Member",
    quote: "What you guys are doing is unbelievable. Making these incredible resources available for free - students going into 9th, 10th, 11th, and 12th grade are very fortunate to have access to such rich educational materials. Thank you so much!",
    subject: "General"
  },
  {
    id: "ant-eater",
    name: "@ant__eater",
    role: "AMC 10 Student",
    quote: "This book helped me so much with my AMC 10 preparation. The content is comprehensive and really made a difference in my understanding of competition math concepts.",
    subject: "AMC 10"
  },
  {
    id: "patdatrick",
    name: "@patdatrick",
    role: "Discord Community Member",
    quote: "Huge respect for the AP Chemistry review book! The quality of the content and the effort put into making it accessible for everyone is truly commendable.",
    subject: "AP Chemistry"
  },
  {
    id: "c-bass",
    name: "@c.bass.",
    role: "Discord Community Member",
    quote: "Nice job with the AP Chemistry book! Looking forward to seeing more resources like this. The TMAS team is doing amazing work for students everywhere.",
    subject: "AP Chemistry"
  },
  // Original Testimonials
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "AP Calculus BC Student",
    school: "Mountain View High School",
    quote: "The ACE AP Calculus BC book was a game-changer for me. The practice problems are challenging but perfectly aligned with the actual exam. I went from struggling with series to confidently solving complex problems!",
    score: "5",
    subject: "AP Calculus BC"
  },
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    role: "AMC 12 Competitor",
    school: "Lincoln Academy",
    quote: "TMAS Academy's AMC book helped me achieve my goal of qualifying for AIME. The strategies and problem-solving techniques are explained so clearly. The approach really works!",
    score: "108",
    subject: "AMC 12"
  },
  {
    id: "emma-rodriguez",
    name: "Emma Rodriguez",
    role: "AP Physics 1 Student",
    school: "Riverside High School",
    quote: "I was intimidated by physics until I found TMAS Academy. The explanations are so clear and the Discord community is incredibly supportive. Got a 5 on my first try!",
    score: "5",
    subject: "AP Physics 1"
  },
  {
    id: "alex-kim",
    name: "Alex Kim",
    role: "AP Calculus AB Student",
    school: "Central High School",
    quote: "The free resources from TMAS Academy are better than most paid courses. The practice problems gradually build up difficulty, which helped me understand concepts deeply.",
    score: "5",
    subject: "AP Calculus AB"
  },
  {
    id: "priya-patel",
    name: "Priya Patel",
    role: "AIME Qualifier",
    school: "Tech High School",
    quote: "The strategies in the AMC book are incredible. I improved my score by 40 points in just 3 months! The Discord study groups were also super helpful for motivation.",
    score: "115",
    subject: "AMC 10"
  },
  {
    id: "david-thompson",
    name: "David Thompson",
    role: "AP Physics C Student",
    school: "Innovation Academy",
    quote: "Calculus-based physics seemed impossible until I used TMAS resources. The book breaks down complex concepts into manageable pieces. Highly recommend to anyone struggling!",
    score: "5",
    subject: "AP Physics C"
  }
];

export const getTestimonialsBySubject = (subject: string): Testimonial[] => {
  return testimonials.filter(testimonial =>
    testimonial.subject?.toLowerCase().includes(subject.toLowerCase())
  );
};

export const getTestimonialById = (id: string): Testimonial | undefined => {
  return testimonials.find(testimonial => testimonial.id === id);
};
