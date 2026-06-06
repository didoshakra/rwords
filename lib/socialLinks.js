// lib/socialLinks.js
export const SOCIAL_LINKS = [
  {
    id: "github",
    href: "https://github.com/didoshakra?tab=repositories",
    title: "GitHub",
    icon: (cls) => (
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/profile.php?id=100004339204236",
    title: "Facebook",
    icon: (cls) => (
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/didoshakr",
    title: "Instagram",
    icon: (cls) => (
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: "youtube",
    href: "https://www.youtube.com/@RA-Animations/",
    title: "YouTube",
    icon: (cls) => (
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="10 15 15 12 10 9 10 15" />
      </svg>
    ),
  },
  {
    id: "telegram",
    href: "https://web.telegram.org/a/#-1003658046778/",
    title: "Telegram",
    icon: (cls) => (
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    href: "https://www.tiktok.com/@ikkar_animation",
    title: "TikTok",
    icon: (cls) => (
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 17a3 3 0 1 0 3 3V4" />
        <path d="M12 4c1 2 3 4 6 4" />
      </svg>
    ),
  },
  {
    id: "x",
    href: "https://x.com/RDidosak",
    title: "Х/Twitter",
    icon: (cls) => (
      <svg className={cls} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" fill="currentColor">
        <path d="M714.175 541.805 1182.5 0H1074.63L659.345 474.098 328.172 0H0l491.765 704.608L0 1227h107.872l436.93-493.422L888.979 1227H1217.15L714.175 541.805Zm-154.755 174.6-50.686-72.424L147.333 88.27h134.202l275.493 393.501 50.685 72.424 388.598 555.189H861.715L559.42 716.405Z" />
      </svg>
    ),
  },
]