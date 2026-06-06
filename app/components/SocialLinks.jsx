// components/SocialLinks.jsx
import { SOCIAL_LINKS } from "@/lib/socialLinks"

const SocialLinks = ({
  size = "md", // "sm" | "md" | "lg"
  ids, // які соцмережі показувати (undefined = всі)
  className = "", // клас на <ul>
  itemClassName = "", // клас на кожен <li>
}) => {
  const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-6 w-6" }
  const iconCls = `${sizeMap[size]} dark:hover:text-hOnHovD`

  const links = ids ? SOCIAL_LINKS.filter((l) => ids.includes(l.id)) : SOCIAL_LINKS

  return (
    <ul className={`flex items-center space-x-1 ${className}`}>
      {links.map((link) => (
        <li key={link.id} className={itemClassName}>
          <a
            href={link.href}
            title={link.title}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-hOnHov dark:hover:text-hOnHovD"
          >
            {link.icon(iconCls)}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default SocialLinks
