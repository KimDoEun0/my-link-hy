import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ProfileConfig,
  ContentBlock,
  ThemeConfig,
} from "@/types/mylink";
import {
  initialProfile,
  initialBlocks,
  initialTheme,
} from "@/data/initialData";

export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  blockClicks: Record<string, number>;
}

interface MyLinkStoreState {
  profile: ProfileConfig;
  blocks: ContentBlock[];
  theme: ThemeConfig;
  analytics: AnalyticsData;
  _hasHydrated: boolean;

  setProfile: (profile: Partial<ProfileConfig>) => void;
  setBlocks: (blocks: ContentBlock[]) => void;
  addBlock: (block: Omit<ContentBlock, "id" | "order">) => void;
  deleteBlock: (id: string) => void;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  recordView: () => void;
  recordClick: (blockId: string) => void;
  resetToInitial: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useMyLinkStore = create<MyLinkStoreState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      blocks: initialBlocks,
      theme: initialTheme,
      analytics: {
        totalViews: 0,
        totalClicks: 0,
        blockClicks: {},
      },
      _hasHydrated: false,

      setProfile: (newProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...newProfile },
        })),

      setBlocks: (blocks) => set({ blocks }),
      
      addBlock: (newBlock) =>
        set((state) => {
          const maxOrder = state.blocks.reduce(
            (max, b) => Math.max(max, b.order || 0),
            0
          );
          const createdBlock: ContentBlock = {
            ...newBlock,
            id: `link-${Date.now()}`,
            order: maxOrder + 1,
            isVisible: newBlock.isVisible !== undefined ? newBlock.isVisible : true,
          };
          return {
            blocks: [...state.blocks, createdBlock],
          };
        }),

      deleteBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
        })),

      setTheme: (newTheme) =>
        set((state) => ({
          theme: { ...state.theme, ...newTheme },
        })),

      recordView: () =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            totalViews: state.analytics.totalViews + 1,
          },
        })),

      recordClick: (blockId) =>
        set((state) => {
          const currentCount = state.analytics.blockClicks[blockId] || 0;
          return {
            analytics: {
              ...state.analytics,
              totalClicks: state.analytics.totalClicks + 1,
              blockClicks: {
                ...state.analytics.blockClicks,
                [blockId]: currentCount + 1,
              },
            },
          };
        }),

      resetToInitial: () =>
        set({
          profile: initialProfile,
          blocks: initialBlocks,
          theme: initialTheme,
          analytics: {
            totalViews: 0,
            totalClicks: 0,
            blockClicks: {},
          },
        }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "mylink_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
