import { createContext, useReducer } from 'react';

const CartContext = createContext({
  items: [],
  addItem: item => {},
  removeItem: id => {},
  clearCart: () => {}
});

function cartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      item => item.id === action.item.id
    );

    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    return { ...state, items: updatedItems };
  }

  if (action.type === 'REMOVE_ITEM') {
    const existingCartItemIndex = state.items.findIndex(
      item => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];
    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return { ...state, items: updatedItems };
  }

  if (action.type === 'CLEAR_CART') {
    return { ...state, items: [] };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: 'ADD_ITEM', item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', id });
  }

  function clearCart() {
    dispatchCartAction({type: 'CLEAR_CART'});
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart
  };
  console.log(cartContext);
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;

// findIndex build into JS, this method takes a function as an input
// a function that will execute on every item in this items array
// and a function that should return true if we found the the item
// we're looking for and false otherwise, and then once we
// found the item we'll automatically get the index of that item
// that's what findIndex() will return. and we'll need that
// index later to update that item. So here I want to return true if
// the ID of the item i'm currently looking at here is equal
// to the id of the item i'm receiving on my action
//  ** state.items.findIndex((items) => item.id === actions.item.id) **
// with that information we can check if existing cart item index
// is greater than minus one, b/c findIndex() will return -1 as a value
// if it did not find an item, so if index is greater than -1, we
// know that item already exist in this items exist, otherwise in the
// else case it doesn't. so in the else case, we simply want to add
// this item, this incoming action item here to this items array
// but again, not by simply pushing into state.items. (b/c we do not
// want to modify the items array until the component function finishes
// executing) instead i'll add a new constant here updatedItems where
// i'll create a new array object in memory, therefore also a new
// array object in memory, into which i spread my existing items
//     const updatedItems = [...state.items]
// with that i create a copy of that old array. it's worth noting tho
// that the items objects still will be the old items objects,
// but that won't be a problem here, b/c in the else case i can now
// use this new copy and therefore this new array object to push this
// new action item onto this array. so that's the case we didn't have
// an item in that arary yet. if we did have it in that array
// i want to update some quantity property which i expect to exist
// on every cart item. for this we can add a new updated item here
// which is a new JS object, into which i spread the properties
// of the old existing item, for that we can use the spread operator
// and then reach out to state.items for this existingCartItemIndex.
// So that will then give us that existing item in that state items
// array. and i'll take all the properties off that existing meal
// item or of that existing cart item, which is a meal item in the
// in the end tho. and i'll spread it into this new object.
// and then in addition, i'll ad a quantity property here to this
// object where i want to update the existing item quantity, and add
// one to it. so therefore again, i'll reach out to the existing item
// and then the quantity property and add one to it.
// if (existingCartItemIndex > -1) {
//    const updatedItem = {
//        ...state.items[existingCartItemIndex],
//        quantity: state.items[existingCartItemIndex].quantity + 1
//    }
// }
// and since i'm using this code twice now, we cn of course outsource it
// now and get this existingItem here, by accessing existingCartItemIndex
// on state items and then using just existingItem here and here too
// to make that code a bit more readable
// if (existingCartItemIndex > -1) {
//     const existingItem = state.items[existingCartItemIndex];
//     const updatedItem = {
//         ...existingItem,
//         quantity: existingItem.quantity + 1
//     }
// }

// of course now we have to make sure that we do have such a quantity
// property on items that'we're adding as new items to that array tho
// b/c otherwise accessing this quantity property as i'm doing it
// here will fail in the future, so therefore we need to tweak this
// code here **      updatedItems.push(action.item)
// when a new item is added, we should create a new object here,
// where we spread all the meal item data into this object, but
// where we also add a quantity property and set it to one initially,
// so that new cart items start with a quantity of one, but then if
// we update them later we continue adding one to that quantity
// ** updatedItems.push({ ...action.item, quantity: 1 }); **
// of course in that updating case we now must reinsert this
// updatedItem into our updatedItems array, so here we should go to
// updateItems[] , access the existingCartItemIndex =>
// updateItems[existingCartItemIndex]. and override the item at that
// index with the updatedItem =>
// updateItems[existingCartItemIndex] = updatedItem
// b/c it's that item at that index that we wanna update
// so we do that by overriding it with that new item. and that's
// how we can update this state in a immutable way. so without changing
// the existing state in memory. and now we went thru all these steps
// here still in that main if block of the add item check, but outside
// of this inner if check we of course want to return the updated state
// for this reducer b/c that's the main thing of this reducer, it should
// return an updated state. and for that i'll return a new object
// b/c again we don't wanna edit the existing state. and i'll spread
// my existing state data into this object. atm it's kind of
// redundant to do b/c the state only consists of an items array atm
// and it's that array which we're changing, but if we would add
// other data to that state later, it makes sense to paste that
// old unchanged data into this new state object and then just update
// the parts of the state updating. and for that here, i'll then
// override my items array with the updated items like this =>
// return { ...state, items: updatedItems };

