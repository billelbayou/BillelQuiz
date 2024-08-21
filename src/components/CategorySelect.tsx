import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/lightbulb.png";

interface Category {
  id: number;
  name: string;
}

export default function CategorySelect() {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const apiData = await response.json();
        setCategoryData(apiData.trivia_categories);
        setLoading(false);
      } catch (err) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(Number(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selected !== null) {
      navigate(`/questions/${selected}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#EFF0F3] w-full h-screen flex justify-center items-center">
        <FontAwesomeIcon icon={faCircleNotch} spin className="text-4xl" />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="w-full h-screen bg-[#EFF0F3] py-28">
      <div className="flex flex-col items-center justify-center mb-8">
        <img src={logo} alt="" className="w-44 mb-10" />
        <h1 className="font-bold text-4xl">Billel Quiz</h1>
        <p className="text-lg mt-4">Challenge. Answer. Repeat</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center"
      >
        <div className="m-10 flex flex-wrap justify-center">
          <label htmlFor="categories" className="text-2xl font-semibold mr-2 mb-5 sm:mb-0">
            Choose a category:
          </label>
          <select
            className="w-fit py-2 px-4 bg-[#ABD1C6] rounded-xl shadow-lg"
            name="categories"
            id="categories"
            onChange={handleSelectChange}
            value={selected !== null ? selected : ""}
          >
            <option value="" disabled className="bg-[#ABD1C6]">
              Select a category
            </option>
            {categoryData.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="bg-[#ABD1C6]"
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#ABD1C6] text-2xl font-bold w-40 py-2 px-4 border rounded-xl"
        >
          Play
        </button>
      </form>
    </main>
  );
}
