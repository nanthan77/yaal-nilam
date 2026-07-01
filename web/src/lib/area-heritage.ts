export interface HeritagePlace {
  name: string;
  name_ta: string;
  category: 'History' | 'Heritage' | 'Nature' | 'Culture' | 'Education' | 'Shopping';
  description: { en: string; ta: string };
  image: string;
}

export interface AreaHeritage {
  history: { en: string; ta: string };
  attractions: HeritagePlace[];
}

export const AREA_HERITAGE: Record<string, AreaHeritage> = {
  nallur: {
    history: {
      en: 'Nallur was the historic capital of the ancient Jaffna Kingdom (Aryacakravarti dynasty) from the 13th to the 17th century. It served as the royal residence and administrative centre before the capital was shifted to Jaffna city during the Portuguese and Dutch colonial eras. Today, it remains the ultimate cultural and spiritual epicenter of Northern Sri Lanka.',
      ta: 'நல்லூர் 13 ஆம் நூற்றாண்டு முதல் 17 ஆம் நூற்றாண்டு வரை பண்டைய யாழ்ப்பாண இராச்சியத்தின் (ஆரியச்சக்கரவர்த்தி வம்சம்) வரலாற்று தலைநகரமாக இருந்தது. போர்த்துகேய மற்றும் டச்சு காலனித்துவ காலத்தில் தலைநகரம் யாழ் நகரத்திற்கு மாற்றப்படுவதற்கு முன்பு இது அரச இல்லமாகவும் நிர்வாக மையமாகவும் செயல்பட்டது. இன்று, இது வடக்கு இலங்கையின் கலாசார மற்றும் ஆன்மீக மையமாகத் திகழ்கிறது.'
    },
    attractions: [
      {
        name: 'Nallur Kandaswamy Temple',
        name_ta: 'நல்லூர் கந்தசுவாமி கோவில்',
        category: 'Heritage',
        description: {
          en: 'One of the most significant Hindu temples in Sri Lanka, boasting an ornate golden gopuram and hosting the legendary 25-day annual festival.',
          ta: 'இலங்கையின் மிக முக்கியமான இந்துக் கோயில்களில் ஒன்று, அலங்கார தங்க கோபுரத்தைக் கொண்டது. இங்கு புகழ்பெற்ற 25 நாட்கள் நடைபெறும் வருடாந்திர திருவிழா நடைபெறுகிறது.'
        },
        image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=600&h=400&fit=crop'
      },
      {
        name: 'Yamuna Eri',
        name_ta: 'யமுனா ஏரி',
        category: 'History',
        description: {
          en: 'A historic U-shaped stone-carved bathing tank built by King Cinkai Ariyan for the royal family of the Jaffna Kingdom.',
          ta: 'யாழ்ப்பாண இராச்சியத்தின் அரச குடும்பத்திற்காக மன்னன் சிங்கையாரியனால் கட்டப்பட்ட வரலாற்று சிறப்புமிக்க U-வடிவ கல் ஏரி.'
        },
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop'
      },
      {
        name: 'Cankili Thoppu & Arch',
        name_ta: 'சங்கிலி தோப்பு வளைவு',
        category: 'History',
        description: {
          en: 'The remnants of the royal palace entrance belonging to King Cankili II, the last ruler of the Jaffna Kingdom.',
          ta: 'யாழ்ப்பாண இராச்சியத்தின் கடைசி மன்னனான சங்கிலி குமரனின் அரச அரண்மனை நுழைவாயிலின் எஞ்சிய வரலாற்று வளைவு.'
        },
        image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&h=400&fit=crop'
      }
    ]
  },
  jaffna: {
    history: {
      en: 'Jaffna city developed rapidly under Portuguese and Dutch rule, serving as a vital maritime port. The city contains a rich blend of traditional Tamil heritage and European colonial architecture. From the iconic star-fortress to the historic public library, Jaffna stands as a resilient capital of culture, literature, and trade.',
      ta: 'யாழ்ப்பாணம் நகரம் போர்த்துகேயர் மற்றும் டச்சுக்காரர்களின் ஆட்சிக் காலத்தில் ஒரு முக்கிய கடல்சார் துறைமுகமாக வேகமாக வளர்ச்சியடைந்தது. இந்த நகரம் பாரம்பரிய தமிழ் கலாசாரம் மற்றும் ஐரோப்பிய காலனித்துவ கட்டிடக்கலையின் சிறந்த கலவையைக் கொண்டுள்ளது.'
    },
    attractions: [
      {
        name: 'Jaffna Fort',
        name_ta: 'யாழ்ப்பாணக் கோட்டை',
        category: 'History',
        description: {
          en: 'A massive star-fort built by the Portuguese in 1618 and later rebuilt and expanded by the Dutch, overlooking the peaceful lagoon.',
          ta: '1618 இல் போர்த்துகேயர்களால் கட்டப்பட்டு, பின்னர் டச்சுக்காரர்களால் புனரமைக்கப்பட்டு விரிவுபடுத்தப்பட்ட ஒரு பிரம்மாண்டமான வரலாற்று நட்சத்திரக் கோட்டை.'
        },
        image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&h=400&fit=crop'
      },
      {
        name: 'Jaffna Public Library',
        name_ta: 'யாழ் பொது நூலகம்',
        category: 'Heritage',
        description: {
          en: 'An architectural masterpiece built in neoclassical style, representing a highly respected sanctuary of Tamil literature, history, and knowledge.',
          ta: 'நியோகிளாசிக்கல் பாணியில் கட்டப்பட்ட ஒரு கட்டிடக்கலை அற்புதம், இது தமிழ் இலக்கியம், வரலாறு மற்றும் அறிவின் புகலிடமாகத் திகழ்கிறது.'
        },
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop'
      },
      {
        name: 'Subramaniam Park',
        name_ta: 'சுப்பிரமணியம் பூங்கா',
        category: 'Nature',
        description: {
          en: 'A popular urban park in the heart of Jaffna city, offering lush greenery, walking pathways, and a peaceful escape for families.',
          ta: 'யாழ் நகரின் மையப்பகுதியில் உள்ள ஒரு பிரபலமான பூங்கா, பசுமையான மரங்கள் மற்றும் குடும்பங்கள் ஓய்வெடுப்பதற்கான அமைதியான சூழலை வழங்குகிறது.'
        },
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop'
      }
    ]
  },
  karainagar: {
    history: {
      en: 'Karainagar is a prominent island on the western rim of the peninsula, connected to the mainland via a scenic 3km causeway. Known historically for its sea-trade, palm cultivation, and ancient temples, it has now evolved into one of the top holiday and beach destinations in the Northern Province.',
      ta: 'காரைநகர் குடாநாட்டின் மேற்கு விளிம்பில் உள்ள ஒரு முக்கியமான தீவாகும், இது 3 கிமீ எழில்மிகு நடைபாலத்தின் மூலம் பிரதான நிலப்பரப்புடன் இணைக்கப்பட்டுள்ளது. வரலாற்று ரீதியாக கடல் வணிகம், பனைச் செய்கை மற்றும் பண்டைய கோயில்களுக்கு பெயர் பெற்ற இது, இப்போது ஒரு சிறந்த கடற்கரை சுற்றுலாத் தலமாக மாறியுள்ளது.'
    },
    attractions: [
      {
        name: 'Casuarina Beach',
        name_ta: 'கசுரினா கடற்கரை',
        category: 'Nature',
        description: {
          en: 'Famous for its shallow, crystal-clear blue waters, soft white sand, and the distinctive Casuarina pine trees lining the shore.',
          ta: 'ஆழமற்ற, தெளிவான நீல நிற கடல் நீர், மென்மையான வெள்ளை மணல் மற்றும் கரையை ஒட்டி அமைந்துள்ள கசுரினா சவுக்கு மரங்களுக்குப் பெயர் பெற்றது.'
        },
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop'
      },
      {
        name: 'Karainagar Sivan Temple',
        name_ta: 'காரைநகர் சிவன் கோவில்',
        category: 'Heritage',
        description: {
          en: 'An ancient, spiritually revered temple dedicated to Lord Shiva, reflecting traditional Dravidian architecture.',
          ta: 'சிவபெருமானுக்கு அர்ப்பணிக்கப்பட்ட ஒரு பழமையான ஆன்மீக சிறப்புமிக்க கோயில், இது பாரம்பரிய திராவிட கட்டிடக்கலையை பிரதிபலிக்கிறது.'
        },
        image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=600&h=400&fit=crop'
      }
    ]
  },
  tellippalai: {
    history: {
      en: 'Tellippalai and its surrounding areas (including Keerimalai and Maviddapuram) hold a sacred place in Jaffna\'s history. This region is home to freshwater springs right beside the sea and ancient shrines that date back thousands of years. It has long been a major destination for pilgrimage and cleansing rituals.',
      ta: 'தெல்லிப்பளை மற்றும் அதைச் சுற்றியுள்ள பகுதிகள் (கீரிமலை மற்றும் மாவிட்டபுரம் உட்பட) யாழ்ப்பாணத்தின் வரலாற்றில் ஒரு புனிதமான இடத்தைப் பிடித்துள்ளன. கடல் அருகே அமைந்துள்ள நன்னீர் ஊற்றுகளும் ஆயிரக்கணக்கான ஆண்டுகள் பழமையான ஆலயங்களும் இங்கு அமைந்துள்ளன.'
    },
    attractions: [
      {
        name: 'Keerimalai Springs & Pond',
        name_ta: 'கீரிமலை ஊற்று',
        category: 'Nature',
        description: {
          en: 'A natural freshwater spring directly adjacent to the sea, highly revered for its therapeutic and mineral-rich healing waters.',
          ta: 'கடலுக்கு மிக அருகில் அமைந்துள்ள ஒரு இயற்கை நன்னீர் ஊற்று, இதன் மருத்துவ குணம் மற்றும் தாதுக்கள் நிறைந்த குணப்படுத்தும் நீருக்காக மிகவும் மதிக்கப்படுகிறது.'
        },
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop'
      },
      {
        name: 'Naguleswaram Temple',
        name_ta: 'நாகுலேஸ்வரம் கோவில்',
        category: 'Heritage',
        description: {
          en: 'An ancient Hindu temple of Lord Shiva located in Keerimalai, recognized as one of the five sacred Ishwarams (Pancha Ishwarams) of Sri Lanka.',
          ta: 'கீரிமலையில் அமைந்துள்ள பழமையான சிவபெருமான் கோயில், இது இலங்கையின் ஐந்து புனித ஈஸ்வரங்களில் (பஞ்ச ஈஸ்வரங்கள்) ஒன்றாக அங்கீகரிக்கப்பட்டுள்ளது.'
        },
        image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=600&h=400&fit=crop'
      },
      {
        name: 'Maviddapuram Kandaswamy Temple',
        name_ta: 'மாவிட்டபுரம் கந்தசுவாமி கோவில்',
        category: 'Heritage',
        description: {
          en: 'A monumental temple with a history spanning over 5,000 years, associated with a Chola princess who was cured of a facial deformity here.',
          ta: '5,000 ஆண்டுகளுக்கும் மேலான வரலாற்றைக் கொண்ட ஒரு புகழ்பெற்ற ஆலயம், இங்கு ஒரு சோழ இளவரசியின் முகக் குறைபாடு நீங்கியதாக வரலாறு கூறுகிறது.'
        },
        image: 'https://images.unsplash.com/photo-1600321784486-77b1371cdbfe?w=600&h=400&fit=crop'
      }
    ]
  },
  point_pedro: {
    history: {
      en: 'Point Pedro (Paruthithurai) is the northernmost town in Sri Lanka. It historically served as a busy commercial trading port exporting palmyra products and spices. Its unique geography, where the Bay of Bengal meets the Indian Ocean, makes it a fascinating maritime and residential zone.',
      ta: 'பருத்தித்துறை (Point Pedro) இலங்கையின் வடக்கே அமைந்துள்ள ஒரு கடலோர நகரமாகும். இது வரலாற்று ரீதியாக பனை பொருட்கள் மற்றும் நறுமணப் பொருட்களை ஏற்றுமதி செய்யும் ஒரு பரபரப்பான வர்த்தக துறைமுகமாக இருந்தது.'
    },
    attractions: [
      {
        name: 'Point Pedro Lighthouse',
        name_ta: 'பருத்தித்துறை கலங்கரை விளக்கம்',
        category: 'History',
        description: {
          en: 'A historic white lighthouse built in 1916 standing on the northernmost tip of the island, overlooking the deep blue seas.',
          ta: 'தீவின் வடமுனையில் அமைந்துள்ள 1916 இல் கட்டப்பட்ட ஒரு வரலாற்று வெள்ளை கலங்கரை விளக்கம், இது ஆழ்கடல் பரப்பை நோக்கியவாறு அமைந்துள்ளது.'
        },
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
      },
      {
        name: 'Munai Beach',
        name_ta: 'முனை கடற்கரை',
        category: 'Nature',
        description: {
          en: 'A scenic sandy coast near the lighthouse, famous for watching sunrises and observing the traditional catamaran fishing fleets.',
          ta: 'கலங்கரை விளக்கிற்கு அருகில் உள்ள எழில்மிகு மணல் கடற்கரை, சூரிய உதயத்தைப் பார்ப்பதற்கும் பாரம்பரிய மீன்பிடி படகுகளைப் பார்ப்பதற்கும் பிரபலமானது.'
        },
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop'
      }
    ]
  },
  valvettithurai: {
    history: {
      en: 'Valvettithurai (VVT) is a historic coastal town famous for its seafaring tradition, wooden boat building, and international maritime trade in the 19th century. Known for its strong independent community spirit and pristine coastlines, it remains an integral part of the northern cultural identity.',
      ta: 'வல்வெட்டித்துறை (VVT) 19 ஆம் நூற்றாண்டில் அதன் கடல்சார் பாரம்பரியம், மரக் கப்பல் கட்டும் தொழில் மற்றும் சர்வதேச கடல் வர்த்தகத்திற்குப் பெயர் பெற்ற ஒரு வரலாற்று கடலோர நகரமாகும்.'
    },
    attractions: [
      {
        name: 'Valvettithurai Beach & Harbor',
        name_ta: 'வல்வெட்டித்துறை கடற்கரை மற்றும் துறைமுகம்',
        category: 'Nature',
        description: {
          en: 'A quiet beach strip offering stunning ocean vistas and a glimpse into the active local fishing harbor and vessel building traditions.',
          ta: 'அற்புதமான கடல் காட்சிகளையும், உள்ளூர் மீன்பிடித் துறைமுகம் மற்றும் படகு கட்டும் பாரம்பரியங்களையும் காணக்கூடிய ஒரு அமைதியான கடற்கரை பகுதி.'
        },
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop'
      }
    ]
  },
  kopay: {
    history: {
      en: 'Kopay is a prominent green agricultural and educational hub located just 4km east of Jaffna city. It has a rich history from the Jaffna Kingdom era and is today highly valued as the "University Belt" owing to the proximity of the University of Jaffna campus, attracting students and academics alike.',
      ta: 'கோப்பாய் யாழ் நகருக்கு கிழக்கே வெறும் 4 கிமீ தொலைவில் அமைந்துள்ள ஒரு பசுமையான விவசாய மற்றும் கல்வி மையமாகும். இது யாழ்ப்பாண இராச்சிய காலத்திலிருந்து ஒரு வளமான வரலாற்றைக் கொண்டுள்ளது, இன்று யாழ் பல்கலைக்கழகத்தின் காரணமாக "பல்கலைக்கழக பெல்ட்" என்று அழைக்கப்படுகிறது.'
    },
    attractions: [
      {
        name: 'University of Jaffna Campus',
        name_ta: 'யாழ்ப்பாணப் பல்கலைக்கழக வளாகம்',
        category: 'Education',
        description: {
          en: 'The premier higher education institution of the Northern Province, characterized by its traditional Jaffna architecture and academic prestige.',
          ta: 'வட மாகாணத்தின் முதன்மை உயர்கல்வி நிறுவனம், அதன் பாரம்பரிய யாழ்ப்பாண கட்டிடக்கலை மற்றும் கல்விப் பெருமைக்கு பெயர் பெற்றது.'
        },
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop'
      }
    ]
  },
  kayts: {
    history: {
      en: 'Kayts (Uratota) is one of the most historic islands in the Jaffna lagoon. It was an ancient naval port used by Tamil kings, Arab traders, Portuguese colonizers, and Dutch forces. It holds deep historical significance as a military fort defensive outpost guarding the entrance to the Jaffna Peninsula.',
      ta: 'காய்ட்ஸ் (ஊராத்துறை) யாழ் ஏரியின் மிகவும் வரலாற்று சிறப்புமிக்க தீவுகளில் ஒன்றாகும். இது தமிழ் மன்னர்கள், அரபு வர்த்தகர்கள், போர்த்துகேயர்கள் மற்றும் டச்சுக்காரர்களால் பயன்படுத்தப்பட்ட ஒரு பண்டைய கடற்படைத் துறைமுகமாகும்.'
    },
    attractions: [
      {
        name: 'Fort Hammenhiel',
        name_ta: 'கோட்டை ஹம்மன்ஹில்',
        category: 'History',
        description: {
          en: 'A spectacular circular sea-fort built by the Portuguese on a tiny islet between Kayts and Karainagar, later fortified by the Dutch.',
          ta: 'காய்ட்ஸ்க்கும் காரைநகரிற்கும் இடையே உள்ள ஒரு சிறிய தீவில் போர்த்துகேயர்களால் கட்டப்பட்டு, பின்னர் டச்சுக்காரர்களால் பலப்படுத்தப்பட்ட ஒரு வட்ட வடிவ கடல் கோட்டை.'
        },
        image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&h=400&fit=crop'
      }
    ]
  }
};

export function getAreaHeritage(slug: string): AreaHeritage {
  // Map point-pedro to point_pedro
  const key = slug.replace(/-/g, '_');
  return (
    AREA_HERITAGE[key] || {
      history: {
        en: `The area of ${slug.replace(/-/g, ' ')} is a vital part of the Northern Province of Sri Lanka. Known for its rich local culture, traditional agricultural practices, and welcoming community, it represents a core residential and cultural pillar of the region.`,
        ta: `${slug.replace(/-/g, ' ')} பகுதியானது இலங்கை வட மாகாணத்தின் ஒரு முக்கிய பகுதியாகும். அதன் வளமான உள்ளூர் கலாசாரம், பாரம்பரிய வாழ்வியல் மற்றும் விருந்தோம்பல் பண்பிற்கு பெயர் பெற்றது.`
      },
      attractions: []
    }
  );
}
