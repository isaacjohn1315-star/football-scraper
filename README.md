# Football Scraper

A starter project for testing public football page retrieval.

## Environment variables

- CRON_SECRET: a long private random secret
- FLASHSCORE_URL: the public page to test

## Endpoint

GET /api/scrape

Requires:
Authorization: Bearer YOUR_CRON_SECRET

This starter only tests page retrieval. It does not yet detect
goals, cards, match status, or publish Facebook posts.
