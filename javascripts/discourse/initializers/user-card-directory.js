import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";
import User from "discourse/models/user";
import EmberObject, { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import DiscourseURL, { userPath } from "discourse/lib/url";

export default {
  name: "user-card-directory",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.modifyClass("route:users", {
        pluginId: "user-card-directory",

        get templateName() {
          if (this.modelFor("users")?.showAsCards) {
            return "users-as-card-directory";
          } else {
            return "users";
          }
        },

        resetController(controller, isExiting) {
          this._super(...arguments);
          if (isExiting) {
            controller.set("cachedUserCardInfo", {});
          }
        },

        queryParams: {
          cards: { refreshModel: true },
        },

        model(params) {
          return this._super(params).then((model) => {
            model.showAsCards =
              params["cards"] === "yes" ||
              (params["cards"] === undefined &&
                settings.default_view === "cards");
            return model;
          });
        },
      });

      api.modifyClass("controller:users", {
        pluginId: "user-card-directory",
        cachedUserCardInfo: null,

        init() {
          this.set("cachedUserCardInfo", {});
          this._super(...arguments);
        },

        @discourseComputed("model.content.@each")
        userCards(allUsers) {
          if (!allUsers) {
            return [];
          }
          const toLoad = [];
          if (settings.hide_current_user && this.currentUser) {
            allUsers = allUsers.filter((u) => u.id !== this.currentUser.id);
          }
          const userCardInfos = allUsers.map((u) => {
            if (this.cachedUserCardInfo[u.id]) {
              return this.cachedUserCardInfo[u.id];
            }

            const userCardInfo = (this.cachedUserCardInfo[u.id] =
              EmberObject.create({
                user: User.create(u.user),
                directoryItem: u,
                loading: true,
              }));

            toLoad.push(userCardInfo);

            return userCardInfo;
          });

          const loadMax = 50;

          while (toLoad.length > 0) {
            const thisBatch = toLoad.splice(0, loadMax);
            const promise = ajax("/user-cards.json", {
              data: { user_ids: thisBatch.map((uc) => uc.user.id).join(",") },
            });
            thisBatch.forEach((uc) => {
              // Each user card expects its own promise
              // Rather than making a separate AJAX request for each
              // We re-use the `user-cards.json` promise, and manipulate the data
              const convertedPromise = promise.then((data) => {
                // Find the correct user from users, and put it in the user attribute
                // Use Object.assign to avoid contaminating the source object
                return Object.assign({}, data, {
                  user: data.users.find((u) => u.id === uc.user.id),
                });
              });
              return uc.user
                .findDetails({ existingRequest: convertedPromise })
                .finally(() => uc.set("loading", false));
            });
          }

          return userCardInfos;
        },

        @action
        userCardShowUser(user) {
          DiscourseURL.routeTo(userPath(user.username_lower));
        },
      });
    });
  },
};
