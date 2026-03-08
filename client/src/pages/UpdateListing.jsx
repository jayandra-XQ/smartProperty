import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const navigate = useNavigate();
  const params = useParams();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // fetch listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();


        if (data.success === false) {
          setError(true);
          return;
        }

        setFormData(data);
      } catch (error) {
        setError(true);
        console.error("Failed to fetch listing", error);
      }
    };

    fetchListing();
  }, [params.listingId]);

  // upload images to cloudinary
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
        setImageUploadError("Image upload failed (max 2MB each)");
        setUploading(false);
        error("Image upload failed", error);
      }
    } else {
      setImageUploadError("You can upload max 6 images");
      setUploading(false);
    }
  };

  // remove image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // form input change
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError("Something went wrong");
      setLoading(false);
      error("Failed to update listing", error);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left Column */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            placeholder="Description"
            id="description"
            className="border p-3 rounded-lg"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Address"
            id="address"
            className="border p-3 rounded-lg"
            value={formData.address}
            onChange={handleChange}
            required
          />

          {/* Checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="sale"
                className="w-5 h-5"
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="rent"
                className="w-5 h-5"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="parking"
                className="w-5 h-5"
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 h-5"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                className="w-5 h-5"
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Beds / Baths */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                className="border p-3 rounded-lg w-20"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
              <span>Beds</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                className="border p-3 rounded-lg w-20"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
              <span>Baths</span>
            </div>
          </div>

          {/* Prices */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                className="border p-3 rounded-lg w-32"
                value={formData.regularPrice}
                onChange={handleChange}
                required
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                {formData.type === "rent" && (
                  <span className="text-xs text-gray-500">($ / month)</span>
                )}
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  className="border p-3 rounded-lg w-32"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-col items-center">
                  <span>Discounted Price</span>
                  {formData.type === "rent" && (
                    <span className="text-xs text-gray-500">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center rounded-lg"
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

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update listing"}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}