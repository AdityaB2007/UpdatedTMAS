export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  school?: string;
  department: string;
  image: string;
}

export const allTeamMembers: TeamMember[] = [
  // Executive Board
  {
    id: "aditya-baisakh",
    name: "Aditya Baisakh",
    role: "Chief Executive Officer",
    bio: "From Baton Rouge, current student at LSU. Authored the AP Chemistry book and co-wrote the AP Biology book in his senior year. Currently working on overseeing operations for TMAS Academy. Enjoys martial arts, coding, and piano.",
    school: "Louisiana State University",
    department: "Executive Board",
    image: "/team_photos/aditya.png"
  },
  {
    id: "shivek-saraf",
    name: "Shivek Saraf",
    role: "Chief Operating Officer",
    bio: "Student at McNeil High School. Joined TMAS a year ago to apply AI skills to education, particularly AP Classes. Enjoys automating tasks and solving Rubik's Cubes.",
    school: "Louisiana State University",
    department: "Executive Board",
    image: "/team_photos/shivek.JPG"
  },

  // Founder
  {
    id: "ritvik-rustagi",
    name: "Ritvik Rustagi",
    role: "Founder",
    bio: "Born in 2007, Ritvik is the founder of TMAS Academy. He is the author of the prominent books ACE The AMC 10/12, ACE AP Physics 1, ACE AP Calculus AB, ACE AP Calculus BC, and ACE AP Physics C: Mechanics. He started the program in 2021 and attends Carnegie Mellon University. His interests include physics, math, coding, running, and music.",
    school: "Carnegie Mellon University",
    department: "Founder",
    image: "/ritvik_photos/photo_1.avif"
  },

  // Published Authors
  {
    id: "aditya-baisakh",
    name: "Aditya Baisakh",
    role: "AP Chem, AP Bio",
    bio: "From Baton Rouge, current student at LSU. Authored the AP Chemistry book and co-wrote the AP Biology book in his senior year. Currently working on overseeing operations for TMAS Academy. Enjoys martial arts, coding, and piano.",
    school: "Louisiana State University",
    department: "Published Authors",
    image: "/team_photos/aditya.png"
  },
  {
    id: "ritvik-rustagi",
    name: "Ritvik Rustagi",
    role: "AP Calc AB/BC, AP Physics 1/C, AMC 10/12",
    bio: "Born in 2007, Ritvik is the founder of TMAS Academy. He is the author of the prominent books ACE The AMC 10/12, ACE AP Physics 1, ACE AP Calculus AB, ACE AP Calculus BC, and ACE AP Physics C: Mechanics. He started the program in 2021 and attends Carnegie Mellon University. His interests include physics, math, coding, running, and music.",
    school: "Carnegie Mellon University",
    department: "Published Authors",
    image: "/ritvik_photos/photo_1.avif"
  },
  {
    id: "aviva-iyerkhan",
    name: "Aviva Iyerkhan",
    role: "AP CSP",
    bio: "Senior at Lynbrook High School in San Jose, California. Provided STEM education through tutoring and curriculum creation, joining TMAS to help students succeed in STEM.",
    school: "Lynbrook High School",
    department: "Published Authors",
    image: "/team_photos/aviva.png"
  },
  {
    id: "ipsaan-sedhai",
    name: "Ipsaan Sedhai",
    role: "AP CSP",
    bio: "Student at Sewanhaka High School interested in Physics, Computer Science, and Math. Wrote the ACE AP CSP book to make exam resources more accessible.",
    school: "Sewanhaka High School",
    department: "Published Authors",
    image: "/team_photos/ipsaan.png"
  },
  {
    id: "shivek-saraf",
    name: "Shivek Saraf",
    role: "AP Psych, AP HUG",
    bio: "Student at McNeil High School. Joined TMAS a year ago to apply AI skills to education, particularly AP Classes. Enjoys automating tasks and solving Rubik's Cubes.",
    school: "McNeil High School",
    department: "Published Authors",
    image: "/team_photos/shivek.JPG"
  },
  {
    id: "abby-trinh",
    name: "Abby Trinh",
    role: "AP Bio",
    bio: "Rising 10th grader with interests in math, biology, and chemistry. Authored the AP Bio Book. Participates in math competitions and enjoys problem-solving and community involvement.",
    department: "Published Authors",
    image: "/team_photos/abby.png"
  },

  // Academic Writing
  {
    id: "shreyas-penugonda",
    name: "Shreyas Penugonda",
    role: "",
    bio: "Passionate about computer science, coding, problem-solving, and math contests. Enjoys soccer and watching TV in free time.",
    department: "Academic Writing Interns",
    image: "/team_photos/shreyas.jpg"
  },
  /*
  {
    id: "mustafa-hameed",
    name: "Mustafa Hameed",
    role: "",
    bio: "High school student passionate about education, innovation, and impact. Authored a book on mindset and launched AI projects. Strong in writing, design, and leadership.",
    department: "Academic Writing Interns",
    image: "/team_photos/mustafa.png"
  },
  */
  /*
  {
    id: "mohnish-chintalapudi",
    name: "Mohnish Chintalapudi",
    role: "",
    bio: "Academic writing intern and rising sophomore at Alliance Academy for Innovation. Excited to contribute to academia and research.",
    school: "Alliance Academy for Innovation",
    department: "Academic Writing Interns",
    image: "/team_photos/mohnish.jpeg"
  },
  */
  {
    id: "sanjay-rameshkrishnan",
    name: "Sanjay Rameshkrishnan",
    role: "",
    bio: "Academic Writing intern, 9th grader at Seminole High School. Interested in math, physics, and C++ programming. Aims to create positive impact through STEM knowledge sharing.",
    school: "Seminole High School",
    department: "Academic Writing Interns",
    image: "/team_photos/sanjay.png"
  },
  {
    id: "anmol-alva",
    name: "Anmol Alva",
    role: "",
    bio: "Rising 9th grader at Blue Valley High School in Overland Park, Kansas. Loves mathematics, computer science, debate, speech, and writing. Has published 3 books and teaches neighborhood kids.",
    school: "Blue Valley High School",
    department: "Academic Writing Interns",
    image: "/team_photos/anmol.jpg"
  },
  {
    id: "sricharan-pullela",
    name: "Sricharan Pullela",
    role: "",
    bio: "Student at Mountain House High School. Joined TMAS as writing intern to share skills with academically inclined audience. Hobbies include chess and basketball.",
    school: "Mountain House High School",
    department: "Academic Writing Interns",
    image: "/team_photos/sricharan.jpg"
  },
  {
    id: "nishanth-kotapati",
    name: "Nishanth Kotapati",
    role: "",
    bio: "Rising junior at Forsyth Central High School and Academic Writing Intern. Passionate about STEM education, writing, and mentorship with experience in research, healthcare, and robotics.",
    school: "Forsyth Central High School",
    department: "Academic Writing Interns",
    image: "/team_photos/nishanth.jpg"
  },
  {
    id: "ziang-zhuang",
    name: "Ziang Zhuang",
    role: "",
    bio: "TMAS Academy Server Moderator/Admin and author of the AMC 8 Book. Mathematics, physics, and earth science enthusiast. Enjoys swimming and piano.",
    department: "Academic Writing Interns",
    image: "/team_photos/ziang.jpeg"
  },
  {
    id: "pranav-saravanan",
    name: "Pranav Saravanan",
    role: "",
    bio: "Aspiring innovator passionate about math, finance, and technology. Creates educational content simplifying complex topics. Experience in research, competitions, and coding.",
    department: "Academic Writing Interns",
    image: "/team_photos/pranav.png"
  },
  {
    id: "abhiram-kothapalli",
    name: "Abhiram Kothapalli",
    role: "",
    bio: "Academic writing intern focusing on editing and refining books for quality and clarity. Passionate about organizing complex ideas for clear knowledge flow.",
    department: "Academic Writing Interns",
    image: "/team_photos/abhiram.png"
  },
  {
    id: "alisha-fatima",
    name: "Alisha Fatima",
    role: "",
    bio: "Academic writer contributing to TMAS Academy's educational content development.",
    department: "Academic Writing Interns",
    image: "/team_photos/alisha.png"
  },

  // Marketing Team
  {
    id: "katelyn-thilak",
    name: "Katelyn Thilak",
    role: "Marketing Lead",
    bio: "Student at Irvington High School. Marketing Leader guiding interns and leading social media campaigns, school outreach, and content creation. Passionate about taekwondo, badminton, piano, and creativity.",
    school: "Irvington High School",
    department: "Marketing Team",
    image: "/team_photos/katelyn.jpg"
  },
  {
    id: "mahado-abdirahman",
    name: "Mahado Abdirahman",
    role: "Marketing Lead",
    bio: "Leads marketing efforts for TMAS, leveraging creative expertise to drive education awareness and engagement.",
    department: "Marketing Team",
    image: "/team_photos/mahado.jpg"
  },
  /*
  {
    id: "sujay-oggu",
    name: "Sujay Oggu",
    role: "Marketing Intern",
    bio: "Upcoming junior at Mountain House High School. Joined as intern to help students succeed in AP exams and classes.",
    school: "Mountain House High School",
    department: "Marketing Team",
    image: "/team_photos/sujay.jpg"
  },
  */
  /*
  {
    id: "sasmit-chatterjee",
    name: "Sasmit Chatterjee",
    role: "Marketing Intern",
    bio: "High school student with passion for mechanical and aerospace engineering. Hobbies include chess, kickboxing, piano, and tennis.",
    department: "Marketing Team",
    image: "/team_photos/sasmit.png"
  },
  */
 /*
  {
    id: "rayyan-siddiqui",
    name: "Rayyan Siddiqui",
    role: "Marketing Intern",
    bio: "Student passionate about Computer Science, Programming, and Business.",
    department: "Marketing Team",
    image: "/team_photos/rayyan.jpeg"
  },
  */
 /*
  {
    id: "eliana-zerie",
    name: "Eliana Zerie",
    role: "Marketing Intern",
    bio: "Rising junior from Minnesota. Violinist who enjoys playing tennis. Excited to work with others as Marketing Intern.",
    department: "Marketing Team",
    image: "/team_photos/eliana.jpg"
  },
  */
  {
    id: "dainna-park",
    name: "Dainna Park",
    role: "Marketing Intern",
    bio: "Marketing intern passionate about business, computer science, and building meaningful connections through strategic marketing. Enjoys swimming, hiking, and traveling.",
    department: "Marketing Team",
    image: "/team_photos/dainna.jpeg"
  },
  {
    id: "bonnie-kim",
    name: "Bonnie Kim",
    role: "Marketing Intern",
    bio: "Really passionate about math. From a rural background, hopes to increase STEM resource availability through TMAS.",
    department: "Marketing Team",
    image: "/team_photos/bonnie.webp"
  },
  {
    id: "aashna-mishra",
    name: "Aashna Mishra",
    role: "Marketing Intern",
    bio: "Senior from Texas. 3rd degree black belt instructor who enjoys trying new restaurants and coffee shops.",
    department: "Marketing Team",
    image: "/team_photos/aashna.png"
  },
  {
    id: "vidushi-nalakonda",
    name: "Vidushi Nalakonda",
    role: "Marketing Intern",
    bio: "Marketing intern and rising senior from Texas. Wants to pursue CS or SDS. Enjoys reading, baking, and trying new foods.",
    department: "Marketing Team",
    image: "/team_photos/vidushi.png"
  },
  /*
  {
    id: "akshatha-jagan",
    name: "Akshatha Jagan",
    role: "Marketing Intern",
    bio: "Rising sophomore at Mountain House High School in California. Loves the beach, exploring new places, and entrepreneurial activities.",
    school: "Mountain House High School",
    department: "Marketing Team",
    image: "/team_photos/akshatha.png"
  },
  */
  {
    id: "ganga-nair",
    name: "Ganga Nair",
    role: "Marketing Intern",
    bio: "From North Carolina, very interested in Science and excited to contribute to TMAS initiatives.",
    department: "Marketing Team",
    image: "/team_photos/ganga.png"
  },
  /*
  {
    id: "abiramy-radhakrishnan",
    name: "Abiramy Radhakrishnan",
    role: "Marketing Intern",
    bio: "High school student at Hebron with passion for healthcare. Part of student-led organizations, joined TMAS marketing internship to build communication and outreach skills.",
    school: "Hebron High School",
    department: "Marketing Team",
    image: "/team_photos/abiramy.jpg"
  },
  */
  {
    id: "jaden-ryu",
    name: "Jaden Ryu",
    role: "Marketing Intern",
    bio: "Marketing intern contributing to TMAS Academy's outreach and engagement efforts.",
    department: "Marketing Team",
    image: "/team_photos/jaden.png"
  },
  /*
  {
    id: "kunsh-ahuja",
    name: "Kunsh Ahuja",
    role: "Marketing Intern",
    bio: "Marketing Intern with interests in math, programming, and technology. Enjoys chess, coding, and swimming.",
    department: "Marketing Team",
    image: "/team_photos/kunsh.jpeg"
  },
  */
  {
    id: "jalali-hora",
    name: "Jalali Hora",
    role: "Marketing Intern",
    bio: "Goes by 'Jako.' Interests include basketball and weightlifting. Enjoys hanging with friends and working on various projects while staying curious.",
    department: "Marketing Team",
    image: "/team_photos/jalali.png"
  },
  /*
  {
    id: "neelesh-nayak",
    name: "Neelesh Nayak",
    role: "Marketing Intern",
    bio: "Marketing intern with strong passion for academics and student success. Top student at Oakridge S.S. with 99% average. Committed to helping students access quality free academic resources.",
    school: "Oakridge Secondary School",
    department: "Marketing Team",
    image: "/team_photos/neelesh.png"
  },
  */

  // Software Engineers
  {
    id: "dhairya-shah",
    name: "Dhairya Shah",
    role: "",
    bio: "IB student passionate about building innovative digital experiences that are fast, intuitive, and accessible. Part of DECA, STEM, and coding clubs. Plays guitar.",
    department: "Software Engineers",
    image: "/team_photos/dhairya.jpg"
  },
  {
    id: "eric-chen",
    name: "Eric Chen",
    role: "",
    bio: "IBDP and AP student from Toronto. Enjoys solving physics problems, programming, taking walks, and trying new foods.",
    school: "Toronto",
    department: "Software Engineers",
    image: "/team_photos/eric.png"
  },
  {
    id: "sarvesh-sekar",
    name: "Sarvesh Sekar",
    role: "",
    bio: "Incoming systems design engineering student at University of Waterloo. Loves creating interdisciplinary software projects. Passionate environmentalist, researcher, and tech enthusiast.",
    school: "University of Waterloo",
    department: "Software Engineers",
    image: "/team_photos/sarvesh.png"
  },
  {
    id: "devesh-mamidi",
    name: "Devesh Mamidi",
    role: "",
    bio: "CS major at UCSB. Experienced in programming full-stack applications with React and Python. Helped develop the chatbot for TMAS Academy during the summer of 2025.",
    school: "University of California Santa Barbara",
    department: "Software Engineers",
    image: "/team_photos/devesh.png"
  },
  {
    id: "aarnav-shah",
    name: "Aarnav Shah",
    role: "",
    bio: "",
    school: "University of Waterloo",
    department: "Software Engineers",
    image: "/team_photos/aarnav.jpg"
  },
  {
    id: "shivek-saraf",
    name: "Shivek Saraf",
    role: "",
    bio: "Incoming systems design engineering student at University of Waterloo. Loves creating interdisciplinary software projects. Passionate environmentalist, researcher, and tech enthusiast.",
    school: "McNeil High School",
    department: "Software Engineers",
    image: "/team_photos/shivek.JPG"
  }
];

export const departments = [
  "Founder",
  "Executive Board",
  "Published Authors",
  "Academic Writing Interns",
  "Marketing Team",
  "Software Engineers"
];

export const getTeamByDepartment = (department: string): TeamMember[] => {
  return allTeamMembers.filter(member => member.department === department);
};

export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return allTeamMembers.find(member => member.id === id);
};

export const missionStatement = "TMAS Academy is an educational organization founded in 2021 dedicated to providing free AP and competitive math resources. The academy aims to educate people through comprehensive content with a focus on making quality STEM education accessible to students.";

export const ourStory = "TMAS Academy was founded in 2021 by Ritvik Rustagi with a vision to make quality STEM education accessible to all students. Starting with free AP and competitive math resources, the organization has grown to include a team of dedicated students and educators committed to creating comprehensive educational content. The academy now serves a community of 500+ Discord members and offers multiple study guides across various AP subjects and competitive math topics.";
