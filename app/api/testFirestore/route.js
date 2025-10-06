import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return Response.json(products);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, "products"), body);
    return Response.json({ id: docRef.id });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

