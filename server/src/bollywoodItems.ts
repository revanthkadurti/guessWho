import type { GameItem } from "./types.js";

const id = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const bollywoodItems: GameItem[] = [
  {
    name: "Amitabh Bachchan",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Indian_actor_Amitabh_Bachchan.jpg/500px-Indian_actor_Amitabh_Bachchan.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Indian_actor_Amitabh_Bachchan.jpg",
    imageAttribution: "Shrinivaskulkarni1388, derivative work: Junior Jumper",
    imageLicense: "CC BY-SA 4.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    name: "Shah Rukh Khan",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Shah_Rukh_Khan_graces_the_launch_of_the_new_Santro.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Aamir Khan",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Aamir_Khan_%28Berlin_Film_Festival_2011%29.jpg/500px-Aamir_Khan_%28Berlin_Film_Festival_2011%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Aamir_Khan_(Berlin_Film_Festival_2011).jpg",
    imageAttribution: "Siebbi",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Salman Khan",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Salmanrampwalk.png",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Salmanrampwalk.png",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Hrithik Roshan",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Hrithik_at_Rado_launch.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Hrithik_at_Rado_launch.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Ranbir Kapoor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Ranbir_Kapoor_promoting_Bombay_Velvet.jpg/500px-Ranbir_Kapoor_promoting_Bombay_Velvet.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Ranbir_Kapoor_promoting_Bombay_Velvet.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Ranveer Singh",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Ranveer_Singh_in_2023_%281%29_%28cropped%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Ranveer_Singh_in_2023_(1)_(cropped).jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Akshay Kumar",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Akshay_Kumar.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Akshay_Kumar.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Ajay Devgn",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Ajay_Devgn_promoting_All_the_Best.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Ajay_Devgn_promoting_All_the_Best.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Vicky Kaushal",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Vicky_Kaushal_at_HT_Style_Awards.jpg/500px-Vicky_Kaushal_at_HT_Style_Awards.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Vicky_Kaushal_at_HT_Style_Awards.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Deepika Padukone",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Deepika_Padukone_2025_%281%29.png/500px-Deepika_Padukone_2025_%281%29.png",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Deepika_Padukone_2025_(1).png",
    imageAttribution: "Narendra Modi",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Alia Bhatt",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Alia_Bhatt_at_Berlinale_2022_Ausschnitt.jpg/500px-Alia_Bhatt_at_Berlinale_2022_Ausschnitt.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Alia_Bhatt_at_Berlinale_2022_Ausschnitt.jpg",
    imageAttribution: "Elena Ternovaja",
    imageLicense: "CC BY-SA 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    name: "Priyanka Chopra",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Priyanka_Chopra_at_Bulgary_launch%2C_2024_%28cropped%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Priyanka_Chopra_at_Bulgary_launch,_2024_(cropped).jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Kareena Kapoor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Kareena_Kapoor_Khan_in_2023_%281%29_%28cropped%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Kareena_Kapoor_Khan_in_2023_(1)_(cropped).jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Katrina Kaif",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Katrina_Kaif_promoting_Bharat_in_2019.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Katrina_Kaif_promoting_Bharat_in_2019.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Vidya Balan",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Vidya_Balan_at_BB3_interviews%2C_2024_%28cropped%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Vidya_Balan_at_BB3_interviews,_2024_(cropped).jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Madhuri Dixit",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Madhuri_Dixit_in_November_2022.jpg/500px-Madhuri_Dixit_in_November_2022.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Madhuri_Dixit_in_November_2022.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Kajol",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Kajol_snapped_promoting_Maa_%28cropped%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Kajol_snapped_promoting_Maa_(cropped).jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Rani Mukerji",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Rani_Mukerji_snapped_at_Hema_Malini%E2%80%99s_75th_birthday_celebration_%28cropped%29%282%29.jpg/500px-Rani_Mukerji_snapped_at_Hema_Malini%E2%80%99s_75th_birthday_celebration_%28cropped%29%282%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Rani_Mukerji_snapped_at_Hema_Malini%E2%80%99s_75th_birthday_celebration_(cropped)(2).jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Anushka Sharma",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Anushka_Sharma_promoting_Zero.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Anushka_Sharma_promoting_Zero.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Ayushmann Khurrana",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Ayushmann_Khurrana_promoting_Andhadhun.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Ayushmann_Khurrana_promoting_Andhadhun.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Rajkummar Rao",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Rajkumar_Rao_Filmfare_Glamour_and_Style_Awards_2019_%28cropped%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Rajkumar_Rao_Filmfare_Glamour_and_Style_Awards_2019_(cropped).jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Sidharth Malhotra",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Sidharth_Malhotra_at_IIFA_awards_2014.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Sidharth_Malhotra_at_IIFA_awards_2014.jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Kiara Advani",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kiara_Advani_snapped_at_the_screening_of_Shershaah_%28cropped%29.jpg/500px-Kiara_Advani_snapped_at_the_screening_of_Shershaah_%28cropped%29.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Kiara_Advani_snapped_at_the_screening_of_Shershaah_(cropped).jpg",
    imageAttribution: "Bollywood Hungama",
    imageLicense: "CC BY 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    name: "Tabu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Tabu_in_2024.jpg/500px-Tabu_in_2024.jpg",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Tabu_in_2024.jpg",
    imageAttribution: "Verghese TK",
    imageLicense: "CC BY-SA 4.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  }
].map((item) => ({
  id: id(item.name),
  ...item
}));
