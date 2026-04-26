# ♻ Junk-to-Gem — Community Exchange

> A sustainability-focused web app for students to **donate** and **request** reusable items instead of throwing them away.  
> Aligned with **UN SDG 12.5 – Reduce Waste Through Reuse**.

---

## 🌍 Features

- **Browse listings** – filter by category (Books, Plastic, Paper, Misc), type (Donate / Request), and search by keyword or location
- **Add a listing** – donate or request items with name, description, category, location, image upload, and WhatsApp number
- **Contact via WhatsApp** – one-tap messaging with a pre-filled message
- **Status tracking** – mark items as "Available" or "Picked Up"
- **Profile page** – save your name & WhatsApp number; view and manage your own listings
- **localStorage persistence** – all data survives page refreshes, no backend needed

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| State | Custom hook + localStorage |
| Styling | Vanilla CSS (design system with CSS variables) |
| Fonts | Inter + Outfit (Google Fonts) |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

### Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx / .css
│   ├── ListingCard.jsx / .css
│   └── FilterBar.jsx / .css
├── context/
│   └── StoreContext.jsx
├── data/
│   └── mockData.js        # Seed listings
├── pages/
│   ├── Home.jsx / .css
│   ├── AddListing.jsx / .css
│   └── Profile.jsx / .css
├── store/
│   └── useStore.js        # localStorage state
├── App.jsx / App.css
├── main.jsx
└── index.css              # Global design system
```

---

## 🎨 Design

- **Color palette**: Earth greens (`#2D6A4F`, `#52B788`, `#95D5B2`) + warm ambers
- **Typography**: Outfit (headings) + Inter (body)
- **Animations**: Fade-in, slide-up, hover lift, blob pulses
- **Responsive**: Mobile-first, works on all screen sizes

---

## 🤝 Contributing

Pull requests welcome! This is a student mini-project — feel free to fork and extend it.

---

*Made with 💚 for sustainability*
