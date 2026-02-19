 import type { PageServerLoad } from './$types';

  const BASE_URL = import.meta.env.VITE_PAYLOAD_URL || '';

  export const load: PageServerLoad = async ({ fetch }) => {
      try {
          const res = await fetch(`${BASE_URL}/api/posts?limit=10&sort=-createdAt`);
          if (res.ok) {
              const data = await res.json();
              return { posts: data.docs };
          }
      } catch {
          // Payload may not be running
      }
      return { posts: [] };
  };