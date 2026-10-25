export const experienceScenes={
  thomala:{art:'/assets/devotional/venkateswara-shrine-1024.webp',stages:['The adorned shrine','Flowers & devotion','A gentle offering'],tone:'floral'},
  archana:{art:'/assets/seva/devotional-portrait-1280.webp',stages:['A tradition of names','Explore the names','A moment of praise'],tone:'names'},
  kalyanotsavam:{art:'/assets/seva/kalyanotsavam-card.webp',stages:['A sacred celebration','Objects & symbolism','Carry the joy'],tone:'wedding'},
  abhishekam:{art:'/assets/seva/abhishekam-card.webp',stages:['Understanding Abhishekam','Explore the materials','A quiet conclusion'],tone:'water'},
  deepalankara:{art:'/assets/intro/lights-1280.webp',stages:['At the hour of lamps','Light a symbolic diya','An evening of light'],tone:'lamps'},
  brahmotsavam:{art:'/assets/tirumala/08-festival-procession-1280.webp',stages:['A grand festival','Nine days of celebration','One shared devotion'],tone:'festival'},
}as const;
export const reviewedNames=[
  {id:'venkateswara',name:'Venkateswara',sanskrit:'वेङ्कटेश्वर',telugu:'వేంకటేశ్వర',meaning:'The name of the presiding deity worshipped at Tirumala.',te:'తిరుమలలో ఆరాధించే ప్రధాన దైవం పేరు.'},
  {id:'srinivasa',name:'Srinivasa',sanskrit:'श्रीनिवास',telugu:'శ్రీనివాస',meaning:'A devotional name used for Lord Venkateswara.',te:'వేంకటేశ్వరునికి ఉపయోగించే భక్తిపూర్వక నామం.'},
  {id:'govinda',name:'Govinda',sanskrit:'गोविन्द',telugu:'గోవింద',meaning:'A name invoked in devotion to the Lord at Tirumala.',te:'తిరుమలలో భక్తులు స్మరించే భగవంతుని నామం.'},
]as const;
export const festivalDays=[
  {day:1,title:'The festival begins',events:'Dwajarohanam · Pedda Sesha Vahanam',art:'garuda'},
  {day:2,title:'Sesha & Hamsa',events:'Chinna Sesha Vahanam · Hamsa Vahanam',art:'garuda'},
  {day:3,title:'Simha & pearls',events:'Simha Vahanam · Mutyapu Pandiri Vahanam',art:'ratha'},
  {day:4,title:'A celebration of sovereignty',events:'Kalpa Vruksha Vahanam · Sarva Bhoopala Vahanam',art:'ratha'},
  {day:5,title:'Garuda Seva',events:'Mohini Avataram · Garuda Seva',art:'garuda'},
  {day:6,title:'Hanumantha Vahanam',events:'Hanumantha Vahanam · Swarna Ratham · Gaja Vahanam',art:'hanumantha'},
  {day:7,title:'Sun & moon',events:'Surya Prabha Vahanam · Chandra Prabha Vahanam',art:'surya'},
  {day:8,title:'The chariot procession',events:'Rathotsavam · Aswa Vahanam',art:'ratha'},
  {day:9,title:'The festival concludes',events:'Pallaki Utsavam · Chakra Snanam · Dwajavarohanam',art:'chandra'},
]as const;
