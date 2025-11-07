export interface BibleReading {
  id: string;
  date: string;
  day: number;
  week: number;
  month: number;
  year: number;
  readings: {
    title: string;
    reference: string;
    description?: string;
    text?: string;
  }[];
  notes?: string;
  completed?: boolean;
}

export interface ReadingPlan {
  name: string;
  description: string;
  year: number;
  startDate: string;
  readings: BibleReading[];
  source: string;
}

// Generate 5-day Bible reading plan with custom start date
export function generateBibleReadingPlan(customStartDate?: string): ReadingPlan {
  const readings: BibleReading[] = [];
  const startDate = customStartDate ? new Date(customStartDate) : new Date(2025, 0, 1); // Default to January 1, 2025
  
  const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate() - 1); // One year from start
  
  let dayCounter = 1;
  let weekCounter = 1;
  const currentDate = new Date(startDate);
  
  // 5-Day Bible Reading Program - Exact readings from the plan
  const readingPatterns = [
    // WEEK 1
    { title: "Genesis & Psalms & Mark", reference: "Genesis 1-2; Psalm 19; Mark 1", description: "Creation, God's Glory, Jesus' Ministry Begins" },
    { title: "Genesis & Mark", reference: "Genesis 3-5; Mark 2", description: "The Fall, Cain and Abel, Jesus Heals" },
    { title: "Genesis & Psalms & Mark", reference: "Genesis 6-8; Psalm 104; Mark 3", description: "Noah's Ark, God's Creation, Jesus' Authority" },
    { title: "Genesis & Mark", reference: "Genesis 9-11; Mark 4", description: "Noah's Covenant, Tower of Babel, Parables" },
    { title: "Genesis & Psalms & Mark", reference: "Genesis 12-15; Psalm 148; Mark 5", description: "Abraham's Call, Praise God, Miracles" },
    
    // WEEK 2
    { title: "Genesis & Mark", reference: "Genesis 16-18; Mark 6", description: "Hagar and Ishmael, Abraham's Visitors, Jesus' Rejection" },
    { title: "Genesis & Psalms & Mark", reference: "Genesis 19-20; Psalm 1; Mark 7", description: "Sodom and Gomorrah, Blessed is the Man, Traditions" },
    { title: "Genesis & Psalms & Mark", reference: "Genesis 21-23; Psalm 107; Mark 8", description: "Isaac Born, God's Deliverance, Feeding 4000" },
    { title: "Genesis & Psalms & Mark", reference: "Genesis 24-25; Psalm 4; Mark 9", description: "Isaac's Wife, Evening Prayer, Transfiguration" },
    { title: "Genesis & Mark", reference: "Genesis 26-27; Mark 10", description: "Isaac's Wells, Jacob's Deception, Rich Young Man" },
    
    // WEEK 3
    { title: "Genesis & Mark", reference: "Genesis 28-29; Mark 11", description: "Jacob's Dream, Jacob's Wives, Triumphal Entry" },
    { title: "Genesis & Psalms & Mark", reference: "Genesis 30-31; Psalm 11; Mark 12", description: "Jacob's Children, Trust in the Lord, Render to Caesar" },
    { title: "Genesis & Psalms & Mark", reference: "Genesis 32-34; Psalm 145; Mark 13", description: "Jacob Wrestles God, Great is the Lord, End Times" },
    { title: "Genesis & Psalms & Mark", reference: "Genesis 35-37; Psalm 12; Mark 14", description: "Jacob Returns, Help Lord, Last Supper" },
    { title: "Genesis & Mark", reference: "Genesis 38-40; Mark 15", description: "Judah and Tamar, Joseph in Prison, Crucifixion" },
    
    // WEEK 4
    { title: "Genesis & Mark", reference: "Genesis 41-42; Mark 16", description: "Joseph Interprets Dreams, Resurrection" },
    { title: "Genesis & Psalms & Galatians", reference: "Genesis 43-44; Psalm 24; Galatians 1", description: "Joseph Tests Brothers, King of Glory, Paul's Authority" },
    { title: "Genesis & Psalms & Galatians", reference: "Genesis 45-46; Psalm 108; Galatians 2", description: "Joseph Reveals Himself, Steadfast Love, Paul's Ministry" },
    { title: "Genesis & Psalms & Galatians", reference: "Genesis 47-48; Psalm 25; Galatians 3", description: "Jacob in Egypt, Teach Me, Faith vs. Works" },
    { title: "Genesis & Galatians", reference: "Genesis 49-50; Galatians 4", description: "Jacob's Blessings, Sons of God" },
    
    // WEEK 5
    { title: "Exodus & Galatians", reference: "Exodus 1-3; Galatians 5", description: "Moses' Birth, Freedom in Christ" },
    { title: "Exodus & Galatians", reference: "Exodus 4-6; Galatians 6", description: "Moses' Call, Bear One Another's Burdens" },
    { title: "Exodus & Psalms & Ephesians", reference: "Exodus 7-9; Psalm 105; Ephesians 1", description: "Plagues Begin, God's Wonders, Spiritual Blessings" },
    { title: "Exodus & Ephesians", reference: "Exodus 10-12; Ephesians 2", description: "More Plagues, Saved by Grace" },
    { title: "Exodus & Psalms & Ephesians", reference: "Exodus 13-15; Psalm 114; Ephesians 3", description: "Exodus from Egypt, Tremble Earth, Mystery Revealed" },
    
    // WEEK 6
    { title: "Exodus & Ephesians", reference: "Exodus 16-18; Ephesians 4", description: "Manna and Quail, Unity in Christ" },
    { title: "Exodus & Psalms & Ephesians", reference: "Exodus 19-21; Psalm 33; Ephesians 5", description: "Ten Commandments, Rejoice Righteous, Walk in Love" },
    { title: "Exodus & Psalms & Ephesians", reference: "Exodus 22-24; Psalm 109; Ephesians 6", description: "Laws and Covenant, Prayer Against Enemies, Armor of God" },
    { title: "Exodus & Psalms & Philippians", reference: "Exodus 25-27; Psalm 90; Philippians 1", description: "Tabernacle Instructions, Teach Us to Number, Partnership" },
    { title: "Exodus & Philippians", reference: "Exodus 28-31; Philippians 2", description: "Priestly Garments, Christ's Humility" },
    
    // WEEK 7
    { title: "Exodus & Philippians", reference: "Exodus 32-34; Philippians 3", description: "Golden Calf, Press Toward Goal" },
    { title: "Exodus & Psalms & Philippians", reference: "Exodus 35-37; Psalm 26; Philippians 4", description: "Tabernacle Built, Vindicate Me, Rejoice Always" },
    { title: "Exodus & Hebrews", reference: "Exodus 38-40; Hebrews 1", description: "Tabernacle Completed, Christ Superior to Angels" },
    { title: "Leviticus & Psalms & Hebrews", reference: "Leviticus 1-3; Psalm 27; Hebrews 2", description: "Burnt Offerings, Light and Salvation, Christ's Humanity" },
    { title: "Leviticus & Hebrews", reference: "Leviticus 4-7; Hebrews 3", description: "Sin Offerings, Christ Greater than Moses" },
    
    // WEEK 8
    { title: "Leviticus & Psalms & Hebrews", reference: "Leviticus 8-11; Psalm 110; Hebrews 4", description: "Priesthood Ordained, Lord's Priest, Rest in Christ" },
    { title: "Leviticus & Psalms & Hebrews", reference: "Leviticus 12-14; Psalm 111; Hebrews 5", description: "Clean and Unclean, Great Works, High Priest" },
    { title: "Leviticus & Psalms & Hebrews", reference: "Leviticus 15-18; Psalm 31; Hebrews 6", description: "Purification Laws, Refuge in You, Maturity" },
    { title: "Leviticus & Hebrews", reference: "Leviticus 19-20; Hebrews 7", description: "Holiness Laws, Melchizedek Priesthood" },
    { title: "Leviticus & Hebrews", reference: "Leviticus 21-23; Hebrews 8", description: "Priestly Regulations, New Covenant" },
    
    // WEEK 9
    { title: "Leviticus & Psalms & Hebrews", reference: "Leviticus 24-25; Psalm 81; Hebrews 9", description: "Lampstand and Sabbaths, Hear My People, Old vs. New" },
    { title: "Leviticus & Psalms & Hebrews", reference: "Leviticus 26-27; Psalm 112; Hebrews 10", description: "Blessings and Curses, Blessed Man, Christ's Sacrifice" },
    { title: "Numbers & Psalms & Hebrews", reference: "Numbers 1-2; Psalm 64; Hebrews 11", description: "Census Taken, Hide Me, Faith Hall of Fame" },
    { title: "Numbers & Hebrews", reference: "Numbers 3-5; Hebrews 12", description: "Levite Duties, Run with Endurance" },
    { title: "Numbers & Hebrews", reference: "Numbers 6-7; Hebrews 13", description: "Nazirite Vow, Final Instructions" },
    
    // WEEK 10
    { title: "Numbers & Colossians", reference: "Numbers 8-11; Colossians 1", description: "Levites Consecrated, Supremacy of Christ" },
    { title: "Numbers & Psalms & Colossians", reference: "Numbers 12-14; Psalm 28; Colossians 2", description: "Miriam's Leprosy, My Strength, Fullness in Christ" },
    { title: "Numbers & Psalms & Colossians", reference: "Numbers 15-18; Psalm 113; Colossians 3", description: "Laws and Rebellion, Praise the Lord, New Life" },
    { title: "Numbers & Colossians", reference: "Numbers 19-21; Colossians 4", description: "Red Heifer, Bronze Serpent, Final Greetings" },
    { title: "Numbers & Luke", reference: "Numbers 22-25; Luke 1", description: "Balaam's Donkey, Birth of John" },
    
    // WEEK 11
    { title: "Numbers & Luke", reference: "Numbers 26-29; Luke 2", description: "Second Census, Birth of Jesus" },
    { title: "Numbers & Psalms & Luke", reference: "Numbers 30-33; Psalm 35; Luke 3", description: "Vows and Journeys, Contend for Me, John's Ministry" },
    { title: "Numbers & Luke", reference: "Numbers 34-36; Luke 4", description: "Land Boundaries, Jesus' Temptation" },
    { title: "Deuteronomy & Psalms & Luke", reference: "Deuteronomy 1-3; Psalm 36; Luke 5", description: "Moses' First Speech, Steadfast Love, Calling Disciples" },
    { title: "Deuteronomy & Luke", reference: "Deuteronomy 4-5; Luke 6", description: "Obey God's Laws, Sermon on the Plain" },
    
    // WEEK 12
    { title: "Deuteronomy & Luke", reference: "Deuteronomy 6-9; Luke 7", description: "Love the Lord, Centurion's Faith" },
    { title: "Deuteronomy & Psalms & Luke", reference: "Deuteronomy 10-14; Psalm 5; Luke 8", description: "Circumcise Hearts, Hear My Words, Parable of Sower" },
    { title: "Deuteronomy & Psalms & Luke", reference: "Deuteronomy 15-18; Psalm 115; Luke 9", description: "Year of Release, Trust Not in Idols, Feeding 5000" },
    { title: "Deuteronomy & Psalms & Luke", reference: "Deuteronomy 19-22; Psalm 6; Luke 10", description: "Cities of Refuge, Have Mercy, Seventy Sent" },
    { title: "Deuteronomy & Luke", reference: "Deuteronomy 23-26; Luke 11", description: "Exclusion Laws, Lord's Prayer" },
    
    // WEEK 13
    { title: "Deuteronomy & Luke", reference: "Deuteronomy 27-31; Luke 12", description: "Blessings and Curses, Do Not Worry" },
    { title: "Deuteronomy & Psalms & Luke", reference: "Deuteronomy 32-34; Psalm 13; Luke 13", description: "Song of Moses, How Long Lord, Repent or Perish" },
    { title: "Joshua & Psalms & Luke", reference: "Joshua 1-4; Psalm 143; Luke 14", description: "Joshua Takes Command, Hear My Prayer, Great Banquet" },
    { title: "Joshua & Psalms & Luke", reference: "Joshua 5-8; Psalm 14; Luke 15", description: "Jericho Falls, Fool Says No God, Lost Sheep" },
    { title: "Joshua & Luke", reference: "Joshua 9-13; Luke 16", description: "Gibeonites Deceive, Rich Man and Lazarus" },
    
    // WEEK 14
    { title: "Joshua & Luke", reference: "Joshua 14-17; Luke 17", description: "Land Division, Faith and Forgiveness" },
    { title: "Joshua & Psalms & Luke", reference: "Joshua 18-21; Psalm 15; Luke 18", description: "More Land Division, Who May Dwell, Persistent Widow" },
    { title: "Joshua & Psalms & Luke", reference: "Joshua 22-24; Psalm 116; Luke 19", description: "Eastern Tribes, Love the Lord, Zacchaeus" },
    { title: "Judges & Psalms & Luke", reference: "Judges 1-3; Psalm 16; Luke 20", description: "Judges Begin, Preserve Me, Authority Questioned" },
    { title: "Judges & Luke", reference: "Judges 4-6; Luke 21", description: "Deborah and Gideon, Signs of End Times" },
    
    // WEEK 15
    { title: "Judges & Luke", reference: "Judges 7-8; Luke 22", description: "Gideon's Victory, Last Supper" },
    { title: "Judges & Psalms & Luke", reference: "Judges 9-11; Psalm 17; Luke 23", description: "Abimelech, Hear Righteous Cause, Crucifixion" },
    { title: "Judges & Psalms & Luke", reference: "Judges 12-16; Psalm 146; Luke 24", description: "Samson, Praise the Lord, Resurrection" },
    { title: "Judges & Psalms & Acts", reference: "Judges 17-18; Psalm 21; Acts 1", description: "Micah's Idol, King Rejoices, Ascension" },
    { title: "Judges & Acts", reference: "Judges 19-21; Acts 2", description: "Civil War, Pentecost" },
    
    // WEEK 16
    { title: "Ruth & Acts", reference: "Ruth 1-2; Acts 3", description: "Ruth's Loyalty, Healing at Gate" },
    { title: "Ruth & Psalms & Acts", reference: "Ruth 3-4; Psalm 37; Acts 4", description: "Ruth and Boaz, Trust in Lord, Peter and John" },
    { title: "1 Samuel & Psalms & Acts", reference: "1 Samuel 1-2; Psalm 120; Acts 5", description: "Hannah's Prayer, Deliver My Soul, Ananias and Sapphira" },
    { title: "1 Samuel & Psalms & Acts", reference: "1 Samuel 3-5; Psalm 23; Acts 6", description: "Samuel Called, Good Shepherd, Seven Chosen" },
    { title: "1 Samuel & Acts", reference: "1 Samuel 6-8; Acts 7", description: "Ark Returned, Stephen's Speech" },
    
    // WEEK 17
    { title: "1 Samuel & Acts", reference: "1 Samuel 9-10; Acts 8", description: "Saul Anointed, Philip in Samaria" },
    { title: "1 Samuel & Psalms & Acts", reference: "1 Samuel 11-13; Psalm 38; Acts 9", description: "Saul's Victory, Discipline Me, Paul's Conversion" },
    { title: "1 Samuel & Psalms & Acts", reference: "1 Samuel 14; Psalm 124; Acts 10", description: "Jonathan's Victory, Help from Lord, Cornelius" },
    { title: "1 Samuel & Chronicles & Psalms & Acts", reference: "1 Samuel 15-16; 1 Chronicles 1; Psalm 39; Acts 11", description: "Saul Rejected, Genealogy, Know My End, Gentiles" },
    { title: "1 Samuel & Chronicles & Acts", reference: "1 Samuel 17; 1 Chronicles 2; Acts 12", description: "David and Goliath, More Genealogy, Peter Freed" },
    
    // WEEK 18
    { title: "1 Samuel & Chronicles & Psalms & Acts", reference: "1 Samuel 18-19; 1 Chronicles 3; Psalm 59; Acts 13", description: "David and Jonathan, David's Sons, Deliver Me, Paul's Journey" },
    { title: "1 Samuel & Chronicles & Psalms & Acts", reference: "1 Samuel 20; 1 Chronicles 4; Psalm 56, 57, 142; Acts 14", description: "Covenant Renewed, More Genealogy, Trust in God, Iconium" },
    { title: "1 Samuel & Chronicles & Psalms & Acts", reference: "1 Samuel 21-22; 1 Chronicles 5; Psalm 52; Acts 15", description: "David Flees, Gadites, Mighty One, Council" },
    { title: "1 Samuel & Chronicles & Psalms & Acts", reference: "1 Samuel 23-24; 1 Chronicles 6; Psalm 54; Acts 16", description: "David Spares Saul, Levites, Save Me, Philippi" },
    { title: "1 Samuel & Chronicles & Acts", reference: "1 Samuel 25; 1 Chronicles 7; Acts 17", description: "Nabal and Abigail, More Genealogy, Thessalonica" },
    
    // WEEK 19
    { title: "1 Samuel & Chronicles & Acts", reference: "1 Samuel 26-27; 1 Chronicles 8; Acts 18", description: "David Spares Saul Again, Benjaminites, Corinth" },
    { title: "1 Samuel & Chronicles & Acts", reference: "1 Samuel 28-29; 1 Chronicles 9; Acts 19", description: "Witch of Endor, Jerusalem Dwellers, Ephesus" },
    { title: "1 Samuel & Chronicles & Acts", reference: "1 Samuel 30-31; 1 Chronicles 10; Acts 20", description: "Saul Dies, Saul's Death, Ephesus Elders" },
    { title: "2 Samuel & Chronicles & Psalms & Acts", reference: "2 Samuel 1-2; 1 Chronicles 11; Psalm 96, 106; Acts 21", description: "David Mourns, Mighty Men, Sing to Lord, Jerusalem" },
    { title: "2 Samuel & Chronicles & Psalms & Acts", reference: "2 Samuel 3-5; 1 Chronicles 12; Psalm 122; Acts 22", description: "David King, Warriors Join, Jerusalem, Paul's Defense" },
    
    // WEEK 20
    { title: "2 Samuel & Chronicles & Psalms & Acts", reference: "2 Samuel 6; 1 Chronicles 13; Psalm 60; Acts 23", description: "Ark Brought to Jerusalem, Defeat Enemies, Paul Before Council" },
    { title: "1 Chronicles & Acts", reference: "1 Chronicles 14-16; Acts 24", description: "David's House, Felix" },
    { title: "2 Samuel & Chronicles & Psalms & Acts", reference: "2 Samuel 7-8; 1 Chronicles 17; Psalm 132; Acts 25", description: "David's House, Covenant, Dwelling Place, Festus" },
    { title: "2 Samuel & Chronicles & Psalms & Acts", reference: "2 Samuel 9-10; 1 Chronicles 18-19; Psalm 89; Acts 26", description: "Mephibosheth, Wars, Steadfast Love, Agrippa" },
    { title: "2 Samuel & Chronicles & Psalms & Acts", reference: "2 Samuel 11-12; 1 Chronicles 20; Psalm 51, 32; Acts 27", description: "David and Bathsheba, Wars, Have Mercy, Shipwreck" },
    
    // WEEK 21
    { title: "2 Samuel & Acts", reference: "2 Samuel 13-14; Acts 28", description: "Amnon and Tamar, Rome" },
    { title: "2 Samuel & Psalms & Romans", reference: "2 Samuel 15-17; Psalm 3, 63; Romans 1", description: "Absalom's Rebellion, Trust in God, Gospel Power" },
    { title: "2 Samuel & Psalms & Romans", reference: "2 Samuel 18-20; Psalm 34; Romans 2", description: "Absalom Dies, Taste and See, God's Judgment" },
    { title: "2 Samuel & Psalms & Romans", reference: "2 Samuel 21-23; Psalm 18; Romans 3", description: "David's Wars, My Strength, All Have Sinned" },
    { title: "2 Samuel & Chronicles & Romans", reference: "2 Samuel 24; 1 Chronicles 21; Romans 4", description: "Census, Abraham's Faith" },
    
    // WEEK 22
    { title: "1 Chronicles & Psalms & Romans", reference: "1 Chronicles 22-25; Psalm 78; Romans 5", description: "Temple Preparations, Teach Children, Justified by Faith" },
    { title: "1 Kings & Chronicles & Romans", reference: "1 Kings 1; 1 Chronicles 26-28; Romans 6", description: "Adonijah, Temple Organization, Dead to Sin" },
    { title: "1 Kings & Chronicles & Romans", reference: "1 Kings 2; 1 Chronicles 29; Romans 7", description: "David Dies, Temple Offerings, Law and Sin" },
    { title: "1 Kings & Chronicles & Psalms & Romans", reference: "1 Kings 3; 2 Chronicles 1; Psalm 42; Romans 8", description: "Solomon's Wisdom, As Deer Pants, No Condemnation" },
    { title: "1 Kings & Proverbs & Psalms & Romans", reference: "1 Kings 4; Proverbs 1-2; Psalm 43; Romans 9", description: "Solomon's Officials, Wisdom Calls, Send Light, God's Choice" },
    
    // WEEK 23
    { title: "Proverbs & Romans", reference: "Proverbs 3-5; Romans 10", description: "Trust in Lord, Faith Comes by Hearing" },
    { title: "Proverbs & Psalms & Romans", reference: "Proverbs 6-7; Psalm 7; Romans 11", description: "Warnings, Vindicate Me, Israel's Future" },
    { title: "Proverbs & Psalms & Romans", reference: "Proverbs 8-10; Psalm 144; Romans 12", description: "Wisdom Calls, Blessed People, Living Sacrifice" },
    { title: "Proverbs & Psalms & Romans", reference: "Proverbs 11-13; Psalm 8; Romans 13", description: "Righteous vs. Wicked, What is Man, Submit to Authorities" },
    { title: "Proverbs & Romans", reference: "Proverbs 14-15; Romans 14", description: "Wise vs. Foolish, Accept One Another" },
    
    // WEEK 24
    { title: "Proverbs & Romans", reference: "Proverbs 16-18; Romans 15", description: "Plans and Pride, Bear Weaknesses" },
    { title: "Proverbs & Psalms & Romans", reference: "Proverbs 19-21; Psalm 40; Romans 16", description: "Wealth and Wisdom, Wait Patiently, Final Greetings" },
    { title: "Proverbs & Psalms & 1 Thessalonians", reference: "Proverbs 22-23; Psalm 117; 1 Thessalonians 1", description: "Train Up Child, Praise Lord, Faithful Work" },
    { title: "Proverbs & Psalms & 1 Thessalonians", reference: "Proverbs 24-25; Psalm 41; 1 Thessalonians 2", description: "Wisdom and Fools, Blessed Poor, Gentle Ministry" },
    { title: "Proverbs & 1 Thessalonians", reference: "Proverbs 26-28; 1 Thessalonians 3", description: "Fools and Sluggards, Timothy Sent" },
    
    // WEEK 25
    { title: "Proverbs & 1 Thessalonians", reference: "Proverbs 29-31; 1 Thessalonians 4", description: "Wise King, Excellent Wife, Sanctification" },
    { title: "Song of Songs & Psalms & 1 Thessalonians", reference: "Song of Songs 1-3; Psalm 72; 1 Thessalonians 5", description: "Love Song, King's Justice, Day of Lord" },
    { title: "Song of Songs & 2 Thessalonians", reference: "Song of Songs 4-6; 2 Thessalonians 1", description: "Love Described, Christ's Return" },
    { title: "Song of Songs & Psalms & 2 Thessalonians", reference: "Song of Songs 7-8; Psalm 127; 2 Thessalonians 2", description: "Love's Power, Children Heritage, Man of Lawlessness" },
    { title: "1 Kings & Chronicles & Psalms & 2 Thessalonians", reference: "1 Kings 5; 2 Chronicles 2; Psalm 127; 2 Thessalonians 3", description: "Temple Materials, Unless Lord Builds, Work" },
    
    // WEEK 26
    { title: "1 Kings & Chronicles & 1 Timothy", reference: "1 Kings 6; 2 Chronicles 3; 1 Timothy 1", description: "Temple Built, False Teachers" },
    { title: "1 Kings & Chronicles & Psalms & 1 Timothy", reference: "1 Kings 7; 2 Chronicles 4; Psalm 44; 1 Timothy 2", description: "Temple Furnishings, We Have Heard, Pray for All" },
    { title: "1 Kings & Psalms & 1 Timothy", reference: "1 Kings 8; Psalm 30; 1 Timothy 3", description: "Temple Dedicated, Joy Comes, Church Leaders" },
    { title: "2 Chronicles & Psalms & 1 Timothy", reference: "2 Chronicles 5-7; Psalm 121; 1 Timothy 4", description: "Temple Dedicated, Help from Hills, False Teaching" },
    { title: "1 Kings & Chronicles & 1 Timothy", reference: "1 Kings 9; 2 Chronicles 8; 1 Timothy 5", description: "God's Promise, Widows and Elders" },
    
    // WEEK 27
    { title: "1 Kings & Chronicles & 1 Timothy", reference: "1 Kings 10-11; 2 Chronicles 9; 1 Timothy 6", description: "Queen of Sheba, Love of Money" },
    { title: "Ecclesiastes & Psalms & 2 Timothy", reference: "Ecclesiastes 1-3; Psalm 45; 2 Timothy 1", description: "Vanity, Royal Wedding, Guard Deposit" },
    { title: "Ecclesiastes & Psalms & 2 Timothy", reference: "Ecclesiastes 4-6; Psalm 125; 2 Timothy 2", description: "Oppression, Trust in Lord, Good Soldier" },
    { title: "Ecclesiastes & Psalms & 2 Timothy", reference: "Ecclesiastes 7-9; Psalm 46; 2 Timothy 3", description: "Better Than, God Our Refuge, Last Days" },
    { title: "Ecclesiastes & 2 Timothy", reference: "Ecclesiastes 10-12; 2 Timothy 4", description: "Wisdom and Folly, Preach Word" },
    
    // WEEK 28
    { title: "1 Kings & Chronicles & Titus", reference: "1 Kings 12; 2 Chronicles 10-11; Titus 1", description: "Kingdom Divides, Appoint Elders" },
    { title: "1 Kings & Chronicles & Psalms & Titus", reference: "1 Kings 13-14; 2 Chronicles 12; Psalm 47; Titus 2", description: "Jeroboam's Sin, Clap Hands, Sound Doctrine" },
    { title: "1 Kings & Chronicles & Titus", reference: "1 Kings 15; 2 Chronicles 13-14; Titus 3", description: "Kings of Judah, Good Works" },
    { title: "2 Chronicles & 1 Kings & Philemon", reference: "2 Chronicles 15-16; 1 Kings 16; Philemon", description: "Asa's Reforms, Onesimus" },
    { title: "1 Kings & Psalms & Jude", reference: "1 Kings 17-18; Psalm 119; Jude", description: "Elijah, Your Word Lamp, Contend for Faith" },
    
    // WEEK 29
    { title: "1 Kings & Chronicles & Psalms & Matthew", reference: "1 Kings 19-21; 2 Chronicles 17; Psalm 129; Matthew 1", description: "Elijah Flees, Jehoshaphat, Afflicted, Genealogy" },
    { title: "1 Kings & Chronicles & Matthew", reference: "1 Kings 22; 2 Chronicles 18; Matthew 2", description: "Ahab Dies, Wise Men" },
    { title: "2 Chronicles & 2 Kings & Psalms & Matthew", reference: "2 Chronicles 19-20; 2 Kings 1; Psalm 20; Matthew 3", description: "Jehoshaphat's Reforms, Answer Us, John Baptizes" },
    { title: "2 Kings & Psalms & Matthew", reference: "2 Kings 2-3; Psalm 48; Matthew 4", description: "Elijah Taken, Great City, Temptation" },
    { title: "2 Kings & Matthew", reference: "2 Kings 4-6; Matthew 5", description: "Elisha's Miracles, Sermon on Mount" },
    
    // WEEK 30
    { title: "2 Kings & Chronicles & Matthew", reference: "2 Kings 7-8; 2 Chronicles 21; Matthew 6", description: "Famine Ends, Give Us Bread" },
    { title: "2 Kings & Psalms & Matthew", reference: "2 Kings 9-10; Psalm 49; Matthew 7", description: "Jehu Anointed, Hear This, Judge Not" },
    { title: "2 Chronicles & 2 Kings & Psalms & Matthew", reference: "2 Chronicles 22-23; 2 Kings 11; Psalm 131; Matthew 8", description: "Athaliah, Quiet Soul, Healings" },
    { title: "2 Chronicles & 2 Kings & Psalms & Matthew", reference: "2 Chronicles 24; 2 Kings 12; Psalm 50; Matthew 9", description: "Joash Repairs Temple, Mighty One, More Healings" },
    { title: "Joel & Matthew", reference: "Joel 1-3; Matthew 10", description: "Day of Lord, Twelve Sent" },
    
    // WEEK 31
    { title: "Jonah & Matthew", reference: "Jonah 1-4; Matthew 11", description: "Great Fish, John's Question" },
    { title: "2 Kings & Chronicles & Psalms & Matthew", reference: "2 Kings 13-14; 2 Chronicles 25; Psalm 53; Matthew 12", description: "Elisha Dies, No One Good, Sabbath" },
    { title: "Amos & Matthew", reference: "Amos 1-3; Matthew 13", description: "Judgment on Nations, Parables" },
    { title: "Amos & Psalms & Matthew", reference: "Amos 4-6; Psalm 55; Matthew 14", description: "Israel's Sins, Cast Burden, Feeding 5000" },
    { title: "Amos & Matthew", reference: "Amos 7-9; Matthew 15", description: "Visions, Traditions" },
    
    // WEEK 32
    { title: "Hosea & Matthew", reference: "Hosea 1-3; Matthew 16", description: "Unfaithful Wife, Peter's Confession" },
    { title: "Hosea & Psalms & Matthew", reference: "Hosea 4-6; Psalm 58; Matthew 17", description: "No Knowledge, Break Teeth, Transfiguration" },
    { title: "Hosea & Matthew", reference: "Hosea 7-10; Matthew 18", description: "Israel's Corruption, Greatest in Kingdom" },
    { title: "Hosea & Matthew", reference: "Hosea 11-13; Matthew 19", description: "God's Love, Rich Young Man" },
    { title: "Hosea & Chronicles & Psalms & Matthew", reference: "Hosea 14; 2 Chronicles 26-27; Psalm 61; Matthew 20", description: "Return to Lord, Uzziah, Hear My Cry, Workers" },
    
    // WEEK 33
    { title: "2 Kings & Matthew", reference: "2 Kings 15-16; Matthew 21", description: "Kings of Israel, Triumphal Entry" },
    { title: "Isaiah & Psalms & Matthew", reference: "Isaiah 1-3; Psalm 9; Matthew 22", description: "Judgment on Judah, Sing Praises, Wedding Feast" },
    { title: "Isaiah & Matthew", reference: "Isaiah 4-6; Matthew 23", description: "Holy Mountain, Woe to Pharisees" },
    { title: "Micah & Psalms & Matthew", reference: "Micah 1-4; Psalm 10; Matthew 24", description: "Judgment on Samaria, Why Hide, End Times" },
    { title: "Micah & Matthew", reference: "Micah 5-7; Matthew 25", description: "Ruler from Bethlehem, Sheep and Goats" },
    
    // WEEK 34
    { title: "Isaiah & Psalms & Matthew", reference: "Isaiah 7-10; Psalm 22; Matthew 26", description: "Immanuel, My God Why, Last Supper" },
    { title: "Isaiah & Psalms & Matthew", reference: "Isaiah 11-13; Psalm 118; Matthew 27", description: "Branch from Jesse, Give Thanks, Crucifixion" },
    { title: "Isaiah & Matthew", reference: "Isaiah 14-16; Matthew 28", description: "Fall of Babylon, Resurrection" },
    { title: "Isaiah & Psalms & 1 Corinthians", reference: "Isaiah 17-19; Psalm 62; 1 Corinthians 1", description: "Damascus Fallen, Wait Silently, Divisions" },
    { title: "Isaiah & 1 Corinthians", reference: "Isaiah 20-22; 1 Corinthians 2", description: "Egypt and Cush, Wisdom of God" },
    
    // WEEK 35
    { title: "Isaiah & 1 Corinthians", reference: "Isaiah 23-25; 1 Corinthians 3", description: "Tyre's Fall, God's Building" },
    { title: "Isaiah & Psalms & 1 Corinthians", reference: "Isaiah 26-29; Psalm 65; 1 Corinthians 4", description: "Song of Salvation, Praise Waits, Servants" },
    { title: "Isaiah & 1 Corinthians", reference: "Isaiah 30-32; 1 Corinthians 5", description: "Woe to Obstinate, Immorality" },
    { title: "Isaiah & 1 Corinthians", reference: "Isaiah 33-35; 1 Corinthians 6", description: "Woe to Destroyer, Lawsuits" },
    { title: "2 Chronicles & 2 Kings & Psalms & 1 Corinthians", reference: "2 Chronicles 28; 2 Kings 17; Psalm 66; 1 Corinthians 7", description: "Ahaz's Sins, Israel Exiled, Shout Joy, Marriage" },
    
    // WEEK 36
    { title: "2 Chronicles & 1 Corinthians", reference: "2 Chronicles 29-31; 1 Corinthians 8", description: "Hezekiah's Reforms, Food Sacrificed" },
    { title: "2 Kings & Chronicles & Psalms & 1 Corinthians", reference: "2 Kings 18-19; 2 Chronicles 32; Psalm 67; 1 Corinthians 9", description: "Hezekiah, God Be Gracious, Paul's Rights" },
    { title: "Isaiah & Psalms & 1 Corinthians", reference: "Isaiah 36-37; Psalm 123; 1 Corinthians 10", description: "Assyrian Threat, Lift Eyes, Warnings" },
    { title: "2 Kings & Isaiah & Psalms & 1 Corinthians", reference: "2 Kings 20; Isaiah 38-40; Psalm 68; 1 Corinthians 11", description: "Hezekiah's Illness, Comfort My People, God Arises, Head Coverings" },
    { title: "Isaiah & 1 Corinthians", reference: "Isaiah 41-44; 1 Corinthians 12", description: "Servant Songs, Spiritual Gifts" },
    
    // WEEK 37
    { title: "Isaiah & 1 Corinthians", reference: "Isaiah 45-48; 1 Corinthians 13", description: "Cyrus Anointed, Love Chapter" },
    { title: "Isaiah & Psalms & 1 Corinthians", reference: "Isaiah 49-52; Psalm 69; 1 Corinthians 14", description: "Servant Songs, Save Me, Tongues" },
    { title: "Isaiah & Psalms & 1 Corinthians", reference: "Isaiah 53-55; Psalm 128; 1 Corinthians 15", description: "Suffering Servant, Blessed Family, Resurrection" },
    { title: "Isaiah & Psalms & 1 Corinthians", reference: "Isaiah 56-59; Psalm 70; 1 Corinthians 16", description: "Salvation for All, Hasten Help, Collection" },
    { title: "Isaiah & 2 Corinthians", reference: "Isaiah 60-63; 2 Corinthians 1", description: "Glory of Zion, Comfort" },
    
    // WEEK 38
    { title: "Isaiah & 2 Corinthians", reference: "Isaiah 64-66; 2 Corinthians 2", description: "New Heavens, Forgiveness" },
    { title: "2 Kings & Chronicles & Psalms & 2 Corinthians", reference: "2 Kings 21; 2 Chronicles 33; Psalm 71; 2 Corinthians 3", description: "Manasseh's Sins, Deliver Me, New Covenant" },
    { title: "Nahum & Psalms & 2 Corinthians", reference: "Nahum 1-3; Psalm 149; 2 Corinthians 4", description: "Nineveh's Fall, Praise Lord, Treasure in Jars" },
    { title: "2 Kings & Psalms & 2 Corinthians", reference: "2 Kings 22-23; Psalm 73; 2 Corinthians 5", description: "Josiah's Reforms, Envy Wicked, New Creation" },
    { title: "2 Chronicles & 2 Corinthians", reference: "2 Chronicles 34-35; 2 Corinthians 6", description: "Josiah's Reforms, God's Fellow Workers" },
    
    // WEEK 39
    { title: "Habakkuk & 2 Corinthians", reference: "Habakkuk 1-3; 2 Corinthians 7", description: "Why Wicked Prosper, Godly Sorrow" },
    { title: "Zephaniah & Psalms & 2 Corinthians", reference: "Zephaniah 1-3; Psalm 74; 2 Corinthians 8", description: "Day of Lord, Remember Mount Zion, Generosity" },
    { title: "Jeremiah & Psalms & 2 Corinthians", reference: "Jeremiah 1-4; Psalm 130; 2 Corinthians 9", description: "Jeremiah Called, Out of Depths, Sowing" },
    { title: "Jeremiah & Psalms & 2 Corinthians", reference: "Jeremiah 5-7; Psalm 75; 2 Corinthians 10", description: "Judah's Sins, God Judges, Spiritual Weapons" },
    { title: "Jeremiah & 2 Corinthians", reference: "Jeremiah 8-10; 2 Corinthians 11", description: "False Prophets, Paul's Boasting" },
    
    // WEEK 40
    { title: "Jeremiah & 2 Corinthians", reference: "Jeremiah 11-13; 2 Corinthians 12", description: "Broken Covenant, Thorn in Flesh" },
    { title: "Jeremiah & Psalms & 2 Corinthians", reference: "Jeremiah 14-16; Psalm 76; 2 Corinthians 13", description: "Drought, God Known, Final Warnings" },
    { title: "Jeremiah & James", reference: "Jeremiah 17-20; James 1", description: "Heart Deceitful, Trials" },
    { title: "Jeremiah & Psalms & James", reference: "Jeremiah 22, 23, 26; Psalm 77; James 2", description: "False Shepherds, Remember Deeds, Faith and Works" },
    { title: "Jeremiah & Psalms & James", reference: "Jeremiah 25, 35, 36, 45; Psalm 133; James 3", description: "Seventy Years, Unity, Taming Tongue" },
    
    // WEEK 41
    { title: "Jeremiah & James", reference: "Jeremiah 27, 28, 29, 24; James 4", description: "False Prophets, Submit to God" },
    { title: "Jeremiah & Psalms & James", reference: "Jeremiah 37, 21, 34; Psalm 79; James 5", description: "Zedekiah, Help Us, Patience" },
    { title: "Jeremiah & 1 Peter", reference: "Jeremiah 30-33; 1 Peter 1", description: "New Covenant, Living Hope" },
    { title: "Jeremiah & 1 Peter", reference: "Jeremiah 38, 39, 52; 1 Peter 2", description: "Jerusalem Falls, Living Stones" },
    { title: "2 Kings & Chronicles & Psalms & 1 Peter", reference: "2 Kings 24-25; 2 Chronicles 36; Psalm 126; 1 Peter 3", description: "Exile, Restore Fortunes, Wives and Husbands" },
    
    // WEEK 42
    { title: "Lamentations & Psalms & 1 Peter", reference: "Lamentations 1-5; Psalm 137; 1 Peter 4", description: "Jerusalem's Fall, By Rivers, Suffering" },
    { title: "Obadiah & Jeremiah & Psalms & 1 Peter", reference: "Obadiah; Jeremiah 40-42; Psalm 147; 1 Peter 5", description: "Edom's Fall, Remnant, Praise Lord, Elders" },
    { title: "Jeremiah & 2 Peter", reference: "Jeremiah 43, 44, 46; 2 Peter 1", description: "Egypt, False Prophets, Add to Faith" },
    { title: "Jeremiah & Psalms & 2 Peter", reference: "Jeremiah 47, 48, 49; Psalm 80; 2 Peter 2", description: "Nations Judged, Restore Us, False Teachers" },
    { title: "Jeremiah & 2 Peter", reference: "Jeremiah 50-51; 2 Peter 3", description: "Babylon Falls, Scoffers" },
    
    // WEEK 43
    { title: "Ezekiel & John", reference: "Ezekiel 1-3; John 1", description: "Vision of Glory, Word Made Flesh" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 4-6; Psalm 82; John 2", description: "Siege, God Among Gods, Wedding" },
    { title: "Ezekiel & John", reference: "Ezekiel 7-9; John 3", description: "End Has Come, Born Again" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 10-12; Psalm 83; John 4", description: "Glory Departs, Do Not Keep Silent, Samaritan Woman" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 13-15; Psalm 136; John 5", description: "False Prophets, Give Thanks, Healing" },
    
    // WEEK 44
    { title: "Ezekiel & John", reference: "Ezekiel 16-18; John 6", description: "Jerusalem's Unfaithfulness, Bread of Life" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 19-21; Psalm 84; John 7", description: "Lament, Lovely Dwelling, Living Water" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 22-24; Psalm 134; John 8", description: "Bloody City, Praise Lord, Light of World" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 25-27; Psalm 85; John 9", description: "Nations Judged, Restore Us, Blind Man" },
    { title: "Ezekiel & John", reference: "Ezekiel 28-30; John 10", description: "Tyre's Fall, Good Shepherd" },
    
    // WEEK 45
    { title: "Ezekiel & John", reference: "Ezekiel 31-33; John 11", description: "Egypt's Fall, Watchman, Lazarus" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 34-36; Psalm 86; John 12", description: "Shepherds, Hear Me, Triumphal Entry" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 37-39; Psalm 87; John 13", description: "Dry Bones, Zion's Glory, Foot Washing" },
    { title: "Ezekiel & John", reference: "Ezekiel 40-42; John 14", description: "New Temple, Way Truth Life" },
    { title: "Ezekiel & Psalms & John", reference: "Ezekiel 43-45; Psalm 135; John 15", description: "Glory Returns, Praise Lord, Vine" },
    
    // WEEK 46
    { title: "Ezekiel & John", reference: "Ezekiel 46-48; John 16", description: "Temple Worship, Spirit of Truth" },
    { title: "Daniel & Psalms & John", reference: "Daniel 1-3; Psalm 88; John 17", description: "Exile, Dark Place, High Priestly Prayer" },
    { title: "Daniel & John", reference: "Daniel 4-6; John 18", description: "Nebuchadnezzar's Dream, Arrest" },
    { title: "Daniel & Psalms & John", reference: "Daniel 7-9; Psalm 91; John 19", description: "Beasts, Refuge, Crucifixion" },
    { title: "Daniel & John", reference: "Daniel 10-12; John 20", description: "End Times, Resurrection" },
    
    // WEEK 47
    { title: "Ezra & John", reference: "Ezra 1-2; John 21", description: "Return from Exile, Breakfast" },
    { title: "Ezra & Psalms & 1 John", reference: "Ezra 3-4; Psalm 92; 1 John 1", description: "Temple Rebuilt, Good to Praise, Walking in Light" },
    { title: "Haggai & Zechariah & Psalms & 1 John", reference: "Haggai; Zechariah 1; Psalm 138; 1 John 2", description: "Rebuild Temple, Visions, Give Thanks, Antichrist" },
    { title: "Zechariah & Psalms & 1 John", reference: "Zechariah 2-5; Psalm 93; 1 John 3", description: "More Visions, Lord Reigns, Children of God" },
    { title: "Zechariah & 1 John", reference: "Zechariah 6-8; 1 John 4", description: "More Visions, Test Spirits" },
    
    // WEEK 48
    { title: "Zechariah & 1 John", reference: "Zechariah 9-11; 1 John 5", description: "More Visions, Overcome World" },
    { title: "Zechariah & Psalms & 2 John", reference: "Zechariah 12-14; Psalm 94; 2 John", description: "Jerusalem, Vengeance, Truth" },
    { title: "Ezra & Psalms & 3 John", reference: "Ezra 5-6; Psalm 95; 3 John", description: "Temple Completed, Come Worship, Hospitality" },
    { title: "Esther & Psalms & Revelation", reference: "Esther 1-3; Psalm 139; Revelation 1", description: "Queen Deposed, Search Me, Alpha Omega" },
    { title: "Esther & Revelation", reference: "Esther 4-6; Revelation 2", description: "Mordecai's Plan, Letters to Churches" },
    
    // WEEK 49
    { title: "Esther & Revelation", reference: "Esther 7-10; Revelation 3", description: "Haman Hanged, More Letters" },
    { title: "Ezra & Psalms & Revelation", reference: "Ezra 7-10; Psalm 97; Revelation 4", description: "Ezra Returns, Lord Reigns, Throne Room" },
    { title: "Nehemiah & Revelation", reference: "Nehemiah 1-3; Revelation 5", description: "Wall Rebuilt, Scroll" },
    { title: "Nehemiah & Psalms & Revelation", reference: "Nehemiah 4-6; Psalm 98; Revelation 6", description: "Opposition, Sing New Song, Seals" },
    { title: "Nehemiah & Psalms & Revelation", reference: "Nehemiah 7-9; Psalm 140; Revelation 7", description: "Genealogy, Deliver Me, 144,000" },
    
    // WEEK 50
    { title: "Nehemiah & Revelation", reference: "Nehemiah 10-13; Revelation 8", description: "Covenant Renewed, Trumpets" },
    { title: "Malachi & Psalms & Revelation", reference: "Malachi; Psalm 2; Revelation 9", description: "Messenger, Son Given, Locusts" },
    { title: "Job & Psalms & Revelation", reference: "Job 1-3; Psalm 29; Revelation 10", description: "Job's Trials, Voice of Lord, Little Scroll" },
    { title: "Job & Psalms & Revelation", reference: "Job 4-7; Psalm 99; Revelation 11", description: "Eliphaz Speaks, Holy is He, Two Witnesses" },
    { title: "Job & Revelation", reference: "Job 8-11; Revelation 12", description: "Bildad Speaks, Woman and Dragon" },
    
    // WEEK 51
    { title: "Job & Psalms & Revelation", reference: "Job 12-14; Psalm 100; Revelation 13", description: "Job Responds, Serve with Joy, Beast" },
    { title: "Job & Revelation", reference: "Job 15-17; Revelation 14", description: "Eliphaz Again, Lamb on Mount Zion" },
    { title: "Job & Psalms & Revelation", reference: "Job 18-20; Psalm 141; Revelation 15", description: "Bildad Again, Set Guard, Seven Angels" },
    { title: "Job & Psalms & Revelation", reference: "Job 21-23; Psalm 101; Revelation 16", description: "Job Responds, Blameless, Bowls" },
    { title: "Job & Revelation", reference: "Job 24-27; Revelation 17", description: "Job Continues, Babylon" },
    
    // WEEK 52
    { title: "Job & Revelation", reference: "Job 28-30; Revelation 18", description: "Wisdom, Babylon Falls" },
    { title: "Job & Psalms & Revelation", reference: "Job 31-33; Psalm 102; Revelation 19", description: "Job's Defense, Hear Prayer, Wedding" },
    { title: "Job & Revelation", reference: "Job 34-36; Revelation 20", description: "Elihu Speaks, Millennium" },
    { title: "Job & Psalms & Revelation", reference: "Job 37-39; Psalm 103; Revelation 21", description: "God Speaks, Bless Lord, New Heaven" },
    { title: "Job & Psalms & Revelation", reference: "Job 40-42; Psalm 150; Revelation 22", description: "God's Power, Praise Lord, New Jerusalem" },
  ];
  
  let patternIndex = 0;
  
  while (currentDate <= endDate) {
    // Skip weekends (Saturday and Sunday) for 5-day plan
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      const reading = readingPatterns[patternIndex % readingPatterns.length];
      
      readings.push({
        id: `reading-${dayCounter}`,
        date: currentDate.toISOString().split('T')[0],
        day: dayCounter,
        week: weekCounter,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        readings: [{
          title: reading.title,
          reference: reading.reference,
          description: reading.description
        }],
        completed: false
      });
      
      dayCounter++;
      patternIndex++;
      
      // Increment week counter on Monday (day 1)
      if (dayOfWeek === 1) { // Monday
        weekCounter++;
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    name: "5-Day Bible Reading Plan",
    description: "A comprehensive Bible reading plan that covers the entire Bible in one year, reading 5 days per week.",
    year: startDate.getFullYear(),
    startDate: startDate.toISOString().split('T')[0],
    readings,
    source: "https://www.fivedaybiblereading.com/wp-content/uploads/2024/12/2025-5-Day-Bible-Reading.pdf"
  };
}

export const bibleReadingPlan = generateBibleReadingPlan();
