import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";

export interface GlobalState {
  mediaType: string;
  navigationBarMode: number;
  portfolioProjectIndex: number;
}
export const StateKey: InjectionKey<Store<GlobalState>> = Symbol();

export default createStore<GlobalState>({
  state: {
    mediaType: "pc",
    navigationBarMode: 0,
    portfolioProjectIndex: 0
  },
  mutations: {
    setMediaType(state, payload) {
      state.mediaType = payload;
    },
    setNavigationBarMode(state, payload) {
      state.navigationBarMode = payload;
    },
    setPortfolioProjectIndex(state, payload) {
      state.portfolioProjectIndex = payload;
    }
  },
  actions: {
    setNavigationBarMode(context, payload) {
      context.commit("setNavigationBarMode", payload);
    }
  },
  modules: {}
});

export function useStore() {
  return baseUseStore(StateKey);
}
