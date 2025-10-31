---
title: How to disable HTML in WordPress comments without a plugin
description: Learn how to sanitize and escape WordPress comment content to prevent HTML from being rendered, ensuring security and integrity of user-generated content.
date: '2023-4-18'
categories:
  - wordpress
  - php
published: true
---

The code presented is a WordPress code snippet that modifies the behaviour of comments on a WordPress site. Specifically, it modifies the content of the comments to sanitise and escape any malicious or unintended input that could be submitted by users.

```php
function wpb_comment_post($incoming_comment)
{
  $incoming_comment['comment_content'] = htmlspecialchars($incoming_comment['comment_content']);
  $incoming_comment['comment_content'] = str_replace("'", "\'", $incoming_comment['comment_content']);
  return ($incoming_comment);
}
function wpb_comment_display($comment_to_display)
{
  $comment_to_display = str_replace("'", "\'", $comment_to_display);
  return ($comment_to_display);
}
add_filter('preprocess_comment', 'wpb_comment_post', 1);
add_filter('comment_text', 'wpb_comment_display', 1);
add_filter('comment_text_rss', 'wpb_comment_display', 1);
add_filter('comment_excerpt', 'wpb_comment_display', 1);
remove_filter('comment_text', 'make_clickable', 1);
```

The `wpb_comment_post` function is called when a new comment is submitted and it applies two filters to the comment's content. The first filter applies the `htmlspecialchars` function, which converts special characters to their HTML entity equivalents. This ensures that any malicious input is sanitised and does not pose a security risk to the website. The second filter uses `str_replace` to replace any single quotes in the comment's content with their escaped equivalent. This prevents any unintended effects of unescaped quotes in the comment's content.

The `wpb_comment_display` function is called when a comment is displayed on the site, and it applies a filter to the comment's content to ensure that any escaped single quotes are displayed correctly.

Finally, there are four `add_filter` calls that hook into various WordPress comment functions to apply the `wpb_comment_display` function and one `remove_filter` call to remove the default filter that makes links clickable in comments.

Overall, this code is an example of how WordPress filters can be used to modify the behaviour of a site's comment system, particularly to ensure the security and integrity of the user-generated content.

