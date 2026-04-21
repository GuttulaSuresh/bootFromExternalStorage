# OneClick Market Lists App

A simple static app that shows the requested categories:

- Top 100 reliable stocks
- Top 100 stocks performing since launch
- Top 100 startup stocks
- Top 10 unicorn stocks
- Top 100 dividend stocks
- Top 100 mutual funds stocks
- Top 100 crypto stocks
- Top 100 evergreen stocks

## Run locally

From the repository root:

```bash
python3 -m http.server 8080 --directory OneClick
```

Then open <http://localhost:8080>.

## Notes

This app uses generated placeholder list entries for each category so it works without external APIs.
