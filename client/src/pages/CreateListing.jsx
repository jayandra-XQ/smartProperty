import { useState } from "react";

export default function CreateListing() {

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Upload Images to Cloudinary
  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      try {
        setUploading(true);
        setImageUploadError(false);

        const promises = [];

        for (let i = 0; i < files.length; i++) {
          const data = new FormData();
          data.append("file", files[i]);
          data.append("upload_preset", "smartProperty");
          data.append("cloud_name", "dyeicallf");

          const promise = fetch(
            "https://api.cloudinary.com/v1_1/dyeicallf/image/upload",
            {
              method: "POST",
              body: data,
            }
          )
            .then((res) => res.json())
            .then((data) => data.secure_url);

          promises.push(promise);
        }

        const urls = await Promise.all(promises);

        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(urls),
        }));

        setUploading(false);
      } catch (error) {
        setImageUploadError("Image upload failed (2 mb max per image)");
        setUploading(false);
        error && console.log(error);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-4">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            id="name"
            required
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input type="number" id="bedrooms" min="1" max="10" required />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input type="number" id="bathrooms" min="1" max="10" required />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input type="number" id="regularPrice" min="1" required />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="number" id="discountPrice" min="1" />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />

            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}