/* ==============================
   オリジナル商品
============================== */

const originalProducts = [
  {
    id: 1001,
    title: "オリジナルサングラス",
    description: "シンプルサングラス",
    price: 999,
    thumbnail: "images/dummy-image.png",
    category: "sunglasses",
    brand: "Original",
    rating: 4.5
  },
  {
    id: 1002,
    title: "オリジナルTシャツ",
    description: "着心地の良いTシャツです。",
    price: 999,
    thumbnail: "images/dummy-image.png",
    category: "tops",
    brand: "Original",
    rating: 4.8
  },
  {
    id:189,
    title:"dummy",
    description:"dummyAdd",    /*機能の説明的存在*/
    category:"dummy photo",
    price:"29",
    discountPercentage:25      /*割引*/ 

  }
];


/* ==============================
   複数カテゴリのAPI URL
============================== */

const API_URLS = [
  "https://dummyjson.com/products/category/sunglassbes?limit=20",
  "https://dummyjson.com/products/category/tops?limit=20",
  "https://dummyjson.com/products/category/mens-shirts?limit=20"
];


/* ==============================
   商品データを取得する
============================== */

async function fetchProducts() {

  try {

    // 複数のAPIから同時に商品を取得
    const responses = await Promise.all(
      API_URLS.map(url => fetch(url))
    );

    // APIエラーの確認
    if (responses.some(response => !response.ok)) {
      throw new Error("商品データの取得に失敗しました");
    }

    // JSONデータに変換
    const results = await Promise.all(
      responses.map(response => response.json())
    );

    // 各カテゴリの取得件数を確認
    results.forEach((data, index) => {

      console.log(
        `カテゴリ${index + 1}の取得件数:`,
        data.products.length
      );

    });


    // APIから取得した商品をまとめる
    const apiProducts = results.flatMap(
      data => data.products
    );


    // API商品とオリジナル商品を結合
    const allProducts = [
      ...apiProducts,
      ...originalProducts
    ];


    // 重複商品を削除
    const uniqueProducts = [
      ...new Map(
        allProducts.map(product => [
          product.id,
          product
        ])
      ).values()
    ];


    // API商品から18件取得
    const apiSelectedProducts = uniqueProducts
      .filter(product =>
        !originalProducts.some(
          original => original.id === product.id
        )
      )
      .slice(0, 18);


    // オリジナル商品を追加
    const selectedProducts = [
      ...apiSelectedProducts,
      ...originalProducts
    ];


    // 取得結果を確認
    console.log("API取得件数:", apiProducts.length);

    console.log("合計取得件数:", allProducts.length);

    console.log("重複削除後の商品数:", uniqueProducts.length);

    console.log("最終取得件数:", selectedProducts.length);

    console.log("取得データ:", selectedProducts);


    // 商品データを整理
    return selectedProducts.map(product => ({

      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.thumbnail,
      category: product.category,
      brand: product.brand,
      rating: product.rating,
discountPercentage:product.discountPercentage
    }));


  } catch (error) {

    console.error("商品取得エラー:", error);

    return [];

  }

}


/* ==============================
   商品一覧を画面に表示する
============================== */

async function displayProducts() {

  const products = await fetchProducts();

  const list = document.querySelector("#list");


  // 商品一覧の場所があるか確認
  if (!list) {

    console.error("#list が見つかりません");

    return;

  }


  // 一覧を初期化
  list.replaceChildren();


  // 商品が取得できなかった場合
  if (products.length === 0) {

    list.textContent = "商品を取得できませんでした。";

    return;

  }


  console.log(
    "画面に表示する商品数:",
    products.length
  );


  // 商品を1件ずつ表示
  products.forEach(product => {

    // 商品カード
    const card = document.createElement("article");

    card.className = "card";


    // 商品詳細へのリンク
    const link = document.createElement("a");

    link.href = `product.html?id=${product.id}`;


    // 商品画像
    const image = document.createElement("img");

    image.src = product.image;

    image.alt = product.name;

    image.loading = "lazy";


    // 商品名
    const name = document.createElement("h3");

    name.textContent = product.name;


    // 商品価格
    const price = document.createElement("p");

    price.className = "price";


    const dollar = document.createElement("span");

    dollar.className = "dollar";


    dollar.textContent =
      `￥${Math.round(product.price * 150).toLocaleString("ja-JP")}`;


    // 商品カードを組み立てる
    link.append(image, name);

    price.append(dollar);

    card.append(link, price);


    // 商品一覧に追加
    list.append(card);

  });

}


/* ==============================
   商品一覧を実行
============================== */

displayProducts();
