import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";
import User from "discourse/models/user";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";

export default {
  name: "user-card-directory",
  initialize(){
    withPluginApi("0.8.7", api => {
      api.modifyClass("controller:users", {
        cachedUserCardInfo: {},
        
        @discourseComputed("model.content.@each")
        userCards(allUsers) {
            const toLoad = [];
            const userCardInfos = allUsers.map(u => {
              if (this.cachedUserCardInfo[u.id]) {
                  return this.cachedUserCardInfo[u.id];
              }

              const userCardInfo = this.cachedUserCardInfo[u.id] = EmberObject.create({
                  user: User.create(u.user),
                  loading: true
              });

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
                  const convertedPromise = promise.then(data => {
                    // Find the correct user from users, and put it in the user attribute
                    // Use Object.assign to avoid contaminating the source object
                    return Object.assign({}, data, {
                        user: data.users.find(u => u.id === uc.user.id)
                    });
                  });
                  return uc.user
                    .findDetails({ existingRequest: convertedPromise })
                    .then(() => uc.set("loading", false));
              });
            }

            return userCardInfos;
        }

      });
    });
  }
}
