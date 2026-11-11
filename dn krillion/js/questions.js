/* =====================================================================
   NEBRASKA OUTLIER — QUESTION DATABASE
   ---------------------------------------------------------------------
   HOW TO EDIT
   • Each question has an id (unique, no spaces), a category id (see
     config.js), the prompt, and answers sorted into five rarity tiers.
   • Each answer is one string. The first part is what players see.
     Extra spellings / aliases go after a "|" bar:
         "Lake McConaughy|big mac|lake mac|mcconaughy"
   • Capitals, punctuation, "a/an/the" at the start, plurals and small
     typos are handled automatically — no need to list those.
   • Optional "ignore": words dropped before matching (e.g. "county").
   • Optional "banned": answers the prompt rules out. Players get a
     friendly "that one's off-limits" message and 0 points.
   • After editing, run:  node tests/validate.js   to catch mistakes
     (duplicate answers, missing tiers, etc.).
   • NOTE: Adding or removing questions reshuffles which questions appear
     on upcoming Daily Challenge days. Make edits before midnight Central.

   Rarity levels are editorial estimates of how often people would think
   of an answer — not measured statistics.
   ===================================================================== */

window.NO_QUESTIONS = [

  /* ==================== HUSKER NATION ==================== */
  {
    id: "husker-tailgate",
    category: "husker",
    prompt: "Name something you'd see at a Husker tailgate.",
    answers: {
      common: ["Grill|grills|barbecue|bbq|grilling", "Beer|beers|cold beer", "Husker jersey|jerseys|red shirts|red jerseys|husker shirts|red", "Burgers|hamburgers|cheeseburgers", "Hot dogs|hotdog|hot dog", "Cooler|coolers", "Cornhole|bags|bean bag toss", "Tent|canopy|pop up tent|pop-up tent"],
      familiar: ["Brats|bratwurst|brat", "Busch Light|busch", "Lawn chairs|camping chairs|folding chairs|chairs", "Husker flags|flag|flags|n flag", "Football|throwing a football", "TV|television|satellite dish", "Radio|game on the radio", "Chips and dip|chips", "Beer pong", "Pickup truck|truck|trucks|tailgate of a truck", "RV|motorhome|camper", "Runza|runzas", "Jello shots|jell-o shots", "Speaker|bluetooth speaker|music"],
      unusual: ["Corn cob hat|corn hat|corncob hat|cornhead|corn head", "Bloody Mary|bloody marys", "Dog|dogs|puppy", "Generator", "Porta potty|porta-potty|portable toilet", "Fried chicken", "Pizza", "Smoker|smoked brisket|brisket", "Kids|children|families", "Visiting fans|opposing fans|other team's fans", "Face paint|painted faces", "Red balloons|balloons"],
      rare: ["Tom Osborne cutout|cardboard osborne|osborne cutout|cardboard cutout", "Painted school bus|school bus|husker bus", "Portable bar|mobile bar|bar", "Kegerator|keg|kegs", "Fire pit|campfire", "Popcorn machine", "Herbie Husker", "Lil' Red|lil red|little red", "Washers|washer toss", "Crockpot|slow cooker"],
      extreme: ["Couch|sofa|recliner", "Hay bale|hay bales|straw bales", "Chandelier", "Disco ball", "Karaoke machine|karaoke", "Ice luge", "Grandma's casserole dish|casserole dish|casserole"],
    },
  },
  {
    id: "husker-miss-game",
    category: "husker",
    prompt: "Name a reason someone might miss a Husker football game.",
    answers: {
      common: ["Work|working|job|had to work|shift", "Sick|being sick|illness|flu|got sick|covid", "Wedding|a wedding", "Tickets too expensive|expensive tickets|no tickets|couldn't get tickets|ticket prices|money|can't afford it|too expensive"],
      familiar: ["Hungover|hangover", "Studying|homework|exam|test", "Bad weather|weather|cold|snow|rain", "Traffic", "Family event|family reunion|family", "Overslept|slept in|sleeping", "They keep losing|losing streak|team is bad|tired of losing|losing"],
      unusual: ["Harvest|harvesting|combining|farming|field work", "Funeral", "Having a baby|baby|labor|giving birth|birth", "Kid's game|kids soccer game|kids sports|soccer game", "Car broke down|flat tire|car trouble", "Deer season|deer hunting|rifle season", "Church event|church", "Night game|late kickoff|kickoff too late"],
      rare: ["Pheasant opener|pheasant season|pheasant hunting", "Husker volleyball|volleyball match|volleyball game", "LSAT|mcat|gre|act|sat|standardized test", "Study abroad|studying abroad|living abroad", "Lost tickets|lost my ticket", "Running a marathon|marathon|race", "Dog is sick|sick dog|pet emergency|vet", "Moving cattle|sorting cattle|cattle work|cows got out"],
      extreme: ["Bye week|bye", "Solar eclipse|eclipse", "Jury duty", "Volunteering at the concession stand|working concessions|concessions", "Too nervous to watch|too stressful|anxiety"],
    },
  },
  {
    id: "husker-bring-stadium",
    category: "husker",
    prompt: "Name something fans bring into Memorial Stadium.",
    answers: {
      common: ["Phone|cell phone|cellphone", "Tickets|ticket|season tickets", "Seat cushion|stadium seat|cushion|seat pad|bleacher seat", "Blanket|blankets"],
      familiar: ["Clear bag|clear stadium bag", "Binoculars", "Poncho|rain poncho|raincoat", "Sunscreen", "Hand warmers|handwarmers", "Sign|poster|signs", "Wallet|cash|money|credit card", "Sunglasses", "Winter coat|coat|jacket", "Stocking cap|hat|beanie|cap", "Pom poms|pompoms"],
      unusual: ["Radio|headphones for the radio|earbuds|headphones", "Corn cob hat|corn hat|corncob hat|cornhead", "Portable charger|battery pack|phone charger|charger", "Face paint", "Kids|children|baby", "Game program|program", "Gloves|mittens", "Umbrella"],
      rare: ["Lucky charm|lucky socks|lucky shirt|rosary", "Earplugs|ear protection", "Ear muffs|earmuffs", "Cowbell", "Heated seat|heated stadium seat", "Lip balm|chapstick"],
      extreme: ["Grandpa's season tickets|inherited season tickets|inherited tickets|grandparents season tickets", "Opera glasses", "Megaphone", "Rubber chicken", "Scarf knitted in Husker red|knitted scarf|scarf"],
    },
  },
  {
    id: "husker-tradition",
    category: "husker",
    prompt: "Name a Nebraska sports tradition.",
    answers: {
      common: ["Tunnel Walk", "Sellout streak|sellouts|sold out games|sellout", "Balloon release|red balloons|balloons", "Go Big Red|go big red chant"],
      familiar: ["Blackshirts|black shirts", "Clapping for the other team|applauding the other team|clapping for the opponent|clapping for visitors|clapping for the opposing team", "Sea of Red|wearing red", "Spring Game|red-white spring game|red white game", "Husker volleyball|volleyball", "Tailgating|tailgate"],
      unusual: ["College World Series|cws", "Walk-ons|walk on program|walk-on program", "Volleyball Day in Nebraska|volleyball day", "Herbie Husker", "Lil' Red|lil red", "Black Friday game|heroes game|day after thanksgiving game", "Husker Marching Band|cornhusker marching band|marching band", "State volleyball tournament|state volleyball"],
      rare: ["Sirius|alan parsons project|tunnel walk song", "Team Jack|jack hoffman run|jack hoffman", "Third-largest city|third largest city in nebraska|stadium becomes third largest city", "Husker radio network|husker radio|listening on the radio", "Freedom Trophy"],
      extreme: ["Husker Power|husker power strength program", "Victory Bell", "$5 Bits of Broken Chair Trophy|bits of broken chair|broken chair trophy"],
    },
  },
  {
    id: "husker-other-sports",
    category: "husker",
    prompt: "Name a Husker sport that isn't football.",
    answers: {
      common: ["Volleyball", "Basketball|men's basketball|women's basketball|hoops", "Baseball"],
      familiar: ["Softball", "Wrestling", "Track and field|track", "Soccer", "Golf"],
      unusual: ["Swimming and diving|swimming|diving|swim", "Gymnastics", "Tennis", "Cross country|xc"],
      rare: ["Rifle|shooting", "Bowling", "Club hockey|hockey|ice hockey", "Rugby", "Ultimate frisbee|ultimate"],
      extreme: ["Esports|e-sports|gaming", "Rodeo|rodeo club", "Club water polo|water polo", "Lacrosse|club lacrosse"],
    },
  },
  {
    id: "husker-legends",
    category: "husker",
    prompt: "Name a famous Nebraska football player or coach.",
    answers: {
      common: ["Tom Osborne|osborne|dr tom", "Scott Frost|frost", "Bob Devaney|devaney"],
      familiar: ["Johnny Rodgers|johnny the jet", "Eric Crouch|crouch", "Mike Rozier|rozier", "Tommie Frazier|frazier", "Ndamukong Suh|suh", "Matt Rhule|rhule", "Bo Pelini|pelini", "Frank Solich|solich", "Ahman Green", "Dylan Raiola|raiola"],
      unusual: ["Rich Glover", "Dave Rimington|rimington", "Will Shields", "Grant Wistrom|wistrom", "Prince Amukamara|amukamara", "Lavonte David", "Roger Craig", "Irving Fryar|fryar", "Turner Gill", "Bill Callahan|callahan", "Mike Riley", "Taylor Martinez", "Ameer Abdullah|abdullah", "Rex Burkhead|burkhead", "Jason Peter", "Trev Alberts|alberts", "Lawrence Phillips", "Jerry Tagge|tagge"],
      rare: ["Brook Berringer|berringer", "Kenny Walker", "Neil Smith", "Broderick Thomas", "I.M. Hipp|im hipp", "Barry Alvarez|alvarez", "Aaron Taylor", "Zach Wiegert|wiegert", "Mike Minter", "Jarvis Redwine"],
      extreme: ["Guy Chamberlin|chamberlin", "Ed Weir", "Bob Brown", "Sam Francis", "Forrest Behm", "Fielding Yost"],
    },
  },
  {
    id: "husker-game-food",
    category: "husker",
    prompt: "Name a food you'd eat while watching a Husker game.",
    answers: {
      common: ["Pizza", "Chicken wings|wings|buffalo wings", "Nachos", "Hot dog|hot dogs|hotdog", "Burgers|hamburger|cheeseburger", "Chips and dip|chips|chips and salsa"],
      familiar: ["Runza|runzas", "Chili", "Popcorn", "Pretzels|soft pretzel", "Brats|bratwurst", "Sliders", "Pulled pork"],
      unusual: ["Taco dip|seven layer dip|7 layer dip", "Little smokies|lil smokies|crockpot meatballs|meatballs", "Buffalo chicken dip", "Queso", "Fried pickles", "Cinnamon rolls and chili|chili and cinnamon rolls|cinnamon rolls", "Puppy chow|muddy buddies"],
      rare: ["Valentino's|valentinos pizza", "Godfather's Pizza|godfathers", "Bierocks|bierock", "Kolaches|kolache", "Cheese Frenchee|frenchee|cheese frenchees", "Bison burger|buffalo burger"],
      extreme: ["Fairbury hot dogs|fairbury", "Rocky Mountain oysters|calf fries|prairie oysters", "Pheasant|pheasant nuggets", "Dorothy Lynch on everything|dorothy lynch"],
    },
  },
  {
    id: "husker-opponent",
    category: "husker",
    prompt: "Name a team Nebraska has played in football.",
    answers: {
      common: ["Iowa|hawkeyes", "Oklahoma|sooners|ou", "Colorado|buffaloes|buffs"],
      familiar: ["Texas|longhorns", "Kansas|jayhawks|ku", "Kansas State|k-state|wildcats", "Missouri|mizzou", "Wisconsin|badgers", "Ohio State|buckeyes|osu", "Michigan|wolverines", "Penn State", "Miami|hurricanes|the u"],
      unusual: ["Iowa State|cyclones", "Oklahoma State|cowboys", "Florida State|seminoles|fsu", "Minnesota|gophers", "Notre Dame", "Texas A&M|texas am|aggies", "Baylor", "Northwestern", "Purdue", "Illinois", "Michigan State|spartans", "Rutgers", "Maryland", "Indiana", "Florida|gators", "Tennessee|vols", "USC|trojans|southern cal", "UCLA"],
      rare: ["Virginia Tech", "Washington|huskies", "Oregon|ducks", "Georgia", "LSU", "Alabama", "Auburn", "BYU", "Wyoming", "Southern Miss|southern mississippi", "Texas Tech"],
      extreme: ["McNeese State|mcneese", "Bethune-Cookman|bethune cookman", "Troy", "Northern Illinois|niu", "Fresno State", "South Alabama", "Arkansas State"],
    },
  },
  {
    id: "husker-red",
    category: "husker",
    prompt: "Name something that's red at a Husker game.",
    answers: {
      common: ["Jerseys|shirts|uniforms|clothes", "Fans|the crowd|everyone", "Hats|caps", "Balloons"],
      familiar: ["Pom poms|pompoms", "Face paint", "Seats|stadium seats|bleachers", "The N|n on the helmet|helmet logo", "Signs|posters", "Scoreboard"],
      unusual: ["Ketchup", "Red Solo cups|solo cups", "Sunburn|sunburned faces|sunburned noses", "Cowboy boots|red boots", "Licorice|twizzlers", "Coca-Cola|coke|coke cans"],
      rare: ["Lil' Red|lil red", "Herbie Husker's shirt|herbie", "Cold cheeks|frozen noses|frostbite|red noses", "Band uniforms|marching band"],
      extreme: ["Hot sauce|sriracha", "Fire truck|ambulance", "Stop sign", "Coach's face after a bad call|angry coach|coach's face"],
    },
  },

  /* ==================== ONLY IN NEBRASKA ==================== */
  {
    id: "only-towns",
    category: "only",
    prompt: "Name a Nebraska town that isn't Lincoln or Omaha.",
    banned: ["Lincoln", "Omaha"],
    answers: {
      common: ["Kearney", "Grand Island|gi", "North Platte"],
      familiar: ["Scottsbluff", "Hastings", "Norfolk", "Columbus", "Fremont", "Bellevue", "Papillion|papio", "Beatrice", "York"],
      unusual: ["McCook", "Lexington", "Alliance", "Sidney", "Chadron", "Ogallala", "Valentine", "Broken Bow", "Seward", "Crete", "Wayne", "Blair", "Nebraska City", "Gering", "La Vista|lavista", "South Sioux City", "Gretna", "Wahoo"],
      rare: ["Falls City", "Auburn", "Aurora", "Holdrege", "Gothenburg", "Cozad", "Ainsworth", "O'Neill|oneill", "Ord", "Ashland", "Plattsmouth", "Red Cloud", "Burwell", "Crawford", "Kimball", "Imperial", "Wilber", "Schuyler", "David City", "Fairbury", "Minden", "Superior", "Hebron", "Geneva", "Tecumseh", "Elkhorn", "Paxton", "St. Paul|saint paul|st paul", "Loup City", "Bayard", "Gordon", "Rushville", "Pawnee City", "Lyons"],
      extreme: ["Monowi", "Arthur", "Mullen", "Thedford", "Harrison", "Hyannis", "Brownville", "Dannebrog", "Brewster", "Bassett", "Springview", "Merriman", "Cody", "Lewellen", "Oshkosh", "Chappell", "Hershey", "Taylor", "Hooper", "Arnold", "Hay Springs", "Elwood", "Wood Lake", "Tryon", "Gandy"],
    },
  },
  {
    id: "only-counties",
    category: "only",
    prompt: "Name a Nebraska county.",
    ignore: ["county", "co"],
    answers: {
      common: ["Douglas", "Lancaster", "Sarpy"],
      familiar: ["Hall", "Buffalo", "Lincoln", "Dodge", "Scotts Bluff|scottsbluff", "Cass", "Saunders", "Platte", "Madison", "Adams", "Gage"],
      unusual: ["Otoe", "Dawson", "Seward", "York", "Washington", "Saline", "Custer", "Cheyenne", "Keith", "Dakota", "Kearney", "Hamilton", "Red Willow", "Dawes", "Cherry", "Holt", "Box Butte", "Wayne", "Colfax", "Butler", "Johnson", "Jefferson", "Phelps"],
      rare: ["Nemaha", "Richardson", "Pawnee", "Fillmore", "Clay", "Nuckolls", "Thayer", "Webster", "Franklin", "Harlan", "Furnas", "Gosper", "Frontier", "Hitchcock", "Dundy", "Chase", "Perkins", "Deuel", "Garden", "Morrill", "Kimball", "Sheridan", "Brown", "Rock", "Knox", "Cedar", "Dixon", "Thurston", "Burt", "Cuming", "Stanton", "Pierce", "Antelope", "Boone", "Nance", "Merrick", "Howard", "Sherman", "Valley", "Greeley", "Polk", "Boyd"],
      extreme: ["Arthur", "McPherson", "Loup", "Blaine", "Banner", "Grant", "Hooker", "Thomas", "Keya Paha", "Sioux", "Wheeler", "Logan", "Garfield", "Hayes"],
    },
  },
  {
    id: "only-produce",
    category: "only",
    prompt: "Name something Nebraska is known for producing.",
    answers: {
      common: ["Corn|sweet corn|field corn", "Beef|cattle|steak|cows"],
      familiar: ["Soybeans|beans|soy", "Pork|hogs|pigs", "Kool-Aid|koolaid", "Wheat", "Ethanol", "Omaha Steaks"],
      unusual: ["Popcorn", "Sorghum|milo", "Great Northern beans|dry beans|pinto beans|edible beans", "Hay|alfalfa", "Sugar beets|beets", "Eggs|chickens", "Sunflowers"],
      rare: ["Insurance|mutual of omaha", "Proso millet|millet", "Bison|buffalo", "Potatoes|seed potatoes", "Honey", "Billionaires|warren buffett"],
      extreme: ["TV dinners|tv dinner|swanson", "Reuben sandwich|reuben", "Vise-Grip pliers|vise grip|vise grips|vise-grips", "Center pivot irrigation|center pivots|pivots|irrigation", "CliffsNotes|cliffs notes"],
    },
  },
  {
    id: "only-tourist",
    category: "only",
    prompt: "Name a place tourists might visit in Nebraska.",
    answers: {
      common: ["Henry Doorly Zoo|omaha zoo|zoo|doorly zoo", "Memorial Stadium", "Old Market", "Chimney Rock"],
      familiar: ["Carhenge", "Scotts Bluff National Monument|scotts bluff", "Strategic Air Command Museum|sac museum|sac aerospace museum|strategic air and space museum", "Haymarket", "Lauritzen Gardens", "Great Platte River Road Archway|archway|the arch", "State Capitol|nebraska capitol|capitol"],
      unusual: ["Toadstool Geologic Park|toadstool", "Fort Robinson", "Niobrara River|niobrara", "Smith Falls", "Lake McConaughy|lake mac|big mac", "Ashfall Fossil Beds|ashfall", "Joslyn Art Museum|joslyn", "Durham Museum|durham", "Indian Cave State Park|indian cave", "Mahoney State Park|mahoney", "Cabela's|cabelas", "Boys Town"],
      rare: ["Agate Fossil Beds|agate", "Pioneer Village|harold warp pioneer village", "Arbor Lodge", "Homestead National Historical Park|homestead national monument|homestead", "Willa Cather Childhood Home|willa cather home|cather home", "Buffalo Bill Ranch|scout's rest|scouts rest", "Golden Spike Tower", "Bailey Yard", "Rowe Sanctuary|crane watching|crane viewing", "Morrill Hall|state museum|university of nebraska state museum", "Hastings Museum", "Stuhr Museum", "Courthouse and Jail Rocks|courthouse rock|jail rock", "Pony Express Station"],
      extreme: ["Monowi", "World's largest ball of stamps|ball of stamps", "World's largest porch swing|porch swing|hebron porch swing", "Sod House Museum|sod house", "Trailside Museum", "Hudson-Meng Bison Kill|hudson meng", "Merritt Reservoir|merritt", "Valentine National Wildlife Refuge|valentine refuge", "Fort Niobrara", "Ogallala Front Street|front street"],
    },
  },
  {
    id: "only-famous",
    category: "only",
    prompt: "Name a famous person from Nebraska.",
    answers: {
      common: ["Warren Buffett|buffett|buffet|warren buffet", "Johnny Carson|carson", "Gerald Ford|ford|president ford"],
      familiar: ["Malcolm X", "Marlon Brando|brando", "Larry the Cable Guy", "Hilary Swank|hillary swank|swank", "Fred Astaire|astaire", "Gabrielle Union", "Tom Osborne|osborne"],
      unusual: ["Henry Fonda|fonda", "Nick Nolte|nolte", "Alexander Payne", "Conor Oberst|oberst", "Andy Roddick|roddick", "Gale Sayers|sayers", "Bob Gibson", "Willa Cather|cather", "Dick Cheney|cheney", "Nicholas Sparks", "Buffalo Bill|buffalo bill cody|william cody", "William Jennings Bryan", "Wade Boggs|boggs", "Chris Klein", "311|three eleven"],
      rare: ["Montgomery Clift|clift", "Dick Cavett|cavett", "Darryl F. Zanuck|darryl zanuck|zanuck", "Standing Bear|chief standing bear", "Red Cloud|chief red cloud", "Susan La Flesche Picotte|susan la flesche|susan picotte", "Mari Sandoz|sandoz", "Harold Lloyd", "Evan Williams", "Loren Eiseley|eiseley", "Ted Sorensen", "Ted Kooser|kooser", "John Neihardt|neihardt", "Grace Abbott", "Ben Sasse|sasse"],
      extreme: ["Edwin Perkins|kool-aid inventor", "Elsie Eiler|mayor of monowi", "Ward Bond", "J. Sterling Morton|sterling morton|julius sterling morton", "Roscoe Pound", "Frank Zybach", "Howard Hanson", "Clayton Anderson"],
    },
  },
  {
    id: "only-water",
    category: "only",
    prompt: "Name a Nebraska river, creek or lake.",
    ignore: ["river", "lake", "reservoir", "creek"],
    answers: {
      common: ["Platte River", "Missouri River", "Lake McConaughy|lake mac|big mac"],
      familiar: ["Niobrara River", "Elkhorn River", "Republican River", "Loup River", "Salt Creek", "Branched Oak Lake", "Holmes Lake", "Lewis and Clark Lake"],
      unusual: ["Pawnee Lake", "Harlan County Reservoir|harlan county", "Lake Minatare", "Calamus Reservoir", "Merritt Reservoir", "Big Blue River|blue river", "Lake Ogallala", "Zorinsky Lake", "Carter Lake", "Standing Bear Lake", "Sherman Reservoir", "Johnson Lake", "Lake Wanahoo", "Medicine Creek|harry strunk lake|strunk"],
      rare: ["Dismal River", "Snake River", "Little Blue River", "Nemaha River", "Box Butte Reservoir", "Wagon Train Lake", "Conestoga Lake", "Swanson Reservoir", "Enders Reservoir", "Hugh Butler Lake|red willow reservoir", "Lake Babcock", "Lake North", "Lake Maloney"],
      extreme: ["Keya Paha River", "White River", "Frenchman River|frenchman creek", "Cedar River", "Wood River", "Long Pine Creek", "Bazile Creek", "Plum Creek"],
    },
  },
  {
    id: "only-symbols",
    category: "only",
    prompt: "Name an official Nebraska state symbol, nickname or motto.",
    answers: {
      common: ["Goldenrod|state flower", "Western meadowlark|meadowlark|state bird", "The Cornhusker State|cornhusker state"],
      familiar: ["Cottonwood|cottonwood tree", "Kool-Aid|state soft drink", "Equality Before the Law", "The Good Life|nebraska the good life", "State flag|nebraska flag|flag"],
      unusual: ["White-tailed deer|whitetail deer|deer", "Honeybee|honey bee|bee", "Channel catfish|catfish", "Mammoth|state fossil", "Square dance|square dancing", "State seal|great seal"],
      rare: ["Blue chalcedony|blue agate|state gemstone", "Prairie agate|state rock", "Little bluestem|state grass", "Milk|state beverage", "Beautiful Nebraska|state song", "Tree Planters State|tree planter state", "Honestly, it's not for everyone|its not for everyone"],
      extreme: ["Holdrege soil|holdrege series|state soil", "Bug-Eating State|bugeaters|bug eaters", "Antelope State|antelope"],
    },
  },
  {
    id: "only-invented",
    category: "only",
    prompt: "Name something that was invented or started in Nebraska.",
    answers: {
      common: ["Kool-Aid|koolaid", "Runza"],
      familiar: ["Arbor Day", "TV dinner|tv dinners|swanson tv dinner", "Reuben sandwich|reuben", "Boys Town", "Omaha Steaks"],
      unusual: ["Center pivot irrigation|center pivot|pivot irrigation", "CliffsNotes|cliffs notes", "Vise-Grip|vise grip pliers|vise grips", "Unicameral|one-house legislature", "Godfather's Pizza|godfathers", "Dorothy Lynch", "Valentino's|valentinos", "Cabela's|cabelas", "Mutual of Omaha", "Nebraska Furniture Mart|furniture mart", "Hudl"],
      rare: ["Wild Kingdom|mutual of omaha's wild kingdom", "Conagra|conagra brands", "Kiewit", "Cheese Frenchee|frenchee", "Arbor Day Foundation"],
      extreme: ["The rodeo|rodeo|old glory blowout|buffalo bill's wild west", "Fairbury hot dogs|fairbury", "Behlen Manufacturing|behlen", "Duncan Aviation"],
    },
  },
  {
    id: "only-festivals",
    category: "only",
    prompt: "Name a Nebraska festival, fair or annual celebration.",
    answers: {
      common: ["Arbor Day", "Nebraska State Fair|state fair", "County fair|county fairs"],
      familiar: ["College World Series|cws", "Kool-Aid Days", "Husker game day|game day", "Vala's Pumpkin Patch|valas|pumpkin patch", "Fourth of July|july 4th|fireworks", "Husker Spring Game|spring game"],
      unusual: ["NEBRASKAland Days|nebraskaland days", "Czech Days|wilber czech days|czech festival", "Taste of Omaha", "Maha Festival|maha", "Oregon Trail Days", "Applejack Festival|applejack", "Junkstock", "Cornhusker State Games", "Nebraska's Big Rodeo|burwell rodeo|big rodeo", "Crane Festival|nebraska crane festival|sandhill crane festival"],
      rare: ["Fur Trade Days", "Swedish Festival|midsummer festival|stromsburg swedish festival", "Lincoln Marathon", "Star City Holiday Parade|star city parade", "Celebrate Lincoln", "Lincoln Calling", "Juneteenth Lincoln|juneteenth", "Omaha Pride|lincoln pride|pride"],
      extreme: ["Wayne Chicken Show|chicken show", "King Korn Karnival|kass kounty king korn karnival", "Old Glory Blowout", "Danish Days|dannebrog", "Sandhills Open Road Challenge|open road challenge"],
    },
  },

  /* ==================== MIDWEST MADE ==================== */
  {
    id: "midwest-fair-food",
    category: "midwest",
    prompt: "Name a food you'd find at a Nebraska county fair.",
    answers: {
      common: ["Corn dog|corndog|corn dogs", "Funnel cake|funnel cakes", "Cotton candy", "Lemonade|fresh squeezed lemonade|lemon shakeup"],
      familiar: ["Turkey leg|turkey legs", "Cheese curds", "Kettle corn", "Elephant ear|elephant ears", "Snow cone|sno cone", "Mini donuts|little donuts", "Fried Oreos|deep fried oreos", "Nachos"],
      unusual: ["Walking taco|taco in a bag", "Pork tenderloin|tenderloin sandwich", "Fried pickles", "Homemade pie|pie|church pie", "Sweet corn|roasted corn|corn on the cob", "Caramel apple|candy apple", "Pronto pup", "Gyro|gyros", "Ice cream"],
      rare: ["Runza", "Deep fried candy bar|fried snickers|deep fried snickers", "Fried butter", "Bierock|bierocks", "Kolache|kolaches", "Cinnamon roll|cinnamon rolls", "Bison burger", "Pancake breakfast|pancakes", "Fried cheesecake", "Saltwater taffy|taffy", "Root beer float"],
      extreme: ["Rocky Mountain oysters|calf fries", "Fried Kool-Aid|deep fried kool aid", "Chislic", "Pickle on a stick", "Navy bean soup|bean feed"],
    },
  },
  {
    id: "midwest-brands",
    category: "midwest",
    prompt: "Name a brand or store you associate with the Midwest.",
    answers: {
      common: ["Casey's|caseys", "Hy-Vee|hyvee", "Runza", "Menards"],
      familiar: ["Kwik Trip|kwik star", "Culver's|culvers", "Target", "Kum & Go|kum and go", "Super Saver", "Russ's Market|russ's|russ market", "Scheels", "Cabela's|cabelas", "Pizza Ranch", "Valentino's|valentinos", "Godfather's Pizza|godfathers"],
      unusual: ["Dairy Queen|dq", "Shopko", "Hormel", "Spam", "Oscar Mayer", "Kraft", "Blue Bunny", "Omaha Steaks", "Fareway", "Baker's|bakers", "Nebraska Furniture Mart|furniture mart|nfm", "John Deere|deere", "Maytag", "Fleet Farm|mills fleet farm", "Bomgaars", "Tractor Supply"],
      rare: ["Schwan's|schwans", "Bosselman|bosselman's|boss truck shop", "Bucky's|buckys", "Mutual of Omaha", "No Frills", "Younkers", "Gordmans", "Amana", "Spangles", "Hiland Dairy|hiland", "Sapp Bros|sapp brothers"],
      extreme: ["Hinky Dinky", "Pamida", "Roberts Dairy|roberts", "Storz Beer|storz", "Fairbury Hot Dogs|fairbury"],
    },
  },
  {
    id: "midwest-potluck",
    category: "midwest",
    prompt: "Name something people bring to a Midwestern potluck.",
    answers: {
      common: ["Casserole|casseroles", "Jell-O salad|jello|jello salad|jell-o", "Deviled eggs", "Potato salad"],
      familiar: ["Tater tot casserole|hotdish|tater tot hotdish", "Green bean casserole", "Pasta salad", "Baked beans", "Brownies", "Little smokies|crockpot meatballs|meatballs", "Cheesy potatoes|funeral potatoes|au gratin potatoes", "Puppy chow|muddy buddies", "Rolls|dinner rolls"],
      unusual: ["Ambrosia salad|ambrosia|fluff", "Watergate salad|pistachio salad", "Taco salad|dorito taco salad|catalina taco salad", "Scotcheroos", "Lemon bars|bars|dessert bars", "Rhubarb pie|rhubarb crisp|rhubarb", "Seven layer salad|7 layer salad", "Pickle roll-ups|pickle wraps|pickle rollups", "Cornbread", "Sloppy joes", "Monster cookies"],
      rare: ["Snickers salad", "Cookie salad", "Frog eye salad", "Ham balls", "Ham buns|ham and cheese sliders", "Kolaches|kolache", "Bierocks|bierock", "Runza casserole", "Maid-Rites|loose meat sandwiches|maid rite", "Strawberry pretzel salad"],
      extreme: ["Lutefisk", "Glorified rice", "Kuchen", "Lime Jell-O with shredded carrots|carrot jello", "Cornflake chicken"],
    },
  },
  {
    id: "midwest-argue",
    category: "midwest",
    prompt: "Name a food Nebraskans might argue about.",
    answers: {
      common: ["Ranch dressing|ranch|ranch on pizza", "Pineapple on pizza|hawaiian pizza", "Chili and cinnamon rolls|cinnamon rolls|cinnamon rolls with chili"],
      familiar: ["Runza", "Beans in chili|chili beans|chili", "Miracle Whip|mayo vs miracle whip", "Steak doneness|well done steak|ketchup on steak|steak", "Candy corn", "Hotdish vs casserole|hotdish|casserole"],
      unusual: ["Dorothy Lynch", "Valentino's vs Godfather's|valentinos|godfathers", "Sweet corn|corn on the cob|best sweet corn", "Raisins|raisins in cookies", "Kolache fillings|kolaches", "Bierock vs Runza|bierock", "Pop vs soda|pop|soda"],
      rare: ["Cheese Frenchee|frenchee", "Jell-O salad|is jello a salad", "Rocky Mountain oysters", "Kool-Aid flavors|best kool aid flavor|kool aid", "Ketchup on eggs", "Taco John's vs Taco Bell|taco johns|potato oles"],
      extreme: ["Bison vs beef|bison", "Salt on watermelon", "Lima beans", "Sweet pickles vs dill|sweet pickles", "Corn syrup on pancakes|karo syrup"],
    },
  },
  {
    id: "midwest-grandma",
    category: "midwest",
    prompt: "Name something you'd find at a Midwestern grandma's house.",
    answers: {
      common: ["Candy dish|hard candy|butterscotch candies|candy", "Doilies|doily", "Quilts|quilt", "Cookies"],
      familiar: ["Afghan|crocheted blanket|knitted blanket", "Cookie tin full of sewing supplies|cookie tin|blue danish cookie tin|sewing tin", "Jigsaw puzzle|puzzle", "Grandfather clock|clock", "Recliner", "Bible", "Crossword|word search|puzzle books", "Figurines|precious moments|hummels|ceramic figurines", "Family photos|photos|picture wall", "Landline|rotary phone|phone on the wall", "Werther's|werthers"],
      unusual: ["Canning jars|mason jars|jars", "Pickled beets", "Cool Whip tub leftovers|cool whip containers|butter tub leftovers|reused butter tubs", "Tupperware", "Wheel of Fortune on TV|wheel of fortune|jeopardy", "Bag of plastic bags|plastic bags|grocery bags", "Pyrex|corningware", "Plastic on the furniture|plastic covers", "Recipe box|recipe cards"],
      rare: ["Church cookbook|church cookbooks", "Bingo daubers|bingo", "Avon|avon products", "Ceramic Christmas tree", "Cuckoo clock", "Ceramic chicken|rooster decor|chickens", "Popcorn tin", "Salt and pepper shaker collection|salt and pepper shakers", "Ice cream pail|ice cream bucket", "Lawrence Welk|lawrence welk show"],
      extreme: ["Crocheted toilet paper cover|toilet paper doll|toilet roll cover", "Kitchen witch", "Rosemaling", "Organ|electric organ", "Bowl of wax fruit|wax fruit|fake fruit", "Husker calendar from 1997|1997 calendar|old calendar"],
    },
  },
  {
    id: "midwest-phrase",
    category: "midwest",
    prompt: "Name a Midwestern phrase or saying.",
    answers: {
      common: ["Ope", "You betcha|ya betcha|betcha", "Pop"],
      familiar: ["Uff da|ufda|uffda", "Supper", "Could be worse", "Dontcha know|don't ya know", "Oh, for cute|oh fer cute|for cute", "Real quick|run to the store real quick", "Go Big Red"],
      unusual: ["Jeez Louise|geez louise", "That's different|thats different", "Oh my heck", "Gosh darn|gosh|golly", "Not too shabby", "Sneak right past ya|just gonna sneak past ya|i'm just gonna squeeze past", "Hotdish"],
      rare: ["Holy buckets", "Spendy", "Jeet|did you eat|jeet yet", "Borrow me|borrow me a pencil", "Cripes|for cripes sake", "Bubbler", "Ornery", "The Cities|the twin cities"],
      extreme: ["Catty-wampus|catawampus|kitty corner|caddy corner", "Pert near|pretty near", "Warsh|warshington", "Yah sure|yah, sure, you betcha", "Hey now"],
    },
  },
  {
    id: "midwest-dessert",
    category: "midwest",
    prompt: "Name a classic Midwestern dessert or bar.",
    answers: {
      common: ["Brownies", "Apple pie", "Puppy chow|muddy buddies", "Rice Krispie treats|rice crispy treats"],
      familiar: ["Scotcheroos", "Rhubarb pie|rhubarb crisp|strawberry rhubarb", "Lemon bars", "Kolaches|kolache", "Monster cookies", "Seven layer bars|magic bars|hello dollies", "Snickerdoodles", "Pumpkin pie", "Cherry pie"],
      unusual: ["Dirt cake|dirt pudding|worms and dirt", "Strawberry pretzel salad", "Buckeyes", "Special K bars", "Zucchini bread", "Bread pudding", "Oreo fluff|oreo salad", "Butterscotch bars", "Sheet cake|texas sheet cake", "Peanut butter bars"],
      rare: ["Gooey butter cake", "Sour cream raisin pie", "Kringle", "Snickers salad", "Cream pie|banana cream pie|coconut cream pie", "Bars on a sheet pan|pan bars"],
      extreme: ["Kuchen", "Lefse", "Rosettes", "Krumkake", "Grasshopper pie", "Sugar cream pie|hoosier pie"],
    },
  },
  {
    id: "midwest-ope",
    category: "midwest",
    prompt: "Name a reason a Midwesterner might say \"ope.\"",
    answers: {
      common: ["Bumping into someone|bumped into someone|bump into someone", "Dropping something|dropped something", "Squeezing past someone|getting past someone|walking past someone|squeeze by"],
      familiar: ["Tripping|tripped", "Spilling a drink|spilled something|spill", "Almost running into someone|near collision", "Shopping cart collision|grocery cart|carts", "Missing a step"],
      unusual: ["Forgetting someone's name|forgot a name", "Reaching past someone|reaching across the table", "Door dance|both going the same way|holding the door awkwardly", "Missed exit|wrong turn", "Stubbing a toe|stubbed toe", "Sneezing|sneeze", "Hiccup|burp"],
      rare: ["Hitting reply all|reply all", "Waving at someone who wasn't waving at you|waved back", "Calling the teacher mom|called teacher mom", "Saying \"you too\" to the waiter|you too", "Interrupting someone|talking over someone", "Wrong name on a coffee cup"],
      extreme: ["Deer on the road|deer", "Hail starting|hail", "Husker fumble|fumble|missed field goal", "Combine on the highway|combine", "Stepping in a cow pie|cow pie"],
    },
  },
  {
    id: "midwest-fridge",
    category: "midwest",
    prompt: "Name a drink you might find in a Nebraska fridge.",
    answers: {
      common: ["Milk", "Beer", "Pop|soda|coke|pepsi", "Water|bottled water"],
      familiar: ["Kool-Aid|koolaid", "Busch Light|busch", "Iced tea|sweet tea|tea", "Orange juice|juice|oj", "Chocolate milk", "Coors Light|coors", "Lemonade"],
      unusual: ["Mountain Dew|mtn dew", "Dr Pepper|dr. pepper", "Sunny D|sunny delight", "Energy drink|monster|red bull|bang", "Gatorade|powerade", "Capri Sun", "Keystone Light|keystone", "Boulevard|boulevard wheat", "Iced coffee|cold brew"],
      rare: ["Empyrean|empyrean brewing", "Zipline Brewing|zipline", "Grain Belt", "Squirt", "Fresca", "Hamm's|hamms", "Spotted Cow", "Buttermilk", "V8|vegetable juice", "Kombucha", "Ginger ale"],
      extreme: ["Red beer|beer and tomato juice|clamato", "Pickle juice", "Storz|storz beer"],
    },
  },

  /* ==================== CAMPUS CULTURE ==================== */
  {
    id: "campus-dorm",
    category: "campus",
    prompt: "Name something a college student keeps in their dorm.",
    answers: {
      common: ["Mini fridge|fridge|refrigerator", "Laptop|computer", "Microwave", "Snacks", "Ramen|instant noodles", "Bed|lofted bed"],
      familiar: ["String lights|led lights|fairy lights|lights", "Posters", "Futon", "Rug", "Box fan|fan", "Coffee maker|keurig", "Shower caddy", "Tapestry", "Desk lamp|lamp", "Mattress topper", "Laundry basket|hamper", "TV|television"],
      unusual: ["Shower shoes|flip flops", "Plants|succulents|plant", "Command strips|command hooks", "Rice cooker", "Bean bag chair|bean bag", "Video game console|xbox|playstation|nintendo switch|ps5", "Whiteboard", "Water filter|brita", "Record player|turntable", "Husker flag", "Mirror", "Tide pods|laundry detergent"],
      rare: ["Air fryer", "Hot plate", "Betta fish|fish|fish tank", "Mini vacuum|dustbuster|vacuum", "Toolkit|tool kit|hammer", "First aid kit", "Humidifier", "Air purifier", "Essential oil diffuser|diffuser", "Neon sign", "Projector", "Sewing kit", "Lava lamp", "Waffle maker"],
      extreme: ["Hamster|pet hamster", "Life-size cardboard cutout|cardboard cutout", "Kayak", "Snake|pet snake", "Ironing board", "Prom dress|formal dress", "Sourdough starter"],
    },
  },
  {
    id: "campus-procrastinate",
    category: "campus",
    prompt: "Name something college students procrastinate on.",
    answers: {
      common: ["Homework|assignments", "Studying|study", "Essays|papers|essay|paper", "Laundry"],
      familiar: ["Cleaning|cleaning my room", "Group project|projects|project", "Emails|answering emails", "Applying for internships|job applications|internships|applying for jobs", "Readings|reading", "Dishes|doing dishes", "Grocery shopping|groceries", "Going to bed|sleep|sleeping"],
      unusual: ["FAFSA", "Registering for classes|scheduling classes|class registration", "Calling mom|calling parents|calling home", "Getting a haircut|haircut", "Going to the gym|exercise|working out", "Discussion posts|canvas posts", "Resume|updating resume", "Doctor appointment|making appointments", "Washing sheets|changing sheets", "Taking out the trash|trash"],
      rare: ["Returning library books|library books", "Paying a parking ticket|parking ticket", "Finding housing|apartment search|signing a lease", "Dentist|going to the dentist", "Oil change", "Thank-you notes|thank you cards", "Unsubscribing from emails", "Returning a package|returns", "Taxes", "Reading the syllabus|syllabus", "Opening mail|mail"],
      extreme: ["Defrosting the mini fridge|defrosting the fridge", "Clearing phone storage|phone storage|software update", "Renewing a driver's license|car registration", "Replying to the group chat|group chat", "Watering plants", "Changing the smoke detector battery"],
    },
  },
  {
    id: "campus-union",
    category: "campus",
    prompt: "Name something you'd find in a college student union.",
    answers: {
      common: ["Food court|food|restaurants", "Bookstore", "Study tables|tables|couches|study spaces", "Coffee shop|coffee|starbucks"],
      familiar: ["Chick-fil-A|chick fil a|chickfila", "Students", "ATM", "Printers|printer", "Lounge", "Credit union|bank", "Information desk|info desk", "Microwave|microwaves", "TVs|tv"],
      unusual: ["Pool table|billiards", "Ballroom", "Post office|mail", "Art gallery|art", "Student org tables|club fair|tabling", "Free T-shirts|free stuff|free shirts", "Ticket office", "Vending machines|vending machine", "Bowling alley|bowling"],
      rare: ["Someone napping|students sleeping|napping student", "Lost and found", "Food pantry|husker pantry", "Piano", "Meditation room|prayer room", "Phone charging station|charging station", "Panda Express|panda", "Ping-pong table|ping pong"],
      extreme: ["Therapy dogs|puppies|dogs", "Fireplace", "Arcade machine|arcade", "A llama|llama", "Barbershop|barber"],
    },
  },
  {
    id: "campus-late",
    category: "campus",
    prompt: "Name a reason someone might be late to class.",
    answers: {
      common: ["Overslept|slept in|alarm didn't go off|alarm|sleeping", "Traffic", "Parking|couldn't find parking"],
      familiar: ["Missed the bus|bus|bus was late", "Bad weather|weather|snow|ice", "Coffee line|getting coffee|starbucks line|coffee", "Got lost|lost|couldn't find the building", "Forgot|forgot about class", "Previous class ran long|class ran late"],
      unusual: ["Train|stopped by a train|train crossing", "Construction|road construction", "Bathroom", "Scooter died|scooter|bird scooter", "Bike flat|flat bike tire|bike", "Wrong room|wrong building", "Long walk from East Campus|east campus", "Talking to a professor|office hours"],
      rare: ["Elevator broken|elevator", "Got a parking ticket|parking ticket", "Car wouldn't start|dead battery", "Wind|the wind", "Locked out|locked out of dorm", "Spilled coffee", "Fire alarm|fire drill", "Stuck behind a campus tour|campus tour|tour group"],
      extreme: ["Squirrel|squirrels", "Goose attack|geese|goose", "Two-factor authentication|duo|duo push|2fa", "Laptop update|windows update", "Herbie Husker photo op|herbie"],
    },
  },
  {
    id: "campus-lincoln",
    category: "campus",
    prompt: "Name a place in Lincoln, off campus, where students hang out.",
    banned: ["Memorial Stadium", "Nebraska Union", "Love Library"],
    answers: {
      common: ["Haymarket|the haymarket", "Downtown|O Street|o st", "Pinnacle Bank Arena|pba|the arena"],
      familiar: ["Holmes Lake|holmes", "Railyard|the railyard", "Gateway Mall|westfield gateway|gateway", "Duffy's Tavern|duffys", "SouthPointe Pavilions|southpointe|south pointe", "Pioneers Park|pioneers", "Coffee shop|coffee shops"],
      unusual: ["Sunken Gardens", "Lincoln Children's Zoo|childrens zoo|zoo", "Zoo Bar", "Ivanna Cone", "Lazlo's|lazlos", "Branched Oak Lake|branched oak", "The Mill|the mill coffee", "Star City Shores", "Pinewood Bowl", "Wilderness Park", "Indigo Bridge Books|indigo bridge", "Spikes Beach Bar|spikes", "Pla Mor Ballroom|pla mor", "Haymarket Park|saltdogs|lincoln saltdogs"],
      rare: ["Hyde Observatory", "Lux Center for the Arts|lux center", "Lancaster Event Center|event center", "Pioneers Park Nature Center|nature center", "Capitol observation deck|state capitol|capitol", "The Bay|the bay skatepark", "Antelope Park", "Tower Square", "Lincoln Stars game|lincoln stars|ice box"],
      extreme: ["Robber's Cave|robbers cave", "Spring Creek Prairie", "Nine-Mile Prairie|nine mile prairie", "Prairie Pines", "Mopac Trail|mopac", "Museum of American Speed|speedway museum|speedway motors"],
    },
  },
  {
    id: "campus-unl-spot",
    category: "campus",
    prompt: "Name a UNL building or campus spot.",
    ignore: ["hall", "center", "building"],
    answers: {
      common: ["Memorial Stadium|stadium", "Nebraska Union|the union|city union", "Love Library|love|the library", "Campus Recreation Center|campus rec|the rec|rec center"],
      familiar: ["Sheldon Museum of Art|sheldon", "Lied Center|lied", "Selleck Hall|selleck", "Abel Hall|abel", "Harper Hall|harper", "Kauffman Center|kauffman|raikes", "Oldfather Hall|oldfather", "Andersen Hall|andersen", "Hamilton Hall|hamilton", "Morrill Hall|morrill|state museum", "Broyhill Fountain|broyhill|fountain", "Kiewit Hall|kiewit", "Bob Devaney Sports Center|devaney", "East Campus"],
      unusual: ["Avery Hall|avery", "Burnett Hall|burnett", "Henzlik Hall|henzlik", "Louise Pound Hall|louise pound", "Westbrook Music Building|westbrook", "Temple Building|temple", "Architecture Hall|arch hall", "Manter Hall|manter", "Brace Lab|brace", "Schorr Center|schorr", "Jorgensen Hall|jorgensen", "Hawks Hall|howard hawks|hawks", "Carolyn Pope Edwards Hall|cpeh", "Mabel Lee Hall|mabel lee", "Coliseum|nebraska coliseum", "Smith Hall|smith", "Neihardt Hall|neihardt", "Knoll Residential Center|knoll", "The Village|village", "Courtyards", "Massengale|massengale residential center", "Willa Cather Dining Center|cather dining", "Dairy Store|east campus dairy store", "East Union|nebraska east union", "Nebraska Innovation Campus|innovation campus|nic", "Hawks Championship Center"],
      rare: ["Maxwell Arboretum|arboretum", "Hixson-Lied|hixson lied", "Ferguson Hall|ferguson", "Nebraska Hall", "Othmer Hall|othmer", "Canfield Administration|canfield", "Teachers College Hall|teachers college", "Mueller Tower|mueller|bell tower|carillon", "Sheldon Sculpture Garden|sculpture garden", "Bessey Hall|bessey", "Keim Hall|keim", "Filley Hall|filley", "Chase Hall|chase", "Hardin Hall|hardin", "Leverton Hall|leverton", "Ross Media Arts Center|mary riepma ross|the ross", "Morrison Center|morrison", "Beadle Center|beadle", "Military and Naval Science|m&n|mns", "Cook Pavilion|cook", "Outdoor Adventures Center|outdoor adventures"],
      extreme: ["Cather Hall|cather and pound|pound hall", "Ed Weir Stadium|ed weir track", "Osborne Athletic Complex", "Prairie Pines", "East Campus Mall|east campus green", "The Greenhouses|greenhouse|greenhouses"],
    },
  },
  {
    id: "campus-backpack",
    category: "campus",
    prompt: "Name something you'd find in a college student's backpack.",
    answers: {
      common: ["Laptop|computer|chromebook", "Notebook|notebooks", "Pens|pencils|pen|pencil", "Water bottle|hydro flask|stanley", "Charger|phone charger|laptop charger"],
      familiar: ["Snacks|granola bar", "Textbook|textbooks|book", "Headphones|airpods|earbuds", "Calculator|graphing calculator", "Planner", "Wallet", "Keys", "Gum"],
      unusual: ["Highlighters|highlighter", "Chapstick|lip balm", "Deodorant", "Umbrella", "Hand sanitizer", "Advil|ibuprofen|tylenol|pain reliever", "Energy drink|celsius|red bull", "Folder|folders", "Sticky notes|post-its", "Flash cards|index cards", "Gym clothes", "Tupperware|leftovers"],
      rare: ["Old receipts|receipts", "Crumbs", "Mystery wrapper|wrappers|trash", "Pepper spray", "Tampons|pads|period products", "Portable charger|power bank", "NCard|student id|id", "Scantron", "Tide pen|stain remover"],
      extreme: ["Rotten banana|banana|old banana", "Overdue library book", "Sewing kit", "Expired parking permit", "Graded quiz from freshman year|old quiz", "Rubber duck"],
    },
  },
  {
    id: "campus-finals",
    category: "campus",
    prompt: "Name something students do during finals week.",
    answers: {
      common: ["Study|studying", "Cram|all-nighter|pull an all nighter|cramming", "Drink coffee|coffee", "Stress|panic|cry|freak out"],
      familiar: ["Nap in the library|nap|sleep in the library", "Energy drinks", "Make flash cards|flashcards", "Study group|study groups", "Forget to eat|skip meals", "Order takeout|doordash|pizza|delivery", "Visit therapy dogs|therapy dogs|puppies", "Go to office hours|office hours", "Procrastinate|watch netflix|netflix"],
      unusual: ["Calculate their grade|grade calculator|what do i need on the final", "Pack up|move out|packing", "Wear pajamas|sweatpants", "Midnight breakfast|free food", "Pray", "Clean their room|cleaning", "Sell back textbooks|sell textbooks", "Email the professor|email professors", "Book flights home|travel home|go home"],
      rare: ["Primal scream|scream", "Rewatch lectures|watch recorded lectures", "Make a study playlist|playlist", "Work out|go to the gym", "Change majors|change major", "Bake|baking", "Make a color-coded schedule|color code notes"],
      extreme: ["Rearrange furniture|rearrange their room", "Learn a new hobby|knit|knitting", "Deep clean the mini fridge", "Start a new TV series", "Write a will"],
    },
  },
  {
    id: "campus-orgs",
    category: "campus",
    prompt: "Name a type of student organization or club.",
    answers: {
      common: ["Fraternity|sorority|greek life|frat", "Student government|asun", "Intramurals|intramural sports|im sports"],
      familiar: ["Marching band|cornhusker marching band|band", "Honor society|honors", "Club sports", "Student newspaper|daily nebraskan|newspaper", "Religious group|campus ministry|bible study", "Pre-med club|pre-health", "Service club|volunteer club|volunteering", "Dance team|dance"],
      unusual: ["Debate|speech team|debate team", "Model UN|model united nations", "Ski club|snowboard club", "Quiz bowl", "Cultural organization|international student organization|cultural club", "Esports club|gaming club", "Theater|theatre", "A cappella|acapella", "Robotics", "Investment club", "Chess club", "Improv", "Anime club", "Board game club", "Mock trial", "Ultimate frisbee"],
      rare: ["Quidditch|quadball", "Rodeo club", "Juggling club", "Swing dance club", "Knitting club", "Rocket club|rocketry", "Beekeeping club", "Student radio|krnu", "Bass fishing club", "Archery club"],
      extreme: ["Meat judging team|meat judging", "Livestock judging|livestock judging team", "Crop judging|soil judging", "Dairy club", "Shotgun sports|trap club", "Ballroom dance"],
    },
  },

  /* ==================== NEBRASKA ROAD TRIP ==================== */
  {
    id: "road-i80",
    category: "roadtrip",
    prompt: "Name something you might pass on Interstate 80 in Nebraska.",
    answers: {
      common: ["Cornfields|corn|corn fields", "Cows|cattle", "Semi trucks|semis|trucks", "Gas stations|gas station"],
      familiar: ["The Archway|great platte river road archway|archway", "Wind turbines|wind farm|windmills", "Billboards", "Grain elevators|elevators", "Rest areas|rest stop", "Truck stops", "Platte River|platte", "Sandpit lakes|interstate lakes|lakes", "Grain bins"],
      unusual: ["Cabela's|cabelas", "Center pivots|irrigation", "Pheasants", "Union Pacific trains|trains|coal trains", "Hay bales", "Roadkill|dead deer", "Kearney", "North Platte", "Ogallala", "York", "Fireworks stores|fireworks stand", "Feedlots|feedlot"],
      rare: ["Golden Spike Tower", "Bailey Yard", "Ole's Big Game Steakhouse|oles|ole's", "Pony Express Station", "Sandhill cranes|cranes", "Tumbleweeds|tumbleweed", "Oregon Trail markers|historical markers", "Prairie dogs", "Snow fence|snow fences"],
      extreme: ["I-80 sculptures|bicentennial sculptures|sculpture", "Sapp Bros. coffee pot water tower|coffee pot water tower|coffee pot", "Mule deer", "Pronghorn|antelope", "Covered wagon"],
    },
  },
  {
    id: "road-pack",
    category: "roadtrip",
    prompt: "Name something you'd pack for a Nebraska road trip.",
    answers: {
      common: ["Snacks", "Water|water bottle", "Phone charger|charger", "Pillow"],
      familiar: ["Sunglasses", "Playlist|music", "Blanket", "Jacket|coat|hoodie", "Cooler", "Sunscreen", "Clothes|change of clothes", "Toothbrush"],
      unusual: ["Jumper cables", "Ice scraper", "Bug spray", "Aux cord", "Beef jerky|jerky", "Road atlas|paper map|map", "Spare tire", "Wet wipes|baby wipes", "Trash bag", "Camera"],
      rare: ["Tow strap", "Shovel", "Kitty litter", "Emergency kit|first aid kit", "Audiobook|podcast|podcasts", "Gas can", "Fishing pole|fishing rod", "Lawn chairs", "Hand warmers", "Cornhole boards|cornhole", "Binoculars"],
      extreme: ["Inner tube for the Niobrara|inner tube|tube", "Stock tank for tanking|tanking|stock tank", "Telescope", "Snake boots|rattlesnake boots", "Windshield washer fluid"],
    },
  },
  {
    id: "road-sandhills",
    category: "roadtrip",
    prompt: "Name something you might see driving through the Sandhills.",
    answers: {
      common: ["Cows|cattle", "Hills|sand dunes|dunes", "Grass|grassland|prairie"],
      familiar: ["Windmills|windmill", "Hay bales", "Ranches|ranch", "Fences|fence posts", "Lakes|ponds", "Deer", "Pickup trucks|trucks", "Nothing|empty road|nobody"],
      unusual: ["Center pivots", "Pronghorn|antelope", "Cowboys|ranchers", "Cattle guards|cattle guard", "Blowouts|sand blowouts", "Small towns|tiny town", "Coal trains|trains|railroad", "Prairie chickens|sharp-tailed grouse|grouse", "Stock tanks|stock tank", "Hawks|hawk"],
      rare: ["Bison|buffalo", "Wetlands|marsh", "Yucca|soapweed", "Ranch brands|branding", "Burrowing owl|owls", "Mule deer", "Rattlesnake|snake", "Wild turkeys|turkey", "Coyote|coyotes", "Dark skies|milky way|stars"],
      extreme: ["Blowout penstemon", "Boots on fence posts|boot fence|boots on posts", "Monowi", "Fox|swift fox", "One-room schoolhouse|country school"],
    },
  },
  {
    id: "road-gas-food",
    category: "roadtrip",
    prompt: "Name a snack you'd grab at a Midwest gas station.",
    answers: {
      common: ["Pizza|slice of pizza", "Hot dog|roller hot dog|roller grill", "Chips", "Candy|candy bar", "Beef jerky|jerky", "Donut|donuts"],
      familiar: ["Breakfast pizza", "Pop|soda|fountain drink", "Energy drink", "Coffee", "Slushie|icee|slurpee", "Sunflower seeds|seeds", "Cheesy breadsticks|breadsticks", "Taquitos"],
      unusual: ["Corn nuts", "Fried chicken|gas station chicken", "Kolache", "Burrito|breakfast burrito", "Egg rolls", "Cappuccino", "Pork rinds", "Trail mix", "Meat stick|slim jim"],
      rare: ["Pickle in a bag|big pickle|pickle", "Gas station sushi|sushi", "Glazers", "Cheese curds", "Fruit pie|hostess pie", "Banana", "Pickled eggs|hard boiled eggs"],
      extreme: ["Pickled pig's feet|pigs feet", "Chicken gizzards|gizzards", "Smoked turkey leg", "Deviled egg", "Ring bologna"],
    },
  },
  {
    id: "road-state-parks",
    category: "roadtrip",
    prompt: "Name a Nebraska state park or recreation area.",
    ignore: ["state", "park", "recreation", "area", "sra", "historical", "historic", "shp"],
    answers: {
      common: ["Mahoney State Park|eugene t mahoney|mahoney", "Platte River State Park", "Lake McConaughy|lake mac|big mac"],
      familiar: ["Indian Cave State Park", "Fort Robinson State Park|fort rob", "Branched Oak", "Ponca State Park", "Pawnee Lake", "Niobrara State Park", "Two Rivers"],
      unusual: ["Chadron State Park", "Smith Falls", "Lewis and Clark", "Fremont Lakes", "Louisville", "Wildcat Hills", "Ash Hollow", "Fort Kearny", "Johnson Lake", "Calamus", "Victoria Springs", "Arbor Lodge"],
      rare: ["Rock Creek Station", "Fort Atkinson", "Fort Hartsuff", "Buffalo Bill Ranch", "Champion Mill", "Keller Park", "Merritt Reservoir", "Medicine Creek", "Enders Reservoir", "Red Willow", "Windmill", "Mormon Island", "Lake Maloney", "Sherman Reservoir"],
      extreme: ["Box Butte Reservoir", "Swanson Reservoir", "Lake Ogallala", "Bridgeport", "Conestoga", "Wagon Train", "Bluestem", "Olive Creek"],
    },
  },
  {
    id: "road-attraction",
    category: "roadtrip",
    prompt: "Name a quirky roadside attraction in the Midwest.",
    answers: {
      common: ["Carhenge", "Corn Palace|mitchell corn palace", "World's largest ball of twine|ball of twine"],
      familiar: ["Wall Drug", "Mount Rushmore|rushmore", "Field of Dreams", "The Archway|archway", "Chimney Rock"],
      unusual: ["Iowa 80|world's largest truck stop", "Jolly Green Giant statue|jolly green giant", "Spam Museum", "House on the Rock", "Paul Bunyan and Babe|paul bunyan|babe the blue ox", "Golden Spike Tower", "Boys Town ball of stamps|ball of stamps", "Monowi"],
      rare: ["Enchanted Highway", "Salem Sue|world's largest holstein", "World's largest buffalo|jamestown buffalo", "Spoonbridge and Cherry|spoon and cherry", "Dinosaur Park", "Pioneer Village", "World's largest porch swing|porch swing", "Hastings Museum Kool-Aid exhibit|kool aid museum"],
      extreme: ["Garden of Eden|lucas garden of eden", "Big Brutus", "Porter Sculpture Park", "Hobo Museum|hobo convention", "Petrified Wood Park", "Bily Clocks", "World's largest Czech egg|czech egg"],
    },
  },
  {
    id: "road-games",
    category: "roadtrip",
    prompt: "Name a game or activity to pass time on a long drive.",
    answers: {
      common: ["I Spy", "Singing|music|listening to music", "License plate game|license plates", "Sleeping|nap"],
      familiar: ["20 Questions|twenty questions", "Podcasts|podcast", "Audiobook|audiobooks", "Slug bug|punch buggy", "Car karaoke|karaoke", "Movies|watching movies|tablet", "Snacking|eating", "Phone|scrolling|scroll tiktok"],
      unusual: ["Counting cows|count cows", "Alphabet game|abc game", "Would you rather", "Two truths and a lie", "Mad Libs", "Trivia", "Cards|uno|card games", "Reading", "Coloring"],
      rare: ["Cows on my side|cow game|cemetery cow game", "Name that tune", "Road trip bingo|car bingo|bingo", "Counting windmills|counting wind turbines", "Cloud watching", "Honking at truckers|truck honk|make truckers honk"],
      extreme: ["Counting grain elevators", "Spotting sandhill cranes|crane spotting", "Counting Casey's|casey's count", "Rating small town water towers|water towers", "Reading historical markers out loud"],
    },
  },
  {
    id: "road-west-vs-east",
    category: "roadtrip",
    prompt: "Name something that makes western Nebraska different from eastern Nebraska.",
    answers: {
      common: ["Fewer people|less people|less populated", "Ranches|ranching|more cattle", "Hills|buttes|bluffs"],
      familiar: ["Mountain time|time zone|mountain time zone", "Sandhills", "Drier|less rain|dry", "Wide open spaces|open space|nothing out there", "Higher elevation|elevation", "Scotts Bluff|chimney rock"],
      unusual: ["Pine Ridge|ponderosa pines|pine trees", "Badlands|toadstool", "Wheat|wheat fields", "Sugar beets", "Wind|windier", "Rattlesnakes", "Pronghorn|antelope", "Mule deer", "Bigger skies|darker skies|stars", "Broncos fans|denver fans"],
      rare: ["Oregon Trail ruts|wagon ruts|oregon trail", "Elk", "Bighorn sheep", "Panorama Point|highest point", "Accent|different accent", "Dryland farming|dryland"],
      extreme: ["Proso millet|millet", "Wildcat Hills", "Prairie dog towns|prairie dogs", "Sugar factories|sugar factory|western sugar"],
    },
  },
  {
    id: "road-stop",
    category: "roadtrip",
    prompt: "Name a reason to stop the car on a Nebraska road trip.",
    answers: {
      common: ["Gas|fill up|get gas", "Bathroom|restroom|pee", "Food|eat|lunch", "Stretch|stretch my legs"],
      familiar: ["Coffee", "Snacks", "Take a picture|photo|sightseeing|photos", "Rest area|rest stop", "Storm|bad weather|weather", "Flat tire"],
      unusual: ["Cows on the road|cattle crossing|cows", "Train crossing|train", "Construction", "Pulled over|speeding ticket|speed trap", "Deer|deer crossing", "Sweet corn stand|roadside stand|farm stand", "Historical marker", "Small town|check out a small town"],
      rare: ["Sandhill cranes|crane viewing", "Rodeo", "Garage sale|yard sale", "Antique store|antiques", "Fireworks stand|fireworks", "Pie|pie shop", "County fair", "Swap drivers|switch drivers"],
      extreme: ["Turtle crossing|turtle on the road", "Bison|bison crossing", "Storm chasing|chasing a tornado", "Combine on the road|tractor on the highway", "Pheasant in the road|pheasant"],
    },
  },

  /* ==================== NEBRASKA WEATHER REPORT ==================== */
  {
    id: "weather-winter-prep",
    category: "weather",
    prompt: "Name something Nebraskans do to prepare for winter.",
    answers: {
      common: ["Buy a shovel|shovel|snow shovel", "Winterize the car|snow tires|winter tires", "Get out winter coats|winter clothes|coats", "Stock up on groceries|stock up on food|groceries"],
      familiar: ["Buy salt|ice melt|rock salt", "Ice scraper", "Check the furnace|turn on the heat|furnace", "Windshield fluid|washer fluid", "Seal the windows|plastic on windows|window insulation", "Firewood|chop wood", "Snowblower|snow blower", "Get boots|snow boots"],
      unusual: ["Car emergency kit|blanket in the car|emergency kit", "Kitty litter in the trunk|kitty litter", "Blow out sprinklers|winterize sprinklers", "Rake leaves", "Clean gutters", "Drain hoses|unhook hoses", "Put away patio furniture", "Heat tape|insulate pipes", "Flu shot", "Hand warmers"],
      rare: ["Plug in the car|block heater|engine heater", "Stock tank heater|tank heater|heated waterer", "Bring in plants", "Sunlamp|vitamin d|light therapy", "Ice fishing gear|ice fishing", "Sandbags in the truck bed|weight in the truck|sandbags", "Stock up on soup|soup", "Move cattle closer to home|move cattle"],
      extreme: ["Snow fence", "Move to Arizona|snowbird|go to arizona", "Hibernate|hibernation", "Wrap trees|tree wrap", "Store the motorcycle|winterize motorcycle"],
    },
  },
  {
    id: "weather-storm",
    category: "weather",
    prompt: "Name something you might see during a Nebraska thunderstorm.",
    answers: {
      common: ["Lightning", "Rain", "Hail", "Dark clouds|clouds|black clouds"],
      familiar: ["Tornado|twister", "Strong wind|wind", "Flooding|flash flood|flood", "Power outage|power out|lost power", "Funnel cloud", "Tornado sirens|sirens", "Green sky|green clouds"],
      unusual: ["Shelf cloud", "Wall cloud", "Downed trees|branches|fallen trees", "Storm chasers", "Hail damage|dented cars", "Rainbow", "Neighbors watching from the porch|people on the porch|porch watching", "Weather radio", "People in the basement|basement"],
      rare: ["Mammatus clouds|mammatus", "Supercell", "Rotation", "Derecho", "Microburst|downburst", "Anvil cloud|anvil", "Cows huddled together|cattle huddled|cows", "Lightning-struck tree|struck tree", "Hail piled like snow|hail drifts"],
      extreme: ["Ball lightning", "Red sprites|sprites", "St. Elmo's fire|saint elmos fire", "Gustnado", "Hail fog", "Landspout"],
    },
  },
  {
    id: "weather-summer",
    category: "weather",
    prompt: "Name an activity people do during a Nebraska summer.",
    answers: {
      common: ["Swimming|swim|pool", "Fishing", "Camping", "Grilling|barbecue|bbq"],
      familiar: ["Boating|boat", "Baseball|softball", "County fair|fair", "Fireworks|fourth of july", "Tubing|tanking", "Lake trip|going to the lake|lake", "Golf", "Hiking", "Biking", "College World Series|cws", "Mowing the lawn|mowing"],
      unusual: ["Kayaking|canoeing|canoe the niobrara", "Detasseling|detasseling corn", "Sweet corn picking|picking sweet corn", "Farmers market", "Rodeo", "Storm watching|watching storms", "Catching fireflies|lightning bugs|fireflies", "Disc golf|frisbee golf", "Sand volleyball", "Waterskiing|water skiing|wakeboarding", "Picnic|picnics", "Gardening"],
      rare: ["Walking beans|roguing beans|bean walking", "Canning", "Stargazing", "Drive-in movie|drive in", "Tractor pull", "Demolition derby", "Mudding", "Baling hay|haying", "Wheat harvest"],
      extreme: ["Moving irrigation pipe|setting pipe|irrigating", "Fossil hunting|fossil hunting at toadstool", "Catching crawdads|crawdad fishing|crawdads", "Lawn mower racing|mower racing", "Ditch hay"],
    },
  },
  {
    id: "weather-planting",
    category: "weather",
    prompt: "Name something farmers use during planting season.",
    answers: {
      common: ["Tractor", "Planter|corn planter", "Seed|seeds", "Fertilizer"],
      familiar: ["Seed corn", "GPS|auto steer|autosteer", "Pickup truck|pickup|truck", "Grain drill|drill", "Sprayer", "Herbicide|roundup|weed killer", "Disc|disk", "Field cultivator|cultivator", "Weather forecast|weather app"],
      unusual: ["Anhydrous ammonia|anhydrous|nh3", "Seed tender", "Soil test|soil probe", "Farm radio|radio", "Drone|drones", "Row markers", "Seed treatment", "Tablet|ipad", "Harrow"],
      rare: ["Planter monitor|monitor", "RTK|rtk tower", "Rock picker|picking rocks", "Inoculant", "Crop insurance", "Lunch in the cab|sandwich in the field|meals in the field", "Coffee|thermos", "Land roller|roller", "Strip-till bar|strip till"],
      extreme: ["Talc|graphite|planter lube", "Seed company caps|seed caps|seed corn hats", "Fertilizer floater|floater", "Farm dog riding along|farm dog|dog", "Prayer|praying for rain"],
    },
  },
  {
    id: "weather-complaint",
    category: "weather",
    prompt: "Name a complaint people have about Nebraska weather.",
    answers: {
      common: ["Too cold|cold|freezing", "Too windy|wind|windy", "Too hot|hot|heat", "Unpredictable|changes fast|always changing"],
      familiar: ["Humidity|humid|muggy", "Snow|too much snow", "Tornadoes|tornado", "Hail", "Icy roads|ice", "Allergies|pollen", "Storms|thunderstorms"],
      unusual: ["Wind chill", "Four seasons in one day|four seasons in a day", "Drought|no rain", "Mosquitoes|bugs", "Gray skies|cloudy|gloomy", "Skipping spring|no spring|no fall", "Black ice", "Flooding"],
      rare: ["Blizzards|blizzard", "Freezing rain", "Dust storms|dust", "Derecho", "Late frost|snow in may|cold snap", "Heat index", "Grasshoppers", "Polar vortex"],
      extreme: ["Corn sweat", "Ground blizzard", "Gnats", "Chinook winds|chinook", "Thundersnow"],
    },
  },
  {
    id: "weather-fall",
    category: "weather",
    prompt: "Name a sign that fall has arrived in Nebraska.",
    answers: {
      common: ["Husker football|football season|football", "Leaves changing|falling leaves|leaves", "Pumpkin spice|pumpkin spice latte|psl", "Colder weather|cold|cooler weather"],
      familiar: ["Harvest|combines in fields|combines", "Pumpkin patch|pumpkins", "Halloween", "Hoodies|sweaters|flannel", "Apple cider|cider", "Corn maze", "Back to school|school starts"],
      unusual: ["Grain trucks on the road|grain trucks", "Geese flying south|geese|migrating geese", "Pheasant season|pheasant opener", "Hayrack rides|hayride|hay rack ride", "Harvest dust|dust", "Husker volleyball|volleyball season", "Chili", "Bonfires|bonfire", "Deer on the roads|deer", "Homecoming"],
      rare: ["Lines at the grain elevator|elevator lines", "Giant piles of corn|corn piles", "Ladybug swarms|asian beetles|ladybugs", "Frost on the windshield|frost", "Furnace smell|first time turning on the furnace", "Applejack Festival|applejack", "Monarch butterflies|monarchs"],
      extreme: ["Box elder bugs|boxelder bugs", "Stink bugs", "Spiders coming inside|spiders", "Combine fire", "Red sunsets from harvest dust|harvest moon"],
    },
  },
  {
    id: "weather-farm",
    category: "weather",
    prompt: "Name something you might see on a Nebraska farm.",
    answers: {
      common: ["Tractor", "Cows|cattle", "Barn", "Corn|cornfield"],
      familiar: ["Pigs|hogs", "Chickens", "Silo", "Grain bins|bins", "Combine", "Horses", "Farm dog|dog", "Pickup truck|truck", "Hay bales|bales"],
      unusual: ["Center pivot|pivot", "Goats", "Sheep", "Barn cats|cats", "Windmill", "Feedlot", "Tire swing", "Machine shed|shed", "Fuel tank|gas tank", "Garden"],
      rare: ["Grain dryer", "Auger", "Stock tank|water tank", "Branding iron", "Anhydrous tank|nurse tank", "Quonset hut|quonset", "Bee hives|beehive", "Weathervane", "Yard light"],
      extreme: ["Llama|llamas", "Peacocks|peacock", "Emu", "Old outhouse|outhouse", "Rusted-out car|old car in the trees", "Bison|buffalo"],
    },
  },
  {
    id: "weather-winter-fun",
    category: "weather",
    prompt: "Name a winter activity in Nebraska.",
    answers: {
      common: ["Sledding", "Building a snowman|snowman", "Snowball fight|snowballs", "Ice skating|skating"],
      familiar: ["Ice fishing", "Shoveling|shoveling snow", "Hunting|deer hunting", "Drinking hot chocolate|hot chocolate|hot cocoa", "Basketball games|basketball", "Watching movies|movies", "Snow angels", "Building a snow fort|snow fort", "Volleyball playoffs|volleyball"],
      unusual: ["Snowmobiling|snowmobile", "Cross-country skiing|cross country skiing", "Skiing|downhill skiing", "Snow tubing|tubing", "Bowling", "Indoor water park|waterpark", "Looking at Christmas lights|christmas lights", "Pheasant hunting", "Baking cookies|baking", "Jigsaw puzzles|puzzles"],
      rare: ["Bald eagle watching|eagle watching|eagle viewing", "Lincoln Stars game|hockey game|hockey", "Coyote hunting", "Polar plunge", "Calving", "Ice sailing", "Snowshoeing"],
      extreme: ["Fat biking|fat tire biking", "Winter camping", "Curling", "Ice sculpture|ice sculpting", "Donuts in an empty parking lot|parking lot donuts"],
    },
  },
  {
    id: "weather-spring",
    category: "weather",
    prompt: "Name something that happens in Nebraska every spring.",
    answers: {
      common: ["Rain|rainstorms", "Tornado season|tornadoes|storms|storm season", "Planting|planting season", "Flowers blooming|flowers"],
      familiar: ["Sandhill crane migration|sandhill cranes|cranes|crane migration", "Husker Spring Game|spring game", "Allergies|pollen", "Mud|mud season", "Baseball season|baseball", "Calving|baby calves", "Graduation", "Mowing|first mow"],
      unusual: ["Morel hunting|morels|mushroom hunting", "Turkey season|turkey hunting", "Spring break", "Prom", "Flooding", "Potholes", "Surprise snowstorm|april snow|late snow", "Easter", "Mosquitoes", "Arbor Day"],
      rare: ["Prairie chickens booming|grouse dancing|prairie chicken booming", "Prescribed burns|pasture burning|controlled burns", "Branding|branding season", "Crane Festival", "Lincoln Marathon", "Ticks", "Lilacs blooming|lilacs"],
      extreme: ["Pelicans arriving|pelicans", "Whooping cranes", "Chorus frogs|spring peepers|frogs", "Snow geese migration|snow geese"],
    },
  },
];
