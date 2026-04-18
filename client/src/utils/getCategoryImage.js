// import images from src/assets
import accessoriesImg from "../assets/marketplace_accessories.jpg";
import audioImg from "../assets/marketplace_audio.jpg";
import laptopImg from "../assets/marketplace_laptop.jpg";
import monitorImg from "../assets/marketplace_monitor.jpg";

export function getListingImage(listing) {
  // const normalized = category?.toLowerCase();

  const imageMap = {
    accessories: accessoriesImg,
    audio: audioImg,
    laptop: laptopImg,
    monitor: monitorImg,
  };

  const defaultImg = `https://placehold.co/400x300?text=${listing.category}`; // default placeholder image with category text

  console.log("getListingImage called with category:", listing.category);
  console.log("Returning image:", imageMap[listing.category] || defaultImg);
  // return imageMap[normalized] || defaultImg;
  return imageMap[listing.category] || defaultImg;
}
