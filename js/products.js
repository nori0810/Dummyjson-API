
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("商品データの取得に失敗しました");
    }

    const data = await response.json();

    console.log("取得件数:", data.products.length);
    console.log("全商品数:", data.total);

    return data.products.map(product => ({
      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.thumbnail,
      category: product.category,
      brand: product.brand,
      rating: product.rating
    }));

  } catch (error) {
    console.error(error);
    return [];
  }
}
