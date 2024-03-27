import Component from "@ember/component";
import { service } from "@ember/service";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
  router: service(),
  tagName: "",

  @discourseComputed("router.currentRoute.queryParams.cards")
  showingCards(cardsParam) {
    return (
      cardsParam === "yes" ||
      (cardsParam === undefined && settings.default_view === "cards")
    );
  },

  actions: {
    toggleCards() {
      const newValue = this.showingCards ? "no" : "yes";
      this.router.transitionTo({ queryParams: { cards: newValue } });
    },
  },
});
