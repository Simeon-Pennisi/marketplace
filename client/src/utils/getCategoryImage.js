// import images from src/assets
import accessoriesImg from "../assets/marketplace_accessories.jpg";
import audioImg from "../assets/marketplace_audio.jpg";
import laptopImg from "../assets/marketplace_laptop.jpg";
import monitorImg from "../assets/marketplace_monitor.jpg";

export function getCategoryImage(category) {
  const normalized = category?.toLowerCase();

  const imageMap = {
    accessories: accessoriesImg,
    audio: audioImg,
    laptop: laptopImg,
    monitor: monitorImg,
  };

  return imageMap[normalized] || defaultImg;
}
