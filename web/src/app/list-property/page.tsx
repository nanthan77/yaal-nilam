'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Check, ChevronRight, MessageCircle, UploadCloud, User, Phone, Mail, Home, MapPin, DollarSign, Bed, Bath, Car, Layers, Ruler, FileText, Tag, Sparkles } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { fileToWebp } from '@/lib/imageToWebp';
import { buildSubmissionAttribution, canonicalizePhoneNumber, canonicalizeYouTubeUrl, type RestoredPublicProfile } from '@/lib/agent-onboarding';
import { useStore } from '@/lib/store';
import { buildWhatsAppUrl } from '@/lib/marketplace';
import { localize } from '@/lib/translations';

// Keep the current live seller form’s district and town choices.
const areaGroups = [
  {
    district: {"slug":"jaffna","name":"Jaffna","name_ta":"யாழ்ப்பாணம்"},
    options: [
      {"value":"jaffna","en":"All Jaffna District","ta":"யாழ்ப்பாணம் மாவட்டம் முழுவதும்"},
      {"value":"jaffna-town","en":"Jaffna Town","ta":"யாழ் நகர்"},
      {"value":"nallur","en":"Nallur","ta":"நல்லூர்"},
      {"value":"chavakachcheri","en":"Chavakachcheri","ta":"சாவகச்சேரி"},
      {"value":"point-pedro","en":"Point Pedro","ta":"பருத்தித்துறை"},
      {"value":"karainagar","en":"Karainagar","ta":"காரைநகர்"},
      {"value":"velanai","en":"Velanai","ta":"வேலணை"},
      {"value":"kayts","en":"Kayts","ta":"ஊர்காவற்துறை"},
      {"value":"vaddukoddai","en":"Vaddukoddai","ta":"வட்டுக்கோட்டை"},
      {"value":"kokkuvil","en":"Kokkuvil","ta":"கொக்குவில்"},
      {"value":"kondavil","en":"Kondavil","ta":"கொண்டாவில்"},
      {"value":"kopay","en":"Kopay","ta":"கோப்பாய்"},
      {"value":"chankanai","en":"Chankanai","ta":"சங்கானை"},
      {"value":"chunnakam","en":"Chunnakam","ta":"சுன்னாகம்"},
      {"value":"urumpirai","en":"Urumpirai","ta":"உரும்பிராய்"},
      {"value":"tellippalai","en":"Tellippalai","ta":"தெல்லிப்பழை"},
      {"value":"kankesanthurai","en":"Kankesanthurai (KKS)","ta":"காங்கேசன்துறை"},
      {"value":"manipay","en":"Manipay","ta":"மாணிப்பாய்"},
    ],
  },
  {
    district: {"slug":"kilinochchi","name":"Kilinochchi","name_ta":"கிளிநொச்சி"},
    options: [
      {"value":"kilinochchi","en":"All Kilinochchi District","ta":"கிளிநொச்சி மாவட்டம் முழுவதும்"},
      {"value":"kilinochchi-town","en":"Kilinochchi Town","ta":"கிளிநொச்சி நகர்"},
      {"value":"paranthan","en":"Paranthan","ta":"பரந்தன்"},
      {"value":"poonakary","en":"Poonakary","ta":"பூநகரி"},
      {"value":"kandavalai","en":"Kandavalai","ta":"கண்டாவளை"},
    ],
  },
  {
    district: {"slug":"mullaitivu","name":"Mullaitivu","name_ta":"முல்லைத்தீவு"},
    options: [
      {"value":"mullaitivu","en":"All Mullaitivu District","ta":"முல்லைத்தீவு மாவட்டம் முழுவதும்"},
      {"value":"mullaitivu-town","en":"Mullaitivu Town","ta":"முல்லைத்தீவு நகர்"},
      {"value":"puthukkudiyiruppu","en":"Puthukkudiyiruppu","ta":"புதுக்குடியிருப்பு"},
      {"value":"oddusuddan","en":"Oddusuddan","ta":"ஒட்டுசுட்டான்"},
      {"value":"maritimepattu","en":"Maritimepattu","ta":"கரைதுறைப்பற்று"},
    ],
  },
  {
    district: {"slug":"vavuniya","name":"Vavuniya","name_ta":"வவுனியா"},
    options: [
      {"value":"vavuniya","en":"All Vavuniya District","ta":"வவுனியா மாவட்டம் முழுவதும்"},
      {"value":"vavuniya-town","en":"Vavuniya Town","ta":"வவுனியா நகர்"},
      {"value":"nedunkeni","en":"Nedunkeni","ta":"நெடுங்கேணி"},
      {"value":"cheddikulam","en":"Cheddikulam","ta":"செட்டிகுளம்"},
    ],
  },
  {
    district: {"slug":"mannar","name":"Mannar","name_ta":"மன்னார்"},
    options: [
      {"value":"mannar","en":"All Mannar District","ta":"மன்னார் மாவட்டம் முழுவதும்"},
      {"value":"mannar-town","en":"Mannar Town","ta":"மன்னார் நகர்"},
      {"value":"murunkan","en":"Murunkan","ta":"முருங்கன்"},
      {"value":"pesalai","en":"Pesalai","ta":"பேசாலை"},
      {"value":"thalaimannar","en":"Thalaimannar","ta":"தலைமன்னார்"},
    ],
  },
];
const areas = areaGroups.flatMap((group) => group.options);

