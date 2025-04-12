// src/mockData.js
import { v4 as uuidv4 } from "uuid";

export const mockUsers = [
  {
    id: "1",
    fullName: "Admin User",
    mobileNumber: "+1 (555) 123-4567",
    profilePhoto: "https://i.pravatar.cc/150?img=1",
    role: "admin",
  },
  {
    id: "2",
    fullName: "John Doe",
    mobileNumber: "+1 (555) 987-6543",
    profilePhoto: "https://i.pravatar.cc/150?img=2",
    role: "user",
  },
  {
    id: "3",
    fullName: "Jane Smith",
    mobileNumber: "+1 (555) 567-1234",
    profilePhoto: "https://i.pravatar.cc/150?img=3",
    role: "user",
  },
];

// Generate random date within a range
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Generate mock tasks
export const generateMockTasks = () => {
  const tasks = [];

  mockUsers.forEach((user) => {
    const numTasks = user.role === "admin" ? 3 : 5;

    for (let i = 0; i < numTasks; i++) {
      const now = new Date();
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      const deadline = randomDate(now, oneMonthLater);
      const createdAt = randomDate(
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        now
      );

      const statuses = ["pending", "submitted", "approved", "rejected"];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      tasks.push({
        id: uuidv4(),
        title: `Task ${i + 1} for ${user.fullName}`,
        description: `This is a detailed description for task ${
          i + 1
        } assigned to ${
          user.fullName
        }. It contains all the necessary information to complete the task successfully.`,
        progress: Math.floor(Math.random() * 101),
        deadline,
        status: randomStatus,
        userId: user.id,
        photos: [
          `https://picsum.photos/seed/${user.id}-${i}-1/300/200`,
          `https://picsum.photos/seed/${user.id}-${i}-2/300/200`,
        ],
        createdAt,
        adminComments:
          randomStatus === "rejected"
            ? "Please revise and resubmit"
            : undefined,
      });
    }
  });

  return tasks;
};

export const mockTasks = generateMockTasks();

// Current user context (simulating logged in user)
export const currentUser = { ...mockUsers[1] };

// Function to change current user (for demo purposes)
export const setCurrentUser = (userId) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (user) {
    Object.assign(currentUser, user);
  }
};
