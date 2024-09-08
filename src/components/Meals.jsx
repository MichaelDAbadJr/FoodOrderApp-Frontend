import MealItem from './MealItem';
import useHttp from '../hooks/useHttp';
import Error from './Error';
// create this here outside the component and pass to 
// useHttp to avoid an infinite loop by only creating
// it once and not infinitely creating it causing 
// infinite loop 
const requestConfig = {};

export default function Meals() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { data: loadedMeals, isLoading, error } = useHttp(backendUrl, requestConfig, []);

  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error}/>
  }

  return (
    <ul id="meals">
      {loadedMeals.map(meal => (
        <MealItem key={meal.id} meal={meal}></MealItem>
      ))}
    </ul>
  );
}

// update after building custom useHttp.js hook
// here now we delete the useEffect and replace
// with the custom hook

// so we don't get error on loading and then do
// an if check if isLoading is truthy

// we pass the url, an empty obj for config, but then
// pass an empty array of meals as initial data for
// the loadedMeals b/c that's what we had b4, a
// thiss will make sure that when this renders for
// the first time, we won't outpout any items here
// but we also won't fail.
// this below is alternative
// if(!data) {
//   return <p>No meals found.</p>
// }
