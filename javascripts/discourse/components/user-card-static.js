import { action } from "@ember/object";
import UserCardContents from "discourse/components/user-card-contents";
import discourseComputed from "discourse/lib/decorators";

export default class UserCardStaticContents extends UserCardContents {
  layoutName = "components/user-card-contents";
  elementId = null;

  // Overriding functions which cause the user card to show/hide based on mouse/keyboard events:
  cleanUp() {}

  didInsertElement() {}

  willDestroyElement() {}
  keyUp() {}

  @discourseComputed("user.last_seen_at")
  contentHidden(lastSeenAt) {
    // we don't have the full user data available
    // so it last_seen_at is missing, treat the profile as hidden
    return !lastSeenAt;
  }

  // need to override this to work with the loading slider
  @action
  handleShowUser() {
    return;
  }
}
