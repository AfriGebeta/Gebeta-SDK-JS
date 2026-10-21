---
'@gebeta/api': minor
'@gebeta/core': minor
---

Forward geocoding with an API key now uses the v2 search endpoint (`/v2/search/geocode`, with `proximity=ip`). Results keep the `{ name, lngLat }` shape and now also include `id`, `display_name`, `category`, `address` and `neighborhood`. Service-account auth and reverse geocoding stay on v1. Adds `API.Geocoding.Constants.SEARCH_URL`.
