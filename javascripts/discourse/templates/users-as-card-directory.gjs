import { Input } from "@ember/component";
import { fn, hash } from "@ember/helper";
import { on } from "@ember/modifier";
import { htmlSafe } from "@ember/template";
import RouteTemplate from "ember-route-template";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import DButton from "discourse/components/d-button";
import DirectoryItemUserFieldValue from "discourse/components/directory-item-user-field-value";
import LoadMore from "discourse/components/load-more";
import PluginOutlet from "discourse/components/plugin-outlet";
import TableHeaderToggle from "discourse/components/table-header-toggle";
import basePath from "discourse/helpers/base-path";
import bodyClass from "discourse/helpers/body-class";
import dasherize from "discourse/helpers/dasherize";
import directoryColumnIsAutomatic from "discourse/helpers/directory-column-is-automatic";
import directoryColumnIsUserField from "discourse/helpers/directory-column-is-user-field";
import directoryItemValue from "discourse/helpers/directory-item-value";
import hideApplicationFooter from "discourse/helpers/hide-application-footer";
import lazyHash from "discourse/helpers/lazy-hash";
import withEventValue from "discourse/helpers/with-event-value";
import { i18n } from "discourse-i18n";
import ComboBox from "select-kit/components/combo-box";
import PeriodChooser from "select-kit/components/period-chooser";
import UserCardStatic from "../components/user-card-static";

export default RouteTemplate(
  <template>
    {{#if @controller.model.canLoadMore}}
      {{hideApplicationFooter}}
    {{/if}}

    {{bodyClass "users-page"}}

    <section>
      <LoadMore
        @selector=".user-card-directory .user-card-container"
        @action={{@controller.loadMore}}
      >
        <div class="container">
          <div class="users-directory directory">
            <PluginOutlet
              @name="users-top"
              @connectorTagName="div"
              @outletArgs={{lazyHash model=@controller.model}}
            />
            <div class="directory-controls">
              <div class="period-controls">
                <PeriodChooser
                  @period={{@controller.period}}
                  @onChange={{fn (mut @controller.period)}}
                  @fullDay={{false}}
                />
                {{#if @controller.lastUpdatedAt}}
                  <div class="directory-last-updated">
                    {{i18n "directory.last_updated"}}
                    {{@controller.lastUpdatedAt}}
                  </div>
                {{/if}}
              </div>
              <div class="inline-form">
                <label class="total-rows">
                  {{#if @controller.model.totalRows}}
                    {{i18n
                      "directory.total_rows"
                      count=@controller.model.totalRows
                    }}
                  {{/if}}
                </label>
                <Input
                  {{on
                    "input"
                    (withEventValue @controller.onUsernameFilterChanged)
                  }}
                  @value={{readonly @controller.emailInput}}
                  placeholder={{i18n "directory.filter_name"}}
                  class="filter-name no-blur"
                />
                {{#if @controller.showGroupFilter}}
                  <ComboBox
                    @value={{@controller.group}}
                    @content={{@controller.groupOptions}}
                    @onChange={{@controller.groupChanged}}
                    @options={{hash none="directory.group.all"}}
                    class="directory-group-selector"
                  />
                {{/if}}
                {{#if @controller.currentUser.staff}}
                  <DButton
                    @icon="wrench"
                    @action={{@controller.showEditColumnsModal}}
                    class="btn-default open-edit-columns-btn"
                  />
                {{/if}}
                <PluginOutlet
                  @name="users-directory-controls"
                  @outletArgs={{lazyHash model=@controller.model}}
                />
              </div>
            </div>

            <ConditionalLoadingSpinner @condition={{@controller.isLoading}}>
              {{#if @controller.userCards.length}}
                <div class="user-card-directory">
                  {{#each @controller.userCards as |userCard|}}
                    <div class="user-card-container">
                      <UserCardStatic
                        @user={{userCard.user}}
                        @visible={{true}}
                        @loading={{userCard.loading}}
                        @username={{userCard.user.username}}
                        @showUser={{@controller.userCardShowUser}}
                      />
                      {{#if settings.show_stats}}
                        <div class="user-card-directory-footer">
                          {{#each @controller.columns as |column|}}
                            <span
                              class="stat stat-{{dasherize column.name}}
                                stat-type-{{column.type}}"
                            >
                              <span class="value">
                                {{#if
                                  (directoryColumnIsUserField column=column)
                                }}
                                  <DirectoryItemUserFieldValue
                                    @item={{userCard.directoryItem}}
                                    @column={{column}}
                                  />
                                {{else}}
                                  {{directoryItemValue
                                    item=userCard.directoryItem
                                    column=column
                                  }}
                                {{/if}}
                              </span>
                              <span class="label">
                                <TableHeaderToggle
                                  @onToggle={{@controller.updateOrder}}
                                  @field={{column.name}}
                                  @icon={{column.icon}}
                                  @order={{@controller.order}}
                                  @asc={{@controller.asc}}
                                  @automatic={{directoryColumnIsAutomatic
                                    column=column
                                  }}
                                  @translated={{column.user_field_id}}
                                  @onActiveRender={{@controller.setActiveHeader}}
                                />
                              </span>
                            </span>
                          {{/each}}
                        </div>
                      {{/if}}
                    </div>
                  {{/each}}
                </div>
                <ConditionalLoadingSpinner
                  @condition={{@controller.model.loadingMore}}
                />
              {{else}}
                <div class="empty-state">
                  <div class="empty-state-body">
                    <p>
                      {{#if @controller.name}}
                        {{i18n "directory.no_results_with_search"}}
                      {{else}}
                        {{i18n "directory.no_results.body"}}
                        {{#if @controller.currentUser.staff}}
                          {{htmlSafe
                            (i18n
                              "directory.no_results.extra_body"
                              basePath=(basePath)
                            )
                          }}
                        {{/if}}
                      {{/if}}
                    </p>
                  </div>
                </div>
              {{/if}}
            </ConditionalLoadingSpinner>
          </div>
        </div>
      </LoadMore>
    </section>
  </template>
);