// When removing an item we don't have to check wheter an item exists
// already or not b/c in this app we'll only be able to remove items
// if they do exist// b/c we'll only be able to reduce the amount
// of items in the shopping cart from inside that shopping cart screen
// so therefore we don't need to check if an item is part of that
// screen, but we will need to check what the quantity of that item is
// b/c if it's greater than 1, we want to reduce the quantity.
// if it's equal to 1, we want to remove the entire item from the
// shopping cart items array. so from here we'll need to grab our
// const existingCartItem .. by reaching out to the state items and
// accessing this existingCartItemIndex =>
// const existingCartItem  = state.items[existingCartItemIndex]
// and then we wanna check if this existing cart item quantity
// is equal to one. => if (existingCartItem === 1) ...
// if that's the case we want to remove the entire item from the
// shopping cart. so now i want to get my updatedItems which in the
// end should be my oldItems - thisItem here, so minus this
// existingCartItem. many ways to achieve this. one way to remove
// item is again create a copy of the old items, so create a new
// array based on the old items, and to then call the splice method
// on that array. splice takes an index, in this case the existing
// cartItemIndex, and then the number of items that should be spliced,
// which here simply means removed. so this will remove one item at
// this index which simply means it'll remove that item at that index
// so that's how we can remove an item if it's the last item in the
// in the shopping cart,
//  **  updatedItems.splice(existingCartItemIndex, 1); **
// if the quantity is greater than 1 tho, we want
// to update that quantity, and for this we'll need an updatedItem
// which is a fresh copy of the existing item, and then we need to update
// the quantity and set it equal to existingCartItem.quantity - 1.
// so that we create a new item baseed on the old item, where we reeduce
// the quantity. now we just need to update our existing items and to
// do that i'll actually move this updatedItems[...state.items]; out of that
// if block,to on top so that i can use it in both the if and also the
// else branch of this if check. and then in the else branch, i'll set
// updated items for this existing cart item index equal to my updated
// item here, which has that reduced quantity.and that's again it.
// now we just need to return that updated state.  we want to
// return a new object that copies in the old state and updates the
// items. and that's the cart logic

// now we can connect our cart logic with the help of our context here to
// our different components. using the useReducer hook , inside of this
// context provider component here correctly
// const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });
// here our cart state(cart), and a dispatch function (dispatchCartAction)
// now i want to pass my cart state to this CartContext.Provider here
// b/c that then implicitly passes it to all other wrapped components
// that are interested in that state, so for that here i'll set up my
// CartContext value object where i want to have an items property b/c
// i did that define that up there in the dummy initial value, it should
// have an items property, and those two mehtods add/remove
// const cartContext = {
//      items: cart.items
//  } and therefore of course whenever this cart state changes, this here
// (cart.items) will also change and this new context will be distributed
// to all interested components. at least once we start adding the value
// prop here to the provider component and we set that equal
// to this cart context object. now we'll distribute that value. of course
// we must make sure that the items also can get updated
// so we add the addItem(item) method and removeItem(id) method
// now dispatchCartAction and again dispatch an action object, can have
// any shape of your choice. but let's make it work with what we have
// in our reducer. for ADD_Item(), => type: 'ADD_ITEM', item.
// item property to this action object, b/c we are looking for such an item
// property in the reducer for add item.

// lnow for remove item. we use 'REMOVE_ITEM', and now we get
// id instead because that is what we expect as an input, and therefore
// i wanna forward that thru the action to the reducer. but in the moment
// in my reducer here in the remove item case, i'm looking for an
// entire item property here, but that's no problem, b/c i only need
// the id her anyways. action.item.id => action.id **
// this could work here in this syntax change. we don't need the
// full item here, unlike with addItem case b/c when removing the
// item, we just need the id to identify it. so that's therefore thes two
// actions. and those should now also be added to that cart context,
// therefore i'll move that below the actions and add the methods
// so now therefore these two fucntions are also part of this context
// obj and be accessed and triggered from other components in the app.

// now we go and wrap all components interested in the cart context with
// the provider
