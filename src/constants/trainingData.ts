
// Sample data for trainers and training types
export const trainers = [
  { id: 1, name: "John Doe", specialty: "Fire Safety" },
  { id: 2, name: "Jane Smith", specialty: "Road Safety" },
  { id: 3, name: "Bob Johnson", specialty: "Industrial Safety" },
  { id: 4, name: "Alice Williams", specialty: "First Aid" },
];

export const trainingTypes = [
  { id: 1, name: "Fire Safety", category: "fire" },
  { id: 2, name: "Road Safety", category: "road" },
  { id: 3, name: "Industrial Safety", category: "industrial" },
  { id: 4, name: "First Aid", category: "first-aid" },
  { id: 5, name: "Hazardous Materials", category: "hazmat" },
];

// Form schema for event validation
export const formSchema = {
  title: { min: 3, message: "Title must be at least 3 characters" },
  date: { required: "Please select a date" },
  time: { min: 1, message: "Please enter a time" },
  type: { required: "Please select a training type" },
  trainer: { required: "Please select a trainer" },
  location: { optional: true },
  sendNotification: { default: false },
  notificationTitle: { optional: true },
  notificationBody: { optional: true },
};
