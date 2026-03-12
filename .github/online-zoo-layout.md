# Online Zoo — Point Checklist (max 435 pts)

> **Figma:** [Online-ZOO-Project](https://www.figma.com/file/lnK11foY8Aoa6oOlDXovVN/Online-ZOO-Project?node-id=0%3A1)  
> **Tech:** Vanilla JS, SCSS, Vite — no frameworks, no TS, no jQuery, no Swiper.  
> **Breakpoints:** 1920 / 1200 / 640 / 320 px. ±10 px deviation allowed.  
> **"Interactive"** = `:hover` with `cursor: pointer`, colour/bg change, underline — CSS only, no JS required.  
> **Penalties:** Layout via images **–90 pts** | Forbidden libs/frameworks **–90 pts**

---

## Validation & Global — 20 pts

- [ ] Valid HTML (W3C) — **+4 per page**, warnings only **+2**, errors **0** (×4 pages = max 16)
- [ ] Favicon on all pages — **+2**
- [ ] Semantic structure (`<header>`, `<main>`, `<section>`, `<footer>`) — **+2**

---

## Landing Page — 104 pts

**Responsive (16):** smooth adaptation +10 | no overlaps +4 | no horizontal scroll +2

**Header (10):** logo left +2 | `ABOUT` highlighted by default, nav navigates +2 | social icons interactive +2 | `<h1>` present +2 | header NOT sticky +2

**WATCH YOUR FAVORITE ANIMAL ONLINE (7):** `VIEW LIVE CAM` interactive +2 | hero background is a CSS `background-image` +5

**WELCOME / HOW WE WORK (10):** images correctly positioned relative to text +10

**YOUR DONATION MAKES A DIFFERENCE (7):** `$ DONATION AMOUNT` interactive +2 | all elements present +5

**MEET SOME OF OUR PETS (18):** `<` / `>` slider buttons functional +4 | animal cards interactive + navigate to zoo page +10 | `VIEW LIVE CAM` inside card interactive +2 | `CHOOSE YOUR FAVORITE` interactive +2

**PAY AND FEED (7):** `DONATE NOW` interactive +2 | all elements present +5

**WHAT OUR USERS THINK (10):** `<` / `>` buttons interactive +4 | `LEAVE FEEDBACK` interactive +2 | all elements present +4

**CARE FOR THE ANIMALS YOU LOVE (9):** plain images NOT interactive +2 | animal cards interactive + link to zoo +5 | `CHOOSE YOUR FAVORITE` interactive +2

**Footer (10):** nav interactive, NO default highlight, navigates +4 | `DONATE FOR VOLUNTEERS` interactive +2 | social icons interactive +4

---

## Map Page — 56 pts

**Responsive (16):** same as landing

**Header (10):** logo left +2 | `MAP` highlighted by default +2 | social icons interactive +2 | `<h1>` +2 | NOT sticky +2

**MAP section (20):** animal icons correctly positioned on map +10 | map non-scalable (no interactive zoom) +10

**Footer (10):** same as landing footer

---

## Zoos / Animal Page — 133 pts (103 base + up to +30)

**Responsive (16):** same as landing

**Header (10):** logo left +2 | `ZOOS` highlighted +2 | social icons +2 | `<h1>` +2 | NOT sticky +2

**LIVE CAMS section (48):**
- Left nav panel present +2
- Expanded state (icon + text) +2 | collapsed state (icon only) +2
- Toggle expand/collapse control +4
- Selected animal highlighted in both states +4
- Click animal → update highlight +4 AND change active animal on page +4
- Nav panel `position: sticky` on scroll +2
- `DONATE NOW` interactive +2
- Main video: YouTube embed OR click → YouTube +2
- MORE LIVE VIEWS block below main video +2
- Carousel previews: YouTube embed OR click → YouTube +4
- Carousel `<` / `>` interactive +4
- Selected carousel preview visually highlighted +2

**PAY AND FEED (7):** `$ DONATION AMOUNT` interactive +2 | all elements +5

**DID YOU KNOW? (12):** card shadow via `box-shadow` +2 | `VIEW MAP` interactive +2 | all elements +8

**Footer (10):** same as landing footer

**Extra animal pages:** +10 per additional animal, max +30 (implement 3 more animals)

---

## Contact Us — 62 pts

**Responsive (16):** same as landing

**Header (10):** logo left +2 | `CONTACT US` highlighted +2 | social icons +2 | `<h1>` +2 | NOT sticky +2

**GET IN TOUCH form (26):** fields `Your Name`, `Your Email Address`, `Subject`, `Message` present and matching design +20 | required fields marked with `*` +2 | placeholders on all fields +2 | `SEND MESSAGE` interactive +2

**Footer (10):** same as landing footer

---

## Popup "TOGETHER WE CARE, SAVE AND PROTECT!" — 20 pts

- Centered overlay above content +2 | scroll disabled on `<body>` +2 | background dimmed +2 | responsive +4
- Layout matches design (image, title, text, buttons) +4 | `×` positioned per design +2
- Amount buttons interactive (hover + cursor) +2 | `×` closes popup +2

---

## Popup "MAKE YOUR DONATION" Steps 1–3 — 40 pts

**Step 1 (22):** centered +2 | scroll disabled +2 | dimmed +2 | responsive +2 | layout matches +4 | buttons interactive +4 | `FOR SPECIAL PET` dropdown opens/closes, selected item highlighted +4 | step indicator updates +2

**Step 2 (9):** centered +1 | scroll disabled +1 | overlay unchanged +1 | responsive +1 | layout matches +2 | required fields marked `*` +1 | buttons interactive +2

**Step 3 (9):** same as step 2 — centered +1 | scroll disabled +1 | overlay unchanged +1 | responsive +1 | layout matches +2 | `*` fields +1 | buttons interactive +2
