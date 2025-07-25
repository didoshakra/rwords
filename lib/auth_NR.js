// /lib/auth.js
// /lib/auth.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * Отримати сесію користувача на сервері
 */
export function getAuthSession() {
  return getServerSession(authOptions);
}