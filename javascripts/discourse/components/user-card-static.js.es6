import UserCardContents from "discourse/components/user-card-contents";

export default UserCardContents.extend({
  layoutName: "components/user-card-contents",
  elementId: null,
  // Overriding functions which cause the user card to show/hide based on mouse/keyboard events:
  cleanUp() {},
  didInsertElement() {},
  willDestroyElement() {},
  keyUp() {}
});
