export const updatePageMeta = (meta: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}) => {
  // Update document title
  if (meta.title) {
    document.title = `${meta.title} | CaloFeed`;
  }

  // Update or create meta tags
  const updateMetaTag = (property: string, content: string) => {
    let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const updateMetaName = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Basic meta tags
  if (meta.description) {
    updateMetaName('description', meta.description);
  }

  // Open Graph tags
  if (meta.title) {
    updateMetaTag('og:title', meta.title);
  }
  if (meta.description) {
    updateMetaTag('og:description', meta.description);
  }
  if (meta.image) {
    updateMetaTag('og:image', meta.image);
  }
  if (meta.url) {
    updateMetaTag('og:url', meta.url);
  }
  updateMetaTag('og:type', meta.type || 'website');
  updateMetaTag('og:site_name', 'CaloFeed');

  // Twitter Card tags
  updateMetaName('twitter:card', 'summary_large_image');
  if (meta.title) {
    updateMetaName('twitter:title', meta.title);
  }
  if (meta.description) {
    updateMetaName('twitter:description', meta.description);
  }
  if (meta.image) {
    updateMetaName('twitter:image', meta.image);
  }
};

export const generateMealShareMeta = (meal: any) => {
  return {
    title: `${meal.user.displayName}'s ${meal.mealType}`,
    description: `${meal.description} - ${meal.calories} calories, ${meal.protein}g protein`,
    image: meal.image,
    url: `${window.location.origin}/meal/${meal.id}`,
    type: 'article'
  };
};

export const generateProfileShareMeta = (user: any) => {
  return {
    title: `${user.displayName} (@${user.username})`,
    description: `${user.bio} - ${user.followers} followers, ${user.streak} day streak`,
    image: user.avatar,
    url: `${window.location.origin}/profile/${user.username}`,
    type: 'profile'
  };
};