import { action } from "@ember/object";
import UserCardContents from "discourse/components/user-card-contents";
import { getURLWithCDN } from "discourse-common/lib/get-url";

export default class UserCardStatic extends UserCardContents {
  layoutName = "components/user-card-contents";
  elementId = null;
  // Overriding functions which cause the user card to show/hide based on mouse/keyboard events:
  cleanUp() {}
  // eslint-disable-next-line ember/require-super-in-lifecycle-hooks
  didInsertElement() {}
  // eslint-disable-next-line ember/require-super-in-lifecycle-hooks
  willDestroyElement() {}
  keyUp() {}

  didRender() {
    this.setBackground();
  }

  @action
  setBackground() {
    if (!this.element) {
      return;
    }
    const container = this.element.querySelector(".d-user-card__container");
    if (!container) {
      return;
    }
    container.style.backgroundColor = `#${this.user.avatar_dominant_color}`;

    const backgroundUrl = this.user.card_background_upload_url;
    if (backgroundUrl) {
      container.style.background = `url(${getURLWithCDN(backgroundUrl)})`;
    }
  }

  // need to override this to work with the loading slider
  @action
  handleShowUser() {
    return;
  }
}
