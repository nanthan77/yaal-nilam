// @ts-nocheck
"use client";

import { useStore } from "@/lib/store";
import { localize } from "@/lib/translations";
import Link from "next/link";
import { BookOpen, Compass, ShieldAlert, Award, ArrowRight } from "lucide-react";

export default function BlogHubPage() {
  const { locale } = useStore();

  const copy = localize(locale, {
    en: {
      title: "Articles, News & Property Guides",
      subtitle: "Expert advice, regional legal news, interior design trends, and local service directories in Northern Sri Lanka.",
      desc: "Resource guides structured for buyers, sellers, and diaspora seeking absolute clarity before investing in Jaffna real estate.",
      
      // Articles list
      article1Title: "Top Interior Design Ideas for Modern Homes in Jaffna",
      article1Desc: "Blend traditional Northern courtyard elements (Thinnai & Mittham) with luxurious modern glassmorphic and minimalist aesthetics.",
      article1Tag: "Interior Design",
      
      article2Title: "Directory of Best Property-Related Services in Northern Sri Lanka",
      article2Desc: "A vetted list of certified land surveyors, notary publics, construction contractors, and home decorators in Jaffna and Vavuniya.",
      article2Tag: "Services Directory",
      
      article3Title: "Sri Lanka Land Buying Regulations for Diaspora & Foreign Nationals",
      article3Desc: "A complete analysis of the Land Alienation Act, tax duties, and notary processes for dual citizens and overseas buyers.",
      article3Tag: "Legal & Regulations",

      readMore: "Read Article",
      backToHome: "Back to Home",
    },
    ta: {
      title: "கட்டுரைகள், செய்திகள் மற்றும் சொத்து வழிகாட்டிகள்",
      subtitle: "வட இலங்கையின் சொத்து சந்தை பற்றிய நிபுணர் ஆலோசனைகள், சட்ட ஆவண விளக்கங்கள் மற்றும் வடிவமைப்பு யோசனைகள்.",
      desc: "யாழ்ப்பாணத்தில் சொத்துக்களை வாங்குவதற்கு அல்லது விற்பதற்கு முன் வெளிப்படைத்தன்மையைப் பெற வாங்குபவர்களுக்காகத் தொகுக்கப்பட்ட வழிகாட்டிகள்.",

      // Articles list
      article1Title: "யாழ்ப்பாண நவீன வீடுகளுக்கான சிறந்த உட்புற வடிவமைப்பு (Interior Design) யோசனைகள்",
      article1Desc: "பாரம்பரிய திண்ணை மற்றும் முற்றம் அமைப்புகளை நவீன மினிமலிச மற்றும் சொகுசு கண்ணாடி வடிவமைப்புகளுடன் இணைப்பது எப்படி.",
      article1Tag: "உட்புற வடிவமைப்பு",

      article2Title: "வட இலங்கையின் சிறந்த சொத்து சார்ந்த சேவை வழங்குநர்களின் அடைவு",
      article2Desc: "யாழ்ப்பாணம் மற்றும் வவுனியாவில் உள்ள சான்றளிக்கப்பட்ட நில அளவையாளர்கள், சட்ட ஆவண நிபுணர்கள், ஒப்பந்ததாரர்களின் சரிபார்க்கப்பட்ட பட்டியல்.",
      article2Tag: "சேவைகள் அடைவு",

      article3Title: "வெளிநாடு வாழ் தமிழர்களுக்கான இலங்கை நில கொள்முதல் சட்டங்கள் மற்றும் வரி நடைமுறைகள்",
      article3Desc: "இரட்டை குடியுரிமை மற்றும் வெளிநாட்டு வாங்குபவர்களுக்கான Land Alienation சட்டம், வரி கடமைகள் பற்றிய முழுமையான பகுப்பாய்வு.",
      article3Tag: "சட்டம் மற்றும் விதிமுறைகள்",

      readMore: "மேலும் வாசிக்க",
      backToHome: "முகப்பிற்குச் செல்லவும்",
    },
  });

  const blogs = [
    {
      slug: "interior-design-jaffna",
      title: copy.article1Title,
      desc: copy.article1Desc,
      tag: copy.article1Tag,
      icon: Compass,
      color: "text-[#D4A853] bg-[#D4A853]/10",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&h=300&fit=crop",
    },
    {
      slug: "best-property-services",
      title: copy.article2Title,
      desc: copy.article2Desc,
      tag: copy.article2Tag,
      icon: Award,
      color: "text-[#2D7A5F] bg-[#2D7A5F]/10",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=500&h=300&fit=crop",
    },
    {
      slug: "buying-property-sri-lanka-diaspora",
      title: copy.article3Title,
      desc: copy.article3Desc,
      tag: copy.article3Tag,
      icon: ShieldAlert,
      color: "text-red-600 bg-red-50",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F3] pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0F2E25] via-[#1B4D3E] to-[#0F1419] text-white py-16 px-4 shadow-md text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#D4A853]/25 border border-[#D4A853]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#E8C97A] mb-4">
            <BookOpen className="w-4 h-4" />
            Yaal Nilam Blog & Resources
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{copy.title}</h1>
          <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => {
            const Icon = blog.icon;
            return (
              <article key={blog.slug} className="card bg-white overflow-hidden flex flex-col justify-between border border-[#F0E4D0]/60 hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="relative h-48 bg-sand-100 overflow-hidden">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-charcoal-800 shadow-sm`}>
                      {blog.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded-lg ${blog.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-charcoal-400">5 Mins Read</span>
                    </div>
                    <h3 className="text-lg font-black text-charcoal-900 leading-snug line-clamp-2 hover:text-[#1B4D3E] transition duration-200">
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-xs text-charcoal-600 mt-2.5 leading-relaxed line-clamp-3">
                      {blog.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 border-t border-[#FAF7F3]">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="w-full btn-primary bg-[#FAF7F3] !text-[#1B4D3E] border border-[#1B4D3E]/10 py-3 text-xs flex items-center justify-center gap-2 hover:bg-[#1B4D3E] hover:!text-white transition duration-200 shadow-none font-bold"
                  >
                    {copy.readMore}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="btn-primary text-sm shadow-none">
            {copy.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
