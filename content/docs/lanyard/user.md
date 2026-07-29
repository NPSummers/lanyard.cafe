# Fetching User Images

:::info
For most of these APIs, you can specify a `?size=` URL parameter, to get a specific size of that image, not all images have all sizes, generally, you can use `?size=4096` to get the biggest image available.
:::

Discord does not expose things like Badges, Banners, About Mes, Connections, and other things to the gateway, therefore, we need to use Dustin's API to fetch this.

> https://dcdn.dstn.to/profile/{userid}

Though lanyard still returns the Avatar, Avatar Decoration, Nameplate

> https://api.lanyard.rest/v1/users/{userid}
> wss://api.lanyard.rest/socket


### Endpoints:
- Avatars: `https://cdn.discordapp.com/avatars/{userid}/{hash}.png`
    - Or: `https://dcdn.dstn.to/avatars/{userid}`
- Banners: `https://cdn.discordapp.com/banners/{userid}/{hash}.png`
    - Or: `https://dcdn.dstn.to/banners/{userid}`
- Avatar Decos: `https://cdn.discordapp.com/avatar-decoration-presets/{hash}.png`
- Profile Decos: `https://cdn.discordapp.com/assets/content/{hash}`
- Nameplates: `https://cdn.discordapp.com/assets/collectibles/nameplates/{collection}$/{name}$/asset.webm`
- Badges: `https://cdn.discordapp.com/badge-icons/{hash}.png`
- Emojis: `https://cdn.discordapp.com/emojis/{id}.png`
- Guild Tag Icons: `https://cdn.discordapp.com/clan-badges/{serverid}/{hash}.png`
- Guild Tag Server: `https://discord.com/api/v9/guilds/{serverid}/profile` (Needs Authentication)

Dustin's API returns the data pretty neatly, all you have to do is replace the placeholder `{}` text in above endpoints with what the API returns.

### Badges

Both APIs return a value called `public_flags`, which can be used to perform __Bitwise Shift Operations__ to figure out what badges the user has.

But as this doesn't cover all badges, and doesn't provide the icon hash, it is preferred to just directly use the API.

| Value | Name | Description |
| :--- | :--- | :--- |
| `1 << 0` | `STAFF` | Discord Employee |
| `1 << 1` | `PARTNER` | Partnered Server Owner |
| `1 << 2` | `HYPESQUAD` | HypeSquad Events Member |
| `1 << 3` | `BUG_HUNTER_LEVEL_1` | Bug Hunter Level 1 |
| `1 << 6` | `HYPESQUAD_ONLINE_HOUSE_1` | House Bravery Member |
| `1 << 7` | `HYPESQUAD_ONLINE_HOUSE_2` | House Brilliance Member |
| `1 << 8` | `HYPESQUAD_ONLINE_HOUSE_3` | House Balance Member |
| `1 << 9` | `PREMIUM_EARLY_SUPPORTER` | Early Nitro Supporter |
| `1 << 10` | `TEAM_PSEUDO_USER` | User is a team |
| `1 << 14` | `BUG_HUNTER_LEVEL_2` | Bug Hunter Level 2 |
| `1 << 16` | `VERIFIED_BOT` | Verified Bot |
| `1 << 17` | `VERIFIED_DEVELOPER` | Early Verified Bot Developer |
| `1 << 18` | `CERTIFIED_MODERATOR` | Moderator Programs Alumni |
| `1 << 19` | `BOT_HTTP_INTERACTIONS` | Bot uses only HTTP interactions and is shown in the online member list |
| `1 << 22` | `ACTIVE_DEVELOPER` | User is an Active Developer |

(from https://discord.com/developers/docs/resources/user)
###
<small>written by [Schuh](https://schuh.wtf/)</small>
