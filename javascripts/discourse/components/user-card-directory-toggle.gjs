import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";

export default class UserCardDirectoryToggle extends Component {
  @service router;

  get showingCards() {
    const { cards } = this.router.currentRoute.queryParams;

    return (
      cards === "yes" ||
      (cards === undefined && settings.default_view === "cards")
    );
  }

  @action
  toggleCards() {
    const newValue = this.showingCards ? "no" : "yes";
    this.router.transitionTo({ queryParams: { cards: newValue } });
  }

  <template>
    <DButton
      @action={{this.toggleCards}}
      @icon={{if this.showingCards "th-list" "id-card"}}
      @title={{themePrefix (if this.showingCards "show_table" "show_cards")}}
      class="btn-default open-edit-columns-btn toggle-cards-button"
    />
  </template>
}
