import { useContext } from 'react';

import { currencyFormatter } from '../util/formatting';
import Button from './UI/Button';
import CartContext from '../store/CartContext';

function MealItem({ meal }) {
  const cartCtx = useContext(CartContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_ASSETS;
  function handleAddMealToCart() {
    cartCtx.addItem(meal);
  }
  return (
    <li className="meal-item">
      <article>
        <img src={`${backendUrl}/${meal.image}`} alt={meal.name} />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-price">
            {currencyFormatter.format(meal.price)}
          </p>
          <p className="meal-item-descriptsion">{meal.description}</p>
        </div>
        <p className="meal-item-actions">
          <Button onClick={handleAddMealToCart}>Add to Cart</Button>
        </p>
      </article>
    </li>
  );
}

export default MealItem;

// i want to add an item to a cart whenever the button is clicked
// to do that, we
