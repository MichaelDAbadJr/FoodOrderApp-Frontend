import {useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({children, open, className=''}) {
    const dialogRef = useRef();

    useEffect(() => {
      const modal = dialogRef.current;
        if(open) {
          modal.showModal();
        }

        return () => modal.close();
    }, [])

  return createPortal(
    <dialog ref={dialogRef} className={`modal ${className}`}>{children}</dialog>,
    document.getElementById('modal')
  );
}

// dialog elem when opened programmatically, so not by setting open
// prop, automatically displays a backdrop. so that's why open prop 
// will not be used. so instead open it programmatically. one way is 
// to use a forwardRef here, so that we can expose some
// functions from our custom components here to other components
// to other components, and those other components could then call
// those functions to, for example, open or close this dialogue,
// while that would work. let's use useEffect instead. to in the end,
// interact with that native dialogue element whenever the open prop
// value changes. so i'll pass open as a dependency to this 
// dependencies array so that this effect function will rerun whenever
// open changes, and then in this effect function. i'll check if 
// open is true. and if it is true, i'll open it . to do this, i'll 
// need access to the dialogue element. and we can do that with the
// help of refs. and add the ref prop referencing the dialogRef to the 
// dialogue element. now inside of the efffect function, inside of
// the if block, and only if open is truthy, we can use this 
// dialogRef to call showModal. now add className prop of 'modal' to the
// dialgoue element. and i wanna make sure that this modal component
// can also be styled from outside this component. so that other
// components can also set a className prop on this modal component
// and this value is then merged with this modal class that should
// always be applied. and this can be achieved by setting className to a
// dynamic value. which in the end is a template literal string