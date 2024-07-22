export async function uploadImage(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

  const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
    method: "POST",
    body: data,
  });
  const rfile = await res.json();

  return rfile.url;
}
