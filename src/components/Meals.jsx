import { useState, useEffect } from 'react';
import MealItem from './MealItem';

export default function Meals() {
  const [loadedMeals, setLoadedMeals] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch(backendUrl);
        // console.log(backendUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const meals = await response.json();
        setLoadedMeals(meals);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    }

    fetchMeals();
  }, []);

  return (
    <ul id="meals">
      {loadedMeals.map(meal => (
        <MealItem key={meal.id} meal={meal}></MealItem>
      ))}
    </ul>
  );
}
