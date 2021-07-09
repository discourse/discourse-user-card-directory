import Component from "@ember/component";
import { inject as service } from "@ember/service";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
  router: service("router"),
  tagName: "",

  @discourseComputed("router.currentRoute.queryParams.cards")
  showingCards(cardsParam) {
    return cardsParam === "yes";
  },

  actions: {
    toggleCards() {
      const newValue = this.showingCards ? "no" : "yes";
      this.router.transitionTo({ queryParams: { cards: newValue } });
    },
  },
});
