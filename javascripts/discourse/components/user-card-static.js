import { action } from "@ember/object";
import UserCardContents from "discourse/components/user-card-contents";

export default UserCardContents.extend({
  layoutName: "components/user-card-contents",
  elementId: null,
  // Overriding functions which cause the user card to show/hide based on mouse/keyboard events:
  cleanUp() {},
  didInsertElement() {
    this._super(...arguments);
  },
  willDestroyElement() {
    this._super(...arguments);
  },
  keyUp() {},

  // need to override this to work with the loading slider
  @action
  handleShowUser() {
    return;
  },
});
