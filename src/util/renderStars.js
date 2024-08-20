export const renderStars = (rating) => {
  let stars = '';
  if (rating >= 0 && rating < 0.5) {
    stars = '☆';
  } else if (rating >= 0.5 && rating < 1.25) {
    stars = '★';
  } else if (rating >= 1.25 && rating < 1.75) {
    stars = '★☆';
  } else if (rating >= 1.75 && rating < 2.25) {
    stars = '★★';
  } else if (rating >= 2.25 && rating < 2.75) {
    stars = '★★☆';
  } else if (rating >= 2.75 && rating < 3.25) {
    stars = '★★★';
  } else if (rating >= 3.25 && rating < 3.75) {
    stars = '★★★☆';
  } else if (rating >= 3.75 && rating < 4.25) {
    stars = '★★★★';
  } else if (rating >= 4.25 && rating < 4.75) {
    stars = '★★★★☆';
  } else if (rating >= 4.75 && rating <= 5) {
    stars = '★★★★★';
  }
  return stars;
};