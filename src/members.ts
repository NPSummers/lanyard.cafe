export interface Member {
  url: string;
  name: string;
  buttonUrl?: string;
  discordId?: string;
  timeZone?: string;
}

export const MEMBERS: Member[] = [
  {
    url: "https://schuh.wtf",
    name: "schuh",
    buttonUrl:
      "https://raw.githubusercontent.com/NPSummers/NPSummers/refs/heads/main/schuh.gif",
    discordId: "492707412504215552",
  },
  {
    url: "https://aureal.dev",
    name: "aureal",
    buttonUrl:
      "https://raw.githubusercontent.com/NPSummers/NPSummers/refs/heads/main/button.png",
    discordId: "1498977251134279900",
  },
  {
    url: "https://akryst.moe",
    name: "akryst",
    buttonUrl: "https://akryst.moe/88x31/akryst.gif",
    discordId: "1368371401546928148",
  },
  {
    url: "https://moli.codes",
    name: "f1sh",
    buttonUrl:
      "https://raw.githubusercontent.com/NPSummers/NPSummers/refs/heads/main/doesnt_want_to_host_his_own_gif_moli.gif",
    discordId: "470904884946796544",
  },
  {
    url: "https://plxne.com",
    name: "Ranger",
    buttonUrl: "https://files.plxne.com/raw/nRH5kX.gif",
    discordId: "480900607738380298",
  },
  {
    url: "https://kie.ac",
    name: "kie.ac",
    buttonUrl: "https://kie.ac/88x31/button.png",
    discordId: "673477059904929802",
  },
  {
    url: "https://nichind.dev",
    name: "nichind",
    buttonUrl: "https://nichind.dev/88x31.gif",
    discordId: "301035790891352076",
  },
  {
    url: "https://brookerslyn.space",
    name: "brook",
    buttonUrl:
      "https://cdn.brookerslyn.space/Screenshot%202026-05-10%20222237(1)(1).png",
    discordId: "647814047210930223",
  },
  {
    url: "https://assumi.ng",
    name: "catcatcat",
    buttonUrl: "https://assumi.ng/assets/88x31/assuming.gif",
    discordId: "1471598614676766826",
  },
  {
    url: "https://milproject.xyz",
    name: "mae",
    buttonUrl:
      "https://raw.githubusercontent.com/miliegoat/miliegoat.github.io/refs/heads/main/media/mae.gif",
    discordId: "1125787079654260777",
  },
  {
    url: "https://c.stupid.cat",
    name: "clove",
    buttonUrl: "https://c.stupid.cat/assets/88x31/doughmination.png",
    discordId: "1464890289922641993",
  },
  {
    url: "https://chimera-realm.foo",
    name: "Chimera",
    buttonUrl: "https://raw.githubusercontent.com/miliegoat/miliegoat.github.io/refs/heads/main/media/Untitled.gif",
    discordId: "736465046317563915",
  },
  {
    url: "https://interverti.fr/",
    name: "interverti",
    buttonUrl: "https://cdn.interverti.fr/raw/interverti.fr.gif",
    discordId: "674329017339346955",
  },
  {
    url: "https://buddywinte.xyz",
    name: "buddywinte",
    buttonUrl: "https://buddywinte.xyz/button.gif",
    discordId: "1357429661834936510",
  },
  {
    url: "https://ethone.eu",
    name: "ethone",
    buttonUrl: "https://ethone.eu/blinkie.gif",
    discordId: "1485363780685795430",
];

export function getMemberByUrl(url: string): Member | undefined {
  const hostname = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return MEMBERS.find((m) => {
    const mHost = m.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    return mHost === hostname;
  });
}

export function getAdjacentMembers(currentUrl: string): {
  prev: Member;
  next: Member;
} {
  const index = MEMBERS.findIndex((m) => m.url === currentUrl);
  if (index === -1) {
    const lastIdx = MEMBERS.length - 1;
    return { prev: MEMBERS[lastIdx]!, next: MEMBERS[0]! };
  }
  const prev = MEMBERS[(index - 1 + MEMBERS.length) % MEMBERS.length]!;
  const next = MEMBERS[(index + 1) % MEMBERS.length]!;
  return { prev, next };
}