const propertyTypes = [
  { value: 'house', en: 'House', ta: 'வீடு' },
  { value: 'land', en: 'Land', ta: 'காணி' },
  { value: 'commercial', en: 'Commercial', ta: 'வணிகச் சொத்து' },
  { value: 'villa', en: 'Villa', ta: 'வில்லா' },
  { value: 'apartment', en: 'Apartment', ta: 'அபார்ட்மென்ட்' },
];

const intents = [
  { value: 'sell', en: 'For Sale', ta: 'விற்பனைக்கு' },
  { value: 'rent', en: 'For Rent', ta: 'வாடகைக்கு விட' },
  { value: 'short_rent', en: 'Short Stay', ta: 'குறுகிய தங்கல்' },
];

const amenities = ['Parking', 'Garden', 'Water supply', 'Road frontage', 'Balcony', 'Generator'];

const MAX_LISTING_PHOTOS = 10;
const INITIAL_LISTING_FORM = {
  ownerName: '',
  email: '',
  phone: '',
  propertyType: '',
  intent: '',
  area: '',
  title: '',
  address: '',
  price: '',
  bedrooms: '',
  bathrooms: '',
  landSize: '',
  sqft: '',
  roadFrontage: '',
  parking: '',
  furnishing: '',
  description: '',
  videoUrl: '',
  amenities: [] as string[],
  whatsappOptIn: true,
};

