
interface Document {
  id: string;
  title: string;
  type: string;
  category: "Fire Safety" | "Road Safety" | "Industrial Safety";
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
  progress?: number;
}

export const documents: Document[] = [
  {
    id: "doc1",
    title: "Fire Safety Protocol 2024",
    type: "pdf",
    category: "Fire Safety",
    fileSize: "2.4 MB",
    uploadDate: "2024-01-15",
    downloadUrl: "/documents/fire-safety-protocol.pdf"
  },
  {
    id: "doc2",
    title: "Emergency Evacuation Guidelines",
    type: "pdf",
    category: "Fire Safety",
    fileSize: "1.8 MB",
    uploadDate: "2024-01-20",
    downloadUrl: "/documents/evacuation-guidelines.pdf"
  },
  {
    id: "doc3",
    title: "Road Safety Training Manual",
    type: "pdf",
    category: "Road Safety",
    fileSize: "3.2 MB",
    uploadDate: "2024-01-18",
    downloadUrl: "/documents/road-safety-manual.pdf"
  },
  {
    id: "doc4",
    title: "Traffic Rules Summary 2024",
    type: "xlsx",
    category: "Road Safety",
    fileSize: "1.5 MB",
    uploadDate: "2024-01-22",
    downloadUrl: "/documents/traffic-rules.xlsx"
  },
  {
    id: "doc5",
    title: "Monthly Safety Statistics",
    type: "xlsx",
    category: "Industrial Safety",
    fileSize: "956 KB",
    uploadDate: "2024-01-25",
    downloadUrl: "/documents/safety-stats.xlsx"
  }
];
