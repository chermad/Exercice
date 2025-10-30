export async function getServices() {
  try {
    // AJOUTEZ ?populate=* pour inclure les images
    const res = await fetch(`${process.env.STRAPI_URL}/api/services?populate=*`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Strapi fetch error:', error);
    return { data: [] };
  }
}