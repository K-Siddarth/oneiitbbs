import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

// Sample society events data
const societyEvents = [
  // Neuromancers events
  {
    title: "Hackathon 2025",
    date: "2025-09-20T10:00:00Z",
    description: "Join us for a 24-hour coding marathon with exciting prizes and mentorship from industry experts!",
    society: "neuromancers",
    type: "upcoming"
  },
  {
    title: "AI Workshop Series",
    date: "2025-10-05T14:00:00Z",
    description: "Hands-on session on building AI models using Python and TensorFlow.",
    society: "neuromancers",
    type: "upcoming"
  },
  {
    title: "Tech Talk: Future of AI",
    date: "2024-12-15T16:00:00Z",
    description: "Guest speaker from Google AI discussing the latest trends in artificial intelligence.",
    society: "neuromancers",
    type: "past"
  },

  // Webnd events
  {
    title: "React Native Bootcamp",
    date: "2025-08-15T09:00:00Z",
    description: "Learn to build cross-platform mobile apps with React Native from scratch.",
    society: "webnd",
    type: "upcoming"
  },
  {
    title: "Web Development Challenge",
    date: "2025-09-10T10:00:00Z",
    description: "48-hour web development competition with themes announced on the spot.",
    society: "webnd",
    type: "upcoming"
  },
  {
    title: "CSS Animation Workshop",
    date: "2024-11-20T13:00:00Z",
    description: "Master advanced CSS animations and transitions for modern web design.",
    society: "webnd",
    type: "past"
  },

  // Nakshatra events
  {
    title: "Stargazing Night",
    date: "2025-07-25T20:00:00Z",
    description: "Night sky observation session with telescopes at the institute observatory.",
    society: "nakshatra",
    type: "upcoming"
  },
  {
    title: "Astronomy Quiz Competition",
    date: "2025-08-30T15:00:00Z",
    description: "Test your knowledge of the universe in this exciting quiz competition.",
    society: "nakshatra",
    type: "upcoming"
  },
  {
    title: "Solar Eclipse Viewing",
    date: "2024-10-12T12:00:00Z",
    description: "Special event to observe the annular solar eclipse with proper safety equipment.",
    society: "nakshatra",
    type: "past"
  },

  // FEBS events
  {
    title: "Startup Pitch Competition",
    date: "2025-09-05T10:00:00Z",
    description: "Present your innovative business ideas to a panel of entrepreneurs and investors.",
    society: "febs",
    type: "upcoming"
  },
  {
    title: "Entrepreneurship Workshop",
    date: "2025-10-20T14:00:00Z",
    description: "Learn the fundamentals of starting and running a successful business.",
    society: "febs",
    type: "upcoming"
  },
  {
    title: "Industry Networking Event",
    date: "2024-11-15T16:00:00Z",
    description: "Connect with business leaders and entrepreneurs from various industries.",
    society: "febs",
    type: "past"
  },

  // RISC events
  {
    title: "Research Paper Presentation",
    date: "2025-08-20T11:00:00Z",
    description: "Present your research findings and get feedback from faculty and peers.",
    society: "risc",
    type: "upcoming"
  },
  {
    title: "Science Exhibition 2025",
    date: "2025-09-25T09:00:00Z",
    description: "Showcase innovative science projects and compete for the best project award.",
    society: "risc",
    type: "upcoming"
  },
  {
    title: "Lab Safety Workshop",
    date: "2024-09-10T10:00:00Z",
    description: "Essential training on laboratory safety protocols and best practices.",
    society: "risc",
    type: "past"
  }
];

export const populateSocietyEvents = async () => {
  try {
    console.log('Populating society events...');

    for (const event of societyEvents) {
      await addDoc(collection(db, 'society_events'), event);
      console.log(`Added event: ${event.title}`);
    }

    console.log('Successfully populated all society events!');
  } catch (error) {
    console.error('Error populating society events:', error);
  }
};

// Uncomment the line below to run the population script
// populateSocietyEvents();

// This file is also visible to Expo Router under /app/scripts.
// Add a harmless default UI export so router path resolution does not fail.
export default function PopulateSocietyEventsScreen() {
  return null;
}