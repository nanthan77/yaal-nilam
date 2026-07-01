# Social Lead Monitor API Setup

This monitor saves discovered property posts into `social_leads` for admin review.
It does not send messages automatically.

## What Each API Can Do

- YouTube: uses the official YouTube Data API `search.list` endpoint to search recent videos by query.
- Facebook: uses the Meta Graph API for Pages Search and Page Feed. This requires Page Public Content Access for Pages you do not own/manage.
- Facebook groups, private profiles, private marketplace posts, and logged-in scraping are not supported here.

## Firebase Config Document

Create or update this Firestore document:

`config/social_monitor`

You can manage `facebook.page_ids` from the admin dashboard:

`Social Leads -> Facebook Pages to monitor`

Example:

```json
{
  "youtube": {
    "enabled": true,
    "uses_env_key": true,
    "queries": [
      "Jaffna property for sale",
      "Jaffna land for sale",
      "Nallur house for sale",
      "யாழ்ப்பாணம் காணி விற்பனை"
    ],
    "max_results": 10,
    "region_code": "LK",
    "relevance_language": "en",
    "safe_search": "moderate",
    "published_after_hours": 72
  },
  "facebook": {
    "enabled": true,
    "uses_env_token": true,
    "api_version": "v20.0",
    "search_pages": true,
    "queries": [
      "Jaffna property",
      "Jaffna land sale",
      "Northern Sri Lanka real estate"
    ],
    "page_ids": [
      "1234567890",
      { "id": "9876543210", "name": "Known Real Estate Page" }
    ],
    "max_pages_per_query": 5,
    "max_posts_per_page": 10
  }
}
```

## Secrets

Preferred production setup:

- `YOUTUBE_API_KEY`
- `FACEBOOK_ACCESS_TOKEN` or `META_ACCESS_TOKEN`
- Optional: `META_GRAPH_API_VERSION`

The function also supports storing `youtube.api_key` and `facebook.access_token` in `config/social_monitor`, but environment/secret storage is safer for production.

## Facebook Requirements

For Facebook public Page monitoring, the Meta app needs:

- Business verification when required by Meta.
- Page Public Content Access if reading public Pages you do not own/manage.
- A valid Graph API access token.

Without Page Public Content Access, the app can generally read only Pages connected to app roles during testing or Pages for which your app/user has the required permissions.

## Run

From the admin dashboard:

`Social Leads -> Run monitor`

The callable Function is:

`runSocialLeadMonitor`

Results are saved into:

- `social_leads`
- `social_monitor_runs`
