import { action } from "@ember/object";
import UserCardContents from "discourse/components/user-card-contents";

export default class UserCardStaticContents extends UserCardContents {
  layoutName = "components/user-card-contents";
  elementId = null;
  // Overriding functions which cause the user card to show/hide based on mouse/keyboard events:
  cleanUp() {}
  // eslint-disable-next-line ember/require-super-in-lifecycle-hooks
  didInsertElement() {}
  // eslint-disable-next-line ember/require-super-in-lifecycle-hooks
  willDestroyElement() {}
  keyUp() {}

  // need to override this to work with the loading slider
  @action
  handleShowUser() {
    return;
  }
}
