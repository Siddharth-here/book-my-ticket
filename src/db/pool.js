
export const users = [];

export const seats = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: null,
  isbooked: 0,
  user_id: null
}));

export const initDB = async () => {
  console.log("In-memory mock store ready (20 seats initialized).");
};