export default function ListPropertyPage() {
  const { locale } = useStore();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [stepOneError, setStepOneError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [uploadOwnerId, setUploadOwnerId] = useState('');
  const [authenticatedProfile, setAuthenticatedProfile] = useState<RestoredPublicProfile | null>(null);
  const [profileState, setProfileState] = useState<'anonymous' | 'loading' | 'ready' | 'error'>('loading');
  const authOwnerRef = useRef('');
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_LISTING_FORM,
    amenities: [...INITIAL_LISTING_FORM.amenities],
  }));

  const copy = localize(locale, {
    en: {
      title: 'List Your Property',
      subtitle: 'A guided intake that captures the essentials first, then helps us review and publish your listing faster.',
      step1: 'Step 1: Contact + listing basics',
      step2: 'Step 2: Listing details + media',
      ownerName: 'Owner / contact name',
      email: 'Email address',
      phone: 'Phone number',
      propertyType: 'Property Type',
      intent: 'Listing Intent',
      area: 'Area / Location',
      propertyTitle: 'Property title',
      address: 'Full address',
      price: 'Price (LKR)',
      landSize: 'Land Size (Perches)',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      sqft: 'Square Feet',
      roadFrontage: 'Road frontage (ft)',
      parking: 'Parking spots',
      furnishing: 'Furnishing',
      description: 'Property description',
      amenities: 'Highlights / amenities',
      photos: 'Property photos',
      photoHint: `Upload up to ${MAX_LISTING_PHOTOS} clear exterior and interior photos. Add a YouTube link above for a video tour — it shows first on your listing.`,
      photoUploadError: 'A photo could not be converted to WebP. Please use a JPG, PNG, HEIC, or WebP image and try again.',
      privatePhotoHint: 'Pending photos are private. Sign in before selecting photos, or submit the details now and send photos through WhatsApp.',
      privatePhotoAuthError: 'Sign in before adding private pending photos. Your property details can still be submitted without photos.',
      whatsappOptIn: 'You may contact me faster through WhatsApp',
      next: 'Continue',
      back: 'Back',
      submit: 'Submit Listing',
      submitting: 'Submitting...',
      successTitle: 'Property intake received',
      successBody: 'We created a pending seller submission and notified the review team. Your listing will become public only after admin approval.',
      whatsappCta: 'Continue on WhatsApp',
      home: 'Home',
      breadcrumb: 'List Property',
      quickAssist: 'Prefer to send photos on WhatsApp? That works too.',
      aiDraft: 'Draft title + description',
      aiDraftHint: 'Cleaner listing copy helps admins review and publish faster.',
      agentProfileHint: 'After admin verification, your approved listings will also appear on your agent profile URL.',
      agentProfile: 'View agent profile',
      agentReviewStatus: 'View profile review status',
      requiredStepOne: 'Please fill owner name, phone, property type, intent, and area before continuing.',
      phoneError: 'Enter a valid Sri Lankan or international phone number. Overseas numbers must include the country code.',
      youtubeError: 'Use a real HTTPS YouTube watch, Shorts, Live, or youtu.be link.',
      profileLoadError: 'We could not restore your signed-in profile. Refresh the page or sign in again before submitting so the listing is linked to the correct account.',
      profileLoading: 'Your signed-in profile is still loading. Please wait a moment and submit again.',
      submitError: `Sorry, we couldn't submit your listing. Please try again, or send the details on WhatsApp at +94 70 484 6555.`,
    },
    ta: {
      title: 'உங்கள் சொத்தைப் பட்டியலிடுங்கள்',
      subtitle: 'முதலில் முக்கிய தகவல்களைப் பதிவு செய்து, பின்னர் listing details + media சேகரிக்க உதவும் guided intake.',
      step1: 'படி 1: தொடர்பு + listing அடிப்படை தகவல்',
      step2: 'படி 2: listing விவரங்கள் + media',
      ownerName: 'உரிமையாளர் / தொடர்பு பெயர்',
      email: 'மின்னஞ்சல் முகவரி',
      phone: 'தொலைபேசி எண்',
      propertyType: 'சொத்து வகை',
      intent: 'Listing நோக்கம்',
      area: 'பகுதி / இடம்',
      propertyTitle: 'சொத்து தலைப்பு',
      address: 'முழு முகவரி',
      price: 'விலை (LKR)',
      landSize: 'காணி அளவு (பேர்ச்)',
      bedrooms: 'படுக்கையறைகள்',
      bathrooms: 'குளியலறைகள்',
      sqft: 'சதுர அடி',
      roadFrontage: 'சாலை முகப்பு (அடி)',
      parking: 'வாகன நிறுத்தங்கள்',
      furnishing: 'அமைப்பு நிலை',
      description: 'சொத்து விவரம்',
      amenities: 'Highlights / வசதிகள்',
      photos: 'சொத்து புகைப்படங்கள்',
      photoHint: `அதிகபட்சம் ${MAX_LISTING_PHOTOS} தெளிவான வெளிப்புற மற்றும் உட்புற புகைப்படங்களை upload செய்யுங்கள்.`,
      photoUploadError: 'ஒரு படத்தை WebP வடிவத்திற்கு மாற்ற முடியவில்லை. JPG, PNG, HEIC அல்லது WebP படத்தைப் பயன்படுத்தி மீண்டும் முயற்சிக்கவும்.',
      privatePhotoHint: 'நிலுவையில் உள்ள படங்கள் தனிப்பட்டவை. படங்களைத் தேர்ந்தெடுக்கும் முன் உள்நுழையுங்கள்; இல்லையெனில் விவரங்களை அனுப்பி படங்களை WhatsApp மூலம் பகிருங்கள்.',
      privatePhotoAuthError: 'தனிப்பட்ட நிலுவைப் படங்களைச் சேர்க்க முன் உள்நுழையுங்கள். படங்கள் இல்லாமலும் சொத்து விவரங்களை அனுப்பலாம்.',
      whatsappOptIn: 'விரைவான தொடர்புக்கு என்னை WhatsApp-ல் அணுகலாம்',
      next: 'தொடரவும்',
      back: 'முந்தையது',
      submit: 'Listing அனுப்புங்கள்',
      submitting: 'அனுப்பப்படுகிறது...',
      successTitle: 'சொத்து intake பெறப்பட்டது',
      successBody: 'Pending seller submission உருவாக்கப்பட்டு review குழுவுக்கு அறிவிக்கப்பட்டுள்ளது. Admin approval பிறகே listing பொதுவில் காட்டப்படும்.',
      whatsappCta: 'WhatsApp-ல் தொடருங்கள்',
      home: 'முகப்பு',
      breadcrumb: 'சொத்தை பட்டியலிடல்',
      quickAssist: 'புகைப்படங்களை WhatsApp மூலம் அனுப்ப விரும்புகிறீர்களா? அதுவும் சரி.',
      aiDraft: 'Title + description உருவாக்கவும்',
      aiDraftHint: 'தெளிவான listing copy admin review மற்றும் publish வேகமாக உதவும்.',
      agentProfileHint: 'Admin verification பிறகு, உங்கள் approved listings உங்கள் agent profile URL-லிலும் காணப்படும்.',
      agentProfile: 'முகவர் சுயவிவரம்',
      agentReviewStatus: 'Profile review நிலையைப் பார்க்கவும்',
      requiredStepOne: 'தொடர முன் பெயர், தொலைபேசி, சொத்து வகை, நோக்கம், பகுதி ஆகியவற்றை நிரப்புங்கள்.',
      phoneError: 'செல்லுபடியாகும் இலங்கை அல்லது சர்வதேச தொலைபேசி எண்ணை உள்ளிடுங்கள். வெளிநாட்டு எண்ணில் country code அவசியம்.',
      youtubeError: 'உண்மையான HTTPS YouTube watch, Shorts, Live அல்லது youtu.be link-ஐ பயன்படுத்துங்கள்.',
      profileLoadError: 'உங்கள் signed-in profile-ஐ மீட்டெடுக்க முடியவில்லை. Listing சரியான கணக்குடன் இணைக்கப்பட refresh செய்யவும் அல்லது மீண்டும் sign in செய்யவும்.',
      profileLoading: 'உங்கள் signed-in profile இன்னும் load ஆகிறது. சிறிது நேரம் காத்திருந்து மீண்டும் submit செய்யுங்கள்.',
      submitError: `மன்னிக்கவும், உங்கள் listing-ஐ அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது +94 70 484 6555 இல் WhatsApp மூலம் அனுப்புங்கள்.`,
    },
  });

  const whatsappLink = useMemo(
    () =>
      buildWhatsAppUrl(
        '94704846555',
        locale === 'ta'
          ? `வணக்கம், ${formData.area || 'யாழ்ப்பாணம்'} பகுதியில் ${formData.title || 'ஒரு சொத்தை'} பட்டியலிக்க விரும்புகிறேன்.`
          : `Hi, I'd like to list ${formData.title || 'a property'} in ${formData.area || 'Jaffna'}.`
      ),
    [locale, formData.area, formData.title]
  );

  const authenticatedProfileIsPublic =
    authenticatedProfile?.user_type === 'agent' &&
    authenticatedProfile.verified === true &&
    authenticatedProfile.status === 'active';

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const nextOwnerId = firebaseUser?.uid || '';
      if (authOwnerRef.current !== nextOwnerId) {
        // An anonymous draft may be retained when the visitor signs in, but a
        // signed-in account's entire draft is private to that UID. Clear it on
        // sign-out or direct A-to-B account switches on shared devices.
        if (authOwnerRef.current) {
          setFormData({ ...INITIAL_LISTING_FORM, amenities: [] });
          setStep(1);
          setSubmitted(false);
          setSubmitFailed(false);
          setStepOneError('');
          setPhoneError('');
          setVideoError('');
        }
        setUploadedPhotos([]);
      }
      authOwnerRef.current = nextOwnerId;

      if (!firebaseUser) {
        if (!active) return;
        setUploadOwnerId('');
        setAuthenticatedProfile(null);
        setProfileState('anonymous');
        setUploadedPhotos([]);
        return;
      }

      const ownerId = firebaseUser.uid;
      setUploadOwnerId(ownerId);
      setAuthenticatedProfile(null);
      setProfileState('loading');

      try {
        const snapshot = await getDoc(doc(db, 'users', ownerId));
        if (!active || auth.currentUser?.uid !== ownerId) return;
        if (!snapshot.exists()) {
          setProfileState('error');
          return;
        }

        const profile = snapshot.data() as RestoredPublicProfile;
        const profileName = String(profile.name || '');
        const profilePhone = String(profile.phone || '');
        setAuthenticatedProfile(profile);
        setProfileState('ready');
        setFormData((current) => {
          const ownerName = current.ownerName || profileName;
          const phone = current.phone || profilePhone;
          return {
            ...current,
            ownerName,
            phone,
            // A Firebase login email is a private account identifier. Keep the
            // contact field empty unless the agent deliberately enters an
            // address for the moderation team.
            email: current.email,
          };
        });
      } catch (error) {
        console.warn('Could not restore the signed-in listing profile:', error);
        if (active && auth.currentUser?.uid === ownerId) setProfileState('error');
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'whatsappOptIn') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      return;
    }
    if (name === 'phone') setPhoneError('');
    if (name === 'videoUrl') setVideoError('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleAmenity(value: string) {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter((item) => item !== value)
        : [...prev.amenities, value],
    }));
  }

  function labelFor(options: { value: string; en: string; ta: string }[], value: string) {
    const found = options.find((item) => item.value === value);
    if (!found) return value;
    return locale === 'ta' ? found.ta : found.en;
  }

  function uploadObjectName(ownerId: string, file: File, index: number) {
    const base = (file.name || 'photo').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48) || 'photo';
    const random =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    return `listing-submissions/${ownerId}/${random}-${index}-${base}.webp`;
  }

  function draftListingContent() {
    const area = labelFor(areas, formData.area) || 'Jaffna';
    const propertyType = labelFor(propertyTypes, formData.propertyType) || 'Property';
    const intent = labelFor(intents, formData.intent) || 'For Sale';
    const details = [
      formData.landSize ? `${formData.landSize} perches` : '',
      formData.bedrooms ? `${formData.bedrooms} bedrooms` : '',
      formData.bathrooms ? `${formData.bathrooms} bathrooms` : '',
      formData.roadFrontage ? `${formData.roadFrontage} ft road frontage` : '',
      formData.furnishing ? formData.furnishing.replace(/-/g, ' ') : '',
      formData.amenities.length ? formData.amenities.join(', ') : '',
    ].filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      title: prev.title || `${area} ${propertyType} ${intent}`.trim(),
      description:
        prev.description ||
        `${propertyType} ${intent.toLowerCase()} in ${area}${prev.address ? ` near ${prev.address}` : ''}. ${
          details.length ? `Key details include ${details.join(', ')}. ` : ''
        }Contact ${prev.ownerName || 'the owner'} for viewing, documents, and price negotiation.`,
    }));
  }

  function handleContinue() {
    const required = [
      formData.ownerName,
      formData.phone,
      formData.propertyType,
      formData.intent,
      formData.area,
    ];

    if (required.some((value) => !String(value || '').trim())) {
      setStepOneError(copy.requiredStepOne);
      return;
    }

    const phone = canonicalizePhoneNumber(formData.phone);
    if (!phone) {
      setPhoneError(copy.phoneError);
      setStepOneError('');
      return;
    }

    setStepOneError('');
    setPhoneError('');
    setFormData((current) => ({ ...current, phone }));
    setStep(2);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  async function uploadPhotos(files: File[], ownerId: string) {
    if (!files.length) return [];
    if (!ownerId || ownerId.includes('/')) throw new Error('Authentication is required for photos.');

    const [{ deleteObject, ref, uploadBytes }, { storage }] = await Promise.all([
      import('firebase/storage'),
      import('@/lib/firebase'),
    ]);

    const paths = new Array<string>(files.length);
    const uploadedPaths: string[] = [];
    let nextIndex = 0;
    const workerCount = Math.min(3, files.length);

    // Bounded concurrency avoids decoding every selected phone photo at once.
    const workers = Array.from({ length: workerCount }, async () => {
      while (nextIndex < files.length) {
        const index = nextIndex;
        nextIndex += 1;
        const file = files[index];
        const webp = await fileToWebp(file);
        const objectPath = uploadObjectName(ownerId, file, index);
        const fileRef = ref(storage, objectPath);
        await uploadBytes(fileRef, webp, {
          contentType: 'image/webp',
          cacheControl: 'private,max-age=0,no-store',
          customMetadata: { source: 'web_app', owner: ownerId },
        });
        uploadedPaths.push(objectPath);
        paths[index] = objectPath;
      }
    });

    const results = await Promise.allSettled(workers);
    const failure = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    );
    if (failure) {
      // Wait for every worker before rollback so a slower successful upload
      // cannot land after cleanup and become an orphaned private object.
      await Promise.allSettled(uploadedPaths.map((path) => deleteObject(ref(storage, path))));
      throw failure.reason;
    }
    return paths;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitFailed(false);
    let photoPaths: string[] = [];
    let listingCommitted = false;
    try {
      const firebaseOwnerId = auth.currentUser?.uid || '';
      const normalizedPhone = canonicalizePhoneNumber(formData.phone);
      if (!normalizedPhone) {
        setPhoneError(copy.phoneError);
        setStep(1);
        return;
      }

      const canonicalVideoUrl = formData.videoUrl.trim()
        ? canonicalizeYouTubeUrl(formData.videoUrl)
        : '';
      if (formData.videoUrl.trim() && !canonicalVideoUrl) {
        setVideoError(copy.youtubeError);
        return;
      }

      if (profileState === 'loading') {
        setStepOneError(copy.profileLoading);
        return;
      }

      if (firebaseOwnerId) {
        if (
          profileState !== 'ready' ||
          !authenticatedProfile ||
          firebaseOwnerId !== uploadOwnerId
        ) {
          setStepOneError(copy.profileLoadError);
          return;
        }
      }

      if (uploadedPhotos.length && (!firebaseOwnerId || firebaseOwnerId !== uploadOwnerId)) {
        setStepOneError(copy.privatePhotoAuthError);
        setSubmitFailed(true);
        return;
      }

      const attribution = buildSubmissionAttribution({
        uid: firebaseOwnerId,
        profile: firebaseOwnerId ? authenticatedProfile : null,
        ownerName: formData.ownerName,
        ownerPhone: normalizedPhone,
      });

      try {
        photoPaths = await uploadPhotos(uploadedPhotos, firebaseOwnerId);
      } catch (error) {
        console.error('Photo conversion or upload failed:', error);
        setStepOneError(copy.photoUploadError);
        setSubmitFailed(true);
        return;
      }

      const { submitListing } = await import('@/lib/firestore');
      const result = await submitListing({
        ...formData,
        phone: normalizedPhone,
        videoUrl: canonicalVideoUrl,
        photos: [],
        photoPaths,
        mediaOwnerId: photoPaths.length ? firebaseOwnerId : '',
        ...attribution,
        // The account login email is private. Only the address deliberately
        // entered in this listing form is a submission contact.
        agentEmail: formData.email,
      });

      if (result) {
        listingCommitted = true;
        setSubmitted(true);
      } else {
        setSubmitFailed(true);
      }
    } catch (error) {
      console.error('Listing submit error:', error);
      setSubmitFailed(true);
    } finally {
      if (!listingCommitted && photoPaths.length) {
        const [{ deleteObject, ref }, { storage }] = await Promise.all([
          import('firebase/storage'),
          import('@/lib/firebase'),
        ]);
        await Promise.allSettled(photoPaths.map((path) => deleteObject(ref(storage, path))));
      }
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-sand-50">
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        </div>
        <div className="container-wide relative z-10">
          <nav className="text-sand-200/80 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-amber-400 transition-colors">{copy.home}</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-amber-400">{copy.breadcrumb}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{copy.title}</h1>
          <p className="text-teal-100/90 text-lg max-w-3xl leading-relaxed">{copy.subtitle}</p>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="rounded-3xl bg-white border border-teal-200 shadow-sm p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-teal-50 p-3">
                  <Check className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-3">{copy.successTitle}</h2>
                  <p className="text-charcoal-700 mb-5">{copy.successBody}</p>
                  {authenticatedProfile?.user_type === 'agent' && uploadOwnerId && (
                    <div className="mb-5 rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3">
                      <p className="text-sm text-charcoal-700">{copy.agentProfileHint}</p>
                      <Link
                        href={authenticatedProfileIsPublic ? `/agents/${uploadOwnerId}` : '/dashboard'}
                        className="mt-2 inline-flex text-sm font-bold text-teal-700 hover:text-teal-900"
                      >
                        {authenticatedProfileIsPublic ? copy.agentProfile : copy.agentReviewStatus}
                      </Link>
                    </div>
                  )}
                  {formData.whatsappOptIn && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-green-50 text-green-700 hover:bg-green-100 px-4 py-3 font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {copy.whatsappCta}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="card shadow-card-lg bg-white p-8 md:p-10">
                {/* Custom modern premium tab steppers */}
                <div className="grid grid-cols-2 gap-4 mb-10 pb-6 border-b border-sand-200/60">
                  <div className={`flex flex-col gap-2 pb-3 border-b-4 transition-all duration-300 ${step === 1 ? 'border-teal-700' : 'border-transparent opacity-60'}`}>
                    <span className="text-xs font-black uppercase tracking-wider text-teal-850 flex items-center gap-1.5">
                      {step > 1 ? <Check className="w-3.5 h-3.5 text-green-600 stroke-[3] animate-fade-in" /> : <span className="w-4.5 h-4.5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-[10px] font-black border border-teal-250">1</span>}
                      {locale === 'ta' ? 'படி 1' : 'Step 1'}
                    </span>
                    <span className="text-sm font-bold text-charcoal-900 line-clamp-1">{copy.step1.replace(/Step \d:\s*/i, '').replace(/படி \d:\s*/i, '')}</span>
                  </div>
                  <div className={`flex flex-col gap-2 pb-3 border-b-4 transition-all duration-300 ${step === 2 ? 'border-teal-700' : 'border-transparent opacity-60'}`}>
                    <span className="text-xs font-black uppercase tracking-wider text-teal-850 flex items-center gap-1.5">
                      <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black ${step === 2 ? 'bg-teal-50 text-teal-700 border border-teal-250' : 'bg-sand-100 text-charcoal-500 border border-sand-200'}`}>2</span>
                      {locale === 'ta' ? 'படி 2' : 'Step 2'}
                    </span>
                    <span className="text-sm font-bold text-charcoal-900 line-clamp-1">{copy.step2.replace(/Step \d:\s*/i, '').replace(/படி \d:\s*/i, '')}</span>
                  </div>
                </div>
                {stepOneError && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                    {stepOneError}
                  </div>
                )}

                {step === 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div>
                      <label htmlFor="ownerName" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.ownerName}</label>
                      <div className="input-container-icon">
                        <User className="input-icon" />
                        <input id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} required className="input-field input-field-icon w-full" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.phone}</label>
                      <div className="input-container-icon">
                        <Phone className="input-icon" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          aria-invalid={Boolean(phoneError)}
                          aria-describedby={phoneError ? 'listing-phone-error' : undefined}
                          className="input-field input-field-icon w-full"
                        />
                      </div>
                      {phoneError && <p id="listing-phone-error" role="alert" className="mt-2 text-sm font-medium text-red-700">{phoneError}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.email}</label>
                      <div className="input-container-icon">
                        <Mail className="input-icon" />
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="input-field input-field-icon w-full" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="propertyType" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.propertyType}</label>
                      <div className="input-container-icon">
                        <Home className="input-icon" />
                        <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} required className="select-field input-field-icon w-full">
                          <option value="" />
                          {propertyTypes.map((type) => <option key={type.value} value={type.value}>{locale === 'ta' ? type.ta : type.en}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="intent" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.intent}</label>
                      <div className="input-container-icon">
                        <Tag className="input-icon" />
                        <select id="intent" name="intent" value={formData.intent} onChange={handleChange} required className="select-field input-field-icon w-full">
                          <option value="" />
                          {intents.map((intent) => <option key={intent.value} value={intent.value}>{locale === 'ta' ? intent.ta : intent.en}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="area" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.area}</label>
                      <div className="input-container-icon">
                        <MapPin className="input-icon" />
                        <select id="area" name="area" value={formData.area} onChange={handleChange} required className="select-field input-field-icon w-full">
                          <option value="" />
                          {areaGroups.map(({ district, options }) => (
                            <optgroup key={district.slug} label={locale === 'ta' ? `${district.name_ta} மாவட்டம்` : `${district.name} District`}>
                              {options.map((area) => (
                                <option key={area.value} value={area.value}>{locale === 'ta' ? area.ta : area.en}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-teal-900">{copy.aiDraft}</p>
                        <p className="text-xs text-teal-700 mt-1">{copy.aiDraftHint}</p>
                      </div>
                      <button
                        type="button"
                        onClick={draftListingContent}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
                      >
                        <Sparkles className="w-4 h-4" />
                        {copy.aiDraft}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.propertyTitle}</label>
                        <div className="input-container-icon">
                          <FileText className="input-icon" />
                          <input id="title" name="title" value={formData.title} onChange={handleChange} required className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.address}</label>
                        <div className="input-container-icon">
                          <MapPin className="input-icon" />
                          <input id="address" name="address" value={formData.address} onChange={handleChange} required className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <label htmlFor="price" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.price}</label>
                        <div className="input-container-icon">
                          <DollarSign className="input-icon" />
                          <input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="bedrooms" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.bedrooms}</label>
                        <div className="input-container-icon">
                          <Bed className="input-icon" />
                          <input id="bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="bathrooms" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.bathrooms}</label>
                        <div className="input-container-icon">
                          <Bath className="input-icon" />
                          <input id="bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="parking" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.parking}</label>
                        <div className="input-container-icon">
                          <Car className="input-icon" />
                          <input id="parking" name="parking" type="number" value={formData.parking} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <label htmlFor="landSize" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.landSize}</label>
                        <div className="input-container-icon">
                          <Layers className="input-icon" />
                          <input id="landSize" name="landSize" type="number" value={formData.landSize} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="sqft" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.sqft}</label>
                        <div className="input-container-icon">
                          <Ruler className="input-icon" />
                          <input id="sqft" name="sqft" type="number" value={formData.sqft} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="roadFrontage" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.roadFrontage}</label>
                        <div className="input-container-icon">
                          <Ruler className="input-icon" />
                          <input id="roadFrontage" name="roadFrontage" type="number" value={formData.roadFrontage} onChange={handleChange} className="input-field input-field-icon w-full" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="furnishing" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.furnishing}</label>
                        <div className="input-container-icon">
                          <Home className="input-icon" />
                          <select id="furnishing" name="furnishing" value={formData.furnishing} onChange={handleChange} className="select-field input-field-icon w-full">
                            <option value="" />
                            <option value="furnished">Furnished</option>
                            <option value="semi-furnished">Semi-furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-3">{copy.amenities}</label>
                      <div className="flex flex-wrap gap-2.5">
                        {amenities.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleAmenity(item)}
                            className={`rounded-xl px-5 py-2.5 text-sm font-bold border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${formData.amenities.includes(item) ? 'bg-teal-700 text-white border-teal-700 shadow-md' : 'bg-white text-charcoal-700 border-sand-300 hover:border-teal-700/40'}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.description}</label>
                      <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="input-field w-full" />
                    </div>

                    <div>
                      <label htmlFor="videoUrl" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">
                        {locale === 'ta' ? 'YouTube வீடியோ இணைப்பு (விருப்பம்)' : 'YouTube video link (optional)'}
                      </label>
                      <input
                        id="videoUrl"
                        name="videoUrl"
                        type="url"
                        inputMode="url"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        onBlur={() => {
                          if (!formData.videoUrl.trim()) return;
                          const canonical = canonicalizeYouTubeUrl(formData.videoUrl);
                          if (canonical) setFormData((current) => ({ ...current, videoUrl: canonical }));
                        }}
                        placeholder="https://www.youtube.com/watch?v=..."
                        aria-invalid={Boolean(videoError)}
                        aria-describedby={videoError ? 'listing-video-error' : undefined}
                        className="input-field w-full"
                      />
                      {videoError && <p id="listing-video-error" role="alert" className="mt-2 text-sm font-medium text-red-700">{videoError}</p>}
                    </div>

                    <div>
                      <label htmlFor="photos" className="block text-xs font-black uppercase tracking-wider text-teal-905 mb-2">{copy.photos}</label>
                      <label htmlFor="photos" className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand-300 bg-sand-50/50 hover:bg-sand-100/50 hover:border-teal-700/60 transition-all px-6 py-10 text-center cursor-pointer group">
                        <UploadCloud className="w-10 h-10 text-teal-700 mb-3 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-extrabold text-charcoal-900 text-base">{copy.photos}</span>
                        <span className="text-xs text-charcoal-500 max-w-md mt-2 leading-relaxed">
                          {uploadOwnerId ? copy.photoHint : copy.privatePhotoHint}
                        </span>
                        <input
                          id="photos"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          disabled={!uploadOwnerId}
                          onChange={(e) => {
                            if (!uploadOwnerId) {
                              setStepOneError(copy.privatePhotoAuthError);
                              setUploadedPhotos([]);
                              return;
                            }
                            setStepOneError('');
                            setUploadedPhotos(
                              Array.from(e.target.files || []).slice(0, MAX_LISTING_PHOTOS)
                            );
                          }}
                        />
                      </label>
                      {!uploadOwnerId && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                          {copy.privatePhotoHint}{' '}
                          <Link href="/login" className="font-bold underline">{locale === 'ta' ? 'உள்நுழையுங்கள்' : 'Sign in'}</Link>
                        </div>
                      )}
                      {uploadedPhotos.length > 0 && (
                        <div className="flex items-center gap-2 mt-4 px-4 py-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-850 text-sm font-bold animate-fade-in">
                          <Check className="w-4 h-4 text-teal-700 stroke-[3]" />
                          <span>{uploadedPhotos.length} of {MAX_LISTING_PHOTOS} photo(s) selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card shadow-card bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-sand-200">
                <label htmlFor="whatsappOptIn" className="inline-flex items-center gap-3 text-charcoal-700 font-semibold cursor-pointer">
                  <input id="whatsappOptIn" type="checkbox" name="whatsappOptIn" checked={formData.whatsappOptIn} onChange={handleChange} className="checkbox-tactile" />
                  {copy.whatsappOptIn}
                </label>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 transition-colors">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  {copy.quickAssist}
                </a>
              </div>

              {submitFailed && (
                <div role="alert" className="rounded-xl bg-red-50 border border-red-300 text-red-700 px-4 py-3 text-sm">
                  {copy.submitError}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  disabled={step === 1}
                  className="px-6 py-3.5 font-bold rounded-xl border border-sand-300 bg-white text-charcoal-700 hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-sm transition-all"
                >
                  {copy.back}
                </button>

                {step === 1 ? (
                  <button type="button" onClick={handleContinue} className="btn-primary">
                    <span>{copy.next}</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="btn-gold disabled:opacity-60 disabled:cursor-not-allowed">
                    <span>{submitting ? copy.submitting : copy.submit}</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
