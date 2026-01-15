import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        status: "error",
        message: "No image provided",
      });
    }

    // Upload base64 image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "iiuc-lost-found",
      resource_type: "image",
      quality: "auto:best",
    });

    res.json({
      status: "success",
      message: "Image uploaded successfully",
      data: { url: result.secure_url },
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to upload image",
    });
  }
};
