import create from 'zustand';

type UserState = {
  token: string | null;
  freeUses: number;
  subscribed: boolean;
  setToken: (t: string | null) => void;
  incUses: () => void;
  setSubscribed: (v: boolean) => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  token: null,
  freeUses: 0,
  subscribed: false,
  setToken: (t) => set({ token: t }),
  incUses: () => set({ freeUses: get().freeUses + 1 }),
  setSubscribed: (v) => set({ subscribed: v })
}));

