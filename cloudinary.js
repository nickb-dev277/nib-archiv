// ─────────────────────────────────────
// Cloudinary / Bilder
// ─────────────────────────────────────

export async function sha1Hex(text) {

  const data =
    new TextEncoder().encode(text);

  const hash =
    await crypto.subtle.digest(
      "SHA-1",
      data
    );

  return [...new Uint8Array(hash)]
    .map(byte =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
}


export async function uploadToCloudinary(
  file,
  env
) {

  if (!file || !file.size) {
    return null;
  }


  if (!env.CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME fehlt."
    );
  }


  if (!env.CLOUDINARY_API_KEY) {
    throw new Error(
      "CLOUDINARY_API_KEY fehlt."
    );
  }


  if (!env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "CLOUDINARY_API_SECRET fehlt."
    );
  }


  const timestamp =
    Math.floor(Date.now() / 1000);


  const folder =
    "nib-archiv";


  const paramsToSign =
    `folder=${folder}&timestamp=${timestamp}`;


  const signature =
    await sha1Hex(
      paramsToSign +
      env.CLOUDINARY_API_SECRET
    );


  const uploadUrl =
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      env.CLOUDINARY_CLOUD_NAME
    )}/image/upload`;


  const body =
    new FormData();

  body.append(
    "file",
    file,
    file.name || "image"
  );

  body.append(
    "api_key",
    env.CLOUDINARY_API_KEY
  );

  body.append(
    "timestamp",
    String(timestamp)
  );

  body.append(
    "signature",
    signature
  );

  body.append(
    "folder",
    folder
  );


  const response =
    await fetch(
      uploadUrl,
      {
        method: "POST",
        body
      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Cloudinary-Upload fehlgeschlagen: ${errorText}`
    );
  }


  const result =
    await response.json();


  return {
    url: result.secure_url,
    public_id: result.public_id,
    filename: file.name || "image"
  };
}


// ─────────────────────────────────────────────────────────────────────


export async function deleteFromCloudinary(publicId, env) {
  if (!publicId || !env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) return false;
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
  const signature = await sha1Hex(paramsToSign + env.CLOUDINARY_API_SECRET);
  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)}/image/destroy`;
  const body = new FormData();
  body.append("public_id", publicId); body.append("timestamp", String(timestamp)); body.append("api_key", env.CLOUDINARY_API_KEY); body.append("signature", signature);
  const response = await fetch(url,{method:"POST",body});
  return response.ok;
}
