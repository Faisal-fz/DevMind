// Placeholder user for the sidebar until authentication is added.

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: false,
};
