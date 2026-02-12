 import type { PageServerLoad } from './$types';

  export const load: PageServerLoad = async ({ fetch }) => {
      try {
          const res = await fetch('/api/event/');
          if (res.ok) {
              const data = await res.json();
              return { event: data.docs };
          }
      } catch {
          // Payload may not be running
      }
      return { event: [] };
  };