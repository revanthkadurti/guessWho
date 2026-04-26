import { bollywoodItems } from "./bollywoodItems.js";
import type { Category, CategoryId, GameItem } from "./types.js";

const itemId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const commonsFileUrl = (fileName: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=500`;
const commonsSourceUrl = (fileName: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName.replaceAll(" ", "_"))}`;

const commonsItems = (entries: Array<[string, string]>): GameItem[] =>
  entries.map(([name, fileName]) => ({
    id: itemId(name),
    name,
    imageUrl: commonsFileUrl(fileName),
    imageSourceUrl: commonsSourceUrl(fileName),
    imageAttribution: "See Wikimedia Commons source page",
    imageLicense: "Free license listed on Wikimedia Commons",
    imageLicenseUrl: commonsSourceUrl(fileName)
  }));

const hollywoodCelebrities = commonsItems([
  ["Tom Hanks", "Tom Hanks at the Elvis Premiere 2022.jpg"],
  ["Meryl Streep", "Meryl Streep- Press conference for the film \"The Devil Wears Prada 2\" - 55194765350 (cropped1).jpg"],
  ["Leonardo DiCaprio", "Leonardo DiCaprio - BFI Southbank 3 (crop).jpg"],
  ["Denzel Washington", "Denzel Washington at the 2025 Cannes Film Festival.jpg"],
  ["Scarlett Johansson", "Scarlett Johansson-8588.jpg"],
  ["Morgan Freeman", "Morgan Freeman at The Pentagon on 2 August 2023 - 230802-D-PM193-3363 (cropped).jpg"],
  ["Julia Roberts", "Julia Roberts Delivers Remarks at the 2022 Kennedy Center Honors Dinner (52542372884) (cropped).jpg"],
  ["Brad Pitt", "Brad Pitt-69858.jpg"],
  ["Angelina Jolie", "Angelina Jolie-643531 (cropped).jpg"],
  ["Robert Downey Jr.", "Robert Downey Jr 2014 Comic Con (cropped).jpg"],
  ["Zendaya", "Zendaya - 2019 by Glenn Francis.jpg"],
  ["Chris Evans", "Chris Evans Red 2024.jpg"],
  ["Ryan Reynolds", "Deadpool 2 Japan Premiere Red Carpet Ryan Reynolds (cropped).jpg"],
  ["Emma Stone", "Emma Stone at the 2025 Cannes Film Festival 04.jpg"],
  ["Jennifer Lawrence", "Jennifer Lawrence, Cannes Film Festival 2025.jpg"],
  ["Keanu Reeves", "Keanu Reeves at TIFF 2025 02 (Cropped).jpg"],
  ["Will Smith", "TechCrunch Disrupt 2019 (48834434641) (cropped).jpg"],
  ["Margot Robbie", "Margot Robbie at 29th Critics' Choice Awards.jpg (brightened).png"],
  ["Natalie Portman", "NataliePortman.jpg"],
  ["Samuel L. Jackson", "SamuelLJackson.jpg"],
  ["Anne Hathaway", "Anne Hathaway- Press conference for the film \"The Devil Wears Prada 2\" - 55194764955 (cropped).jpg"],
  ["George Clooney", "George Clooney.jpg"],
  ["Viola Davis", "Viola Davis at the Air Premiere at SXSW (cropped).jpg"],
  ["Christian Bale", "Christian Bale-7837.jpg"],
  ["Gal Gadot", "Gal Gadot for Revlon (cropped).jpg"]
]);

const sportsStars = commonsItems([
  ["Serena Williams", "Serena Williams at 2013 US Open.jpg"],
  ["Lionel Messi", "Lionel Messi White House 2026 (3x4 cropped).jpg"],
  ["Cristiano Ronaldo", "Cristiano Ronaldo 2275 (cropped).jpg"],
  ["LeBron James", "LeBron James (51959977144) (cropped2).jpg"],
  ["Simone Biles", "Simone Biles National Team 2024.jpg"],
  ["Roger Federer", "Federer WM16 (37) (28136155830).jpg"],
  ["Naomi Osaka", "Naomi Osaka 2017 Wimbledon.jpg"],
  ["Stephen Curry", "Stephen Curry Shooting (cropped) (cropped).jpg"],
  ["Usain Bolt", "Usain Bolt Rio 100m final 2016k.jpg"],
  ["Virat Kohli", "Virat Kohli during the India vs Aus 4th Test match at Narendra Modi Stadium on 09 March 2023.jpg"],
  ["Megan Rapinoe", "Megan Rapinoe Stat Sports 2.jpg"],
  ["Tiger Woods", "Tiger Woods in May 2019.jpg"],
  ["Rafael Nadal", "Rafael Nadal en 2024 (cropped).jpg"],
  ["Shohei Ohtani", "Shohei Ohtani on April 23, 2024 (2) 53677091634.jpg"],
  ["Michael Phelps", "Michael Phelps August 2016.jpg"],
  ["Alex Morgan", "NC Courage v San Diego Wave (Oct 2023) 014 (Morgan).jpg"],
  ["Patrick Mahomes", "Patrick Mahomes in the Oval Office of the White House on June 5, 2023 - P20230605AS-0902 (cropped).jpg"],
  ["Coco Gauff", "US Open 2022 Photo 177 (52391301928) (Gauff).jpg"],
  ["Neymar", "20180610 FIFA Friendly Match Austria vs. Brazil Neymar 850 1705.jpg"],
  ["Lewis Hamilton", "Prime Minister Keir Starmer meets Sir Lewis Hamilton (54566928382) (cropped).jpg"],
  ["Marta", "Marta star.jpg"],
  ["Giannis Antetokounmpo", "Giannis Antetokounmpo (51915153421) (cropped).jpg"],
  ["Novak Djokovic", "Novak Djokovic Paris 2024 Olympic Games (cropped).jpg"],
  ["Kylian Mbappé", "2019-07-17 SG Dynamo Dresden vs. Paris Saint-Germain by Sandro Halank–129 (cropped).jpg"],
  ["Sania Mirza", "Sania Mirza (19247067445).jpg"]
]);

const musicians = commonsItems([
  ["Taylor Swift", "Taylor Swift at the 2023 MTV Video Music Awards (3).png"],
  ["Beyoncé", "Beyoncé - Tottenham Hotspur Stadium - 1st June 2023 (10 of 118) (52946364598) (best crop).jpg"],
  ["A. R. Rahman", "AR Rahman At The ‘Marvel Anthem’ Launch.jpg"],
  ["Drake", "Drake July 2016.jpg"],
  ["Adele", "Adele 2016.jpg"],
  ["Nicki Minaj", "Nicki Minaj (55022751404).jpg"],
  ["Rihanna", "Rihanna visits U.S. Embassy in Barbados 2024 (cropped).jpg"],
  ["The Weeknd", "The Weeknd Portrait by Brian Ziff.jpg"],
  ["Billie Eilish", "BillieEilishO2140725-39 - 54665577407 (cropped).jpg"],
  ["Ed Sheeran", "Ed Sheeran-6886 (cropped).jpg"],
  ["Lady Gaga", "Lady Gaga at the White House in 2023 (1).jpg"],
  ["Bruno Mars", "Bruno Mars b&w (cropped).jpg"],
  ["Shakira", "2023-11-16 Gala de los Latin Grammy, 03 (cropped)01.jpg"],
  ["Arijit Singh", "Arijit 5th GiMA Awards.jpg"],
  ["Dua Lipa", "Dua Lipa-69798 (cropped).jpg"],
  ["Harry Styles", "HarryStylesWembley170623 (14 of 93) (52982076132) (cropped).jpg"],
  ["Kendrick Lamar", "Pulitzer2018-portraits-kendrick-lamar.jpg"],
  ["Ariana Grande", "Ariana Grande promoting Wicked (2024).jpg"],
  ["Post Malone", "Post Malone July 2021 (cropped).jpg"],
  ["SZA", "KendrickSZASPurs230725-19 - 54683179509 (cropped) (cropped).jpg"],
  ["Justin Bieber", "Justin Bieber in 2015.jpg"],
  ["Olivia Rodrigo", "Glasto2025-546 (cropped 2).jpg"],
  ["Diljit Dosanjh", "Diljit Dosanjh grace the media meet of Phillauri 4 (cropped).jpg"],
  ["Doja Cat", "Doja Cat x Amazon1.1 (cropped).jpg"],
  ["Kacey Musgraves", "Kacey Musgraves 2019 by Glenn Francis.jpg"]
]);

const internetPersonalities = commonsItems([
  ["MrBeast", "MrBeast 2023 (cropped).jpg"],
  ["Marques Brownlee", "MARQUES BROWNLEE Profile Picture.jpg"],
  ["Lilly Singh", "2024-03-08 SXSW-2024 Variety-comedy-awards 04707 (cropped).jpg"],
  ["Emma Chamberlain", "Emma Chamberlain at '21 Paris Fashion Week (cropped).jpg"],
  ["KSI", "KSI in 2024.png"],
  ["Logan Paul", "Logan Paul, WrestleMania XL in 2024 1 (cropped).jpg"],
  ["Charli D'Amelio", "Charli D'Amelio in Nov 2020 5.jpg"],
  ["Addison Rae", "LanaWembley030725-16 (cropped 2).jpg"],
  ["Kai Cenat", "Kai Cenat.png"],
  ["IShowSpeed", "IShowSpeed at Chinatown (Portrait) 04.jpg"],
  ["Markiplier", "Markiplier by Gage Skidmore.jpg"],
  ["Jacksepticeye", "Jacksepticeye by Gage Skidmore.jpg"],
  ["Pokimane", "Pokimane at the Creator Economy Caucus launch, 2025 (cropped) 3.jpg"],
  ["Ninja", "Ninja loading.jpg"],
  ["Valkyrae", "Valkyrae in 2023 (4x5 cropped).png"],
  ["Zach King", "Zach King Photo.jpg"],
  ["Khaby Lame", "KhabyLame.jpg"],
  ["PewDiePie", "Pewdiepie head shot.jpg"],
  ["CarryMinati", "CarryMinati promoting Playground in 2024.jpg"],
  ["Bhuvan Bam", "Bhuvan Bam at Taaza Khabar's success party (cropped).jpg"],
  ["Ashish Chanchlani", "Ashish Chanchlani at the special screening of Men in Black International (cropped).jpg"],
  ["Tanmay Bhat", "Tanmay Bhat.png"],
  ["Amit Bhadana", "Amit Bhadana at IWMBuzz Awards 2019 Crop.jpg"],
  ["Casey Neistat", "Casey Neistat @ SXSW 2017 (33229303282) (cropped).jpg"],
  ["Prajakta Koli", "Prajakta Koli, March 31, 2018.jpg"]
]);

const mixedPopCulture: GameItem[] = [
  ...bollywoodItems.slice(1, 6),
  ...hollywoodCelebrities.slice(0, 5),
  ...sportsStars.slice(0, 5),
  ...musicians.slice(0, 5),
  ...internetPersonalities.slice(0, 5)
];

export const categories: Category[] = [
  {
    id: "bollywood-actors",
    name: "Bollywood Actors",
    description: "Hindi cinema stars and fan favorites.",
    items: bollywoodItems
  },
  {
    id: "hollywood-celebrities",
    name: "Hollywood Celebrities",
    description: "Movie stars and globally recognized screen personalities.",
    items: hollywoodCelebrities
  },
  {
    id: "sports-stars",
    name: "Sports Stars",
    description: "Athletes across tennis, football, basketball, cricket, racing, and more.",
    items: sportsStars
  },
  {
    id: "musicians",
    name: "Musicians",
    description: "Pop, hip-hop, global, and Bollywood music names.",
    items: musicians
  },
  {
    id: "internet-personalities",
    name: "Internet Personalities",
    description: "Creators, streamers, and online culture names.",
    items: internetPersonalities
  },
  {
    id: "mixed-pop-culture",
    name: "Mixed Pop Culture",
    description: "A balanced mix of actors, athletes, musicians, and internet personalities.",
    items: mixedPopCulture
  }
];

export const categorySummaries = categories.map(({ id, name, description }) => ({ id, name, description }));

export function categoryById(categoryId: CategoryId) {
  return categories.find((category) => category.id === categoryId);
}

export function categoryItems(categoryId: CategoryId) {
  const category = categoryById(categoryId);
  if (!category) throw new Error("Unknown category.");
  if (category.items.length !== 25) throw new Error(`${category.name} must contain exactly 25 items.`);
  return category.items;
}

export function categoryName(categoryId: CategoryId) {
  return categoryById(categoryId)?.name ?? "Unknown Category";
}
