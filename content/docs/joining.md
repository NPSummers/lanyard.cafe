# joining the ring

To join lanyard.cafe, open a pull request on the [GitHub repo](https://github.com/NPSummers/lanyard.cafe) adding your site to `src/members.ts`.

## requirements

- you must be a member of the [lanyard](https://lanyard.rest) Discord community
- your site must be a personal site (no commercial projects)
- your site must not be ai slop (if it looks like it was made in 5 prompts)
- add the embed widget somewhere visible on your site before submitting

## adding your entry

Open `src/members.ts` and add an object to the `MEMBERS` array:

```ts
{
  url: "https://yoursite.com",
  name: "your name",
  buttonUrl: "https://yoursite.com/88x31.gif", // optional
  discordId: "your_discord_id",                // optional, enables presence
}
```

### fields

| field | required | description |
|---|---|---|
| `url` | yes | your site's root URL |
| `name` | yes | display name shown in the member list |
| `buttonUrl` | no | URL to your 88×31 button image |
| `discordId` | no | your Discord user ID which enables live status via Lanyard |

## finding your Discord ID

Enable Developer Mode in Discord (Settings -> Advanced -> Developer Mode), then right-click your username and choose **Copy User ID**.
