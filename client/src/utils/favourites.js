// Get all saved listing IDs
export const getFavourites = () => {
  return JSON.parse(localStorage.getItem('favourites') || '[]');
};

// Check if a listing is saved
export const isFavourite = (id) => {
  return getFavourites().includes(id);
};

// Toggle save/unsave 
export const toggleFavourite = (id) => {
  const current = getFavourites();
  if (current.includes(id)) {
    localStorage.setItem('favourites', JSON.stringify(current.filter(f => f !== id)));
    return false;
  } else {
    localStorage.setItem('favourites', JSON.stringify([id, ...current]));
    return true;
  }
};