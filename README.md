# আমার জেলা ম্যাপ (React) — বাংলাদেশের ৬৪ জেলা

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

**ধাপ ১ — ফোল্ডার কপি করো।** এই প্রজেক্টের `src` ফোল্ডারের ভেতর থেকে এই ৩টা ফোল্ডার তোমার প্রজেক্টের `src` ফোল্ডারে কপি করো:

```
src/components/   (DistrictMap.jsx, DistrictMap.css)
src/data/         (districtsData.js, themes.js)
src/utils/        (exportCard.js, labels.js)
```

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

## ফাইলগুলো কী করে

| ফাইল | কাজ |
|------|-----|
| `src/components/DistrictMap.jsx` | মূল component: লিস্ট, ম্যাপ, ভাষা, থিম, ছবি/নাম, ডাউনলোড বাটন |
| `src/components/DistrictMap.css` | সব স্টাইল ও রেসপন্সিভ লেআউট |
| `src/data/districtsData.js` | ৬৪ জেলার ম্যাপের আকার, বাংলা/English নাম, বিভাগ |
| `src/data/themes.js` | ৫টা থিমের রঙ (নতুন থিম এখানে যোগ করো) |
| `src/utils/exportCard.js` | কার্ডকে JPG / PNG / PDF বানায় |
| `src/utils/labels.js` | জেলার নামগুলো যাতে একটার উপর আরেকটা না বসে |

## ছোট ছোট কাস্টমাইজ

- **শুরুতে English রাখতে:** `<DistrictMap defaultLang="en" />`
- **নতুন থিম:** `src/data/themes.js`-এ একটা ব্লক কপি করে `id`, নাম ও রঙ বদলাও।
- **ম্যাপ কার্ডের সাইজ (ল্যাপটপ/ডেস্কটপে):** `src/components/DistrictMap.css`-এর উপরে `--card-width: 680px;` লাইনটা আছে। সংখ্যাটা বাড়ালে কার্ড ও ম্যাপ বড় হবে, কমালে ছোট (কার্ডের আকার সবসময় ৩:৪ লম্বা থাকে)।
- **ফন্ট:** `DistrictMap.css`-এর একদম উপরের Google Fonts লাইন ইন্টারনেট থাকলে বাংলা ফন্ট লোড করে। এটা না থাকলে ডাউনলোড করা ছবিতে বাংলা লেখা সাধারণ ফন্টে আসবে।

## মনে রাখো

- ছবি, নাম, ঘোরা জেলা, ভাষা ও থিম ব্রাউজারের `localStorage`-এ সেভ হয় (অন্য ব্রাউজারে বা incognito-তে আলাদা থাকবে)।
- ম্যাপের আকার আসল জেলা-সীমানার তথ্য সহজ করে বানানো, তাই খুব ছোট জেলায় সামান্য পার্থক্য থাকতে পারে।
