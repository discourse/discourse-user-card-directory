import { action, computed } from "@ember/object";
import UserCardContents from "discourse/components/user-card-contents";

export default class UserCardStaticContents extends UserCardContents {
  layoutName = "components/user-card-contents";
  elementId = null;

  // Overriding functions which cause the user card to show/hide based on mouse/keyboard events:
  cleanUp() {}

  didInsertElement() {}

  willDestroyElement() {}
  keyUp() {}

  @computed("user.last_seen_at")
  get contentHidden() {
    // we don't have the full user data available
    // so if last_seen_at is missing, treat the profile as hidden
    return !this.user?.last_seen_at;
  }

  // need to override this to work with the loading slider
  @action
  handleShowUser() {
    return;
  }
}
