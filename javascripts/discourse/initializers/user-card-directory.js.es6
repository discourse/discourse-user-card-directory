import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";
import User from "discourse/models/user";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";

export default {
  name: "user-card-directory",
  initialize(container) {
    // This component provides a responsive template
    // Delete the core mobile one
    delete Ember.TEMPLATES["mobile/users"];

    withPluginApi("0.8.7", api => {
      api.modifyClass("route:users", {
        resetController(controller, isExiting) {
          this._super(...arguments);
          if (isExiting) {
            controller.set("cachedUserCardInfo", {});
          }
        }
      });

      api.modifyClass("controller:users", {
        cachedUserCardInfo: null,

        init(){
          this.set("cachedUserCardInfo", {});
          this._super(...arguments);
        },

        stats: [
          { name: "likes_received", icon: "heart" },
          { name: "likes_given", icon: "heart" },
          { name: "topic_count" },
          { name: "post_count" },
          { name: "topics_entered" },
          { name: "posts_read" },
          { name: "days_visited" }
        ],

        @discourseComputed("site.groups")
        availableGroups(groups) {
          return groups
            .map(g => {
              // prevents group "everyone" to be listed
              if (g.id !== 0) {
                return { name: g.name, value: g.name };
              }
            })
            .filter(Boolean);
        },

        @discourseComputed("model.content.@each")
        userCards(allUsers) {
          if (!allUsers) return [];
          const toLoad = [];
          const userCardInfos = allUsers.map(u => {
            if (this.cachedUserCardInfo[u.id]) {
              return this.cachedUserCardInfo[u.id];
            }

            const userCardInfo = (this.cachedUserCardInfo[
              u.id
            ] = EmberObject.create({
              user: User.create(u.user),
              directoryItem: u,
              loading: true
            }));

            toLoad.push(userCardInfo);

            return userCardInfo;
          });

          const loadMax = 50;

          while (toLoad.length > 0) {
            const thisBatch = toLoad.splice(0, loadMax);
            const promise = ajax("/user-cards.json", {
              data: { user_ids: thisBatch.map(uc => uc.user.id).join(",") }
            });
            thisBatch.forEach(uc => {
              // Each user card expects its own promise
              // Rather than making a separate AJAX request for each
              // We re-use the `user-cards.json` promise, and manipulate the data
              const convertedPromise = promise.then(data => {
                // Find the correct user from users, and put it in the user attribute
                // Use Object.assign to avoid contaminating the source object
                return Object.assign({}, data, {
                  user: data.users.find(u => u.id === uc.user.id)
                });
              });
              return uc.user
                .findDetails({ existingRequest: convertedPromise })
                .finally(() => uc.set("loading", false));
            });
          }

          return userCardInfos;
        }
      });
    });
  }
};
