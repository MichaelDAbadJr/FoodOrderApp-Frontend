import { useContext } from 'react';

import Button from './UI/Button';
import logoImg from '../assets/logo.jpg';
import CartContext from '../store/CartContext';
import UserProgressContext from '../store/UserProgressContext';

export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  function handleShowCart() {
    userProgressCtx.showCart();
  }
  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="a restaurant" />
        <h1>ReactFood</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems})</Button>
      </nav>
    </header>
  );
}

// reduce method. buld in method that allows us to reduce an array
// to a single value to a single number. it takes a function as
// 1st arg , and a starting value = 0 as a 2nd arg. and that fnction
// which we pass as a 1st arg, then itself gets two args, passed
// automatically by JS. which is the new value we want to derive
// (totalNumberOfItems), and then after 2nd arg is every item of
// the array on which we call reduce. step by step, item by item, b/c
// this function will be executed once for every item in that item's
// array, and then we must return a new upddated value. that will be
// extend this updated value that will be fed into the next function
// execution as a value for total number of items. and this allows us
// add up all these different values. and that zero is just the starting
// value for the 1st execution of this function for the 1st item. so
// here i want to return totalNumberOfItems + item quantity to add
// all the quantities
