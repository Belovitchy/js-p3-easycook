import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";

interface FavoriteType {
  recipe_id: number;
  name: string;
  picture: string;
  is_favorite: boolean;
  difficulty: string;
  diet_name: string;
}

function MemberFavoriteList() {
  const { idUserOnline } = useUser();
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/member/${idUserOnline}/favorite`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token") || ""}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<FavoriteType[]>;
      })
      .then((data) => {
        setFavorites(data);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
      });
  }, [idUserOnline, favorites]);

  function handleToggleFavorite(recipeId: number, current: boolean) {
    fetch(`${import.meta.env.VITE_API_URL}/api/member/favorite/recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({
        recipeId,
        userId: idUserOnline,
        is_favorite: !current,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        // Toggle
        setFavorites((prev) =>
          prev.map((fav) =>
            fav.recipe_id === recipeId
              ? { ...fav, is_favorite: !current }
              : fav,
          ),
        );
      });
    toast.success("Favori retiré", {
      style: { background: "#452a00", color: "#fde9cc" },
    });
  }

  return (
    <section className=" flex flex-col mt-5 ml-3 md:justify-around md:flex-wrap">
      {favorites.map((fav) => (
        <div
          key={fav.recipe_id}
          className="mb-5 bg-[#f9e7cf] shadow-lg rounded-2xl p-4 border-2 border-[#e6d9be] flex flex-col items-center min-w-[260px] max-w-xs"
        >
          <h4 className="font-bold text-lg text-secondary mb-2 text-center">
            {fav.name} {fav.is_favorite}
          </h4>

          <img
            src={fav.picture}
            alt={fav.name}
            className="w-32 h-32 object-cover rounded-xl mb-3"
          />
          <div className="flex flex-wrap gap-2 justify-center text-xs text-secondary mb-2">
            {fav.difficulty && (
              <span className="bg-[#ffe2b7] rounded px-2 py-1">
                👨🏻‍🍳 {fav.difficulty}
              </span>
            )}
            {fav.diet_name && (
              <span className="bg-[#ffe2b7] rounded px-2 py-1">
                {fav.diet_name}
              </span>
            )}
            <button
              className="flex items-center space-x-1 text-primary hover:text-red-500 transition-colors font-bold"
              onClick={() =>
                handleToggleFavorite(fav.recipe_id, fav.is_favorite)
              }
              type="button"
            >
              {fav.is_favorite ? (
                <FaHeart size={20} color="red" />
              ) : (
                <FaRegHeart size={20} color="red" />
              )}
              ,
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default MemberFavoriteList;
