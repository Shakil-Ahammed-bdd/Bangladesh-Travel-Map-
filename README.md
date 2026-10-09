# বাংলাদেশ ভ্রমণ ম্যাপ (React) — বাংলাদেশের ৬৪ জেলা

ইন্টারেক্টিভ জেলা-ম্যাপ: জেলার নামে ক্লিক করলে ম্যাপে সেই জেলা রঙিন হয়। এতে আছে নেভিগেশন বার ও ব্যানার, বাংলা/English, ছবি ও নাম, ৫টা থিম, জেলার নাম দেখানোর সুইচ, আর JPG/PNG/PDF ডাউনলোড।

---

## উপায় ১: এই প্রজেক্টটা সরাসরি চালাও

```bash
cd bangladesh-district-map
npm install
npm run dev
```

টার্মিনালে যে লিংক দেখাবে (যেমন http://localhost:5173) সেটা ব্রাউজারে খোলো।

---

## উপায় ২: তোমার আগের প্রজেক্টে (যেমন react-world-on-the-go) যোগ করো

**ধাপ ১ — ফোল্ডার কপি করো।** এই প্রজেক্টের `src` ফোল্ডারের ভেতর থেকে এই ৬টা ফোল্ডার তোমার প্রজেক্টের `src` ফোল্ডারে কপি করো:

```
src/components/   (সব কম্পোনেন্ট — ভেতরে Navbar, Banner, Sidebar, MapCard, Controls, Footer, AboutModal, shared ফোল্ডার)
src/data/         (জেলার ম্যাপ, লেখা, থিম, বিভাগ, নির্মাতার তথ্য)
src/hooks/        (usePersistentState, useCardExport)
src/utils/        (ডাউনলোড, নামের লেবেল ইত্যাদি হেল্পার)
src/styles/       (base.css, layout.css)
src/assets/       (shakil.jpg — "তৈরি করেছেন" কার্ডের ছবি)
```

> আগের ভার্সনের `src/components/DistrictMap.css` ফাইলটা তোমার প্রজেক্টে থাকলে মুছে দাও, এখন আর লাগে না।

**ধাপ ২ — `src/App.jsx` বদলাও।** তোমার `App.jsx`-এর সব লেখা মুছে এটা বসাও:

```jsx
import DistrictMap from './components/DistrictMap';

export default function App() {
  return <DistrictMap />;
}
```

(অন্য কিছুর পাশে দেখাতে চাইলে শুধু `<DistrictMap />` লাইনটা তোমার JSX-এর ভেতরে বসাও।)

**ধাপ ৩ — Vite-এর ডিফল্ট স্টাইল পরিষ্কার করো।** পুরো স্ক্রিন পেতে এটা জরুরি:

- `src/index.css` ফাইলের সব লেখা মুছে এটা বসাও:
  ```css
  html, body, #root { margin: 0; padding: 0; min-height: 100%; }
  body { background: #EFEAE0; }
  ```
- `src/App.css` ফাইলের সব লেখা মুছে দাও (ফাইল খালি থাকলেও চলবে), আর `App.jsx`-এ `import './App.css'` থাকলে লাইনটা সরাও।

**ধাপ ৪ — চালাও।**

```bash
npm run dev
```

আর নতুন কোনো প্যাকেজ install করতে হবে না। `react` আর `react-dom` ছাড়া কিছু লাগে না।

---

## অনলাইনে দিতে (Surge)

```bash
npm run build
surge dist তোমার-নাম.surge.sh
```

---

## কোন ফাইল কী করে (কোড বুঝতে এখান থেকে শুরু করো)

পুরো পেজটা এখন ছোট ছোট কম্পোনেন্টে ভাগ করা। **`DistrictMap.jsx` হলো মূল ফাইল** — এটা শুধু তথ্য (state) রাখে আর বাকি কম্পোনেন্টগুলোকে জোড়া লাগায়। প্রতিটা কম্পোনেন্টের নিজের CSS ফাইল তার পাশেই আছে।

```
src/
  App.jsx                      ← <DistrictMap /> বসানো
  components/
    DistrictMap.jsx            ← মূল ফাইল: সব state + কম্পোনেন্ট জোড়া লাগানো
    Navbar/                    ← উপরের বার
      Navbar.jsx, Navbar.css, LanguageToggle.jsx (বাংলা | English)
    Banner/                    ← সবুজ ব্যানার (শিরোনাম + "ম্যাপ শুরু করুন")
    Sidebar/                   ← বাম পাশের কলাম
      Sidebar.jsx              (পুরো কলাম)
      ProfileForm.jsx          (নাম + ছবি আপলোড)
      DistrictList.jsx         (সার্চ + সব বাছাই/মুছুন + বিভাগগুলো)
      DivisionSection.jsx      (একটা বিভাগ ও তার জেলার বাটন)
    MapCard/                   ← শেয়ার করার কার্ড (এটাই ডাউনলোড হয়)
      MapCard.jsx              (কার্ড জোড়া লাগানো)
      CardHeader.jsx           (ছবি, নাম, বড় সংখ্যা)
      BangladeshMap.jsx        (ক্লিক করার মতো ম্যাপ + জেলার নাম)
      CardFooter.jsx           (প্রোগ্রেস বার + "৯% ঘোরা হয়েছে")
    Controls/                  ← কার্ডের নিচের বক্স
      Controls.jsx, NamesSwitch.jsx (নাম দেখানোর সুইচ),
      DownloadButtons.jsx (JPG/PNG/PDF), ThemePicker.jsx (থিমের রঙ)
    Footer/                    ← ফুটার + "তৈরি করেছেন" বাটন
    AboutModal/                ← নির্মাতার পপ-আপ কার্ড
    shared/BrandMark.jsx       ← ছোট ম্যাপ-পিন লোগো
  data/
    districtsData.js           ← ৬৪ জেলার ম্যাপের আকার ও নাম (বড় ফাইল, হাত দিও না)
    texts.js                   ← সব লেখা (বাংলা + English) — লেখা বদলাতে এখানে
    themes.js                  ← ৫টা থিমের রঙ
    divisions.js               ← ৮টা বিভাগ ও কোন জেলা কোনটাতে
    creator.js                 ← নির্মাতার নাম, ছবি, সোশ্যাল লিংক
  hooks/
    usePersistentState.js      ← useState-এর মতো, কিন্তু ব্রাউজারে সেভ থাকে
    useCardExport.js           ← কার্ডকে JPG/PNG/PDF বানায়
  utils/
    exportCard.js              ← কার্ডের ছবি আঁকা + PDF বানানো
    labels.js                  ← জেলার নাম যাতে একটার উপর আরেকটা না বসে
    cardText.js                ← কার্ডে যে লেখাগুলো যায়
    format.js                  ← বাংলা সংখ্যা, ফাইলের নাম
    image.js                   ← আপলোড করা ছবি ছোট করা
    scroll.js                  ← নরম স্ক্রল
  styles/
    base.css                   ← রঙ, ফন্ট, সাধারণ বাটন
    layout.css                 ← ফোন/ট্যাবলেট/ল্যাপটপে কোনটা কোথায় বসবে
  assets/shakil.jpg            ← "তৈরি করেছেন" কার্ডের ছবি
```

**কিছু বদলাতে চাইলে কোন ফাইল খুলবে:**

| কী বদলাবে | কোন ফাইল |
|-----------|-----------|
| যেকোনো লেখা (শিরোনাম, বাটন, বর্ণনা) | `data/texts.js` |
| থিমের রঙ / নতুন থিম | `data/themes.js` |
| নাম, ছবি, GitHub/Facebook/LinkedIn লিংক | `data/creator.js` (ছবি: `assets/shakil.jpg`) |
| কার্ড বড়/ছোট (ল্যাপটপে) | `styles/base.css`-এর `--card-width` |
| কোনটা কোথায় বসবে (মোবাইল/ল্যাপটপ) | `styles/layout.css` |
| নেভিগেশন বারের চেহারা | `components/Navbar/Navbar.css` |
| ব্যানারের চেহারা | `components/Banner/Banner.css` |
| কার্ডের চেহারা | `components/MapCard/MapCard.css` |
| ফুটারের চেহারা | `components/Footer/Footer.css` |

## ছোট ছোট কাস্টমাইজ

- **শুরুতে English রাখতে:** `<DistrictMap defaultLang="en" />`
- **"তৈরি করেছেন" কার্ডের ছবি বদলাতে:** `src/assets/shakil.jpg` ফাইলটা নিজের নতুন ছবি দিয়ে বদলাও (একই নামে রাখলেই হবে)। লেখা বদলাতে `data/texts.js`-এর `aboutRole` ও `aboutText` লাইন দুটো বদলাও।
- **ফুটারের নাম ও সোশ্যাল লিংক বদলাতে:** `src/data/creator.js` ফাইলে নাম ও GitHub/Facebook/LinkedIn লিংক আছে, সেখানে বদলাও।
- **নতুন থিম:** `src/data/themes.js`-এ একটা ব্লক কপি করে `id`, নাম ও রঙ বদলাও।
- **ম্যাপ কার্ডের সাইজ (ল্যাপটপ/ডেস্কটপে):** `src/styles/base.css`-এর উপরে `--card-width: 680px;` লাইনটা আছে। সংখ্যাটা বাড়ালে কার্ড ও ম্যাপ বড় হবে, কমালে ছোট (কার্ডের আকার সবসময় ৩:৪ লম্বা থাকে)।
- **ফন্ট:** `src/styles/base.css`-এর একদম উপরের Google Fonts লাইন ইন্টারনেট থাকলে বাংলা ফন্ট লোড করে। এটা না থাকলে ডাউনলোড করা ছবিতে বাংলা লেখা সাধারণ ফন্টে আসবে।

## মনে রাখো

- ছবি, নাম, ঘোরা জেলা, ভাষা ও থিম ব্রাউজারের `localStorage`-এ সেভ হয় (অন্য ব্রাউজারে বা incognito-তে আলাদা থাকবে)।
- ম্যাপের আকার আসল জেলা-সীমানার তথ্য সহজ করে বানানো, তাই খুব ছোট জেলায় সামান্য পার্থক্য থাকতে পারে।
