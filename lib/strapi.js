export async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services?populate=*`, {
      cache: 'no-store' // ← DÉSACTIVE LE CACHE
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Strapi fetch error:', error);
    return { data: [] };
  }
}