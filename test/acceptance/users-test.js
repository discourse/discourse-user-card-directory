import {
  acceptance,
  exists,
  count,
} from "discourse/tests/helpers/qunit-helpers";
import { test } from "qunit";
import { click, visit } from "@ember/test-helpers";

acceptance("User Card Directory", function (needs) {
  needs.pretender((server, helper) => {
    server.get("/directory_items", () => {
      return helper.response({
        directory_items: [
          {
            id: 1,
            likes_received: 0,
            likes_given: 0,
            topics_entered: 0,
            topic_count: 0,
            post_count: 0,
            posts_read: 0,
            days_visited: 1,
            user: {
              id: 1,
              username: "foo",
              name: "Foo",
              avatar_template:
                "/letter_avatar_proxy/v4/letter/f/3be4f8/{size}.png",
            },
          },
          {
            id: 2,
            likes_received: 0,
            likes_given: 0,
            topics_entered: 0,
            topic_count: 0,
            post_count: 0,
            posts_read: 0,
            days_visited: 1,
            user: {
              id: 2,
              username: "bar",
              name: "Bar",
              avatar_template:
                "/letter_avatar_proxy/v4/letter/b/3be4f8/{size}.png",
            },
          },
        ],
        meta: {
          last_updated_at: "2020-01-01T12:00:00.000Z",
          total_rows_directory_items: 2,
          load_more_directory_items:
            "/directory_items?order=likes_received&page=1&period=weekly",
        },
      });
    });

    server.get("/user-cards.json", () => {
      return helper.response({
        user_badges: [],
        badges: [],
        badge_types: [],
        users: [
          {
            id: 1,
            username: "foo",
            name: "Foo",
            avatar_template:
              "/letter_avatar_proxy/v4/letter/m/9fc348/{size}.png",
            last_posted_at: null,
            last_seen_at: "2018-11-26T11:49:48.721Z",
            created_at: "2018-09-20T11:14:39.341Z",
            ignored: false,
            muted: false,
            can_ignore_user: true,
            can_mute_user: true,
            can_send_private_messages: true,
            can_send_private_message_to_user: true,
            trust_level: 1,
            moderator: false,
            admin: false,
            title: null,
            badge_count: 1,
            user_fields: {},
            custom_fields: {},
            time_read: 0,
            recent_time_read: 0,
            primary_group_id: null,
            primary_group_name: null,
            primary_group_flair_url: null,
            primary_group_flair_bg_color: null,
            primary_group_flair_color: null,
            featured_topic: null,
            staged: false,
            date_of_birth: null,
            featured_user_badge_ids: [],
          },
          {
            id: 2,
            username: "bar",
            name: "Bar",
            avatar_template:
              "/letter_avatar_proxy/v4/letter/m/9fc348/{size}.png",
            last_posted_at: null,
            last_seen_at: "2018-11-26T11:49:48.721Z",
            created_at: "2018-09-20T11:14:39.341Z",
            ignored: false,
            muted: false,
            can_ignore_user: true,
            can_mute_user: true,
            can_send_private_messages: true,
            can_send_private_message_to_user: true,
            trust_level: 1,
            moderator: false,
            admin: false,
            title: null,
            badge_count: 1,
            user_fields: {},
            custom_fields: {},
            time_read: 0,
            recent_time_read: 0,
            primary_group_id: null,
            primary_group_name: null,
            primary_group_flair_url: null,
            primary_group_flair_bg_color: null,
            primary_group_flair_color: null,
            featured_topic: null,
            staged: false,
            date_of_birth: null,
            featured_user_badge_ids: [],
          },
        ],
      });
    });
  });

  test("Displays table when cards=no", async function (assert) {
    await visit("/u?cards=no");
    assert.ok($("body.users-page").length, "has the body class");
    assert.equal(count(".directory table tr"), 2, "has a list of users");
  });

  test("Displays cards when cards=yes", async function (assert) {
    await visit("/u?cards=yes");
    assert.equal(count(".user-card-avatar"), 2, "has two cards showing");
  });

  test("Can toggle between views", async function (assert) {
    await visit("/u?cards=no");
    assert.equal(count(".directory table tr"), 2, "has two table rows");
    await click(".toggle-cards-button");
    assert.equal(count(".user-card-avatar"), 2, "has two cards");
    await click(".toggle-cards-button");
    assert.equal(count(".directory table tr"), 2, "has two table rows");
  });
});
