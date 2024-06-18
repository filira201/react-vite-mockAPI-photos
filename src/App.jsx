import { useState } from "react";
import Collection from "./components/Collection";
import { useEffect } from "react";

const categories = [
  { name: "Все" },
  { name: "Море" },
  { name: "Горы" },
  { name: "Архитектура" },
  { name: "Города" },
];

function App() {
  const [collections, setCollections] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);

    const category = categoryId !== 0 ? `category=${categoryId}` : "";

    let controller = new AbortController();

    fetch(
      `https://667165bae083e62ee43b6d01.mockapi.io/photos?page=${page}&limit=3&${category}`,
      { signal: controller.signal }
    )
      .then((response) => response.json())
      .then((json) => setCollections(json))
      .catch((err) => {
        alert("Не удалось получить данные");
        throw Error(err);
      })
      .finally(() => setIsLoading(false));

    return () => {
      controller.abort();
    };
  }, [categoryId, page]);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((category, index) => (
            <li
              onClick={() => {
                setCategoryId(index)
                setPage(1);
              }}
              className={categoryId === index ? "active" : ""}
              key={index}
            >
              {category.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Идет загрузка...</h2>
        ) : (
          collections
            .filter((collection) =>
              collection.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((collection, index) => {
              return (
                <Collection
                  key={index}
                  name={collection.name}
                  images={collection.photos}
                />
              );
            })
        )}
      </div>
      <ul className="pagination">
        {[...Array(5)].map((el, index) => (
          <li
            onClick={() => setPage(index + 1)}
            className={page === index + 1 ? "active" : ""}
            key={index}
          >
            {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
