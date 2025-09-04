import create from 'zustand';
import { persist } from 'zustand/middleware';

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

// Projects store (desktop + canvases)
export type Project = {
  id: string;
  name: string;
  createdAt: number;
  nodes: any[];
  edges: any[];
};

type ProjectsState = {
  projects: Project[];
  addProject: (p?: Partial<Project>) => string; // returns id
  getProject: (id: string) => Project | undefined;
  updateProject: (id: string, patch: Partial<Project>) => void;
  ensureDefault: () => void;
};

function defaultNodes() { return []; }

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (p = {}) => {
        const id = crypto.randomUUID();
        const proj: Project = {
          id,
          name: p.name || `Проект ${get().projects.length + 1}`,
          createdAt: Date.now(),
          nodes: p.nodes || defaultNodes(),
          edges: p.edges || []
        };
        set({ projects: [proj, ...get().projects] });
        return id;
      },
      getProject: (id) => get().projects.find((p) => p.id === id),
      updateProject: (id, patch) => {
        set({
          projects: get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p))
        });
      },
      ensureDefault: () => {
        if (get().projects.length === 0) {
          const id = crypto.randomUUID();
          const proj: Project = {
            id,
            name: 'Мой первый проект',
            createdAt: Date.now(),
            nodes: defaultNodes(),
            edges: []
          };
          set({ projects: [proj] });
        }
      }
    }),
    { name: 'ff-projects' }
  )
);
